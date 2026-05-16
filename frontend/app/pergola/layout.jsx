const OG_TITLE = 'Simulateur pergola bois';
const OG_SUBTITLE = 'Poteaux 90×90, longerons, chevrons';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=simulateur&icon=pergola`;

export const metadata = {
  title: 'Simulateur pergola bois : calcul poteaux, longerons, chevrons + 3D',
  description: 'Calculez gratuitement poteaux, longerons et chevrons de votre pergola bois (3×3, 4×3, 4×4 m). Sections selon portée, ancrage, plan 3D, comparatif prix enseignes.',
  alternates: { canonical: 'https://www.diy-builder.fr/pergola' },
  openGraph: {
    title: 'Simulateur pergola bois gratuit — DIY Builder',
    description: 'Poteaux 90×90, longerons, chevrons : devis matériaux + plan 3D + comparatif prix.',
    url: 'https://www.diy-builder.fr/pergola',
    type: 'website',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Simulateur pergola bois — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

export default function PergolaLayout({ children }) {
  return children;
}
