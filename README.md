# Mutabaah Amal — Design System

**Grounded in calm, reverent minimalism with Islamic warmth.**

A comprehensive design system for **Mutabaah Amal**, an Islamic habit and amal tracking app. This project documents all visual tokens, interactive components, and specialized patterns that define the product experience.

![Design System — Mutabaah Amal](og-image.png)

## Overview

The design system is built with zero dependencies for the runtime, prioritizing performance, accessibility, and high-fidelity motion.

### Core Architecture
- **Documentation:** Built on a single `index.html` for instant accessibility and ease of maintenance.
- **Styling:** Vanilla CSS using a deep hierarchy of Design Tokens (CSS Variables).
- **Interactivity:** Lightweight Vanilla JS with specialized modules for search, accessibility, and clipboard management.
- **Build Pipeline:** Node.js-based minification, content-hashing, and an automated image optimization pipeline using `sharp`.

```
mutabaah-design-system/
├── index.html          # Design system documentation
├── styles.css          # All styles and design tokens
├── script.js           # Copy-to-clipboard, sticky nav, theme toggle, versioning
├── sw.js               # Service Worker for offline support
├── lucide-mini.js      # Self-hosted Lucide icon subset
├── build.js            # Production build script (outputs to docs/)
├── sync-version.js     # Automates version propagation across files
├── logo.svg            # Source brand asset for favicon generation
├── og-image.png        # Source social share image (2400×1260px)
├── package.json        # Version source of truth + build dependencies
├── package-lock.json   # Lockfile (required for CI)
└── README.md
```

`docs/` is git-ignored — it is built and deployed by CI automatically.

## Development

```bash
# Install dependencies
npm install

# Browse locally
open index.html
# or serve with
npm run dev   # python3 -m http.server 8080

# Production build → docs/
npm run build
```

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which:

1. Installs dependencies via `npm ci`
2. Runs `npm run build` to produce a minified and optimized `docs/` output
3. Deploys `docs/` to GitHub Pages

No manual build or push is required.

## Build Pipeline Features

The `build.js` script handles more than just minification:

- **Command Palette Integration:** Builds a comprehensive index of sections, components, icons, and system commands for the global `⌘K` palette.
- **CSS/JS Minification:** Uses `lightningcss` and `esbuild` for extremely fast bundling and minification.
- **HTML Minification:** Inlines CSS and minifies HTML structure via `html-minifier-terser`.
- **Content Hashing:** JavaScript files are content-hashed for aggressive long-term caching.
- **Image Optimization:** 
    - **OG Image:** Optimizes `og-image.png` and generates modern **WebP** and **AVIF** formats.
    - **Favicons:** Automatically generates a comprehensive set of favicons from `logo.svg`, including `apple-touch-icon.png` and PWA icons (`192px`, `512px`).
    - **SVG Icons:** Deploys raw SVG favicon for high-density displays.

## Sections

| # | Section | What it covers |
|---|---------|----------------|
| 01 | **Typography** | Inter Tight (display), Inter (body) — full type scale |
| 02 | **Colors** | Core palette, category colors, and dark mode tokens |
| 03 | **Spacing** | Base spacing scale (0.25–5rem), component and layout rhythm, border-radius tokens, elevation scale |
| 04 | **Components** | Buttons, chips, tags, input fields, progress rings, bar charts, streak badges, skeleton loaders, alerts |
| 05 | **Form Controls** | Checkbox, radio, and toggle — all states |
| 06 | **Avatar** | Sizes, variants, and groups |
| 07 | **Overlays** | Modal, dialog, and tooltip — patterns and structure |
| 08 | **Tasks** | Task item states (pending, done), metadata, and interaction notes |
| 09 | **Navigation** | Bottom tab bar (iOS/Android) and dashboard cards |
| 10 | **Empty States** | Three variants with illustration and copy guidelines |
| 11 | **Iconography** | Lucide icon library — all icons grouped by category |
| 12 | **Breadcrumb & Pagination** | Wayfinding breadcrumbs and pagination controls |
| 13 | **Motion & Tone** | Transition durations, easing curves, and principles |
| 14 | **Command Palette** | Global `⌘K` search with system commands and categorised results |

