# 07 — Popup / Modal Strategy for Resolvia

**Status:** read-only audit and specification. No site file was edited.
**Skill used:** `popups` (Popup CRO v2.0.4), read in full from `C:\Users\rohit\AppData\Local\Temp\opencode\mkt-skills\popups.txt`. No reference files exist for this skill.

## Scope and method

Read the shared brief and the popups skill in full. Grepped all site HTML for `modal`, `popup`, `dialog`, `banner`, `overlay`, `localStorage`, `cookie`, `consent`, `newsletter`, `email`, `calendly`, `sticky`, and `data-track`. Inspected the homepage CTA sections, a representative blog conversion banner, the blog listing callout, `privacy.html`, and `assets/analytics.js`. All findings below come from the site's own markup and copy.

---

## 1. What already exists (so the new spec does not duplicate it)

| Existing pattern | Where | What it actually is | Overlap with a new marketing popup |
|---|---|---|---|
| `.conversion-banner` sections | All 7 blog posts and most `/services/*`, `/for/*`, `/work/` pages (e.g. `blog/how-to-improve-youtube-retention/index.html:497`, `services/youtube-video-editing/index.html:732`) | Static, in-flow `<section>` CTA blocks. Copy: "Ready to Engineer High Retention for Your Videos?" / "Book a direct 30-minute creative strategy and retention audit with our lead post-production team." / CTA "Book Channel Retention Audit" | **High.** This is the "existing popup/announcement pattern" flagged in the brief. It is an inline banner, not an overlay, and it already makes the exact same audit offer. A new popup must suppress itself where this exists. |
| `.newsletter-section` callout | `blog.html:705-715` | A creator-partnership callout linking to Calendly ("Book an Onboarding Call"). Despite the class name, it contains **no email field and no newsletter signup** | Medium. Same audit/booking offer, different framing. |
| Homepage CTA blocks | `index.html:696`, `index.html:782-788`, `super-search.html:734` | "Work With Resolvia Studio" link, a `crewBanner` / `#contact` section, and the "click Book a Call ... first sample video within 48 hours" paragraph | Medium. Confirms the offer and the 48-hour proof point. |
| `.pmodal` | `/script-studio/`, `/auto-editing/`, `/copilot/` and their `.html` twins (e.g. `auto-editing/index.html:444`) | A product-internal phone-preview modal inside the editing demo app | None. Functional UI. Do not modify. |
| `.st-toast` | Same tool pages | Transient product notifications | None. |
| `localStorage` / `sessionStorage` | Tool pages only (`resolvia-studio-look`, `resolvia-adapted`) | Persists the demo app's look and adaptation state | None. The new asset must use **different keys**. |
| Sticky nav and sidebar | `copilot/index.html:31,217`, tool pages | Functional app chrome | None. |
| `/assets/analytics.js` | Loaded deferred on most marketing pages | Existing GA4/dataLayer bridge, Calendly click tracking, scroll-depth milestones | Not a popup, but it dictates the measurement design (section 7). |

**Conclusion:** the site has **no** marketing overlay, **no** email-capture form, **no** cookie/consent notice, and **no** exit-intent or sticky CTA. The only existing promotional pattern is the inline `.conversion-banner`. A single consultation modal is therefore additive, provided the conflict rules in section 5 are enforced.

---

## 2. The offer (supportable facts only)

**Recommendation: use the site's existing 30-minute retention audit, delivered through the existing Calendly link. Do not invent a lead magnet, discount, free trial, ebook, or guarantee.**

Facts already on the site that support this:

- Consultation URL used everywhere: `https://calendly.com/resolviaai/meet`.
- The audit itself is already described verbatim: "Book a direct 30-minute creative strategy and retention audit with our lead post-production team" (`blog/how-to-improve-youtube-retention/index.html:499`, and seven other pages).
- After booking, the process is described as: "We review your current content, define your hook and editing style, and edit your first sample video within 48 hours" (`index.html:782`).
- Proof points available for a small proof strip: 50M+ combined client views; 80K to 850K subscribers in six months; 41+ featured case studies; 48-hour turnaround sprint.
- Privacy policy exists at `https://theresolvia.com/privacy.html` with a GDPR and CCPA rights section.

**Why no email field:** there is no email-capture backend, CRM form, or lead-magnet asset anywhere on the site. A form would either be non-functional or would require invented infrastructure. A no-field modal that hands off to the already-live Calendly booking page is lower friction, collects nothing itself, and avoids the largest privacy and accessibility burdens. If email capture is added later, it needs its own consent design (section 6).

---

## 3. Primary popup: the retention-audit consultation modal (Popup A)

### Type
Click-triggered consultation micro-modal. A small injected trigger opens it; the primary action leaves the site for the existing Calendly booking page. No form, no gate, no timer.

