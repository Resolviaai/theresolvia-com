# 04 — Copy Audit: Resolvia

**Assignment:** read-only audit of existing copy. **No site files were edited.**
**Pages reviewed (9):** `index.html`; `services/{youtube-video-editing,short-form-video-editing,podcast-video-editing,video-ad-editing}/index.html`; `for/{creators,businesses,agencies}/index.html`; `work/index.html`.
**Method:** skill A/B/C diagnosis; three-question gate on every line (pictureable / provable / competitor-swap); AI-tell blacklist and self-check; fact-checking against the brief's verified proof points only.

> **Snapshot note:** eight of the nine pages were modified by other agents while this audit was in progress (between 00:21 and 00:27 on 24 Nov 2026). This report reflects the **current** copy as re-extracted at 00:27. Changes observed: proof lines added to all service pages, CTAs renamed to audit/quote labels, definition paragraphs rewritten, section headings changed to questions, and the work-page H1/CTA replaced. New issues introduced by those edits are flagged below.

---

## DIAGNOSIS

**B — real voice present.** Evidence: the site argues in a distinct founder register (no AI tells like "it's not X, it's Y" or negation lists), using opinionated lines such as *"Stop editing. Post what converts."*, *"without burning out in the edit bay"*, *"an elite video editing studio"*, *"until you are thrilled with the cut"*, plus brand-specific vocabulary (*retention-engineered, hooks, foley, edit bay, 48 hours, high-growth creators*). The job is to **restore and surface that voice, not replace it** — the strongest line is still buried in the bottom CTA banner while the hero shows only the brand name, and the middle of the site still carries generic, unprovable copy.

---

## 1. Voice inventory — what must be preserved

Locks from the start (Situation B): these are the client's judgment calls, not raw material to rewrite.

| Element | Their wording / angle | Why it's a voice choice |
|---|---|---|
| Core positioning | "retention-engineered video editing & post-production" | Their coined category; the whole site ladders up to it |
| Signature verbs/nouns | retention pacing, hooks, foley, sound design, edit bay, ship/post, Frame.io, 48 hours | Founder/operator vocabulary; specific to their craft |
| Opinionated lines | "Stop editing. Post what converts." / "without burning out in the edit bay" / "until you are thrilled with the cut" | Real point of view; rare in this category |
| Proof vocabulary | 50M+ views, 41+ case studies, 80K → 850K subs, 48-hour turnaround | Verified in the brief; use these, not new numbers |
| Audience labels | high-growth creators, media brands, venture-backed founders, B2B SaaS, marketing agencies | Brief-verified segments; keep them |
| Register | Confident, technical, slightly brash; short declaratives in CTAs | Formal-but-opinionated; do not flatten into startup clipped-speak |

Do **not** import a new angle (e.g. "fractional post-production team", "creative ops partner"). Deepen "retention-engineered" instead.

---

## 2. Three-question gate — headline / subhead / key line verdicts

Q1 pictureable · Q2 provable · Q3 fails competitor swap. Three passes = keep.

| Line (page) | Q1 | Q2 | Q3 | Verdict / issue |
|---|:--:|:--:|:--:|---|
| Visible hero: canvas text **"Resolvia"** (`index.html`, WebGL, aria-label only) | ✗ | ✗ | ✗ | Brand mark is not a value proposition. **Buried lead #1** |
| sr-only H1: "Resolvia — High-Retention Video Editing Agency & Creative Studio" | ✗ | ~ | ✗ | SEO label; invisible. Competitor could swap its own name |
| Hero subhead: "Retention-engineered video editing & post-production for high-growth creators." | ~ | ✓ | ✗ | Good brand words; no proof, generic audience label |
| "Get Your First Edit" (hero CTA) | ✓ | ~ | ~ | Promises an edit; destination is a **booking** link — mismatch |
| "Stop editing. Post what converts." (bottom CTA banner, `index.html`) | ✓ | ✓ | ~ | **Best line on the site, buried.** Promote it |
| "High-retention edits crafted for our creators and brands — tens of millions of views combined." | ✗ | ✗ | ✗ | Vague, understates verified 50M+, em dash in short copy |
| "See the 41 others" (button) | ~ | ✓ | ✓ | Specific count, weak verb. Fix to "See all 41 case studies" |
| "We turn raw footage into cinematic, high-retention YouTube content…" | ~ | ✗ | ✗ | "cinematic" decoration; overclaim "dominate… algorithms" |
| "…engineered for the 3-second scroll test and 100%+ completion rates." | ✓ | ✗ | ✗ | First clause good; **100%+ is incoherent** (see §3.2) |
| "Transform corporate webinars, founder talks, customer case studies, and product demos into engaging, high-retention video assets that drive pipeline and customer trust." | ✓ | ✗ | ✗ | List is pictureable; "engaging", "drive pipeline and customer trust" unprovable |
| "Scale From 80K to 850K Subscribers in 6 Months" (`work/index.html`) | ✓ | ✓ | ✓ | **Strongest proof line on the site.** Keep; add attribution |
| "Retention-driven video editing for creators." (footer, 9 pages) | ✗ | ✗ | ✗ | Generic, repeated, swap-test fail |

