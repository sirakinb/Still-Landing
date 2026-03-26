import fs from "fs";
import path from "path";

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  readingTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const CONTENT_DIR = path.resolve(process.cwd(), "content/blog");

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const yamlLines = match[1].split("\n");
  const meta: Record<string, any> = {};

  for (const line of yamlLines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: any = line.slice(colonIdx + 1).trim();

    // Parse arrays: ["a", "b", "c"]
    if (value.startsWith("[")) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        value = value.slice(1, -1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, ""));
      }
    }
    // Parse numbers
    else if (/^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }

    meta[key] = value;
  }

  return { meta, content: match[2].trim() };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts: BlogPostMeta[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { meta } = parseFrontmatter(raw);
    posts.push({
      slug: meta.slug || file.replace(".md", ""),
      title: meta.title || "",
      date: meta.date || "",
      description: meta.description || "",
      keywords: meta.keywords || [],
      readingTime: meta.readingTime || 5,
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);

  return {
    slug: meta.slug || slug,
    title: meta.title || "",
    date: meta.date || "",
    description: meta.description || "",
    keywords: meta.keywords || [],
    readingTime: meta.readingTime || 5,
    content,
  };
}
