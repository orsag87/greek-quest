/* Service worker — network-first so the learner always gets the latest lessons,
   with an offline cache fallback. Bump CACHE on each release.
   Greek Quest shares an origin with Spanish and Czech Quest on GitHub Pages
   (orsag87.github.io), and Cache Storage is per-origin — so only ever delete OUR OWN old
   caches (prefix match), never "everything that isn't CACHE", or we'd wipe theirs. */
const PREFIX = "greek-quest-";
const CACHE = PREFIX + "v4";
/* Keep the ?v= in step with the <script> tags in index.html. */
const ASSETS = ["./", "./index.html", "./greek.js?v=4", "./app.js?v=4", "./content.js?v=4", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); } return res; })
      .catch(() => caches.match(e.request)
        .then(r => r || caches.match("./index.html"))
        /* Never resolve to undefined: offline with an empty cache (Czech Quest's service
           worker can wipe ours — same origin) would otherwise show a browser error page. */
        .then(r => r || new Response(
          "<!doctype html><meta charset=utf-8><title>Offline</title><body style=\"font-family:system-ui;padding:2.5rem;text-align:center;background:#FBF6EE;color:#221E1C\"><h1>Εκτός σύνδεσης · Offline</h1><p>Open Greek Quest once while you have signal — after that it works offline.</p>",
          { headers: { "Content-Type": "text/html; charset=utf-8" } })))
  );
});
