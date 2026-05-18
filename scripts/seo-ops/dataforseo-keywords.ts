import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { env, loadEnv } from "./lib/env";

loadEnv();

const endpoint = "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live";
const outDir = path.resolve("seo-ops-data/keyword-research");
const defaultKeywords = [
  "meditation music generator",
  "sleep music generator",
  "binaural beats generator",
  "meditation timer",
  "breathing exercise timer",
  "meditation prompt generator",
  "soundscape generator",
  "focus music generator",
  "meditation style quiz",
  "sleep routine builder",
];

function authHeader() {
  const encoded = env("DATAFORSEO_AUTH_BASE64");
  if (encoded) return `Basic ${encoded}`;

  const login = env("DATAFORSEO_LOGIN");
  const password = env("DATAFORSEO_PASSWORD");
  if (!login || !password) {
    throw new Error("Missing DATAFORSEO_LOGIN/DATAFORSEO_PASSWORD or DATAFORSEO_AUTH_BASE64 in .env.seo");
  }

  return `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
}

function csvValue(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function main() {
  const keywords = process.argv.slice(2).length ? process.argv.slice(2) : defaultKeywords;
  mkdirSync(outDir, { recursive: true });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: authHeader(),
      "content-type": "application/json",
    },
    body: JSON.stringify([
      {
        location_code: Number(env("DATAFORSEO_LOCATION_CODE", "2840")),
        language_code: env("DATAFORSEO_LANGUAGE_CODE", "en"),
        keywords,
      },
    ]),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`DataForSEO request failed: ${response.status} ${JSON.stringify(data)}`);
  }

  const rows = (data.tasks || []).flatMap((task: any) =>
    (task.result || []).map((item: any) => ({
      keyword: item.keyword,
      search_volume: item.search_volume,
      cpc: item.cpc,
      competition: item.competition,
      competition_index: item.competition_index,
      low_top_of_page_bid: item.low_top_of_page_bid,
      high_top_of_page_bid: item.high_top_of_page_bid,
      monthly_searches: item.monthly_searches,
    })),
  );

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(outDir, `dataforseo-keywords-${stamp}.json`);
  const csvPath = path.join(outDir, `dataforseo-keywords-${stamp}.csv`);
  const headers = [
    "keyword",
    "search_volume",
    "cpc",
    "competition",
    "competition_index",
    "low_top_of_page_bid",
    "high_top_of_page_bid",
  ];

  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), keywords, rows, raw: data }, null, 2));
  writeFileSync(csvPath, [
    headers.join(","),
    ...rows.map((row: any) => headers.map((header) => csvValue(row[header])).join(",")),
  ].join("\n"));

  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${csvPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
