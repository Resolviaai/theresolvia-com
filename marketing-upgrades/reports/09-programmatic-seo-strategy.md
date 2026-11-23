# Programmatic SEO strategy — Resolvia

Prepared: 2026-11-24. Read-only research plus artifacts. No site page, `sitemap.xml`, or `robots.txt` was modified.

Canonical production domain for every URL, canonical tag, and schema `url` below: `https://theresolvia.com`.

---

## 1. Starting point: what already exists (cannibalization map)

The site already covers the high-intent "money" queries. Programmatic pages must not compete with them.

| Existing page type | URLs | Queries already owned |
|---|---|---|
| Services | `/services/youtube-video-editing/`, `/services/short-form-video-editing/`, `/services/podcast-video-editing/`, `/services/video-ad-editing/` | "YouTube video editing agency", "short-form video editing services", "video podcast editing", "video ad editing" |
| Audience pages | `/for/creators/`, `/for/businesses/`, `/for/agencies/` | "video editing for creators", "video editing for businesses", "white-label video editing for agencies" |
| Guides (7) | `/blog/video-editing-cost-pricing-guide/`, `/blog/agency-vs-freelance-video-editor/`, `/blog/how-to-improve-youtube-retention/`, `/blog/what-makes-a-good-short-form-video-editor/`, `/blog/white-label-video-editing-agency-guide/`, `/blog/2026-thumbnail-psychology-playbook/`, `/blog/b2b-saas-video-production-acquisition-guide/` | pricing, agency vs freelancer, retention improvement, short-form editor quality, white-label, thumbnail psychology, B2B SaaS video |
| Work / trust | `/work/`, `/security.html`, `/careers.html` | case studies, security, careers |
| Other | `/`, `/blog.html`, `/llms.txt`, `/llms-full.txt` | brand, hub |

**Rule applied:** generate only where the search intent is definition, tool/approach comparison, or a segment that is materially narrower than the three existing `/for/*` pages. Anything that restates an existing service, audience page, or guide goes in the "do not generate" list in section 9.

---

## 2. Opportunity analysis

### 2.1 Playbook selection

The site's defensible asset is **documented post-production expertise** (narrative pacing, sonic foley design, Fairlight audio mastering at -14 LUFS for podcasts, 3D motion graphics, high-CTR thumbnails, Frame.io review). That points to three playbooks, in priority order:

| Playbook | Fit | Why | Scale ceiling |
|---|---|---|---|
| **Glossary** (`what is [term]`) | Primary | Top-of-funnel, answer-first, matches the site's existing AEO/GEO approach, and every term maps to a real capability or service. Natural internal-link spokes. | 25–35 high-quality terms |
| **Comparisons** (`[X] vs [Y]`) | Secondary | High purchase intent, but only defensible where Resolvia has first-hand workflow evidence. Existing agency-vs-freelance guide already owns that angle. | 6–10 pages |
| **Personas** (`video editing for [audience]`) | Tertiary, tightly capped | Only where the segment has a distinct workflow. Existing `/for/creators/`, `/for/businesses/`, `/for/agencies/` already own broad personas. | 4–6 narrow pages |

Deliberately excluded as poor fits: Locations (no local presence, doorway risk), Directory/Curation (no first-party testing data, highly competitive), Templates/Conversions (no product fit), Translations (existing hreflang uses query-string locales and needs a separate fix), Profiles (no authority or subject data), Integrations (only one genuine integration is stated on the site, so it does not form a repeatable pattern).

### 2.2 Keyword patterns and variables

- Glossary pattern: `what is {term} in video editing` / `{term} definition` / `{term} meaning`. Variables: term, the one decision it changes, the service it maps to.
- Comparison pattern: `{tool A} vs {tool B} for {use case}`. Variables: two tools with documented in-house use, use case, decision criteria.
- Persona pattern: `video editing for {narrow segment}`. Variables: segment, publishing cadence, deliverable set.

### 2.3 Demand and competition statement

This research was done from the local site and briefs only; no keyword tool or SERP scrape was available. **No search volumes, difficulty scores, or competitor rankings are asserted here.** Before build, validate each of the 12 target queries in section 8 with a keyword tool and a live SERP check.

`[NEED: keyword volume + SERP composition export for the 12 target queries; drop or rewrite any query whose SERP is dominated by Wikipedia, dictionary sites, or vendor documentation with no room for an expert answer]`

