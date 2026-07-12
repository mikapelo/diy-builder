import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import Callout from '@/components/content/Callout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Prix d\'une clôture au mètre';
const OG_SUBTITLE = 'Tarifs 2026 par matériau, pose et postes cachés';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cloture`;

export const metadata = {
  title: 'Prix d\'une clôture au mètre 2026 : tarifs par matériau',
  description:
    'Prix d\'une clôture au mètre en 2026 : tableau par matériau (grillage, bois, composite, alu, gabion), coût de pose, postes cachés et 3 budgets clés en main chiffrés.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/prix-cloture-au-metre-2026' },
  openGraph: {
    title: 'Prix d\'une clôture au mètre en 2026 | DIY Builder',
    description:
      'Tarifs 2026 par matériau et pose, l\'effet de la hauteur, les postes cachés d\'un devis de clôture et 3 budgets complets chiffrés. Sans gonfler les chiffres.',
    url: 'https://www.diy-builder.fr/guides/prix-cloture-au-metre-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Prix d\'une clôture au mètre 2026 — DIY Builder' }],
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
    { '@type': 'ListItem', position: 4, name: 'Prix d\'une clôture au mètre 2026', item: 'https://www.diy-builder.fr/guides/prix-cloture-au-metre-2026' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Prix d\'une clôture au mètre en 2026 : tarifs par matériau et pose',
  description:
    'Le prix d\'une clôture au mètre en 2026, par matériau et pose comprise : grillage, bois, composite, PVC, aluminium, gabion, béton. Postes cachés et budgets chiffrés.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-21',
  dateModified: '2026-06-21',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/prix-cloture-au-metre-2026',
  image: OG_URL,
  about: ['Prix clôture', 'Clôture jardin', 'Coût clôture', 'Devis clôture'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien coûte une clôture au mètre en 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pose comprise, pour une hauteur d\'environ 1,80 m, comptez de 14 à 43 €/ml pour un grillage souple, 40 à 130 €/ml pour un grillage rigide, 70 à 110 €/ml pour une clôture en pin classe 4, 90 à 280 €/ml pour du composite et 175 à 400 €/ml pour de l\'aluminium. Le gabion clé en main monte à 250-450 €/ml. Ces fourchettes sont des ordres de grandeur TTC à affiner par devis : le terrain, la hauteur et la pose font varier le prix du simple au double.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la clôture la moins chère ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le grillage simple torsion, de loin : 2 à 8 €/ml en fourniture seule, 14 à 43 €/ml posé. Vient ensuite le grillage rigide à panneaux, le plus courant aujourd\'hui, à partir de 40 €/ml posé en faible hauteur. Pour de l\'occultation économique, on ajoute des lames PVC ou une canisse au grillage rigide plutôt que de partir sur une clôture pleine. La clôture bois en pin autoclave reste l\'option pleine la plus abordable.' },
    },
    {
      '@type': 'Question',
      name: 'Le prix d\'une clôture comprend-il la pose ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pas toujours, et c\'est le piège des comparaisons. Les prix « au mètre » affichés en magasin sont souvent en fourniture seule. La pose par un professionnel ajoute couramment 15 à 50 €/ml selon le type (15-25 pour un grillage, 25-50 pour du bois, 40-100 pour de l\'aluminium), soit 30 à 50 % du devis sur une clôture standard. En posant vous-même, vous économisez cette part — c\'est l\'écart entre les colonnes « fourniture » et « posé » de notre tableau.' },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi une clôture de 2 m coûte-t-elle plus cher qu\'une de 1 m ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Passer de 1,20 m à 2 m augmente le prix de 30 à 50 % à matériau égal. Une clôture plus haute, c\'est plus de matière (lames, grillage), des poteaux plus longs scellés plus profond, et parfois un soubassement. Sur un grillage rigide, on passe ainsi d\'environ 40-80 €/ml en hauteur 1 m à 65-130 €/ml en 1,90 m. Vérifiez toujours pour quelle hauteur un prix est annoncé avant de comparer.' },
    },
    {
      '@type': 'Question',
      name: 'Quels frais oublie-t-on dans un devis de clôture ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Les postes annexes, qui gonflent vite la facture : le scellement des poteaux dans le béton (25-40 €/ml), le terrassement si le terrain est en pente (7-10 €/m²), la dépose et l\'évacuation de l\'ancienne clôture (150-300 €), un éventuel soubassement béton (38-68 €/ml), et surtout le portail et le portillon. Un portail motorisé posé coûte à lui seul 1 500 à 6 500 €, un portillon 150 à 1 900 €.' },
    },
    {
      '@type': 'Question',
      name: 'Combien coûte la pose d\'une clôture par un professionnel ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Un paysagiste facture 40 à 55 €/h, un clôturier spécialisé jusqu\'à 85 €/h. Ramené au mètre, la pose seule revient à 15-25 €/ml pour un grillage souple, 25-40 €/ml pour des panneaux rigides, 25-50 €/ml pour du bois et 40-100 €/ml pour de l\'aluminium ou du fer forgé. La main-d\'œuvre représente grosso modo 30 à 50 % d\'un devis de clôture standard, moins sur les matériaux haut de gamme où la fourniture domine.' },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une déclaration préalable pour poser une clôture ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pas partout. La déclaration préalable de travaux n\'est obligatoire que si votre commune l\'a instituée (par délibération, dans le PLU), en secteur protégé ou aux abords d\'un monument historique. Elle est gratuite, avec une instruction d\'un mois (deux en secteur protégé) ; passé ce délai sans réponse, l\'accord est tacite. Renseignez-vous en mairie avant de commander, car le PLU peut aussi imposer une hauteur ou un aspect.' },
    },
    {
      '@type': 'Question',
      name: 'Comment payer sa clôture moins cher ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Trois leviers. Posez vous-même : vous économisez 30 à 50 % du devis (la main-d\'œuvre). Choisissez un grillage rigide avec lames occultantes plutôt qu\'une clôture pleine : même intimité, prix divisé. Et chiffrez vos quantités exactes avant d\'acheter, pour ne pas surcommander poteaux et panneaux — c\'est ce que fait notre simulateur de clôture, qui compare en plus les prix par enseigne.' },
    },
  ],
};

export default function PrixClotureAuMetrePage() {
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
          <span className="content-breadcrumb-current">Prix au mètre 2026</span>
        </nav>

        <h1 className="content-h1">
          Prix d&apos;une clôture au mètre en 2026 : tarifs par matériau et pose
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 21 juin 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/prix-cloture-au-metre-2026/hero.png"
            alt="Plusieurs types de clôtures de jardin alignées — grillage rigide, lames bois et panneau composite — le long d'une allée pavillonnaire française en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Le prix d&apos;une clôture va du simple au vingtuple selon le matériau : pose comprise, à
          1,80 m de hauteur, comptez de 14-43 €/ml pour un grillage souple à 175-400 €/ml pour de
          l&apos;aluminium, en passant par 70-110 €/ml pour du pin et 90-280 €/ml pour du composite
          (ordres de grandeur TTC, 2026). Deux pièges faussent toutes les comparaisons : la plupart
          des prix affichés valent pour une hauteur d&apos;un mètre — comptez 30 à 50 % de plus en
          1,80 m — et ils oublient les postes cachés (poteaux, fondations, portail) qui pèsent lourd.
          Ce guide remet les vrais chiffres à plat, matériau par matériau.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Posé, ~1,80 m&nbsp;: grillage souple 14-43 €/ml, rigide 40-130, bois 70-150, composite 90-280, alu 175-400, gabion 250-450.</li>
            <li>La hauteur compte&nbsp;: +30 à +50 % de prix entre 1,20 m et 2 m, à matériau égal.</li>
            <li>La pose représente 30 à 50 % du devis&nbsp;: la faire soi-même est la première économie.</li>
            <li>Postes cachés&nbsp;: scellement poteaux 25-40 €/ml, dépose 150-300 €, portail motorisé 1 500-6 500 €.</li>
            <li>Déclaration préalable&nbsp;: gratuite, mais obligatoire seulement si la commune l&apos;impose (PLU).</li>
          </ul>
        </div>

        {/* CTA 1 */}
        <CTALead projectHref="/cloture" projectLabel="le budget exact de ma clôture" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Combien coûte une clôture au mètre&nbsp;? Le tableau par matériau</h2>
        <p className="content-snippet">
          Du moins cher au plus cher, pose comprise, pour une clôture d&apos;environ 1,80 m (ordres de
          grandeur TTC, 2026)&nbsp;: grillage simple torsion 14-43 €/ml, grillage rigide 40-130, PVC
          60-150, pin classe 4 70-110, douglas 95-150, composite 90-280, mélèze 120-220, aluminium
          175-400, gabion 250-450. Les fourchettes se chevauchent&nbsp;: un alu d&apos;entrée de gamme
          peut coûter moins qu&apos;un composite haut de gamme.
        </p>
        <p className="content-body">
          Voici les fourchettes posées relevées chez les agrégateurs de devis français (Prix-Pose,
          Prix-travaux-m2, AlloJardin, abctravaux) en 2026, converties en ordres de grandeur TTC,
          pour une hauteur standard d&apos;environ 1,80 m&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Type de clôture</th>
              <th>Fourniture seule (€/ml)</th>
              <th>Posé (€/ml)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Grillage simple torsion</td>
              <td>2 – 8</td>
              <td>14 – 43</td>
            </tr>
            <tr>
              <td>Grillage rigide (panneaux)</td>
              <td>25 – 50</td>
              <td>40 – 130</td>
            </tr>
            <tr>
              <td>Béton (lisses, plaques)</td>
              <td>10 – 150</td>
              <td>55 – 180</td>
            </tr>
            <tr>
              <td>PVC</td>
              <td>50 – 100</td>
              <td>60 – 150</td>
            </tr>
            <tr>
              <td>Bois — pin autoclave classe 4</td>
              <td>35 – 55</td>
              <td>70 – 110</td>
            </tr>
            <tr>
              <td>Bois — douglas</td>
              <td>50 – 90</td>
              <td>95 – 150</td>
            </tr>
            <tr>
              <td>Composite (WPC)</td>
              <td>80 – 200</td>
              <td>90 – 280</td>
            </tr>
            <tr>
              <td>Aluminium</td>
              <td>150 – 350</td>
              <td>175 – 400</td>
            </tr>
            <tr>
              <td>Gabion (clé en main)</td>
              <td>cages 35 – 90</td>
              <td>250 – 450</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Trois lectures utiles. D&apos;abord, l&apos;ordre n&apos;est pas figé&nbsp;: les fourchettes
          se chevauchent largement, et un produit d&apos;entrée de gamme dans une catégorie chère peut
          revenir moins cher qu&apos;un produit premium dans une catégorie réputée bon marché. Ensuite,
          le grillage rigide à panneaux s&apos;est imposé comme le standard du pavillonnaire&nbsp;: bon
          rapport prix/tenue, et on lui ajoute des lames occultantes quand on veut de l&apos;intimité,
          pour bien moins cher qu&apos;une clôture pleine. Enfin, pour départager le bois et le
          composite — les deux options pleines les plus demandées — le prix ne suffit pas&nbsp;: notre{' '}
          <Link href="/guides/cloture-composite-ou-bois" className="content-link">comparatif clôture composite ou bois</Link>{' '}
          pèse durée de vie, entretien et écologie.
        </p>

        <Callout type="pro">
          Besoin d&apos;intimité sans faire exploser le budget&nbsp;? Partez sur un grillage rigide à
          panneaux, puis ajoutez-y des lames occultantes&nbsp;: vous obtenez le même effet
          qu&apos;une clôture pleine, pour bien moins cher.
        </Callout>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">La hauteur change tout&nbsp;: +30 à +50&nbsp;% de 1,20 à 2 m</h2>
        <p className="content-snippet">
          C&apos;est le piège numéro un des prix affichés&nbsp;: la plupart valent pour une hauteur
          d&apos;un mètre. Passer de 1,20 m à 2 m augmente le prix de 30 à 50&nbsp;% à matériau égal.
          Sur un grillage rigide, on passe ainsi d&apos;environ 40-80 €/ml en 1 m à 65-130 €/ml en
          1,90 m. Vérifiez toujours pour quelle hauteur un tarif est donné avant de comparer deux
          devis.
        </p>
        <p className="content-body">
          Une clôture plus haute coûte plus cher pour trois raisons cumulées&nbsp;: il faut plus de
          matière (lames ou grillage sur toute la hauteur), des poteaux plus longs scellés plus
          profond pour résister à la prise au vent, et parfois un soubassement en bas. L&apos;écart
          n&apos;est pas marginal&nbsp;: les sources qui détaillent le prix par hauteur montrent une
          hausse de 30 à 50&nbsp;% entre 1,20 m et 2 m. Concrètement, un grillage rigide passe
          d&apos;environ 40-80 €/ml posé en 1 m à 65-130 €/ml en 1,90 m — la borne basse grimpe de
          plus de moitié.
        </p>
        <p className="content-body">
          La leçon pratique&nbsp;: ne comparez jamais deux prix au mètre sans vérifier la hauteur de
          référence. Un devis «&nbsp;à 55 €/ml&nbsp;» pour du 1 m et un autre «&nbsp;à 75 €/ml&nbsp;»
          pour du 1,80 m peuvent décrire la même clôture au même prix réel. Et avant de choisir une
          hauteur, vérifiez ce que votre commune autorise&nbsp;: le sujet est traité dans notre guide{' '}
          <Link href="/guides/hauteur-cloture-loi-2026" className="content-link">hauteur de clôture et loi 2026</Link>.
        </p>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">La pose&nbsp;: combien pour la main-d&apos;œuvre</h2>
        <p className="content-snippet">
          Un paysagiste facture 40 à 55 €/h, un clôturier spécialisé jusqu&apos;à 85 €/h. Au mètre, la
          pose seule revient à 15-25 €/ml pour un grillage, 25-40 €/ml pour des panneaux rigides,
          25-50 €/ml pour du bois et 40-100 €/ml pour de l&apos;aluminium. La main-d&apos;œuvre pèse
          30 à 50&nbsp;% d&apos;un devis de clôture standard&nbsp;: la poser soi-même est la première
          économie possible.
        </p>
        <p className="content-body">
          La pose est le poste sur lequel on a le plus de prise. Voici les tarifs de main-d&apos;œuvre
          seule, hors fourniture, relevés en 2026&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Pose seule (€/ml)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Grillage souple</td>
              <td>15 – 25</td>
            </tr>
            <tr>
              <td>Panneaux rigides + plots</td>
              <td>25 – 40</td>
            </tr>
            <tr>
              <td>Bois</td>
              <td>25 – 50</td>
            </tr>
            <tr>
              <td>Aluminium / fer forgé</td>
              <td>40 – 100</td>
            </tr>
            <tr>
              <td>Soubassement béton</td>
              <td>20 – 35</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Sur une clôture rigide standard, la pose représente grosso modo un tiers à la moitié du
          devis&nbsp;; sur de l&apos;aluminium ou du composite haut de gamme, c&apos;est la fourniture
          qui domine et la pose pèse moins en proportion. L&apos;autoconstruction reste donc le levier
          d&apos;économie le plus net sur les matériaux courants — à condition d&apos;avoir le temps et
          un terrain pas trop ingrat. Notre{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>{' '}
          calcule les quantités exactes (poteaux, rails, lames, visserie) pour chiffrer la fourniture
          au plus juste, avec comparatif des prix par enseigne.
        </p>

        {/* CTA milieu */}
        <CTALead projectHref="/cloture" projectLabel="mes quantités exactes de clôture" />

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">Les postes cachés qui gonflent le devis</h2>
        <p className="content-snippet">
          Le prix au mètre ne fait pas le budget. Comptez en plus le scellement des poteaux (25-40
          €/ml), le terrassement si le terrain est en pente (7-10 €/m²), la dépose de l&apos;ancienne
          clôture (150-300 €), un soubassement éventuel (38-68 €/ml), et surtout le portail&nbsp;: un
          portail motorisé posé coûte 1 500 à 6 500 €, un portillon 150 à 1 900 €. Ce sont eux qui
          font déraper un devis.
        </p>
        <p className="content-body">
          C&apos;est la partie que les comparaisons «&nbsp;au mètre&nbsp;» passent sous silence, et
          c&apos;est souvent là que le budget dérape. Les postes à anticiper&nbsp;:
        </p>
        <ul className="content-body">
          <li><strong>Scellement des poteaux</strong>&nbsp;: la main-d&apos;œuvre et le béton des fondations ajoutent 25 à 40 €/ml. Incontournable sur toute clôture rigide ou pleine.</li>
          <li><strong>Terrassement / nivellement</strong>&nbsp;: sur un terrain en pente, comptez 7 à 10 €/m², et la location d&apos;une mini-pelle autour de 300 €/jour.</li>
          <li><strong>Dépose et évacuation</strong> de l&apos;ancienne clôture&nbsp;: de l&apos;ordre de 150 à 300 € pour un chantier courant, plus l&apos;évacuation des gravats.</li>
          <li><strong>Soubassement ou muret bahut</strong>&nbsp;: 38 à 68 €/ml tout compris pour une rangée basse&nbsp;; davantage pour un vrai muret.</li>
          <li><strong>Portail et portillon</strong>&nbsp;: le poste le plus lourd. Un portail motorisé fourni-posé va de 1 500 à 6 500 € selon ouverture et matériau, un portillon de 150 € (bois) à 1 900 € (aluminium).</li>
          <li><strong>Déclaration préalable</strong>&nbsp;: gratuite, mais à intégrer au calendrier (un mois d&apos;instruction) quand la commune l&apos;impose — détail plus bas.</li>
        </ul>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Trois budgets clés en main, chiffrés</h2>
        <p className="content-snippet">
          Pour fixer les idées&nbsp;: 20 m de grillage rigide à 1,50 m reviennent autour de 800 à
          1 600 € posés&nbsp;; 15 m de clôture bois en pin à 1,80 m, environ 1 050 à 1 650 €&nbsp;;
          25 m de composite à 1,80 m, de l&apos;ordre de 2 250 à 4 250 €. Hors portail, terrassement
          et dépose, à ajouter selon votre chantier.
        </p>
        <p className="content-body">
          Trois cas types, en médiane des fourchettes ci-dessus, à encadrer d&apos;un «&nbsp;selon
          devis&nbsp;»&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Détail</th>
              <th>Budget posé</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>20 ml grillage rigide, 1,50 m</td>
              <td>Panneaux + poteaux + scellement</td>
              <td>800 – 1 600 €</td>
            </tr>
            <tr>
              <td>15 ml bois pin classe 4, 1,80 m</td>
              <td>Panneaux + poteaux + pose</td>
              <td>1 050 – 1 650 €</td>
            </tr>
            <tr>
              <td>25 ml composite WPC, 1,80 m</td>
              <td>Lames + poteaux alu + pose</td>
              <td>2 250 – 4 250 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Ces totaux couvrent la clôture seule. Selon votre chantier, ajoutez le portail et le
          portillon (de quelques centaines à plusieurs milliers d&apos;euros), la dépose de
          l&apos;ancienne clôture (150-300 €) et le terrassement en cas de pente (7-10 €/m²). Pour
          affiner sur vos dimensions et comparer les prix matériaux par enseigne, le{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>{' '}
          fait le calcul, et si vous confiez la pose à un pro, notre guide{' '}
          <Link href="/guides/comparer-devis-travaux" className="content-link">comparer des devis de travaux</Link>{' '}
          aide à lire un devis sans se faire avoir.
        </p>

        {/* ─── ENCART RÉGLEMENTATION ─── */}
        <div className="content-disclaimer">
          <strong>Avant de commander&nbsp;:</strong> une clôture peut exiger une déclaration préalable
          de travaux en mairie, mais seulement si votre commune l&apos;a instituée (PLU, secteur
          protégé, abords d&apos;un monument historique). Elle est gratuite, l&apos;instruction dure un
          mois (deux en secteur protégé) et le silence vaut accord. Le PLU peut aussi imposer une
          hauteur, un aspect ou un retrait&nbsp;: renseignez-vous en mairie avant l&apos;achat. Détail
          dans notre guide{' '}
          <Link href="/guides/hauteur-cloture-loi-2026" className="content-link">hauteur de clôture et loi 2026</Link>.
        </div>

        {/* ════════════ FAQ ════════════ */}
        {/* ════════════ PARTENAIRE AWIN — Woodstore24 (brise-vue WPC) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers
          Woodstore24 (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens,
          DIY Builder peut percevoir une commission, sans surcoût pour vous. Notre tableau de prix
          reste indépendant et multi-matériaux — voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="cloture" placement="guide" />

        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Combien coûte une clôture au mètre en 2026&nbsp;?</h3>
          <p className="content-body">
            Pose comprise, pour une hauteur d&apos;environ 1,80 m, comptez de 14 à 43 €/ml pour un
            grillage souple, 40 à 130 €/ml pour un grillage rigide, 70 à 110 €/ml pour une clôture en
            pin classe 4, 90 à 280 €/ml pour du composite et 175 à 400 €/ml pour de l&apos;aluminium.
            Le gabion clé en main monte à 250-450 €/ml. Ces fourchettes sont des ordres de grandeur
            TTC à affiner par devis&nbsp;: le terrain, la hauteur et la pose font varier le prix du
            simple au double.
          </p>

          <h3 className="content-h3">Quelle est la clôture la moins chère&nbsp;?</h3>
          <p className="content-body">
            Le grillage simple torsion, de loin&nbsp;: 2 à 8 €/ml en fourniture seule, 14 à 43 €/ml
            posé. Vient ensuite le grillage rigide à panneaux, le plus courant aujourd&apos;hui, à
            partir de 40 €/ml posé en faible hauteur. Pour de l&apos;occultation économique, on ajoute
            des lames PVC ou une canisse au grillage rigide plutôt que de partir sur une clôture
            pleine. La clôture bois en pin autoclave reste l&apos;option pleine la plus abordable.
          </p>

          <h3 className="content-h3">Le prix d&apos;une clôture comprend-il la pose&nbsp;?</h3>
          <p className="content-body">
            Pas toujours, et c&apos;est le piège des comparaisons. Les prix «&nbsp;au mètre&nbsp;»
            affichés en magasin sont souvent en fourniture seule. La pose par un professionnel ajoute
            couramment 15 à 50 €/ml selon le type (15-25 pour un grillage, 25-50 pour du bois, 40-100
            pour de l&apos;aluminium), soit 30 à 50&nbsp;% du devis sur une clôture standard. En posant
            vous-même, vous économisez cette part.
          </p>

          <h3 className="content-h3">Pourquoi une clôture de 2 m coûte-t-elle plus cher qu&apos;une de 1 m&nbsp;?</h3>
          <p className="content-body">
            Passer de 1,20 m à 2 m augmente le prix de 30 à 50&nbsp;% à matériau égal. Une clôture
            plus haute, c&apos;est plus de matière (lames, grillage), des poteaux plus longs scellés
            plus profond, et parfois un soubassement. Sur un grillage rigide, on passe ainsi
            d&apos;environ 40-80 €/ml en hauteur 1 m à 65-130 €/ml en 1,90 m. Vérifiez toujours pour
            quelle hauteur un prix est annoncé avant de comparer.
          </p>

          <h3 className="content-h3">Quels frais oublie-t-on dans un devis de clôture&nbsp;?</h3>
          <p className="content-body">
            Les postes annexes, qui gonflent vite la facture&nbsp;: le scellement des poteaux dans le
            béton (25-40 €/ml), le terrassement si le terrain est en pente (7-10 €/m²), la dépose et
            l&apos;évacuation de l&apos;ancienne clôture (150-300 €), un éventuel soubassement béton
            (38-68 €/ml), et surtout le portail et le portillon. Un portail motorisé posé coûte à lui
            seul 1 500 à 6 500 €, un portillon 150 à 1 900 €.
          </p>

          <h3 className="content-h3">Combien coûte la pose d&apos;une clôture par un professionnel&nbsp;?</h3>
          <p className="content-body">
            Un paysagiste facture 40 à 55 €/h, un clôturier spécialisé jusqu&apos;à 85 €/h. Ramené au
            mètre, la pose seule revient à 15-25 €/ml pour un grillage souple, 25-40 €/ml pour des
            panneaux rigides, 25-50 €/ml pour du bois et 40-100 €/ml pour de l&apos;aluminium ou du fer
            forgé. La main-d&apos;œuvre représente 30 à 50&nbsp;% d&apos;un devis de clôture standard,
            moins sur les matériaux haut de gamme où la fourniture domine.
          </p>

          <h3 className="content-h3">Faut-il une déclaration préalable pour poser une clôture&nbsp;?</h3>
          <p className="content-body">
            Pas partout. La déclaration préalable de travaux n&apos;est obligatoire que si votre
            commune l&apos;a instituée (par délibération, dans le PLU), en secteur protégé ou aux
            abords d&apos;un monument historique. Elle est gratuite, avec une instruction d&apos;un mois
            (deux en secteur protégé)&nbsp;; passé ce délai sans réponse, l&apos;accord est tacite.
            Renseignez-vous en mairie avant de commander, car le PLU peut aussi imposer une hauteur ou
            un aspect.
          </p>

          <h3 className="content-h3">Comment payer sa clôture moins cher&nbsp;?</h3>
          <p className="content-body">
            Trois leviers. Posez vous-même&nbsp;: vous économisez 30 à 50&nbsp;% du devis (la
            main-d&apos;œuvre). Choisissez un grillage rigide avec lames occultantes plutôt qu&apos;une
            clôture pleine&nbsp;: même intimité, prix divisé. Et chiffrez vos quantités exactes avant
            d&apos;acheter, pour ne pas surcommander poteaux et panneaux — c&apos;est ce que fait notre
            simulateur de clôture, qui compare en plus les prix par enseigne.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/cloture">Simulateur de clôture</Link> — quantités exactes et prix matériaux par enseigne pour chiffrer la fourniture au plus juste</li>
            <li><Link href="/guides/cloture">Guide de la clôture bois</Link> — sections, ancrage classe 4 et pose pas à pas</li>
            <li><Link href="/guides/cloture-composite-ou-bois">Clôture composite ou bois</Link> — au-delà du prix : durée de vie, entretien et écologie</li>
            <li><Link href="/guides/hauteur-cloture-loi-2026">Hauteur de clôture et loi 2026</Link> — PLU, mitoyenneté et déclaration préalable</li>
            <li><Link href="/guides/brise-vue-quel-type-choisir">Quel brise-vue choisir pour occulter</Link> — toile, canisse, bois ou composite selon le support, et le surcoût de l&apos;occultation</li>
            <li><Link href="/guides/comparer-devis-travaux">Comparer des devis de travaux</Link> — lire un devis de clôture sans se faire avoir</li>
            <li><Link href="/sources">Sources techniques</Link> — agrégateurs de devis, service-public, normes</li>
          </ul>
        </aside>

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 21 juin 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources techniques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
