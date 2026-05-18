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
const gscRows = report.googleSearchConsole?.performance?.rows || [];
const ga4Rows = report.ga4?.report?.rows || [];
const appRows = report.appStoreConnect?.apps?.data || [];
const good = crawl.filter((item: any) => item.status === 200 && !item.hasNoindex && item.canonical === item.url).length;
const redirected = crawl.filter((item: any) => item.redirected).length;
const indexed = (report.googleSearchConsole?.inspections || []).filter((item: any) => {
  const verdict = item.indexStatus?.verdict || item.indexStatus?.coverageState || "";
  return String(verdict).toLowerCase().includes("pass") || String(verdict).toLowerCase().includes("indexed");
}).length;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SEO Ops Dashboard</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1b1f24; background: #f5f7fa; }
    body { margin: 0; }
    header { padding: 28px 36px; background: #ffffff; border-bottom: 1px solid #dde3ea; }
    h1 { margin: 0 0 6px; font-size: 26px; letter-spacing: 0; }
    main { padding: 28px 36px 44px; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .panel { background: #ffffff; border: 1px solid #dde3ea; border-radius: 8px; padding: 18px; }
    .label { color: #657282; font-size: 13px; }
    .metric { font-size: 30px; font-weight: 720; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 14px; }
    th, td { padding: 12px 10px; text-align: left; border-bottom: 1px solid #e4e9ef; vertical-align: top; }
    th { color: #657282; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
    .ok { color: #137333; font-weight: 650; }
    .warn { color: #b06000; font-weight: 650; }
    .bad { color: #b3261e; font-weight: 650; }
    .muted { color: #657282; }
    @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } main, header { padding-left: 18px; padding-right: 18px; } }
  </style>
</head>
<body>
  <header>
    <h1>SEO Ops Dashboard</h1>
    <div class="muted">${report.siteUrl || ""} • Generated ${report.generatedAt || ""}</div>
  </header>
  <main>
    <section class="grid">
      <div class="panel"><div class="label">Sitemap URLs</div><div class="metric">${crawl.length}</div></div>
      <div class="panel"><div class="label">Clean Technical URLs</div><div class="metric">${good}</div></div>
      <div class="panel"><div class="label">Redirected URLs</div><div class="metric">${redirected}</div></div>
      <div class="panel"><div class="label">Indexed / Passed</div><div class="metric">${indexed}</div></div>
    </section>
    <section class="grid" style="margin-top:18px">
      <div class="panel"><div class="label">GSC Rows</div><div class="metric">${gscRows.length}</div><div class="muted">${report.googleSearchConsole?.configured ? "Connected" : "Not connected"}</div></div>
      <div class="panel"><div class="label">GA4 Rows</div><div class="metric">${ga4Rows.length}</div><div class="muted">${report.ga4?.configured ? "Connected" : "Not connected"}</div></div>
      <div class="panel"><div class="label">App Store Apps</div><div class="metric">${appRows.length}</div><div class="muted">${report.appStoreConnect?.configured ? "Connected" : "Not connected"}</div></div>
      <div class="panel"><div class="label">Report Source</div><div class="metric" style="font-size:18px">${report.sitemapUrl ? "Sitemap" : "Manual"}</div><div class="muted">${report.sitemapUrl || ""}</div></div>
    </section>
    ${gscRows.length ? `<section class="panel" style="margin-top:18px">
      <h2 style="margin:0">Google Search Console Queries</h2>
      <table>
        <thead><tr><th>Query</th><th>Page</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Position</th></tr></thead>
        <tbody>
          ${gscRows.slice(0, 50).map((row: any) => `<tr>
            <td>${row.keys?.[0] || ""}</td>
            <td>${row.keys?.[1] || ""}</td>
            <td>${row.clicks ?? ""}</td>
            <td>${row.impressions ?? ""}</td>
            <td>${typeof row.ctr === "number" ? `${(row.ctr * 100).toFixed(1)}%` : ""}</td>
            <td>${typeof row.position === "number" ? row.position.toFixed(1) : ""}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>` : ""}
    ${ga4Rows.length ? `<section class="panel" style="margin-top:18px">
      <h2 style="margin:0">GA4 Top Pages</h2>
      <table>
        <thead><tr><th>Path</th><th>Views</th><th>Users</th><th>Events</th></tr></thead>
        <tbody>
          ${ga4Rows.slice(0, 50).map((row: any) => `<tr>
            <td>${row.dimensionValues?.[0]?.value || ""}</td>
            <td>${row.metricValues?.[0]?.value || ""}</td>
            <td>${row.metricValues?.[1]?.value || ""}</td>
            <td>${row.metricValues?.[2]?.value || ""}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>` : ""}
    ${appRows.length ? `<section class="panel" style="margin-top:18px">
      <h2 style="margin:0">App Store Connect</h2>
      <table>
        <thead><tr><th>Name</th><th>Bundle ID</th><th>SKU</th><th>Locale</th></tr></thead>
        <tbody>
          ${appRows.map((app: any) => `<tr>
            <td>${app.attributes?.name || app.id}</td>
            <td>${app.attributes?.bundleId || ""}</td>
            <td>${app.attributes?.sku || ""}</td>
            <td>${app.attributes?.primaryLocale || ""}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>` : ""}
    <section class="panel" style="margin-top:18px">
      <h2 style="margin:0">URL Health</h2>
      <table>
        <thead><tr><th>URL</th><th>Status</th><th>Canonical</th><th>Title</th></tr></thead>
        <tbody>
          ${crawl.map((item: any) => {
            const statusClass = item.status === 200 && !item.hasNoindex ? "ok" : "bad";
            const canonicalClass = item.canonical === item.url ? "ok" : "warn";
            return `<tr>
              <td><a href="${item.url}">${item.url}</a></td>
              <td class="${statusClass}">${item.status}${item.redirected ? " redirected" : ""}${item.hasNoindex ? " noindex" : ""}</td>
              <td class="${canonicalClass}">${item.canonical || "missing"}</td>
              <td>${item.title || ""}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;

writeFileSync(outFile, html);
console.log(`Wrote ${outFile}`);
