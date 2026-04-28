/**
 * backend/scrapers/leroymerlin.js
 * ═══════════════════════════════════════════════════════════════
 * Scraper Leroy Merlin — axios + cheerio
 *
 * ⚠️  ÉTAT TECHNIQUE
 * LM utilise une SPA React (Next.js) et Cloudflare.
 * Les pages de résultats sont rendues côté client : le HTML
 * retourné par axios ne contient PAS les produits (juste le
 * shell React). Cloudflare bloquera également les requêtes
 * automatiques (HTTP 403 / CF Challenge).
 *
 * CE SCRAPER EST ARCHITECTURALEMENT CORRECT et prêt pour :
 * → ScrapingBee (remplacer fetchAvecRetry par leur API)
 * → Playwright headless (injecter page.content() à la place)
 *
 * Pour l'instant, il détecte proprement le blocage et retourne
 * un tableau vide sans casser l'application.
 *
 * SÉLECTEURS (valables quand JS est rendu) :
 *   Carte produit  : [data-testid="product-card"]
 *   Titre          : [data-testid="product-title"]
 *   Prix           : [data-testid="product-price"] .price-amount
 *   URL            : a[data-testid="product-link"]
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
const LM_WAIT_SELECTOR = '[data-testid="product-card"], [data-test="product-cell"], .product-card';

const { CATALOGUE } = require('./catalogue');

const MAGASIN  = 'Leroy Merlin';
const BASE_URL = 'https://www.leroymerlin.fr';
const DELAI_ENTRE_PAGES_MS = 3000;

// Construire les requêtes depuis le catalogue centralisé
const REQUETES = CATALOGUE
  .filter(m => !m.stores || m.stores.includes('leroymerlin'))
  .map(m => ({
    materialId: m.id,
    categorie:  m.categorie,
    url:        `${BASE_URL}/recherche?q=${encodeURIComponent(m.termeLM || m.terme)}`,
    mots_cles:  (m.termeLM || m.terme).split(' '),
  }));

/**
 * Extrait les produits depuis le HTML d'une page de résultats LM.
 * Tente plusieurs stratégies de sélection pour s'adapter aux
 * variations du rendu (SPA hydratée, SSR partiel, etc.).
 */
function extraireProduitsDepuisHTML(html, requete) {
  const $ = cheerio.load(html);
  const produits = [];

  // ── Stratégie 0 : JSON-LD @type:ItemList ou Product (prioritaire après hydratation) ──
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}');

      if (data['@type'] === 'ItemList') {
        for (const entry of (data.itemListElement || [])) {
          const item  = entry.item || entry;
          if (item['@type'] !== 'Product') continue;
          const titre = item.name || '';
          const prix  = normaliserPrix(
            item.offers?.price ||
            item.offers?.lowPrice ||
            (Array.isArray(item.offers) ? item.offers[0]?.price : null)
          );
          if (!titre || !prix) continue;
          produits.push({
            nom:       titre.substring(0, 200),
            categorie: requete.categorie || categoriserProduit(titre),
            longueur:  extraireLongueur(titre),
            prix,
            magasin:   MAGASIN,
            url:       item.url || requete.url,
          });
        }
      }

      if (data['@type'] === 'Product') {
        const titre = data.name || '';
        const prix  = normaliserPrix(data.offers?.price);
        if (titre && prix) {
          produits.push({
            nom:       titre.substring(0, 200),
            categorie: requete.categorie || categoriserProduit(titre),
            longueur:  extraireLongueur(titre),
            prix,
            magasin:   MAGASIN,
            url:       data.url || requete.url,
          });
        }
      }
    } catch { /* JSON invalide */ }
  });

  // ── Stratégie 1 : sélecteurs data-testid (SPA hydratée) ──
  $('[data-testid="product-card"], [data-test="product-cell"], .product-card').each((_, el) => {
    const $el = $(el);

    const titre = (
      $el.find('[data-testid="product-title"]').text() ||
      $el.find('.product-title, .item-title, h2, h3').first().text()
    ).trim();

    const prixTexte = (
      $el.find('[data-testid="product-price"] .price-amount').text() ||
      $el.find('.price, .prix, [class*="price"]').first().text()
    ).trim();

    const href = (
      $el.find('a[data-testid="product-link"]').attr('href') ||
      $el.find('a').first().attr('href')
    );

    if (!titre || !prixTexte) return;

    const prix = normaliserPrix(prixTexte);
    if (!prix) return;

    const url = href
      ? (href.startsWith('http') ? href : `${BASE_URL}${href}`)
      : requete.url;

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

  // ── Stratégie 2 : JSON-LD dans les balises script ──────────
  // LM injecte parfois un JSON-LD Product schema dans le HTML
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}');
      const items = data['@type'] === 'ItemList'
        ? (data.itemListElement || []).map(i => i.item || i)
        : data['@type'] === 'Product' ? [data] : [];

      for (const item of items) {
        if (item['@type'] !== 'Product') continue;
        const titre = item.name || '';
        const prix  = normaliserPrix(
          item.offers?.price ||
          item.offers?.lowPrice ||
          (Array.isArray(item.offers) ? item.offers[0]?.price : null)
        );
        if (!titre || !prix) continue;

        const categorie = requete.categorie || categoriserProduit(titre);
        if (!categorie) continue;

        produits.push({
          nom:      titre.substring(0, 200),
          categorie,
          longueur: extraireLongueur(titre),
          prix,
          magasin:  MAGASIN,
          url:      item.url || requete.url,
        });
      }
    } catch (_) { /* JSON invalide, on ignore */ }
  });

  return produits.filter(validerProduit);
}

