import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import logoImage from "@assets/STILL-APPP_1766960471016.png";
import { formatArticleDate, getArticleBySlug } from "@/lib/articles";
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
        </article>
      </main>
    </div>
  );
}
