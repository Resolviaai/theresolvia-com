# Programmatic page template — Resolvia

Build-time template for the glossary, comparison, and narrow-persona pages in `marketing-upgrades/reports/09-programmatic-seo-strategy.md`. Pages are generated as static HTML into subfolders on `https://theresolvia.com`.

Fill every `{placeholder}`. If a value cannot be backed by a fact already on the site, write the visible string as `[NEED: ...]` and hold the page. A page with an unresolved `[NEED: ...]` does not publish.

---

## 1. Data record (one per page)

```yaml
id: lufs
playbook: glossary                 # glossary | comparison | persona
slug: lufs
url: https://theresolvia.com/glossary/lufs/
h1: "What is LUFS?"
primary_query: "what is LUFS"
title: "LUFS explained for video editors | Resolvia"
meta_description: "What LUFS means in video production, how it is measured, and the editing decision it changes. Worked example and related terms included."
date_published: 2026-11-24
date_modified: 2026-11-24
hub_url: https://theresolvia.com/glossary/
primary_existing_link: https://theresolvia.com/services/podcast-video-editing/
primary_existing_anchor: "podcast video editing services"
sibling_links:
  - { url: https://theresolvia.com/glossary/foley/, anchor: "sonic foley design" }
answer_paragraph: "..."            # 60-80 words
sections: [...]                    # playbook-specific, see outlines
cta_url: https://calendly.com/resolviaai/meet
noindex: false
```

Field rules:
- `slug`: lowercase, hyphenated, no dates or IDs.
- `title` ≤ 60 chars, `meta_description` ≤ 155 chars, both unique in the set.
- `primary_existing_link`: a different established page for each spoke where possible.
- `noindex` defaults to `false`; set `true` only for a held variation and omit it from the sitemap.

---

## 2. HTML skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{meta_description}">
  <link rel="canonical" href="{url}"/>
  <meta name="robots" content="{index, follow | noindex, follow}">
  <!-- reuse the site's existing stylesheet/JS includes and header/footer components -->
  <script type="application/ld+json">{graph_json_ld}</script>
</head>
<body>
  <!-- existing site header/nav, unchanged -->
  <nav aria-label="Breadcrumb">
    <a href="https://theresolvia.com/">Home</a> /
    <a href="{hub_url}">{hub_name}</a> /
    <span aria-current="page">{breadcrumb_leaf}</span>
  </nav>
  <main>
    <h1>{h1}</h1>
    <p class="answer-first">{answer_paragraph}</p>
    {sections_html}
    <aside>
      <h2>Related reading</h2>
      <ul>
        <li><a href="{sibling_url_1}">{sibling_anchor_1}</a></li>
        <li><a href="{sibling_url_2}">{sibling_anchor_2}</a></li>
      </ul>
      <p>See also: <a href="{primary_existing_link}">{primary_existing_anchor}</a>.</p>
      <p>All terms: <a href="{hub_url}">{hub_name}</a>.</p>
    </aside>
    <div class="cta">
      <p>Discuss your editing workflow with Resolvia.</p>
      <a href="https://calendly.com/resolviaai/meet">Book a consultation</a>
    </div>
    <p class="last-reviewed">Last reviewed: {date_modified}</p>
  </main>
  <!-- existing site footer, unchanged -->
</body>
</html>
```

Keep the site's existing classes, inline styles, header, nav, and footer. Generate only the `<main>` content and the head fields.

---

## 3. Content outlines by playbook

### Glossary — `/glossary/{term}/`
```
H1  What is {term}?
    answer-first paragraph (60-80 words)
H2  Where {term} appears in production
H2  How {term} is measured or applied
H2  Worked example                      <- omit or [NEED: ...] if unverified
H2  A common mistake
H2  Related terms                       <- 2 sibling glossary links
H2  Where this fits in our workflow     <- link to mapped existing page
```

### Comparison — `/compare/{a}-vs-{b}/`
```
H1  {A} vs {B} for {use case}
    answer-first verdict by use case (60-80 words)
H2  Side-by-side                        <- table: setup, control, review speed, collaboration, cost
H2  Choose {A} when
H2  Choose {B} when
H2  How Resolvia handles this           <- stated capability only
H2  Related comparisons + service link
```

### Persona — `/for/{persona}/`
```
H1  Video editing for {persona}
    answer-first paragraph (60-80 words)
H2  A typical publishing workflow
H2  Deliverables mapped to our services
H2  Retention and audio specifics
H2  What to check before hiring an editor
H2  Related audience and glossary links
```

Hard floors: glossary 700 words, comparison 900 words, persona 800 words. At least two sections must be page-specific and not reusable on a sibling.

---

## 4. Schema skeleton

One `@graph` per page. Only mark up text visible on the page. Self-referencing canonical URLs throughout.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://theresolvia.com/#organization",
      "name": "Resolvia",
      "url": "https://theresolvia.com/"
    },
    {
      "@type": "DefinedTerm",
      "@id": "{url}#term",
      "name": "{term}",
      "description": "{visible definition}",
      "inDefinedTermSet": { "@id": "{hub_url}#termset" },
      "url": "{url}"
    },
    {
      "@type": "Article",
      "@id": "{url}#article",
      "headline": "{h1}",
      "description": "{meta_description}",
      "datePublished": "{date_published}",
      "dateModified": "{date_modified}",
      "author": { "@id": "https://theresolvia.com/#organization" },
      "publisher": { "@id": "https://theresolvia.com/#organization" },
      "mainEntityOfPage": { "@id": "{url}" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "{url}#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
        { "@type": "ListItem", "position": 2, "name": "{hub_name}", "item": "{hub_url}" },
        { "@type": "ListItem", "position": 3, "name": "{breadcrumb_leaf}", "item": "{url}" }
      ]
    }
  ]
}
```

Type swaps:
- Comparison: drop the `DefinedTerm` node; keep `Article` + `BreadcrumbList`.
- Persona: replace `DefinedTerm` with `Service` (`serviceType`, `name`, `description`, `provider` → Organization) if the service is visibly described; keep `BreadcrumbList`.
- Hub: `CollectionPage` with `mainEntity` as `ItemList` of spoke URLs, plus `BreadcrumbList`.

Never add: `FAQPage`, `HowTo`, `aggregateRating`, `Review`, `Product`, `Offer`, `price`, or `LocalBusiness` on these pages. FAQ rich results and HowTo rich results are retired.

---

## 5. Pre-publish checklist

- [ ] Unique title (≤60 chars), meta (≤155 chars), H1, and primary query.
- [ ] Answer-first paragraph present and 60–80 words.
- [ ] At least two page-specific sections; word-count floor met.
- [ ] No `[NEED: ...]` left in the rendered page.
- [ ] No unsupported stat, client, testimonial, logo, rating, or price.
- [ ] Breadcrumb + hub link + mapped existing page + at least one sibling link.
- [ ] JSON-LD valid, `@graph` used, matches visible content, no retired rich-result types.
- [ ] Self-referencing canonical with production URL and trailing slash.
- [ ] Included in `sitemap-programmatic.xml`; no conflicting `noindex`.
- [ ] Voice: no banned phrases, no em dashes in short copy, at most one fragment and one list of three per section.
- [ ] Static HTML, no client-only rendering of main content; page weight in line with existing pages.
- [ ] Held variations (`noindex: true`) excluded from the sitemap.