Qualitative expectation only: LUFS, CTR, foley, and pattern interrupt are the head terms in this set; "what is X in video editing" variants are long tail. The value of the set is aggregate topical coverage plus internal-link depth, not any single page's volume.

### 2.4 Page-count plan

Quality over quantity. First batch: **12 pages** (2 hubs + 10 spokes). After a 4–6 week indexation and ranking check, expand to 20–30 pages. Year-one cap: ~60 pages total. Never generate a page solely because a data row exists.

---

## 3. URL structure

Subfolders on the main domain, matching the existing trailing-slash convention. No subdomains.

```
https://theresolvia.com/glossary/                      (hub)
https://theresolvia.com/glossary/{term}/
https://theresolvia.com/compare/                        (hub)
https://theresolvia.com/compare/{a}-vs-{b}/
https://theresolvia.com/for/{narrow-persona}/           (extends the existing /for/ namespace)
```

Rules:
- Lowercase, hyphenated, one noun phrase per segment, no dates, no stop-word variations, no IDs.
- One canonical URL per concept. If two terms are synonyms (e.g. "audience retention" and "retention rate"), pick one URL and redirect the other to it.
- Self-referencing absolute canonical on every page, e.g. `<link rel="canonical" href="https://theresolvia.com/glossary/lufs/"/>`.
- Keep the slug stable after launch; changes require a 301.

### Build platform

The site is a static, Next.js-exported HTML tree. Generate these pages at **build time** from a small data file (one JSON/YAML record per page) into subfolders, so the result is server-rendered static HTML with no client-only content. The generator must support: per-page `noindex` and canonical override, conditional sections (so a page without a verified example simply omits that block), related-page queries for hub and sibling links, and a separate output sitemap. Do not adopt a new CMS for 60 pages.

`[NEED: confirm the next build step that emits static HTML can write /glossary/, /compare/ and new /for/ subfolders without touching the hand-maintained pages]`

---

## 4. Unique-value rules

A page may only be generated when it has **at least two sections that cannot be copied to any sibling page**:

1. A **page-specific definition or decision rule** tied to that term, tool pair, or segment.
2. A **worked example or workflow detail** drawn from facts already stated on the site (e.g. the -14 LUFS podcast standard, the 48-hour turnaround sprint, Frame.io review, encrypted pre-release vault, bilateral NDAs). If the example would require a new claim, write `[NEED: ...]` instead of inventing it.
3. A **distinct outbound destination**: each spoke links to a different existing service/guide/audience page (section 8). Two spokes pointing at the same single existing page with the same angle is a merge signal.

Required per page:
- 700–1,100 words for glossary, 900–1,300 for comparisons, 800–1,200 for personas (floors, not targets).
- One answer-first paragraph of 60–80 words directly under the H1.
- At least one element a searcher cannot get from a dictionary entry: measurement method, decision threshold, workflow step, or honest "when not to use this" note.
- No stat, client, testimonial, logo, rating, or price beyond facts already on the site. The published ranges in the pricing guide ($500–$1,500 per video; $2,500–$8,000/month retainers; 60%+ agency margins) are treated as published ranges, never restated as a formal rate card on these pages.

---

## 5. Title and meta templates

Limits: titles ≤ 60 characters, meta descriptions ≤ 155 characters. Front-load the differentiating term. Brand suffix is `| Resolvia`.

**Glossary**
- Title: `{Term} explained for video editors | Resolvia`
- Meta: `What {term} means in video production, how it is measured, and the editing decision it changes. Worked example and related terms included.`
- Worked example: `LUFS explained for video editors | Resolvia` / `What LUFS means in video production, how it is measured, and the editing decision it changes. Worked example and related terms included.`

**Comparison**
- Title: `{A} vs {B} for {use case} | Resolvia`
- Meta: `A side-by-side look at {A} and {B} for {use case}: setup, control, review speed and cost, based on Resolvia's post-production workflow.`

**Persona**
- Title: `Video editing for {persona}: workflow & deliverables | Resolvia`
- Meta: `How {persona} use long-form, short-form and podcast editing to publish consistently. Deliverables, turnaround and a consultation CTA.`

**Hub**
- Title: `{Topic} glossary: video editing terms defined | Resolvia`
- Meta: `Plain-language definitions of video editing, audio and retention terms, each with a worked example and a link to the relevant Resolvia service.`

