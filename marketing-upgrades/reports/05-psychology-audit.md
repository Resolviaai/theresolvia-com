# 05 — Marketing Psychology Audit: Resolvia

**Agent:** 5/27, Wave 1 · **Skill:** marketing-psychology v2.0.3 · **Mode:** read-only audit (no site files edited)

**Pages inspected:** `index.html`; `services/youtube-video-editing/`, `services/short-form-video-editing/`, `services/podcast-video-editing/`, `services/video-ad-editing/` (all `index.html`); `for/creators/`, `for/agencies/`, `for/businesses/` (all `index.html`); `work/index.html`; `blog/video-editing-cost-pricing-guide/index.html`. Peripheral check: `blog.html` creator callout (for existing scarcity/popup patterns).

---

## Scope and method

I extracted visible text from each page (scripts, styles and SVGs removed), then mapped every persuasive element to a named mental model from the skill. Each finding below cites the **exact page section and current copy string** so a builder can locate it without re-analysis. Facts are limited to the brief and the site's own copy; anything requiring evidence the site does not contain is marked `[NEED: ...]`.

**Ethics guardrails applied throughout:** no invented statistics, clients, quotes, logos or guarantees; no fake countdowns, "spots left", false "Q1 only" windows; no preselected or hidden choices that mislead; no manufactured testimonials; no disguised ads or forced continuity. Persuasion here should reduce uncertainty for a genuinely high-consideration B2B purchase, not manufacture urgency that does not exist.

---

## Quick Reference scorecard

The skill's Quick Reference table, scored against the site:

| Challenge | Relevant models (skill) | Resolvia status | Where / evidence |
|---|---|---|---|
| Low conversions | Hick's Law, Activation Energy, BJ Fogg, Friction | **Partial** | Two competing hero CTAs on `index.html` ("Get Your First Edit" / "View Client Work"); quote form reduces friction with "Not ready for a live call?…" but adds a 5-field form |
| Price objections | Anchoring, Framing, Mental Accounting, Loss Aversion | **Strong** | Pricing guide direct answer ($150–$400 → $500–$1,500 → $2,500–$8,000+); businesses page "$90K–$120K/year"; "hidden transaction costs" |
| Building trust | Authority, Social Proof, Reciprocity, Pratfall Effect | **Strong except Pratfall** | 50M+ / 950M view figures, case-study metrics, technical specifics, free editorial; zero candid limitation anywhere |
| Increasing urgency | Scarcity, Loss Aversion, Zeigarnik Effect | **Loss aversion strong; Scarcity risky; Zeigarnik absent** | "Stop losing 30+ hours every week"; blog.html "select roster… open Q1 creator partnerships" needs review |
| Retention/churn | Endowment Effect, Switching Costs, Status-Quo Bias | **Latent, unlabelled** | "We lock in your style guide and creator profile…"; Frame.io + dedicated Slack/WhatsApp channels |
| Growth stalling | Theory of Constraints, Local vs Global Optima, Compounding | **N/A (strategy, not page)** | Not page-level; note that CTA splitting is a local fix while a single decision path is the global one |
| Decision paralysis | Paradox of Choice, Default Effect, Nudge Theory | **Partial / one defect** | 5-option quote form is reasonable; but the same service dropdown defaults to "YouTube Long-Form" on the short-form page — a wrong, context-free default |
| Onboarding | Goal-Gradient, IKEA Effect, Commitment & Consistency | **Commitment partial; Goal-Gradient/IKEA absent** | Two-step quote → call path works; no progress or co-creation element on any page |

---

# Part A — Models already working (protect these)

### A1. Bandwagon Effect / Social Proof — the site's strongest asset
- **Where:** `index.html` → "Featured Client Edits" section; stats band; footer. Also `work/index.html` header and service-page stat blocks.
- **Current copy:** "High-retention edits crafted for our creators and brands — tens of millions of views combined." followed by ~30 view tiles (418K, 1.3M, 17.6M, 78.3M…), then "See the 41 others". Stats band: "950M Viral Shorts / 569M Reel Cuts / 152M Motion FX Cut / 195M YouTube Cuts". Footer link: "Featured Case Studies (50M+)". Work page: "50M+ Views Engineered".
- **Psychology:** popularity signals quality and safety; large numbers lower perceived risk. Vivid counts also trigger the availability heuristic, making a similar outcome easy to imagine.
- **Why it works ethically:** the figures are presented as counts of work, not as guaranteed results for the buyer. Keep the "See the 41 others" link, which invites verification. **Protect:** do not convert these into "you will get 78.3M views" implications.

