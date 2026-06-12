/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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

// ── Content-Security-Policy
// Mode Report-Only conservé : la migration enforce nécessite l'introduction de
// nonces via middleware (audit M3 — différé). Les directives ci-dessous sont
// néanmoins exhaustives et incluent les origines tierces utilisées en runtime :
// - drei `<Environment>` : HDR depuis market-assets.fra1.cdn.digitaloceanspaces.com
// - Google Fonts (style + font)
// - Umami analytics, Meta Pixel (si NEXT_PUBLIC_META_PIXEL_ID actif)
const DREI_HDR_CDN = 'https://market-assets.fra1.cdn.digitaloceanspaces.com';
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is https://umami-three-rose-32.vercel.app https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: blob: ${DREI_HDR_CDN} https://www.facebook.com https://*.fbcdn.net`,
  `connect-src 'self' ${DREI_HDR_CDN} https://cloud.umami.is https://umami-three-rose-32.vercel.app https://api.umami.is https://*.facebook.com`,
  "frame-ancestors 'none'",
  "frame-src 'self' https://www.facebook.com",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  async redirects() {
    return [
      // Migration /dalle → /guides/dalle (cohérence cluster guides, 2026-05-24)
      { source: '/dalle', destination: '/guides/dalle', permanent: true },
      // Module bardage retiré du périmètre — 308 permanent vers home plutôt que
      // 307 + robots Disallow (qui empêche Google de re-crawler et bloque la
      // dé-indexation). GSC 2026-05-29 : « Page avec redirection ».
      { source: '/bardage', destination: '/', permanent: true },
    ];
  },

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
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy',          value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy',        value: 'same-site' },
          { key: 'Content-Security-Policy-Report-Only', value: CSP_DIRECTIVES },
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

module.exports = withBundleAnalyzer(withPWA(nextConfig));
