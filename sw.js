// JavaScript Document

const CACHE_NAME = 'beedle-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/gameData.js',
  '/bee.jpg',
  '/sound/correct.mp3',
  '/sound/incorrect.mp3',
  '/sound/flip.mp3',
  '/sound/letter_correct.mp3',
  '/sound/letter_present.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});