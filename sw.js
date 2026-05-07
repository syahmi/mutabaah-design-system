const CACHE_PREFIX = 'mutabaah-ds';
const CACHE_NAME = "${CACHE_PREFIX}-v1"; // Increment version on breaking structural changes
const ASSETS = [
  './',
  './index.html',
  './styles.css', // Should be injected as part of build if possible, or loaded as generic static
  './logo.svg'
];

// Install: Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: Cleanup old caches by checking prefix
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for dynamic content, Cache-first for hashed static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Hashed assets (js) - Cache-first, immutable
  if (url.pathname.endsWith('.js') && url.pathname.includes('.')) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
    return;
  }

  // Everything else - Network-first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
