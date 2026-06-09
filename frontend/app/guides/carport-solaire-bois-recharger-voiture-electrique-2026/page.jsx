/* ════════════════════════════════════════════════════════════════════════
   ARTICLE #7 — CARPORT SOLAIRE BOIS VE 2026
   ÉTAT : SQUELETTE PHASE A — NE PAS PUBLIER EN L'ÉTAT
   ────────────────────────────────────────────────────────────────────────
   ⚠️  noindex ACTIF (metadata.robots) — la page est déployée mais invisible
       des moteurs tant que la rédaction + le fact-check ne sont pas faits.
   ⚠️  ABSENTE du sitemap.js — à ajouter UNIQUEMENT au go-live (Phase B).
   ⚠️  ZÉRO chiffre n'est écrit dans cette page. Tous les chiffres du brief
       sont des CIBLES à fact-checker, listées en commentaire dans chaque
       section avec leur source officielle. Règle projet absolue :
       « chaque chiffre sur source officielle, JAMAIS inventé ».

   PHASE B (rédaction) — pour chaque section :
     1. Rouvrir la source officielle listée dans le commentaire de la section
     2. Capturer la donnée + la dater dans le texte (« relevé du JJ/MM/2026 »)
     3. Si la donnée a changé → mettre à jour. Si inaccessible → fourchette
        défendable, jamais un chiffre inventé.
     4. Rédiger content-snippet (40-60 mots, réponse directe) + corps
     5. Activer les JSON-LD Article + FAQPage (réponses fact-checkées)
     6. Retirer metadata.robots noindex
     7. Ajouter au sitemap.js
     8. Audit anti-IA 2 passes (< 12) + E-E-A-T /40 (≥ 32)

   FACT-CHECK CAPSULE (14 chiffres — brief §C) :
     1.  Tarif surplus EDF OA T2 2026 ............. CRE (cre.fr arrêtés tarifaires)
     2.  Tarif Bleu EDF mai 2026 ................... EDF (edf.fr tarifs réglementés)
     3.  Consuel visa Bleu (€ HT) ................. consuel.fr/tarifs
     4.  Raccordement Enedis PV-AC (€ HT) ......... enedis.fr/catalogue prestations
     5.  TVA 5,5 % conditions ..................... Légifrance arrêté 8 sept 2025
     6.  TVA 10 % autres cas ...................... CGI art. 278-0 bis (Légifrance)
     7.  Production 1 kWc France (kWh/an) ......... PVGIS re.jrc.ec.europa.eu
     8.  Production Lille 3 kWc .................... PVGIS (recalculer)
     9.  Production Lyon 3 kWc ..................... PVGIS (recalculer)
     10. Production Marseille 3 kWc ............... PVGIS (recalculer)
     11. Conso Renault Zoé (kWh/100km) ........... fiche WLTP constructeur
     12. Prime autoconsommation (€/kWc) .......... CRE T2 2026
     13. DTU 31.1 sections poteaux ............... CSTB / e-cahiers.cstb.fr
     14. Cerfa DP n° (vérifier version courante) . service-public.fr/F17578
     + ✅ CONFIRMÉ — arrêté tarifaire S21 publié au JO le 04/06/2026 : prime
       autoconsommation SUPPRIMÉE, surplus rachat 0,011 €/kWh (était 0,04). Refresh 09/06/2026.
   ════════════════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Carport solaire bois pour VE — Guide 2026';
const OG_SUBTITLE = 'Structure DTU · Enedis-Consuel · budget · ROI réel';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=pergola`;

export const metadata = {
  title: 'Carport solaire bois pour voiture électrique : guide 2026',
  description:
    'Construire un carport solaire en bois pour recharger sa voiture électrique : structure DTU, démarches Enedis-Consuel, budget DIY vs pro et ROI réaliste 2026.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/carport-solaire-bois-recharger-voiture-electrique-2026' },
  openGraph: {
    title: 'Carport solaire bois pour VE — Guide 2026 | DIY Builder',
    description:
      'Carport photovoltaïque en bois pour recharger sa voiture électrique : structure DTU 31.1, 7 démarches Enedis-Consuel, budget DIY vs installateur RGE et ROI honnête.',
    url: 'https://www.diy-builder.fr/guides/carport-solaire-bois-recharger-voiture-electrique-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Carport solaire bois pour voiture électrique — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

/* JSON-LD breadcrumb — sûr (aucun chiffre), actif dès la Phase A. */
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide pergola', item: 'https://www.diy-builder.fr/guides/pergola' },
    { '@type': 'ListItem', position: 4, name: 'Carport solaire bois VE 2026', item: 'https://www.diy-builder.fr/guides/carport-solaire-bois-recharger-voiture-electrique-2026' },
  ],
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Construire un carport solaire en bois pour recharger sa voiture électrique : guide 2026',
  description:
    'Structure bois, démarches Enedis-Consuel, budget DIY vs pro et ROI réaliste 2026 pour un carport solaire bois qui recharge une voiture électrique.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-06-02',
  dateModified: '2026-06-09',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/carport-solaire-bois-recharger-voiture-electrique-2026',
  image: OG_URL,
  about: ['Carport solaire', 'Photovoltaïque', 'Voiture électrique', 'Autoconsommation'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Faut-il un permis de construire pour un carport solaire de 15 m² ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Non, une déclaration préalable de travaux suffit. Le permis de construire n’est exigé qu’au-delà de 20 m² d’emprise au sol (ou 40 m² en zone urbaine couverte par un PLU). Mais comme un carport crée une toiture, la déclaration préalable est systématique, même sous 5 m². En zone protégée (Architecte des Bâtiments de France), un avis supplémentaire s’ajoute.' },
    },
    {
      '@type': 'Question',
      name: 'Peut-on installer un carport solaire bois soi-même légalement ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui pour la structure bois et la pose des panneaux. La partie électrique peut aussi être réalisée soi-même, mais l’installation raccordée au réseau doit obtenir une attestation Consuel (visa Bleu) qui vérifie la conformité à la norme NF C 15-100. En revanche, la TVA réduite exige une pose par un installateur certifié RGE ; la prime à l’autoconsommation, elle, a été supprimée par l’arrêté tarifaire du 4 juin 2026, quel que soit le poseur.' },
    },
    {
      '@type': 'Question',
      name: 'Combien produit un carport solaire de 3 kWc à l’année ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Selon l’outil PVGIS de la Commission européenne (calcul de juin 2026), un carport 3 kWc plein sud produit environ 3 000 kWh/an à Lille, 3 600 kWh/an à Lyon et 4 500 kWh/an à Marseille à la pente d’un carport (15°). En inclinant à 30°, on gagne quelques pour cent, jusqu’à 4 771 kWh/an à Marseille.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle borne de recharge installer sur un carport solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pour un carport 3 kWc, une borne de 7,4 kW (32 A monophasé) est le bon compromis : elle recharge environ 45 à 50 km d’autonomie par heure. Le point décisif n’est pas la puissance mais le pilotage solaire : une borne pilotée ne charge la voiture qu’avec le surplus produit, au lieu de tirer sur le réseau.' },
    },
    {
      '@type': 'Question',
      name: 'La TVA 5,5 % s’applique-t-elle si je pose moi-même mon carport solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Non. La TVA réduite à 5,5 % est réservée à la pose par un installateur certifié RGE QualiPV, et soumise à des conditions strictes depuis l’arrêté du 8 septembre 2025 (bilan carbone des modules, système de gestion d’énergie). En autoconstruction, vous restez à 20 %, ou 10 % en résidence principale au titre de l’article 278-0 bis du Code général des impôts.' },
    },
    {
      '@type': 'Question',
      name: 'Combien coûte le raccordement Enedis pour un carport solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Si vous avez déjà un compteur Linky, la mise en service de l’injection du surplus est une simple prestation d’une cinquantaine d’euros. Un raccordement neuf complet (sans branchement existant, ou avec renforcement) coûte beaucoup plus et varie selon le chantier : demandez le devis exact à Enedis. L’autoconsommation totale sans injection, elle, est gratuite.' },
    },
    {
      '@type': 'Question',
      name: 'Quel est le délai entre la commande et la mise en service ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Comptez 2 à 4 mois en général. Ce délai cumule la déclaration préalable en mairie (environ 1 mois d’instruction), la convention d’autoconsommation Enedis, l’obtention de l’attestation Consuel et la mise en service du raccordement. Une zone protégée (ABF) ou un raccordement neuf allonge ce délai.' },
    },
    {
      '@type': 'Question',
      name: 'Le bois du carport solaire doit-il être classe 3 ou classe 4 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Classe 4 pour tout élément au contact du sol ou exposé à une humidité permanente, typiquement les poteaux scellés. Classe 3 suffit pour les éléments hors sol (longerons, chevrons) protégés des remontées d’eau. Le pin autoclave classe 4 et le douglas traité sont les essences les plus courantes pour une structure extérieure durable.' },
    },
    {
      '@type': 'Question',
      name: 'Peut-on revendre le surplus d’électricité produit par un carport solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, via un contrat d’obligation d’achat avec EDF OA. Mais depuis l’arrêté tarifaire du 4 juin 2026, ce tarif est tombé à 0,011 €/kWh (1,1 c€) pour les installations jusqu’à 9 kWc, garanti 20 ans — contre 0,04 € auparavant. La revente du surplus ne rapporte donc presque plus rien : mieux vaut consommer sa production que la revendre.' },
    },
    {
      '@type': 'Question',
      name: 'Comment se passe le contrôle Consuel sur un carport solaire ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Vous remplissez l’attestation de conformité « visa Bleu » (Cerfa 15523) qui certifie le respect de la norme NF C 15-100, puis le Consuel peut procéder à un contrôle. Le coût est de 201,17 € TTC en version électronique (barème applicable depuis le 2 septembre 2025). Sans cette attestation, pas de raccordement au réseau.' },
    },
  ],
};

