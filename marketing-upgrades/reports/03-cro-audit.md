# 03 — CRO Audit of Resolvia

**Status:** read-only audit. No site file was edited.
**Skill used:** `cro` v2.0.6, read in full from `C:\Users\rohit\AppData\Local\Temp\opencode\mkt-skills\cro.txt`, plus `references/experiments.md` and `references/form.md` from `C:\Users\rohit\AppData\Local\Temp\skills-use-V5lkVU\cro`.
**Method:** read the shared brief, then parsed and inspected the in-scope HTML. Headlines, CTA strings, form fields, stats and section copy quoted below are taken directly from the files. The middle dot and degree/arrow characters in some titles are correct UTF-8 source bytes and are not treated as defects.

---

## 0. Conversion goal verification

The brief's assumption is confirmed by the markup. Every marketing page funnels to one URL:

`https://calendly.com/resolviaai/meet`

| File | Calendly links | Other conversion path |
|---|---|---|
| `index.html` | 5 | none |
| `services/youtube-video-editing/index.html` | 3 | Netlify quote form |
| `services/short-form-video-editing/index.html` | 3 | Netlify quote form |
| `services/podcast-video-editing/index.html` | 3 | Netlify quote form |
| `services/video-ad-editing/index.html` | 3 | Netlify quote form |
| `for/creators/index.html` | 3 | Netlify quote form |
| `for/businesses/index.html` | 3 | Netlify quote form |
| `for/agencies/index.html` | 3 | Netlify quote form |
| `work/index.html` | 2 | none |
| `blog.html` | 2 | none |
| `super-search.html` | 1 | none |
| `super-search/index.html` | 0 | `mailto:support@theresolvia.com` only |
| `mcp/index.html` | 0 | `Open in Claude` (tool activation) |
| `copilot/index.html` | 0 | chat prompt form |
| `script-studio/index.html` | 0 | `Export` (tool action) |
| `auto-editing/index.html` | 0 | `Export` (tool action) |

Conclusion: the primary goal is booking a consultation through Calendly on the homepage, service, audience, work and blog pages. The seven service and audience pages carry a secondary lead form. The five product pages sit outside that funnel and currently offer no route into it. [NEED: confirm what the Calendly booking page actually shows, since the site promises several different things at the click: "Creative Audit", "Channel Retention Audit", "Paid Creative Audit", "Video Strategy Call", "Agency Partnership" and "Onboarding Call".]

---

## 1. Diagnostic by CRO dimension

### 1.1 Value proposition in 5 seconds

The homepage fails the 5-second test. At `index.html:578-593` the only visible hero text is the brand word **"Resolvia"**, drawn in WebGL by `liquid-text.js:8` (`const text = "Resolvia";`) inside an empty canvas. The real `<h1>` is `sr-only`, so it never appears on screen:

> `Resolvia — High-Retention Video Editing Agency & Creative Studio`

The on-screen subhead is generic:

> `Retention-engineered video editing & post-production for high-growth creators.`

The strongest outcome statement on the page sits in the final CTA block at `index.html:788`:

> `Stop editing. Post what converts.`

A cold visitor therefore sees a brand mark and a category label before seeing a benefit. The WebGL headline also means a visitor with JavaScript or WebGL unavailable gets no headline at all, because the `sr-only` H1 is invisible.

Service and audience pages do better. Each leads with a specific hero badge, H1 and lead paragraph, for example `services/youtube-video-editing/index.html:473-479`:

> `Enterprise YouTube Post-Production`
> `YouTube Video Editing Agency Engineered for High Audience Retention`
> `We turn raw footage into cinematic, high-retention YouTube content. Built for top creators, media brands, and venture-backed founders...`

The audience H1 at `for/creators/index.html:402` is the clearest of the set:

> `Video Editing Built for Creators Who Want to Focus on Filming, Not Editing`