Uniqueness gate: no two pages in the set may share a title string, a meta string, or a primary query. A template swap with no changed value section fails the gate.

---

## 6. Content outline

### 6.1 Glossary spoke (`/glossary/{term}/`)
1. H1 — `What is {term}?`
2. Answer-first paragraph (60–80 words), plain definition.
3. **Context** — where the term appears in a production pipeline; origin if factual.
4. **How it is measured or applied** — units, thresholds, or steps. Only site-supported figures.
5. **Worked example** — one concrete editing decision. Omit if no verified fact; use `[NEED: ...]`.
6. **Common mistake** — one mistake a client or editor actually makes.
7. **Related terms** — links to 2 sibling glossary pages.
8. **Where this fits in our workflow** — link to the one mapped service or guide from section 8.
9. CTA — `https://calendly.com/resolviaai/meet`.
10. `Last reviewed: 2026-11-24` visible on page.

### 6.2 Comparison spoke (`/compare/{a}-vs-{b}/`)
1. H1 — `{A} vs {B} for {use case}`.
2. Answer-first verdict by use case (60–80 words), no universal winner claim.
3. **Comparison table** — criteria: setup effort, control, review speed, collaboration, cost. Fill only from verifiable facts, otherwise `[NEED: ...]`.
4. **Choose {A} when…** — one anchored scenario.
5. **Choose {B} when…** — one anchored scenario.
6. **How Resolvia handles this** — the relevant stated capability only.
7. Related comparisons (1 sibling) + the mapped existing page.
8. CTA + last-reviewed date.

### 6.3 Persona spoke (`/for/{persona}/`)
1. H1 — `Video editing for {persona}`.
2. Answer-first paragraph: what this segment actually needs from post-production.
3. **Typical publishing workflow** — cadence and steps, framed as a described pattern, not a claimed client fact.
4. **Deliverables mapped to services** — long-form, short-form, podcast, or ads; link to the matched service page.
5. **Retention and audio specifics** — cite only stated capabilities (narrative pacing, Fairlight mastering at -14 LUFS for podcasts, high-CTR thumbnails).
6. **What to check before hiring an editor** — honest criteria; no ranking of named competitors.
7. Related audience link (one of the three existing `/for/*` pages) + glossary terms.
8. CTA + last-reviewed date.

### 6.4 Hubs
H1, 80–120 word intro, then grouped link blocks with one sentence of unique value per spoke, then a "start here" block linking to the relevant service or guide, then CTA. Hubs are navigational; they do not need to rank for the spoke queries.

---

## 7. Schema requirements

Use JSON-LD, `@graph` where more than one type is needed. Mark up **only content visibly present on the page**. Self-referencing `@id` values use production URLs.

| Page type | Required `@graph` nodes |
|---|---|
| Glossary spoke | `DefinedTerm` (`name`, `description`, `inDefinedTermSet` → hub `@id`, `url`) + `Article` (`headline`, `description`, `datePublished`, `dateModified`, `author` → Organization, `publisher` → Organization, `mainEntityOfPage`) + `BreadcrumbList` (Home → Glossary → Term) |
| Comparison spoke | `Article` (same fields) + `BreadcrumbList` (Home → Comparisons → Page) |
| Persona spoke | `Service` (`serviceType`, `name`, `description`, `provider` → Organization) + `BreadcrumbList` (Home → For → Persona). Only if the service is visibly described on the page. |
| Hubs | `CollectionPage` (`name`, `description`, `url`, `mainEntity` as `ItemList` of spoke URLs) + `BreadcrumbList` |

Organization node (reuse one definition across all graphs): `{"@type":"Organization","@id":"https://theresolvia.com/#organization","name":"Resolvia","url":"https://theresolvia.com/"}`.

**Explicitly do not add:**
- `FAQPage` or `HowTo` markup for rich-result purposes. Both rich results are retired; visible FAQ/How-to content may remain as plain HTML.
- `aggregateRating`, `Review`, or star ratings. No ratings exist on the site.
- `Product`, `Offer`, or `price` markup on these pages. Pricing figures live only in the existing pricing guide and are ranges, not a rate card.
- `LocalBusiness` on persona pages. There is no physical location claim.

`[NEED: schema agent to confirm the Organization @id already used in index.html so the new graphs reference the same node rather than creating a duplicate entity]`

---

## 8. Hub-and-spoke internal linking