### A2. Authority Bias — technical specificity, not title inflation
- **Where:** `services/youtube-video-editing/index.html` → stats and "Complete Post-Production Architecture"; `work/index.html` → case studies; `for/businesses/index.html` → "Why Do Businesses Outsource…".
- **Current copy:** "Average Retention Lift +48.2% / Measured across 80+ client uploads"; "Pipeline Guarantee 100% Zero-Leak / Encrypted bilateral NDA vault"; "Dialogue is mastered with Fairlight DSP to broadcast loudness standards (-14 LUFS)"; "Shot-to-shot color matching, ACES color management"; work case study "Click-Through Rate (CTR) 9.4% (vs 3.8% avg)" and "Pipeline Attributed $420,000 ARR"; businesses: "$90K–$120K/year plus software licenses and equipment".
- **Psychology:** audiences defer to demonstrable expertise; named tools, standards and sample sizes are credible proxies for it.
- **Why it works ethically:** the authority is procedural and checkable. Caution on the two absolute claims — see C3.

### A3. Contrast Effect — before/after is used well on the work page
- **Where:** `work/index.html` → all four case studies.
- **Current copy:** "Scale From 80K to 850K Subscribers in 6 Months" with "Average View Duration (AVD) 28% → 56% (+100%)"; "From Boring Software Demos to 17.6M Organic Views"; "From 12% to 44% Completion Rate on a 32-Minute Documentary".
- **Psychology:** a clearly stated weak starting point makes the improvement vivid and legible. Each case study also supplies the mechanism ("0-3s Hook Staging, DaVinci Studio Fairlight Master…"), which prevents the numbers reading as magic.
- **Why it works ethically:** the "before" state is a description of a real project, not a straw man invented to flatter the service.

### A4. Loss Aversion / Prospect Theory — grounded in real client costs
- **Where:** `for/creators/index.html` hero and "The Creator Dilemma & How We Solve It"; `services/short-form-video-editing/index.html` hero; pricing guide §3; `index.html` final CTA.
- **Current copy:** "Stop losing 30+ hours every week inside timeline software."; "Most videos lose 50% of viewers in the first 45 seconds."; "Never miss an upload deadline again."; "Ready to Reclaim 30+ Hours Every Week?"; "Stop wasting hours trying to keep up with vertical content algorithms."; "creators often overlook hidden transaction costs: editor churn, missed deadlines, unmastered audio, and the creator spending 10 hours managing and writing revision notes."; "Stop editing. Post what converts."
- **Psychology:** losses register roughly twice as strongly as equivalent gains. Framing the status quo as an ongoing cost makes inaction feel expensive.
- **Why it works ethically:** every "loss" named is an operational cost the service genuinely removes or a platform behaviour already on the site. Keep it factual; escalation into fear is unnecessary.

### A5. Anchoring + Price Relativity / Good-Better-Best — transparently done
- **Where:** `blog/video-editing-cost-pricing-guide/index.html` → Direct Answer Overview and §1 table; `for/businesses/index.html` and `for/agencies/index.html`.
- **Current copy:** "$150 to $400 per video for entry-level freelance edits, $500 to $1,500 per video for experienced YouTube retention editors, and $2,500 to $8,000+ per month on an agency retainer." Table: "Hourly Rate $35 – $120 / hour", "Per-Video Fixed $350 – $1,800 / edit", "Monthly Retainer $2,500 – $7,500 / mo" with a "Key Trade-off" column; agencies: "mark up video post-production services 50% to 100% with zero payroll liabilities."
- **Psychology:** the first number (and the highest tier) sets the reference point; the middle option then reads as reasonable. Publishing trade-offs alongside prices is what keeps this from being a decoy setup.
- **Why it works ethically:** the anchors are market ranges stated as public information, and the trade-offs are disclosed. This is the model to preserve most carefully — see D3 on decoys.

