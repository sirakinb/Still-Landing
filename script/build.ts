import { build as esbuild } from "esbuild";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { build as viteBuild } from "vite";

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

const siteUrl = "https://stillmeditation.app";
const defaultImage = `${siteUrl}/opengraph.jpg`;

interface Article {
  title: string;
  slug: string;
  meta_description: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

interface SeoRoute {
  path: string;
  title: string;
  description: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  image?: string;
  type?: "website" | "article";
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeJsonLd(value: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function getBaseStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "Still - Meditation Music",
      operatingSystem: "iOS",
      applicationCategory: "HealthApplication",
      description:
        "Create personalized meditation music. Describe your mood, choose a style, and generate unique soundscapes for your meditation practice.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      installUrl: "https://apps.apple.com/us/app/still-meditation/id6757083149",
      screenshot: defaultImage,
      softwareVersion: "1.0",
      creator: {
        "@type": "Organization",
        name: "Pentridge Media LLC",
        url: siteUrl,
        email: "info@pentridgemedia.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Still - Meditation Music",
      url: siteUrl,
      description: "Create personalized meditation music with Still.",
      publisher: {
        "@type": "Organization",
        name: "Pentridge Media LLC",
      },
    },
  ];
}

async function readArticles() {
  const articleJson = JSON.parse(
    await readFile("client/src/content/articles.json", "utf-8"),
  ) as { articles?: Article[] };

  return [...(articleJson.articles || [])].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

async function getSeoRoutes(): Promise<SeoRoute[]> {
  const articles = await readArticles();
  const latestArticleDate = articles[0]?.updated_at || articles[0]?.created_at || "2026-04-26";

  const routes: SeoRoute[] = [
    {
      path: "/",
      title: "Still - Generate Your Own Meditation Music | Personalized Soundscapes",
      description:
        "Still lets you create personalized meditation music. Describe your mood, choose a style, and generate unique soundscapes for your meditation practice. Available on iOS.",
      lastmod: "2026-03-12",
      changefreq: "weekly",
      priority: "1.0",
      structuredData: getBaseStructuredData(),
    },
    {
      path: "/terms",
      title: "Terms of Service | Still - Meditation Music App",
      description:
        "Terms of Service for Still, the personalized meditation music app by Pentridge Media LLC. Review our terms for using the Still app and services.",
      lastmod: "2026-01-16",
      changefreq: "monthly",
      priority: "0.3",
    },
    {
      path: "/privacy",
      title: "Privacy Policy | Still - Meditation Music App",
      description:
        "Privacy Policy for Still, the personalized meditation music app. Learn how Pentridge Media LLC collects, uses, and protects your personal information.",
      lastmod: "2026-01-16",
      changefreq: "monthly",
      priority: "0.3",
    },
    {
      path: "/support",
      title: "Support | Still - Meditation Music App",
      description:
        "Get help with Still, the personalized meditation music app. Find answers about account management, music generation, sessions, and technical issues.",
      lastmod: "2026-03-12",
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      path: "/blog",
      title: "Still Blog | Meditation, Mindfulness, and Soundscapes",
      description:
        "Read Still articles about meditation, mindfulness, relaxation, and personalized soundscapes for better daily practice.",
      lastmod: latestArticleDate.slice(0, 10),
      changefreq: "weekly",
      priority: "0.7",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Still Blog",
        url: `${siteUrl}/blog`,
        description:
          "Articles about meditation, mindfulness, relaxation, and personalized soundscapes.",
      },
    },
  ];

  for (const article of articles) {
    if (!article.slug) continue;

    routes.push({
      path: `/blog/${article.slug}`,
      title: `${article.title} | Still`,
      description: article.meta_description,
      lastmod: (article.updated_at || article.created_at || new Date().toISOString()).slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
      image: article.image_url,
      type: "article",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.meta_description,
        image: article.image_url || defaultImage,
        datePublished: article.created_at,
        dateModified: article.updated_at || article.created_at,
        url: `${siteUrl}/blog/${article.slug}`,
        author: {
          "@type": "Organization",
          name: "Still",
        },
        publisher: {
          "@type": "Organization",
          name: "Still",
          logo: {
            "@type": "ImageObject",
            url: defaultImage,
          },
        },
        keywords: article.tags?.join(", "),
      },
    });
  }

  return routes;
}

async function generateSitemap(routes: SeoRoute[]) {
  const entries = routes
    .map((route) => {
      return `  <url>
    <loc>${escapeXml(`${siteUrl}${route.path}`)}</loc>
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

function upsertTag(html: string, pattern: RegExp, tag: string) {
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function injectSeo(html: string, route: SeoRoute) {
  const canonicalUrl = `${siteUrl}${route.path}`;
  const image = route.image || defaultImage;
  const type = route.type || "website";
  const escapedTitle = escapeHtml(route.title);
  const escapedDescription = escapeHtml(route.description);
  const escapedUrl = escapeHtml(canonicalUrl);
  const escapedImage = escapeHtml(image);

  let output = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`)
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");

  output = upsertTag(
    output,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapedDescription}" />`,
  );
  output = upsertTag(
    output,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapedUrl}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapedTitle}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapedDescription}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${type}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapedUrl}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapedImage}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
  );
  output = upsertTag(
    output,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${escapedImage}" />`,
  );

  if (route.structuredData) {
    output = output.replace(
      "</head>",
      `    <script type="application/ld+json">\n${safeJsonLd(route.structuredData)}\n    </script>\n  </head>`,
    );
  }

  return output;
}

async function writePrerenderedRoutes(routes: SeoRoute[]) {
  const template = await readFile("dist/public/index.html", "utf-8");
  const serverEntry = path.resolve("dist/server/entry-server.js");
  const { render } = (await import(pathToFileURL(serverEntry).href)) as {
    render: (url: string) => string;
  };

  for (const route of routes) {
    const appHtml = render(route.path);
    const html = injectSeo(
      template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`),
      route,
    );

    const outputPath =
      route.path === "/"
        ? path.resolve("dist/public/index.html")
        : path.resolve("dist/public", route.path.slice(1), "index.html");

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);
  }
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server renderer...");
  await viteBuild({
    build: {
      ssr: path.resolve("client/src/entry-server.tsx"),
      outDir: path.resolve("dist/server"),
      emptyOutDir: true,
    },
  });

  const routes = await getSeoRoutes();
  await writePrerenderedRoutes(routes);
  await generateSitemap(routes);

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
