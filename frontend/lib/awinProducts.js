/**
 * awinProducts.js — Partenaires affiliés Awin (Aosom, Plots discount)
 *
 * Tracking Awin via deep-link cread.php : Awin attribue le clic côté réseau
 * (clickref = notre sous-tag), pas d'UTM custom sur l'URL marchand.
 *   https://www.awin1.com/cread.php?awinmid={MID}&awinaffid={AFFID}&clickref={ref}&ued={URL}
 *
 * Éditeur DIY Builder : awinaffid 2934749.
 * Marchands rejoints : Aosom FR (mid 19184), Plots discount FR (mid 109434).
 *
 * Produits relevés en direct le 2026-06-20 — prix indicatifs, susceptibles
 * d'évoluer (promos fréquentes côté Aosom). Réveiller le snapshot si périmé.
 * Sélection éditoriale : pas de catalogue, 4 produits curés par module.
 */

const AWIN_AFFID = '2934749';

export const AWIN_MERCHANTS = {
  aosom: { name: 'Aosom', mid: '19184', site: 'aosom.fr' },
  plots: { name: 'Plots discount', mid: '109434', site: 'plots-discount.com' },
};

export const AWIN_SNAPSHOT_DATE = '2026-06-20';

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