### A6. Reciprocity — value given before the ask
- **Where:** seven in-depth retention/production guides linked site-wide ("All Retention Guides"); every service and audience page's quote form; `index.html` FAQ.
- **Current copy:** "Not ready for a live call? Submit your project details below and our lead producer will reply within 4 hours with a custom scope and turnaround quote."; "Simply click \"Book a Call\". We review your current content, define your hook and editing style, and edit your first sample video within 48 hours."; pricing guide form: "Submit your channel details and our lead producer will reply within 4 hours."
- **Psychology:** unsolicited useful input creates a desire to return the favour. A specific, fast human response (4 hours) is a stronger gift than a generic "we'll be in touch".
- **Why it works ethically:** the giving is real and costs the visitor nothing. Gap: none of it is labelled as a free asset — see B1.

### A7. Liking / Similarity and Unity — audience pages mirror identity
- **Where:** `for/creators/`, `for/agencies/`, `for/businesses/` heroes and benefit blocks; `index.html` final CTA.
- **Current copy:** "Built for High-Growth YouTubers"; "Video Editing Built for Creators Who Want to Focus on Filming, Not Editing"; "Confidential White-Label Post-Production"; "We never contact your clients or publish work without your written permission."; "Stop editing. Post what converts."
- **Psychology:** people say yes to those like them and to groups they belong to. The white-label promise signals shared professional values with agency buyers.
- **Why it works ethically:** identity is framed around the customer's actual job, not a fabricated tribe.

### A8. Commitment & Consistency / Foot-in-the-Door — a real two-step path
- **Where:** quote form → consult on all service and audience pages.
- **Current copy:** "Not ready for a live call? Submit your project details below…" (small commitment) → "Book a direct 30-minute creative strategy and retention audit…" (larger commitment).
- **Psychology:** a small, low-risk yes makes the next yes more likely and self-consistent.
- **Why it works ethically:** the first step is genuinely useful on its own (a scope and quote), not a pretext.

---

# Part B — Missing or underused models, with ethical applications

### B1. Zero-Price Effect — the consultation is no-cost but never says so
- **Where:** every "Book a Call" / "Book … Audit" anchor across all pages, all pointing to `https://calendly.com/resolviaai/meet`.
- **Current copy:** "Book a Call"; "Book Channel Retention Audit"; "Book a direct 30-minute creative strategy and retention audit with our lead post-production team."; "Schedule Creative Audit". The word "free" appears nowhere in the target pages.
- **Psychology:** moving from a stated price to $0 produces a disproportionate preference spike; "free" also removes the fear of a sales trap.
- **Ethical application:** state the existing fact plainly in the CTA support line, e.g. **"A free 30-minute retention audit. No obligation."** Place it under the primary book-a-call anchor in the hero and final CTA. `[NEED: confirm with the team that the Calendly consult carries no charge and no automatic enrolment before publishing the words "free" or "no obligation".]`
- **Implementation:** edit the `<p>` immediately above the `cta-btn-primary` / `btn-bevel` anchors; leave the buttons and hrefs untouched.

### B2. Pratfall Effect — no candid limitation anywhere
- **Where:** service pages, audience pages, work page, homepage FAQ.
- **Current copy:** the register is uniformly absolute: "elite video editing studio", "100% Zero-Leak", "Guaranteed Upload Consistency", "unlimited revisions", "100% Safe", "> 85%", "guaranteed zero downtime".
- **Psychology:** a small, honest admission from a competent party raises likability and trust; flawless copy reads as a pitch to sophisticated B2B buyers.
- **Ethical application:** add a short "Who we're not the right fit for" block to the pricing guide and/or the YouTube service page. Ground it in constraints already on the site: **"We're a poor fit for one-off edits with a flexible deadline, or for channels below four videos a month. Our model is a dedicated producer on a 48-hour sprint; a freelancer is the better choice for irregular work."** The agency-vs-freelance post already models this honesty ("Hire a freelance video editor if you are an early-stage creator with a tight budget (under $1,500/month)…"). Extending it is consistent, not a new claim.
- **Why ethical:** it qualifies leads using real operating constraints and saves both parties time. `[NEED: confirm the four-videos-a-month threshold if it is not already an explicit retainer minimum; otherwise use "regular monthly cadence" instead.]`

