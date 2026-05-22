import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Méthodologie DIY Builder : comment nos calculs et prix sont validés',
  description:
    'Comment DIY Builder calcule les quantités de matériaux (DTU 31.2, DTU 51.4, Eurocode 5), met à jour les prix Castorama/Leroy Merlin/Brico Dépôt/ManoMano, et assume sa signature collective anonyme.',
  alternates: { canonical: 'https://www.diy-builder.fr/methodologie' },
  openGraph: {
    title: 'Méthodologie DIY Builder : comment nos calculs et prix sont validés',
    description:
      'Détail complet de notre méthode : normes DTU de référence, constantes structurelles, fréquence de mise à jour des prix et politique de révision éditoriale.',
    url: 'https://www.diy-builder.fr/methodologie',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr' },
    { '@type': 'ListItem', position: 2, name: 'Méthodologie', item: 'https://www.diy-builder.fr/methodologie' },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Méthodologie DIY Builder : comment nos calculs et prix sont validés',
  url: 'https://www.diy-builder.fr/methodologie',
  description:
    'Comment DIY Builder calcule les quantités de matériaux, met à jour les prix et assume sa signature collective.',
  dateModified: '2026-05-16',
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    url: 'https://www.diy-builder.fr',
  },
};

export default function MethodologiePage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Méthodologie</span>
        </nav>

        <h1 className="content-h1">
          Méthodologie DIY Builder&nbsp;: comment nos calculs et prix sont validés
        </h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 16 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/sources">Sources DTU</Link></span>
        </p>

        <p className="content-lead">
          DIY Builder publie sous une signature collective et sans auteur individuel nominatif.
          Ce choix est assumé — il reflète un travail d&apos;équipe et évite les biais de réputation
          personnelle sur des contenus techniques. En contrepartie, cette page détaille précisément
          les normes de référence, les constantes utilisées dans les calculs et la façon dont les
          prix sont obtenus. Transparence sur la méthode plutôt que sur l&apos;identité.
        </p>

        <h2 className="content-h2">Pourquoi cette page existe</h2>
        <p className="content-body">
          Sur un site YMYL (Your Money or Your Life au sens Google, mais aussi au sens concret :
          une ossature mal calculée peut s&apos;effondrer), l&apos;absence d&apos;auteur nommé est un signal
          d&apos;alerte habituel. La parade n&apos;est pas d&apos;inventer un auteur fictif — c&apos;est de montrer
          comment les calculs sont construits, quelles normes ils suivent, et comment les erreurs
          peuvent être signalées.
        </p>
        <p className="content-body">
          Les quatre simulateurs (terrasse, cabanon, pergola, clôture) génèrent des listes de
          matériaux et des estimatifs de budget. Ces chiffres sont utilisés par des particuliers
          pour commander du bois, des vis et du béton. Une erreur de quantitatif se retrouve
          sur un bon de commande. C&apos;est la raison pour laquelle la méthode doit être vérifiable.
        </p>

        <h2 className="content-h2">D&apos;où viennent les calculs DTU</h2>
        <p className="content-body">
          Les moteurs de calcul (fichiers <code>modules/*/engine.js</code> et <code>lib/</code>)
          implémentent les règles issues de quatre normes principales. Voici les correspondances
          directes entre les constantes du code et leur source normative.
        </p>

        <h3 className="content-h3">Module cabanon — NF DTU 31.2 P1-1 (mai 2019)</h3>
        <p className="content-body">
          La norme de référence pour l&apos;ossature bois à voile travaillant (dite à plate-forme).
          Deux constantes structurelles en découlent directement :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>STUD_SPACING = 0,60 m</strong> — DTU 31.2 §9.2.1 fixe l&apos;entraxe maximum
            des montants à 60 cm pour une ossature non calculée. C&apos;est aussi l&apos;entraxe
            modulaire des panneaux OSB 122 × 244 cm et des rouleaux d&apos;isolant standard.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>SECTION = 0,095 m (95 × 95 mm)</strong> — DTU 31.2 §9.1.1.2 impose une
            largeur minimale de 95 mm à l&apos;humidité de service pour les montants d&apos;ossature.
            Cette valeur est validée pour les cabanons jusqu&apos;à 2,60 m de hauteur, entraxe
            60 cm, en zones de neige 1A/1B et de vent 1/2. Au-delà, un bureau d&apos;études
            structure est nécessaire.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>LINTEL_H = 0,12 m</strong> — DTU 31.2 §9.2.3.1 exige une justification
            mécanique des linteaux. La valeur forfaitaire de 12 cm est validée pour les portées
            inférieures à 1,20 m (porte 0,9 m et fenêtre 0,6 m par défaut dans le simulateur).
            Au-delà, un calcul Eurocode 5 (NF EN 1995-1-1) est requis.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>OSB_THICKNESS = 0,009 m (9 mm)</strong> — DTU 31.2 §9.2.2 : épaisseur
            minimale OSB 3 pour le voile de contreventement en classe de service 2. Le format
            commercial 122 × 244 cm est utilisé pour calculer le nombre de panneaux nécessaires.
          </li>
        </ul>
        <p className="content-body">
          La toiture mono-pente suit NF DTU 31.1 P1-1 (juin 2017) pour les principes de
          charpente, avec <strong>SLOPE_RATIO = 0,268</strong> (angle ~15°, pente minimale
          pour une couverture bois selon DTU 31.1). Le coefficient <strong>ROOF_COEF = 1,10</strong>
          est un facteur de perte matériaux (chutes, recouvrements) — il ne modifie pas la
          géométrie 3D, uniquement les quantités commandées.
        </p>
        <p className="content-body">
          Les panneaux OSB de contreventement suivent DTU 31.2 §9.2.2 : OSB 3 minimum
          (classe de service 2), clouage à 10 cm sur les rives et 20 cm en milieu de montant.
        </p>

        <h3 className="content-h3">Module pergola — NF DTU 31.1 et NF EN 1995-1-1</h3>
        <p className="content-body">
          La pergola n&apos;est pas une charpente couverte au sens strict du DTU, mais le simulateur
          applique les règles de dimensionnement issues de DTU 31.1 et de l&apos;Eurocode 5 (NF EN
          1995-1-1) pour les sections et portées :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>RAFTER_SPACING = 0,60 m</strong> — entraxe chevrons conforme DTU 31.1.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>MAX_POST_SPAN = 3,50 m</strong> — portée libre maximale entre poteaux.
            Au-delà, la flèche dépasse L/300 (limite NF EN 1995-1-1) pour une section
            50 × 80 mm. Le simulateur passe automatiquement à 50 × 100 mm au-delà de 3,5 m
            de profondeur.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>OVERHANG = 0,15 m</strong> — porte-à-faux chevron de chaque côté,
            conforme NF DTU 31.1 §5.10.4.1.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>FOOT_CLEARANCE = 0,15 m</strong> — distance minimale pied de poteau
            depuis le sol naturel, conforme DTU 31.1 §5.10.4.2 (≥ 150 mm depuis sol
            naturel, ≥ 100 mm depuis nu supérieur plot béton).
          </li>
        </ul>

        <h3 className="content-h3">Module clôture — DTU 31.1 et règles empiriques chantier</h3>
        <p className="content-body">
          Les clôtures bois ne disposent pas d&apos;un DTU dédié. Les constantes du simulateur
          suivent DTU 31.1 pour les poteaux et des règles empiriques de chantier pour les rails
          et lames :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>POST_SPACING = 2,00 m</strong> — entraxe standard des poteaux de clôture
            en bois (au-delà de 2 m, les rails fléchissent visiblement sous leur propre poids).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>FOOT_EMBED = 0,50 m</strong> — profondeur d&apos;ancrage minimale. La règle
            empirique du chantier dit 1/3 de la hauteur hors-sol, soit 0,50 m pour une
            clôture de 1,50 m (DEFAULT_HEIGHT). Le code applique <code>max(FOOT_EMBED, clotureHeight / 3)</code>.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>FOOT_CLEARANCE_MIN = 0,15 m</strong> — clearance bois de bout depuis
            le sol, DTU 31.1 §5.10.4.2. Les poteaux directement dans le sol sont en
            classe d&apos;emploi 4 (UC4) selon NF EN 335, ce qui impose un bois traité autoclave.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>CONCRETE_BAGS_PER_POST = 1</strong> — un sac 25 kg par poteau est la
            pratique standard pour FOOT_EMBED = 0,50 m en sol normal.
          </li>
        </ul>

        <h3 className="content-h3">Module terrasse — NF DTU 51.4 et DTU 13.3</h3>
        <p className="content-body">
          Le moteur terrasse (<code>lib/deckEngine.js</code>) implémente NF DTU 51.4 P1-2
          (revêtements de sol en bois) pour le dimensionnement des lames et lambourdes,
          et NF DTU 13.3 P1-2 (dallages) pour les plots béton. Ces fichiers sont figés
          (source de vérité validée, non modifiable) — leur contenu est documenté dans
          les constantes <code>lib/deckConstants.js</code>.
        </p>
        <p className="content-body">
          Le facteur de chutes de 10 % (<code>WOOD_WASTE_FACTOR = 1,10</code>) est appliqué
          dans <code>lib/costCalculator.js</code> uniquement — les moteurs retournent des
          quantités brutes théoriques. Ce découpage garantit qu&apos;un seul endroit dans le
          code contrôle la marge de chutes.
        </p>

        <h2 className="content-h2">Comment les prix sont mis à jour</h2>
        <p className="content-body">
          Le fichier <code>lib/materialPrices.js</code> est la source unique de tous les
          prix affichés dans les comparatifs d&apos;enseignes. Quatre enseignes sont couvertes :
          Leroy Merlin, Castorama, Brico Dépôt et ManoMano.
        </p>
        <p className="content-body">
          Les prix sont relevés par scraping automatisé (scripts Python dans <code>scripts/</code>),
          puis vérifiés manuellement avant d&apos;être intégrés. Chaque entrée de prix porte
          un flag <code>scraped: true</code> (vérifié directement en ligne) ou
          <code>scraped: false</code> (estimé, à confirmer). La dernière mise à jour complète
          date du 7 mai 2026 (constante <code>PRICES_DATE = &apos;2026-05-07-v2&apos;</code>).
        </p>
        <p className="content-body">
          La fréquence cible est mensuelle pour les produits les plus courants (montants,
          lames, plots), trimestrielle pour les produits de quincaillerie dont les prix
          varient peu. Les prix Brico Dépôt et Leroy Merlin sont en tension — si Chrome
          est indisponible pour le scraping automatique, les données existantes sont
          conservées avec leur date de dernière vérification plutôt que remplacées
          par des estimés.
        </p>
        <p className="content-body">
          Un écart de prix constaté ? Signalez-le via <Link href="/contact">la page contact</Link>.
          Nous corrigeons sous 7 jours ouvrés.
        </p>

        <h2 className="content-h2">Comment on signe collectivement</h2>
        <p className="content-body">
          Les contenus éditoriaux (guides, FAQ, cette page) sont produits par l&apos;équipe
          DIY Builder et signés &quot;L&apos;équipe DIY Builder&quot;. Il n&apos;y a pas d&apos;auteur individuel
          associé à chaque article — ni fictif, ni réel mais non divulgué. Ce choix tient
          à deux raisons : d&apos;une part le contenu technique est revu collectivement avant
          publication, d&apos;autre part les simulateurs (la vraie valeur ajoutée du site) sont
          du code, pas de la prose personnelle.
        </p>
        <p className="content-body">
          Le directeur de publication légal est identifié dans les <Link href="/mentions-legales">mentions légales</Link>.
          Pour tout droit de réponse ou signalement d&apos;erreur factuelle, <Link href="/contact">écrivez-nous</Link>.
          Les corrections factuelles sont appliquées et l&apos;article est re-daté.
        </p>

        <h2 className="content-h2">Comment les articles sont révisés</h2>
        <p className="content-body">
          Chaque page porte une date &quot;Mis à jour le&quot; visible dans le bloc <code>content-meta</code>.
          La politique est la suivante :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Révision déclenchée</strong> : dès qu&apos;une norme DTU référencée est
            révisée, dès qu&apos;une constante du moteur change, ou suite à un signalement d&apos;erreur.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Révision semestrielle</strong> : tous les six mois, vérification que les
            seuils réglementaires (urbanisme, RE 2020 si applicable) n&apos;ont pas changé.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Révision prix</strong> : mensuelle pour <code>lib/materialPrices.js</code>,
            indépendante du cycle éditorial des articles.
          </li>
        </ul>
        <p className="content-body">
          La date affichée correspond à la dernière modification substantielle — pas à un
          re-post automatique pour la fraîcheur SEO. Un article non modifié garde sa date
          originale.
        </p>

        <h2 className="content-h2">Notre engagement transparence affiliation</h2>
        <p className="content-body">
          Certains liens vers les enseignes partenaires sont des liens d&apos;affiliation.
          Lorsqu&apos;un utilisateur clique et réalise un achat dans la fenêtre d&apos;attribution,
          DIY Builder perçoit une commission (variable selon l&apos;enseigne et la catégorie
          de produit). Le prix payé par l&apos;acheteur est identique avec ou sans lien affilié.
        </p>
        <p className="content-body">
          Le détail complet des programmes actifs, des mécanismes de suivi et de nos
          règles éditoriales en matière d&apos;affiliation est dans la{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>. Cette page-ci
          traite uniquement de la méthode de calcul et d&apos;écriture.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/sources">Sources DTU et normes citées</Link></li>
            <li><Link href="/charte-affiliation">Charte d&apos;affiliation</Link></li>
            <li><Link href="/a-propos">À propos de DIY Builder</Link></li>
            <li><Link href="/contact">Nous contacter / signaler une erreur</Link></li>
          </ul>
        </aside>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Essayez les simulateurs</p>
          <p className="content-cta-box-title">Calculateurs gratuits — terrasse, cabanon, pergola, clôture</p>
          <p className="content-cta-box-desc">
            Liste de matériaux, comparatif de prix par enseigne et visualisation 3D.
            Export PDF inclus.
          </p>
          <a href="/" className="btn-primary">
            Voir les simulateurs{' '}
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
