/* Kartenreich Service Worker – bei jeder Änderung CACHE erhöhen */
const CACHE = "kartenreich-v14";
const CORE = ["./", "index.html", "app.min.css?v=14", "app.min.js?v=14", "manifest.webmanifest",
  "fonts/Lora-Variable.woff", "fonts/Lora-Italic-Variable.woff", "img/logo.webp",
  "img/hero-g0.webp", "img/hero-g21.webp", "img/hero-back.webp", "icons/icon-192.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  /* Bilder und Schriften: zuerst aus dem Speicher (schnell), sonst laden und merken */
  if (/\.(webp|jpg|png|woff2?|pdf)$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    })));
    return;
  }
  /* Seite, CSS, JS: zuerst aktuell aus dem Netz, offline aus dem Speicher */
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match("index.html")))
  );
});
