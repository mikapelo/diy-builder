/**
 * awinProducts.js — Partenaires affiliés Awin (Aosom, Plots discount, Woodstore24, DeubaXXL)
 *
 * Tracking Awin via deep-link cread.php : Awin attribue le clic côté réseau
 * (clickref = notre sous-tag), pas d'UTM custom sur l'URL marchand.
 *   https://www.awin1.com/cread.php?awinmid={MID}&awinaffid={AFFID}&clickref={ref}&ued={URL}
 *
 * Éditeur DIY Builder : awinaffid 2934749.
 * Marchands rejoints : Aosom FR (mid 19184), Plots discount FR (mid 109434),
 * Woodstore24 FR (mid 57469), DeubaXXL FR (mid 21192).
 *
 * Produits relevés en direct le 2026-06-21 — prix indicatifs, susceptibles
 * d'évoluer (promos fréquentes côté Aosom/Woodstore24). Réveiller le snapshot si périmé.
 * Sélection éditoriale : pas de catalogue, 4 produits curés par module.
 */

const AWIN_AFFID = '2934749';

export const AWIN_MERCHANTS = {
  aosom: { name: 'Aosom', mid: '19184', site: 'aosom.fr' },
  plots: { name: 'Plots discount', mid: '109434', site: 'plots-discount.com' },
  woodstore: { name: 'Woodstore24', mid: '57469', site: 'woodstore24.fr' },
  deuba: { name: 'DeubaXXL', mid: '21192', site: 'deubaxxl.fr' },
};

export const AWIN_SNAPSHOT_DATE = '2026-06-21';

/**
 * Construit le deep-link Awin (format cread.php) vers une URL marchand.
 * @param {string} dest     — URL produit du marchand (non encodée)
 * @param {string} mid      — awinmid du marchand (ex. '19184')
 * @param {string} clickref — sous-tag d'attribution (ex. 'pergola-kit-sim')
 * @returns {string|null}
 */
