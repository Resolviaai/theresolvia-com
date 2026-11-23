# AI Search / AEO / GEO Readiness Audit - Resolvia

**Date:** 2026-11-24
**Type:** Read-only audit. No site file was edited by this agent.
**Repo:** `C:\CODE\theresolvia-com`
**Skill:** `ai-seo` v2.12.7 + references `agent-readiness.md`, `content-patterns.md`, `platform-ranking-factors.md`, `content-types.md`.

## Scope and snapshot caveat

Files inspected: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `pricing.md`, `indexnow.json`, `index.html`, `blog.html`, `work/index.html`, all 4 service pages, all 3 audience pages, all 7 blog posts, the 5 product/tool pages in both flat (`.html`) and directory (`/index.html`) form, plus `security.html`, `careers.html`, `privacy.html`, `terms.html`, `super-search.html`, `mcp.html`, `copilot.html`, `script-studio.html`, `auto-editing.html`.

Other agents were editing site files during this audit. `git status` showed modifications to `robots.txt`, `sitemap.xml`, `index.html`, `blog.html`, `mcp.html`, `super-search.html`, and several service pages, and new untracked files `pricing.md`, `services.md`, `company.md`. `llms-full.txt` was regenerated from a stale duplicate into a full fact sheet while this report was being written. Findings below reflect the **latest state observed at the time of writing**, not the original baseline in the shared brief. Several baseline weaknesses (robots allowlist, missing product URLs in the sitemap, missing `pricing.md`, stale `llms-full.txt`) have already been corrected by concurrent work. Re-verify those items after all waves land.

No live AI engine was queried. No AI citation, traffic, or ranking statistic in this report is presented as a Resolvia result.

## Read this first: Google vs everyone else

Google's official [AI features optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says AI Overviews and AI Mode need **no special markup, AI file, or markdown variant**. It says to write for people, use normal headings and paragraphs, not to chunk content for AI, and to measure impressions in Search Console's Generative AI performance report. Strong E-E-A-T and core Search fundamentals are the whole game there. FAQ and HowTo rich results are retired, so FAQPage/HowTo schema must not be sold as a Google rich-result win.

ChatGPT, Perplexity, Claude, Copilot and autonomous buying agents behave differently: they reward extractable passages, FAQs, comparison tables, definition blocks, `llms.txt`, and machine-readable pricing when present. Every structural recommendation below helps those engines and does not harm Google. Treat `llms-full.txt`, `pricing.md`, OKF and WebMCP as emerging conventions, not ranking signals. `Google-Extended` controls certain Gemini training/grounding uses and does **not** affect Google Search inclusion or ranking.

---

## AI Visibility Audit

### Step 1: Check AI answers for key queries - NOT VERIFIABLE FROM THIS REPO

This step requires live engines and an account. It was not performed; nothing is invented. The following query set should be run 3-5 times per platform (ChatGPT, Perplexity, Google AI Overviews/Mode, Claude/Brave, Copilot/Bing), recording the cited URL each time and a mention *rate*, not a single anecdote.

| Stage | Prompt | Why it matters |
|---|---|---|
| Problem-aware | How do I stop viewers leaving in the first 30 seconds of a YouTube video? | Retention guide |
| Problem-aware | My podcast video gets low views. Should I cut vertical clips? | Podcast service |
| Solution-aware | What is retention-edited video editing? | Definition gap |
| Solution-aware | Best video editing agency for YouTube creators 2026 | Shortlist intent |
| Solution-aware | White label video editing for marketing agencies | Agency segment |
| Product-aware | Resolvia vs freelance video editor | Comparison page |
| Product-aware | Is Resolvia good for B2B SaaS product demos? | Segment page |
| Most aware | Resolvia pricing | Machine-readable pricing |
| Most aware | Does Resolvia use Frame.io and DaVinci Resolve? | Capability facts |
| Most aware | How fast is Resolvia's turnaround? | Conflicting fact (see P0-3) |
| Product/tool | Resolvia MCP / Super Search / Script Studio / Auto Editing | Thin JS pages |
| Trust | Is Resolvia's footage secure? | Security page |

`[NEED: manual prompt log with dates, sample sizes, and cited URLs]`

### Step 2: Analyze citation patterns - NOT VERIFIABLE FROM THIS REPO

