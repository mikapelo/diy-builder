import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Sources DTU, normes et textes légaux cités sur DIY Builder',
  description:
    'Référence complète des normes NF DTU 31.1, 31.2, 51.4, 13.3, NF EN 335, EN 350, DIN 51130, textes légaux (Code urbanisme, conso, assurances, CGI), sécurité piscines et RGPD.',
  alternates: { canonical: 'https://www.diy-builder.fr/sources' },
  openGraph: {
    title: 'Sources DTU, normes et textes légaux cités sur DIY Builder',
    description:
      'Normes techniques bois, textes légaux construction et urbanisme, fiscalité travaux, sécurité piscines, sources prix enseignes et outils open-source.',
    url: 'https://www.diy-builder.fr/sources',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr' },
    { '@type': 'ListItem', position: 2, name: 'Sources', item: 'https://www.diy-builder.fr/sources' },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sources DTU et normes citées sur DIY Builder',
  url: 'https://www.diy-builder.fr/sources',
  description:
    'Référence complète des normes techniques, textes légaux et sources de prix utilisés sur DIY Builder.',
  dateModified: '2026-05-25',
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    url: 'https://www.diy-builder.fr',
  },
};

function SourceItem({ name, url, description, usedIn }) {
  return (
    <div className="content-body" style={{ marginBottom: '24px', paddingLeft: '0' }}>
      <p style={{ marginBottom: '4px' }}>
        <strong>{name}</strong>{' '}
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875em' }}>
            → {url.replace('https://', '').split('/')[0]}
          </a>
        )}
      </p>
      <p style={{ marginBottom: '4px', color: 'var(--text-secondary, #6b7280)' }}>{description}</p>
      {usedIn && (
        <p style={{ fontSize: '0.8em', color: 'var(--text-tertiary, #9ca3af)' }}>
          Utilisé dans : {usedIn}
        </p>
      )}
    </div>
  );
}

