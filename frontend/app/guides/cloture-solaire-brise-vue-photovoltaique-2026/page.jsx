import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';
import AffiliatePartnerBlock from '@/components/content/AffiliatePartnerBlock';
import AffiliateInline from '@/components/content/AffiliateInline';

const OG_TITLE = 'Clôture solaire 2026';
const OG_SUBTITLE = 'Brise-vue photovoltaïque · rendement · règles · budget';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=cloture`;

export const metadata = {
  title: 'Clôture solaire : brise-vue photovoltaïque, guide 2026',
  description:
    'Une clôture solaire transforme un brise-vue en producteur d\'électricité. Rendement du vertical bifacial, règles 2026 (kit prise, Consuel) et budget réel.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/cloture-solaire-brise-vue-photovoltaique-2026' },
  openGraph: {
    title: 'Clôture solaire : le brise-vue qui produit de l\'électricité | DIY Builder',
    description:
      'Rendement réel du photovoltaïque vertical (données PVGIS), bifacial est-ouest, règles 2026 du kit à brancher et budget honnête d\'une clôture solaire.',
    url: 'https://www.diy-builder.fr/guides/cloture-solaire-brise-vue-photovoltaique-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Clôture solaire — brise-vue photovoltaïque — DIY Builder' }],
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
    { '@type': 'ListItem', position: 4, name: 'Clôture solaire 2026', item: 'https://www.diy-builder.fr/guides/cloture-solaire-brise-vue-photovoltaique-2026' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Clôture solaire : produire de l\'électricité avec un brise-vue photovoltaïque (2026)',
  description:
    'Rendement du photovoltaïque vertical (PVGIS), bifacial est-ouest, réglementation 2026 du kit à brancher (CACSI Enedis, Consuel) et budget réel d\'une clôture solaire.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-21',
  dateModified: '2026-06-21',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/cloture-solaire-brise-vue-photovoltaique-2026',
  image: OG_URL,
  about: ['Clôture solaire', 'Brise-vue photovoltaïque', 'Photovoltaïque vertical', 'Autoconsommation'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Une clôture solaire produit-elle vraiment de l\'électricité utile ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, mais moins qu\'une toiture. Selon l\'outil PVGIS de la Commission européenne (relevé de juin 2026), un panneau vertical plein sud produit environ 766 kWh/kWc/an à Lille, 878 à Lyon et 1 088 à Marseille, soit 28 à 32 % de moins qu\'une toiture inclinée à 30-35°. Un module bifacial de 380 Wc fournit donc de l\'ordre de 290 à 410 kWh par an. C\'est utile pour réduire une facture, pas pour viser l\'autonomie.' },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une déclaration pour installer une clôture solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Deux déclarations distinctes. Côté électrique, toute installation en autoconsommation exige une convention d\'autoconsommation sans injection (CACSI) auprès d\'Enedis, gratuite, même si vous ne revendez aucun surplus. Côté urbanisme, une clôture peut exiger une déclaration préalable de travaux en mairie si le plan local d\'urbanisme l\'impose ou en secteur protégé : vérifiez votre PLU avant de commander.' },
    },
    {
      '@type': 'Question',
      name: 'Faut-il une attestation Consuel pour une clôture solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pas toujours. Un kit à brancher assemblé en usine, d\'une puissance inférieure ou égale à 3 kVA, sans batterie et conforme à la norme NF EN 50549-1-4, est dispensé de l\'attestation Consuel. Dès qu\'il y a une batterie, une modification du circuit électrique fixe, ou un dépassement de seuil, l\'attestation Consuel visa Bleu redevient obligatoire (201,17 € TTC en 2026).' },
    },
    {
      '@type': 'Question',
      name: 'Vaut-il mieux orienter une clôture solaire au sud ou est-ouest ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le sud maximise le total annuel ; l\'est-ouest maximise l\'autoconsommation. Une clôture bifaciale est-ouest produit sur ses deux faces, avec un pic le matin (face est) et un pic le soir (face ouest), au lieu d\'un pic unique de midi. Ce profil colle mieux à la consommation d\'un foyer (petit-déjeuner et retour du travail) — un avantage décisif depuis que le surplus n\'est racheté que 0,011 €/kWh.' },
    },
    {
      '@type': 'Question',
      name: 'Une clôture solaire est-elle rentable en 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sa rentabilité tient à l\'autoconsommation, pas à la revente. Depuis l\'arrêté tarifaire du 4 juin 2026, le surplus injecté n\'est racheté que 0,011 €/kWh, contre 0,1940 €/kWh pour l\'électricité achetée (tarif réglementé Base 6 kVA, février 2026) : chaque kWh consommé sur place vaut près de dix-huit fois un kWh revendu. Une clôture solaire se justifie quand vous deviez de toute façon poser un brise-vue et que vous consommez en journée.' },
    },
    {
      '@type': 'Question',
      name: 'Peut-on poser une clôture solaire soi-même ?',
      acceptedAnswer: { '@type': 'Answer', text: 'La partie clôture (poteaux, panneaux) se monte soi-même comme un brise-vue classique. La partie électrique d\'un kit à brancher se limite à un branchement sur prise dédiée. En revanche, dès qu\'on raccorde sur le tableau, qu\'on ajoute une batterie ou qu\'on vend le surplus, le câblage relève d\'un électricien et l\'attestation Consuel devient nécessaire. Et la déclaration Enedis reste obligatoire dans tous les cas.' },
    },
    {
      '@type': 'Question',
      name: 'Combien coûte une clôture solaire au mètre ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Comptez de 192 € (panneau bifacial 380 Wc seul) à 474 € (kit complet avec poteaux aluminium et accessoires) par module d\'environ 1,8 m de large, prix relevés en juin 2026 chez les spécialistes. Une travée de cinq modules (environ 1,9 kWc) revient ainsi de l\'ordre de 1 000 à 2 400 €, selon que vous réutilisez des poteaux existants ou prenez le kit complet, hors raccordement.' },
    },
    {
      '@type': 'Question',
      name: 'La clôture solaire ouvre-t-elle droit à la TVA à 5,5 % ou à une aide ?',
      acceptedAnswer: { '@type': 'Answer', text: 'En autopose, non. La TVA réduite à 5,5 % sur le photovoltaïque (arrêté du 8 septembre 2025) est réservée à une pose par un installateur qualifié et à des modules répondant à des critères environnementaux stricts ; un kit posé soi-même reste à 20 %. Et la prime à l\'autoconsommation a été supprimée par l\'arrêté du 4 juin 2026. Aucune aide nationale ne s\'applique donc à une clôture solaire montée en autoconstruction.' },
    },
  ],
};

export default function ClotureSolairePage() {
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
          <span className="content-breadcrumb-current">Clôture solaire 2026</span>
        </nav>

        <h1 className="content-h1">
          Clôture solaire : produire de l&apos;électricité avec un brise-vue photovoltaïque (2026)
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
            src="/images/guides/cloture-solaire-brise-vue-photovoltaique-2026/hero.png"
            alt="Clôture de jardin faite de panneaux solaires bifaciaux verre-verre montés verticalement entre poteaux aluminium anthracite, le long d'une allée pavillonnaire française en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Une clôture solaire remplace les lames d&apos;un brise-vue par des panneaux
          photovoltaïques verticaux : la limite de propriété produit alors de l&apos;électricité.
          Le rendement vertical reste inférieur à celui d&apos;une toiture — de l&apos;ordre de
          766 kWh/kWc/an à Lille à 1 088 à Marseille plein sud (données PVGIS, juin 2026), soit
          28 à 32&nbsp;% de moins qu&apos;un toit bien incliné. Son intérêt est ailleurs&nbsp;:
          une pose bifaciale est-ouest étale la production sur le matin et le soir, là où un
          foyer consomme — le seul levier qui paie encore depuis que le surplus n&apos;est
          racheté que 0,011&nbsp;€/kWh. Ce guide donne les vrais chiffres, les règles 2026 du
          kit à brancher et un budget sans enjolivure.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Rendement vertical plein sud&nbsp;: ~766 kWh/kWc/an à Lille, ~1 088 à Marseille — 28 à 32&nbsp;% sous une toiture 35° (PVGIS, juin 2026).</li>
            <li>Bifacial est-ouest&nbsp;: deux pics matin/soir au lieu d&apos;un pic de midi, +5 à +15&nbsp;% selon les fabricants — surtout, ça colle à l&apos;autoconsommation.</li>
            <li>Kit à brancher (≤&nbsp;800&nbsp;W par prise, ≤&nbsp;3 kVA, sans batterie)&nbsp;: dispensé de Consuel, mais déclaration CACSI Enedis obligatoire même sans revente.</li>
            <li>Surplus racheté 0,011&nbsp;€/kWh depuis l&apos;arrêté du 4 juin 2026&nbsp;: la clôture solaire ne vaut que pour ce que vous consommez sur place.</li>
            <li>Budget&nbsp;: 192&nbsp;€ (panneau bifacial 380 Wc seul) à 474&nbsp;€ (kit complet avec poteaux alu) par module d&apos;environ 1,8&nbsp;m.</li>
          </ul>
        </div>

        {/* CTA 1 — fin intro */}
        <CTALead projectHref="/cloture" projectLabel="la structure de ma clôture" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">Une clôture solaire, qu&apos;est-ce que c&apos;est — et pour qui&nbsp;?</h2>
        <p className="content-snippet">
          Une clôture solaire est un brise-vue dont les panneaux opaques sont des modules
          photovoltaïques montés verticalement entre des poteaux. Elle a du sens pour qui doit
          de toute façon fermer une limite de propriété, dispose d&apos;un linéaire dégagé
          (idéalement orienté est-ouest) et consomme son électricité en journée. Pour produire
          le plus de kWh par euro, une toiture reste imbattable.
        </p>
        <p className="content-body">
          L&apos;idée vient du monde agricole&nbsp;: des fabricants comme Next2Sun alignent depuis
          des années des rangées de panneaux bifaciaux verticaux entre les champs, qui font à la
          fois clôture et centrale. La version jardin reprend le principe à petite échelle&nbsp;:
          au lieu de lames de bois ou de lames composite, la travée reçoit un module en verre des
          deux côtés, qui masque la vue et capte la lumière. La clôture ne disparaît pas&nbsp;;
          elle gagne une seconde fonction.
        </p>
        <p className="content-body">
          C&apos;est ce double usage qui fait — ou non — l&apos;intérêt du projet. Si vous deviez
          poser un brise-vue de toute manière, le surcoût des panneaux s&apos;amortit sur une
          dépense déjà prévue. Si vous cherchez d&apos;abord à produire, l&apos;argent est mieux
          placé sur un toit ou un{' '}
          <Link href="/guides/carport-solaire-bois-recharger-voiture-electrique-2026" className="content-link">carport solaire pour recharger un véhicule électrique</Link>,
          où l&apos;inclinaison travaille en votre faveur. Le bon candidat, c&apos;est le terrain
          plat avec une limite est-ouest dégagée, un compteur Linky et une consommation diurne —
          télétravail, pompe de piscine, ballon d&apos;eau chaude piloté.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">Combien produit une clôture solaire&nbsp;? Le vrai chiffre du vertical</h2>
        <p className="content-snippet">
          Un panneau vertical plein sud produit environ 766 kWh/kWc/an à Lille, 878 à Lyon et
          1 088 à Marseille (PVGIS, juin 2026) — 28 à 32&nbsp;% de moins qu&apos;une toiture
          inclinée à 35°. Une face tournée à l&apos;est ou à l&apos;ouest tombe à 535–750 kWh,
          environ la moitié d&apos;un toit. Un module bifacial de 380 Wc fournit donc grosso modo
          290 à 410 kWh par an plein sud.
        </p>
        <p className="content-body">
          Les chiffres ci-dessous sortent de{' '}
          <a href="https://re.jrc.ec.europa.eu/pvg_tools/fr/" target="_blank" rel="noopener noreferrer" className="content-link">PVGIS</a>,
          l&apos;outil de la Commission européenne (base JRC), pour 1 kWc, pertes système de
          14&nbsp;%, inclinaison 90° (un panneau de clôture est strictement vertical), relevé de
          juin 2026&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Ville</th>
              <th>Vertical sud (90°)</th>
              <th>Vertical est</th>
              <th>Vertical ouest</th>
              <th>Toiture 35° sud</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lille</td>
              <td>766 kWh/kWc</td>
              <td>539 kWh</td>
              <td>535 kWh</td>
              <td>1 066 kWh</td>
            </tr>
            <tr>
              <td>Lyon</td>
              <td>878 kWh/kWc</td>
              <td>615 kWh</td>
              <td>610 kWh</td>
              <td>1 279 kWh</td>
            </tr>
            <tr>
              <td>Marseille</td>
              <td>1 088 kWh/kWc</td>
              <td>741 kWh</td>
              <td>753 kWh</td>
              <td>1 602 kWh</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Deux choses sautent aux yeux. Le vertical sud coûte un peu moins d&apos;un tiers de
          production par rapport à la toiture optimale — pénalisant, mais pas rédhibitoire si la
          surface est «&nbsp;gratuite&nbsp;» parce qu&apos;elle sert déjà de clôture. Une face est
          ou ouest seule, en revanche, n&apos;atteint que la moitié du rendement d&apos;un toit&nbsp;:
          c&apos;est précisément pour cette raison qu&apos;une clôture est-ouest se monte en
          bifacial, pour additionner les deux demi-faces et récupérer le coup (section suivante).
        </p>
        <p className="content-body">
          Un avertissement honnête, que les fiches produit passent sous silence&nbsp;: ces valeurs
          PVGIS sont des moyennes long terme sans masque. Or une clôture culmine à 1,8 ou 2&nbsp;m.
          À cette hauteur, une haie voisine, une voiture garée le long du grillage, un muret ou le
          mobilier de jardin projettent une ombre une partie de la journée — et sur du
          photovoltaïque, une ombre sur un seul panneau pénalise toute une chaîne reliée au même
          onduleur. À l&apos;usage, la production réelle d&apos;une clôture est presque toujours
          en dessous du tableau. Prévoyez une marge, et un micro-onduleur par panneau si le linéaire
          est exposé aux ombres.
        </p>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">Le bifacial vertical&nbsp;: deux pics qui collent à votre consommation</h2>
        <p className="content-snippet">
          Une clôture bifaciale orientée est-ouest capte le soleil sur ses deux faces&nbsp;: la
          face est produit le matin, la face ouest le soir. Résultat, une courbe à deux bosses
          au lieu d&apos;un pic de midi — un profil qui épouse la consommation d&apos;un foyer
          (réveil, retour du travail) et fait grimper la part autoconsommée, la seule qui compte
          encore en 2026.
        </p>
        <p className="content-body">
          On imagine toujours un panneau plein sud, parce que c&apos;est ce qui maximise le total
          annuel. Sur une clôture, l&apos;orientation est-ouest devient pourtant la plus maligne.
          Un module en verre des deux côtés (bifacial) transforme la lumière reçue à l&apos;avant
          comme à l&apos;arrière&nbsp;: le matin, le soleil frappe la face est&nbsp;; le soir, il
          passe sur la face ouest. Au lieu d&apos;un pic concentré entre 12&nbsp;h et 14&nbsp;h,
          quand la maison est souvent vide, la production se répartit sur les deux moments où l&apos;on
          consomme vraiment.
        </p>
        <p className="content-body">
          Les fabricants spécialisés (Next2Sun en tête) annoncent un gain de 5 à 15&nbsp;% par
          rapport à une installation monofaciale, selon le module et la réflectivité du sol —
          un gravier clair ou une dalle béton sous la clôture renvoie davantage de lumière sur la
          face arrière qu&apos;une pelouse. Ce pourcentage vient de l&apos;industrie, pas d&apos;un
          organisme public&nbsp;: prenez-le comme un ordre de grandeur, pas comme une garantie.
          L&apos;essentiel n&apos;est pas le gain brut, c&apos;est le calage horaire&nbsp;: depuis
          que revendre ne rapporte presque rien, produire au bon moment vaut bien plus que produire
          beaucoup.
        </p>

        {/* CTA milieu */}
        <CTALead projectHref="/cloture" projectLabel="le linéaire et les poteaux de ma clôture" />

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">Kit à brancher ou installation fixe&nbsp;? Les règles 2026</h2>
        <p className="content-snippet">
          Un kit à brancher — assemblé en usine, d&apos;une puissance ≤&nbsp;3 kVA, sans batterie,
          conforme à la norme NF EN 50549-1-4 — est dispensé de l&apos;attestation Consuel, mais
          impose tout de même une déclaration CACSI gratuite à Enedis, même sans revendre un seul
          kilowattheure. Dès qu&apos;on ajoute une batterie, qu&apos;on câble sur le tableau ou
          qu&apos;on vend le surplus, le Consuel visa Bleu redevient obligatoire (201,17&nbsp;€).
        </p>
        <p className="content-body">
          C&apos;est le point où beaucoup de projets dérapent, faute d&apos;avoir lu les bonnes
          règles. Il y a deux régimes, et la frontière tient à la puissance et au mode de
          branchement.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Critère</th>
              <th>Kit à brancher (plug &amp; play)</th>
              <th>Installation fixe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Puissance</td>
              <td>≤ 800 W par prise, ≤ 3 kVA au total</td>
              <td>Au-delà, ou revente du surplus</td>
            </tr>
            <tr>
              <td>Batterie</td>
              <td>Aucune</td>
              <td>Possible (impose le Consuel)</td>
            </tr>
            <tr>
              <td>Consuel</td>
              <td>Dispensé si conforme NF EN 50549-1-4</td>
              <td>Visa Bleu obligatoire — 201,17 € TTC</td>
            </tr>
            <tr>
              <td>Déclaration Enedis</td>
              <td>CACSI obligatoire (gratuite)</td>
              <td>Convention + raccordement</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le premier cas couvre les petites clôtures solaires vendues en{' '}
          <a href="https://www.photovoltaique.info/fr/realiser-une-installation/choix-du-materiel/batteries-stockage-virtuel-et-autres-accesoires/les-kits-solaires-plug-and-play/" target="_blank" rel="noopener noreferrer" className="content-link">kit à brancher</a>&nbsp;:
          un ou deux modules reliés à un micro-onduleur, branchés sur une prise dédiée. Tant
          qu&apos;on reste sous 3 kVA, sans stockage, avec un onduleur certifié, l&apos;attestation
          Consuel n&apos;est pas exigée. Mais la déclaration à Enedis, elle, ne se contourne
          pas&nbsp;: la{' '}
          <a href="https://www.enedis.fr/autoconsommer-la-totalite-de-lenergie-produite-par-vos-panneaux" target="_blank" rel="noopener noreferrer" className="content-link">convention d&apos;autoconsommation sans injection (CACSI)</a>{' '}
          est obligatoire pour toute installation, quelle que soit la puissance, même si vous
          gardez 100&nbsp;% de la production. Elle est gratuite et se fait en ligne.
        </p>
        <p className="content-body">
          Au-delà — plusieurs travées câblées sur le tableau, une batterie, ou la vente du surplus
          — vous basculez dans le régime d&apos;une vraie installation de production&nbsp;:
          attestation Consuel visa Bleu (201,17&nbsp;€ TTC en 2026), convention de raccordement
          et, si vous revendez, contrat d&apos;obligation d&apos;achat. Le détail de ces démarches
          est identique à celui d&apos;un toit&nbsp;: notre{' '}
          <Link href="/guides/pergola-panneaux-solaires-diy-2026" className="content-link">guide des démarches Consuel et Enedis</Link>{' '}
          le déroule pas à pas. Côté mairie, enfin, une clôture peut relever d&apos;une déclaration
          préalable de travaux selon le plan local d&apos;urbanisme&nbsp;: voir nos guides{' '}
          <Link href="/guides/hauteur-cloture-loi-2026" className="content-link">hauteur, PLU et déclaration de clôture</Link>{' '}
          et{' '}
          <Link href="/guides/permis-cabanon-seuils-2026" className="content-link">seuils de déclaration préalable</Link>.
        </p>

        <p className="content-body">
          Ces kits restent rares en France&nbsp;: quelques revendeurs spécialisés les distribuent, comme{' '}
          <AffiliateInline module="cloture-solaire">Woodstore24, du panneau seul au kit avec poteaux</AffiliateInline>.
          Le raccordement, lui, suit les règles ci-dessus.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">Intégrer le photovoltaïque à une clôture&nbsp;: structure et prise au vent</h2>
        <p className="content-snippet">
          Une clôture solaire est bien plus lourde et bien moins ajourée qu&apos;un brise-vue à
          lames&nbsp;: les modules verre-verre forment un mur plein sur lequel le vent pousse.
          Poteaux et fondations se dimensionnent en conséquence, plus près d&apos;un carport que
          d&apos;une claire-voie. Les kits livrés avec poteaux aluminium gèrent cette contrainte&nbsp;;
          une clôture bois existante doit être renforcée.
        </p>
        <p className="content-body">
          Une clôture classique laisse passer l&apos;air entre les lames, ou au moins par le jeu de
          dilatation. Un panneau plein, lui, oppose toute sa surface au vent&nbsp;: l&apos;effort
          repris par les poteaux n&apos;a rien à voir. Un module bifacial verre-verre pèse aussi
          son poids — couramment 10 à 15&nbsp;kg — et impose des fixations sérieuses. C&apos;est la
          même logique structurelle que pour une toiture de carport pleine&nbsp;: ce qui change
          tout, c&apos;est la prise au vent, pas le poids seul.
        </p>
        <p className="content-body">
          Concrètement, deux voies. Les kits dédiés arrivent avec des poteaux aluminium et une
          visserie calculés pour des panneaux&nbsp;: c&apos;est la solution sans calcul, l&apos;alu
          ne rouille pas et l&apos;ensemble est prévu pour. Si vous partez d&apos;une ossature bois,
          il faut des poteaux costauds (au moins du 90×90&nbsp;mm classe 4), un entraxe resserré et
          des fondations béton hors-gel dignes de ce nom — le dimensionnement d&apos;une clôture
          porteuse classique, que notre{' '}
          <Link href="/cloture" className="content-link">simulateur de clôture</Link>{' '}
          chiffre poteau par poteau, et que le{' '}
          <Link href="/guides/cloture" className="content-link">guide complet de la clôture bois</Link>{' '}
          détaille pour l&apos;ancrage. Le hic, c&apos;est qu&apos;une clôture bois conçue pour des
          lames ajourées n&apos;est presque jamais taillée pour un mur plein de panneaux&nbsp;:
          mieux vaut la dimensionner solaire dès le départ que rajouter des modules sur l&apos;existant.
        </p>

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">Budget et rentabilité&nbsp;: la vérité 2026</h2>
        <p className="content-snippet">
          Comptez 192&nbsp;€ (panneau bifacial 380 Wc seul) à 474&nbsp;€ (kit complet avec poteaux)
          par module&nbsp;; une travée de cinq modules (~1,9 kWc) revient de l&apos;ordre de 1 000
          à 2 400&nbsp;€. Avec un surplus racheté 0,011&nbsp;€/kWh, la rentabilité dépend
          entièrement de l&apos;autoconsommation — et au rendement modeste, souvent ombragé,
          d&apos;une clôture, c&apos;est un projet d&apos;usage avant d&apos;être un placement.
        </p>
        <p className="content-body">
          Les prix relevés en juin 2026 chez les spécialistes vont de 192&nbsp;€ pour un panneau
          bifacial 380 Wc seul à 474&nbsp;€ pour un kit complet livré avec poteaux aluminium et
          accessoires, par module d&apos;environ 1,8&nbsp;m de large. Une travée de cinq modules,
          soit à peu près 1,9 kWc, se situe donc autour de 1 000 à 2 400&nbsp;€ selon que vous
          réutilisez des poteaux ou prenez le kit clé en main — hors raccordement et hors
          éventuel électricien.
        </p>
        <p className="content-body">
          Reste la question qui fâche&nbsp;: est-ce que ça se rembourse&nbsp;? Le calcul a changé de
          nature en 2026. Chaque kWh que vous consommez sur place vous évite d&apos;acheter au tarif
          réglementé, 0,1940&nbsp;€/kWh (Base 6 kVA, grille du 1ᵉʳ février 2026)&nbsp;; chaque kWh
          injecté sur le réseau ne vous rapporte que 0,011&nbsp;€/kWh depuis l&apos;arrêté du 4 juin
          2026. L&apos;écart est de 1 à 18&nbsp;: autoconsommer vaut près de dix-huit fois plus que
          revendre. Une clôture qui produit 1 500 kWh par an, autoconsommés à 70&nbsp;%, fait
          gagner de l&apos;ordre de 200&nbsp;€ par an&nbsp;; les 30&nbsp;% injectés rapportent
          quelques euros, autant dire rien. Sur ces bases, l&apos;amortissement se compte en
          quinze ans ou plus — sauf si la clôture était de toute façon au budget, auquel cas seul
          le surcoût des panneaux est à amortir, et le calcul redevient favorable.
        </p>
        <p className="content-body">
          Notre position, la même que pour le{' '}
          <Link href="/guides/carport-solaire-bois-recharger-voiture-electrique-2026" className="content-link">carport solaire</Link>&nbsp;:
          ne posez pas une clôture solaire d&apos;abord pour l&apos;argent. Posez-la parce que vous
          vouliez un brise-vue et qu&apos;autant qu&apos;il travaille. La rentabilité vient en prime
          quand le projet est sobre et bien autoconsommé, jamais l&apos;inverse.
        </p>

        {/* ─── ENCART « MISE À JOUR » (YMYL) ─── */}
        <div className="content-disclaimer">
          <strong>Mise à jour (juin 2026)&nbsp;:</strong>{' '}
          <a href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054190669" target="_blank" rel="noopener noreferrer" className="content-link">l&apos;arrêté tarifaire S21</a>,
          publié au Journal officiel le 4 juin 2026, supprime la prime à l&apos;autoconsommation et
          ramène le rachat du surplus à 1,1 c€/kWh (0,011&nbsp;€/kWh, contre 0,04&nbsp;€ auparavant)
          pour les installations jusqu&apos;à 9 kWc. Les chiffres de rentabilité de ce guide intègrent
          ce nouveau tarif. La TVA réduite à 5,5&nbsp;% (arrêté du 8 septembre 2025) reste réservée
          à une pose par un professionnel qualifié&nbsp;: une clôture solaire montée soi-même relève
          de la TVA à 20&nbsp;%.
        </div>

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        <div className="content-faq">
          <h3 className="content-h3">Une clôture solaire produit-elle vraiment de l&apos;électricité utile&nbsp;?</h3>
          <p className="content-body">
            Oui, mais moins qu&apos;une toiture. Selon l&apos;outil PVGIS de la Commission européenne
            (relevé de juin 2026), un panneau vertical plein sud produit environ 766 kWh/kWc/an à
            Lille, 878 à Lyon et 1 088 à Marseille, soit 28 à 32&nbsp;% de moins qu&apos;une toiture
            inclinée à 30-35°. Un module bifacial de 380 Wc fournit donc de l&apos;ordre de 290 à
            410 kWh par an. C&apos;est utile pour réduire une facture, pas pour viser
            l&apos;autonomie.
          </p>

          <h3 className="content-h3">Faut-il une déclaration pour installer une clôture solaire&nbsp;?</h3>
          <p className="content-body">
            Deux déclarations distinctes. Côté électrique, toute installation en autoconsommation
            exige une convention d&apos;autoconsommation sans injection (CACSI) auprès d&apos;Enedis,
            gratuite, même si vous ne revendez aucun surplus. Côté urbanisme, une clôture peut
            exiger une déclaration préalable de travaux en mairie si le plan local d&apos;urbanisme
            l&apos;impose ou en secteur protégé&nbsp;: vérifiez votre PLU avant de commander.
          </p>

          <h3 className="content-h3">Faut-il une attestation Consuel pour une clôture solaire&nbsp;?</h3>
          <p className="content-body">
            Pas toujours. Un kit à brancher assemblé en usine, d&apos;une puissance inférieure ou
            égale à 3 kVA, sans batterie et conforme à la norme NF EN 50549-1-4, est dispensé de
            l&apos;attestation Consuel. Dès qu&apos;il y a une batterie, une modification du circuit
            électrique fixe, ou un dépassement de seuil, l&apos;attestation Consuel visa Bleu
            redevient obligatoire (201,17&nbsp;€ TTC en 2026).
          </p>

          <h3 className="content-h3">Vaut-il mieux orienter une clôture solaire au sud ou est-ouest&nbsp;?</h3>
          <p className="content-body">
            Le sud maximise le total annuel&nbsp;; l&apos;est-ouest maximise l&apos;autoconsommation.
            Une clôture bifaciale est-ouest produit sur ses deux faces, avec un pic le matin (face
            est) et un pic le soir (face ouest), au lieu d&apos;un pic unique de midi. Ce profil
            colle mieux à la consommation d&apos;un foyer — un avantage décisif depuis que le
            surplus n&apos;est racheté que 0,011&nbsp;€/kWh.
          </p>

          <h3 className="content-h3">Une clôture solaire est-elle rentable en 2026&nbsp;?</h3>
          <p className="content-body">
            Sa rentabilité tient à l&apos;autoconsommation, pas à la revente. Depuis l&apos;arrêté
            tarifaire du 4 juin 2026, le surplus injecté n&apos;est racheté que 0,011&nbsp;€/kWh,
            contre 0,1940&nbsp;€/kWh pour l&apos;électricité achetée&nbsp;: chaque kWh consommé sur
            place vaut près de dix-huit fois un kWh revendu. Une clôture solaire se justifie quand
            vous deviez de toute façon poser un brise-vue et que vous consommez en journée.
          </p>

          <h3 className="content-h3">Peut-on poser une clôture solaire soi-même&nbsp;?</h3>
          <p className="content-body">
            La partie clôture (poteaux, panneaux) se monte soi-même comme un brise-vue classique.
            La partie électrique d&apos;un kit à brancher se limite à un branchement sur prise
            dédiée. En revanche, dès qu&apos;on raccorde sur le tableau, qu&apos;on ajoute une
            batterie ou qu&apos;on vend le surplus, le câblage relève d&apos;un électricien et
            l&apos;attestation Consuel devient nécessaire. Et la déclaration Enedis reste
            obligatoire dans tous les cas.
          </p>

          <h3 className="content-h3">Combien coûte une clôture solaire au mètre&nbsp;?</h3>
          <p className="content-body">
            Comptez de 192&nbsp;€ (panneau bifacial 380 Wc seul) à 474&nbsp;€ (kit complet avec
            poteaux aluminium et accessoires) par module d&apos;environ 1,8&nbsp;m de large, prix
            relevés en juin 2026 chez les spécialistes. Une travée de cinq modules (environ
            1,9 kWc) revient ainsi de l&apos;ordre de 1 000 à 2 400&nbsp;€, selon que vous
            réutilisez des poteaux existants ou prenez le kit complet, hors raccordement.
          </p>

          <h3 className="content-h3">La clôture solaire ouvre-t-elle droit à la TVA à 5,5&nbsp;% ou à une aide&nbsp;?</h3>
          <p className="content-body">
            En autopose, non. La TVA réduite à 5,5&nbsp;% sur le photovoltaïque (arrêté du
            8 septembre 2025) est réservée à une pose par un installateur qualifié et à des modules
            répondant à des critères environnementaux stricts&nbsp;; un kit posé soi-même reste à
            20&nbsp;%. Et la prime à l&apos;autoconsommation a été supprimée par l&apos;arrêté du
            4 juin 2026. Aucune aide nationale ne s&apos;applique donc à une clôture solaire montée
            en autoconstruction.
          </p>
        </div>

        {/* ════════════ PARTENAIRE AWIN — Woodstore24 (clôture solaire PV) ════════════ */}
        <p className="content-affiliate-disclo">
          <strong>Transparence affiliation</strong>&nbsp;: le bloc ci-dessous renvoie vers
          Woodstore24 (réseau Awin) par des liens sponsorisés. Si vous achetez via ces liens,
          DIY Builder peut percevoir une commission, sans surcoût pour vous. Ces kits se posent en
          autoconstruction&nbsp;: ils relèvent de la TVA à 20&nbsp;% et n&apos;ouvrent pas la TVA
          réduite réservée à la pose professionnelle. Notre contenu technique reste indépendant —
          voir notre{' '}
          <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>

        <AffiliatePartnerBlock module="cloture-solaire" placement="guide" />

        {/* ════════════ MAILLAGE INTERNE ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/cloture">Guide de la clôture bois</Link> — poteaux, rails, lames, ancrage et budget de la structure porteuse</li>
            <li><Link href="/cloture">Simulateur de clôture</Link> — quantitatifs et budget des poteaux et de l&apos;ossature, poste par poste</li>
            <li><Link href="/guides/hauteur-cloture-loi-2026">Hauteur de clôture et loi 2026</Link> — PLU, mitoyenneté et déclaration préalable avant de poser</li>
            <li><Link href="/guides/cloture-composite-ou-bois">Clôture composite ou bois</Link> — le comparatif prix, durée de vie et entretien des deux autres matières</li>
            <li><Link href="/guides/carport-solaire-bois-recharger-voiture-electrique-2026">Carport solaire bois pour véhicule électrique</Link> — l&apos;autre façon de produire au jardin, avec l&apos;inclinaison en sa faveur</li>
            <li><Link href="/guides/pergola-panneaux-solaires-diy-2026">Pergola + panneaux solaires DIY</Link> — démarches Consuel et Enedis détaillées pas à pas</li>
            <li><Link href="/sources">Sources techniques et juridiques</Link> — PVGIS, CRE, Enedis, Consuel, Légifrance</li>
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
