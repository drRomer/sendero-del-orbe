// Service worker de Sendero del Orbe: juego disponible sin conexión.
// HTML y config: red primero (siempre la última versión si hay señal). Resto: caché primero.
const VERSION = '20261115-81494d';
const CACHE = 'sdo-' + VERSION;
const PRECACHE = ["./", "index.html", "config.js", "web.js?v=20261115-81494d", "cloud.js?v=20261115-81494d", "manifest.webmanifest", "fonts/press-start-2p.woff2", "fonts/vt323.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/favicon-64.png", "privacidad.html"];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('sdo-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromNet(req, key) {
  return fetch(req).then((res) => {
    if (res && res.ok && res.type === 'basic') {
      const cp = res.clone();
      caches.open(CACHE).then((c) => c.put(key || req, cp));
    }
    return res;
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Google/Firebase: directo a la red

  if (req.mode === 'navigate') {
    const key = url.origin + url.pathname;
    const fallback = () => caches.match(key).then((m) => m || caches.match(self.registration.scope));
    const net = fromNet(req, key);
    e.waitUntil(net.catch(() => {}));
    e.respondWith(new Promise((resolve) => {
      let done = false;
      const finish = (r) => { if (!done && r) { done = true; resolve(r); } };
      // Con señal lenta, a los 3,5 s se muestra la copia guardada mientras llega la nueva.
      const t = setTimeout(() => fallback().then(finish), 3500);
      net.then((r) => { clearTimeout(t); finish(r); })
        .catch(() => { clearTimeout(t); fallback().then((m) => finish(m || Response.error())); });
    }));
    return;
  }

  if (url.pathname.endsWith('/config.js')) {
    e.respondWith(fromNet(req).catch(() => caches.match(req)));
    return;
  }

  e.respondWith(caches.match(req).then((m) => m || fromNet(req)));
});