`[NEED: AI visibility tool (Peec/Otterly/ZipTie/Profound) or a manual log]`. When competitors are cited and Resolvia is absent, check their answer blocks, authority signals, freshness, schema and third-party presence before adding pages.

### Step 3: Content extractability check

| Check | Result | Evidence |
|---|---|---|
| Clear definition in first paragraph | Partial | All 4 service pages open a "What is X?" / role definition paragraph (e.g. `services/short-form-video-editing/index.html` 48-word definition). Blog posts use a "Direct Answer Overview" box. Homepage has only a short value-prop line and an `sr-only` H1. Three tool pages have essentially no definition text. |
| Self-contained 40-60 word answer blocks | Partial | All 7 blog posts carry `section.aeo-box` with direct answers of roughly 41-63 words; 4 work case studies have 39-60 word paragraphs; most service pages have 1 such paragraph. Homepage: 0 of 22 `<p>` blocks fall in the 35-70 word range. Work on more service/audience pages. |
| Statistics with sources cited | **Fail** | No visible "according to", `Source:`, or external authority link anywhere on the site. External links are social only (X, LinkedIn, YouTube, Instagram). Unsourced figures include 50M+ views, +48.2% retention lift across 80+ uploads, 80K to 850K subscribers, 10x engagement, 60-70% of production time, 35M+ Shorts views. These may be true first-party claims, but without method/date/source they are weak citation bait. |
| Comparison tables | Partial | `blog/video-editing-cost-pricing-guide/index.html` has 1 pricing table; `blog/agency-vs-freelance-video-editor/index.html` has 1 comparison matrix. No tables on service or audience pages. |
| FAQ with natural-language questions | Partial | Homepage 6 Q&A, YouTube service 4, Short-form service 3, pricing guide 2, retention guide 1, agency-vs-freelance guide 2. Zero on the other 4 blog posts, both remaining service pages, and audience pages. |
| Schema markup | Partial | Homepage: Organization + WebSite + FAQPage (6 questions, now matching visible FAQ). Blog posts: Article + FAQPage on 3 of 7. Services: Service + FAQPage on 2 of 4. `work/index.html`: CollectionPage + VideoObject. No HowTo schema on the step-based retention guide; no FAQ on pages that have no Q&A (correct) but also none on pages that need Q&A. |
| Expert attribution | **Fail** | All 7 blog bylines are "By Resolvia Editorial Team" or "By Resolvia Studio Team"; JSON-LD `author` is `@type: Organization`. No named human with credentials, no expert quote with a title, no bio. |
| Recently updated | **Fail / conflicting** | Visible dates are 2026-01-15 to 2026-03-15 (8-10 months old at audit time). JSON-LD `dateModified` on 6 posts says `2026-11-21T12:00:00+00:00` while the visible "Updated" date says January-March. The pricing guide now has `dateModified: 2026-01-15`. These two signals contradict each other. |
| Headings match query patterns | Partial | Blog H1s are query phrased ("How Much Does...", "What Makes a Good...", "How to Improve..."). Service pages have "What is a Professional YouTube Video Editing Agency?" and "What is Short-Form Video Editing?". Homepage H2 is generic "Questions, answered."; product tool pages have no H2 at all. |
| AI crawler policy matches discovery/training goals | **Pass (current state)** | Current `robots.txt` uses one permissive wildcard for discovery and user-triggered fetchers, with a named group blocking GPTBot, ClaudeBot, Google-Extended, CCBot and meta-externalagent. See Step 4. |

### Step 4: AI bot access by purpose

