/**
 * backend/scrapers/castorama.js
 * ═══════════════════════════════════════════════════════════════
 * Scraper Castorama — axios + cheerio
 *
 * ⚠️  ÉTAT TECHNIQUE
 * Castorama.fr utilise également une SPA (Angular) avec Cloudflare.
 * Le HTML initial peut contenir des données SSR partielles dans
 * des balises <script type="application/json"> ou des attributs
 * ngInit — c'est la cible principale de ce scraper.
 *
 * SÉLECTEURS CASTORAMA (cibles SSR identifiées) :
 *   Script données   : #ngss-state, script[id*="transfer-state"]
 *   Carte produit    : .product-card, [data-component="ProductCard"]
 *   Titre            : .product-card__title, h2.c-product-card__name
 *   Prix             : .price__amount, [data-price]
 *   URL              : .product-card a[href]
 * ═══════════════════════════════════════════════════════════════
 */

const cheerio = require('cheerio');
const {
  fetchPage,
  normaliserPrix,
  extraireLongueur,
  categoriserProduit,
  validerProduit,
  ScraperBlockedError,
  sleep,
  jitter,
} = require('./base');

// Sélecteur CSS attendu après rendu JS (Playwright)
const CASTO_WAIT_SELECTOR = '.c-product-card, [data-component="ProductCard"], .product-card, .product-list-item';

const { CATALOGUE } = require('./catalogue');

const MAGASIN  = 'Castorama';
const BASE_URL = 'https://www.castorama.fr';
const DELAI_ENTRE_PAGES_MS = 3500;

// Construire les requêtes depuis le catalogue centralisé
const REQUETES = CATALOGUE
  .filter(m => !m.stores || m.stores.includes('castorama'))
  .map(m => ({
    materialId: m.id,
    categorie:  m.categorie,
    url:        `${BASE_URL}/search?term=${encodeURIComponent(m.termeCasto || m.terme)}`,
  }));

/**
 * Tente d'extraire les données depuis le SSR state d'Angular.
 * Castorama injecte parfois les résultats dans un script JSON.
 */
function extraireDepuisNgState(html, requete) {
  const produits = [];
  // Cherche un bloc JSON encapsulé dans le transfert Angular SSR
  const ngStateMatch = html.match(
    /(?:ng-state|transfer-state)[^>]*>\s*({.*?})\s*<\/script/s
  );
  if (!ngStateMatch) return produits;

  try {
    const state  = JSON.parse(ngStateMatch[1]);
    // La structure varie selon la version Angular déployée
    // On cherche récursivement les tableaux de produits
    const items  = trouverProduitsDansObjet(state);

    for (const item of items.slice(0, 50)) {
      const titre = item.name || item.title || item.label || '';
      const prix  = normaliserPrix(item.price?.value || item.currentPrice || item.price);
      if (!titre || !prix) continue;

      const categorie = requete.categorie || categoriserProduit(titre);
      if (!categorie) continue;

      produits.push({
        nom:        titre.substring(0, 200),
        categorie,
        materialId: requete.materialId,
        longueur:   extraireLongueur(titre + ' ' + (item.description || '')),
        prix,
        magasin:    MAGASIN,
        url:        item.url
          ? (item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`)
          : requete.url,
      });
    }
  } catch (_) { /* JSON malformé */ }

  return produits;
}

/** Parcourt récursivement un objet pour trouver des tableaux de produits */
function trouverProduitsDansObjet(obj, profondeur = 0) {
  if (profondeur > 6 || !obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj[0] && (obj[0].name || obj[0].title || obj[0].price))
      return obj;
    return obj.flatMap(item => trouverProduitsDansObjet(item, profondeur + 1));
  }
  return Object.values(obj).flatMap(v => trouverProduitsDansObjet(v, profondeur + 1));
}

/** Extraction via sélecteurs CSS classiques */
function extraireDepuisCSS(html, requete) {
  const $ = cheerio.load(html);
  const produits = [];

  const selecteurs = [
    '[data-component="ProductCard"]',
    '.product-card',
    '.c-product-card',
    '[class*="product-item"]',
  ].join(', ');

  $(selecteurs).each((_, el) => {
    const $el = $(el);

    const titre = (
      $el.find('.product-card__title, .c-product-card__name, h2, h3').first().text() ||
      $el.attr('aria-label') ||
      $el.find('[title]').first().attr('title')
    )?.trim();

    const prixTexte = (
      $el.find('.price__amount, [data-price], [class*="price"]').first().text()
    )?.trim();

    if (!titre || !prixTexte) return;

    const prix = normaliserPrix(prixTexte);
    if (!prix) return;

    const href = $el.find('a[href]').first().attr('href');
    const url  = href
      ? (href.startsWith('http') ? href : `${BASE_URL}${href}`)
      : requete.url;

    const categorie = requete.categorie || categoriserProduit(titre);
    if (!categorie) return;

    produits.push({
      nom:        titre.substring(0, 200),
      categorie,
      materialId: requete.materialId,
      longueur:   extraireLongueur(titre),
      prix,
      magasin:    MAGASIN,
      url,
    });
  });

  return produits.filter(validerProduit);
}

/**
 * Extraction via JSON-LD @type:ItemList (stratégie prioritaire).
 * Castorama injecte un ItemList complet après hydratation Angular.
 */
function extraireDepuisJsonLd(html, requete) {
  const $ = cheerio.load(html);
  const produits = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}');
      if (data['@type'] !== 'ItemList') return;

      for (const entry of (data.itemListElement || [])) {
        const item  = entry.item || entry;
        const titre = item.name || '';
        const prix  = normaliserPrix(
          item.offers?.price ||
          item.offers?.lowPrice ||
          (Array.isArray(item.offers) ? item.offers[0]?.price : null)
        );
        if (!titre || !prix) continue;

        produits.push({
          nom:        titre.substring(0, 200),
          categorie:  requete.categorie,
          materialId: requete.materialId,
          longueur:   extraireLongueur(titre + ' ' + (item.description || '')),
          prix,
          magasin:    MAGASIN,
          url:        item.url
            ? (item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`)
            : requete.url,
        });
      }
    } catch { /* JSON invalide */ }
  });

  return produits.filter(p => p.prix > 0 && p.prix < 5000);
}