**Gate summary:** the specific, craft-level lines pass; the abstract category-definition paragraphs and "Transform / Elevate / Scale / Dominate" headings fail. Roughly 55–60% of above-the-fold copy fails at least two questions.

**What the concurrent edits improved:** proof lines now sit under the hero on 5 pages; CTAs were renamed to "Book a 30-Minute Retention Audit", "Book a Channel Retention Audit", "Get a Custom Podcast Quote", etc.; service-page definition paragraphs were shortened and made brand-specific; meta descriptions were tightened. These are real gains. The remaining failures are concentrated in the homepage hero, impossible/absolute claims, unattributed case-study metrics, and a few new artifacts.

---

## 3. Page-by-page audit

Flag key: **[VAGUE]** abstraction · **[UNPROVABLE]** claim with no visible proof · **[SWAP]** competitor could write it verbatim · **[TELL]** AI-tell pattern · **[WEAK CTA]** · **[INCONSISTENT]** conflicts with brief/site fact · **[NEW]** introduced by the concurrent edits.

### 3.1 Homepage — `index.html`

| Line | Flags | Note |
|---|---|---|
| Visible hero = WebGL canvas rendering "Resolvia" (liquid-text.js:8). H1 at :578 is `sr-only` | **[BURIED LEAD]** | Sighted readers see a brand name plus a subhead. No value prop in the visual headline |
| Subhead (:583): "Retention-engineered video editing & post-production for high-growth creators." | **[VAGUE] [SWAP]** | Brand words are right; "high-growth" is a label, not a picture. No proof in the hero |
| **New** hero paragraph (:584 area): "What is retention-engineered video editing? Resolvia's editors shape every cut around audience retention: narrative pacing, hook timing, sonic foley and clean audio mastering. Short-form for TikTok, Reels and Shorts, or long-form YouTube, each edit is built to hold attention past the first 30 seconds and move viewers toward the next video." | **[NEW] [TELL]** | Self-answered definition in the hero (FAQ questions are allowed, but a definition block belongs in the FAQ). It dilutes the hero and adds a new "past the first 30 seconds" claim. Move it to the FAQ section; keep the hero to headline + one proof line |
| Primary CTA (:588): "Get Your First Edit" | **[WEAK CTA]** | Label promises the deliverable; `href` is `calendly.com/resolviaai/meet`. Say "Book" so the next step matches the click. Other pages were already fixed; the homepage was not |
| Secondary CTA: "View Client Work" | **[WEAK CTA]** | "See all 41 case studies" is stronger and uses proof |
| H2 "Featured Client Edits" + "…tens of millions of views combined." (:601) | **[VAGUE] [TELL]** | Understates verified 50M+; "tens of millions" is weaker and unfalsifiable; em dash in short copy |
| Button "See the 41 others" | **[WEAK CTA]** | Count is good, phrasing is bare. Fix verb + noun |
| H2 "Edited in [rotating software] by Resolvia Studio" (:689 area) | ok | Verified non-issue: the run-on text in scraped output comes from hidden rotation slots and the sr-only line. Visually correct — do not "fix" |
| Subhead: "Retention pacing, viral hooks and sound design, crafted for you by Resolvia Studio." | ok | Brand vocabulary, keep |
| H2 "Questions, answered." + "Everything you need to know before partnering with our editing studio." | **[SWAP] [TELL]** | Generic label heading. Once the moved definition paragraph lands here, make the heading claim something |
| FAQ "We partner with leading creators, founders, and personal brands to edit viral, retention-engineered videos that **build massive audiences and scale revenue**." | **[UNPROVABLE]** | Outcome claim with no proof. Keep "elite"/"viral" voice; name the unlock |
| FAQ "Our editors work **exclusively** in Adobe Premiere Pro, After Effects, and DaVinci Resolve Studio." | **[INCONSISTENT]** | The software row on the same page says edits use CapCut and Photoshop. "Exclusively" is false as written |
| FAQ "Every video receives custom sound effects, professional typography, calibrated color passes, and 4K masters." | ~ | Specific; `[NEED: confirm 4K masters on every tier]` |
| FAQ "Standard delivery is 24 to 48 hours per video cut." | ok | Falsifiable, good |
| FAQ "instant feedback and iteration" | **[VAGUE]** | "Instant" is absolute; replace with the mechanism (dedicated Slack/WhatsApp channel) |
| FAQ "Yes! We provide **unlimited revisions** on all edits until you are thrilled with the cut." | **[UNPROVABLE]** | Keep "thrilled" (voice). Back it with a written policy |
| FAQ "edit your first sample video within 48 hours" | ok | Falsifiable. Supports a "Get Your First Edit in 48 Hours" CTA only if this is actually offered |
| Bottom CTA H2 "Stop editing. Post what converts." | **[BURIED LEAD]** | Strongest line on the page, placed last. Promote it |
| Bottom CTA body "Viral hooks, dynamic pacing, and custom sound design, delivered in 48 hours for your channel." | **[TELL]** | Reflexive three + "Viral" puffery; keep the craft nouns and the 48-hour fact |
| Footer tagline "Retention-driven video editing for creators." | **[SWAP]** | Repeated on all 9 pages; replace site-wide with a proof-bearing line |

