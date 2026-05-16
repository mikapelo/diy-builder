const OG_TITLE = 'Couler une dalle béton extérieure';
const OG_SUBTITLE = 'Guide DTU 13.3 illustré';
const OG_URL = `https://diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=dalle`;

export const metadata = {
  title: 'Couler une dalle béton extérieure : guide DTU 13.3 illustré (2026)',
  description:
    '6 étapes illustrées pour couler une dalle béton conforme DTU 13.3 — terrassement, forme drainante, treillis ST25, coulage, joints. Calculateur de matériaux gratuit inclus.',
  alternates: { canonical: 'https://diy-builder.fr/dalle' },
  openGraph: {
    title: 'Tutoriel dalle béton DTU 13.3 — DIY Builder',
    description:
      '6 étapes illustrées + calculateur béton/treillis/sacs gratuit.',
    url: 'https://diy-builder.fr/dalle',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Guide dalle béton DTU 13.3 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

export default function DalleLayout({ children }) {
  return children;
}
