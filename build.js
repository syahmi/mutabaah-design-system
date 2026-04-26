#!/usr/bin/env node
// Minifies source files into dist/ for production deployment.
// Run: npm run build

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const contentHash = (str) => crypto.createHash('sha256').update(str).digest('hex').slice(0, 8);

const lightningcss      = require('lightningcss');
const esbuild           = require('esbuild');
const { minify: minHTML } = require('html-minifier-terser');
const sharp             = require('sharp');

const DIST = 'docs';
const { version: VERSION } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const BUILD_DATE = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const fmt = (before, after) =>
  `${before} → ${after} bytes (${Math.round((1 - after / before) * 100)}% smaller)`;

async function build() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  // ── CSS ──────────────────────────────────────────────────────────────────
  const css = fs.readFileSync('styles.css');
  const { code: cssCode } = lightningcss.transform({
    filename: 'styles.css',
    code: css,
    minify: true,
    sourceMap: false
  });
  const styles = cssCode.toString();
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
    const { code } = await esbuild.transform(src, {
      minify: true,
      legalComments: 'none'
    });
    const base = path.basename(file, '.js');
    const hashedName = `${base}.${contentHash(code)}.js`;
    jsHashes[file] = hashedName;
    fs.writeFileSync(path.join(DIST, hashedName), code);
    console.log(`${hashedName.padEnd(24)}${fmt(src.length, code.length)}`);
  }

  // ── HTML ─────────────────────────────────────────────────────────────────
  let html = fs.readFileSync('index.html', 'utf8')
    .replace(/data-version="short">[^<]+</, `data-version="short">${VERSION}<`)
    .replace(/data-version="full">[^<]+</, `data-version="full">Design System v${VERSION} · ${BUILD_DATE}<`)
    .replace(/data-date="[^"]*">[^<]+</, `data-date="${BUILD_DATE}">${BUILD_DATE}<`);
  fs.writeFileSync('index.html', html); // keep source in sync with package.json version
  html = html
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
    minifySVG: true,
  });
  fs.writeFileSync(path.join(DIST, 'index.html'), minified);
  console.log(`index.html    ${fmt(html.length, minified.length)}`);

  // ── Images ───────────────────────────────────────────────────────────────
  console.log('\nOptimizing images...');
  
  // 1. OG Image: Optimize PNG and generate modern formats
  const ogImg = fs.readFileSync('og-image.png');
  const ogPng = await sharp(ogImg).png({ quality: 90, palette: true, compressionLevel: 9 }).toBuffer();
  const ogWebp = await sharp(ogImg).webp({ quality: 80 }).toBuffer();
  const ogAvif = await sharp(ogImg).avif({ quality: 65 }).toBuffer();

  fs.writeFileSync(path.join(DIST, 'og-image.png'), ogPng);
  fs.writeFileSync(path.join(DIST, 'og-image.webp'), ogWebp);
  fs.writeFileSync(path.join(DIST, 'og-image.avif'), ogAvif);
  
  console.log(`og-image.png  ${fmt(ogImg.length, ogPng.length)}`);
  console.log(`og-image.webp ${fmt(ogImg.length, ogWebp.length)}`);
  console.log(`og-image.avif ${fmt(ogImg.length, ogAvif.length)}`);

  // 2. Favicons: Generate from logo.svg
  const logoSvg = fs.readFileSync('logo.svg');
  // Copy logo.svg for browsers that support SVG favicons
  fs.writeFileSync(path.join(DIST, 'logo.svg'), logoSvg);
  console.log('logo.svg       copied to docs/');

  for (const size of [16, 32, 180, 192, 512]) {
    let name;
    if (size <= 32) name = `favicon-${size}x${size}.png`;
    else if (size === 180) name = 'apple-touch-icon.png';
    else name = `icon-${size}.png`;

    const buf = await sharp(logoSvg).resize(size, size).png().toBuffer();
    fs.writeFileSync(path.join(DIST, name), buf);
    console.log(`${name.padEnd(20)} generated from logo.svg`);
  }

  console.log('\nBuild complete → docs/');
}

build().catch(err => { console.error(err); process.exit(1); });
