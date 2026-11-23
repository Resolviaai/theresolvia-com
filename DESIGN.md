# Resolvia Design System Specification (DESIGN.md)

This document establishes the official design tokens, component architecture, and visual standards for **Resolvia** (`theresolvia.com`). All pages, sections, marketing assets, and future components must strictly conform to these rules.

---

## 1. Core Design Philosophy

Resolvia combines **The Steve Jobs (Clean & Minimalist System)** with **The Jensen Huang (Precise, SaaS/AI Grid)**:
- **Buttoned-up, calculated, and high-performance**: Everything is contained within clear, balanced grids with abundant negative space.
- **Zero AI Vibecoding**: No arbitrary color choices, no generic gradient washes, no fuzzy neon halos, and **zero native OS emojis** (e.g. 🚀, 💡, 🔥, ⚡).
- **Tactile, human-crafted micro-interactions**: Explicit spring transitions (`cubic-bezier(0.16, 1, 0.3, 1)`), tactile depression on click (`active:scale-98`), and responsive keyboard accessibility.

---

## 2. The 4-Layer Color Architecture

Every screen strictly adheres to a 4-layer depth model to maintain visual hierarchy and spatial coherence:

### Layer 0: Canvas (Root Background)
- **Primary Canvas Color**: `#0B0F17` (Deep neutral space anchor)
- **Theme Color**: `<meta name="theme-color" content="#0B0F17">`
- Never use washed-out grays (`#1a1a1a`), navy blue deviations (`#0E131F`), or murky slop (`#090b10`).

### Layer 1: Surfaces & Container Cards
All card containers must belong to one of two standardized variants:
- **Variant A — Primary Showcase Card (The `#mcp` / Lead Capture Standard)**:
  - `background: radial-gradient(70% 120% at 50% 0%, #24262a 0%, #18191c 55%, #131416 100%)`
  - `border: 1px solid rgba(255, 255, 255, 0.08)`
  - `border-radius: 22px` (desktop), `16px` (mobile `<640px`)
  - Optional subtle dot-grid mask: `.dot-grid` with `linear-gradient(0deg, #000 0%, transparent 100%)`
- **Variant B — Secondary Tile / Feature Card**:
  - `background: linear-gradient(180deg, #141a24 0%, #1d1f23 100%)` or `rgba(255, 255, 255, 0.03)`
  - `border: 1px solid rgba(255, 255, 255, 0.08)`
  - `border-radius: 16px`

### Layer 2: Recessed Containers & Form Inputs
Inner recessed areas (input fields, code blocks, stat callouts):
- `background: rgba(0, 0, 0, 0.55)`
- `border: 1px solid rgba(255, 255, 255, 0.12)`
- `border-radius: 10px`
- `color: #ffffff`
- `placeholder: rgba(255, 255, 255, 0.35)`
- Focus state: `border-color: #0077ED`, `box-shadow: 0 0 0 1px #0077ED`

### Layer 3: Functional Accents & Action Buttons
- **Primary Brand Blue**: `#0077ED` / `linear-gradient(180deg, #0077ED 0%, #0062CC 100%)`
- **High-Contrast Primary Button (Showcase CTA)**:
  - `background: #ffffff`, `color: #0B0F17`, `font-weight: 700`, `border-radius: 14px`
- **Standard Brand CTA Button**:
  - `background: linear-gradient(180deg, #0077ED 0%, #0062CC 100%)`
  - `color: #ffffff`, `font-weight: 700`
  - `box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)`
  - **STRICT PROHIBITION**: Never apply diffuse neon halos, colored outer blurs, or glow shadows (e.g. `0 8px 24px rgba(0, 119, 237, 0.55)`). Buttons must look sharp, precision-cut, and industrial.

---

## 3. Typography System

- **Display Headline Typeface**: `Anton`, uppercase, tracking `0.005em` to `0.02em`. Used for bold agency statements and section titles.
- **Body & Interface Typeface**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
  - Body Text: `rgba(255, 255, 255, 0.70)` to `rgba(255, 255, 255, 0.85)`
  - Secondary Metadata & Captions: `rgba(255, 255, 255, 0.50)`
  - Numeric metrics: Always tabular numbers (`tabular-nums`) and right-aligned when in tables/cards.

---

## 4. Navigation & Global Elements

### 4.1 Floating Supaste Notch Navbar
- Fixed centered floating island with inverted curved ears:
  - Background: `#ffffff`
  - Text: `#09090b`
  - Corner radius: `border-bottom-left-radius: 18px`, `border-bottom-right-radius: 18px`
  - Inverted curved SVG ears on left and right (`fill="#ffffff"`, size `20px x 20px`)
- **Desktop Links**:
  - `Services` (`/services/youtube-video-editing/`)
  - `Process` (`/#workflow`)
  - `Blog` (`/blog.html`)
  - `FAQ` (`/#faq`)
  - *(Note: The generic "Work" link is deprecated and removed)*
- **Primary Nav CTA**: Black pill button `#09090b`, text "Book a Call" with arrow icon.
- **Mobile Menu**: Dynamic Island card trigger with burger/close toggle. Expands into a frosted dark glass card with clean Lucide SVG icons.

### 4.2 YouTube Ultra-Thin Scroll Scrubber
- Fixed to the absolute top edge of the viewport (`top: 0`, `height: 2px`, `z-index: 99999`).
- Appearance: Subtle red gradient (`linear-gradient(90deg, #ff0000 0%, #ff3b30 70%, #ff6b6b 100%)`).
- **Playhead**: No white dot or circle. Clean flat 2px precision bar with faint tip shimmer.

---

## 5. Blog & Editorial System Standards

1. **Canvas**: `#0B0F17` — no disparate template styles.
2. **Card Structure**:
   - Every article card must feature a 16:9 high-resolution preview image (`/lp/thumbs/lib-*.jpg` or `/lp/promo-format-*.jpg`).
   - Category pill: `text-[#2F86F7]`, `bg-[rgba(47,134,247,0.1)]`, uppercase 11px font.
   - Title: Crisp sans-serif heading (`18px` to `20px`), line-height `1.35`.
   - Excerpt: 2-line clamp in muted white (`text-white/65`).
   - Meta footer: Author avatar or badge, publish date, and read time.
3. **No AI Slop**: No keyword-stuffed SEO text walls, no hollow bullet points, and no unstyled gray boxes.
