/**
 * backend/scrapers/bricodepot.js
 * ═══════════════════════════════════════════════════════════════
 * Scraper Brico Dépôt — axios + cheerio
 *
 * ⚠️  ÉTAT TECHNIQUE
 * BricoDepot.fr utilise une SPA React (Create React App) avec
 * Cloudflare et une API GraphQL interne non documentée.
 * L'URL de l'API interne est /api/2.0/page/search?query=…
 * Ce scraper tente d'abord l'API JSON interne (plus fiable que
 * le parsing HTML), puis se rabat sur les sélecteurs CSS.
 *
 * API INTERNE TENTÉE (non garantie, peut changer) :
 *   GET https://www.bricodepot.fr/api/2.0/page/search
 *     ?query=lame+terrasse&page=1&pageSize=24
 *   Réponse JSON : { products: [ { name, price, url, ... } ] }
 *
 * SÉLECTEURS CSS (fallback SSR) :
 *   Carte produit  : .product-list-item, [data-ref="product-card"]
 *   Titre          : .product-title, h2.product-name
 *   Prix           : .price-value, [data-testid="price"]
 * ═══════════════════════════════════════════════════════════════
 */

const cheerio = require('cheerio');
const {
  fetchPage,
  fetchAvecRetry,
  normaliserPrix,
  extraireLongueur,
  categoriserProduit,
  validerProduit,
  ScraperBlockedError,
  sleep,
  jitter,
} = require('./base');

// Sélecteur CSS attendu après rendu JS (Playwright)
const BD_WAIT_SELECTOR = '[data-ref="product-card"], .product-list-item, .product-card, [class*="ProductItem"]';

const { CATALOGUE } = require('./catalogue');

const MAGASIN  = 'Brico Dépôt';
const BASE_URL = 'https://www.bricodepot.fr';
const DELAI_ENTRE_PAGES_MS = 3000;

// Construire les requêtes depuis le catalogue centralisé
const REQUETES = CATALOGUE
  .filter(m => !m.stores || m.stores.includes('bricodepot'))
  .map(m => {
    const terme = m.termeBD || m.terme;
    return {
      materialId: m.id,
      categorie:  m.categorie,
      motCle:     terme,
      urlSearch:  `${BASE_URL}/recherche?query=${encodeURIComponent(terme)}`,
      urlApi:     `${BASE_URL}/api/2.0/page/search?query=${encodeURIComponent(terme)}&page=1&pageSize=24`,
    };
  });

