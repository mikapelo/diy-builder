import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Tonnelle ou pergola ?';
const OG_SUBTITLE = 'Différences · prix · réglementation · usage';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=pergola`;

export const metadata = {
  title: 'Tonnelle ou pergola : différences et laquelle choisir',
  description:
    'Tonnelle ou pergola : structure démontable à toile ou abri fixe ? Différences, prix, réglementation et critères pour choisir selon votre usage.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/tonnelle-ou-pergola-difference' },
  openGraph: {
    title: 'Tonnelle ou pergola : quelle différence et laquelle choisir | DIY Builder',
    description:
      'Structure légère à toile ou structure fixe ancrée au sol ? Le comparatif neutre tonnelle / pergola : définitions, prix, réglementation et choix selon l\'usage.',
    url: 'https://www.diy-builder.fr/guides/tonnelle-ou-pergola-difference',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Tonnelle ou pergola — comparatif DIY Builder' }],
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
    { '@type': 'ListItem', position: 3, name: 'Guide pergola', item: 'https://www.diy-builder.fr/guides/pergola' },
    { '@type': 'ListItem', position: 4, name: 'Tonnelle ou pergola', item: 'https://www.diy-builder.fr/guides/tonnelle-ou-pergola-difference' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tonnelle ou pergola : quelle différence et laquelle choisir (2026)',
  description:
    'Comparatif 2026 entre une tonnelle (structure légère à toile, démontable) et une pergola (structure fixe ancrée) : définitions, prix, réglementation et critères de choix selon l\'usage.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-28',
  dateModified: '2026-06-28',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/tonnelle-ou-pergola-difference',
  image: OG_URL,
  about: ['Tonnelle', 'Pergola', 'Pavillon de jardin', 'Ombrage de jardin'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelle est la différence entre une tonnelle et une pergola ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Une tonnelle est une structure légère à toile, posée ou lestée, démontable et souvent saisonnière : on la range l\'hiver. Une pergola est une construction fixe, ancrée au sol par des poteaux, conçue pour rester toute l\'année. La frontière n\'est pas le mot mais l\'ancrage et la permanence : une « tonnelle » autoportée à toit rigide vissée au sol se comporte, elle, comme une pergola.' },
    },
    {
      '@type': 'Question',
      name: 'Une tonnelle protège-t-elle de la pluie et du vent ?',
      acceptedAnswer: { '@type': 'Answer', text: 'De la pluie, oui pour une averse, à condition d\'une toile imperméable et d\'un toit en pente ; les modèles à parois latérales coupent aussi le vent latéral. Mais une tonnelle à toile n\'est pas faite pour résister à un vent fort : la plupart des fabricants recommandent de la replier ou de la démonter dès un coup de vent marqué, de l\'ordre de 30 à 40 km/h pour le grand public. Elle n\'est pas non plus conçue pour supporter une charge de neige.' },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une déclaration de travaux pour installer une tonnelle ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Une construction démontable et réellement temporaire, installée moins de trois mois, est dispensée de toute formalité (article R*421-5 du Code de l\'urbanisme) — un délai ramené à quinze jours en secteur protégé selon service-public.fr. Dès qu\'elle devient permanente, ce sont les seuils classiques qui s\'appliquent : aucune formalité sous 5 m², déclaration préalable de 5 à 20 m², permis au-delà. Une dalle béton ou un ancrage fixe font perdre le caractère temporaire.' },
    },
    {
      '@type': 'Question',
      name: 'Tonnelle ou pergola : laquelle est la moins chère ?',
      acceptedAnswer: { '@type': 'Answer', text: 'La tonnelle, et de loin, à l\'achat. Une tonnelle à toile va de quelques dizaines d\'euros pour un modèle pliable à environ 300 € pour une bonne tonnelle alu avec toile renforcée. Une pergola coûte bien plus : autour de 80 à 250 €/m² en kit à monter soi-même, et de 400 à 1 500 €/m² posée pour une pergola bioclimatique en aluminium. Le rapport s\'inverse sur la durée : la pergola dure des années, la toile de tonnelle quelques saisons.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle différence entre une tonnelle, un barnum et une gloriette ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Une tonnelle est une structure de jardin à toile, plutôt décorative et semi-permanente sur la belle saison. Un barnum (ou tente de réception) est un modèle pliant, pensé pour l\'événementiel ponctuel : on le monte pour une fête, on le range après. Une gloriette est une structure ouverte plus ornementale, souvent de forme arrondie ou hexagonale, à vocation décorative. Tous trois sont légers et non fixes, à la différence de la pergola.' },
    },
    {
      '@type': 'Question',
      name: 'Une tonnelle peut-elle rester dehors toute l\'année ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ce n\'est pas conseillé pour une tonnelle à toile. Le vent et la neige la mettent en danger, et une toile repliée humide finit par moisir. La bonne pratique est de retirer la toile, voire de démonter la structure, à la mauvaise saison. Si vous voulez une protection permanente, à demeure toute l\'année, c\'est une pergola qu\'il faut, pas une tonnelle.' },
    },
  ],
};

export default function TonnelleOuPergolaPage() {
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
          <span className="content-breadcrumb-current">Tonnelle ou pergola</span>
        </nav>

        <h1 className="content-h1">
          Tonnelle ou pergola : quelle différence et laquelle choisir ?
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
            src="/images/guides/tonnelle-ou-pergola-difference/hero.png"
            alt="Une tonnelle de jardin à toile à côté d'une pergola en bois dans un jardin résidentiel français, en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          La différence tient en deux mots&nbsp;: <strong>démontable</strong> contre
          <strong> fixe</strong>. Une tonnelle est une structure légère à toile, posée ou lestée,
          qu&apos;on range à la mauvaise saison&nbsp;; une pergola est une construction ancrée au sol,
          conçue pour rester toute l&apos;année. La tonnelle coûte de quelques dizaines d&apos;euros à
          environ 300 €&nbsp;; la pergola, bien plus — de l&apos;ordre de 80 à 250 €/m² en kit, 400 à
          1 500 €/m² posée en bioclimatique. La tonnelle excelle pour l&apos;ombrage saisonnier et la
          réception&nbsp;; la pergola, pour un abri permanent. Voici comment trancher selon votre usage.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Tonnelle&nbsp;= structure légère à toile, démontable, saisonnière, posée ou lestée.</li>
            <li>Pergola&nbsp;= structure fixe, ancrée au sol, permanente (bois, aluminium, bioclimatique).</li>
            <li>Prix&nbsp;: tonnelle de quelques dizaines d&apos;euros à ~300 €&nbsp;; pergola 80-250 €/m² en kit, 400-1 500 €/m² posée (bioclimatique).</li>
            <li>Réglementation&nbsp;: tonnelle démontable et temporaire (&lt; 3 mois) = aucune formalité&nbsp;; pergola fixe = seuils 5 / 20 m².</li>
            <li>Choix&nbsp;: tonnelle pour l&apos;ombrage saisonnier et les réceptions&nbsp;; pergola pour un abri permanent et la plus-value.</li>
          </ul>
        </div>

        {/* CTA 1 */}
        <CTALead projectHref="/pergola" projectLabel="ma pergola en bois" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Tonnelle ou pergola&nbsp;: la différence en bref</h2>
        <p className="content-snippet">
          Une <strong>tonnelle</strong> est une structure légère à toile, posée ou lestée, démontable
          et souvent saisonnière. Une <strong>pergola</strong> est une construction fixe, ancrée au sol
          par des poteaux, conçue pour durer toute l&apos;année. La vraie frontière n&apos;est pas le
          mot, mais quatre critères&nbsp;: la permanence, l&apos;ancrage, le type de toiture et le
          statut réglementaire.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Critère</th>
              <th>Tonnelle</th>
              <th>Pergola</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nature</td>
              <td>Légère, démontable</td>
              <td>Fixe, ancrée au sol</td>
            </tr>
            <tr>
              <td>Toiture</td>
              <td>Toile (parfois toit rigide)</td>
              <td>Lames, poutres, toile tendue</td>
            </tr>
            <tr>
              <td>Permanence</td>
              <td>Saisonnière, rangée l&apos;hiver</td>
              <td>Toute l&apos;année</td>
            </tr>
            <tr>
              <td>Prix</td>
              <td>Quelques dizaines € à ~300 €</td>
              <td>80-250 €/m² kit · 400-1 500 €/m² posée</td>
            </tr>
            <tr>
              <td>Formalités</td>
              <td>Aucune si démontable &lt; 3 mois</td>
              <td>DP de 5 à 20 m², permis au-delà</td>
            </tr>
            <tr>
              <td>Usage idéal</td>
              <td>Ombrage saisonnier, réception</td>
              <td>Abri permanent, plus-value</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Tout le reste découle de là. Une tonnelle se déplace, se range, ne demande pas de
          fondation&nbsp;: c&apos;est sa force et sa limite. Une pergola s&apos;installe une fois pour
          toutes et devient un prolongement de la maison. Pour construire cette dernière — poteaux,
          longerons, chevrons, ancrage — notre{' '}
          <Link href="/guides/pergola" className="content-link">guide de la pergola en bois</Link>{' '}
          déroule la méthode&nbsp;; ici, on compare les deux familles pour vous aider à choisir.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">Qu&apos;est-ce qu&apos;une tonnelle&nbsp;?</h2>
        <p className="content-snippet">
          Une tonnelle est une structure de jardin légère — acier, aluminium ou résine — couverte
          d&apos;une toile, posée au sol et stabilisée par des piquets ou des poids. Elle se monte
          sans fondation, se déplace, et se range hors saison. On distingue la tonnelle pliable
          (montage en minutes), la tonnelle rigide à toile tendue, et le pavillon de réception, plus
          grand.
        </p>
        <p className="content-body">
          Le cœur d&apos;une tonnelle, c&apos;est la toile&nbsp;: un polyester enduit anti-UV, dont le
          grammage trahit la qualité — comptez autour de 260 à 300 g/m² pour un usage régulier plutôt
          que ponctuel. La structure, elle, va de l&apos;acier économique à l&apos;aluminium plus léger
          et inoxydable. Beaucoup de modèles acceptent des parois latérales amovibles, qui ferment
          l&apos;espace contre le vent ou le soleil rasant. L&apos;ensemble se lest&nbsp;: piquets dans
          la pelouse, ou sacs et poids de lestage sur une terrasse dure.
        </p>
        <p className="content-body">
          C&apos;est aussi une structure qu&apos;il faut savoir mettre à l&apos;abri. La plupart des
          fabricants recommandent de replier ou de démonter une tonnelle dès un vent marqué — de
          l&apos;ordre de 30 à 40 km/h pour les modèles grand public — et elle n&apos;est pas conçue
          pour porter de la neige. Bien rangée et bien séchée, une toile tient plusieurs saisons&nbsp;;
          laissée dehors toute l&apos;année, repliée humide, elle moisit et se fatigue vite.
        </p>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">Qu&apos;est-ce qu&apos;une pergola&nbsp;?</h2>
        <p className="content-snippet">
          Une pergola est une structure fixe, ancrée au sol par des poteaux, adossée à la maison ou
          autoportée. Sa toiture peut être en lames (bioclimatique, orientables), en poutres pour les
          plantes grimpantes, ou en toile tendue. Conçue pour durer, elle devient une pièce de vie
          semi-ouverte&nbsp;; c&apos;est aussi un investissement bien plus lourd qu&apos;une tonnelle.
        </p>
        <p className="content-body">
          La pergola se décline en deux implantations&nbsp;: <strong>adossée</strong>, en prolongement
          d&apos;un mur de la maison, et <strong>autoportée</strong>, posée librement dans le jardin.
          Côté toiture, la version bioclimatique — des lames d&apos;aluminium orientables qui gèrent
          soleil et pluie — est la plus aboutie et la plus chère&nbsp;; une pergola en bois à
          chevrons, support de plantes grimpantes, reste plus accessible. Dans tous les cas, c&apos;est
          une construction ancrée&nbsp;: on la dimensionne, on l&apos;ancre, on ne la déplace pas. Pour
          la concevoir et chiffrer ses matériaux, notre{' '}
          <Link href="/pergola" className="content-link">simulateur de pergola</Link>{' '}
          fait le calcul selon vos dimensions.
        </p>

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">Tonnelle, barnum, gloriette, pavillon&nbsp;: ne plus confondre</h2>
        <p className="content-snippet">
          Le vocabulaire commercial brouille les pistes. La tonnelle est décorative et semi-permanente
          sur la belle saison&nbsp;; le barnum est un pliant événementiel&nbsp;; la gloriette, une
          structure ornementale souvent arrondie&nbsp;; le pavillon, une grande tonnelle de réception.
          Tous sont légers et non fixes — c&apos;est ce qui les sépare de la pergola.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Terme</th>
              <th>Ce que c&apos;est</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tonnelle</td>
              <td>Structure à toile, décorative, semi-permanente sur la saison</td>
            </tr>
            <tr>
              <td>Barnum / tente de réception</td>
              <td>Pliant, événementiel ponctuel (fête, marché) — monté puis rangé</td>
            </tr>
            <tr>
              <td>Gloriette</td>
              <td>Structure ouverte ornementale, souvent arrondie ou hexagonale</td>
            </tr>
            <tr>
              <td>Pavillon</td>
              <td>Grande tonnelle de réception, parfois à toit rigide</td>
            </tr>
            <tr>
              <td>Pergola</td>
              <td>Structure fixe ancrée au sol, permanente</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          La zone grise tient aux modèles haut de gamme&nbsp;: une «&nbsp;tonnelle autoportée à toit
          rigide&nbsp;» en polycarbonate, vissée au sol, n&apos;a plus grand-chose d&apos;une tonnelle
          — elle se comporte comme une pergola, prix compris. Retenez le bon repère&nbsp;: ce qui
          compte n&apos;est pas l&apos;étiquette, mais l&apos;ancrage et la permanence.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Prix&nbsp;: combien coûte une tonnelle vs une pergola&nbsp;?</h2>
        <p className="content-snippet">
          Une tonnelle à toile va de quelques dizaines d&apos;euros (pliable d&apos;entrée de gamme) à
          environ 300 € (alu + toile renforcée). Une pergola coûte bien plus&nbsp;: de l&apos;ordre de
          80 à 250 €/m² en kit à monter soi-même, et de 400 à 1 500 €/m² posée pour une bioclimatique
          en aluminium. Entre les deux, une tonnelle autoportée à toit rigide approche le prix
          d&apos;une petite pergola.
        </p>
        <p className="content-body">
          Côté tonnelle, l&apos;achat reste modeste&nbsp;: un modèle pliable se trouve dès quelques
          dizaines d&apos;euros, une bonne tonnelle en aluminium avec toile renforcée tourne autour de
          150 à 300 €. Au-delà, on entre dans les tonnelles autoportées à toit dur (polycarbonate),
          qui peuvent atteindre près de 2 000 € — et là, le mot «&nbsp;tonnelle&nbsp;» cache en réalité
          une structure fixe.
        </p>
        <p className="content-body">
          Côté pergola, le budget change d&apos;échelle. En kit à monter soi-même, comptez de
          l&apos;ordre de 80 à 250 €/m²&nbsp;; pour une pergola bioclimatique en aluminium posée, les
          fourchettes du marché vont de 400 à 1 500 €/m² selon la gamme et la motorisation, soit
          plusieurs milliers d&apos;euros pour une surface de terrasse courante. Ces ordres de grandeur
          sont larges et dépendent de nombreux facteurs&nbsp;: le détail, gamme par gamme, est dans
          notre{' '}
          <Link href="/guides/prix-pergola-bioclimatique-2026" className="content-link">analyse du prix d&apos;une pergola</Link>.
        </p>

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">Réglementation&nbsp;: déclaration, tonnelle vs pergola</h2>
        <p className="content-snippet">
          C&apos;est la vraie différence pratique. Une tonnelle démontable et réellement temporaire,
          installée moins de trois mois, est dispensée de toute formalité. Une pergola fixe, elle,
          retombe dans le régime classique&nbsp;: rien sous 5 m², déclaration préalable de 5 à 20 m²,
          permis au-delà. Une dalle béton ou un ancrage fixe font perdre le caractère temporaire.
        </p>
        <p className="content-body">
          Pour la tonnelle, le critère est la durée et la démontabilité. Une construction démontable
          et temporaire, installée moins de trois mois, est dispensée de formalité au titre de
          l&apos;article R*421-5 du Code de l&apos;urbanisme&nbsp;; ce délai est ramené à quinze jours
          en secteur protégé, selon service-public.fr. Autrement dit, une tonnelle montée pour la
          belle saison puis rangée échappe aux démarches — à condition de ne pas l&apos;ancrer sur une
          dalle béton, ce qui lui ferait perdre son caractère temporaire.
        </p>
        <p className="content-body">
          Pour la pergola, fixe par nature, ce sont les seuils habituels qui s&apos;appliquent&nbsp;:
          aucune formalité en dessous de 5 m² d&apos;emprise au sol, déclaration préalable de 5 à
          20 m² (le seuil peut monter à 40 m² pour une pergola adossée en zone urbaine couverte par un
          PLU), et permis de construire au-delà de 20 m². En secteur protégé, l&apos;avis de
          l&apos;Architecte des Bâtiments de France est requis sans condition de surface. En cas de
          doute, le service urbanisme de la mairie tranche&nbsp;; les démarches détaillées sont sur
          service-public.fr.
        </p>

        {/* CTA milieu */}
        <CTALead projectHref="/pergola" projectLabel="les matériaux de ma pergola" />

        {/* ════════════ PARTENAIRE AWIN — DeubaXXL (tonnelles à toile) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers DeubaXXL
          (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens, DIY Builder peut
          percevoir une commission, sans surcoût pour vous. Notre comparatif reste indépendant — nous
          donnons les critères pour choisir, pas pour pousser une marque. Voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="tonnelle" placement="guide" />

        {/* ════════════ H2.7 ════════════ */}
        <h2 className="content-h2">Laquelle choisir selon votre usage&nbsp;?</h2>
        <p className="content-snippet">
          Choisissez la tonnelle si vous cherchez de l&apos;ombrage ponctuel ou de saison, un budget
          contenu, ou une solution amovible (location, terrain non aménagé). Choisissez la pergola si
          vous voulez un abri permanent, le confort d&apos;une pièce extérieure toute l&apos;année et
          une plus-value pour la maison. C&apos;est l&apos;usage, pas le goût, qui décide.
        </p>
        <p className="content-body">
          <strong>La tonnelle gagne</strong> quand le besoin est saisonnier ou ponctuel&nbsp;: ombrager
          une table l&apos;été, abriter une réception, profiter d&apos;une terrasse sans engager de
          travaux. Elle gagne aussi quand le budget est serré, quand on est locataire, ou quand on veut
          pouvoir déplacer et ranger la structure. Pas de fondation, pas de démarche si elle reste
          temporaire&nbsp;: c&apos;est la solution souple.
        </p>
        <p className="content-body">
          <strong>La pergola gagne</strong> quand on veut un abri à demeure, utilisable d&apos;une
          saison à l&apos;autre, et un vrai prolongement de la maison. Une version bioclimatique gère
          le soleil et la pluie au fil de la journée&nbsp;; une pergola bois accueille les plantes
          grimpantes et le temps qui passe. C&apos;est plus cher et plus engageant — il faut
          l&apos;ancrer, parfois la déclarer — mais c&apos;est durable et ça valorise le bien. Si vous
          penchez pour la pergola, autant{' '}
          <Link href="/pergola" className="content-link">en calculer les matériaux</Link>{' '}
          précisément, et décider ensuite de la{' '}
          <Link href="/guides/soi-meme-ou-pro" className="content-link">monter vous-même ou de la faire poser</Link>.
        </p>

        {/* CTA bas */}
        <CTALead projectHref="/pergola" projectLabel="ma pergola sur mesure" />

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Quelle est la différence entre une tonnelle et une pergola&nbsp;?</h3>
          <p className="content-body">
            Une tonnelle est une structure légère à toile, posée ou lestée, démontable et souvent
            saisonnière&nbsp;: on la range l&apos;hiver. Une pergola est une construction fixe, ancrée au
            sol par des poteaux, conçue pour rester toute l&apos;année. La frontière n&apos;est pas le
            mot mais l&apos;ancrage et la permanence&nbsp;: une «&nbsp;tonnelle&nbsp;» autoportée à toit
            rigide vissée au sol se comporte, elle, comme une pergola.
          </p>

          <h3 className="content-h3">Une tonnelle protège-t-elle de la pluie et du vent&nbsp;?</h3>
          <p className="content-body">
            De la pluie, oui pour une averse, à condition d&apos;une toile imperméable et d&apos;un toit
            en pente&nbsp;; les modèles à parois latérales coupent aussi le vent latéral. Mais une
            tonnelle à toile n&apos;est pas faite pour résister à un vent fort&nbsp;: la plupart des
            fabricants recommandent de la replier ou de la démonter dès un coup de vent marqué, de
            l&apos;ordre de 30 à 40 km/h pour le grand public. Elle n&apos;est pas non plus conçue pour
            supporter une charge de neige.
          </p>

          <h3 className="content-h3">Faut-il une déclaration de travaux pour installer une tonnelle&nbsp;?</h3>
          <p className="content-body">
            Une construction démontable et réellement temporaire, installée moins de trois mois, est
            dispensée de toute formalité (article R*421-5 du Code de l&apos;urbanisme) — un délai ramené
            à quinze jours en secteur protégé selon service-public.fr. Dès qu&apos;elle devient
            permanente, ce sont les seuils classiques qui s&apos;appliquent&nbsp;: aucune formalité sous
            5 m², déclaration préalable de 5 à 20 m², permis au-delà. Une dalle béton ou un ancrage fixe
            font perdre le caractère temporaire.
          </p>

          <h3 className="content-h3">Tonnelle ou pergola&nbsp;: laquelle est la moins chère&nbsp;?</h3>
          <p className="content-body">
            La tonnelle, et de loin, à l&apos;achat. Une tonnelle à toile va de quelques dizaines
            d&apos;euros pour un modèle pliable à environ 300 € pour une bonne tonnelle alu avec toile
            renforcée. Une pergola coûte bien plus&nbsp;: autour de 80 à 250 €/m² en kit à monter
            soi-même, et de 400 à 1 500 €/m² posée pour une pergola bioclimatique en aluminium. Le
            rapport s&apos;inverse sur la durée&nbsp;: la pergola dure des années, la toile de tonnelle
            quelques saisons.
          </p>

          <h3 className="content-h3">Quelle différence entre une tonnelle, un barnum et une gloriette&nbsp;?</h3>
          <p className="content-body">
            Une tonnelle est une structure de jardin à toile, plutôt décorative et semi-permanente sur
            la belle saison. Un barnum (ou tente de réception) est un modèle pliant, pensé pour
            l&apos;événementiel ponctuel&nbsp;: on le monte pour une fête, on le range après. Une
            gloriette est une structure ouverte plus ornementale, souvent de forme arrondie ou
            hexagonale. Tous trois sont légers et non fixes, à la différence de la pergola.
          </p>

          <h3 className="content-h3">Une tonnelle peut-elle rester dehors toute l&apos;année&nbsp;?</h3>
          <p className="content-body">
            Ce n&apos;est pas conseillé pour une tonnelle à toile. Le vent et la neige la mettent en
            danger, et une toile repliée humide finit par moisir. La bonne pratique est de retirer la
            toile, voire de démonter la structure, à la mauvaise saison. Si vous voulez une protection
            permanente, à demeure toute l&apos;année, c&apos;est une pergola qu&apos;il faut, pas une
            tonnelle.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/pergola">Guide de la pergola en bois</Link> — poteaux, longerons, chevrons et ancrage, pas à pas</li>
            <li><Link href="/pergola">Simulateur de pergola</Link> — dimensions, matériaux et budget de votre pergola</li>
            <li><Link href="/guides/prix-pergola-bioclimatique-2026">Prix d&apos;une pergola bioclimatique</Link> — fourchettes au m² par gamme, posée ou en kit</li>
            <li><Link href="/guides/soi-meme-ou-pro">Soi-même ou faire faire</Link> — cinq critères pour décider qui monte la structure</li>
            <li><Link href="/sources">Sources techniques</Link> — Code de l&apos;urbanisme (R*421-5), service-public</li>
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
