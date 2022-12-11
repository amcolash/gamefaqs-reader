// Establish a cache name
const cacheName = 'guide-cache';

self.addEventListener('fetch', (event) => {
  if (event.request.url.indexOf('@vite/client') !== -1 || event.request.url.indexOf('chrome-extension') !== -1) return;

  // Open the cache
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url)
        .then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());

          return fetchedResponse;
        })
        .catch(() => {
          // If the network is unavailable, get
          return cache.match(event.request.url);
        });
    })
  );
});
