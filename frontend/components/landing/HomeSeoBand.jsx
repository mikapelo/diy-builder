/**
 * components/landing/HomeSeoBand.jsx
 * ─────────────────────────────────────────────────────────────
 * Bandeau SEO indexable de la home — server component pur.
 * Rendu :
 *   - H1 + lead
 *   - 4 cards piliers (terrasse / cabanon / pergola / clôture)
 *   - Section "Pourquoi DIY Builder" (4 raisons E-E-A-T)
 *   - Section "Apprendre avant de calculer" (6 cards guides)
 *   - Extrait FAQ (4 questions condensées)
 *
 * JSON-LD WebSite + Organization + ItemList injecté en tête.
 *
 * Utilisé par app/page.jsx (home prod) et app/home-v2/page.jsx (staging).
 * ─────────────────────────────────────────────────────────────
 */

import Link from 'next/link';
import Image from 'next/image';

/* ── JSON-LD ── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://diy-builder.fr/#website',
      url: 'https://diy-builder.fr',
      name: 'DIY Builder',
      description:
        '4 simulateurs gratuits de matériaux bois : terrasse, cabanon, pergola, clôture. Calculs DTU, plan 3D, devis PDF.',
      publisher: { '@id': 'https://diy-builder.fr/#org' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://diy-builder.fr/#org',
      name: 'DIY Builder',
      url: 'https://diy-builder.fr',
      logo: {
        '@type': 'ImageObject',
        url: 'https://diy-builder.fr/logo-diy-builder.png',
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://diy-builder.fr/#simulateurs',
      name: 'Simulateurs DIY Builder',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Calculateur terrasse bois', url: 'https://diy-builder.fr/calculateur' },
        { '@type': 'ListItem', position: 2, name: 'Simulateur cabanon ossature bois', url: 'https://diy-builder.fr/cabanon' },
        { '@type': 'ListItem', position: 3, name: 'Simulateur pergola bois', url: 'https://diy-builder.fr/pergola' },
        { '@type': 'ListItem', position: 4, name: 'Simulateur clôture bois', url: 'https://diy-builder.fr/cloture' },
      ],
    },
  ],
};

/* ── Données des 4 projets ── */
const PROJECTS = [
  {
    id: 'terrasse',
    title: 'Terrasse bois',
    img: '/illustrations/hero/terrassehero.png',
    alt: 'Terrasse bois avec lambourdes et plots béton',
    desc: "Lames, lambourdes, plots béton : le calculateur applique l'entraxe DTU 51.4 (40-50 cm selon section), génère votre BOM exporté en PDF et compare les 4 enseignes principales. Pour une terrasse 4×3 m, comptez environ 360 € de matériaux en pin classe 4.",
    simHref: '/calculateur',
    guideHref: '/guides/terrasse',
  },
  {
    id: 'cabanon',
    title: 'Cabanon ossature bois',
    img: '/illustrations/hero/cabanonhero.png',
    alt: 'Cabanon ossature bois avec montants 45×90 mm',
    desc: "Montants 45×90 mm à entraxe 60 cm (DTU 31.2), coins en L, king studs, jack studs, cripple studs, chevrons mono-pente : le simulateur calcule l'ossature complète et le bardage. Budget typique : 600 à 3 000 € selon la surface.",
    simHref: '/cabanon',
    guideHref: '/guides/cabanon',
  },
  {
    id: 'pergola',
    title: 'Pergola bois',
    img: '/illustrations/hero/pergolahero.png',
    alt: 'Pergola bois avec poteaux 90×90 et chevrons',
    desc: "Poteaux 90×90 ou 100×100 mm selon la portée, longerons, chevrons à 40-60 cm d'entraxe (DTU 31.1) : l'outil génère la liste complète avec comparatif de prix. Comptez 250 à 1 200 € de matériaux pour une pergola 3×3 m.",
    simHref: '/pergola',
    guideHref: '/guides/pergola',
  },
  {
    id: 'cloture',
    title: 'Clôture bois',
    img: '/illustrations/hero/cloturehero.png',
    alt: 'Clôture bois avec poteaux classe 4 et lames',
    desc: "Poteaux classe 4 (NF EN 335), rails, lames et visserie inox : le simulateur calcule le détail pour n'importe quelle longueur avec un comparatif Castorama / Brico Dépôt / Leroy Merlin. Estimation 180 à 700 € pour 20 ml.",
    simHref: '/cloture',
    guideHref: '/guides/cloture',
  },
];

