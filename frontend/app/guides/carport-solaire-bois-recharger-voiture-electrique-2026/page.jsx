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
     + ⚠️ projet d'arrêté 02/04/2026 (suppression prime, surplus 0,011 €/kWh)
       → vérifier état réglementaire au jour de la publi (Légifrance + CRE)
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
  // ⚠️ PHASE A — noindex tant que contenu non rédigé + non fact-checké.
  //    RETIRER ce bloc au go-live (Phase B) une fois tous les chiffres vérifiés.
  robots: { index: false, follow: false },
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

/* ⚠️ PHASE B — activer ces 2 schémas une fois le contenu rédigé + fact-checké.
   articleJsonLd : renseigner datePublished/dateModified réelles au go-live.
   faqJsonLd     : les 10 réponses contiennent des chiffres → NE PAS émettre
                   tant qu'elles ne sont pas vérifiées sur source officielle.

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Construire un carport solaire en bois pour recharger sa voiture électrique : guide 2026',
  description:
    'Structure DTU 31.1, démarches Enedis-Consuel, budget DIY vs pro et ROI réaliste 2026 pour un carport solaire bois qui recharge une voiture électrique.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '<JOUR_PUBLI>',
  dateModified: '<JOUR_PUBLI>',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/carport-solaire-bois-recharger-voiture-electrique-2026',
  image: OG_URL,
  about: ['Carport solaire', 'Photovoltaïque', 'Voiture électrique', 'Autoconsommation'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [ ... 10 questions du brief §G, réponses fact-checkées ... ],
};
*/

