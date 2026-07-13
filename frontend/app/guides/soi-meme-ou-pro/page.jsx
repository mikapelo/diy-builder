import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import PullQuote from '@/components/content/PullQuote';
import Callout from '@/components/content/Callout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Faire soi-même ou faire faire';
const OG_SUBTITLE = '5 critères pour décider — bois & béton';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide`;

export const metadata = {
  title: 'Faire soi-même ou faire faire : 5 critères pour décider',
  description:
    'Surface, risque structurel, outillage, garantie décennale, temps : les 5 critères chiffrés pour savoir si votre projet bois ou béton se prête à l\'autoconstruction ou à un artisan.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/soi-meme-ou-pro' },
  openGraph: {
    title: 'Faire soi-même ou faire faire — guide de décision | DIY Builder',
    description:
      'Cinq critères chiffrés pour trancher entre autoconstruction et appel à un artisan, projet par projet.',
    url: 'https://www.diy-builder.fr/guides/soi-meme-ou-pro',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Faire soi-même ou faire faire — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Faire soi-même ou faire faire : 5 critères pour décider',
  description:
    'Guide de décision pour les projets de construction bois et béton : surface, technicité DTU, outillage nécessaire, garantie décennale, coût d\'opportunité du temps.',
  datePublished: '2026-05-24',
  dateModified: '2026-05-24',
  author: {
    '@type': 'Organization',
    name: "L'équipe DIY Builder",
    url: 'https://www.diy-builder.fr/a-propos',
  },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.diy-builder.fr/logo-diy-builder.png',
    },
  },
  image: OG_URL,
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/soi-meme-ou-pro',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Faire soi-même ou faire faire', item: 'https://www.diy-builder.fr/guides/soi-meme-ou-pro' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Est-ce vraiment moins cher de faire soi-même ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sur les matériaux seuls, oui : souvent 40 à 60 % de moins qu'un artisan tout compris. Sur le total réel, l'écart se resserre quand on intègre l'outillage à acheter, les chutes, les reprises et le temps. Pour une terrasse de 15 m² en pin classe 4, le simulateur DIY Builder donne 550 à 700 € de matériaux (prix scrapés Leroy Merlin / Brico Dépôt / Castorama, mai 2026), auxquels s'ajoutent 340 à 820 € d'outillage si vous partez de zéro, contre 1 200 à 2 100 € chez un artisan main d'œuvre comprise (tarif 2026 : 80 à 140 €/m² pose incluse). À partir du deuxième projet, l'outillage est amorti et l'autoconstruction devient nettement gagnante.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quels projets sont vraiment risqués en autoconstruction ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Trois familles : les ouvrages qui portent une charge (ossature de cabanon de plus de 9 m², charpente de pergola au-delà de 4 m de portée, extension), les ouvrages dont la défaillance affecte la maison (dalle armée sous cabanon, étanchéité de toiture, raccordement eau ou électricité), et les ouvrages soumis à décennale. Pour ces cas, l'erreur de calcul ne se voit pas tout de suite, mais elle coûte beaucoup plus cher que le gain à faire soi-même au moment où elle se manifeste.",
      },
    },
    {
      '@type': 'Question',
      name: 'Faut-il déclarer un projet fait soi-même ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, les mêmes règles s'appliquent. Moins de 5 m² au sol : aucune démarche. De 5 à 20 m² : déclaration préalable de travaux (Cerfa 13703), instruction 1 mois. Au-delà de 20 m² : permis de construire, instruction 2 mois. L'autoconstruction ne dispense d'aucune autorisation. Un voisin mécontent peut signaler un chantier non déclaré et déclencher une mise en demeure.",
      },
    },
    {
      '@type': 'Question',
      name: 'Si je commence en autoconstruction et que je bloque, que faire ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Faire reprendre par un artisan est possible, mais sa garantie décennale ne couvrira que sa propre intervention, pas la partie déjà réalisée. Mieux vaut anticiper : faire le gros œuvre par un pro et finir soi-même, ou l'inverse. Si vous bloquez en cours, prévenez tôt l'artisan que vous avez démarré, photos à l'appui. Un pro sérieux refusera parfois de reprendre un chantier dont il n'a pas vu le sous-jacent.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment trouver un artisan fiable rapidement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Trois canaux qui marchent : le bouche-à-oreille local (demandez aux voisins qui a fait leur terrasse), les groupes Facebook locaux du type « artisan + ville », et les plateformes de mise en relation, en gardant à l'esprit qu'elles prélèvent une commission et que la qualification varie. Vérifiez toujours : SIRET en cours, attestation décennale valide pour l'année et le type de travaux, et 2 ou 3 chantiers récents à appeler pour avoir un retour direct.",
      },
    },
  ],
};

export default function GuideSoiMemeOuPro() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <a href="/guides">Guides</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Faire soi-même ou faire faire</span>
        </nav>

        <h1 className="content-h1">Faire soi-même ou faire faire : 5 critères pour décider</h1>

        <p className="content-meta">
          <span><strong>Publié le 24 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources DTU</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/soi-meme-ou-pro/hero.png"
            alt="Établi en bois en plein air avec outillage DIY étalé : perceuse-visseuse 18V, scie circulaire, scie sauteuse, niveau laser, équerre, mètre, gants et lunettes — ambiance jardin lumière dorée"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Cinq critères suffisent à trancher : la surface du chantier, le risque structurel,
          l&apos;outillage que vous avez ou non, le besoin d&apos;une garantie décennale, et
          le temps que vous pouvez vraiment y mettre. Sous 10 m², avec une perceuse-visseuse
          et un weekend de libre, vous faites tout. Au-delà, ou dès qu&apos;il y a portage,
          dalle armée ou raccordement, le calcul change vite.
        </p>

        <section>
          <p className="content-body">
            La question revient à chaque projet : on s&apos;y met ou on appelle un pro ?
            La réponse honnête est rarement noire ou blanche. Une terrasse de 12 m², la plupart
            des bricoleurs la posent eux-mêmes en deux weekends. Une dalle béton armée sous
            un cabanon de 18 m², le rapport bénéfice-risque s&apos;inverse : la dalle conditionne
            dix ans de stabilité, et un sabot d&apos;ancrage qui bouge se voit dans la fissure
            du bardage trois ans plus tard.
          </p>
          <p className="content-body">
            Ce guide pose les cinq critères qu&apos;on a vus peser le plus dans la décision.
            Pas une grille morale, pas un discours « faites confiance aux pros ». Des chiffres,
            des seuils réglementaires, et les cas concrets où basculer.
          </p>
        </section>

        <h2 className="content-h2">Critère 1 — La surface change tout</h2>
        <p className="content-snippet">
          Sous 5 m² : aucune démarche, n&apos;importe quel bricoleur s&apos;en sort.
          De 5 à 20 m² : déclaration préalable (Cerfa 13703, instruction 1 mois), zone
          confortable de l&apos;autoconstruction ambitieuse. Au-delà de 20 m² : permis
          de construire obligatoire, 2 mois d&apos;instruction, et le projet mobilise 3
          à 6 mois de vie.
        </p>
        <p className="content-body">
          Le premier critère est aussi le plus mesurable. La surface conditionne trois choses
          en cascade : la quantité de matériaux à manipuler, la déclaration administrative
          à déposer, et la fenêtre de tir pour finir avant l&apos;hiver.
        </p>
        <p className="content-body">
          En dessous de 5 m² (un petit abri à outils par exemple), aucune démarche, aucune
          complication. Un weekend suffit, une erreur de calcul se paie 50 €, tout le monde
          peut s&apos;y mettre.
        </p>
        <p className="content-body">
          De 5 à 20 m², on entre dans la zone confortable de l&apos;autoconstruction ambitieuse.
          Déclaration préalable de travaux à déposer en mairie (formulaire{' '}
          <a href="https://www.service-public.fr/particuliers/vosdroits/F662" target="_blank" rel="noopener noreferrer" className="content-link">Cerfa 13703</a>,
          délai d&apos;instruction 1 mois), rien d&apos;insurmontable. C&apos;est aussi la
          fourchette où la plupart des cabanons de jardin tombent : 9 m² pour un format
          standard, 15 m² pour un atelier confortable. Le{' '}
          <Link href="/cabanon" className="content-link">simulateur cabanon</Link>{' '}
          couvre exactement cette tranche.
        </p>
        <p className="content-body">
          Au-delà de 20 m², permis de construire obligatoire et le projet change de nature.
          Le délai d&apos;instruction passe à 2 mois, le recours à un architecte devient
          obligatoire au-delà de 150 m². Pour la grande majorité des bricoleurs, c&apos;est
          le seuil où l&apos;on commence à arbitrer en faveur du pro, pas par incompétence
          mais parce que le projet mobilise un volume de travail qui empiète sur la vie
          professionnelle ou familiale pendant 3 à 6 mois.
        </p>

        <h2 className="content-h2">Critère 2 — Le risque structurel</h2>
        <p className="content-snippet">
          Un ouvrage posé au sol qui ne porte rien (terrasse, clôture) : risque faible,
          erreur visible immédiatement. Un ouvrage qui porte (ossature, charpente, dalle
          armée) : la défaillance survient des mois après, et coûte beaucoup plus cher à
          reprendre. La règle simple : ce qui supporte une charge ou conditionne
          l&apos;étanchéité mérite une compétence solide.
        </p>
        <p className="content-body">
          Tous les projets n&apos;exposent pas au même risque. Une terrasse de plain-pied,
          si elle est mal posée, ça se voit la première semaine : une lame qui gondole,
          un jeu mal réglé. On rachète, on refait, c&apos;est désagréable mais sans gravité.
          Le matériau ne va nulle part, il n&apos;y a rien dessus.
        </p>
        <p className="content-body">
          Une ossature de cabanon qui porte un toit, c&apos;est autre chose. Un montant
          d&apos;encadrement de porte sous-dimensionné ne se voit pas le premier mois.
          Il se manifeste deux hivers plus tard, sous le poids de la neige, par une porte
          qui ne ferme plus parce que le linteau a fléchi. Et la reprise demande de démonter
          tout le bardage de la façade.
        </p>
        <p className="content-body">
          Une règle qui fonctionne bien, en autoconstruction :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Faisable sans expérience préalable</strong> : terrasse plain-pied
            jusqu&apos;à 20 m², clôture jusqu&apos;à 30 ml, pergola autoportée carrée
            jusqu&apos;à 3×3 m, dalle de plots pour terrasse (non armée, non structurelle).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Limite haute du bricoleur soigneux</strong> : cabanon ossature 9 m²,
            pergola adossée à un mur, pergola autoportée 4×3 m, clôture en limite de propriété
            avec accord voisin. Lisez les{' '}
            <Link href="/guides" className="content-link">guides techniques</Link>{' '}
            avant de commander le bois.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>À confier sauf si vous avez déjà fait</strong> : cabanon ossature
            au-delà de 15 m², dalle armée structurelle sous un ouvrage, charpente de pergola
            au-delà de 4 m de portée libre, toute extension contre la maison.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Artisan obligatoire</strong> : tout raccordement eau ou électricité
            (le Consuel exige une intervention qualifiée), les éléments soumis à décennale
            sur une construction principale, les fondations d&apos;une véranda.
          </li>
        </ul>
        <p className="content-body">
          La logique de fond : plus le délai entre votre erreur et la conséquence visible
          est long, plus il faut de la compétence pour l&apos;éviter. Sur une terrasse,
          le retour est immédiat. Sur une ossature porteuse, le retour est différé, et
          c&apos;est précisément ce différé qui rend la défaillance coûteuse.
        </p>

        <Callout type="info" title="La règle du différé">
          Plus le délai entre l&apos;erreur et sa conséquence visible s&apos;allonge,
          plus la tâche réclame de la compétence. Sur une terrasse posée au sol, un
          défaut se voit tout de suite&nbsp;: on refait, sans gravité. Sur une ossature
          porteuse, le problème n&apos;apparaît que des saisons plus tard — et
          c&apos;est précisément ce délai qui rend la reprise coûteuse.
        </Callout>

        <h2 className="content-h2">Critère 3 — L&apos;outillage qu&apos;on oublie de compter</h2>
        <p className="content-snippet">
          Un kit décent pour des projets bois coûte 340 à 820 € : perceuse-visseuse 18V,
          scie circulaire, scie sauteuse, niveau laser ou bulle, petit outillage de traçage.
          À ajouter au prix des matériaux pour le premier chantier. À partir du deuxième
          projet, l&apos;outillage est amorti et l&apos;autoconstruction redevient nettement
          gagnante.
        </p>
        <p className="content-body">
          Quand on compare le devis d&apos;un artisan au coût des matériaux, on oublie
          souvent ce qu&apos;il faut acheter pour faire le travail. Voici le kit minimal
          pour s&apos;attaquer à une terrasse ou un cabanon dans des conditions correctes :
        </p>
        <table className="content-table">
          <thead>
            <tr>
              <th>Outil</th>
              <th>Gamme acceptable</th>
              <th>Prix neuf</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Perceuse-visseuse 18V</td>
              <td>2 batteries, couple ≥ 50 Nm</td>
              <td>100 – 250 €</td>
            </tr>
            <tr>
              <td>Scie circulaire</td>
              <td>1 200 W, lame Ø 190 mm</td>
              <td>80 – 200 €</td>
            </tr>
            <tr>
              <td>Scie sauteuse</td>
              <td>650 W, mouvement pendulaire</td>
              <td>50 – 150 €</td>
            </tr>
            <tr>
              <td>Niveau laser ou bulle</td>
              <td>Précision ± 2 mm / 10 m</td>
              <td>40 – 150 €</td>
            </tr>
            <tr>
              <td>Équerre, cordeau, crayons, mètre</td>
              <td>Outillage de traçage de base</td>
              <td>30 €</td>
            </tr>
            <tr>
              <td>Gants, lunettes, masque</td>
              <td>EPI essentiels</td>
              <td>40 €</td>
            </tr>
            <tr>
              <td><strong>Total kit de base</strong></td>
              <td></td>
              <td><strong>340 – 820 €</strong></td>
            </tr>
          </tbody>
        </table>
        <p className="content-body">
          Pour les projets béton, ajoutez une bétonnière 100 L&nbsp;: 27 à 55 €/jour en
          location selon enseigne (Kiloutou, Loxam ou Leroy Merlin via LOXAM), ou 150 €
          d&apos;occasion entre particuliers. Pour les fondations profondes, une tarière
          thermique se loue 80 à 180 €/jour (79 € minimum chez Kiloutou, jusqu&apos;à
          180 € chez Loxam pour les modèles puissants), indispensable à partir de 6 plots
          à 60 cm de profondeur.
        </p>
        <p className="content-body">
          La logique d&apos;amortissement, sur un exemple concret : pour une terrasse de 15 m²
          en pin classe 4, notre{' '}
          <Link href="/calculateur" className="content-link">simulateur</Link>{' '}
          donne 550 à 700 € de matériaux selon l&apos;enseigne (prix scrapés Leroy Merlin,
          Brico Dépôt, Castorama). Ajoutez 400 € d&apos;outillage si vous n&apos;avez qu&apos;une
          perceuse, le total monte à 1 000 €, contre 1 200 à 2 100 € chez un artisan tout
          compris (80 à 140 €/m² pose comprise en pin classe 4, sources&nbsp;:{' '}
          <a href="https://www.travaux.com/jardin-et-exterieur/guide-des-prix/prix-de-la-pose-dune-terrasse-en-bois" target="_blank" rel="noopener noreferrer" className="content-link">Travaux.com</a>{' '}
          (résineux 80-150 €/m²) et{' '}
          <a href="https://www.prix-pose.com/terrasse-bois" target="_blank" rel="noopener noreferrer" className="content-link">Prix-pose.com</a>{' '}
          (pin 80-140 €/m² pose incluse), relevés mai 2026). Vous restez gagnant, mais l&apos;écart est moins
          spectaculaire que ce qu&apos;on croit. À partir du deuxième chantier (pergola,
          clôture, nouvelle terrasse chez un proche), l&apos;outillage est déjà payé&nbsp;:
          c&apos;est là que le gain devient net. Pour comparer le prix au m² essence par
          essence et enseigne par enseigne avant de trancher, voyez notre{' '}
          <Link href="/guides/prix-terrasse-bois-m2-2026" className="content-link">comparatif détaillé du prix d&apos;une terrasse bois au m²</Link>.
        </p>

        <h2 className="content-h2">Critère 4 — La garantie décennale, ce qu&apos;elle couvre vraiment</h2>
        <p className="content-snippet">
          La décennale est une assurance obligatoire de l&apos;artisan, valable 10 ans.
          Elle couvre les défauts qui compromettent la solidité de l&apos;ouvrage ou le
          rendent impropre à sa destination. Elle ne couvre ni l&apos;esthétique, ni
          l&apos;usure, ni les éléments dissociables. Pour un cabanon de jardin de moins
          de 20 m² sans fondations permanentes, la décennale ne s&apos;applique pas.
          Pour une dalle armée structurelle sous un ouvrage ou une extension, oui.
        </p>
        <p className="content-body">
          C&apos;est le critère le moins compris, et probablement le plus déterminant
          pour les projets qui touchent la maison. La décennale est définie par
          l&apos;<a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006443502" target="_blank" rel="noopener noreferrer" className="content-link">article 1792 du Code civil</a>{' '}
          (Légifrance). Elle engage l&apos;artisan pendant 10 ans pour les défauts qui :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Compromettent la solidité de l&apos;ouvrage</strong> : effondrement,
            fissures structurelles d&apos;une dalle ou d&apos;un mur porteur, affaissement
            d&apos;une charpente.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Rendent l&apos;ouvrage impropre à sa destination</strong> : toiture
            qui fuit, étanchéité défaillante d&apos;une terrasse-toit, dalle qui
            s&apos;affaisse au point d&apos;empêcher l&apos;usage prévu.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Affectent un élément d&apos;équipement indissociable</strong> du gros
            œuvre : plomberie en gaine, chauffe-eau encastré, fenêtres scellées dans la
            maçonnerie.
          </li>
        </ul>
        <p className="content-body">
          Ce que la décennale ne couvre pas, et c&apos;est utile à savoir :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            L&apos;esthétique pure : jaunissement du bois, taches de lasure, vis qui
            rouillent en façade.
          </li>
          <li style={{ marginBottom: '10px' }}>
            L&apos;usure normale : une lasure à refaire au bout de 4 ans, un joint
            d&apos;étanchéité à reprendre.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Les éléments d&apos;équipement dissociables : volets battants, store extérieur,
            mobilier, lambris décoratifs rapportés.
          </li>
        </ul>
        <p className="content-body">
          Cas concret : votre dalle armée sous cabanon se fissure au bout de 4 ans.
          Si un artisan l&apos;a faite, il doit la réparer à ses frais (décennale). Si vous
          l&apos;avez faite vous-même, la réparation est à votre charge, et la fissuration
          peut affecter la valeur de la maison à la revente. Un diagnostiqueur le notera
          dans le rapport.
        </p>
        <p className="content-body">
          Vérifier qu&apos;un artisan a une décennale valide est rapide : demander
          l&apos;attestation, regarder la période de validité (les contrats sont annuels),
          vérifier la compagnie d&apos;assurance et surtout les types de travaux couverts.
          Un peintre qui se présente aussi comme maçon n&apos;est pas forcément couvert pour
          les deux activités. Un appel rapide à la compagnie d&apos;assurance confirme la
          validité du contrat.
        </p>

        <Callout type="pro" title="Vérifier une attestation décennale">
          Avant de confier un ouvrage, demandez l&apos;attestation décennale et vérifiez
          la période de validité (les contrats se renouvellent chaque année), la compagnie
          d&apos;assurance, et surtout les types de travaux réellement couverts. Un artisan
          qui se présente à la fois comme peintre et maçon n&apos;est pas forcément assuré
          pour les deux&nbsp;; un simple appel à sa compagnie lève le doute.
        </Callout>
        <p className="content-body">
          Pour un projet où la décennale n&apos;est pas en jeu (terrasse posée sur plots,
          clôture, pergola autoportée, cabanon de moins de 20 m² sans fondations
          permanentes), ce critère ne pèse pas. Pour une extension, une dalle armée,
          une véranda ou tout ce qui touche la structure de la maison, il devient central.
        </p>

        <h2 className="content-h2">Critère 5 — Le coût d&apos;opportunité du temps</h2>
        <p className="content-snippet">
          Une terrasse de 15 m² prend 2 à 3 jours pleins. Un cabanon de 9 m², 1 à 2 weekends
          complets. Le temps n&apos;est jamais gratuit : selon ce que vous gagnez
          professionnellement ou ce que vous renoncez à faire comme loisir, un weekend
          de chantier vaut 200 à 500 € d&apos;opportunité. Budgétez-le honnêtement avant
          de comparer un devis artisan.
        </p>
        <p className="content-body">
          Le mauvais calcul : traiter le temps comme une variable nulle. Le bon calcul :
          le valoriser à hauteur de ce qu&apos;il représente vraiment pour vous. Un weekend
          de chantier, c&apos;est un weekend que vous ne passez pas en famille, en sport,
          en lecture, ou en travail rémunéré. Pour quelqu&apos;un qui facture 30 €/h en
          freelance, 2 weekends intenses représentent près de 1 000 € d&apos;opportunité perdue.
        </p>

        <PullQuote>
          Pour un indépendant à 30&nbsp;€/h, deux weekends de chantier valent près de <strong>1&nbsp;000&nbsp;€</strong> d&apos;opportunité perdue.
        </PullQuote>

        <p className="content-body">
          Cela étant, le faire-soi-même n&apos;est pas qu&apos;une activité subie. Pour beaucoup,
          c&apos;est du loisir actif, de l&apos;apprentissage manuel, un résultat tangible
          dont on est fier. Ce sont des bénéfices réels, à intégrer dans le calcul global,
          sans les sur-pondérer non plus pour se justifier d&apos;un choix déjà fait.
        </p>

        <h2 className="content-h2">Pour quel projet ? Le tableau de décision</h2>
        <p className="content-body">
          Une synthèse projet par projet, à pondérer selon votre expérience préalable.
          La colonne « critère décisif » donne le facteur qui pèse le plus dans chaque cas.
        </p>
        <table className="content-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Soi-même</th>
              <th>Faire faire</th>
              <th>Critère décisif</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Link href="/calculateur" className="content-link">Terrasse</Link> &lt; 15 m²</td>
              <td>Oui</td>
              <td>Optionnel</td>
              <td>Risque structurel faible, outillage léger</td>
            </tr>
            <tr>
              <td>Terrasse 15 à 30 m²</td>
              <td>Si expérience</td>
              <td>Optionnel</td>
              <td>Volume, plots à régler en série</td>
            </tr>
            <tr>
              <td><Link href="/cabanon" className="content-link">Cabanon</Link> &lt; 9 m²</td>
              <td>Si expérience ossature</td>
              <td>Si jamais fait</td>
              <td>Ossature bois demande méthode</td>
            </tr>
            <tr>
              <td>Cabanon 9 à 20 m²</td>
              <td>Bricoleur soigneux</td>
              <td>Recommandé</td>
              <td>DTU 31.2 plus exigeant, charges accrues</td>
            </tr>
            <tr>
              <td>Cabanon &gt; 20 m²</td>
              <td>Non</td>
              <td>Oui</td>
              <td>Permis de construire, garantie décennale</td>
            </tr>
            <tr>
              <td><Link href="/pergola" className="content-link">Pergola</Link> autoportée &lt; 3×3 m</td>
              <td>Oui</td>
              <td>Optionnel</td>
              <td>4 poteaux, 4 longerons, géométrie simple</td>
            </tr>
            <tr>
              <td>Pergola adossée ou &gt; 4 m de portée</td>
              <td>Si expérience</td>
              <td>Recommandé</td>
              <td>Ancrage à l&apos;existant, dimensionnement</td>
            </tr>
            <tr>
              <td><Link href="/cloture" className="content-link">Clôture</Link> &lt; 30 ml</td>
              <td>Oui</td>
              <td>Optionnel</td>
              <td>Répétitif mais simple, physique</td>
            </tr>
            <tr>
              <td>Clôture maçonnée ou avec portail motorisé</td>
              <td>Non</td>
              <td>Oui</td>
              <td>Maçonnerie, raccordement électrique</td>
            </tr>
            <tr>
              <td><Link href="/guides/dalle" className="content-link">Dalle</Link> sur plots (terrasse)</td>
              <td>Oui</td>
              <td>Optionnel</td>
              <td>Non structurel, pas de décennale</td>
            </tr>
            <tr>
              <td>Dalle armée sous cabanon ou véranda</td>
              <td>Si expérience béton</td>
              <td>Recommandé</td>
              <td>Décennale, dimensionnement, treillis</td>
            </tr>
          </tbody>
        </table>
        <p className="content-body">
          La colonne « si expérience » suppose que vous avez déjà fait un projet similaire,
          que vous savez gérer un imprévu en cours de chantier, et que vous avez
          l&apos;outillage. Si vous démarrez, descendez d&apos;une ligne dans le tableau :
          un premier projet coché « si expérience » se traite mieux avec un encadrement,
          ou en accompagnement d&apos;un proche qui sait.
        </p>

        <h2 className="content-h2">Les vrais coûts cachés du faire-soi-même</h2>
        <p className="content-snippet">
          Outillage à acheter (340 à 820 €), évacuation des déchets (30 € en déchèterie
          ou 250 à 400 € en benne pour gros projets), reprises d&apos;erreur (en moyenne
          un weekend perdu sur les deux premiers projets), garantie absente (toute défaillance
          est à votre charge). Comptez 15 à 30 % de surcoût caché par rapport au seul prix
          des matériaux.
        </p>
        <p className="content-body">
          Le devis matériaux donné par un simulateur, c&apos;est le prix brut du bois,
          des plots et de la visserie. Il manque quatre lignes que personne n&apos;affiche
          spontanément :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Outillage non possédé</strong> (vu plus haut) : 340 à 820 € pour un kit
            décent. À amortir sur la durée de vie de vos projets.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Déchets à évacuer</strong>&nbsp;: emballages, chutes de bois, pots de
            lasure vides, sacs ciment. Pour une terrasse, une remorque à la déchèterie
            suffit (gratuit à 30 € selon la commune). Pour un cabanon avec démolition
            d&apos;un ancien abri, comptez une benne&nbsp;: 200 à 450 € pour 3 à 5 m³,
            jusqu&apos;à 525 € en Île-de-France pour 10 m³ de DIB selon prestataire
            (Ecodrop, Goodcollect, mai 2026).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Reprises</strong> : sur le premier projet d&apos;un bricoleur, comptez
            statistiquement 1 weekend perdu sur une erreur visible (lambourde mal entraxée,
            poteau pas d&apos;aplomb, lame qui coince). Coût : 100 à 300 € de bois racheté,
            plus le temps. Le deuxième projet est beaucoup plus fluide, c&apos;est
            l&apos;effet d&apos;expérience.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Garantie absente</strong> : si la terrasse vrille à 3 ans, vous la refaites
            à vos frais. Un artisan engage sa décennale sur les ouvrages éligibles. Cette ligne
            ne pèse que sur certains projets (voir critère 4), mais elle peut être lourde.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Délai réel</strong> : un projet en autoconstruction traîne en moyenne 2
            à 3 fois le temps prévu. Pas par fainéantise, mais parce qu&apos;un weekend
            pluvieux décale tout, qu&apos;une livraison de bois manquante coûte une semaine,
            et qu&apos;à l&apos;usage on découvre qu&apos;il manque un outil. Budgétez 50 %
            de marge sur la durée annoncée.
          </li>
        </ul>
        <p className="content-body">
          En cumulé, ces lignes ajoutent 15 à 30 % au coût matériaux brut pour un premier
          projet. C&apos;est ce qui explique pourquoi un devis artisan paraît parfois moins
          absurde qu&apos;à la première lecture.
        </p>

        <h2 className="content-h2">Si vous commencez et que vous bloquez</h2>
        <p className="content-snippet">
          Faire reprendre par un artisan est possible mais sa garantie décennale ne couvrira
          que sa propre intervention. Mieux vaut anticiper : faire poser le gros œuvre par
          un pro, finir les finitions soi-même, ou l&apos;inverse. Si vous bloquez en cours
          de chantier, prévenez tôt l&apos;artisan, photos à l&apos;appui. Un pro sérieux
          refuse parfois de reprendre un sous-jacent qu&apos;il n&apos;a pas vu se faire.
        </p>
        <p className="content-body">
          Cas fréquent : on monte une terrasse, la pose des lames cale, on appelle quelqu&apos;un
          pour finir. Le piège juridique est simple : l&apos;artisan n&apos;est responsable
          que de la partie qu&apos;il a réalisée. Si la structure que vous avez montée flanche
          deux ans plus tard, sa décennale ne joue pas. La défaillance vient d&apos;en dessous.
        </p>
        <p className="content-body">
          Deux stratégies pour gérer le risque dès le départ :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pro pour le gros œuvre, vous pour les finitions</strong> : artisan pour
            la dalle armée et l&apos;ossature, vous pour le bardage, la peinture, les
            aménagements intérieurs. La garantie couvre la partie qui compte, les économies
            se font sur le reste.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Vous pour le préparatoire, pro pour le critique</strong> : vous creusez
            les fouilles, vous faites le terrassement, vous achetez les matériaux,
            et l&apos;artisan intervient pour les éléments où sa compétence ou sa garantie
            est utile.
          </li>
        </ul>
        <p className="content-body">
          Pour trouver un artisan rapidement sans tomber dans n&apos;importe quel piège, trois
          canaux marchent bien dans la pratique : le bouche-à-oreille local (demander aux
          voisins qui a fait leur terrasse ou leur cabanon), les groupes Facebook locaux
          du type « artisan + nom de la ville », et les plateformes de devis travaux, en
          gardant à l&apos;esprit qu&apos;elles prélèvent une commission et que la
          qualification des artisans varie beaucoup d&apos;une plateforme à l&apos;autre.
          Dans tous les cas, vérifiez le SIRET, demandez l&apos;attestation décennale valide
          pour l&apos;année en cours et pour le type de travaux, et appelez deux ou trois
          clients récents pour un retour direct sur la qualité et le respect des délais.
        </p>

        <h2 className="content-h2">Questions fréquentes</h2>

        <h3 className="content-h3">Est-ce vraiment moins cher de faire soi-même ?</h3>
        <p className="content-body">
          Sur les matériaux seuls, oui : souvent 40 à 60 % de moins qu&apos;un artisan tout
          compris. Sur le total réel, l&apos;écart se resserre quand on intègre
          l&apos;outillage à acheter, les chutes, les reprises et le temps. Pour une terrasse
          de 15 m² en pin classe 4, le{' '}
          <Link href="/calculateur" className="content-link">simulateur DIY Builder</Link>{' '}
          donne 550 à 700 € de matériaux (prix scrapés Leroy Merlin, Brico Dépôt et Castorama,
          mai 2026), auxquels s&apos;ajoutent 340 à 820 € d&apos;outillage si vous partez de
          zéro, contre 1 200 à 2 100 € chez un artisan main d&apos;œuvre comprise (tarif
          2026&nbsp;: 80 à 140 €/m² pose incluse). À partir du deuxième projet, l&apos;outillage
          est amorti et l&apos;autoconstruction devient nettement gagnante.
        </p>

        <h3 className="content-h3">Quels projets sont vraiment risqués en autoconstruction ?</h3>
        <p className="content-body">
          Trois familles : les ouvrages qui portent une charge (ossature de cabanon
          au-delà de 9 m², charpente de pergola au-delà de 4 m de portée, extension),
          les ouvrages dont la défaillance affecte la maison (dalle armée sous cabanon,
          étanchéité de toiture, raccordement eau ou électricité), et les ouvrages soumis
          à décennale. Pour ces cas, l&apos;erreur de calcul ne se voit pas tout de suite,
          mais elle coûte beaucoup plus cher que le gain à faire soi-même au moment où elle
          se manifeste.
        </p>

        <h3 className="content-h3">Faut-il déclarer un projet fait soi-même ?</h3>
        <p className="content-body">
          Oui, les mêmes règles s&apos;appliquent. Moins de 5 m² au sol : aucune démarche.
          De 5 à 20 m² : déclaration préalable de travaux (Cerfa 13703), instruction 1 mois.
          Au-delà de 20 m² : permis de construire, instruction 2 mois. L&apos;autoconstruction
          ne dispense d&apos;aucune autorisation. Un voisin mécontent peut signaler un
          chantier non déclaré, et la mairie peut déclencher une mise en demeure de démolir.
        </p>

        <h3 className="content-h3">Si je commence et que je bloque, que faire ?</h3>
        <p className="content-body">
          Faire reprendre par un artisan est possible, mais sa garantie décennale ne couvrira
          que sa propre intervention, pas la partie déjà réalisée. Mieux vaut anticiper :
          faire le gros œuvre par un pro et finir soi-même, ou l&apos;inverse. Si vous bloquez
          en cours, prévenez tôt l&apos;artisan que vous avez démarré, photos à l&apos;appui.
          Un pro sérieux refusera parfois de reprendre un chantier dont il n&apos;a pas vu
          le sous-jacent. C&apos;est sa responsabilité juridique qui parle.
        </p>

        <h3 className="content-h3">Comment trouver un artisan fiable rapidement ?</h3>
        <p className="content-body">
          Trois canaux qui marchent : le bouche-à-oreille local (demandez aux voisins qui
          a fait leur terrasse), les groupes Facebook locaux du type « artisan + ville »,
          et les plateformes de mise en relation (en gardant à l&apos;esprit qu&apos;elles
          prélèvent une commission et que la qualification varie). Vérifiez toujours :
          SIRET en cours, attestation décennale valide pour l&apos;année et le type de
          travaux, et 2 ou 3 chantiers récents à appeler pour un retour direct.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/terrasse">Guide terrasse</Link> : essences, lambourdes, plots, DTU 51.4</li>
            <li><Link href="/guides/cabanon">Guide cabanon</Link> : ossature bois, fondations, mono-pente</li>
            <li><Link href="/guides/pergola">Guide pergola</Link> : sections, ancrage, portées</li>
            <li><Link href="/guides/cloture">Guide clôture</Link> : réglementation, poteaux, entraxes</li>
            <li><Link href="/guides/dalle">Tutoriel dalle béton</Link> : épaisseur, treillis, dosage</li>
            <li><Link href="/guides/comparer-devis-travaux">Comparer plusieurs devis travaux</Link> : méthode, mentions obligatoires, écarts normaux</li>
            <li><Link href="/faq">FAQ</Link> : 24 questions techniques</li>
          </ul>
        </aside>

        <CTALead projectHref="/" projectLabel="mon projet" />

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 24 mai 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources DTU citées</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Calculez votre projet en 30 secondes</p>
          <p className="content-cta-box-desc">
            Quatre simulateurs (terrasse, cabanon, pergola, clôture) et un tutoriel dalle
            béton avec calculateur intégré. Devis matériaux et comparatif de prix entre
            4 enseignes, gratuits, sans inscription.
          </p>
          <a href="/" className="btn-primary">
            Choisir un simulateur{' '}
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
