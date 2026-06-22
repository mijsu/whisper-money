const CACHE_NAME = 'whisper-money-v3'
const STATIC_CACHE = 'whisper-money-static-v1'
const ASSET_CACHE = 'whisper-money-assets-v1'

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon/favicon-96x96.png',
  '/favicon/favicon.svg',
  '/favicon/favicon.ico',
  '/favicon/apple-touch-icon.svg',
  '/favicon/apple-touch-icon.png',
  '/icons/whispermoney_icon_x192.png',
  '/icons/whispermoney_icon_x512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {}),
    ).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE && name !== ASSET_CACHE)
          .map((name) => caches.delete(name)),
      ),
    ).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match(request).then((cached) =>
            cached || caches.match('/offline') || new Response('Offline', { status: 503 }),
          ),
        ),
    )
    return
  }

  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.startsWith('/build/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((response) => {
          const clone = response.clone()
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone))
          return response
        }),
      ),
    )
    return
  }

  event.respondWith(fetch(request))
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const data = event.data.json()
    const options = {
      body: data.body || '',
      icon: data.icon || '/icons/whispermoney_icon_x192.png',
      badge: '/icons/whispermoney_icon_x72.png',
      tag: data.tag || 'default',
      data: data.url ? { url: data.url } : undefined,
      vibrate: [200, 100, 200],
    }
    event.waitUntil(
      self.registration.showNotification(data.title || 'Whisper Money', options),
    )
  } catch {
    const options = {
      body: event.data.text(),
      icon: '/icons/whispermoney_icon_x192.png',
      badge: '/icons/whispermoney_icon_x72.png',
    }
    event.waitUntil(
      self.registration.showNotification('Whisper Money', options),
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.notification.data?.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus()
          }
        }
        return clients.openWindow(event.notification.data.url)
      }),
    )
  }
})
