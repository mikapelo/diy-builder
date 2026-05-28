import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Pergola avec panneaux solaires : guide DIY 2026';
const OG_SUBTITLE = 'Prix · réglementation · aides · faisabilité réelle';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=pergola`;

export const metadata = {
  title: 'Pergola avec panneaux solaires : guide DIY 2026 (prix, aides, démarches)',
  description:
    'Construire une pergola DIY et y greffer un kit solaire en 2026 : prix réel, réglementation (1,8 m, Consuel, Enedis), aides cumulables et verdict honnête DIY ou pro.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/pergola-panneaux-solaires-diy-2026' },
  openGraph: {
    title: 'Pergola avec panneaux solaires : guide DIY 2026 | DIY Builder',
    description:
      'Pergola bois DIY + kit photovoltaïque 500 Wc à 2 100 Wc : faisabilité, structure, démarches, aides 2026 et chiffrage honnête face à une pergola solaire intégrée.',
    url: 'https://www.diy-builder.fr/guides/pergola-panneaux-solaires-diy-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Pergola avec panneaux solaires DIY 2026 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pergola avec panneaux solaires : guide DIY 2026 (prix, aides, faisabilité)',
  description:
    'Comparatif honnête entre pergola DIY + kit solaire plug & play et pergola solaire intégrée en 2026. Charges structure, démarches Consuel/Enedis, aides cumulables (TVA 5,5 %, prime autoconsommation) et ROI sur 25 ans.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-05-27',
  dateModified: '2026-05-27',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/pergola-panneaux-solaires-diy-2026',
  image: OG_URL,
  about: ['Pergola', 'Panneaux solaires photovoltaïques', 'Autoconsommation'],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide pergola', item: 'https://www.diy-builder.fr/guides/pergola' },
    { '@type': 'ListItem', position: 4, name: 'Pergola avec panneaux solaires 2026', item: 'https://www.diy-builder.fr/guides/pergola-panneaux-solaires-diy-2026' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Faut-il une déclaration préalable pour ajouter des panneaux solaires sur une pergola en 2026 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui dans la quasi-totalité des cas. La pergola elle-même déclenche une déclaration préalable de travaux dès qu’elle dépasse 1,80 m de hauteur ou 5 m² d’emprise. L’ajout de panneaux photovoltaïques en surimpression sur une pergola existante modifie l’aspect extérieur du bâti et déclenche une nouvelle déclaration préalable (article R421-17 du Code de l’urbanisme), à laquelle s’ajoute le raccordement Enedis et l’attestation Consuel si l’installation est raccordée au réseau. En zone ABF (périmètre de 500 m autour d’un monument historique), un avis supplémentaire de l’Architecte des Bâtiments de France est obligatoire et peut imposer une orientation des panneaux différente de l’optimum solaire.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel poids supporte une pergola DIY classique avec des panneaux solaires en surimpression ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un panneau photovoltaïque standard pèse 18 à 22 kg pour 1,7 m² de surface, soit environ 11 à 13 kg/m². Avec les rails de fixation aluminium et les fixations, on monte à 14 à 16 kg/m² de charge permanente. À cette charge s’ajoute la charge climatique (neige et vent) imposée par l’Eurocode 1, qui varie de 40 à 90 kg/m² selon la région et l’altitude. Une pergola DIY classique en chevrons 80×50 mm dimensionnée pour une portée de 3 m supporte ces valeurs sans renforcement. Au-delà de 3,5 m de portée, on passe en chevrons 100×50 mm, ce qui ajoute 25 à 35 € HT par mètre linéaire au budget bois.',
      },
    },
    {
      '@type': 'Question',
      name: 'Une pergola DIY avec kit solaire coûte combien comparée à une pergola solaire intégrée ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Une pergola DIY 4×3 m en bois autoclave classe 4 revient à 800 à 1 200 € de matière (chevrons, poteaux, lambourdes, visserie). Avec un kit photovoltaïque plug & play 500 Wc à 2 100 Wc en surimpression, on ajoute 430 à 2 800 € selon la puissance, hors fixations spécifiques (50 à 120 €). Total complet : 1 280 à 4 120 €. Une pergola solaire intégrée prête à poser de surface équivalente démarre à 800 €/m² (≈ 9 600 € pour 12 m²) et monte couramment à 1 200 €/m² (≈ 14 400 € pour 12 m²) ; sur des surfaces supérieures (15-20 m²) ou en haut de gamme, le total monte à 18 000-25 000 € installée. La différence se justifie par l’intégration esthétique des panneaux dans la toiture, l’absence de fixations apparentes et l’éligibilité aux aides du Pro.',
      },
    },
    {
      '@type': 'Question',
      name: 'Le DIY fait-il vraiment perdre les aides 2026 (TVA 5,5 %, prime autoconsommation, MaPrimeRénov\') ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui pour la prime à l’autoconsommation et le tarif de rachat surplus EDF OA, qui exigent une pose par entreprise certifiée et un contrat CRAE Enedis. La prime est de 80 €/kWc jusqu’à 9 kWc au T2 2026 (240 € pour 3 kWc), versée sur 5 ans. La TVA 5,5 % (article 278-0 bis du Code général des impôts) est théoriquement réservée à la pose pro mais elle est devenue presque inaccessible depuis l’arrêté du 8 septembre 2025 : bilan carbone modules inférieur à 530 kgCO2eq/kWc certifié Certisolis PPE2-V2, système de gestion d’énergie obligatoire, pose par professionnel certifié à partir du 1er mars 2026. MaPrimeRénov\' ne concerne pas le photovoltaïque pur (uniquement le solaire thermique). Sur un projet 3 kWc à 8 000 € TTC installé avec TVA 5,5 % effectivement accessible, le manque à gagner DIY cumulé est de l’ordre de 1 200 à 1 400 € — sans la TVA 5,5 %, le DIY perd seulement 240 € de prime plus la revente surplus marginale (0,04 €/kWh au T2 2026).',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle orientation et quelle pente choisir pour une pergola solaire DIY en France ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'L’orientation plein sud reste la référence en France métropolitaine, avec une production maximale. Une orientation sud-est ou sud-ouest perd 5 à 8 % de production sur l’année. Une orientation est ou ouest perd 15 à 20 %. Pour la pente, l’optimum annuel est de 30 à 35° au nord de la Loire, 25 à 30° dans le Sud. Une pente plus faible (15 à 20°), souvent imposée par l’esthétique de la pergola, fait perdre 4 à 6 % de production annuelle mais améliore la production estivale, ce qui est souvent recherché en autoconsommation lorsque la consommation domestique (climatisation, piscine) est concentrée l’été. Sous 10° de pente, prévoir un nettoyage manuel annuel des panneaux car la pluie ne suffit plus à évacuer poussières et pollens.',
      },
    },
  ],
};

export default function PergolaPanneauxSolairesDiy2026Page() {
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
          <Link href="/guides/pergola">Guide pergola</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Pergola + panneaux solaires 2026</span>
        </nav>

        <h1 className="content-h1">
          Pergola avec panneaux solaires : guide DIY 2026 (prix, aides, faisabilité)
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 27 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        <p className="content-lead">
          Greffer un kit photovoltaïque sur une pergola que vous construisez vous-même
          revient quatre à six fois moins cher qu&apos;une pergola solaire intégrée prête à
          poser&nbsp;: 1 280 à 4 120 € contre 9 600 à 14 400 € pour 12 m² (et jusqu&apos;à
          20 000 € sur des surfaces de 15-20 m² ou en haut de gamme). Le DIY fait perdre
          la TVA réduite à 5,5 % et la prime à l&apos;autoconsommation, soit 700 à 1 200 €
          d&apos;aides en moins selon profil. Mais la TVA 5,5 % est devenue presque
          inaccessible depuis l&apos;arrêté du 8 septembre 2025 (critères environnementaux
          stricts, EMS obligatoire), et le tarif de rachat surplus EDF OA est tombé à
          0,04 €/kWh au T2 2026 — l&apos;arbitrage Pro perd beaucoup de son avantage.
          Ce guide chiffre la structure, déroule les démarches Consuel + Enedis et
          compare les kits plug &amp; play français disponibles en 2026.
        </p>

        <h2 className="content-h2">1. Pergola DIY + kit solaire ou pergola solaire intégrée&nbsp;: le bon arbitrage</h2>
        <p className="content-snippet">
          La pergola DIY avec kit photovoltaïque en surimpression vise les bricoleurs
          qui veulent un projet sous 4 000 €, une production d&apos;appoint de 500 à 2 100 Wc
          et acceptent de perdre les aides RGE. La pergola solaire intégrée vise les ménages
          qui veulent une installation 3 à 6 kWc raccordée réseau avec aides cumulées et
          intégration esthétique propre. Ces deux projets ne s&apos;adressent pas au même
          public.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Critère</th>
              <th>Pergola DIY + kit plug &amp; play</th>
              <th>Pergola solaire intégrée pro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Coût 12 m² (4×3 m)</td>
              <td>1 280 à 4 120 € TTC</td>
              <td>9 600 à 14 400 € TTC</td>
            </tr>
            <tr>
              <td>Puissance installée</td>
              <td>0,5 à 2,1 kWc</td>
              <td>3 à 6 kWc</td>
            </tr>
            <tr>
              <td>Production annuelle (Nantes)</td>
              <td>600 à 2 500 kWh</td>
              <td>3 300 à 6 600 kWh</td>
            </tr>
            <tr>
              <td>TVA</td>
              <td>20 %</td>
              <td>5,5 % si critères arrêté 8 sept 2025 réunis (rare)</td>
            </tr>
            <tr>
              <td>Prime autoconsommation T2 2026</td>
              <td>Non éligible</td>
              <td>80 €/kWc jusqu&apos;à 9 kWc</td>
            </tr>
            <tr>
              <td>Raccordement réseau</td>
              <td>Facultatif (prise classique)</td>
              <td>Obligatoire (Consuel + Enedis)</td>
            </tr>
            <tr>
              <td>Revente surplus EDF OA</td>
              <td>Non</td>
              <td>0,04 €/kWh T2 2026 (≤ 9 kWc)</td>
            </tr>
            <tr>
              <td>Démarche urbanisme</td>
              <td>DP au-delà 1,8 m ou 5 m²</td>
              <td>DP systématique + Consuel</td>
            </tr>
            <tr>
              <td>Garantie produit</td>
              <td>25 ans (Beem, Sunology)</td>
              <td>25 ans + décennale pose</td>
            </tr>
            <tr>
              <td>ROI moyen au tarif 2026</td>
              <td>8 à 11 ans (autoconso seule)</td>
              <td>12 à 14 ans (avec aides accessibles)</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le DIY gagne sur les petites puissances (0,5 à 1 kWc) où la prime à
          l&apos;autoconsommation reste modeste (80 €/kWc, soit 240 € pour 3 kWc) et où
          la TVA 5,5 % est en pratique inaccessible (l&apos;arrêté du 8 septembre 2025 exige
          un bilan carbone des modules inférieur à 530 kgCO2eq/kWc certifié Certisolis
          PPE2-V2, condition que très peu de références remplissent début 2026). Le Pro
          reprend l&apos;avantage à partir de 6 kWc, lorsque la production absorbe une grosse
          consommation domestique (pompe à chaleur, climatisation, recharge véhicule
          électrique). Entre 1 et 3 kWc, l&apos;arbitrage économique est serré au tarif
          2026&nbsp;: si vous n&apos;avez pas envie de gérer Consuel, Enedis et les calculs
          de section électrique, le devis pro tient la comparaison.
        </p>

        <div className="content-disclaimer">
          <strong>Avertissement&nbsp;:</strong> un projet d&apos;arrêté transmis au Conseil
          supérieur de l&apos;énergie le 2 avril 2026 prévoit la suppression de la prime à
          l&apos;autoconsommation et l&apos;abaissement du tarif de rachat surplus à
          0,011 €/kWh. Texte non encore en vigueur à la date de publication ; vérifier
          l&apos;état réglementaire au moment du projet.
        </div>

        <p className="content-body">
          Notre simulateur pergola intègre déjà les sections de bois adaptées à la pose de
          panneaux. Avant de chiffrer un kit photovoltaïque, dimensionnez d&apos;abord la
          structure&nbsp;: vous saurez si elle est compatible et combien coûte le matériel
          bois.
        </p>

        <CTALead projectHref="/pergola" projectLabel="ma pergola" />

        <h2 className="content-h2">2. Structure&nbsp;: ce qui change avec des panneaux en toiture</h2>
        <p className="content-snippet">
          Ajouter des panneaux photovoltaïques sur une pergola DIY ajoute une charge
          permanente de 14 à 16 kg/m² et une prise au vent supplémentaire en sous-face.
          Une pergola dimensionnée pour une couverture polycarbonate ou un voile d&apos;ombrage
          ne convient pas telle quelle&nbsp;: il faut majorer la section des chevrons et
          renforcer les ancrages au sol.
        </p>

        <p className="content-body">
          Un panneau monocristallin standard pèse 18 à 22 kg pour une surface utile de
          1,7 m², soit 11 à 13 kg/m². Les rails de fixation aluminium et la visserie ajoutent
          3 kg/m². Total&nbsp;: 14 à 16 kg/m² de charge permanente, soit pour une pergola
          4×3 m une charge supplémentaire de 168 à 192 kg répartie sur la toiture. À cela
          s&apos;ajoute la charge climatique (neige et vent) imposée par l&apos;Eurocode 1
          NF EN 1991-1, qui varie de 40 kg/m² (Bordeaux, Marseille) à 90 kg/m² (Massif central,
          altitude 800 m).
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Portée chevron</th>
              <th>Section sans panneaux</th>
              <th>Section avec panneaux</th>
              <th>Coût bois/ml supplémentaire</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2,5 m</td>
              <td>60×40 mm</td>
              <td>80×50 mm</td>
              <td>+ 8 à 12 € HT</td>
            </tr>
            <tr>
              <td>3 m</td>
              <td>80×50 mm</td>
              <td>80×50 mm (suffisant)</td>
              <td>+ 0 €</td>
            </tr>
            <tr>
              <td>3,5 m</td>
              <td>80×50 mm</td>
              <td>100×50 mm</td>
              <td>+ 12 à 18 € HT</td>
            </tr>
            <tr>
              <td>4 m</td>
              <td>100×50 mm</td>
              <td>100×75 mm</td>
              <td>+ 25 à 35 € HT</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          L&apos;entraxe des chevrons doit aussi descendre à 60 cm maximum quand la pergola
          accueille des panneaux, contre 70 à 80 cm pour une couverture légère. Cela revient
          à ajouter un à deux chevrons sur une pergola 4×3 m, soit 25 à 50 € de bois en plus.
          Côté ancrage au sol, les platines de scellement de poteaux doivent être dimensionnées
          en arrachement&nbsp;: un panneau exposé au vent en zone 2 (Bretagne, Nord, façade
          atlantique) génère un effort de soulèvement de 70 à 90 kg par mètre carré de
          panneau, ce qui implique des tire-fond M12 minimum et des fondations béton de
          50 cm de profondeur par poteau, pas des plots à visser.
        </p>

        <p className="content-body">
          Côté orientation, la pente recommandée est de 15 à 30° avec inclinaison plein sud,
          ce qui correspond à la pente standard d&apos;une pergola mono-pente classique. Une
          pente sous 10° complique le rinçage naturel par la pluie et impose un nettoyage
          manuel annuel des panneaux, opération à prévoir dans votre plan d&apos;entretien.
        </p>

        <h2 className="content-h2">3. Démarches 2026&nbsp;: déclaration préalable, Consuel, Enedis</h2>
        <p className="content-snippet">
          Une pergola équipée de panneaux solaires déclenche trois processus
          administratifs distincts&nbsp;: la déclaration préalable de travaux (DP) en mairie,
          l&apos;attestation de conformité Consuel, et la convention de raccordement Enedis si
          vous voulez revendre votre surplus à EDF Obligation d&apos;Achat. Sans raccordement
          réseau, seule la DP est exigée pour la structure.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Configuration</th>
              <th>DP mairie</th>
              <th>Consuel</th>
              <th>Enedis</th>
              <th>Délai global</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pergola &lt; 1,8 m sans raccord réseau</td>
              <td>Non</td>
              <td>Non</td>
              <td>Non</td>
              <td>0 mois</td>
            </tr>
            <tr>
              <td>Pergola &gt; 1,8 m sans raccord réseau</td>
              <td>Oui (Cerfa 13703)</td>
              <td>Non</td>
              <td>Non</td>
              <td>1 mois</td>
            </tr>
            <tr>
              <td>Pergola + raccord réseau autoconso pure</td>
              <td>Oui (Cerfa 13703)</td>
              <td>Oui (visa Bleu)</td>
              <td>CRAE (gratuit)</td>
              <td>2 à 3 mois</td>
            </tr>
            <tr>
              <td>Pergola + revente surplus EDF OA</td>
              <td>Oui (Cerfa 13703)</td>
              <td>Oui (visa Bleu)</td>
              <td>CRAE + CR&nbsp;non&nbsp;injection</td>
              <td>3 à 5 mois</td>
            </tr>
            <tr>
              <td>Pergola &gt; 20 m² ET &gt; 3 kWc</td>
              <td>Permis (Cerfa 13406)</td>
              <td>Oui (visa Bleu)</td>
              <td>CRAE</td>
              <td>4 à 6 mois</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          La déclaration préalable se dépose en mairie en 2 exemplaires papier ou via le
          téléservice GNAU (Guichet Numérique des Autorisations d&apos;Urbanisme). Pièces
          standard&nbsp;: plan de situation (extrait cadastre.gouv.fr), plan de masse, plan
          de coupe avec hauteur, plan des façades, photo proche et photo éloignée. L&apos;ajout
          des panneaux doit apparaître dans la pièce DP4 (plan des façades) et sur l&apos;insertion
          paysagère DP5. En zone Architecte des Bâtiments de France (périmètre 500 m autour
          d&apos;un monument historique), l&apos;avis ABF est obligatoire et l&apos;instruction
          passe à 2 mois. L&apos;ABF peut imposer une orientation des panneaux différente de
          l&apos;optimum solaire (par exemple, masquer les panneaux côté rue), perte de
          production à intégrer au calcul de rentabilité.
        </p>

        <p className="content-body">
          Le Consuel est exigé dès que l&apos;installation est raccordée à un onduleur connecté
          au réseau domestique au-delà d&apos;une prise simple. Concrètement&nbsp;: un kit Beem
          ou Sunology de 500 Wc qui se branche sur une prise extérieure ne déclenche pas le
          Consuel. Une installation 1 500 Wc avec onduleur central câblé au tableau, oui.
          L&apos;attestation Consuel visa Bleu (Cerfa n° 15523*01, installation PV sans
          stockage) coûte 186,31 € HT en 2026 selon le tarif officiel, certaines sources
          relevant des montants jusqu&apos;à 230 € TTC selon dossier. Elle impose le respect
          strict de la norme NF C 15-100 avec section de câble adaptée, parafoudre type 2
          et disjoncteur dédié.
        </p>

        <p className="content-body">
          La convention de raccordement Enedis (CRAE pour l&apos;autoconsommation, CR pour la
          revente totale) est gratuite et se demande en ligne sur le portail Enedis. Délai
          réel d&apos;obtention&nbsp;: 6 à 12 semaines selon région. La revente du surplus à
          EDF Obligation d&apos;Achat se fait au tarif d&apos;achat T2 2026 de
          0,04 €/kWh pour les installations sous 9 kWc (révisé chaque trimestre par la
          Commission de Régulation de l&apos;Énergie). Ce tarif a chuté de plus de 68 % en
          18 mois et un projet d&apos;arrêté d&apos;avril 2026 prévoit même de le ramener à
          0,011 €/kWh. Le contrat OA est de 20 ans, le tarif est figé à la date de demande
          complète de raccordement (DCR).
        </p>

        <CTALead projectHref="/pergola" projectLabel="ma pergola" />

        <h2 className="content-h2">4. Quel kit solaire choisir en 2026 — comparatif honnête</h2>
        <p className="content-snippet">
          Quatre marques dominent le marché français des kits solaires plug &amp; play
          en 2026&nbsp;: Beem Energy, Sunology, Sunethic, et ALLPOWERS pour les usages
          nomades. Toutes garantissent 25 ans sur les modules, varient sur la puissance,
          l&apos;onduleur intégré et le suivi temps réel. Aucune ne couvre l&apos;installation
          au-delà 1,5 kWc sans passer par un onduleur central pro.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Kit</th>
              <th>Puissance</th>
              <th>Prix 2026</th>
              <th>Onduleur</th>
              <th>Suivi temps réel</th>
              <th>Garantie</th>
              <th>Pose pergola</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Beem Kit</td>
              <td>300 ou 420 Wc</td>
              <td>299 à 599 €</td>
              <td>Micro intégré</td>
              <td>Application Beem</td>
              <td>25 ans modules</td>
              <td>Rails alu fournis</td>
            </tr>
            <tr>
              <td>Beem On 500</td>
              <td>500 Wc</td>
              <td>429 €</td>
              <td>Micro APsystems</td>
              <td>Application Beem</td>
              <td>25 ans</td>
              <td>Compatible toiture</td>
            </tr>
            <tr>
              <td>Sunology PLAY 2</td>
              <td>450 Wc</td>
              <td>599 €</td>
              <td>Micro intégré</td>
              <td>Application Sunology</td>
              <td>25 ans</td>
              <td>Station debout (pas pergola)</td>
            </tr>
            <tr>
              <td>Sunethic F500</td>
              <td>500 Wc</td>
              <td>690 €</td>
              <td>Micro intégré</td>
              <td>Application Sunethic</td>
              <td>25 ans produit + perf</td>
              <td>Pose murale possible</td>
            </tr>
            <tr>
              <td>Kit DIY APsystems 2 kWc</td>
              <td>2 000 Wc</td>
              <td>1 800 à 2 600 €</td>
              <td>Micro DS3</td>
              <td>EMA APsystems</td>
              <td>25 ans modules</td>
              <td>Pergola compatible</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Pour une pergola DIY, Beem On 500 ou un kit bifacial APsystems 2 kWc sont les
          deux options qui se posent réellement sur les chevrons. Sunology PLAY 2 est conçu
          pour rester debout au sol (station autonome) et perd son intérêt en pose pergola.
          Sunethic F500 fonctionne en pose murale ou toiture, mais le ratio €/Wc reste
          défavorable face à Beem&nbsp;: 1,38 €/Wc pour Sunethic, 1,33 €/Wc pour Sunology
          PLAY 2, 0,86 €/Wc pour Beem On 500.
        </p>

        <p className="content-body">
          Trois points qui distinguent un bon kit d&apos;un mauvais en 2026&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Micro-onduleur par panneau&nbsp;:</strong> en cas d&apos;ombrage partiel
            sur un panneau, seul le panneau ombragé baisse sa production. Avec un onduleur
            central, toute la chaîne s&apos;aligne sur le plus mauvais panneau, perte
            possible de 20 à 40 % en condition réelle.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Technologie cellule&nbsp;:</strong> TOPCon ou half-cells = 22 à 23 % de
            rendement. PERC standard = 19 à 20 %. À surface égale, le TOPCon produit 12 à
            15 % de plus sur l&apos;année.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Suivi temps réel&nbsp;:</strong> application native marque qui affiche la
            production instantanée et historique. Sans suivi, vous ne saurez jamais si la
            production correspond à ce qui était annoncé.
          </li>
        </ul>

        <p className="content-body">
          Note transparence&nbsp;: cet article ne contient aucun lien d&apos;affiliation à
          ce jour. Les marques citées le sont sur critères techniques et de positionnement
          prix. Nous mettrons à jour cette section dès que DIY Builder aura conventionné
          un programme partenaire conforme à la loi 2023-451 du 9 juin 2023.
        </p>

        <h2 className="content-h2">5. Prix complet — chiffrage bois + kit pour 4×3 m</h2>
        <p className="content-snippet">
          Chiffrage détaillé d&apos;une pergola adossée 4×3 m en pin autoclave classe 4
          équipée d&apos;un kit photovoltaïque 1 000 Wc en surimpression, avec sections
          renforcées pour porter les panneaux. Tarifs Leroy Merlin, Castorama et Brico
          Dépôt mai 2026.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Poste</th>
              <th>Détail</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Poteaux pin 9×9 cm</td>
              <td>Hauteur 2,40 m, classe 4</td>
              <td>4</td>
              <td>32 €</td>
              <td>128 €</td>
            </tr>
            <tr>
              <td>Longerons pin 100×50 mm</td>
              <td>Portée 3 m</td>
              <td>4 ml</td>
              <td>13 €/ml</td>
              <td>52 €</td>
            </tr>
            <tr>
              <td>Chevrons pin 80×50 mm</td>
              <td>Entraxe 60 cm</td>
              <td>28 ml</td>
              <td>9 €/ml</td>
              <td>252 €</td>
            </tr>
            <tr>
              <td>Lambourdes 38×60 mm</td>
              <td>Pour fixation rails</td>
              <td>24 ml</td>
              <td>5 €/ml</td>
              <td>120 €</td>
            </tr>
            <tr>
              <td>Visserie inox A2</td>
              <td>Tirefonds, équerres, sabots</td>
              <td>1 lot</td>
              <td>—</td>
              <td>180 €</td>
            </tr>
            <tr>
              <td>Platines + ancrage béton</td>
              <td>Tire-fond M12 + scellement chimique</td>
              <td>4</td>
              <td>22 €</td>
              <td>88 €</td>
            </tr>
            <tr>
              <td>Lasure protection</td>
              <td>2 couches, 5 L</td>
              <td>1</td>
              <td>52 €</td>
              <td>52 €</td>
            </tr>
            <tr>
              <td><strong>Sous-total bois</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td><strong>872 €</strong></td>
            </tr>
            <tr>
              <td>Kit Beem On 500 Wc ×2</td>
              <td>Plug &amp; play, micro-onduleur intégré</td>
              <td>2</td>
              <td>429 €</td>
              <td>858 €</td>
            </tr>
            <tr>
              <td>Rails de fixation aluminium</td>
              <td>2 panneaux</td>
              <td>1 lot</td>
              <td>—</td>
              <td>95 €</td>
            </tr>
            <tr>
              <td>Câblage extérieur + prise</td>
              <td>Câble 4 mm² + prise IP66</td>
              <td>10 ml</td>
              <td>3 €/ml</td>
              <td>30 €</td>
            </tr>
            <tr>
              <td><strong>Sous-total solaire</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td><strong>983 €</strong></td>
            </tr>
            <tr style={{ fontWeight: 'bold', backgroundColor: 'var(--color-accent-soft, #f4ebd0)' }}>
              <td>Total projet 12 m² + 1 kWc</td>
              <td></td>
              <td></td>
              <td></td>
              <td>1 855 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Sur la même surface 12 m², une pergola solaire intégrée 3 kWc clé en main démarre
          à 9 600 € TTC en entrée de gamme, soit 5 fois le budget DIY pour 3 fois la
          puissance. Le DIY reste imbattable sur le coût brut. La différence se rattrape sur
          les aides RGE QualiPV exclusives à l&apos;installateur pro, détaillées plus bas.
        </p>

        <h2 className="content-h2">6. Aides 2026 — beaucoup plus restrictives qu&apos;avant</h2>
        <p className="content-snippet">
          Trois dispositifs accompagnent l&apos;installation solaire photovoltaïque
          résidentielle en 2026, encadrés par l&apos;article 278-0 bis du Code général des
          impôts et l&apos;arrêté du 8 septembre 2025&nbsp;: la TVA réduite à 5,5 %, la prime
          à l&apos;autoconsommation versée par EDF Obligation d&apos;Achat, et le tarif de
          rachat du surplus injecté. Les conditions techniques se sont fortement durcies
          depuis le 1ᵉʳ octobre 2025, ce qui rend la TVA 5,5 % difficilement accessible
          en pratique.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Aide</th>
              <th>Montant T2 2026</th>
              <th>Conditions cumulatives</th>
              <th>DIY éligible ?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TVA réduite 5,5 % (art. 278-0 bis CGI)</td>
              <td>≈ 14,5 % d&apos;économie sur facture totale</td>
              <td>≤ 9 kWc · bilan carbone modules &lt; 530 kgCO2eq/kWc certifié Certisolis PPE2-V2 · argent &lt; 14 mg/W, plomb &lt; 0,1 %, cadmium &lt; 0,01 % · système de gestion d&apos;énergie (EMS) obligatoire · pose par pro certifié depuis le 1ᵉʳ mars 2026</td>
              <td>Non</td>
            </tr>
            <tr>
              <td>Prime à l&apos;autoconsommation</td>
              <td>80 €/kWc jusqu&apos;à 9 kWc (soit 240 € pour 3 kWc, 720 € pour 9 kWc)</td>
              <td>Pose en toiture · contrat CRAE Enedis · attestation Consuel · entreprise certifiée</td>
              <td>Non</td>
            </tr>
            <tr>
              <td>Tarif rachat surplus EDF OA</td>
              <td>0,04 €/kWh garanti 20 ans (≤ 9 kWc, T2 2026)</td>
              <td>Contrat OA · installation conforme NF EN 50438 · Consuel obtenu</td>
              <td>Non</td>
            </tr>
            <tr>
              <td>MaPrimeRénov&apos; photovoltaïque</td>
              <td>—</td>
              <td>Non applicable au photovoltaïque pur (concerne uniquement le solaire thermique)</td>
              <td>Sans objet</td>
            </tr>
            <tr>
              <td>Aides locales (région, département)</td>
              <td>Variable, 200 à 1 000 €</td>
              <td>Selon collectivité, souvent pose pro exigée</td>
              <td>Rarement</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le point dur des aides 2026 est la TVA 5,5 %&nbsp;: début 2026, seules quelques
          références (Voltec Solar et Jinko Solar partielles) disposent de la certification
          Certisolis PPE2-V2 exigée par l&apos;arrêté du 8 septembre 2025. La plupart des
          installations résidentielles restent donc à 20 % de TVA. Sur une installation
          3 kWc à 8 000 € TTC pro avec TVA 5,5 % accessible et prime autoconso, le cumul
          d&apos;aides faciales tourne autour de 1 200 à 1 400 €&nbsp;: 240 € de prime,
          1 080 € d&apos;écart TVA (= 8 000 × 14,5 %), revente surplus de l&apos;ordre de
          30 à 50 €/an (au tarif T2 2026 de 0,04 €/kWh). Sans la TVA 5,5 %, le cumul tombe
          à 240 € de prime + revente surplus, soit moins de 1 000 € sur 20 ans actualisés.
        </p>

        <p className="content-body">
          Cette équation laisse peu de marge au Pro contre le DIY au tarif T2 2026. Le Pro
          retrouve un vrai avantage à partir de 6 kWc avec autoconsommation dirigée vers une
          pompe à chaleur ou un véhicule électrique&nbsp;: la production absorbée
          intra-foyer (sans passer par la revente surplus à 0,04 €/kWh) est valorisée au
          tarif Bleu plein, soit 0,1940 €/kWh, donc 4,85 fois plus que la revente. Les
          tarifs et primes étant révisés chaque trimestre par la CRE, vérifier la grille en
          vigueur au moment de votre projet sur photovoltaique.info.
        </p>

        <h2 className="content-h2">7. Rentabilité sur 25 ans — DIY ou pro au tarif 2026</h2>
        <p className="content-snippet">
          Une installation photovoltaïque est conçue pour durer 25 à 30 ans (garantie
          modules) avec une dégradation linéaire de 0,5 % par an. Le calcul de rentabilité
          ci-dessous intègre l&apos;investissement initial, les aides 2026 effectivement
          accessibles, la production annuelle, le coût évité d&apos;électricité au tarif
          Bleu et la revente du surplus au tarif EDF OA T2 2026.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Scénario</th>
              <th>Invest. net</th>
              <th>Prod. annuelle</th>
              <th>Économie + revente an 1</th>
              <th>ROI brut</th>
              <th>Gain net 25 ans</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DIY 1 kWc plug &amp; play</td>
              <td>1 855 €</td>
              <td>1 100 kWh</td>
              <td>213 € (100 % autoconso)</td>
              <td>8,7 ans</td>
              <td>≈ + 3 700 €</td>
            </tr>
            <tr>
              <td>DIY 2 kWc pergola</td>
              <td>3 600 €</td>
              <td>2 200 kWh</td>
              <td>320 € (75 % autoconso)</td>
              <td>11,3 ans</td>
              <td>≈ + 4 100 €</td>
            </tr>
            <tr>
              <td>Pro 3 kWc avec TVA 5,5 % accessible</td>
              <td>6 920 € (après 1 080 € aides)</td>
              <td>3 300 kWh</td>
              <td>488 € (70 % autoconso + surplus 0,04 €/kWh)</td>
              <td>14,2 ans</td>
              <td>≈ + 5 300 €</td>
            </tr>
            <tr>
              <td>Pro 6 kWc avec TVA 5,5 % accessible</td>
              <td>11 500 € (après 2 200 € aides)</td>
              <td>6 600 kWh</td>
              <td>975 € (60 % autoconso + surplus)</td>
              <td>11,8 ans</td>
              <td>≈ + 12 800 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Au tarif T2 2026, le ROI est en réalité de 9 à 14 ans selon la configuration —
          loin des 6 à 7 ans annoncés dans la plupart des publicités d&apos;installateurs,
          chiffrages qui datent souvent de l&apos;époque où le tarif rachat surplus était à
          0,13 €/kWh (T4 2024) et où la TVA 10 % s&apos;appliquait largement. La chute du
          tarif EDF OA à 0,04 €/kWh (T2 2026) et le durcissement des conditions TVA 5,5 %
          rendent la revente du surplus marginale&nbsp;: 990 kWh × 0,04 € = 39,60 €/an pour
          un Pro 3 kWc autoconsommant 70 %. La vraie valeur du solaire en 2026 est dans
          l&apos;autoconsommation directe au tarif Bleu, pas dans la revente.
        </p>

        <p className="content-body">
          Hypothèses retenues&nbsp;: tarif Bleu EDF option Base mai 2026 à 0,1940 €/kWh
          TTC pour un compteur 6 kVA (source EDF), tarif rachat surplus EDF OA T2 2026 à
          0,04 €/kWh pour les installations sous 9 kWc (source CRE), dégradation modules
          de 0,5 %/an, revalorisation tarif Bleu de 3 %/an (hypothèse prudente vs +18 %
          constatés 2022-2024). Le gain net 25 ans intègre cette revalorisation et la
          dégradation, et soustrait l&apos;investissement initial. Sensibilité forte au
          taux d&apos;autoconsommation réel&nbsp;: chaque tranche de 10 % d&apos;autoconso
          en plus ajoute 30 à 50 € de gain annuel sur les puissances 3 à 6 kWc.
        </p>

        <h2 className="content-h2">8. Notre verdict — DIY ou pro&nbsp;?</h2>
        <p className="content-snippet">
          Trois critères tranchent objectivement&nbsp;: la puissance souhaitée, votre niveau
          de bricolage et votre profil de consommation. Au tarif T2 2026, le DIY 0,5 à
          1 kWc plug &amp; play est le plus rentable au ratio invest/temps. Le Pro reprend
          un avantage net à partir de 6 kWc lorsque l&apos;autoconsommation absorbe une
          grosse charge domestique (pompe à chaleur, véhicule électrique). Entre 1 et
          3 kWc, l&apos;arbitrage est serré et dépend surtout de votre capacité à gérer
          Consuel + Enedis sans aide extérieure.
        </p>

        <p className="content-body">
          Choisissez le DIY si&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            Vous voulez une production d&apos;appoint (500 à 1 500 Wc) pour réduire la
            facture sans chercher la revente surplus.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Vous avez déjà l&apos;habitude de construire en bois et de câbler une prise
            extérieure conforme NF C 15-100.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Votre pergola est sous 1,8 m de hauteur OU sous 5 m² d&apos;emprise, ce qui
            évite la déclaration préalable en mairie.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Votre commune n&apos;est ni en zone ABF, ni en site patrimonial remarquable.
          </li>
        </ul>

        <p className="content-body">
          Choisissez le pro si&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            Vous visez 3 kWc ou plus avec contrat CRAE Enedis pour la revente surplus.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Vous voulez l&apos;intégration esthétique (panneaux affleurants, pas de rails
            apparents).
          </li>
          <li style={{ marginBottom: '10px' }}>
            Vous voulez la décennale couvrant l&apos;étanchéité et la stabilité de l&apos;ouvrage,
            ce qui exclut l&apos;auto-construction.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Vous résidez en zone protégée (ABF, secteur sauvegardé) où le dossier exige
            une présentation pro.
          </li>
        </ul>

        <p className="content-body">
          Notre simulateur calcule la structure bois et le BOM en quelques minutes. Vous
          pouvez ensuite, depuis le simulateur, demander à être recontacté(e) par un
          professionnel partenaire qualifié RGE pour étudier la partie photovoltaïque, avec
          devis gratuit et sans engagement.
        </p>

        <CTALead projectHref="/pergola" projectLabel="ma pergola" />

        <h2 className="content-h2">Questions fréquentes</h2>

        <div className="content-faq">
          <h3 className="content-h3">Faut-il une déclaration préalable pour ajouter des panneaux solaires sur une pergola en 2026&nbsp;?</h3>
          <p className="content-body">
            Oui dans la quasi-totalité des cas. La pergola elle-même déclenche une
            déclaration préalable dès qu&apos;elle dépasse 1,80 m de hauteur ou 5 m²
            d&apos;emprise. L&apos;ajout de panneaux photovoltaïques en surimpression sur une
            pergola existante modifie l&apos;aspect extérieur du bâti et déclenche une
            nouvelle déclaration préalable (article R421-17 du Code de l&apos;urbanisme), à
            laquelle s&apos;ajoute le raccordement Enedis et l&apos;attestation Consuel si
            l&apos;installation est raccordée au réseau. En zone ABF, un avis supplémentaire
            de l&apos;Architecte des Bâtiments de France est obligatoire.
          </p>

          <h3 className="content-h3">Quel poids supporte une pergola DIY classique avec des panneaux solaires en surimpression&nbsp;?</h3>
          <p className="content-body">
            Un panneau photovoltaïque standard pèse 18 à 22 kg pour 1,7 m² de surface, soit
            11 à 13 kg/m². Avec les rails de fixation aluminium, on monte à 14 à 16 kg/m² de
            charge permanente. La charge climatique (neige + vent, Eurocode 1) ajoute 40 à
            90 kg/m² selon région et altitude. Une pergola DIY en chevrons 80×50 mm pour
            une portée de 3 m supporte ces valeurs sans renforcement. Au-delà de 3,5 m de
            portée, passez en chevrons 100×50 mm.
          </p>

          <h3 className="content-h3">Une pergola DIY avec kit solaire coûte combien comparée à une pergola solaire intégrée&nbsp;?</h3>
          <p className="content-body">
            Une pergola DIY 4×3 m en pin autoclave classe 4 revient à 800 à 1 200 € de
            matière. Avec un kit photovoltaïque 500 Wc à 2 100 Wc, ajoutez 430 à 2 800 €
            selon puissance, plus 50 à 120 € de fixations. Total complet&nbsp;: 1 280 à
            4 120 €. Une pergola solaire intégrée prête à poser démarre à 800 €/m² et
            monte à 1 200 €/m², soit 9 600 à 14 400 € pour 12 m². Sur des surfaces
            supérieures (15-20 m²) ou en haut de gamme, le total monte à 18 000-25 000 €
            installée. La différence se justifie par l&apos;intégration esthétique des
            panneaux dans la toiture et l&apos;éligibilité aux aides du Pro.
          </p>

          <h3 className="content-h3">Le DIY fait-il vraiment perdre les aides 2026 (TVA 5,5 %, prime autoconsommation, MaPrimeRénov&apos;)&nbsp;?</h3>
          <p className="content-body">
            Oui pour la prime à l&apos;autoconsommation et le tarif de rachat surplus EDF OA,
            qui exigent une pose par entreprise certifiée et un contrat CRAE Enedis. La
            prime est de 80 €/kWc jusqu&apos;à 9 kWc au T2 2026 (240 € pour 3 kWc), versée
            sur 5 ans. La TVA 5,5 % (article 278-0 bis du CGI) est devenue presque
            inaccessible depuis l&apos;arrêté du 8 septembre 2025&nbsp;: bilan carbone
            modules &lt; 530 kgCO2eq/kWc certifié Certisolis PPE2-V2, EMS obligatoire,
            pose par pro certifié à partir du 1ᵉʳ mars 2026. MaPrimeRénov&apos; ne concerne
            pas le photovoltaïque pur. Sur 3 kWc à 8 000 € TTC pro avec TVA 5,5 %
            effectivement accessible, le manque à gagner DIY cumulé est d&apos;environ
            1 200 à 1 400 €&nbsp;; sans la TVA 5,5 %, seulement 240 € de prime plus la
            revente surplus marginale (0,04 €/kWh au T2 2026).
          </p>

          <h3 className="content-h3">Quelle orientation et quelle pente choisir pour une pergola solaire DIY en France&nbsp;?</h3>
          <p className="content-body">
            L&apos;orientation plein sud reste la référence. Sud-est ou sud-ouest perdent
            5 à 8 % de production annuelle. Est ou ouest perdent 15 à 20 %. Pour la pente,
            l&apos;optimum annuel est 30 à 35° au nord de la Loire, 25 à 30° dans le Sud. Une
            pente plus faible (15 à 20°), souvent imposée par l&apos;esthétique de la pergola,
            fait perdre 4 à 6 % de production annuelle mais améliore la production estivale —
            intéressant si la consommation domestique (climatisation, piscine) est concentrée
            l&apos;été. Sous 10° de pente, prévoir un nettoyage manuel annuel des panneaux.
          </p>
        </div>

        <h2 className="content-h2">Pour aller plus loin</h2>

        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/pergola"><strong>Simulateur pergola DIY</strong></Link>&nbsp;— calcul
            structure, sections de bois, BOM et budget pour votre projet réel. Avec ou sans
            panneaux solaires en surimpression.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/guides/pergola"><strong>Guide pergola complet</strong></Link>&nbsp;—
            choix essence bois, pente, fondations, étanchéité et entretien sur 20 ans.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/guides/comparer-devis-travaux"><strong>Comparer plusieurs devis travaux</strong></Link>&nbsp;—
            méthode pour lire un devis installateur RGE QualiPV et repérer les marges
            anormales sur le photovoltaïque.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/guides/soi-meme-ou-pro"><strong>Soi-même ou faire faire&nbsp;?</strong></Link>&nbsp;—
            grille de décision DIY vs pro selon votre niveau, vos contraintes et votre budget.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/sources"><strong>Sources techniques et juridiques</strong></Link>&nbsp;—
            références complètes (Code de l&apos;urbanisme, NF C 15-100, Eurocode 1, arrêté
            tarif rachat EDF OA).
          </li>
        </ul>
      </div>
    </ContentLayout>
  );
}