## Design Tokens

All tokens live in the `:root` block at the top of `styles.css`. Dark mode overrides live in the `[data-theme="dark"]` block immediately below.

Spacing, padding, gap, and font-size values throughout `styles.css` use `rem` units so the layout scales correctly when a user changes their browser's base font size. Border widths, outline widths, box-shadows, SVG dimensions, and fixed component control sizes (checkbox, toggle, radio) intentionally remain in `px`.

### Typography

| Font | Weights | Use |
|------|---------|-----|
| **Google Sans Flex** | 100–900 (variable) | Design system documentation — all text |
| **Inter Tight** | 400 / 500 / 600 / 700 / 800 | App display typeface — headings, large numerics |
| **Inter** | 300 / 400 / 500 / 600 | App body typeface — body text, labels, inputs |

All three fonts are loaded from Google Fonts in a single non-render-blocking request with metric-adjusted fallbacks to eliminate layout shift.

### Color Palette

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--bg` | `#F5F1EA` | `#18180F` | Page background |
| `--surface` | `#FFFFFF` | `#222219` | Card / component surface |
| `--surface-alt` | `#EDE8DF` | `#2D2D22` | Secondary surface, input fill |
| `--border` | `#DDD8CF` | `#3D3D2E` | Default border |
| `--primary` | `#1C3D2E` | `#4A9B70` | Primary action, brand green |
| `--sage` | `#46725B` | `#7AB89A` | Accent / secondary green |
| `--gold` | `#AC8636` | `#C9993D` | Streak, highlight |
| `--gold-dark` | `#90691E` | `#D9A84D` | Gold text on light backgrounds |
| `--gold-bg` | `#FBF3E3` | `#2A2416` | Gold tinted background |
| `--text-1` | `#1A1816` | `#F0EDE6` | Primary text |
| `--text-2` | `#635E56` | `#B5AFA6` | Secondary text |
| `--text-3` | `#6C6861` | `#888279` | Muted / placeholder text |
| `--success` | `#2D7A5A` | `#4A9B70` | Success states |
| `--error` | `#B84040` | `#E07070` | Error states |

### Category Colors

| Category | Token | Light | Dark |
|----------|-------|-------|------|
| Worship | `--cat-worship` / `--cat-worship-bg` | `#2D6E4E` / `#E8F2EC` | `#5DBB8A` / `#1A2E22` |
| Quran | `--cat-quran` / `--cat-quran-bg` | `#2E5D8C` / `#E6EEF7` | `#6B9ED4` / `#1A2230` |
| Charity | `--cat-charity` / `--cat-charity-bg` | `#AC8636` / `#FBF3E3` | `#C9993D` / `#2A2416` |
| Personal | `--cat-personal` / `--cat-personal-bg` | `#6E4A8C` / `#EFE9F7` | `#A87ED4` / `#221830` |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-xs` | `6px` | Small elements (code pills, skeleton bones) |
| `--radius-sm" | `8px` | Small surfaces |
| `--radius-md` | `12px` | Buttons, input fields, bottom nav |
| `--radius-lg` | `16px` | Cards, list containers |
| `--radius-xl` | `20px` | Large cards |
| `--radius-2xl` | `24px` | Bottom sheets |
| `--radius-pill` | `100px` | Chips, tags, pill buttons, M3 indicator |

### Elevation