```
/services/*, /for/{existing 3}, /blog/*, /work/
              |  (one acknowledgement link back, added by the owning page's agent)
              v
   /glossary/ (hub)  <---->  /compare/ (hub)
       |                        |
   glossary spokes        comparison spokes
       |                        |
   /for/{persona} (persona spokes, share the /for/ namespace with existing audience pages)
```

Rules:
- Every spoke: breadcrumb link to hub + "All terms/comparisons" link + one mapped existing page + at least one sibling spoke. No orphans.
- Hubs list every spoke with a one-line description; hubs also link to the two most relevant existing guides/services.
- Siblings cross-link only when genuinely related (e.g. LUFS ↔ foley, CTR ↔ narrative pacing). No sitewide link blocks.
- Existing pages need one link back to the relevant hub from a natural place (e.g. `/blog.html` → glossary hub, `/services/podcast-video-editing/` → LUFS page). This requires edits to files owned by other agents.

`[NEED: site owner to add one contextual link from /blog.html and from each mapped existing page to the new hub/spoke; programmatic agent has no write access to those files]`

---

## 9. Indexation strategy

- All 12 first-batch pages are indexable by default: each passes the unique-value gates in section 4.
- Self-referencing canonical on every page; `Allow: /` already covers `/glossary/` and `/compare/` in the current `robots.txt`, so no robots rule change is needed for these paths.
- Publish a separate sitemap file `sitemap-programmatic.xml` containing only these pages. The provided `marketing-upgrades/programmatic/sitemap-additions.xml` is that file's content for the first batch. The real `sitemap.xml` is untouched.
- `sitemap-programmatic.xml` needs a pointer in `robots.txt` (`Sitemap: https://theresolvia.com/sitemap-programmatic.xml`). That file belongs to another agent.

`[NEED: robots.txt owner to add the sitemap-programmatic.xml pointer after the file is deployed]`

- Split sitemaps by page type if the set grows past ~2,000 URLs. The 50,000 URL / 50 MB limit is far away at this scale.
- Any future thin or unverified variation: `noindex, follow` until it passes the gates, and keep it out of the sitemap. Never leave an unimproved page indexable.
- Rollout: publish batch 1 (12 pages), wait 4–6 weeks, review indexation rate, impressions, and engagement. Only then generate batch 2. Watch for thin-content warnings, ranking drops, and crawl errors.
- Do not add `noindex` to the hubs; they are the discovery path.

---

## 10. Quality gates (blockers before publish)

1. **Uniqueness** — at least two sections that cannot appear on a sibling page.
2. **Depth** — word-count floors in section 4 met with substantive prose, not padded lists.
3. **Fact check** — every claim traces to the brief/site. Any unsupported claim is written as `[NEED: ...]` and the page is held.
4. **Intent** — the page answers the target query in the first 80 words.
5. **Metadata** — unique title (≤60 chars) and meta (≤155 chars); single H1; logical H2/H3 order.
6. **Schema** — valid JSON-LD, visible-content only, no retired rich-result types, no ratings.
7. **Links** — hub + mapped existing page + ≥1 sibling; verified no orphans.
8. **Discovery** — canonical present, sitemap entry present, no conflicting `noindex`, crawlable.
9. **Voice** — no "it's not X, it's Y", no "no X, no Y, no Z", no "The result?", "Here's the thing", "unlock the power of", "X, reimagined"; no em dashes in short copy; at most one fragment and one list of three per section; no engagement bait.
10. **Performance** — generated HTML comparable in weight to existing static pages; no client-only rendering of main content.

---

## 11. Do not generate

- `/glossary/encrypted-pre-release-vault/` or other internal-feature terms with no search demand.
- Any page that restates `/for/creators/`, `/for/businesses/`, or `/for/agencies/` under a new label (gamers, vloggers, small businesses, startups, e-commerce brands) without a distinct workflow and deliverable set.
- A second comparison of agency vs freelancer, in-house vs agency, or agency vs studio. `/blog/agency-vs-freelance-video-editor/` owns that query.
- "Best video editing software", "top AI video editors", or similar curation/directory pages: no first-party testing data, strong incumbent competition, would be thin.
- Any `[service] in [city]` location page. No local presence; doorway-page risk.
- Tool comparisons where Resolvia has no documented first-hand use (e.g. Premiere Pro vs Final Cut Pro) until `[NEED: confirm first-hand use by the editing team]`.
- Any new page whose main purpose is repeating the published pricing ranges. `/blog/video-editing-cost-pricing-guide/` owns that.
- "What makes a good short-form video editor" or equivalent rephrasing; the existing guide owns it.
- Thumbnail guides broader than the CTR definition. `/blog/2026-thumbnail-psychology-playbook/` owns the psychology angle; `/glossary/ctr/` stays a definition page.
- Full translations of existing guides. The existing query-string hreflang pattern is flagged by the SEO audit and needs its own fix first.
- Any page generated from a single swapped variable with no unique section, or with under ~600 words of substantive content.
- Mass location, persona, or term permutations built to hit a page-count target.