### Trigger
- **Primary:** explicit click on an injected floating trigger. Zero annoyance because the visitor initiates it.
- The trigger is injected as a small labelled button, not a takeover: a bottom-right pill on desktop and a compact bottom-right tab on mobile. It never appears before the page has been painted and never covers primary navigation or the existing `#contact` CTA.
- No time delay, no scroll trigger, and no exit intent for this variant.

### Targeting
- Include marketing pages: `/`, `/blog.html`, `/blog/*`, `/services/*`, `/for/*`, `/work/`, and the pricing guide.
- Exclude app and tool pages: `/super-search`, `/super-search.html`, `/mcp`, `/mcp.html`, `/copilot`, `/copilot.html`, `/script-studio`, `/script-studio.html`, `/auto-editing`, `/auto-editing.html`, and any page carrying `[data-resolvia-studio-frame]` or an open `.pmodal`.
- Exclude legal and careers pages: `/privacy.html`, `/terms.html`, `/security.html`, `/careers.html`.
- Exclude visitors who have already clicked a Calendly link (flag set in section 7).

### Frequency
- The floating trigger stays available for manual clicks; opening it repeatedly is user-controlled and is not a frequency problem.
- Hide the trigger permanently once the visitor has clicked through to Calendly.
- If a visitor dismisses the modal three times in a session, hide the trigger for the rest of that session. Store this in `sessionStorage` only.
- Do not use a long-lived dismissal cooldown for this variant, since it is user-initiated.

### Exact copy

> **Headline:** Get a 30-minute retention audit
>
> **Subhead:** A direct 30-minute creative strategy and retention audit with our lead post-production team. After booking, we review your current content, define your hook and editing style, and edit your first sample video within 48 hours.
>
> **Proof strip (optional, small):** 50M+ combined client views. 41+ featured case studies.
>
> **Primary CTA:** Book the 30-minute audit
>
> **Secondary text link:** How we handle your data
>
> **Decline:** No thanks

Implementation notes on copy:

- The primary CTA points to `https://calendly.com/resolviaai/meet` with `target="_blank" rel="noopener noreferrer"`, matching every existing CTA on the site. The headline and subhead are plain text; only the secondary link leaves for the privacy policy.
- The "After booking," qualifier is deliberate. It keeps the 48-hour sample framed as onboarding, as it is on `index.html:782`, and does not imply the sample is part of the call.
- "How we handle your data" points to the canonical `https://theresolvia.com/privacy.html`, never localhost.
- The decline is a neutral text link. No guilt framing, no countdown, no "No, I don't want better retention" pattern.
- One fragment ("Get a 30-minute retention audit") and one short list in the proof strip. No em dashes in any of the strings above.

### Design notes
- Desktop dialog 500 to 560px wide, centred, with a dark surface matching the site: background `#0B0F17`, 1px border `rgba(255,255,255,0.08)`, 16 to 20px radius, subtle blue radial wash at the top using `rgba(47,134,247,0.12)`. This mirrors `.conversion-banner` and the `crewBanner` card.
- Type: the site's Inter / system stack. Headline bold and largest, subhead at 15 to 16px, CTA 16px semibold.
- CTA background: use an accessible blue such as `#1F6FE0` with white text for roughly 4.8:1 contrast. The site's `#2F86F7` is closer to 3.6:1 with white at 15px, so retain it only if the button text is at least 19px and bold.
- Backdrop `rgba(0,0,0,0.6)` with a light blur. The close button sits top right, is at least 44 by 44px, and stays visible.
- Overlay click outside closes the dialog. No image required; copy works alone and keeps the asset small. If imagery is added later, reuse an existing `/lp/thumbs/*` asset rather than loading a new file.
- All injected class names and IDs use an `rsvp-` prefix to avoid collisions with the site's Next.js classes and the tool pages' `st-`, `srl-`, and `pmodal` namespaces.

### Mobile behaviour
- No full-screen interstitial and no first-paint takeover. The trigger is a compact tab anchored above `env(safe-area-inset-bottom)`.
- Opening the dialog produces a **bottom sheet**: full width, rounded top corners, `max-height: 80dvh`, internally scrollable, with a visible drag-style handle. It leaves the top of the page visible.
- Touch targets at least 44px. Close control stays pinned at the top right of the sheet.
- Exit intent is not used on mobile; pointer-coarse devices never arm it.
- The sheet is user-initiated and non-blocking, so it stays clear of Google's intrusive-interstitial guidance.

