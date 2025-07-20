// Service Worker for Duel d'Arcane PWA
const CACHE_NAME = 'duel-arcane-v1';
const urlsToCache = [
    '/dual/',
    '/dual/index.html',
    '/dual/style.css',
    '/dual/game.js',
    '/dual/bluetooth.js',
    '/dual/app.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle any background synchronization tasks
    console.log('Background sync triggered');
    return Promise.resolve();
}

// Handle push notifications (for future features)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nouvelle partie disponible!',
        icon: '/dual/icon-192x192.png',
        badge: '/dual/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Rejoindre',
                icon: '/dual/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Fermer',
                icon: '/dual/icon-192x192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Duel d\'Arcane', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/dual/')
        );
    }
});