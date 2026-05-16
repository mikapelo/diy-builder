export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/bardage'],
      },
    ],
    sitemap: 'https://www.diy-builder.fr/sitemap.xml',
  };
}
