const CACHE_NAME = 'fanta-adiacent-v1.4.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Install Service Worker
self.addEventListener('install', (e) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  // Claim any clients immediately so we don't need a reload
  e.waitUntil(self.clients.claim());
  
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Rimozione vecchio cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch Interception
self.addEventListener('fetch', (e) => {
  // Only intercept HTTP/S requests, bypass chrome-extension or other schemes
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request).then((response) => {
      // Se la richiesta ha successo, la salviamo in cache per l'uso offline
      if (e.request.method === 'GET' && response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // Fallback alla cache se si è offline
      return caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Se naviga su una pagina non in cache e offline, diamo la index.html
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
