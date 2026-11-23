# Resolvia Technical + On-Page SEO Audit

**Scope:** Full static site at `C:\CODE\theresolvia-com` (raw HTML, no site files edited).
**Date:** 2026-11-24.
**Method:** Direct inspection of `robots.txt`, `sitemap.xml`, `netlify.toml`, `index.html`, all service/for/blog/work pages, all five product pages (root and directory copies), and HTTP checks against the local preview on port 3000. JSON-LD was detected by reading raw HTML source, so the skill's `web_fetch`-strips-scripts caveat does not apply here. All 18 JSON-LD blocks across 17 files were parsed and are syntactically valid.

**Data limits:** No Search Console, Analytics, PageSpeed Insights, or third-party crawler data was accessed. Core Web Vitals comments below are markup-based risk indicators only, not field measurements. Production redirects beyond `netlify.toml` were not tested. The UTF-8 middle dot in the homepage title is correct and was not treated as an issue.

---

## Executive Summary

**Overall health: mixed.** The marketing hub pages (homepage, `services/`, `for/`, `work/`, `blog/`) share a consistent, mostly sound template: self-referencing canonicals, one H1 each, a valid JSON-LD graph, mobile viewport, HTTPS with HSTS and www/HTTP redirects. The weak areas are concentrated in three places: the international layer, the product/tool pages, and URL duplication caused by two copies of every product page plus `status = 200` rewrites.

**Top priority issues**

1. **Super Search has no indexable identity of its own.** Its title and meta description are copies of the homepage, its canonical points to the homepage, the root copy carries `noindex, nofollow`, and `robots.txt` disallows that root file. P1.
2. **Hreflang is incomplete and contradictory.** It appears on only 9 of 31 site HTML files, uses `?lang=` query parameters, the `fr`/`pt` targets return byte-identical English HTML, and the Super Search canonical is not a member of its own hreflang set. P1.
3. **Copilot has no canonical, no hreflang, and no structured data.** The other four product pages also have no JSON-LD and are absent from the sitemap. P1/P2.
4. **Duplicate URLs are served at 200.** `/mcp`, `/mcp/`, `/mcp.html`, `/super-search`, `/super-search.html`, `/super-search/`, `/blog`, `/blog.html`, `/work`, `/work/` all returned 200 locally, and `netlify.toml` deliberately uses `status = 200` rewrites. P2.
5. **Core Web Vitals and content risks on hero/product markup.** The first homepage content image is `loading="lazy"` despite `fetchpriority="high"`, loaded from a third-party host with no preconnect; product pages have 16-157 visible words and widespread empty image alt text. P2.

**Quick wins already identified:** add the five product pages to the sitemap; add a canonical to Copilot; drop the `noindex` from `super-search.html` once a real canonical is chosen; align the `pt-BR` parameter with its URL; give the product images descriptive alt text; trim the seven blog titles over 84 characters; fix seven dead links in the MCP pages.

---

## Technical SEO Findings

### T1. Super Search is canonicalized to the homepage and blocked in two places

- **Issue:** `super-search.html` and `super-search/index.html` both use the homepage title, homepage meta description, and a canonical pointing at the homepage root. The root file also carries `noindex, nofollow`, and `robots.txt` disallows that path. The directory copy has no `noindex` but still cross-canonicals to the homepage, so neither URL can rank as a distinct product page.
- **Impact:** High
- **Evidence:**
  - `super-search.html:11` and `super-search/index.html:2`: `<link href="https://theresolvia.com" rel="canonical"/>`, title `RESOLVIA · High-Retention Video Editing Agency & Creative Studio`, description `Resolvia is an elite video editing agency…`.
  - `super-search.html:417`: `<meta name="robots" content="noindex, nofollow">`.
  - `robots.txt:23`: `Disallow: /super-search.html`.
  - `index.html:12`: canonical `https://theresolvia.com/` (with slash), a different string from the Super Search canonical.
  - Local HTTP: `/super-search`, `/super-search.html`, `/super-search/` all 200 with the same 250,123-byte body.