/* ── Données raisons E-E-A-T ── */
const REASONS = [
  {
    heading: 'Calculs basés sur les DTU, pas des estimations marketing',
    text: 'Chaque simulateur applique les règles DTU 31.1, 31.2, 51.4 et 13.3 : entraxes, sections, profondeurs hors-gel. Les formules sont documentées et vérifiables.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
      </svg>
    ),
  },
  {
    heading: 'Prix réels mis à jour régulièrement',
    text: 'Les prix Castorama, Leroy Merlin, Brico Dépôt et ManoMano sont vérifiés chaque semaine depuis les sites des enseignes. Pas de grille tarifaire figée à deux ans.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    heading: '100 % gratuit, financé par affiliation transparente',
    text: <>Les liens vers les enseignes utilisent des codes affiliés — c&apos;est ce qui finance le site. <Link href="/charte-affiliation">Lire la charte d&apos;affiliation</Link>.</>,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    heading: 'Aucun compte, aucun cookie de tracking',
    text: <>Pas de création de compte, pas de Google Analytics. La mesure d&apos;audience utilise Umami sans cookie. <Link href="/politique-confidentialite">Politique de confidentialité</Link>.</>,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
];

/* ── Données guides ── */
const GUIDES = [
  { href: '/guides',           name: 'Tous les guides', teaser: 'Index des guides pratiques par projet — terrasse, cabanon, pergola, clôture.' },
  { href: '/guides/terrasse',  name: 'Guide terrasse',  teaser: 'Essences, lambourdes, plots, DTU 51.4 : construire pas à pas.' },
  { href: '/guides/cabanon',   name: 'Guide cabanon',   teaser: 'Ossature bois, fondations, mono-pente : de la dalle au bardage.' },
  { href: '/guides/pergola',   name: 'Guide pergola',   teaser: 'Poteaux, ancrages, portées : calculer et poser sans erreur.' },
  { href: '/guides/cloture',   name: 'Guide clôture',   teaser: 'Réglementation, poteaux, lames et entraxes selon la hauteur.' },
  { href: '/dalle',            name: 'Dalle béton',     teaser: 'Épaisseur, armature, dosage béton pour une dalle de fondation.' },
];

/* ── Extrait FAQ (4 questions issues de faq/page.jsx) ── */
const FAQ_EXTRACT = [
  {
    q: "Quelle section de bois pour les montants d'un cabanon ?",
    a: "Les montants d'un cabanon standard se font en 45×90 mm ou 45×145 mm selon la hauteur du mur et l'exposition au vent. L'entraxe réglementaire est de 60 cm (NF DTU 31.2). Pour une hauteur supérieure à 2,50 m ou dans une zone exposée, préférez le 45×145 mm pour éviter le voilement.",
  },
  {
    q: "Quel entraxe pour les lambourdes d'une terrasse bois ?",
    a: "40 cm d'entraxe pour des lames de 27 mm d'épaisseur, 60 cm pour des lames de 45 mm (NF DTU 51.4 §6.2). Pour les lames posées en diagonale, réduisez d'un tiers car la portée effective augmente.",
  },
  {
    q: 'Faut-il un permis de construire pour une terrasse bois ?',
    a: 'Non pour les terrasses de plain-pied inférieures à 20 m² en zone non protégée. Entre 20 m² et 40 m², une déclaration préalable suffit. Au-delà de 40 m² ou si la terrasse est surélevée de plus de 60 cm, un permis de construire est obligatoire.',
  },
  {
    q: 'Quelle hauteur pour une clôture de jardin en limite de propriété ?',
    a: '1,50 m à 2 m dans la grande majorité des communes françaises, sans démarche administrative. Certains PLU ou règlements de lotissement imposent des limites plus basses. Au-delà de 2 m, une déclaration préalable de travaux est généralement nécessaire.',
  },
];

