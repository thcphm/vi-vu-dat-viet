'use strict';
const CACHE = 'vi-vu-3219f6baed59';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('vi-vu-') && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/api/')) return;
  // Media seeks ask for byte ranges, which the Cache API cannot store.
  if (request.headers.has('range')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const keep = response => {
      if (response.status === 200 && response.type === 'basic') cache.put(request, response.clone()).catch(() => {});
      return response;
    };
    if (request.mode === 'navigate' || request.destination === 'document') {
      try { return keep(await fetch(request)); }
      catch (error) { return (await cache.match(request)) || Promise.reject(error); }
    }
    return (await cache.match(request)) || keep(await fetch(request));
  })());
});