- **Fix:** Decide whether Super Search is an independent, indexable product page. If yes: give it its own title/description, a self-referencing canonical matching the served URL (one slash convention), remove the `noindex` and the `robots.txt` disallow, add it to the sitemap, and deduplicate the homepage sections it currently copies. If it is intentionally an app shell, keep the canonical but make the intent explicit with a 301 from the alternate paths rather than a `noindex` plus disallow split.
- **Priority:** P1 (Critical)

### T2. Hreflang cluster is incomplete, query-param based, and internally inconsistent

- **Issue:** Only the homepage and the four product page pairs (9 of 31 site HTML files) carry hreflang. None of the 4 service pages, 3 audience pages, 7 blog posts, blog index, work page, or trust pages do. Locale alternates use `?lang=fr` and `?lang=pt`, which the skill flags as the least recommended URL structure. The `fr` and `pt` targets serve the identical English HTML, so there are no genuine localized pages. On the Super Search pages the canonical URL (`https://theresolvia.com`, no slash) is not present in the hreflang set, which by Google's rules invalidates that annotation cluster.
- **Impact:** High
- **Evidence:**
  - `index.html:12`: four alternates — `hreflang="en"` → `https://theresolvia.com/`, `hreflang="fr"` → `https://theresolvia.com/?lang=fr`, `hreflang="pt-BR"` → `https://theresolvia.com/?lang=pt`, `hreflang="x-default"` → `https://theresolvia.com/`.
  - `super-search.html:11` / `super-search/index.html:2`: `hreflang="en"` → `https://theresolvia.com` (no slash), so the canonical URL is absent from the set that uses the slash.
  - Zero `hreflang` occurrences in `services/*/index.html`, `for/*/index.html`, `blog/*/index.html`, `work/index.html`, `blog.html`, `careers.html`, `security.html`, `terms.html`, `privacy.html`.
  - Local HTTP: `/`, `/?lang=fr`, `/?lang=pt` all returned byte-identical 248,011-byte English HTML. No French or Portuguese body copy exists in any file.
  - `sitemap.xml:3` declares `xmlns:xhtml` but there are no `<xhtml:link>` elements anywhere in the file.
  - `?lang=pt` (param value) maps to `hreflang="pt-BR"` (region code), a mismatch that should be made consistent.
- **Fix:** Pick one locale strategy and apply it site-wide. Preferred: real subdirectories (`/fr/`, `/pt-br/`) with fully translated content, self-canonicals per locale, and a self-referencing `<xhtml:link>` for every URL in the XML sitemap. If translation is not funded, remove the hreflang tags and `?lang=` variants rather than maintaining annotations to duplicate English pages. At minimum, make the canonical URL a member of the hreflang set on every page, use valid reciprocal codes, keep slash conventions identical across canonical/hreflang/sitemap, and keep the `x-default` entry.
- **Priority:** P1 (Critical)

### T3. Copilot has no canonical, no hreflang, and no structured data

- **Issue:** Both Copilot files omit the canonical and hreflang links present on the other product pages, and no product page has JSON-LD. A page with no canonical and duplicate root/directory copies invites split indexing signals.
- **Impact:** Medium-High
- **Evidence:**
  - `copilot/index.html:2` and `copilot.html:2`: head contains title/description/OG/Twitter tags but no `rel="canonical"` and no `hreflang`.
  - JSON-LD scan: 0 blocks in `copilot.html`, `copilot/index.html`, `mcp.html`, `mcp/index.html`, `super-search.html`, `super-search/index.html`, `script-studio.html`, `script-studio/index.html`, `auto-editing.html`, `auto-editing/index.html`. By comparison `index.html:421` has exactly 1 block.