### Accessibility
- Dialog container: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the headline, `aria-describedby` pointing at the subhead.
- On open, move focus to the close button or the headline, and keep a Tab / Shift+Tab focus trap inside the dialog until it closes.
- Escape closes and returns focus to the triggering button. Outside click and the "No thanks" link close it the same way.
- Lock body scroll while open and restore it on close, compensating scrollbar width to avoid a layout shift.
- Visible focus rings using `:focus-visible` with a two-pixel outline in the site's accent colour. Never rely on colour alone for any state.
- Close control carries `aria-label="Close dialog"`. The trigger carries `aria-label="Open 30-minute retention audit details"`.
- Respect `prefers-reduced-motion`: remove all entrance and exit transitions.
- Focus order follows visual order and no `tabindex` greater than zero is used.

### GDPR and privacy
- The popup contains no input fields and collects no personal data itself. Booking data is handled by Calendly after the click.
- State storage uses `sessionStorage` for the per-session counts. The 14-day cooldown used by Popup B uses one `localStorage` timestamp. Both are wrapped in `try/catch` so Safari private mode and storage-blocked browsers fail silently.
- No pre-checked opt-ins exist because there are no opt-ins. No marketing cookies are set by this asset.
- Privacy link is present and uses the canonical production URL.
- If an email field is introduced in a later variant, it must add an unchecked explicit consent checkbox, the same privacy link, and unsubscribe language before it ships.

### Measurement
See section 7. Use the existing `window.ResolviaAnalytics.track` bridge rather than creating a new analytics stack, and do not duplicate the Calendly events that `assets/analytics.js` already fires.

---

## 4. Optional secondary popup: desktop exit-intent save (Popup B)

Hold this behind an A/B test. Do not ship it at the same time as primary optimisation.

### Type
Exit-intent consultation modal, desktop only.

### Trigger
Cursor leaving the viewport toward the browser chrome, with a five-second page-load guard so it cannot fire during initial render.

### Targeting
Desktop pointers only: `matchMedia('(hover: hover) and (pointer: fine)')`. Same page include/exclude list as Popup A, with one additional rule: suppress on any page containing `.conversion-banner` or `[data-home-section="crewBanner"]`, because those pages already ask for the same booking.

### Frequency
Maximum one impression per session via `sessionStorage`. A 14-day cooldown via a `localStorage` timestamp after any dismissal. Never shown after a Calendly click. Never shown in a session where Popup A was opened.

### Exact copy

> **Headline:** Still comparing video editors?
>
> **Subhead:** We have 41+ featured case studies, including a channel that went from 80K to 850K subscribers. Start with a 30-minute retention audit.
>
> **Primary CTA:** Book a retention audit
>
> **Decline:** Maybe later

The decline is neutral and gives no impression of a penalty. No urgency device, no fake scarcity.

### Design and mobile
Same dark dialog styling as Popup A, capped at 480px wide. Disabled entirely on touch or narrow viewports. It never occupies the full viewport and never appears before a real exit gesture.

### Accessibility and privacy
Identical focus trap, Escape, outside-click, scroll lock, focus return, reduced-motion, and storage rules as Popup A. Same privacy link and canonical URL.

---

## 5. Multiple-popup strategy and conflict rules

- **Popup A (ship first):** click-triggered consultation modal, all eligible marketing pages, including pages with an inline conversion banner. The small trigger does not compete with the inline banner because the visitor must seek it out.
- **Popup B (test only):** desktop exit-intent modal, suppressed on every page that already has `.conversion-banner` or `crewBanner`.
- **Conflict rules:** only one dialog can be mounted at a time. If `rsvp-open` is set on `<html>`, no other trigger may fire. Opening Popup A in a session permanently suppresses Popup B for that session. A Calendly click sets a converted flag that hides both. Exit intent is disarmed while any dialog is open or while a `.pmodal` product modal is open.
- **Existing banners stay untouched.** Nothing in this spec edits, hides, or restyles `.conversion-banner`, `crewBanner`, or any of the site's inline CTAs.

---

## 6. Implementation shape: one self-injecting external JS asset

Because the HTML files are owned by other agents, the asset is designed to be fully self-contained.

- Single file, suggested path `/assets/resolvia-popup.js`, loaded with `<script defer src="/assets/resolvia-popup.js"></script>` before `</body>` on target pages. **The one-line include is not made by this spec.**
- On load it injects its own `<style>` block and its own DOM nodes, then wires its own listeners. It needs no HTML edits, no CSS file edits, and no new images.
- Wrap everything in an IIFE. Guard against double initialisation with a namespaced flag such as `window.__rsvpInitialized`. Expose nothing else globally.
- Wait for `DOMContentLoaded`, then run page-rule checks before injecting anything.
- Feature-detect `matchMedia`, `sessionStorage`, and `localStorage` inside `try/catch`.
- Several pages attach a `MutationObserver` to `document.body`. Inject once, after load, and tag injected nodes with `data-rsvp="1"` so any observer sees a single stable addition and cannot enter a loop.
- Storage keys must be unique: `rsvp_session_dismissals`, `rsvp_cooldown_until`, `rsvp_converted`. Do not reuse `resolvia-studio-look` or `resolvia-adapted`.
- Keep the whole asset small and avoid external requests so it does not hurt page speed.

