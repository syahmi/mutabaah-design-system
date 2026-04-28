const fs = require('fs');
const path = require('path');

// Read version from package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const VERSION = pkg.version;
const DATE = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

console.log(`Syncing version ${VERSION}...`);

// 1. Update script.js
let script = fs.readFileSync('script.js', 'utf8');
script = script.replace(/const VERSION = '[^']*'/, `const VERSION = '${VERSION}'`);
script = script.replace(/const DATE = '[^']*'/, `const DATE = '${DATE}'`);
fs.writeFileSync('script.js', script);

// 2. Update sw.js
let sw = fs.readFileSync('sw.js', 'utf8');
sw = sw.replace(/CACHE_NAME = 'mutabaah-design-system-v[^']*'/, `CACHE_NAME = 'mutabaah-design-system-v${VERSION}'`);
fs.writeFileSync('sw.js', sw);

// 3. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/data-version="short">[^<]+</, `data-version="short">${VERSION}<`)
           .replace(/data-version="full">[^<]+</, `data-version="full">Design System v${VERSION} · ${DATE}<`)
           .replace(/data-date="[^"]*">[^<]+</, `data-date="${DATE}">${DATE}<`);
fs.writeFileSync('index.html', html);

console.log('✅ All files synchronized.');
