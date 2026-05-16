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
    // Pages BOM partageables — indexées avec les dimensions types
    { url: `${baseUrl}/liste?project=terrasse&w=4&d=3`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/liste?project=terrasse&w=6&d=4`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/liste?project=cabanon&w=3&d=4`,  lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/liste?project=cabanon&w=4&d=5`,  lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/liste?project=pergola&w=4&d=3`,  lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/liste?project=cloture&w=15&d=1.5`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // FAQ
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Garde-fous E-E-A-T (transparence éditoriale et affiliation)
    { url: `${baseUrl}/methodologie`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sources`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/charte-affiliation`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    // Pages légales
    { url: `${baseUrl}/mentions-legales`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/politique-confidentialite`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/cgv`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: 'yearly', priority: 0.1 },
  ];
}