/* ══════════════════════════════════════════════════
   COMPOSANT — Server Component
══════════════════════════════════════════════════ */
export default function HomeSeoBand() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="hv2-seo-band">
        <div className="hv2-inner">

          <p className="hv2-eyebrow">Simulateur de matériaux bois</p>
          <h1 className="hv2-h1">
            Calculer ses matériaux DIY bois : 4 simulateurs gratuits
          </h1>
          <p className="hv2-lead">
            Terrasse, cabanon, pergola, clôture — DIY Builder calcule en moins de 30 secondes
            la liste exacte des matériaux et le budget de votre projet bois. Plans techniques,
            plan 3D interactif, devis PDF, et comparatif de prix entre Castorama, Leroy Merlin,
            Brico Dépôt et ManoMano. Conforme aux DTU 31.1, 31.2, 51.4 et 13.3. Gratuit,
            sans inscription, sans pub.
          </p>

          <div className="hv2-projects-section">
          <div className="hv2-section-header">
            <span className="hv2-section-eyebrow">01 — Projets</span>
            <h2 className="hv2-section-title">Les 4 simulateurs</h2>
          </div>
          <div className="hv2-projects-grid">
            {PROJECTS.map((p) => (
              <div key={p.id} className="hv2-project-card">
                <Image
                  src={p.img}
                  alt={p.alt}
                  className="hv2-card-img"
                  width={480}
                  height={180}
                  sizes="(max-width: 768px) 100vw, 480px"
                />
                <div className="hv2-card-body">
                  <h3 className="hv2-card-title">{p.title}</h3>
                  <p className="hv2-card-desc">{p.desc}</p>
                  <div className="hv2-card-actions">
                    <Link href={p.simHref} className="hv2-btn-primary">
                      Lancer le simulateur
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </Link>
                    <Link href={p.guideHref} className="hv2-btn-secondary">
                      Lire le guide
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>

          <div className="hv2-eatblock">
            <div className="hv2-section-header">
              <span className="hv2-section-eyebrow">02 — Confiance</span>
              <h2 className="hv2-section-title">Pourquoi DIY Builder</h2>
            </div>
            <div className="hv2-reasons">
              {REASONS.map((r, i) => (
                <div key={i} className="hv2-reason">
                  <div className="hv2-reason-icon">{r.icon}</div>
                  <div className="hv2-reason-body">
                    <p className="hv2-reason-heading">{r.heading}</p>
                    <p className="hv2-reason-text">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hv2-guides-section">
            <div className="hv2-section-header">
              <span className="hv2-section-eyebrow">03 — Guides</span>
              <h2 className="hv2-section-title">Apprendre avant de calculer</h2>
            </div>
            <div className="hv2-guides-list">
              {GUIDES.map((g) => (
                <Link key={g.href} href={g.href} className="hv2-guide-card">
                  <span className="hv2-guide-name">{g.name}</span>
                  <span className="hv2-guide-teaser">{g.teaser}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hv2-faq-section">
            <div className="hv2-section-header">
              <span className="hv2-section-eyebrow">04 — FAQ</span>
              <h2 className="hv2-section-title">Questions fréquentes</h2>
            </div>
            <div className="hv2-faq-list">
              {FAQ_EXTRACT.map((item, i) => (
                <div key={i} className="hv2-faq-item">
                  <p className="hv2-faq-q">{item.q}</p>
                  <p className="hv2-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
            <Link href="/faq" className="hv2-faq-more">
              Voir les 24 questions →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