Product pages are the weakest. `mcp/index.html` H1 is `Turn your Claude into a views machine`. `copilot/index.html` H1 is `How can I help you today?`. `script-studio/index.html` H1 is `Create viral scripts from viral videos`. `auto-editing/index.html` has no H1; its visible label is `Auto-Editing`. None explains the benefit in customer terms or connects the tool to the paid editing service.

### 1.2 Headline effectiveness

- Homepage: the visible headline is a brand name, so it carries no outcome, number or audience. The strongest headline exists but is buried in the footer CTA.
- Service pages: outcome focused and specific about format, but heavy on agency jargon ("Post-Production Architecture", "Retention Structural Assembly", "Sonic Engineering"). The H1s are long, roughly 9 to 13 words, which weakens scannability.
- Audience pages: the creators H1 uses the customer's own problem language and is the best headline in the set. The businesses and agencies H1s are category descriptions rather than outcomes.
- Work page: `Featured Post-Production Case Studies & Retention Breakdowns` describes the content, not the result. The result headlines inside the page are far stronger, for example `Scale From 80K to 850K Subscribers in 6 Months` (`work/index.html:444`).

### 1.3 CTA placement, copy and hierarchy

Primary CTA is present above the fold on every marketing page: the sticky nav `Book a Call` (`index.html:553-556`), then a hero CTA. Placement is good. Copy and hierarchy are inconsistent:

| Page | Hero primary CTA | Final CTA |
|---|---|---|
| `index.html` | `Get Your First Edit` | `Book a Call` |
| YouTube service | `Schedule Creative Audit` | `Book Channel Retention Audit` |
| Short-form service | `Book Short-Form Strategy Call` | `Book Short-Form Strategy Call` |
| Podcast service | `Discuss Podcast Production` | `Schedule Podcast Consultation` |
| Video ad service | `Book Paid Creative Audit` | `Book Paid Creative Audit` |
| Creators | `Get Your Videos Edited` | `Book Channel Retention Audit` |
| Businesses | `Book Video Strategy Call` | `Book Video Strategy Call` |
| Agencies | `Discuss Agency Partnership` | `Discuss Agency Partnership` |
| `work/index.html` | `Book a Call` (nav) | `Book Creative Retention Audit` |
| `blog.html` | `Book a Call` (nav) | `Book an Onboarding Call` |

Every one of those labels opens the same generic Calendly URL. Visitors cannot tell what the meeting will cover, how long it takes, or what the next step is. `Get Your First Edit` promises an edit, while the FAQ at `index.html:782` says the call leads to a sample edit within 48 hours. That is a sequencing risk if the booking page does not set the same expectation.

Secondary CTAs are well chosen on most pages (`View Client Work`, `View Featured Case Studies`, `Explore Client Work (50M+ Views)`). The blog has only two Calendly links and no inline contextual CTA inside the article list.

### 1.4 Visual hierarchy and scannability

- Homepage hero gives most visual weight to an animated canvas and a 3D sphere, then a small 15 to 17px subhead. The benefit is not the focal point.
- Service and audience pages use a consistent, scannable template: badge, H1, lead, two buttons, a four-stat strip, then feature grid. This is a strength worth preserving.
- The stat strip at `services/youtube-video-editing/index.html:500-522` (`50M+`, `48 Hours`, `+48.2%`, `100% Zero-Leak`) is strong, but `+48.2%` and `100% Zero-Leak` carry no visible source. [NEED: substantiation for these two figures, or remove them.]
- Work page case study cards use large result numbers (`80K → 850K`, `12% → 44%`) which scan well.
- The homepage FAQ is a two-row grid of six cards with only the first expanded by default. Good use of space, but it pushes answers below the fold on mobile.

### 1.5 Trust signals and social proof

Present: aggregate views (`50M+`), turnaround (`48 Hours`), retention lift (`+48.2%`), security claim (`100% Zero-Leak`), 41+ case studies, four detailed case studies on `work/index.html` with concrete numbers.

