/**
 * bricodepot.js — Scraper Brico Dépôt
 *
 * Méthode : Playwright headless.
 * - Pages produit directes (prod####) → extraction sélecteur DOM
 * - Pages recherche (?search-term=...) → premier résultat dont le prix > minPrice
 *
 * Retourne : { materialId: { bricodepot: price } }
 */

import { parsePrice, normalizePricePerUnit } from '../normalizer.js';

const STORE_ID = 'bricodepot';

const TARGETS = [
  // ── Pages produit directes (URLs stables, extraction simple) ──────────────
  {
    id: 'poteau_cloture_90',
    url: 'https://www.bricodepot.fr/catalogue/poteau-bois-vert-h-240-m-section-9-x-9-cm/prod60800/',
    unit: 'pcs',
    refLen: 2.4,
  },
  {
    id: 'lame_terrasse',
    url: 'https://www.bricodepot.fr/catalogue/lame-de-terrasse-en-pin-vert-ep27-x-l145-x-l3900-mm/prod96931/',
    unit: 'pcs',
    refLen: 3.9,
  },
  {
    id: 'plot_beton',
    url: 'https://www.bricodepot.fr/catalogue/plot-beton-pour-lambourde-gris-24-x-24-cm/prod49542/',
    unit: 'pcs',
    refLen: null,
  },

  // ── Pages produit directes supplémentaires ───────────────────────────────
  // Note : poteau_pergola_100 (100×100mm) absent du catalogue BD
  {
    id: 'chevron_60x80',
    // BD labelle la section "75×63 mm" (hauteur×largeur) = équivalent du "60×80 mm" nominal.
    // Prod96901 = chevron épicéa traité L.4m section 75×63 mm.
    // Prix affiché "À partir de 7,19 €" sans sélection de dépôt — prix teaser non représentatif.
    // → minPrice/maxPrice pour rejeter les prix "À partir de" (< 8 € pour 4 m) et les aberrations.
    // Prix réel attendu : 9–12 € la pièce de 4 m → 2,25–3,00 €/ml.
    url: 'https://www.bricodepot.fr/catalogue/chevron-en-bois-depicea-traite-l4-m-section-75-x-63-mm/prod96901/',
    unit: 'm lin.',
    refLen: 4.0,
    minPrice: 8.00,   // < 8 € pour 4 m = prix teaser "À partir de" à rejeter
    maxPrice: 20.00,  // > 20 € serait une erreur d'extraction (kit, pack)
  },
  {
    id: 'bastaing_63x150',
    url: 'https://www.bricodepot.fr/catalogue/bastaing-en-bois-depicea-traite-l3-m-section-175-x-63-mm/prod96900/',
    unit: 'm lin.',
    refLen: 3.0,   // BD ne propose que la longueur 3m pour cette section
  },
  {
    id: 'lambourde_45x70',
    // Prod97285 = lambourde bois classe 4, 3000×70×45 mm — dimensions correctes.
    // Prix affiché "À partir de 7,90 €" sans sélection de dépôt — prix teaser non représentatif.
    // → minPrice/maxPrice pour rejeter les prix "À partir de" (< 9 € pour 3 m) et les aberrations.
    // Prix réel attendu : 11–16 € la pièce de 3 m (Casto=13,90 €, LM=14,50 €).
    url: 'https://www.bricodepot.fr/catalogue/lambourde-en-bois-classe-4-3000-x-70-x-45-mm/prod97285/',
    unit: 'pcs',
    refLen: 3.0,
    minPrice: 9.00,   // < 9 € = prix teaser "À partir de" à rejeter
    maxPrice: 25.00,  // > 25 € serait une erreur d'extraction (lot, pack)
  },
  {
    id: 'poutre_pergola_150',
    url: 'https://www.bricodepot.fr/catalogue/solivette-en-bois-depicea-traite-l4-m-section-150-x-50-mm/prod96899/',
    unit: 'm lin.',
    refLen: 4.0,
  },
  {
    id: 'lame_cloture',
    url: 'https://www.bricodepot.fr/catalogue/lame-de-cloture-pin-lemhi-l-120-m-x-l-9-cm-x-ep-21-mm/prod51024/',
    unit: 'm lin.',
    refLen: 1.2,
  },
];

const PRICE_SELECTORS = [
  '[data-price]',
  '[itemprop="price"]',
  '[class*="price"]',
  '[class*="Price"]',
  '.price',
  '.product-price',
];