### 3.2 Service pages

**`services/youtube-video-editing/`**

- Proof strip added: "50M+ combined client views and 48-hour first cuts. Revisions reviewed in Frame.io under encrypted bilateral NDA." — **keep**, brief-sourced.
- H1 "YouTube Video Editing Agency Engineered for High Audience Retention" — **[SWAP]** keyword-stacked abstraction.
- Subhead "…looking to **dominate search and suggested algorithms** without burning out in the edit bay." — mixed. "without burning out in the edit bay" is **excellent voice, keep**. "dominate… algorithms" is **[UNPROVABLE]**.
- Definition paragraph (current): "A professional YouTube video editing agency handles end-to-end post-production for creators: narrative pacing, sound engineering, motion graphics, color grading, and thumbnail packaging. The aim is longer Average View Duration (AVD) and higher Click-Through Rate (CTR). Resolvia delivers first cuts in 48 hours and reviews revisions in Frame.io." — improved, but still **[SWAP]**: the first two sentences are generic agency-speak and "The aim is" is a hedge. Fold the mechanism (48h, Frame.io, -14 LUFS) into one sentence and lead with it.
- "micro-hooks every 20-30 seconds" — specific and on-brand; keep, with `[NEED: confirm this is a documented part of the workflow]`.
- "Dialogue is mastered with Fairlight DSP to broadcast loudness standards (-14 LUFS)." — **keep**. Falsifiable, technical, differentiated.
- "ensure maximum viewer engagement at every second of the timeline" / "elevate high-end brand authority" — **[UNPROVABLE] [VAGUE]**.
- H2 "Transform Your YouTube Content Into a High-Retention Engine" — **[TELL] [SWAP]** "Transform" + "engine" (Cap vocabulary). Their own category is "retention-engineered"; say that.
- Section headings changed to "What's Included in Our YouTube Video Editing Service" / "How Our YouTube Video Editing Process Works" / "YouTube Video Editing FAQs" — acceptable, but note the [TELL] label-heading pattern (see cross-cutting).

**`services/short-form-video-editing/`**

- Subhead "…engineered for the 3-second scroll test and **100%+ completion rates**." — **[UNPROVABLE]**. A completion rate above 100% is incoherent; it will read as fabricated and contaminate the credible claims around it. Remove or source.
- **New** proof strip: "**35M+ short-form views produced across creator accounts.** Captions stay inside platform-safe 9:16 margins." — **[NEW] [UNPROVABLE]**. "35M+" is not among the brief's verified figures. `[NEED: source for 35M+ short-form views]`. Do not publish until sourced; 50M+ total is already verified and is the safer fallback.
- "Bespoke Kinetic Typography … command **100% reading focus**" / "All text remains **100% visible** across every smartphone display." — **[UNPROVABLE]** absolutes.
- "Seamless Loop Transitions" — **[TELL]** "Seamless" is Cap vocabulary. Body "…multiplying view count data and triggering platform algorithmic recommendations" — **[UNPROVABLE]** jargon. The underlying technique (last line lands back on the hook) is pictureable and real; keep that.
- "multiplying your digital distribution 10x" / final CTA "**10x your reach**" — **[UNPROVABLE]**. No source on site.
- H2 "How Do I Start Short-Form Video Editing?" — fine; question headings are allowed.
- "high-performing vertical assets", "high-velocity" — **[VAGUE]** jargon; use the concrete "10–15 vertical clips in 9:16" already stated.
- Definition paragraph (current) is brand-specific and specific ("We turn one raw video into 10-15 edits…") — **keep**; only the impossible metrics around it need work.

