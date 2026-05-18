import { env, loadEnv, requiredEnv } from "./lib/env";
import { createGa4Property, createGa4WebStream, googleAccessToken, submitSitemap } from "./lib/google";

loadEnv();

async function main() {
  const token = await googleAccessToken([
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/analytics.edit",
  ]);

  const siteUrl = env("GSC_SITE_URL", env("SITE_URL", "https://stillmeditation.app/"));
  const sitemapUrl = env("SITEMAP_URL", "https://stillmeditation.app/sitemap.xml");
  await submitSitemap(token, siteUrl, sitemapUrl);
  console.log(`Submitted sitemap ${sitemapUrl} for ${siteUrl}`);

  if (env("GA4_ACCOUNT_ID") && !env("GA4_PROPERTY_ID")) {
    const property = await createGa4Property(token, requiredEnv("GA4_ACCOUNT_ID"), env("GA4_PROPERTY_NAME", "Still"));
    console.log(`Created GA4 property: ${property.name}`);
    const stream = await createGa4WebStream(
      token,
      property.name,
      env("GA4_WEB_STREAM_URL", env("SITE_URL", "https://stillmeditation.app/")),
      env("GA4_WEB_STREAM_NAME", "Website"),
    );
    console.log(`Created GA4 web stream: ${stream.name}`);
    if (stream.measurementId) console.log(`Measurement ID: ${stream.measurementId}`);
  } else {
    console.log("Skipped GA4 property creation. Set GA4_ACCOUNT_ID and omit GA4_PROPERTY_ID to create one.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
