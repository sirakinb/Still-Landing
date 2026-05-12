import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import logoImage from "@assets/STILL-APPP_1766960471016.png";
import { articles, formatArticleDate, getArticleBySlug } from "@/lib/articles";
import { usePageSEO } from "@/hooks/usePageSEO";
import NotFound from "@/pages/not-found";

function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_\-~]/g, "")
    .trim();
}

export default function BlogArticle() {
  const params = useParams<{ slug: string }>();
  const article = params.slug ? getArticleBySlug(params.slug) : undefined;

  usePageSEO({
    title: article ? `${article.title} | Still` : "Article Not Found | Still",
    description: article?.meta_description || "Read meditation and mindfulness articles from Still.",
  });

  if (!article) {
    return <NotFound />;
  }

  const fallbackText = article.content_markdown ? markdownToPlainText(article.content_markdown) : "";
  const relatedArticles = articles
    .filter((candidate) => candidate.slug !== article.slug)
    .filter((candidate) => candidate.tags?.some((tag) => article.tags?.includes(tag)))
    .slice(0, 3);
  const moreArticles =
    relatedArticles.length > 0
      ? relatedArticles
      : articles.filter((candidate) => candidate.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold">
            <img src={logoImage} alt="Still Logo" className="w-9 h-9 object-contain" />
            Still
          </Link>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Blog
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-14">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm text-muted-foreground">{formatArticleDate(article.created_at)}</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-primary md:text-6xl">{article.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{article.meta_description}</p>

          {article.image_url ? (
            <img src={article.image_url} alt="" className="mt-10 aspect-[16/9] w-full object-cover" />
          ) : null}

          <div className="article-content mt-10">
            {article.content_html ? (
              <div dangerouslySetInnerHTML={{ __html: article.content_html }} />
            ) : (
              fallbackText.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </div>

          <nav className="mt-14 border-t border-border pt-8" aria-label="Related meditation articles">
            <h2 className="font-serif text-2xl text-primary">Related meditation articles</h2>
            <div className="mt-5 grid gap-4">
              {moreArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="block border border-border bg-card p-5 hover:border-primary/40"
                >
                  <p className="text-sm text-muted-foreground">{formatArticleDate(related.created_at)}</p>
                  <h3 className="mt-2 font-serif text-xl leading-tight text-primary hover:underline">
                    {related.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{related.meta_description}</p>
                </Link>
              ))}
            </div>
          </nav>
        </article>
      </main>

      <footer className="border-t border-border/50 py-10">
        <div className="container mx-auto flex flex-col gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 Pentridge Media LLC. All rights reserved.</p>
          <nav className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <Link href="/support" className="hover:text-foreground">Support</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
