export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/bardage'],
      },
    ],
    sitemap: 'https://diy-builder.fr/sitemap.xml',
  };
}
