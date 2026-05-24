import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import Figure from '@/components/ui/Figure';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Construire un cabanon ossature bois';
const OG_SUBTITLE = 'DTU 31.2 + budget + matériaux';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cabanon`;

export const metadata = {
  title: 'Construire un cabanon ossature bois : guide DTU 31.2',
  description:
    'Guide complet pour construire un cabanon bois : ossature, montants, toiture mono-pente. Calculs DTU, liste de matériaux et estimatif de budget inclus.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/cabanon' },
  openGraph: {
    title: 'Construire un cabanon ossature bois — Guide DTU 31.2 | DIY Builder',
    description: 'Guide complet pour construire un cabanon bois : ossature, montants, toiture mono-pente. Calculs DTU, liste de matériaux et estimatif de budget inclus.',
    url: 'https://www.diy-builder.fr/guides/cabanon',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Guide cabanon ossature bois DTU 31.2 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment construire un cabanon ossature bois',
  description:
    'Guide DTU 31.2 pour construire un cabanon de jardin en ossature bois : fondations, lisse basse, ossature, toiture mono-pente, bardage.',
  totalTime: 'P2D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    minValue: '1400',
    maxValue: '3400',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Fondations',
      text: 'Couler une dalle béton armée de 10 cm minimum ou poser des plots béton réglables ancrés dans des dés coulés. Ne jamais enterrer les montants directement dans la terre.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Lisse basse',
      text: "Poser la lisse basse en bois traité classe 4 sur la dalle ou les plots avec un isolant (mousse PE ou caoutchouc) intercalé pour couper la remontée capillaire. Fixer à l'aide de chevilles à frapper ou de tiges filetées.",
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: "Montage de l'ossature",
      text: "Assembler les montants 45×90 mm à entraxe 60 cm entre lisse basse et lisse haute. Doubler les angles, poser les montants d'encadrement des ouvertures, puis contreventer chaque face avec du panneau OSB ou des écharpes métalliques.",
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Toiture mono-pente',
      text: "Poser les chevrons sur la sablière haute côté faîtage et sur la lisse basse côté égout. Clouer les voliges, poser un écran sous-toiture HPV, puis la couverture définitive (bac acier, tuiles, bitume).",
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Bardage et finitions',
      text: "Fixer les lames de bardage en bois traité classe 3b ou 4 sur chevrons de contre-lattage pour assurer la ventilation. Poser les menuiseries, calfeutrer et appliquer une lasure de finition.",
    },
  ],
};

export default function GuideCabanonPage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <div className="content-container">
        <nav className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <a href="/guides">Guides</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Cabanon</span>
        </nav>

        <h1 className="content-h1">Comment construire un cabanon ossature bois</h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 16 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources DTU</Link></span>
        </p>

        <p className="content-lead">
          Un cabanon de jardin en ossature bois, ça se monte en un week-end si la préparation est
          sérieuse — ou ça traîne six mois si elle ne l&apos;est pas. Entre 6 et 20 m², la structure
          reste accessible : ossature 45×90 mm à entraxe 60 cm, toiture mono-pente, bardage ventilé.
          Ce guide suit le DTU 31.2 et couvre les points qui font vraiment la différence sur le
          chantier : dimensionnement des montants, règles autour des ouvertures, pentes à respecter,
          et les erreurs classiques qu&apos;on voit trop souvent sur les forums de bricolage.
        </p>

        <Figure
          src="/images/guides/cabanon/hero-assemble.png"
          alt="Vue 3D d'un cabanon ossature bois mono-pente avec bardage clin et porte façade"
          width={1448}
          height={842}
          priority
          caption="Cabanon ossature bois 5,5 × 3,5 m, hauteur 2,30 m, toiture mono-pente, bardage clin horizontal. Vue assemblée."
          source="Simulateur DIY Builder — rendu Three.js"
          schemaCaption="Vue 3D assemblée d'un cabanon ossature bois mono-pente 5,5×3,5 m généré par le simulateur DIY Builder."
        />

        <h2 className="content-h2">L&apos;ossature bois : ce qu&apos;il faut vraiment comprendre</h2>
        <p className="content-snippet">
          Le DTU 31.2 impose des montants 45×90&nbsp;mm à entraxe 60&nbsp;cm entre lisse basse
          et lisse haute. Chaque angle reçoit 2 montants en L. Sans contreventement OSB 9&nbsp;mm
          (minimum DTU 31.2 §9.2.2) ou écharpes métalliques, l&apos;ossature ne reprend pas les
          efforts horizontaux du vent et devient instable dès les premières rafales.
        </p>

        <figure className="content-figure" role="group" aria-labelledby="ossature-fig-caption">
          <svg
            viewBox="0 0 640 360"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Schéma d'une ossature bois à plate-forme avec lisse basse, lisse haute, montants courants à entraxe 60 cm, montants d'encadrement autour de la porte et de la fenêtre, montants courts au-dessus du linteau et sous l'appui de fenêtre"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Fond clair pour contraste */}
            <rect x="0" y="0" width="640" height="360" fill="#faf7f0" />

            {/* ── Repères dimensionnels (sol et plafond) ── */}
            <line x1="40" y1="320" x2="600" y2="320" stroke="#c4b89a" strokeWidth="1" strokeDasharray="3 3" />

            {/* ── Lisse basse (sole plate) ── */}
            <rect x="40" y="310" width="560" height="10" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="1" />
            <text x="46" y="318" fontSize="9" fontFamily="Inter,sans-serif" fill="#fff">Lisse basse · classe 4</text>

            {/* ── Lisse haute simple ── */}
            <rect x="40" y="50" width="560" height="8" fill="#a07852" stroke="#5e3e25" strokeWidth="1" />
            {/* ── Sablière (lisse haute doublée) ── */}
            <rect x="40" y="42" width="560" height="8" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="1" />
            <text x="46" y="38" fontSize="9" fontFamily="Inter,sans-serif" fill="#5e3e25">Sablière (lisse haute doublée)</text>

            {/* ── Coin gauche : 2 montants en L ── */}
            <rect x="40" y="58" width="14" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />
            <rect x="54" y="58" width="14" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />

            {/* ── Coin droit : 2 montants en L ── */}
            <rect x="572" y="58" width="14" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />
            <rect x="586" y="58" width="14" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />

            {/* ── Bloc PORTE (gauche) : king + jack + linteau ── */}
            {/* King stud gauche (pleine hauteur) */}
            <rect x="120" y="58" width="10" height="252" fill="#6a4a2e" stroke="#3a2618" strokeWidth="1" />
            {/* Jack stud gauche (arrêté sous linteau) */}
            <rect x="130" y="160" width="10" height="150" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="1" />
            {/* Linteau porte */}
            <rect x="130" y="148" width="90" height="14" fill="#5e3e25" stroke="#3a2618" strokeWidth="1" />
            {/* Jack stud droit */}
            <rect x="210" y="160" width="10" height="150" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="1" />
            {/* King stud droit */}
            <rect x="220" y="58" width="10" height="252" fill="#6a4a2e" stroke="#3a2618" strokeWidth="1" />
            {/* Cripple studs au-dessus du linteau porte */}
            <rect x="148" y="58" width="6" height="90" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            <rect x="178" y="58" width="6" height="90" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            <rect x="208" y="58" width="6" height="90" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            {/* Annotation porte */}
            <text x="175" y="240" fontSize="10" fontFamily="Inter,sans-serif" fill="#5e3e25" textAnchor="middle" fontStyle="italic">Porte 90 cm</text>

            {/* ── Montants courants entre coin gauche et porte ── */}
            <rect x="92" y="58" width="10" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />

            {/* ── Bloc FENÊTRE (droite) : king + jack + linteau + appui + cripples ── */}
            {/* King stud gauche fenêtre */}
            <rect x="390" y="58" width="10" height="252" fill="#6a4a2e" stroke="#3a2618" strokeWidth="1" />
            {/* Jack stud gauche fenêtre */}
            <rect x="400" y="170" width="10" height="60" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="1" />
            {/* Linteau fenêtre */}
            <rect x="400" y="158" width="100" height="12" fill="#5e3e25" stroke="#3a2618" strokeWidth="1" />
            {/* Appui de fenêtre (seuil) */}
            <rect x="400" y="230" width="100" height="8" fill="#5e3e25" stroke="#3a2618" strokeWidth="1" />
            {/* Jack stud droit fenêtre */}
            <rect x="490" y="170" width="10" height="60" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="1" />
            {/* King stud droit fenêtre */}
            <rect x="500" y="58" width="10" height="252" fill="#6a4a2e" stroke="#3a2618" strokeWidth="1" />
            {/* Cripple studs au-dessus du linteau fenêtre */}
            <rect x="418" y="58" width="6" height="100" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            <rect x="448" y="58" width="6" height="100" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            <rect x="478" y="58" width="6" height="100" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            {/* Cripple studs sous appui */}
            <rect x="418" y="238" width="6" height="72" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            <rect x="448" y="238" width="6" height="72" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            <rect x="478" y="238" width="6" height="72" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
            {/* Annotation fenêtre */}
            <text x="450" y="206" fontSize="10" fontFamily="Inter,sans-serif" fill="#5e3e25" textAnchor="middle" fontStyle="italic">Fenêtre 100 cm</text>

            {/* ── Montants courants entre porte et fenêtre ── */}
            <rect x="280" y="58" width="10" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />
            <rect x="340" y="58" width="10" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />

            {/* ── Montant courant entre fenêtre et coin droit ── */}
            <rect x="546" y="58" width="10" height="252" fill="#c89a6b" stroke="#5e3e25" strokeWidth="1" />

            {/* ── Cote entraxe 60 cm (entre 2 montants courants) ── */}
            <line x1="285" y1="334" x2="345" y2="334" stroke="#c9971e" strokeWidth="1.5" />
            <line x1="285" y1="330" x2="285" y2="338" stroke="#c9971e" strokeWidth="1.5" />
            <line x1="345" y1="330" x2="345" y2="338" stroke="#c9971e" strokeWidth="1.5" />
            <text x="315" y="350" fontSize="11" fontFamily="Inter,sans-serif" fill="#c9971e" textAnchor="middle" fontWeight="600">60 cm (entraxe DTU)</text>

            {/* ── Légende latérale droite ── */}
            <g transform="translate(610, 70)">
              <rect x="0" y="0" width="12" height="10" fill="#c89a6b" stroke="#5e3e25" strokeWidth="0.5" />
              <text x="-4" y="9" fontSize="9" fontFamily="Inter,sans-serif" fill="#3a2618" textAnchor="end">Courant</text>

              <rect x="0" y="18" width="12" height="10" fill="#6a4a2e" stroke="#3a2618" strokeWidth="0.5" />
              <text x="-4" y="27" fontSize="9" fontFamily="Inter,sans-serif" fill="#3a2618" textAnchor="end">Continu</text>

              <rect x="0" y="36" width="12" height="10" fill="#8b5e3c" stroke="#5e3e25" strokeWidth="0.5" />
              <text x="-4" y="45" fontSize="9" fontFamily="Inter,sans-serif" fill="#3a2618" textAnchor="end">About</text>

              <rect x="0" y="54" width="12" height="10" fill="#c4a075" stroke="#8b6c45" strokeWidth="0.5" />
              <text x="-4" y="63" fontSize="9" fontFamily="Inter,sans-serif" fill="#3a2618" textAnchor="end">Court</text>

              <rect x="0" y="72" width="12" height="10" fill="#5e3e25" stroke="#3a2618" strokeWidth="0.5" />
              <text x="-4" y="81" fontSize="9" fontFamily="Inter,sans-serif" fill="#3a2618" textAnchor="end">Linteau</text>
            </g>
          </svg>
          <figcaption id="ossature-fig-caption" className="content-figure-caption">
            Vue de face d&apos;un mur d&apos;ossature à plate-forme (DTU 31.2). Coins doublés en L,
            montants courants à entraxe 60&nbsp;cm, montants continus pleine hauteur de chaque côté
            d&apos;une ouverture, montants d&apos;about portant le linteau, montants courts
            au-dessus du linteau et sous l&apos;appui de fenêtre.
          </figcaption>
        </figure>

        <p className="content-body">
          L&apos;ossature à plate-forme, c&apos;est simple dans le principe : des montants verticaux coincés entre
          une lisse basse et une lisse haute, le tout raidi par des panneaux de contreventement.
          Ce qui pêche le plus souvent chez les bricoleurs, c&apos;est de négliger le contreventement —
          et de découvrir que leur cabanon oscille au premier coup de vent.
        </p>

        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Principe structurel :</strong> les montants reprennent les charges verticales
            (toiture, neige), les panneaux OSB 9 mm (mini DTU 31.2) ou les écharpes métalliques
            absorbent les efforts horizontaux (vent). Sans contreventement, l&apos;ossature est
            un château de cartes.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Section standard :</strong> 45 × 90 mm pour un abri non isolé — c&apos;est la
            section vendue partout en GSB. Si vous intégrez une isolation laine de bois ou laine de
            verre entre les montants, passez en 45 × 145 mm dès le départ, ça coûte moins cher que
            de refaire.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Entraxe montants :</strong> 60 cm, pas 61, pas 58. C&apos;est l&apos;entraxe du DTU 31.2,
            et c&apos;est aussi la largeur modulaire des panneaux OSB et des rouleaux d&apos;isolant. Tricher
            de quelques centimètres oblige à retailler chaque panneau — une perte de temps inutile.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Doublage des angles :</strong> chaque coin reçoit deux montants assemblés en L.
            C&apos;est là que le bardage extérieur et le panneau intérieur trouvent leur appui de clouage.
            Un seul montant en angle, c&apos;est une erreur qu&apos;on paie à la pose du bardage.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Ouvertures :</strong> porte ou fenêtre, même règle — deux montants continus
            pleine hauteur, deux montants d&apos;about arrêtés sous le linteau, et un linteau horizontal
            dimensionné selon la portée. Pour une porte de 90 cm, un double 45 × 145 posé de champ
            suffit largement.
          </li>
        </ul>

        <h2 className="content-h2">Calcul des matériaux</h2>

        <Figure
          src="/images/guides/cabanon/plan-svg.png"
          alt="Plan technique coté d'un cabanon ossature bois 5,5 × 3,5 m hauteur 2,30 m avec pente 27%"
          width={1380}
          height={1048}
          caption="Plan technique coté généré automatiquement : dimensions hors-tout, pente 27%, entraxe 55 cm, porte 90 cm + fenêtre 60×60 cm avec allège 1 m."
          source="Simulateur DIY Builder — plan technique"
          schemaCaption="Plan technique 3D coté d'un cabanon ossature bois 5,5×3,5×2,30 m avec annotations DTU 31.2 (entraxe, pente, ouvertures)."
        />

        <p className="content-snippet">
          Pour un cabanon 3×2&nbsp;m, hauteur 2,30&nbsp;m&nbsp;: 12–14 montants 45×90&nbsp;mm,
          lisses basses en classe 4 obligatoire (pas classe 3), 5–6 chevrons 60×80&nbsp;mm avec
          débord d&apos;égout de 40–60&nbsp;cm, et 27&nbsp;m² de bardage (périmètre × hauteur
          +&nbsp;10&nbsp;% de chutes). Prévoyez toujours 10&nbsp;% de marge sur bardage et voliges.
        </p>
        <p className="content-body">
          Pour un cabanon 3 × 2 m, hauteur 2,30 m, toiture mono-pente — voici ce qu&apos;il faut
          commander. Attention : ces quantités sont brutes. Prévoyez toujours 10 % de chutes
          supplémentaires sur le bardage et les voliges.
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Montants 45 × 90 × 2 400 mm :</strong> 12 à 14 pièces — 4 coins × 2 montants,
            plus les intermédiaires façades et pignons. Les montants d&apos;encadrement des ouvertures
            s&apos;ajoutent en sus selon votre plan.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lisses basses :</strong> 2 longueurs de 3 m + 2 de 2 m, obligatoirement en
            traité classe 4. La classe 3 tient quelques années puis pourriture garantie au contact
            du béton humide.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lisses hautes :</strong> mêmes longueurs, doublées sur les murs porteurs de
            toiture pour former la sablière. C&apos;est ce doublement qui répartit la charge des chevrons.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Chevrons de toit :</strong> 5 à 6 chevrons 60 × 80 mm. Longueur = profondeur
            du cabanon + débord d&apos;égout (40 à 60 cm recommandé pour tenir les murs au sec). Ne
            lésinez pas sur le débord : chaque centimètre gagne en protection. Pour un cabanon
            au-delà de 4 m de portée, passez en bastaing 63 × 150 mm.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Bardage :</strong> périmètre × hauteur moyenne + 10 % de chutes. Pour ce
            cabanon : (3+2+3+2) × 2,50 × 1,10 ≈ 27 m². Toujours arrondir à la planche supérieure.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Voliges de toiture :</strong> surface de couverture (3 × 2 m + débords) en
            planche 14 à 18 mm, joint à couvrir ou feuillure. En zone neige importante (Alpes,
            Massif Central, Jura), 18 mm minimum. Alternative pour petits formats : entretoises
            de toiture en quinconce entre chevrons, sans voligeage continu — c&apos;est la
            solution retenue par défaut dans notre simulateur.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Quincaillerie :</strong> équerres de charpente, vis inox 4 × 60 et 6 × 120,
            sabots d&apos;ancrage pour lisses basses, clous annelés pour OSB. Ne pas sous-doser la
            quincaillerie — c&apos;est ce qui tient la structure ensemble.
          </li>
        </ul>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Calculateur gratuit</p>
          <p className="content-cta-box-title">Obtenez la liste exacte pour votre cabanon</p>
          <p className="content-cta-box-desc">
            Entrez vos dimensions et le simulateur génère la nomenclature complète avec quantités et
            comparatif de prix.
          </p>
          <a href="/cabanon" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Les étapes de construction</h2>
        <p className="content-snippet">
          Dalle béton 10&nbsp;cm sur gravier drainant (obligatoire dès 9&nbsp;m²) ou plots coulés
          30×30×40&nbsp;cm à chaque angle. Lisse basse classe 4 sur joint mousse PE pour couper
          la remontée capillaire. Ossature assemblée à plat puis levée. Toiture à 20–30&nbsp;%
          de pente minimum — 15&nbsp;% est le minimum technique mais reste insuffisant en pratique.
        </p>

        <h3 className="content-h3">1. Fondations</h3>
        <p className="content-body">
          La fondation, c&apos;est là que ça se joue. Pas le plus glamour à poster sur les réseaux,
          mais 80 % des cabanons qui bougent ou pourrissent ont un problème de fondation à la base.
          Trois options : la dalle béton armée (10 cm d&apos;épaisseur sur 10 cm de gravier drainant)
          — la plus rigide, indispensable au-delà de 9 m². Les plots béton coulés en place
          (30 × 30 × 40 cm), un par angle et tous les 1,5 m — rapide, économique, efficace pour
          les petits formats. Ou la plateforme sur plots réglables acier galvanisé — idéale sur
          terrain pentu ou pour une installation déplaçable. Dans tous les cas : le bois ne touche
          jamais la terre nue.
        </p>

        <h3 className="content-h3">2. Lisse basse</h3>
        <p className="content-body">
          Bois traité autoclave classe 4 — pas classe 2, pas classe 3. La lisse basse est en
          contact permanent avec l&apos;humidité du béton ; sous-doser le traitement, c&apos;est se retrouver
          à refaire la base dans cinq ans. Intercalez un joint mousse PE 10 mm ou une bande
          caoutchouc entre la lisse et la dalle pour couper la remontée capillaire. Fixez avec des
          chevilles M12 ou des tiges filetées noyées dans le béton frais, espacement 60 cm.
          Vérifiez la planéité et l&apos;équerrage avec la méthode 3-4-5 avant de lever quoi que ce
          soit : un millimètre de travers ici devient deux centimètres en haut de l&apos;ossature.
        </p>

        <h3 className="content-h3">3. Montage de l&apos;ossature</h3>
        <p className="content-body">
          Assemblez les cadres de mur à plat au sol — c&apos;est dix fois plus facile que de travailler
          debout avec un marteau levé. Redressez-les ensuite et maintenez-les avec des étrésillons
          pendant la fixation. Ordre : les deux murs longs d&apos;abord (façade et pignon arrière), puis
          les pignons qui viennent s&apos;emboîter. Chaque angle se serre avec des vis 6 × 120 en
          quinconce. Panneaux OSB 9 mm minimum (DTU 31.2 §9.2.2) ensuite, cloués à 10 cm sur les
          rives et 20 cm en milieu de montant — c&apos;est le contreventement, ne bâclez pas la
          fixation. Autour des ouvertures :
          montants continus pleine hauteur, montants d&apos;about arrêtés sous linteau, linteau double 45 × 145 de
          champ pour une porte de 90 cm.
        </p>

        <h3 className="content-h3">4. Toiture mono-pente</h3>
        <p className="content-body">
          15 % de pente, c&apos;est le minimum technique — mais sur le terrain, 20 à 30 % est ce qui
          fonctionne vraiment sans problème d&apos;évacuation des eaux en automne ou sous la neige.
          Pour 3 m de profondeur à 20 %, ça donne 60 cm de dénivelé entre le côté haut et le
          côté bas. Posez les chevrons sur la sablière haute côté faîtage et sur la lisse basse
          d&apos;égout, vérifiez que chaque chevron repose bien sur ses appuis. Voliges 14 à 18 mm
          perpendiculaires aux chevrons (ou entretoises en quinconce sur petits formats), puis
          écran sous-toiture HPV (hautement perméable à la
          vapeur — pas un simple pare-vapeur). Couverture selon budget et style : bac acier
          (pose rapide, résistant), shingles bitumés (look chalet, plus coûteux à poser),
          tuiles légères sur liteaux (le plus lourd à transporter).
        </p>

        <h3 className="content-h3">5. Bardage et finitions</h3>
        <p className="content-body">
          Le bardage sans lame d&apos;air, c&apos;est une erreur classique. Les lames humides gonflent,
          l&apos;eau s&apos;accumule derrière, la pourriture s&apos;installe. La règle : chevrons de contre-lattage
          27 × 40 mm verticaux sur l&apos;OSB, lame d&apos;air de 20 mm minimum, puis lames de bardage
          classe 3b au minimum (classe 4 recommandé si exposition directe à la pluie). Pose
          horizontale à clin, feuillurée, ou verticale breton-bretonné — chacun son rendu.
          Deux couches de lasure microporeuse après pose, encadrements calfeutrés au silicone
          neutre, cornières d&apos;angle de finition. La menuiserie s&apos;installe en dernier, une fois
          les murs stables.
        </p>

        <h2 className="content-h2">Budget à prévoir</h2>
        <p className="content-snippet">
          Matériaux seuls (ossature, couverture, bardage, quincaillerie), hors fondations et
          menuiseries&nbsp;: 1&nbsp;400–1&nbsp;800&nbsp;€ pour 4&nbsp;m², 2&nbsp;000–2&nbsp;600&nbsp;€
          pour 9&nbsp;m², 2&nbsp;700–3&nbsp;400&nbsp;€ pour 15&nbsp;m². Ajoutez 100–400&nbsp;€ pour
          les fondations et 60–90&nbsp;€/h si vous faites appel à un charpentier.
        </p>
        <p className="content-body">
          Ces estimations couvrent les matériaux bruts — bois d&apos;ossature 90×90&nbsp;mm,
          chevrons, OSB 9 mm, bardage pin classe&nbsp;4, quincaillerie — hors fondations et
          menuiseries (porte, fenêtre). Fourchettes recalculées en mai 2026 d&apos;après nos prix
          réels (Brico Dépôt en bas de fourchette, Leroy Merlin en haut).
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Taille</th>
              <th>Surface</th>
              <th>Budget matériaux estimé</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Petit</td>
              <td>4 m² (2 × 2 m)</td>
              <td>1 400 – 1 800 €</td>
            </tr>
            <tr>
              <td>Moyen</td>
              <td>9 m² (3 × 3 m)</td>
              <td>2 000 – 2 600 €</td>
            </tr>
            <tr>
              <td>Grand</td>
              <td>15 m² (5 × 3 m)</td>
              <td>2 700 – 3 400 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Ajoutez 100 à 400 € pour les fondations selon la solution choisie (plots coulés vs dalle
          armée). Si vous faites appel à un artisan pour certaines étapes, comptez 60 à 90 €/h —
          les charpentiers qualifiés sont en tension, prenez date tôt.
        </p>

        <h2 className="content-h2">Réglementation</h2>
        <p className="content-snippet">
          Moins de 5&nbsp;m²&nbsp;: aucune démarche. De 5 à 20&nbsp;m²&nbsp;: déclaration préalable
          (Cerfa 13703, délai 1 mois en mairie). Plus de 20&nbsp;m²&nbsp;: permis de construire
          obligatoire (délai 2 mois). Ces seuils valent en zones PLU — vérifiez aussi les secteurs
          ABF et Natura 2000 avant de commander.
        </p>
        <p className="content-body">
          En France, les démarches dépendent directement de la surface de plancher :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Moins de 5 m² :</strong> rien à déclarer, quel que soit l&apos;emplacement. C&apos;est
            la seule tranche vraiment libre.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>5 à 20 m² :</strong> déclaration préalable de travaux, formulaire Cerfa 13703,
            à déposer en mairie. Délai d&apos;instruction : 1 mois. Ne sautez pas cette étape — un
            voisin mécontent peut déclencher un contrôle et une mise en demeure de démolir.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Plus de 20 m² :</strong> permis de construire obligatoire, délai d&apos;instruction
            2 mois. Au-delà de 150 m² (peu probable pour un cabanon), recours à un architecte
            obligatoire.
          </li>
        </ul>
        <p className="content-body">
          Ces seuils valent en zones couvertes par un PLU. Hors zones urbanisées, les règles
          diffèrent. Et certaines zones sont piégeuses : abords de monuments historiques, zones
          Natura 2000, secteurs avec plan de prévention des risques — elles peuvent imposer des
          matériaux, des couleurs de bardage ou une hauteur maximale. Appelez le service urbanisme
          de votre mairie avant de commander le bois, pas après.
        </p>

        <h2 className="content-h2">Questions fréquentes</h2>
        <p className="content-snippet">
          Pente de toit&nbsp;: 20–30&nbsp;% recommandé (15&nbsp;% minimum technique). Pour un cabanon
          de 3&nbsp;m de profondeur à 20&nbsp;%, le dénivelé est de 60&nbsp;cm. Poteaux enterrés
          directement dans la terre&nbsp;: interdit par le DTU 31.2 même en classe 4. Isolation&nbsp;:
          optionnelle légalement, mais 80&nbsp;mm de laine entre montants change tout pour un atelier.
        </p>

        <h3 className="content-h3">Quelle pente de toit pour un cabanon ?</h3>
        <p className="content-body">
          15 % en absolu minimum — en dessous, l&apos;eau stagne sur la couverture et finit par
          s&apos;infiltrer même avec un bon écran sous-toiture. En pratique, 20 à 30 % est ce que
          je recommande systématiquement : ça gère les feuilles mortes en automne, la neige
          en hiver, et les averses horizontales. Concrètement, pour un cabanon de 3 m de
          profondeur à 20 % de pente, la différence de hauteur entre le côté haut et le côté
          bas est de 60 cm. Côté faîtage : lisse haute à 2,30 m. Côté égout : 1,70 m. Pensez
          à l&apos;ergonomie à l&apos;intérieur — trop pentu et vous vous cognez la tête du mauvais côté.
        </p>

        <h3 className="content-h3">Peut-on enterrer les poteaux directement dans la terre ?</h3>
        <p className="content-body">
          Non, et c&apos;est non sans exception. Même un bois traité classe 4, en contact permanent
          avec un sol humide, commence à se dégrader en 5 à 8 ans selon les conditions. La
          technique correcte : ancrage sur dalle ou plot via sabot métallique galvanisé ou platine
          boulonnée. C&apos;est explicitement interdit dans le DTU 31.2, et tous les fabricants de bois
          traité le précisent dans leurs fiches techniques. J&apos;ai vu des cabanons neufs déjà
          branlants après trois hivers parce que les montants avaient été plantés directement
          dans la terre. Ne faites pas ça.
        </p>

        <h3 className="content-h3">Faut-il isoler un cabanon de jardin ?</h3>
        <p className="content-body">
          Réglementairement non — la RE 2020 ne s&apos;applique qu&apos;aux bâtiments d&apos;habitation, pas
          aux abris de jardin. Mais la vraie question c&apos;est : à quoi va servir votre cabanon ?
          Si c&apos;est un stockage de tondeuse, oubliez l&apos;isolation. Si c&apos;est un atelier ou un
          espace de travail, 80 mm de laine de bois entre des montants 45 × 90 mm change
          radicalement le confort thermique et acoustique. Surcoût : 15 à 25 €/m² pour la laine
          plus un pare-vapeur côté chaud. C&apos;est une décision à prendre avant de commander les
          montants — pas après, quand vous réalisez que 45 × 90 mm ne loge pas 100 mm d&apos;isolant.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/terrasse">Guide terrasse</Link> — plots et lambourdes (sol cabanon)</li>
            <li><Link href="/guides/pergola">Guide pergola</Link> — assemblage poteaux/longerons</li>
            <li><Link href="/faq">FAQ</Link> — 24 questions techniques (sections, classes, RE 2020)</li>
            <li><Link href="/cabanon">Calculateur cabanon</Link> — devis matériaux + plan</li>
          </ul>
        </aside>

        <CTALead projectHref="/cabanon" projectLabel="mon cabanon" />

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article révisé le 16 mai 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources DTU citées</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Calculez votre cabanon en 30 secondes</p>
          <p className="content-cta-box-desc">
            Liste complète de matériaux + budget par enseigne + visualisation 3D de votre
            ossature. Exportez votre devis en PDF.
          </p>
          <a href="/cabanon" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