- **Fix:** Add a self-referencing canonical and the same hreflang set used by `/mcp` to both Copilot files, settle on one served URL per product, and add accurate `SoftwareApplication` / `WebApplication` JSON-LD only where the claims are visible on the page.
- **Priority:** P1 (Critical for canonicalization, Medium for schema)

### T4. Sitemap omits every product page and all hreflang alternates

- **Issue:** The sitemap contains 21 URLs (all `lastmod` 2026-11-21): homepage, work, blog index, 4 services, 3 audience pages, 7 blog posts, and 4 trust/careers pages. All five product pages are absent. The declared XHTML namespace is unused, so no locale alternates are exposed to crawlers via sitemap.
- **Impact:** Medium
- **Evidence:**
  - `sitemap.xml:2-3`: `xmlns:xhtml` declared, no `<xhtml:link>` child elements.
  - `sitemap.xml:5-138`: 21 `<loc>` entries; no `/super-search`, `/mcp`, `/copilot`, `/script-studio`, `/auto-editing`.
  - `sitemap.xml:7` etc.: every `lastmod` is `2026-11-21`.
  - Product files exist at `super-search/index.html`, `mcp/index.html`, `copilot/index.html`, `script-studio/index.html`, `auto-editing/index.html`.
- **Fix:** Add the canonical product URLs (one per product), add `<xhtml:link rel="alternate">` entries if hreflang is kept, and set `lastmod` to actual content-change dates rather than a bulk stamp.
- **Priority:** P2 (High-impact)

### T5. Multiple URL variants return 200 instead of consolidating

- **Issue:** Every product exists twice in the repo (root `.html` and `<dir>/index.html`) with the same metadata, and the hosting config rewrites clean URLs with `status = 200` rather than 301. The result is several live URLs per page with no HTTP-level consolidation.
- **Impact:** Medium
- **Evidence:**
  - File sizes show near-duplicate pairs: `mcp.html` 46,722 B vs `mcp/index.html` 52,567 B; `copilot.html` 50,561 B vs `copilot/index.html` 44,639 B; `auto-editing.html` 63,384 B vs `auto-editing/index.html` 63,338 B; `script-studio.html` 66,490 B vs `script-studio/index.html` 64,970 B; `super-search.html` 250,123 B vs `super-search/index.html` 194,977 B. Titles and canonicals inside each pair are identical.
  - Local HTTP: `/mcp`, `/mcp/`, `/mcp.html` → 200 with 46,722-byte body; `/auto-editing` and `/auto-editing/` → 200 with 63,384-byte body; `/blog` and `/blog.html` → 200 with 96,854-byte body; `/work` and `/work/` → 200 with 90,384-byte body.
  - `netlify.toml:23-123`: every "Clean URL redirect" uses `status = 200` (e.g. lines 24-27 `/blog` → `/blog.html`, lines 50-53 `/work` → `/work/index.html`).
- **Fix:** Choose one canonical path per page and 301 all variants to it. Convert the `status = 200` rewrites in `netlify.toml` to 301s where the target is the canonical URL, and remove or noindex the unused root/directory product copies so only one physical file is served.
- **Priority:** P2 (High-impact)

### T6. Trailing-slash conventions conflict across the site

- **Issue:** Product canonicals omit the trailing slash while every other canonical uses it. Because the physical product files live in directories, the served path and the declared canonical can disagree.
- **Impact:** Medium
- **Evidence:**
  - `mcp/index.html:2`, `script-studio/index.html:2`, `auto-editing/index.html:2`: `https://theresolvia.com/mcp`, `/script-studio`, `/auto-editing`.
  - `index.html:12`, `work/index.html:17`, `services/youtube-video-editing/index.html:17`, `for/creators/index.html:17`, `blog/*/index.html:17`: canonicals end in `/`.
  - `super-search/index.html:2` canonical is `https://theresolvia.com` (no slash, no path).
- **Fix:** Standardize on one form site-wide (trailing slash is consistent with the existing directory structure), make canonical, hreflang, sitemap `<loc>`, and internal `href` values match it, and 301 the other form.
- **Priority:** P2 (High-impact)

