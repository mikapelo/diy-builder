/**
 * projectTools.js — Outils (avec gammes) + consommables par type de projet
 *
 * Architecture liens :
 *   - Outils      : amazonAsin (ASIN direct, prioritaire) ou amazonQuery (fallback recherche modèle exact)
 *   - Consommables: amazonQuery uniquement (produits trop variables pour ASINs stables)
 *
 * Image produit : dérivée de l'ASIN via le CDN public Amazon, pattern stable :
 *   https://m.media-amazon.com/images/P/{ASIN}.jpg
 * Si l'image n'existe pas (certaines marques Amazon n'utilisent que /images/I/), le composant
 * tombe sur l'icône Material Symbols.
 *
 * Commission Amazon Associates : générée sur tout achat dans les 24h après le clic.
 *
 * Tag Amazon : 'diybuilder01-21'
 */

const AMAZON_TAG = 'diybuilder01-21';

/**
 * Construit l'URL Amazon avec tag affilié et sub-tag de tracking optionnel.
 * Le sub-tag passé via `ascsubtag` permet de segmenter les conversions dans
 * Associates Central sans créer 100 tracking IDs séparés.
 *
 * Convention sub-tag : `[module]-[zone]-[tier?]`
 *   - module : terrasse | cabanon | pergola | cloture
 *   - zone   : kit | tier | cons (consommable)
 *   - tier   : budget | polyvalent | pro  (optionnel, uniquement pour zone=tier)
 *
 * Exemples :
 *   - 'terrasse-kit'              → clic depuis le bloc Kit terrasse
 *   - 'cabanon-tier-polyvalent'   → clic carte polyvalent de l'onglet Outils
 *   - 'pergola-cons'              → clic depuis l'accordion Consommables pergola
 */
export function buildAmazonUrl(query, asin, subtag) {
  const subParam = subtag ? `&ascsubtag=${encodeURIComponent(subtag)}` : '';
  if (asin) return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_TAG}${subParam}`;
  return `https://www.amazon.fr/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}${subParam}`;
}

