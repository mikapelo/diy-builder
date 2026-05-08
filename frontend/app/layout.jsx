import '../styles/globals.css';
import Script from 'next/script';
import { Manrope, Inter, DM_Serif_Display, IBM_Plex_Mono } from 'next/font/google';
import CookieConsent from '@/components/ui/CookieConsent';

// next/font/google — self-hosted, zéro CLS, pas de render-blocking (audit perf)
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-dm-serif',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-mono',
});

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
  alternates: { canonical: 'https://diy-builder.fr' },
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
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      style={{ colorScheme: 'light' }}
      className={`${manrope.variable} ${inter.variable} ${dmSerif.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Material Symbols : conservé via Google Fonts (next/font ne gère pas les variable-axis icon fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        {/* Phosphor Icons — servis localement via styles/phosphor.css */}

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>

      <body>
        {/* Skip link WCAG SC 2.4.1 (audit a11y) — cible le wrapper #main-content */}
        <a href="#main-content" className="skip-link">Aller au contenu principal</a>
        <div id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
          {children}
        </div>

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

        {/*
          Meta Pixel — retargeting & audiences publicitaires
          - Chargé uniquement après consentement explicite (RGPD)
          - Bannière de consentement gérée par CookieConsent.jsx
          - Activé uniquement si NEXT_PUBLIC_META_PIXEL_ID est défini
        */}
        {META_PIXEL_ID && <CookieConsent />}
      </body>
    </html>
  );
}
