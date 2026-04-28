/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',

  // SW désactivé en dev pour éviter les conflits HMR
  disable: process.env.NODE_ENV === 'development',

  register: true,
  skipWaiting: true,

  // Fallback hors-ligne
  fallbacks: {
    document: '/offline',
  },

  // Ne pas mettre en cache les routes API (prix live, leads, etc.)
  buildExcludes: [/middleware-manifest\.json$/],

  runtimeCaching: [
    // ── API routes → toujours réseau (jamais de cache stale)
    {
      urlPattern: /\/api\//,
      handler: 'NetworkOnly',
      options: {
        // options:{} requis par next-pwa@5.6 quand fallbacks est défini :
        // index.js:314 itère sur c.options.precacheFallback sans guard
        cacheName: 'api-no-cache',
      },
    },

    // ── Google Fonts → CacheFirst longue durée
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ── Phosphor Icons (unpkg CDN) → CacheFirst
    {
      urlPattern: /^https:\/\/unpkg\.com\/@phosphor-icons/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'phosphor-icons',
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ── Images statiques → CacheFirst
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ── Pages de l'app → NetworkFirst (fraîcheur prioritaire, fallback cache)
    {
      urlPattern: /^https:\/\/diy-builder\.fr\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-pages',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control',     value: 'on' },
        ],
      },
      // Headers SW — permet l'installation PWA
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
