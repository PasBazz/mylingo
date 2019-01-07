// workbox.precaching.suppressWarnings();
workbox.skipWaiting();
workbox.clientsClaim();
workbox.routing.registerNavigationRoute('/index.html');

workbox.precaching.precacheAndRoute(
  self.__precacheManifest.concat([
    'https://fonts.googleapis.com/css?family=Source+Serif+Pro:400,700',
    'https://unpkg.com/react@16.4.0/umd/react.production.min.js',
    'https://unpkg.com/react-dom@16.4.0/umd/react-dom.production.min.js',
    'https://unpkg.com/react-router-dom@4.3.1/umd/react-router-dom.min.js',
  ])
);
