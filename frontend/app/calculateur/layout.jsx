const OG_TITLE = 'Simulateur terrasse bois';
const OG_SUBTITLE = 'Calcul lambourdes, plots, lames + plan 3D';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=terrasse`;

export const metadata = {
  title: 'Simulateur terrasse bois : calcul lambourdes, plots, lames + 3D',
  description: 'Calculez gratuitement lames, lambourdes et plots béton pour votre terrasse bois (4×3, 6×4, 8×5 m). Entraxes DTU 51.4, plan 3D, devis comparé Castorama / Brico Dépôt / ManoMano.',
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