/**
 * Scrape une requête de recherche Leroy Merlin.
 * @param  {Object} requete   — { url, categorie, mots_cles }
 * @returns {Object[]}        — produits normalisés
 */
async function scraperRequete(requete) {
  console.log(`  🔍 LM — ${requete.url}`);

  let html;
  try {
    // Pas de waitSelector — ScrapingBee ne supporte pas les sélecteurs
    // multi-valeurs (virgule). On s'appuie sur le wait statique (10s).
    html = await fetchPage(requete.url, MAGASIN);
  } catch (err) {
    if (err.code === 'BLOCKED') {
      console.warn(`  ⛔ LM bloqué : ${err.message}`);
      return { produits: [], bloque: true, message: err.message };
    }
    console.warn(`  ❌ LM erreur réseau : ${err.message}`);
    return { produits: [], bloque: false, message: err.message };
  }

  const produits = extraireProduitsDepuisHTML(html, requete);

  // Si 0 produits extraits du HTML, c'est probablement
  // une page React vide (SPA non hydratée côté serveur)
  if (produits.length === 0) {
    console.warn(`  ⚠️  LM — 0 produit extrait (page JS-only probable). Requête: ${requete.url}`);
    return {
      produits: [],
      bloque: false,
      message: 'HTML sans produits — page nécessite JS rendering',
    };
  }

  console.log(`  ✅ LM — ${produits.length} produits extraits`);
  return { produits, bloque: false };
}

/**
 * Point d'entrée principal du scraper Leroy Merlin.
 * @returns {{ produits: Object[], stats: Object }}
 */
async function scrapeLeroyMerlin() {
  console.log('\n🟢 Leroy Merlin — démarrage scraping');
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

  // Dédoublonnage par URL
  const uniques = deduplicaterParUrl(tousLesProduits);

  const stats = {
    magasin:     MAGASIN,
    nb_produits: uniques.length,
    nb_bloques:  nbBloques,
    nb_erreurs:  erreurs.length,
    duree_ms:    Date.now() - debut,
    statut:      uniques.length > 0 ? 'success' : nbBloques > 0 ? 'blocked' : 'failed',
  };

  console.log(`🟢 LM terminé — ${uniques.length} produits en ${stats.duree_ms}ms\n`);
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

module.exports = { scrapeLeroyMerlin };
