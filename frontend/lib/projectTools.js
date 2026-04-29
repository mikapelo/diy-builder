/**
 * projectTools.js — Outils (avec gammes) + consommables par type de projet
 *
 * Architecture liens :
 *   - Outils      : amazonAsin (ASIN direct, prioritaire) ou amazonQuery (fallback recherche modèle exact)
 *   - Consommables: amazonQuery uniquement (produits trop variables pour ASINs stables)
 *
 * Commission Amazon Associates : générée sur tout achat dans les 24h après le clic.
 * ASIN direct → meilleur taux de conversion. Query → plus maintenable.
 *
 * Tag Amazon : 'diybuilder-21' (placeholder — remplacer après validation programme)
 */

const AMAZON_TAG = 'diybuilder-21';

export function buildAmazonUrl(query, asin) {
  if (asin) return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_TAG}`;
  return `https://www.amazon.fr/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

export function buildLMUrl(query) {
  return `https://www.leroymerlin.fr/recherche?q=${encodeURIComponent(query)}`;
}

/* ══════════════════════════════════════════════════
   CATALOGUE GAMMES — définitions partagées entre modules
   Chaque outil : 3 tiers Budget / Polyvalent / Professionnel
══════════════════════════════════════════════════ */

const TOOL_TIERS = {
  'scie-circulaire': {
    name: 'Scie circulaire',
    icon: 'carpenter',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Ryobi',
        model: 'RCS1600-G',
        price: 45,
        specs: ['1600 W', 'Ø165 mm', 'Lame 24 dents incluse'],
        // ASIN FR à valider sur Amazon Associates
        amazonAsin: null,
        amazonQuery: 'Ryobi RCS1600-G scie circulaire bois',
        lmQuery: 'scie circulaire ryobi',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PKS 55 A',
        price: 85,
        specs: ['1350 W', 'Ø190 mm', 'Guide parallèle inclus', 'Poids 3,4 kg'],
        amazonAsin: null,
        amazonQuery: 'Bosch PKS 55 A scie circulaire',
        lmQuery: 'scie circulaire bosch pks 55',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Makita',
        model: 'HS7601J',
        price: 165,
        specs: ['1200 W', 'Ø190 mm', 'Coffret + lame carbure', 'Guide laser'],
        amazonAsin: null,
        amazonQuery: 'Makita HS7601J scie circulaire coffret',
        lmQuery: 'scie circulaire makita hs7601',
      },
    ],
  },

  'perceuse-visseuse': {
    name: 'Perceuse-visseuse',
    icon: 'hardware',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Black+Decker',
        model: 'BDCDD12K',
        price: 38,
        specs: ['12 V', '20 Nm', '2 batteries incluses'],
        amazonAsin: null,
        amazonQuery: 'Black Decker BDCDD12K perceuse visseuse',
        lmQuery: 'perceuse visseuse black decker 12v',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PSR 18 LI-2',
        price: 90,
        specs: ['18 V', '40 Nm', '2 batteries 2 Ah', '25 couples'],
        amazonAsin: null,
        amazonQuery: 'Bosch PSR 18 LI-2 perceuse visseuse',
        lmQuery: 'perceuse visseuse bosch psr 18',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Makita',
        model: 'DDF487RTJ',
        price: 185,
        specs: ['18 V', '54 Nm', '2 batteries 5 Ah', 'Coffret robuste'],
        amazonAsin: null,
        amazonQuery: 'Makita DDF487RTJ perceuse visseuse coffret',
        lmQuery: 'perceuse visseuse makita ddf487',
      },
    ],
  },

  'niveau-laser': {
    name: 'Niveau laser',
    icon: 'align_horizontal_center',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Huepar',
        model: 'BOX-1G',
        price: 32,
        specs: ['1 ligne verte', 'Portée 30 m', '±0,3 mm/m', 'Trépied inclus'],
        amazonAsin: null,
        amazonQuery: 'Huepar BOX-1G niveau laser ligne verte',
        lmQuery: 'niveau laser huepar',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'GLL 2-15 G',
        price: 80,
        specs: ['2 lignes vertes', 'Portée 15 m', '±0,3 mm/m', 'Fixation magnétique'],
        amazonAsin: null,
        amazonQuery: 'Bosch GLL 2-15 G niveau laser 2 lignes',
        lmQuery: 'niveau laser bosch gll 2-15',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Bosch',
        model: 'GLL 3-80 CG',
        price: 250,
        specs: ['3 lignes vertes', 'Portée 80 m', '±0,2 mm/m', 'Mode extérieur'],
        amazonAsin: null,
        amazonQuery: 'Bosch GLL 3-80 CG niveau laser 3 lignes',
        lmQuery: 'niveau laser bosch gll 3-80',
      },
    ],
  },

  'ponceuse-orbitale': {
    name: 'Ponceuse orbitale',
    icon: 'tune',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Black+Decker',
        model: 'KA198',
        price: 28,
        specs: ['55 W', 'Plateau 114×114 mm', 'Sac collecteur'],
        amazonAsin: null,
        amazonQuery: 'Black Decker KA198 ponceuse orbitale',
        lmQuery: 'ponceuse orbitale black decker',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PSS 250 AE',
        price: 55,
        specs: ['250 W', 'Plateau 112×102 mm', 'Aspiration intégrée', 'Vitesse variable'],
        amazonAsin: null,
        amazonQuery: 'Bosch PSS 250 AE ponceuse orbitale',
        lmQuery: 'ponceuse orbitale bosch pss 250',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Bosch',
        model: 'GEX 125-1 AE',
        price: 100,
        specs: ['250 W', 'Ø125 mm', 'Vibration réduite', 'Compatible aspirateur'],
        amazonAsin: null,
        amazonQuery: 'Bosch GEX 125-1 AE ponceuse excentrique',
        lmQuery: 'ponceuse excentrique bosch gex 125',
      },
    ],
  },

  'equerre-charpentier': {
    name: 'Équerre de charpentier',
    icon: 'square_foot',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Stanley',
        model: 'FatMax 300 mm',
        price: 18,
        specs: ['Acier inox', 'Graduations mm/pouce', 'Angles 90° et 45°'],
        amazonAsin: null,
        amazonQuery: 'Stanley FatMax équerre charpentier 300mm',
        lmQuery: 'équerre charpentier stanley 300mm',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Irwin',
        model: 'T0936',
        price: 32,
        specs: ['Aluminium épais', '300 mm', 'Butée aimantée', 'Résistant aux chocs'],
        amazonAsin: null,
        amazonQuery: 'Irwin T0936 équerre charpentier aluminium',
        lmQuery: 'équerre charpentier irwin',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Tajima',
        model: 'SGP-30M',
        price: 58,
        specs: ['Acier inox épais', '300 mm', 'Graduation laser', 'Made in Japan'],
        amazonAsin: null,
        amazonQuery: 'Tajima SGP-30M équerre charpentier inox',
        lmQuery: 'équerre charpentier tajima',
      },
    ],
  },

  'tariere': {
    name: 'Tarière thermique',
    icon: 'rotate_right',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Scheppach',
        model: 'EB800',
        price: 90,
        specs: ['800 W', 'Ø150 mm max', '1 personne', 'Vrille 800 mm'],
        amazonAsin: null,
        amazonQuery: 'Scheppach EB800 tarière thermique sol',
        lmQuery: 'tarière thermique scheppach eb800',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Greencut',
        model: 'TM1201',
        price: 175,
        specs: ['52 cm³', 'Ø200 mm max', '2 personnes', 'Vrille 900 mm'],
        amazonAsin: null,
        amazonQuery: 'Greencut TM1201 tarière thermique 2 personnes',
        lmQuery: 'tarière thermique greencut',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Stihl',
        model: 'BT 45',
        price: 420,
        specs: ['1,4 kW', 'Ø250 mm max', 'Couple élevé', 'SAV réseau'],
        amazonAsin: null,
        amazonQuery: 'Stihl BT 45 tarière thermique pro',
        lmQuery: 'tarière stihl bt 45',
      },
    ],
  },

  'perceuse-percussion': {
    name: 'Perceuse à percussion',
    icon: 'construction',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Black+Decker',
        model: 'BDCHD18K',
        price: 52,
        specs: ['18 V', '65 Nm', 'Mode marteau', '1 batterie'],
        amazonAsin: null,
        amazonQuery: 'Black Decker BDCHD18K perceuse percussion 18v',
        lmQuery: 'perceuse percussion black decker 18v',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PSB 18 LI-2',
        price: 95,
        specs: ['18 V', '63 Nm', '2 batteries 2 Ah', '3 modes'],
        amazonAsin: null,
        amazonQuery: 'Bosch PSB 18 LI-2 perceuse percussion sans fil',
        lmQuery: 'perceuse percussion bosch psb 18',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Makita',
        model: 'DHP486RTJ',
        price: 185,
        specs: ['18 V', '91 Nm', '2 batteries 5 Ah', 'Coffret robuste'],
        amazonAsin: null,
        amazonQuery: 'Makita DHP486RTJ perceuse percussion coffret',
        lmQuery: 'perceuse percussion makita dhp486',
      },
    ],
  },

  'niveau-bulle': {
    name: 'Niveau à bulle 80 cm',
    icon: 'straighten',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Stanley',
        model: 'Classic 80 cm',
        price: 18,
        specs: ['Aluminium', '3 ampoules', '±0,5 mm/m'],
        amazonAsin: null,
        amazonQuery: 'Stanley niveau à bulle 80cm aluminium',
        lmQuery: 'niveau à bulle 80cm stanley',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Stabila',
        model: 'Type 80P',
        price: 48,
        specs: ['Aluminium épais', '80 cm', '±0,3 mm/m', 'Bords de mesure plans'],
        amazonAsin: null,
        amazonQuery: 'Stabila 80P niveau bulle 80cm pro',
        lmQuery: 'niveau à bulle stabila 80cm',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Stabila',
        model: 'TECH 80 MAG',
        price: 75,
        specs: ['Magnétique', '80 cm', '±0,2 mm/m', 'Antichoc IP67'],
        amazonAsin: null,
        amazonQuery: 'Stabila TECH 80 MAG niveau magnétique',
        lmQuery: 'niveau magnétique stabila tech 80',
      },
    ],
  },

  'cordeau-macon': {
    name: 'Cordeau de maçon',
    icon: 'gesture',
    tiers: [
      {
        key: 'budget',
        label: 'Entrée de gamme',
        brand: 'Stanley',
        model: '0-47-985',
        price: 9,
        specs: ['15 m de fil', 'Chalk box métal', 'Recharge bleue incluse'],
        amazonAsin: null,
        amazonQuery: 'Stanley 0-47-985 cordeau traceur maçon',
        lmQuery: 'cordeau traceur stanley',
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Tajima',
        model: 'PLM-13BL',
        price: 24,
        specs: ['30 m de fil', 'Rembobinage automatique', 'Poudre bleue 90 g incluse'],
        amazonAsin: null,
        amazonQuery: 'Tajima PLM-13BL cordeau traceur maçon',
        lmQuery: 'cordeau traceur tajima',
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Tajima',
        model: 'CLK-55MG',
        price: 48,
        specs: ['55 m de fil kevlar', 'Corps magnésium', 'Rembobinage rapide'],
        amazonAsin: null,
        amazonQuery: 'Tajima CLK-55MG cordeau traceur kevlar pro',
        lmQuery: 'cordeau traceur tajima clk',
      },
    ],
  },
};

