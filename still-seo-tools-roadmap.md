# Still SEO Tools Roadmap

Updated: May 18, 2026

## Current Read

GA4 events are wired, but traffic is not meaningful yet. Search Console has received indexing submissions, but most new URLs are still waiting on Google indexing. Uprank is handling blog production, so Still-owned SEO work should focus on interactive tools and technical/page quality.

## Jono Catliff SEO Takeaways To Apply

- Build pages only after validating keywords with real SEO data, not model guesses.
- Prefer low-difficulty, meaningful-volume keywords with clear intent.
- Use tool/service-style pages for "money" or high-action searches, and blog posts for topical authority.
- Reverse-engineer the top ranking pages before writing or building: structure, headings, format, word count, FAQ patterns, and page intent.
- Make pages genuinely useful and readable. Thin AI pages are not enough.
- Use static generation, sitemap, robots.txt, strong metadata, Lighthouse quality, schema, internal links, and measured publishing cadence.
- Avoid low-quality backlink schemes and PBNs. Favor useful content, guest posts, legitimate mentions, and real partnerships.

## First DataForSEO Tool Keyword Pull

Source: DataForSEO Google Ads Search Volume, United States, English.

| Keyword | Volume | Competition | CPC | Priority |
|---|---:|---|---:|---|
| white noise generator | 4,400 | LOW | 1.65 | High |
| meditation timer | 2,400 | LOW | 1.92 | High |
| pink noise generator | 1,000 | LOW | 1.16 | High |
| brown noise generator | 1,000 | LOW | 1.28 | High |
| binaural beats generator | 880 | LOW | 3.55 | High |
| body scan meditation script | 590 | LOW | 7.92 | Medium |
| breathing timer | 390 | LOW | 7.14 | High |
| box breathing timer | 170 | LOW | 1.32 | Medium |
| 4 7 8 breathing timer | 110 | LOW | 2.06 | Medium |
| ambient music generator | 90 | LOW | 2.35 | Medium |
| mindfulness timer | 50 | MEDIUM | 1.65 | Low |
| breathing exercise timer | 40 | LOW | 7.86 | Low |
| soundscape generator | 40 | LOW |  | Low |
| sleep sounds generator | 30 | HIGH | 0.81 | Low |
| meditation music generator | 10 | MEDIUM | 1.85 | Already live, improve later |
| sleep music generator | 10 | LOW |  | Low |

Several seed ideas returned no volume in this pull: meditation prompt generator, focus music generator, meditation style quiz, sleep routine builder, meditation routine builder, guided meditation script generator.

## Recommended Build Order

1. **Meditation Timer**
   - URL: `/tools/meditation-timer`
   - Intent: broad, high volume, directly aligned with app behavior.
   - Features: duration presets, interval bell, ambient background selector, session label, App Store CTA.

2. **White Noise Generator**
   - URL: `/tools/white-noise-generator`
   - Intent: high volume and simple utility.
   - Features: white/pink/brown noise modes, volume, timer, sleep/focus presets, explanation of noise colors.

3. **Binaural Beats Generator**
   - URL: `/tools/binaural-beats-generator`
   - Intent: strong volume and CPC.
   - Features: target state selector, carrier frequency, beat frequency, safety note, timer, app CTA.

4. **Breathing Timer**
   - URL: `/tools/breathing-timer`
   - Intent: good volume and high CPC.
   - Features: box breathing, 4-7-8, coherent breathing, custom inhale/hold/exhale, visual animation.

5. **Body Scan Meditation Script**
   - URL: `/tools/body-scan-meditation-script`
   - Intent: strong volume and high CPC, but less "tool" and more generator/template.
   - Features: duration, tone, body focus, generated script, copy/download.

6. **Pink Noise Generator**
   - URL: `/tools/pink-noise-generator`
   - Intent: high volume, can share engine with white noise generator.
   - Features: standalone page or canonical sub-tool depending on SERP research.

7. **Brown Noise Generator**
   - URL: `/tools/brown-noise-generator`
   - Intent: high volume, can share engine with white noise generator.
   - Features: standalone page or canonical sub-tool depending on SERP research.

## Tool Page Template

Each tool page should include:

- One clear interactive tool above the fold.
- H1 exactly matching the main keyword or a close natural variant.
- Metadata built for CTR, not just keyword stuffing.
- 600-1,200 words of support copy below the tool.
- FAQ section with 4-8 questions.
- `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` schema where appropriate.
- Internal links to Still blog posts and other tools.
- App Store CTA after tool use, not only in the header.
- GA4 events for tool start, setting changes, completion/copy/download, and App Store click.
- Static prerendered HTML in `dist/public`.

## Research Still Needed

Do not block the first few builds on this, but complete it before scaling.

- Pull keyword variations for the top 5 tool ideas, not only exact-match seed volume.
- Check SERPs for each top tool keyword to see whether Google rewards simple utilities, articles, calculators, videos, or large tool sites.
- Identify keyword difficulty or proxy difficulty through SERP strength, since the first DataForSEO pull only gave Google Ads competition.
- Cluster keywords into one page vs separate pages. Example: white/pink/brown noise may deserve separate pages if SERPs differ enough.
- Use the SEO course/transcript workflow to create a reusable tool-page SOP.

## Next Action

Build `/tools/meditation-timer` first, then reuse the same tool-page structure for noise and breathing tools.
