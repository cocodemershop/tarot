/* Kartenreich Service Worker – schnell + offline-fähig.
   Bei Updates nur VERSION hochzählen. */
const VERSION = "kr-v1";
const SHELL = "shell-" + VERSION, RUNTIME = "runtime-" + VERSION;
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const put = (cache, req, res) => { if (res && res.ok && res.type === "basic") cache.put(req, res.clone()); return res; };

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;

  // Seiten: Netzwerk zuerst (immer aktuell), bei Offline aus dem Cache
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => { const c = res.clone(); if (res.ok) caches.open(SHELL).then(ca => ca.put(req, c)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }

  // Bilder, Icons, PDF: Cache zuerst, im Hintergrund aktualisieren
  e.respondWith(caches.open(RUNTIME).then(cache => cache.match(req).then(hit => {
    const net = fetch(req).then(res => put(cache, req, res)).catch(() => hit);
    return hit || net;
  })));
});
