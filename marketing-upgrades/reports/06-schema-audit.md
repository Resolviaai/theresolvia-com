# Schema (JSON-LD) Audit — Resolvia

**Wave 1, Agent 6/27 — read-only audit. No site file was edited.**
Source: `C:\CODE\theresolvia-com` (`grep application/ld+json` across all `*.html`, then each block read in full; visible DOM cross-checked against each block).
Production URLs only: `https://theresolvia.com/...`
Skill: `schema` v2.0.5 + `references/schema-examples.md`.

---

## 1. Scope and method

- 18 JSON-LD `<script>` blocks found across 17 HTML files.
- Every block was parsed by reading, then compared with the visible page content (headings, breadcrumbs, FAQ accordions, bylines, "Updated" dates, case-study stats).
- No ratings, prices, dates, authors, images or URLs were invented for the recommendations. Where the HTML contains no evidence, the item is marked `[NEED: …]` and left out of the copy-pasteable block.
- **Google feature status applied:** FAQ rich results were retired **7 May 2026** (docs removed June 2026); HowTo rich results retired **September 2023**; the sitelinks search box was retired **November 2024**. `FAQPage` / `WebSite` markup can still describe content semantically, but none of it is a route to a Google rich result. No `HowTo` or `SearchAction` is recommended.
- Test/dump files (`*_test.html`, `temp_*`, `render_davinci.html`, `mcp_rendered_inner.html`, `deep_verify_render.html`, `verify_all_assets.html`, `cta_banner_dump.html`) are non-production and were excluded from recommendations.

---

## 2. Inventory

### 2.1 Pages that HAVE JSON-LD

| # | File / production URL | JSON-LD types present | Visible breadcrumbs? | Verdict |
|---|---|---|---|---|
| 1 | `index.html` → `/` | `Organization`, `WebSite`, `FAQPage` (1 `@graph`) | No | Structure OK; FAQ content mismatch (F1) |
| 2 | `blog.html` → `/blog.html` | `CollectionPage`, `BlogPosting` | No | CollectionPage OK; BlogPosting mismatch (F4) |
| 3 | `work/index.html` → `/work/` | Block A: `CollectionPage`, `BreadcrumbList`; Block B: `VideoObject` ×2 | Yes | Keep A; remove B (F2) |
| 4 | `services/youtube-video-editing/` | `Service`, `BreadcrumbList`, `FAQPage` | Yes | Service OK; FAQ + OfferCatalog issues (F6, F7) |
| 5 | `services/short-form-video-editing/` | `Service`, `BreadcrumbList`, `FAQPage` | Yes | Service OK; FAQ mismatch (F6) |
| 6 | `services/podcast-video-editing/` | `Service`, `BreadcrumbList` | Yes | Clean |
| 7 | `services/video-ad-editing/` | `Service`, `BreadcrumbList` | Yes | Clean |
| 8 | `for/creators/` | `WebPage`, `BreadcrumbList` | Yes | Clean |
| 9 | `for/businesses/` | `WebPage`, `BreadcrumbList` | Yes | Clean |
| 10 | `for/agencies/` | `WebPage`, `BreadcrumbList` | Yes | Clean |
| 11 | `blog/2026-thumbnail-psychology-playbook/` | `Article`, `BreadcrumbList` | Yes | Missing `image`; date issue (F3, F8) |
| 12 | `blog/how-to-improve-youtube-retention/` | `Article`, `BreadcrumbList`, `FAQPage` | Yes | FAQ matches; `image`/date issues |
| 13 | `blog/white-label-video-editing-agency-guide/` | `Article`, `BreadcrumbList` | Yes | Missing `image`; date issue |
| 14 | `blog/agency-vs-freelance-video-editor/` | `Article`, `BreadcrumbList`, `FAQPage` | Yes | FAQ matches; `image`/date issues |
| 15 | `blog/b2b-saas-video-production-acquisition-guide/` | `Article`, `BreadcrumbList` | Yes | Missing `image`; date issue |
| 16 | `blog/video-editing-cost-pricing-guide/` | `Article`, `BreadcrumbList`, `FAQPage` | Yes | FAQ matches; `image`/date issues |
| 17 | `blog/what-makes-a-good-short-form-video-editor/` | `Article`, `BreadcrumbList` | Yes | Missing `image`; date issue |

No page has duplicate/conflicting *types* inside its blocks; `work/` is the only page with two separate blocks, and its two blocks introduce different types (`CollectionPage` vs `VideoObject`) — the `VideoObject` block is the problem.

