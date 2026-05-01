import '../styles/globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'DIY Builder — Calculateur de projets bricolage bois',
  description: 'Calculez gratuitement les matériaux et le coût de votre terrasse bois, cabanon, pergola ou clôture. Visualisation 3D et comparatif enseignes inclus.',
  metadataBase: new URL('https://diy-builder.fr'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DIY Builder',
  },
  openGraph: {
    title: 'DIY Builder — Calculateur bricolage bois gratuit',
    description: 'Terrasse, cabanon, pergola, clôture : calculez vos matériaux en 30 secondes et comparez les prix Castorama, Brico Dépôt, ManoMano.',
    url: 'https://diy-builder.fr',
    siteName: 'DIY Builder',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'DIY Builder — Calculateur bricolage bois' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIY Builder — Calculateur bricolage bois gratuit',
    description: 'Terrasse, cabanon, pergola, clôture : calculez vos matériaux en 30 secondes.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export const viewport = {
  themeColor: '#111214',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="fr" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        {/* Phosphor Icons — CDN, duotone + bold + fill */}
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>

      <body>
        {children}

        {/*
          Umami Analytics — privacy-first, CNIL-exempt
          - Aucun cookie déposé → pas de bannière de consentement requise
          - IP anonymisée, aucune donnée personnelle transmise
          - Activé uniquement si NEXT_PUBLIC_UMAMI_WEBSITE_ID est défini
        */}
        {UMAMI_WEBSITE_ID && (
          <Script
            defer
            data-website-id={UMAMI_WEBSITE_ID}
            src="https://cloud.umami.is/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