**`services/podcast-video-editing/`**

- Proof strip: "Fairlight audio mastered to -14 LUFS · 48-hour delivery · Frame.io review with a dedicated show producer." — **keep**, all brief/site facts.
- H1 "…& 360° Episode Repurposing" — **[VAGUE]** "360°" is decoration. Body says "10–15 clips"; say that.
- "-14 LUFS / -16 LUFS", "iZotope RX spectral de-noising", "10-15 viral vertical clips" — specific, keep. Meta now also says "10-15", so the earlier count inconsistency is resolved.
- "so your episodes **never** miss release day" — **[UNPROVABLE]** absolute; the real mechanism (dedicated producer, Frame.io reviews) is stronger.
- "crystal clear voice timbre" / "Seamlessly captures organic conversational energy" — **[VAGUE] [TELL]**.
- Definition paragraph still "Video podcast editing is the post-production process of…" — **[SWAP]** encyclopedia voice; the YouTube and short-form pages were already rewritten, this one was not.

**`services/video-ad-editing/`**

- Proof strip: "50M+ client views · Pre-release NDA and encrypted vault · 4-hour reply on quote requests" — **keep**.
- Subhead "Lower your customer acquisition costs (CAC) with high-converting video creative…" — **[UNPROVABLE]** outcome claim. "high-converting" is decoration.
- "modular direct-response video ads with multiple hook variations, UGC polish, and high-impact visual proof" — **[VAGUE]** jargon stack; the concrete version exists in the body ("4-6 distinct hooks", "9:16 / 1:1 / 16:9").
- "UGC & Founder Video Polish: Transform raw iPhone footage into engaging, organic-feeling creative…" — **keep**, pictureable and true to the craft.
- H2 "How can video ad editing scale paid social results?" — question form is fine, but the body still promises "high-velocity creative testing pipeline" **[VAGUE]**.
- Every section CTA label ends with "→" ("Request Production Scope & Quote →") — **[TELL]** Unicode decoration in body/CTA copy; drop the glyph.

### 3.3 Audience pages

**`for/creators/`**

- H1 "Video Editing Built for Creators Who Want to Focus on Filming, Not Editing" — **keep**. Names the audience and the discomfort, in their register.
- Subhead "Stop losing **30+ hours every week** inside timeline software." — specific but **[UNPROVABLE]**; this number drives the whole page and the final CTA ("How Can a Creator Get 30+ Hours Back Each Week?"). `[NEED: time study or source]`.
- "**Most videos lose 50% of viewers in the first 45 seconds**" — **[UNPROVABLE]** weasel-source statistic. `[NEED: citable study, named]`.
- "Guaranteed Upload Consistency" / "unbreakable rhythm" / "Never miss an upload deadline again." — **[UNPROVABLE]** absolutes; the real mechanism (48-hour SLA + backup editor roster) is better.
- **New** line: "Also available: video podcast editing and video ad editing ." — **[NEW]** stray space before the period; fix to "…video ad editing."
- Service cards still use "→" glyphs in labels ("YouTube Long-Form Post-Production →") — **[TELL]**.
- "See Case Studies (80K to 850K Subs)" — **strong CTA**, proof-based. Keep.
- "show you exactly where retention is leaking" — **keep**, concrete.

**`for/businesses/`**

- H1 "Video Editing Services Built for Modern Businesses & Marketing Teams" — **[SWAP]** generic. Meta is better ("B2B SaaS, tech companies, corporate marketing teams").
- Subhead "…into engaging, high-retention video assets that **drive pipeline and customer trust**" — **[UNPROVABLE]**.
- Definition paragraph was rewritten and the unsourced "$90K–$120K/year" figure was removed — **good fix**; no further action.
- "**Zero-Leak** Security Vault" — **[UNPROVABLE]** absolute, and not their vocabulary. Brief says "encrypted pre-release vault". Use that.
- "air-gapped local encrypted storage" — **[INCONSISTENT / UNPROVABLE]**; brief lists encrypted vault + bilateral NDAs, not air-gapping. `[NEED: security documentation]`.
- "Turnkey Scalability" / "Ramp up production… without bureaucratic hiring lag." — **[VAGUE] [SWAP]**.
- "Review Security & NDA Standards" secondary CTA — **keep**, specific.

**`for/agencies/`** (unchanged during the concurrent edits)