### 2.2 Pages that have NO JSON-LD

| Production URL (canonical where present) | Files | Note |
|---|---|---|
| `/super-search` | `super-search.html`, `super-search/index.html` | Canonical is `https://theresolvia.com` (homepage) — wrong URL. Visible page is a **service landing page** ("We Edit Videos That Break The Algorithm"), not an app UI. |
| `/mcp` | `mcp.html`, `mcp/index.html` | App UI ("Turn your Claude into a views machine"). |
| `/copilot` | `copilot.html`, `copilot/index.html` | App UI. **No canonical tag at all.** |
| `/script-studio` | `script-studio.html`, `script-studio/index.html` | App UI ("Create viral scripts from viral videos"). |
| `/auto-editing` | `auto-editing.html`, `auto-editing/index.html` | App UI. |
| `/careers.html`, `/security.html`, `/terms.html`, `/privacy.html` | single files | Legal/info pages; no rich-result schema required. Optional minimal `WebPage` if desired (see §3.8). |

Each product route exists as **two files** (a root `.html` and a directory `index.html`) with identical metadata. Schema must be added to **one** file only — whichever the server actually serves for that canonical URL — or the JSON-LD will be duplicated. `[NEED: confirm served file per route]`.

---

## 3. Audit findings

### High severity

**F1 — Homepage FAQPage does not match the visible FAQ.**
Visible section `#faq` has **six** Q&As: "What is Resolvia?", "What tools do you edit with?", "Which platforms do you cover?", "What is your turnaround time?", "Do you offer revisions?", "How do we get started?". The schema has **three different** questions, and its answers contain claims absent from the visible section ("multi-timezone post-production teams across New York, London, and Tokyo", "connected via Frame.io", "bilateral NDAs and encrypted local-vault media pipelines"). Visible turnaround copy is "24 to 48 hours per video cut", not a "48-hour sprint". This is a content mismatch and an invented-claim risk. → Replace with the six visible Q&As (§3.7) or remove the `FAQPage` node entirely.

**F2 — `/work/` VideoObject markup is invalid for this page.**
Both `VideoObject`s point `contentUrl`/`embedUrl` at in-page anchors (`#case-study-1`, `#case-study-2`), use the brand logo as `thumbnailUrl`, and declare `uploadDate`/`duration` values that appear nowhere on the page. There is no `<video>` or player on `/work/` — it is a text case-study grid (three case studies visible, only two marked up). → Remove the second `<script>` block; keep `CollectionPage` + `BreadcrumbList`.

**F3 — All 7 blog posts and the blog hub omit `image` on `Article`/`BlogPosting`.**
`image` is a required field for Article rich-result eligibility in Google's documentation and in the installed skill. None of the posts has an `og:image` or any article image in the HTML. → `[NEED: a real, visible article image URL per post]`. Do not substitute the generic `/og-image.png` unless it is confirmed as the article image.

**F4 — `/blog.html` `BlogPosting` describes content that is not on the page.**
The `BlogPosting` "The 3-Second Retention Law…" has `datePublished: 2026-11-01` and author "Resolvia Post-Production Team" — neither is visible on `/blog.html`. The visible element is a **featured teaser card** (`#the-3-second-retention-law`) whose headline links to `/blog/how-to-improve-youtube-retention/`; the full article lives there and already has its own `Article` schema. Marking a teaser as a standalone `BlogPosting` on the hub is a mismatch and can create conflicting entities. → Remove the `BlogPosting` node; keep `CollectionPage`.

**F5 — Retired rich results are still being targeted implicitly.**
`FAQPage` appears on 6 pages (homepage, 2 services, 3 blog posts). It cannot produce a Google FAQ rich result any more. This is not a "broken implementation" — it is optional Schema.org semantics. Keep only where the Q&A is visibly present and correct (§3.7); never add `HowTo` or `SearchAction` to recover retired appearances.

### Medium severity

**F6 — Two service FAQ blocks contain questions that are not visible.**
- `services/youtube-video-editing/`: schema Q4 "What video editing software does Resolvia's team use?" is not on the page. Visible Q4 is "How do you compare to hiring a freelance video editor?".
- `services/short-form-video-editing/`: schema Q3 "What makes a short-form video edit go viral?" is not on the page; only two FAQs are visible.
→ Trim each `FAQPage` to the visible Q&As (§3.7). The 3 blog-post FAQ blocks **do** match their visible accordions exactly and need no content change.

