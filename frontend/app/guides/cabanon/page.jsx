import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Comment construire un cabanon ossature bois : guide DTU 2025 | DIY Builder',
  description:
    'Guide complet pour construire un cabanon bois : ossature, montants, toiture mono-pente. Calculs DTU, liste de matériaux et estimatif de budget inclus.',
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
    minValue: '600',
    maxValue: '3000',
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
      text: "Assembler les montants 45×90 mm à entraxe 60 cm entre lisse basse et lisse haute. Doubler les angles, poser les king studs et jack studs autour des ouvertures, puis contreventer chaque face avec du panneau OSB ou des écharpes métalliques.",
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

        <p className="content-lead">
          Un cabanon de jardin en ossature bois, ça se monte en un week-end si la préparation est
          sérieuse — ou ça traîne six mois si elle ne l'est pas. Entre 6 et 20 m², la structure
          reste accessible : ossature 45×90 mm à entraxe 60 cm, toiture mono-pente, bardage ventilé.
          Ce guide suit le DTU 31.2 et couvre les points qui font vraiment la différence sur le
          chantier : dimensionnement des montants, règles autour des ouvertures, pentes à respecter,
          et les erreurs classiques qu'on voit trop souvent sur les forums DIY.
        </p>

        <h2 className="content-h2">L'ossature bois : ce qu'il faut vraiment comprendre</h2>
        <p className="content-body">
          Le platform frame, c'est simple dans le principe : des montants verticaux coincés entre
          une lisse basse et une lisse haute, le tout raidi par des panneaux de contreventement.
          Ce qui pêche le plus souvent chez les bricoleurs, c'est de négliger le contreventement —
          et de découvrir que leur cabanon oscille au premier coup de vent.
        </p>

        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Principe structurel :</strong> les montants reprennent les charges verticales
            (toiture, neige), les panneaux OSB 12 mm ou les écharpes métalliques absorbent les
            efforts horizontaux (vent). Sans contreventement, l'ossature est un château de cartes.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Section standard :</strong> 45 × 90 mm pour un abri non isolé — c'est la
            section vendue partout en GSB. Si vous intégrez une isolation laine de bois ou laine de
            verre entre les montants, passez en 45 × 145 mm dès le départ, ça coûte moins cher que
            de refaire.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Entraxe montants :</strong> 60 cm, pas 61, pas 58. C'est l'entraxe du DTU 31.2,
            et c'est aussi la largeur modulaire des panneaux OSB et des rouleaux d'isolant. Tricher
            de quelques centimètres oblige à retailler chaque panneau — une perte de temps inutile.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Doublage des angles :</strong> chaque coin reçoit deux montants assemblés en L.
            C'est là que le bardage extérieur et le panneau intérieur trouvent leur appui de clouage.
            Un seul montant en angle, c'est une erreur qu'on paie à la pose du bardage.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Ouvertures :</strong> porte ou fenêtre, même règle — deux king studs pleine
            hauteur, deux jack studs trimmer arrêtés sous le linteau, et un linteau horizontal
            dimensionné selon la portée. Pour une porte de 90 cm, un double 45 × 145 posé de champ
            suffit largement.
          </li>
        </ul>

        <h2 className="content-h2">Calcul des matériaux</h2>
        <p className="content-body">
          Pour un cabanon 3 × 2 m, hauteur 2,30 m, toiture mono-pente — voici ce qu'il faut
          commander. Attention : ces quantités sont brutes. Prévoyez toujours 10 % de chutes
          supplémentaires sur le bardage et les voliges.
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Montants 45 × 90 × 2 400 mm :</strong> 12 à 14 pièces — 4 coins × 2 montants,
            plus les intermédiaires façades et pignons. Les king/jack studs autour des ouvertures
            s'ajoutent en sus selon votre plan.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lisses basses :</strong> 2 longueurs de 3 m + 2 de 2 m, obligatoirement en
            traité classe 4. La classe 3 tient quelques années puis pourriture garantie au contact
            du béton humide.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lisses hautes :</strong> mêmes longueurs, doublées sur les murs porteurs de
            toiture pour former la sablière. C'est ce doublement qui répartit la charge des chevrons.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Chevrons de toit :</strong> 5 à 6 chevrons 45 × 145 mm. Longueur = profondeur
            du cabanon + débord d'égout (40 à 60 cm recommandé pour tenir les murs au sec). Ne
            lésinez pas sur le débord : chaque centimètre gagne en protection.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Bardage :</strong> périmètre × hauteur moyenne + 10 % de chutes. Pour ce
            cabanon : (3+2+3+2) × 2,50 × 1,10 ≈ 27 m². Toujours arrondir à la planche supérieure.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Voliges de toiture :</strong> surface de couverture (3 × 2 m + débords) en
            planche 18 mm, joint à couvrir ou feuillure. Pas de 12 mm : trop flexible sous la neige.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Quincaillerie :</strong> équerres de charpente, vis inox 4 × 60 et 6 × 120,
            sabots d'ancrage pour lisses basses, clous annelés pour OSB. Ne pas sous-doser la
            quincaillerie — c'est ce qui tient la structure ensemble.
          </li>
        </ul>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Calculateur gratuit</p>
          <p className="content-cta-box-title">Obtenez la liste exacte pour votre cabanon</p>
          <p className="content-cta-box-desc">
            Entrez vos dimensions et le simulateur génère la BOM complète avec quantités et
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

        <h3 className="content-h3">1. Fondations</h3>
        <p className="content-body">
          La fondation, c'est là que ça se joue. Pas le plus glamour à poster sur les réseaux,
          mais 80 % des cabanons qui bougent ou pourrissent ont un problème de fondation à la base.
          Trois options : la dalle béton armée (10 cm d'épaisseur sur 10 cm de gravier drainant)
          — la plus rigide, indispensable au-delà de 9 m². Les plots béton coulés en place
          (30 × 30 × 40 cm), un par angle et tous les 1,5 m — rapide, économique, efficace pour
          les petits formats. Ou la plateforme sur plots réglables acier galvanisé — idéale sur
          terrain pentu ou pour une installation déplaçable. Dans tous les cas : le bois ne touche
          jamais la terre nue.
        </p>

        <h3 className="content-h3">2. Lisse basse</h3>
        <p className="content-body">
          Bois traité autoclave classe 4 — pas classe 2, pas classe 3. La lisse basse est en
          contact permanent avec l'humidité du béton ; sous-doser le traitement, c'est se retrouver
          à refaire la base dans cinq ans. Intercalez un joint mousse PE 10 mm ou une bande
          caoutchouc entre la lisse et la dalle pour couper la remontée capillaire. Fixez avec des
          chevilles M12 ou des tiges filetées noyées dans le béton frais, espacement 60 cm.
          Vérifiez la planéité et l'équerrage avec la méthode 3-4-5 avant de lever quoi que ce
          soit : un millimètre de travers ici devient deux centimètres en haut de l'ossature.
        </p>

        <h3 className="content-h3">3. Montage de l'ossature</h3>
        <p className="content-body">
          Assemblez les cadres de mur à plat au sol — c'est dix fois plus facile que de travailler
          debout avec un marteau levé. Redressez-les ensuite et maintenez-les avec des étrésillons
          pendant la fixation. Ordre : les deux murs longs d'abord (façade et pignon arrière), puis
          les pignons qui viennent s'emboîter. Chaque angle se serre avec des vis 6 × 120 en
          quinconce. Panneaux OSB 12 mm ensuite, cloués à 10 cm sur les rives et 20 cm en milieu
          de montant — c'est le contreventement, ne bâclez pas la fixation. Autour des ouvertures :
          king studs pleine hauteur, jack studs arrêtés sous linteau, linteau double 45 × 145 de
          champ pour une porte de 90 cm.
        </p>

        <h3 className="content-h3">4. Toiture mono-pente</h3>
        <p className="content-body">
          15 % de pente, c'est le minimum légal — mais sur le terrain, 20 à 30 % est ce qui
          fonctionne vraiment sans problème d'évacuation des eaux en automne ou sous la neige.
          Pour 3 m de profondeur à 20 %, ça donne 60 cm de dénivelé entre le côté haut et le
          côté bas. Posez les chevrons sur la sablière haute côté faîtage et sur la lisse basse
          d'égout, vérifiez que chaque chevron repose bien sur ses appuis. Voliges 18 mm
          perpendiculaires aux chevrons, puis écran sous-toiture HPV (hautement perméable à la
          vapeur — pas un simple pare-vapeur). Couverture selon budget et style : bac acier
          (pose rapide, résistant), shingles bitumés (look chalet, plus coûteux à poser),
          tuiles légères sur liteaux (le plus lourd à transporter).
        </p>

        <h3 className="content-h3">5. Bardage et finitions</h3>
        <p className="content-body">
          Le bardage sans lame d'air, c'est une erreur classique. Les lames humides gonflent,
          l'eau s'accumule derrière, la pourriture s'installe. La règle : chevrons de contre-lattage
          27 × 40 mm verticaux sur l'OSB, lame d'air de 20 mm minimum, puis lames de bardage
          classe 3b au minimum (classe 4 recommandé si exposition directe à la pluie). Pose
          horizontale à clin, feuillurée, ou verticale breton-bretonné — chacun son rendu.
          Deux couches de lasure microporeuse après pose, encadrements calfeutrés au silicone
          neutre, cornières d'angle de finition. La menuiserie s'installe en dernier, une fois
          les murs stables.
        </p>

        <h2 className="content-h2">Budget à prévoir</h2>
        <p className="content-body">
          Ces estimations couvrent les matériaux bruts — bois d'ossature, couverture, bardage,
          quincaillerie — hors fondations et menuiseries (porte, fenêtre).
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
              <td>600 – 900 €</td>
            </tr>
            <tr>
              <td>Moyen</td>
              <td>9 m² (3 × 3 m)</td>
              <td>1 200 – 1 800 €</td>
            </tr>
            <tr>
              <td>Grand</td>
              <td>15 m² (5 × 3 m)</td>
              <td>2 000 – 3 000 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Ajoutez 100 à 400 € pour les fondations selon la solution choisie (plots coulés vs dalle
          armée). Si vous faites appel à un artisan pour certaines étapes, comptez 60 à 90 €/h —
          les charpentiers qualifiés sont en tension, prenez date tôt.
        </p>

        <h2 className="content-h2">Réglementation</h2>
        <p className="content-body">
          En France, les démarches dépendent directement de la surface de plancher :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Moins de 5 m² :</strong> rien à déclarer, quel que soit l'emplacement. C'est
            la seule tranche vraiment libre.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>5 à 20 m² :</strong> déclaration préalable de travaux, formulaire Cerfa 13703,
            à déposer en mairie. Délai d'instruction : 1 mois. Ne sautez pas cette étape — un
            voisin mécontent peut déclencher un contrôle et une mise en demeure de démolir.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Plus de 20 m² :</strong> permis de construire obligatoire, délai d'instruction
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

        <h3 className="content-h3">Quelle pente de toit pour un cabanon ?</h3>
        <p className="content-body">
          15 % en absolu minimum — en dessous, l'eau stagne sur la couverture et finit par
          s'infiltrer même avec un bon écran sous-toiture. En pratique, 20 à 30 % est ce que
          je recommande systématiquement : ça gère les feuilles mortes en automne, la neige
          en hiver, et les averses horizontales. Concrètement, pour un cabanon de 3 m de
          profondeur à 20 % de pente, la différence de hauteur entre le côté haut et le côté
          bas est de 60 cm. Côté faîtage : lisse haute à 2,30 m. Côté égout : 1,70 m. Pensez
          à l'ergonomie à l'intérieur — trop pentu et vous vous cognez la tête du mauvais côté.
        </p>

        <h3 className="content-h3">Peut-on enterrer les poteaux directement dans la terre ?</h3>
        <p className="content-body">
          Non, et c'est non sans exception. Même un bois traité classe 4, en contact permanent
          avec un sol humide, commence à se dégrader en 5 à 8 ans selon les conditions. La
          technique correcte : ancrage sur dalle ou plot via sabot métallique galvanisé ou platine
          boulonnée. C'est explicitement interdit dans le DTU 31.2, et tous les fabricants de bois
          traité le précisent dans leurs fiches techniques. J'ai vu des cabanons neufs déjà
          branlants après trois hivers parce que les montants avaient été plantés directement
          dans la terre. Ne faites pas ça.
        </p>

        <h3 className="content-h3">Faut-il isoler un cabanon de jardin ?</h3>
        <p className="content-body">
          Réglementairement non — la RE 2020 ne s'applique qu'aux bâtiments d'habitation, pas
          aux abris de jardin. Mais la vraie question c'est : à quoi va servir votre cabanon ?
          Si c'est un stockage de tondeuse, oubliez l'isolation. Si c'est un atelier ou un
          espace de travail, 80 mm de laine de bois entre des montants 45 × 90 mm change
          radicalement le confort thermique et acoustique. Surcoût : 15 à 25 €/m² pour la laine
          plus un pare-vapeur côté chaud. C'est une décision à prendre avant de commander les
          montants — pas après, quand vous réalisez que 45 × 90 mm ne loge pas 100 mm d'isolant.
        </p>

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
