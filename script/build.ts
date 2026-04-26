import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generateSitemap() {
  const siteUrl = "https://stillmeditation.app";
  const routes = [
    { loc: "/", lastmod: "2026-03-12", changefreq: "weekly", priority: "1.0" },
    { loc: "/terms", lastmod: "2026-01-16", changefreq: "monthly", priority: "0.3" },
    { loc: "/privacy", lastmod: "2026-01-16", changefreq: "monthly", priority: "0.3" },
    { loc: "/support", lastmod: "2026-03-12", changefreq: "monthly", priority: "0.5" },
    { loc: "/blog", lastmod: "2026-04-26", changefreq: "weekly", priority: "0.7" },
  ];

  const articleJson = JSON.parse(await readFile("client/src/content/articles.json", "utf-8"));
  for (const article of articleJson.articles || []) {
    if (!article.slug) continue;
    routes.push({
      loc: `/blog/${article.slug}`,
      lastmod: (article.updated_at || article.created_at || new Date().toISOString()).slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  const entries = routes
    .map((route) => {
      return `  <url>
    <loc>${escapeXml(`${siteUrl}${route.loc}`)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  await writeFile(
    "dist/public/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
  );
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();
  await generateSitemap();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
