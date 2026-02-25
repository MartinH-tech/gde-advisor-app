const CACHE_NAME = "gde-advisor-cache-v2";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then(response => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(() => cachedResponse)
      );
    })
  );
});