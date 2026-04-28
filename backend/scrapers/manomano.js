/**
 * backend/scrapers/manomano.js
 * ═══════════════════════════════════════════════════════════════
 * Scraper ManoMano — Playwright stealth + __NEXT_DATA__ extraction.
 *
 * ManoMano utilise Next.js avec rendu SSR des résultats de recherche.
 * Les produits sont directement disponibles dans le script
 * <script id="__NEXT_DATA__"> sans attendre d'appel API client.
 *
 * PROTECTION : Cloudflare JS challenge (tier standard).
 * CONTOURNEMENT : playwright-extra + puppeteer-extra-plugin-stealth.
 *   → Fonctionne en headless ; pas de DataDome, pas de proxies payants.
 *
 * URL de recherche : https://www.manomano.fr/recherche/[terme]
 *   (path-based, pas query string — les espaces deviennent des +)
 *
 * STRUCTURE DE DONNÉES :
 *   __NEXT_DATA__ → props.pageProps.initialReduxState
 *     .productDiscovery.listing.products[]
 *     { title, slug, price.currentPrice.amountWithVat, ... }
 *
 * REQUIERT : USE_PLAYWRIGHT=true dans .env
 * ═══════════════════════════════════════════════════════════════
 */

const { fetchWithPlaywright } = require('./playwright-client');
const {
  normaliserPrix,
  extraireLongueur,
  categoriserProduit,
  validerProduit,
  sleep,
  jitter,
} = require('./base');
const { CATALOGUE } = require('./catalogue');

const MAGASIN  = 'ManoMano';
const BASE_URL = 'https://www.manomano.fr';

// Délai de politesse entre pages (Cloudflare surveille le rythme)
const DELAI_ENTRE_PAGES_MS = 4000;

// Construire les requêtes depuis le catalogue
// URL format : /recherche/[terme avec + à la place des espaces]
const REQUETES = CATALOGUE
  .filter(m => !m.stores || m.stores.includes('manomano'))
  .map(m => {
    const terme = m.termeMM || m.terme;
    return {
      materialId: m.id,
      categorie:  m.categorie,
      terme,
      url: `${BASE_URL}/recherche/${terme.replace(/\s+/g, '+')}`,
    };
  });

// ── Extraction depuis __NEXT_DATA__ ───────────────────────────

function extraireNextData(html) {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function extraireProduitsDepuisHtml(html, requete) {
  const data = extraireNextData(html);
  if (!data) return [];

  const products =
    data?.props?.pageProps?.initialReduxState?.productDiscovery?.listing?.products;

  if (!Array.isArray(products) || products.length === 0) return [];

  return products
    .map(p => {
      const titre = p.title || '';
      const prix  = p.price?.currentPrice?.amountWithVat;
      if (!titre || !prix || prix <= 0) return null;

      const categorie = requete.categorie || categoriserProduit(titre);
      if (!categorie) return null;

      return {
        materialId: requete.materialId,
        nom:       titre.substring(0, 200),
        categorie,
        longueur:  extraireLongueur(titre),
        prix,
        magasin:   MAGASIN,
        url:       p.slug ? `${BASE_URL}/p/${p.slug}` : requete.url,
      };
    })
    .filter(p => p && validerProduit(p));
}

// ── Scrape d'une requête ──────────────────────────────────────

async function scraperRequete(requete) {
  console.log(`  🔍 MM — ${requete.terme}`);

  let html;
  try {
    html = await fetchWithPlaywright(requete.url, MAGASIN, { timeout: 45000 });
  } catch (err) {
    console.warn(`  ❌ MM erreur : ${err.message}`);
    return { produits: [], bloque: false, message: err.message };
  }

  const produits = extraireProduitsDepuisHtml(html, requete);

  if (produits.length === 0) {
    console.warn(`  ⚠️  MM — 0 produit extrait pour "${requete.terme}"`);
    return { produits: [], bloque: false, message: '0 produit extrait' };
  }

  console.log(`  ✅ MM — ${produits.length} produits extraits`);
  return { produits, bloque: false };
}

// ── Point d'entrée ────────────────────────────────────────────

async function scrapeManoMano() {
  console.log('\n🟣 ManoMano — démarrage scraping');
  const debut = Date.now();
  const tousLesProduits = [];
  const erreurs = [];

  for (const [idx, requete] of REQUETES.entries()) {
    if (idx > 0) await sleep(jitter(DELAI_ENTRE_PAGES_MS));

    const { produits, message } = await scraperRequete(requete);
    tousLesProduits.push(...produits);
    if (message && produits.length === 0) erreurs.push(message);
  }

  const uniques = deduplicaterParUrl(tousLesProduits);

  const stats = {
    magasin:     MAGASIN,
    nb_produits: uniques.length,
    nb_bloques:  0,
    nb_erreurs:  erreurs.length,
    duree_ms:    Date.now() - debut,
    statut:      uniques.length > 0 ? 'success' : 'failed',
  };

  console.log(`🟣 ManoMano terminé — ${uniques.length} produits en ${stats.duree_ms}ms\n`);
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

module.exports = { scrapeManoMano };
