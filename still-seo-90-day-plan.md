# Still App — 90-Day SEO Plan

## Current State (Day 0)
- Marketing website live with Home, Terms, Privacy, and Support pages
- App live on the iOS App Store
- Basic technical SEO implemented: meta tags, structured data (JSON-LD), robots.txt, sitemap.xml, Apple Smart App Banner, per-page titles/descriptions
- Hash-based routing (#/terms, #/privacy, #/support) limits individual page indexing
- No blog or content marketing in place
- No Google Search Console or analytics connected

---

## Phase 1: Foundation (Days 1–30)

### Week 1–2: Technical SEO & Analytics Setup

- [ ] **Set up Google Search Console**
  - Verify site ownership
  - Submit sitemap.xml
  - Monitor indexing status and crawl errors
  - Request indexing for the homepage

- [ ] **Set up Google Analytics 4 (GA4)**
  - Install GA4 tracking tag
  - Set up conversion events: App Store link clicks, support page visits
  - Enable enhanced measurement (scroll depth, outbound clicks)

- [ ] **Set up Apple App Store attribution**
  - Create App Analytics campaign links for the website CTA buttons
  - Track which website visitors convert to App Store downloads

- [ ] **Switch from hash-based routing to path-based routing**
  - Change `#/terms` → `/terms`, `#/privacy` → `/privacy`, `#/support` → `/support`
  - Configure server-side fallback so all paths serve the SPA
  - Update all internal links and sitemap.xml
  - Set up 301 redirects from old hash URLs if possible
  - This is the single most impactful technical SEO change — search engines largely ignore hash fragments

- [ ] **Register and configure a custom domain**
  - Choose a branded domain (e.g., stillmeditation.com or stillapp.com)
  - Update canonical URLs, sitemap, and Open Graph tags to use the custom domain
  - Set up HTTPS (handled by Replit automatically)

### Week 3–4: On-Page Optimization

- [ ] **Optimize page load speed**
  - Compress and lazy-load hero/library images
  - Add `loading="lazy"` to below-fold images
  - Add `width` and `height` attributes to prevent layout shift
  - Minimize third-party font loading (consider `font-display: swap`)

- [ ] **Improve image SEO**
  - Add descriptive `alt` text to all images (not just "Still App Interface")
  - Use descriptive filenames for images (rename from hashed names if possible)
  - Add an Open Graph image that is exactly 1200x630px with the Still brand and a clear tagline

- [ ] **Add an accessibility audit pass**
  - Ensure all interactive elements are keyboard-navigable
  - Add skip-to-content link
  - Verify color contrast ratios meet WCAG AA
  - These improvements also help SEO as Google factors in page experience

- [ ] **Optimize existing page content**
  - Home page: ensure H1 contains primary keyword ("AI Meditation Music" or "Personalized Meditation Music")
  - Add secondary keywords naturally: "meditation soundscapes," "custom meditation tracks," "AI music for mindfulness"
  - Make sure FAQ section answers align with actual search queries

---

## Phase 2: Content & Authority (Days 31–60)

### Week 5–6: Blog Setup & Initial Content

- [ ] **Add a blog section to the website**
  - Create a `/blog` route with a listing page and individual post pages
  - Use clean, crawlable URLs: `/blog/how-ai-creates-meditation-music`
  - Add blog posts to the sitemap

- [ ] **Publish foundational blog posts (aim for 4–6 posts)**
  - "How AI Creates Personalized Meditation Music" (targets: AI meditation music, how AI music works)
  - "7 Meditation Music Styles and When to Use Each" (targets: meditation music styles, ambient meditation, binaural beats meditation)
  - "How to Build a Daily Meditation Habit with Music" (targets: daily meditation habit, meditation tips)
  - "What Makes Personalized Meditation Music More Effective?" (targets: personalized meditation, custom meditation music)
  - "The Science Behind Binaural Beats and Meditation" (targets: binaural beats, meditation science)
  - "Still App: How to Create Your First Custom Meditation Track" (targets: still app tutorial, how to use still app)

- [ ] **Add internal linking strategy**
  - Each blog post links back to the homepage and the App Store download
  - Blog posts link to related blog posts
  - Homepage features section links to relevant blog posts where appropriate

### Week 7–8: App Store Optimization (ASO) Alignment

- [ ] **Align website keywords with App Store listing**
  - Ensure the App Store title, subtitle, and keyword field use the same primary terms as the website
  - Suggested App Store keywords: meditation music, AI meditation, personalized meditation, soundscapes, mindfulness music, meditation timer, ambient sounds, relaxation

- [ ] **Encourage and manage App Store reviews**
  - Add an in-app review prompt after the user's 3rd meditation session
  - Positive reviews improve App Store ranking, which feeds back into branded search traffic

- [ ] **Create a "Press & Media" section or page**
  - Include a short company description, founder info, and high-res app screenshots
  - This makes it easy for bloggers and journalists to write about Still
  - Include a press contact email

---

## Phase 3: Growth & Link Building (Days 61–90)

### Week 9–10: Link Building & Outreach

- [ ] **Submit to app directories and review sites**
  - Product Hunt launch (schedule for a Tuesday or Wednesday)
  - AlternativeTo.net (list as alternative to Calm, Headspace, Insight Timer)
  - AppAdvice, 148Apps, AppStorm, or similar iOS app review sites
  - Meditation and wellness directories

- [ ] **Guest post outreach**
  - Pitch 5–10 meditation, wellness, or productivity blogs
  - Topics: "How AI Is Changing Meditation," "Why Generic Meditation Music Doesn't Work"
  - Include a link back to the Still website in the author bio

- [ ] **Social proof & community**
  - Create a simple landing page or section showcasing user testimonials
  - Share user-generated content (with permission) — screenshots of created tracks, meditation streaks
  - Consider a Reddit presence in r/meditation, r/mindfulness (provide value, not spam)

### Week 11–12: Measurement, Iteration & Advanced SEO

- [ ] **Review Google Search Console data**
  - Identify which queries are driving impressions and clicks
  - Find "low-hanging fruit" queries where you rank positions 8–20 and optimize for them
  - Check for any crawl errors or mobile usability issues

- [ ] **Review GA4 data**
  - Identify top-performing pages and content
  - Track App Store click-through rate from the website
  - Understand user flow: which pages do visitors see before clicking the App Store link?

- [ ] **Publish 4 more blog posts** based on search data insights
  - Target queries that showed impressions but low clicks
  - Create content that directly answers questions people are searching

- [ ] **Add schema markup to blog posts**
  - Article schema for each blog post
  - BreadcrumbList schema for navigation
  - Consider HowTo schema for tutorial-style posts

- [ ] **Explore local SEO (if relevant)**
  - Create a Google Business Profile for Pentridge Media LLC
  - This can help with branded searches and adds credibility

---

## Key Metrics to Track

| Metric | Tool | Target by Day 90 |
|--------|------|-------------------|
| Organic search impressions | Google Search Console | 5,000+/month |
| Organic clicks to website | Google Search Console | 500+/month |
| Website → App Store clicks | GA4 event tracking | 15%+ CTR |
| Indexed pages | Google Search Console | 10+ pages indexed |
| Domain referring domains | Ahrefs/Moz (free tier) | 15+ referring domains |
| Average page load speed | PageSpeed Insights | 90+ mobile score |
| App Store keyword rankings | App Store Connect / ASO tool | Top 50 for 5+ keywords |

---

## Target Keywords

### Primary (High Intent)
- meditation music app
- AI meditation music
- personalized meditation music
- custom meditation soundscapes
- meditation music generator

### Secondary (Informational)
- how to meditate with music
- best meditation music styles
- binaural beats for meditation
- ambient music for mindfulness
- meditation timer app iOS

### Branded
- still app
- still meditation
- still meditation app
- pentridge media still

---

## Quick Wins (Do This Week)

1. Set up Google Search Console and submit the sitemap
2. Switch from hash routing to path-based routing
3. Register a custom domain
4. Add GA4 tracking with App Store click events
5. Compress hero images and add proper alt text

---

*Plan created March 12, 2026 — Pentridge Media LLC*
