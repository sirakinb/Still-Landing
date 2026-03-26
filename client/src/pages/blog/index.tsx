import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Calendar } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  readingTime: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  usePageSEO({
    title: "Still Blog — Mindfulness & Meditation Guides",
    description: "Science-backed guides on meditation, mindfulness, and building a lasting practice. Written for beginners and experienced meditators alike.",
  });

  const { data: posts = [], isLoading } = useQuery<BlogPostMeta[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Still
          </Link>
          <span className="text-sm font-medium tracking-widest text-white/40 uppercase">Blog</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Mindfulness & Meditation</h1>
          <p className="text-white/60 text-lg">
            Science-backed guides to help you build a practice that lasts.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-white/40">No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-white/80 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-white/60 mb-3 leading-relaxed">{post.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime} min read
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="border-b border-white/5 mt-10" />
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 mt-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm text-white/40">
          <span>© 2026 Still</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