**F7 — YouTube service `hasOfferCatalog` names are invisible.**
"Weekly Sprint Retainer (4 Edits/Month)" and "Velocity Retainer (8 Edits/Month)" appear only inside the JSON-LD. → Remove `hasOfferCatalog` from the recommended `Service` block. No `offers` with prices are added anywhere (site price ranges are in the pricing *blog post*, not on these pages).

**F8 — Blog `dateModified` conflicts with the visible date.**
Each post visibly shows "Updated YYYY-MM-DD" (e.g. `2026-02-05`), which equals the schema's `datePublished`. Schema `dateModified` is uniformly `2026-11-21` (the sitemap `lastmod`) and is not visible. → Use the visible "Updated" date for both `datePublished` and `dateModified`, and flag `[NEED: confirm the true publish date if it differs from the visible "Updated" date]`.

**F9 — Organization `sameAs` URLs are unverified.**
`https://twitter.com/resolvia`, `https://www.linkedin.com/company/resolvia`, `https://youtube.com/@resolvia` occur **only** inside the JSON-LD, nowhere in the visible HTML. → `[NEED: verify these profiles exist and are linked from the site]`; they are omitted from the recommended block until confirmed.

**F10 — URL issues adjacent to schema.**
`/super-search` canonical points to the homepage (wrong target for a product page); `/copilot` has no canonical; both root-`.html` and `/index.html` duplicates exist for all five tools. Schema URL values in the recommendations use the intended canonical route; `[NEED: fix canonicals / confirm served file]`.

### Low severity / consistency

- `Organization.logo` uses `/favicon.svg`; the visible nav logo is `/brand/resolvia_r_logo.png`. Recommended block uses the visible logo.
- `WebSite.name` is "Resolvia Creative Studio" while `Organization.name` is "Resolvia". Recommended block aligns both to "Resolvia".
- Service `provider`, hub `isPartOf` and blog `publisher` define the Organization inline on every page instead of referencing `https://theresolvia.com/#organization`. Recommended blocks use `@id` references so there is one canonical entity.
- Breadcrumb "Services" crumbs on all four service pages point to `/services/youtube-video-editing/` — this **matches the visible breadcrumb**, so it is not a schema error, though a real `/services/` hub would be cleaner.

---

## 4. Recommended JSON-LD (copy-pasteable)

All blocks use `@graph` where more than one type is required. Escape `<` as `\u003c` if any value ever contains markup.

### 4.1 Homepage — `Organization` + `WebSite` (`index.html`, `/`)

Replace the existing single block with this (FAQ handled separately in §4.7):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://theresolvia.com/#organization",
      "name": "Resolvia",
      "legalName": "Resolvia Creative Studio",
      "url": "https://theresolvia.com/",
      "logo": "https://theresolvia.com/brand/resolvia_r_logo.png",
      "description": "Elite video editing agency and post-production studio specializing in retention-engineered YouTube long-form, Shorts, and Reels.",
      "contactPoint": {
        "@type": "ContactPoint",
        "@id": "https://theresolvia.com/#contact-point",
        "url": "https://calendly.com/resolviaai/meet",
        "contactType": "Client Onboarding & Sales"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://theresolvia.com/#website",
      "url": "https://theresolvia.com/",
      "name": "Resolvia",
      "publisher": { "@id": "https://theresolvia.com/#organization" }
    }
  ]
}
</script>
```
`[NEED: verified social profile URLs]` — add a `sameAs` array to `Organization` only after confirming the three profiles exist. No `SearchAction` (retired feature).

### 4.2 Hubs — `WebPage` / `CollectionPage`

**`/blog.html`** — keep only the `CollectionPage`; drop the `BlogPosting` (F4). No breadcrumb exists visibly, so none is added.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://theresolvia.com/blog.html#webpage",
      "url": "https://theresolvia.com/blog.html",
      "name": "Retention Breakdowns & Post-Production Science",
      "description": "In-depth post-production breakdowns, YouTube retention science, hook psychology, and video editing systems for high-growth creators.",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    }
  ]
}
</script>
```

