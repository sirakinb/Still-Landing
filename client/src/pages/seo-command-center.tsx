import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CircleDot,
  FileText,
  Gauge,
  GitBranch,
  Globe2,
  Link2,
  Lock,
  Search,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePageSEO } from "@/hooks/usePageSEO";

const liveAssets = [
  {
    type: "Tool",
    title: "Meditation Music Generator",
    status: "Live",
    url: "/tools/meditation-music-generator",
    intent: "meditation music generator",
  },
  {
    type: "Cluster",
    title: "Meditation Music Articles",
    status: "Live",
    url: "/blog",
    intent: "sleep, focus, mindfulness, meditation music",
  },
  {
    type: "Landing",
    title: "Still App Homepage",
    status: "Live",
    url: "/",
    intent: "AI meditation music app",
  },
];

const pipeline = [
  {
    stage: "Next tool",
    item: "SEO Visibility Checker",
    why: "Turns domain authority/backlink curiosity into leads and audits.",
    owner: "Build",
    status: "Ready",
  },
  {
    stage: "Content",
    item: "Still vs Calm / Headspace / Endel",
    why: "Captures high-intent comparison searches before users pick an app.",
    owner: "Brief",
    status: "Queued",
  },
  {
    stage: "Research",
    item: "Sleep music generator cluster",
    why: "Adjacent tool keyword with direct product fit and app-store intent.",
    owner: "Data",
    status: "Queued",
  },
  {
    stage: "Authority",
    item: "Resource-page outreach list",
    why: "Turns free tools into linkable assets without low-quality exchanges.",
    owner: "Outreach",
    status: "Hold",
  },
];

const dataSources = [
  {
    name: "Google Search Console",
    role: "Queries, pages, impressions, CTR, position",
    status: "Priority",
    icon: Search,
  },
  {
    name: "GA4 or Vercel Analytics",
    role: "Visits, referrers, events, app-store CTA clicks",
    status: "Priority",
    icon: Activity,
  },
  {
    name: "App Store Connect",
    role: "App impressions, product-page views, installs, campaigns",
    status: "Priority",
    icon: BarChart3,
  },
  {
    name: "DataForSEO SERP + Labs",
    role: "Keyword discovery, SERP pages, rank tracking, competitors",
    status: "Next",
    icon: Globe2,
  },
  {
    name: "DataForSEO Backlinks",
    role: "Referring domains, anchors, link gaps, authority trend",
    status: "Coming soon",
    icon: Link2,
  },
  {
    name: "DataForSEO AI Optimization",
    role: "LLM mentions, cited pages, AI visibility, competitor share",
    status: "Coming soon",
    icon: Sparkles,
  },
];

const metrics = [
  { label: "Live SEO assets", value: "3", detail: "Tool + blog + landing" },
  { label: "30-day output target", value: "30", detail: "Articles/tools/pages" },
  { label: "Authority module", value: "Soon", detail: "After Outrank trial" },
  { label: "Case study domain", value: "Still", detail: "stillmeditation.app" },
];

const playbook = [
  "Find demand with search data and competitor SERPs.",
  "Choose the asset type: article, free tool, comparison page, glossary, or app tutorial.",
  "Ship the page with schema, internal links, sitemap coverage, and a clear app CTA.",
  "Measure Search Console impressions and conversions.",
  "Use backlink and AI visibility data to decide the next authority push.",
];

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Live" || status === "Ready" || status === "Priority"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Coming soon" || status === "Hold"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <Badge variant="outline" className={`rounded-full ${className}`}>
      {status}
    </Badge>
  );
}

