import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import logoImage from "@assets/STILL-APPP_1766960471016.png";
import { articles, formatArticleDate } from "@/lib/articles";
import { usePageSEO } from "@/hooks/usePageSEO";

export default function BlogIndex() {
  usePageSEO({
    title: "Still Blog | Meditation, Mindfulness, and Soundscapes",
    description:
      "Read Still articles about meditation, mindfulness, relaxation, and personalized soundscapes for better daily practice.",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold">
            <img src={logoImage} alt="Still Logo" className="w-9 h-9 object-contain" />
            Still
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Still Journal</p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl text-primary">Meditation articles</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Practical writing on stillness, meditation, soundscapes, and building a calmer daily practice.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="mt-14 border border-border bg-card p-8">
            <h2 className="font-serif text-2xl text-primary">Articles are coming soon.</h2>
            <p className="mt-3 text-muted-foreground">
              Published OutRank articles will appear here automatically after the webhook receives them.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group block border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt=""
                    className="mb-5 aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <p className="text-sm text-muted-foreground">{formatArticleDate(article.created_at)}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-primary group-hover:underline">
                  {article.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-muted-foreground">{article.meta_description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