**`/work/`** — keep `CollectionPage` + `BreadcrumbList`; delete the second `VideoObject` script block entirely (F2).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://theresolvia.com/work/#collection",
      "url": "https://theresolvia.com/work/",
      "name": "Featured Video Editing Portfolio & Case Studies",
      "description": "Showcase of retention-engineered video post-production projects.",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/work/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Work & Case Studies", "item": "https://theresolvia.com/work/" }
      ]
    }
  ]
}
</script>
```

**`/for/creators/`, `/for/businesses/`, `/for/agencies/`** — `WebPage` + visible `BreadcrumbList` (same pattern; only values change). The breadcrumb name in position 2 is "Who We Serve" in the existing markup but the visible crumb label should be checked on each page; the values below preserve the current schema, which matches the visible crumbs' structure.

```html
<!-- /for/creators/ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://theresolvia.com/for/creators/#webpage",
      "url": "https://theresolvia.com/for/creators/",
      "name": "Video Editing for Creators & Personal Brands",
      "description": "Dedicated post-production studio for YouTube creators and influencers.",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/for/creators/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Who We Serve", "item": "https://theresolvia.com/for/creators/" },
        { "@type": "ListItem", "position": 3, "name": "Creators", "item": "https://theresolvia.com/for/creators/" }
      ]
    }
  ]
}
</script>
```

```html
<!-- /for/businesses/ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://theresolvia.com/for/businesses/#webpage",
      "url": "https://theresolvia.com/for/businesses/",
      "name": "Video Editing Services for Businesses & B2B SaaS",
      "description": "Professional video post-production for corporate marketing teams and B2B SaaS.",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/for/businesses/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Who We Serve", "item": "https://theresolvia.com/for/businesses/" },
        { "@type": "ListItem", "position": 3, "name": "Businesses & SaaS", "item": "https://theresolvia.com/for/businesses/" }
      ]
    }
  ]
}
</script>
```

```html
<!-- /for/agencies/ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://theresolvia.com/for/agencies/#webpage",
      "url": "https://theresolvia.com/for/agencies/",
      "name": "White-Label Video Editing for Marketing Agencies",
      "description": "Behind-the-scenes post-production partner for creative and social agencies.",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/for/agencies/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Who We Serve", "item": "https://theresolvia.com/for/agencies/" },
        { "@type": "ListItem", "position": 3, "name": "Agencies & Studios", "item": "https://theresolvia.com/for/agencies/" }
      ]
    }
  ]
}
</script>
```

### 4.3 Service pages — `Service` + `BreadcrumbList` (+ optional FAQ in §4.7)

`hasOfferCatalog` removed from YouTube (F7); `provider` and `isPartOf` now reference the canonical Organization.

**`/services/youtube-video-editing/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://theresolvia.com/services/youtube-video-editing/#service",
      "name": "YouTube Video Editing Services",
      "serviceType": "Video Post-Production & Retention Editing",
      "description": "Comprehensive YouTube long-form video editing, narrative retention pacing, sonic foley design, and CTR-optimized thumbnail packaging.",
      "provider": { "@id": "https://theresolvia.com/#organization" },
      "areaServed": "Global"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/services/youtube-video-editing/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://theresolvia.com/services/youtube-video-editing/" },
        { "@type": "ListItem", "position": 3, "name": "YouTube Video Editing", "item": "https://theresolvia.com/services/youtube-video-editing/" }
      ]
    }
  ]
}
</script>
```

**`/services/short-form-video-editing/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://theresolvia.com/services/short-form-video-editing/#service",
      "name": "Short-Form Video Editing Services",
      "serviceType": "Vertical Video Post-Production",
      "description": "High-velocity short-form video editing for TikTok, Instagram Reels, and YouTube Shorts with kinetic typography, sound FX, and retention pacing.",
      "provider": { "@id": "https://theresolvia.com/#organization" },
      "areaServed": "Global"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/services/short-form-video-editing/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://theresolvia.com/services/youtube-video-editing/" },
        { "@type": "ListItem", "position": 3, "name": "Short-Form Video Editing", "item": "https://theresolvia.com/services/short-form-video-editing/" }
      ]
    }
  ]
}
</script>
```

**`/services/podcast-video-editing/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://theresolvia.com/services/podcast-video-editing/#service",
      "name": "Video Podcast Editing Services",
      "serviceType": "Podcast Post-Production & Repurposing",
      "description": "Multi-cam video podcast editing, broadcast audio mastering, chaptering, and vertical short-form clip generation for shows and networks.",
      "provider": { "@id": "https://theresolvia.com/#organization" },
      "areaServed": "Global"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/services/podcast-video-editing/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://theresolvia.com/services/youtube-video-editing/" },
        { "@type": "ListItem", "position": 3, "name": "Podcast Video Editing", "item": "https://theresolvia.com/services/podcast-video-editing/" }
      ]
    }
  ]
}
</script>
```

**`/services/video-ad-editing/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://theresolvia.com/services/video-ad-editing/#service",
      "name": "Video Ad Editing Services",
      "serviceType": "Performance Advertising Creative",
      "description": "Direct response video ad editing, hook iterations, and creative testing variations for Meta, TikTok, and YouTube Ads.",
      "provider": { "@id": "https://theresolvia.com/#organization" },
      "areaServed": "Global"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/services/video-ad-editing/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://theresolvia.com/services/youtube-video-editing/" },
        { "@type": "ListItem", "position": 3, "name": "Video Ad Editing", "item": "https://theresolvia.com/services/video-ad-editing/" }
      ]
    }
  ]
}
</script>
```

### 4.4 Blog posts — `Article` + `BreadcrumbList` (7 pages)

The `author` value below is each page's **visible byline** (`By …`), preserved exactly. `publisher` now references the canonical Organization. `datePublished` and `dateModified` use the **visible "Updated YYYY-MM-DD"** date (F8) — `[NEED: confirm the original publish date if it differs]`. Every block carries `[NEED: image URL]` before publishing because the HTML has no article image (F3). Add `"image": "<real visible image URL>"` to each `Article` once supplied. `BlogPosting` is also acceptable; `Article` is used because that is the existing type on all seven pages.

**1) `/blog/2026-thumbnail-psychology-playbook/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/2026-thumbnail-psychology-playbook/#article",
      "headline": "The 2026 Thumbnail Psychology Playbook: Designing for High-Stakes CTR",
      "description": "Master high-CTR thumbnail packaging. Moving beyond exaggerated faces into visual contrast, lighting isolation, cognitive curiosity loops, and title synchronization.",
      "datePublished": "2026-03-08",
      "dateModified": "2026-03-08",
      "author": { "@type": "Organization", "name": "Resolvia Studio Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/2026-thumbnail-psychology-playbook/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/2026-thumbnail-psychology-playbook/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "The 2026 Thumbnail Psychology Playbook: Designing for High-Stakes CTR", "item": "https://theresolvia.com/blog/2026-thumbnail-psychology-playbook/" }
      ]
    }
  ]
}
</script>
```

**2) `/blog/how-to-improve-youtube-retention/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/how-to-improve-youtube-retention/#article",
      "headline": "How to Improve Audience Retention on YouTube: The 4-Beat Blueprint",
      "description": "Master YouTube audience retention. How to fix the 30-second cliff, engineer curiosity open loops, and use sonic foley to sustain 50%+ Average View Duration.",
      "datePublished": "2026-02-05",
      "dateModified": "2026-02-05",
      "author": { "@type": "Organization", "name": "Resolvia Editorial Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/how-to-improve-youtube-retention/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/how-to-improve-youtube-retention/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "How to Improve Audience Retention on YouTube: The 4-Beat Blueprint", "item": "https://theresolvia.com/blog/how-to-improve-youtube-retention/" }
      ]
    }
  ]
}
</script>
```

**3) `/blog/white-label-video-editing-agency-guide/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/white-label-video-editing-agency-guide/#article",
      "headline": "How Agencies Outsource Video Editing: The 2026 White-Label Playbook",
      "description": "A strategic guide for marketing, creative, and social media agencies wanting to scale video production capacity, preserve 60%+ margins, and protect client relationships.",
      "datePublished": "2026-03-01",
      "dateModified": "2026-03-01",
      "author": { "@type": "Organization", "name": "Resolvia Studio Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/white-label-video-editing-agency-guide/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/white-label-video-editing-agency-guide/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "How Agencies Outsource Video Editing: The 2026 White-Label Playbook", "item": "https://theresolvia.com/blog/white-label-video-editing-agency-guide/" }
      ]
    }
  ]
}
</script>
```

**4) `/blog/agency-vs-freelance-video-editor/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/agency-vs-freelance-video-editor/#article",
      "headline": "Video Editing Agency vs Freelance Video Editor: Which is Better in 2026?",
      "description": "Compare video editing agencies vs freelance video editors. Analyze cost, turnaround reliability, audio mastering, motion graphics, and scalability for creators.",
      "datePublished": "2026-01-22",
      "dateModified": "2026-01-22",
      "author": { "@type": "Organization", "name": "Resolvia Editorial Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/agency-vs-freelance-video-editor/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/agency-vs-freelance-video-editor/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "Video Editing Agency vs Freelance Video Editor: Which is Better in 2026?", "item": "https://theresolvia.com/blog/agency-vs-freelance-video-editor/" }
      ]
    }
  ]
}
</script>
```

**5) `/blog/b2b-saas-video-production-acquisition-guide/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/b2b-saas-video-production-acquisition-guide/#article",
      "headline": "B2B SaaS Video Production: How Tech Companies Turn Product Demos into High-ARR Customer Funnels",
      "description": "Stop recording boring software walkthroughs. Learn how B2B tech companies engineer high-retention product demo videos that drive organic pipeline and lower customer acquisition costs.",
      "datePublished": "2026-03-15",
      "dateModified": "2026-03-15",
      "author": { "@type": "Organization", "name": "Resolvia Studio Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/b2b-saas-video-production-acquisition-guide/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/b2b-saas-video-production-acquisition-guide/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "B2B SaaS Video Production: How Tech Companies Turn Product Demos into High-ARR Customer Funnels", "item": "https://theresolvia.com/blog/b2b-saas-video-production-acquisition-guide/" }
      ]
    }
  ]
}
</script>
```

**6) `/blog/video-editing-cost-pricing-guide/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/video-editing-cost-pricing-guide/#article",
      "headline": "How Much Does Professional Video Editing Cost in 2026? (Agency vs Freelancer Pricing Breakdown)",
      "description": "A transparent breakdown of professional video editing pricing in 2026. Compare hourly rates, per-video pricing, and monthly agency retainers for YouTube and short-form.",
      "datePublished": "2026-01-15",
      "dateModified": "2026-01-15",
      "author": { "@type": "Organization", "name": "Resolvia Editorial Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/video-editing-cost-pricing-guide/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/video-editing-cost-pricing-guide/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "How Much Does Professional Video Editing Cost in 2026? (Agency vs Freelancer Pricing Breakdown)", "item": "https://theresolvia.com/blog/video-editing-cost-pricing-guide/" }
      ]
    }
  ]
}
</script>
```

**7) `/blog/what-makes-a-good-short-form-video-editor/`**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://theresolvia.com/blog/what-makes-a-good-short-form-video-editor/#article",
      "headline": "What Makes a Good Short-Form Video Editor? 7 Non-Negotiable Skills in 2026",
      "description": "What separates an average vertical video editor from a top-tier post-production specialist? Discover the 7 non-negotiable skills for TikTok, Reels, and Shorts pacing.",
      "datePublished": "2026-02-18",
      "dateModified": "2026-02-18",
      "author": { "@type": "Organization", "name": "Resolvia Editorial Team", "url": "https://theresolvia.com/" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://theresolvia.com/blog/what-makes-a-good-short-form-video-editor/" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theresolvia.com/blog/what-makes-a-good-short-form-video-editor/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
        { "@type": "ListItem", "position": 3, "name": "What Makes a Good Short-Form Video Editor? 7 Non-Negotiable Skills in 2026", "item": "https://theresolvia.com/blog/what-makes-a-good-short-form-video-editor/" }
      ]
    }
  ]
}
</script>
```

