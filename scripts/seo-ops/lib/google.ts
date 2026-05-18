import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { env } from "./env";
import { jsonFetch } from "./http";

const tokenUrl = "https://oauth2.googleapis.com/token";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function serviceAccount(): ServiceAccount {
  const file = env("GOOGLE_APPLICATION_CREDENTIALS");
  if (!file) throw new Error("GOOGLE_APPLICATION_CREDENTIALS is required for Google API calls.");
  return JSON.parse(readFileSync(file, "utf8")) as ServiceAccount;
}

export async function googleAccessToken(scopes: string[]) {
  const command = env("GOOGLE_ACCESS_TOKEN_COMMAND");
  if (command) {
    const [bin, ...args] = command.split(/\s+/);
    return execFileSync(bin, args, { encoding: "utf8" }).trim();
  }

  const account = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: account.client_email,
    scope: scopes.join(" "),
    aud: tokenUrl,
    exp: now + 3600,
    iat: now,
  }));
  const payload = `${header}.${claim}`;
  const signature = createSign("RSA-SHA256").update(payload).sign(account.private_key);
  const assertion = `${payload}.${base64Url(signature)}`;

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const result = await jsonFetch<{ access_token: string }>(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  return result.access_token;
}

export async function googleJson<T>(url: string, token: string, init: RequestInit = {}) {
  return jsonFetch<T>(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
}

function sitePath(siteUrl: string) {
  return encodeURIComponent(siteUrl);
}

export async function submitSitemap(token: string, siteUrl: string, sitemapUrl: string) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${sitePath(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  return googleJson<Record<string, never>>(url, token, { method: "PUT" });
}

export async function inspectUrl(token: string, siteUrl: string, inspectionUrl: string) {
  return googleJson<{
    inspectionResult?: {
      indexStatusResult?: Record<string, unknown>;
      mobileUsabilityResult?: Record<string, unknown>;
      richResultsResult?: Record<string, unknown>;
    };
  }>("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", token, {
    method: "POST",
    body: JSON.stringify({ inspectionUrl, siteUrl }),
  });
}

export async function searchAnalytics(token: string, siteUrl: string, startDate: string, endDate: string) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${sitePath(siteUrl)}/searchAnalytics/query`;
  return googleJson<{ rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> }>(url, token, {
    method: "POST",
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["query", "page"],
      rowLimit: 250,
    }),
  });
}

export async function ga4RunReport(token: string, propertyId: string, startDate: string, endDate: string) {
  return googleJson<{
    rows?: Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }>;
  }>(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, token, {
    method: "POST",
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }, { name: "eventCount" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "100",
    }),
  });
}

export async function createGa4Property(token: string, accountId: string, displayName: string) {
  return googleJson<{ name: string; propertyType?: string }>("https://analyticsadmin.googleapis.com/v1beta/properties", token, {
    method: "POST",
    body: JSON.stringify({
      parent: `accounts/${accountId}`,
      displayName,
      industryCategory: "HEALTH_AND_FITNESS",
      timeZone: "America/New_York",
      currencyCode: "USD",
    }),
  });
}

export async function createGa4WebStream(token: string, propertyName: string, defaultUri: string, displayName: string) {
  return googleJson<{ name: string; measurementId?: string }>(`https://analyticsadmin.googleapis.com/v1beta/${propertyName}/dataStreams`, token, {
    method: "POST",
    body: JSON.stringify({
      type: "WEB_DATA_STREAM",
      displayName,
      webStreamData: { defaultUri },
    }),
  });
}
