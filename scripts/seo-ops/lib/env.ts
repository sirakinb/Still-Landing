import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function loadEnv(file = ".env.seo") {
  const envPath = path.resolve(process.cwd(), file);
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

export function env(name: string, fallback = "") {
  return process.env[name] || fallback;
}

export function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}