### 4.5 BreadcrumbList — where breadcrumbs visibly exist

Visible `<nav class="breadcrumb">` exists on: `/work/`, all 4 service pages, all 3 `/for/*` pages, all 7 blog posts. It does **not** exist on `/`, `/blog.html`, any product/tool page, or the legal pages. No `BreadcrumbList` should be added to those pages.

The canonical pattern (shown with the `/work/` values) is in §4.2. Each breadcrumb block above carries its own `@id` ending in `#breadcrumb`. Google expects the last crumb's `item` to be the current page URL, which holds for every block here.

### 4.6 Product pages — `SoftwareApplication`

No price, rating, or review text is visible on any tool page, so **no `offers`, `aggregateRating` or `review` is included** — Google's software rich result would need those, and none may be invented. `[NEED: visible price/offer + real ratings before adding any of these]`. `applicationCategory` uses a common Schema.org value; `operatingSystem` reflects browser-only web apps.

`/mcp` (add to **one** of `mcp.html` / `mcp/index.html`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://theresolvia.com/mcp#application",
      "name": "Resolvia MCP",
      "description": "Use Resolvia inside Claude and ChatGPT: find viral videos, adapt their script and edit your video from the chat.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://theresolvia.com/mcp",
      "publisher": { "@id": "https://theresolvia.com/#organization" }
    }
  ]
}
</script>
```

`/copilot`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://theresolvia.com/copilot#application",
      "name": "Resolvia Copilot",
      "description": "Talk to Resolvia Copilot: it finds the viral videos for your product, writes your script and edits your video.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://theresolvia.com/copilot",
      "publisher": { "@id": "https://theresolvia.com/#organization" }
    }
  ]
}
</script>
```