### T7. Seven dead internal links on the MCP pages

- **Issue:** The MCP navigation links to legal and tool paths that do not exist in the site and are not covered by a redirect.
- **Impact:** Medium
- **Evidence:**
  - `mcp/index.html:48` and `mcp.html:60` contain `href="/legal/cookies"`, `/legal/notice`, `/legal/privacy`, `/legal/sales`, `/legal/terms`, `/tools/tiktok-comment`, `/tools/tiktok-transcript`.
  - No `legal/` or `tools/` directory exists in the repo; `privacy.html`, `terms.html`, `security.html` exist instead. `netlify.toml:34-47` redirects `/privacy`, `/terms`, `/security`, not `/legal/*`.
- **Fix:** Point these links at the real pages (`/privacy.html`, `/terms.html`, `/security.html`) or build the linked destinations. Crawling a product page currently wastes budget on seven 404s.
- **Priority:** P2 (High-impact)

### T8. Core Web Vitals risks visible in static markup

- **Issue:** The likely LCP image is lazy-loaded, third-party hosted without a connection hint, and the pages carry very large inline CSS/JS payloads. Several decorative images request oversized source widths.
- **Impact:** Medium (markup risk, not a measured score)
- **Evidence:**
  - `index.html:601`: first content image has `fetchpriority="high"` **and** `loading="lazy"`, with `src="https://hqqnviehspjqnwekafzq.supabase.co/storage/v1/object/public/covers/thumbnails/instagram-3937212759827160425.jpg"` and `referrerpolicy="no-referrer"`. No `preconnect` to that host appears in the head (`index.html:12`).
  - `index.html:604` and `index.html:788`: images in 88px/110px slots offer `srcset` widths through `w=3840` and use `w=3840&q=75` as the `src` fallback.
  - Served HTML sizes: homepage 248,011 bytes; `super-search.html` 250,123 bytes; `blog.html` 96,854 bytes; `work/index.html` 90,384 bytes. `index.html` contains large inline `<style>` and `<script>` blocks (e.g. lines 12-420, 421-477, 805+).
  - `super-search/index.html:427`: same first content image uses `loading="eager"`, which is the safer pattern for an LCP candidate.
- **Fix:** Set `loading="eager"` (or remove `loading`) on the single LCP candidate, add `<link rel="preconnect" href="https://hqqnviehspjqnwekafzq.supabase.co" crossorigin>`, cap `srcset` widths to real display sizes, and measure with PageSpeed Insights before further JS/CSS work.
- **Priority:** P2 (High-impact)

### T9. Social share image points to a file that does not exist

- **Issue:** Every page declares `og:image` and `twitter:image` as `https://theresolvia.com/og-image.png`, but no such file is present anywhere in the repository.
- **Impact:** Low
- **Evidence:** `index.html:12`, `work/index.html:19-20`, all product page heads (line 2 or 11) contain `meta content="https://theresolvia.com/og-image.png" property="og:image"`; a recursive search for `*og*image*` returned no files.
- **Fix:** Add a 1200x630 image at that path (the declared width/height already match) or repoint the tags to an existing asset.
- **Priority:** P3 (Quick win once the asset exists)

---

## On-Page SEO Findings

### O1. Homepage H1 is visually hidden

- **Issue:** The only H1 on the homepage is `sr-only`; the large visible hero headline is styled text rather than a heading. Screen-reader and crawler H1 is present, but the visible page has no heading at the top of the document.
- **Impact:** Low-Medium
- **Evidence:** `index.html:578` — `<h1 class="sr-only">Resolvia — High-Retention Video Editing Agency &amp; Creative Studio</h1>`. Heading scan: 1 H1, 4 H2, 0 H3 on the page.
- **Fix:** Prefer making the visible hero headline the H1 (or converting the sr-only H1 into the actual hero heading) so title, H1, and above-the-fold copy align.
- **Priority:** P3 (Quick win)