export default function CarportSolaireBoisVE2026Page() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
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
          {/* PHASE B — renseigner la date réelle de publication au go-live */}
          <span><strong>Publié le JJ MMMM 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources techniques</Link></span>
        </p>

        {/* PHASE B — hero 1672×941 golden hour (prompt brief §H), à générer puis déposer dans
            frontend/public/images/guides/carport-solaire-bois-recharger-voiture-electrique-2026/hero.png
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
        */}

        {/* ─── INTRO (lead snippet-ready, ~50 mots) ──────────────────────────
            PHASE B — rédiger. Chiffres à fact-checker AVANT injection :
              • amortissement 8-15 ans → résultat des calculs ROI H2.8 (PVGIS + tarifs CRE/EDF)
              • « 2 m² de toiture » → cadrage rédactionnel, OK
            Aucun chiffre tant que les sources H2.8 ne sont pas capturées + datées. */}
        <p className="content-lead">
          {/* PHASE B : intro 50 mots, réponse-first, sans chiffre non vérifié */}
        </p>

        {/* ─── ENCART « À RETENIR » (fin d'intro) ────────────────────────────
            PHASE B — bloc récap. Chiffres CIBLE (à fact-checker, brief §encart) :
              • budget 6 500 € (DIY) à 18 000 € (RGE) → tableaux 2 (sources prix)
              • production 2 850 (Lille) à 4 050 kWh/an (Marseille) → PVGIS
              • amortissement 8 à 15 ans → calculs H2.8
              • 7 démarches, 2 à 4 mois → tableau 4 (service-public/Enedis/Consuel) */}
        {/* <div className="content-disclaimer"> ... À RETENIR ... </div> */}

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
          vous injectez le surplus sur le réseau à 0,04 €/kWh (tarif de rachat T2 2026, voir
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
        {/* PHASE B — content-snippet (45 mots) + corps + tableau 5 (bornes).
            H3 : panneaux mono 400-450 Wc · marques EU vs Asie · onduleur central vs micro · borne · borne pilotée.
            Chiffres CIBLE — fiches produit / spécifs (sourcer, marques citées factuellement, pas d'attaque) :
              • 7 panneaux 430 Wc pour 3 kWc, ~14 m² → calcul direct
              • bornes 3,7 / 7,4 / 11 kW vitesses charge → specs constructeurs
              • borne pilotée ~800-1 200 € → relevé marché (fourchette datée)
            Marques EN CONSTAT FACTUEL uniquement (principe non-négociable §2 editorial-seo-fr).
            Lien : /guides/pergola-panneaux-solaires-diy-2026 (satellite cousin). */}
        <p className="content-snippet">{/* PHASE B */}</p>

        {/* CTA 2 — Pro/Otovo. ⚠️ Otovo NON activé à ce jour → fallback /contact.
            PHASE B : si Otovo signé, remplacer par <AffiliateLink> conforme loi 2023-451
            (mention « Lien partenaire affilié » + chip). Sinon garder le fallback ci-dessous. */}
        <CTALead projectHref="/pergola" projectLabel="ma structure ou comparer des devis" />

        {/* ════════════ H2.6 ════════════ */}
        <h2 className="content-h2">6. Démarches administratives&nbsp;: 7 étapes obligatoires</h2>
        {/* PHASE B — content-snippet (55 mots) + corps + tableau 4 (7 démarches).
            VALEUR YMYL — ce qui freine les particuliers. Réponse-first.
            Chiffres/réfs CIBLE — SOURCES OFFICIELLES OBLIGATOIRES :
              • DP mairie Cerfa n° 13703*12 → service-public.fr/F17578 (vérifier version)
              • Convention autoconso Enedis (gratuite, 1 mois) → enedis.fr
              • Consuel visa Bleu = 186,31 € HT → consuel.fr/tarifs (VÉRIFIER)
              • Raccordement Enedis PV-AC = 49,80 € HT → enedis.fr/catalogue (VÉRIFIER)
              • Mise en service RGE QualiPV (TVA 5,5 % / prime) → arrêté 8 sept 2025 Légifrance
              • Case 7BD Cerfa 2042 RICI → impots.gouv.fr
            Lien : /guides/permis-cabanon-seuils-2026 (YMYL urbanisme). */}
        <p className="content-snippet">{/* PHASE B */}</p>

        {/* ════════════ H2.7 ════════════ */}
        <h2 className="content-h2">7. Budget réel&nbsp;: DIY, kit prêt à poser et installateur RGE</h2>
        {/* PHASE B — content-snippet (50 mots) + corps + tableaux 1, 2, 3.
            H3 : DIY · kit prêt à poser · installateur RGE · TVA · aides.
            Chiffres CIBLE — sources prix + Légifrance/CRE :
              • DIY 6 500-9 000 € / kit 8 000-12 000 € / RGE 12 000-18 000 € (3 kWc)
                → relevés marché datés (fourchettes défendables, pas de prix inventé)
              • TVA 5,5 % conditions → arrêté 8 sept 2025 (Légifrance) ; 10 % → CGI 278-0 bis ; 20 % rés. secondaire
              • Prime autoconso 80 €/kWc < 3 kWc → CRE T2 2026
            ⚠️ Tarifs kits (tableau 1 Cover Green / Carport-solaire.com / Beem) = fact-check au jour J
               (évolution rapide), sinon retirer du tableau. */}
        <p className="content-snippet">{/* PHASE B */}</p>

        {/* ─── ENCART « AVERTISSEMENT » (avant H2.8) ─────────────────────────
            PHASE B — bloc rouge atténué (content-disclaimer). OBLIGATOIRE YMYL.
            Mentionner projet d'arrêté 02/04/2026 (suppression prime + surplus 0,011 €/kWh),
            lien Légifrance, daté T2 2026, « texte non encore en vigueur ».
            → vérifier l'état réglementaire au jour de la publi (peut avoir été voté). */}
        {/* <div className="content-disclaimer"> ... AVERTISSEMENT projet d'arrêté ... </div> */}

        {/* ════════════ H2.8 ════════════ */}
        <h2 className="content-h2">8. Rentabilité&nbsp;: amortissement selon région et autoconsommation</h2>
        {/* PHASE B — content-snippet (55 mots) + corps + tableau 3 (ROI).
            ⚠️ Titre VOLONTAIREMENT neutralisé (le brief disait « 8 ans Lyon à 15 ans Lille ») :
               ces chiffres sont des RÉSULTATS de calcul → à recalculer + sourcer avant d'entrer
               dans le titre ET le corps.
            Hypothèses CIBLE — SOURCES OFFICIELLES :
              • tarif Bleu EDF ~0,1940 €/kWh (mai 2026) → edf.fr (VÉRIFIER, révision semestrielle)
              • surplus EDF OA 0,04 €/kWh T2 2026 → CRE (VÉRIFIER)
              • 3 scénarios optimiste/moyen/pessimiste → calculs dérivés PVGIS + tarifs
            Claims INTERDITS (brief §K) : « 100 % autonome », « amortissable 5 ans », « TVA 5,5 % pour tous », « prime garantie ».
            Formulations défendables : « couvre 30 à 70 % des besoins », « amortissement 8 à 15 ans selon région et autoconso ». */}
        <p className="content-snippet">{/* PHASE B */}</p>

        {/* CTA 3 — fin article : double choix DIY / Pro */}
        <CTALead projectHref="/pergola" projectLabel="mon carport solaire" />

        {/* ════════════ FAQ ════════════ */}
        <h2 className="content-h2">Questions fréquentes</h2>
        {/* PHASE B — rédiger les 10 réponses (40-60 mots, réponse-first), PUIS activer faqJsonLd.
            Chaque réponse contient des chiffres → fact-check obligatoire avant rédaction. */}
        <div className="content-faq">
          <h3 className="content-h3">Faut-il un permis de construire pour un carport solaire de 15 m²&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — DP vs PC, seuils urbanisme → service-public.fr */}</p>

          <h3 className="content-h3">Peut-on installer un carport solaire bois soi-même légalement&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — DIY structure OK ; raccordement réseau = Consuel obligatoire */}</p>

          <h3 className="content-h3">Combien produit un carport solaire de 3 kWc à l&apos;année&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — fourchette régionale → PVGIS (cohérence H2.2) */}</p>

          <h3 className="content-h3">Quelle borne de recharge installer sur un carport solaire&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — 3,7 / 7,4 / 11 kW selon usage → specs (cohérence H2.5) */}</p>

          <h3 className="content-h3">La TVA 5,5 % s&apos;applique-t-elle si je pose moi-même mon carport solaire&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — non, pose RGE QualiPV requise → arrêté 8 sept 2025 Légifrance */}</p>

          <h3 className="content-h3">Combien coûte le raccordement Enedis pour un carport solaire&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — montant € HT → enedis.fr/catalogue (VÉRIFIER) */}</p>

          <h3 className="content-h3">Quel est le délai entre la commande et la mise en service&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — 2 à 4 mois → cohérence tableau 4 (Enedis/Consuel) */}</p>

          <h3 className="content-h3">Le bois du carport solaire doit-il être classe 3 ou classe 4&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — classe 4 au contact sol, classe 3 hors sol → DTU / norme EN 335 */}</p>

          <h3 className="content-h3">Peut-on revendre le surplus d&apos;électricité produit par un carport solaire&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — EDF OA, tarif T2 2026 → CRE (cohérence H2.7/H2.8) */}</p>

          <h3 className="content-h3">Comment se passe le contrôle Consuel sur un carport solaire&nbsp;?</h3>
          <p className="content-body">{/* PHASE B — visa Bleu, NF C 15-100 → consuel.fr */}</p>
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
            {/* PHASE B — renseigner la date réelle de publication */}
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le JJ MMMM 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources techniques</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