/* ══════════════════════════════════════════════════
   OUTILS PAR MODULE — référence + desc contextuelle
══════════════════════════════════════════════════ */

const PROJECT_TOOL_REFS = {
  terrasse: [
    { id: 'scie-circulaire',  desc: 'Découpe des lames de terrasse et lambourdes à longueur — réglage de biais pour les coupes d\'onglet en bordure.' },
    { id: 'perceuse-visseuse', desc: 'Vissage des lames sur les lambourdes — compter ~6 vis/m² de terrasse, une batterie 18V suffit pour 15 m².' },
    { id: 'niveau-laser',     desc: 'Mise de niveau des plots réglables et vérification des lambourdes sur toute la surface — économise 30 min de corrections.' },
    { id: 'ponceuse-orbitale', desc: 'Ponçage de finition des lames après pose — ouvre les pores du bois avant application d\'huile ou lasure.' },
  ],
  cabanon: [
    { id: 'scie-circulaire',    desc: 'Coupe des montants ossature, chevrons et lames de bardage — réglage biais pour les coupes de rive de toit mono-pente.' },
    { id: 'perceuse-visseuse',  desc: 'Assemblage montants, lissage basse/haute et bardage — prévoir 2 batteries pour les journées longues.' },
    { id: 'niveau-laser',       desc: 'Aplomb des montants et horizontalité des lissages — critique pour une ossature DTU conforme.' },
    { id: 'equerre-charpentier', desc: 'Traçage des coupes d\'about et angles de chevrons — une 300 mm couvre toutes les sections courantes (9×9, 6×15).' },
  ],
  pergola: [
    { id: 'tariere',           desc: 'Forage des trous d\'ancrage des poteaux — sol dur ou argileux impose un modèle thermique 2 personnes.' },
    { id: 'perceuse-percussion', desc: 'Fixation des platines dans le béton et assemblage bois — le mode percussion est indispensable sur dalle.' },
    { id: 'niveau-bulle',      desc: 'Verticalité des poteaux et horizontalité des longerons — un 80 cm est le minimum pour des portées de 3–4 m.' },
    { id: 'scie-circulaire',   desc: 'Coupe des poteaux à hauteur, longerons et chevrons — une lame fine 48 dents évite l\'éclatement.' },
  ],
  cloture: [
    { id: 'tariere',          desc: 'Forage des trous de poteaux tous les 2–2,5 m — obligatoire sur sol dur ou argileux sous peine de blessure.' },
    { id: 'perceuse-visseuse', desc: 'Fixation des rails et vissage des lames — 18V suffit, 2 batteries recommandées sur une clôture de 20+ m.' },
    { id: 'cordeau-macon',    desc: 'Alignement des poteaux sur toute la longueur — indispensable pour une ligne parfaite sans dévers visible.' },
    { id: 'niveau-bulle',     desc: 'Aplomb de chaque poteau après scellement — à contrôler systématiquement avant que le béton prenne.' },
  ],
};

