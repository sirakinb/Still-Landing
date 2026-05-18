import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type ToolTask = {
  slug: string;
  title: string;
  url: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  features: string[];
};

type ToolCronState = {
  completed: Record<string, { completedAt: string; branch: string }>;
};

const queuePath = path.resolve("scripts/seo-ops/tool-build-queue.json");
const stateDir = path.resolve("seo-ops-data/tool-cron");
const statePath = path.join(stateDir, "state.json");
const envPath = path.join(stateDir, "current-task.env");
const promptPath = path.join(stateDir, "current-prompt.md");

function readState(): ToolCronState {
  if (!existsSync(statePath)) return { completed: {} };
  return JSON.parse(readFileSync(statePath, "utf8"));
}

function writeState(state: ToolCronState) {
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function shellValue(value: string) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function writeNoTask() {
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(envPath, "HAS_TASK=0\n");
}

function writeTask(task: ToolTask) {
  mkdirSync(stateDir, { recursive: true });
  const branch = `seo-tool/${task.slug}`;
  const prompt = `Build the next Still SEO tool page.

Tool:
- Title: ${task.title}
- URL: ${task.url}
- Primary keyword: ${task.primaryKeyword}
- Supporting keywords: ${task.supportingKeywords.join(", ")}
- Required features: ${task.features.join("; ")}

Context:
- Follow the existing React/Wouter/Vite patterns in this repo.
- Use the existing /tools/meditation-music-generator page as the closest visual and SEO reference, but make the new tool genuinely useful rather than a copy.
- Add the route in client/src/App.tsx.
- Add a statically generated route, metadata, sitemap entry, breadcrumbs, and appropriate schema in script/build.ts.
- Add homepage/tool navigation links where they make sense without cluttering the header.
- Include one clear interactive tool above the fold.
- Include useful supporting copy below the tool, approximately 600-1,200 words.
- Include 4-8 FAQs.
- Add SoftwareApplication, FAQPage, and BreadcrumbList schema where appropriate.
- Add App Store CTA after meaningful tool interaction.
- Add lightweight GA4 events if the project has an analytics helper; if no helper exists, create a small safe browser-only helper and use it for tool start/completion/App Store clicks.
- Keep edits scoped to this tool and shared helpers needed by this tool.
- Do not commit, push, or create a PR. The cron runner will do that after verification.

Verification required before you stop:
- npm run check
- npm run build
`;

  writeFileSync(promptPath, prompt);
  writeFileSync(envPath, [
    "HAS_TASK=1",
    `SLUG=${shellValue(task.slug)}`,
    `TITLE=${shellValue(task.title)}`,
    `URL_PATH=${shellValue(task.url)}`,
    `BRANCH=${shellValue(branch)}`,
    `PROMPT_FILE=${shellValue(promptPath)}`,
  ].join("\n") + "\n");
}

function complete(slug: string, branch: string) {
  const state = readState();
  state.completed[slug] = {
    completedAt: new Date().toISOString(),
    branch,
  };
  writeState(state);
}

const [command, slug, branch] = process.argv.slice(2);
if (command === "--complete") {
  if (!slug || !branch) throw new Error("Usage: prepare-tool-build-task.ts --complete <slug> <branch>");
  complete(slug, branch);
  process.exit(0);
}

const queue = JSON.parse(readFileSync(queuePath, "utf8")) as ToolTask[];
const state = readState();
const nextTask = queue.find((task) => !state.completed[task.slug]);

if (!nextTask) {
  writeNoTask();
  process.exit(0);
}

writeTask(nextTask);
