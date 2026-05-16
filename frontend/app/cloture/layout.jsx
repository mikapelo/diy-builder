const OG_TITLE = 'Simulateur clôture bois';
const OG_SUBTITLE = 'Poteaux classe 4 + lames';
const OG_URL = `https://diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=cloture`;

export const metadata = {
  title: 'Simulateur clôture bois : calcul poteaux, rails, lames au mètre linéaire',
  description: 'Calculez gratuitement poteaux, rails et lames de votre clôture bois (10, 15, 20 ml — hauteur 1,20 à 1,80 m). Classes d\'emploi, entraxes, devis comparé Castorama / Brico Dépôt / Leroy Merlin.',
  alternates: { canonical: 'https://diy-builder.fr/cloture' },
  openGraph: {
    title: 'Simulateur clôture bois gratuit — DIY Builder',
    description: 'Poteaux, rails, lames classe 4 : devis matériaux au mètre linéaire + comparatif prix enseignes.',
    url: 'https://diy-builder.fr/cloture',
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
