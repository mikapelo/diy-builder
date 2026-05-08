export default function sitemap() {
  const baseUrl = 'https://diy-builder.fr';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/calculateur`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/cabanon`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/pergola`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/cloture`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/dalle`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Guides SEO
    { url: `${baseUrl}/guides`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/terrasse`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/cabanon`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/pergola`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/cloture`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    // FAQ
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Pages légales
    { url: `${baseUrl}/mentions-legales`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/politique-confidentialite`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/cgv`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: 'yearly', priority: 0.1 },
  ];
}