Missing or weak:

- No client logos, named testimonials, attributed quotes, photos, or review scores anywhere in scope. Case studies are anonymous (`A top entrepreneurship podcast`, `a company`).
- No proof near the Calendly CTAs. The stat strip appears well above the final conversion banner, so the decision point has no supporting evidence.
- No visible explanation of the "encrypted pre-release vault" or bilateral NDAs on the homepage, where a new visitor would weigh confidentiality.
- The middle of the homepage shows view-count tiles such as `418K`, `17.6M`, `78.3M` attached to generic labels (`Recreate Wrong, right`). These read as template demos rather than client proof and dilute the credibility of the real 50M+ claim.

### 1.6 Objection handling

Homepage FAQ (`index.html:699-785`) covers what Resolvia is, tools, platforms, turnaround and unlimited revisions, plus a "How do we get started?" answer that points to `Book a Call`.

Service FAQ (`services/youtube-video-editing/index.html:630-672`) adds turnaround detail and a freelance comparison.

Gaps:

- No price or budget answer. The site has a published pricing guide with `$500–$1,500 per video` and `$2,500–$8,000/month` retainers, but none of the eight service and audience pages answer "how much does this cost?". They route straight to a quote form or a call.
- No "what if it does not work for my channel" answer backed by a sample or pilot.
- No "how do I know my footage and brand are safe" answer on the homepage. It exists in fragments on audience pages.
- Inconsistent turnaround claims: homepage FAQ says `24 to 48 hours per video cut`, service FAQ says `48 to 72 hours`, and the hero/meta promises `48-hour`. Visitors comparing pages will notice.

### 1.7 Friction points

**Quote form on all seven service and audience pages** (`services/youtube-video-editing/index.html:675-727`):

- Five visible fields: `Your Name`, `Email / Telegram / X`, `Channel / Website URL`, `Service Required`, `Monthly Video Volume & Target Goal`.
- Labels are visible and clear, which is good. Field count is reasonable for a B2B quote request.
- `Email / Telegram / X` uses `type="text"` with no input mode or validation, so email typos will not be caught. [NEED: confirm Netlify form notifications and whether a hand entered Telegram or X handle is workable for follow up.]
- The `Service Required` select is identical on all seven pages. On the podcast page (`services/podcast-video-editing/index.html:512-516`) it defaults to `YouTube Long-Form (8-25 min)`, which is the wrong service unless the visitor changes it. Same mismatch on short-form, ads, creators, businesses and agencies pages.
- There is no visible privacy reassurance, no expected response time next to the button, and the button copy `Request Production Scope & Quote →` repeats "Request" from the heading. The intro paragraph does promise a reply within 4 hours, but it sits above the fields.
- The form is introduced as `Prefer Email or Quote First?` and `Request a Production Retainer Quote`. The word "Retainer" may discourage a visitor who wants one video. [NEED: confirm whether one-off projects are accepted.]

**Consultation CTA:**

- All Calendly links use `target="_blank"`, which opens a new tab and breaks the single-flow feeling.
- The CTA labels promise different deliverables for the same booking link, as listed in section 1.3.
- The blog `Book an Onboarding Call` callout and the homepage "first sample video within 48 hours" promise are two different expectations attached to one link.

**Product pages:**

- No route from a free tool user to a paid consultation. `mcp/index.html` ends at `Open in Claude`; `copilot/index.html` at a chat box; `script-studio/index.html` and `auto-editing/index.html` at `Export`.
- `super-search.html` and `super-search/index.html` carry the agency homepage body almost verbatim, including the same FAQ, same `#portfolio` tiles and same final CTA, under the H1 `We Edit Videos That Break The Algorithm`. A visitor arriving for a product demo lands on an agency page. Only the `.html` version contains a Calendly link.
- The five tool pages have no meta description. Product H1s are either generic or absent, so the value of each tool is unclear on arrival.

---

## 2. Quick Wins (Implement Now)