---

## 7. Measurement events

Call `window.ResolviaAnalytics.track(name, params)` when available, otherwise push to `window.dataLayer`. Use the site's existing snake_case naming style. Include `popup_variant`, `popup_trigger`, `page_path`, and `device_class` on every event.

| Event | When it fires | Key parameters |
|---|---|---|
| `popup_impression` | Dialog becomes visible | `popup_variant` (`audit_click` / `audit_exit`), `page_path`, `device_class` |
| `popup_trigger_clicked` | Floating trigger clicked | `popup_variant`, `trigger_position` |
| `popup_opened` | Any successful open | `popup_variant`, `open_source` |
| `popup_cta_clicked` | Primary CTA clicked | `popup_variant`, `cta_text` |
| `popup_dismissed` | Any close path | `method`: `close_button` / `decline_link` / `outside_click` / `escape`; `time_to_close_ms` |
| `popup_suppressed` | A rule blocked an impression | `reason`: `frequency_cap` / `converted` / `page_rule` / `existing_banner` / `dialog_open` |

**Do not re-fire `begin_checkout` or `schedule_consultation_intent`.** `assets/analytics.js:54-70` already emits both on any Calendly link click through a capture-phase listener. The popup's CTA is a normal `<a href>` to Calendly, so those events fire automatically and adding duplicates would inflate conversion counts.

Core metrics: impression rate, CTA click rate per impression, close rate, time to close, and dismissal-method split. Booked-call rate requires Calendly confirmation data, which the site does not currently expose.

---

## 8. Test hypotheses

1. **Trigger.** On desktop editorial pages, exit intent will produce more impressions but a lower CTA click rate per impression than the click-triggered pill, while the pill will produce fewer, better-qualified clicks. Measure `popup_impression`, `popup_cta_clicked`, and booked calls if available.
2. **Message framing.** A proof-led subhead (50M+ views and the 80K to 850K case study) will outperform the process-led subhead on cold traffic, while the process-led version will do better on returning visitors. Split by new versus returning using a first-visit flag held in `sessionStorage`.
3. **Decline design.** An explicit "No thanks" text link plus a visible X will produce more deliberate dismissals and fewer Escape or outside-click exits than the X alone, with no drop in CTA clicks. Measure `popup_dismissed.method` and `popup_cta_clicked`.

Run one variable at a time. Popup B should only be in a test, never in permanent rotation alongside the primary variant.

---

## 9. [NEED: ...] items

1. `[NEED: GA4 measurement ID — assets/analytics.js ships with placeholder G-RESOLVIA_PENDING, so events currently reach dataLayer only; real reporting needs the production ID]`
2. `[NEED: one deferred script include for /assets/resolvia-popup.js on the target pages. HTML files are owned by other agents and were not edited here]`
3. `[NEED: legal review of ePrivacy consent for the localStorage 14-day cooldown used by Popup B. Session-only storage is used wherever possible]`
4. `[NEED: Calendly booking-confirmation data to measure booked calls rather than booking-intent clicks]`
5. `[NEED: confirm with the site owner that the 48-hour sample should be described as post-booking onboarding, which is how index.html:782 currently frames it]`

---

## Summary: recommended popup spec

Ship one user-initiated consultation modal. A small injected trigger opens a dark, 500 to 560px dialog with the headline "Get a 30-minute retention audit", a subhead built from the site's own audit description and 48-hour onboarding sentence, optional proof ("50M+ combined client views. 41+ featured case studies."), a CTA to the existing Calendly URL labelled "Book the 30-minute audit", and a plain "No thanks" decline plus a privacy link. No form, no discount, no timer, no invented asset. On mobile it becomes a non-blocking bottom sheet with no exit intent and no first-paint takeover. Use a full focus trap, Escape and outside-click close, focus return, scroll lock, reduced-motion support, and at least 4.5:1 button contrast. Cap automatic prompts at one per session with a 14-day cooldown, suppress on app pages and anywhere an inline `.conversion-banner` already asks for the same booking, and hide after a Calendly click. Instrument through `window.ResolviaAnalytics.track` without duplicating the Calendly events that already exist. Treat desktop exit intent as a later A/B test, not a default. Deliver the whole thing as one self-contained `/assets/resolvia-popup.js` asset requiring only a single deferred script include owned by the HTML-owning agent.
