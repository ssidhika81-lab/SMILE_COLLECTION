const CACHE_NAME = "smile-collection-v1";
const APP_SHELL = [
  "/SMILE_COLLECTION/",
  "/SMILE_COLLECTION/index.html",
  "/SMILE_COLLECTION/manifest.webmanifest",
  "/SMILE_COLLECTION/icons/icon-192.png",
  "/SMILE_COLLECTION/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith(self.location.origin)) cache.put(event.request, copy);
        });
        return response;
      }).catch(() => caches.match("/SMILE_COLLECTION/index.html"));
    })
  );
});
