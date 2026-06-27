import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Taxe abri de jardin 2026';
const OG_SUBTITLE = 'Calcul · montant · exonération';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cabanon`;

export const metadata = {
  title: 'Taxe abri de jardin 2026 : calcul, montant et baisse',
  description:
    'Taxe abri de jardin 2026 : 892 €/m² (en baisse), calcul du montant, seuils, abattement et exonération communale. Exemples chiffrés pour 10 et 20 m².',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/taxe-abri-jardin-2026' },
  openGraph: {
    title: 'Taxe abri de jardin 2026 : calcul, montant et baisse | DIY Builder',
    description:
      'Combien coûte la taxe d\'aménagement sur un abri de jardin en 2026 ? Valeur forfaitaire 892 €/m² en baisse, calcul pas à pas, seuils, abattement et exonération communale.',
    url: 'https://www.diy-builder.fr/guides/taxe-abri-jardin-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Taxe abri de jardin 2026 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Taxe d\'aménagement sur un abri de jardin en 2026 : combien allez-vous payer ?',
  description:
    'Le calcul réel de la taxe d\'aménagement sur un abri de jardin en 2026 : valeur forfaitaire 892 €/m² (hors Île-de-France) en baisse, seuils de taxation, formule, abattement, exonération communale et exemples chiffrés.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-09',
  dateModified: '2026-06-09',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/taxe-abri-jardin-2026',
  image: OG_URL,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide cabanon', item: 'https://www.diy-builder.fr/guides/cabanon' },
    { '@type': 'ListItem', position: 4, name: 'Taxe abri de jardin 2026', item: 'https://www.diy-builder.fr/guides/taxe-abri-jardin-2026' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien coûte la taxe sur un abri de jardin en 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'En 2026, la taxe se calcule sur une valeur forfaitaire de 892 €/m² hors Île-de-France (1 011 € en IDF). Pour un abri de 20 m², comptez de 446 € (commune à taux faible, 2,5 % au total) à plus de 1 300 € (taux élevé, 7,5 %). Tout dépend des taux votés par votre commune et votre département.' },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi la taxe d\'aménagement baisse-t-elle en 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Parce que la valeur forfaitaire est indexée chaque 1er janvier sur l\'indice du coût de la construction (ICC) de l\'INSEE. Cet indice a reculé — 2056 au 3e trimestre 2025 contre 2143 un an plus tôt — ce qui fait baisser la base de calcul. C\'est rare : la taxe avait augmenté chaque année depuis plus de cinq ans.' },
    },
    {
      '@type': 'Question',
      name: 'À partir de quelle taille un abri de jardin est-il taxé ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Dès que l\'abri dépasse 5 m² de surface close et couverte ET atteint 1,80 m de hauteur sous plafond. En dessous de 5 m², il n\'est ni soumis à déclaration préalable ni taxable. Un abri très bas (moins de 1,80 m sous le point le plus haut) échappe aussi à la taxe.' },
    },
    {
      '@type': 'Question',
      name: 'Comment calculer le montant exact de la taxe ?',
      acceptedAnswer: { '@type': 'Answer', text: 'La formule est : surface taxable × valeur forfaitaire × (taux communal + taux départemental). Exemple pour 20 m² hors IDF avec un taux communal de 1 % et départemental de 1,5 % : 20 × 892 × 0,025 = 446 €. Les taux varient fortement : communal de 1 à 5 % (jusqu\'à 20 % dans de rares cas), départemental jusqu\'à 2,5 %.' },
    },
    {
      '@type': 'Question',
      name: 'L\'abattement de 50 % s\'applique-t-il à mon abri de jardin ?',
      acceptedAnswer: { '@type': 'Answer', text: 'L\'abattement de 50 % sur la valeur forfaitaire couvre les 100 premiers m² de la résidence principale et de ses annexes. En pratique, si votre maison dépasse déjà 100 m² de surface taxable, ce quota est épuisé et l\'abri est taxé à la valeur pleine. Si la maison reste sous 100 m², une partie de l\'abri peut en bénéficier.' },
    },
    {
      '@type': 'Question',
      name: 'Ma commune peut-elle m\'exonérer de la taxe sur l\'abri de jardin ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui. Les communes peuvent décider d\'exonérer, en totalité ou en partie, les abris de jardin de 20 m² maximum soumis à déclaration préalable. C\'est une exonération facultative : elle dépend d\'une délibération locale. Renseignez-vous en mairie ou auprès du service urbanisme avant de déposer votre dossier.' },
    },
    {
      '@type': 'Question',
      name: 'Quand et comment paie-t-on la taxe d\'aménagement ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depuis 2023, vous déclarez l\'ouvrage dans les 90 jours suivant son achèvement, en ligne sur impots.gouv.fr (rubrique « Biens immobiliers »). La taxe est ensuite émise par la Direction générale des finances publiques : un seul versement si le montant est inférieur à 1 500 €, deux échéances au-delà.' },
    },
    {
      '@type': 'Question',
      name: 'Y a-t-il une amende si je ne déclare pas mon abri de jardin ?',
      acceptedAnswer: { '@type': 'Answer', text: 'L\'« amende de 135 € » qui circule est un mythe : la taxe d\'aménagement n\'est pas une contravention. En revanche, un abri non déclaré reste un défaut de déclaration : régularisation, taxe due et pénalités de retard possibles. Le fisc compare désormais les photos aériennes aux déclarations par intelligence artificielle — plus de 140 000 constructions non déclarées repérées en 2023.' },
    },
  ],
};

export default function TaxeAbriJardin2026Page() {
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
          <Link href="/guides/cabanon">Cabanon</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Taxe abri de jardin 2026</span>
        </nav>

        <h1 className="content-h1">
          Taxe d&apos;aménagement sur un abri de jardin en 2026&nbsp;: combien allez-vous payer&nbsp;?
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 9 juin 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/taxe-abri-jardin-2026/hero.png"
            alt="Abri de jardin en bois dans un jardin résidentiel français, fin d'après-midi en lumière dorée"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Une taxe d&apos;aménagement frappe tout abri de jardin de plus de 5 m² au sol et d&apos;au
          moins 1,80 m sous plafond. En 2026, elle se calcule sur une valeur forfaitaire de
          892 €/m² hors Île-de-France (1 011 € en IDF) — et, fait rare, cette base est en baisse.
          Pour un abri de 20 m², la note va de 446 € à plus de 1 300 € selon les taux votés par
          votre commune. Voici le calcul exact, et les leviers légaux pour payer moins.
        </p>

        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Valeur forfaitaire 2026&nbsp;: 892 €/m² hors IDF, 1 011 €/m² en Île-de-France — en baisse.</li>
            <li>Taxable seulement si l&apos;abri dépasse 5 m² au sol <strong>et</strong> 1,80 m de hauteur.</li>
            <li>Calcul&nbsp;: surface × valeur forfaitaire × (taux communal 1-5 % + départemental ≤ 2,5 %).</li>
            <li>Exemples&nbsp;: 10 m² → 223 €, 20 m² → 446 € (taux 2,5 %), jusqu&apos;à ~1 338 € (taux 7,5 %).</li>
            <li>Exonération possible&nbsp;: les communes peuvent dispenser les abris ≤ 20 m² soumis à déclaration préalable.</li>
          </ul>
        </div>

        <CTALead projectHref="/cabanon" projectLabel="mon abri de jardin" />

        <h2 className="content-h2">Combien coûte la taxe sur un abri de jardin en 2026&nbsp;?</h2>
        <p className="content-snippet">
          En 2026, la taxe d&apos;aménagement d&apos;un abri de jardin se calcule sur 892 €/m² hors
          Île-de-France (1 011 € en IDF). Pour 20 m², comptez de 446 € à plus de 1 300 € selon les
          taux de votre commune et de votre département.
        </p>
        <p className="content-body">
          Le montant n&apos;est jamais affiché en magasin&nbsp;: il dépend de votre surface, de la
          valeur forfaitaire nationale et des taux locaux. Ces derniers font toute la différence.
          Voici trois cas concrets, hors Île-de-France, à la valeur 2026&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Abri (hors IDF)</th>
              <th>Taux total (communal + départemental)</th>
              <th>Taxe due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 m²</td>
              <td>2,5 % (1 % + 1,5 %)</td>
              <td>223 €</td>
            </tr>
            <tr>
              <td>20 m²</td>
              <td>2,5 % (1 % + 1,5 %)</td>
              <td>446 €</td>
            </tr>
            <tr>
              <td>20 m²</td>
              <td>7,5 % (5 % + 2,5 %)</td>
              <td>1 338 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le grand écart entre 446 € et 1 338 € pour le même abri vient uniquement des taux locaux.
          Une commune qui vote 5 % de taux communal triple presque la facture d&apos;une commune à
          1 %. C&apos;est le premier réflexe&nbsp;: connaître le taux de votre commune avant de
          dimensionner l&apos;abri.
        </p>

        <h2 className="content-h2">Pourquoi la taxe baisse en 2026 (et c&apos;est rare)</h2>
        <p className="content-snippet">
          La valeur forfaitaire est indexée chaque 1er janvier sur l&apos;indice du coût de la
          construction (ICC) de l&apos;INSEE. En 2026, cet indice recule&nbsp;: la base de calcul, et
          donc la taxe, baisse pour la première fois depuis des années.
        </p>
        <p className="content-body">
          Concrètement, l&apos;ICC retenu est passé de 2143 (3e trimestre 2024) à 2056 (3e trimestre
          2025). Comme la valeur forfaitaire suit cet indice, elle redescend à 892 €/m² hors
          Île-de-France. La taxe avait pourtant grimpé chaque année depuis plus de cinq ans&nbsp;:
          cette pause est l&apos;exception, pas la règle. Rien ne garantit qu&apos;elle se répète en
          2027 — d&apos;où l&apos;intérêt, si votre projet est prêt, de ne pas trop tarder.
        </p>

        <h2 className="content-h2">Quels abris sont taxés&nbsp;? Le seuil des 5 m² et 1,80 m</h2>
        <p className="content-body">
          Deux conditions doivent être réunies pour qu&apos;un abri soit taxable&nbsp;: plus de 5 m²
          de surface close et couverte, <strong>et</strong> au moins 1,80 m de hauteur sous le point
          le plus haut. Si l&apos;une manque, pas de taxe.
        </p>
        <ul className="content-body">
          <li><strong>Abri ≤ 5 m²</strong>&nbsp;: ni déclaration préalable, ni taxe d&apos;aménagement.</li>
          <li><strong>Abri entre 5 et 20 m²</strong>&nbsp;: déclaration préalable en mairie, et taxe due (sauf exonération communale).</li>
          <li><strong>Abri &gt; 20 m²</strong>&nbsp;: permis de construire, et taxe due.</li>
          <li><strong>Hauteur &lt; 1,80 m</strong>&nbsp;: la surface n&apos;est pas comptée comme surface taxable, même au-delà de 5 m².</li>
        </ul>
        <p className="content-body">
          La taxe et l&apos;urbanisme suivent des logiques différentes. Pour le détail des
          autorisations — quand déposer une déclaration préalable, quand un permis devient
          obligatoire, les délais et les pièces —, voir notre{' '}
          <Link href="/guides/permis-cabanon-seuils-2026" className="content-link">guide des seuils de déclaration et de permis</Link>.
          Ici, on reste sur le volet fiscal.
        </p>

        <h2 className="content-h2">Le calcul du montant, pas à pas</h2>
        <p className="content-snippet">
          La taxe d&apos;aménagement se calcule ainsi&nbsp;: surface taxable × valeur forfaitaire ×
          (taux communal + taux départemental). En 2026, la valeur forfaitaire est de 892 €/m² hors
          Île-de-France.
        </p>
        <p className="content-body">
          Reprenons un abri de 15 m² hors Île-de-France, dans une commune au taux communal de 3 % et
          un département à 2 %&nbsp;: 15 × 892 × (3 % + 2 %) = 15 × 892 × 0,05 = 669 €. Changez la
          commune pour un taux de 5 %, et la même surface passe à 936 €. La surface et la valeur
          forfaitaire sont nationales&nbsp;; seuls les taux bougent d&apos;une commune à l&apos;autre.
        </p>
        <p className="content-body">
          Un point qui prête à confusion&nbsp;: l&apos;abattement de 50 %. Il s&apos;applique aux 100
          premiers m² de la résidence principale et de ses annexes. Mais la plupart des maisons
          dépassent déjà 100 m² de surface taxable&nbsp;: le quota est alors épuisé par
          l&apos;habitation, et l&apos;abri de jardin est taxé sur la valeur pleine. Si votre maison
          reste sous 100 m², une partie de l&apos;abri peut profiter de l&apos;abattement. Dans le
          doute, le service urbanisme de votre mairie tranche.
        </p>
        <p className="content-body">
          Pour estimer en amont la surface et le coût matière de votre futur abri — avant même de
          parler taxe — notre{' '}
          <Link href="/cabanon" className="content-link">simulateur de cabanon</Link>{' '}
          chiffre l&apos;ossature, le bardage et la couverture poste par poste.
        </p>

        <h2 className="content-h2">Payer moins, légalement&nbsp;: 4 leviers</h2>
        <p className="content-body">
          Aucun de ces leviers n&apos;est une astuce douteuse&nbsp;: ce sont des règles prévues par
          les textes. Le seul vrai risque, c&apos;est de ne pas déclarer.
        </p>
        <ul className="content-body">
          <li style={{ marginBottom: '10px' }}><strong>Rester sous les seuils.</strong> Un abri de 5 m² ou moins, ou de moins de 1,80 m sous plafond, n&apos;est pas taxable. Pour un simple rangement, ces dimensions suffisent souvent.</li>
          <li style={{ marginBottom: '10px' }}><strong>Vérifier l&apos;exonération communale.</strong> Beaucoup de communes exonèrent les abris ≤ 20 m² soumis à déclaration préalable. Un appel au service urbanisme avant de déposer le dossier peut effacer la taxe.</li>
          <li style={{ marginBottom: '10px' }}><strong>Activer l&apos;abattement si vous y avez droit.</strong> Si votre résidence principale et ses annexes restent sous 100 m², l&apos;abattement de 50 % réduit la base de moitié sur la part concernée.</li>
          <li style={{ marginBottom: '10px' }}><strong>Déclarer correctement et dans les délais.</strong> C&apos;est ce qui évite pénalités et redressement. Un abri non déclaré finit presque toujours repéré.</li>
        </ul>
        <p className="content-body">
          Une rumeur tenace parle d&apos;une «&nbsp;amende de 135 €&nbsp;» pour un abri non déclaré.
          C&apos;est faux&nbsp;: la taxe d&apos;aménagement n&apos;est pas une contravention. Le vrai
          sujet est ailleurs&nbsp;: depuis 2023, l&apos;administration compare les photos aériennes
          aux déclarations cadastrales par intelligence artificielle. Plus de 140 000 constructions
          non déclarées ont été détectées en 2023. Mieux vaut déclarer que régulariser sous
          contrainte.
        </p>

        <AffiliatePartnerBlock module="abri-metal" placement="guide" />

        <h2 className="content-h2">Quand et comment payer la taxe</h2>
        <p className="content-body">
          Depuis la réforme de 2023, la taxe d&apos;aménagement se déclare en ligne. Vous avez
          90 jours après l&apos;achèvement de l&apos;abri pour le signaler sur impots.gouv.fr, dans la
          rubrique «&nbsp;Biens immobiliers&nbsp;». La Direction générale des finances publiques
          calcule ensuite la taxe et l&apos;émet&nbsp;: un seul versement si le montant reste sous
          1 500 €, deux échéances au-delà. Gardez l&apos;arrêté de déclaration préalable et la date
          d&apos;achèvement&nbsp;: ce sont eux qui fixent le point de départ.
        </p>

        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Combien coûte la taxe sur un abri de jardin en 2026&nbsp;?</h3>
          <p className="content-body">
            La taxe se calcule sur 892 €/m² hors Île-de-France (1 011 € en IDF). Pour 20 m², comptez
            de 446 € (taux total 2,5 %) à plus de 1 300 € (taux 7,5 %), selon les taux votés par
            votre commune et votre département.
          </p>

          <h3 className="content-h3">Pourquoi la taxe d&apos;aménagement baisse-t-elle en 2026&nbsp;?</h3>
          <p className="content-body">
            La valeur forfaitaire est indexée chaque 1er janvier sur l&apos;indice du coût de la
            construction (ICC). Il a reculé — 2056 au 3e trimestre 2025 contre 2143 un an plus tôt —
            ce qui fait baisser la base. C&apos;est rare&nbsp;: la taxe montait chaque année depuis
            plus de cinq ans.
          </p>

          <h3 className="content-h3">À partir de quelle taille un abri est-il taxé&nbsp;?</h3>
          <p className="content-body">
            Au-delà de 5 m² de surface close et couverte <strong>et</strong> dès 1,80 m de hauteur
            sous plafond. En dessous de 5 m², l&apos;abri n&apos;est ni à déclarer ni à taxer. Sous
            1,80 m, la surface n&apos;est pas comptée comme taxable.
          </p>

          <h3 className="content-h3">Comment calculer le montant exact&nbsp;?</h3>
          <p className="content-body">
            Surface taxable × valeur forfaitaire × (taux communal + taux départemental). Exemple&nbsp;:
            20 m² hors IDF à 2,5 % de taux total = 20 × 892 × 0,025 = 446 €. Le taux communal va de 1
            à 5 % (jusqu&apos;à 20 % dans de rares communes), le départemental jusqu&apos;à 2,5 %.
          </p>

          <h3 className="content-h3">L&apos;abattement de 50 % s&apos;applique-t-il à mon abri&nbsp;?</h3>
          <p className="content-body">
            Il couvre les 100 premiers m² de la résidence principale et de ses annexes. Si votre
            maison dépasse déjà 100 m² de surface taxable, le quota est épuisé et l&apos;abri est taxé
            à la valeur pleine. Sous 100 m², une partie de l&apos;abri peut en bénéficier.
          </p>

          <h3 className="content-h3">Ma commune peut-elle m&apos;exonérer&nbsp;?</h3>
          <p className="content-body">
            Oui. Les communes peuvent exonérer, en tout ou partie, les abris de 20 m² maximum soumis
            à déclaration préalable. C&apos;est facultatif et dépend d&apos;une délibération locale&nbsp;:
            renseignez-vous en mairie avant de déposer votre dossier.
          </p>

          <h3 className="content-h3">Quand et comment paie-t-on la taxe&nbsp;?</h3>
          <p className="content-body">
            Vous déclarez l&apos;abri dans les 90 jours suivant son achèvement sur impots.gouv.fr
            («&nbsp;Biens immobiliers&nbsp;»). La DGFiP émet ensuite la taxe&nbsp;: un versement si le
            montant est sous 1 500 €, deux échéances au-delà.
          </p>

          <h3 className="content-h3">Y a-t-il une amende si je ne déclare pas&nbsp;?</h3>
          <p className="content-body">
            L&apos;«&nbsp;amende de 135 €&nbsp;» est un mythe&nbsp;: la taxe n&apos;est pas une
            contravention. Mais un abri non déclaré reste un défaut de déclaration (taxe due,
            pénalités). Le fisc détecte les constructions par photos aériennes et intelligence
            artificielle&nbsp;: 140 000 cas repérés en 2023.
          </p>
        </div>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/abri-de-jardin-metal-bois-ou-resine">Abri métal, bois ou résine</Link> — le comparatif des matériaux et leur coût réel sur 10 ans</li>
            <li><Link href="/guides/cabanon">Guide du cabanon</Link> — ossature, bardage, couverture et budget d&apos;un abri de jardin</li>
            <li><Link href="/guides/permis-cabanon-seuils-2026">Permis et déclaration préalable</Link> — les seuils d&apos;urbanisme (5, 20, 40 m²) et les démarches</li>
            <li><Link href="/cabanon">Simulateur de cabanon</Link> — chiffre l&apos;abri poste par poste avant de déposer le dossier</li>
            <li><Link href="/guides/comparer-devis-travaux">Comparer des devis</Link> — si vous faites poser l&apos;abri par un artisan</li>
            <li><Link href="/sources">Sources techniques et juridiques</Link> — Service-Public, economie.gouv, INSEE, Code de l&apos;urbanisme</li>
          </ul>
        </aside>

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 9 juin 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources techniques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