1. **Put the outcome headline above the fold on `index.html`.** Change the visible hero from the WebGL "Resolvia" word to the existing line `Stop editing. Post what converts.` and make the real `<h1>` visible. Keep the canvas as decoration behind it. This reuses copy already on the page and needs no new claim.
2. **Standardise the primary CTA label.** Use `Book a Consultation` or `Book Your Retention Audit` for the nav and hero button across `index.html`, all four `services/*/index.html`, all three `for/*/index.html`, `work/index.html` and `blog.html`, and keep the Calendly URL unchanged. [NEED: confirm which label matches the actual Calendly event.]
3. **Pre-select the correct service in the quote form.** In each of the seven service and audience pages, add `selected` to the matching `<option>` in the `Service Required` select, or add a neutral `Select a service` first option. Four copy-identical forms make a wrong default likely.
4. **Add one trust line beside the quote button.** Under the form button at each of the seven pages, add a short line using existing facts, for example ` Replies within 4 hours. 50M+ client views.`. Source: the 4-hour promise already in the form intro, and 50M+ from the stat strip.
5. **Fix the turnaround inconsistency.** Align the homepage FAQ answer at `index.html:754`, the service FAQ answers and the hero claims on one figure. Use the brief's verified `48-hour sprint` language where a single number is needed.
6. **Use `type="email"` for the contact field** where an email address is expected, or relabel the field to `Email address` and add a separate optional handle field. Current field: `name="contact"`, `type="text"`, placeholder `alex@channel.com or @handle`.
7. **Replace the anonymous work-page case study labels with attributed proof where possible.** Titles such as `Scale From 80K to 850K Subscribers in 6 Months` are strong; add the client name, logo or a one-line attributed quote. [NEED: client permission and names. Do not invent them.]
8. **Add a tool-to-service bridge on the five product pages.** One line plus one link under the primary tool action, for example ` Need the edit done for you? Book a consultation.` linking to the existing Calendly URL. This connects product traffic to the primary goal.

### Form audit summary

| Issue | Impact | Fix | Priority |
|---|---|---|---|
| Wrong default service on 6 of 7 forms | Misrouted or slower follow up | Pre-select page service | High |
| Combined text contact field | Email typos, no mobile keyboard | Split or use `type="email"` | Medium |
| No privacy or response-time line near button | Hesitation at submit | Add one trust line | Medium |
| "Retainer" in heading | Deters single-video buyers | Say "Project or retainer quote" if true | Medium |
| Honeypot and `form-name` hidden inputs | Expected for Netlify, no user impact | Leave as is | None |

[NEED: field level analytics for the 7 forms, mobile vs desktop completion split, and confirmation that form submissions reach a monitored inbox.]

---

## 3. High-Impact Changes (Prioritize)

1. **Rebuild the homepage hero argument.** Outcome headline visible, a one-line subhead that names the audience and the mechanism, a single primary CTA, and a proof strip with 50M+ views, 48-hour turnaround and the 80K to 850K case study. The current hero spends its prime space on brand animation. Keep the animation as a background layer.
2. **Create one named consultation offer and use it everywhere.** The site already describes a "30-minute creative strategy and retention audit". Use that single phrase on all Calendly CTAs and align the Calendly event name to it. Currently eight different labels point to one link, which weakens message match and makes the meeting hard to understand.
3. **Put attributed proof at the decision points.** Add one named case study snippet or short attributed testimonial next to the final CTA on `index.html`, all four service pages, the three audience pages and `work/index.html`. The work page has four strong result stories with no named client. [NEED: permissions and attributions.]
4. **Answer price and risk on every service and audience page.** Add two FAQ entries: a published price range from the site's own pricing guide, and a confidentiality answer covering the encrypted vault and bilateral NDAs. Link to the existing pricing guide instead of restating figures where possible. [NEED: confirm the published ranges are approved for these pages.]
5. **Give the product pages a conversion path.** Each of the five tool pages should state the tool's benefit in the H1 or subhead, show one proof point, and offer two actions: use the tool now, and book a consultation if the visitor wants the edit done for them. `mcp/index.html` already has the strongest tool headline; `copilot/index.html`, `script-studio/index.html` and `auto-editing/index.html` need one.
6. **Add contextual CTAs inside blog content.** `blog.html` has 7 articles and only two Calendly links. Add one inline CTA at a natural stopping point in the listing and a related-resource link to the matching service page, rather than relying on the single closing callout.

