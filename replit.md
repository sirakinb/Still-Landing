# Still - Meditation Music Marketing Website

## Overview
Marketing website for "Still" — a meditation app by Pentridge Media LLC that lets users create personalized AI-generated meditation music.

## Architecture
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Routing**: Hash-based via wouter (`#/terms`, `#/privacy`, `#/support`)
- **Backend**: Express (minimal, serves static files)
- **No database** — this is a static marketing site

## Pages
- `/` — Home (landing page with hero, features, styles, FAQ, download CTA)
- `#/terms` — Terms of Service
- `#/privacy` — Privacy Policy
- `#/support` — Support page

## Key Files
- `client/index.html` — Meta tags, structured data (JSON-LD), Apple Smart App Banner
- `client/src/pages/home.tsx` — Main landing page
- `client/src/pages/terms.tsx` — Terms of Service
- `client/src/pages/privacy.tsx` — Privacy Policy
- `client/src/pages/support.tsx` — Support
- `client/src/hooks/usePageSEO.ts` — Per-page title/description updates
- `client/public/robots.txt` — Search engine crawler instructions
- `client/public/sitemap.xml` — Sitemap for search engines

## SEO Implementation
- **Meta tags**: Title, description, keywords, Open Graph, Twitter Cards
- **Structured data**: JSON-LD for MobileApplication, WebSite, FAQPage schemas
- **Apple Smart App Banner**: `<meta name="apple-itunes-app">` for Safari users
- **Per-page SEO**: `usePageSEO` hook updates document title and meta description per route
- **robots.txt + sitemap.xml** for crawler guidance
- **Semantic HTML**: `<main>`, `<footer>`, `<nav>`, `<section>` with `aria-label` attributes

## External Links
- App Store: https://apps.apple.com/us/app/still-meditation/id6757083149
- Company: Pentridge Media LLC, 1034 S. 53rd Street, Philadelphia, PA 19143
- Contact: info@pentridgemedia.com

## Future SEO Recommendations
- Switch from hash-based routing to real URL paths for better search engine indexing
- Add a blog section for content marketing (meditation tips, app updates)
- Submit sitemap to Google Search Console
- Set up custom domain for stronger brand SEO signals