// ── Stratégie 1 : API JSON interne ────────────────────────────
async function extraireDepuisApiJSON(requete) {
  let data;
  try {
    const raw = await fetchAvecRetry(requete.urlApi, MAGASIN, {
      headers: {
        'Accept':       'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (err) {
    if (err.code === 'BLOCKED') throw err;
    return []; // API interne indisponible → fallback HTML
  }

  const items = data?.products || data?.results || data?.items || [];
  if (!Array.isArray(items) || items.length === 0) return [];

  return items
    .map(item => {
      const titre = item.name || item.title || item.label || '';
      const prix  = normaliserPrix(
        item.price?.value ||
        item.currentPrice ||
        item.sellPrice ||
        item.price
      );
      if (!titre || !prix) return null;

      const urlProduit = item.url || item.slug || '';
      return {
        nom:      titre.substring(0, 200),
        categorie: requete.categorie || categoriserProduit(titre),
        longueur:  extraireLongueur(
          titre + ' ' + (item.description || '') + ' ' + (item.reference || '')
        ),
        prix,
        magasin:  MAGASIN,
        url: urlProduit.startsWith('http')
          ? urlProduit
          : urlProduit ? `${BASE_URL}${urlProduit}` : requete.urlSearch,
      };
    })
    .filter(p => p && p.categorie && validerProduit(p));
}

// ── Stratégie 2 : Parsing HTML ────────────────────────────────
function extraireDepuisHTML(html, requete) {
  const $ = cheerio.load(html);
  const produits = [];

  // Sélecteurs multiples pour tolérer les variations
  const selecteursCarte = [
    '[data-ref="product-card"]',
    '.product-list-item',
    '.product-card',
    '[class*="ProductItem"]',
    '[class*="product-item"]',
    'article[itemtype*="Product"]',
  ].join(', ');

  $(selecteursCarte).each((_, el) => {
    const $el = $(el);

    // Titre
    const titre = (
      $el.find('.product-title, h2, h3, [itemprop="name"]').first().text() ||
      $el.attr('aria-label') ||
      $el.find('[title]').first().attr('title') ||
      ''
    ).trim();

    // Prix
    const prixTexte = (
      $el.find('.price-value, [data-testid="price"], [itemprop="price"], [class*="price"]')
        .first().text() ||
      $el.find('[content]').filter((_, el) => $(el).attr('itemprop') === 'price').attr('content') ||
      ''
    ).trim();

    if (!titre || !prixTexte) return;
    const prix = normaliserPrix(prixTexte);
    if (!prix) return;

    const href = $el.find('a[href]').first().attr('href');
    const url  = href
      ? (href.startsWith('http') ? href : `${BASE_URL}${href}`)
      : requete.urlSearch;

    const categorie = requete.categorie || categoriserProduit(titre);
    if (!categorie) return;

    produits.push({
      nom:      titre.substring(0, 200),
      categorie,
      longueur: extraireLongueur(titre),
      prix,
      magasin:  MAGASIN,
      url,
    });
  });

  // Fallback JSON-LD
  if (produits.length === 0) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || '{}');
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] !== 'Product') continue;
          const titre = item.name || '';
          const prix  = normaliserPrix(item.offers?.price || item.offers?.lowPrice);
          if (!titre || !prix) continue;
          const categorie = requete.categorie || categoriserProduit(titre);
          if (!categorie) return;
          produits.push({
            nom:      titre.substring(0, 200),
            categorie,
            longueur: extraireLongueur(titre),
            prix,
            magasin:  MAGASIN,
            url:      item.url || requete.urlSearch,
          });
        }
      } catch (_) {}
    });
  }

  return produits.filter(validerProduit);
}

async function scraperRequete(requete) {
  console.log(`  🔍 BD — ${requete.motCle}`);

  // Essayer l'API JSON interne en premier
  try {
    const produitsApi = await extraireDepuisApiJSON(requete);
    if (produitsApi.length > 0) {
      console.log(`  ✅ BD (API) — ${produitsApi.length} produits`);
      return { produits: produitsApi, bloque: false };
    }
  } catch (err) {
    if (err.code === 'BLOCKED') {
      console.warn(`  ⛔ BD bloqué : ${err.message}`);
      return { produits: [], bloque: true, message: err.message };
    }
  }

  // Fallback HTML (avec Playwright si activé)
  let html;
  try {
    // Pas de waitSelector — ScrapingBee ne supporte pas les sélecteurs
    // multi-valeurs (virgule). On s'appuie sur le wait statique (10s).
    html = await fetchPage(requete.urlSearch, MAGASIN);
  } catch (err) {
    if (err.code === 'BLOCKED') {
      console.warn(`  ⛔ BD bloqué (HTML) : ${err.message}`);
      return { produits: [], bloque: true, message: err.message };
    }
    console.warn(`  ❌ BD erreur : ${err.message}`);
    return { produits: [], bloque: false, message: err.message };
  }

  const produits = extraireDepuisHTML(html, requete);

  if (produits.length === 0) {
    console.warn(`  ⚠️  BD — 0 produit extrait — ${requete.urlSearch}`);
    return { produits: [], bloque: false, message: 'Aucun produit dans le HTML' };
  }

  console.log(`  ✅ BD (HTML) — ${produits.length} produits`);
  return { produits, bloque: false };
}

async function scrapeBricoDepot() {
  console.log('\n🔴 Brico Dépôt — démarrage scraping');
  const debut = Date.now();
  const tousLesProduits = [];
  let nbBloques = 0;
  const erreurs = [];

  for (const [idx, requete] of REQUETES.entries()) {
    if (idx > 0) await sleep(jitter(DELAI_ENTRE_PAGES_MS));
    const { produits, bloque, message } = await scraperRequete(requete);
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

  console.log(`🔴 Brico Dépôt terminé — ${uniques.length} produits en ${stats.duree_ms}ms\n`);
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

module.exports = { scrapeBricoDepot };