### B3. Default Effect — the service dropdown defaults incorrectly off-page
- **Where:** "Request a Production Retainer Quote" form on every service and audience page.
- **Current copy/structure:** `<select name="service">` whose first option is always `<option value="youtube">YouTube Long-Form (8-25 min)</option>`. On `services/short-form-video-editing/index.html` (line 611) and on `for/agencies/index.html`, that YouTube option is still the default.
- **Psychology:** pre-selected options are accepted disproportionately often. A default that contradicts the page's own subject is both a conversion leak and a small trust breach.
- **Ethical application:** mark the page-relevant option as `selected` (e.g. `value="shortform" selected` on the short-form page, `value="whitelabel" selected` on the agency page). Alternative: add a neutral `<option value="" selected>Select a service</option>` so nothing is assumed. Keep all five options visible.
- **Implementation:** one attribute change per page; no CSS or JS changes.

### B4. Goal-Gradient Effect — sequence exists, progress does not
- **Where:** `index.html` process strip ("Find viral videos / Write the hook / Fix the script / Edit the video") and `services/youtube-video-editing/index.html` "Our 5-Stage YouTube Production Pipeline" (01–05).
- **Current copy:** stages are numbered but static: "01 Footage Ingestion & A-Roll Culling … 05 Frame.io Review & Same-Day Iteration".
- **Psychology:** people accelerate as they approach a visible goal; labelled progress increases follow-through.
- **Ethical application:** convert the existing 01–05 stage list into a truthful progress visual showing real project stages, and add a one-line orientation under the process strip: **"Five stages, each with a named deliverable. You see every stage in Frame.io."** This is process transparency, not a fake "your profile is 80% complete" meter. Do not invent completion percentages for a visitor who has taken no action.
- **Implementation:** reuse the existing stage markup; add a caption. A client-facing progress bar belongs in the Frame.io workflow, not on a marketing page.

### B5. Regret Aversion — reduce commitment fear with published terms
- **Where:** retainer CTAs on service and audience pages; pricing guide FAQ.
- **Current copy:** "Every monthly retainer includes a dedicated lead editor, 4 to 8 finished videos per month, 48-hour turnarounds…"; "unlimited revisions on all edits until you are thrilled with the cut."
- **Psychology:** buyers avoid actions that might be regretted; plain terms and reversible commitments lower that barrier more effectively than enthusiasm.
- **Ethical application:** add one factual sentence near the retainer CTA, e.g. **"Monthly retainer. [X] days' notice to pause or cancel."** Do not invent a money-back guarantee, a trial, or "cancel anytime" unless it is true. `[NEED: actual notice period and any cancellation terms.]`
- **Related:** "unlimited revisions" already reduces quality regret; keep it, but pair it with the real policy so it does not read as a limitless promise.

### B6. Mental Accounting — reframe one line item, not the price
- **Where:** `for/businesses/index.html` "Why Do Businesses Outsource Video Post-Production?" and "Built for Marketing Teams & Growth Leads".
- **Current copy:** "avoid the high overhead of hiring full-time in-house editors ($90K–$120K/year plus software licenses and equipment)".
- **Psychology:** the same money feels different depending on the account it is charged to. An agency retainer lands in "production budget"; a salary lands in "headcount".
- **Ethical application:** make the existing comparison explicit in one line: **"One retainer line replaces the editor salary, software licences and recruiting time in that $90K–$120K estimate."** Avoid charm-pricing the retainer (see D4). Any per-video arithmetic derived from published ranges should be shown with its inputs. `[NEED: confirm which items the $90K–$120K figure includes before restating it.]`

### B7. Endowment / IKEA Effect + Switching Costs — make the retained asset visible
- **Where:** `index.html` FAQ; all service pages' Frame.io/Slack references.
- **Current copy:** "We lock in your style guide and creator profile so every edit hits the mark immediately."; "We work in dedicated Slack or WhatsApp channels directly with you and your team"; "Timecode-accurate video commenting, side-by-side version comparison".
- **Psychology:** value rises once something feels owned; accumulated style rules and review history make switching costly in a good, earned way.
- **Ethical application:** state ownership plainly in the FAQ answer: **"Your style guide and creator profile are yours and stay with you if you ever move on."** Also offer a small co-creation step before the call (the existing "Monthly Video Volume & Target Goal" textarea already does this) and reference it in the follow-up: the producer's reply quotes the visitor's own stated goal back to them. That is IKEA Effect applied without changing any price.
- **Why ethical:** it increases portability, not lock-in, and uses the visitor's own input.

