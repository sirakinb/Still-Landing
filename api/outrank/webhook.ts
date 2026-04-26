const CONTENT_PATH = "client/src/content/articles.json";

interface OutrankArticle {
  id?: string;
  title?: string;
  content_markdown?: string;
  content_html?: string;
  meta_description?: string;
  created_at?: string;
  image_url?: string;
  slug?: string;
  tags?: string[];
}

interface StoredArticle {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  content_markdown?: string;
  content_html?: string;
  image_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GitHubContentResponse {
  sha: string;
  content: string;
  encoding: string;
}

function env(name: string, fallback?: string) {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function validateToken(req: any) {
  const expectedToken = env("OUTRANK_WEBHOOK_TOKEN");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  return authHeader.slice("Bearer ".length).trim() === expectedToken;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function normalizeArticle(article: OutrankArticle): StoredArticle | null {
  if (!article.title) return null;
  const createdAt = article.created_at || new Date().toISOString();
  const slug = slugify(article.slug || article.title);
  if (!slug) return null;

  return {
    id: article.id || slug,
    title: article.title,
    slug,
    meta_description: article.meta_description || article.title,
    content_markdown: article.content_markdown || "",
    content_html: article.content_html || "",
    image_url: article.image_url || "",
    tags: Array.isArray(article.tags) ? article.tags.filter((tag) => typeof tag === "string") : [],
    created_at: createdAt,
    updated_at: new Date().toISOString(),
  };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "still-outrank-webhook",
  };
}

async function readCurrentArticles(config: {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}) {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${CONTENT_PATH}?ref=${config.branch}`;
  const response = await fetch(url, {
    headers: githubHeaders(config.token),
  });

  if (response.status === 404) {
    return { sha: undefined, articles: [] as StoredArticle[] };
  }

  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as GitHubContentResponse;
  const json = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
  return { sha: data.sha, articles: (json.articles || []) as StoredArticle[] };
}

async function writeArticles(config: {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  sha?: string;
  articles: StoredArticle[];
}) {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${CONTENT_PATH}`;
  const content = Buffer.from(JSON.stringify({ articles: config.articles }, null, 2) + "\n").toString("base64");
  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(config.token),
    body: JSON.stringify({
      message: "Publish OutRank articles",
      content,
      sha: config.sha,
      branch: config.branch,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${response.status} ${await response.text()}`);
  }
}

function upsertArticles(current: StoredArticle[], incoming: StoredArticle[]) {
  const byKey = new Map<string, StoredArticle>();
  for (const article of current) {
    byKey.set(article.id || article.slug, article);
  }
  for (const article of incoming) {
    byKey.set(article.id || article.slug, article);
  }
  return Array.from(byKey.values()).sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, integration: "outrank" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!validateToken(req)) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    const articles = Array.isArray(req.body?.data?.articles)
      ? req.body.data.articles.map(normalizeArticle).filter(Boolean)
      : [];

    if (req.body?.event_type !== "publish_articles" || articles.length === 0) {
      return res.status(200).json({ ok: true, message: "Webhook received; no publishable articles found." });
    }

    const config = {
      owner: env("GITHUB_OWNER", "sirakinb"),
      repo: env("GITHUB_REPO", "Still-Landing"),
      branch: env("GITHUB_BRANCH", "main"),
      token: env("GITHUB_TOKEN"),
    };

    const current = await readCurrentArticles(config);
    const mergedArticles = upsertArticles(current.articles, articles as StoredArticle[]);
    await writeArticles({ ...config, sha: current.sha, articles: mergedArticles });

    return res.status(200).json({
      ok: true,
      published: articles.length,
      total_articles: mergedArticles.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    console.error(message);
    return res.status(500).json({ error: message });
  }
}