| Bot / purpose | Current rule (`robots.txt`) | Assessment |
|---|---|---|
| `OAI-SearchBot` (ChatGPT search discovery) | Wildcard `Allow: /` | Correct |
| `PerplexityBot` (Perplexity discovery) | Wildcard `Allow: /` | Correct |
| `Claude-SearchBot`, `meta-webindexer`, conventional search crawlers | Wildcard `Allow: /` | Correct; not named, so they inherit the wildcard |
| `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `meta-externalfetcher` (user-triggered) | Wildcard `Allow: /`; not named explicitly | Correct approach; vendor docs note these may not consult robots.txt anyway |
| `GPTBot`, `ClaudeBot`, `meta-externalagent` (potential training) | Named group `Disallow: /` | Deliberate training opt-out; does not by itself block citations. Verify CDN/WAF separately |
| `Google-Extended` (Gemini training/grounding token) | Named group `Disallow: /` | Deliberate opt-out; does not affect Google Search inclusion or AI Overviews |
| `CCBot` | Named group `Disallow: /` | Publisher choice; note this can remove a corpus some answer engines reuse |
| Content-usage statements (train/cite/summarize) | Absent | Optional emerging convention; could be added as comments in `robots.txt` |

**Important robots mechanics:** a named group *replaces* the wildcard rules for that bot. The current file puts every disallowed bot in one named group and leaves all discovery bots on the wildcard, which is the correct pattern. The earlier baseline (named groups that only had `Allow` lines for GPTBot/ClaudeBot/etc.) silently let those bots into `/scratch/` and `/temp_*` because they no longer inherited the wildcard disallows. That specific exposure is now fixed.

**Not verifiable from the repo:** CDN/WAF behaviour, actual HTTP status codes for agent user agents, Bing/Brave indexing. `[NEED: curl checks with user-agent strings against the production domain; Bing Webmaster Tools and Brave submit-url confirmation]`

---

## Three Pillars

### Pillar 1 - Structure (make it extractable)

**Working well**
- Service and blog content is in the initial HTML as text. Stripping `<script>`, `<style>` and `<svg>` still leaves 350-909 visible words on service and blog pages; no pricing number depends on a JS toggle.
- Definition paragraphs are present and many land in the 40-60 word heuristic range.
- One `<main>` on all core pages; all images on core pages have `alt` values; heading order is H1 > H2 > H3 on the service pages.
- The `aeo-box` pattern on all 7 blog posts is a clean, engine-friendly direct-answer block.
- `llms-full.txt` has been rebuilt as a real 128-line fact sheet covering services, capabilities, pricing ranges, proof points, products, guides and common questions. It now delivers on the "Full context" link in `llms.txt`.

**Gaps**
1. **Tool pages are JS shells (AR-READ-01).** After stripping scripts/styles, visible text is: `auto-editing.html` 17 words, `script-studio.html` 24, `copilot.html` 92, `mcp.html` 201, `super-search.html` ~700. Most of what each tool does lives in the `<title>`, meta description, `llms.txt`, and client-side JS. An agent that never executes JS cannot learn what the product does. This also contradicts the `llms.txt` claims for these five products.
2. **Discovery files are orphaned.** No shipped HTML contains a link to `llms.txt`, `llms-full.txt`, `pricing.md`, `services.md` or `company.md`. Per the agent-readiness reference, 86-100% of visits to such files arrive via a link. `sitemap.xml` also omits them.
3. **Machine-readable files drift risk.** Both `llms.txt` and `llms-full.txt` are now accurate, but they are maintained by hand alongside `pricing.md`, `services.md`, `company.md`, `sitemap.xml` and `indexnow.json`. Any pricing or turnaround change now has to be propagated to at least eight files. A single-source generator or a release checklist is the durable fix.
4. **Duplicate flat/directory tool pages.** Both `super-search.html` and `super-search/index.html` (and the same for mcp, copilot, script-studio, auto-editing) ship. Canonicals were corrected for the first three during this audit, but `script-studio.html` and `auto-editing.html` canonicalise to `/script-studio` and `/auto-editing` (no trailing slash) while `sitemap.xml` lists trailing-slash URLs.
5. **Semantic HTML defects.** `script-studio.html` and `auto-editing.html` each contain two `<main>` elements; `auto-editing.html` has no H1. Several trust pages (`security.html`, `careers.html`, `privacy.html`, `terms.html`) have no `<section>` elements, which makes passage extraction cruder.
6. **Sparse answer blocks on commercial pages.** Homepage: no `<p>` in the 35-70 word band. Service pages: one each. Audience pages: one each. These are the pages most likely to be fetched for "who should I hire" prompts.
7. **Hidden H1.** Homepage H1 at `index.html` line ~606 is `sr-only`. Readable by crawlers, but the visible page opens with a short line rather than a self-contained definition. Not a failure, but it weakens the first-passage signal.

### Pillar 2 - Authority (make it citable)

1. **No named expertise.** Bylines are team names; JSON-LD `author` is an Organization. The GEO research cited in the skill ranks quotations as the largest single visibility lever (+41% on its own metric); this site has zero expert quotes. `[NEED: real editor/lead names and credentials before adding them]`
2. **No sourced statistics.** Every number on the site is either an unsourced first-party claim or a published price range. No link to primary research, no methodology, no "as of" date on claims like +48.2% retention lift. Adding sources is one of the highest-yield non-Google moves and is compatible with Google's people-first guidance.
3. **Freshness conflict.** Visible "Updated 2026-01-15" etc. vs `dateModified: 2026-11-21` in 6 blog posts. An engine reading both has no reliable recency signal. Pick one and make the page and the JSON-LD agree. Also note that even November 2026 is 3 days before the audit date, while the visible dates are 8-10 months old; a genuine refresh of the content is preferable to a timestamp edit.
4. **Schema coverage is uneven.** 3 of 7 blog posts have FAQPage; 2 of 4 services have FAQ+Service; tool pages only recently gained Organization/WebSite-level blocks. Do not add FAQPage to pages with no visible Q&A.
5. **Third-party consensus cannot be assessed from a static repo.** Wikipedia, Reddit, G2/Capterra, industry roundups, YouTube text layer, podcasts. `[NEED: brand search and AI prompt log]`

### Pillar 3 - Presence (be where AI looks)

1. **robots.txt is now purpose-specific and correct** (see Step 4). Good.
2. **sitemap.xml now lists 22 URLs**, including all 5 product pages, with `lastmod` 2026-11-24 for the tools and 2026-11-21 for everything else. It still omits `llms.txt`, `llms-full.txt`, `pricing.md`, `services.md` and `company.md`. A sitemap is low-value for direct agent retrieval but it is cheap and consistent.
3. **`indexnow.json` has 21 URLs and omits all 5 product/tool pages.** If IndexNow is wired to Bing (and therefore Copilot), the newest product pages are not being pushed. `[NEED: confirm the file is actually submitted, not just present]`
4. **`llms.txt` is a solid index** with products, machine-readable files, services, audiences, guides and pricing, and it now has a genuine full companion in `llms-full.txt`. Its usefulness is capped because nothing links to either file from a page agents actually read.
5. **No OKF bundle, no agent skill file, no WebMCP, no `.well-known/ai-catalog.json`, no `AGENTS.md`.** All emerging and optional. The highest-intent action on the site (Calendly booking) is a plain outbound link; an agent can follow it, but there is no structured action or prefilled URL.
6. **International presence:** homepage hreflang was reduced to `en` and `x-default` during the audit; the earlier `?lang=fr` / `?lang=pt-BR` alternates are gone. If French/Portuguese AI visibility matters, this needs a decision and genuinely localised pages, not query-string variants. `[NEED: business decision]`

---

## Prioritized fix list (exact target files)

### P0 - do first

1. **Give the five tool pages real, text-first product definitions** (what it is, who it is for, what it outputs, how it is priced/accessed, FAQ, 40-60 word answer block). Files: `script-studio.html` + `script-studio/index.html`, `auto-editing.html` + `auto-editing/index.html`, `copilot.html` + `copilot/index.html`, `mcp.html` + `mcp/index.html`, `super-search.html` + `super-search/index.html`. Fix the two `<main>` elements and missing H1 in the same pass. No new claims; use the language already in `llms.txt` and the pages' own meta descriptions.
2. **Make the discovery files reachable.** Add `<link rel="alternate" type="text/markdown">` or footer text links to `/llms.txt`, `/llms-full.txt`, `/pricing.md` from `index.html`, `blog.html`, `work/index.html`, the 4 service pages and the 5 tool pages; add the three files to `sitemap.xml`. There is no shared footer template in `components/`, so this is per-file (or add head links to the highest-value pages only).
3. **Reconcile the turnaround claim.** "24 to 48 hours per cut" (homepage FAQ + schema, super-search copies), "in 48 hours" (homepage meta description), "48 to 72 hours" (YouTube service FAQ + visible answer) and "48-hour sprint" (`llms.txt`, `pricing.md`) cannot all be true. Targets: `index.html`, `services/youtube-video-editing/index.html`, `super-search.html`, `super-search/index.html`, `llms.txt`, `pricing.md`, `company.md`, `services.md`. `[NEED: authoritative SLA wording; do not guess]`
4. **Make freshness consistent.** Either update the visible "Updated" date to match `dateModified` after a real content refresh, or set `dateModified` to the visible date. Targets: all 7 files under `blog/*/index.html`. Do not change timestamps alone to simulate freshness.

### P1 - next

6. **Add named author credentials** to the 7 blog posts (visible byline + `@type: Person` author with job title) and one named expert quote per post where a real person can be attributed. `[NEED: real names, titles, consent]`. Targets: all `blog/*/index.html`.
7. **Add sourced statistics** with primary sources and "as of" dates to the retention, pricing, B2B SaaS and white-label guides. Use real sources only; mark anything unverified `[NEED: source]`. Targets: `blog/how-to-improve-youtube-retention/index.html`, `blog/video-editing-cost-pricing-guide/index.html`, `blog/b2b-saas-video-production-acquisition-guide/index.html`, `blog/white-label-video-editing-agency-guide/index.html`.
8. **Close the FAQ gaps** with natural-language Q&A and matching FAQPage schema only where Q&A is visible: 4 blog posts (`what-makes-a-good-short-form-video-editor`, `2026-thumbnail-psychology-playbook`, `b2b-saas-video-production-acquisition-guide`, `white-label-video-editing-agency-guide`), `services/podcast-video-editing/index.html`, `services/video-ad-editing/index.html`, and the 3 `for/*/index.html` pages.
9. **Add HowTo schema to the retention blueprint** (steps already exist in text). Treat it as parse context for non-Google engines, not a rich-result play. Target: `blog/how-to-improve-youtube-retention/index.html`.
10. **Add the 5 tool URLs to `indexnow.json`** and confirm live submission; add optional content-usage comments to `robots.txt`. Targets: `indexnow.json`, `robots.txt`.
11. **Align canonicals:** change `script-studio.html` and `auto-editing.html` canonicals to the trailing-slash URLs used in `sitemap.xml` (and their directory counterparts). Targets: those 4 files.
12. **Add visible "Last updated" lines** to service, work and trust pages that currently only carry `lastmod` in the sitemap. Targets: `services/*/index.html`, `work/index.html`, `security.html`.

### P2 - emerging / after the above

13. Consider an OKF bundle (`/.well-known/`), a public `SKILL.md` with the Calendly URL prefilled, or WebMCP for "book a consultation". These are unmeasured conventions, not citation signals. `[NEED: engineering decision]`
14. Set up the monitoring loop: 12 prompts above, 3-5 runs each, monthly; Google Search Console Generative AI performance report; Bing Webmaster Tools AI Performance + grounding queries; Brave submit-url for Claude; log cited URLs and rates. `[NEED: tool access and account ownership]`

---

## Top 5 findings

1. **The five product/tool pages are JS shells with 17-201 words of visible text** (17 for Auto Editing, 24 for Script Studio). Agents that do not execute JS cannot learn what the products do, despite `llms.txt` describing all five. This is the clearest AR-READ-01 failure.
2. **No discovery file is linked from any HTML page**, and `sitemap.xml` omits `llms.txt`, `llms-full.txt` and `pricing.md`. Strong machine-readable files now exist but almost nothing points at them. Add head/footer links and sitemap entries.
3. **The turnaround claim contradicts itself** across the homepage (24 to 48 hours), its meta description (48 hours), the YouTube service page (48 to 72 hours), and `llms.txt` / `pricing.md` (48-hour sprint). This is the fact most likely to be asked about in an AI answer, and there is no single source of truth.
4. **Authority signals are thin:** team bylines instead of named experts, zero expert quotes, zero external source citations, and a direct conflict between visible article dates (Jan-Mar 2026) and JSON-LD `dateModified` (Nov 2026). Fix the conflict, add real attribution and sourced data.
5. **Core discovery is largely in place:** `robots.txt` now separates search discovery from training opt-out correctly, `sitemap.xml` includes all product pages, and `pricing.md` plus a regenerated 128-line `llms-full.txt` publish accurate, clearly labelled facts. The remaining work is depth and consistency, not permissions.
