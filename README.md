# Mutabaah Amal — Design System

A design system for **Mutabaah Amal**, an Islamic habit and amal tracking app. It documents all visual tokens, components, and interaction patterns used across the product.

## Overview

The design system requires no build step or dependencies. Open `index.html` directly in a browser to browse the living style guide.

```
mutabaah-design-system/
├── index.html          # Design system documentation
├── styles.css          # All styles and design tokens
├── favicon-16x16.png
└── favicon-32x32.png
```

## Sections

| # | Section | What it covers |
|---|---------|----------------|
| 1 | **Colors** | Core palette (background, surface, primary, sage, gold) and category colors (Worship, Quran, Charity, Personal) |
| 2 | **Typography** | Inter Tight (display), Inter (body), JetBrains Mono (code) — full type scale |
| 3 | **Spacing** | Base spacing scale (4–80px) plus component and layout rhythm tables |
| 4 | **Components** | Buttons, chips, tags, input fields, progress rings, bar charts, streak badges |
| 5 | **Tasks** | Task item states (pending, done), metadata, and interaction notes |
| 6 | **Navigation** | Bottom tab bar and dashboard cards (hero card, Hijri date, streak) |
| 7 | **Motion** | Transition durations, easing curves, and animation principles |
| 8 | **Tone** | Copy guidelines — what to say and what to avoid |

## Design Tokens

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

### Typography

| Font | Use |
|------|-----|
| **Inter Tight** | Display headings, numbers, brand name |
| **Inter** | Body text, labels, UI text |
| **JetBrains Mono** | Hex values, code snippets |

All fonts are loaded from Google Fonts.

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
| Mobile | ≤ 640px | Compact layout, nav links hidden |
| Small phones | ≤ 380px | Smaller hero type |

## Contributing

| File | Purpose |
|------|---------|
| `index.html` | Structure and content of the style guide |
| `styles.css` | All styles and CSS custom property tokens |

To update design tokens, edit the `:root` block at the top of `styles.css`. To add new sections or components, edit `index.html` and add corresponding styles to `styles.css`.
