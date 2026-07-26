const CACHE_NAME = 'pyhub-v1';

// Use relative paths — works in any subfolder on GitHub Pages
const CORE_FILES = [
  'python-hub.html',
  'manifest.json',
  'python-basics-tutorial.html',
  'python-intermediate-tutorial.html',
  'python-advanced-tutorial.html',
  'python-aiml-tutorial.html',
  'python-automation-tutorial.html',
  'python-web-tutorial.html',
  'python-aws-tutorial.html',
  'python-devops-toolkit.html',
  'python-linux-bash.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('python-hub.html'));
    })
  );
});