### O2. Product pages lack useful server-rendered headings

- **Issue:** The app-style product pages have little or no crawlable heading structure. Auto Editing has no heading at all, Copilot's H1 is a chat-input placeholder, and Script Studio's H1 omits the product name.
- **Impact:** Medium
- **Evidence:**
  - `auto-editing/index.html` and `auto-editing.html`: heading scan returned 0 `<h1>`, 0 `<h2>`, 0 `<h3>`; visible text ≈16 words.
  - `copilot/index.html:2` and `copilot.html`: 1 H1 whose text is `How can I help you today?`; 0 H2, 0 H3; visible text ≈36 words.
  - `script-studio/index.html:479`: H1 `Create viral scripts from viral videos`; title is `Script Studio · Resolvia`; 0 H2/H3; visible text ≈24 words.
  - `mcp/index.html:60`: H1 `Turn your Claude into a views machine`; 1 H2, 3 H3; visible text ≈157 words.
- **Fix:** Add one descriptive H1 per product naming the product and its job, plus a short server-rendered intro paragraph and at least one H2. Keep the app UI intact; this is additive markup.
- **Priority:** P2 (High-impact)

### O3. Title tags: several far beyond display width, product titles too generic

- **Issue:** Seven blog titles and three service/audience titles exceed 60 characters and will truncate in results. Conversely the product titles are so short and generic that they carry little query relevance.
- **Impact:** Medium
- **Evidence (character counts from raw `<title>` values):**
  - `blog/b2b-saas-video-production-acquisition-guide/index.html:15` — 113 chars.
  - `blog/video-editing-cost-pricing-guide/index.html:15` — 113 chars.
  - `blog/what-makes-a-good-short-form-video-editor/index.html:15` — 92 chars.
  - `blog/agency-vs-freelance-video-editor/index.html:15` — 90 chars.
  - `blog/2026-thumbnail-psychology-playbook/index.html:15` — 87 chars.
  - `blog/white-label-video-editing-agency-guide/index.html:15` — 85 chars.
  - `blog/how-to-improve-youtube-retention/index.html:15` — 84 chars.
  - `services/video-ad-editing/index.html:15` — 73; `services/short-form-video-editing/index.html:15` — 71; `index.html:12` — 68; `for/agencies/index.html:15` — 67; `work/index.html:15` — 66.
  - `mcp/index.html:2` — 14 chars (`MCP · Resolvia`); `auto-editing/index.html:2` — 23; `script-studio/index.html:2` — 24; `copilot/index.html:2` — 27.
- **Fix:** Move the primary query into the first 50 characters, drop redundant `· Resolvia Studio` tails on the long blog titles, and expand product titles to `[Product] for [Job] | Resolvia` patterns. Do not change slugs.
- **Priority:** P2 (High-impact)

### O4. Meta descriptions are inconsistently sized

- **Issue:** Descriptions range from 91 to 183 characters. Product, terms, security, careers and privacy descriptions are under 120; many blog and service descriptions exceed 160.
- **Impact:** Low
- **Evidence:** `terms.html:16` (91), `mcp/index.html:2` (112), `privacy.html:16` (114), `security.html:16` (118), `careers.html:16` (117), `auto-editing/index.html:2` (116), `copilot/index.html:2` (110), `script-studio/index.html:2` (109), `blog.html:16` (132), `index.html:12` (145); `blog/b2b-saas-video-production-acquisition-guide/index.html:16` (183), `for/agencies/index.html:16` (172), `blog/white-label-video-editing-agency-guide/index.html:16` (169), `blog/video-editing-cost-pricing-guide/index.html:16` (168), `services/youtube-video-editing/index.html:16` (176).
- **Fix:** Rewrite unique 150-160 character descriptions with the primary keyword and a reason to click, prioritising the product pages and the highest-value blog posts.
- **Priority:** P3 (Quick win)

### O5. Empty image alt text on five product page pairs

