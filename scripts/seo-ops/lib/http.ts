export async function jsonFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, init);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method || "GET"} ${url} failed ${response.status}: ${text.slice(0, 800)}`);
  }
  return text ? JSON.parse(text) as T : ({} as T);
}

export function textFromXml(xml: string, tag: string) {
  const pattern = new RegExp(`<${tag}>(.*?)</${tag}>`, "g");
  return [...xml.matchAll(pattern)].map((match) => match[1].trim());
}
