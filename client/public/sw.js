const CACHE_NAME = 'shopping-list-v2'; // Updated to clear old cache

// Install event - activate immediately, don't wait
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Bypass waiting phase
});

// Fetch event - Network First (always try fresh, cache for offline)
self.addEventListener('fetch', (event) => {
    // Don't cache service worker itself
    if (event.request.url.includes('/sw.js')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Network succeeded - cache for offline use
                if (response.status === 200 && event.request.method === 'GET') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network failed - try cache (offline fallback)
                return caches.match(event.request);
            })
    );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Delete all old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all pages immediately (no refresh needed!)
            self.clients.claim()
        ])
    );
});
