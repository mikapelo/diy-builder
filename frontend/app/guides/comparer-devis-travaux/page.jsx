import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Comparer plusieurs devis travaux';
const OG_SUBTITLE = 'Méthode 2026 · mentions obligatoires · écarts normaux';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide`;

export const metadata = {
  title: 'Comparer 3 devis travaux : le piège du moins cher (2026)',
  description:
    'Le moins cher est rarement le bon devis. En 30 min : 8 mentions à vérifier, l\'écart de prix qui reste normal, les signaux d\'arnaque avant de signer.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/comparer-devis-travaux' },
  openGraph: {
    title: 'Comparer 3 devis travaux : le piège du moins cher (2026) | DIY Builder',
    description: 'Le moins cher est rarement le bon devis : 8 mentions légales à vérifier, l\'écart de prix qui reste normal, et les vrais signaux d\'arnaque avant de signer.',
    url: 'https://www.diy-builder.fr/guides/comparer-devis-travaux',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Comparer plusieurs devis travaux — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Comparer plusieurs devis travaux : la méthode pour ne pas se faire avoir',
  description:
    'Méthode de lecture critique d\'un devis travaux : mentions obligatoires, marges normales par poste, écarts de prix sains, signaux d\'arnaque, vérifications gratuites sur l\'entreprise.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-05-24',
  dateModified: '2026-05-24',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/comparer-devis-travaux',
  image: OG_URL,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Soi-même ou faire faire', item: 'https://www.diy-builder.fr/guides/soi-meme-ou-pro' },
    { '@type': 'ListItem', position: 4, name: 'Comparer plusieurs devis travaux', item: 'https://www.diy-builder.fr/guides/comparer-devis-travaux' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel écart de prix est normal entre deux devis pour les mêmes travaux ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un écart de 15 à 25 % entre trois devis pour un périmètre identique est considéré comme sain — il reflète les différences de structure, de zone géographique et de planning de chaque entreprise. En dessous de 10 % d\'écart, les artisans se sont probablement consultés ou les devis sont vagues. Au-delà de 40 %, le moins cher cache souvent du travail dissimulé ou des prestations manquantes, le plus cher cible un client peu informé.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelles mentions sont obligatoires sur un devis travaux ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'L\'arrêté du 2 mars 1990 et le Code de la consommation imposent 8 mentions : raison sociale + SIRET du professionnel, date du devis et durée de validité, identité du client, description détaillée de chaque prestation, prix unitaire et quantité, taux de TVA appliqué, total HT et TTC, modalités de paiement. Manque l\'une de ces mentions, le devis n\'a pas de valeur juridique en cas de litige.',
      },
    },
    {
      '@type': 'Question',
      name: 'L\'artisan peut-il demander plus de 30 % d\'acompte à la commande ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aucun plafond légal général n\'impose 30 %, mais c\'est l\'usage du secteur — accepter plus de 30 % à la signature est risqué tant que le chantier n\'a pas démarré. Le calendrier sain : 30 % à la signature, 30-40 % au démarrage effectif, le solde à la réception sans réserve. Un artisan qui exige 50 % avant toute intervention soulève un signal d\'alerte sur sa trésorerie.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment vérifier gratuitement qu\'une entreprise BTP existe et est en règle ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quatre vérifications gratuites en moins de 10 minutes : (1) SIRET sur annuaire-entreprises.data.gouv.fr — statut actif, date de création, dirigeant ; (2) Assurance décennale auprès de l\'assureur cité sur le devis (obligation Spinetta 1978, art. L241-1 Code des assurances) ; (3) Avis Google Maps + Pages Jaunes ; (4) Demande d\'au moins deux références chantiers récents, idéalement visitables.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel taux de TVA s\'applique aux travaux dans un logement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Trois taux possibles selon la nature des travaux et l\'âge du logement : 5,5 % pour les travaux d\'amélioration énergétique éligibles (isolation, chaudière performante, conformes art. 278-0 bis A du CGI) ; 10 % pour la rénovation, l\'amélioration ou l\'entretien d\'un logement achevé depuis plus de 2 ans ; 20 % pour les constructions neuves, les logements de moins de 2 ans et les travaux d\'agrandissement de plus de 10 % de surface.',
      },
    },
  ],
};

export default function ComparerDevisTravauxPage() {
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
          <Link href="/guides/soi-meme-ou-pro">Soi-même ou faire faire</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Comparer devis travaux</span>
        </nav>

        <h1 className="content-h1">Comparer plusieurs devis travaux : la méthode pour ne pas se faire avoir</h1>

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
            src="/images/guides/comparer-devis-travaux/hero.png"
            alt="Trois devis travaux étalés sur une table de jardin extérieure avec stylo, calculatrice et tasse de café, ambiance dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Recevoir trois devis pour les mêmes travaux et voir 1&nbsp;800&nbsp;€ d&apos;écart entre le
          moins cher et le plus cher — c&apos;est le moment où la plupart des particuliers se perdent.
          Le plus bas cache-t-il du travail dissimulé ? Le plus haut prend-il une marge anormale ? Les
          deux ont-ils chiffré le même périmètre ? Cet article donne la grille de lecture en 30 minutes,
          poste par poste, avec les écarts de prix qui se justifient et ceux qui doivent alerter. Tous
          les chiffres mentionnés viennent du Code de la consommation, du Code civil et du Code des
          assurances — sources liées en bas de page. Pour la décision en amont (faire soi-même ou non),
          voir notre{' '}
          <Link href="/guides/soi-meme-ou-pro" className="content-link">guide soi-même ou faire faire</Link>.
        </p>

        <h2 className="content-h2">Avant de comparer : aligner le périmètre des devis</h2>
        <p className="content-snippet">
          Trois devis ne se comparent que s&apos;ils chiffrent exactement les mêmes prestations.
          Surface précise, matériaux nommés, finition, évacuation des gravats, raccordements,
          délais&nbsp;: chaque ligne doit figurer chez les trois artisans. Sans alignement préalable,
          comparer les totaux revient à comparer des poires et des pommes — la majorité des litiges
          devis-facture trouvent leur origine ici.
        </p>
        <p className="content-body">
          La première erreur consiste à mettre les trois devis côte à côte et regarder uniquement le
          total TTC. Avant ça, il faut vérifier que les trois prestataires ont chiffré la même chose.
          Un artisan qui inclut la dépose des matériaux existants et l&apos;évacuation en déchèterie
          professionnelle a un total mécaniquement plus élevé que celui qui laisse cette ligne à
          votre charge — sans que sa marge soit pour autant excessive.
        </p>
        <p className="content-body">
          Les sept points à vérifier avant toute comparaison :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Surface ou métré exact :</strong> les trois devis donnent-ils la même surface ou
            la même longueur ? Une différence de 0,5 m² sur une salle de bain change le total de 80
            à 200 €.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Matériaux nommés précisément :</strong> &quot;carrelage 30×60 cm&quot; ne suffit pas.
            Marque, référence, prix au m² affiché — sinon impossible de comparer.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Préparation incluse ou non :</strong> ragréage, primaire d&apos;accrochage, dépose
            de l&apos;ancien revêtement. Ces lignes représentent souvent 20-30 % du chiffrage.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Évacuation des gravats :</strong> à la charge du client ou de l&apos;artisan ?
            Un benne 8 m³ en déchèterie pro coûte 200-400 € selon les régions.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Raccordements et finitions :</strong> plinthes, joints, raccords aux murs adjacents,
            silicone sanitaire — petites lignes mais qui finissent par peser.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Délai d&apos;exécution :</strong> une intervention en 3 jours plutôt qu&apos;en 2
            semaines justifie un surcoût de 15-20 %.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Garanties annoncées :</strong> garantie de parfait achèvement (1 an, article 1792-6
            du Code civil), garantie biennale (2 ans, art. 1792-3), décennale (10 ans, art. 1792).
            Les trois doivent figurer.
          </li>
        </ul>
        <p className="content-body">
          Si un devis n&apos;est pas comparable parce qu&apos;il manque une ligne, redemandez-le à
          l&apos;artisan. Un professionnel sérieux le retournera sous 48 heures avec les ajustements.
          Celui qui s&apos;agace ou tergiverse vous donne une première indication sur sa qualité de
          relation client.
        </p>

        <h2 className="content-h2">Les 8 mentions obligatoires sur un devis BTP — vérification en 5 minutes</h2>
        <p className="content-snippet">
          L&apos;arrêté du 2 mars 1990 et l&apos;article L111-1 du Code de la consommation imposent
          8 mentions sur un devis travaux. Un devis qui en manque une seule n&apos;a pas valeur
          juridique en cas de litige avec l&apos;artisan — le tribunal le requalifiera en simple
          estimation. Vérification gratuite en 5 minutes.
        </p>
        <p className="content-body">
          Un devis travaux n&apos;est pas un document libre. Il répond à un cadre légal précis qui
          protège le particulier dans 100 % des cas. Si l&apos;artisan vous présente un document griffonné
          au stylo sur du papier libre, c&apos;est rédhibitoire — passez votre chemin.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Mention obligatoire</th>
              <th>Source légale</th>
              <th>Pourquoi c&apos;est important</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Raison sociale + SIRET</td>
              <td>L111-1 Code conso.</td>
              <td>Vérifiable sur annuaire-entreprises.data.gouv.fr</td>
            </tr>
            <tr>
              <td>Date et durée de validité</td>
              <td>L111-1 Code conso.</td>
              <td>Sans date, le devis est nul en cas de litige</td>
            </tr>
            <tr>
              <td>Nom et adresse du client</td>
              <td>Arrêté 2 mars 1990</td>
              <td>Personnalisation = preuve d&apos;une offre individuelle</td>
            </tr>
            <tr>
              <td>Description détaillée poste par poste</td>
              <td>L111-1 Code conso.</td>
              <td>Évite les ajouts unilatéraux en cours de chantier</td>
            </tr>
            <tr>
              <td>Prix unitaire + quantité de chaque poste</td>
              <td>L111-1 Code conso.</td>
              <td>Permet la comparaison ligne à ligne</td>
            </tr>
            <tr>
              <td>Taux de TVA appliqué par ligne</td>
              <td>Art. 289 CGI</td>
              <td>5,5 % vs 10 % vs 20 % — l&apos;écart se voit ici</td>
            </tr>
            <tr>
              <td>Total HT et TTC</td>
              <td>L111-1 Code conso.</td>
              <td>Double affichage obligatoire</td>
            </tr>
            <tr>
              <td>Modalités de paiement</td>
              <td>L111-1 Code conso.</td>
              <td>Acomptes, échelonnement, délai final</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Trois mentions complémentaires sont fortement recommandées même si elles ne sont pas
          obligatoires : l&apos;assurance décennale avec numéro de police et coordonnées de
          l&apos;assureur (obligation Spinetta 1978, article L241-1 du Code des assurances), la
          référence au DTU applicable (51.4 pour terrasse bois, 31.2 pour ossature, 13.3 pour dalle),
          et les conditions de réception du chantier. Leur absence ne rend pas le devis nul, mais
          signale un professionnel moins rigoureux.
        </p>

        <h2 className="content-h2">Le piège du « à partir de » et autres formulations vagues</h2>
        <p className="content-snippet">
          &quot;Carrelage à partir de 30&nbsp;€/m² posé&quot; n&apos;engage à rien. Au démarrage du chantier,
          le client découvre qu&apos;à 30&nbsp;€/m² il a droit au modèle d&apos;entrée de gamme — et que
          tout choix au-dessus déclenche un avenant. Trois formulations à refuser systématiquement
          dans un devis travaux.
        </p>
        <p className="content-body">
          Le devis travaux a une valeur de contrat dès qu&apos;il est signé. Plus il est précis, plus
          le client est protégé. Trois formulations vident le devis de son sens et exposent à des
          dépassements en cours de chantier :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>&quot;À partir de X&nbsp;€&quot; sans plafond :</strong> formulation marketing sans
            valeur juridique. Exigez un prix ferme ou une fourchette plafonnée (&quot;entre X et
            Y&nbsp;€, Y maximum&quot;).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>&quot;Selon imprévus de chantier&quot; sans liste explicite :</strong> un artisan
            sérieux liste les imprévus possibles (humidité cachée, défaut de structure, amiante
            soupçonné) et leur tarif horaire pour traitement.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>&quot;Fourniture comprise&quot; sans détail des matériaux :</strong> demande
            systématique de la marque, référence, prix au m² affiché. Un &quot;robinet thermostatique
            comprise&quot; sans marque peut signifier 30 € ou 350 €.
          </li>
        </ul>
        <p className="content-body">
          Pour les imprévus de chantier sérieux (découverte d&apos;amiante en rénovation ancienne,
          défaut de portance du sol pour une terrasse), une clause type indique : &quot;Si l&apos;imprévu
          dépasse 10 % du chiffrage initial, un avenant écrit est obligatoire avant intervention.&quot;
          Cette phrase évite les factures finales doublées par des &quot;ajustements&quot; unilatéraux.
        </p>

        <h2 className="content-h2">Quels écarts de prix sont normaux entre 3 artisans ?</h2>
        <p className="content-snippet">
          Un écart de 15 à 25 % entre trois devis comparables pour les mêmes travaux est sain.
          En dessous de 10 % d&apos;écart, les artisans se sont probablement consultés ou les devis
          restent vagues. Au-delà de 40 %, le moins-disant cache souvent du travail dissimulé, le
          plus-disant cible un client peu informé. La fourchette saine donne déjà une indication
          de la qualité du marché local.
        </p>
        <p className="content-body">
          Trois devis pour la même prestation ne s&apos;alignent jamais au euro près. Les écarts
          reflètent les coûts de structure différents, les zones d&apos;intervention (Île-de-France
          tarif horaire 65-90 €/h, province 50-75 €/h), les charges de l&apos;entreprise (salariat
          coût total 220-280 % du brut vs sous-traitance à 110-130 % du brut), et le planning
          de l&apos;artisan (urgence vs slot libre).
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Écart entre devis</th>
              <th>Lecture</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0–10 %</td>
              <td>Devis vagues ou artisans consultés</td>
              <td>Demander un détail ligne par ligne</td>
            </tr>
            <tr>
              <td>10–25 %</td>
              <td>Écart sain — différences de structure</td>
              <td>Choisir sur les critères qualité et délai</td>
            </tr>
            <tr>
              <td>25–40 %</td>
              <td>Écart fort — examiner les périmètres</td>
              <td>Vérifier que les prestations sont vraiment identiques</td>
            </tr>
            <tr>
              <td>&gt; 40 %</td>
              <td>Anomalie — un des deux extrêmes pose problème</td>
              <td>Demander un 4e devis pour trancher</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le devis trop bas (40 % en dessous des deux autres) est rarement une bonne affaire. Trois
          explications classiques : (1) l&apos;artisan sous-traite en black à un travailleur non
          déclaré pour absorber la perte de marge, ce qui annule l&apos;assurance décennale ; (2) il
          fournit des matériaux d&apos;entrée de gamme sans le préciser et déclenche des avenants en
          cours de chantier ; (3) il rogne sur des étapes (préparation, finitions, garanties) qui se
          paient à long terme par des reprises coûteuses.
        </p>

        <h2 className="content-h2">Les marges réelles par poste — décortiquer le total</h2>
        <p className="content-snippet">
          Sur un devis travaux, la marge artisan se cache dans deux postes&nbsp;: le coefficient sur
          fourniture (×1,2 à ×1,4 du prix d&apos;achat) et le tarif main d&apos;œuvre (50–90&nbsp;€/h
          selon métier et région). Un calcul rapide permet d&apos;estimer si le total reste cohérent.
          Une terrasse 12&nbsp;m² posée doit se situer entre 1&nbsp;500 et 2&nbsp;200&nbsp;€ tout
          compris en pin traité — au-delà, demander des comptes.
        </p>
        <p className="content-body">
          Le coefficient sur fourniture varie selon le type d&apos;entreprise. Un artisan seul qui
          achète chez son négoce local applique souvent ×1,2 à ×1,3 (marge brute 17-23 %). Une
          entreprise plus structurée applique ×1,35 à ×1,5 pour absorber les frais de structure,
          la gestion des stocks et la garantie matière première. Au-delà de ×1,5, c&apos;est le
          signal qu&apos;il faut acheter soi-même les matériaux et demander un devis pose seule.
        </p>
        <p className="content-body">
          Le tarif horaire main d&apos;œuvre dépend de quatre facteurs : qualification (compagnon 50-65
          €/h, ouvrier hautement qualifié 70-90 €/h), région (Île-de-France +25 % sur la moyenne
          nationale, zones rurales -10 à -15 %), urgence (intervention sous 48h +30 à +50 %), et type
          d&apos;entreprise (auto-entrepreneur facture moins que SAS car charges sociales différentes).
        </p>
        <p className="content-body">
          Pour vérifier rapidement si le total est cohérent sur les projets bois courants, le
          comparateur de notre <Link href="/" className="content-link">simulateur</Link> donne le
          budget matériaux exact en mai 2026, par enseigne. Le total artisan attendu se construit
          ensuite avec : budget matériaux × 1,3 (matière + marge) + temps de pose × 60 €/h + 10-15 %
          de marge de structure. Au-delà de cette estimation, l&apos;artisan a une marge anormalement
          haute ou une prestation supplémentaire non mentionnée.
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Comparateur prix en direct</p>
          <p className="content-cta-box-title">Vérifiez l&apos;estimation matériaux par enseigne</p>
          <p className="content-cta-box-desc">
            Notre simulateur calcule la nomenclature exacte selon vos dimensions et compare les
            quatre enseignes principales. Base solide pour confronter les chiffres artisan.
          </p>
          <a href="/" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Vérifier l&apos;entreprise avant de signer — 5 vérifications gratuites</h2>
        <p className="content-snippet">
          Cinq vérifications en moins de 15 minutes&nbsp;: SIRET sur annuaire-entreprises.data.gouv.fr,
          assurance décennale demandée par mail au courtier cité, avis Google + Pages Jaunes,
          références chantiers visitables, et registre des entreprises du bâtiment de la Fédération
          Française du Bâtiment (FFB) ou de la CAPEB pour la qualification professionnelle.
        </p>
        <p className="content-body">
          Une fois le périmètre des devis aligné et les marges examinées, reste à vérifier que
          l&apos;entreprise existe réellement et qu&apos;elle est en règle. La majorité des arnaques BTP
          en France 2026 reposent sur des entreprises fantômes qui disparaissent dès l&apos;acompte
          encaissé — et l&apos;assurance décennale est inexistante au moment du problème.
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>SIRET sur annuaire-entreprises.data.gouv.fr :</strong> tapez le numéro à 14
            chiffres, vérifiez statut actif, date de création (moins de 6 mois = prudence), dirigeant
            cohérent avec le devis. Service gratuit officiel.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Assurance décennale :</strong> le devis doit citer le nom de l&apos;assureur et un
            numéro de contrat. Demandez par mail à l&apos;assureur la confirmation que la garantie
            couvre la prestation prévue. Réponse en 48 h maximum chez un assureur sérieux.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Avis clients :</strong> Google Maps fiche professionnelle (avec photos
            chantiers), Pages Jaunes, plateformes spécialisées. Un artisan installé depuis 5 ans avec
            moins de 10 avis est suspect ; idem si tous les avis sont à 5 étoiles sans nuance.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Références chantiers :</strong> demandez deux références récentes (moins de 6
            mois), idéalement visitables. Un artisan qui refuse ou se montre évasif donne un signal
            fort. Un téléphone à l&apos;ancien client en deux minutes suffit à confirmer délais
            respectés, tenue du chantier, qualité finale.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Qualifications professionnelles :</strong> Qualibat, RGE (obligatoire pour les
            aides MaPrimeRénov&apos;), Qualif&apos;ELEC, FFB ou CAPEB. Ces labels ne sont pas obligatoires
            mais signalent un cadre de qualité contrôlé par un organisme tiers.
          </li>
        </ul>

        <h2 className="content-h2">Le piège des acomptes et calendriers de paiement</h2>
        <p className="content-snippet">
          Acompte sain en BTP&nbsp;: 30&nbsp;% à la signature, 30-40&nbsp;% au démarrage effectif,
          le solde à la réception sans réserve. Un artisan qui exige 50&nbsp;% à la signature avant
          toute intervention soulève un signal d&apos;alerte sur sa trésorerie. Sur un chantier de
          5&nbsp;000&nbsp;€, ne jamais avancer plus de 1&nbsp;500&nbsp;€ avant un démarrage
          physique du chantier.
        </p>
        <p className="content-body">
          Le code de la consommation n&apos;impose pas de plafond légal à l&apos;acompte BTP, mais
          l&apos;usage professionnel reconnu par la FFB et la CAPEB plafonne à 30 % à la signature.
          Au-delà, vous prêtez de la trésorerie à l&apos;artisan — ce qui n&apos;est pas votre rôle de
          client. Sur un chantier qui démarre 6 semaines après la signature, exiger 50 % d&apos;acompte
          revient à immobiliser votre argent pendant que rien ne se passe sur place.
        </p>
        <p className="content-body">
          Le calendrier sain&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Signature du devis :</strong> 30 % maximum, à régler dans les 15 jours.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Démarrage effectif du chantier :</strong> 30 à 40 % supplémentaires, à régler le
            premier jour de présence physique des ouvriers.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Mi-chantier :</strong> 20 à 30 % si chantier longue durée (plus de 4 semaines).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Réception sans réserve :</strong> le solde, signé par les deux parties après
            vérification que les travaux sont conformes au devis.
          </li>
        </ul>
        <p className="content-body">
          La réception &quot;sans réserve&quot; est une étape juridique clé. Tant qu&apos;elle n&apos;est pas
          signée, le client peut faire valoir des défauts visibles. Une fois signée, seuls les
          défauts cachés relèvent encore des garanties. Inspectez minutieusement avant de signer —
          même les imperfections mineures (joint mal tiré, raccord de peinture imparfait) doivent
          être consignées dans un procès-verbal de réception avec réserves.
        </p>

        <h2 className="content-h2">Modifier ou négocier le devis : ce qui passe, ce qui ne passe pas</h2>
        <p className="content-snippet">
          Trois éléments se négocient sans tabou&nbsp;: le délai d&apos;exécution (+15-20&nbsp;% si
          urgent, -5 à -10&nbsp;% si vous acceptez un slot moins demandé), la marque des matériaux
          (équivalent moins cher possible), le mode de fourniture (matériaux achetés par vous-même
          au lieu de l&apos;artisan = économie de 15-25&nbsp;%). En revanche, négocier la TVA, l&apos;assurance
          ou les garanties est interdit — l&apos;artisan ne peut pas y déroger.
        </p>
        <p className="content-body">
          La négociation d&apos;un devis travaux est mal vue en France — beaucoup de clients
          n&apos;osent pas, par peur de vexer l&apos;artisan. Pourtant, négocier respectueusement sur des
          éléments concrets est non seulement légitime mais souvent attendu par les professionnels
          eux-mêmes. La règle : négocier des contreparties, pas des baisses de prix arbitraires.
        </p>
        <p className="content-body">
          Ce qui se négocie :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Le délai d&apos;exécution :</strong> accepter un slot moins demandé (entre deux
            chantiers, en fin de saison hiver pour la maçonnerie) déclenche souvent une réduction
            de 5-10 %. Inversement, l&apos;urgence se paie au-dessus du tarif standard.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>La marque des matériaux :</strong> proposer une référence équivalente moins
            chère (carrelage espagnol vs italien, vis Spax vs no-name) si la qualité reste
            comparable. L&apos;artisan accepte généralement.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>L&apos;achat des matériaux par vous-même :</strong> ramener les matériaux au tarif
            grande surface évite la marge fourniture artisan (15-30 %). Attention : la garantie
            décennale ne couvre alors que la pose, pas les défauts matériels.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Le mode de règlement :</strong> certains artisans accordent 1-2 % de remise pour
            règlement comptant à la fin du chantier au lieu d&apos;un chèque ou virement à 30 jours.
          </li>
        </ul>
        <p className="content-body">
          Ce qui ne se négocie pas&nbsp;:
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>La TVA :</strong> son taux est fixé par la loi (article 279-0 bis du CGI pour
            la rénovation). Aucune négociation possible.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>L&apos;assurance décennale :</strong> obligation légale, art. L241-1 du Code des
            assurances. Un artisan qui propose de &quot;ne pas la faire pour faire baisser le devis&quot;
            est en infraction — fuyez.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Les garanties légales :</strong> parfait achèvement (1 an), biennale (2 ans),
            décennale (10 ans). Elles s&apos;appliquent automatiquement, l&apos;artisan ne peut pas y
            renoncer contractuellement.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Les normes DTU applicables :</strong> sections, entraxes, profondeurs hors-gel.
            Un artisan qui &quot;tire&quot; sur la norme pour économiser engage sa responsabilité décennale.
          </li>
        </ul>

        <h2 className="content-h2">Questions fréquentes</h2>

        <h3 className="content-h3">Quel écart de prix est normal entre deux devis pour les mêmes travaux ?</h3>
        <p className="content-body">
          Un écart de 15 à 25 % entre trois devis pour un périmètre identique est sain. Il reflète
          les différences de structure, de zone géographique et de planning de chaque entreprise.
          En dessous de 10 % d&apos;écart, les artisans se sont probablement consultés ou les devis
          sont vagues. Au-delà de 40 %, le moins cher cache souvent du travail dissimulé ou des
          prestations manquantes, le plus cher cible un client peu informé.
        </p>

        <h3 className="content-h3">Quelles mentions sont obligatoires sur un devis travaux ?</h3>
        <p className="content-body">
          L&apos;arrêté du 2 mars 1990 et l&apos;article L111-1 du Code de la consommation imposent
          8 mentions : raison sociale et SIRET du professionnel, date du devis et durée de validité,
          identité du client, description détaillée de chaque prestation, prix unitaire et quantité,
          taux de TVA appliqué, total HT et TTC, modalités de paiement. Manque l&apos;une de ces
          mentions, le devis n&apos;a pas de valeur juridique en cas de litige.
        </p>

        <h3 className="content-h3">L&apos;artisan peut-il demander plus de 30 % d&apos;acompte à la commande ?</h3>
        <p className="content-body">
          Aucun plafond légal général n&apos;impose 30 %, mais c&apos;est l&apos;usage du secteur — accepter
          plus de 30 % à la signature est risqué tant que le chantier n&apos;a pas démarré. Le
          calendrier sain : 30 % à la signature, 30-40 % au démarrage effectif, le solde à la
          réception sans réserve. Un artisan qui exige 50 % avant toute intervention soulève un
          signal d&apos;alerte sur sa trésorerie.
        </p>

        <h3 className="content-h3">Comment vérifier gratuitement qu&apos;une entreprise BTP existe et est en règle ?</h3>
        <p className="content-body">
          Quatre vérifications gratuites en moins de 10 minutes : (1) SIRET sur
          annuaire-entreprises.data.gouv.fr — statut actif, date de création, dirigeant ; (2)
          Assurance décennale auprès de l&apos;assureur cité sur le devis (obligation Spinetta 1978,
          art. L241-1 du Code des assurances) ; (3) Avis Google Maps + Pages Jaunes ; (4) Demande
          d&apos;au moins deux références chantiers récents, idéalement visitables.
        </p>

        <h3 className="content-h3">Quel taux de TVA s&apos;applique aux travaux dans un logement ?</h3>
        <p className="content-body">
          Trois taux possibles selon la nature des travaux et l&apos;âge du logement : 5,5 % pour les
          travaux d&apos;amélioration énergétique éligibles (isolation, chaudière performante, conformes
          art. 278-0 bis A du CGI) ; 10 % pour la rénovation, l&apos;amélioration ou l&apos;entretien
          d&apos;un logement achevé depuis plus de 2 ans ; 20 % pour les constructions neuves, les
          logements de moins de 2 ans et les travaux d&apos;agrandissement de plus de 10 % de surface.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/soi-meme-ou-pro">Soi-même ou faire faire</Link> — cinq critères de décision avant même de demander un devis</li>
            <li><Link href="/guides/prix-terrasse-bois-m2-2026">Prix terrasse au m² 2026</Link> — base de comparaison artisan</li>
            <li><Link href="/guides">Tous les guides projets</Link> — six guides bois et béton</li>
            <li><Link href="/sources">Sources juridiques citées</Link> — Code conso, Code civil, Code assurances</li>
          </ul>
        </aside>

        <CTALead projectHref="/guides/soi-meme-ou-pro" projectLabel="mon projet" />

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 24 mai 2026, sources
            juridiques : <Link href="/sources">service-public.fr et Légifrance</Link>.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources DTU et juridiques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
