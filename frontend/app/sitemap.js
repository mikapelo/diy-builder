export default function sitemap() {
  const baseUrl = 'https://www.diy-builder.fr';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/calculateur`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/cabanon`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/pergola`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/cloture`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/guides/dalle`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Guides SEO
    { url: `${baseUrl}/guides`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/terrasse`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/cabanon`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/pergola`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/cloture`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/soi-meme-ou-pro`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/prix-terrasse-bois-m2-2026`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Note : pages /liste avec query strings retirées du sitemap.
    // XML sitemap n'accepte pas les `&` non-encodés (erreur d'analyse
    // syntaxique Search Console) et les query strings ne sont pas des
    // URLs canoniques pour Google. Les variantes dimensionnelles sont
    // découvertes via maillage interne depuis les simulateurs.
    // FAQ
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Garde-fous E-E-A-T (transparence éditoriale et affiliation)
    { url: `${baseUrl}/methodologie`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sources`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/charte-affiliation`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    // Pages légales : retirées du sitemap car en noindex (cohérence du signal).
    // Restent accessibles via footer (follow=true) pour la conformité.
    // /mentions-legales, /politique-confidentialite, /cgv, /cookies — en noindex.
  ];
}
