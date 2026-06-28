import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Brise-vue : quel type choisir';
const OG_SUBTITLE = 'Support · occultation · prix · réglementation';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cloture`;

export const metadata = {
  title: 'Brise-vue : quel type choisir en 2026 (clôture, balcon)',
  description:
    'Quel brise-vue choisir ? Le bon type dépend du support et du vent : toile, canisse, panneau bois ou composite, gabion. Prix 2026, occultation et règles.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/brise-vue-quel-type-choisir' },
  openGraph: {
    title: 'Brise-vue : quel type choisir selon votre support | DIY Builder',
    description:
      'Toile sur grillage souple, lames sur grillage rigide, panneau bois ou composite en clôture pleine, occultant démontable sur balcon : le brise-vue se choisit par support et par exposition au vent. Prix 2026, taux d\'occultation et réglementation.',
    url: 'https://www.diy-builder.fr/guides/brise-vue-quel-type-choisir',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Brise-vue : quel type choisir — guide DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide clôture', item: 'https://www.diy-builder.fr/guides/cloture' },
    { '@type': 'ListItem', position: 4, name: 'Quel brise-vue choisir', item: 'https://www.diy-builder.fr/guides/brise-vue-quel-type-choisir' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Brise-vue : quel type choisir selon votre clôture, votre grillage ou votre balcon (2026)',
  description:
    'Guide 2026 pour choisir un brise-vue par support et par exposition au vent : toile, canisse, panneau bois ou composite, gabion. Prix indicatifs, taux d\'occultation, grammage et réglementation.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-28',
  dateModified: '2026-06-28',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/brise-vue-quel-type-choisir',
  image: OG_URL,
  about: ['Brise-vue', 'Occultation de clôture', 'Brise-vent', 'Intimité jardin'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelle hauteur de brise-vue est autorisée sans déclaration ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Il n\'existe pas de hauteur « autorisée sans déclaration » fixée au niveau national. Ce qui déclenche une déclaration préalable, c\'est le lieu — terrain en secteur protégé, ou commune ayant décidé par délibération de soumettre les clôtures à déclaration (article R*421-12 du code de l\'urbanisme) — pas la hauteur seule. À défaut de PLU, la hauteur de référence d\'une clôture est de 2,60 m dans les communes de moins de 50 000 habitants et de 3,20 m au-delà (article 663 du code civil). Un brise-vue qui ferait dépasser la limite fixée par votre PLU créerait une infraction : vérifiez le règlement local avant de rehausser.' },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une autorisation de la mairie pour poser un brise-vue ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pas systématiquement. Une déclaration préalable n\'est obligatoire que si votre terrain est en secteur protégé (abords de monument historique, site classé ou inscrit, secteur délimité par le PLU) ou si votre commune a décidé de soumettre les clôtures à déclaration (article R*421-12). Le délai d\'instruction est alors d\'un mois, porté à deux mois en secteur protégé. Poser une canisse ou une toile sur un grillage existant ne crée en général pas d\'obligation hors de ces cas — mais en zone protégée ou en cas de doute, demandez au service urbanisme de votre mairie.' },
    },
    {
      '@type': 'Question',
      name: 'Quel est le meilleur brise-vue contre le vent ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le plus résistant n\'est pas le plus occultant. Un panneau plein à 100 % agit comme une voile et encaisse toute la pression : selon Habitatpresto, une toile à 30 % d\'occultation réduit la pression du vent de près de moitié. En zone ventée, privilégiez un modèle ajouré ou semi-occultant, ou surdimensionnez l\'ancrage : plots de 40 à 60 cm, poteaux en acier galvanisé ou aluminium, entraxe réduit. Le gabion, qui laisse passer l\'air entre les pierres, est l\'occultant le plus stable face au vent fort.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle différence entre un brise-vue et un brise-vent ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Un brise-vue masque les regards : son rôle est l\'intimité. Un brise-vent freine et filtre le vent : son rôle est le confort et la protection des plantations. Les deux se confondent souvent, mais un bon brise-vent est ajouré, pour casser les rafales sans faire voile, alors qu\'un brise-vue cherche l\'occultation. Conséquence pratique : un panneau plein occulte parfaitement mais protège mal du vent fort, tandis qu\'une haie ou un écran ajouré filtre le vent sans tout cacher.' },
    },
    {
      '@type': 'Question',
      name: 'Peut-on installer un brise-vue sur un balcon en copropriété ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le plus souvent oui, mais avec l\'accord du syndic. En copropriété, l\'aspect extérieur de l\'immeuble est régi par le règlement : la couleur, le matériau et le mode de fixation peuvent être imposés, et une autorisation écrite est généralement requise. Privilégiez une fixation sans perçage, sur le garde-corps uniquement, et un modèle amovible. Lisez le règlement de copropriété avant d\'acheter : un brise-vue posé sans accord peut devoir être retiré.' },
    },
    {
      '@type': 'Question',
      name: 'Quel brise-vue choisir pas cher ?',
      acceptedAnswer: { '@type': 'Answer', text: 'La toile tissée en PVC ou PEHD est l\'option la moins chère et la plus rapide : à partir d\'environ 8 €/ml en faible hauteur (selon brise-vue.com), elle se fixe en quelques minutes sur un grillage avec des colliers. La canisse naturelle (roseau, brande) reste bon marché — de l\'ordre de 15 à 45 €/ml posée d\'après Habitatpresto — avec un rendu plus chaleureux, mais une durée de vie de quelques années seulement. Pour occulter durablement et sans entretien, il faut monter en gamme vers le composite.' },
    },
  ],
};

export default function BriseVueQuelTypeChoisirPage() {
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
          <Link href="/guides/cloture">Guide clôture</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Quel brise-vue choisir</span>
        </nav>

        <h1 className="content-h1">
          Brise-vue&nbsp;: quel type choisir selon votre clôture, votre grillage ou votre balcon
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 28 juin 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/brise-vue-quel-type-choisir/hero.png"
            alt="Clôture de jardin résidentielle française occultée par une toile brise-vue anthracite tendue sur un grillage rigide, en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Le bon brise-vue dépend d&apos;abord du <strong>support à occulter</strong> et de
          l&apos;<strong>exposition au vent</strong>, pas seulement du matériau&nbsp;: une toile tissée
          sur un grillage souple, des lames rigides clipsées dans un grillage rigide, un panneau bois ou
          composite en clôture pleine, un occultant démontable sur un balcon. Côté budget, la toile PVC
          démarre autour de 8&nbsp;€/ml et la canisse naturelle autour de 15&nbsp;€/ml posée&nbsp;; un
          panneau bois ou composite grimpe de 70 à 185&nbsp;€/ml. Et un piège revient sans cesse&nbsp;:
          un occultant plein à 100&nbsp;% se comporte comme une voile au vent. Ce guide vous fait choisir
          par support, par taux d&apos;occultation et selon les règles 2026, sans préférence de marchand.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Choisissez d&apos;abord par <strong>support</strong>&nbsp;: toile sur grillage souple, lames sur grillage rigide, panneau en clôture pleine, amovible sur balcon.</li>
            <li>Prix indicatifs posés (Habitatpresto, 2026)&nbsp;: canisse 15-45&nbsp;€/ml, bois 70-150&nbsp;€/ml, composite 100-185&nbsp;€/ml&nbsp;; toile dès ~8&nbsp;€/ml en fourniture.</li>
            <li>Durée de vie&nbsp;: toile 3 à 7 ans, PVC jusqu&apos;à 10 ans, composite 15 à 20 ans, canisse quelques années.</li>
            <li>Vent&nbsp;: un panneau plein fait voile&nbsp;; en zone ventée, ajourez ou surdimensionnez l&apos;ancrage. Le gabion laisse passer l&apos;air.</li>
            <li>Réglementation&nbsp;: pas de hauteur maximale nationale, mais déclaration possible en secteur protégé ou si la commune l&apos;a décidé (R*421-12).</li>
          </ul>
        </div>

        {/* CTA 1 */}
        <CTALead projectHref="/cloture" projectLabel="ma clôture bois" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Brise-vue, brise-vent&nbsp;: la différence en une minute</h2>
        <p className="content-snippet">
          Un brise-vue masque les regards&nbsp;: son rôle est l&apos;intimité. Un brise-vent freine et
          filtre le vent&nbsp;: son rôle est le confort. Les deux se confondent souvent, mais un bon
          brise-vent est <em>ajouré</em> pour casser les rafales sans faire voile, alors qu&apos;un
          brise-vue cherche l&apos;occultation maximale. Conséquence&nbsp;: un panneau plein occulte
          très bien mais protège mal du vent fort.
        </p>
        <p className="content-body">
          On emploie les deux mots comme des synonymes, et dans bien des jardins le même écran fait les
          deux. Mais la nuance compte dès que le vent s&apos;en mêle. Un brise-vue plein arrête le
          regard&nbsp;: c&apos;est ce qu&apos;on cherche pour ne plus voir le voisin ni la rue. Un
          brise-vent efficace, lui, n&apos;arrête pas le vent — il le casse et le ralentit en le
          laissant filtrer à travers une trame ajourée, ce qui évite les turbulences violentes derrière
          l&apos;écran. C&apos;est pour cela qu&apos;une haie protège mieux du vent qu&apos;un mur plein,
          qui crée des rabattants de l&apos;autre côté.
        </p>
        <p className="content-body">
          Retenez la règle&nbsp;: si votre priorité est l&apos;intimité dans un jardin abrité, visez
          l&apos;occultation. Si votre terrain est exposé — bord de mer, plateau, couloir de vent —
          acceptez un peu de transparence en échange de la solidité. La suite de ce guide part justement
          de votre situation concrète&nbsp;: ce que vous avez déjà en place, et ce que vous voulez en
          faire.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">Quel brise-vue selon votre support&nbsp;?</h2>
        <p className="content-snippet">
          La première question n&apos;est pas «&nbsp;quel matériau&nbsp;», mais «&nbsp;sur quoi je le
          pose&nbsp;». Une toile se fixe sur un grillage souple, des lames se clipsent dans un grillage
          rigide, un panneau s&apos;intègre à une clôture pleine, et sur un balcon tout passe par le
          garde-corps. Le support commande la solution et le mode de fixation bien plus que vos goûts.
        </p>
        <p className="content-body">
          C&apos;est l&apos;angle que la plupart des comparatifs oublient&nbsp;: ils classent les
          brise-vue par matière (naturel contre synthétique) alors que, sur le terrain, on part toujours
          de ce qui est déjà planté dans le sol. Voici la grille de décision selon votre support&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Votre support</th>
              <th>Solution adaptée</th>
              <th>Fixation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Grillage souple (simple torsion)</td>
              <td>Toile tissée, canisse, haie artificielle</td>
              <td>Colliers de serrage, fil de tension</td>
            </tr>
            <tr>
              <td>Grillage rigide (panneaux soudés)</td>
              <td>Lames occultantes PVC, composite ou alu</td>
              <td>Lames glissées / clipsées entre les fils</td>
            </tr>
            <tr>
              <td>Clôture pleine ou poteaux</td>
              <td>Panneau bois, composite, claustra</td>
              <td>Vissé sur l&apos;ossature ou entre poteaux</td>
            </tr>
            <tr>
              <td>Balcon / garde-corps</td>
              <td>Toile ou canisse fine, occultant amovible</td>
              <td>Sans perçage, attaches sur le garde-corps</td>
            </tr>
            <tr>
              <td>Rien (à créer de zéro)</td>
              <td>Clôture bois pleine, gabion, panneau autoportant</td>
              <td>Poteaux scellés ou sur platines</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Deux cas méritent un mot. Sur un <strong>grillage rigide</strong>, n&apos;achetez pas une
          toile&nbsp;: les lames occultantes conçues pour ces panneaux se glissent verticalement entre
          les fils soudés, donnent un résultat net et durent bien plus longtemps qu&apos;une toile
          tendue. Et si vous partez de zéro, le brise-vue n&apos;est plus un accessoire mais une clôture
          à part entière&nbsp;: pour la dimensionner — nombre de poteaux, de lames, de visserie selon vos
          mètres exacts — notre{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>{' '}
          fait le calcul au poteau près, et le{' '}
          <Link href="/guides/cloture" className="content-link">guide de la clôture bois</Link>{' '}
          détaille la pose.
        </p>

        <figure className="content-figure">
          <Image
            src="/images/guides/brise-vue-quel-type-choisir/composite.png"
            alt="Lames occultantes en composite anthracite glissées verticalement entre les fils d'un grillage rigide dans un jardin"
            width={1672}
            height={941}
            sizes="(max-width: 768px) 100vw, 820px"
            loading="lazy"
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption className="content-figure-caption">
            Sur un grillage rigide, les lames occultantes se glissent verticalement entre les fils
            soudés&nbsp;: pose nette, sans toile à tendre, et tenue de plusieurs années.
          </figcaption>
        </figure>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">Les sept types de brise-vue comparés</h2>
        <p className="content-snippet">
          Toile, canisse, haie artificielle, panneau bois, lames composite, gabion&nbsp;: chaque famille
          a son taux d&apos;occultation, sa durée de vie et son prix. La toile est la moins chère et la
          plus rapide&nbsp;; le composite, le plus durable et le plus cher&nbsp;; le gabion, le plus
          stable au vent. Voici le tableau de tri.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Occultation</th>
              <th>Durée de vie</th>
              <th>Prix indicatif 2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Toile tissée PVC / PEHD</td>
              <td>70 à 100&nbsp;%</td>
              <td>3 à 7 ans</td>
              <td>dès ~8&nbsp;€/ml (fourniture)</td>
            </tr>
            <tr>
              <td>Canisse naturelle (roseau, brande)</td>
              <td>70 à 85&nbsp;%</td>
              <td>Quelques années</td>
              <td>15 à 45&nbsp;€/ml posée</td>
            </tr>
            <tr>
              <td>Canisse / brise-vue PVC</td>
              <td>85 à 95&nbsp;%</td>
              <td>Jusqu&apos;à 10 ans</td>
              <td>Moyen (au rouleau)</td>
            </tr>
            <tr>
              <td>Haie artificielle</td>
              <td>90 à 100&nbsp;%</td>
              <td>Variable</td>
              <td>Selon modèle</td>
            </tr>
            <tr>
              <td>Panneau bois (pin, douglas)</td>
              <td>Plein</td>
              <td>15 à 30 ans</td>
              <td>70 à 150&nbsp;€/ml posé</td>
            </tr>
            <tr>
              <td>Lames composite (WPC)</td>
              <td>~95&nbsp;%</td>
              <td>15 à 20 ans</td>
              <td>100 à 185&nbsp;€/ml posé</td>
            </tr>
            <tr>
              <td>Gabion</td>
              <td>Total (ajouré à l&apos;air)</td>
              <td>Très longue</td>
              <td>Selon modèle</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Les prix posés viennent des fourchettes 2026 de l&apos;agrégateur de devis{' '}
          <a href="https://www.habitatpresto.com/mag/menuiserie/portail-portillon/prix-cloture" target="_blank" rel="noopener noreferrer" className="content-link">Habitatpresto</a>{' '}
          (clôture de hauteur standard, pose comprise sauf mention)&nbsp;; le prix de la toile au mètre
          provient d&apos;une fiche distributeur (<a href="https://www.brise-vue.com/156-pare-vue-brise-vue-premium.html" target="_blank" rel="noopener noreferrer" className="content-link">brise-vue.com</a>,
          faible hauteur, fourniture seule). Deux familles ne sont volontairement pas chiffrées au mètre
          linéaire&nbsp;: la <strong>haie artificielle</strong> et le <strong>gabion</strong> se vendent
          au rouleau ou au panneau garni, sans fourchette au mètre fiable — méfiez-vous des sites qui en
          affichent une. Les durées de vie proviennent d&apos;une page dédiée de{' '}
          <a href="https://www.brise-vue.com/content/58-quelle-est-la-duree-de-vie-dun-brise-vue" target="_blank" rel="noopener noreferrer" className="content-link">brise-vue.com</a>&nbsp;:
          toile standard 3 à 5 ans, toile PEHD anti-UV 5 à 7 ans, PVC jusqu&apos;à 10 ans, composite 15
          à 20 ans.
        </p>
        <p className="content-body">
          La lecture est simple. Pour <strong>dépanner ou tester</strong> à petit prix, la toile&nbsp;:
          rapide, démontable, mais à remplacer au bout de quelques saisons. Pour un rendu{' '}
          <strong>chaleureux et écologique</strong>, la canisse naturelle, en acceptant qu&apos;elle
          vieillisse. Pour <strong>durer sans y revenir</strong>, le composite ou un panneau bois
          traité. Et pour <strong>tenir au vent</strong>, le gabion, qui laisse passer l&apos;air entre
          les pierres. Le bois, lui, joue dans la même cour qu&apos;une vraie clôture&nbsp;: si vous
          hésitez entre lames bois et composite, le comparatif{' '}
          <Link href="/guides/cloture-composite-ou-bois" className="content-link">clôture composite ou bois</Link>{' '}
          tranche poste par poste.
        </p>

        <figure className="content-figure">
          <Image
            src="/images/guides/brise-vue-quel-type-choisir/canisse.png"
            alt="Canisse en roseau naturel fixée sur une clôture en bois, texture chaleureuse éclairée par une lumière dorée"
            width={1672}
            height={941}
            sizes="(max-width: 768px) 100vw, 820px"
            loading="lazy"
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption className="content-figure-caption">
            La canisse naturelle (roseau, brande) donne un rendu chaleureux et bon marché, mais se
            remplace au bout de quelques saisons&nbsp;: c&apos;est l&apos;occultation d&apos;appoint
            par excellence.
          </figcaption>
        </figure>

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">Taux d&apos;occultation et vent&nbsp;: pourquoi le 100&nbsp;% est souvent une erreur</h2>
        <p className="content-snippet">
          Le taux d&apos;occultation se lit au grammage de la toile&nbsp;: environ 100 à 150&nbsp;g/m²
          pour 70&nbsp;%, 160 à 200&nbsp;g/m² pour 85&nbsp;%, 250&nbsp;g/m² et plus pour 100&nbsp;%. Mais
          plus c&apos;est occultant, plus ça prend le vent&nbsp;: un écran plein agit comme une voile. En
          zone ventée, mieux vaut un peu de transparence qu&apos;un ancrage qui cède.
        </p>
        <p className="content-body">
          Sur une toile, l&apos;occultation se mesure au grammage. D&apos;après les fiches techniques des
          distributeurs (<a href="https://www.brise-vue.com/content/39-quel-est-le-meilleur-grammage-pour-un-brise-vue" target="_blank" rel="noopener noreferrer" className="content-link">brise-vue.com</a>,{' '}
          <a href="https://www.osyla.com/content/quelle-densite-choisir-pour-son-brise-vue--141" target="_blank" rel="noopener noreferrer" className="content-link">Osyla</a>),
          comptez de l&apos;ordre de 100 à 150&nbsp;g/m² pour une occultation légère d&apos;environ
          70&nbsp;%, 160 à 200&nbsp;g/m² pour 85&nbsp;%, et 250&nbsp;g/m² ou plus pour une occultation
          totale — les toiles haut de gamme atteignent 300&nbsp;g/m² pour 100&nbsp;%. Plus le chiffre est
          élevé, plus la trame est serrée, plus on cache… et plus on encaisse le vent.
        </p>
        <p className="content-body">
          C&apos;est le point que l&apos;on sous-estime presque toujours. Un brise-vue plein ne laisse
          rien passer&nbsp;: il se comporte comme la voile d&apos;un bateau et transmet toute la poussée
          du vent à ses poteaux. Habitatpresto donne un ordre de grandeur parlant&nbsp;:{' '}
          <a href="https://www.habitatpresto.com/mag/jardin/brise-vue-resistant-vent-fort" target="_blank" rel="noopener noreferrer" className="content-link">une toile à 30&nbsp;% d&apos;occultation réduit la pression du vent de près de moitié</a>{' '}
          par rapport à un écran plein. Autrement dit, en site exposé, accepter un peu de transparence
          n&apos;est pas un compromis esthétique&nbsp;: c&apos;est ce qui empêche la clôture de finir au
          sol après le premier coup de vent.
        </p>
        <p className="content-body">
          Si vous tenez à occulter à fond malgré l&apos;exposition, il faut surdimensionner
          l&apos;ancrage&nbsp;: plots béton profonds (souvent 40 à 60&nbsp;cm, davantage en terrain
          meuble), poteaux en acier galvanisé ou aluminium plutôt qu&apos;en bois léger, et entraxe
          réduit entre les appuis. Une règle de bon sens&nbsp;: n&apos;occultez jamais à 100&nbsp;% une
          clôture posée sur platines, sans scellement profond — elle n&apos;est pas faite pour ça. Pour
          vérifier la section des poteaux et l&apos;espacement selon votre hauteur, repassez par le{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>.
        </p>

        <figure className="content-figure">
          <Image
            src="/images/guides/brise-vue-quel-type-choisir/gabion.png"
            alt="Brise-vue en gabion : deux panneaux grillagés remplis de pierres formant un mur d'occultation dans un jardin contemporain"
            width={1672}
            height={941}
            sizes="(max-width: 768px) 100vw, 820px"
            loading="lazy"
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption className="content-figure-caption">
            Le gabion occulte totalement tout en laissant passer l&apos;air entre les pierres&nbsp;:
            c&apos;est l&apos;occultant le plus stable face au vent fort, au prix d&apos;une emprise
            et d&apos;un poids importants.
          </figcaption>
        </figure>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Réglementation 2026&nbsp;: le piège de l&apos;occultant rapporté</h2>
        <p className="content-snippet">
          Poser un brise-vue sur une clôture conforme ne demande en général aucune formalité — sauf deux
          cas&nbsp;: si l&apos;ajout fait dépasser la hauteur autorisée par votre PLU, ou si vous êtes en
          secteur protégé ou dans une commune qui a soumis les clôtures à déclaration (R*421-12). Il
          n&apos;y a pas de hauteur maximale nationale, mais il y a des règles locales.
        </p>
        <p className="content-body">
          C&apos;est la confusion la plus répandue, et elle peut coûter cher. Première chose à
          savoir&nbsp;: il n&apos;existe <strong>pas de hauteur maximale nationale</strong> pour une
          clôture — <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F36503/0" target="_blank" rel="noopener noreferrer" className="content-link">service-public.gouv.fr le confirme</a>.
          À défaut de règle locale, on se réfère à l&apos;usage de l&apos;article 663 du code civil&nbsp;:
          2,60&nbsp;m dans les communes de moins de 50&nbsp;000 habitants, 3,20&nbsp;m au-delà. Mais
          c&apos;est le <strong>plan local d&apos;urbanisme (PLU)</strong> de votre commune qui fixe la
          vraie limite, souvent plus basse. La règle de hauteur générale est détaillée dans notre guide{' '}
          <Link href="/guides/hauteur-cloture-loi-2026" className="content-link">hauteur de clôture et loi 2026</Link>&nbsp;;
          ici, on s&apos;arrête sur le cas particulier de l&apos;occultant qu&apos;on <em>ajoute</em>.
        </p>
        <p className="content-body">
          Le piège est là&nbsp;: si votre clôture est déjà à la hauteur maximale autorisée et que vous
          posez par-dessus une canisse ou un panneau qui la rehausse, vous créez une infraction — même si
          la clôture d&apos;origine, elle, était conforme. Côté <strong>déclaration préalable</strong>,
          l&apos;article{' '}
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034355392" target="_blank" rel="noopener noreferrer" className="content-link">R*421-12 du code de l&apos;urbanisme</a>{' '}
          la rend obligatoire dans quatre situations&nbsp;: abords d&apos;un monument historique, site
          classé ou inscrit, secteur délimité par le PLU, et commune (ou intercommunalité) qui a décidé
          par délibération de soumettre les clôtures à déclaration. Le délai d&apos;instruction est
          d&apos;un mois, porté à deux mois en secteur protégé. Hors de ces cas, ajouter un occultant sur
          un grillage existant ne déclenche en général pas de formalité&nbsp;; en cas de doute, un appel
          au service urbanisme de la mairie règle la question.
        </p>
        <p className="content-body">
          Deux autres règles de voisinage valent d&apos;être connues. Un brise-vue végétal — haie de
          bambou, troène, laurier — doit respecter les distances de plantation de l&apos;article 671 du
          code civil&nbsp;: 0,50&nbsp;m de la limite séparative si la haie ne dépasse pas 2&nbsp;m de
          haut, 2&nbsp;m de recul au-delà. Et quelle que soit la solution, votre clôture ne doit pas
          créer de <strong>trouble anormal de voisinage</strong> — une perte d&apos;ensoleillement ou de
          vue manifestement excessive chez le voisin peut être contestée, même en l&apos;absence de
          hauteur maximale écrite.
        </p>

        {/* ════════════ PARTENAIRE AWIN — Woodstore24 (brise-vue WPC) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers Woodstore24
          (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens, DIY Builder peut
          percevoir une commission, sans surcoût pour vous. Ce guide reste indépendant&nbsp;: nous ne
          recommandons pas le composite plutôt que le bois ou la toile, nous donnons les critères pour
          que vous décidiez. Voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="cloture" placement="guide" />

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">Cas du balcon et de la copropriété</h2>
        <p className="content-snippet">
          Sur un balcon, deux contraintes s&apos;ajoutent&nbsp;: le règlement de copropriété et
          l&apos;absence de perçage. L&apos;aspect extérieur de l&apos;immeuble est encadré — couleur,
          matériau et fixation peuvent être imposés — et une autorisation écrite du syndic est souvent
          nécessaire. Privilégiez un occultant amovible, fixé sur le garde-corps sans le percer.
        </p>
        <p className="content-body">
          Le balcon n&apos;est pas un jardin&nbsp;: ce que vous accrochez à la rambarde modifie la façade
          de l&apos;immeuble, qui est une partie commune par sa vue. En pratique, le règlement de
          copropriété peut imposer une teinte précise (souvent un gris ou un beige neutre), interdire
          certains matériaux, et exiger l&apos;accord de l&apos;assemblée ou du syndic avant toute pose.
          Mieux vaut une demande écrite en amont qu&apos;un brise-vue à démonter sur injonction.
        </p>
        <p className="content-body">
          Côté technique, la règle d&apos;or est de <strong>ne pas percer</strong>&nbsp;: on fixe sur le
          garde-corps avec des attaches, des œillets et des tendeurs, jamais dans la maçonnerie ou le
          béton du balcon. Choisissez une toile légère ou une canisse fine, faciles à retirer en cas de
          tempête ou de déménagement. C&apos;est aussi ce qui protège votre dépôt de garantie si vous
          êtes locataire.
        </p>

        {/* ════════════ H2.7 ════════════ */}
        <h2 className="content-h2">Poser son brise-vue soi-même, selon le support</h2>
        <p className="content-snippet">
          La pose dépend du support. Sur grillage souple&nbsp;: dérouler la toile et la fixer aux mailles
          avec des colliers tous les 20 à 30&nbsp;cm, en haut, en bas et au milieu. Sur grillage
          rigide&nbsp;: glisser les lames verticalement entre les fils. Sur poteaux&nbsp;: visser les
          panneaux. Comptez une demi-journée pour une dizaine de mètres.
        </p>
        <p className="content-body">
          Sur un <strong>grillage souple</strong>, tendez d&apos;abord un fil de tension galvanisé en
          haut et en bas entre les piquets&nbsp;: il porte la toile et l&apos;empêche de gondoler.
          Déroulez la toile, fixez-la au fil et aux mailles avec des colliers de serrage en plastique
          tous les 20 à 30&nbsp;cm, sans trop serrer pour ne pas déchirer les œillets. Coupez le surplus
          au cutter. Une toile bien tendue, attachée sur trois lignes (haut, milieu, bas), tient
          nettement mieux au vent qu&apos;une toile fixée seulement en haut.
        </p>
        <p className="content-body">
          Sur un <strong>grillage rigide</strong>, pas de toile&nbsp;: les lames occultantes se glissent
          verticalement entre les fils soudés, rang par rang, puis se bloquent avec les clips fournis. Le
          résultat est net, sans plis, et tient des années. Sur une <strong>clôture pleine ou des
          poteaux</strong>, on visse le panneau bois ou composite sur l&apos;ossature, en laissant un jeu
          de dilatation pour le composite. Dans tous les cas, vérifiez l&apos;aplomb au niveau et
          l&apos;alignement au cordeau avant de fixer définitivement&nbsp;: une clôture qui ondule se
          voit de loin. Si vous montez une clôture bois complète pour y intégrer l&apos;occultation,
          notre{' '}
          <Link href="/guides/cloture" className="content-link">guide de la clôture bois</Link>{' '}
          reprend la pose des poteaux et des lames de A à Z.
        </p>

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Quelle hauteur de brise-vue est autorisée sans déclaration&nbsp;?</h3>
          <p className="content-body">
            Il n&apos;existe pas de hauteur «&nbsp;autorisée sans déclaration&nbsp;» fixée au niveau
            national. Ce qui déclenche une déclaration préalable, c&apos;est le lieu — terrain en secteur
            protégé, ou commune ayant décidé par délibération de soumettre les clôtures à déclaration
            (article R*421-12 du code de l&apos;urbanisme) — pas la hauteur seule. À défaut de PLU, la
            hauteur de référence d&apos;une clôture est de 2,60&nbsp;m dans les communes de moins de
            50&nbsp;000 habitants et de 3,20&nbsp;m au-delà (article 663 du code civil). Un brise-vue qui
            ferait dépasser la limite fixée par votre PLU créerait une infraction&nbsp;: vérifiez le
            règlement local avant de rehausser.
          </p>

          <h3 className="content-h3">Faut-il une autorisation de la mairie pour poser un brise-vue&nbsp;?</h3>
          <p className="content-body">
            Pas systématiquement. Une déclaration préalable n&apos;est obligatoire que si votre terrain
            est en secteur protégé (abords de monument historique, site classé ou inscrit, secteur
            délimité par le PLU) ou si votre commune a décidé de soumettre les clôtures à déclaration
            (article R*421-12). Le délai d&apos;instruction est alors d&apos;un mois, porté à deux mois en
            secteur protégé. Poser une canisse ou une toile sur un grillage existant ne crée en général
            pas d&apos;obligation hors de ces cas — mais en zone protégée ou en cas de doute, demandez au
            service urbanisme de votre mairie.
          </p>

          <h3 className="content-h3">Quel est le meilleur brise-vue contre le vent&nbsp;?</h3>
          <p className="content-body">
            Le plus résistant n&apos;est pas le plus occultant. Un panneau plein à 100&nbsp;% agit comme
            une voile et encaisse toute la pression&nbsp;: selon Habitatpresto, une toile à 30&nbsp;%
            d&apos;occultation réduit la pression du vent de près de moitié. En zone ventée, privilégiez
            un modèle ajouré ou semi-occultant, ou surdimensionnez l&apos;ancrage&nbsp;: plots de 40 à
            60&nbsp;cm, poteaux en acier galvanisé ou aluminium, entraxe réduit. Le gabion, qui laisse
            passer l&apos;air entre les pierres, est l&apos;occultant le plus stable face au vent fort.
          </p>

          <h3 className="content-h3">Quelle différence entre un brise-vue et un brise-vent&nbsp;?</h3>
          <p className="content-body">
            Un brise-vue masque les regards&nbsp;: son rôle est l&apos;intimité. Un brise-vent freine et
            filtre le vent&nbsp;: son rôle est le confort et la protection des plantations. Les deux se
            confondent souvent, mais un bon brise-vent est ajouré, pour casser les rafales sans faire
            voile, alors qu&apos;un brise-vue cherche l&apos;occultation. Conséquence pratique&nbsp;: un
            panneau plein occulte parfaitement mais protège mal du vent fort, tandis qu&apos;une haie ou
            un écran ajouré filtre le vent sans tout cacher.
          </p>

          <h3 className="content-h3">Peut-on installer un brise-vue sur un balcon en copropriété&nbsp;?</h3>
          <p className="content-body">
            Le plus souvent oui, mais avec l&apos;accord du syndic. En copropriété, l&apos;aspect
            extérieur de l&apos;immeuble est régi par le règlement&nbsp;: la couleur, le matériau et le
            mode de fixation peuvent être imposés, et une autorisation écrite est généralement requise.
            Privilégiez une fixation sans perçage, sur le garde-corps uniquement, et un modèle amovible.
            Lisez le règlement de copropriété avant d&apos;acheter&nbsp;: un brise-vue posé sans accord
            peut devoir être retiré.
          </p>

          <h3 className="content-h3">Quel brise-vue choisir pas cher&nbsp;?</h3>
          <p className="content-body">
            La toile tissée en PVC ou PEHD est l&apos;option la moins chère et la plus rapide&nbsp;: à
            partir d&apos;environ 8&nbsp;€/ml en faible hauteur (selon brise-vue.com), elle se fixe en
            quelques minutes sur un grillage avec des colliers. La canisse naturelle (roseau, brande)
            reste bon marché — de l&apos;ordre de 15 à 45&nbsp;€/ml posée d&apos;après Habitatpresto —
            avec un rendu plus chaleureux, mais une durée de vie de quelques années seulement. Pour
            occulter durablement et sans entretien, il faut monter en gamme vers le composite.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/cloture">Guide de la clôture bois</Link> — sections, ancrage classe 4, pose pas à pas et budget de la structure</li>
            <li><Link href="/cloture">Simulateur de clôture</Link> — quantitatifs et prix par enseigne pour chiffrer une clôture bois au poteau près</li>
            <li><Link href="/guides/cloture-composite-ou-bois">Clôture composite ou bois</Link> — le match de matières quand le brise-vue devient une clôture pleine</li>
            <li><Link href="/guides/hauteur-cloture-loi-2026">Hauteur de clôture et loi 2026</Link> — PLU, servitude de vue et trouble de voisinage, la règle de hauteur en détail</li>
            <li><Link href="/guides/prix-cloture-au-metre-2026">Prix d&apos;une clôture au mètre 2026</Link> — combien coûte chaque matériau, postes cachés et budgets clés en main</li>
            <li><Link href="/guides/cloture-solaire-brise-vue-photovoltaique-2026">Clôture solaire</Link> — le brise-vue qui produit aussi de l&apos;électricité</li>
            <li><Link href="/guides/comparer-devis-travaux">Comparer des devis</Link> — faire chiffrer la pose par un pro et lire le devis sans se faire avoir</li>
            <li><Link href="/sources">Sources techniques</Link> — code civil, code de l&apos;urbanisme, service-public, Habitatpresto</li>
          </ul>
        </aside>

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 28 juin 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources techniques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
