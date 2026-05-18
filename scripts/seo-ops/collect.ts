import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { env, loadEnv } from "./lib/env";
import { ga4RunReport, googleAccessToken, inspectUrl, searchAnalytics } from "./lib/google";
import { textFromXml } from "./lib/http";
import { appStoreAppSummary } from "./lib/apple";

loadEnv();

const siteUrl = env("SITE_URL", "https://stillmeditation.app/");
const sitemapUrl = env("SITEMAP_URL", new URL("/sitemap.xml", siteUrl).toString());
const gscSiteUrl = env("GSC_SITE_URL", siteUrl);
const outDir = path.resolve("seo-ops-data");
const today = new Date().toISOString().slice(0, 10);

function daysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function crawlUrl(url: string) {
  const response = await fetch(url, { redirect: "follow" });
  const html = await response.text();
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || "";
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, " ").trim() || "";
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
  return {
    url,
    status: response.status,
    finalUrl: response.url,
    redirected: response.url !== url,
    canonical,
    title,
    description,
    hasNoindex: /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html),
  };
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const sitemapXml = await fetch(sitemapUrl).then((response) => response.text());
  const urls = textFromXml(sitemapXml, "loc");
  const crawl = [];
  for (const url of urls) crawl.push(await crawlUrl(url));

  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    sitemapUrl,
    urls,
    crawl,
    googleSearchConsole: { configured: false },
    ga4: { configured: false },
    appStoreConnect: { configured: false },
  };

  if (env("GOOGLE_APPLICATION_CREDENTIALS")) {
    const searchConsoleToken = await googleAccessToken([
      "https://www.googleapis.com/auth/webmasters.readonly",
    ], { forceServiceAccount: true });

    const inspections = [];
    for (const url of urls) {
      try {
        const result = await inspectUrl(searchConsoleToken, gscSiteUrl, url);
        const indexStatus = result.inspectionResult?.indexStatusResult || {};
        inspections.push({ url, ok: true, indexStatus });
      } catch (error) {
        inspections.push({ url, ok: false, error: error instanceof Error ? error.message : String(error) });
      }
    }

    let performance: unknown = null;
    try {
      performance = await searchAnalytics(searchConsoleToken, gscSiteUrl, daysAgo(28), today);
    } catch (error) {
      performance = { error: error instanceof Error ? error.message : String(error) };
    }

    report.googleSearchConsole = { configured: true, siteUrl: gscSiteUrl, inspections, performance };

    if (env("GA4_PROPERTY_ID")) {
      try {
        const analyticsToken = await googleAccessToken([
          "https://www.googleapis.com/auth/analytics.readonly",
        ]);
        report.ga4 = {
          configured: true,
          propertyId: env("GA4_PROPERTY_ID"),
          report: await ga4RunReport(analyticsToken, env("GA4_PROPERTY_ID"), daysAgo(28), today),
        };
      } catch (error) {
        report.ga4 = { configured: true, error: error instanceof Error ? error.message : String(error) };
      }
    }
  }

  if (env("APP_STORE_CONNECT_ISSUER_ID") && env("APP_STORE_CONNECT_KEY_ID") && env("APP_STORE_CONNECT_PRIVATE_KEY_PATH")) {
    try {
      report.appStoreConnect = { configured: true, apps: await appStoreAppSummary() };
    } catch (error) {
      report.appStoreConnect = { configured: true, error: error instanceof Error ? error.message : String(error) };
    }
  }

  writeFileSync(path.join(outDir, "latest-report.json"), JSON.stringify(report, null, 2));
  console.log(`Wrote ${path.join(outDir, "latest-report.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
