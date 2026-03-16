#!/usr/bin/env node
// Minifies source files into dist/ for production deployment.
// Run: npm run build

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const contentHash = (str) => crypto.createHash('sha256').update(str).digest('hex').slice(0, 8);

const CleanCSS          = require('clean-css');
const { minify: minJS } = require('terser');
const { minify: minHTML } = require('html-minifier-terser');

const DIST = 'docs';
const { version: VERSION } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const BUILD_DATE = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const fmt = (before, after) =>
  `${before} → ${after} bytes (${Math.round((1 - after / before) * 100)}% smaller)`;

async function build() {
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

  // ── CSS ──────────────────────────────────────────────────────────────────
  const css = fs.readFileSync('styles.css', 'utf8');
  const { styles } = new CleanCSS({ level: 2 }).minify(css);
  // Keep a standalone copy for reference, but the HTML build inlines it.
  fs.writeFileSync(path.join(DIST, 'styles.css'), styles);
  console.log(`styles.css    ${fmt(css.length, styles.length)}`);

  // ── JS ───────────────────────────────────────────────────────────────────
  const jsHashes = {};
  for (const file of ['script.js', 'lucide-mini.js']) {
    let src = fs.readFileSync(file, 'utf8');
    if (file === 'script.js') {
      src = src.replace(/const VERSION = '[^']*'/, `const VERSION = '${VERSION}'`);
      src = src.replace(/const DATE = '[^']*'/, `const DATE = '${BUILD_DATE}'`);
      fs.writeFileSync(file, src); // keep source in sync for dev server
    }
    const { code } = await minJS(src, { compress: true, mangle: true });
    const base = path.basename(file, '.js');
    const hashedName = `${base}.${contentHash(code)}.js`;
    jsHashes[file] = hashedName;
    fs.writeFileSync(path.join(DIST, hashedName), code);
    console.log(`${hashedName.padEnd(24)}${fmt(src.length, code.length)}`);
  }

  // ── HTML ─────────────────────────────────────────────────────────────────
  const html = fs.readFileSync('index.html', 'utf8')
    .replace(/data-version="short">[^<]+</, `data-version="short">${VERSION}<`)
    .replace(/data-version="full">[^<]+</, `data-version="full">Design System v${VERSION} · ${BUILD_DATE}<`)
    .replace(/data-date="[^"]*">[^<]+</, `data-date="${BUILD_DATE}">${BUILD_DATE}<`)
    // Inline CSS to eliminate the render-blocking external stylesheet request.
    .replace(/<link rel="stylesheet" href="styles\.css"\s*\/>/, `<style>${styles}</style>`)
    // Use content-hashed filenames for JS so assets can be cached indefinitely.
    .replace(/src="lucide-mini\.js"/, `src="${jsHashes['lucide-mini.js']}"`)
    .replace(/src="script\.js"/, `src="${jsHashes['script.js']}"`);
  const minified = await minHTML(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
  });
  fs.writeFileSync(path.join(DIST, 'index.html'), minified);
  console.log(`index.html    ${fmt(html.length, minified.length)}`);

  // ── Static assets ────────────────────────────────────────────────────────
  for (const file of ['og-image.png', 'favicon-32x32.png', 'favicon-16x16.png']) {
    fs.copyFileSync(file, path.join(DIST, file));
  }
  console.log('\nBuild complete → docs/');
}

build().catch(err => { console.error(err); process.exit(1); });