/**
 * Scrape une requête Castorama.
 *
 * @param {Object}  requete    — { url, categorie, materialId }
 * @param {Map}     urlCache   — cache URL→produits[] pour éviter les doubles requêtes
 *                               (ex: chevron_60x80 et entretoise_toiture partagent la même URL)
 */
async function scraperRequete(requete, urlCache) {
  // ── Cache hit : même URL déjà scrapée dans ce run ─────────
  if (urlCache.has(requete.url)) {
    const cached = urlCache.get(requete.url);
    // Cloner les produits en remplaçant materialId et categorie
    const produits = cached.map(p => ({
      ...p,
      materialId: requete.materialId,
      categorie:  requete.categorie,
    }));
    console.log(`  ♻️  CASTO — cache (${produits.length} produits) → ${requete.materialId}`);
    return { produits, bloque: false };
  }

  console.log(`  🔍 CASTO — ${requete.url}`);

  let html;
  try {
    html = await fetchPage(requete.url, MAGASIN, { waitSelector: CASTO_WAIT_SELECTOR });
  } catch (err) {
    if (err.code === 'BLOCKED') {
      console.warn(`  ⛔ Castorama bloqué : ${err.message}`);
      return { produits: [], bloque: true, message: err.message };
    }
    console.warn(`  ❌ Castorama erreur : ${err.message}`);
    return { produits: [], bloque: false, message: err.message };
  }

  // Stratégie 1 : JSON-LD ItemList (prioritaire — dispo après hydratation Angular)
  let produits = extraireDepuisJsonLd(html, requete);

  // Stratégie 2 : SSR state Angular (fallback)
  if (produits.length === 0) {
    produits = extraireDepuisNgState(html, requete);
  }

  // Stratégie 3 : CSS selectors (dernier recours)
  if (produits.length === 0) {
    produits = extraireDepuisCSS(html, requete);
  }

  if (produits.length === 0) {
    console.warn(`  ⚠️  CASTO — 0 produit extrait — ${requete.url}`);
    // Stocker quand même dans le cache pour éviter de re-tenter une URL vide
    urlCache.set(requete.url, []);
    return { produits: [], bloque: false, message: 'Aucun produit dans le HTML' };
  }

  // Mettre en cache pour les requêtes dupliquées (même URL, materialId différent)
  urlCache.set(requete.url, produits);
  console.log(`  ✅ CASTO — ${produits.length} produits`);
  return { produits, bloque: false };
}

async function scrapeCastorama() {
  console.log('\n🔵 Castorama — démarrage scraping');
  const debut = Date.now();
  const tousLesProduits = [];
  let nbBloques = 0;
  const erreurs = [];

  // Cache URL→produits[] partagé sur tout le run.
  // Évite de re-scraper les pages identiques (ex: chevron_60x80 et entretoise_toiture
  // utilisent la même URL — on scrape une fois, on relabellise materialId pour la 2e).
  const urlCache = new Map();

  for (const [idx, requete] of REQUETES.entries()) {
    // Pas de délai si l'URL est en cache (pas de vraie requête réseau)
    if (idx > 0 && !urlCache.has(requete.url)) {
      await sleep(jitter(DELAI_ENTRE_PAGES_MS));
    }
    const { produits, bloque, message } = await scraperRequete(requete, urlCache);
    tousLesProduits.push(...produits);
    if (bloque) nbBloques++;
    if (message && produits.length === 0) erreurs.push(message);
  }

  const uniques = deduplicaterParUrl(tousLesProduits);
  const stats = {
    magasin:     MAGASIN,
    nb_produits: uniques.length,
    nb_bloques:  nbBloques,
    nb_erreurs:  erreurs.length,
    duree_ms:    Date.now() - debut,
    statut:      uniques.length > 0 ? 'success' : nbBloques > 0 ? 'blocked' : 'failed',
  };

  console.log(`🔵 Castorama terminé — ${uniques.length} produits en ${stats.duree_ms}ms\n`);
  return { produits: uniques, stats };
}

function deduplicaterParUrl(produits) {
  const seen = new Set();
  return produits.filter(p => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });
}

module.exports = { scrapeCastorama };