- Subhead "Guaranteed 48-hour SLAs, strict bilateral NDAs, and **seamless** white-label delivery." — **[TELL]** "seamless"; "Guaranteed" needs the SLA document.
- "We never contact your clients or publish work without your written permission." — **keep**, falsifiable and on-brand.
- "mark up video post-production services **50% to 100%** with **zero payroll liabilities**" — **[INCONSISTENT]** with the brief's published "60%+ agency margins"; "zero payroll liabilities" is **[UNPROVABLE]**.
- "**Instantly** add 10, 20, or 50 video deliverables per month" — **[UNPROVABLE]** (same line also appears on the businesses page — duplicated boilerplate).
- Final CTA "review our **wholesale rate card** and SLA guarantees" — **[INCONSISTENT]**; brief says published ranges, "not a formal rate card". `[NEED: confirm a rate card exists]`.
- H2 "Expand Your Agency's Video Margins" — outcome claim, acceptable if tied to the published 60%+ figure.

### 3.4 Work — `work/index.html`

- New H1 "Video Editing Case Studies: 50M+ Views, 80K to 850K Subscribers" — **keep**, proof-led and brief-sourced.
- New subhead "Each breakdown shows the hook staging, foley accents and pacing curves behind a 28% to 56% rise in average view duration, 12% to 44% documentary completion and 17.6M organic views." — specific but stacks three unattributed metrics above the fold; `[NEED: source for each]` (see below).
- New definition paragraph "Resolvia's work page features 41+ video editing case studies and 50M+ combined client views. Each breakdown shows… behind results such as an 80K to 850K subscriber increase, 17.6M organic views and a 12% to 44% completion-rate gain." — **[TELL]** repeats the subhead's numbers; cut one of the two blocks.
- **New** line "Related: YouTube video editing , short-form editing and podcast video editing services, plus guides to YouTube retention and video editing costs ." — **[NEW]** stray spaces before punctuation; fix to "…editing, short-form editing…" and "…video editing costs."
- Case-study H2s remain the strongest copy in the audit: "Scale From 80K to 850K Subscribers in 6 Months"; "From 12% to 44% Completion Rate on a 32-Minute Documentary". **Keep.**
- Bodies carry precise numbers with **no attribution**: "28%" → "56%" AVD, "4 consecutive videos past 1.5M views", "17.6M organic views", "14.8M views", "42,000 new subscribers", "12% → 44%". They are on-site facts, so not invented here, but a reader cannot verify them. `[NEED: named client or written permission to attribute, plus source for each metric]`.
- "became the company's **highest-converting acquisition funnel**" — **[UNPROVABLE]**.
- "viewer fatigue was **virtually eradicated**" — **[UNPROVABLE]**; the numbers already make the point.
- "4-Beat Pacing System" — invented label, but defined in-line ("refreshing visual staging every 25 seconds…"); acceptable once.
- New CTA "Book a Retention Audit for Your Channel" / "Book My Retention Audit" — **keep**, specific.
- Case-study 4 uses em dashes twice ("System—refreshing… shifts—viewer fatigue…") — **[TELL]**; replace with periods.

### Cross-cutting patterns

1. **Question-form section headings** were added across nearly every service/audience page ("What's Included…?", "How do I get a quote…?", "How do I get started…?"). FAQ questions are allowed, but stacking them as every section heading creates the **[TELL] "label headings"** pattern and a uniform rhythm. Make at least two of them claim-bearing.
2. **Proof strips** now appear on 6 pages — a real improvement. One contains an unsourced new number (35M+).
3. **Headline verbs doing all the work**: Transform / Scale / Expand / "drive pipeline". Still present; ration them.
4. **Unicode arrows** (`→`) in CTA/button labels on service and creators pages — formatting tell; remove.
5. **Em dashes in short copy**: homepage proof subhead; work case-study 4; (definition paragraphs were cleaned up).
6. **Duplicated boilerplate**: the "10, 20, or 50 deliverables" line appears on two audience pages; "Retention-driven video editing for creators." appears on all 9.
7. **Stray spaces before punctuation** in three newly added lines (homepage FAQ, creators page, work page) — copy defects to fix.
8. **No banned structural tells found** on any page: no "it's not X, it's Y", no negation lists, no "The result?" reveals, no "In today's fast-paced world", no "unlock the power of". The voice is genuinely theirs.

---

## 4. Homepage hero + primary CTA — rewrite candidates

Brand name stays in the liquid-text canvas; the sr-only H1 stays for accessibility/SEO. These candidates replace the **visible value proposition** (currently absent) and the CTA label.

### Hero headline candidates

**Option A — promote the existing buried line (recommended)**
> **Stop editing. Post what converts.**
>
> Retention-engineered video editing and post-production for high-growth creators. First cut in 48 hours.