export function buildAmazonImageUrl(asin) {
  if (!asin) return null;
  return `https://m.media-amazon.com/images/P/${asin}.jpg`;
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
        specs: ['1600 W', 'Ø190 mm', 'Lame 24 dents incluse'],
        amazonAsin: 'B07GBJ15VB',
        amazonQuery: 'Ryobi RCS1600 scie circulaire bois',
        lmQuery: 'scie circulaire ryobi',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PKS 55 A',
        price: 85,
        specs: ['1200 W', 'Ø160 mm', 'Coupe 55 mm bois', 'Guide parallèle'],
        amazonAsin: 'B002EX2Y6E',
        amazonQuery: 'Bosch PKS 55 A scie circulaire',
        lmQuery: 'scie circulaire bosch pks 55',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Makita',
        model: 'HS7601J',
        price: 165,
        specs: ['1200 W', 'Ø190 mm', 'Coffret Makpac', '5 200 tr/min'],
        amazonAsin: 'B012CKR97M',
        amazonQuery: 'Makita HS7601J scie circulaire coffret',
        lmQuery: 'scie circulaire makita hs7601',
        prime: true,
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
        specs: ['10,8 V Li-Ion', '26 Nm', 'Bois 25 mm / acier 10 mm', '10 positions couple'],
        amazonAsin: 'B016XLYJXS',
        amazonQuery: 'Black Decker BDCDD12K perceuse visseuse',
        lmQuery: 'perceuse visseuse black decker 12v',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PSR 18 LI-2',
        price: 90,
        specs: ['18 V', '38 Nm', '2 batteries + accessoires', 'Bois 35 mm / acier 10 mm'],
        amazonAsin: 'B007Z187D4',
        amazonQuery: 'Bosch PSR 18 LI-2 perceuse visseuse',
        lmQuery: 'perceuse visseuse bosch psr 18',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Makita',
        model: 'DDF487',
        price: 185,
        specs: ['18 V LXT brushless', '40 Nm', 'XPT antipoussière', '20 couples + perçage'],
        amazonAsin: 'B099NSD35X',
        amazonQuery: 'Makita DDF487 perceuse visseuse 18V',
        lmQuery: 'perceuse visseuse makita ddf487',
        prime: true,
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
        brand: 'Bosch',
        model: 'Quigo Green',
        price: 60,
        specs: ['Croix laser verte', 'Auto-nivellement ±4°', 'Pince MM 2 universelle', 'Indoor 6 m'],
        amazonAsin: 'B07NXB6SYD',
        amazonQuery: 'Bosch Quigo Green niveau laser croix verte',
        lmQuery: 'niveau laser bosch quigo green',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'GLL 2-15 G',
        price: 80,
        specs: ['2 lignes vertes', 'Portée 15 m', '±0,3 mm/m', 'IP64 + coffret'],
        amazonAsin: 'B0883SMTXL',
        amazonQuery: 'Bosch GLL 2-15 G niveau laser ligne verte',
        lmQuery: 'niveau laser bosch gll 2-15',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Bosch',
        model: 'GLL 3-80 CG',
        price: 250,
        specs: ['3 lignes vertes 360°', 'Portée 30 m (80 m cellule)', '±0,2 mm/m', 'App + L-BOXX'],
        amazonAsin: 'B07525S65F',
        amazonQuery: 'Bosch GLL 3-80 CG niveau laser 3 lignes',
        lmQuery: 'niveau laser bosch gll 3-80',
        prime: true,
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
        specs: ['260 W', 'Ø125 mm', '13 000 tr/min', 'Aspiration intégrée'],
        amazonAsin: 'B002A05VQQ',
        amazonQuery: 'Black Decker KA198 ponceuse orbitale 125mm',
        lmQuery: 'ponceuse orbitale black decker',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PSS 250 AE',
        price: 55,
        specs: ['250 W', 'Plateau 92×182 mm', '14 000-24 000 tr/min', 'Microfilter Bosch'],
        amazonAsin: 'B000ARDYXS',
        amazonQuery: 'Bosch PSS 250 AE ponceuse vibrante',
        lmQuery: 'ponceuse orbitale bosch pss 250',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Bosch',
        model: 'GEX 125-1 AE',
        price: 100,
        specs: ['250 W', 'Ø125 mm', 'Excentrique pro', 'Compatible aspirateur'],
        amazonAsin: 'B00SPB9TXK',
        amazonQuery: 'Bosch GEX 125-1 AE ponceuse excentrique',
        lmQuery: 'ponceuse excentrique bosch gex 125',
        prime: true,
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
        model: '1-45-686',
        price: 18,
        specs: ['Acier inox 300 mm', 'Graduations mm/pouce', 'Photogravure double face', 'Angles 90° / 45°'],
        amazonAsin: 'B0001IW9E6',
        amazonQuery: 'Stanley 1-45-686 équerre charpentier 300mm',
        lmQuery: 'équerre charpentier stanley 300mm',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Irwin',
        model: '300 mm',
        price: 32,
        specs: ['Lame 300 mm acier', 'Manche aluminium', 'Précision graduée', 'Pro de référence'],
        amazonAsin: 'B00360YS9A',
        amazonQuery: 'Irwin équerre charpentier 300mm aluminium',
        lmQuery: 'équerre charpentier irwin',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Shinwa',
        model: '300×150 mm',
        price: 58,
        specs: ['Acier inox épais 2 mm', '300×150 mm', 'Made in Japan', 'Photogravure laser'],
        amazonAsin: 'B002JQVG9W',
        amazonQuery: 'Shinwa équerre charpentier inox 300x150 japon',
        lmQuery: 'équerre charpentier inox japon',
        prime: true,
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
        brand: 'Leman',
        model: 'LOTAR052',
        price: 140,
        specs: ['52 cm³ thermique', 'Ø100 mm max', '1 personne', '3 mèches incluses'],
        amazonAsin: 'B00VIAEPW0',
        amazonQuery: 'Leman LOTAR052 tarière thermique 52cc',
        lmQuery: 'tarière thermique 52cc',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Greencut',
        model: 'GD750X-3S',
        price: 230,
        specs: ['75 cm³ / 5,2 CV', 'Ø100/150/200 mm', '2 temps', '3 mèches acier'],
        amazonAsin: 'B08H8WX8B3',
        amazonQuery: 'Greencut GD750X-3S tarière thermique 75cc',
        lmQuery: 'tarière thermique greencut 75cc',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Greencut',
        model: 'GD750X',
        price: 320,
        specs: ['75 cm³ / 5,2 CV', '3 mèches 100/200/300 mm', 'Rallonges 60 cm × 3', 'Profondeur 2,8 m'],
        amazonAsin: 'B073QWDNNH',
        amazonQuery: 'Greencut GD750X tarière thermique pro rallonges',
        lmQuery: 'tarière thermique greencut pro',
        prime: true,
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
        model: 'BDCHD18',
        price: 75,
        specs: ['18 V Li-Ion 1,5 Ah', '17,5-40 Nm', '21 000 cps/min', '2 vitesses + coffret'],
        amazonAsin: 'B01D9WA47O',
        amazonQuery: 'Black Decker BDCHD18 perceuse percussion 18V',
        lmQuery: 'perceuse percussion black decker 18v',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bosch',
        model: 'PSB 18 LI-2',
        price: 165,
        specs: ['18 V Syneon', '54 Nm', '2 batteries 2,5 Ah', '3 modes + coffret'],
        amazonAsin: 'B010D09RH8',
        amazonQuery: 'Bosch PSB 18 LI-2 perceuse percussion 2 batteries',
        lmQuery: 'perceuse percussion bosch psb 18',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Makita',
        model: 'DHP486',
        price: 175,
        specs: ['18 V LXT brushless', '130 Nm', 'XPT eau/poussière', '31 500 cps/min'],
        amazonAsin: 'B099NSX8MN',
        amazonQuery: 'Makita DHP486Z perceuse percussion brushless',
        lmQuery: 'perceuse percussion makita dhp486',
        prime: true,
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
        model: '1-42-315 MLH',
        price: 28,
        specs: ['Profil trapézoïdal alu', '80 cm', '±1 mm/m', 'Made in France'],
        amazonAsin: 'B008DI1OPQ',
        amazonQuery: 'Stanley 1-42-315 niveau trapézoïdal 80cm',
        lmQuery: 'niveau à bulle 80cm stanley',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Stabila',
        model: 'Type 80 AS',
        price: 55,
        specs: ['Profil alu renforcé', '80 cm', '±0,5 mm/m', 'Antidérapant intégré'],
        amazonAsin: 'B07H1RQQ9Y',
        amazonQuery: 'Stabila Type 80 AS niveau bulle 80cm',
        lmQuery: 'niveau à bulle stabila 80cm',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Stabila',
        model: 'Type 80 ASM',
        price: 85,
        specs: ['Magnétique terres rares', '80 cm', '±0,5 mm/m', 'Made in Germany'],
        amazonAsin: 'B07H1RR1P5',
        amazonQuery: 'Stabila Type 80 ASM niveau magnétique 80cm',
        lmQuery: 'niveau magnétique stabila 80cm',
        prime: true,
      },
    ],
  },

  'truelle': {
    name: 'Truelle de maçon',
    icon: 'construction',
    tiers: [
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Bahco',
        model: '2301B0000 Catalan 165',
        price: 18,
        specs: ['Lame Catalan 165 mm', 'Acier forgé bruni', 'Manche bi-matière', 'Marque pro Espagne'],
        amazonAsin: 'B00TT4NU0K',
        amazonQuery: 'Bahco 2301B0000 truelle Catalan 165 maçon',
        lmQuery: 'truelle maçon bahco 165',
        prime: true,
      },
    ],
  },

  'taloche': {
    name: 'Taloche maçon',
    icon: 'crop_square',
    tiers: [
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Vinmer',
        model: '010013 plastique 35×27',
        price: 12,
        specs: ['Plateau plastique 35×27 cm', 'Manche bois', 'Lissage de finition', 'Surface ≈ 10-15 m²'],
        amazonAsin: 'B00U63D0DU',
        amazonQuery: 'Vinmer 010013 taloche maçon plastique 35x27',
        lmQuery: 'taloche maçon plastique',
        prime: true,
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
        model: '0-47-100',
        price: 12,
        specs: ['30 m de fil', 'Chalk box métal', 'Robuste', 'Marque référence'],
        amazonAsin: 'B0001IW702',
        amazonQuery: 'Stanley 0-47-100 cordeau traceur 30m',
        lmQuery: 'cordeau traceur stanley',
        prime: true,
      },
      {
        key: 'polyvalent',
        label: 'Polyvalent',
        recommended: true,
        brand: 'Tajima',
        model: 'CR301JF',
        price: 28,
        specs: ['30 m fil acier japonais', 'Rembobinage 4× vitesse', 'Compact équilibré', 'Pro de charpente'],
        amazonAsin: 'B00FXR1QKS',
        amazonQuery: 'Tajima CR301JF cordeau traceur poudre 30m',
        lmQuery: 'cordeau traceur tajima',
        prime: true,
        bestSeller: true,
      },
      {
        key: 'pro',
        label: 'Professionnel',
        brand: 'Tajima',
        model: 'CR401SD',
        price: 48,
        specs: ['30 m × 1 mm nylon tressé', 'Rembobinage 5× vitesse', 'Boîtier alu pro', 'Trait fin maçon'],
        amazonAsin: 'B079VC77MZ',
        amazonQuery: 'Tajima CR401SD cordeau traceur pro alu',
        lmQuery: 'cordeau traceur tajima pro',
        prime: true,
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
  dalle: [
    { id: 'niveau-bulle',  desc: 'Vérifier la planéité de la forme drainante et du coffrage avant de couler — une dalle non plane se voit à l\'œil et concentre l\'eau au mauvais endroit.' },
    { id: 'cordeau-macon', desc: 'Aligner les piquets et le coffrage périphérique, et tracer la pente d\'écoulement de 1 cm/m vers l\'extérieur de la dalle.' },
    { id: 'truelle',       desc: 'Étaler le béton dans les coins et le raccorder aux bords du coffrage avant le tirage à la règle — la lame Catalan attrape bien les angles.' },
    { id: 'taloche',       desc: 'Talochage de finition après tirage à la règle : serre la surface et ferme la peau du béton avant la prise. Plaque 35×27 cm pour 10–15 m².' },
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
   KIT COMPLET — composition par projet (tier polyvalent)
   Sélection des 8-9 essentiels : 4 outils + 3 EPI + 2 consommables
══════════════════════════════════════════════════ */

const PROJECT_KITS = {
  terrasse: {
    tools:    ['scie-circulaire', 'perceuse-visseuse', 'niveau-laser', 'ponceuse-orbitale'],
    epi:      ['combinaison-terrasse', 'gants-terrasse', 'lunettes-terrasse'],
    supplies: ['vis-terrasse', 'huile-terrasse'],
  },
  cabanon: {
    tools:    ['scie-circulaire', 'perceuse-visseuse', 'niveau-laser', 'equerre-charpentier'],
    epi:      ['combinaison-cabanon', 'gants-cabanon', 'casque-cabanon'],
    supplies: ['vis-ossature', 'lasure-bardage'],
  },
  pergola: {
    tools:    ['tariere', 'perceuse-percussion', 'niveau-bulle', 'scie-circulaire'],
    epi:      ['combinaison-pergola', 'gants-pergola', 'lunettes-pergola'],
    supplies: ['vis-pergola', 'lasure-pergola'],
  },
  cloture: {
    tools:    ['tariere', 'perceuse-visseuse', 'cordeau-macon', 'niveau-bulle'],
    epi:      ['combinaison-cloture', 'gants-cloture', 'lunettes-cloture'],
    supplies: ['vis-lames-cloture', 'saturateur-cloture'],
  },
};

/* Aplatit `PROJECT_CONSUMABLES[projectType]` en map id→item pour lookup rapide */
function flattenConsumables(projectType) {
  const groups = PROJECT_CONSUMABLES[projectType] ?? [];
  const map = {};
  for (const g of groups) {
    for (const item of g.items) map[item.id] = { ...item, _category: g.category };
  }
  return map;
}

export function getProjectKit(projectType) {
  const conf = PROJECT_KITS[projectType];
  if (!conf) return null;
  const consumablesMap = flattenConsumables(projectType);

  const tools = conf.tools.map((id) => {
    const def = TOOL_TIERS[id];
    if (!def) return null;
    const tier = def.tiers.find((t) => t.key === 'polyvalent');
    if (!tier) return null;
    return {
      kind: 'tool',
      id,
      name: def.name,
      icon: def.icon,
      brand: tier.brand,
      model: tier.model,
      price: tier.price,
      amazonAsin: tier.amazonAsin,
      amazonQuery: tier.amazonQuery,
      prime: tier.prime,
    };
  }).filter(Boolean);

  const epi = conf.epi.map((id) => {
    const item = consumablesMap[id];
    if (!item) return null;
    return {
      kind: 'epi',
      id,
      name: item.name,
      amazonQuery: item.amazonQuery,
    };
  }).filter(Boolean);

  const supplies = conf.supplies.map((id) => {
    const item = consumablesMap[id];
    if (!item) return null;
    return {
      kind: 'supply',
      id,
      name: item.name,
      amazonQuery: item.amazonQuery,
    };
  }).filter(Boolean);

  const toolsTotal = tools.reduce((sum, t) => sum + (t.price ?? 0), 0);

  return { tools, epi, supplies, toolsTotal, itemCount: tools.length + epi.length + supplies.length };
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
          name: 'Lunettes 3M Solus EN166',
          desc: 'Copeaux de scie circulaire et projections lors du vissage — norme EN 166, anti-buée Scotchgard.',
          amazonAsin: 'B076BDDH37',
          amazonQuery: '3M Solus S1101SGAF lunettes protection EN166',
          lmQuery: 'lunettes protection bricolage',
          priceHint: '~10 €',
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
          name: 'Huile saturateur Owatrol Textrol',
          desc: 'Pénètre dans les fibres — idéale pin, douglas, châtaignier. 1 L couvre ~8-12 m² (2 couches). Made in France.',
          amazonAsin: 'B004HQ9G8K',
          amazonQuery: 'Owatrol Textrol saturateur bois extérieur incolore 1L',
          lmQuery: 'huile terrasse bois',
          priceHint: '~35 €',
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
          amazonAsin: 'B0716C7RB3',
          amazonQuery: 'Spax vis terrasse inox A4 5x60 torx',
          lmQuery: 'vis terrasse inox torx',
          priceHint: '~25 €',
        },
        {
          id: 'embouts-terrasse',
          name: 'Kit embouts Torx magnétiques',
          desc: 'Les embouts de série s\'arrondissent sur inox — un kit Torx magnétique dédié (TX20/TX25) tient la journée.',
          amazonAsin: 'B074G4G575',
          amazonQuery: 'Wera Bit-Box 20 TX25 embouts torx',
          lmQuery: 'embouts torx vissage inox',
          priceHint: '~15 €',
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
          name: 'Lunettes 3M Solus EN166',
          desc: 'Sciage, vissage et découpe de voliges — norme EN 166, anti-buée Scotchgard.',
          amazonAsin: 'B076BDDH37',
          amazonQuery: '3M Solus S1101SGAF lunettes protection EN166',
          lmQuery: 'lunettes protection bricolage',
          priceHint: '~10 €',
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
          name: 'Lasure Bondex Protection Extrême',
          desc: 'Façade très exposée — 12 ans de tenue UV/humidité. 1 L pour ~6-8 m² de bardage (2 couches).',
          amazonAsin: 'B091KXVDD7',
          amazonQuery: 'Bondex Protection Extreme lasure bois extérieur incolore',
          lmQuery: 'lasure bardage façade bois',
          priceHint: '~28 €',
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
          name: 'Vis SPAX charpente 6×100 (lot 100)',
          desc: 'Assemblage montants et lisses — tête disque Wirox A3J Torx T30. 100 pcs pour un cabanon 3×4 m.',
          amazonAsin: 'B072P165FK',
          amazonQuery: 'Spax vis charpente bois 6x100 Wirox T-Star Plus 100 pcs',
          lmQuery: 'vis charpente ossature bois 6x100',
          priceHint: '~32 €',
        },
        {
          id: 'vis-bardage',
          name: 'Vis bardage inox 4×40',
          desc: 'Fixation des lames de bardage — tête plate fraisée inox A2 pour éviter les coulures de rouille.',
          amazonAsin: 'B0716C7RB3',
          amazonQuery: 'Spax vis bardage inox A2 4x40 torx fraisée',
          lmQuery: 'vis bardage inox 4x40',
          priceHint: '~22 €',
        },
        {
          id: 'embouts-cabanon',
          name: 'Kit embouts Wera Bit-Box',
          desc: 'TX 25 plateau 20 embouts — qualité allemande, magnétiques, tient toute la longueur d\'un chantier.',
          amazonAsin: 'B074G4G575',
          amazonQuery: 'Wera Bit-Box 20 TX25 embouts torx',
          lmQuery: 'kit embouts visseuse plateau',
          priceHint: '~15 €',
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
          name: 'Lunettes 3M Solus EN166',
          desc: 'Copeaux lors du sciage en hauteur et éclats de béton au scellement — anti-buée Scotchgard.',
          amazonAsin: 'B076BDDH37',
          amazonQuery: '3M Solus S1101SGAF lunettes protection EN166',
          lmQuery: 'lunettes protection bricolage',
          priceHint: '~10 €',
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
          name: 'Lasure Bondex Protection Extrême',
          desc: 'Protection UV pour poteaux et longerons très exposés — 12 ans de tenue, séchage rapide.',
          amazonAsin: 'B091KXVDD7',
          amazonQuery: 'Bondex Protection Extreme lasure bois extérieur incolore',
          lmQuery: 'lasure bois extérieur UV',
          priceHint: '~28 €',
        },
        {
          id: 'saturateur-pergola',
          name: 'Owatrol D1 saturateur bois durs',
          desc: 'Pour bois denses (robinier, acacia, ipé) — pénètre sans former de film, idéal entretien pluriannuel.',
          amazonAsin: 'B007B27WE2',
          amazonQuery: 'Owatrol D1 saturateur bois durs exotique 1L',
          lmQuery: 'saturateur bois extérieur huileux',
          priceHint: '~38 €',
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
          name: 'Vis SPAX charpente 6×160 (lot 100)',
          desc: 'Assemblage longerons sur poteaux — Wirox A3J Torx, classe 4 corrosion, ETA-12/0114.',
          amazonAsin: 'B071YN7LMR',
          amazonQuery: 'Spax vis charpente bois 6x160 Wirox 100 pcs',
          lmQuery: 'vis charpente 6x160 galvanisé',
          priceHint: '~52 €',
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
          name: 'Lunettes 3M Solus EN166',
          desc: 'Projection de copeaux lors de la découpe et bris de béton au scellement — anti-buée Scotchgard.',
          amazonAsin: 'B076BDDH37',
          amazonQuery: '3M Solus S1101SGAF lunettes protection EN166',
          lmQuery: 'lunettes protection bricolage',
          priceHint: '~10 €',
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
          name: 'Owatrol Textrol saturateur incolore',
          desc: 'Bois très exposé — protège contre humidité, UV et champignons. 2 couches à la pose, 1 L = 8-12 m².',
          amazonAsin: 'B004HQ9G8K',
          amazonQuery: 'Owatrol Textrol saturateur bois extérieur incolore 1L',
          lmQuery: 'saturateur clôture bois extérieur',
          priceHint: '~35 €',
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
          name: 'Vis SPAX clôture inox A2 5×60',
          desc: '2 vis par lame et par rail — inox A2 tête fraisée Torx pour éviter coulures de rouille.',
          amazonAsin: 'B0716C7RB3',
          amazonQuery: 'Spax vis clôture inox A2 5x60 torx',
          lmQuery: 'vis clôture inox 4x40',
          priceHint: '~25 €',
        },
        {
          id: 'embouts-cloture',
          name: 'Kit embouts Wera Bit-Box',
          desc: 'TX 25 plateau 20 embouts — qualité allemande, les vis inox de clôture ne les arrondissent pas.',
          amazonAsin: 'B074G4G575',
          amazonQuery: 'Wera Bit-Box 20 TX25 embouts torx',
          lmQuery: 'embouts torx tx20 tx25 vissage',
          priceHint: '~15 €',
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
