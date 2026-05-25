const OG_TITLE = 'Simulateur cabanon ossature bois';
const OG_SUBTITLE = 'Calcul DTU 31.2 + plan 3D';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=cabanon`;

export const metadata = {
  title: 'Calculateur cabanon ossature bois — devis DTU 31.2 en 30 s',
  description: "Montants, lisses, chevrons et bardage pour votre cabanon 3×2, 4×3 ou 5×4 m. Conforme DTU 31.2, plan 3D interactif, comparatif prix Leroy Merlin / Castorama / Brico Dépôt. Budget ~1 400 € pour 4 m² en pin classe 4.",
  alternates: { canonical: 'https://www.diy-builder.fr/cabanon' },
  openGraph: {
    title: 'Simulateur cabanon ossature bois gratuit — DIY Builder',
    description: 'Devis matériaux DTU 31.2, plan 3D interactif, comparatif prix Castorama / Brico Dépôt / Leroy Merlin.',
    url: 'https://www.diy-builder.fr/cabanon',
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
