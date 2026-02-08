const CACHE_NAME = 'root-roar-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './icon_splash.png',
  'https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap'
];

// Install Service Worker and cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Network-first strategy for emoji images, Cache-first for local assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Optionally cache emojis as they are fetched to enable full offline play later
        if (event.request.url.includes('gstatic.com') || event.request.url.includes('googleusercontent')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    })
  );
});
