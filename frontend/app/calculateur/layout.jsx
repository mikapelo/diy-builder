const OG_TITLE = 'Simulateur terrasse bois';
const OG_SUBTITLE = 'Calcul lambourdes, plots, lames + plan 3D';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=terrasse`;

export const metadata = {
  title: 'Calculateur terrasse bois gratuit — devis matériaux en 30 s',
  description: 'Lames, lambourdes et plots béton pour votre terrasse 4×3, 6×4 ou 8×5 m. Entraxes DTU 51.4, plan 3D, comparatif prix Leroy Merlin / Castorama / Brico Dépôt. Total ~540 € pour 12 m² en pin classe 4.',
  alternates: { canonical: 'https://www.diy-builder.fr/calculateur' },
  openGraph: {
    title: 'Simulateur terrasse bois gratuit — DIY Builder',
    description: 'Plots, lambourdes, lames : devis DTU 51.4 + plan 3D + comparatif prix enseignes.',
    url: 'https://www.diy-builder.fr/calculateur',
    type: 'website',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Simulateur terrasse bois — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

export default function CalculateurLayout({ children }) {
  return children;
}
