const CACHE_NAME = 'suivi-fit-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // Assurez-vous d'avoir ce fichier
  '/app.js',
  '/images/icon-192x192.png', // Ajoutez vos icônes et autres ressources
  '/images/icon-512x512.png'
];

// Installation du Service Worker et mise en cache des ressources initiales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Stratégie de cache : Cache d'abord, puis réseau (Cache First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Pas dans le cache, requête réseau
        return fetch(event.request).then(
          networkResponse => {
            // Optionnel: Mettre en cache la nouvelle ressource
            // if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            //   return networkResponse;
            // }
            // const responseToCache = networkResponse.clone();
            // caches.open(CACHE_NAME)
            //   .then(cache => {
            //     cache.put(event.request, responseToCache);
            //   });
            return networkResponse;
          }
        );
      })
  );
});

// Optionnel: Mettre à jour le cache lorsque le Service Worker est activé
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Garder uniquement le cache actuel
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Supprimer les anciens caches
          }
        })
      );
    })
  );
});