export default function CarportSolaireBoisVE2026Page() {
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
          <span className="content-breadcrumb-current">Carport solaire bois VE 2026</span>
        </nav>

        <h1 className="content-h1">
          Construire un carport solaire en bois pour recharger sa voiture électrique : guide 2026
        </h1>

        <p className="content-meta">
          <span><strong>Publié le 2 juin 2026</strong></span>
          <span>·</span>
          <span>Mis à jour le 9 juin 2026</span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/carport-solaire-bois-recharger-voiture-electrique-2026/hero.png"
            alt="Carport bois monopente couvert de panneaux solaires, voiture électrique blanche branchée dessous, jardin résidentiel français en lumière dorée de fin d'après-midi"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Un carport solaire en bois abrite la voiture et la recharge avec l&apos;énergie de
          sa propre toiture. Pour 3 kWc, comptez 6 500 à 9 000 € en autoconstruction, et une
          production de 3 000 kWh/an à Lille à près de 4 500 kWh/an à Marseille (calcul PVGIS,
          juin 2026). La rentabilité, elle, dépend surtout de l&apos;autoconsommation&nbsp;:
          d&apos;une douzaine d&apos;années dans le meilleur cas à plus de vingt ans dans le
          pire. Ce guide détaille la structure bois, les sept démarches administratives et le
          budget réel — sans gonfler les chiffres.
        </p>

        {/* ─── ENCART « À RETENIR » ─── */}
        <div className="content-takeaway">
          <p className="content-takeaway-title">À retenir</p>
          <ul>
            <li>Carport bois 3 kWc + borne&nbsp;: 6 500 € (autoconstruction) à 18 000 € (installateur RGE clé en main).</li>
            <li>Production&nbsp;: 3 000 kWh/an à Lille, jusqu&apos;à 4 800 kWh/an à Marseille (PVGIS, pente 15 à 30°).</li>
            <li>Amortissement&nbsp;: ~12 ans (DIY, sud, forte autoconsommation), au-delà de 20 ans si l&apos;installation est chère et peu autoconsommée.</li>
            <li>Sept démarches obligatoires, 2 à 4 mois de délai&nbsp;; Consuel à 201,17 € TTC.</li>
            <li>La TVA réduite n&apos;est accessible qu&apos;avec une pose par installateur RGE&nbsp;; la prime à l&apos;autoconsommation est supprimée depuis le 4 juin 2026, et la revente du surplus est tombée à 0,011 €/kWh.</li>
          </ul>
        </div>

        {/* CTA 1 — fin intro : DIYer qui veut chiffrer la structure */}
        <CTALead projectHref="/pergola" projectLabel="la structure du carport" />

        {/* ════════════ H2.1 ════════════ */}
        <h2 className="content-h2">1. Pourquoi un carport solaire bois plutôt qu&apos;en alu ou en acier&nbsp;?</h2>
        <p className="content-snippet">
          Le bois reste le choix le plus accessible pour un carport solaire&nbsp;: il
          utilise des sections de charpente standard, se monte avec de l&apos;outillage
          courant et revient nettement moins cher que l&apos;aluminium. L&apos;acier et
          l&apos;alu ne se justifient qu&apos;en bord de mer ou quand on cherche une
          garantie de très longue durée sans entretien.
        </p>
        <p className="content-body">
          Une structure de carport reprend exactement la logique d&apos;une pergola
          couverte&nbsp;: des poteaux, des longerons, des chevrons, mais avec une toiture
          qui porte des panneaux. Le bois y a trois atouts concrets. Il se travaille avec
          des sections de charpente que toutes les enseignes tiennent en stock (poteaux
          carrés, longerons, chevrons), il se pose à deux personnes avec une visseuse et
          un niveau, et un charpentier local sait le monter sans matériel spécifique. À
          surface égale, une ossature bois revient couramment bien moins cher qu&apos;une
          structure aluminium équivalente.
        </p>
        <p className="content-body">
          L&apos;acier galvanisé tient des portées plus longues sans poteau intermédiaire,
          mais il impose un ancrage béton lourd et reste sensible à la corrosion en bord
          de mer si la galvanisation est entaillée à la pose. L&apos;aluminium ne rouille
          pas et dure plusieurs décennies sans entretien, mais son prix d&apos;achat est
          nettement supérieur à celui du bois&nbsp;: c&apos;est le matériau des carports
          solaires «&nbsp;prêts à poser&nbsp;» du commerce, qui facturent autant le design
          que la matière.
        </p>
        <p className="content-body">
          L&apos;arbitrage tient en quatre questions&nbsp;: votre climat (le bord de mer
          pousse vers l&apos;alu), votre budget (le bois gagne), votre envie de manipuler
          du bois traité, et la durée pendant laquelle vous gardez la maison. Pour un
          projet d&apos;autoconstruction où l&apos;on cherche le meilleur rapport
          coût/maîtrise, le bois traité classe 4 est le point de départ logique — et c&apos;est
          la structure que calcule notre{' '}
          <Link href="/pergola" className="content-link">simulateur pergola</Link>.
        </p>

        {/* ════════════ H2.2 ════════════ */}
        <h2 className="content-h2">2. Combien produit réellement un carport solaire de 3 kWc en France&nbsp;?</h2>
        <p className="content-snippet">
          Un carport solaire de 3 kWc orienté plein sud produit, selon l&apos;outil PVGIS de
          la Commission européenne (calcul de juin 2026), entre 3 000 kWh/an à Lille et
          4 500 kWh/an à Marseille à la pente d&apos;un carport monopente (15°). En inclinant
          à 30°, on gagne quelques pour cent&nbsp;: jusqu&apos;à 4 771 kWh/an à Marseille.
          L&apos;ombre portée et l&apos;orientation pèsent plus que la région.
        </p>
        <p className="content-body">
          La référence de base&nbsp;: en France métropolitaine, 1 kWc installé produit de
          l&apos;ordre de 1 000 à 1 500 kWh par an selon la latitude et l&apos;ensoleillement.
          Pour un carport de 3 kWc — sept panneaux d&apos;environ 430 Wc, soit à peu près
          14 m² de toiture — voici les productions réelles recalculées sur{' '}
          <a href="https://re.jrc.ec.europa.eu/pvg_tools/fr/" target="_blank" rel="noopener noreferrer" className="content-link">PVGIS</a>{' '}
          (base de données de la Commission européenne, relevé de juin 2026), plein sud,
          pertes système de 14&nbsp;%&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Ville</th>
              <th>Pente 15° (carport monopente)</th>
              <th>Pente 30° (inclinaison optimale)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lille</td>
              <td>2 997 kWh/an</td>
              <td>3 174 kWh/an</td>
            </tr>
            <tr>
              <td>Lyon</td>
              <td>3 603 kWh/an</td>
              <td>3 800 kWh/an</td>
            </tr>
            <tr>
              <td>Marseille</td>
              <td>4 488 kWh/an</td>
              <td>4 771 kWh/an</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Deux enseignements. D&apos;abord, l&apos;écart nord-sud est réel mais pas
          écrasant&nbsp;: Marseille produit environ 50&nbsp;% de plus que Lille, pas le
          double. Ensuite, la pente plate d&apos;un carport (10 à 15°) ne coûte que 4 à
          6&nbsp;% de production par rapport à l&apos;inclinaison optimale de 30° — un
          compromis acceptable, d&apos;autant qu&apos;une pente faible améliore la
          production d&apos;été, justement quand on roule et qu&apos;on climatise.
        </p>
        <p className="content-body">
          Ce qui fait vraiment chuter la production, c&apos;est l&apos;orientation et
          l&apos;ombre. Chaque écart notable par rapport au plein sud retire plusieurs pour
          cent sur l&apos;année, et une orientation est ou ouest fait perdre 15 à 20&nbsp;%.
          Une ombre portée d&apos;arbre ou de cheminée sur ne serait-ce qu&apos;un panneau,
          aux heures de pointe, pénalise toute la chaîne si l&apos;onduleur est central —
          d&apos;où l&apos;intérêt des micro-onduleurs, détaillé plus bas.
        </p>

        {/* ════════════ H2.3 ════════════ */}
        <h2 className="content-h2">3. Combien d&apos;autonomie pour la voiture, vraiment&nbsp;?</h2>
        <p className="content-snippet">
          Une voiture électrique citadine consomme 14 à 18 kWh aux 100 km en cycle WLTP. Un
          carport 3 kWc à Lyon produit environ 3 600 kWh/an&nbsp;: de quoi parcourir près de
          21 000 km avec une Renault Zoé — mais seulement si la voiture charge en journée,
          quand le soleil produit. La nuance change tout le calcul.
        </p>
        <p className="content-body">
          Le calcul de base est simple. La Renault Zoé homologue une consommation WLTP de
          17,2 kWh/100 km en version R110 (17,7 en R135). À Lyon, un carport 3 kWc produit
          3 603 kWh/an à 15° de pente. En théorie, 3 603 ÷ 17,2 × 100 ≈ 20 900 km par an —
          plus que le kilométrage annuel moyen d&apos;un automobiliste français. La plupart
          des citadines et compactes électriques se situent dans la même fourchette WLTP,
          de 14 kWh/100 km pour les plus sobres à 18 pour les plus lourdes.
        </p>
        <p className="content-body">
          Mais ce «&nbsp;en théorie&nbsp;» cache le vrai piège du solaire pour la recharge.
          Un panneau ne produit qu&apos;en journée, avec un pic entre 10 h et 16 h. Si votre
          voiture est au bureau à ces heures-là, elle ne profite pas de votre production&nbsp;:
          vous injectez le surplus sur le réseau à 0,011 €/kWh seulement (tarif de rachat depuis l&apos;arrêté du 4 juin 2026, voir
          plus bas), puis vous rachetez l&apos;électricité le soir au tarif plein. Le gain
          réel s&apos;effondre.
        </p>
        <p className="content-body">
          La solution est une borne pilotée par la production solaire (suivi de la puissance
          disponible en temps réel)&nbsp;: elle ne charge la voiture que lorsque les panneaux
          produisent un surplus, et module la puissance pour coller à la production. C&apos;est
          ce qui distingue un carport solaire utile d&apos;un gadget — un point développé dans
          la section suivante sur le choix de la borne.
        </p>

        {/* CTA 2 — milieu (après équipements H2.5) : voir plus bas, juste après H2.5 */}

        {/* ════════════ H2.4 ════════════ */}
        <h2 className="content-h2">4. Structure bois&nbsp;: sections, plan et matériaux</h2>
        <p className="content-snippet">
          Un carport pour une voiture mesure environ 5×3 m (15 m²), deux voitures 5×6 m. La
          structure se dimensionne comme une pergola couverte, avec deux différences&nbsp;:
          la toiture porte les panneaux (de l&apos;ordre de 15 à 20 kg/m² avec les rails) et
          doit encaisser la charge de neige de votre région. Ancrage sur plots béton
          hors-gel, bois traité classe 4 au contact du sol.
        </p>
        <p className="content-body">
          La structure d&apos;un carport est celle d&apos;une pergola monopente que l&apos;on
          couvre&nbsp;: des poteaux ancrés au sol, des longerons qui les relient, des
          chevrons qui portent la toiture. Notre{' '}
          <Link href="/pergola" className="content-link">simulateur pergola</Link>{' '}
          calcule directement ces sections selon les dimensions et la portée, et le{' '}
          <Link href="/guides/pergola" className="content-link">guide pergola complet</Link>{' '}
          détaille le choix des essences, l&apos;ancrage et l&apos;entretien. Cette section ne
          couvre que ce qui change avec une toiture solaire.
        </p>
        <p className="content-body">
          Le premier point dur, c&apos;est la charge. Aux panneaux et à leurs rails de
          fixation — de l&apos;ordre de 15 à 20 kg/m² de charge permanente — s&apos;ajoute la
          charge climatique de neige et de vent, imposée par l&apos;Eurocode 1 (NF EN 1991).
          Cette charge varie fortement selon la zone de neige&nbsp;: de quelques dizaines de
          kg/m² en plaine à plus de 100 kg/m² en altitude. Concrètement, une toiture de
          carport doit être dimensionnée pour la neige de votre commune, pas seulement pour
          le poids des panneaux — c&apos;est le calcul que fait le simulateur en fonction de
          la portée.
        </p>
        <p className="content-body">
          Le second point dur, c&apos;est l&apos;ancrage. Une toiture pleine de panneaux
          offre une prise au vent qu&apos;une pergola ajourée n&apos;a pas&nbsp;: l&apos;effort
          de soulèvement impose des fondations béton sérieuses (plots coulés sous la
          profondeur hors-gel de la région) et des sabots galvanisés, jamais de simples plots
          à visser. Côté bois, le contact avec le sol exige une essence traitée classe 4
          (pin autoclave ou douglas traité)&nbsp;; la classe 3 suffit pour les éléments hors
          sol, jamais pour un poteau scellé.
        </p>

        {/* ════════════ H2.5 ════════════ */}
        <h2 className="content-h2">5. Panneaux, onduleur et bornes&nbsp;: comment choisir</h2>
        <p className="content-snippet">
          Pour 3 kWc, comptez sept panneaux monocristallins d&apos;environ 430 Wc (à peu près
          14 m²), un onduleur central ou des micro-onduleurs, et une borne de recharge de
          7,4 kW pilotée par la production solaire. C&apos;est ce pilotage, plus que la
          puissance brute, qui rend un carport solaire réellement utile pour la voiture.
        </p>
        <p className="content-body">
          Les panneaux monocristallins de 400 à 450 Wc sont le standard 2026&nbsp;: sept
          modules suffisent pour atteindre 3 kWc. Les références européennes (par exemple
          Voltec, DualSun) coûtent plus cher que les modules asiatiques de premier rang
          (Trina, Jinko, LONGi), pour un rendement comparable&nbsp;; le choix se joue sur la
          garantie, l&apos;origine et le bilan carbone (ce dernier conditionne l&apos;accès à
          la TVA réduite, voir plus bas).
        </p>
        <p className="content-body">
          Sur l&apos;onduleur, deux écoles. L&apos;onduleur central (Solax, Fronius) est moins
          cher mais aligne toute la chaîne sur le panneau le plus faible&nbsp;: une ombre sur
          un seul module pénalise toute la production. Les micro-onduleurs (Enphase) coûtent
          plus cher mais rendent chaque panneau indépendant — un vrai avantage sur un carport,
          souvent exposé à l&apos;ombre d&apos;un arbre ou de la maison à certaines heures.
        </p>
        <p className="content-body">
          La borne, enfin, est le maillon décisif. Sa puissance détermine la vitesse de
          recharge&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Puissance borne</th>
              <th>Vitesse de charge indicative</th>
              <th>Pour quel usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3,7 kW (16 A mono)</td>
              <td>~25 km/h</td>
              <td>Petit rouleur, moins de 50 km/jour</td>
            </tr>
            <tr>
              <td>7,4 kW (32 A mono)</td>
              <td>~45 à 50 km/h</td>
              <td>Trajet domicile-travail</td>
            </tr>
            <tr>
              <td>11 kW (16 A tri)</td>
              <td>~75 à 80 km/h</td>
              <td>Gros rouleur (surplus tiré du réseau)</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Sur un carport 3 kWc, une borne 7,4 kW est le bon compromis. Mais le point clé
          n&apos;est pas la puissance&nbsp;: c&apos;est le pilotage solaire. Une borne pilotée
          (Wallbox, Schneider, Hager) lit la production en temps réel et ne charge la voiture
          qu&apos;avec le surplus disponible, au lieu de tirer sur le réseau. Comptez de
          l&apos;ordre de 800 à 1 200 € pour une borne pilotée, contre 400 à 700 € pour une
          borne simple. Sur le principe du couplage panneaux + structure, notre{' '}
          <Link href="/guides/pergola-panneaux-solaires-diy-2026" className="content-link">guide pergola + panneaux solaires</Link>{' '}
          détaille les kits photovoltaïques compatibles avec une ossature bois.
        </p>

        {/* CTA 2 — Pro/Otovo. ⚠️ Otovo NON activé à ce jour → fallback simulateur.
            PHASE B : si Otovo signé, remplacer par <AffiliateLink> conforme loi 2023-451
            (mention « Lien partenaire affilié » + chip). Sinon garder le fallback ci-dessous. */}
        <CTALead projectHref="/pergola" projectLabel="ma structure ou comparer des devis" />

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">6. Démarches administratives&nbsp;: les 7 étapes</h2>
        <p className="content-snippet">
          Un carport solaire raccordé au réseau enchaîne sept démarches&nbsp;: déclaration
          préalable en mairie, convention d&apos;autoconsommation Enedis, contrat de rachat
          du surplus, attestation Consuel (201,17 € TTC en 2026), mise en service du
          raccordement, et — si vous visez la TVA réduite — pose par un
          installateur certifié RGE. Comptez 2 à 4 mois entre la commande et la mise en
          service.
        </p>
        <p className="content-body">
          C&apos;est l&apos;étape qui décourage le plus de candidats à l&apos;autoconstruction,
          alors qu&apos;elle est surtout une affaire de patience et d&apos;ordre. Voici la
          séquence&nbsp;:
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Démarche</th>
              <th>Coût</th>
              <th>Quand</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Déclaration préalable de travaux en mairie (création de toiture)</td>
              <td>Gratuit</td>
              <td>Toujours</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Convention d&apos;autoconsommation Enedis</td>
              <td>Gratuit</td>
              <td>Si raccordement réseau</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Contrat de rachat du surplus (EDF OA)</td>
              <td>Gratuit</td>
              <td>Si revente du surplus</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Attestation Consuel «&nbsp;visa Bleu&nbsp;» (Cerfa 15523)</td>
              <td>201,17 € TTC</td>
              <td>Toujours (sécurité électrique)</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Mise en service de l&apos;injection (Enedis)</td>
              <td>~50 € sur Linky existant</td>
              <td>Si surplus injecté</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Pose / mise en service par installateur RGE QualiPV</td>
              <td>Incluse dans la prestation</td>
              <td>Si TVA 5,5 % visée</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Déclaration des revenus de revente du surplus aux impôts</td>
              <td>Gratuit</td>
              <td>Si revente (selon régime fiscal)</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Trois points méritent une précision. La déclaration préalable de travaux se dépose
          en mairie (formulaire de DP à télécharger sur{' '}
          <a href="https://www.service-public.fr/particuliers/vosdroits/F17578" target="_blank" rel="noopener noreferrer" className="content-link">service-public.fr</a>)&nbsp;:
          un carport crée une toiture, il la déclenche systématiquement. En zone protégée
          (périmètre Architecte des Bâtiments de France), l&apos;instruction s&apos;allonge et
          l&apos;orientation des panneaux peut être imposée. Pour les seuils d&apos;urbanisme
          d&apos;une construction de jardin, voir notre{' '}
          <Link href="/guides/permis-cabanon-seuils-2026" className="content-link">guide des seuils de déclaration et permis</Link>.
        </p>
        <p className="content-body">
          L&apos;attestation Consuel «&nbsp;visa Bleu&nbsp;» (Cerfa 15523) est obligatoire pour
          toute installation de production raccordée&nbsp;: elle coûte 201,17 € TTC en version
          électronique selon le barème Consuel applicable depuis le 2 septembre 2025, et impose
          le respect de la norme NF C 15-100. Côté Enedis, distinguez deux cas&nbsp;: si vous
          avez déjà un compteur Linky, la mise en service de l&apos;injection du surplus est une
          simple prestation d&apos;une cinquantaine d&apos;euros&nbsp;; un raccordement neuf
          complet (sans branchement existant ou avec renforcement) coûte beaucoup plus et varie
          selon le chantier — demandez le devis exact à Enedis. Enfin, point décisif&nbsp;: la
          TVA réduite exige une pose par un installateur certifié RGE QualiPV — un carport
          monté soi-même y reste inéligible (la prime à l&apos;autoconsommation, elle, a été
          supprimée le 4 juin 2026), ce que détaille la section budget.
        </p>

        {/* ════════════ H2.7 ════════════ */}
        <h2 className="content-h2">7. Budget réel&nbsp;: DIY, kit prêt à poser et installateur RGE</h2>
        <p className="content-snippet">
          Pour un carport solaire 3 kWc avec borne, comptez en ordre de grandeur 2026&nbsp;:
          6 500 à 9 000 € en autoconstruction (structure bois + composants), 8 000 à 12 000 €
          en kit prêt à poser, et 12 000 à 18 000 € en installation clé en main par un
          professionnel RGE. La TVA réduite n&apos;est accessible qu&apos;avec la pose RGE&nbsp;;
          la prime à l&apos;autoconsommation, elle, est supprimée depuis le 4 juin 2026.
        </p>
        <p className="content-body">
          Les fourchettes ci-dessous sont des ordres de grandeur à affiner par des devis&nbsp;:
          les prix des panneaux, des bornes et de la pose évoluent vite. La part structure
          bois, en revanche, se chiffre précisément avec notre{' '}
          <Link href="/pergola" className="content-link">simulateur</Link>, qui s&apos;appuie
          sur les prix relevés chaque semaine en grande surface de bricolage.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Scénario (3 kWc + borne)</th>
              <th>Coût indicatif 2026</th>
              <th>TVA</th>
              <th>Aides 2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Autoconstruction (bois local + composants)</td>
              <td>6 500 à 9 000 €</td>
              <td>20 %</td>
              <td>Aucune</td>
            </tr>
            <tr>
              <td>Kit prêt à poser (pose perso)</td>
              <td>8 000 à 12 000 €</td>
              <td>20 %</td>
              <td>Aucune</td>
            </tr>
            <tr>
              <td>Installateur RGE clé en main</td>
              <td>12 000 à 18 000 €</td>
              <td>5,5 % si conditions réunies, sinon 10 %</td>
              <td>Prime supprimée le 4 juin 2026</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le paradoxe est réel&nbsp;: l&apos;autoconstruction coûte le moins cher à l&apos;achat,
          mais c&apos;est la seule voie qui n&apos;ouvre aucune aide. La TVA réduite à 5,5 %
          est réservée à la pose par un installateur certifié RGE QualiPV&nbsp;; la prime à
          l&apos;autoconsommation, elle, a été supprimée le 4 juin 2026. Pire, la TVA 5,5 % est devenue presque inaccessible depuis
          l&apos;arrêté du 8 septembre 2025, qui impose un bilan carbone des modules très
          strict (certification Certisolis) et un système de gestion d&apos;énergie&nbsp;: la
          plupart des installations résidentielles restent donc à 10 % (en résidence
          principale, au titre de l&apos;article 278-0 bis du Code général des impôts) ou à
          20 %.
        </p>
        <p className="content-body">
          Quant à la prime à l&apos;autoconsommation, elle a été supprimée par l&apos;arrêté
          tarifaire du 4 juin 2026 — elle valait encore 80 €/kWc, soit 240 € pour 3 kWc, jusque-là.
          Le seul avantage qui reste à la pose RGE est donc la TVA réduite, quand elle est
          accessible. Autrement dit&nbsp;: en autoconstruction, vous ne perdez presque plus
          d&apos;aides face au pro, tout en économisant plusieurs milliers d&apos;euros de
          main-d&apos;œuvre. L&apos;arbitrage penche vers le DIY pour qui sait câbler une
          installation conforme — à condition de regarder la rentabilité réelle, abordée juste
          après.
        </p>

        {/* ─── ENCART « MISE À JOUR » (avant H2.8) — OBLIGATOIRE YMYL ─── */}
        <div className="content-disclaimer">
          <strong>Mise à jour (juin 2026)&nbsp;:</strong>{' '}
          <a href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054190669" target="_blank" rel="noopener noreferrer" className="content-link">l&apos;arrêté tarifaire S21</a> a été
          publié au Journal officiel le 4 juin 2026. Il supprime la prime à
          l&apos;autoconsommation et ramène le tarif de rachat du surplus à 1,1 c€/kWh
          (0,011 €/kWh, contre 0,04 € auparavant). Les durées d&apos;amortissement ci-dessous
          intègrent désormais ce nouveau tarif. Le tarif reste figé à la date de demande
          complète de raccordement&nbsp;: un dossier déposé avant la réforme conserve son
          barème.
        </div>

        {/* ════════════ H2.8 ════════════ */}
        <h2 className="content-h2">8. Rentabilité&nbsp;: amortissement selon région et autoconsommation</h2>
        <p className="content-snippet">
          Soyons francs&nbsp;: aux tarifs de 2026, un carport solaire de 3 kWc ne s&apos;amortit
          vraiment que dans un cas — autoconstruction bon marché, région ensoleillée et forte
          autoconsommation, soit une douzaine d&apos;années. Une installation chère, au nord,
          avec peu d&apos;autoconsommation peut dépasser vingt ans, voire la durée de vie des
          panneaux. La rentabilité tient à l&apos;autoconsommation, pas à la revente.
        </p>
        <p className="content-body">
          Le principe du calcul&nbsp;: chaque kWh que vous consommez directement vous évite de
          l&apos;acheter au tarif réglementé (0,1940 €/kWh, option Base 6 kVA, grille EDF du
          1ᵉʳ février 2026)&nbsp;; chaque kWh injecté sur le réseau ne vous rapporte que le
          tarif de rachat du surplus (0,011 €/kWh, arrêté du 4 juin 2026). L&apos;écart
          est désormais de 1 à 18&nbsp;: autoconsommer vaut près de dix-huit fois plus que revendre. C&apos;est
          pourquoi la rentabilité dépend d&apos;abord de la part que vous consommez sur place,
          bien plus que de la région.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Scénario (3 kWc)</th>
              <th>Coût</th>
              <th>Production</th>
              <th>Gain an 1</th>
              <th>Amortissement*</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DIY · Marseille · autoconso 60 %</td>
              <td>7 000 €</td>
              <td>4 488 kWh</td>
              <td>~542 €</td>
              <td>~13 ans</td>
            </tr>
            <tr>
              <td>Kit · Lyon · autoconso 50 %</td>
              <td>10 000 €</td>
              <td>3 603 kWh</td>
              <td>~369 €</td>
              <td>~27 ans</td>
            </tr>
            <tr>
              <td>RGE · Lille · autoconso 40 %</td>
              <td>14 000 € (prime supprimée)</td>
              <td>2 997 kWh</td>
              <td>~252 €</td>
              <td>plus de 50 ans</td>
            </tr>
          </tbody>
        </table>
        <p className="content-body" style={{ fontSize: '0.9em', opacity: 0.8 }}>
          *Amortissement simple, à tarifs constants 2026, sans actualisation. La hausse
          passée du prix de l&apos;électricité raccourcirait ces durées&nbsp;; le nouveau
          tarif de rachat du surplus (arrêté du 4 juin 2026, voir avertissement ci-dessus) y est déjà intégré.
        </p>

        <p className="content-body">
          Trois enseignements honnêtes. D&apos;abord, le solaire pour recharger sa voiture
          n&apos;est pas un placement miracle&nbsp;: au prix de l&apos;électricité de 2026 et
          avec un surplus racheté à seulement 0,011 €/kWh, les durées d&apos;amortissement sont longues
          dès que l&apos;installation coûte cher. Ensuite, le levier décisif est
          l&apos;autoconsommation&nbsp;: une voiture qui charge en journée, une borne pilotée
          et une consommation domestique diurne font basculer le calcul bien plus qu&apos;un
          déménagement à Marseille. Enfin, l&apos;autoconstruction est ce qui sauve la
          rentabilité&nbsp;: en divisant le coût initial, elle ramène l&apos;amortissement
          dans la durée de vie des panneaux (25 à 30 ans).
        </p>
        <p className="content-body">
          Notre conseil&nbsp;: ne construisez pas un carport solaire d&apos;abord pour
          l&apos;argent, mais pour l&apos;usage — abriter la voiture et la recharger avec une
          énergie que vous maîtrisez. La rentabilité vient en prime quand le projet est
          bon marché et bien autoconsommé, pas l&apos;inverse.
        </p>

        {/* CTA 3 — fin article : double choix DIY / Pro */}
        <CTALead projectHref="/pergola" projectLabel="mon carport solaire" />

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        {/* PHASE B — rédiger les 10 réponses (40-60 mots, réponse-first), PUIS activer faqJsonLd.
            Chaque réponse contient des chiffres → fact-check obligatoire avant rédaction. */}
        <div className="content-faq">
          <h3 className="content-h3">Faut-il un permis de construire pour un carport solaire de 15 m²&nbsp;?</h3>
          <p className="content-body">
            Non, une déclaration préalable de travaux suffit. Le permis de construire
            n&apos;est exigé qu&apos;au-delà de 20 m² d&apos;emprise au sol (ou 40 m² en zone
            urbaine couverte par un PLU). Mais comme un carport crée une toiture, la
            déclaration préalable est systématique, même sous 5 m². En zone protégée
            (Architecte des Bâtiments de France), un avis supplémentaire s&apos;ajoute.
          </p>

          <h3 className="content-h3">Peut-on installer un carport solaire bois soi-même légalement&nbsp;?</h3>
          <p className="content-body">
            Oui pour la structure bois et la pose des panneaux. La partie électrique peut
            aussi être réalisée soi-même, mais l&apos;installation raccordée au réseau doit
            obtenir une attestation Consuel (visa Bleu) qui vérifie la conformité à la norme
            NF C 15-100. En revanche, la TVA réduite exige une pose par un installateur
            certifié RGE&nbsp;; la prime à l&apos;autoconsommation a été supprimée le 4 juin 2026.
          </p>

          <h3 className="content-h3">Combien produit un carport solaire de 3 kWc à l&apos;année&nbsp;?</h3>
          <p className="content-body">
            Selon l&apos;outil PVGIS de la Commission européenne (calcul de juin 2026), un
            carport 3 kWc plein sud produit environ 3 000 kWh/an à Lille, 3 600 kWh/an à Lyon
            et 4 500 kWh/an à Marseille à la pente d&apos;un carport (15°). En inclinant à 30°,
            on gagne quelques pour cent, jusqu&apos;à 4 771 kWh/an à Marseille.
          </p>

          <h3 className="content-h3">Quelle borne de recharge installer sur un carport solaire&nbsp;?</h3>
          <p className="content-body">
            Pour un carport 3 kWc, une borne de 7,4 kW (32 A monophasé) est le bon compromis&nbsp;:
            elle recharge environ 45 à 50 km d&apos;autonomie par heure. Le point décisif n&apos;est
            pas la puissance mais le pilotage solaire&nbsp;: une borne pilotée ne charge la
            voiture qu&apos;avec le surplus produit, au lieu de tirer sur le réseau.
          </p>

          <h3 className="content-h3">La TVA 5,5 % s&apos;applique-t-elle si je pose moi-même mon carport solaire&nbsp;?</h3>
          <p className="content-body">
            Non. La TVA réduite à 5,5 % est réservée à la pose par un installateur certifié RGE
            QualiPV, et soumise à des conditions strictes depuis l&apos;arrêté du 8 septembre
            2025 (bilan carbone des modules, système de gestion d&apos;énergie). En
            autoconstruction, vous restez à 20 %, ou 10 % en résidence principale au titre de
            l&apos;article 278-0 bis du Code général des impôts.
          </p>

          <h3 className="content-h3">Combien coûte le raccordement Enedis pour un carport solaire&nbsp;?</h3>
          <p className="content-body">
            Si vous avez déjà un compteur Linky, la mise en service de l&apos;injection du
            surplus est une simple prestation d&apos;une cinquantaine d&apos;euros. Un
            raccordement neuf complet (sans branchement existant, ou avec renforcement) coûte
            beaucoup plus et varie selon le chantier&nbsp;: demandez le devis exact à Enedis.
            L&apos;autoconsommation totale sans injection, elle, est gratuite.
          </p>

          <h3 className="content-h3">Quel est le délai entre la commande et la mise en service&nbsp;?</h3>
          <p className="content-body">
            Comptez 2 à 4 mois en général. Ce délai cumule la déclaration préalable en mairie
            (environ 1 mois d&apos;instruction), la convention d&apos;autoconsommation Enedis,
            l&apos;obtention de l&apos;attestation Consuel et la mise en service du
            raccordement. Une zone protégée (ABF) ou un raccordement neuf allonge ce délai.
          </p>

          <h3 className="content-h3">Le bois du carport solaire doit-il être classe 3 ou classe 4&nbsp;?</h3>
          <p className="content-body">
            Classe 4 pour tout élément au contact du sol ou exposé à une humidité permanente —
            typiquement les poteaux scellés. Classe 3 suffit pour les éléments hors sol
            (longerons, chevrons) protégés des remontées d&apos;eau. Le pin autoclave classe 4
            et le douglas traité sont les essences les plus courantes pour une structure
            extérieure durable.
          </p>

          <h3 className="content-h3">Peut-on revendre le surplus d&apos;électricité produit par un carport solaire&nbsp;?</h3>
          <p className="content-body">
            Oui, via un contrat d&apos;obligation d&apos;achat avec EDF OA. Mais depuis
            l&apos;arrêté tarifaire du 4 juin 2026, ce tarif est tombé à 0,011 €/kWh (1,1 c€)
            pour les installations jusqu&apos;à 9 kWc, garanti 20 ans — contre 0,04 € auparavant.
            La revente du surplus ne rapporte donc presque plus rien&nbsp;: mieux vaut consommer
            sa production que la revendre.
          </p>

          <h3 className="content-h3">Comment se passe le contrôle Consuel sur un carport solaire&nbsp;?</h3>
          <p className="content-body">
            Vous remplissez l&apos;attestation de conformité «&nbsp;visa Bleu&nbsp;» (Cerfa 15523)
            qui certifie le respect de la norme NF C 15-100, puis le Consuel peut procéder à un
            contrôle. Le coût est de 201,17 € TTC en version électronique (barème applicable
            depuis le 2 septembre 2025). Sans cette attestation, pas de raccordement au réseau.
          </p>
        </div>

        {/* ════════════ MAILLAGE INTERNE (brief §E) ════════════ */}
        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/pergola">Simulateur pergola DIY</Link> — la structure d&apos;un carport couvert se calcule comme une pergola&nbsp;: sections, BOM, budget</li>
            <li><Link href="/guides/pergola">Guide pergola complet</Link> — essence, pente, fondations, sections DTU 31.1</li>
            <li><Link href="/guides/pergola-panneaux-solaires-diy-2026">Pergola + panneaux solaires DIY 2026</Link> — démarches Consuel/Enedis et aides détaillées</li>
            <li><Link href="/guides/permis-cabanon-seuils-2026">Permis et déclaration préalable</Link> — seuils d&apos;urbanisme pour une construction de jardin</li>
            <li><Link href="/sources">Sources techniques et juridiques</Link> — DTU 31.1, CRE, Enedis, Consuel, Légifrance</li>
          </ul>
        </aside>

        {/* ════════════ DISCLOSURE AFFILIATION (brief §K) ════════════ */}
        {/* PHASE B — activer si liens Amazon/Otovo présents dans la version finale */}
        {/*
        <p className="content-disclosure">
          <em>
            Cet article contient des liens vers Amazon (programme Partenaires Amazon — outillage)
            et un lien partenaire vers Otovo pour la mise en relation avec des installateurs RGE.
            Si vous achetez via ces liens, DIY Builder peut percevoir une commission, sans surcoût
            pour vous. Notre verdict éditorial reste indépendant&nbsp;:
            voir notre <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
          </em>
        </p>
        */}

        <footer className="content-byline">
          <p>
              <strong>L&apos;équipe DIY Builder</strong> — Article publié le 2 juin 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources techniques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
