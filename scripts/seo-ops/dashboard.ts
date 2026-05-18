import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const reportPath = path.resolve("seo-ops-data/latest-report.json");
const toolQueuePath = path.resolve("scripts/seo-ops/tool-build-queue.json");
const toolStatePath = path.resolve("seo-ops-data/tool-cron/state.json");
const toolLogsDir = path.resolve("seo-ops-data/tool-cron/logs");
const outDir = path.resolve("seo-ops-data/dashboard");
const outFile = path.join(outDir, "index.html");

if (!existsSync(reportPath)) {
  throw new Error("Missing seo-ops-data/latest-report.json. Run npm run seo:collect first.");
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
mkdirSync(outDir, { recursive: true });

const crawl = Array.isArray(report.crawl) ? report.crawl : [];
const inspections = Array.isArray(report.googleSearchConsole?.inspections) ? report.googleSearchConsole.inspections : [];
const gscRows = report.googleSearchConsole?.performance?.rows || [];
const ga4Rows = report.ga4?.report?.rows || [];
const appRows = report.appStoreConnect?.apps?.data || [];
const toolQueue = existsSync(toolQueuePath) ? JSON.parse(readFileSync(toolQueuePath, "utf8")) : [];
const toolState = existsSync(toolStatePath) ? JSON.parse(readFileSync(toolStatePath, "utf8")) : { completed: {} };
const completedTools = toolState.completed || {};
const nextTool = toolQueue.find((tool: any) => !completedTools[tool.slug]);
const latestToolLog = existsSync(toolLogsDir)
  ? readdirSync(toolLogsDir).filter((file) => file.endsWith(".log")).sort().at(-1)
  : "";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pct(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function fmtDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

const cleanUrls = crawl.filter((item: any) => item.status === 200 && !item.hasNoindex && item.canonical === item.url).length;
const redirected = crawl.filter((item: any) => item.redirected).length;
const canonicalWarnings = crawl.filter((item: any) => item.canonical !== item.url).length;
const missingDescriptions = crawl.filter((item: any) => !item.description).length;
const indexed = inspections.filter((item: any) => {
  const verdict = item.indexStatus?.verdict || item.indexStatus?.coverageState || "";
  return String(verdict).toLowerCase().includes("pass") || String(verdict).toLowerCase().includes("indexed");
}).length;
const failedInspections = inspections.filter((item: any) => !item.ok).length;
const technicalScore = pct(cleanUrls, crawl.length);
const indexScore = pct(indexed, inspections.length);
const connectedCount = [
  report.googleSearchConsole?.configured,
  report.ga4?.configured,
  report.appStoreConnect?.configured,
].filter(Boolean).length;

const blogUrls = crawl.filter((item: any) => {
  try {
    const pathname = new URL(item.url).pathname;
    return pathname.startsWith("/blog/") && pathname !== "/blog/";
  } catch {
    return false;
  }
});
const publishedArticles = blogUrls.length;
const plannedArticles = 27;
const googleClicks = gscRows.reduce((total: number, row: any) => total + numberValue(row.clicks), 0);
const googleImpressions = gscRows.reduce((total: number, row: any) => total + numberValue(row.impressions), 0);
const verifiedBacklinks = 19;
const availableCredits = 24;
const domainRating = 9;

const topGscRows = gscRows.slice(0, 14);
const topGa4Rows = ga4Rows.slice(0, 14);
const logoSrc = "../../client/public/favicon.png";

const toolRows = toolQueue.map((tool: any) => {
  const completed = completedTools[tool.slug];
  const status = completed ? "Done" : nextTool?.slug === tool.slug ? "Next" : "Queued";
  const statusClass = completed ? "good" : nextTool?.slug === tool.slug ? "warn" : "neutral";
  return `<tr>
    <td><a href="${escapeHtml(tool.url)}">${escapeHtml(tool.title)}</a></td>
    <td>${escapeHtml(tool.primaryKeyword)}</td>
    <td><span class="pill ${statusClass}">${status}</span></td>
    <td>${completed ? escapeHtml(fmtDate(completed.completedAt)) : ""}</td>
    <td>${escapeHtml(completed?.branch || "")}</td>
  </tr>`;
}).join("");

const urlRows = crawl.map((item: any) => {
  const inspection = inspections.find((entry: any) => entry.url === item.url);
  const coverage = inspection?.indexStatus?.coverageState || (inspection?.ok ? "Inspected" : inspection?.error || "Not inspected");
  const statusClass = item.status === 200 && !item.hasNoindex ? "good" : "bad";
  const canonicalClass = item.canonical === item.url ? "good" : "warn";
  return `<tr>
    <td><a href="${escapeHtml(item.url)}">${escapeHtml(item.url)}</a></td>
    <td><span class="pill ${statusClass}">${escapeHtml(item.status)}${item.redirected ? " redirect" : ""}${item.hasNoindex ? " noindex" : ""}</span></td>
    <td><span class="pill ${canonicalClass}">${item.canonical === item.url ? "Canonical" : "Check"}</span></td>
    <td>${escapeHtml(coverage)}</td>
    <td>${escapeHtml(item.title)}</td>
  </tr>`;
}).join("");

const actionItems = [
  nextTool ? ["Let tool cron run", `${nextTool.title} is next in the automatic build queue.`] : null,
  gscRows.length ? null : ["Wait for GSC data", "Search Console is connected, but Google needs impressions or clicks before query rows populate."],
  ga4Rows.length ? null : ["Watch GA4", "GA4 is connected and the tag is installed, but page rows are empty until real traffic arrives."],
  canonicalWarnings ? ["Fix canonicals", `${canonicalWarnings} URL${canonicalWarnings === 1 ? "" : "s"} need canonical review.`] : null,
  missingDescriptions ? ["Add descriptions", `${missingDescriptions} URL${missingDescriptions === 1 ? "" : "s"} are missing meta descriptions.`] : null,
].filter(Boolean) as string[][];

const sparklinePoints = [0, 0, 0, 12, 12, 16, 16, 16, 16, 26, 26, 64, 64, 64, 72, 88, 88, 92];
const sparkline = sparklinePoints.map((value, index) => `${index * 25},${100 - value}`).join(" ");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Still SEO Ops</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --ink: #080b13;
      --muted: #667085;
      --line: #e0e5ec;
      --panel: #ffffff;
      --canvas: #f6f7fb;
      --soft: #f1f4f8;
      --purple: #8b4dff;
      --purple-soft: #f4edff;
      --green: #17a46b;
      --amber: #b76b00;
      --red: #b42318;
      --slate: #202436;
    }
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--ink); background: var(--canvas); }
    a { color: var(--purple); text-decoration: none; }
    .shell { display: grid; grid-template-columns: 250px minmax(0, 1fr); min-height: 100vh; }
    aside { background: var(--panel); border-right: 1px solid var(--line); padding: 22px 18px; position: sticky; top: 0; height: 100vh; }
    .brand { display: flex; gap: 11px; align-items: center; font-weight: 800; font-size: 18px; margin-bottom: 22px; }
    .brand img { width: 34px; height: 34px; border-radius: 8px; object-fit: cover; }
    .site-card { border: 1px solid var(--line); border-radius: 8px; padding: 12px; margin-bottom: 18px; }
    .site-card strong { display: block; font-size: 14px; }
    .site-card span { color: var(--muted); font-size: 12px; }
    nav { display: grid; gap: 5px; font-size: 14px; }
    nav button { border: 0; background: transparent; color: #2d3340; display: flex; gap: 10px; align-items: center; width: 100%; text-align: left; padding: 10px 11px; border-radius: 8px; cursor: pointer; font: inherit; }
    nav button:hover, nav button.active { background: #f0f2f6; }
    .aside-foot { position: absolute; left: 18px; right: 18px; bottom: 18px; border-top: 1px solid var(--line); padding-top: 14px; color: var(--muted); font-size: 12px; line-height: 1.5; }
    main { padding: 28px 34px 44px; }
    header { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; margin-bottom: 22px; }
    h1 { margin: 0; font-size: 30px; line-height: 1.05; letter-spacing: 0; }
    h2 { margin: 0; font-size: 16px; letter-spacing: .08em; text-transform: uppercase; color: #687389; }
    .domain { color: #687389; font-size: 18px; font-weight: 700; }
    .sub { color: var(--muted); font-size: 13px; margin-top: 7px; }
    .toolbar { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .chip, .pill { display: inline-flex; align-items: center; border-radius: 999px; white-space: nowrap; }
    .chip { border: 1px solid var(--line); background: var(--panel); padding: 8px 11px; font-size: 12px; color: #475467; }
    .pill { padding: 4px 8px; font-size: 12px; font-weight: 700; }
    .good { background: #e8f8f0; color: #0d7b50; }
    .warn { background: #fff3d6; color: var(--amber); }
    .bad { background: #fde8e7; color: var(--red); }
    .neutral { background: #eef3f8; color: #475467; }
    .view { display: none; }
    .view.active { display: block; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
    .overview-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .9fr); gap: 14px; }
    .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 20px; box-shadow: 0 1px 2px rgba(16, 24, 40, .035); }
    .metric-label { color: #687389; font-size: 12px; text-transform: uppercase; letter-spacing: .14em; font-weight: 800; }
    .metric { font-size: 34px; line-height: 1; font-weight: 850; margin-top: 10px; letter-spacing: 0; }
    .metric-row { display: flex; align-items: baseline; gap: 8px; }
    .delta { color: var(--muted); font-size: 12px; font-weight: 650; }
    .chart { height: 190px; display: flex; align-items: end; }
    .chart svg { width: 100%; height: 142px; overflow: visible; }
    .dr-card { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center; }
    .ring { width: 58px; height: 58px; border-radius: 999px; border: 8px solid #e8f8f0; display: grid; place-items: center; color: var(--green); font-weight: 850; }
    .recommendations { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 14px; }
    .recommendation { background: var(--purple-soft); border: 1px solid #e3d2ff; border-radius: 14px; padding: 16px; min-height: 132px; }
    .recommendation strong { display: block; font-size: 15px; margin-bottom: 8px; }
    .recommendation span { color: #687389; font-size: 13px; line-height: 1.45; }
    .bar { height: 8px; background: var(--soft); border-radius: 999px; overflow: hidden; margin-top: 14px; }
    .bar span { display: block; height: 100%; background: var(--green); }
    .bar.purple span { background: var(--purple); }
    .section-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 11px 10px; border-bottom: 1px solid #edf1f5; text-align: left; vertical-align: top; }
    th { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; font-weight: 800; }
    tbody tr:hover { background: #f8fafc; }
    .empty { border: 1px dashed #cfd8e3; border-radius: 12px; padding: 18px; color: var(--muted); background: #fbfcfe; }
    .table-wrap { overflow-x: auto; }
    .url-table td:first-child { min-width: 360px; }
    @media (max-width: 1180px) {
      .shell { grid-template-columns: 1fr; }
      aside { position: static; height: auto; }
      .aside-foot { position: static; margin-top: 18px; }
      .overview-grid, .two { grid-template-columns: 1fr; }
      .grid, .recommendations { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 700px) {
      main { padding: 18px; }
      header { display: block; }
      .toolbar { justify-content: flex-start; margin-top: 14px; }
      .grid, .recommendations { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside>
      <div class="brand"><img src="${logoSrc}" alt="Still logo"><span>Still SEO</span></div>
      <div class="site-card">
        <strong>Still Meditation</strong>
        <span>${escapeHtml(report.siteUrl || "https://stillmeditation.app")}</span>
      </div>
      <nav aria-label="Dashboard sections">
        <button class="active" data-view="overview">Overview</button>
        <button data-view="search-console">Search Console</button>
        <button data-view="analytics">Analytics</button>
        <button data-view="technical">Technical URLs</button>
        <button data-view="tool-builder">Tool Builder</button>
        <button data-view="app-store">App Store</button>
      </nav>
      <div class="aside-foot">
        <div>${connectedCount}/3 data sources connected</div>
        <div>${escapeHtml(report.sitemapUrl || "No sitemap")}</div>
      </div>
    </aside>

    <main>
      <header>
        <div>
          <h1>Still Meditation <span class="domain">/ stillmeditation.app</span></h1>
          <div class="sub">Generated ${escapeHtml(fmtDate(report.generatedAt))}</div>
        </div>
        <div class="toolbar">
          <span class="chip">GSC ${report.googleSearchConsole?.configured ? "connected" : "offline"}</span>
          <span class="chip">GA4 ${report.ga4?.configured ? "connected" : "offline"}</span>
          <span class="chip">Apple ${report.appStoreConnect?.configured ? "connected" : "offline"}</span>
        </div>
      </header>

      <section id="overview" class="view active">
        <div class="overview-grid">
          <div class="panel">
            <div class="section-head">
              <h2>Backlink Exchange</h2>
              <span class="pill neutral">Outrank snapshot</span>
            </div>
            <div class="grid" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
              <div>
                <div class="metric-label">Verified Backlinks</div>
                <div class="metric">${verifiedBacklinks}</div>
              </div>
              <div>
                <div class="metric-label">Available Credits</div>
                <div class="metric">${availableCredits}</div>
              </div>
            </div>
            <div class="chart">
              <svg viewBox="0 0 425 112" role="img" aria-label="Backlink growth chart">
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stop-color="#8b4dff" stop-opacity=".28"/>
                    <stop offset="1" stop-color="#8b4dff" stop-opacity=".06"/>
                  </linearGradient>
                </defs>
                <polygon points="0,112 ${sparkline} 425,112" fill="url(#area)"></polygon>
                <polyline points="${sparkline}" fill="none" stroke="#7c4dff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
              </svg>
            </div>
            <div class="sub">Apr 26 to May 18</div>
          </div>

          <div class="panel">
            <div class="section-head">
              <h2>Articles</h2>
              <span class="pill ${publishedArticles ? "good" : "neutral"}">${publishedArticles} live</span>
            </div>
            <div class="grid" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
              <div>
                <div class="metric-label">Published</div>
                <div class="metric">${publishedArticles}</div>
                <div class="sub">live on your site</div>
              </div>
              <div>
                <div class="metric-label">Planned</div>
                <div class="metric">${plannedArticles}</div>
                <div class="sub">handled by Uprank/Outrank</div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid" style="margin-top:14px">
          <div class="panel dr-card">
            <div class="ring">${domainRating}</div>
            <div>
              <div class="metric-label">Domain Rating</div>
              <div class="sub">via Ahrefs snapshot. Live DR requires Ahrefs API/account access.</div>
            </div>
          </div>
          <div class="panel">
            <div class="metric-label">Google Clicks</div>
            <div class="metric">${googleClicks}</div>
            <div class="sub">${googleImpressions} impressions tracked</div>
          </div>
          <div class="panel">
            <div class="metric-label">Index Coverage</div>
            <div class="metric-row"><div class="metric">${indexScore}%</div><span class="delta">${indexed}/${inspections.length} passed</span></div>
            <div class="bar purple"><span style="width:${indexScore}%"></span></div>
          </div>
          <div class="panel">
            <div class="metric-label">Tool Queue</div>
            <div class="metric">${Object.keys(completedTools).length}/${toolQueue.length}</div>
            <div class="sub">${escapeHtml(nextTool?.title || "Queue complete")}</div>
          </div>
        </div>

        <div class="panel" style="margin-top:14px">
          <div class="section-head">
            <h2>Recommended Actions</h2>
            <span class="pill neutral">${actionItems.length} suggestions</span>
          </div>
          <div class="recommendations">
            ${actionItems.length ? actionItems.slice(0, 3).map(([title, body]) => `<div class="recommendation"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`).join("") : `<div class="empty">No immediate issues detected in the current snapshot.</div>`}
          </div>
        </div>
      </section>

      <section id="search-console" class="view">
        <div class="grid">
          <div class="panel"><div class="metric-label">Query Rows</div><div class="metric">${gscRows.length}</div><div class="sub">Search performance rows</div></div>
          <div class="panel"><div class="metric-label">Clicks</div><div class="metric">${googleClicks}</div><div class="sub">Current report window</div></div>
          <div class="panel"><div class="metric-label">Impressions</div><div class="metric">${googleImpressions}</div><div class="sub">Current report window</div></div>
          <div class="panel"><div class="metric-label">Inspections</div><div class="metric">${inspections.length}</div><div class="sub">${indexed} indexed/passing</div></div>
        </div>
        <div class="panel" style="margin-top:14px">
          <div class="section-head"><h2>Search Performance</h2><span class="pill ${gscRows.length ? "good" : "neutral"}">${gscRows.length} rows</span></div>
          ${topGscRows.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Query</th><th>Page</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos.</th></tr></thead>
            <tbody>${topGscRows.map((row: any) => `<tr>
              <td>${escapeHtml(row.keys?.[0])}</td>
              <td>${escapeHtml(row.keys?.[1])}</td>
              <td>${escapeHtml(row.clicks)}</td>
              <td>${escapeHtml(row.impressions)}</td>
              <td>${typeof row.ctr === "number" ? `${(row.ctr * 100).toFixed(1)}%` : ""}</td>
              <td>${typeof row.position === "number" ? row.position.toFixed(1) : ""}</td>
            </tr>`).join("")}</tbody>
          </table></div>` : `<div class="empty">Search Console is connected and URL inspection works, but there are no query rows yet. That matches the current state: submitted, not meaningfully indexed/earning impressions yet.</div>`}
        </div>
      </section>

      <section id="analytics" class="view">
        <div class="panel">
          <div class="section-head"><h2>GA4 Top Pages</h2><span class="pill ${ga4Rows.length ? "good" : "neutral"}">${ga4Rows.length} page rows</span></div>
          ${topGa4Rows.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Path</th><th>Views</th><th>Users</th><th>Events</th></tr></thead>
            <tbody>${topGa4Rows.map((row: any) => `<tr>
              <td>${escapeHtml(row.dimensionValues?.[0]?.value)}</td>
              <td>${escapeHtml(row.metricValues?.[0]?.value)}</td>
              <td>${escapeHtml(row.metricValues?.[1]?.value)}</td>
              <td>${escapeHtml(row.metricValues?.[2]?.value)}</td>
            </tr>`).join("")}</tbody>
          </table></div>` : `<div class="empty">GA4 authenticated successfully. Page rows are empty because the fixed events need real site traffic before this report has pagePath data.</div>`}
        </div>
      </section>

      <section id="technical" class="view">
        <div class="grid">
          <div class="panel"><div class="metric-label">Sitemap URLs</div><div class="metric">${crawl.length}</div><div class="sub">Discovered URLs</div></div>
          <div class="panel"><div class="metric-label">Technical Health</div><div class="metric">${technicalScore}%</div><div class="bar"><span style="width:${technicalScore}%"></span></div></div>
          <div class="panel"><div class="metric-label">Canonicals</div><div class="metric">${canonicalWarnings}</div><div class="sub">Warnings</div></div>
          <div class="panel"><div class="metric-label">Meta Descriptions</div><div class="metric">${missingDescriptions}</div><div class="sub">Missing</div></div>
        </div>
        <div class="panel" style="margin-top:14px">
          <div class="section-head"><h2>URL Health</h2><span class="pill good">${cleanUrls} clean URLs</span></div>
          <div class="table-wrap">
            <table class="url-table">
              <thead><tr><th>URL</th><th>Status</th><th>Canonical</th><th>Google coverage</th><th>Title</th></tr></thead>
              <tbody>${urlRows}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="tool-builder" class="view">
        <div class="grid">
          <div class="panel"><div class="metric-label">Cron Mode</div><div class="metric">Auto</div><div class="sub">Mondays 9:15 AM, direct commit to main after checks pass.</div></div>
          <div class="panel"><div class="metric-label">Next Tool</div><div class="metric" style="font-size:24px">${escapeHtml(nextTool?.title || "Queue complete")}</div><div class="sub">${escapeHtml(nextTool?.url || "No queued tools remaining")}</div></div>
          <div class="panel"><div class="metric-label">Last Log</div><div class="metric" style="font-size:18px">${escapeHtml(latestToolLog || "No runs yet")}</div><div class="sub">seo-ops-data/tool-cron/logs</div></div>
          <div class="panel"><div class="metric-label">Queue</div><div class="metric">${Object.keys(completedTools).length}/${toolQueue.length}</div><div class="sub">One tool per weekly run</div></div>
        </div>
        <div class="panel" style="margin-top:14px">
          <div class="section-head"><h2>Build Queue</h2><span class="pill ${nextTool ? "warn" : "good"}">${Object.keys(completedTools).length}/${toolQueue.length} complete</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Tool</th><th>Primary keyword</th><th>Status</th><th>Completed</th><th>Branch</th></tr></thead>
              <tbody>${toolRows || `<tr><td colspan="5">No tool queue configured.</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="app-store" class="view">
        <div class="panel">
          <div class="section-head"><h2>App Store Connect</h2><span class="pill ${appRows.length ? "good" : "neutral"}">${appRows.length} apps</span></div>
          ${appRows.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Name</th><th>Bundle ID</th><th>Locale</th></tr></thead>
            <tbody>${appRows.map((app: any) => `<tr>
              <td>${escapeHtml(app.attributes?.name || app.id)}</td>
              <td>${escapeHtml(app.attributes?.bundleId)}</td>
              <td>${escapeHtml(app.attributes?.primaryLocale)}</td>
            </tr>`).join("")}</tbody>
          </table></div>` : `<div class="empty">Apple is not connected yet. Once added, this panel can track ASO metadata, listing readiness, version status, and store search work.</div>`}
        </div>
      </section>
    </main>
  </div>
  <script>
    const buttons = [...document.querySelectorAll("[data-view]")];
    const views = [...document.querySelectorAll(".view")];
    function activate(viewId) {
      const fallback = document.getElementById(viewId) ? viewId : "overview";
      buttons.forEach((button) => button.classList.toggle("active", button.dataset.view === fallback));
      views.forEach((view) => view.classList.toggle("active", view.id === fallback));
      if (location.hash.slice(1) !== fallback) history.replaceState(null, "", "#" + fallback);
    }
    buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.view)));
    activate(location.hash.slice(1) || "overview");
  </script>
</body>
</html>`;

writeFileSync(outFile, html);
console.log(`Wrote ${outFile}`);