`/script-studio`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://theresolvia.com/script-studio#application",
      "name": "Resolvia Script Studio",
      "description": "Turn a viral video into your own script in two clicks: same hook, same structure, rewritten for your product.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://theresolvia.com/script-studio",
      "publisher": { "@id": "https://theresolvia.com/#organization" }
    }
  ]
}
</script>
```

`/auto-editing`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://theresolvia.com/auto-editing#application",
      "name": "Resolvia Auto Editing",
      "description": "Drop your footage and get a short video edited like the viral ones: cuts, captions, b-roll and motion, in one click.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://theresolvia.com/auto-editing",
      "publisher": { "@id": "https://theresolvia.com/#organization" }
    }
  ]
}
</script>
```

`/super-search` — **do not publish a `SoftwareApplication` block as-is.** The visible page is a marketing landing page for the editing service ("We Edit Videos That Break The Algorithm"), and its canonical points to the homepage. Use a minimal `WebPage` only after `[NEED: confirm intended canonical URL and whether this is a product UI or a service landing page]`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://theresolvia.com/super-search#webpage",
      "url": "https://theresolvia.com/super-search",
      "name": "We Edit Videos That Break The Algorithm",
      "description": "Retention-engineered hooks, custom sound design, and viral motion graphics. You record the footage — we engineer the views.",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    }
  ]
}
</script>
```

### 4.7 FAQPage — only where FAQs are visibly present, semantic only

**These blocks cannot earn a Google FAQ rich result (retired 7 May 2026).** Include them only if a non-Google semantic consumer is intended; otherwise omit them. Where kept, the Q&A must match the visible accordion exactly.

**Homepage** — replace the current 3 mismatched questions with the 6 visible ones:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://theresolvia.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Resolvia?",
      "acceptedAnswer": { "@type": "Answer", "text": "Resolvia is an elite video editing studio and agency. We partner with leading creators, founders, and personal brands to edit viral, retention-engineered videos that build massive audiences and scale revenue." }
    },
    {
      "@type": "Question",
      "name": "What tools do you edit with?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our editors work exclusively in Adobe Premiere Pro, After Effects, and DaVinci Resolve Studio. Every video receives custom sound effects, professional typography, calibrated color passes, and 4K masters." }
    },
    {
      "@type": "Question",
      "name": "Which platforms do you cover?",
      "acceptedAnswer": { "@type": "Answer", "text": "We produce vertical short-form for TikTok, Instagram Reels, and YouTube Shorts, as well as full-length YouTube videos, documentary edits, and high-converting paid ad creatives." }
    },
    {
      "@type": "Question",
      "name": "What is your turnaround time?",
      "acceptedAnswer": { "@type": "Answer", "text": "Standard delivery is 24 to 48 hours per video cut. We work in dedicated Slack or WhatsApp channels directly with you and your team for instant feedback and iteration." }
    },
    {
      "@type": "Question",
      "name": "Do you offer revisions?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes! We provide unlimited revisions on all edits until you are thrilled with the cut. We lock in your style guide and creator profile so every edit hits the mark immediately." }
    },
    {
      "@type": "Question",
      "name": "How do we get started?",
      "acceptedAnswer": { "@type": "Answer", "text": "Simply click \"Book a Call\". We review your current content, define your hook and editing style, and edit your first sample video within 48 hours." }
    }
  ]
}
</script>
```