*Rationale:* Situation B discipline: the best line already exists on the page, so lock it and move it up. Uses their exact vocabulary ("retention-engineered", "48 hours"). "Now you can stop editing and post what converts" passes the test. The newly added definition paragraph moves to the FAQ, leaving this as the clean hero. `[NEED: confirm 48-hour first cut applies to every engagement]`

**Option B — audience + mechanism**
> **Your channel, edited for retention.**
>
> We cut the dead air, build the hook, and master the sound. Your first cut lands in 48 hours.

*Rationale:* Short, claim-shaped, built from craft verbs they already use ("cut the dead air", hooks, sound). Pictureable channel, provable 48 hours, "edited for retention" is their coined category so it resists the swap test. Reserves "Stop editing" for the bottom CTA.

**Option C — discomfort-first (Human Action Model spine)**
> **Your best footage is stuck in the edit bay.**
>
> Raw multi-cam or screen recordings, back as retention-engineered videos with custom foley and hooks. First cut in 48 hours.

*Rationale:* Names the felt problem in the founder's own words ("edit bay"), then gives vision and path in the subhead. Strongest if traffic is cold.

### Primary CTA candidates (all point to the existing Calendly URL)

**Option 1 — recommended:** `Book Your First Edit Call`
*Rationale:* One-word fix to "Get Your First Edit". The label now matches the destination (a booking) while keeping "first edit", which is already on-site language. Every other page was already updated to "Book…" labels; the homepage is the outlier.

**Option 2:** `Book a 30-Minute Retention Audit`
*Rationale:* This is now the live label on the YouTube page, so adopting it on the homepage creates site-wide consistency. Best if the call genuinely includes a retention-curve review. `[NEED: confirm the call includes a retention audit]`

**Option 3:** `Get Your First Edit in 48 Hours`
*Rationale:* Strongest promise, tied to the FAQ ("edit your first sample video within 48 hours"). Highest risk: the click leads to scheduling, not the edit. Only ship if a sample edit is truly offered. `[NEED: confirm sample edit is delivered within 48h of booking, and whether it is free]`

**Recommendation:** Hero **Option A** + CTA **Option 1**, with a proof strip under the buttons using brief-sourced facts only: *"50M+ combined client views · 48-hour first cut · 41+ case studies."*

---

## 5. Section-level fixes (before → after + rationale)