---

## 4. Test Ideas

Hypotheses worth A/B testing. Use the existing analytics bridge (`assets/analytics.js` has Calendly click tracking) to measure at the click and booking level. [NEED: confirm goal events are configured in GA4.]

| # | Page | Test | Hypothesis |
|---|---|---|---|
| 1 | `index.html` | Visible benefit H1 vs current WebGL brand hero | A visible outcome headline raises Calendly click rate because the value is clear in 5 seconds |
| 2 | `index.html` | Proof strip in hero vs proof further down | Placing 50M+ and 48-hour proof next to the hero CTA reduces hesitation |
| 3 | All 7 service/audience pages | Single CTA label vs page-specific labels | One consistent "Book your retention audit" label lifts bookings by setting a clear expectation |
| 4 | 7 quote forms | 5 fields vs 3 fields (name, email, project detail) | Fewer fields raise form completion, since channel URL and service can be inferred from the page or follow up |
| 5 | 7 quote forms | Inline Calendly embed vs external link | Embedding the booking widget on page raises completion because it avoids a new tab |
| 6 | Service pages | "Request a Production Retainer Quote" vs "Get a project quote" | Removing the retainer word raises submissions from one-off buyers [NEED: confirm one-offs accepted] |
| 7 | `work/index.html` | Named case study vs anonymous result headline | An attributed result increases trust and CTA clicks [NEED: client permission] |
| 8 | `blog.html` | Inline contextual CTA vs closing CTA only | Mid-list CTAs capture readers who do not scroll to the bottom |
| 9 | Product pages | Tool-only ending vs tool plus consultation bridge | A second action converts a share of free-tool users into consultation bookings |
| 10 | Site wide | Sticky nav CTA vs current static nav CTA | A persistent booking path raises clicks on long pages |

---

## 5. Copy Alternatives

New copy below uses only facts present on the site. The middle dot and arrows in quoted source strings are preserved as-is.

### 5.1 Homepage hero headline (source H1 at `index.html:578`: `Resolvia — High-Retention Video Editing Agency & Creative Studio`; visible word: `Resolvia`)

- **A.** `Stop editing. Post what converts.` Rationale: already the site's strongest line, at `index.html:788`. Reusing it keeps the claim source-supported and moves the benefit into the first screen.
- **B.** `High-retention edits, delivered in 48 hours.` Rationale: leads with the mechanism and the verified turnaround. Best for traffic that already knows the category.
- **C.** `You record. We engineer the views.` Rationale: adapted from `super-search.html` subhead `You record the footage — we engineer the views.` Short, customer language, and supported by the 50M+ views figure. [NEED: confirm "engineer the views" is acceptable as an outcome claim in this context.]

### 5.2 Homepage hero subhead (source: `Retention-engineered video editing & post-production for high-growth creators.`)

- **A.** `Retention-engineered editing for creators, media brands and growth teams. First cuts in 48 hours.` Rationale: adds the audience list already used across service pages and the verified sprint.
- **B.** `Hook, pace and sound design built to hold attention. Edited by a dedicated studio team.` Rationale: describes the method in customer language and uses the team claim from the FAQ.
- **C.** `50M+ client views across long-form, shorts and podcasts. Frame.io review and a 48-hour first cut.` Rationale: puts proof before the ask, using figures already on the site.

