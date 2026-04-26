import articleData from "@/content/articles.json";

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  content_markdown?: string;
  content_html?: string;
  image_url?: string;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

const data = articleData as { articles?: BlogArticle[] };

export const articles = [...(data.articles || [])].sort((a, b) => {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
});

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
