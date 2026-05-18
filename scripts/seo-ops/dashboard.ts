import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const reportPath = path.resolve("seo-ops-data/latest-report.json");
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

const topGscRows = gscRows.slice(0, 8);
const topGa4Rows = ga4Rows.slice(0, 8);
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

const actions = [
  ga4Rows.length ? null : ["Watch GA4", "Connected, but page view rows are empty. Confirm the web stream tag is installed on the landing page."],
  gscRows.length ? null : ["Wait for GSC data", "Search Console is connected, but query data needs impressions before it can populate."],
  canonicalWarnings ? ["Fix canonicals", `${canonicalWarnings} URL${canonicalWarnings === 1 ? "" : "s"} need canonical review.`] : null,
  missingDescriptions ? ["Add descriptions", `${missingDescriptions} URL${missingDescriptions === 1 ? "" : "s"} are missing meta descriptions.`] : null,
  report.appStoreConnect?.configured ? null : ["Connect Apple", "Add App Store Connect credentials to include ASO/listing status."],
].filter(Boolean) as string[][];

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
      --ink: #17202a;
      --muted: #667085;
      --line: #d9e1ea;
      --panel: #ffffff;
      --canvas: #f4f7fb;
      --soft: #eef3f8;
      --blue: #2457d6;
      --green: #16845b;
      --amber: #b76b00;
      --red: #b42318;
      --slate: #293241;
    }
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--ink); background: var(--canvas); }
    a { color: var(--blue); text-decoration: none; }
    .shell { display: grid; grid-template-columns: 236px minmax(0, 1fr); min-height: 100vh; }
    aside { background: #111827; color: #dbe4ef; padding: 22px 18px; }
    .brand { display: flex; gap: 10px; align-items: center; font-weight: 760; letter-spacing: 0; margin-bottom: 28px; }
    .mark { width: 26px; height: 26px; border-radius: 6px; background: linear-gradient(135deg, #78c6a3, #2457d6 58%, #f2b84b); }
    nav { display: grid; gap: 6px; font-size: 14px; }
    nav div { padding: 10px 11px; border-radius: 7px; color: #b8c3d2; }
    nav .active { background: #1d2939; color: #ffffff; }
    .aside-foot { position: sticky; top: calc(100vh - 150px); margin-top: 40px; color: #8fa0b5; font-size: 12px; line-height: 1.5; }
    main { padding: 26px 30px 42px; }
    header { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 26px; line-height: 1.1; letter-spacing: 0; }
    h2 { margin: 0; font-size: 16px; letter-spacing: 0; }
    .sub { color: var(--muted); font-size: 13px; margin-top: 7px; }
    .toolbar { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .chip { border: 1px solid var(--line); background: var(--panel); border-radius: 999px; padding: 7px 10px; font-size: 12px; color: #475467; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .two { display: grid; grid-template-columns: 1.2fr .8fr; gap: 12px; margin-top: 12px; }
    .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 16px; box-shadow: 0 1px 2px rgba(16, 24, 40, .04); }
    .metric-label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
    .metric { font-size: 30px; line-height: 1; font-weight: 760; margin-top: 10px; }
    .metric-row { display: flex; align-items: baseline; gap: 8px; }
    .delta { color: var(--muted); font-size: 12px; }
    .bar { height: 8px; background: var(--soft); border-radius: 999px; overflow: hidden; margin-top: 14px; }
    .bar span { display: block; height: 100%; background: var(--green); }
    .bar.blue span { background: var(--blue); }
    .bar.amber span { background: var(--amber); }
    .section-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 12px; }
    .pill { display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 8px; font-size: 12px; font-weight: 650; white-space: nowrap; }
    .good { background: #e9f7ef; color: var(--green); }
    .warn { background: #fff3d6; color: var(--amber); }
    .bad { background: #fde8e7; color: var(--red); }
    .neutral { background: #eef3f8; color: #475467; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 11px 10px; border-bottom: 1px solid #edf1f5; text-align: left; vertical-align: top; }
    th { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; font-weight: 700; }
    tbody tr:hover { background: #f8fafc; }
    .empty { border: 1px dashed #cfd8e3; border-radius: 8px; padding: 18px; color: var(--muted); background: #fbfcfe; }
    .actions { display: grid; gap: 10px; }
    .action { display: grid; gap: 3px; padding: 12px 0; border-bottom: 1px solid #edf1f5; }
    .action:last-child { border-bottom: 0; }
    .action strong { font-size: 13px; }
    .action span { color: var(--muted); font-size: 13px; line-height: 1.45; }
    .table-wrap { overflow-x: auto; }
    .url-table td:first-child { min-width: 360px; }
    @media (max-width: 1100px) {
      .shell { grid-template-columns: 1fr; }
      aside { display: none; }
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .two { grid-template-columns: 1fr; }
    }
    @media (max-width: 680px) {
      main { padding: 18px; }
      header { display: block; }
      .toolbar { justify-content: flex-start; margin-top: 14px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside>
      <div class="brand"><span class="mark"></span><span>Still SEO Ops</span></div>
      <nav>
        <div class="active">Overview</div>
        <div>Search Console</div>
        <div>Analytics</div>
        <div>Technical URLs</div>
        <div>App Store</div>
      </nav>
      <div class="aside-foot">
        <div>${connectedCount}/3 data sources connected</div>
        <div>${escapeHtml(report.sitemapUrl || "No sitemap")}</div>
      </div>
    </aside>
    <main>
      <header>
        <div>
          <h1>SEO command center</h1>
          <div class="sub">${escapeHtml(report.siteUrl || "")} - generated ${escapeHtml(fmtDate(report.generatedAt))}</div>
        </div>
        <div class="toolbar">
          <span class="chip">GSC ${report.googleSearchConsole?.configured ? "connected" : "offline"}</span>
          <span class="chip">GA4 ${report.ga4?.configured ? "connected" : "offline"}</span>
          <span class="chip">Apple ${report.appStoreConnect?.configured ? "connected" : "offline"}</span>
        </div>
      </header>

      <section class="grid">
        <div class="panel">
          <div class="metric-label">Sitemap URLs</div>
          <div class="metric">${crawl.length}</div>
          <div class="sub">Discovered from sitemap</div>
        </div>
        <div class="panel">
          <div class="metric-label">Technical Health</div>
          <div class="metric-row"><div class="metric">${technicalScore}%</div><span class="delta">${cleanUrls}/${crawl.length} clean</span></div>
          <div class="bar"><span style="width:${technicalScore}%"></span></div>
        </div>
        <div class="panel">
          <div class="metric-label">Index Coverage</div>
          <div class="metric-row"><div class="metric">${indexScore}%</div><span class="delta">${indexed}/${inspections.length} passed</span></div>
          <div class="bar blue"><span style="width:${indexScore}%"></span></div>
        </div>
        <div class="panel">
          <div class="metric-label">Needs Review</div>
          <div class="metric">${redirected + canonicalWarnings + failedInspections + missingDescriptions}</div>
          <div class="sub">${redirected} redirects, ${canonicalWarnings} canonical, ${missingDescriptions} descriptions</div>
        </div>
      </section>

      <section class="two">
        <div class="panel">
          <div class="section-head">
            <h2>Search performance</h2>
            <span class="pill ${gscRows.length ? "good" : "neutral"}">${gscRows.length} query rows</span>
          </div>
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
          </table></div>` : `<div class="empty">Search Console is connected and URL inspection works, but there are no query rows yet. This usually changes after Google records impressions or clicks for the property.</div>`}
        </div>
        <div class="panel">
          <div class="section-head">
            <h2>Priority queue</h2>
            <span class="pill neutral">${actions.length} items</span>
          </div>
          <div class="actions">
            ${actions.length ? actions.map(([title, body]) => `<div class="action"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`).join("") : `<div class="empty">No immediate issues detected in the current snapshot.</div>`}
          </div>
        </div>
      </section>

      <section class="two">
        <div class="panel">
          <div class="section-head">
            <h2>GA4 top pages</h2>
            <span class="pill ${ga4Rows.length ? "good" : "neutral"}">${ga4Rows.length} page rows</span>
          </div>
          ${topGa4Rows.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Path</th><th>Views</th><th>Users</th><th>Events</th></tr></thead>
            <tbody>${topGa4Rows.map((row: any) => `<tr>
              <td>${escapeHtml(row.dimensionValues?.[0]?.value)}</td>
              <td>${escapeHtml(row.metricValues?.[0]?.value)}</td>
              <td>${escapeHtml(row.metricValues?.[1]?.value)}</td>
              <td>${escapeHtml(row.metricValues?.[2]?.value)}</td>
            </tr>`).join("")}</tbody>
          </table></div>` : `<div class="empty">GA4 authenticated successfully, but no pagePath rows came back for the latest 28-day window.</div>`}
        </div>
        <div class="panel">
          <div class="section-head">
            <h2>App Store Connect</h2>
            <span class="pill ${appRows.length ? "good" : "neutral"}">${appRows.length} apps</span>
          </div>
          ${appRows.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Name</th><th>Bundle ID</th><th>Locale</th></tr></thead>
            <tbody>${appRows.map((app: any) => `<tr>
              <td>${escapeHtml(app.attributes?.name || app.id)}</td>
              <td>${escapeHtml(app.attributes?.bundleId)}</td>
              <td>${escapeHtml(app.attributes?.primaryLocale)}</td>
            </tr>`).join("")}</tbody>
          </table></div>` : `<div class="empty">Apple is not connected yet. Once added, this panel can become the ASO status area for listing metadata, version status, and store readiness.</div>`}
        </div>
      </section>

      <section class="panel" style="margin-top:12px">
        <div class="section-head">
          <h2>URL health</h2>
          <span class="pill good">${cleanUrls} clean URLs</span>
        </div>
        <div class="table-wrap">
          <table class="url-table">
            <thead><tr><th>URL</th><th>Status</th><th>Canonical</th><th>Google coverage</th><th>Title</th></tr></thead>
            <tbody>${urlRows}</tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;

writeFileSync(outFile, html);
console.log(`Wrote ${outFile}`);
