# Mutabaah Amal — Design System

**Grounded in calm, reverent minimalism with Islamic warmth.**

A comprehensive design system for **Mutabaah Amal**, an Islamic habit and amal tracking app. This project serves as a single source of truth for all visual tokens, interactive components, and specialized patterns defining the product experience.

![Design System — Mutabaah Amal](og-image.png)

## Overview

The design system is engineered for maximum performance, accessibility, and high-fidelity motion with zero runtime dependencies.

### Technical Architecture
- **Documentation:** A single `index.html` structure ensures fast loading and simple navigation.
- **Styling:** Robust CSS architecture utilizing a comprehensive Design Token set (CSS Custom Properties).
- **Interactivity:** Lightweight Vanilla JavaScript modules for enhanced UI features.
- **Build & Optimization:** Node.js-based pipeline featuring asset minification, image processing, and automated versioning.

```
mutabaah-design-system/
├── index.html          # Documentation markup
├── styles.css          # Design system styles
├── script.js           # Interactive components & UI logic
├── build.js            # Production build script
├── sync-version.js     # Version synchronization utility
└── package.json        # Project metadata
```

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- `npm`

### Quick Start
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Launch development server**:
   ```bash
   npm run dev
   ```
   *Access at `http://localhost:8080` with automatic live-reloading.*
3. **Build for production**:
   ```bash
   npm run build
   ```

## Workflow & Deployment

### Build Pipeline
Our production pipeline ensures optimal delivery:
- **Minification**: Utilizes `lightningcss` for CSS and `esbuild` for JavaScript.
- **Versioning**: Content-hashing ensures efficient browser caching.
- **Asset Processing**: Automatically optimizes high-fidelity images (`og-image.png`) and generates favicon/PWA icon sets from `logo.svg` via `sharp` and `svgo`.

### Automated Deployment
Deployment is handled by GitHub Actions. Every push to the `main` branch triggers:
1. Environment setup and dependency installation (`npm ci`).
2. Production build execution (`npm run build`).
3. Automatic deployment of the `docs/` output to GitHub Pages.

## Contribution Guidelines

We maintain consistency through these standard procedures:

1. **Design Tokens**: Modify CSS variables exclusively in the `:root` block within `styles.css`.
2. **Components**: For new components, please follow the naming conventions of existing elements and ensure documentation examples are provided in `index.html`.
3. **Versioning**: Use the standard NPM versioning flow (`npm version [patch|minor|major]`). This automatically triggers `sync-version.js` to update all relevant project files.
4. **Verification**: Always run `npm test` before committing to ensure the build and version synchronization scripts are functioning correctly.

## License

MIT