export function buildAwinUrl(dest, mid, clickref) {
  if (!dest || !mid) return null;
  const ref = clickref ? `&clickref=${encodeURIComponent(clickref)}` : '';
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_AFFID}${ref}&ued=${encodeURIComponent(dest)}`;
}

/* ══════════════════════════════════════════════════
   PARTENAIRES PAR MODULE — cadrage éditorial + produits curés
   variant 'alternative' = produit fini (pas un matériau du build)
   variant 'complement'  = matériau que le simulateur calcule déjà
══════════════════════════════════════════════════ */

export const AWIN_PARTNERS = {
  pergola: {
    merchant: 'aosom',
    variant: 'alternative',
    eyebrow: 'Alternative prête à poser',
    title: 'La pergola sans le chantier',
    subtitle:
      'Vous avez chiffré une pergola en bois à monter vous-même. Pour un modèle livré prêt à poser — métal, aluminium ou toile rétractable — voici une sélection chez Aosom. Ce n’est pas du bois sur mesure, mais c’est en place en un week-end.',
    cta: 'Voir chez Aosom',
    products: [
      {
        name: 'Pergola bois 3×4 m pour plantes grimpantes',
        price: '451,90',
        rating: '4.9',
        url: 'https://www.aosom.fr/item/outsunny-pergola-de-jardin-exterieur-3-x-4-m-pergola-en-bois-pour-plantes-grimpantes-bois-naturel~1S83LUJJQ0000.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2025/03/10/Rp3d761957f773951.jpg',
      },
      {
        name: 'Pergola aluminium 3×4 m toit rétractable',
        price: '367,90',
        rating: '4.9',
        url: 'https://www.aosom.fr/item/outsunny-pergola-jardin-exterieur-en-aluminium-3-x-4-m-avec-toit-retractable-abri-soleil-upf30-pour-terrasse-patio-blanc~1S92IN3C21001.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2025/12/24/8Z7d5619b50e449f2.jpg',
      },
      {
        name: 'Pergola aluminium 3×3 m toit polycarbonate',
        price: '509,90',
        rating: '4.6',
        url: 'https://www.aosom.fr/item/outsunny-pergola-jardin-exterieur-en-aluminium-3-x-3-m-avec-toit-en-polycarbonate-impermeable-et-systeme-de-drainage~1SDDK4A09TO00.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2025/12/24/Ym515319b52b5c77e.jpg',
      },
      {
        name: 'Pergola 3×3 m auvent rétractable UPF30+',
        price: '301,90',
        rating: '4.8',
        url: 'https://www.aosom.fr/item/outsunny-pergola-3-x-3-m-avec-auvent-retractable-et-rideaux-abri-de-soleil-upf30-pour-jardin-terrasse-exterieur~2433RVCB9VG00.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2026/06/13/boi75919ec0c0f4dc.jpg',
      },
    ],
  },

  terrasse: {
    merchant: 'plots',
    variant: 'complement',
    eyebrow: 'Le matériel du projet',
    title: 'Les plots réglables de votre terrasse',
    subtitle:
      'Votre simulateur a calculé le nombre de plots. Voici des plots réglables Solidor et Jouplast, livrés à l’unité — la hauteur se règle de 23 à 463 mm selon votre support (lambourdes bois ou dalles).',
    cta: 'Voir chez Plots discount',
    products: [
      {
        name: 'Plot terrasse bois 23 à 440 mm — Solidor',
        price: '1,40',
        priceSuffix: '/ plot',
        rating: null,
        url: 'https://www.plots-discount.com/fr/plot-terrasse/1870-2856-plot-de-terrasse-bois-de-23-a-440-mm-solidor.html',
        img: 'https://www.plots-discount.com/7807-large_default/plot-de-terrasse-bois-de-23-a-440-mm-solidor.jpg',
      },
      {
        name: 'Plot terrasse dalle 23 à 440 mm — Solidor',
        price: '1,40',
        priceSuffix: '/ plot',
        rating: null,
        url: 'https://www.plots-discount.com/fr/plot-terrasse/1918-2977-plot-de-terrasse-dalle-de-23-a-440-mm-sans-cale-amortisseur-solidor.html',
        img: 'https://www.plots-discount.com/7814-large_default/plot-de-terrasse-dalle-de-23-a-440-mm-sans-cale-amortisseur-solidor.jpg',
      },
      {
        name: 'Plot dalle réglable 50/80 mm — Jouplast Essentiel',
        price: '2,05',
        priceSuffix: '/ plot',
        rating: null,
        url: 'https://www.plots-discount.com/fr/plot-terrasse-dalle/58-181-plot-terrasse-dalle-reglable-50-80-mm-gamme-essentiel-jouplast-3441290000146.html',
        img: 'https://www.plots-discount.com/6934-large_default/plot-terrasse-dalle-reglable-50-80-mm-gamme-essentiel-jouplast.jpg',
      },
      {
        name: 'Plot réglable pour pieu métallique — Jouplast Elevo',
        price: '3,45',
        priceSuffix: '/ plot',
        rating: null,
        url: 'https://www.plots-discount.com/fr/plots-terrasse-bois/764-plot-reglable-pour-pieu-metallique-elevo-jouplast-9503838754158.html',
        img: 'https://www.plots-discount.com/3860-large_default/plot-reglable-pour-pieu-metallique-elevo-jouplast.jpg',
      },
    ],
  },

  // Article « terrasse composite ou bois » : lames de platelage WPC (alternative aux
  // lames bois que le calculateur dimensionne). Woodstore24 = lames massives 3D
  // (gris clair/foncé 10,95 €/m) + premium coextrudée (15,50 €/m). Prix au MÈTRE LINÉAIRE.
  // CADRAGE : autopose, lame seule (hors structure). Placement article uniquement.
  'terrasse-composite': {
    merchant: 'woodstore',
    variant: 'alternative',
    eyebrow: 'Alternative composite',
    title: 'Les lames composite sans le saturateur',
    subtitle:
      'Votre calculateur dimensionne une terrasse en lames bois, à saturer tous les ans ou deux. Pour des lames composite (WPC) qui ne grisent pas et ne se saturent jamais, voici une sélection chez Woodstore24, de la lame massive structurée à la lame premium coextrudée. Ce n’est pas du bois massif, mais ça ne demande qu’un nettoyage — prix au mètre linéaire.',
    cta: 'Voir chez Woodstore24',
    products: [
      {
        name: 'Lame terrasse WPC massive 22×143 mm — gris clair, structure 3D',
        price: '10,95',
        priceSuffix: '/ mètre',
        rating: null,
        url: 'https://woodstore24.fr/wpc-terrassendiele-massivdiele-hellgrau-holzstruktur-22-mm-starke-x-143-mm-breite-3d-oberflache-in-den-langen-3-m-3-6-m-4-2-m-und-4-8-m.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/ba024d481b803908c2ed2d2ae49e042a/3/d/3d-gun23138.2_2_4.jpg',
      },
      {
        name: 'Lame terrasse WPC massive 22×143 mm — gris foncé, structure 3D',
        price: '10,95',
        priceSuffix: '/ mètre',
        rating: null,
        url: 'https://woodstore24.fr/wpc-terrassendiele-massivdiele-dunkelgrau-holzstruktur-22-mm-starke-x-143-mm-breite-3d-oberflache-in-den-langen-3-m-3-6-m-4-2-m-und-4-8-m.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/ba024d481b803908c2ed2d2ae49e042a/3/d/3d-gun23138.1_2.jpg',
      },
      {
        name: 'Lame terrasse WPC premium coextrudée 23×220 mm — Smooth Cream',
        price: '15,50',
        priceSuffix: '/ mètre',
        rating: null,
        url: 'https://woodstore24.fr/wpc-3-d-premium-coextrud-lame-massive-23-mm-s-x-220-mm-l-smooth-cream-en-longueurs-de-2-4-m-et-4-m.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/ba024d481b803908c2ed2d2ae49e042a/p/r/premium-produktbild-coex-beige.jpg',
      },
    ],
  },

  // DeubaXXL (mid 21192) — dalles/caillebotis À CLIPSER pour terrasse et balcon (relevé live
  // 2026-06-28). Produit fini posé sur sol existant, sans vis ni dalle béton → variante
  // 'alternative' à la terrasse construite. Catalogue Deuba = le plus profond (acacia FSC,
  // eucalyptus, WPC/composite, lots 11→66 dalles 30×30). Placement article uniquement.
  // Images 3000px → wsrv.nl ~420px, repli icône 'grid_view'.
  'dalle-clipsable': {
    merchant: 'deuba',
    variant: 'alternative',
    snapshotDate: '2026-06-28',
    eyebrow: 'Alternative sans travaux',
    title: 'Clipser plutôt que construire',
    subtitle:
      'Votre calculateur dimensionne une terrasse bois sur lambourdes, à visser. Pour un balcon ou une terrasse d’appoint, ces dalles à clipser se posent sur le sol existant en une après-midi et se démontent quand vous partez. Ce n’est pas une terrasse structurelle, mais c’est en place ce week-end — bois, composite ou WPC chez DeubaXXL.',
    cta: 'Voir chez DeubaXXL',
    products: [
      {
        name: 'Dalle composite clipsable terracotta — lot de 11 (≈1 m²)',
        price: '41,99',
        priceSuffix: '/ lot',
        rating: null,
        url: 'https://www.deubaxxl.fr/11x-dalles-en-composite-clipsables-terracotta-30x30cm/994369/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/db/70/d8/01_994369_fs-m.jpg&w=420&q=82&output=jpg',
      },
      {
        name: 'Dalle bois acacia FSC clipsable — lot de 33 (≈3 m²)',
        price: '78,99',
        priceSuffix: '/ lot',
        rating: null,
        url: 'https://www.deubaxxl.fr/dalle-en-bois-d-acacia-certifiee-fsc-lot-de-33-30x30cm/993129/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/d1/51/3a/01_993129_fs-m.jpg&w=420&q=82&output=jpg',
      },
      {
        name: 'Dalle bois eucalyptus — 33 dalles pour 3 m²',
        price: '89,99',
        priceSuffix: '/ lot',
        rating: null,
        url: 'https://www.deubaxxl.fr/33x-dalles-de-terrasse-pour-3m2-en-bois-d-eucalyptus-30x30cm/990480/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/5e/9d/b3/aa20ab87d1b6f6eaa922944b74c11e23_a-de-990480g4.jpg&w=420&q=82&output=jpg',
      },
      {
        name: 'Dalle WPC clipsable anthracite — lot de 66 (≈6 m²)',
        price: '213,99',
        priceSuffix: '/ lot',
        rating: null,
        url: 'https://www.deubaxxl.fr/66x-dalle-de-terrasse-clipsable-en-wpc-30x30cm-anthracite/995156/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/96/18/8a/01_995156_fs-m.jpg&w=420&q=82&output=jpg',
      },
    ],
  },

  // Fit limité : les abris Aosom plafonnent à ~5 m² (cabanon simulé jusqu'à 16 m²).
  // → cadrage honnête « petit abri de rangement » + simMaxArea gate le bloc côté simulateur.
  cabanon: {
    merchant: 'aosom',
    variant: 'alternative',
    simMaxArea: 6,
    eyebrow: 'Petit abri prêt à poser',
    title: 'Juste besoin de ranger ?',
    subtitle:
      'Le simulateur dimensionne un cabanon en ossature bois. Si votre besoin se limite à ranger outils, vélos ou mobilier, un abri prêt à poser (bois, résine ou acier, jusqu’à ~5 m²) revient souvent moins cher qu’une construction. Au-delà, mieux vaut construire.',
    cta: 'Voir chez Aosom',
    products: [
      {
        name: 'Abri de jardin bois sapin, 2 étagères',
        price: '264,90',
        rating: '4.7',
        url: 'https://www.aosom.fr/item/outsunny-armoire-de-jardin-bois~845-210.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2026/05/13/9xHb0519e1ea5f972.jpg',
      },
      {
        name: 'Abri de jardin résine 2,4×1,3 m avec plancher',
        price: '548,90',
        rating: '4.9',
        url: 'https://www.aosom.fr/item/outsunny-abri-de-jardin-exterieur-2-4-x-1-3-m-en-resine-avec-plancher-fenetre-portes-verrouillables-et-aerations-gris~1RNLHA1P9R801.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2025/07/31/4Fs0791986094a01c.jpg',
      },
      {
        name: 'Abri de jardin acier 4,83 m² porte coulissante',
        price: '345,90',
        rating: '4.7',
        url: 'https://www.aosom.fr/item/outsunny-abri-de-jardin-4-83-m-dim-2-77l-x-1-91l-x-1-92h-m-fondation-incluse-porte-coulissante-ventilations-tole-acier-gris~1INR1FDI8M800.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2025/01/23/m2V3f219493aeb241.jpg',
      },
      {
        name: 'Abri de jardin acier 3,6 m² portes coulissantes',
        price: '252,90',
        rating: '4.7',
        url: 'https://www.aosom.fr/item/outsunny-abri-de-jardin-3-2-m-remise-a-outils-avec-kit-de-fondation-en-acier-galvanise-avec-portes-coulissantes-vert~1PDTFI9BHTO00.html',
        img: 'https://img.aosomcdn.com/thumbnail/100/n1/product/2025/01/22/uAb8a71948d2c1dd0.jpg',
      },
    ],
  },

  // DeubaXXL (mid 21192) — abris de jardin MÉTAL prêts à poser (relevé live 2026-06-27).
  // Catalogue Deuba = métal uniquement (pas de bois → ne concurrence pas un marchand
  // chalets type GartenHaus). Placement : pages guides taxe-abri-jardin + permis-cabanon
  // (sujets fiscaux/réglementaires, aucun bloc affilié auparavant). Variante 'alternative'
  // = produit fini, pas un matériau du build. Tailles libellées en m² pour aider le lecteur
  // à choisir selon le seuil (5 m² taxe / permis) expliqué dans l'article.
  // Images : Deuba sert du 3000px (~2,5 Mo brut) → redimensionnées ~420px via wsrv.nl
  // (proxy Cloudflare) pour la perf ; repli icône 'cottage' si le proxy échoue (onError).
  'abri-metal': {
    merchant: 'deuba',
    variant: 'alternative',
    snapshotDate: '2026-06-27',
    eyebrow: 'Alternative en kit',
    title: 'Ranger sans construire',
    subtitle:
      'Construire un cabanon en ossature bois demande du temps et un peu d’outillage. Si le besoin se limite à ranger tondeuse, vélos ou outils, un abri métal prêt à poser (de 2,7 à 8 m²) se monte en une journée et revient souvent moins cher. À vous de choisir la taille selon le seuil qui vous concerne — au-delà, la construction reprend l’avantage.',
    cta: 'Voir chez DeubaXXL',
    products: [
      {
        name: 'Abri de jardin métal 2,7 m² (200×135 cm) — vert',
        price: '176,99',
        rating: null,
        url: 'https://www.deubaxxl.fr/abri-de-jardin-vert-en-metal-200x135x190cm/990739/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/c3/0b/95/01-990739-on-fs-amz-high-de-1-_3.jpg&w=420&q=82&output=jpg',
      },
      {
        name: 'Abri de jardin métal 5,3 m² (260×205 cm) — vert',
        price: '269,99',
        rating: null,
        url: 'https://www.deubaxxl.fr/abri-de-jardin-vert-en-metal-260x205x180cm/990742/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/2d/17/4c/01-990742-on-fs-amz-high-de-1-_2.jpg&w=420&q=82&output=jpg',
      },
      {
        name: 'Abri de jardin métal 8 m² (312×257 cm) — anthracite',
        price: '374,99',
        rating: null,
        url: 'https://www.deubaxxl.fr/abri-de-jardin-anthracite-en-metal-312x257x177-5cm/990745/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/74/60/dc/01_1_990745_on_fs-m_amz_high.jpg&w=420&q=82&output=jpg',
      },
      {
        name: 'Abri de jardin métal 8,2 m² (260×315 cm) — vert',
        price: '412,99',
        rating: null,
        url: 'https://www.deubaxxl.fr/abri-de-jardin-vert-en-metal-260x315x180cm/990744/',
        img: 'https://wsrv.nl/?url=ssl:www.deubaxxl.fr/media/41/c0/f6/01_990744_on_fs_b2b_low.jpg&w=420&q=82&output=jpg',
      },
    ],
  },

  // Le simulateur clôture dimensionne une clôture BOIS (poteaux/rails/lames).
  // Woodstore24 propose des kits brise-vue composite WPC à clipser entre poteaux :
  // alternative sans entretien (pas de lasure), prix au panneau (≈ une travée).
  cloture: {
    merchant: 'woodstore',
    variant: 'alternative',
    eyebrow: 'Alternative composite',
    title: 'Le brise-vue sans la lasure',
    subtitle:
      'Votre simulateur dimensionne une clôture en bois, à lasurer tous les deux ou trois ans. Pour un brise-vue composite (WPC) qui ne grise pas et ne se lasure jamais, voici des kits à clipser entre poteaux chez Woodstore24. Ce n’est pas du bois massif, mais ça se pose en un week-end et ça ne demande qu’un coup de jet de temps en temps.',
    cta: 'Voir chez Woodstore24',
    products: [
      {
        name: 'Kit brise-vue composite 1,82 m — brun',
        price: '109,50',
        priceSuffix: '/ panneau',
        rating: null,
        url: 'https://woodstore24.fr/xxl-kit-complet-cloture-light-wpc-ecran-cloture-a-emboiter-20-mm-epaisseur-x-1800-mm-largeur-x-1825-mm-haut-systeme-de-cloture-modulaire-en-marron-y-compris-profil-de-finition-serie-woodonorderney-sans-poteau.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/n/o/norderney_komplettset_braun_2.png',
      },
      {
        name: 'Kit brise-vue composite 1,85 m — anthracite',
        price: '119,50',
        priceSuffix: '/ panneau',
        rating: null,
        url: 'https://woodstore24.fr/xxl-kit-complet-cloture-opaque-cloture-a-emboiter-20-mm-epaisseur-x-1800-mm-largeur-x-1850-mm-haut-systeme-de-cloture-modulaire-en-anthracite-y-compris-profil-de-depart-et-de-fin-serie-woodonorderney-sans-poteau.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/n/o/norderney_komplettset_anthrazit_1-1.png',
      },
      {
        name: 'Kit brise-vue composite 1,85 m — gris',
        price: '119,50',
        priceSuffix: '/ panneau',
        rating: null,
        url: 'https://woodstore24.fr/xxl-kit-complet-cloture-opaque-cloture-a-emboiter-20-mm-epaisseur-x-1800-mm-largeur-x-1850-mm-haut-systeme-de-cloture-modulaire-en-gris-y-compris-profil-de-depart-et-de-fin-serie-woodonorderney-sans-poteau.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/n/o/norderney_komplettset_grau_3.png',
      },
      {
        name: 'Kit brise-vue composite + élément design — anthracite',
        price: '169,00',
        priceSuffix: '/ panneau',
        rating: null,
        url: 'https://woodstore24.fr/wpc-cloture-anthracite-kit-complet-avec-elements-de-design-20-mm-epaisseur-x-1800-mm-largeur-x-1850-mm-hautes-visibilite-cloture-embrochable-systeme-de-cloture-modulaire-inclus-profil-de-depart-et-de-fin-serie-woodonorderney-sans-poteau.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/w/d/wdndesigelement.2.png',
      },
    ],
  },

  // Article YMYL « clôture solaire » : modules photovoltaïques bifaciaux verticaux qui
  // remplacent les lames d'un brise-vue (« Solarzaun »). Woodstore24 = un des rares
  // distributeurs FR. Catalogue réel = 2 réfs (panneau seul 192 € → kit + poteaux 474 €).
  // CADRAGE STRICT : autopose → TVA 20 %, aucune aide ; CACSI Enedis requise même sans
  // injection. Placement article uniquement (le simulateur clôture dimensionne du BOIS).
  'cloture-solaire': {
    merchant: 'woodstore',
    variant: 'alternative',
    eyebrow: 'Kit clôture solaire',
    title: 'Le brise-vue qui produit du courant',
    subtitle:
      'Plutôt que des lames opaques, ces travées reçoivent des modules photovoltaïques bifaciaux verticaux (380 Wc) : la clôture masque la vue et produit de l’électricité. Woodstore24 les distribue en kit, du panneau seul à l’ensemble avec poteaux aluminium. À poser soi-même comme un brise-vue — le raccordement suit les règles solaire détaillées plus haut.',
    cta: 'Voir chez Woodstore24',
    products: [
      {
        name: 'Panneau clôture solaire bifacial 380 Wc — sans poteaux',
        price: '192,00',
        priceSuffix: '/ module',
        rating: null,
        url: 'https://woodstore24.fr/kit-complet-cloture-solaire-comme-protection-visuelle-380-w-biface-1767-mm-h-x-1040-mm-l-x-7-4-mm-s-sans-cadre-avec-adaptateur-sans-poteaux.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/ba024d481b803908c2ed2d2ae49e042a/s/o/solarmoduleinzelnd.png',
      },
      {
        name: 'Kit complet clôture solaire 380 Wc — poteaux aluminium inclus',
        price: '474,00',
        priceSuffix: '/ travée',
        rating: null,
        url: 'https://woodstore24.fr/kit-complet-cloture-solaire-comme-protection-visuelle-verre-de-securite-bifacial-panneau-solaire-380-w-y-compris-poteaux-en-aluminium-et-accessoires-necessaires-version-horizontale.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/ba024d481b803908c2ed2d2ae49e042a/k/o/komplettset_solarzaun_als_sichtschutz_002__1.png',
      },
    ],
  },

  // Page YMYL « carport solaire bois » : le contenu détaille la construction d'une
  // ossature bois + raccordement Consuel/Enedis. Bloc 'alternative' = kit alu prêt à
  // monter à toit solaire intégré (Woodstore24). CADRAGE STRICT : aluminium (pas bois),
  // raccordement = électricien, aucune aide ni ROI (les aides citées côté marchand sont
  // ALLEMANDES, hors périmètre FR). Placement article uniquement (jamais simulateur).
  carport: {
    merchant: 'woodstore',
    variant: 'alternative',
    eyebrow: 'Alternative en kit',
    title: 'Le carport solaire livré en kit',
    subtitle:
      'Notre simulateur dimensionne une ossature bois à construire, panneaux à ajouter ensuite. Si vous préférez un ensemble complet, Woodstore24 propose des carports en aluminium à toit solaire intégré (environ 4 à 6 kWc), livrés en kit avec les modules. Ce n’est pas du bois, et le raccordement au réseau reste un travail d’électricien — mais l’ossature et les panneaux arrivent ensemble.',
    cta: 'Voir chez Woodstore24',
    products: [
      {
        name: 'Carport solaire aluminium 1 voiture — 9 modules',
        price: '7 140,00',
        rating: null,
        url: 'https://woodstore24.fr/carport-en-kit-aluminium-avec-toit-solaire-pour-1-voiture-puiss0ance-des-modules-440-w-9-modules-par-carport-dimensions-du-caport-5200-x-3540-x-3000-mm-modules-en-verre-440-w-module-avec-cadre-en-aluminium-des-deux-cotes.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/1/_/1.einzelcarport.jpg',
      },
      {
        name: 'Carport solaire aluminium 2 voitures — 15 modules',
        price: '10 668,00',
        rating: null,
        url: 'https://woodstore24.fr/carport-en-kit-aluminium-avec-toit-solaire-pour-2-voitures-puissance-des-modules-440-w-15-modules-par-carport-dimensions-du-caport-5200-x-5850-x-3000-mm-modules-en-verre-440-w-module-avec-cadre-en-aluminium-des-deux-cotes.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/ba024d481b803908c2ed2d2ae49e042a/1/_/1.doppelcarport_002_.jpg',
      },
      {
        name: 'Carport aluminium 1 voiture — structure seule',
        price: '4 950,00',
        rating: null,
        url: 'https://woodstore24.fr/carport-en-kit-pour-1-voiture-aluminium-sans-panneaux-solaires-dimensions-du-carport-5200-x-3540-x-3000-mm.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/e/i/einzelcarport_ohnesolar_002__1.jpg',
      },
      {
        name: 'Carport aluminium 2 voitures — structure seule',
        price: '7 490,00',
        rating: null,
        url: 'https://woodstore24.fr/carport-en-kit-pour-2-voitures-aluminium-sans-panneaux-solaires-dimensions-du-carport-5200-x-5850-x-3000-mm.html',
        img: 'https://woodstore24.fr/media/catalog/product/cache/026236701dd809f82ecca10eab2b30e2/d/o/doppelcarport_ohnesolar_002_.jpg',
      },
    ],
  },
};

/**
 * Retourne la config partenaire d'un module, enrichie du marchand résolu.
 * @param {string} module — 'pergola' | 'terrasse' | …
 * @returns {object|null}
 */
export function getAwinPartner(module) {
  const partner = AWIN_PARTNERS[module];
  if (!partner) return null;
  return { ...partner, merchantInfo: AWIN_MERCHANTS[partner.merchant] };
}

/** Prédicat léger (sans allocation) pour décider d'afficher le bloc. */
export function hasAwinPartner(module) {
  return Boolean(AWIN_PARTNERS[module]?.products?.length);
}

/**
 * Affichage côté simulateur : respecte un éventuel plafond de surface (simMaxArea).
 * Sans plafond (pergola, terrasse) → toujours vrai. Avec plafond (cabanon) → area ≤ plafond.
 * @param {string} module
 * @param {number} area — surface au sol calculée (m²)
 */
export function fitsAwinPartnerArea(module, area) {
  const partner = AWIN_PARTNERS[module];
  if (!partner?.products?.length) return false;
  if (partner.simMaxArea == null) return true;
  return typeof area === 'number' && area <= partner.simMaxArea;
}
