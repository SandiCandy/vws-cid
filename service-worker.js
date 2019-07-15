importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

// Use a cacheName for cache versioning
//var cacheName = 'v1:static';

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp(".*.js"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: "css-cache"
  })
);

workbox.routing.registerRoute(
  // Cache image files.
  new RegExp("https ?: //.*.(?:png|jpg|jpeg|svg|gif)"),
  // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: "image-cache",
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 50 images.
        maxEntries: 50,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp(".+/public/api/.+"),
  new workbox.strategies.StaleWhileRevalidate({
    plugins: [
      new workbox.broadcastUpdate.Plugin({
        channelName: "api-updates"
      })
    ]
  })
);

// Besser wäre es, wenn auch für diese Route StaleWhileRevalidate()
// genutzt wurde und die aktuellen Daten aus dem Cache geholt werden
workbox.routing.registerRoute(
  new RegExp(".+/public/api/auth/group/[0-9]*/tasks.+"),
  new workbox.strategies.NetworkFirst()
);

workbox.precaching.precacheAndRoute([
  { url: "/index.html", revision: "abcd1234" }
  // ... other entries ...
]);