- **Issue:** Marketing pages use descriptive alt text (homepage 48/48 images), but product pages leave most alts empty, including meaningful UI and content images.
- **Impact:** Medium
- **Evidence:**
  - `mcp/index.html:48`: 12 `<img>` elements, all with `alt=""`.
  - `super-search/index.html:427` and `super-search.html:541`: 40 of 46/47 images have `alt=""`.
  - `copilot/index.html:2`: 2 of 2 images have `alt=""`.
  - `script-studio/index.html:2`: 1 of 1 image has `alt=""`.
  - `auto-editing/index.html:2`: 1 of 1 image has `alt=""`.
  - Decorative images that are correctly `aria-hidden="true"` (e.g. `mcp.html:60` world-dots background) are acceptable; the issue is the images without that designation.
- **Fix:** Describe content images, use `alt=""` only with `aria-hidden="true"` or where the adjacent text already conveys the same meaning. Prioritise the Super Search grid, which has 40 empty alts.
- **Priority:** P2 (High-impact)

### O6. FAQ structured data does not match the visible FAQ

- **Issue:** The homepage FAQPage graph contains three questions; the visible FAQ section contains six different questions, and none of the schema strings match the visible wording. FAQ rich results are retired, so this offers no rich-result upside either.
- **Impact:** Medium (accuracy/trust signal)
- **Evidence:**
  - Schema questions at `index.html:457` (`What is Resolvia's turnaround time for video edits?`), `index.html:465` (`What editing software and post-production pipelines do you use?`), `index.html:473` (`How does Resolvia protect unreleased footage and raw rushes?`) inside the single JSON-LD block starting at `index.html:421`.
  - Visible questions at `index.html:710` (`What is Resolvia?`), `:724` (`What tools do you edit with?`), `:738` (`Which platforms do you cover?`), `:752` (`What is your turnaround time?`), `:766` (`Do you offer revisions?`), `:780` (`How do we get started?`) under the H2 at `index.html:699`.
  - The same mismatch pattern is worth checking on the three blog posts and two service pages whose JSON-LD includes `FAQPage` (all blocks parsed OK syntactically).
- **Fix:** Either rewrite the JSON-LD to mirror the visible questions and answers exactly, or remove the FAQPage nodes. Only mark up content visibly present on the page.
- **Priority:** P2 (High-impact)

### O7. Heading level skip on the careers page

- **Issue:** The only heading sequence anomaly in the site: H1 followed directly by H3, with no H2.
- **Impact:** Low
- **Evidence:** `careers.html:321` `<h1 class="careers-title">Join the Resolvia Editor Roster</h1>`; `careers.html:390` `<h3>Ready to Edit with Resolvia?</h3>`. No `<h2>` anywhere in the file.
- **Fix:** Change the H3 to H2.
- **Priority:** P3 (Quick win)

---

## Content Findings

### C1. Product page content is thin in server-rendered HTML

- **Issue:** The five product pages are effectively app shells. Their unique, crawlable text is minimal, so even if indexing is fixed they have little to rank on.
- **Impact:** High (for those pages)
- **Evidence:** Approximate visible-word counts after stripping `<script>`, `<style>` and tags: `auto-editing/index.html` 16, `script-studio/index.html` 24, `copilot/index.html` 36, `mcp/index.html` 157. Compare `services/youtube-video-editing/index.html` 889, `blog.html` 790, `blog/video-editing-cost-pricing-guide/index.html` 671, `index.html` 649, `work/index.html` 562.
- **Fix:** Add server-rendered intro/section copy for each product: what it does, who it is for, the input and output, and links to the related service page. Keep the app UI as-is.
- **Priority:** P2 (High-impact)

### C2. Super Search duplicates homepage sections