### 5.3 Primary consultation CTA (source strings: `Get Your First Edit`, `Book a Call`, `Schedule Creative Audit`, `Book Channel Retention Audit`, `Book a Call`)

- **A.** `Book Your Retention Audit` Rationale: names the deliverable already described in the conversion banners and keeps all pages consistent.
- **B.** `Book a 30-Minute Call` Rationale: sets time expectation and reduces fear of an open-ended sales call. [NEED: confirm the Calendly event duration.]
- **C.** `See If We Can Help Your Channel` Rationale: lower commitment framing for cold visitors and matches the audit framing.

### 5.4 YouTube service final CTA (source H2 at `services/youtube-video-editing/index.html:736`: `Transform Your YouTube Content Into a High-Retention Engine`; button: `Book Channel Retention Audit`)

- **A.** `Get a retention audit for your next upload` Rationale: outcome in customer language, avoids abstract "engine" metaphor.
- **B.** `Find out where your viewers drop off` Rationale: names the specific problem the audit solves, backed by the retention framework described in the FAQ.
- **C.** `See your 48-hour first cut plan` Rationale: ties the call to the concrete delivery promise already used on the page.

### 5.5 Quote form heading and button (source heading: `Request a Production Retainer Quote`; button at `services/youtube-video-editing/index.html:725`: `Request Production Scope & Quote →`)

- **A.** Heading `Get a project quote`, button `Send My Project Details` Rationale: removes "retainer" friction and removes the duplicated word "Request". [NEED: confirm one-off projects accepted.]
- **B.** Heading `Tell us about your next video`, button `Get My Quote in 4 Hours` Rationale: echoes the response time promise already in the form intro and uses value based button copy.
- **C.** Heading `Prefer email to a call?`, button `Request a Quote` Rationale: keeps the existing "Prefer Email or Quote First?" positioning but shortens it for scanning.

### 5.6 Work page final CTA (source H2 at `work/index.html:545`: `Want Results Like These for Your Channel?`; button: `Book Creative Retention Audit`)

- **A.** `Let's find your 80K to 850K moment` Rationale: reuses the case study result on the page. [NEED: only if the client permits naming the result in an ad style headline.]
- **B.** `Get a breakdown of your own retention curve` Rationale: matches what the audit actually delivers.
- **C.** `Start with a 30-minute channel review` Rationale: clear next step and expected effort.

### 5.7 Product page bridge (new line, source actions: `Open in Claude`, `Export`, `How can I help you today?`)

- **A.** `Want the finished edit instead? Book a consultation.` Rationale: connects free tool usage to the primary goal in plain language.
- **B.** `Use this tool, or have our studio edit it for you in 48 hours.` Rationale: presents both paths and uses the verified turnaround.
- **C.** `Research it here. We can edit the result.` Rationale: short and specific to the research tools.

---

## Top 5 recommendations

1. Move `Stop editing. Post what converts.` into the visible homepage H1 and stop using the WebGL brand word as the hero headline.
2. Replace eight different Calendly CTA labels with one named offer, and confirm the Calendly event matches that promise.
3. Pre-select the correct service in the quote form on all seven service and audience pages and fix the combined email or handle field.
4. Add attributed proof and a price or confidentiality answer at the decision points, using the site's existing case studies and published pricing ranges, with permissions confirmed.
5. Give the five product pages a benefit headline and a single bridge link into the consultation funnel, and add one contextual CTA inside `blog.html`.

### [NEED: ...] items to resolve before publishing copy

- [NEED: Calendly booking page event name, duration and what is delivered on the call.]
- [NEED: client names, logos and permission for attributed case studies and testimonials.]
- [NEED: substantiation for `+48.2%` retention lift and `100% Zero-Leak`.]
- [NEED: approval to publish price ranges on service and audience pages.]
- [NEED: confirmation that one-off projects are accepted, and that Netlify form submissions reach a monitored inbox.]
- [NEED: GA4 goal configuration for Calendly clicks and form submissions, plus form field level analytics.]
