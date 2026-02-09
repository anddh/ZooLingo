const CACHE_NAME = 'root-roar-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon.png', './icon_splash.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
