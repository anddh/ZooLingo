const CACHE_NAME = 'quinn-app-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Install Service Worker & Cache the "Shell"
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Resources
// This uses a "Cache First, falling back to Network" strategy.
// As Quinn views animals, they get added to the cache automatically.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // If found in cache, return it
      if (response) return response;

      // If not, fetch from network
      return fetch(e.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !e.request.url.startsWith('http')) {
          return networkResponse;
        }

        // Clone the response (streams can only be consumed once)
        const responseToCache = networkResponse.clone();

        // Save this new animal/sound to cache for next time
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