| # | Page / section | Before (current) | After (candidate) | Rationale / proof |
|---|---|---|---|---|
| 1 | Homepage subhead | "Retention-engineered video editing & post-production for high-growth creators." | "Retention-engineered video editing and post-production for high-growth creators. First cut in 48 hours." | Keeps brand words; adds a falsifiable claim from the brief |
| 2 | Homepage hero definition paragraph | "What is retention-engineered video editing? Resolvia's editors shape every cut…" | Move to FAQ; hero keeps only headline + one proof line | Definition blocks belong in the FAQ; a hero needs a value prop, not a glossary entry |
| 3 | Homepage hero CTA | "Get Your First Edit" | "Book Your First Edit Call" | Label must match the Calendly destination |
| 4 | Homepage social proof | "tens of millions of views combined" | "50M+ combined client views across 41+ case studies." | Both figures are brief-verified and already used in the footer/work meta |
| 5 | Homepage gallery button | "See the 41 others" | "See all 41 case studies" | Action verb + noun; same count, clearer |
| 6 | Homepage FAQ — What is Resolvia | "…videos that build massive audiences and scale revenue." | "…videos that build audiences and grow channels." + `[NEED: named client result to support a revenue claim]` | Keeps "elite"/"viral" voice; declined claim names its unlock |
| 7 | Homepage FAQ — tools | "work **exclusively** in Adobe Premiere Pro, After Effects, and DaVinci Resolve Studio" | "cut in Premiere, After Effects, and DaVinci Resolve, with CapCut and Photoshop for graphics and finishing" | Fixes direct contradiction with the software row on the same page |
| 8 | Homepage FAQ — revisions | "unlimited revisions … until you are thrilled" | Keep wording; add `[NEED: link to written revision policy]` | The line is voice; give it evidence rather than softening it |
| 9 | Homepage footer tagline (all 9 pages) | "Retention-driven video editing for creators." | "Retention-engineered edits. 48-hour first cut." | Uses brand vocabulary + verified proof; fixes site-wide swap-test failure |
| 10 | YouTube service — subhead | "…looking to dominate search and suggested algorithms without burning out in the edit bay." | "…so you can spend filming time filming, not in the edit bay." | Keeps the founder line; drops the unprovable algorithm claim |
| 11 | YouTube service — definition paragraph | "A professional YouTube video editing agency handles end-to-end post-production for creators… The aim is longer AVD and higher CTR." | "We cut the dead air, place a hook every 20–30 seconds, master dialogue to -14 LUFS, and send a Frame.io link in 48 hours." | All four facts are on the page; replaces generic first sentence + hedge |
| 12 | YouTube service — final H2 | "Transform Your YouTube Content Into a High-Retention Engine" | "Your next upload, engineered for retention." | Drops "Transform"/"engine" tells, keeps the category |
| 13 | Short-form — subhead | "…engineered for the 3-second scroll test and 100%+ completion rates." | "…engineered for the 3-second scroll test with sub-3-second hooks and loop endings." + `[NEED: sourced completion-rate data if a number is wanted]` | Removes an impossible metric; mechanisms are already on the page |
| 14 | Short-form — proof strip | "35M+ short-form views produced across creator accounts." | "50M+ combined client views across all formats." + `[NEED: source for 35M+ short-form views if the specific figure is kept]` | 35M+ is not brief-verified; use the verified total until sourced |
| 15 | Short-form — feature + CTA | "Seamless Loop Transitions" / "10x your reach" | "Loop endings that return to the hook" / "Get 10–15 vertical clips from one long-form video" | Drops "Seamless" and unsourced "10x"; uses the concrete deliverable already stated |
| 16 | Podcast service — features | "crystal clear voice timbre" / "never miss release day" | "iZotope RX cleanup and -14 LUFS mastering" / "a dedicated producer keeps every episode on schedule" | Replace adjectives with the tools and roles already named |
| 17 | Podcast service — definition paragraph | "Video podcast editing is the post-production process of synchronizing multi-camera video feeds…" | "We sync multi-cam feeds, master dialogue to -14 LUFS, and cut each episode into 10–15 clips with kinetic captions." | Brings this page in line with the rewritten YouTube/short-form definitions |
| 18 | Video ads — H2/body | "How can video ad editing scale paid social results?" / "high-velocity creative testing pipeline" | "4–6 hooks per ad body, ready to test" / "delivered in 9:16, 1:1 and 16:9" | Mechanisms from the page; no result promise. `[NEED: sourced ROAS data to make a result claim]` |
| 19 | Video ads — button labels | "Request Production Scope & Quote →" | "Request Production Scope & Quote" | Removes Unicode arrow decoration |
| 20 | Creators page — proof stats | "Stop losing 30+ hours every week" / "50% of viewers in the first 45 seconds" | Keep the two strongest, attach sources; otherwise recast as mechanism | `[NEED: time study]`, `[NEED: citable retention study]` |
| 21 | Creators page — stray space | "Also available: video podcast editing and video ad editing ." | "Also available: video podcast editing and video ad editing." | Fix punctuation artifact |
| 22 | Businesses page — vault section | "Zero-Leak Security Vault" / "air-gapped local encrypted storage" | "Encrypted Pre-Release Vault" / "bilateral NDAs and restricted Frame.io permissions" | Uses the brief's vocabulary; removes the unlisted "air-gapped" claim. `[NEED: security documentation if air-gapping is real]` |
| 23 | Agencies page — margins | "50% to 100%" / "zero payroll liabilities" / "wholesale rate card" | "Our published guide puts agency margins at 60%+." + `[NEED: confirm rate card exists]` | Aligns to the brief's published range |
| 24 | Work page — subhead + definition | Two consecutive paragraphs both listing 28%→56%, 12%→44%, 17.6M | Keep the H1 and one metric-bearing paragraph; move the other to the case-study intro | Stops the same three numbers appearing twice above the fold |
| 25 | Work page — case study bodies | "viewer fatigue was virtually eradicated" / "highest-converting acquisition funnel" | State the metric only: "completion rose from 12% to 44%"; `[NEED: source for 'highest-converting']` | Let the number land; drop the puffery |
| 26 | Work page — stray spaces | "YouTube video editing , short-form editing" / "video editing costs ." | "YouTube video editing, short-form editing" / "video editing costs." | Fix punctuation artifacts |

---

## 6. Consolidated AI-tell / proof watchlist

