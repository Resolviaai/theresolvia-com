# Resolvia popup — integration notes

Two shipped assets, both self-contained and dependency-free:

- `assets/resolvia-popup.js` — injects the trigger, dialog, events and stylesheet link.
- `assets/resolvia-popup.css` — all popup styles, namespaced under `.rsvp-`.

## Exact include (the only site change required)

Add this single line to the target marketing pages, immediately before `</body>`,
**after** the existing analytics include so `window.ResolviaAnalytics` is ready:

```html
<script defer src="/assets/resolvia-popup.js"></script>
```

Resulting order at the end of `<body>`:

```html
<script defer src="/assets/analytics.js"></script>
<script defer src="/assets/resolvia-popup.js"></script>
```

The script is `defer`-safe (waits for `DOMContentLoaded` when needed), guarded by
`window.__rsvpInitialized` against double injection, and tags all of its nodes with
`data-rsvp="1"` so any page `MutationObserver` sees one stable addition. It injects
`/assets/resolvia-popup.css` itself. No other HTML or CSS edits are needed.

## What it does

A small bottom-right trigger pill ("30-minute retention audit", "30-min audit" on
mobile) opens one consultation modal for the site's existing offer. No form, no
timer, no exit intent, no discount, no invented asset. The primary action is a plain
link to `https://calendly.com/resolviaai/meet`; the only other links are the canonical
`https://theresolvia.com/privacy.html` and a neutral "No thanks" decline.

Accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby` / `aria-describedby`,
focus moves to the close button, Tab/Shift+Tab is trapped, Escape / outside click /
"No thanks" all close, focus returns to the trigger, body scroll is locked with
scrollbar compensation, visible focus rings, 44px+ touch targets, mobile bottom sheet
with a drag handle and safe-area padding, and a `prefers-reduced-motion` override.

Analytics goes through `window.ResolviaAnalytics.track` with a guarded `dataLayer`
fallback; it never throws when analytics is absent. Events: `popup_trigger_clicked`,
`popup_impression`, `popup_opened`, `popup_cta_clicked`, `popup_dismissed`, and
`popup_suppressed`. It does **not** re-fire `begin_checkout` or
`schedule_consultation_intent`, which `assets/analytics.js` already emits on every
Calendly link click.

## Suppression rules (the script self-suppresses; still prefer not to include it)

Include only on marketing pages: `/`, `/blog.html`, `/blog/*`, `/services/*`,
`/for/*`, `/work/`, and the pricing guide. Do not add the script tag to:

1. App / tool pages and their `.html` twins: `/super-search`, `/mcp`, `/copilot`,
   `/script-studio`, `/auto-editing`. The script also bails out on any page with
   `[data-resolvia-studio-frame]`, `.pmodal` or `.st-toast`, so the product demo UI,
   its toasts and its `resolvia-studio-*` / `resolvia-adapted` localStorage state are
   never touched.
2. Legal / careers pages: `/privacy.html`, `/terms.html`, `/security.html`,
   `/careers.html`.
3. Any page that already makes the same ask inline: `.conversion-banner` or
   `[data-home-section="crewBanner"]`. This covers all seven blog posts and the
   `/services/*`, `/for/*` and `/work/` pages, so the popup does not duplicate the
   existing 30-minute audit CTA there.
4. Visitors flagged `rsvp_converted` (set after a Calendly click) in `localStorage`.
5. Visitors inside the 14-day cooldown after a dismissal (`rsvp_cooldown_until` in
   `localStorage`), or with 3+ dismissals in the session (`rsvp_session_dismissals`
   in `sessionStorage`). The trigger stays available during the current session
   until the 3-dismissal cap; the cooldown caps later page loads.
6. Any page where another `rsvp-open` dialog is already mounted.

All storage access is wrapped in `try/catch`, so Safari private mode and
storage-blocked browsers fail silently. No personal data or marketing cookies are
set; Calendly handles booking data after the click.

## Intentional deviation from the audit

The audit's Popup A would show the trigger even on pages with an inline
`.conversion-banner`. Per the integration instruction "do not duplicate the ask where
an inline conversion banner already exists", this build suppresses the trigger on
those pages (rule 3 above). Desktop exit intent (audit Popup B) is deliberately not
implemented; it was specified as a later A/B test, not a default.

## Outstanding items from the audit

- `[NEED: one deferred script include on the target pages — added by the HTML-owning agent, not by this asset]`
- `[NEED: GA4 measurement ID — assets/analytics.js ships with placeholder G-RESOLVIA_PENDING]`
- `[NEED: legal review of ePrivacy consent for the localStorage 14-day cooldown]`
- `[NEED: Calendly booking-confirmation data to measure booked calls, not just booking-intent clicks]`
