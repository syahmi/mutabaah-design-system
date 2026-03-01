# Mutabaah Amal — Design System

A design system for **Mutabaah Amal**, an Islamic habit and amal tracking app. It documents all visual tokens, components, and interaction patterns used across the product.

![Design System — Mutabaah Amal](og-image.png)

## Overview

The design system requires no build step or dependencies. Open `index.html` directly in a browser to browse the living style guide.

```
mutabaah-design-system/
├── index.html          # Design system documentation
├── styles.css          # All styles and design tokens
├── script.js           # Copy-to-clipboard, sticky nav highlighting, icon init
├── og-image.png        # Social share image (2400×1260px) — referenced by meta tags
├── favicon-16x16.png
└── favicon-32x32.png
```

## Sections

| # | Section | What it covers |
|---|---------|----------------|
| 01 | **Colors** | Core palette (background, surface, primary, sage, gold) and category colors (Worship, Quran, Charity, Personal) |
| 02 | **Typography** | Inter Tight (display), Inter (body) — full type scale |
| 03 | **Spacing** | Base spacing scale (4–80px), component and layout rhythm tables, border-radius tokens, elevation scale |
| 04 | **Iconography** | Lucide icon library — all icons grouped by category with usage guidance |
| 05 | **Components** | Buttons, chips, tags, input fields, progress rings, bar charts, streak badges |
| 06 | **Tasks** | Task item states (pending, done), metadata, and interaction notes |
| 07 | **Navigation** | Bottom tab bar and dashboard cards (hero card, Hijri date, streak) |
| 08 | **Empty States** | Three variants (no tasks, no search results, no analytics data) with illustration and copy guidelines |
| 09 | **Motion & Tone** | Transition durations, easing curves, animation principles, and copy guidelines |

## Design Tokens

All tokens live in the `:root` block at the top of `styles.css`.

### Color Palette

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#F5F1EA` | Page background |
| `--surface` | `#FFFFFF` | Card / component surface |
| `--surface-alt` | `#EDE8DF` | Secondary surface, input fill |
| `--border` | `#DDD8CF` | Default border |
| `--primary` | `#1C3D2E` | Primary action, brand green |
| `--sage` | `#4A7860` | Accent / secondary green |
| `--gold` | `#C4993E` | Streak, highlight |
| `--text-1` | `#1A1816` | Primary text |
| `--text-2` | `#635E56` | Secondary text |
| `--text-3` | `#A49E94` | Muted / placeholder text |

### Category Colors

| Category | Color | Background |
|----------|-------|------------|
| Worship (Ibadah) | `#2D6E4E` | `#E8F2EC` |
| Quran | `#2E5D8C` | `#E6EEF7` |
| Charity (Sadaqah) | `#C4993E` | `#FBF3E3` |
| Personal | `#6E4A8C` | `#EFE9F7` |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-xs` | `6px` | Small elements (code pills) |
| `--radius-sm` | `8px` | Small surfaces |
| `--radius-md` | `12px` | Buttons, input fields |
| `--radius-lg` | `16px` | Cards, list containers |
| `--radius-xl` | `20px` | Large cards, bottom nav |
| `--radius-2xl` | `24px` | Bottom sheets |
| `--radius-pill` | `100px` | Chips, tags, pill buttons |

### Elevation

| Token | Shadow | Use |
|-------|--------|-----|
| `--shadow-1` | `0 1px 4px rgba(28,61,46,0.06)` | Subtle — resting cards, lists |
| `--shadow-2` | `0 2px 12px rgba(28,61,46,0.10)` | Raised — bottom sheets, modals |
| `--shadow-3` | `0 4px 24px rgba(28,61,46,0.16)` | Elevated — overlapping panels |
| `--shadow-fab` | `0 4px 16px rgba(28,61,46,0.30)` | FAB — floating action button |
| `--shadow-nav` | `0 -4px 24px rgba(28,61,46,0.06)` | Bottom navigation bar |

### Duration

| Token | Value | Use |
|-------|-------|-----|
| `--duration-fast` | `150ms` | Hover / state transitions |
| `--duration-exit` | `200ms` | Exits, dismissals — ease in |
| `--duration-enter` | `280ms` | Entrances, confirmations — ease out |
| `--duration-complete` | `360ms` | Task complete spring animation |

### Typography

| Font | Use |
|------|-----|
| **Google Sans Flex** | Design system documentation page — all text |
| **Inter Tight** | App display typeface (documented in the Typography section) |
| **Inter** | App body typeface (documented in the Typography section) |

All fonts are loaded from Google Fonts.

### Icons

| Library | Version | Method |
|---------|---------|--------|
| [Lucide](https://lucide.dev) | 0.460.0 | `<i data-lucide="icon-name"></i>` via CDN |

Icons are initialised automatically on page load via `lucide.createIcons()` in `script.js`.

## Social Sharing

`index.html` includes Open Graph and Twitter Card meta tags for rich link previews on social platforms.

| Tag | Value |
|-----|-------|
| `og:title` | Design System — Mutabaah Amal |
| `og:description` | Visual foundations for the Mutabaah Amal progressive web application. |
| `og:image` | `og-image.png` (2400×1260px) |
| `twitter:card` | `summary_large_image` |

## Interactive Features

| Feature | File | Notes |
|---------|------|-------|
| Copy hex to clipboard | `script.js` | Click any hex value in the Colors section |
| Copy icon name to clipboard | `script.js` | Click any icon card in the Iconography section |
| Sticky nav highlighting | `script.js` | Active section is highlighted as you scroll; active link scrolls into view on mobile |
| Icon rendering | `script.js` | Lucide icons are initialised after the CDN script loads |

Clipboard writes use the `navigator.clipboard` API exclusively.

## Usage

Open `index.html` in any modern browser:

```bash
open index.html
# or
python3 -m http.server 8080
```

No installation, build tools, or package manager required.

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Desktop | > 900px | Full layout, 6-column color grid |
| Tablet | ≤ 900px | Reduced padding, single-column font cards |
| Mobile | ≤ 640px | Compact layout, nav links collapse into a horizontally scrollable strip |
| Small phones | ≤ 380px | Smaller hero type |

## Contributing

| File | Purpose |
|------|---------|
| `index.html` | Structure, content, and meta tags of the style guide |
| `styles.css` | All styles and CSS custom property tokens |
| `script.js` | Interactive behaviour — clipboard, nav highlighting, icon init |

To update design tokens, edit the `:root` block at the top of `styles.css`. It is organised into colour, radius, elevation, and duration groups. To add new sections or components, edit `index.html` and add corresponding styles to `styles.css`. To replace the social share image, swap out `og-image.png` (keep it at 2400×1260px) and update the `og:image` meta tag URL if needed.
