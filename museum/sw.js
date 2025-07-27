const CACHE_NAME = 'my-app-cache-v1';
const ASSETS = [
  '/',            
  '/index.js',     
  '/styles.css',   
  

];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.error('Ошибка кеширования:', err))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});