export default function SourcesPage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Sources DTU</span>
        </nav>

        <h1 className="content-h1">Sources DTU et normes citées sur DIY Builder</h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 25 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
        </p>

        <p className="content-lead">
          Les simulateurs DIY Builder produisent des quantitatifs matériaux et des estimatifs
          budgétaires. Ces chiffres s&apos;appuient sur des normes publiées, des textes légaux
          accessibles et des prix relevés directement sur les sites des enseignes. Cette page
          recense l&apos;ensemble de ces sources pour que chaque chiffre affiché puisse être
          retracé jusqu&apos;à son origine.
        </p>

        <h2 className="content-h2">Normes techniques bois</h2>
        <p className="content-body">
          Les normes NF DTU sont publiées et vendues par l&apos;AFNOR (Association Française de
          Normalisation). Elles ne sont pas librement accessibles en ligne — les références
          ci-dessous pointent vers la boutique AFNOR pour l&apos;achat, et vers les résumés
          gratuits disponibles sur les sites officiels. Les paragraphes cités dans les
          constantes du code correspondent aux éditions précisées.
        </p>

        <SourceItem
          name="NF DTU 31.2 P1-1 (mai 2019) — Ossature bois voile travaillant"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-dtu-312-p1-1/travaux-de-batiment-construction-de-maisons-et-batiments-a-ossature-en-bois-/fa190296/81938"
          description="Norme de référence pour les constructions à ossature bois à plate-forme. Utilisée pour l'entraxe des montants (§9.2.1 : max 60 cm), la section minimale des poteaux (§9.1.1.2 : ≥ 95 mm à l'humidité de service), les linteaux (§9.2.3.1), le contreventement OSB (§9.2.2 : ≥ 9 mm). Couvre les classes de service 1 et 2 pour les bâtiments de hauteur ≤ 3 niveaux."
          usedIn="cabanonConstants.js, modules/cabanon/engine.js, guides/cabanon"
        />

        <SourceItem
          name="NF DTU 31.1 P1-1 (juin 2017) — Charpente et escaliers en bois"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-dtu-311-p1-1/travaux-de-batiment-charpente-et-escaliers-en-bois-partie-1-1-cahier-des-clau/fa189022/77284"
          description="Couvre les règles de durabilité bois (§5.10), les assemblages (§5.7), les portées des chevrons et longerons, le porte-à-faux (§5.10.4.1 : ≥ 150 mm depuis sol naturel). Utilisée pour les modules pergola (poteaux, longerons, chevrons) et comme référence d'arrière-plan pour les toitures mono-pente des cabanons. La pergola n'est pas une charpente couverte au sens strict, mais le simulateur en respecte les principes de dimensionnement."
          usedIn="pergolaConstants.js, clotureConstants.js, modules/pergola/engine.js"
        />

        <SourceItem
          name="NF DTU 51.4 P1-2 — Revêtements de sol en bois"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-dtu-514/travaux-de-batiment-parquets-colles/fa028944/14879"
          description="Norme encadrant les terrasses et revêtements de sol en bois. Utilisée pour le dimensionnement des lames de terrasse, l'entraxe des lambourdes, les sections minimales selon la portée. Le moteur terrasse (lib/deckEngine.js) l'implémente dans sa couche de calcul figée."
          usedIn="lib/deckEngine.js, lib/deckConstants.js, guides/terrasse"
        />

        <SourceItem
          name="NF DTU 13.3 P1-2 — Dallages"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-dtu-133-p1-2/travaux-de-batiment-dallages-partie-1-2-criteres-generaux-de-choix-des-materi/fa182898/63474"
          description="Référence pour les dalles béton et les plots de fondation. Utilisée dans le calculateur terrasse pour dimensionner les plots béton (espacement, portance), et dans le module cabanon pour les fondations sur plots. La profondeur hors-gel (min 60–80 cm selon zone) n'est pas calculée automatiquement — elle est mentionnée dans le guide."
          usedIn="lib/foundation/foundationCalculator.js, guides/terrasse"
        />

        <SourceItem
          name="NF EN 335:2013 — Durabilité du bois et des produits dérivés du bois"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-en-335/durabilite-du-bois-et-des-produits-derives-du-bois-classes-dutilisation-defi/fa167804/50484"
          description="Définit les cinq classes d'emploi du bois (CE1 à CE5) selon l'exposition à l'humidité et le risque biologique. CE3 : bois extérieur protégé de la pluie (bardage avec lame d'air). CE4 : bois en contact avec le sol ou l'eau (poteaux de clôture, lisses basses). Référencée dans les guides matériaux et les fiches de conseil d'achat."
          usedIn="guides/cabanon, guides/cloture, faq"
        />

        <SourceItem
          name="NF EN 1995-1-1:2005 (Eurocode 5) — Conception des structures en bois"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-en-1995-1-1-na/eurocode-5-conception-et-calcul-des-structures-en-bois-partie-1-1-generalites-/fa156139/35371"
          description="Cadre de calcul structurel pour les structures bois. Utilisé pour les critères de flèche (L/300 pour les éléments porteurs — limite pour MAX_POST_SPAN = 3,50 m dans le module pergola), les assemblages vissés et boulonnés. Les calculs complets EC5 ne sont pas implémentés dans les simulateurs — les constantes en découlent mais un bureau d'études reste nécessaire pour tout projet structurel réel."
          usedIn="pergolaConstants.js, lib/cabanonConstants.js (commentaires référence)"
        />

        <SourceItem
          name="NF EN 350:2016 — Durabilité naturelle du bois et des produits dérivés"
          url="https://www.boutique.afnor.org/fr-fr/norme/nf-en-350/durabilite-du-bois-et-des-materiaux-a-base-de-bois-methodes-dessai-et-de-cla/fa172860/55891"
          description="Définit les 5 classes de durabilité naturelle du bois face aux champignons xylophages (classe 1 « très durable » à classe 5 « non durable »). L'ipé, le cumaru, le garapa et le padouk sont classe 1 — d'où leur résistance sans traitement en bord de piscine. Le pin sylvestre non traité est classe 4-5, ce qui justifie l'autoclave classe 4 d'emploi pour usage extérieur."
          usedIn="guides/terrasse-piscine-bois, guides/prix-terrasse-bois-m2-2026"
        />

        <SourceItem
          name="DIN 51130 — Classification antidérapante pour pieds nus mouillés"
          url="https://www.din.de/en/getting-involved/standards-committees/nabau/standards/wdc-beuth:din21:341787935"
          description="Norme allemande définissant 5 niveaux d'adhérence R9 à R13 par angle de glissement (R11 : 19-27° = minimum recommandé pour plage de piscine). Référence internationale utilisée par les assureurs habitation français pour exiger une antidérapance minimale autour des piscines privées."
          usedIn="guides/terrasse-piscine-bois"
        />

        <SourceItem
          name="Règlement (UE) n°995/2010 — RBUE Bois de l'Union européenne"
          url="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32010R0995"
          description="Règlement européen entré en application le 3 mars 2013 imposant une diligence raisonnée à tout importateur de bois dans l'UE pour exclure les origines illégales. En pratique, les enseignes françaises ne vendent que des bois exotiques certifiés FSC ou PEFC. Référence à corriger fréquemment dans les contenus en ligne qui attribuent à tort une date de 2022 ou autre."
          usedIn="guides/prix-terrasse-bois-m2-2026, guides/terrasse-piscine-bois"
        />

        <hr className="content-divider" />

        <h2 className="content-h2">Cadre légal et urbanisme</h2>
        <p className="content-body">
          Les seuils réglementaires affichés dans les guides (déclaration préalable, permis de
          construire) sont issus du Code de l&apos;urbanisme. Ces textes sont librement accessibles
          sur Légifrance et sur Service-Public.fr.
        </p>

        <SourceItem
          name="Code de l'urbanisme — Articles R421-1 à R421-12"
          url="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074075/LEGISCTA000006175762/"
          description="Définit les seuils de surface plancher déclenchant une déclaration préalable de travaux (5 à 20 m²), un permis de construire (au-delà de 20 m² hors zone U du PLU, ou 40 m² en zone U). R421-2 pose l'exemption pour < 5 m². R421-5 traite des constructions démontables (≥ 3 mois consécutifs = mêmes règles que permanent)."
          usedIn="guides/cabanon, guides/permis-cabanon-seuils-2026, faq"
        />

        <SourceItem
          name="Code de l'urbanisme — Article R425-1 (avis ABF)"
          url="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031211265/"
          description="Soumet les projets en périmètre de protection (500 m autour d'un monument historique, site patrimonial remarquable, secteur sauvegardé) à l'avis conforme de l'Architecte des Bâtiments de France. Cet avis lie la mairie : un refus ABF entraîne refus du permis. Délai d'instruction supplémentaire de 6 à 8 semaines."
          usedIn="guides/permis-cabanon-seuils-2026, guides/cabanon"
        />

        <SourceItem
          name="Code de l'urbanisme — Article R431-2 (recours à un architecte)"
          url="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031211363/"
          description="Rend obligatoire le recours à un architecte pour tout projet portant la surface totale habitation au-delà de 150 m². Les honoraires varient de 8 à 12 % du coût total des travaux selon les missions confiées (étude seule, suivi de chantier complet)."
          usedIn="guides/permis-cabanon-seuils-2026"
        />

        <SourceItem
          name="Formulaire Cerfa n° 13703 — Déclaration préalable de travaux"
          url="https://www.service-public.fr/particuliers/vosdroits/R1995"
          description="Formulaire officiel pour les constructions de 5 à 20 m² en zone PLU (et jusqu'à 40 m² en zone U). Disponible en téléchargement sur Service-Public.fr. Délai d'instruction : 1 mois (2 mois en site patrimonial remarquable). Les versions du formulaire évoluent — toujours vérifier la dernière version sur service-public.fr."
          usedIn="guides/permis-cabanon-seuils-2026, guides/cabanon"
        />

        <SourceItem
          name="Formulaire Cerfa n° 13406 — Permis de construire"
          url="https://www.service-public.fr/particuliers/vosdroits/R11637"
          description="Formulaire officiel pour les constructions au-delà de 40 m² en zone U du PLU, ou au-delà de 20 m² hors zone U. Délai d'instruction : 2 mois standard, 3 mois en zone protégée. Pièces complémentaires possibles en cours d'instruction (suspension du délai)."
          usedIn="guides/permis-cabanon-seuils-2026"
        />

        <SourceItem
          name="Géoportail de l'urbanisme"
          url="https://www.geoportail-urbanisme.gouv.fr"
          description="Service public officiel permettant de vérifier en ligne le zonage PLU d'un terrain, les servitudes d'utilité publique, les périmètres de protection (ABF, sites classés, Natura 2000, PPR). Outil gratuit recommandé avant tout dépôt de dossier d'urbanisme."
          usedIn="guides/permis-cabanon-seuils-2026"
        />

        <SourceItem
          name="GNAU — Guichet Numérique des Autorisations d'Urbanisme"
          url="https://www.service-public.fr/particuliers/vosdroits/F1986"
          description="Téléservice de dépôt en ligne des autorisations d'urbanisme (DP, PC, certificat). Adopté par un nombre croissant de communes françaises. Quand disponible, évite le dépôt papier en 2 exemplaires en mairie."
          usedIn="guides/permis-cabanon-seuils-2026"
        />

        <SourceItem
          name="Réglementation Environnementale 2020 (RE 2020)"
          url="https://www.ecologie.gouv.fr/re2020"
          description="La RE 2020 s'applique aux bâtiments d'habitation nouveaux. Elle ne s'applique pas aux abris de jardin, garages, pergolas ou clôtures — ce point est explicitement mentionné dans la FAQ DIY Builder pour éviter la confusion fréquente sur les forums. Source : Ministère de la Transition écologique."
          usedIn="faq, guides/cabanon"
        />

        <hr className="content-divider" />

        <h2 className="content-h2">Construction, devis et garanties travaux</h2>
        <p className="content-body">
          Le cadre légal du devis travaux particulier mêle Code de la consommation (mentions
          obligatoires), Code des assurances (décennale Spinetta), Code civil (garanties légales)
          et arrêtés spécifiques. Tous ces textes sont consultables gratuitement sur Légifrance.
        </p>

        <SourceItem
          name="Code de la consommation — Article L111-1"
          url="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227298/"
          description="Définit les informations précontractuelles obligatoires à fournir au consommateur (caractéristiques essentielles, prix, identité du professionnel, modalités de paiement, garanties). Base juridique des mentions obligatoires sur un devis travaux destiné à un particulier."
          usedIn="guides/comparer-devis-travaux"
        />

        <SourceItem
          name="Arrêté du 2 mars 1990 — Publicité des prix des prestations de services"
          url="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000536724/"
          description="Précise les règles d'affichage et de remise d'un devis pour les prestations homologues d'entretien, dépannage et réparation. Le devis travaux BTP doit nommer le client, détailler chaque prestation, indiquer prix unitaires et taux de TVA, et préciser la durée de validité."
          usedIn="guides/comparer-devis-travaux"
        />

        <SourceItem
          name="Loi Spinetta n°78-12 du 4 janvier 1978 — Code des assurances art. L241-1"
          url="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006797571/"
          description="Rend obligatoire l'assurance responsabilité décennale pour tout constructeur d'ouvrage (entreprises BTP, artisans, maîtres d'œuvre). L'assurance couvre les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination pendant 10 ans à compter de la réception."
          usedIn="guides/comparer-devis-travaux, guides/soi-meme-ou-pro"
        />

        <SourceItem
          name="Code civil — Articles 1792 à 1792-6 (garanties légales construction)"
          url="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006150240/"
          description="Garantie de parfait achèvement (1 an, art. 1792-6), garantie biennale de bon fonctionnement (2 ans, art. 1792-3), garantie décennale (10 ans, art. 1792). Couvrent respectivement les défauts apparents à la réception, les éléments d'équipement dissociables, et les défauts compromettant la solidité ou la destination de l'ouvrage."
          usedIn="guides/comparer-devis-travaux, guides/soi-meme-ou-pro"
        />

        <SourceItem
          name="Code général des impôts — Article 278-0 bis A (TVA 5,5 %)"
          url="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043663878/"
          description="Taux réduit de TVA à 5,5 % applicable aux travaux d'amélioration de la performance énergétique dans les logements de plus de 2 ans (isolation thermique, équipements de chauffage performants, ENR). Liste des équipements éligibles fixée par arrêté."
          usedIn="guides/comparer-devis-travaux"
        />

        <SourceItem
          name="Code général des impôts — Article 279-0 bis (TVA 10 %)"
          url="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041464950/"
          description="Taux intermédiaire de TVA à 10 % applicable aux travaux d'amélioration, de transformation, d'aménagement et d'entretien des logements de plus de 2 ans. Exclut les constructions neuves et les agrandissements de plus de 10 % de surface (qui restent au taux normal 20 %)."
          usedIn="guides/comparer-devis-travaux"
        />

        <SourceItem
          name="Annuaire des entreprises — data.gouv.fr"
          url="https://annuaire-entreprises.data.gouv.fr"
          description="Service public officiel de vérification du SIRET, du statut actif, de la date de création et du dirigeant d'une entreprise française. Accès gratuit et sans inscription. Outil de premier choix pour vérifier qu'une entreprise BTP qui présente un devis existe légalement."
          usedIn="guides/comparer-devis-travaux"
        />

        <hr className="content-divider" />

        <h2 className="content-h2">Sécurité des piscines privées</h2>
        <p className="content-body">
          Toute piscine enterrée ou semi-enterrée privée doit être équipée d&apos;au moins un
          dispositif de sécurité normalisé depuis la loi Raffarin de 2003. Quatre dispositifs sont
          reconnus, chacun couvert par une norme NF P90 distincte.
        </p>

        <SourceItem
          name="Loi n°2003-9 du 3 janvier 2003 — Loi Raffarin sécurité piscines"
          url="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000596892/"
          description="Loi imposant à tous les propriétaires de piscines enterrées ou semi-enterrées privées (individuelles ou collectives) l'installation d'au moins un dispositif de sécurité normalisé. Codifiée au Code de la construction et de l'habitation (codification recodifiée par l'ordonnance 2020-71). Sanction en cas de défaut : amende pénale jusqu'à 45 000 €."
          usedIn="guides/terrasse-piscine-bois"
        />

        <SourceItem
          name="NF P90-306 à NF P90-309 — Dispositifs de sécurité piscines"
          url="https://www.boutique.afnor.org/fr-fr/recherche/resultats?keyword=NF+P90-306"
          description="Quatre normes couvrant les quatre dispositifs reconnus : NF P90-306 (barrières de protection, hauteur min 1,10 m), NF P90-307 (alarmes d'immersion), NF P90-308 (couvertures), NF P90-309 (abris). Au moins un de ces dispositifs est obligatoire. Le respect de la norme est attesté par la mention explicite sur le produit."
          usedIn="guides/terrasse-piscine-bois"
        />

        <hr className="content-divider" />

        <h2 className="content-h2">Prix et fournisseurs</h2>
        <p className="content-body">
          Les prix affichés dans les comparatifs d&apos;enseignes sont relevés directement sur
          les sites officiels des distributeurs. Ce sont des prix public constatés, non des
          tarifs négociés ou des prix d&apos;affiliation conditionnels.
        </p>

        <SourceItem
          name="Leroy Merlin"
          url="https://www.leroymerlin.fr"
          description="Prix relevés sur leroymerlin.fr par scraping automatisé, vérifiés manuellement avant intégration. Les références produit (codes EAN / SKU) ne sont pas conservées dans le code car elles changent à chaque réassortiment — seuls les prix unitaires sont stockés."
          usedIn="lib/materialPrices.js"
        />

        <SourceItem
          name="Castorama"
          url="https://www.castorama.fr"
          description="Prix relevés sur castorama.fr. Mise à jour mai 2026 avec corrections majeures sur les montants, poteaux, béton de scellement et lames de terrasse."
          usedIn="lib/materialPrices.js"
        />

        <SourceItem
          name="Brico Dépôt"
          url="https://www.bricodepot.fr"
          description="Prix relevés sur bricodepot.fr. Le site utilise un moteur de recherche JavaScript-driven — certains produits ne sont pas toujours accessibles au scraping automatique (indiqué par scraped: false dans le code source)."
          usedIn="lib/materialPrices.js"
        />

        <SourceItem
          name="ManoMano"
          url="https://www.manomano.fr"
          description="Prix relevés sur manomano.fr. Les prix ManoMano varient davantage (marketplace multi-vendeurs) — les valeurs intégrées correspondent au prix du vendeur le mieux classé au moment du relevé."
          usedIn="lib/materialPrices.js"
        />

        <hr className="content-divider" />

        <h2 className="content-h2">RGPD et données personnelles</h2>

        <SourceItem
          name="Règlement (UE) 2016/679 — RGPD"
          url="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679"
          description="Règlement général sur la protection des données. DIY Builder ne collecte pas de données personnelles au-delà de ce que les cookies analytiques imposent (voir politique de cookies). Aucun compte utilisateur, aucun formulaire de données personnelles côté simulateur."
          usedIn="politique-confidentialite, cookies"
        />

        <SourceItem
          name="CNIL — Commission nationale de l'informatique et des libertés"
          url="https://www.cnil.fr"
          description="Autorité de contrôle française pour la protection des données. La politique de cookies de DIY Builder suit les recommandations CNIL de 2020 sur le consentement (délibération n° 2020-092)."
          usedIn="politique-confidentialite, cookies"
        />

        <hr className="content-divider" />

        <h2 className="content-h2">Outils techniques open-source</h2>
        <p className="content-body">
          Les simulateurs reposent sur des librairies open-source. Leur mention ici n&apos;est
          pas une obligation légale (toutes sont sous licence permissive) mais un signal
          de transparence sur la stack utilisée.
        </p>

        <SourceItem
          name="Three.js v0.160"
          url="https://threejs.org"
          description="Moteur de rendu 3D WebGL. Utilisé pour la visualisation 3D des ossatures, toitures et plans. Licence MIT."
          usedIn="components/simulator/CabanonScene.jsx, CabanonViewer.jsx, PergolaScene.jsx"
        />

        <SourceItem
          name="@react-three/fiber v8 — R3F"
          url="https://docs.pmnd.rs/react-three-fiber"
          description="Couche React pour Three.js. Permet la gestion du cycle de vie des objets 3D via les hooks React. Licence MIT."
          usedIn="components/simulator/ (tous les viewers 3D)"
        />

        <SourceItem
          name="jsPDF v4"
          url="https://github.com/parallax/jsPDF"
          description="Génération de PDF côté client (navigateur). Utilisé pour l'export du devis matériaux avec logo, tableau de nomenclature et récapitulatif budget. Licence MIT."
          usedIn="hooks/usePDFExport.js, components/simulator/ExportPDF/"
        />

        <SourceItem
          name="Next.js 14 (App Router)"
          url="https://nextjs.org"
          description="Framework React avec rendu serveur (SSR/SSG). Les pages éditoriales sont statiquement générées (SSG) pour de meilleures performances et une indexation optimale. Les simulateurs utilisent 'use client' avec dynamic import pour Three.js (ssr: false). Licence MIT."
          usedIn="Ensemble du frontend"
        />

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/methodologie">Méthodologie — comment les calculs sont construits</Link></li>
            <li><Link href="/faq">FAQ — 24 questions techniques sur les matériaux et normes</Link></li>
            <li><Link href="/guides/cabanon">Guide cabanon — DTU 31.2 appliqué</Link></li>
            <li><Link href="/politique-confidentialite">Politique de confidentialité</Link></li>
          </ul>
        </aside>
      </div>
    </ContentLayout>
  );
}
