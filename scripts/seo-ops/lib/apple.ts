import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { env, requiredEnv } from "./env";
import { jsonFetch } from "./http";

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function appStoreJwt() {
  const issuerId = requiredEnv("APP_STORE_CONNECT_ISSUER_ID");
  const keyId = requiredEnv("APP_STORE_CONNECT_KEY_ID");
  const keyPath = requiredEnv("APP_STORE_CONNECT_PRIVATE_KEY_PATH");
  const privateKey = readFileSync(keyPath, "utf8");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: issuerId,
    iat: now,
    exp: now + 20 * 60,
    aud: "appstoreconnect-v1",
  }));
  const signed = createSign("SHA256").update(`${header}.${payload}`).sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${header}.${payload}.${base64Url(signed)}`;
}

export async function appStoreJson<T>(path: string) {
  const token = appStoreJwt();
  return jsonFetch<T>(`https://api.appstoreconnect.apple.com/v1${path}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function appStoreAppSummary() {
  const bundleId = env("APP_STORE_BUNDLE_ID");
  const query = bundleId ? `?filter[bundleId]=${encodeURIComponent(bundleId)}` : "?limit=10";
  return appStoreJson<{
    data: Array<{ id: string; attributes?: { name?: string; bundleId?: string; sku?: string; primaryLocale?: string } }>;
  }>(`/apps${query}`);
}
