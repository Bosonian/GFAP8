/* Scope-aware, cache-first SW suitable for GitHub Pages subpaths */
base('/assets/js/app.js'),
base('/assets/js/components/progressIndicator.js'),
base('/assets/js/screens/triage1.js'),
base('/assets/js/screens/triage2.js'),
base('/assets/js/screens/comaModule.js'),
base('/assets/js/screens/limitedStroke.js'),
base('/assets/js/screens/fullStroke.js'),
base('/assets/js/screens/results.js'),
base('/assets/js/utils/validation.js'),
base('/assets/js/models/calculations.js')
];


self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(VERSION).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
);
});


self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) => Promise.all(keys.map((k) => (k === VERSION ? null : caches.delete(k))))).then(() => self.clients.claim())
);
});


self.addEventListener('fetch', (event) => {
const { request } = event;
if (request.method !== 'GET') return; // passthrough for non-GET


event.respondWith(
caches.match(request).then((cached) => {
if (cached) return cached;
return fetch(request)
.then((resp) => {
const copy = resp.clone();
caches.open(VERSION).then((cache) => cache.put(request, copy));
return resp;
})
.catch(() => caches.match(base('/index.html')));
})
);
});