Light mode shadows use a green-tinted base colour; dark mode overrides switch to neutral black so shadows read correctly against dark surfaces.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--shadow-1` | `rgba(28,61,46,0.06)` | `rgba(0,0,0,0.20)` | Subtle — resting cards |
| `--shadow-2` | `rgba(28,61,46,0.10)` | `rgba(0,0,0,0.32)` | Raised — bottom sheets |
| `--shadow-3" | `rgba(28,61,46,0.16)` | `rgba(0,0,0,0.44)` | Elevated — overlapping panels |
| `--shadow-fab` | `rgba(28,61,46,0.30)` | `rgba(0,0,0,0.56)` | Floating action button |
| `--shadow-nav` | `rgba(28,61,46,0.06)` | `rgba(0,0,0,0.20)` | Bottom navigation bar |

### Duration

| Token | Value | Use |
|-------|-------|-----|
| `--duration-fast` | `150ms` | Hover / state transitions |
| `--duration-exit` | `200ms` | Exits, dismissals |
| `--duration-enter` | `280ms` | Entrances, confirmations |
| `--duration-complete` | `360ms` | Task complete spring animation |

### Icons

| Library | Version | Method |
|---------|---------|--------|
| [Lucide](https://lucide.dev) | 0.460.0 | `<i data-lucide="icon-name"></i>` via `lucide-mini.js` |

Icons are initialised on page load via `lucide.createIcons()` in `script.js`.

## Components

### Skeleton Loaders

Skeleton loaders use a GPU-accelerated shimmer via a `::after` pseudo-element sweep. Four variants are documented: Task list, Dashboard card, Profile header, and Input form.

### Alerts

Four semantic variants — info, success, warning, error — using existing category color tokens.

### Bottom Navigation Bar

Documents two platform-specific variants: iOS (Human Interface Guidelines) with frosted glass, and Android (Material 3) with indicator pills.

## Versioning

Version and build date are single-sourced from `package.json`.

To bump the version across all files:

```bash
npm version patch   # e.g., 1.7.1 → 1.7.2
# or
npm version minor   # e.g., 1.7.1 → 1.8.0
```

This command automatically:
1. Bumps the version in `package.json`.
2. Runs `sync-version.js` to propagate the version to `script.js`, `sw.js`, and `index.html`.
3. Stages these changes and creates a git commit and tag.

The production build (`npm run build`) also injects the current version and build date into the minified output.

## Dark Mode

The design system ships with a full dark mode. A moon/sun toggle in the sticky nav switches themes. The preference is persisted in `localStorage` and respects the OS `prefers-color-scheme` setting.

## Accessibility

- **WCAG 2.1 AA** compliant contrast for core palette.
- **Focus Trap** within active Modals and Megamenu.
- **Keyboard Navigation** for all interactive components.
- **Aria live regions** for clipboard and search feedback.
- **Rem-based spacing** for consistent scaling.

## Interactive Features

- **Command Palette:** Global `⌘K` search with actionable commands and categorized results.
- **Component Search:** Real-time filtering of sections and components.
- **Megamenu:** Desktop/Mobile sections panel with keyboard support.
- **One-click Copy:** Copy Hex, CSS variables, Token values, Icon names, and Component code.
- **Dark Mode Toggle:** Persistent theme switching.

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Desktop | > 900px | Full layout, 6-column colour grid |
| Tablet | ≤ 900px | Reduced padding, single-column font cards |
| Mobile | ≤ 640px | Scrollable nav strip, compact layout |
| Small phones | ≤ 380px | Smaller hero type |

## Contributing

| File | Purpose |
|------|---------|
| `index.html` | Structure, content, and meta tags |
| `styles.css` | All styles and CSS custom property tokens |
| `script.js` | Interactive behaviour and versioning |
| `build.js` | Production build script & optimization pipeline |
| `logo.svg` | Source for brand icons (generated by `build.js`) |
| `package.json` | Version source of truth |

To update design tokens, edit the `:root` block in `styles.css`. To replace the social share image, swap `og-image.png`. To update the brand icon, edit `logo.svg`.
| Version source of truth |

To update design tokens, edit the `:root` block in `styles.css`. To replace the social share image, swap `og-image.png`. To update the brand icon, edit `logo.svg`.
