/**
 * app/page.jsx
 * ─────────────────────────────────────────────────────────────
 * Point d'entrée de la route "/" — App Router Next.js.
 *
 * Server component : pré-rend en SSR/SSG le bandeau SEO indexable
 * (H1, lead, 4 cards piliers, E-E-A-T, guides, FAQ). HeroSection
 * (visuel riche) est chargée côté client après hydratation.
 *
 * Le metadata enrichi (title, description, openGraph) prime sur
 * celui du root layout (app/layout.jsx).
 * ─────────────────────────────────────────────────────────────
 */

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomeSeoBand from '@/components/landing/HomeSeoBand';
import HeroSection from '@/components/features/shared/HeroSection';

const OG_TITLE = 'Calculer ses matériaux DIY bois';
const OG_SUBTITLE = '4 simulateurs gratuits — Terrasse, cabanon, pergola, clôture';
const OG_URL = `https://diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=landing`;

export const metadata = {
  title: 'Calculateur DIY bois gratuit : terrasse, cabanon, pergola, clôture | DIY Builder',
  description:
    'Simulateur gratuit de matériaux bois : terrasse, cabanon ossature, pergola, clôture. Calcul DTU, plan 3D, devis PDF, comparatif Castorama / Brico Dépôt / Leroy Merlin / ManoMano.',
  alternates: { canonical: 'https://diy-builder.fr' },
  openGraph: {
    title: 'Calculateur DIY bois gratuit : terrasse, cabanon, pergola, clôture',
    description:
      'Simulateur gratuit de matériaux bois avec plan 3D interactif, devis PDF et comparatif de prix entre 4 enseignes.',
    url: 'https://diy-builder.fr',
    siteName: 'DIY Builder',
    type: 'website',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'DIY Builder — 4 simulateurs gratuits terrasse, cabanon, pergola, clôture' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen" data-theme="g-v2" data-page="landing">
      <Header view="home" />

      <main>
        {/*
          HeroSection rend la section #v6-hero ("Calculez précisément…"),
          puis injecte HomeSeoBand via le slot splitContent,
          puis enchaîne avec bento / stats / social proof.
          HomeSeoBand est un server component pré-rendu en SSR — indexable.
        */}
        <HeroSection splitContent={<HomeSeoBand />} />
      </main>

      <Footer />
    </div>
  );
}
