import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Clôture composite ou bois ?';
const OG_SUBTITLE = 'Prix · durée de vie · entretien · écologie';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cloture`;

export const metadata = {
  title: 'Clôture composite ou bois : prix, durée de vie 2026',
  description:
    'Composite ou bois pour votre clôture ? Comparatif 2026 : prix au mètre, durée de vie, entretien, écologie et coût réel sur 15 ans. Le bon choix selon votre cas.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/cloture-composite-ou-bois' },
  openGraph: {
    title: 'Clôture composite ou bois : le comparatif 2026 | DIY Builder',
    description:
      'Prix au mètre, durée de vie, entretien, vieillissement et écologie : le comparatif honnête entre une clôture composite (WPC) et une clôture bois, avec le coût réel sur 15 ans.',
    url: 'https://www.diy-builder.fr/guides/cloture-composite-ou-bois',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Clôture composite ou bois — comparatif DIY Builder' }],
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
    { '@type': 'ListItem', position: 4, name: 'Clôture composite ou bois', item: 'https://www.diy-builder.fr/guides/cloture-composite-ou-bois' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Clôture composite ou bois : comparatif prix, durée de vie et entretien (2026)',
  description:
    'Comparatif 2026 entre une clôture composite (WPC) et une clôture bois : prix au mètre, durée de vie, entretien, vieillissement, écologie et coût réel sur 15 ans.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-21',
  dateModified: '2026-06-21',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/cloture-composite-ou-bois',
  image: OG_URL,
  about: ['Clôture composite', 'Clôture bois', 'Bois composite WPC', 'Comparatif matériaux'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Clôture composite ou bois : laquelle est la moins chère ?',
      acceptedAnswer: { '@type': 'Answer', text: 'À l\'achat, le bois. Une clôture en pin autoclave classe 4 revient à 70 à 110 €/ml posée, le douglas à 95 à 150 €/ml, contre 90 à 220 €/ml pour le composite selon la gamme. Mais le bois demande une lasure tous les 3 à 5 ans : sur 15 à 20 ans, l\'écart se resserre. En autoconstruction avec lasure faite soi-même, le bois reste malgré tout le moins cher ; le composite ne repasse devant que si vous payez un professionnel pour entretenir le bois.' },
    },
    {
      '@type': 'Question',
      name: 'Une clôture composite dure-t-elle vraiment 25 ans ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Silvadec, fabricant français de référence, garantit ses lames 25 ans en usage résidentiel (10 ans en usage professionnel). Attention : cette garantie couvre l\'intégrité structurelle — résistance aux champignons, aux insectes, pas de rupture — mais pas la couleur. Une garantie n\'est pas une durée de vie prouvée : c\'est un engagement commercial du fabricant, pas une mesure indépendante. Le composite de qualité est durable, mais 25 ans reste une promesse, pas un constat.' },
    },
    {
      '@type': 'Question',
      name: 'Le composite est-il vraiment sans entretien ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Presque, mais pas tout à fait. Une clôture composite n\'a pas besoin de lasure, de peinture ni de traitement. En revanche, un nettoyage annuel à l\'eau claire et à la brosse douce reste recommandé pour enlever mousses, salissures et traces de rouille des ferrures. « Sans entretien » veut dire « sans lasure », pas « qu\'on ne touche plus jamais ».' },
    },
    {
      '@type': 'Question',
      name: 'La clôture bois demande-t-elle beaucoup d\'entretien ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Une lasure ou un saturateur tous les 3 à 5 ans suffit à conserver la teinte et la protection — plus souvent en exposition forte. Si vous laissez le bois sans traitement, il grise naturellement en 2 à 3 ans : c\'est purement esthétique, le bois garde ses propriétés mécaniques. Le pin autoclave classe 4 et le douglas tiennent 15 ans et plus même non lasurés ; seule la couleur change.' },
    },
    {
      '@type': 'Question',
      name: 'La clôture composite est-elle écologique et recyclable ?',
      acceptedAnswer: { '@type': 'Answer', text: 'C\'est son point faible. Le composite (WPC) mélange fibres de bois et polymère (souvent du polyéthylène) : il est théoriquement recyclable, mais ce mélange est difficile à séparer, si bien qu\'en pratique beaucoup de composites finissent en décharge ou incinérés (source : bois-habitat.be). Certains fabricants comme Silvadec proposent un programme de reprise, mais il n\'existe pas de filière généralisée. Le bois massif, lui, est renouvelable et stocke du carbone — environ une tonne de CO₂ par mètre cube.' },
    },
    {
      '@type': 'Question',
      name: 'Quel bois choisir pour une clôture qui dure ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pour les poteaux enterrés, le pin autoclave classe 4 (norme NF EN 335) est le standard : seule la classe 4 résiste au contact permanent du sol humide. Pour les lames hors sol, le douglas et le mélèze sont naturellement classe 3 et durent 15 à 35 ans selon l\'essence, le mélèze de Sibérie étant le plus résistant des résineux. Attention : douglas et mélèze étant classe 3, ils exigent un traitement ou des pieds de poteau métalliques s\'ils sont enterrés.' },
    },
    {
      '@type': 'Question',
      name: 'La clôture composite chauffe-t-elle au soleil ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Les teintes foncées chauffent plus que les claires sous un soleil direct, comme tout matériau sombre — mais le composite refroidit vite une fois à l\'ombre. Si la clôture est très exposée plein sud, privilégier une teinte claire limite l\'effet. Ce n\'est pas un défaut rédhibitoire pour une clôture, où l\'on ne marche pas pieds nus comme sur une terrasse.' },
    },
    {
      '@type': 'Question',
      name: 'Composite ou bois : que choisir selon mon cas ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Choisissez le bois si vous bricolez, surveillez le budget d\'achat et acceptez une lasure tous les 3 à 5 ans, ou si l\'argument écologique compte. Choisissez le composite si vous voulez zéro lasure pendant 20 ans, êtes prêt à payer plus cher à l\'achat, et n\'avez pas envie de remonter sur une échelle pour entretenir. Le bois gagne en budget pur ; le composite gagne en temps et en tranquillité.' },
    },
  ],
};

export default function ClotureCompositeOuBoisPage() {
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
          <span className="content-breadcrumb-current">Composite ou bois</span>
        </nav>

        <h1 className="content-h1">
          Clôture composite ou bois : comparatif prix, durée de vie et entretien (2026)
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
            src="/images/guides/cloture-composite-ou-bois/hero.png"
            alt="Comparaison côte à côte d'une clôture en lames de bois douglas grisé et d'une clôture en lames composite anthracite dans un jardin résidentiel français en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Composite ou bois pour fermer son jardin ? Le bois coûte moins cher à l&apos;achat — 70 à
          110 €/ml posé en pin classe 4, contre 90 à 220 €/ml en composite selon la gamme — et il stocke du carbone,
          mais il réclame une lasure tous les 3 à 5 ans. Le composite (WPC) demande seulement un
          rinçage annuel et le fabricant Silvadec le garantit 25 ans, au prix d&apos;une part de
          plastique difficile à recycler. Sur 15 à 20 ans, en autoconstruction, le bois entretenu
          reste le moins cher ; le composite ne repasse devant que si vous payez un pro pour
          l&apos;entretien. Ce comparatif tranche poste par poste, sans préférence de marchand.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Prix posé&nbsp;: bois 70 à 150 €/ml (pin à douglas), composite 90 à 220 €/ml selon la gamme.</li>
            <li>Durée de vie&nbsp;: composite 25 ans <em>garantis</em> (Silvadec, structurel)&nbsp;; pin classe 4 15-20 ans, douglas 15-30, mélèze 20-35.</li>
            <li>Entretien&nbsp;: bois = lasure tous les 3 à 5 ans&nbsp;; composite = rinçage annuel, pas de lasure.</li>
            <li>Écologie&nbsp;: le bois stocke ~1 t de CO₂/m³ et se recycle&nbsp;; le composite, mi-plastique, se recycle mal en pratique.</li>
            <li>Coût sur 15-20 ans&nbsp;: en DIY, le bois lasuré soi-même reste moins cher&nbsp;; le composite gagne si l&apos;on valorise le temps ou la pose pro.</li>
          </ul>
        </div>

        {/* CTA 1 */}
        <CTALead projectHref="/cloture" projectLabel="ma clôture bois" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Composite ou bois&nbsp;: la vraie différence de matière</h2>
        <p className="content-snippet">
          Une clôture bois est en bois massif, traité ou naturellement durable. Une clôture
          composite (WPC) est un mélange&nbsp;: environ deux tiers de fibres de bois et un tiers de
          polymère, moulé en lames. Le bois vit, grise et se lasure&nbsp;; le composite ne grise pas,
          ne se lasure jamais, mais contient du plastique et coûte plus cher à l&apos;achat.
        </p>
        <p className="content-body">
          Le bois, tout le monde voit ce que c&apos;est&nbsp;: des lames et des poteaux en pin, en
          douglas ou en mélèze, vissés sur une ossature. Le composite — souvent appelé WPC, pour
          <em> wood-plastic composite</em> — est moins connu. Le fabricant français Silvadec décrit
          ses lames comme deux tiers de farine de bois (pin maritime et épicéa certifiés PEFC) et un
          tiers de polyéthylène haute densité, dont une part recyclée, le tout moulé puis enrobé
          d&apos;une gaine étanche. Les formulations varient d&apos;une marque à l&apos;autre, entre
          la moitié et les deux tiers de bois&nbsp;; le reste est du plastique.
        </p>
        <p className="content-body">
          Cette différence de matière commande tout le reste. Le bois est vivant&nbsp;: il prend la
          teinte de sa lasure, grise s&apos;il n&apos;est pas traité, et se répare lame par lame. Le
          composite est inerte&nbsp;: il ne nourrit ni les champignons ni les insectes, ne demande
          aucune lasure, mais il se dilate avec la chaleur et ne se recycle pas comme un rondin. Pour
          construire une clôture bois de A à Z, le{' '}
          <Link href="/guides/cloture" className="content-link">guide de la clôture bois</Link>{' '}
          détaille les sections, l&apos;ancrage et la pose&nbsp;; ici, on compare les deux matières
          sur ce qui décide vraiment&nbsp;: le prix, la durée, l&apos;entretien et l&apos;empreinte.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">Prix au mètre&nbsp;: combien coûte chaque clôture</h2>
        <p className="content-snippet">
          Posé, le bois reste moins cher que le composite&nbsp;: 70 à 110 €/ml en pin autoclave
          classe 4, 95 à 150 €/ml en douglas, contre 90 à 220 €/ml en composite selon la gamme (agrégateurs de devis,
          2026, hauteur 1,80 m). En matériaux seuls, le pin classe 4 tombe à 35-55 €/ml. La ganivelle
          châtaignier reste l&apos;option la plus économique, dès 15 €/ml.
        </p>
        <p className="content-body">
          Voici les fourchettes relevées pour une clôture standard de 1,80 m, pose comprise sauf
          mention, d&apos;après les agrégateurs de devis 2026, dont{' '}
          <a href="https://www.ootravaux.fr/amenagement-exterieur/cloture-portail/cloture/prix-cloture-bois.html" target="_blank" rel="noopener noreferrer" className="content-link">Ootravaux</a>&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Matériau</th>
              <th>Prix posé (€/ml)</th>
              <th>Repère</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ganivelle châtaignier</td>
              <td>15 – 35 €</td>
              <td>Le moins cher, rustique</td>
            </tr>
            <tr>
              <td>Pin autoclave classe 4</td>
              <td>70 – 110 €</td>
              <td>35-55 €/ml en matériaux seuls</td>
            </tr>
            <tr>
              <td>Douglas</td>
              <td>95 – 150 €</td>
              <td>Plus durable sans traitement</td>
            </tr>
            <tr>
              <td>Composite (WPC)</td>
              <td>90 – 220 €</td>
              <td>Le plus cher en moyenne</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          L&apos;écart d&apos;achat penche pour le bois&nbsp;: à hauteur égale, le composite revient en
          général plus cher que le pin classe 4, parfois jusqu&apos;au double sur le haut de gamme. Pour chiffrer précisément une clôture bois — nombre de poteaux, de
          rails, de lames et de visserie selon vos dimensions exactes, avec comparatif des prix par
          enseigne — notre{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>{' '}
          fait le calcul au poteau près. Côté composite, on raisonne plutôt en kits de brise-vue à
          clipser, vendus au panneau prêt à poser.
        </p>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">Durée de vie et vieillissement&nbsp;: garantie contre réalité</h2>
        <p className="content-snippet">
          Le composite Silvadec est garanti 25 ans en résidentiel (structurel, pas la couleur). Le
          bois dépend de l&apos;essence&nbsp;: 15 à 20 ans pour le pin classe 4, 15 à 30 pour le
          douglas, 20 à 35 pour le mélèze. Différence clé&nbsp;: une garantie est une promesse
          commerciale, une durée de vie un constat. Et tout bois grise s&apos;il n&apos;est pas
          lasuré — sans rien perdre de sa solidité.
        </p>
        <p className="content-body">
          Côté composite, le chiffre qui circule est celui de la garantie&nbsp;:{' '}
          <a href="https://en.silvadec.com/info-library/conditions-our-25-year-warranty" target="_blank" rel="noopener noreferrer" className="content-link">Silvadec garantit ses lames 25 ans</a>{' '}
          en usage résidentiel, 10 ans en usage professionnel. Lisez bien ce que couvre cette
          garantie&nbsp;: l&apos;intégrité structurelle — pas d&apos;attaque de champignons,
          d&apos;insectes, pas de rupture. Elle ne porte pas sur la teinte. Une garantie de 25 ans,
          ce n&apos;est pas une durée de vie mesurée&nbsp;: c&apos;est un engagement du fabricant,
          qui en dit long sur sa confiance, mais qui reste une promesse commerciale.
        </p>
        <p className="content-body">
          Côté bois, la durée dépend de l&apos;essence et du traitement, selon les professionnels du
          secteur&nbsp;: le pin autoclave classe 4 tient 15 à 20 ans avec une lasure régulière, le
          douglas 15 à 30 ans, le mélèze de Sibérie jusqu&apos;à 35 ans — c&apos;est le plus
          résistant des résineux. Un point qu&apos;on oublie souvent&nbsp;: même laissé sans
          traitement, un bois de clôture ne s&apos;effondre pas. Il grise en deux à trois ans, et
          c&apos;est tout&nbsp;: le grisaillement est un phénomène de surface, esthétique, qui
          n&apos;enlève rien à la solidité mécanique. Beaucoup de clôtures «&nbsp;fatiguées&nbsp;» le
          sont à l&apos;œil, pas à la structure.
        </p>
        <p className="content-body">
          Le composite vieillit autrement. Il ne grise pas, mais il s&apos;éclaircit un peu la
          première année sous l&apos;effet des UV — un «&nbsp;bronzage&nbsp;» inverse qui se
          stabilise ensuite. Et les teintes foncées chauffent davantage au soleil que les claires,
          sans que ce soit gênant sur une clôture, où l&apos;on ne marche pas pieds nus. Le vrai
          départage n&apos;est pas là&nbsp;: il est dans l&apos;entretien.
        </p>

        {/* CTA milieu */}
        <CTALead projectHref="/cloture" projectLabel="le budget de ma clôture bois" />

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">Entretien&nbsp;: lasure récurrente contre rinçage annuel</h2>
        <p className="content-snippet">
          C&apos;est l&apos;argument numéro un du composite&nbsp;: aucune lasure, jamais. Un rinçage
          annuel à l&apos;eau suffit. Le bois, lui, demande une lasure ou un saturateur tous les 3 à
          5 ans pour garder sa teinte — sinon il grise. Sur vingt ans, ça fait quatre à six passages
          d&apos;entretien pour le bois, contre zéro pour le composite. C&apos;est du temps, et
          parfois de l&apos;argent.
        </p>
        <p className="content-body">
          Une clôture composite ne se lasure pas, ne se peint pas, ne se traite pas. La seule chose à
          prévoir est un nettoyage à l&apos;eau claire et à la brosse douce une fois par an, pour
          enlever mousses et salissures — «&nbsp;sans entretien&nbsp;» veut dire «&nbsp;sans
          lasure&nbsp;», pas «&nbsp;qu&apos;on ne touche plus jamais&nbsp;». C&apos;est son vrai
          atout&nbsp;: pour qui n&apos;a ni l&apos;envie ni le temps de remonter sur une échelle tous
          les trois ans, le calcul est vite fait.
        </p>
        <p className="content-body">
          Le bois, lui, vit avec son entretien. Une lasure ou un saturateur tous les 3 à 5 ans — plus
          souvent en exposition plein sud ou bord de mer — conserve la teinte et la protection. Ce
          n&apos;est pas une corvée énorme sur une clôture de jardin, mais c&apos;est récurrent, et
          ça pèse dans le calcul du coût réel, qu&apos;on détaille juste après. Le hic, c&apos;est
          que beaucoup de bricoleurs sous-estiment cette régularité&nbsp;: une clôture qu&apos;on
          oublie de lasurer pendant huit ans grise, et la rattraper demande un ponçage avant de
          relasurer.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Le coût réel sur 15 ans&nbsp;: le calcul honnête</h2>
        <p className="content-snippet">
          Le surcoût d&apos;achat du composite (de quelques centaines d&apos;euros à 800 € pour 10 ml selon la gamme) doit
          être comparé au coût d&apos;entretien du bois. En lasurant soi-même, six passages sur 18 ans
          coûtent environ 430 € de produit&nbsp;: le bois reste moins cher. Si vous faites lasurer par
          un pro (15 à 50 €/m²), le calcul s&apos;inverse vite. Il n&apos;y a pas de seuil unique&nbsp;:
          tout dépend de qui tient le pinceau.
        </p>
        <p className="content-body">
          Prenons une clôture de 10 mètres linéaires, 1,80 m de haut — environ 18 m² visibles, donc
          près de 36 m² à lasurer en comptant les deux faces. Une lasure couvre de l&apos;ordre de
          15 m² par litre et par couche, à environ 15 €/L&nbsp;: deux couches reviennent à peu près à
          70 € de produit par passage. À raison d&apos;un entretien tous les 3 ans sur 18 ans, soit
          six passages, on arrive autour de 430 € de lasure — en faisant le travail soi-même, hors
          temps passé.
        </p>
        <p className="content-body">
          En face, le surcoût d&apos;achat du composite sur ces 10 ml varie fortement selon la gamme&nbsp;:
          de quelques centaines d&apos;euros pour de l&apos;entrée de gamme à 800 € ou plus pour du haut
          de gamme. Conclusion en autoconstruction pure&nbsp;: tant que vous lasurez vous-même, le bois
          reste au moins aussi économique que le composite sur 15 à 20 ans, parce que la lasure DIY
          coûte peu en argent. Le composite ne repasse devant que dans deux cas&nbsp;:
          si vous valorisez votre temps (une lasure par un professionnel coûte 15 à 50 €/m², ce qui
          fait grimper l&apos;entretien à plusieurs centaines d&apos;euros par cycle et inverse vite
          le calcul), ou si vous gardez la maison plus de vingt ans, durée sur laquelle le composite
          amortit son achat. Méfiez-vous donc des comparatifs qui annoncent un «&nbsp;seuil&nbsp;» tout
          fait&nbsp;: il dépend entièrement de qui tient le pinceau et de combien d&apos;années vous
          comptez rester.
        </p>

        {/* ════════════ H2.6 ════════════ */}
        {/* ════════════ PARTENAIRE AWIN — Woodstore24 (brise-vue WPC) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers
          Woodstore24 (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens,
          DIY Builder peut percevoir une commission, sans surcoût pour vous. Notre comparatif
          reste indépendant — nous ne recommandons pas le composite plutôt que le bois, nous
          donnons les chiffres pour que vous décidiez. Voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="cloture" placement="guide" />

        <h2 className="content-h2">Écologie&nbsp;: renouvelable contre «&nbsp;recyclable&nbsp;»</h2>
        <p className="content-snippet">
          Sur l&apos;empreinte, le bois l&apos;emporte nettement. Un mètre cube de bois stocke environ
          une tonne de CO₂ et provient d&apos;une ressource renouvelable (labels PEFC, FSC). Le
          composite, mi-plastique, est annoncé «&nbsp;recyclable&nbsp;» mais son mélange bois-polymère
          se sépare mal&nbsp;: en pratique, beaucoup finissent en décharge ou incinérés. C&apos;est le
          point faible du composite.
        </p>
        <p className="content-body">
          C&apos;est sans doute le poste où l&apos;écart est le plus franc. Le bois est un puits de
          carbone&nbsp;: selon la filière bois française, un mètre cube de bois stocke de l&apos;ordre
          d&apos;une tonne de CO₂, et une clôture issue de forêts gérées durablement (labels PEFC ou
          FSC) reste une ressource renouvelable. Les études de la{' '}
          <a href="https://www.fcba.fr/ressources/la-foret-en-2050-projection-des-disponibilites-en-bois-et-des-stocks-et-flux-de-carbone-du-secteur-forestier-francais/" target="_blank" rel="noopener noreferrer" className="content-link">FCBA</a>{' '}
          et de l&apos;IGN documentent ce rôle de stockage du secteur forêt-bois.
        </p>
        <p className="content-body">
          Le composite est plus délicat à défendre sur ce terrain. Sa part de polymère vient de
          ressources fossiles, et surtout, le mélange intime de fibres de bois et de plastique le rend
          difficile à recycler&nbsp;: il est «&nbsp;théoriquement recyclable&nbsp;», mais la séparation
          des deux matières est complexe, si bien qu&apos;en pratique une grande partie des composites
          finit en décharge ou en incinération (constat de{' '}
          <a href="https://www.bois-habitat.be/le-bois-composite-grande-polyvalence-et-limites-environnementales/" target="_blank" rel="noopener noreferrer" className="content-link">bois-habitat.be</a>).
          Certains fabricants, dont Silvadec, ont monté un programme de reprise des lames en fin de
          vie, et l&apos;ADEME publie un guide d&apos;écoconception des composites&nbsp;: la
          problématique est réelle et reconnue. Autrement dit, le «&nbsp;recyclable&nbsp;» affiché sur
          la fiche produit est vrai sur le papier, beaucoup moins dans la filière. Si l&apos;empreinte
          compte pour vous, le bois certifié garde une longueur d&apos;avance.
        </p>

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Clôture composite ou bois&nbsp;: laquelle est la moins chère&nbsp;?</h3>
          <p className="content-body">
            À l&apos;achat, le bois. Une clôture en pin autoclave classe 4 revient à 70 à 110 €/ml
            posée, le douglas à 95 à 150 €/ml, contre 90 à 220 €/ml pour le composite selon la gamme.
            Mais le bois demande une lasure tous les 3 à 5 ans&nbsp;: sur 15 à 20
            ans, l&apos;écart se resserre. En autoconstruction avec lasure faite soi-même, le bois
            reste malgré tout le moins cher&nbsp;; le composite ne repasse devant que si vous payez un
            professionnel pour entretenir le bois.
          </p>

          <h3 className="content-h3">Une clôture composite dure-t-elle vraiment 25 ans&nbsp;?</h3>
          <p className="content-body">
            Silvadec, fabricant français de référence, garantit ses lames 25 ans en usage résidentiel
            (10 ans en usage professionnel). Attention&nbsp;: cette garantie couvre l&apos;intégrité
            structurelle — résistance aux champignons, aux insectes, pas de rupture — mais pas la
            couleur. Une garantie n&apos;est pas une durée de vie prouvée&nbsp;: c&apos;est un
            engagement commercial du fabricant, pas une mesure indépendante. Le composite de qualité
            est durable, mais 25 ans reste une promesse, pas un constat.
          </p>

          <h3 className="content-h3">Le composite est-il vraiment sans entretien&nbsp;?</h3>
          <p className="content-body">
            Presque, mais pas tout à fait. Une clôture composite n&apos;a pas besoin de lasure, de
            peinture ni de traitement. En revanche, un nettoyage annuel à l&apos;eau claire et à la
            brosse douce reste recommandé pour enlever mousses, salissures et traces de rouille des
            ferrures. «&nbsp;Sans entretien&nbsp;» veut dire «&nbsp;sans lasure&nbsp;», pas
            «&nbsp;qu&apos;on ne touche plus jamais&nbsp;».
          </p>

          <h3 className="content-h3">La clôture bois demande-t-elle beaucoup d&apos;entretien&nbsp;?</h3>
          <p className="content-body">
            Une lasure ou un saturateur tous les 3 à 5 ans suffit à conserver la teinte et la
            protection — plus souvent en exposition forte. Si vous laissez le bois sans traitement, il
            grise naturellement en 2 à 3 ans&nbsp;: c&apos;est purement esthétique, le bois garde ses
            propriétés mécaniques. Le pin autoclave classe 4 et le douglas tiennent 15 ans et plus
            même non lasurés&nbsp;; seule la couleur change.
          </p>

          <h3 className="content-h3">La clôture composite est-elle écologique et recyclable&nbsp;?</h3>
          <p className="content-body">
            C&apos;est son point faible. Le composite (WPC) mélange fibres de bois et polymère
            (souvent du polyéthylène)&nbsp;: il est théoriquement recyclable, mais ce mélange est
            difficile à séparer, si bien qu&apos;en pratique beaucoup de composites finissent en
            décharge ou incinérés (source&nbsp;: bois-habitat.be). Certains fabricants comme Silvadec
            proposent un programme de reprise, mais il n&apos;existe pas de filière généralisée. Le
            bois massif, lui, est renouvelable et stocke du carbone — environ une tonne de CO₂ par
            mètre cube.
          </p>

          <h3 className="content-h3">Quel bois choisir pour une clôture qui dure&nbsp;?</h3>
          <p className="content-body">
            Pour les poteaux enterrés, le pin autoclave classe 4 (norme NF EN 335) est le
            standard&nbsp;: seule la classe 4 résiste au contact permanent du sol humide. Pour les
            lames hors sol, le douglas et le mélèze sont naturellement classe 3 et durent 15 à 35 ans
            selon l&apos;essence, le mélèze de Sibérie étant le plus résistant des résineux.
            Attention&nbsp;: douglas et mélèze étant classe 3, ils exigent un traitement ou des pieds
            de poteau métalliques s&apos;ils sont enterrés.
          </p>

          <h3 className="content-h3">La clôture composite chauffe-t-elle au soleil&nbsp;?</h3>
          <p className="content-body">
            Les teintes foncées chauffent plus que les claires sous un soleil direct, comme tout
            matériau sombre — mais le composite refroidit vite une fois à l&apos;ombre. Si la clôture
            est très exposée plein sud, privilégier une teinte claire limite l&apos;effet. Ce
            n&apos;est pas un défaut rédhibitoire pour une clôture, où l&apos;on ne marche pas pieds
            nus comme sur une terrasse.
          </p>

          <h3 className="content-h3">Composite ou bois&nbsp;: que choisir selon mon cas&nbsp;?</h3>
          <p className="content-body">
            Choisissez le bois si vous bricolez, surveillez le budget d&apos;achat et acceptez une
            lasure tous les 3 à 5 ans, ou si l&apos;argument écologique compte. Choisissez le
            composite si vous voulez zéro lasure pendant 20 ans, êtes prêt à payer plus cher à
            l&apos;achat, et n&apos;avez pas envie de remonter sur une échelle pour entretenir. Le bois
            gagne en budget pur&nbsp;; le composite gagne en temps et en tranquillité.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/cloture">Guide de la clôture bois</Link> — sections, ancrage classe 4, pose pas à pas et budget de la structure</li>
            <li><Link href="/cloture">Simulateur de clôture</Link> — quantitatifs et prix par enseigne pour chiffrer une clôture bois au poteau près</li>
            <li><Link href="/guides/cloture-solaire-brise-vue-photovoltaique-2026">Clôture solaire : le brise-vue photovoltaïque</Link> — la troisième voie, quand la clôture produit aussi de l&apos;électricité</li>
            <li><Link href="/guides/hauteur-cloture-loi-2026">Hauteur de clôture et loi 2026</Link> — PLU, mitoyenneté et déclaration avant de poser, quel que soit le matériau</li>
            <li><Link href="/guides/comparer-devis-travaux">Comparer des devis de clôture</Link> — faire chiffrer la pose par un pro et lire le devis sans se faire avoir</li>
            <li><Link href="/guides/terrasse-composite-ou-bois">Terrasse composite ou bois</Link> — le même match de matières, côté terrasse cette fois</li>
            <li><Link href="/guides/prix-cloture-au-metre-2026">Prix d&apos;une clôture au mètre 2026</Link> — combien coûte chaque matériau, tous types confondus, et les postes cachés</li>
            <li><Link href="/sources">Sources techniques</Link> — NF EN 335, FCBA, ADEME, Silvadec, Ootravaux</li>
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