### B8. Hick's Law — one primary decision per screen
- **Where:** `index.html` hero (lines ~587) and final CTA (~788–); navigation.
- **Current copy:** hero offers "Get Your First Edit" and "View Client Work"; nav offers "Book a Call"; final CTA offers "Book a Call" plus a long footer of service, guide and audience links.
- **Psychology:** decision time grows with choice count; two CTAs of similar weight split intent.
- **Ethical application:** keep the secondary "View Client Work" link but make its visual weight clearly subordinate, leaving one dominant action ("Book a Call" / "Get Your First Edit") per banner. Do not remove routes; just establish hierarchy. This is nudge theory, not restriction.

### B9. Peak-End Rule — the ending is strong, the middle is underused
- **Where:** final CTA on every page; blog and quote forms.
- **Current copy:** homepage ends on "Stop editing. Post what converts." followed by the 48-hour promise; the quote form ends on "Request Production Scope & Quote →".
- **Psychology:** experiences are judged by the peak and the end. The end is already good; the peak (case studies) is strong on `/work/` but the service-page peaks are capability lists.
- **Ethical application:** on each service page, feature one matching case-study metric directly under the hero stat block (e.g. the YouTube page already has "+48.2% retention lift"; bring "28% → 56% AVD" next to it with a link to the case study). Keep the honest ending. A thank-you page after form submission is the natural place for the final "we reply within 4 hours" promise — currently that promise is only above the form.

---

# Part C — Misapplied or trust-risk items to correct

### C1. Conflicting social-proof totals
"50M+ combined client views" (brief / footer / work page) sits alongside "950M Viral Shorts", "569M Reel Cuts", "152M Motion FX Cut", "195M YouTube Cuts" on the homepage, "35M+ Shorts & Reels Views" on the short-form page, and a single tile labelled "78.3M". A careful buyer can read these as contradictory. Define each in place, e.g. "50M+ across featured long-form case studies" versus "950M cumulative short-form views". Do not raise or lower any number. `[NEED: definitions and measurement windows for each figure.]`

### C2. Absolute guarantees stated as absolutes
"Pipeline Guarantee 100% Zero-Leak / Encrypted bilateral NDA vault" (YouTube page), "100% Safe / Zero UI text occlusion guarantee" (short-form page), "guaranteed zero downtime" (pricing guide FAQ), "Guaranteed Upload Consistency" (creators page). These are authority claims that become liability if the underlying process cannot literally guarantee them. Prefer verifiable process statements: "bilateral NDAs, encrypted storage and restricted Frame.io roles" is already on the businesses page and is stronger because it is checkable. `[NEED: legal/ops sign-off on each absolute before keeping the word "guarantee".]`

### C3. Performance claims that need a basis
"> 85% Completion Rate Target", "100%+ completion rates" (short-form page), "+48.2% retention lift across 80+ uploads" (YouTube page). The work page explains its "104% (Looping)" figure, which is good practice. Apply the same disclosure on service pages: label targets as targets, and state how measured figures were calculated. `[NEED: measurement method and sample for each.]`

### C4. Scarcity language with a date stamp
`blog.html` → "Creator Consultation Callout": "We work with a select roster of creators… Apply for one of our open Q1 creator partnerships." As of November 2026, a perpetual "Q1" window reads as stale invented urgency. If capacity is genuinely bounded, state the real constraint and number; otherwise remove the quarter reference and keep "select roster". This is the only scarcity-flavoured copy found in the site. `[NEED: confirm current partnership capacity and intake window.]`

### C5. Over-claiming superlatives
"elite video editing studio" (homepage FAQ), "top creators", "highest-converting acquisition funnel" (work case study). These are fine as positioning but thin as proof; the adjacent metrics already do the authoritative work. Where a superlative has no source, let the number stand on its own.

---

# Part D — Models that should NOT be used, and why