export default function SeoCommandCenter() {
  usePageSEO({
    title: "SEO Command Center | Still Growth System",
    description:
      "A working SEO command center prototype for planning free tools, articles, backlink research, AI visibility tracking, and organic growth experiments for Still.",
  });

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#151922]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#ddd9d0] bg-[#101827] px-5 py-6 text-white">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">Command Center</div>
              <div className="text-xs text-white/55">Still SEO case study</div>
            </div>
          </a>

          <nav className="mt-10 space-y-1 text-sm">
            {[
              ["Overview", Gauge],
              ["Assets", FileText],
              ["Tool Builder", Wrench],
              ["Content Pipeline", GitBranch],
              ["Authority", Link2],
              ["AI Visibility", Sparkles],
            ].map(([label, Icon]) => {
              const DisplayIcon = Icon as typeof Gauge;
              return (
                <a
                  key={label as string}
                  href={`#${String(label).toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-3 px-3 py-3 text-white/75 hover:bg-white/10 hover:text-white"
                >
                  <DisplayIcon className="h-4 w-4" />
                  {label as string}
                </a>
              );
            })}
          </nav>

          <div className="mt-10 border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Lock className="h-4 w-4 text-amber-300" />
              Paid data on hold
            </div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Backlinks and AI visibility stay marked coming soon until the Outrank trial ends.
            </p>
          </div>
        </aside>

        <main className="px-5 py-6 md:px-8 lg:px-10">
          <section id="overview" className="border-b border-[#ddd9d0] pb-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge className="mb-4 rounded-full bg-[#dff4ec] text-[#0f6b4f] hover:bg-[#dff4ec]">
                  MVP v1
                </Badge>
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
                  SEO growth system for tools, content, authority, and AI search.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#5b6170]">
                  The first version keeps Still moving while the paid backlink and LLM research modules wait. It gives us a single place to plan assets, score opportunities, and track what needs to ship next.
                </p>
              </div>
              <div className="flex gap-3">
                <a href="/tools/meditation-music-generator">
                  <Button>
                    Live tool
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="/">
                  <Button variant="outline">Landing page</Button>
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <Card key={metric.label} className="border-[#ddd9d0] bg-white shadow-none">
                  <CardContent className="p-5">
                    <div className="text-sm text-[#697180]">{metric.label}</div>
                    <div className="mt-3 text-3xl font-semibold">{metric.value}</div>
                    <div className="mt-2 text-sm text-[#697180]">{metric.detail}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-6 py-8 xl:grid-cols-[1.15fr_0.85fr]">
            <Card id="assets" className="border-[#ddd9d0] bg-white shadow-none">
              <CardContent className="p-0">
                <div className="border-b border-[#e8e3d8] p-5">
                  <h2 className="text-xl font-semibold">Live Asset Map</h2>
                  <p className="mt-1 text-sm text-[#697180]">Current pages we can use as proof, ranking targets, and internal-link hubs.</p>
                </div>
                <div className="divide-y divide-[#e8e3d8]">
                  {liveAssets.map((asset) => (
                    <div key={asset.title} className="grid gap-4 p-5 md:grid-cols-[90px_1fr_auto] md:items-center">
                      <Badge variant="outline" className="w-fit rounded-full">
                        {asset.type}
                      </Badge>
                      <div>
                        <a href={asset.url} className="font-medium hover:underline">
                          {asset.title}
                        </a>
                        <div className="mt-1 text-sm text-[#697180]">{asset.intent}</div>
                      </div>
                      <StatusBadge status={asset.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="tool-builder" className="border-[#ddd9d0] bg-white shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">Tool Builder Queue</h2>
                  <Wrench className="h-5 w-5 text-[#0f6b4f]" />
                </div>
                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Still case-study readiness</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} />
                  </div>
                  <div className="border border-[#e8e3d8] p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <CircleDot className="h-4 w-4 text-[#0f6b4f]" />
                      Next recommended build
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#5b6170]">
                      SEO Visibility Checker: domain score, indexed assets, authority placeholder, backlink gap coming soon, and a generated growth plan.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="border border-[#e8e3d8] p-3">
                      <div className="text-[#697180]">Best CTA</div>
                      <div className="mt-1 font-medium">Free SEO plan</div>
                    </div>
                    <div className="border border-[#e8e3d8] p-3">
                      <div className="text-[#697180]">Lead intent</div>
                      <div className="mt-1 font-medium">High</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 pb-8 xl:grid-cols-[0.9fr_1.1fr]">
            <Card id="content-pipeline" className="border-[#ddd9d0] bg-white shadow-none">
              <CardContent className="p-0">
                <div className="border-b border-[#e8e3d8] p-5">
                  <h2 className="text-xl font-semibold">Production Pipeline</h2>
                </div>
                <div className="divide-y divide-[#e8e3d8]">
                  {pipeline.map((task) => (
                    <div key={task.item} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-[#697180]">{task.stage}</div>
                          <div className="mt-1 font-medium">{task.item}</div>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#5b6170]">{task.why}</p>
                      <div className="mt-3 text-xs font-medium text-[#697180]">Owner: {task.owner}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ddd9d0] bg-white shadow-none">
              <CardContent className="p-0">
                <div className="border-b border-[#e8e3d8] p-5">
                  <h2 className="text-xl font-semibold">Data Source Roadmap</h2>
                  <p className="mt-1 text-sm text-[#697180]">What we need beyond DataForSEO, and what can wait.</p>
                </div>
                <div className="grid gap-0 md:grid-cols-2">
                  {dataSources.map((source) => {
                    const Icon = source.icon;
                    return (
                      <div key={source.name} className="border-b border-r border-[#e8e3d8] p-5">
                        <div className="flex items-start justify-between gap-4">
                          <Icon className="h-5 w-5 text-[#0f6b4f]" />
                          <StatusBadge status={source.status} />
                        </div>
                        <div className="mt-4 font-medium">{source.name}</div>
                        <p className="mt-2 text-sm leading-6 text-[#5b6170]">{source.role}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 pb-8 xl:grid-cols-2">
            <Card id="authority" className="border-[#ddd9d0] bg-[#101827] text-white shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-amber-300" />
                  <h2 className="text-xl font-semibold">Authority Strategy</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  We should avoid copying backlink exchange mechanics too literally. The stronger version is linkable tools plus outreach to resource pages, app roundups, creator directories, wellness blogs, and comparison lists.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["Tool links", "Resource pages", "Roundups"].map((item) => (
                    <div key={item} className="border border-white/10 bg-white/5 p-4 text-sm">
                      <CheckCircle2 className="mb-3 h-4 w-4 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="ai-visibility" className="border-[#ddd9d0] bg-white shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#7c3aed]" />
                  <h2 className="text-xl font-semibold">AI Visibility Plan</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#5b6170]">
                  Once we enable the LLM mentions data, the dashboard should track which brands and pages show up for “best meditation music app,” “AI meditation music,” and “sleep music generator.”
                </p>
                <ol className="mt-5 space-y-3 text-sm text-[#5b6170]">
                  {playbook.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#efece4] text-xs font-semibold text-[#151922]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
