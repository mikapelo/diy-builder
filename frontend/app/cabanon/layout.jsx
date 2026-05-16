const OG_TITLE = 'Simulateur cabanon ossature bois';
const OG_SUBTITLE = 'Calcul DTU 31.2 + plan 3D';
const OG_URL = `https://diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=cabanon`;

export const metadata = {
  title: 'Simulateur cabanon ossature bois : calcul matériaux DTU + plan 3D',
  description: "Calculez gratuitement les matériaux de votre cabanon ossature bois (3×2, 4×3, 5×4 m). Liste DTU 31.2, plan 3D interactif, devis comparé Castorama / Brico Dépôt / Leroy Merlin.",
  alternates: { canonical: 'https://diy-builder.fr/cabanon' },
  openGraph: {
    title: 'Simulateur cabanon ossature bois gratuit — DIY Builder',
    description: 'Devis matériaux DTU 31.2, plan 3D interactif, comparatif prix Castorama / Brico Dépôt / Leroy Merlin.',
    url: 'https://diy-builder.fr/cabanon',
    type: 'website',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Simulateur cabanon ossature bois — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

export default function CabanonLayout({ children }) {
  return children;
}