export function getProjectTools(projectType) {
  const refs = PROJECT_TOOL_REFS[projectType] ?? [];
  return refs.map(({ id, desc }) => ({
    id,
    desc,
    ...TOOL_TIERS[id],
  }));
}

/* ══════════════════════════════════════════════════
   CONSOMMABLES PAR MODULE (liens recherche uniquement)
══════════════════════════════════════════════════ */

export const PROJECT_CONSUMABLES = {
  terrasse: [
    {
      category: 'Sécurité & EPI',
      icon: 'ph-shield-check',
      items: [
        {
          id: 'combinaison-terrasse',
          name: 'Combinaison de travail',
          desc: 'Idéale pour les journées de pose au sol — protège les genoux et le torse des échardes et copeaux de bois.',
          amazonQuery: 'combinaison travail btp protection échardes homme taille réglable',
          lmQuery: 'combinaison travail btp',
        },
        {
          id: 'gants-terrasse',
          name: 'Gants de travail anti-échardes',
          desc: 'Manipulation des lames et lambourdes brutes — gants cuir ou polyuréthane EN 388, bonne dextérité.',
          amazonQuery: 'gants travail anti-échardes bricolage bois EN388',
          lmQuery: 'gants travail bricolage bois',
        },
        {
          id: 'lunettes-terrasse',
          name: 'Lunettes de protection',
          desc: 'Copeaux de scie circulaire et projections lors du vissage — norme EN 166, lunettes anti-buée recommandées.',
          amazonQuery: 'lunettes protection bricolage EN166 anti-projection copeaux',
          lmQuery: 'lunettes protection bricolage',
        },
        {
          id: 'genouilleres-terrasse',
          name: 'Genouillères de chantier',
          desc: 'Indispensables pour la pose au sol des lames — modèle à coquille rigide EVA, sangle réglable.',
          amazonQuery: 'genouillères chantier ergonomiques coquille rigide EVA bricolage',
          lmQuery: 'genouillères chantier pose sol',
        },
      ],
    },
    {
      category: 'Protection & finition',
      icon: 'ph-paint-brush',
      items: [
        {
          id: 'huile-terrasse',
          name: 'Huile bois terrasse',
          desc: 'Pénètre dans les fibres — idéale pin, douglas, châtaignier. 1 L couvre ~8 m² (2 couches).',
          amazonQuery: 'huile bois terrasse extérieur',
          lmQuery: 'huile terrasse bois',
        },
        {
          id: 'lasure-terrasse',
          name: 'Lasure saturateur',
          desc: 'Film de surface coloré — convient aux bois denses (exotiques, IPE). Renouvellement tous les 2–3 ans.',
          amazonQuery: 'lasure saturateur bois terrasse extérieur',
          lmQuery: 'lasure saturateur terrasse',
        },
        {
          id: 'traitement-terrasse',
          name: 'Traitement fongistatique',
          desc: 'À appliquer sur les coupes fraîches avant l\'huile — protège contre les moisissures et champignons.',
          amazonQuery: 'traitement fongistatique bois extérieur',
          lmQuery: 'traitement bois extérieur',
        },
      ],
    },
    {
      category: 'Visserie',
      icon: 'ph-screw',
      items: [
        {
          id: 'vis-terrasse',
          name: 'Vis terrasse inox A4 Ø5×60',
          desc: 'Tête fraisée Torx — inox A4 obligatoire en extérieur pour éviter les taches de rouille sur le bois.',
          amazonQuery: 'vis terrasse inox a4 torx 5x60 boîte',
          lmQuery: 'vis terrasse inox torx',
        },
        {
          id: 'embouts-terrasse',
          name: 'Kit embouts Torx magnétiques',
          desc: 'Les embouts de série s\'arrondissent sur inox — un kit Torx magnétique dédié (TX20/TX25) tient la journée.',
          amazonQuery: 'kit embouts torx magnétique inox tx20 tx25',
          lmQuery: 'embouts torx vissage inox',
        },
      ],
    },
    {
      category: 'Abrasifs',
      icon: 'ph-circles-three',
      items: [
        {
          id: 'disques-terrasse',
          name: 'Disques ponceuse orbitale',
          desc: 'Grain 60 pour dégrossir, grain 120 pour la finition avant huilage. Pack mixte 25 disques recommandé.',
          amazonQuery: 'disques abrasifs ponceuse orbitale bois grain 60 120 pack',
          lmQuery: 'disques abrasifs ponceuse orbitale bois',
        },
      ],
    },
  ],

  cabanon: [
    {
      category: 'Sécurité & EPI',
      icon: 'ph-shield-check',
      items: [
        {
          id: 'combinaison-cabanon',
          name: 'Combinaison de travail',
          desc: 'Chantier ossature bois sur plusieurs jours — combinaison multi-poches, genoux renforcés, résistante aux échardes.',
          amazonQuery: 'combinaison travail btp protection échardes homme taille réglable',
          lmQuery: 'combinaison travail btp',
        },
        {
          id: 'gants-cabanon',
          name: 'Gants anti-coupures niveau 3',
          desc: 'Manipulation des tôles de couverture et visserie — gants EN 388 niveau 3 minimum, préhension fine.',
          amazonQuery: 'gants travail anti-coupures EN388 niveau 3 bricolage',
          lmQuery: 'gants anti-coupures travail',
        },
        {
          id: 'lunettes-cabanon',
          name: 'Lunettes de protection',
          desc: 'Sciage, vissage et découpe de voliges — norme EN 166, indispensable lors des coupes de toit en hauteur.',
          amazonQuery: 'lunettes protection bricolage EN166 anti-projection copeaux',
          lmQuery: 'lunettes protection bricolage',
        },
        {
          id: 'casque-cabanon',
          name: 'Protège-oreilles casque SNR35',
          desc: 'La scie circulaire sur ossature bois dépasse 98 dB — casque SNR 35 dB ou bouchons 33 dB pour les coupes longues.',
          amazonQuery: 'casque protège-oreilles chantier SNR35 réducteur bruit',
          lmQuery: 'casque protège-oreilles chantier',
        },
      ],
    },
    {
      category: 'Protection & finition',
      icon: 'ph-paint-brush',
      items: [
        {
          id: 'lasure-bardage',
          name: 'Lasure bardage façade',
          desc: 'Formulation façade résistante UV et pluie battante. 1 L pour ~6–8 m² de bardage (2 couches).',
          amazonQuery: 'lasure bardage bois façade extérieur UV',
          lmQuery: 'lasure bardage façade bois',
        },
        {
          id: 'traitement-cabanon',
          name: 'Traitement de fond autoclave',
          desc: 'Sur les coupes fraîches et about de chevrons — empêche la reprise d\'humidité sur bois non traité.',
          amazonQuery: 'traitement fond bois autoclave about coupes extérieur',
          lmQuery: 'traitement fond bois extérieur',
        },
      ],
    },
    {
      category: 'Visserie & fixation',
      icon: 'ph-screw',
      items: [
        {
          id: 'vis-ossature',
          name: 'Vis ossature bois 6×120',
          desc: 'Assemblage montants et lisses — tête hexagonale, acier zingué. 100 pcs pour un cabanon 3×4 m.',
          amazonQuery: 'vis charpente ossature bois 6x120 zingué tête hexagonale',
          lmQuery: 'vis charpente ossature bois 6x120',
        },
        {
          id: 'vis-bardage',
          name: 'Vis bardage inox 4×40',
          desc: 'Fixation des lames de bardage — tête plate fraisée inox pour éviter les coulures de rouille.',
          amazonQuery: 'vis bardage bois inox 4x40 torx fraisée',
          lmQuery: 'vis bardage inox 4x40',
        },
        {
          id: 'embouts-cabanon',
          name: 'Kit embouts variés',
          desc: 'Torx + PH2 + carré — un plateau 32 embouts magnétiques couvre tous les types de vis du chantier.',
          amazonQuery: 'kit embouts visseuse magnétique plateau 32 pcs torx ph2',
          lmQuery: 'kit embouts visseuse plateau',
        },
      ],
    },
    {
      category: 'Lames & disques',
      icon: 'ph-circles-three',
      items: [
        {
          id: 'lame-scie-cabanon',
          name: 'Lame scie circulaire bois',
          desc: '24 dents pour coupes rapides en charpente, 48 dents pour bardage fin. Prévoir les deux sur un cabanon.',
          amazonQuery: 'lame scie circulaire bois 190mm 24 48 dents carbure',
          lmQuery: 'lame scie circulaire bois carbure 190mm',
        },
      ],
    },
  ],

  pergola: [
    {
      category: 'Sécurité & EPI',
      icon: 'ph-shield-check',
      items: [
        {
          id: 'combinaison-pergola',
          name: 'Combinaison de travail',
          desc: 'Chantier pergola avec forage et béton — combinaison résistante aux salissures et aux projections de ciment.',
          amazonQuery: 'combinaison travail btp protection échardes homme taille réglable',
          lmQuery: 'combinaison travail btp',
        },
        {
          id: 'gants-pergola',
          name: 'Gants de manutention renforcés',
          desc: 'Manutention de poteaux 9×9 et sections lourdes — gants cuir ou synthétique EN 388 avec renfort paume.',
          amazonQuery: 'gants manutention renforcés cuir EN388 chantier bois',
          lmQuery: 'gants manutention chantier bois',
        },
        {
          id: 'lunettes-pergola',
          name: 'Lunettes de protection',
          desc: 'Copeaux lors du sciage en hauteur et éclats de béton au scellement — norme EN 166 anti-projection.',
          amazonQuery: 'lunettes protection bricolage EN166 anti-projection copeaux',
          lmQuery: 'lunettes protection bricolage',
        },
        {
          id: 'bouchons-pergola',
          name: 'Protège-oreilles / bouchons',
          desc: 'Tarière thermique et scie circulaire sur ossature bois — bouchons SNR 33 dB pour les phases de forage.',
          amazonQuery: 'bouchons oreilles chantier 35dB jetables protection auditive',
          lmQuery: 'protège-oreilles chantier',
        },
      ],
    },
    {
      category: 'Protection & finition',
      icon: 'ph-paint-brush',
      items: [
        {
          id: 'lasure-pergola',
          name: 'Lasure bois extérieur',
          desc: 'Protection UV pour poteaux et longerons très exposés — renouvellement tous les 2–3 ans.',
          amazonQuery: 'lasure bois extérieur protection UV pergola poteaux',
          lmQuery: 'lasure bois extérieur UV',
        },
        {
          id: 'saturateur-pergola',
          name: 'Saturateur huileux',
          desc: 'Pour bois denses (robinier, acacia) — pénètre sans former de film, idéal entretien pluriannuel.',
          amazonQuery: 'saturateur huileux bois dense extérieur pergola',
          lmQuery: 'saturateur bois extérieur huileux',
        },
        {
          id: 'traitement-pergola',
          name: 'Traitement de coupes',
          desc: 'À appliquer immédiatement après toute coupe de poteau ou chevron pour fermer le grain.',
          amazonQuery: 'traitement bois about coupes extérieur fond',
          lmQuery: 'traitement fond bois coupes',
        },
      ],
    },
    {
      category: 'Visserie & fixation',
      icon: 'ph-screw',
      items: [
        {
          id: 'vis-pergola',
          name: 'Vis charpente 6×160',
          desc: 'Assemblage longerons sur poteaux — tête hexagonale galvanisée, traitement anticorrosion classe 4.',
          amazonQuery: 'vis charpente bois 6x160 galvanisé classe 4 extérieur',
          lmQuery: 'vis charpente 6x160 galvanisé',
        },
        {
          id: 'boulons-pergola',
          name: 'Boulons inox M10 + rondelles',
          desc: 'Assemblages sollicités jonction poteau-longeron sur 2 faces — kit boulons + rondelles + écrous.',
          amazonQuery: 'boulons inox M10 kit rondelles écrous assemblage bois charpente',
          lmQuery: 'boulons inox M10 bois',
        },
      ],
    },
    {
      category: 'Lames & disques',
      icon: 'ph-circles-three',
      items: [
        {
          id: 'lame-scie-pergola',
          name: 'Lame scie circulaire 24 dents',
          desc: 'Coupe franche pour sections 9×9 et 6×15 — lame Ø190 ou 210 selon le modèle de scie.',
          amazonQuery: 'lame scie circulaire bois 190mm 24 dents charpente carbure',
          lmQuery: 'lame scie circulaire bois charpente 190mm',
        },
      ],
    },
  ],

  cloture: [
    {
      category: 'Sécurité & EPI',
      icon: 'ph-shield-check',
      items: [
        {
          id: 'combinaison-cloture',
          name: 'Combinaison de travail',
          desc: 'Protège des échardes lors du transport et débit des lames — poches renforcées, traitement déperlant.',
          amazonQuery: 'combinaison travail btp protection échardes homme taille réglable',
          lmQuery: 'combinaison travail btp',
        },
        {
          id: 'gants-cloture',
          name: 'Gants anti-coupures niveau 3',
          desc: 'Lames de clôture et visserie inox sont tranchants — gants EN 388 niveau 3 minimum recommandés.',
          amazonQuery: 'gants travail anti-coupures EN388 niveau 3 bricolage',
          lmQuery: 'gants anti-coupures travail',
        },
        {
          id: 'lunettes-cloture',
          name: 'Lunettes de protection',
          desc: 'Projection de copeaux lors de la découpe et bris de béton au scellement — norme EN 166 obligatoire.',
          amazonQuery: 'lunettes protection bricolage EN166 anti-projection copeaux',
          lmQuery: 'lunettes protection bricolage',
        },
        {
          id: 'bouchons-cloture',
          name: 'Protège-oreilles / bouchons',
          desc: 'Scie circulaire et perforateur dépassent 95 dB — protège-oreilles jetables ou casque anti-bruit.',
          amazonQuery: 'bouchons oreilles chantier 35dB jetables protection auditive',
          lmQuery: 'protège-oreilles chantier',
        },
      ],
    },
    {
      category: 'Protection & finition',
      icon: 'ph-paint-brush',
      items: [
        {
          id: 'saturateur-cloture',
          name: 'Saturateur clôture',
          desc: 'Formulation spéciale bois très exposé — protège contre humidité, UV et champignons. 2 couches à la pose.',
          amazonQuery: 'saturateur bois clôture extérieur protection UV humidité',
          lmQuery: 'saturateur clôture bois extérieur',
        },
        {
          id: 'lasure-cloture',
          name: 'Lasure colorée façade',
          desc: 'Pour clôtures teintées — 1 couche de fond d\'impression + 2 couches lasure pour une durabilité max.',
          amazonQuery: 'lasure colorée bois clôture extérieur façade',
          lmQuery: 'lasure clôture bois colorée',
        },
      ],
    },
    {
      category: 'Visserie',
      icon: 'ph-screw',
      items: [
        {
          id: 'vis-lames-cloture',
          name: 'Vis lames clôture inox 4×40',
          desc: '2 vis par lame et par rail — inox ou zingué selon budget. Tête fraisée Torx, boîte de 200 pcs.',
          amazonQuery: 'vis clôture bois inox 4x40 torx fraisée boite 200',
          lmQuery: 'vis clôture inox 4x40',
        },
        {
          id: 'embouts-cloture',
          name: 'Kit embouts Torx TX20/TX25',
          desc: 'Un kit de 10 embouts Torx suffit — les vis de clôture en inox arrondissent vite les embouts bas de gamme.',
          amazonQuery: 'kit embouts torx tx20 tx25 magnétique inox 10pcs',
          lmQuery: 'embouts torx tx20 tx25 vissage',
        },
      ],
    },
    {
      category: 'Béton & lames',
      icon: 'ph-circles-three',
      items: [
        {
          id: 'beton-cloture',
          name: 'Béton prêt à l\'emploi 25 kg',
          desc: 'Scellement des poteaux — compter 1 sac de 25 kg par poteau. Prise complète en 24–48h selon température.',
          amazonQuery: 'béton prêt emploi sac 25kg scellement poteau',
          lmQuery: 'béton prêt emploi scellement poteau 25kg',
        },
        {
          id: 'lame-scie-cloture',
          name: 'Lame scie 48 dents fine',
          desc: 'Coupe nette pour lames de clôture — lame 48 dents évite l\'éclatement du bois en sortie de coupe.',
          amazonQuery: 'lame scie circulaire bois 165mm 48 dents fine anti-éclat',
          lmQuery: 'lame scie circulaire bois fine anti-éclat',
        },
      ],
    },
  ],
};