/** Extraction depuis une page produit unique */
async function extractSinglePage(page) {
  for (const sel of PRICE_SELECTORS) {
    try {
      const el = await page.$(sel);
      if (!el) continue;
      const txt = await el.evaluate(e =>
        e.getAttribute('content') || e.getAttribute('data-price') || e.textContent
      );
      const val = parseFloat(String(txt).replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
      if (!isNaN(val) && val > 0 && val < 5000) return val;
    } catch (_) {}
  }
  return null;
}

/**
 * Extraction depuis une page de recherche BD.
 * Trouve le premier produit dont le label matche ET dont le prix dépasse minPrice.
 * Si aucun label ne matche, prend le premier prix > minPrice (fallback).
 */
async function extractSearchPage(page, labelMatch, minPrice, maxPrice) {
  return page.evaluate(({ labelRe, sels, minP, maxP }) => {
    const re = new RegExp(labelRe, 'i');

    // Sélecteurs containers produit BD (search results)
    const CONTAINERS = [
      '[class*="product"]', '[class*="Product"]',
      '[class*="card"]',    '[class*="Card"]',
      '[class*="item"]',    '[class*="Item"]',
      '[class*="result"]',  'article', 'li',
    ].join(', ');

    // Extrait le premier prix dans la plage [minP, maxP] — évite les kits/packs
    function extractRangePrice(el) {
      for (const sel of sels) {
        const priceEl = el.querySelector(sel);
        if (!priceEl) continue;
        const raw = priceEl.getAttribute('content') || priceEl.getAttribute('data-price') || priceEl.textContent || '';
        const v = parseFloat(raw.replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
        if (!isNaN(v) && v >= minP && v <= maxP) return v;
      }
      // Fallback : premier prix dans la plage dans le texte brut
      const re2 = /(\d{1,4}[.,]\d{2})\s*€/g;
      let m;
      while ((m = re2.exec(el.textContent)) !== null) {
        const v = parseFloat(m[1].replace(',', '.'));
        if (!isNaN(v) && v >= minP && v <= maxP) return v;
      }
      return null;
    }

    const containers = Array.from(document.querySelectorAll(CONTAINERS));

    // Passe 1 : containers dont le label matche + prix dans la plage
    for (const c of containers) {
      if (!re.test(c.textContent)) continue;
      const price = extractRangePrice(c);
      if (price !== null) return price;
    }

    // Passe 2 (fallback) : premier container avec prix dans la plage
    for (const c of containers) {
      const price = extractRangePrice(c);
      if (price !== null) return price;
    }

    return null;
  }, { labelRe: labelMatch.source, sels: PRICE_SELECTORS, minP: minPrice, maxP: maxPrice });
}

export async function scrapeBricodepot(browser) {
  const results = {};

  for (const target of TARGETS) {
    const page = await browser.newPage();
    try {
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });

      // Attendre qu'au moins un sélecteur prix soit présent
      await page.waitForFunction(
        sels => sels.some(s => !!document.querySelector(s)),
        PRICE_SELECTORS,
        { timeout: 10000 }
      ).catch(() => {});

      const raw = target.isSearchPage
        ? await extractSearchPage(page, target.labelMatch, target.minPrice ?? 0, target.maxPrice ?? 5000)
        : await extractSinglePage(page);

      // Rejeter les prix hors bornes (ex: prix "À partir de" sans sélection de dépôt)
      const inRange = raw !== null && raw > 0
        && (target.minPrice === undefined || raw >= target.minPrice)
        && (target.maxPrice === undefined || raw <= target.maxPrice);

      if (inRange) {
        const price = normalizePricePerUnit(raw, target.unit, target.refLen);
        results[target.id] = { [STORE_ID]: price };
        console.log(`  [bricodepot] ${target.id} = ${price} €`);
      } else if (raw !== null && raw > 0) {
        console.warn(`  [bricodepot] ${target.id} — prix hors bornes (${raw} €, attendu [${target.minPrice ?? 0}–${target.maxPrice ?? '∞'}])`);
      } else {
        console.warn(`  [bricodepot] ${target.id} — prix non trouvé`);
      }
    } catch (err) {
      console.warn(`  [bricodepot] ${target.id} — erreur : ${err.message.split('\n')[0]}`);
    } finally {
      await page.close();
      await new Promise(r => setTimeout(r, 1200));
    }
  }

  return results;
}
