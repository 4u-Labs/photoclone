
// PhotoClone Pro Service Worker for PWA Offline Support

var cacheName = 'photoclone-v95:static';

var staticAssets = [
	'./',
	'./index.php',
	'./landing.php',
	'./tutorial.html',
	'./dist/bundle.js',
	'./images/favicon.png',
	'./images/logo.svg',
	'./images/logo-colors.png',
	'./manifest.json'
];

// Install phase - Graceful caching
self.addEventListener('install', function(e) {
	self.skipWaiting();
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return Promise.all(
				staticAssets.map(function(url) {
					return cache.add(url).catch(function(err) {
						// Ignore individual cache miss without breaking SW install
					});
				})
			);
		})
	);
});

// Activate phase - Delete old caches
self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					return caches.delete(key);
				}
			}));
		}).then(function() {
			return self.clients.claim();
		})
	);
});

// Fetch phase - Network First with Cache Fallback for bundle.js and HTML
self.addEventListener('fetch', function(event) {
	// Only handle http/https requests
	if (!event.request.url.startsWith('http')) {
		return;
	}

	// Skip AI and payment APIs
	if (event.request.url.includes('api_') || event.request.url.includes('replicate') || event.request.url.includes('mercadopago')) {
		return;
	}

	event.respondWith(
		fetch(event.request).then(function(networkResponse) {
			if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
				var responseToCache = networkResponse.clone();
				caches.open(cacheName).then(function(cache) {
					cache.put(event.request, responseToCache);
				});
			}
			return networkResponse;
		}).catch(function() {
			return caches.match(event.request);
		})
	);
});