---

## 12. First batch: 12 specific page ideas

Target query is the primary query the page is built to answer. "Existing page link" is the one primary established page the spoke must link to.

| # | Proposed URL | Playbook | Target query | Unique value | Existing page link |
|---|---|---|---|---|---|
| 1 | `/glossary/` | Hub | `video editing terms glossary` | Navigational hub: grouped definitions with one-line unique value per term and a start-here path to services | `/blog.html` |
| 2 | `/compare/` | Hub | `video production tool comparisons` | Navigational hub: honest, use-case-led comparisons grounded in Resolvia's workflow | `/services/youtube-video-editing/` |
| 3 | `/glossary/audience-retention/` | Glossary | `what is audience retention in video` | Definition and measurement only: how the metric is read, where drop-off points sit. Links out to the improvement tactics guide instead of repeating them | `/blog/how-to-improve-youtube-retention/` |
| 4 | `/glossary/foley/` | Glossary | `what is foley in video editing` | The sound-design discipline behind Resolvia's stated sonic foley capability, with a concrete layering example in a dialogue edit | `/services/youtube-video-editing/` |
| 5 | `/glossary/lufs/` | Glossary | `what is LUFS` | Loudness units explained with Resolvia's published podcast standard of -14 LUFS and why that target is chosen for spoken-word video | `/services/podcast-video-editing/` |
| 6 | `/glossary/pattern-interrupt/` | Glossary | `what is a pattern interrupt in video` | Definition plus placement logic in short-form cuts, tied to early-second pacing decisions | `/services/short-form-video-editing/` |
| 7 | `/glossary/narrative-pacing/` | Glossary | `what is narrative pacing in editing` | How pacing is planned at the assembly stage, distinct from the retention guide's optimisation tactics | `/services/youtube-video-editing/` |
| 8 | `/glossary/ctr/` | Glossary | `what is CTR on YouTube` | Metric definition and what it measures on a thumbnail; no overlap with the psychology playbook's colour and face analysis | `/blog/2026-thumbnail-psychology-playbook/` |
| 9 | `/compare/frame-io-vs-google-drive/` | Comparison | `Frame.io vs Google Drive for video review` | Side-by-side on review speed, version control, comment threading and client handoff, based on Resolvia's stated Frame.io workflow | `/security.html` |
| 10 | `/compare/fairlight-vs-adobe-audition/` | Comparison | `Fairlight vs Audition for podcast audio` | Honest use-case split for spoken-word mastering, anchored to Resolvia's Fairlight -14 LUFS podcast standard | `/services/podcast-video-editing/` |
| 11 | `/for/course-creators/` | Persona | `video editing for course creators` | Lesson-level pacing, screen-record plus talking-head assembly, and modular deliverables. Narrower than the general creators page | `/for/creators/` |
| 12 | `/for/media-brands/` | Persona | `video editing for media brands` | High-cadence multi-channel publishing, brand consistency across formats, and review workflow at volume. Distinct from the businesses and agencies pages | `/for/businesses/` |

Open evidence items before any of rows 9–12 is written: `[NEED: first-hand verification for the two comparison tool sets]`, `[NEED: segment workflow details from the account team for the two persona pages]`. If these cannot be supplied, hold those four pages and publish the eight glossary/hub pages only.

---

## 13. Files delivered

- `marketing-upgrades/reports/09-programmatic-seo-strategy.md` — this document.
- `marketing-upgrades/programmatic/page-template.md` — reusable build template with title/meta slots, outlines, schema skeleton, and a pre-publish checklist.
- `marketing-upgrades/programmatic/sitemap-additions.xml` — 12 `<url>` entries for the first batch with production URLs and `lastmod` 2026-11-24. Intended as `sitemap-programmatic.xml`; the real `sitemap.xml` was not modified.
