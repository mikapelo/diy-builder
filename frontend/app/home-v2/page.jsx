/**
 * app/home-v2/page.jsx
 * ─────────────────────────────────────────────────────────────
 * STAGING / A-B testing route.
 * Rend exactement la même structure que la home prod (app/page.jsx),
 * en utilisant le composant partagé HomeSeoBand.
 *
 * robots: noindex,nofollow — staging, pas dans le sitemap.
 * ─────────────────────────────────────────────────────────────
 */

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomeSeoBand from '@/components/landing/HomeSeoBand';
import HeroSection from '@/components/features/shared/HeroSection';

export const metadata = {
  title: 'Calculateur bois gratuit : terrasse, cabanon, pergola, clôture',
  description:
    'Simulateur gratuit de matériaux bois — terrasse, cabanon, pergola, clôture. Calcul DTU, plan 3D, devis PDF et comparatif de prix entre 4 enseignes.',
  alternates: { canonical: 'https://www.diy-builder.fr/home-v2' },
  robots: { index: false, follow: false },
};

export default function HomeV2Page() {
  return (
    <>
      <Header view="home" />

      <main>
        {/* HomeSeoBand injecté via slot splitContent entre le hero et les bento/stats. */}
        <HeroSection splitContent={<HomeSeoBand />} />
      </main>

      <Footer />
    </>
  );
}
