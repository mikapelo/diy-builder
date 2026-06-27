import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Permis et déclaration pour un cabanon 2026';
const OG_SUBTITLE = 'Seuils, Cerfa, zones ABF · service-public.fr';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cabanon`;

export const metadata = {
  title: 'Cabanon 2026 : permis ou pas ? Seuils 5/20/40 m²',
  description:
    '5 m² : aucune démarche. 20 m² : déclaration. 40 m² : permis. La grille de décision 2026 avec Cerfa, délais d\'instruction et zones ABF / PLU.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/permis-cabanon-seuils-2026' },
  openGraph: {
    title: 'Permis et déclaration pour un cabanon en 2026 — Guide complet | DIY Builder',
    description: 'Seuils 2026, Cerfa par tranche, zones ABF et PLU : la grille de décision pour construire un cabanon sans mauvaise surprise administrative.',
    url: 'https://www.diy-builder.fr/guides/permis-cabanon-seuils-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Permis cabanon 2026 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Permis et déclaration pour construire un cabanon en 2026 : seuils et Cerfa',
  description:
    'Tableau complet des seuils déclaration préalable / permis de construire pour cabanon en 2026, Cerfa à remplir, délais d\'instruction, zones spéciales (ABF, Natura 2000, secteur sauvegardé), pièges PLU.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-05-24',
  dateModified: '2026-05-24',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/permis-cabanon-seuils-2026',
  image: OG_URL,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide cabanon', item: 'https://www.diy-builder.fr/guides/cabanon' },
    { '@type': 'ListItem', position: 4, name: 'Permis et déclaration cabanon 2026', item: 'https://www.diy-builder.fr/guides/permis-cabanon-seuils-2026' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelle surface de cabanon ne nécessite aucune démarche en 2026 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Strictement moins de 5 m² de surface de plancher ET d\'emprise au sol, hors zone protégée. C\'est la seule tranche vraiment libre, posée par l\'article R421-2 du Code de l\'urbanisme. Dès qu\'on dépasse 5 m² (ou qu\'on est en site classé, ABF, PLU contraignant), au minimum une déclaration préalable est obligatoire.',
      },
    },
    {
      '@type': 'Question',
      name: 'Faut-il un permis de construire à partir de 20 m² ou 40 m² ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le seuil dépend de la zone du PLU communal. En zone urbaine (U) du PLU, la déclaration préalable suffit jusqu\'à 40 m² de surface de plancher. Hors zone U, ou si la commune n\'a pas de PLU, le permis de construire devient obligatoire dès 20 m². Au-delà de 150 m² de surface totale habitation, le recours à un architecte est obligatoire (article R431-2 Code urbanisme).',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel Cerfa pour la déclaration préalable d\'un cabanon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cerfa n°13703 — Déclaration préalable pour une maison individuelle et/ou ses annexes. Disponible gratuitement sur service-public.fr. À déposer en mairie en 2 exemplaires papier ou de plus en plus souvent en ligne via le téléservice GNAU (Guichet Numérique des Autorisations d\'Urbanisme) selon les communes. Délai d\'instruction : 1 mois, 2 mois en site patrimonial remarquable.',
      },
    },
    {
      '@type': 'Question',
      name: 'En zone ABF, faut-il une autorisation supplémentaire pour un cabanon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui — l\'avis de l\'Architecte des Bâtiments de France est obligatoire dans le périmètre de protection de 500 m autour d\'un monument historique, ou en site patrimonial remarquable, et ce quelle que soit la surface du cabanon. Cet avis ne remplace pas la déclaration préalable ou le permis classique : il s\'y ajoute. Compter 4 mois d\'instruction au lieu du mois standard. L\'ABF peut imposer des matériaux, des teintes ou des proportions (article R425-1 Code urbanisme).',
      },
    },
    {
      '@type': 'Question',
      name: 'Un cabanon démontable échappe-t-il aux règles d\'urbanisme ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Non — le caractère démontable est un faux ami juridique. Dès qu\'une construction est installée plus de 3 mois consécutifs sur le terrain (Code de l\'urbanisme R421-5), elle est soumise aux mêmes règles qu\'une construction permanente. Un cabanon vissé sur plots, posé en début de saison et laissé en place toute l\'année, déclenche les mêmes seuils 5/20/40 m² qu\'un cabanon scellé à demeure.',
      },
    },
  ],
};

export default function PermisCabanonSeuils2026Page() {
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
          <Link href="/guides/cabanon">Guide cabanon</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Permis et seuils 2026</span>
        </nav>

        <h1 className="content-h1">Permis et déclaration pour construire un cabanon en 2026 : seuils et Cerfa</h1>

        <p className="content-meta">
          <span><strong>Publié le 24 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources juridiques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/permis-cabanon-seuils-2026/hero.png"
            alt="Trois cabanons de jardin de tailles croissantes alignés sur une pelouse — 5 m², 12 m² et 25 m² — pour illustrer les seuils urbanisme déclaration et permis"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Construire un cabanon de jardin en France 2026 répond à trois seuils&nbsp;: 5&nbsp;m²,
          20&nbsp;m² et 40&nbsp;m² de surface de plancher. En dessous de 5&nbsp;m², aucune démarche.
          De 5 à 20&nbsp;m², déclaration préalable obligatoire. Au-delà de 20&nbsp;m² (ou de
          40&nbsp;m² en zone urbaine du PLU), permis de construire. Mais ces seuils peuvent
          basculer en une demi-journée si votre terrain est en zone ABF, Natura 2000 ou site
          patrimonial remarquable. Cet article donne la grille exacte à appliquer avant de
          commander le bois, avec les Cerfa à remplir, les délais réels d&apos;instruction et les
          pièges PLU qui surprennent un projet sur cinq.
        </p>

        <h2 className="content-h2">Tableau des seuils en France 2026 — vue d&apos;ensemble</h2>
        <p className="content-snippet">
          Les seuils sont fixés par le Code de l&apos;urbanisme, articles R421-1 à R421-12. Trois
          paramètres comptent&nbsp;: la surface de plancher du cabanon, sa hauteur, et la zone
          d&apos;implantation au PLU communal. Une fois ces trois éléments connus, le tableau
          ci-dessous permet de trancher en 30 secondes.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Surface plancher</th>
              <th>Zone urbaine PLU (U)</th>
              <th>Hors zone U ou sans PLU</th>
              <th>Cerfa</th>
              <th>Délai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt; 5 m²</td>
              <td>Aucune démarche</td>
              <td>Aucune démarche</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>5 à 20 m²</td>
              <td>Déclaration préalable</td>
              <td>Déclaration préalable</td>
              <td>13703</td>
              <td>1 mois</td>
            </tr>
            <tr>
              <td>20 à 40 m²</td>
              <td>Déclaration préalable</td>
              <td>Permis de construire</td>
              <td>13703 ou 13406</td>
              <td>1 ou 2 mois</td>
            </tr>
            <tr>
              <td>&gt; 40 m²</td>
              <td>Permis de construire</td>
              <td>Permis de construire</td>
              <td>13406</td>
              <td>2 mois</td>
            </tr>
            <tr>
              <td>&gt; 150 m² (total habitation)</td>
              <td>Permis + architecte obligatoire</td>
              <td>Permis + architecte obligatoire</td>
              <td>13406</td>
              <td>2 mois</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Cette grille s&apos;applique hors zones spéciales. Dès que le terrain est en site
          patrimonial remarquable, périmètre ABF, Natura 2000, ou couvert par un PPR (Plan de
          Prévention des Risques), les seuils sont durcis et les délais d&apos;instruction
          rallongés. Voir plus bas pour le détail de ces zones.
        </p>

        <h2 className="content-h2">Moins de 5 m² — la seule tranche vraiment libre</h2>
        <p className="content-snippet">
          Un cabanon de moins de 5&nbsp;m² de surface de plancher ET d&apos;emprise au sol, hors
          zone protégée, ne nécessite aucune démarche. C&apos;est l&apos;article R421-2 du Code de
          l&apos;urbanisme qui pose cette exemption. Attention au cumul&nbsp;: si vous installez
          deux cabanons de 4&nbsp;m² chacun, le total 8&nbsp;m² déclenche la déclaration
          préalable comme s&apos;il s&apos;agissait d&apos;une seule construction.
        </p>
        <p className="content-body">
          Le seuil de 5 m² est apprécié au cas par cas, et plusieurs notions s&apos;additionnent
          ici. La surface de plancher correspond à la somme des surfaces de chaque niveau,
          mesurée au nu intérieur des murs. L&apos;emprise au sol est la projection verticale
          du volume bâti. Pour un cabanon mono-niveau classique, les deux valeurs sont
          identiques au centimètre près. La tolérance des 5 m² est exclusive — à 5,01 m², la
          déclaration préalable redevient obligatoire.
        </p>
        <p className="content-body">
          Trois pièges classiques sur cette tranche&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Le cumul de plusieurs petits cabanons :</strong> le PLU communal cumule
            l&apos;ensemble des annexes sur le terrain. Deux cabanons de 4 m² font 8 m² total,
            soumis à déclaration préalable.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>L&apos;auvent ou la terrasse couverte :</strong> dès qu&apos;une structure
            couvre une surface plane (auvent, abri de tondeuse fixe, pergola couverte par bâche
            ou polycarbonate), elle compte dans l&apos;emprise au sol.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>La hauteur supérieure à 12 m :</strong> au-delà de 12 m de hauteur, même un
            cabanon de 2 m² déclenche une déclaration préalable. Improbable pour un cabanon
            standard, mais réel pour un mât d&apos;antenne ou un pigeonnier.
          </li>
        </ul>

        <AffiliatePartnerBlock module="abri-metal" placement="guide" />

        <h2 className="content-h2">5 à 20 m² — Déclaration préalable (Cerfa 13703)</h2>
        <p className="content-snippet">
          Le formulaire Cerfa 13703 (vérifier la version en vigueur sur service-public.fr) est
          l&apos;outil de la tranche 5–20 m². Téléchargeable
          gratuitement sur service-public.fr, à déposer en mairie en deux exemplaires papier ou
          via le téléservice GNAU. Délai d&apos;instruction&nbsp;: 1 mois, prolongé à 2 mois en
          site patrimonial remarquable. Pièces standard&nbsp;: plan de situation, plan masse,
          plan en coupe, plan des façades, photos du terrain.
        </p>
        <p className="content-body">
          La déclaration préalable n&apos;est pas une simple formalité. Elle permet à la mairie
          de vérifier que le projet respecte le PLU, les servitudes locales, les règles de recul
          par rapport aux limites séparatives, et les éventuelles contraintes esthétiques
          (matériaux, teintes du bardage, type de toiture). Un dossier complet et soigné évite
          les demandes de pièces complémentaires qui prolongent l&apos;instruction de plusieurs
          semaines.
        </p>
        <p className="content-body">
          Pièces minimales à joindre&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>DP1 — Plan de situation :</strong> extrait de plan cadastral montrant la
            parcelle dans son environnement (rues, voisinages). Téléchargeable gratuitement sur
            cadastre.gouv.fr.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>DP2 — Plan de masse :</strong> implantation du cabanon sur la parcelle,
            avec cotes par rapport aux limites séparatives et aux autres bâtiments. Échelle
            recommandée 1/200 ou 1/500.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>DP3 — Plan en coupe :</strong> coupe verticale du cabanon montrant la
            hauteur, le terrain naturel, le terrain modifié si terrassement.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>DP4 — Plan des façades :</strong> dessin des 4 façades à l&apos;échelle 1/50
            ou 1/100, avec ouvertures et matériaux.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>DP5 — Représentation du projet dans l&apos;environnement :</strong> insertion
            visuelle du cabanon, photomontage ou dessin.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>DP6 et DP7 — Photos du terrain :</strong> deux photos minimum (proche et
            éloignée) pour situer l&apos;intervention.
          </li>
        </ul>
        <p className="content-body">
          Le délai d&apos;instruction commence à courir à compter de la date du récépissé de
          dépôt, pas de la date à laquelle vous avez déposé le dossier. Pendant le mois
          d&apos;instruction, la mairie peut demander des pièces complémentaires — le délai est
          alors suspendu jusqu&apos;à réception du complément. L&apos;absence de réponse au bout
          d&apos;un mois équivaut à un accord tacite, mais demandez systématiquement un certificat
          de non-opposition à la mairie pour avoir un document écrit en cas de contrôle
          ultérieur.
        </p>

        <h2 className="content-h2">20 à 40 m² — DP en zone U, permis ailleurs</h2>
        <p className="content-snippet">
          La tranche 20–40 m² est la plus piégeuse. En zone urbaine (U) du PLU, la déclaration
          préalable suffit. Hors zone U ou si la commune n&apos;a pas de PLU, le permis de
          construire devient obligatoire. Un même cabanon de 25 m² peut donc relever de Cerfa
          13703 (1 mois d&apos;instruction) ou de Cerfa 13406 (2 mois d&apos;instruction)
          selon le zonage. La consultation du PLU est gratuite en mairie ou en ligne sur le
          Géoportail de l&apos;urbanisme.
        </p>
        <p className="content-body">
          Pour savoir si votre terrain est en zone U, ouvrez le Géoportail de
          l&apos;urbanisme (geoportail-urbanisme.gouv.fr), saisissez l&apos;adresse du terrain,
          et lisez le zonage. Les zones U sont les zones urbanisées de la commune,
          généralement les centres-bourgs et les lotissements existants. Les zones AU (à
          urbaniser), A (agricole) et N (naturelle) ne sont pas des zones U et basculent la
          tranche 20–40 m² en permis de construire.
        </p>
        <p className="content-body">
          Cette nuance crée beaucoup de mauvaises surprises. Un particulier qui pensait
          déclarer son cabanon en 1 mois découvre 8 semaines après le dépôt que la mairie
          l&apos;a requalifié en permis de construire — le délai d&apos;instruction repart à zéro
          en mode 2 mois, et le projet prend deux mois de retard. La vérification du zonage
          avant le dépôt évite cette perte de temps.
        </p>

        <h2 className="content-h2">Plus de 40 m² — Permis de construire (Cerfa 13406)</h2>
        <p className="content-snippet">
          Au-delà de 40 m² de surface de plancher, le permis de construire est obligatoire
          quelle que soit la zone. Cerfa 13406, dépôt en mairie ou via GNAU, 2 mois
          d&apos;instruction (3 mois en zone protégée). Si la surface totale habitation atteint
          150 m² après ajout du cabanon, le recours à un architecte devient obligatoire
          (article R431-2 du Code de l&apos;urbanisme).
        </p>
        <p className="content-body">
          Le permis de construire est un dossier plus lourd que la déclaration préalable. Il
          inclut systématiquement une notice descriptive du projet (PCMI4), une notice
          d&apos;accessibilité si le cabanon accueille du public, et une étude thermique
          simplifiée si le bâtiment est chauffé. Le délai d&apos;instruction de 2 mois est strict
          mais peut être suspendu si la mairie demande des pièces complémentaires.
        </p>
        <p className="content-body">
          Le seuil des 150 m² total habitation s&apos;apprécie en additionnant la maison
          principale, les annexes et le nouveau cabanon. Une maison de 130 m² qui s&apos;agrandit
          d&apos;un cabanon de 25 m² atteint 155 m² total — l&apos;architecte devient obligatoire.
          Honoraires architecte pour un dossier permis simple : 8 à 12 % du coût total des
          travaux, soit 1 200 à 3 000 € pour un cabanon de 15 000 € de travaux.
        </p>

        <h2 className="content-h2">Les zones spéciales qui changent tout</h2>
        <p className="content-snippet">
          Sept régimes spéciaux durcissent les règles standards. ABF (périmètre 500 m autour
          d&apos;un monument historique), site patrimonial remarquable, sites classés et
          inscrits, Natura 2000, PPR (Plan de Prévention des Risques), zones de protection du
          patrimoine architectural, secteurs sauvegardés. Vérification gratuite sur
          geoportail-urbanisme.gouv.fr en moins de 5 minutes.
        </p>
        <p className="content-body">
          Ces zones ne suppriment pas la possibilité de construire un cabanon, mais elles
          ajoutent une autorisation et des contraintes esthétiques au dossier standard.
          L&apos;avis de l&apos;Architecte des Bâtiments de France est le plus connu — il
          intervient dans les périmètres de protection de 500 m autour d&apos;un monument
          historique, et son avis lie la mairie (s&apos;il refuse, le permis est refusé,
          article R425-1 Code urbanisme). L&apos;ABF peut imposer des matériaux (bardage bois
          plutôt que PVC), des teintes (gamme RAL imposée), des proportions de toiture
          (pente minimale, débord), ou des volumes maximaux qui contraignent le projet
          au-delà du Code de l&apos;urbanisme général.
        </p>
        <p className="content-body">
          Pour vérifier votre zonage en moins de 5 minutes, ouvrez geoportail-urbanisme.gouv.fr,
          activez les couches &quot;Servitudes d&apos;utilité publique&quot; et &quot;Zones de
          protection&quot;, puis tapez votre adresse. Les zones sensibles apparaissent en
          surimpression sur le plan. Si vous y êtes, ajoutez 2 mois au délai standard et
          téléphonez au service urbanisme de la mairie avant de commander le bois — leur
          retour anticipe les contraintes qui sortiraient sinon en cours d&apos;instruction.
        </p>

        <h2 className="content-h2">Hauteur du cabanon — règles communales et PLU</h2>
        <p className="content-snippet">
          La hauteur maximale d&apos;un cabanon n&apos;est pas fixée par le Code de
          l&apos;urbanisme national mais par le PLU communal. Les valeurs courantes se situent
          entre 2,50 m et 4 m au faîtage selon les zones. Au-delà de 12 m, déclaration
          préalable obligatoire même pour une surface inférieure à 5 m². La hauteur s&apos;apprécie
          au point le plus haut, faîtage ou acrotère, par rapport au terrain naturel avant
          travaux.
        </p>
        <p className="content-body">
          La majorité des PLU communaux français limitent les annexes (cabanons, abris, pool
          houses) à une hauteur de 3 à 4 m au faîtage. Cette règle vise à éviter qu&apos;un
          cabanon trop visible défigure le voisinage ou bloque l&apos;ensoleillement d&apos;une
          parcelle adjacente. Pour un cabanon mono-pente standard de 2,30 m sous la lisse haute
          côté faîtage, la hauteur au faîtage tourne autour de 2,80 à 3,20 m selon la pente —
          conforme à 95 % des PLU.
        </p>
        <p className="content-body">
          La hauteur s&apos;apprécie par rapport au terrain naturel avant travaux, pas après
          terrassement. Un cabanon perché sur une plateforme de 50 cm de hauteur ajoute ces 50
          cm à la hauteur déclarée. Cette précision compte si vous êtes proche du seuil PLU —
          un terrassement non déclaré peut basculer un cabanon de DP en permis si la hauteur
          totale dépasse la limite.
        </p>

        <h2 className="content-h2">Cabanon démontable — le faux ami juridique</h2>
        <p className="content-snippet">
          Un cabanon démontable n&apos;échappe pas aux règles d&apos;urbanisme dès lors qu&apos;il
          reste installé plus de 3 mois consécutifs sur le terrain (article R421-5 du Code de
          l&apos;urbanisme). Un cabanon vissé sur plots, posé en début de saison et laissé
          toute l&apos;année, déclenche les mêmes seuils 5/20/40 m² qu&apos;un cabanon scellé à
          demeure. Seuls les abris vraiment temporaires (tente saisonnière, structure montée
          puis démontée sous 3 mois) bénéficient de la dispense.
        </p>
        <p className="content-body">
          Les fabricants de cabanons préfabriqués vendent parfois leurs produits comme &quot;100
          % démontables, sans démarches administratives&quot;. C&apos;est une formule marketing
          inexacte. Le caractère démontable n&apos;a aucune incidence juridique si la
          construction reste en place plus de 3 mois. Le seul critère qui exempte vraiment de
          déclaration, c&apos;est la durée d&apos;installation effective sur le terrain.
        </p>

        <h2 className="content-h2">Le calendrier réel d&apos;une déclaration</h2>
        <p className="content-snippet">
          Compter au minimum 6 semaines entre le début du dossier et l&apos;obtention de
          l&apos;accord pour une déclaration préalable, 10 semaines pour un permis de construire
          standard. Ce délai inclut la préparation des plans (1 à 2 semaines), le dépôt en
          mairie, l&apos;instruction officielle (1 ou 2 mois), et la délivrance du récépissé de
          non-opposition. En zone ABF, ajouter 6 à 8 semaines supplémentaires pour l&apos;avis
          de l&apos;Architecte des Bâtiments de France.
        </p>
        <p className="content-body">
          Le délai réel est toujours plus long que le délai officiel d&apos;instruction. Un
          déposant qui imagine déposer en mars et démarrer le chantier en avril se retrouve
          souvent à démarrer en juin. Trois facteurs allongent le calendrier&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Préparation des plans :</strong> 1 à 2 semaines pour réaliser les pièces
            DP1 à DP7 si vous les faites vous-même, plus si vous passez par un architecte ou un
            géomètre.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Demande de pièces complémentaires :</strong> 25 % des dossiers reçoivent
            une demande de pièces complémentaires de la mairie pendant l&apos;instruction. Le
            délai officiel est alors suspendu, et reprend à la réception du complément.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Délai de recours des tiers :</strong> après obtention du récépissé de
            non-opposition (DP) ou du permis (PC), un délai de 2 mois court pendant lequel
            voisins et associations peuvent contester le projet. Pour sécuriser, attendre la
            fin de ce délai avant de commander le bois.
          </li>
        </ul>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Calculateur cabanon</p>
          <p className="content-cta-box-title">Préparez votre dossier en 30 secondes</p>
          <p className="content-cta-box-desc">
            Notre simulateur calcule la nomenclature et génère un plan technique coté
            réutilisable pour les pièces DP3 et DP4 (plans en coupe et façades).
          </p>
          <a href="/cabanon" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Questions fréquentes</h2>

        <h3 className="content-h3">Quelle surface de cabanon ne nécessite aucune démarche en 2026 ?</h3>
        <p className="content-body">
          Strictement moins de 5 m² de surface de plancher ET d&apos;emprise au sol, hors zone
          protégée. C&apos;est la seule tranche vraiment libre, posée par l&apos;article R421-2 du
          Code de l&apos;urbanisme. Dès qu&apos;on dépasse 5 m² (ou qu&apos;on est en site classé,
          ABF, PLU contraignant), au minimum une déclaration préalable est obligatoire.
        </p>

        <h3 className="content-h3">Faut-il un permis de construire à partir de 20 m² ou 40 m² ?</h3>
        <p className="content-body">
          Le seuil dépend de la zone du PLU communal. En zone urbaine (U) du PLU, la déclaration
          préalable suffit jusqu&apos;à 40 m² de surface de plancher. Hors zone U, ou si la
          commune n&apos;a pas de PLU, le permis de construire devient obligatoire dès 20 m². Au
          -delà de 150 m² de surface totale habitation, le recours à un architecte est
          obligatoire (article R431-2 Code urbanisme).
        </p>

        <h3 className="content-h3">Quel Cerfa pour la déclaration préalable d&apos;un cabanon ?</h3>
        <p className="content-body">
          Cerfa n°13703 — Déclaration préalable pour une maison individuelle et/ou ses
          annexes. Disponible gratuitement sur service-public.fr. À déposer en mairie en 2
          exemplaires papier ou de plus en plus souvent en ligne via le téléservice GNAU
          (Guichet Numérique des Autorisations d&apos;Urbanisme) selon les communes. Délai
          d&apos;instruction : 1 mois, 2 mois en site patrimonial remarquable.
        </p>

        <h3 className="content-h3">En zone ABF, faut-il une autorisation supplémentaire pour un cabanon ?</h3>
        <p className="content-body">
          Oui — l&apos;avis de l&apos;Architecte des Bâtiments de France est obligatoire dans le
          périmètre de protection de 500 m autour d&apos;un monument historique, ou en site
          patrimonial remarquable, et ce quelle que soit la surface du cabanon. Cet avis ne
          remplace pas la déclaration préalable ou le permis classique : il s&apos;y ajoute.
          Compter 4 mois d&apos;instruction au lieu du mois standard. L&apos;ABF peut imposer
          des matériaux, des teintes ou des proportions (article R425-1 Code urbanisme).
        </p>

        <h3 className="content-h3">Un cabanon démontable échappe-t-il aux règles d&apos;urbanisme ?</h3>
        <p className="content-body">
          Non — le caractère démontable est un faux ami juridique. Dès qu&apos;une construction
          est installée plus de 3 mois consécutifs sur le terrain (Code de l&apos;urbanisme
          R421-5), elle est soumise aux mêmes règles qu&apos;une construction permanente. Un
          cabanon vissé sur plots, posé en début de saison et laissé en place toute
          l&apos;année, déclenche les mêmes seuils 5/20/40 m² qu&apos;un cabanon scellé à demeure.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/abri-de-jardin-metal-bois-ou-resine">Abri métal, bois ou résine</Link> — quel matériau choisir&nbsp;: prix, durée de vie et usage</li>
            <li><Link href="/guides/taxe-abri-jardin-2026">Taxe abri de jardin 2026</Link> — le volet fiscal&nbsp;: calcul, montant et exonération de la taxe d&apos;aménagement</li>
            <li><Link href="/guides/cabanon">Guide cabanon complet</Link> — DTU 31.2, calculs, étapes de construction</li>
            <li><Link href="/guides/soi-meme-ou-pro">Soi-même ou faire faire</Link> — cinq critères de décision</li>
            <li><Link href="/cabanon">Calculateur cabanon</Link> — nomenclature et plan technique</li>
            <li><Link href="/sources">Sources juridiques citées</Link> — Code urbanisme, service-public.fr</li>
          </ul>
        </aside>

        <CTALead projectHref="/cabanon" projectLabel="mon cabanon" />

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 24 mai 2026, sources
            officielles&nbsp;: <Link href="/sources">service-public.fr et Légifrance</Link> (Code
            de l&apos;urbanisme R421-1 à R421-12, R425-1, R431-2).
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources DTU et juridiques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
