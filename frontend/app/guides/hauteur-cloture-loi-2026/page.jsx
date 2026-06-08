/* ════════════════════════════════════════════════════════════════════════
   ARTICLE #8 — HAUTEUR DE CLÔTURE : LA LOI 2026
   ────────────────────────────────────────────────────────────────────────
   1er satellite du pilier clôture (gap G2 audit cluster 30/05).
   ANGLE : jurisprudence voisinage + servitude de vue + PLU concret +
   trouble anormal de voisinage (codifié art. 1253 C. civ., loi 2024-346).
   NE PAS faire d'info pure « hauteur légale » (Service-Public domine) —
   creuser le litige, le PLU réel, le recours. Anti-cannibalisation du pilier.

   FACT-CHECK À LA SOURCE PRIMAIRE (relevé du 4 juin 2026) :
     - Pas de hauteur max nationale ........... Service-Public F36503
     - Mur séparatif forcé en ville ........... C. civ. art. 663 (2,60 / 3,20 m, min)
     - Servitude de vue droite ................ C. civ. art. 678 (1,90 m)
     - Servitude de vue oblique ............... C. civ. art. 679 (0,60 m)
     - Plantations / haie ..................... C. civ. art. 671 (2 m / 0,50 m)
     - Trouble anormal de voisinage ........... C. civ. art. 1253 (loi 2024-346
                                                du 15 avril 2024, en vigueur 17/04/2024)
     - Déclaration préalable clôture .......... C. urb. art. R421-12 (4 cas)
     - Conciliation préalable obligatoire ..... CPC art. 750-1 (décret 2023-357)
     - Formulaire DP .......................... Cerfa 13703 (maison individuelle)
     - Droit de se clore ...................... C. civ. art. 647
     - Présomption de mitoyenneté ............. C. civ. art. 653
   ════════════════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Hauteur de clôture : la loi 2026';
const OG_SUBTITLE = 'PLU · servitude de vue · voisinage · recours';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cloture`;

export const metadata = {
  title: 'Hauteur de clôture : ce que dit la loi en 2026',
  description:
    'Hauteur de clôture en 2026 : pourquoi il n’existe pas de maximum légal national, ce qu’impose le PLU, la servitude de vue, le trouble anormal de voisinage (loi 2024) et les recours en cas de litige.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/hauteur-cloture-loi-2026' },
  openGraph: {
    title: 'Hauteur de clôture : ce que dit la loi en 2026 | DIY Builder',
    description:
      'Pas de hauteur maximale nationale : le PLU prime, l’usage local complète, et une clôture trop haute reste attaquable au titre du trouble anormal de voisinage (art. 1253 du Code civil, 2024).',
    url: 'https://www.diy-builder.fr/guides/hauteur-cloture-loi-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Hauteur de clôture et loi 2026 — DIY Builder' }],
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
    { '@type': 'ListItem', position: 4, name: 'Hauteur de clôture : la loi 2026', item: 'https://www.diy-builder.fr/guides/hauteur-cloture-loi-2026' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Hauteur de clôture : ce que dit la loi en 2026',
  description:
    'Règles de hauteur d’une clôture en France : absence de maximum national, rôle du PLU et de l’usage local, servitude de vue, trouble anormal de voisinage codifié en 2024 et voies de recours.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-05',
  dateModified: '2026-06-05',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/hauteur-cloture-loi-2026',
  image: OG_URL,
  about: ['Clôture', 'Droit de voisinage', 'Urbanisme', 'Trouble anormal de voisinage', 'Servitude de vue'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelle hauteur de clôture peut-on faire sans autorisation ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Il n’existe pas de hauteur maximale fixée au niveau national. C’est le plan local d’urbanisme (PLU) de votre commune, à défaut la carte communale ou l’usage local, qui fixe la limite — souvent 2 mètres. Une déclaration préalable n’est obligatoire que si la commune l’a décidé par délibération ou si vous êtes en secteur protégé (article R421-12 du Code de l’urbanisme). Ailleurs, aucune formalité n’est exigée.' },
    },
    {
      '@type': 'Question',
      name: 'Une clôture de 2 mètres est-elle autorisée partout en France ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Non. Les 2 mètres sont un usage très répandu, pas une règle nationale. Beaucoup de PLU plafonnent plus bas, en particulier à l’alignement sur rue (souvent 1,50 m pour la visibilité), tout en autorisant 2 m entre voisins. Avant de commander vos lames, consultez le règlement de votre PLU en mairie ou sur le Géoportail de l’urbanisme.' },
    },
    {
      '@type': 'Question',
      name: 'Mon voisin peut-il m’obliger à baisser ma clôture ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui dans deux cas. Si la clôture dépasse la hauteur autorisée par le PLU, la mairie peut exiger sa mise en conformité. Et même conforme au PLU, elle peut être condamnée par un juge si elle crée un trouble anormal de voisinage — par exemple une perte durable d’ensoleillement. Depuis la loi du 15 avril 2024 (article 1253 du Code civil), cette responsabilité est de plein droit, et le juge peut ordonner la réduction de hauteur ou la démolition.' },
    },
    {
      '@type': 'Question',
      name: 'Un brise-vue de 2 mètres est-il légal ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui en principe. Tout propriétaire a le droit de se clore (article 647 du Code civil), y compris avec une clôture pleine ou occultante. Les deux limites sont le PLU (qui peut plafonner la hauteur) et le trouble anormal de voisinage (un brise-vue qui prive le voisin de lumière peut être contesté). En revanche, la servitude de vue ne s’applique pas à une clôture : elle vise les fenêtres et balcons.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle distance respecter pour une haie en limite de propriété ?',
      acceptedAnswer: { '@type': 'Answer', text: 'À défaut de règlement ou d’usage local, l’article 671 du Code civil impose 0,50 m de la limite séparative pour une haie ou plantation d’au plus 2 mètres de haut, et 2 mètres de distance pour les plantations qui dépassent 2 mètres. La distance se mesure depuis le milieu du tronc. Une plante palissée contre le mur séparatif échappe à cette règle si elle ne dépasse pas le mur.' },
    },
    {
      '@type': 'Question',
      name: 'Qui paie la clôture entre deux maisons ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Tout dépend de son implantation. Posée en retrait sur votre terrain, la clôture est privative : vous la financez et l’entretenez seul. Posée exactement sur la limite séparative, elle est présumée mitoyenne (article 653 du Code civil) : frais de construction et d’entretien sont partagés. En ville, l’article 663 permet même de contraindre un voisin à participer à la clôture séparant les propriétés.' },
    },
    {
      '@type': 'Question',
      name: 'La servitude de vue limite-t-elle la hauteur de ma clôture ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Non. La servitude de vue ne concerne pas la clôture mais les ouvertures. Vous ne pouvez pas créer une vue droite (fenêtre, balcon) à moins de 1,90 m de la limite (article 678 du Code civil), ni une vue oblique à moins de 0,60 m (article 679). Une clôture pleine, elle, relève du droit de se clore : elle peut au contraire servir à supprimer une vue gênante.' },
    },
    {
      '@type': 'Question',
      name: 'La hauteur autorisée est-elle différente côté rue ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Souvent oui. De nombreux PLU distinguent la clôture sur voie publique de la clôture entre voisins, et plafonnent la première plus bas pour préserver la visibilité aux carrefours et l’harmonie de la rue (typiquement 1,50 m, parfois sous forme de muret bas surmonté d’une grille). La hauteur en limite séparative reste généralement plus permissive. Seul le règlement de votre commune fait foi.' },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une déclaration préalable pour une clôture, et en combien de temps ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Seulement dans quatre cas (article R421-12 du Code de l’urbanisme) : secteur sauvegardé ou abords d’un monument historique, site classé ou inscrit, secteur délimité par le PLU, ou commune ayant décidé d’y soumettre les clôtures par délibération. Le cas échéant, vous déposez un formulaire Cerfa 13703 ; le délai d’instruction est d’un mois, porté à deux mois en secteur protégé (avis de l’Architecte des Bâtiments de France).' },
    },
  ],
};

export default function HauteurClotureLoi2026Page() {
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
          <span className="content-breadcrumb-current">Hauteur de clôture : la loi 2026</span>
        </nav>

        <h1 className="content-h1">
          Hauteur de clôture : ce que dit vraiment la loi en 2026
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 5 juin 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources juridiques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/hauteur-cloture-loi-2026/hero.png"
            alt="Clôture bois en limite de propriété entre deux jardins pavillonnaires français, lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          En France, aucune loi ne fixe une hauteur de clôture maximale au niveau national. C&apos;est
          le plan local d&apos;urbanisme (PLU) qui décide, à défaut la carte communale ou l&apos;usage
          local — souvent 2&nbsp;mètres, parfois 1,50&nbsp;m côté rue. Et même conforme au PLU, une
          clôture trop haute reste attaquable si elle prive le voisin d&apos;ensoleillement ou de vue,
          au titre du trouble anormal de voisinage, inscrit dans le Code civil depuis avril 2024. Ce
          guide démêle ce qui est autorisé, ce qui se déclare et ce qui se conteste.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Pas de hauteur maximale nationale&nbsp;: le PLU prime, puis la carte communale ou l&apos;usage local.</li>
            <li>À défaut de règle locale, un mur séparatif en ville suit l&apos;article 663 du Code civil&nbsp;: 2,60&nbsp;m, ou 3,20&nbsp;m dans les communes de 50&nbsp;000 habitants et plus (ce sont des minimums, pas des plafonds).</li>
            <li>Déclaration préalable obligatoire seulement dans 4 cas (art. R421-12)&nbsp;; sinon, aucune formalité.</li>
            <li>Une clôture peut être réduite ou démolie en justice si elle crée un trouble anormal de voisinage — art. 1253 du Code civil, loi du 15 avril 2024.</li>
            <li>Avant le tribunal, une tentative de conciliation est obligatoire (art. 750-1 du Code de procédure civile).</li>
          </ul>
        </div>

        {/* CTA 1 — fin intro */}
        <CTALead projectHref="/cloture" projectLabel="ma clôture" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">1. Existe-t-il une hauteur de clôture légale en France&nbsp;? Non.</h2>
        <p className="content-snippet">
          Il n&apos;y a pas de hauteur maximale nationale pour une clôture. La règle vient
          d&apos;abord du PLU de votre commune, à défaut de la carte communale ou de l&apos;usage
          local. Beaucoup de communes plafonnent à 2&nbsp;m, certaines à 1,50&nbsp;m côté rue. À
          défaut de toute règle locale, le Code civil ne fixe qu&apos;un minimum pour les murs en
          ville, jamais un plafond.
        </p>
        <p className="content-body">
          C&apos;est le malentendu le plus tenace en matière de clôture. On lit partout «&nbsp;2&nbsp;mètres
          maximum&nbsp;» comme si c&apos;était une loi&nbsp;: ce n&apos;en est pas une. Le service public
          le confirme noir sur blanc — la réglementation française ne prévoit pas de hauteur maximale
          pour une clôture. Le point de départ, c&apos;est au contraire un droit&nbsp;: «&nbsp;Tout
          propriétaire peut clore son héritage&nbsp;» (article 647 du Code civil). Vous avez donc le
          droit de vous clore&nbsp;; ce sont les règles locales qui viennent l&apos;encadrer.
        </p>
        <p className="content-body">
          La hauteur autorisée se lit dans cet ordre&nbsp;: le règlement du PLU d&apos;abord, puis la
          carte communale, puis l&apos;usage local constaté dans le quartier. Les fameux 2&nbsp;mètres
          sont précisément cela — un usage très répandu, pas un texte national. Tant que vous restez
          sous le plafond fixé localement, vous êtes dans votre droit.
        </p>
        <p className="content-body">
          Le seul chiffre national, c&apos;est un minimum, pas un maximum, et il ne concerne que les
          murs séparatifs en ville. L&apos;
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006430068" target="_blank" rel="noopener noreferrer" className="content-link">article 663 du Code civil</a>{' '}
          prévoit qu&apos;à défaut d&apos;usages et de règlements, un mur de séparation construit entre
          voisins doit atteindre au moins&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Type de commune</th>
              <th>Hauteur minimale du mur séparatif (chaperon compris)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Moins de 50&nbsp;000 habitants</td>
              <td>2,60&nbsp;m</td>
            </tr>
            <tr>
              <td>50&nbsp;000 habitants et plus</td>
              <td>3,20&nbsp;m</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Lisez bien&nbsp;: ce sont des hauteurs <strong>minimales</strong>. L&apos;article 663 sert à
          obliger un voisin réticent à participer à la clôture qui sépare deux propriétés en ville —
          la «&nbsp;clôture forcée&nbsp;». Il ne dit pas «&nbsp;vous avez le droit de monter à
          3,20&nbsp;m partout&nbsp;». Confondre ce minimum de contribution avec un plafond de
          construction est l&apos;erreur classique qui circule sur les forums. Pour savoir jusqu&apos;où
          vous pouvez réellement monter, il n&apos;y a qu&apos;une source&nbsp;: votre PLU.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">2. Ce que votre PLU peut imposer (et où le lire)</h2>
        <p className="content-snippet">
          Le PLU peut fixer une hauteur maximale (souvent 1,80 à 2&nbsp;m), distinguer la limite sur
          rue de la limite entre voisins, imposer un muret surmonté d&apos;une grille, et même
          encadrer matériaux et teintes. On le consulte gratuitement en mairie ou sur le Géoportail
          de l&apos;urbanisme, avant d&apos;acheter quoi que ce soit.
        </p>
        <p className="content-body">
          Le règlement d&apos;un PLU consacre presque toujours un passage aux clôtures — parfois un
          article dédié, parfois noyé dans l&apos;article sur l&apos;aspect extérieur des constructions.
          Ce qu&apos;on y trouve va bien au-delà d&apos;un simple chiffre de hauteur. Un règlement type
          encadre plusieurs choses à la fois&nbsp;:
        </p>
        <ul className="content-body">
          <li><strong>La hauteur</strong>, souvent différenciée&nbsp;: par exemple 1,50&nbsp;m à l&apos;alignement sur la voie publique et 2&nbsp;m en limite séparative entre voisins.</li>
          <li><strong>La composition</strong>&nbsp;: muret bas (mur bahut) de 0,40 à 0,80&nbsp;m surmonté d&apos;un dispositif à claire-voie ou d&apos;une grille, plutôt qu&apos;un mur plein de 2&nbsp;m d&apos;un seul tenant.</li>
          <li><strong>Les matériaux et couleurs</strong>&nbsp;: certaines communes proscrivent les plaques de béton brut ou les teintes vives pour préserver l&apos;unité de la rue.</li>
          <li><strong>La visibilité</strong> aux angles et sorties&nbsp;: un pan coupé ou une hauteur réduite peut être exigé près d&apos;un carrefour.</li>
        </ul>
        <p className="content-body">
          Pour consulter ces règles sans vous déplacer, le{' '}
          <a href="https://www.geoportail-urbanisme.gouv.fr/" target="_blank" rel="noopener noreferrer" className="content-link">Géoportail de l&apos;urbanisme</a>{' '}
          met en ligne la plupart des PLU&nbsp;: vous tapez votre adresse, vous repérez votre zone (UA,
          UB, N…) puis vous ouvrez le règlement de cette zone. Si le document n&apos;y est pas encore
          téléversé, le service urbanisme de la mairie vous le communique gratuitement. Et si votre
          terrain se trouve dans le périmètre des abords d&apos;un monument historique, ajoutez une
          étape&nbsp;: l&apos;avis de l&apos;Architecte des Bâtiments de France devient obligatoire, et
          il peut imposer ses propres contraintes de hauteur, de matériau et de teinte.
        </p>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">3. Faut-il une déclaration préalable pour une clôture&nbsp;?</h2>
        <p className="content-snippet">
          Pas toujours. Une déclaration préalable n&apos;est obligatoire que dans quatre cas (
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034355392" target="_blank" rel="noopener noreferrer" className="content-link">article R421-12 du Code de l&apos;urbanisme</a>
          )&nbsp;: abords d&apos;un monument historique ou site patrimonial, site classé ou inscrit,
          secteur délimité par le PLU, ou commune ayant décidé d&apos;y soumettre les clôtures par
          délibération. Partout ailleurs, aucune formalité.
        </p>
        <p className="content-body">
          Contrairement à une idée reçue, poser une clôture ne déclenche pas automatiquement une
          démarche en mairie. La déclaration préalable est l&apos;exception, déclenchée par la
          situation du terrain ou par un choix de la commune. Voici les cas où elle s&apos;impose.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Votre situation</th>
              <th>Déclaration préalable&nbsp;?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Commune sans délibération, hors zone protégée</td>
              <td>Non — aucune formalité</td>
            </tr>
            <tr>
              <td>Commune ayant délibéré pour soumettre les clôtures à déclaration</td>
              <td>Oui — Cerfa 13703</td>
            </tr>
            <tr>
              <td>Secteur délimité par le PLU</td>
              <td>Oui</td>
            </tr>
            <tr>
              <td>Abords d&apos;un monument historique / site patrimonial remarquable</td>
              <td>Oui + avis de l&apos;ABF</td>
            </tr>
            <tr>
              <td>Site classé ou inscrit</td>
              <td>Oui</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Quand elle est exigée, la déclaration se fait avec le formulaire Cerfa&nbsp;13703 (maison
          individuelle et ses annexes). Le délai d&apos;instruction est d&apos;un mois&nbsp;; sans
          réponse de la mairie à son terme, l&apos;accord est tacite. Comptez deux mois si le projet
          passe par l&apos;Architecte des Bâtiments de France. Le réflexe à garder&nbsp;: un coup de
          téléphone au service urbanisme avant de commander les matériaux tranche la question en cinq
          minutes, et vous évite de découvrir l&apos;obligation après avoir reçu vos lames.
        </p>

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">4. Clôture privative ou mitoyenne&nbsp;: qui décide de la hauteur&nbsp;?</h2>
        <p className="content-snippet">
          Posée en retrait sur votre terrain, la clôture est privative&nbsp;: dans les limites du PLU,
          vous décidez seul de sa hauteur, vous la financez et l&apos;entretenez. Posée exactement sur
          la limite séparative, elle est présumée mitoyenne (article 653 du Code civil)&nbsp;: hauteur,
          coût et entretien se partagent, et l&apos;accord écrit du voisin évite le litige.
        </p>
        <p className="content-body">
          La hauteur ne se négocie pas de la même façon selon l&apos;endroit où vous plantez vos
          poteaux. Quelques centimètres en retrait de la limite changent tout le régime juridique.
        </p>
        <p className="content-body">
          Si vous implantez la clôture entièrement sur votre parcelle, ne serait-ce qu&apos;à quelques
          centimètres à l&apos;intérieur, elle est <strong>privative</strong>. Vous en êtes seul
          maître&nbsp;: hauteur (dans la limite du PLU), style, financement, entretien. Le voisin
          n&apos;a pas son mot à dire sur l&apos;apparence côté votre terrain. C&apos;est la solution la
          plus simple pour éviter les discussions, et c&apos;est souvent ce que recommande l&apos;agent
          d&apos;urbanisme en mairie quand on l&apos;interroge.
        </p>
        <p className="content-body">
          Posée pile sur la ligne séparative et servant les deux fonds, la clôture devient{' '}
          <strong>mitoyenne</strong>. L&apos;article 653 du Code civil présume mitoyen tout mur de séparation
          entre cours, jardins ou bâtiments. Concrètement, la hauteur, les frais de construction et l&apos;entretien
          se partagent à parts égales, et chaque voisin a voix au chapitre. En ville, l&apos;article 663
          va plus loin&nbsp;: il permet de contraindre un voisin à participer à la clôture séparant les
          deux fonds. Avant de bâtir une clôture mitoyenne, un accord écrit — même une simple lettre
          contresignée — vaut bien mieux qu&apos;une parole&nbsp;: il fixe la hauteur, le partage des
          frais et qui entretient quoi.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">5. La servitude de vue&nbsp;: le vrai piège, et ce n&apos;est pas la hauteur</h2>
        <p className="content-snippet">
          La servitude de vue ne concerne pas la hauteur de la clôture mais les ouvertures. On ne peut
          pas créer une fenêtre ou un balcon à vue droite à moins de 1,90&nbsp;m de la limite (
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006430226" target="_blank" rel="noopener noreferrer" className="content-link">article 678 du Code civil</a>
          ), ni une vue oblique à moins de 0,60&nbsp;m (article 679). Une clôture pleine, elle, relève
          du droit de se clore.
        </p>
        <p className="content-body">
          Beaucoup de gens croient qu&apos;une clôture haute «&nbsp;viole la servitude de vue&nbsp;» du
          voisin. C&apos;est l&apos;inverse. La servitude de vue protège l&apos;intimité en interdisant
          d&apos;ouvrir une vue sur le terrain d&apos;à côté, pas en garantissant une vue depuis chez
          soi. Elle vise les <strong>ouvertures</strong> — fenêtres, baies, balcons, terrasses
          surélevées — et fixe deux distances minimales à respecter par rapport à la limite&nbsp;:
        </p>
        <ul className="content-body">
          <li><strong>1,90&nbsp;m</strong> pour une vue droite, c&apos;est-à-dire une ouverture face à la propriété voisine (article 678).</li>
          <li><strong>0,60&nbsp;m</strong> pour une vue oblique ou de côté, qui exige de tourner la tête pour apercevoir le fonds voisin (article 679).</li>
        </ul>
        <p className="content-body">
          Une clôture pleine, un panneau occultant ou un brise-vue ne créent aucune vue&nbsp;: ils en
          suppriment une. Ils relèvent donc du droit de se clore, pas de la servitude de vue. La
          conséquence pratique est utile à connaître&nbsp;: si le voisin a une fenêtre qui plonge chez
          vous, vous pouvez en principe ériger une clôture pour vous protéger des regards — sous
          réserve, toujours, du PLU et de ce qui suit sur le trouble anormal de voisinage.
        </p>

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">6. Quand une clôture conforme devient un trouble anormal de voisinage</h2>
        <p className="content-snippet">
          Même autorisée par le PLU, une clôture peut être condamnée si elle dépasse les inconvénients
          normaux du voisinage — par exemple en privant durablement le voisin de soleil. Depuis la loi
          du 15 avril 2024, ce principe est inscrit à l&apos;
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049423788" target="_blank" rel="noopener noreferrer" className="content-link">article 1253 du Code civil</a>
          &nbsp;: responsabilité de plein droit, sans faute à prouver.
        </p>
        <p className="content-body">
          C&apos;est le point que les guides de bricolage oublient, et c&apos;est pourtant le plus
          décisif. Le respect du PLU ne vous met pas à l&apos;abri d&apos;un procès. Un juge peut
          condamner une clôture parfaitement réglementaire si elle cause à un voisin un préjudice qui
          dépasse ce qu&apos;on doit normalement supporter entre voisins — typiquement une perte
          d&apos;ensoleillement ou de lumière sérieuse et permanente sur une pièce de vie ou un jardin.
        </p>
        <p className="content-body">
          Cette règle a longtemps été une construction des tribunaux. La doctrine remonte à un arrêt
          célèbre de 1915&nbsp;: un propriétaire avait dressé d&apos;immenses carcasses de bois hérissées
          de pointes dans le seul but de nuire à son voisin, et la Cour de cassation a confirmé sa
          condamnation pour abus de droit. Depuis, on ne peut pas construire «&nbsp;pour embêter&nbsp;».
          La <strong>loi du 15 avril 2024</strong> a franchi une étape supplémentaire en codifiant le
          principe&nbsp;: l&apos;article 1253 du Code civil dispose désormais que celui qui est à
          l&apos;origine d&apos;un trouble «&nbsp;excédant les inconvénients normaux de voisinage&nbsp;»
          est «&nbsp;responsable de plein droit du dommage qui en résulte&nbsp;». Autrement dit, la
          victime n&apos;a plus à démontrer une faute&nbsp;: il lui suffit de prouver le caractère
          anormal du trouble.
        </p>
        <p className="content-body">
          Ce que le juge regarde concrètement&nbsp;: l&apos;ampleur de la gêne (combien d&apos;heures de
          soleil perdues, sur quelle surface), sa permanence, l&apos;antériorité de chacun sur les
          lieux, et l&apos;intention éventuelle de nuire. La sanction n&apos;est pas symbolique&nbsp;:
          réduction de la hauteur, démolition pure et simple, ou dommages-intérêts. Une clôture peut
          donc être à la fois autorisée par la mairie et condamnée par le tribunal. La hauteur «&nbsp;dans
          les clous&nbsp;» n&apos;est pas un blanc-seing.
        </p>

        {/* ════════════ H2.7 ════════════ */}
        <h2 className="content-h2">7. Litige sur la hauteur&nbsp;: les recours, dans l&apos;ordre</h2>
        <p className="content-snippet">
          Réglez d&apos;abord à l&apos;amiable, par lettre recommandée. En cas d&apos;échec, une
          tentative de conciliation (conciliateur de justice, gratuit) est obligatoire avant de saisir
          le tribunal judiciaire pour un trouble anormal de voisinage ou un litige jusqu&apos;à
          5&nbsp;000&nbsp;€ (
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039501708" target="_blank" rel="noopener noreferrer" className="content-link">article 750-1 du Code de procédure civile</a>
          ). Le juge peut ordonner la démolition.
        </p>
        <p className="content-body">
          Un conflit de clôture se règle rarement au premier courrier, mais sauter les étapes coûte du
          temps et de l&apos;argent. L&apos;ordre des recours est balisé.
        </p>
        <ol className="content-body">
          <li><strong>Le dialogue, puis l&apos;écrit.</strong> Une discussion directe règle la majorité des cas. Si elle échoue, envoyez une lettre recommandée avec accusé de réception exposant le problème et la solution attendue — elle date votre démarche et sert de preuve par la suite.</li>
          <li><strong>Le conciliateur de justice.</strong> C&apos;est gratuit, et c&apos;est désormais une étape obligatoire. L&apos;article 750-1 du Code de procédure civile impose une tentative de conciliation (ou de médiation) avant de saisir le juge pour un trouble anormal de voisinage ou un litige n&apos;excédant pas 5&nbsp;000&nbsp;€, sous peine d&apos;irrecevabilité de la demande. On saisit gratuitement un conciliateur via sa mairie ou en ligne.</li>
          <li><strong>Le tribunal judiciaire.</strong> Si la conciliation échoue, le tribunal du lieu de l&apos;immeuble tranche. Un constat dressé par un commissaire de justice (l&apos;ancien huissier) et, au besoin, une expertise documentent la perte d&apos;ensoleillement ou la non-conformité au PLU. Le juge peut ordonner la mise en conformité, la démolition et des dommages-intérêts.</li>
        </ol>
        <p className="content-body">
          Un repère utile&nbsp;: les dispenses de conciliation préalable existent (urgence manifeste,
          ou indisponibilité d&apos;un conciliateur dans un délai de trois mois), mais elles sont
          d&apos;interprétation stricte. Mieux vaut tenter la conciliation que de voir sa requête
          rejetée pour ne pas l&apos;avoir fait. Et n&apos;attendez pas des années&nbsp;: plus le trouble
          s&apos;installe, plus il devient difficile à faire qualifier d&apos;anormal.
        </p>

        {/* ════════════ H2.8 ════════════ */}
        <h2 className="content-h2">8. Avant de poser&nbsp;: la check-list hauteur en 5 points</h2>
        <p className="content-snippet">
          Cinq vérifications avant de commander&nbsp;: lire le PLU (hauteur, rue contre limite,
          matériaux), vérifier si la commune impose une déclaration, mesurer l&apos;impact sur
          l&apos;ensoleillement du voisin, prévoir l&apos;accord écrit si la clôture est mitoyenne,
          garder une trace écrite des échanges. Le simulateur chiffre ensuite poteaux, rails et lames.
        </p>
        <ol className="content-body">
          <li><strong>Lire le règlement du PLU</strong> pour votre zone&nbsp;: hauteur maximale, distinction rue / limite séparative, matériaux et teintes imposés.</li>
          <li><strong>Vérifier la formalité</strong>&nbsp;: votre commune a-t-elle soumis les clôtures à déclaration préalable&nbsp;? Êtes-vous en secteur protégé&nbsp;? Un appel au service urbanisme suffit.</li>
          <li><strong>Anticiper le voisinage</strong>&nbsp;: une clôture pleine et haute au sud d&apos;un petit jardin voisin est le scénario type du trouble anormal. Évaluez l&apos;ombre portée avant, pas après.</li>
          <li><strong>Choisir privative ou mitoyenne</strong>&nbsp;: en retrait sur votre terrain, vous décidez seul&nbsp;; sur la limite, formalisez un accord écrit avec le voisin.</li>
          <li><strong>Tout garder par écrit</strong>&nbsp;: accord du voisin, échanges avec la mairie, récépissé de déclaration. C&apos;est votre meilleure protection en cas de litige ultérieur.</li>
        </ol>
        <p className="content-body">
          Une fois la hauteur sécurisée juridiquement, reste la partie technique&nbsp;: quelle section
          de poteau, combien de rails selon la hauteur, quel budget. C&apos;est exactement ce que
          calcule notre{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>, et que détaille
          notre{' '}
          <Link href="/guides/cloture" className="content-link">guide complet de pose</Link> — de
          l&apos;ancrage des poteaux classe 4 à la pose des lames avec jeu de dilatation.
        </p>

        {/* CTA 2 — fin article */}
        <CTALead projectHref="/cloture" projectLabel="ma clôture" />

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Quelle hauteur de clôture peut-on faire sans autorisation&nbsp;?</h3>
          <p className="content-body">
            Il n&apos;existe pas de hauteur maximale fixée au niveau national. C&apos;est le plan local
            d&apos;urbanisme (PLU) de votre commune, à défaut la carte communale ou l&apos;usage local,
            qui fixe la limite — souvent 2&nbsp;mètres. Une déclaration préalable n&apos;est obligatoire
            que si la commune l&apos;a décidé par délibération ou si vous êtes en secteur protégé
            (article R421-12 du Code de l&apos;urbanisme). Ailleurs, aucune formalité n&apos;est exigée.
          </p>

          <h3 className="content-h3">Une clôture de 2&nbsp;mètres est-elle autorisée partout en France&nbsp;?</h3>
          <p className="content-body">
            Non. Les 2&nbsp;mètres sont un usage très répandu, pas une règle nationale. Beaucoup de PLU
            plafonnent plus bas, en particulier à l&apos;alignement sur rue (souvent 1,50&nbsp;m pour la
            visibilité), tout en autorisant 2&nbsp;m entre voisins. Avant de commander vos lames,
            consultez le règlement de votre PLU en mairie ou sur le Géoportail de l&apos;urbanisme.
          </p>

          <h3 className="content-h3">Mon voisin peut-il m&apos;obliger à baisser ma clôture&nbsp;?</h3>
          <p className="content-body">
            Oui dans deux cas. Si la clôture dépasse la hauteur autorisée par le PLU, la mairie peut
            exiger sa mise en conformité. Et même conforme au PLU, elle peut être condamnée par un juge
            si elle crée un trouble anormal de voisinage — par exemple une perte durable
            d&apos;ensoleillement. Depuis la loi du 15 avril 2024 (article 1253 du Code civil), cette
            responsabilité est de plein droit, et le juge peut ordonner la réduction de hauteur ou la
            démolition.
          </p>

          <h3 className="content-h3">Un brise-vue de 2&nbsp;mètres est-il légal&nbsp;?</h3>
          <p className="content-body">
            Oui en principe. Tout propriétaire a le droit de se clore (article 647 du Code civil), y
            compris avec une clôture pleine ou occultante. Les deux limites sont le PLU (qui peut
            plafonner la hauteur) et le trouble anormal de voisinage (un brise-vue qui prive le voisin
            de lumière peut être contesté). En revanche, la servitude de vue ne s&apos;applique pas à
            une clôture&nbsp;: elle vise les fenêtres et balcons.
          </p>

          <h3 className="content-h3">Quelle distance respecter pour une haie en limite de propriété&nbsp;?</h3>
          <p className="content-body">
            À défaut de règlement ou d&apos;usage local, l&apos;article 671 du Code civil impose
            0,50&nbsp;m de la limite séparative pour une haie ou plantation d&apos;au plus 2&nbsp;mètres
            de haut, et 2&nbsp;mètres de distance pour les plantations qui dépassent 2&nbsp;mètres. La
            distance se mesure depuis le milieu du tronc. Une plante palissée contre le mur séparatif
            échappe à cette règle si elle ne dépasse pas le mur.
          </p>

          <h3 className="content-h3">Qui paie la clôture entre deux maisons&nbsp;?</h3>
          <p className="content-body">
            Tout dépend de son implantation. Posée en retrait sur votre terrain, la clôture est
            privative&nbsp;: vous la financez et l&apos;entretenez seul. Posée exactement sur la limite
            séparative, elle est présumée mitoyenne (article 653 du Code civil)&nbsp;: frais de
            construction et d&apos;entretien sont partagés. En ville, l&apos;article 663 permet même de
            contraindre un voisin à participer à la clôture séparant les propriétés.
          </p>

          <h3 className="content-h3">La servitude de vue limite-t-elle la hauteur de ma clôture&nbsp;?</h3>
          <p className="content-body">
            Non. La servitude de vue ne concerne pas la clôture mais les ouvertures. Vous ne pouvez pas
            créer une vue droite (fenêtre, balcon) à moins de 1,90&nbsp;m de la limite (article 678 du
            Code civil), ni une vue oblique à moins de 0,60&nbsp;m (article 679). Une clôture pleine,
            elle, relève du droit de se clore&nbsp;: elle peut au contraire servir à supprimer une vue
            gênante.
          </p>

          <h3 className="content-h3">La hauteur autorisée est-elle différente côté rue&nbsp;?</h3>
          <p className="content-body">
            Souvent oui. De nombreux PLU distinguent la clôture sur voie publique de la clôture entre
            voisins, et plafonnent la première plus bas pour préserver la visibilité aux carrefours et
            l&apos;harmonie de la rue (typiquement 1,50&nbsp;m, parfois sous forme de muret bas surmonté
            d&apos;une grille). La hauteur en limite séparative reste généralement plus permissive. Seul
            le règlement de votre commune fait foi.
          </p>

          <h3 className="content-h3">Faut-il une déclaration préalable pour une clôture, et en combien de temps&nbsp;?</h3>
          <p className="content-body">
            Seulement dans quatre cas (article R421-12 du Code de l&apos;urbanisme)&nbsp;: secteur
            sauvegardé ou abords d&apos;un monument historique, site classé ou inscrit, secteur délimité
            par le PLU, ou commune ayant décidé d&apos;y soumettre les clôtures par délibération. Le cas
            échéant, vous déposez un formulaire Cerfa&nbsp;13703&nbsp;; le délai d&apos;instruction est
            d&apos;un mois, porté à deux mois en secteur protégé (avis de l&apos;Architecte des
            Bâtiments de France).
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/cloture">Guide clôture bois complet</Link> — poteaux, rails, lames, ancrage classe 4, budget et pose pas à pas</li>
            <li><Link href="/cloture">Simulateur de clôture</Link> — nombre de poteaux, rails et lames selon votre hauteur, avec comparatif des prix par enseigne</li>
            <li><Link href="/guides/permis-cabanon-seuils-2026">Permis et déclaration préalable au jardin</Link> — les seuils d&apos;urbanisme pour un abri ou un cabanon</li>
            <li><Link href="/guides/comparer-devis-travaux">Comparer les devis travaux</Link> — si vous confiez la pose à un professionnel</li>
            <li><Link href="/sources">Sources juridiques et techniques</Link> — Code civil, Code de l&apos;urbanisme, Service-Public, Légifrance</li>
          </ul>
        </aside>

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 5 juin 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources juridiques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
          <p style={{ fontSize: '0.85em', opacity: 0.7, marginTop: 12 }}>
            Cet article a une visée informative et ne constitue pas un conseil juridique
            personnalisé. Les règles d&apos;urbanisme étant locales, vérifiez toujours le PLU de
            votre commune. En cas de litige, rapprochez-vous d&apos;un conciliateur de justice ou
            d&apos;un professionnel du droit.
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
