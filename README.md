# Mutabaah Amal — Design System

A design system for **Mutabaah Amal**, an Islamic habit and amal tracking app. It documents all visual tokens, components, and interaction patterns used across the product.

![Design System — Mutabaah Amal](og-image.png)

## Overview

Edit source files directly and open `index.html` in a browser to browse the living style guide. Run `npm run build` to produce a minified production build in `docs/`.

```
mutabaah-design-system/
├── index.html          # Design system documentation
├── styles.css          # All styles and design tokens
├── script.js           # Copy-to-clipboard, sticky nav highlighting, icon init
├── lucide-mini.js      # Self-hosted Lucide icon subset
├── build.js            # Production build script (outputs to docs/)
├── package.json        # Build dependencies
├── og-image.png        # Social share image (2400×1260px) — referenced by meta tags
├── favicon-16x16.png
├── favicon-32x32.png
└── docs/               # Minified production build (git-ignored)
```

## Development

```bash
# Browse locally
open index.html
# or
npm run dev   # python3 -m http.server 8080

# Production build → docs/
npm run build
```

## Sections

| # | Section | What it covers |
|---|---------|----------------|
| 01 | **Colors** | Core palette (background, surface, primary, sage, gold) and category colors (Worship, Quran, Charity, Personal) |
| 02 | **Typography** | Inter Tight (display), Inter (body) — full type scale |
| 03 | **Spacing** | Base spacing scale (4–80px), component and layout rhythm tables, border-radius tokens, elevation scale |
| 04 | **Iconography** | Lucide icon library — all icons grouped by category with usage guidance |
| 05 | **Components** | Buttons, chips, tags, input fields, progress rings, bar charts, streak badges |
| 06 | **Form Controls** | Checkbox, radio, and toggle — all states (default, checked, checked-disabled, disabled) |
| 07 | **Tasks** | Task item states (pending, done), metadata, and interaction notes |
| 08 | **Navigation** | Bottom tab bar and dashboard cards (hero card, Hijri date, streak) |
| 09 | **Empty States** | Three variants (no tasks, no search results, no analytics data) with illustration and copy guidelines |
| 10 | **Motion & Tone** | Transition durations, easing curves, animation principles, and copy guidelines |

## Design Tokens

All tokens live in the `:root` block at the top of `styles.css`.

### Typography

| Font | Weights | Use |
|------|---------|-----|
| **Google Sans Flex** | 100–900 (variable) | Design system documentation page — all text |
| **Inter Tight** | 400 / 500 / 600 / 700 / 800 | App display typeface — headings, large numerics |
| **Inter** | 300 / 400 / 500 / 600 | App body typeface — body text, labels, inputs |

All three fonts are loaded from Google Fonts in a single non-render-blocking request.

### Color Palette

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#F5F1EA` | Page background |
| `--surface` | `#FFFFFF` | Card / component surface |
| `--surface-alt` | `#EDE8DF` | Secondary surface, input fill |
| `--border` | `#DDD8CF` | Default border |
| `--primary` | `#1C3D2E` | Primary action, brand green |
| `--primary-hover` | `#163224` | Primary button hover state |
| `--sage` | `#46725B` | Accent / secondary green |
| `--gold` | `#AC8636` | Streak, highlight |
| `--gold-dark` | `#90691E` | Gold text on light backgrounds (tags, streak labels) |
| `--gold-bg` | `#FBF3E3` | Gold tinted background |
| `--text-1` | `#1A1816` | Primary text |
| `--text-2` | `#635E56` | Secondary text |
| `--text-3` | `#6C6861` | Muted / placeholder text |
| `--success` | `#2D7A5A` | Success states |
| `--error` | `#B84040` | Error states |

### Category Colors

| Category | Token | Color | Background token | Background |
|----------|-------|-------|-----------------|------------|
| Worship (Ibadah) | `--cat-worship` | `#2D6E4E` | `--cat-worship-bg` | `#E8F2EC` |
| Quran | `--cat-quran` | `#2E5D8C` | `--cat-quran-bg` | `#E6EEF7` |
| Charity (Sadaqah) | `--cat-charity` | `#AC8636` | `--cat-charity-bg` | `#FBF3E3` |
| Personal | `--cat-personal` | `#6E4A8C` | `--cat-personal-bg` | `#EFE9F7` |

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

### Icons

| Library | Version | Method |
|---------|---------|--------|
| [Lucide](https://lucide.dev) | 0.460.0 | `<i data-lucide="icon-name"></i>` via `lucide-mini.js` |

Icons are initialised automatically on page load via `lucide.createIcons()` in `script.js`.

## Versioning

The version number is defined once in `script.js`:

```js
const VERSION = '1.2.1';
```

This single constant drives the version displayed in both the hero section and the footer. To bump the version, update this value and run `npm run build`.

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
| Copy token to clipboard | `script.js` | Click any radius, shadow, or duration token |
| Copy icon name to clipboard | `script.js` | Click any icon card in the Iconography section |
| Sticky nav highlighting | `script.js` | Active section is highlighted as you scroll; active link scrolls into view on mobile |

Clipboard writes use the `navigator.clipboard` API exclusively.

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
| `script.js` | Interactive behaviour — clipboard, nav highlighting, version, icon init |
| `build.js` | Production build script |

To update design tokens, edit the `:root` block at the top of `styles.css`. To add new sections or components, edit `index.html` and add corresponding styles to `styles.css`. To replace the social share image, swap out `og-image.png` (keep it at 2400×1260px) and update the `og:image` meta tag URL if needed.
