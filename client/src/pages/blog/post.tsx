import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  readingTime: number;
  content: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Minimal markdown renderer for the patterns used in blog posts
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-white underline underline-offset-4 hover:text-white/70 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/^---$/gm, '<hr class="border-white/10 my-10" />')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-white/80">$1</li>')
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-4 space-y-1.5">$1</ul>')
    .replace(/^(?!<[a-z]|\s*$)(.+)$/gm, '<p class="text-white/80 leading-relaxed my-4">$1</p>')
    .replace(/\n{3,}/g, "\n\n");
}

function useJsonLd(post: BlogPost | undefined) {
  useEffect(() => {
    if (!post) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blog-post-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      publisher: {
        "@type": "Organization",
        name: "Still",
        url: "https://stillmeditation.app",
      },
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("blog-post-jsonld")?.remove();
    };
  }, [post]);
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-3/4 mb-4" />
        <div className="h-4 bg-white/10 rounded w-1/2 mb-12" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-white/10 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  usePageSEO({
    title: post ? `${post.title} — Still` : "Still",
    description: post?.description ?? "",
  });

  useJsonLd(post);

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Post not found</h1>
          <Link href="/blog" className="text-white/60 hover:text-white transition-colors">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
          <Link
            href="/"
            className="text-sm font-medium tracking-widest text-white/40 uppercase hover:text-white/60 transition-colors"
          >
            Still
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Post header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">{post.title}</h1>
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

        {/* Post content — source is repo-controlled markdown, not user input */}
        <div
          className="text-base"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 mt-16">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-sm text-white/40">
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
