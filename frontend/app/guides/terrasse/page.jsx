import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import PullQuote from '@/components/content/PullQuote';
import Callout from '@/components/content/Callout';
import Figure from '@/components/ui/Figure';
import CTALead from '@/components/landing/CTALead';
import GuideToolsBlock from '@/components/content/GuideToolsBlock';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Construire une terrasse bois';
const OG_SUBTITLE = 'DTU 51.4 + lambourdes + budget';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=terrasse`;

export const metadata = {
  title: 'Construire une terrasse bois : guide DTU 51.4',
  description:
    'Guide pas à pas pour construire votre terrasse bois : choix des matériaux, calcul des lambourdes, pose des lames. Estimez votre budget en 30 secondes.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/terrasse' },
  openGraph: {
    title: 'Construire une terrasse bois — Guide DTU 51.4 | DIY Builder',
    description: 'Guide pas à pas pour construire votre terrasse bois : choix des matériaux, calcul des lambourdes, pose des lames. Estimez votre budget en 30 secondes.',
    url: 'https://www.diy-builder.fr/guides/terrasse',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Guide terrasse bois DTU 51.4 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment construire une terrasse bois',
  description:
    'Guide complet pour construire une terrasse bois : préparation du sol, plots béton, lambourdes, lames et finitions.',
  totalTime: 'PT16H',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    minValue: '1077',
    maxValue: '2163',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Préparer le sol',
      text: 'Appliquer un désherbant total, poser un géotextile anti-repousse et niveler la surface. Un sol plan garantit une terrasse stable sur la durée.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Poser les plots béton',
      text: "Disposer les plots réglables sous chaque lambourde, avec un entraxe d'appuis de 60 cm (70 cm maximum selon le NF DTU 51.4). Utiliser un niveau laser ou un cordeau pour aligner parfaitement l'ensemble.",
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Installer les lambourdes',
      text: "Visser les lambourdes (40×60 mm minimum) sur les plots avec des vis inox 6×60. Vérifier la planéité à chaque pose et respecter l'entraxe de 40 cm.",
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Poser les lames de terrasse',
      text: "Fixer les lames perpendiculairement aux lambourdes en laissant un espacement de 5 mm entre chaque lame pour l'évacuation de l'eau. Utiliser des vis inox ou des clips cachés.",
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Finitions : ponçage et protection',
      text: "Poncer les bois bruts au grain 80 puis 120 pour un rendu lisse. Appliquer une huile de finition ou une lasure bois extérieur pour protéger contre l'humidité et les UV.",
    },
  ],
};

export default function GuideTerrassePage() {
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
          <span className="content-breadcrumb-current">Terrasse bois</span>
        </nav>

        <h1 className="content-h1">Construire une terrasse bois soi-même : le guide terrain</h1>

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
          Une terrasse bois bien construite, c&apos;est deux jours de travail, les bons matériaux et
          une ossature posée proprement. On voit trop de projets partir de travers dès le départ :
          bois trop humide à la pose, lambourdes sous-dimensionnées, pas de pente d&apos;évacuation.
          Ce guide ne vous noie pas dans la théorie — il vous donne les chiffres qui comptent,
          les erreurs à éviter et les étapes dans le bon ordre.
        </p>

        <Figure
          src="/images/guides/terrasse/hero-assemble.png"
          alt="Vue 3D d'une terrasse bois en pin classe 4 sur plots béton réglables, lames horizontales avec jeu de dilatation"
          width={1448}
          height={842}
          priority
          caption="Terrasse bois 4 × 3 m, lames pin classe 4, plots béton visibles en périphérie. Vue assemblée."
          source="Simulateur DIY Builder — rendu Three.js"
          schemaCaption="Vue 3D assemblée d'une terrasse bois 4×3 m sur plots béton générée par le simulateur DIY Builder."
        />

        <h2 className="content-h2">Quelle essence choisir selon votre budget et votre usage ?</h2>
        <p className="content-snippet">
          Le pin traité autoclave classe 4 (25–40&nbsp;€/m² de lame seule) tient 15–20 ans et couvre
          95&nbsp;% des terrasses françaises. Le douglas naturellement durable (35–55&nbsp;€/m²)
          grisaille après 2–3 saisons sans entretien. Les bois exotiques comme l&apos;ipé
          (80–150&nbsp;€/m²) atteignent 30–50 ans sans traitement&nbsp;— certifiés FSC obligatoire.
          Ces prix ne couvrent que la lame&nbsp;: la structure sous les pieds double l&apos;addition.
        </p>
        <p className="content-body">
          Tout part de là. L&apos;essence que vous choisissez va dicter le prix, le comportement du
          bois dans le temps et l&apos;entretien que vous acceptez de faire. Voici les trois familles
          qui couvrent 95 % des terrasses posées en France.
        </p>

        <h3 className="content-h3">Pin traité autoclave — le choix raisonné pour les grandes surfaces</h3>
        <p className="content-body">
          Le pin sylvestre traité en autoclave classe 4 est le bois le plus posé en France, et
          pour de bonnes raisons. Le procédé force des sels de cuivre dans les fibres sous
          pression : résultat, une résistance aux champignons et aux insectes xylophages garantie
          15 à 20 ans sans traitement régulier. À 25–40 €/m² pour les lames, c&apos;est la seule
          option vraiment viable au-dessus de 20 m².
        </p>
        <p className="content-body">
          Le piège classique ici : acheter du bois vert fraîchement sorti d&apos;autoclave et le poser
          immédiatement. Le taux d&apos;humidité dépasse souvent 30 % à la livraison. En séchant sur
          place, les lames gauchissent et les vis arrachent. Laissez le bois se stabiliser à
          l&apos;abri 1 à 2 semaines avant la pose — cette étape n&apos;est jamais indiquée sur l&apos;étiquette
          en GSB, et elle change tout.
        </p>

        <Callout type="pro">
          Un bois d&apos;autoclave fraîchement livré arrive encore gorgé d&apos;eau&nbsp;: posé tel quel, il gauchit en séchant et les vis finissent par s&apos;arracher. Laissez les lames se stabiliser à l&apos;abri une à deux semaines avant la pose — un délai que l&apos;étiquette en GSB ne mentionne jamais, mais qui change tout pour la tenue de l&apos;ouvrage.
        </Callout>

        <h3 className="content-h3">Douglas — naturellement durable, sans compromis sur le rendu</h3>
        <p className="content-body">
          Le douglas est un résineux français dont le cœur (duramen) atteint la classe de
          durabilité 3-4 sans aucun traitement chimique. Il part d&apos;un miel orangé à la coupe et
          grisaille progressivement en quelques saisons pour un rendu ardoise que beaucoup
          recherchent. Comptez 35–55 €/m². Un entretien à l&apos;huile tous les 2-3 ans ralentit
          ce vieillissement si vous voulez conserver la teinte.
        </p>
        <p className="content-body">
          Ce qu&apos;on oublie souvent : le douglas accepte très bien la lasure et l&apos;huile, mais il
          faut poncer avant application — sa surface lisse en sortie de scierie limite l&apos;adhérence
          des produits de finition.
        </p>

        <h3 className="content-h3">Bois exotiques (ipé, teck) — quand la durabilité prime sur le budget</h3>
        <p className="content-body">
          L&apos;ipé et le teck sont en classe 1 : 30 à 50 ans sans entretien, grâce à leur teneur
          naturelle en huiles et silices. Leur densité les rend quasi insensibles aux chocs,
          aux rayures et aux UV. Le prix (80–150 €/m²) et l&apos;obligation d&apos;une certification FSC
          réduisent leur usage à des projets où la durabilité long terme justifie l&apos;investissement.
        </p>

        <PullQuote>
          Ipé et teck, classe&nbsp;1&nbsp;: <strong>30 à 50&nbsp;ans</strong> de terrasse sans le moindre traitement.
        </PullQuote>

        <p className="content-body">
          Contrainte technique à ne pas négliger : leur dureté exige des forets carbure et un
          pré-perçage systématique. Visser sans pré-percer, c&apos;est la fissure garantie, même
          avec des vis inox costaud.
        </p>

        <h2 className="content-h2">Calculer les quantités sans se tromper</h2>

        <Figure
          src="/images/guides/terrasse/plan-svg.png"
          alt="Plan technique coté d'une terrasse bois avec dimensions, entraxe lambourdes 40 cm et pente d'évacuation"
          width={1380}
          height={1048}
          caption="Plan technique coté : entraxe lambourdes 40 cm (DTU 51.4), répartition des plots béton, dimensions hors-tout."
          source="Simulateur DIY Builder — plan technique"
          schemaCaption="Plan technique coté d'une terrasse bois sur plots béton avec annotations DTU 51.4 (entraxes, sections)."
        />

        <p className="content-snippet">
          Pour 12&nbsp;m² de terrasse&nbsp;: comptez surface&nbsp;×&nbsp;1,10 pour les lames (10&nbsp;%
          de chute), 11 lambourdes à entraxe 40&nbsp;cm sur 4&nbsp;m, environ 70 plots réglables
          (un appui tous les 60&nbsp;cm sous chaque lambourde) et environ 550 vis inox A2
          5×60&nbsp;mm. La surcommande initiale coûte toujours moins cher qu&apos;un
          réassort en cours de chantier.
        </p>
        <p className="content-body">
          Sur les chantiers qu&apos;on voit en GSB, la moitié des acheteurs sous-commandent les lames
          et sur-commandent les vis. Voici la méthode juste pour une terrasse 4 × 3 m = 12 m² :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lames de terrasse :</strong> surface + 10 % de chute pour les découpes et
            les défauts de fil, soit 12 × 1,10 = 13,2 m² à commander. Ne descendez jamais
            en dessous de ce coefficient, même pour un rectangle parfait.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lambourdes :</strong> entraxe 40 cm sur 4 m de largeur → (4 / 0,40) + 1 = 11
            lambourdes, chacune courant sur 3 m. La lambourde de rive compte comme les autres :
            ne l&apos;oubliez pas. Ajoutez 2 lambourdes doublées au droit des coupes de lames —
            chaque about doit reposer sur son propre appui — soit 13 pièces à commander.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Plots réglables :</strong> c&apos;est le poste le plus sous-estimé. La règle
            n&apos;est pas une grille au sol mais un entraxe d&apos;appuis le long de chaque
            lambourde : 70 cm maximum en pose sur 3 appuis ou plus, 60 cm en pose sur 2 appuis
            (NF DTU 51.4). Au-delà, la pièce n&apos;est plus une lambourde mais une solive, qui
            relève du NF DTU 31.1. Pour une lambourde de 3 m, 4 intervalles donneraient 75 cm —
            hors norme : il en faut 5, soit 6 lignes d&apos;appuis à 60 cm. Résultat pour 12 m² :
            11 lambourdes × 6 lignes = 66 plots, plus 5 plots sous les jonctions de lambourdes
            (une jonction se centre toujours sur une tête de plot) = <strong>71 plots</strong>.
            Comptez 5 à 6 plots par m², pas 1 ou 2.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Vis inox :</strong> 2 vis par lame et par lambourde (lame de 145 mm →
            2 points de fixation, NF DTU 51.4). Sur 3 m de profondeur, une lame de 145 mm plus
            3 mm de jeu donne 21 rangées ; 21 × 13 lambourdes × 2 = <strong>546 vis</strong>
            5 × 60 mm inox A2. Prévoyez une boîte de 600. Prenez de l&apos;A4 si la terrasse est
            en bord de mer.
          </li>
        </ul>
        <p className="content-body">
          Le recomplément de stock en cours de chantier coûte toujours plus cher que la surcommande
          initiale — livraison supplémentaire, lot dépareillé, teinte légèrement différente.
          Les 10 % de marge ne sont pas optionnels.
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Calculateur gratuit</p>
          <p className="content-cta-box-title">Calculez précisément vos matériaux</p>
          <p className="content-cta-box-desc">
            Entrez vos dimensions et obtenez la liste complète : lames, lambourdes, plots, vis et
            budget par enseigne.
          </p>
          <a href="/calculateur" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Les 5 étapes de construction dans le bon ordre</h2>
        <p className="content-snippet">
          Sol nivelé à 1&nbsp;cm/m de pente, plots réglables tous les 60&nbsp;cm sous chaque
          lambourde (70&nbsp;cm maximum, NF DTU 51.4), lambourdes
          40×60&nbsp;mm minimum, lames perpendiculaires avec 5&nbsp;mm de
          jeu de dilatation, finition huile ou lasure. La tolérance de planéité est de
          ±5&nbsp;mm sous une règle de 2&nbsp;m (DTU 51.4).
        </p>

        <h3 className="content-h3">1. Préparer le sol — l&apos;étape qu&apos;on bâcle toujours</h3>
        <p className="content-body">
          Désherbez la zone avec un produit total à base de glyphosate ou un brûleur thermique.
          Attendez 2 semaines, retirez les végétaux morts. Posez un géotextile 90 g/m² minimum,
          recouvert de 5 à 10 cm de gravillon concassé pour le drainage. Nivelez à la règle de
          maçon en ménageant une pente de 1 cm/m vers l&apos;extérieur — juste ce qu&apos;il faut pour
          évacuer sans créer un toboggan.
        </p>
        <p className="content-body">
          L&apos;erreur classique : ne pas mettre de géotextile pour &quot;économiser 20 €&quot;. Deux ans plus
          tard, la végétation traverse le gravillon, soulève les plots et vous passez un week-end
          à démonter la moitié de la terrasse.
        </p>

        <h3 className="content-h3">2. Poser les plots — planéité ±5 mm sous une règle de 2 m</h3>
        <p className="content-body">
          Plots réglables en acier galvanisé ou plots béton coulés, alignés sous chaque lambourde
          avec un entraxe d&apos;appuis de 60 cm — 70 cm est le maximum admis par le NF DTU 51.4,
          et seulement en pose sur 3 appuis ou plus. Utilisez un niveau laser rotatif — le cordeau fonctionne, mais il
          fléchit sur les grandes longueurs. La tolérance admissible est de ±3 mm sur l&apos;ensemble
          de la surface. Sur terrain meuble, coulez une semelle béton 20 × 20 × 10 cm sous chaque
          plot pour répartir les charges et éviter l&apos;enfoncement hivernal.
        </p>

        <h3 className="content-h3">3. Installer les lambourdes — la section, pas un détail</h3>
        <p className="content-body">
          Section minimale 40 × 60 mm, mais préférez 60 × 70 mm dès que la terrasse dépasse 15 m² :
          c&apos;est la hauteur de la lambourde qui fait la portée. Une 40 × 60 en résineux C18 plafonne
          à 68 cm entre appuis, une 60 × 70 atteint les 70 cm du NF DTU 51.4 — au-delà, ce n&apos;est
          plus une lambourde mais une solive (NF DTU 31.1). Côté lames, l&apos;entraxe entre lambourdes
          dépend de l&apos;épaisseur : 42 cm pour une lame de 21 mm en résineux C18, 53 cm pour une lame
          de 27 mm — d&apos;où les 40 cm retenus ici, valables dans les deux cas. Vissez sur les plots avec des vis inox
          6 × 60 mm, deux par extrémité. Vérifiez la planéité à la règle de 2 m avant chaque
          nouvelle pose — rattraper 5 mm de dévers en milieu de chantier, c&apos;est possible ;
          rattraper 15 mm en fin de pose, c&apos;est souvent tout refaire.
        </p>

        <h3 className="content-h3">4. Poser les lames — l&apos;espacement de 5 mm n&apos;est pas décoratif</h3>
        <p className="content-body">
          Commencez par la lame de rive la plus droite et maintenez 5 mm d&apos;écartement entre les
          lames avec des cales plastique ou des clous de 5 mm comme écarteurs temporaires.
          Pour le vissage apparent, pré-percez systématiquement — sans pré-perçage, le bois
          éclate en bout de lame, surtout sur pin traité sec. Les systèmes à clips cachés
          (Camo, Deckbone) donnent un rendu propre mais ajoutent 5–8 € par m². Coupez les
          extrémités au cordeau avec une scie circulaire après pose complète, pas avant.
        </p>

        <h3 className="content-h3">5. Ponçage et protection — ne pas brûler cette étape</h3>
        <p className="content-body">
          Poncez à la ponceuse orbitale, grain 80 puis 120, pour éliminer les échardes et
          unifier la surface. Appliquez l&apos;huile de finition ou la lasure bois extérieur dans
          le sens du fil, première couche, séchage 24 h, puis seconde couche. Le rythme
          d&apos;entretien ensuite : tous les 1–2 ans pour le pin, tous les 2–3 ans pour le
          douglas. Une terrasse jamais traitée ne &quot;tient&quot; pas moins longtemps — elle grisaille
          et se fissure, mais ne s&apos;effondre pas. En revanche, une terrasse traitée régulièrement
          reste propre et structurellement saine deux fois plus longtemps.
        </p>

        <h2 className="content-h2">Budget matériaux : ce que vous allez vraiment dépenser</h2>
        <p className="content-snippet">
          Pour 12&nbsp;m² de terrasse, total matériaux (lames + lambourdes + plots + visserie)&nbsp;:
          comptez 1&nbsp;080 à 1&nbsp;280&nbsp;€ en pin traité (90 à 107&nbsp;€/m²), 1&nbsp;190 à
          1&nbsp;430&nbsp;€ en douglas (99 à 119&nbsp;€/m²) ou 1&nbsp;800 à 2&nbsp;160&nbsp;€ en ipé
          (150 à 180&nbsp;€/m²). Hors livraison et outillage.
          Avec pose par artisan, ajoutez 40–60&nbsp;€/m² de main-d&apos;œuvre.
        </p>
        <p className="content-body">
          Les prix ci-dessous sont le total matériaux (lames, lambourdes 60×70 cl.4, plots réglables,
          vis inox A2, bande bitume, entretoises), calculés par notre simulateur d&apos;après les prix
          réels de notre base (Leroy Merlin, Castorama, Brico Dépôt, ManoMano). Hors outillage et
          livraison.
        </p>
        <Callout type="warn" title="Le poste plots pèse plus lourd qu&apos;on ne croit">
          Une terrasse sur plots réglables demande un appui tous les 60 cm sous chaque lambourde —
          71 plots pour 12 m², pas 15. À 5,50–8,90 € le plot réglable, ce seul poste représente
          390 à 630 €, soit 34 à 52 % du budget matériaux. C&apos;est le premier levier d&apos;économie :
          avec des plots d&apos;entrée de gamme à ~3 €, le total pin retombe autour de 730 à 865 €
          (61 à 72 €/m²). Beaucoup de devis trouvés en ligne sont bas parce qu&apos;ils comptent
          trois à cinq fois trop peu de plots.
        </Callout>

        <table className="content-table">
          <thead>
            <tr>
              <th>Niveau</th>
              <th>Essence</th>
              <th>Prix total / m²</th>
              <th>Pour 12 m²</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Économique</td>
              <td>Pin traité autoclave</td>
              <td>90–107 €/m²</td>
              <td>1 077 € en Brico Dépôt à 1 283 € en Leroy Merlin</td>
            </tr>
            <tr>
              <td>Standard</td>
              <td>Douglas</td>
              <td>99–119 €/m²</td>
              <td>1 192 € à 1 434 €</td>
            </tr>
            <tr>
              <td>Premium</td>
              <td>Ipé / Teck</td>
              <td>150–180 €/m²</td>
              <td>1 803 € à 2 163 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Si vous faites appel à un artisan pour la pose, ajoutez 40 à 60 €/m² de main-d&apos;œuvre.
          Les prix varient selon les enseignes et les périodes — Leroy Merlin et Brico Dépôt
          pratiquent régulièrement des remises de 20–30 % sur les lames en fin de saison
          (septembre–octobre). Pour le détail enseigne par enseigne et essence par essence,
          consultez notre{' '}
          <Link href="/guides/prix-terrasse-bois-m2-2026" className="content-link">
            comparatif prix terrasse bois 2026
          </Link>
          {' '}— quatre essences × quatre enseignes, avec et sans pose artisan. Si la terrasse
          entoure une piscine, voir aussi le{' '}
          <Link href="/guides/terrasse-piscine-bois" className="content-link">
            guide terrasse piscine
          </Link>
          {' '}(essences résistantes au chlore, antidérapance R11, sécurité NF P90-306).
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Comparateur d&apos;enseignes</p>
          <p className="content-cta-box-title">Obtenez un devis précis</p>
          <p className="content-cta-box-desc">
            Comparez les prix sur 4 enseignes (Leroy Merlin, Castorama, Brico Dépôt, ManoMano) — prix rafraîchis chaque lundi.
          </p>
          <a href="/calculateur" className="btn-primary">
            Calculer ma terrasse{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <AffiliatePartnerBlock module="terrasse" placement="guide" />

        <h2 className="content-h2">Questions fréquentes</h2>
        <p className="content-snippet">
          Terrasse de plain-pied sous 60&nbsp;cm&nbsp;: aucun permis requis. Au-delà de 20&nbsp;m²
          en zone urbaine, déclaration préalable (Cerfa 13703, délai 1 mois). Une terrasse bien
          entretenue dure 15–25 ans selon l&apos;essence&nbsp;; le contact direct avec la terre est
          interdit même pour un bois classe 4.
        </p>

        <h3 className="content-h3">Faut-il un permis de construire pour une terrasse de plain-pied ?</h3>
        <p className="content-body">
          Non. Une terrasse de plain-pied — hauteur inférieure à 60 cm du sol fini — ne nécessite
          aucun permis, quelle que soit sa surface. Au-dessus de 20 m² en zone urbaine, une
          déclaration préalable de travaux est requise : formulaire Cerfa 13703, à déposer en
          mairie, délai d&apos;instruction un mois. Consultez le PLU de votre commune avant de
          commencer : certains secteurs sauvegardés imposent des contraintes sur les matériaux
          ou les teintes, même pour une simple déclaration.
        </p>

        <h3 className="content-h3">Combien de temps dure une terrasse bois bien construite ?</h3>
        <p className="content-body">
          Comptez 15–25 ans selon l&apos;essence et la régularité de l&apos;entretien. Un pin traité
          autoclave huilé tous les 2 ans tient facilement 20 ans. Un douglas entretenu dépasse
          les 25 ans. Les bois exotiques certifiés FSC atteignent 40–50 ans sans entretien.
          L&apos;exposition compte autant que l&apos;essence : une terrasse couverte ou orientée nord
          vieillit deux fois moins vite qu&apos;une terrasse plein sud exposée aux UV toute la journée.
        </p>

        <h3 className="content-h3">Peut-on poser une terrasse bois directement sur la terre ?</h3>
        <p className="content-body">
          Non, jamais — même avec un bois traité classe 4. Le contact direct avec un sol humide
          accélère la dégradation fongique en créant une zone de stagnation permanente que
          l&apos;imprégnation ne suffit pas à contrer. La pose sur plots est obligatoire, avec
          5 cm minimum sous les lambourdes pour assurer la ventilation. Ce dégagement seul
          prolonge la durée de vie de la structure de 5 à 10 ans.
        </p>

        <Callout type="warn">
          Ne posez jamais les lambourdes directement sur la terre, même avec un bois traité classe 4&nbsp;: le contact avec un sol humide crée une stagnation permanente que l&apos;imprégnation ne suffit pas à arrêter. La pose sur plots, avec un dégagement de 5&nbsp;cm minimum sous les lambourdes pour la ventilation, n&apos;est pas une option — c&apos;est ce qui protège la structure dans la durée.
        </Callout>

        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: les liens vers Amazon ci-dessous sont sponsorisés
          (programme Partenaires Amazon). Si vous achetez via ces liens, DIY Builder peut percevoir une
          commission, sans surcoût pour vous. Notre sélection technique reste indépendante — voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <GuideToolsBlock module="terrasse" />

        <h2 className="content-h2">Approfondir votre projet terrasse</h2>
        <p className="content-body">
          Trois angles complémentaires si vous voulez creuser un aspect précis :
        </p>
        <ul className="content-body">
          <li><strong><Link href="/guides/prix-terrasse-bois-m2-2026">Prix terrasse bois m² 2026</Link></strong> — comparatif chiffré 4 essences × 4 enseignes (LM, Casto, BD, ManoMano) avec écarts en %.</li>
          <li><strong><Link href="/guides/terrasse-piscine-bois">Terrasse bois autour d&apos;une piscine</Link></strong> — antidérapance R11, NF P90-306, essences résistantes au chlore et au sel.</li>
          <li><strong><Link href="/guides/soi-meme-ou-pro">Faire soi-même ou faire faire</Link></strong> — 5 critères chiffrés pour décider DIY vs artisan selon votre projet.</li>
        </ul>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/dalle-clipsable-terrasse-balcon-sans-travaux">Dalle clipsable terrasse et balcon</Link> — la solution sans vis ni béton, posée sur sol existant</li>
            <li><Link href="/guides/terrasse-composite-ou-bois">Terrasse composite ou bois</Link> — comparatif prix au m², durée de vie, entretien et glissance pour choisir la matière</li>
            <li><Link href="/guides/cabanon">Guide cabanon</Link> — ossature et toiture mono-pente</li>
            <li><Link href="/guides/pergola">Guide pergola</Link> — poteaux et chevrons</li>
            <li><Link href="/faq">FAQ</Link> — 24 questions techniques (entraxes, prix, réglementation)</li>
            <li><Link href="/calculateur">Calculateur terrasse</Link> — devis matériaux + plan</li>
          </ul>
        </aside>

        <CTALead projectHref="/calculateur" projectLabel="ma terrasse" />

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
          <p className="content-cta-box-title">Prêt à calculer votre terrasse ?</p>
          <p className="content-cta-box-desc">
            Le simulateur calcule lames, lambourdes, plots et budget en 30 secondes.
            Comparez les enseignes et exportez votre devis en PDF.
          </p>
          <a href="/calculateur" className="btn-primary">
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
