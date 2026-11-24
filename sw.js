// Última conexión · service worker. Cambia BUILD en cada versión publicada.
const BUILD = 16;
const CACHE = 'uc-build-' + BUILD;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './media/cena.jpg', './media/techo.jpg', './media/calle.jpg', './media/called.jpg', './media/mercado.jpg', './media/turia.jpg', './media/cafe.jpg', './media/lluvia.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('version.json')) { e.respondWith(fetch(e.request, {cache: 'no-store'}).catch(() => caches.match(e.request))); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return res;
  })));
});