**AI tells found (by skill blacklist category):**
- Cap vocabulary: "seamless" (short-form, agencies), "Seamlessly" (podcast), "high-velocity" (×3), "high-performing", "crystal clear", "massive", "Transform", "Scale", "Expand", "elevate".
- Wisdom-shaped / label headings: a stack of question-form section headings on nearly every page; "View counts only tell half the story." was removed but similar generic labels remain.
- Em dashes in short copy: homepage proof subhead; work case-study 4.
- Reflexive threes: homepage bottom CTA body ("Viral hooks, dynamic pacing, and custom sound design"); several feature lists.
- Abstract subjects: the YouTube and podcast definition paragraphs still open generically.
- Unicode decoration: `→` in CTA/button labels across service and creators pages.
- Hype punctuation: "Yes!" in homepage FAQ.
- Weasel absolutes: "100%+ completion rates", "100% reading focus", "100% visible", "never", "unbreakable", "Guaranteed", "Zero-Leak", "Instantly", "virtually eradicated", "exclusively" (contradicted by the software row).

**No banned structural tells found:** no "it's not X, it's Y", no negation lists, no "The result?" colon reveals, no era openers, no "unlock the power of". This remains a Situation-B cleanup, not a de-slopping job.

---

## 7. `[NEED: ...]` master list (missing proof — do not publish without it)

1. `[NEED: confirm 48-hour first cut applies to every engagement]` — used in new hero/subhead.
2. `[NEED: confirm the 30-minute call includes a retention audit]` — homepage CTA Option 2 / live audit labels.
3. `[NEED: confirm sample edit is delivered within 48h of booking, and whether it is free]` — CTA Option 3 and FAQ line.
4. `[NEED: source for 35M+ short-form views]` — newly added proof strip on short-form page; not brief-verified.
5. `[NEED: named client or written permission to attribute]` — for all **four** work-page case studies.
6. `[NEED: source for each work-page metric]` — 28%→56% AVD, 1.5M views, 17.6M, 14.8M, 42,000 subs, 12%→44%.
7. `[NEED: citable retention study]` — "50% of viewers lost in first 45 seconds".
8. `[NEED: time study]` — "30+ hours every week". (The "60-70% of production time" line was removed in the rewrite.)
9. `[NEED: written unlimited-revisions policy]` — homepage FAQ claim.
10. `[NEED: security documentation]` — "air-gapped" and "zero-leak" claims on the businesses page.
11. `[NEED: confirm a wholesale rate card exists]` — agency final CTA.
12. `[NEED: sourced ROAS / completion-rate data]` — video-ad page result claims and short-form 100%+ claim.
13. `[NEED: confirm 4K masters on every tier]`.
14. `[NEED: confirm micro-hooks every 20–30 seconds is a documented workflow step]`.

---

## 8. Verified non-issues (do not "fix")

- The UTF-8 middle dot in the homepage `<title>` (`RESOLVIA · High-Retention…`) is correct.
- The homepage `<h2>` "Edited in … by Resolvia Studio" is a rotating software slot; the duplicated text seen in scraped output comes from hidden slots and the sr-only line, not from broken visible copy.
- "Don't fill this out if you're human:" is a honeypot label, not an AI tell.
- FAQ-style questions are allowed by the skill; the issue is their use as every section heading, not their presence.
- The site's refusal to use "it's not X, it's Y" negation patterns is a strength; keep it that way.

---

## Summary — diagnosis + top 5 copy fixes

**Diagnosis:** Situation B. The founder voice is real and opinionated ("Stop editing. Post what converts.", "edit bay", "retention-engineered", "thrilled with the cut"); concurrent edits improved proof and CTAs but left the buried hero lead, impossible absolutes, and unattributed case-study metrics. Restore the voice, don't replace the positioning.

**Top 5 fixes:**
1. **Promote "Stop editing. Post what converts." to the hero headline** and move the new "What is retention-engineered video editing?" definition paragraph down to the FAQ. The best line is currently last; the hero currently leads with a brand name and a glossary entry.
2. **Change the homepage primary CTA from "Get Your First Edit" to "Book Your First Edit Call."** Every other page was already updated to a "Book/Get a quote" label; the homepage still promises delivery where the click delivers scheduling.
3. **Replace "tens of millions of views combined" with "50M+ combined client views across 41+ case studies."** Verified proof already on the site; stop under-claiming. At the same time, source or remove the newly added **35M+ short-form views** figure.
4. **Remove or source the impossible/absolute claims**: "100%+ completion rates", "100% reading focus", "100% visible", "Zero-Leak", "air-gapped", "unbreakable", "virtually eradicated", "exclusively" (contradicted by the software row). Every removal names a `[NEED: ...]` unlock above.
5. **Attribute the four work-page case studies** and cut the duplicated metric paragraph, the "highest-converting funnel" claim, and the stray-space artifacts. Keep the proof-led H1 and the specific before/after numbers — they are the strongest asset on the site once sourced.

*No numbers, clients, or testimonials were invented in this report. All suggested claims use only brief-verified proof or copy already present on the site; everything else is marked `[NEED: ...]`.*
