/**
 * /robots.txt — App Router (Next.js 14)
 *
 * Règles :
 *   - Disallow /api/ : route handler /api/go est un redirecteur 301 vers
 *     les enseignes ; le crawl polluait GSC (« Page avec redirection »).
 *   - /bardage retiré du Disallow le 2026-05-29 : la page est désormais
 *     un redirect 308 permanent vers / (next.config.js), Google doit
 *     pouvoir le crawler pour dé-indexer proprement.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://www.diy-builder.fr/sitemap.xml',
  };
}
