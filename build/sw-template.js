// Passer service worker. Generated at build time from build/sw-template.js.
// Everything the app needs is precached on install; afterwards it runs without network.
// A new version installs in the background and waits until the page asks it to take over.
const VERSION = '__VERSION__';
const CACHE = 'passer-' + VERSION;
const PRECACHE = __PRECACHE__;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('passer-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/version.txt') return;

  if (req.mode === 'navigate') {
    // /qr, /qr/ and /qr/index.html all open the tool page; unknown paths open the index.
    let path = url.pathname.replace(/index\.html$/, '');
    if (!path.endsWith('/')) path += '/';
    event.respondWith(
      caches.open(CACHE).then(async (cache) => (await cache.match(path)) || (await cache.match('/')) || fetch(req)),
    );
    return;
  }

  event.respondWith(caches.match(url.pathname).then((hit) => hit || fetch(req)));
});
