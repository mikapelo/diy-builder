import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import Callout from '@/components/content/Callout';
import PullQuote from '@/components/content/PullQuote';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';

const OG_TITLE = 'Abri de jardin : métal, bois ou résine ?';
const OG_SUBTITLE = 'Prix · durée de vie · entretien · usage';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cabanon`;

export const metadata = {
  title: 'Abri de jardin : métal, bois ou résine ? Comparatif 2026',
  description:
    'Métal, bois ou résine pour votre abri de jardin ? Comparatif 2026 : durée de vie, prix, entretien, coût sur 10 ans et le matériau selon votre usage.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/abri-de-jardin-metal-bois-ou-resine' },
  openGraph: {
    title: 'Abri de jardin : métal, bois ou résine — le comparatif 2026 | DIY Builder',
    description:
      'Durée de vie, prix, entretien, coût réel sur 10 ans et tableau par usage : le comparatif honnête entre un abri de jardin en métal, en bois et en résine.',
    url: 'https://www.diy-builder.fr/guides/abri-de-jardin-metal-bois-ou-resine',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Abri de jardin métal, bois ou résine — comparatif DIY Builder' }],
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
    { '@type': 'ListItem', position: 3, name: 'Guide cabanon', item: 'https://www.diy-builder.fr/guides/cabanon' },
    { '@type': 'ListItem', position: 4, name: 'Abri métal, bois ou résine', item: 'https://www.diy-builder.fr/guides/abri-de-jardin-metal-bois-ou-resine' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Abri de jardin : métal, bois ou résine — quel matériau choisir (2026)',
  description:
    'Comparatif 2026 entre un abri de jardin en métal, en bois et en résine : durée de vie, prix, entretien, coût réel sur 10 ans, tableau par usage et réglementation (taxe, déclaration).',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-27',
  dateModified: '2026-06-27',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/abri-de-jardin-metal-bois-ou-resine',
  image: OG_URL,
  about: ['Abri de jardin', 'Abri métal', 'Abri bois', 'Abri résine', 'Comparatif matériaux'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel abri de jardin est le plus solide ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Cela dépend moins du matériau que de l\'épaisseur. Un abri métal en acier galvanisé de forte épaisseur (0,5 mm et plus) et un abri bois à parois épaisses (28 mm et plus) sont tous deux très solides et durent 20 ans ou davantage. À épaisseur faible, les deux faiblissent : tôle fine qui se déforme, paroi bois de 12-16 mm qui vrille. Regardez l\'épaisseur annoncée avant le matériau.' },
    },
    {
      '@type': 'Question',
      name: 'Quel matériau d\'abri de jardin demande le moins d\'entretien ?',
      acceptedAnswer: { '@type': 'Answer', text: 'La résine, puis le métal. Une résine ou un PVC se nettoie une à deux fois par an à l\'eau savonneuse, sans aucun traitement. Le métal demande un nettoyage annuel et un point de peinture antirouille si la tôle est rayée. Le bois est le plus exigeant : une lasure ou un traitement tous les 2 à 3 ans pour garder sa teinte et sa protection.' },
    },
    {
      '@type': 'Question',
      name: 'Quel abri de jardin choisir pour un petit budget ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le métal. À l\'achat, un abri de jardin en acier galvanisé est le moins cher des trois matériaux, surtout en kit à monter soi-même ; on trouve des modèles de rangement de 2 à 8 m² entre environ 175 et 415 €. La contrepartie : isolation faible, condensation possible et esthétique industrielle. Pour du simple rangement non chauffé, c\'est le meilleur rapport prix-durée.' },
    },
    {
      '@type': 'Question',
      name: 'Un abri de jardin en métal rouille-t-il ? Comment éviter la condensation ?',
      acceptedAnswer: { '@type': 'Answer', text: 'L\'acier galvanisé résiste bien à la corrosion (garanties constructeur souvent autour de 15 ans), mais la rouille peut démarrer dès qu\'une rayure met l\'acier à nu, et le phénomène s\'accélère en bord de mer. Contre la condensation, qui vient de l\'air humide refroidi la nuit : posez l\'abri sur des plots ou une dalle pour le surélever, assurez une ventilation haute et basse, et évitez d\'y stocker du bois ou du linge humides.' },
    },
    {
      '@type': 'Question',
      name: 'Quel abri de jardin est imposable ou dispensé de déclaration ?',
      acceptedAnswer: { '@type': 'Answer', text: 'En dessous de 5 m² d\'emprise au sol, aucune formalité et aucune taxe. De 5 à 20 m², une déclaration préalable (Cerfa 13703) est requise et la taxe d\'aménagement s\'applique. Au-delà de 20 m², c\'est un permis de construire. La taxe se calcule sur une valeur forfaitaire 2026 de 892 €/m² hors Île-de-France (1 011 €/m² en IDF) pour les surfaces de plus de 1,80 m sous plafond, multipliée par les taux locaux ; certaines communes exonèrent les abris.' },
    },
    {
      '@type': 'Question',
      name: 'Peut-on construire soi-même un abri en bois moins cher qu\'un kit ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, si vous êtes équipé et que le projet dépasse quelques mètres carrés. Construire une ossature bois sur mesure permet de choisir des sections solides, d\'isoler les murs et d\'adapter les dimensions, souvent pour un coût matériaux maîtrisé. C\'est plus exigeant qu\'un kit à emboîter, mais c\'est la seule voie pour un vrai atelier isolé. Notre simulateur de cabanon chiffre l\'ossature, le bardage et la couverture selon vos dimensions.' },
    },
  ],
};

export default function AbriMetalBoisResinePage() {
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
          <span className="content-breadcrumb-current">Métal, bois ou résine</span>
        </nav>

        <h1 className="content-h1">
          Abri de jardin : métal, bois ou résine — quel matériau choisir ?
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 27 juin 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/abri-de-jardin-metal-bois-ou-resine/hero.png"
            alt="Un abri de jardin en métal anthracite à côté d'un abri en bois naturel dans un jardin résidentiel français, lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Trois matériaux, trois logiques. Le <strong>métal</strong> (acier galvanisé) est le moins
          cher et ne demande presque pas d&apos;entretien, mais il isole mal et peut faire de la
          condensation&nbsp;: c&apos;est l&apos;abri de rangement par excellence. Le <strong>bois</strong>{' '}
          est le plus chaleureux et le seul vraiment isolant — idéal pour un atelier — au prix
          d&apos;une lasure tous les 2 à 3 ans. La <strong>résine</strong> ne s&apos;entretient pas et
          ne rouille jamais, mais elle chauffe au soleil et reste légère. Et dès 5&nbsp;m², le choix
          n&apos;est plus seulement matériel&nbsp;: déclaration et taxe entrent en jeu. Ce comparatif
          tranche poste par poste, chiffres sourcés à l&apos;appui.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Prix d&apos;achat&nbsp;: le métal est le moins cher, la résine au milieu, le bois le plus cher (mais le seul isolant).</li>
            <li>Entretien&nbsp;: résine = nettoyage seul&nbsp;; métal = nettoyage + antirouille si rayure&nbsp;; bois = lasure tous les 2-3 ans.</li>
            <li>Durée de vie&nbsp;: l&apos;épaisseur compte autant que le matériau — métal galvanisé 15-25 ans, bois 10-25 ans selon parois, résine 10-15 ans.</li>
            <li>Usage&nbsp;: rangement → métal&nbsp;; atelier ou pièce de vie → bois&nbsp;; stockage d&apos;appoint → résine.</li>
            <li>Réglementation&nbsp;: rien sous 5&nbsp;m²&nbsp;; déclaration + taxe de 5 à 20&nbsp;m²&nbsp;; permis au-delà de 20&nbsp;m².</li>
          </ul>
        </div>

        {/* CTA 1 */}
        <CTALead projectHref="/cabanon" projectLabel="mon abri en ossature bois" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Métal, bois ou résine&nbsp;: le comparatif en un coup d&apos;œil</h2>
        <p className="content-snippet">
          Le métal gagne sur le prix et l&apos;entretien, le bois sur l&apos;isolation et
          l&apos;esthétique, la résine sur la simplicité et l&apos;étanchéité. Aucun n&apos;est
          parfait&nbsp;: le métal condense et chauffe, le bois réclame une lasure, la résine vieillit
          au soleil. L&apos;épaisseur des parois pèse autant que le choix du matériau sur la durée de vie.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Critère</th>
              <th>Métal (acier galvanisé)</th>
              <th>Bois traité</th>
              <th>Résine / PVC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prix d&apos;achat</td>
              <td>Le moins cher</td>
              <td>Le plus élevé</td>
              <td>Intermédiaire</td>
            </tr>
            <tr>
              <td>Durée de vie</td>
              <td>15 – 25 ans</td>
              <td>10 – 25 ans (selon parois)</td>
              <td>10 – 15 ans</td>
            </tr>
            <tr>
              <td>Entretien</td>
              <td>Nettoyage annuel</td>
              <td>Lasure tous les 2-3 ans</td>
              <td>Nettoyage 1-2 ×/an</td>
            </tr>
            <tr>
              <td>Isolation thermique</td>
              <td>Faible</td>
              <td>Bonne</td>
              <td>Faible</td>
            </tr>
            <tr>
              <td>Montage</td>
              <td>Rapide (kit emboîtable)</td>
              <td>Moyen</td>
              <td>Rapide</td>
            </tr>
            <tr>
              <td>Point faible</td>
              <td>Condensation, rouille si rayé</td>
              <td>Entretien, prix</td>
              <td>Chauffe au soleil, légèreté</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Les fourchettes de durée de vie viennent des grilles professionnelles du secteur&nbsp;:
          elles dépendent surtout de l&apos;épaisseur (tôle, paroi de madriers, lame de résine) et de
          l&apos;exposition. Une remarque transversale avant d&apos;entrer dans le détail&nbsp;: quel
          que soit le matériau, surélever l&apos;abri sur des plots ou une dalle le protège de
          l&apos;humidité du sol et rallonge sa vie. Si votre besoin penche vers un vrai bâtiment isolé
          plutôt qu&apos;un kit, mieux vaut{' '}
          <Link href="/cabanon" className="content-link">chiffrer un abri en ossature bois</Link>{' '}
          dès le départ.
        </p>

        {/* CTA milieu */}
        <CTALead projectHref="/cabanon" projectLabel="les matériaux de mon abri bois" />

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">L&apos;abri en métal&nbsp;: le prix imbattable, zéro entretien</h2>
        <p className="content-snippet">
          L&apos;acier galvanisé est le moins cher des trois et se monte en kit en une journée. Il ne
          pourrit pas, ne brûle pas, n&apos;intéresse pas les insectes. Ses défauts sont connus&nbsp;:
          condensation s&apos;il n&apos;est pas ventilé, rouille dès qu&apos;une rayure met
          l&apos;acier à nu, et une isolation quasi nulle qui le rend brûlant l&apos;été et glacial
          l&apos;hiver.
        </p>
        <p className="content-body">
          C&apos;est l&apos;abri de rangement par défaut, et pour de bonnes raisons. Le prix
          d&apos;achat est le plus bas du comparatif, le montage est rapide (panneaux d&apos;acier à
          emboîter et visser), et le matériau est insensible à la pourriture, au feu et aux insectes.
          La galvanisation protège l&apos;acier de la corrosion sur la durée — les constructeurs
          annoncent couramment une garantie anticorrosion autour de 15 ans, et une garantie de laquage
          plus courte (de l&apos;ordre de 5 ans) sur la teinte.
        </p>
        <p className="content-body">
          Les limites tiennent toutes à la nature du métal. La <strong>condensation</strong> d&apos;abord&nbsp;:
          l&apos;air humide qui refroidit la nuit contre la tôle forme des gouttes à l&apos;intérieur,
          d&apos;où la nécessité d&apos;une ventilation haute et basse et d&apos;une surélévation sur
          plots. La <strong>rouille</strong> ensuite&nbsp;: tant que la tôle est intacte elle tient,
          mais une rayure profonde amorce la corrosion, accélérée en atmosphère salée (bord de mer).
          Enfin l&apos;<strong>isolation</strong>&nbsp;: une tôle ne retient rien, l&apos;abri suit la
          température extérieure. Pour stocker une tondeuse, des outils ou des vélos, aucun de ces
          points n&apos;est rédhibitoire.
        </p>

        <Callout type="pro" title="Le geste pro anti-condensation">
          Quel que soit le matériau, deux gestes de pose changent tout&nbsp;: surélevez l&apos;abri sur des plots ou une dalle, et ménagez une ventilation haute et basse. Le premier le coupe de l&apos;humidité du sol&nbsp;; le second évacue l&apos;air humide qui, en refroidissant la nuit contre la tôle, forme la condensation. Un abri surélevé et bien ventilé vieillit nettement mieux.
        </Callout>

        <h3 className="content-h3">Le métal «&nbsp;imitation bois&nbsp;», le compromis esthétique</h3>
        <p className="content-body">
          Le reproche le plus fréquent fait au métal est son allure industrielle. Les fabricants y
          répondent avec des tôles à finition «&nbsp;aspect bois&nbsp;» ou en teintes mates
          (anthracite, vert), qui adoucissent nettement le rendu tout en gardant les avantages de
          l&apos;acier&nbsp;: prix bas et zéro traitement. C&apos;est le bon compromis si l&apos;allure
          compte mais que vous ne voulez ni l&apos;entretien du bois, ni son budget.
        </p>

        {/* ════════════ PARTENAIRE AWIN — DeubaXXL (abris métal) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers DeubaXXL
          (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens, DIY Builder peut
          percevoir une commission, sans surcoût pour vous. Notre comparatif reste indépendant — nous
          ne recommandons pas le métal plutôt que le bois, nous donnons les chiffres pour que vous
          décidiez. Voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="abri-metal" placement="guide" />

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">L&apos;abri en bois&nbsp;: le plus esthétique et le seul isolant</h2>
        <p className="content-snippet">
          Le bois est le seul matériau qui isole vraiment&nbsp;: c&apos;est le choix d&apos;un atelier,
          d&apos;un bureau de jardin ou d&apos;une pièce qu&apos;on occupe. Il est chaleureux,
          réparable et personnalisable. En échange, il coûte plus cher à l&apos;achat et réclame une
          lasure tous les 2 à 3 ans&nbsp;; sans elle, il grise — un phénomène de surface qui n&apos;ôte
          rien à la solidité.
        </p>
        <p className="content-body">
          L&apos;argument décisif du bois est thermique et sensoriel. À épaisseur de parois suffisante
          (madriers de 28 mm et plus), il garde la chaleur l&apos;hiver et la fraîcheur l&apos;été,
          là où le métal et la résine suivent la température du dehors. C&apos;est pour cela qu&apos;un
          atelier, un studio de jardin ou un abri qu&apos;on chauffe se font en bois — ou en ossature
          bois isolée. Sa durée de vie suit l&apos;épaisseur des parois&nbsp;: un chalet à parois fines
          (12-16 mm) vieillit vite, des madriers épais tiennent 20 ans et plus, avec entretien.
        </p>

        <Callout type="info" title="Idée reçue">
          On croit souvent que la solidité d&apos;un abri se joue d&apos;abord sur le matériau. En réalité, l&apos;épaisseur des parois pèse tout autant&nbsp;: une paroi trop fine se déforme ou vrille, qu&apos;elle soit en tôle, en madriers ou en résine, alors qu&apos;une paroi épaisse tient dans les trois cas. Regardez l&apos;épaisseur annoncée avant de trancher sur la matière.
        </Callout>

        <p className="content-body">
          La contrepartie est l&apos;entretien. Pour conserver sa teinte et sa protection, le bois
          demande une lasure ou un saturateur tous les 2 à 3 ans&nbsp;; faute de quoi il prend une
          patine grise. Le coût du produit reste modeste, mais c&apos;est un geste récurrent à assumer.
          Ajoutez une fondation soignée — le bois craint le contact permanent avec un sol humide — et
          vous avez l&apos;abri le plus noble, mais le plus impliquant.
        </p>

        <h3 className="content-h3">Et si vous le construisiez vous-même&nbsp;?</h3>
        <p className="content-body">
          Au-delà de quelques mètres carrés, un kit en madriers n&apos;est pas la seule option. Une{' '}
          <Link href="/guides/cabanon" className="content-link">construction en ossature bois</Link>{' '}
          permet de choisir des sections de bois généreuses, d&apos;isoler les murs et d&apos;adapter les
          dimensions au centimètre — la seule voie pour un vrai atelier confortable toute l&apos;année.
          C&apos;est plus de travail qu&apos;un abri à emboîter, mais le résultat n&apos;a rien à voir.
          Notre simulateur de cabanon dimensionne l&apos;ossature, le bardage et la couverture selon
          vos mesures, et chiffre les matériaux.
        </p>

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">L&apos;abri en résine (PVC)&nbsp;: pratique et sans entretien</h2>
        <p className="content-snippet">
          La résine ne rouille pas, ne pourrit pas et ne se lasure jamais&nbsp;: un nettoyage à
          l&apos;eau savonneuse une à deux fois par an suffit. Elle est légère et étanche. Ses limites&nbsp;:
          une isolation faible, un aspect plastique assumé, et une tenue aux UV variable — le PVC a
          tendance à jaunir, la résine de qualité résiste mieux. Sa légèreté impose un bon ancrage au sol.
        </p>
        <p className="content-body">
          C&apos;est l&apos;abri «&nbsp;tranquillité&nbsp;». Imputrescible et insensible à la corrosion,
          il se contente d&apos;un coup d&apos;éponge une à deux fois par an&nbsp;: ni traitement, ni
          peinture, ni saturateur. Sa légèreté facilite le montage, mais elle a un revers&nbsp;: un
          abri résine doit être correctement fixé ou lesté, sous peine de souffrir au vent. Côté
          longévité, comptez 10 à 15 ans pour les modèles courants, davantage pour les parois épaisses.
        </p>
        <p className="content-body">
          Deux nuances à connaître. La tenue aux UV d&apos;abord&nbsp;: tous les plastiques ne se valent
          pas&nbsp;: le PVC a tendance à se décolorer ou jaunir avec les années, alors qu&apos;une
          résine traitée anti-UV reste stable plus longtemps (et coûte un peu plus). L&apos;isolation
          ensuite&nbsp;: comme le métal, la résine ne retient pas la chaleur. Pour un stockage
          d&apos;appoint, du mobilier de jardin ou des affaires de piscine, c&apos;est sans
          conséquence&nbsp;; pour un usage habité, ce n&apos;est pas le bon matériau.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Quel coût réel sur 10 ans&nbsp;?</h2>
        <p className="content-snippet">
          Le prix d&apos;achat ne dit pas tout. Sur 10 ans, le métal et la résine gardent
          l&apos;avantage&nbsp;: achat plus bas et entretien quasi nul. Le bois part plus cher et ajoute
          la lasure — quelques euros par mètre carré tous les 2 à 3 ans, faits soi-même. Le calcul
          bascule surtout si l&apos;on néglige l&apos;entretien&nbsp;: un métal qu&apos;on laisse
          rouiller ou une résine bas de gamme qui se déforme se remplacent avant l&apos;heure.
        </p>
        <p className="content-body">
          Posons les hypothèses. Pour le bois, un saturateur revient à 15-25 €/L selon nos relevés en
          grande surface de bricolage et couvre 8 à 10 m² par couche&nbsp;; appliqué tous les 2 à 3 ans soi-même, l&apos;entretien
          d&apos;un petit abri reste de quelques euros par mètre carré et par passage. Sur 10 ans, cela
          représente trois à quatre applications. Le métal et la résine, eux, n&apos;ajoutent qu&apos;un
          nettoyage&nbsp;: leur coût sur la durée reste très proche de leur prix d&apos;achat — le plus
          bas pour le métal.
        </p>
        <p className="content-body">
          La conclusion est donc nuancée, et c&apos;est normal. Pour un rangement, le métal reste le
          moins cher de bout en bout. Le bois ne rattrape jamais le métal sur le seul critère du
          budget&nbsp;; il se justifie par l&apos;isolation et le rendu, pas par l&apos;économie. Et le
          vrai risque de dérapage budgétaire n&apos;est pas le matériau, mais l&apos;entretien
          négligé&nbsp;: un abri mal posé, jamais ventilé ou jamais lasuré se dégrade et se remplace,
          quel qu&apos;il soit.
        </p>

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">Quel matériau selon votre usage&nbsp;?</h2>
        <p className="content-snippet">
          Le bon réflexe n&apos;est pas «&nbsp;quel est le meilleur matériau&nbsp;», mais «&nbsp;pour
          quoi faire&nbsp;». Pour ranger des outils, le métal&nbsp;; pour un atelier ou une pièce de
          vie, le bois&nbsp;; pour un stockage d&apos;appoint sans contrainte, la résine. Croisez votre
          usage avec le tableau ci-dessous.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Votre usage</th>
              <th>Matériau conseillé</th>
              <th>Pourquoi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rangement outils, tondeuse, vélos</td>
              <td>Métal</td>
              <td>Le moins cher, zéro entretien, résistant au feu et aux insectes</td>
            </tr>
            <tr>
              <td>Atelier, bureau, pièce de vie</td>
              <td>Bois (ou ossature bois)</td>
              <td>Seul matériau isolant&nbsp;; confortable été comme hiver</td>
            </tr>
            <tr>
              <td>Stockage d&apos;appoint, mobilier, piscine</td>
              <td>Résine</td>
              <td>Étanche, imputrescible, aucun entretien</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Un cas mérite d&apos;être isolé&nbsp;: dès que l&apos;abri doit être <em>habité</em> ou
          chauffé — atelier de bricolage utilisé l&apos;hiver, bureau, pièce d&apos;appoint — seuls le
          bois et surtout l&apos;ossature bois isolée tiennent la route. Les kits métal et résine sont
          conçus pour stocker, pas pour vivre dedans.
        </p>

        {/* ════════════ H2.7 ════════════ */}
        <h2 className="content-h2">Abri de jardin&nbsp;: permis, déclaration et taxe d&apos;aménagement</h2>
        <p className="content-snippet">
          Le matériau ne change rien à la règle&nbsp;: c&apos;est la surface qui décide. Aucune
          formalité sous 5&nbsp;m²&nbsp;; déclaration préalable de 5 à 20&nbsp;m²&nbsp;; permis de
          construire au-delà. La taxe d&apos;aménagement s&apos;applique dès qu&apos;on dépasse
          5&nbsp;m² de surface close et couverte de plus de 1,80&nbsp;m sous plafond.
        </p>
        <p className="content-body">
          Les seuils, fixés par le Code de l&apos;urbanisme&nbsp;: en dessous de 5&nbsp;m²
          d&apos;emprise au sol, aucune démarche. De 5 à 20&nbsp;m², une déclaration préalable de
          travaux (formulaire Cerfa 13703) est obligatoire, avec un délai d&apos;instruction d&apos;un
          mois. Au-delà de 20&nbsp;m², il faut un permis de construire. En zone urbaine couverte par un
          PLU, le seuil de déclaration peut monter à 40&nbsp;m² pour une extension accolée. Le détail,
          tranche par tranche et selon la zone, est dans notre{' '}
          <Link href="/guides/permis-cabanon-seuils-2026" className="content-link">guide des permis et déclarations</Link>.
        </p>
        <p className="content-body">
          Côté impôts, la taxe d&apos;aménagement vise toute surface close et couverte de plus de
          5&nbsp;m² dont la hauteur dépasse 1,80&nbsp;m sous plafond. Elle se calcule sur une valeur
          forfaitaire revue chaque année&nbsp;: pour 2026, 892&nbsp;€/m² hors Île-de-France et
          1&nbsp;011&nbsp;€/m² en Île-de-France, multipliée par les taux votés par la commune et le
          département. Certaines communes exonèrent les petits abris&nbsp;: un appel au service
          urbanisme avant de commander peut effacer la note. Nous détaillons le calcul, le montant 2026
          et les cas d&apos;exonération dans notre{' '}
          <Link href="/guides/taxe-abri-jardin-2026" className="content-link">guide de la taxe sur les abris de jardin</Link>.
        </p>

        <PullQuote>
          Base de calcul 2026 de la taxe d&apos;aménagement&nbsp;: <strong>892&nbsp;€/m²</strong> hors Île-de-France, avant les taux locaux.
        </PullQuote>

        {/* ════════════ H2.8 ════════════ */}
        <h2 className="content-h2">Notre verdict&nbsp;: quel matériau choisir&nbsp;?</h2>
        <p className="content-body">
          Il n&apos;y a pas de meilleur abri dans l&apos;absolu, seulement un meilleur abri pour votre
          usage. Pour <strong>ranger</strong> sans y penser et au meilleur prix, prenez le
          <strong> métal</strong>, en finition aspect bois si l&apos;allure compte, et soignez la
          ventilation. Pour un <strong>atelier ou une pièce de vie</strong>, le <strong>bois</strong>{' '}
          est le seul à isoler — et au-delà de quelques mètres carrés, l&apos;ossature bois sur mesure
          le surclasse. Pour un <strong>stockage d&apos;appoint</strong> sans contrainte, la
          <strong> résine</strong> fait le travail. Dans tous les cas, vérifiez la surface avant de
          commander&nbsp;: au-delà de 5&nbsp;m², déclaration et taxe entrent dans l&apos;équation. Et
          si votre projet penche vers un vrai bâtiment bois, autant le{' '}
          <Link href="/cabanon" className="content-link">dimensionner et le chiffrer</Link>{' '}
          précisément dès le départ.
        </p>

        {/* CTA bas */}
        <CTALead projectHref="/cabanon" projectLabel="mon abri de jardin sur mesure" />

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Quel abri de jardin est le plus solide&nbsp;?</h3>
          <p className="content-body">
            Cela dépend moins du matériau que de l&apos;épaisseur. Un abri métal en acier galvanisé de
            forte épaisseur (0,5&nbsp;mm et plus) et un abri bois à parois épaisses (28&nbsp;mm et plus)
            sont tous deux très solides et durent 20 ans ou davantage. À épaisseur faible, les deux
            faiblissent&nbsp;: tôle fine qui se déforme, paroi bois de 12-16&nbsp;mm qui vrille.
            Regardez l&apos;épaisseur annoncée avant le matériau.
          </p>

          <h3 className="content-h3">Quel matériau d&apos;abri de jardin demande le moins d&apos;entretien&nbsp;?</h3>
          <p className="content-body">
            La résine, puis le métal. Une résine ou un PVC se nettoie une à deux fois par an à
            l&apos;eau savonneuse, sans aucun traitement. Le métal demande un nettoyage annuel et un
            point de peinture antirouille si la tôle est rayée. Le bois est le plus exigeant&nbsp;: une
            lasure ou un traitement tous les 2 à 3 ans pour garder sa teinte et sa protection.
          </p>

          <h3 className="content-h3">Quel abri de jardin choisir pour un petit budget&nbsp;?</h3>
          <p className="content-body">
            Le métal. À l&apos;achat, un abri en acier galvanisé est le moins cher des trois matériaux,
            surtout en kit à monter soi-même&nbsp;; on trouve des modèles de rangement de 2 à 8&nbsp;m²
            entre environ 175 et 415&nbsp;€. La contrepartie&nbsp;: isolation faible, condensation
            possible et esthétique industrielle. Pour du simple rangement non chauffé, c&apos;est le
            meilleur rapport prix-durée.
          </p>

          <h3 className="content-h3">Un abri de jardin en métal rouille-t-il&nbsp;? Comment éviter la condensation&nbsp;?</h3>
          <p className="content-body">
            L&apos;acier galvanisé résiste bien à la corrosion (garanties constructeur souvent autour
            de 15 ans), mais la rouille peut démarrer dès qu&apos;une rayure met l&apos;acier à nu, et
            le phénomène s&apos;accélère en bord de mer. Contre la condensation, qui vient de l&apos;air
            humide refroidi la nuit&nbsp;: posez l&apos;abri sur des plots ou une dalle pour le
            surélever, assurez une ventilation haute et basse, et évitez d&apos;y stocker du bois ou du
            linge humides.
          </p>

          <h3 className="content-h3">Quel abri de jardin est imposable ou dispensé de déclaration&nbsp;?</h3>
          <p className="content-body">
            En dessous de 5&nbsp;m² d&apos;emprise au sol, aucune formalité et aucune taxe. De 5 à
            20&nbsp;m², une déclaration préalable (Cerfa 13703) est requise et la taxe d&apos;aménagement
            s&apos;applique. Au-delà de 20&nbsp;m², c&apos;est un permis de construire. La taxe se
            calcule sur une valeur forfaitaire 2026 de 892&nbsp;€/m² hors Île-de-France
            (1&nbsp;011&nbsp;€/m² en IDF) pour les surfaces de plus de 1,80&nbsp;m sous plafond,
            multipliée par les taux locaux&nbsp;; certaines communes exonèrent les abris.
          </p>

          <h3 className="content-h3">Peut-on construire soi-même un abri en bois moins cher qu&apos;un kit&nbsp;?</h3>
          <p className="content-body">
            Oui, si vous êtes équipé et que le projet dépasse quelques mètres carrés. Construire une
            ossature bois sur mesure permet de choisir des sections solides, d&apos;isoler les murs et
            d&apos;adapter les dimensions, souvent pour un coût matériaux maîtrisé. C&apos;est plus
            exigeant qu&apos;un kit à emboîter, mais c&apos;est la seule voie pour un vrai atelier
            isolé. Notre{' '}
            <Link href="/cabanon" className="content-link">simulateur de cabanon</Link>{' '}
            chiffre l&apos;ossature, le bardage et la couverture selon vos dimensions.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/cabanon">Guide du cabanon en ossature bois</Link> — sections, entraxes et construction pas à pas d&apos;un abri bois sur mesure</li>
            <li><Link href="/cabanon">Simulateur de cabanon</Link> — dimensions, matériaux et budget de votre abri en ossature bois</li>
            <li><Link href="/guides/permis-cabanon-seuils-2026">Permis et déclaration pour un abri</Link> — les seuils 5 / 20 / 40 m², Cerfa et zones ABF</li>
            <li><Link href="/guides/taxe-abri-jardin-2026">La taxe d&apos;aménagement d&apos;un abri</Link> — calcul, montant 2026 et cas d&apos;exonération</li>
            <li><Link href="/sources">Sources techniques</Link> — Code de l&apos;urbanisme, service-public, NF EN 335</li>
          </ul>
        </aside>

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 27 juin 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources techniques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