- **Issue:** Beyond duplicated metadata, the Super Search pages reproduce homepage sections verbatim, including the same thumbnail grid and FAQ heading. This reinforces the cross-canonical signal that it is a copy rather than a distinct page.
- **Impact:** Medium-High
- **Evidence:** `super-search/index.html:2` vs `index.html:12` (identical title/description); `super-search/index.html:427` vs `index.html:601` (both `<h2>Featured Client Edits</h2>` and the same `instagram-3937212759827160425.jpg` Supabase source); `super-search/index.html:525` vs `index.html:699` (both `<h2>Questions, answered.</h2>`). `super-search.html:541` repeats the same grid in the root copy.
- **Fix:** Replace the borrowed homepage sections with Super Search-specific copy, screenshots and FAQs, then self-canonicalise the page.
- **Priority:** P2 (High-impact)

### C3. Work page promises more than it shows

- **Issue:** The meta description advertises 41+ featured case studies while the page contains four detailed case-study blocks.
- **Impact:** Medium
- **Evidence:** `work/index.html:16` (and OG/Twitter descriptions at `:19`, `:25`): `Explore 41+ featured video editing case studies…`. Visible case-study H2s at `work/index.html:444`, `:470`, `:497`, `:523` (four entries), plus a CTA H2 at `:545`. The "41+" figure is a verified brand proof point, but the page does not deliver 41 case studies.
- **Fix:** Either change the description to describe the four breakdowns shown, or add the remaining case studies / a link to a full archive so the promise matches the page.
- **Priority:** P2 (High-impact)

### C4. Product pages are orphaned from the marketing site's navigation

- **Issue:** The global nav/footer on the homepage, services, audience, blog and work pages does not link to `/mcp`, `/copilot`, `/script-studio`, `/super-search` or `/auto-editing` as destinations. The only product links from marketing pages are deep `/auto-editing?new=1&template=...` launch links on the homepage and Super Search. Product-to-product links exist only inside the MCP pages.
- **Impact:** Medium
- **Evidence:** Unique internal `href` sets: `index.html` (69) contains `/services/*`, `/for/*`, `/blog*`, `/work/`, `/careers.html`, `/privacy.html`, `/security.html`, `/terms.html`, and 30+ `/auto-editing?new=1&template=...` deep links, but no `/mcp`, `/copilot`, `/script-studio`, `/super-search` marketing links. Same 27-href pattern on `work/index.html`, `services/youtube-video-editing/index.html`, `for/creators/index.html` and `blog/video-editing-cost-pricing-guide/index.html`. `mcp/index.html:48` links to `/super-search`, `/copilot`, `/script-studio?new=1`, `/mcp`, `/auto-editing?new=1`.
- **Fix:** Add descriptive product links from at least three strong existing pages (homepage, blog index, relevant service page) with anchor text naming the product and its job, per the rankings-push new-page checklist.
- **Priority:** P2 (High-impact)

### C5. Three blog posts are only reachable from the blog index

- **Issue:** The global footer links four blog posts; the remaining three appear only on `blog.html`. They are still one click from the homepage, so this is a modest internal-linking gap rather than an orphan problem.
- **Impact:** Low
- **Evidence:** Global link set (27 hrefs, repeated on `work/index.html`, service and audience pages) includes `/blog/agency-vs-freelance-video-editor/`, `/blog/how-to-improve-youtube-retention/`, `/blog/video-editing-cost-pricing-guide/`, `/blog/what-makes-a-good-short-form-video-editor/` only. `blog.html` additionally links `/blog/white-label-video-editing-agency-guide/`, `/blog/2026-thumbnail-psychology-playbook/`, `/blog/b2b-saas-video-production-acquisition-guide/`. All seven are in `sitemap.xml:71-94` and `:121-138`.
- **Fix:** Cross-link the three posts from related service/audience pages with descriptive anchors.
- **Priority:** P3 (Quick win)

---

## Prioritized Action Plan

### 1. Critical fixes (blocking indexation/ranking)

