import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import Callout from '@/components/content/Callout';
import PullQuote from '@/components/content/PullQuote';

const OG_TITLE = 'Terrasse bois autour d\'une piscine';
const OG_SUBTITLE = 'Essences, antidérapance, sécurité NF P90-306';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=terrasse`;

export const metadata = {
  title: 'Terrasse bois autour d\'une piscine : quelles lames choisir (2026)',
  description:
    'Quelles lames de terrasse choisir autour d\'une piscine ? Bois résistant au chlore et aux UV, antidérapance R11, sécurité NF P90-306, budget par essence.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/terrasse-piscine-bois' },
  openGraph: {
    title: 'Terrasse bois autour d\'une piscine : quelles lames choisir | DIY Builder',
    description: 'Essences résistantes au chlore, antidérapance R11, sécurité NF P90-306, drainage. Budget par essence et erreurs à éviter pour la plage piscine.',
    url: 'https://www.diy-builder.fr/guides/terrasse-piscine-bois',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Terrasse bois piscine — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Quel bois pour une terrasse de piscine : lames, antidérapance et sécurité 2026',
  description:
    'Choix des essences résistantes au chlore et aux UV, antidérapance obligatoire R11, pente d\'évacuation, conformité NF P90-306 (barrière), drainage et budget par essence pour une plage de piscine bois.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/terrasse-piscine-bois',
  image: OG_URL,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide terrasse bois', item: 'https://www.diy-builder.fr/guides/terrasse' },
    { '@type': 'ListItem', position: 4, name: 'Terrasse autour d\'une piscine', item: 'https://www.diy-builder.fr/guides/terrasse-piscine-bois' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelles essences résistent vraiment au chlore et aux UV autour d\'une piscine ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Trois essences exotiques classe 1 EN 350 tiennent sans entretien : ipé (densité 1 050 kg/m³, 30-50 ans), cumaru (très proche de l\'ipé pour 30 % moins cher), garapa (plus clair, durée de vie 25-30 ans). Le padouk et le teck conviennent aussi mais l\'approvisionnement FSC est plus contraint. Le pin traité classe 4 ne tient pas plus de 6-8 ans en bord de bassin chloré — à éviter sauf budget très contraint.',
      },
    },
    {
      '@type': 'Question',
      name: 'L\'antidérapance est-elle obligatoire pour une terrasse de piscine ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pas une obligation réglementaire stricte pour le particulier, mais une exigence de sécurité civile. La classification DIN 51130 définit 5 niveaux d\'adhérence (R9 à R13). Pour une plage de piscine, R11 minimum est la recommandation universelle des professionnels. Une lame lisse non rainurée descend à R9 et devient dangereuse mouillée, surtout sur pente. Les lames rainurées profondes ou les bois à grain naturellement rugueux (ipé, cumaru) atteignent R11-R12 sans traitement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle pente pour évacuer l\'eau d\'une terrasse de piscine ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1 % minimum (1 cm par mètre) vers la piscine ou vers un exutoire extérieur. La pente est non-négociable — sans pente, l\'eau stagne entre les lames, le bois pourrit par-dessous et les lames gauchissent en 2-3 saisons. Sur une plage de 4 m de large, cela représente 4 cm de dénivelé total entre le mur le plus haut et la margelle. La pente s\'apprécie sur les lambourdes, pas sur les lames — la pose des plots réglables tient compte de ce delta.',
      },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une barrière de sécurité pour une piscine entourée d\'une terrasse bois ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui — toute piscine enterrée ou semi-enterrée privée à usage individuel ou collectif doit être équipée d\'au moins un dispositif normalisé : barrière NF P90-306, alarme NF P90-307, couverture NF P90-308 ou abri NF P90-309 (loi Raffarin n°2003-9 du 3 janvier 2003, codifiée au Code de la construction et de l\'habitation). L\'absence de dispositif est passible d\'une amende pénale de 45 000 €. La terrasse bois autour de la piscine ne dispense pas de cette obligation — la barrière s\'installe sur ou autour de la plage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Budget approximatif pour une plage piscine bois de 30 m² ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hors pose : 1 600 € en pin traité classe 4 (déconseillé, durée 6-8 ans), 2 200 € en douglas (compromis raisonnable, 12-15 ans), 3 100 € en composite WPC (25-30 ans sans entretien), 3 700 € en ipé certifié FSC (30-50 ans). Ajouter 50-60 €/m² pour la pose artisan, soit 1 500-1 800 € de main-d\'œuvre pour 30 m². Total clé en main : 3 100 € (pin) à 5 500 € (ipé).',
      },
    },
  ],
};

export default function TerrassePiscineBoisPage() {
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
          <Link href="/guides/terrasse">Guide terrasse</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Terrasse piscine bois</span>
        </nav>

        <h1 className="content-h1">Quel bois pour une terrasse de piscine : lames, antidérapance, sécurité</h1>

        <p className="content-meta">
          <span><strong>Publié le 25 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources DTU et juridiques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/terrasse-piscine-bois/hero.png"
            alt="Terrasse en bois ipé autour d'une piscine résidentielle avec eau turquoise, lames parallèles avec espacement de drainage, ambiance estivale lumière dorée"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Une terrasse bois autour d&apos;une piscine cumule trois contraintes qu&apos;une terrasse de
          jardin classique ignore&nbsp;: contact permanent avec une eau chlorée corrosive, exposition
          UV directe sans ombrage, et obligation d&apos;antidérapance pour éviter les chutes pieds
          mouillés. Le pin traité classe 4 standard n&apos;y résiste pas plus de 6-8 ans — l&apos;ipé
          certifié FSC tient 30 à 50 ans sans entretien. Entre les deux, une fourchette de douglas,
          cumaru, garapa et composite WPC à arbitrer selon budget et tolérance à l&apos;entretien.
          Cet article couvre les essences qui tiennent réellement, la pente d&apos;évacuation
          obligatoire de 1 %, la classification antidérapance R11 minimum, et la conformité à la
          norme NF P90-306 (barrière de sécurité). Tous les budgets sont calculés pour 30 m² de
          plage typique, mai 2026.
        </p>

        <h2 className="content-h2">Les essences qui résistent vraiment au chlore et aux UV</h2>
        <p className="content-snippet">
          Trois essences exotiques classe 1 EN 350 tiennent sans entretien sur 30 ans
          autour d&apos;une piscine&nbsp;: ipé (densité 1&nbsp;050&nbsp;kg/m³),
          cumaru (proche de l&apos;ipé pour 30&nbsp;% moins cher) et garapa (plus clair, durée de vie
          25-30 ans). Le pin traité classe 4 ne tient pas plus de 6-8 ans en bord de bassin chloré —
          à éviter sauf budget très contraint. Le composite WPC est une alternative à 25-30 ans sans
          entretien.
        </p>
        <p className="content-body">
          L&apos;eau chlorée est plus agressive sur le bois que la pluie : elle décape les huiles
          naturelles du bois, ouvre les fibres et accélère le grisaillement. À cela s&apos;ajoute la
          réverbération UV de la surface d&apos;eau qui double l&apos;exposition solaire de la lame
          côté piscine. Trois familles d&apos;essences répondent à cette double contrainte, avec
          des compromis différents.
        </p>

        <h3 className="content-h3">Bois exotiques classe 1 — la référence durée de vie</h3>
        <p className="content-body">
          L&apos;ipé, le cumaru, le garapa et le padouk sont en classe 1 selon la norme EN 350 (la plus
          résistante). Leur teneur naturelle en huiles et silices les rend insensibles aux
          champignons xylophages, aux termites et aux variations d&apos;hygrométrie de bord de
          bassin. Aucun traitement chimique nécessaire.
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Ipé :</strong> densité 1 050 kg/m³, durée de vie 30-50 ans, prix 110-130 €/m² lame
            seule (mai 2026). La référence absolue. Grain naturellement rugueux qui atteint R11
            sans rainurage.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Cumaru :</strong> densité 1 080 kg/m³, durée de vie 25-40 ans, prix 75-90 €/m²
            (~30 % moins cher que l&apos;ipé). Aspect proche, légèrement plus rougeâtre. L&apos;alternative
            sérieuse à l&apos;ipé pour qui veut une durabilité comparable.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Garapa :</strong> densité 850 kg/m³, durée de vie 25-30 ans, prix 60-75 €/m². Teinte
            plus claire (jaune-orangé), plus douce visuellement, mais légèrement moins dense que
            l&apos;ipé. Bon compromis pour terrasses claires.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Padouk :</strong> densité 770 kg/m³, durée de vie 25-30 ans, prix 70-85 €/m². Rouge
            vif au départ, devient plus brun avec le temps. Approvisionnement FSC plus rare.
          </li>
        </ul>
        <p className="content-body">
          Contrainte commune à toutes ces essences : la dureté impose un pré-perçage systématique
          avant chaque vissage. Les vis inox A4 (résistance à la corrosion saline) sont
          recommandées même en piscine d&apos;eau douce — l&apos;atmosphère chargée en chlore
          dégrade les vis A2 standard en 4-5 ans. Surcoût visserie A4 : +25 % par rapport à
          l&apos;inox A2.
        </p>
        <p className="content-body">
          Restriction réglementaire à connaître : le règlement européen RBUE n°995/2010 (entré en
          application le 3 mars 2013) impose une diligence raisonnée à tout importateur de bois
          dans l&apos;Union européenne, pour exclure les origines illégales. En pratique, les
          enseignes françaises ne vendent que des lames certifiées FSC ou PEFC — vérifier la
          mention sur l&apos;étiquette pour éviter les revendeurs informels.
        </p>

        <h3 className="content-h3">Bois composite WPC — l&apos;option zéro entretien</h3>
        <p className="content-body">
          Le bois composite (Wood Plastic Composite) combine 60 % de fibres de bois recyclées et
          40 % de polymère HDPE. Insensible au chlore, aux UV, aux insectes. Aucun saturateur,
          aucun grisaillement, aucune écharde. Prix matière : 70-95 €/m² pour les gammes
          professionnelles. Durée de vie 25-30 ans en bord de bassin sans entretien.
        </p>
        <p className="content-body">
          Deux inconvénients à intégrer dans le choix. D&apos;abord, la lame composite chauffe plus
          que le bois sous le soleil — températures de surface mesurées jusqu&apos;à 70 °C en été
          dans le Sud-Est, à inconfortable pour les pieds nus. Ensuite, l&apos;aspect plastique
          reste reconnaissable de près malgré les progrès des finitions imitation bois. Choix
          plutôt orienté praticité que rendu esthétique haut de gamme.
        </p>

        <h3 className="content-h3">Pin traité classe 4 — éviter sauf budget contraint</h3>
        <p className="content-body">
          Le pin sylvestre traité autoclave classe 4 (la classe d&apos;emploi pour contact sol
          humide permanent) tient 15-20 ans dans une terrasse de jardin standard. En bord de
          piscine chlorée, sa durée de vie chute à 6-8 ans. Le traitement aux sels de cuivre est
          lessivé progressivement par le chlore, et le bois finit par pourrir par-dessous.
        </p>
        <p className="content-body">
          Si le budget impose vraiment le pin, deux précautions limitent la casse : doubler
          l&apos;épaisseur de traitement en demandant du classe 4 &quot;haute imprégnation&quot;
          (rétention supérieure à 12 kg/m³), et appliquer un saturateur spécifique piscine tous les
          18-24 mois. Sur 25 ans, le surcoût d&apos;entretien et de remplacement à mi-parcours
          dépasse le surcoût d&apos;achat initial d&apos;un ipé.
        </p>

        <PullQuote>
          Autour d&apos;une piscine chlorée, le pin traité tient 6-8 ans&nbsp;; l&apos;ipé, <strong>30 à 50 ans</strong> sans entretien.
        </PullQuote>

        <h2 className="content-h2">Antidérapance — la règle qui n&apos;est pas optionnelle</h2>
        <p className="content-snippet">
          La classification DIN 51130 définit 5 niveaux d&apos;adhérence (R9 à R13). Pour une plage
          de piscine, R11 minimum est la recommandation universelle. Une lame lisse non rainurée
          descend à R9 et devient dangereuse mouillée, surtout sur pente. Les lames rainurées
          profondes ou les bois à grain naturellement rugueux (ipé, cumaru) atteignent R11-R12
          sans traitement supplémentaire.
        </p>
        <p className="content-body">
          La norme allemande DIN 51130 mesure le coefficient d&apos;adhérence d&apos;un revêtement
          posé en pente progressive avec un opérateur pieds nus, jusqu&apos;à ce qu&apos;il glisse.
          L&apos;angle de glissement détermine le classement R9 (faible adhérence) à R13 (très
          forte). Ce classement est devenu la référence internationale, y compris en France où il
          n&apos;est pas réglementaire mais systématiquement exigé par les assureurs habitation
          autour des piscines privées.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Classement DIN 51130</th>
              <th>Angle de glissement</th>
              <th>Usage typique</th>
              <th>Adapté piscine ?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>R9</td>
              <td>6-10°</td>
              <td>Intérieur sec</td>
              <td>Non — dangereux mouillé</td>
            </tr>
            <tr>
              <td>R10</td>
              <td>10-19°</td>
              <td>Cuisines pro, sanitaires</td>
              <td>Tolérable hors zone humide</td>
            </tr>
            <tr>
              <td>R11</td>
              <td>19-27°</td>
              <td>Plages piscine, vestiaires</td>
              <td><strong>Minimum recommandé</strong></td>
            </tr>
            <tr>
              <td>R12</td>
              <td>27-35°</td>
              <td>Industrie alimentaire</td>
              <td>Optimal pieds nus mouillés</td>
            </tr>
            <tr>
              <td>R13</td>
              <td>&gt; 35°</td>
              <td>Industrie chimique</td>
              <td>Excessif pour particulier</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Trois méthodes pour atteindre R11 sur une terrasse bois piscine :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lames rainurées profondes :</strong> rainurage usiné en surface (5-7 rainures par
            lame, profondeur 2-3 mm). La majorité des lames de terrasse vendues en GSB sont
            disponibles en version &quot;face piscine&quot; rainurée. Aucun surcoût ou très faible
            (~5 %).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Bois à grain naturellement rugueux :</strong> l&apos;ipé et le cumaru atteignent
            R11 sans rainurage grâce à leur grain serré. Pose plus simple (lame réversible), rendu
            esthétique plus net.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Traitement antidérapant rapporté :</strong> films ou peintures techniques
            additives. À éviter en première intention — ces traitements vieillissent mal, doivent
            être rénovés tous les 3-4 ans et compromettent la garantie matière.
          </li>
        </ul>

        <h2 className="content-h2">Pente d&apos;évacuation — 1 % minimum non-négociable</h2>
        <p className="content-snippet">
          1&nbsp;% minimum (1&nbsp;cm par mètre) vers la piscine ou vers un exutoire extérieur. Sans
          pente, l&apos;eau stagne entre les lames, le bois pourrit par-dessous et les lames
          gauchissent en 2-3 saisons. Sur une plage de 4&nbsp;m de large, cela représente 4&nbsp;cm
          de dénivelé total. La pente s&apos;apprécie sur les lambourdes, pas sur les lames — la
          pose des plots réglables tient compte de ce delta.
        </p>
        <p className="content-body">
          Une terrasse plate autour d&apos;une piscine se comporte comme un bac de rétention : la
          pluie, les éclaboussures et la condensation s&apos;accumulent entre les lames. Le bois
          dessous reste humide en permanence, ce qui dépasse même la classe d&apos;emploi 4 prévue
          pour contact sol humide intermittent. Trois saisons d&apos;exposition suffisent à voir les
          premières lames gauchir et la pourriture s&apos;installer sur les lambourdes.
        </p>
        <p className="content-body">
          Sens de la pente : deux options selon la configuration du terrain :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pente vers la piscine</strong> (option la plus courante) : l&apos;eau ruisselle vers
            le bassin et est traitée par le système de filtration. Avantage : pas de canalisation
            d&apos;évacuation à prévoir. Inconvénient : surcharge le système de filtration en
            saison de pluies.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pente vers l&apos;extérieur</strong> (recommandé si terrain en pente naturelle) :
            l&apos;eau ruisselle vers un caniveau périphérique ou un puits perdu. Préserve la
            piscine du débordement et de la pollution organique (feuilles, insectes). Demande la
            pose d&apos;un caniveau en bordure de plage.
          </li>
        </ul>
        <p className="content-body">
          La pente s&apos;apprécie sur les lambourdes lors de la pose des plots réglables. Sur une
          plage de 4 m de large à 1 % de pente, le plot le plus bas est réglé à 4 cm de moins
          que le plus haut. Le contrôle se fait au niveau laser rotatif — l&apos;œil ne perçoit pas
          une pente de 1 %, et un défaut de 5 mm sur 4 m de portée suffit à créer une flaque
          d&apos;eau persistante.
        </p>

        <h2 className="content-h2">Sécurité piscine — la barrière NF P90-306 obligatoire</h2>
        <p className="content-snippet">
          Toute piscine enterrée ou semi-enterrée privée doit être équipée d&apos;au moins un
          dispositif normalisé&nbsp;: barrière NF P90-306, alarme NF P90-307, couverture
          NF P90-308 ou abri NF P90-309 (loi Raffarin n°2003-9 du 3 janvier 2003, codifiée au
          Code de la construction et de l&apos;habitation). L&apos;absence de dispositif est passible
          d&apos;une amende pénale de 45&nbsp;000&nbsp;€. La terrasse bois ne dispense pas de cette obligation — la barrière
          s&apos;installe sur ou autour de la plage.
        </p>
        <p className="content-body">
          La loi du 3 janvier 2003 (loi Raffarin) impose à tous les propriétaires de piscines
          enterrées ou semi-enterrées privées de les équiper d&apos;au moins un des quatre
          dispositifs de sécurité normalisés. La loi est entrée en application complète en
          janvier 2006. Sa transgression est sanctionnée par une amende pénale pouvant atteindre
          45 000 € — peu de condamnations dans les faits, mais la responsabilité civile et
          pénale du propriétaire est engagée en cas d&apos;accident.
        </p>

        <Callout type="warn">
          Une piscine enterrée ou semi-enterrée privée doit avoir au moins un dispositif normalisé
          (barrière, alarme, couverture ou abri) — loi du 3&nbsp;janvier 2003. La terrasse bois n&apos;en
          dispense pas&nbsp;: l&apos;absence de dispositif expose à une amende pénale jusqu&apos;à
          45&nbsp;000&nbsp;€.
        </Callout>

        <p className="content-body">
          Les quatre dispositifs reconnus :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Barrière NF P90-306 :</strong> hauteur minimale 1,10 m, sans point d&apos;appui
            extérieur, fermeture automatique. Coût : 300-800 € par dizaine de mètres linéaires en
            aluminium ou polyester, à intégrer dans la conception de la plage bois.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Alarme NF P90-307 :</strong> détection d&apos;immersion ou de chute. Coût : 200-400
            € pour un détecteur sérieux. Moins protectrice (réagit après la chute, pas avant) mais
            la moins intrusive visuellement.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Couverture NF P90-308 :</strong> bâche rigide ou volet roulant supportant le poids
            d&apos;un enfant. Coût : 1 500-6 000 € selon dimensions.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Abri NF P90-309 :</strong> structure couvrante (plat, mi-hauteur, haut) répondant à
            la norme. Coût : 3 000-15 000 € selon type.
          </li>
        </ul>
        <p className="content-body">
          Implications pour la terrasse bois : la barrière (option la plus courante) se fixe sur les
          poteaux scellés dans la dalle béton sous la terrasse, ou intégrée à la structure des
          lambourdes par des sabots métalliques renforcés. Prévoir le passage des montants de
          barrière lors de la pose des lames — découpe propre et joint silicone sanitaire.
        </p>

        <h2 className="content-h2">Budget par essence pour une plage de 30 m²</h2>
        <p className="content-snippet">
          Hors pose pour 30&nbsp;m² de plage&nbsp;: 1&nbsp;600&nbsp;€ en pin traité classe 4
          (déconseillé, 6-8 ans), 2&nbsp;200&nbsp;€ en douglas (compromis, 12-15 ans),
          3&nbsp;100&nbsp;€ en composite WPC (25-30 ans sans entretien), 3&nbsp;700&nbsp;€ en ipé
          certifié FSC (30-50 ans). Pose artisan : +50-60&nbsp;€/m², soit 1&nbsp;500-1&nbsp;800&nbsp;€
          supplémentaires. Total clé en main 3&nbsp;100 à 5&nbsp;500&nbsp;€.
        </p>
        <p className="content-body">
          Les calculs ci-dessous portent sur une plage typique de 30 m² (par exemple 6 m × 5 m
          autour d&apos;une piscine 4 m × 8 m). Ils incluent les lames, lambourdes en pin traité
          classe 4 (la structure cachée n&apos;est pas en contact avec l&apos;eau), plots réglables
          et visserie inox A4 (obligatoire bord de piscine). Hors fondations béton et barrière de
          sécurité.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Essence</th>
              <th>Durée de vie</th>
              <th>Matériaux 30 m²</th>
              <th>Pose artisan</th>
              <th>Total clé en main</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pin traité cl.4 (déconseillé)</td>
              <td>6-8 ans</td>
              <td>~1 600 €</td>
              <td>~1 500 €</td>
              <td>~3 100 €</td>
            </tr>
            <tr>
              <td>Douglas</td>
              <td>12-15 ans</td>
              <td>~2 200 €</td>
              <td>~1 500 €</td>
              <td>~3 700 €</td>
            </tr>
            <tr>
              <td>Composite WPC</td>
              <td>25-30 ans</td>
              <td>~3 100 €</td>
              <td>~1 650 €</td>
              <td>~4 750 €</td>
            </tr>
            <tr>
              <td>Garapa FSC</td>
              <td>25-30 ans</td>
              <td>~2 700 €</td>
              <td>~1 800 €</td>
              <td>~4 500 €</td>
            </tr>
            <tr>
              <td>Cumaru FSC</td>
              <td>25-40 ans</td>
              <td>~3 000 €</td>
              <td>~1 800 €</td>
              <td>~4 800 €</td>
            </tr>
            <tr>
              <td>Ipé FSC</td>
              <td>30-50 ans</td>
              <td>~3 700 €</td>
              <td>~1 800 €</td>
              <td>~5 500 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          La lecture économique long terme penche fortement vers les essences exotiques classe 1.
          Sur 30 ans, le pin demande quatre remplacements complets (donc x4 le budget initial) plus
          un saturateur tous les 18 mois (180-250 € par traitement). L&apos;ipé ne demande rien.
          Sur la durée d&apos;exploitation, l&apos;ipé devient l&apos;option économiquement la plus
          rationnelle malgré son investissement initial 2x supérieur au pin.
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Calculateur en direct</p>
          <p className="content-cta-box-title">Devis matériaux pour vos dimensions exactes</p>
          <p className="content-cta-box-desc">
            Notre simulateur terrasse calcule la nomenclature précise par essence et compare
            les quatre enseignes (prix rafraîchis chaque lundi).
          </p>
          <a href="/calculateur" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Entretien spécifique plage piscine</h2>
        <p className="content-snippet">
          Trois actions par an minimum&nbsp;: nettoyage haute pression à 60 bars maximum (au-delà
          le bois éclate), rinçage à l&apos;eau claire après chaque vidange du bassin, saturateur
          tous les 18-24 mois pour les essences non-exotiques. Les bois exotiques classe 1 ne
          demandent qu&apos;un nettoyage annuel — pas de saturateur.
        </p>
        <p className="content-body">
          Le chlore agresse même les essences exotiques sur la durée — pas au point de les détruire,
          mais suffisamment pour les ternir. Un nettoyage annuel au printemps suffit à conserver
          l&apos;aspect d&apos;origine sur 20 ans. Procédure standard : balayage des résidus,
          détergent neutre pH 7 à pH 8 dilué à 5 %, frottage doux à la brosse souple, rinçage
          haute pression douce (60 bars maximum), séchage 24 h avant remise en service.
        </p>
        <p className="content-body">
          Erreurs à éviter : l&apos;eau de Javel pure (décolore et fragilise les fibres), le
          karcher haute pression au-dessus de 100 bars (arrache les fibres du bois, gâche
          l&apos;antidérapance), et les huiles teintées pour bois exotiques (saturent en surface
          sans pénétrer, finissent par s&apos;écailler).
        </p>

        <h2 className="content-h2">Questions fréquentes</h2>

        <h3 className="content-h3">Quelles essences résistent vraiment au chlore et aux UV autour d&apos;une piscine ?</h3>
        <p className="content-body">
          Trois essences exotiques classe 1 EN 350 tiennent sans entretien : ipé (densité 1 050
          kg/m³, 30-50 ans), cumaru (très proche de l&apos;ipé pour 30 % moins cher), garapa (plus
          clair, durée de vie 25-30 ans). Le padouk et le teck conviennent aussi mais
          l&apos;approvisionnement FSC est plus contraint. Le pin traité classe 4 ne tient pas plus
          de 6-8 ans en bord de bassin chloré — à éviter sauf budget très contraint.
        </p>

        <h3 className="content-h3">L&apos;antidérapance est-elle obligatoire pour une terrasse de piscine ?</h3>
        <p className="content-body">
          Pas une obligation réglementaire stricte pour le particulier, mais une exigence de
          sécurité civile. La classification DIN 51130 définit 5 niveaux d&apos;adhérence (R9 à
          R13). Pour une plage de piscine, R11 minimum est la recommandation universelle des
          professionnels. Une lame lisse non rainurée descend à R9 et devient dangereuse mouillée,
          surtout sur pente. Les lames rainurées profondes ou les bois à grain naturellement
          rugueux (ipé, cumaru) atteignent R11-R12 sans traitement.
        </p>

        <h3 className="content-h3">Quelle pente pour évacuer l&apos;eau d&apos;une terrasse de piscine ?</h3>
        <p className="content-body">
          1 % minimum (1 cm par mètre) vers la piscine ou vers un exutoire extérieur. La pente est
          non-négociable — sans pente, l&apos;eau stagne entre les lames, le bois pourrit par-dessous
          et les lames gauchissent en 2-3 saisons. Sur une plage de 4 m de large, cela représente
          4 cm de dénivelé total entre le mur le plus haut et la margelle. La pente s&apos;apprécie
          sur les lambourdes, pas sur les lames — la pose des plots réglables tient compte de ce
          delta.
        </p>

        <h3 className="content-h3">Faut-il une barrière de sécurité pour une piscine entourée d&apos;une terrasse bois ?</h3>
        <p className="content-body">
          Oui — toute piscine enterrée ou semi-enterrée privée à usage individuel ou collectif doit
          être équipée d&apos;au moins un dispositif normalisé : barrière NF P90-306, alarme NF
          P90-307, couverture NF P90-308 ou abri NF P90-309 (loi Raffarin n°2003-9 du 3 janvier
          2003, codifiée au Code de la construction et de l&apos;habitation). L&apos;absence de
          dispositif est passible d&apos;une amende pénale de 45 000 €. La terrasse bois autour de la piscine ne dispense pas de cette
          obligation — la barrière s&apos;installe sur ou autour de la plage.
        </p>

        <h3 className="content-h3">Budget approximatif pour une plage piscine bois de 30 m² ?</h3>
        <p className="content-body">
          Hors pose : 1 600 € en pin traité classe 4 (déconseillé, durée 6-8 ans), 2 200 € en
          douglas (compromis raisonnable, 12-15 ans), 3 100 € en composite WPC (25-30 ans sans
          entretien), 3 700 € en ipé certifié FSC (30-50 ans). Ajouter 50-60 €/m² pour la pose
          artisan, soit 1 500-1 800 € de main-d&apos;œuvre pour 30 m². Total clé en main : 3 100 €
          (pin) à 5 500 € (ipé).
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/terrasse">Guide terrasse complet</Link> — DTU 51.4, lambourdes, plots, pose des lames</li>
            <li><Link href="/guides/prix-terrasse-bois-m2-2026">Prix terrasse au m² 2026</Link> — comparatif essence × enseigne</li>
            <li><Link href="/guides/terrasse-composite-ou-bois">Terrasse composite ou bois</Link> — bois ou WPC : durée de vie, entretien, glissance et chaleur au soleil</li>
            <li><Link href="/guides/soi-meme-ou-pro">Soi-même ou faire faire</Link> — critères de décision</li>
            <li><Link href="/calculateur">Calculateur terrasse bois</Link> — devis matériaux + plan 3D</li>
          </ul>
        </aside>

        <CTALead projectHref="/calculateur" projectLabel="ma terrasse" />

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 25 mai 2026. Sources
            réglementaires : <Link href="/sources">Légifrance loi 2003-9 du 3 janvier 2003 (loi
            Raffarin sécurité piscines)</Link>, normes NF P90-306 à 309, norme DIN 51130
            antidérapance, RBUE 995/2010 importation bois.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources DTU et juridiques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
