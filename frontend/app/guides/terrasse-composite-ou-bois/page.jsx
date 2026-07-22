import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import PullQuote from '@/components/content/PullQuote';
import Callout from '@/components/content/Callout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';
import BomAffiliateBlock from '@/components/content/BomAffiliateBlock';

const OG_TITLE = 'Terrasse composite ou bois ?';
const OG_SUBTITLE = 'Prix au m² · durée de vie · entretien · glissance';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=terrasse`;

export const metadata = {
  title: 'Terrasse composite ou bois : prix au m², durée de vie 2026',
  description:
    'Composite ou bois pour votre terrasse ? Comparatif 2026 : prix au m², durée de vie, entretien, glissance, chaleur et coût réel sur 15 ans. Le bon choix selon votre cas.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/terrasse-composite-ou-bois' },
  openGraph: {
    title: 'Terrasse composite ou bois : le comparatif 2026 | DIY Builder',
    description:
      'Prix au m², durée de vie, entretien, glissance et chaleur pieds nus : le comparatif honnête entre une terrasse composite (WPC) et une terrasse bois, coût réel sur 15 ans inclus.',
    url: 'https://www.diy-builder.fr/guides/terrasse-composite-ou-bois',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Terrasse composite ou bois — comparatif DIY Builder' }],
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
    { '@type': 'ListItem', position: 3, name: 'Guide terrasse', item: 'https://www.diy-builder.fr/guides/terrasse' },
    { '@type': 'ListItem', position: 4, name: 'Terrasse composite ou bois', item: 'https://www.diy-builder.fr/guides/terrasse-composite-ou-bois' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Terrasse composite ou bois : comparatif prix au m², durée de vie et entretien (2026)',
  description:
    'Comparatif 2026 entre une terrasse composite (WPC) et une terrasse bois : prix au m², durée de vie, entretien, glissance, chaleur pieds nus, écologie et coût réel sur 15 ans.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-21',
  dateModified: '2026-06-21',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/terrasse-composite-ou-bois',
  image: OG_URL,
  about: ['Terrasse composite', 'Terrasse bois', 'Lame composite WPC', 'Comparatif matériaux'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Terrasse composite ou bois : laquelle est la moins chère ?',
      acceptedAnswer: { '@type': 'Answer', text: 'En fourniture, le bois résineux. Comptez 43 à 53 €/m² en pin autoclave classe 4, 53 à 65 €/m² en douglas, contre 75 à 90 €/m² pour un composite milieu de gamme (prix relevés en grande surface, 2026). Les lames composite creuses d\'entrée de gamme descendent vers 25 à 40 €/m², les lames pleines premium montent à 120 €/m². L\'ipé, lui, démarre à 103 €/m². Sur la durée, l\'écart se resserre car le bois demande un saturateur régulier.' },
    },
    {
      '@type': 'Question',
      name: 'Une terrasse composite est-elle vraiment sans entretien ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Presque. Une lame composite ne se sature pas, ne se ponce pas : un nettoyage à l\'eau savonneuse et à la brosse une à deux fois par an suffit. Une terrasse bois, elle, réclame un saturateur tous les 1 à 2 ans pour garder sa teinte, faute de quoi elle grise. Le composite n\'élimine pas l\'entretien, il supprime le saturateur — c\'est son vrai argument.' },
    },
    {
      '@type': 'Question',
      name: 'La terrasse composite chauffe-t-elle au soleil ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, davantage que le bois, surtout en teinte foncée et en plein soleil l\'été : marcher pieds nus peut devenir inconfortable. Le fabricant Silvadec le reconnaît lui-même en classant ce confort « bon » et non « très bon ». Le bois reste plus tempéré sous le pied. Pour une terrasse très exposée plein sud, une teinte composite claire limite nettement l\'effet.' },
    },
    {
      '@type': 'Question',
      name: 'La terrasse composite est-elle glissante ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Les lames composite de qualité rainurées sont classées R11 à R13 (chaussé) et classe C (pieds nus), le niveau des abords de piscine, selon le fabricant Silvadec — souvent meilleur qu\'une lame bois lisse. Mais c\'est une donnée fabricant : une lame composite premier prix, lisse et non rainurée, glisse autant qu\'un bois mouillé. Le bois, lui, devient glissant quand des algues s\'installent à l\'ombre.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la durée de vie d\'une terrasse composite contre une terrasse bois ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le composite Silvadec est garanti 25 ans en résidentiel (structurel, pas la couleur), pour une durée d\'usage estimée 25 à 30 ans. Côté bois : le pin classe 4 tient 15 à 25 ans, le douglas environ 15 ans, l\'ipé 25 à 40 ans. La durée réelle dépend fortement de l\'exposition (nord/sud, bord de mer) et de l\'entretien. Rappel : une garantie est un engagement commercial, pas une durée de vie mesurée.' },
    },
    {
      '@type': 'Question',
      name: 'La terrasse composite est-elle écologique et recyclable ?',
      acceptedAnswer: { '@type': 'Answer', text: 'C\'est son point faible. La lame composite mêle fibres de bois et polymère : difficile à séparer, elle se recycle mal en pratique. L\'ADEME lui consacre une fiche déchets dédiée — la reprise existe mais le transport reste à votre charge, et la filière est encore jeune. Le bois massif, lui, est renouvelable, stocke environ une tonne de CO₂ par mètre cube et se recycle plus simplement (labels PEFC, FSC).' },
    },
    {
      '@type': 'Question',
      name: 'Peut-on encore poser une terrasse en ipé en 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, mais c\'est plus encadré. L\'ipé et le cumaru ont été inscrits à l\'annexe II de la CITES, la convention qui réglemente le commerce des espèces menacées : leur achat impose désormais une traçabilité renforcée. Concrètement, privilégiez un bois exotique certifié FSC, avec des justificatifs d\'origine. C\'est l\'argument qui pousse de plus en plus de terrasses vers le composite ou les résineux locaux.' },
    },
    {
      '@type': 'Question',
      name: 'Composite ou bois : que choisir pour ma terrasse ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Choisissez le bois si vous visez le budget d\'achat le plus bas (pin ou douglas), acceptez un saturateur tous les 1 à 2 ans, et préférez un sol tempéré sous le pied. Choisissez le composite si vous voulez zéro saturateur pendant 20 ans et une bonne adhérence rainurée, en acceptant qu\'il chauffe plus et coûte plus à l\'achat. Pour un rendu noble sans déforestation, un résineux saturé foncé ou un composite imitation bois sont les compromis du moment.' },
    },
  ],
};

export default function TerrasseCompositeOuBoisPage() {
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
          <span className="content-breadcrumb-current">Composite ou bois</span>
        </nav>

        <h1 className="content-h1">
          Terrasse composite ou bois : comparatif prix au m², durée de vie et entretien (2026)
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
            src="/images/guides/terrasse-composite-ou-bois/hero.png"
            alt="Terrasse de jardin moitié en lames de bois douglas saturé, moitié en lames composite gris anthracite, vue rapprochée du raccord, dans un jardin résidentiel français en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Composite ou bois pour une terrasse ? En fourniture, le bois résineux reste plus
          abordable — 43 à 53 €/m² en pin classe 4, 53 à 65 €/m² en douglas — contre 75 à 90 €/m²
          pour un composite milieu de gamme. Le composite ne se sature jamais et offre une bonne
          adhérence rainurée, mais il chauffe davantage pieds nus&nbsp;; le bois est plus tempéré
          sous le pied, mais réclame un saturateur tous les 1 à 2 ans. Côté exotiques, l&apos;ipé dure
          longtemps mais relève désormais de la CITES. Sur 15 à 20 ans, le calcul dépend surtout de
          votre rapport au pinceau. Ce comparatif tranche poste par poste, chiffres à l&apos;appui.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Prix fourniture&nbsp;: pin 43-53 €/m², douglas 53-65 €/m², composite milieu de gamme 75-90 €/m², ipé 103-125 €/m².</li>
            <li>Entretien&nbsp;: bois = saturateur tous les 1 à 2 ans&nbsp;; composite = nettoyage seul, pas de saturateur.</li>
            <li>Glissance&nbsp;: composite rainuré R11-R13 / classe C (donnée Silvadec)&nbsp;; lame lisse premier prix glisse mouillée.</li>
            <li>Chaleur&nbsp;: le composite foncé chauffe plus pieds nus que le bois — préférez les teintes claires plein sud.</li>
            <li>Écologie&nbsp;: bois renouvelable (~1 t CO₂/m³, PEFC/FSC)&nbsp;; composite recyclé difficilement&nbsp;; ipé/cumaru désormais sous CITES.</li>
          </ul>
        </div>

        {/* CTA 1 */}
        <CTALead projectHref="/calculateur" projectLabel="ma terrasse bois" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Composite ou bois&nbsp;: la vraie différence de matière</h2>
        <p className="content-snippet">
          Une terrasse bois est en bois massif&nbsp;: résineux traité (pin classe 4, douglas) ou
          exotique dense (ipé, cumaru). Une terrasse composite (WPC) est un mélange moulé de fibres
          de bois et de polymère, environ deux tiers de bois pour un tiers de plastique chez
          Silvadec. Le bois se sature et grise&nbsp;; le composite ne grise pas et ne se sature
          jamais, mais il chauffe davantage et se recycle mal.
        </p>
        <p className="content-body">
          Côté bois, trois familles. Les résineux traités — pin maritime autoclave classe 4, douglas
          — sont le standard accessible. Les exotiques — ipé, cumaru, garapa — sont des bois denses
          naturellement très durables, mais chers et désormais encadrés (on y revient). Côté
          composite, on parle de WPC, pour <em>wood-plastic composite</em>&nbsp;: le fabricant
          français Silvadec annonce deux tiers de farine de bois certifiée PEFC pour un tiers de
          polyéthylène, moulés en lames. Les formulations varient d&apos;une marque à l&apos;autre,
          de la moitié aux deux tiers de bois&nbsp;; le reste est du plastique.
        </p>
        <p className="content-body">
          Cette différence commande tout le reste, et sur une terrasse — contrairement à une clôture —
          deux critères pèsent lourd&nbsp;: on y marche, souvent pieds nus, et l&apos;été. La
          glissance et la chaleur sous le pied deviennent décisives, autant que le prix et la durée.
          Pour construire la structure qui portera ces lames — lambourdes, plots, entraxes — notre{' '}
          <Link href="/guides/terrasse" className="content-link">guide de la terrasse bois</Link>{' '}
          déroule la pose&nbsp;; ici, on compare les deux matières de surface sur ce qui décide
          vraiment.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">Prix au m²&nbsp;: combien coûte chaque terrasse</h2>
        <p className="content-snippet">
          En fourniture, le pin classe 4 revient à 43-53 €/m², le douglas à 53-65 €/m², le composite
          milieu de gamme à 75-90 €/m² et l&apos;ipé à 103-125 €/m² (relevés en grande surface, 2026).
          Le composite couvre en réalité une amplitude énorme&nbsp;: 25-40 €/m² pour des lames creuses
          d&apos;entrée de gamme, jusqu&apos;à 120 €/m² pour des lames pleines premium. Ajoutez 40 à
          60 €/m² pour une pose par un artisan.
        </p>
        <p className="content-body">
          Voici les fourchettes de fourniture relevées dans nos suivis de prix en grande surface de
          bricolage (mai-juin 2026), reprises de notre{' '}
          <Link href="/guides/prix-terrasse-bois-m2-2026" className="content-link">analyse détaillée du prix d&apos;une terrasse bois au m²</Link>&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Matériau</th>
              <th>Fourniture (€/m²)</th>
              <th>Repère</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pin autoclave classe 4</td>
              <td>43 – 53 €</td>
              <td>Le plus économique</td>
            </tr>
            <tr>
              <td>Douglas</td>
              <td>53 – 65 €</td>
              <td>Résineux durable, local</td>
            </tr>
            <tr>
              <td>Composite (WPC)</td>
              <td>75 – 90 €</td>
              <td>Milieu de gamme (25-120 € toute gamme)</td>
            </tr>
            <tr>
              <td>Ipé (exotique)</td>
              <td>103 – 125 €</td>
              <td>Le plus durable, le plus cher</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Deux pièges de lecture. D&apos;abord, le composite n&apos;a pas un prix mais une
          gamme&nbsp;: une lame creuse alvéolaire premier prix n&apos;a rien à voir avec une lame
          pleine coextrudée, d&apos;où l&apos;écart de 25 à 120 €/m². Le «&nbsp;75-90 €&nbsp;» retenu
          ici correspond au milieu de gamme, celui qu&apos;on conseille pour durer. Ensuite, ces prix
          sont en fourniture seule&nbsp;: la pose par un artisan ajoute couramment 40 à 60 €/m² pour
          du résineux, davantage pour l&apos;exotique et le composite. Pour chiffrer votre surface
          exacte selon l&apos;essence, notre{' '}
          <Link href="/calculateur" className="content-link">calculateur de terrasse</Link>{' '}
          fait le détail lame par lame.
        </p>

        {/* CTA milieu */}
        <CTALead projectHref="/calculateur" projectLabel="le budget de ma terrasse" />

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">Durée de vie et entretien&nbsp;: saturateur contre rinçage</h2>
        <p className="content-snippet">
          Le composite Silvadec est garanti 25 ans en résidentiel (structurel, pas la couleur), pour
          une durée d&apos;usage estimée 25 à 30 ans, sans saturateur. Le bois dépend de
          l&apos;essence&nbsp;: pin 15-25 ans, douglas ~15 ans, ipé 25-40 ans — avec un saturateur
          tous les 1 à 2 ans pour garder la teinte. Sans entretien, tout bois grise, sans rien perdre
          de sa solidité.
        </p>
        <p className="content-body">
          Côté composite, le chiffre mis en avant est la garantie&nbsp;: Silvadec garantit ses lames
          25 ans en usage résidentiel (10 ans en professionnel), sur l&apos;intégrité structurelle —
          champignons, insectes, rupture — mais pas sur la couleur. Comme pour une clôture, une
          garantie n&apos;est pas une durée de vie mesurée&nbsp;: c&apos;est un engagement commercial,
          même s&apos;il traduit une vraie confiance. En usage, on parle de 25 à 30 ans. Et le
          composite vieillit&nbsp;: le fabricant documente lui-même un «&nbsp;bronzage&nbsp;» de la
          teinte aux premières expositions UV, qui se stabilise en quelques semaines. Il ne grise pas,
          mais il évolue les premiers temps.
        </p>
        <p className="content-body">
          Côté bois, la durée dépend de l&apos;essence, selon les professionnels du secteur&nbsp;: le
          pin autoclave classe 4 tient 15 à 25 ans, le douglas autour de 15 ans, l&apos;ipé 25 à 40
          ans. L&apos;exposition pèse autant que l&apos;essence&nbsp;: une terrasse plein nord, à
          l&apos;ombre et humide, vieillit plus vite qu&apos;une terrasse ventilée et ensoleillée. Le
          vrai partage se joue sur l&apos;entretien&nbsp;: pour garder la teinte d&apos;un bois, il
          faut passer un saturateur tous les 1 à 2 ans. Si on l&apos;oublie, le bois grise — un
          phénomène de surface, esthétique, qui n&apos;enlève rien à la solidité. Beaucoup de
          propriétaires finissent d&apos;ailleurs par accepter ce gris argenté et arrêter le
          saturateur&nbsp;; c&apos;est un choix légitime, qui change le calcul du coût réel.
        </p>

        <PullQuote>
          Pour garder sa teinte, le bois réclame un saturateur <strong>tous les 1 à 2 ans</strong>&nbsp;; le composite, jamais.
        </PullQuote>

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">Glissance et chaleur&nbsp;: les critères propres à la terrasse</h2>
        <p className="content-snippet">
          C&apos;est ici que se joue la différence qu&apos;on oublie dans les comparatifs de prix. Une
          lame composite de qualité, rainurée, est classée R11 à R13 et classe C pieds nus — niveau
          abords de piscine — mais elle chauffe plus au soleil. Le bois est plus tempéré sous le pied,
          mais glisse quand des algues s&apos;installent à l&apos;ombre. Aucun n&apos;est parfait sur
          les deux tableaux.
        </p>
        <p className="content-body">
          La glissance d&apos;abord. Le fabricant Silvadec classe ses lames de qualité R11 à R13 en
          marche chaussée (norme DIN 51130) et classe C pieds nus (DIN 51097), soit le niveau exigé
          aux abords de piscine, performance maintenue sous la pluie. C&apos;est un vrai atout — mais
          c&apos;est une donnée fabricant, valable pour des lames rainurées de gamme&nbsp;: une lame
          composite premier prix, lisse, glisse autant qu&apos;un bois mouillé. Le bois brut, lui,
          n&apos;affiche pas de classement R systématique&nbsp;; il devient glissant surtout quand des
          algues se développent en zone ombragée et humide, ce qu&apos;un nettoyage anti-mousse et une
          face rainurée corrigent.
        </p>
        <p className="content-body">
          La chaleur ensuite, le point où le composite paie sa part de plastique. Une lame composite,
          surtout en teinte foncée, chauffe davantage au soleil qu&apos;un bois&nbsp;: marcher pieds
          nus en plein été peut devenir inconfortable. Silvadec le reconnaît à demi-mot, en notant ce
          confort «&nbsp;bon&nbsp;» et non «&nbsp;très bon&nbsp;» sur sa propre fiche. Le bois reste
          plus tempéré sous le pied. Le hic, c&apos;est que ce critère est invisible en magasin et se
          découvre le premier mois de juillet&nbsp;: si votre terrasse est plein sud et que vous y
          marchez pieds nus, une teinte composite claire — ou tout simplement du bois — vous évitera
          la mauvaise surprise.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Le coût réel sur 15-20 ans&nbsp;: le calcul honnête</h2>
        <p className="content-snippet">
          Sur 20 ans, le pin saturé tous les 2 ans revient autour de 95-105 €/m² (produit, hors
          main-d&apos;œuvre)&nbsp;; le composite milieu de gamme reste vers 75-95 €/m², nettoyage
          compris. Résultat&nbsp;: le composite devient compétitif face au pin dès qu&apos;on valorise
          le saturateur et le temps passé — mais si vous acceptez le gris et ne saturez jamais, le pin
          reste le moins-disant. Pas de seuil unique.
        </p>
        <p className="content-body">
          Posons les hypothèses, sourcées. Un saturateur coûte de l&apos;ordre de 15 à 25 €/L et
          couvre 8 à 10 m² par litre et par couche&nbsp;; en deux couches, comptez environ 0,2 L/m²
          par passage, soit à peu près 4 à 6 €/m² de produit. À raison d&apos;un passage tous les 2
          ans sur 20 ans, le pin cumule autour de 50 €/m² d&apos;entretien, en faisant le travail
          soi-même&nbsp;: ajouté à l&apos;achat (43-53 €/m²), on arrive vers 95 à 105 €/m² sur la
          durée, hors temps passé. Le composite milieu de gamme, lui, reste autour de 75 à 95 €/m²,
          le nettoyage étant négligeable, et sans remplacement sur la période.
        </p>
        <p className="content-body">
          La conclusion est nuancée, et c&apos;est normal. Le composite milieu de gamme devient
          compétitif face au pin sur 15 à 20 ans, dès lors qu&apos;on compte le coût récurrent du
          saturateur et la valeur de son temps. Il reste moins cher que l&apos;ipé à l&apos;achat. Mais
          si vous êtes du genre à laisser griser votre terrasse et à poser vous-même, le pin classe 4
          demeure imbattable au budget. Méfiez-vous donc des comparatifs qui tranchent par un
          «&nbsp;seuil&nbsp;»&nbsp;: tout dépend de votre tolérance au gris, de qui pose, et de qui
          tient le pinceau pendant vingt ans.
        </p>

        {/* ════════════ H2.6 ════════════ */}
        {/* ════════════ PARTENAIRE AWIN — Woodstore24 (lames terrasse WPC) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers
          Woodstore24 (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens,
          DIY Builder peut percevoir une commission, sans surcoût pour vous. Notre comparatif
          reste indépendant — nous ne recommandons pas le composite plutôt que le bois, nous
          donnons les chiffres pour que vous décidiez. Voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="terrasse-composite" placement="guide" />

        <BomAffiliateBlock module="terrasse" placement="guide" />

        <h2 className="content-h2">Écologie&nbsp;: renouvelable, recyclable… et le cas des exotiques</h2>
        <p className="content-snippet">
          Le bois local l&apos;emporte&nbsp;: renouvelable, il stocke environ une tonne de CO₂ par
          mètre cube (labels PEFC, FSC). Le composite, mi-plastique, se recycle mal — l&apos;ADEME lui
          consacre une fiche déchets dédiée. Quant aux exotiques comme l&apos;ipé, leur inscription à
          la CITES impose désormais une traçabilité&nbsp;: à n&apos;acheter que certifiés FSC.
        </p>
        <p className="content-body">
          Le bois résineux local est le meilleur élève&nbsp;: selon la filière bois française, un
          mètre cube stocke de l&apos;ordre d&apos;une tonne de CO₂, et une terrasse en pin ou douglas
          certifié PEFC ou FSC reste une ressource renouvelable, recyclable en fin de vie. Le
          composite est plus délicat&nbsp;: sa part de polymère vient du pétrole, et le mélange intime
          bois-plastique se sépare mal. L&apos;ADEME lui consacre une{' '}
          <a href="https://quefairedemesdechets.ademe.fr/dechet/lame-de-terrasse-composite/" target="_blank" rel="noopener noreferrer" className="content-link">fiche déchets «&nbsp;lame de terrasse composite&nbsp;»</a>{' '}
          dédiée&nbsp;: la reprise existe, mais le transport reste à votre charge et la filière est
          encore jeune. Le «&nbsp;recyclable&nbsp;» de la fiche produit est donc vrai sur le papier,
          beaucoup moins dans les faits.
        </p>
        <p className="content-body">
          Reste le cas des exotiques, et c&apos;est l&apos;actualité 2026 à connaître avant
          d&apos;acheter. L&apos;ipé et le cumaru ont été inscrits à l&apos;annexe II de la{' '}
          <a href="https://cites.org/fra" target="_blank" rel="noopener noreferrer" className="content-link">CITES</a> (en vigueur depuis fin 2024),
          la convention qui réglemente le commerce des espèces menacées&nbsp;: leur achat impose une
          traçabilité renforcée et des justificatifs d&apos;origine. Autrement dit, une terrasse en
          ipé reste possible, mais seulement en bois certifié FSC, avec ses papiers. C&apos;est l&apos;une
          des raisons qui font basculer de plus en plus de projets vers le composite ou vers un
          résineux local saturé en teinte foncée, qui imite le rendu exotique sans le poids
          écologique.
        </p>

        <Callout type="warn" title="Exotiques sous CITES">
          L&apos;ipé et le cumaru sont désormais inscrits à l&apos;annexe II de la CITES&nbsp;: leur
          commerce impose une traçabilité renforcée. Une terrasse en ipé reste possible, mais
          seulement en bois certifié FSC, justificatifs d&apos;origine à l&apos;appui&nbsp;; sinon,
          un résineux local ou le composite prennent le relais.
        </Callout>

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Terrasse composite ou bois&nbsp;: laquelle est la moins chère&nbsp;?</h3>
          <p className="content-body">
            En fourniture, le bois résineux. Comptez 43 à 53 €/m² en pin autoclave classe 4, 53 à
            65 €/m² en douglas, contre 75 à 90 €/m² pour un composite milieu de gamme (prix relevés en
            grande surface, 2026). Les lames composite creuses d&apos;entrée de gamme descendent vers
            25 à 40 €/m², les lames pleines premium montent à 120 €/m². L&apos;ipé, lui, démarre à
            103 €/m². Sur la durée, l&apos;écart se resserre car le bois demande un saturateur régulier.
          </p>

          <h3 className="content-h3">Une terrasse composite est-elle vraiment sans entretien&nbsp;?</h3>
          <p className="content-body">
            Presque. Une lame composite ne se sature pas, ne se ponce pas&nbsp;: un nettoyage à
            l&apos;eau savonneuse et à la brosse une à deux fois par an suffit. Une terrasse bois, elle,
            réclame un saturateur tous les 1 à 2 ans pour garder sa teinte, faute de quoi elle grise.
            Le composite n&apos;élimine pas l&apos;entretien, il supprime le saturateur — c&apos;est son
            vrai argument.
          </p>

          <h3 className="content-h3">La terrasse composite chauffe-t-elle au soleil&nbsp;?</h3>
          <p className="content-body">
            Oui, davantage que le bois, surtout en teinte foncée et en plein soleil l&apos;été&nbsp;:
            marcher pieds nus peut devenir inconfortable. Le fabricant Silvadec le reconnaît lui-même
            en classant ce confort «&nbsp;bon&nbsp;» et non «&nbsp;très bon&nbsp;». Le bois reste plus
            tempéré sous le pied. Pour une terrasse très exposée plein sud, une teinte composite claire
            limite nettement l&apos;effet.
          </p>

          <h3 className="content-h3">La terrasse composite est-elle glissante&nbsp;?</h3>
          <p className="content-body">
            Les lames composite de qualité rainurées sont classées R11 à R13 (chaussé) et classe C
            (pieds nus), le niveau des abords de piscine, selon le fabricant Silvadec — souvent meilleur
            qu&apos;une lame bois lisse. Mais c&apos;est une donnée fabricant&nbsp;: une lame composite
            premier prix, lisse et non rainurée, glisse autant qu&apos;un bois mouillé. Le bois, lui,
            devient glissant quand des algues s&apos;installent à l&apos;ombre.
          </p>

          <h3 className="content-h3">Quelle est la durée de vie d&apos;une terrasse composite contre une terrasse bois&nbsp;?</h3>
          <p className="content-body">
            Le composite Silvadec est garanti 25 ans en résidentiel (structurel, pas la couleur), pour
            une durée d&apos;usage estimée 25 à 30 ans. Côté bois&nbsp;: le pin classe 4 tient 15 à 25
            ans, le douglas environ 15 ans, l&apos;ipé 25 à 40 ans. La durée réelle dépend fortement de
            l&apos;exposition (nord/sud, bord de mer) et de l&apos;entretien. Rappel&nbsp;: une garantie
            est un engagement commercial, pas une durée de vie mesurée.
          </p>

          <h3 className="content-h3">La terrasse composite est-elle écologique et recyclable&nbsp;?</h3>
          <p className="content-body">
            C&apos;est son point faible. La lame composite mêle fibres de bois et polymère&nbsp;:
            difficile à séparer, elle se recycle mal en pratique. L&apos;ADEME lui consacre une fiche
            déchets dédiée — la reprise existe mais le transport reste à votre charge, et la filière est
            encore jeune. Le bois massif, lui, est renouvelable, stocke environ une tonne de CO₂ par
            mètre cube et se recycle plus simplement (labels PEFC, FSC).
          </p>

          <h3 className="content-h3">Peut-on encore poser une terrasse en ipé en 2026&nbsp;?</h3>
          <p className="content-body">
            Oui, mais c&apos;est plus encadré. L&apos;ipé et le cumaru ont été inscrits à l&apos;annexe
            II de la CITES, la convention qui réglemente le commerce des espèces menacées&nbsp;: leur
            achat impose désormais une traçabilité renforcée. Concrètement, privilégiez un bois exotique
            certifié FSC, avec des justificatifs d&apos;origine. C&apos;est l&apos;argument qui pousse de
            plus en plus de terrasses vers le composite ou les résineux locaux.
          </p>

          <h3 className="content-h3">Composite ou bois&nbsp;: que choisir pour ma terrasse&nbsp;?</h3>
          <p className="content-body">
            Choisissez le bois si vous visez le budget d&apos;achat le plus bas (pin ou douglas),
            acceptez un saturateur tous les 1 à 2 ans, et préférez un sol tempéré sous le pied.
            Choisissez le composite si vous voulez zéro saturateur pendant 20 ans et une bonne adhérence
            rainurée, en acceptant qu&apos;il chauffe plus et coûte plus à l&apos;achat. Pour un rendu
            noble sans déforestation, un résineux saturé foncé ou un composite imitation bois sont les
            compromis du moment.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/dalle-clipsable-terrasse-balcon-sans-travaux">Dalle clipsable pour balcon</Link> — l&apos;alternative sans travaux, emboîtable sur sol existant</li>
            <li><Link href="/guides/terrasse">Guide de la terrasse bois</Link> — lambourdes, plots, entraxes et pose des lames pas à pas</li>
            <li><Link href="/calculateur">Calculateur de terrasse</Link> — quantitatifs et budget lame par lame selon vos dimensions et l&apos;essence</li>
            <li><Link href="/guides/prix-terrasse-bois-m2-2026">Prix d&apos;une terrasse bois au m² en 2026</Link> — le détail des prix par essence, enseigne par enseigne</li>
            <li><Link href="/guides/terrasse-piscine-bois">Terrasse bois autour d&apos;une piscine</Link> — antidérapance, essences adaptées au chlore et sécurité</li>
            <li><Link href="/guides/cloture-composite-ou-bois">Clôture composite ou bois</Link> — le même match de matières, côté clôture cette fois</li>
            <li><Link href="/sources">Sources techniques</Link> — NF EN 335, FCBA, ADEME, Silvadec, CITES</li>
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