**`/services/youtube-video-editing/`** — 4 visible FAQs (schema's software question replaced by the visible freelancer question):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://theresolvia.com/services/youtube-video-editing/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is included in Resolvia's YouTube video editing service?",
      "acceptedAnswer": { "@type": "Answer", "text": "Every edit includes end-to-end post-production: raw footage ingestion, structural narrative pacing, retention curve optimization, 3D kinetic titles, custom sound design and foley, Fairlight audio mastering, color grading in DaVinci Resolve Studio, and high-CTR thumbnail packaging." }
    },
    {
      "@type": "Question",
      "name": "What is the typical turnaround time for a YouTube edit?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our standard first cut is delivered within 48 to 72 hours via Frame.io. Revisions submitted before 12 PM EST are implemented same-day." }
    },
    {
      "@type": "Question",
      "name": "How does Resolvia optimize videos for YouTube audience retention?",
      "acceptedAnswer": { "@type": "Answer", "text": "We utilize a 4-beat retention framework: a sub-3-second hook interrupt, micro-tension narrative staging every 20-30 seconds, sonic foley resets to re-engage auditory attention, and seamless transition bridges that eliminate drop-off valleys." }
    },
    {
      "@type": "Question",
      "name": "How do you compare to hiring a freelance video editor?",
      "acceptedAnswer": { "@type": "Answer", "text": "Freelancers frequently juggle unpredictable client loads, risk ghosting, and rarely have specialized sound design or motion graphics expertise. Resolvia gives you a dedicated post-production team with built-in backup coverage, an experienced producer, and a standardized 48-hour delivery SLA." }
    }
  ]
}
</script>
```

**`/services/short-form-video-editing/`** — only the 2 visible FAQs:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://theresolvia.com/services/short-form-video-editing/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What platforms are supported by Resolvia's short-form editing?",
      "acceptedAnswer": { "@type": "Answer", "text": "We deliver 9:16 vertical video masters optimized for TikTok, Instagram Reels, YouTube Shorts, and LinkedIn vertical feeds with UI-safe margins." }
    },
    {
      "@type": "Question",
      "name": "Can you repurpose our existing long-form podcasts or YouTube videos into Shorts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our team ingests your 45-60 minute raw episodes, extracts the top 10-15 viral moments, re-frames the speakers to 9:16, adds kinetic captions, sound design, and platform-native hooks." }
    }
  ]
}
</script>
```

