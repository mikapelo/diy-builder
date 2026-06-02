const OG_TITLE = 'Simulateur clôture bois';
const OG_SUBTITLE = 'Poteaux classe 4 + lames';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=cloture`;

export const metadata = {
  title: 'Simulateur clôture bois gratuit — devis 3D dès 26 €/ml',
  description: 'Poteaux classe 4, rails et lames pour clôture 10 à 20 ml. Plan 3D interactif, conforme DTU 31.1, comparatif 4 enseignes. Budget dès 26 €/ml en pin traité.',
  alternates: { canonical: 'https://www.diy-builder.fr/cloture' },
  openGraph: {
    title: 'Simulateur clôture bois gratuit — DIY Builder',
    description: 'Poteaux, rails, lames classe 4 : devis matériaux au mètre linéaire + comparatif prix enseignes.',
    url: 'https://www.diy-builder.fr/cloture',
    type: 'website',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Simulateur clôture bois — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

export default function ClotureLayout({ children }) {
  return children;
}