| Model | Verdict | Reason |
|---|---|---|
| Scarcity / Urgency Heuristic (fake or dated) | **Do not add** | No verified inventory, seat limit or deadline exists on these pages. Countdown timers, "3 slots left", "offer ends tonight" and evergreen "Q1 partnerships" would be false scarcity. Real 48-hour delivery speed is a capability claim and may be kept; it is not a deadline. |
| Door-in-the-Face (inflated first price) | **Do not use** | Showing a fabricated enterprise figure to make the real retainer feel cheap is deceptive. The published $2,500–$8,000+ retainer range is already a legitimate anchor. |
| Decoy Effect (deliberately inferior tier) | **Do not use** | The pricing guide's three models with disclosed trade-offs are honest. Adding a tier designed to be rejected would exploit the comparison rather than inform it. |
| Charm Pricing ($497 / $2,497) | **Do not use** | The skill notes rounded prices signal premium quality. Resolvia's positioning and its $500/$2,500 round figures depend on that fluency; .99 endings would cheapen the brand. |
| Default Effect with wrong or hidden defaults | **Fix, don't exploit** | See B3. A default that benefits the seller while contradicting the page is a dark pattern. Pre-select the page-relevant option or none. |
| Inauthentic testimonials / stock-quote blocks | **Do not add** | The site currently uses view counts and metric-led case studies, not invented endorsements. Any testimonial needs a real, permissioned, attributable quote. `[NEED: real client quotes + permission.]` |
| False Authority | **Do not add** | Do not add certification badges, "featured in" logos or partner marks unless verifiable and visibly true. Existing tool/standard references (Fairlight, -14 LUFS, ACES, Frame.io) are enough. |
| Zeigarnik "open loop" teases | **Do not use** | "You're 80% done" or cliffhanger copy invented for a visitor who has done nothing is manipulative. Real staged progress belongs in the Frame.io client workflow (B4). |
| Regret-Aversion guarantees invented for comfort | **Do not add** | No money-back guarantee, free trial or "cancel anytime" exists on the site. Publish actual terms (B5) instead. |
| Conflicts-of-interest disguised as reviews | **Do not add** | The editorial team writes the guides; keep that byline visible. Do not dress guide content as independent third-party review. |

---

## Prioritised implementation map (for the owning agents)

**P1 — accuracy and trust (do first)**
1. C1: define the competing view totals in place.
2. C4: remove or substantiate the "Q1" scarcity line in `blog.html`.
3. B3: fix the `selected` service option on short-form and agency pages.
4. C2/C3: qualify absolute guarantees and label targets as targets.

**P2 — high-leverage, low-risk copy additions**
5. B1: label the existing consultation as free/no-obligation once verified.
6. B2: add "who we're not for" to the pricing guide and YouTube service page.
7. B5: publish real retainer cancellation terms near the CTA.
8. B8: establish one dominant CTA per banner.

**P3 — structural / needs build or data**
9. B4: stage-progress visual using existing 01–05 markup.
10. B7: style-guide ownership line + producer reply quoting the visitor's goal.
11. B6/B9: mental-accounting line and service-page case-study peak.

---

## `[NEED: ...]` register

- `[NEED: written confirmation that the Calendly consultation is free and carries no obligation]` (B1)
- `[NEED: real retainer minimum cadence, notice period and cancellation terms]` (B2, B5)
- `[NEED: definitions and measurement windows for 50M+, 950M, 569M, 152M, 195M, 35M+, 78.3M]` (C1)
- `[NEED: ops/legal sign-off on "100% Zero-Leak", "100% Safe", "zero downtime", "Guaranteed Upload Consistency"]` (C2)
- `[NEED: sample size and method for +48.2% retention lift, >85% and 100%+ completion targets]` (C3)
- `[NEED: current creator-partnership capacity and intake window, or removal of "Q1"]` (C4)
- `[NEED: line items included in the $90K–$120K in-house estimate]` (B6)
- `[NEED: permissioned, attributable client quotes if testimonials are ever added]` (Part D)

---

## Summary — top 5 ethical psychology opportunities

1. **Label the existing consultation as free and no-obligation.** The zero-price effect is already available in the product but invisible in the copy; a one-line change at each primary CTA makes it work without any new offer. Verify first.
2. **Add a candid "who we're not the right fit for" block.** The Pratfall Effect is entirely absent; a truthful qualifier using the site's own 48-hour/retainer constraints builds more trust with B2B buyers than another superlative.
3. **Fix the service dropdown default on short-form and agency pages.** A context-free default that contradicts the page is the one clear dark-pattern-adjacent defect; page-relevant `selected` attributes or a neutral placeholder solve it in one attribute per page.
4. **Reconcile and define the view-count totals.** Social proof is the site's strongest model, but conflicting numbers (50M+ vs 950M vs 78.3M) weaken it. Define each figure without changing any of them.
5. **Publish real commitment terms and make the style guide an owned asset.** Regret aversion and endowment are currently unused; stating genuine cancellation terms and "your style guide stays yours" removes fear and adds earned switching value, with no invented guarantee.