**Blog posts with visible FAQs** — existing `FAQPage` nodes already match the visible accordions; keep them as-is if the semantic consumer is needed. No new FAQ blocks are recommended for the other four posts (they have no visible FAQ section).

### 4.8 Optional: legal/info pages

`WebPage` is valid but earns no rich result; omit unless a semantic consumer needs it. Pattern for `/privacy.html`, `/terms.html`, `/security.html`, `/careers.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://theresolvia.com/privacy.html#webpage",
      "url": "https://theresolvia.com/privacy.html",
      "name": "Privacy Policy",
      "isPartOf": { "@id": "https://theresolvia.com/#website" }
    }
  ]
}
</script>
```
Change `@id`, `url` and `name` per page (e.g. "Terms of Production", "Pre-Release Footage Vault", "Join the Editor Roster").

---

## 5. Validation checklist

- [ ] Choose the Google appearance actually supported today; do not expect FAQ/HowTo/search-box rich results.
- [ ] Validate each block at https://validator.schema.org/ (vocabulary) and supported ones at https://search.google.com/test/rich-results.
- [ ] Required fields present: Organization/WebSite `name`+`url`; Article `headline`, `image`, `datePublished`, `author`; Service `name`/`provider`; BreadcrumbList `itemListElement`; SoftwareApplication `name`.
- [ ] Resolve `[NEED: image URL]` on all 7 posts; `[NEED: verified sameAs]`; `[NEED: served file per tool route]`; `[NEED: super-search intent/canonical]`.
- [ ] Confirm every `url`/`item` uses `https://theresolvia.com` and matches the visible page.
- [ ] Confirm one JSON-LD block per type per rendered URL (no duplicate root `.html` + `/index.html` markup).
- [ ] Re-read edited lines and confirm `<script>` tags and JSON remain well-formed after any change.

---

## 6. Top 5 issues

1. **Homepage FAQPage is wrong** — its 3 Q&As and answers do not match the 6 visible FAQs and include claims absent from the page (F1).
2. **`/work/` VideoObject markup is invalid** — no video is embedded; anchors stand in for `contentUrl`/`embedUrl`, logo stands in for thumbnail, and `duration`/`uploadDate` are unsourced (F2).
3. **Every blog post lacks the required `image` field**, and the blog hub marks up a teaser card as a full `BlogPosting` with an invisible date and author (F3, F4).
4. **Five product/tool pages have no schema at all**, with adjacent URL problems: `/super-search` canonical points home, `/copilot` has no canonical, and all five exist as duplicate files (F10).
5. **FAQ markup is being treated as a rich-result play**, but Google retired FAQ rich results in May 2026; two service FAQ blocks also contain non-visible questions and a YouTube `hasOfferCatalog` lists invisible offers (F5, F6, F7).