1. Resolve the Super Search identity: unique title/description, self-canonical with one slash convention, remove `noindex` at `super-search.html:417`, remove the `robots.txt:23` disallow, and 301 the alternate paths. (T1, T6)
2. Rebuild the hreflang layer: either real translated subdirectories with sitemap alternates, or remove all hreflang and `?lang=` variants. Ensure the canonical URL is in every hreflang set. (T2)
3. Add a self-referencing canonical and hreflang set to both Copilot files. (T3)
4. Add all five product pages to `sitemap.xml` with accurate `lastmod` dates. (T4)
5. Fix the seven dead `/legal/*` and `/tools/*` links on the MCP pages. (T7)

### 2. High-impact improvements

6. Consolidate duplicate URLs: 301 the `status = 200` clean-URL rewrites in `netlify.toml:23-123`, and keep one physical file per product. (T5)
7. Fix the LCP image: `loading="eager"`, supabase preconnect, capped `srcset` widths. Validate with PageSpeed Insights. (T8)
8. Add server-rendered headings and intro copy to the five product pages. (O2, C1)
9. Add descriptive alt text to product-page images, starting with the 40 empty alts on Super Search. (O5)
10. Rewrite the homepage FAQ JSON-LD to match the six visible questions, and audit the FAQ nodes on the blog/service pages. (O6)
11. Replace copied homepage sections on Super Search with product-specific content. (C2)
12. Align the work page description with the four case studies actually published. (C3)
13. Link the product pages from at least three strong marketing pages. (C4)
14. Shorten the seven over-length blog titles and the three long service/audience titles. (O3)

### 3. Quick wins

15. Change `careers.html:390` from H3 to H2. (O7)
16. Make the homepage hero headline the H1 instead of relying on the `sr-only` H1 at `index.html:578`. (O1)
17. Add the missing `og-image.png` (1200x630) or repoint the OG/Twitter tags. (T9)
18. Bring meta descriptions into the 150-160 range, starting with the product pages and terms/security/careers. (O4)
19. Change `?lang=pt` to a value consistent with `pt-BR` if the query-param approach is kept temporarily. (T2)
20. Cross-link the three underlinked blog posts. (C5)

### 4. Long-term recommendations

21. Move to a documented keyword map so the service pages, audience pages, blog posts and product pages do not compete for the same queries; review the striking-distance workflow from `rankings-push.md` once Search Console data is available.
22. Publish genuinely translated locale pages only where there is search demand, then move hreflang into the XML sitemap at scale.
23. Reduce inline CSS/JS payloads on the 250 KB product/homepage shells and move non-critical CSS out of the head, measuring before and after.
24. Add visible breadcrumbs on service, audience and blog pages (the JSON-LD already declares `BreadcrumbList` there).
25. Set up a recurring crawl to catch new duplicate paths, dead links and metadata drift; this audit was a point-in-time static review.
26. Validate schema with the Rich Results Test once pages are published; note that FAQ and HowTo rich results are retired, so prioritise `Organization`, `WebSite`, `Service`, `Article`, `CollectionPage` and accurate `SoftwareApplication` markup instead.

---

## Top 5 Findings (summary)

1. **Super Search cannot rank on its own** — homepage metadata, cross-canonical to `/`, `noindex` on the root copy, and a `robots.txt` disallow (`super-search.html:11,417`; `robots.txt:23`).
2. **Hreflang is largely inert** — only 9 files carry it, targets are untranslated English served via `?lang=`, and the Super Search canonical is missing from its own hreflang set (`index.html:12`; `super-search/index.html:2`).
3. **Copilot lacks a canonical, hreflang and any JSON-LD** (`copilot/index.html:2`), and all five product pages lack structured data.
4. **Duplicate URLs are served at 200** across root/dir product files and clean-URL rewrites (`netlify.toml:23-123`), splitting signals.
5. **Product pages are thin and visually unoptimised for crawling** — 16-157 visible words, no H1 on Auto Editing, and up to 40 empty image alts on one page — while the homepage LCP image is lazy-loaded from an unpreconnected third-party host (`index.html:601`).
