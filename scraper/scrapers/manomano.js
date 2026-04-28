/**
 * manomano.js — Scraper ManoMano (marketplace)
 *
 * Méthode : playwright-extra + stealth plugin (browser indépendant).
 * ManoMano utilise Cloudflare — le stealth plugin patch les signaux
 * headless (navigator.webdriver, WebGL fingerprint, TLS JA3…).
 *
 * waitUntil: 'domcontentloaded' — Cloudflare maintient des connexions
 * ouvertes indéfiniment → 'networkidle' timeout systématique.
 *
 * Extraction : JSON-LD (AggregateOffer.lowPrice) en priorité,
 * puis __NEXT_DATA__, puis DOM selectors.
 *
 * ManoMano est une marketplace : lowPrice = meilleur prix vendeur.
 *
 * Retourne : { materialId: { manomano: price } }
 */

import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { parsePrice, normalizePricePerUnit } from '../normalizer.js';

chromium.use(StealthPlugin());

const STORE_ID = 'manomano';

/**
 * Targets avec URLs directes (IDs produit stables : /p/[slug]-[id])
 * ou pages /cat/ (recherche) quand pas d'URL directe confirmée.
 */
const TARGETS = [
  // ── Ossature ──────────────────────────────────────────────────────────────
  {
    id: 'chevron_60x80',
    url: 'https://www.manomano.fr/p/chevron-de-charpente-60x80mm-sapin-epicea-brut-traite-classe-2-jaune-4m-5422385',
    unit: 'm lin.',
    refLen: 4.0,
  },
  {
    id: 'lambourde_45x70',
    url: 'https://www.manomano.fr/p/lambourde-terrasse-45x70-pin-traite-autoclave-marron-cl4-rabote-3m-5123025',
    unit: 'pcs',
    refLen: 3.0,
  },

  // ── Terrasse ──────────────────────────────────────────────────────────────
  // lame_terrasse : LM=13.00€, Casto=12.50€ → plafond 16€ pour éviter Douglas premium ou 4m
  {
    id: 'lame_terrasse',
    url: 'https://www.manomano.fr/cat/lame+terrasse+pin+classe+4',
    isSearchPage: true,
    labelMatch: /pin.*class(e|4)|lame.*terrasse.*2[57].*mm/i,
    minPrice: 8,
    maxPrice: 16,
    unit: 'pcs',
    refLen: 3.6,
  },
  // plot_beton : LM=8.90€, BD=7.99€ → plage élargie, label assoupli
  {
    id: 'plot_beton',
    url: 'https://www.manomano.fr/cat/plot+beton+terrasse',
    isSearchPage: true,
    labelMatch: /plot|dalle|support/i,
    minPrice: 4,
    maxPrice: 22,
    unit: 'pcs',
    refLen: null,
  },

  // ── Pergola ───────────────────────────────────────────────────────────────
  // poteau_pergola_100 : LM=32.90€ → recherche /recherche/ (Algolia, stock variable)
  {
    id: 'poteau_pergola_100',
    url: 'https://www.manomano.fr/recherche/poteau+bois+100x100+autoclave',
    isSearchPage: true,
    labelMatch: /100.{0,5}100|poteau.*bois/i,
    minPrice: 20,
    maxPrice: 45,
    unit: 'pcs',
    refLen: 3.0,
  },
  // poutre_pergola_150 : résultats de recherche /recherche/ (Algolia)
  {
    id: 'poutre_pergola_150',
    url: 'https://www.manomano.fr/recherche/bastaing+50x150',
    isSearchPage: true,
    labelMatch: /50.{0,5}150|bastaing|solive/i,
    minPrice: 18,
    maxPrice: 45,
    unit: 'm lin.',
    refLen: 4.0,
  },

  // ── Clôture ───────────────────────────────────────────────────────────────
  // poteau_cloture_90 : pin nord traité cl.4, 9x9x180cm → refLen 1.8m
  {
    id: 'poteau_cloture_90',
    url: 'https://www.manomano.fr/p/poteau-en-bois-en-pin-du-nord-traite-autoclave-classe-4-9x9x180cm-90476342',
    unit: 'pcs',
    refLen: 1.8,
    minPrice: 8,
    maxPrice: 30,
  },
  // lame_cloture : lame pin 95cm → URL directe, refLen 0.95m
  {
    id: 'lame_cloture',
    url: 'https://www.manomano.fr/p/lame-de-cloture-95-cm-81806857',
    minPrice: 2,
    maxPrice: 9,
    unit: 'm lin.',
    refLen: 0.95,
  },

  // ── Quincaillerie ──────────────────────────────────────────────────────────
  // vis_inox_a2 : Rocket vis inox A2 4x200, boîte 50 pcs
  {
    id: 'vis_inox_a2',
    url: 'https://www.manomano.fr/p/rocket-vis-bois-agglo-tete-fraisee-tx-filetage-partiel-inox-a2-4-mm-x-200-50-mm-40654398',
    unit: 'lot',
    refLen: null,
    minPrice: 5,
    maxPrice: 40,
  },
  // sabot_chevron : LM=2.90€ → plage 1-6€, label souple
  {
    id: 'sabot_chevron',
    url: 'https://www.manomano.fr/cat/sabot+chevron',
    isSearchPage: true,
    labelMatch: /sabot|charpente|galva/i,
    minPrice: 1,
    maxPrice: 6,
    unit: 'pcs',
    refLen: null,
  },
  // equerre_fixation : équerres galva 70x70x55mm → URL directe
  {
    id: 'equerre_fixation',
    url: 'https://www.manomano.fr/p/equerre-galvanisee-dassemblage-avec-renfort-70x70x55mm-329080',
    minPrice: 0.5,
    maxPrice: 4,
    unit: 'pcs',
    refLen: null,
  },
];

/** Sélecteurs DOM pour pages produit et résultats de recherche */
const PRICE_SELECTORS = [
  '[data-testid="price"]',
  '[data-testid*="price"]',
  '[class*="Price__value"]',
  '[class*="price-value"]',
  '[class*="productPrice"]',
  '[class*="ProductPrice"]',
  '[itemprop="price"]',
  '[class*="Price"]',
  '.price',
];

/**
 * Extrait le prix depuis les blocs JSON-LD de la page.
 * Cherche un objet Product → offers → lowPrice | price | minimum du tableau.
 */
function extractJsonLdPrice(jsonLdBlocks) {
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block);
      const candidates = Array.isArray(data) ? data : [data];
      for (const item of candidates) {
        if (item['@type'] !== 'Product') continue;
        const offers = item.offers;
        if (!offers) continue;

        if (offers.lowPrice) {
          const p = parseFloat(offers.lowPrice);
          if (p > 0) return p;
        }
        if (offers.price) {
          const p = parseFloat(offers.price);
          if (p > 0) return p;
        }
        if (Array.isArray(offers)) {
          const prices = offers
            .map(o => parseFloat(o.price ?? o.lowPrice ?? 0))
            .filter(p => p > 0);
          if (prices.length) return Math.min(...prices);
        }
      }
    } catch (_) {}
  }
  return null;
}

/**
 * Extraction depuis une page produit directe.
 * @param {object} page         — Playwright page
 * @param {number} [minPrice=0] — prix minimum accepté (guard contre extractions erronées)
 * @param {number} [maxPrice=5000] — prix maximum accepté
 */
async function extractProductPage(page, minPrice = 0, maxPrice = 5000) {
  const inRange = v => !isNaN(v) && v >= minPrice && v <= maxPrice;

  // 1. JSON-LD (le plus fiable — AggregateOffer marketplace)
  try {
    const blocks = await page.$$eval(
      'script[type="application/ld+json"]',
      els => els.map(el => el.textContent)
    );
    const ldPrice = extractJsonLdPrice(blocks);
    if (ldPrice && inRange(ldPrice)) return ldPrice;
  } catch (_) {}

  // 2. __NEXT_DATA__ (état SSR Next.js) — cherche le premier prix dans la plage
  try {
    const fromNext = await page.evaluate(([minP, maxP]) => {
      const el = document.getElementById('__NEXT_DATA__');
      if (!el) return null;
      const raw = JSON.stringify(JSON.parse(el.textContent));
      const re = /"price"\s*:\s*"?([\d.]+)"?/g;
      let m;
      while ((m = re.exec(raw)) !== null) {
        const v = parseFloat(m[1]);
        if (!isNaN(v) && v >= minP && v <= maxP) return v;
      }
      return null;
    }, [minPrice, maxPrice]);
    if (fromNext) return fromNext;
  } catch (_) {}

  // 3. DOM selectors
  for (const sel of PRICE_SELECTORS) {
    try {
      const el = await page.$(sel);
      if (!el) continue;
      const txt = await el.evaluate(e =>
        e.getAttribute('content') || e.getAttribute('data-price') || e.textContent
      );
      const val = parsePrice(txt);
      if (val && inRange(val)) return val;
    } catch (_) {}
  }

  // 4. Regex sur le HTML brut — premier prix dans la plage
  const html = await page.content().catch(() => '');
  const re = /"price"\s*:\s*"?([\d.]+)"?/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const val = parsePrice(m[1]);
    if (val && inRange(val)) return val;
  }

  return null;
}

/**
 * Extraction depuis une page de recherche /cat/.
 * Tente JSON-LD de liste, puis scraping DOM des containers produit.
 */
async function extractSearchPage(page, labelMatch, minPrice, maxPrice) {
  // JSON-LD de la liste — certaines pages /cat/ injectent des Product items
  try {
    const blocks = await page.$$eval(
      'script[type="application/ld+json"]',
      els => els.map(el => el.textContent)
    );
    for (const block of blocks) {
      try {
        const data = JSON.parse(block);
        const items = (data['@graph'] || (Array.isArray(data) ? data : [data]))
          .filter(d => d['@type'] === 'Product');
        for (const item of items) {
          if (labelMatch && !labelMatch.test(item.name ?? '')) continue;
          const price = extractJsonLdPrice([JSON.stringify(item)]);
          if (price && price >= minPrice && price <= maxPrice) return price;
        }
      } catch (_) {}
    }
  } catch (_) {}

  // DOM scraping de la liste
  return page.evaluate(({ labelRe, sels, minP, maxP }) => {
    const re = new RegExp(labelRe, 'i');

    const CONTAINERS = [
      '[class*="product"]', '[class*="Product"]',
      '[class*="card"]',    '[class*="Card"]',
      '[class*="item"]',    '[class*="Item"]',
      '[class*="hit"]',     '[class*="Hit"]',
      'article', 'li',
    ].join(', ');

    function extractRangePrice(el) {
      for (const sel of sels) {
        const priceEl = el.querySelector(sel);
        if (!priceEl) continue;
        const raw = priceEl.getAttribute('content') ||
                    priceEl.getAttribute('data-price') ||
                    priceEl.textContent || '';
        const v = parseFloat(raw.replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
        if (!isNaN(v) && v >= minP && v <= maxP) return v;
      }
      const re2 = /(\d{1,4}[.,]\d{2})\s*[€e]/g;
      let m;
      while ((m = re2.exec(el.textContent)) !== null) {
        const v = parseFloat(m[1].replace(',', '.'));
        if (!isNaN(v) && v >= minP && v <= maxP) return v;
      }
      return null;
    }

    const containers = Array.from(document.querySelectorAll(CONTAINERS));

    for (const c of containers) {
      if (!re.test(c.textContent)) continue;
      const price = extractRangePrice(c);
      if (price !== null) return price;
    }
    for (const c of containers) {
      const price = extractRangePrice(c);
      if (price !== null) return price;
    }
    return null;
  }, {
    labelRe: labelMatch?.source ?? '.',
    sels: PRICE_SELECTORS,
    minP: minPrice,
    maxP: maxPrice,
  });
}

/**
 * scrapeManoMano() — sans argument (browser indépendant stealth).
 * Appelé directement depuis index.js comme scrapeLeroyMerlin().
 */
export async function scrapeManoMano() {
  const results = {};
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=fr-FR'],
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    });
  } catch (err) {
    console.warn(`  [manomano] Browser indisponible : ${err.message.split('\n')[0]}`);
    return {};
  }

  for (const target of TARGETS) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      extraHTTPHeaders: {
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
    });
    const page = await context.newPage();

    try {
      // domcontentloaded — ne pas attendre networkidle (Cloudflare = requêtes continues)
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 35000 });

      if (target.isSearchPage) {
        // Attendre qu'un container produit soit hydraté (React async)
        await page.waitForSelector(
          '[class*="product"], [class*="Product"], [class*="card"], article',
          { timeout: 15000 }
        ).catch(() => {});
        // Scroll pour déclencher le lazy-load
        await page.evaluate(() => window.scrollBy(0, 800)).catch(() => {});
        await page.waitForTimeout(2000);
        // Second scroll si nécessaire
        await page.evaluate(() => window.scrollBy(0, 400)).catch(() => {});
        await page.waitForTimeout(1000);
      } else {
        // Pages produit : 3s suffisent pour le challenge Cloudflare + JSON-LD
        await page.waitForTimeout(3000);
      }

      // Attendre qu'un sélecteur prix ou JSON-LD apparaisse
      await page.waitForFunction(() => {
        const hasLd = !!document.querySelector('script[type="application/ld+json"]');
        const hasNext = !!document.getElementById('__NEXT_DATA__');
        const hasPrice = ['[data-testid*="price"]', '[itemprop="price"]', '.price', '[class*="Price"]']
          .some(s => !!document.querySelector(s));
        return hasLd || hasNext || hasPrice;
      }, { timeout: 12000 }).catch(() => {});

      const minP = target.minPrice ?? 0;
      const maxP = target.maxPrice ?? 5000;

      const raw = target.isSearchPage
        ? await extractSearchPage(page, target.labelMatch, minP, maxP)
        : await extractProductPage(page, minP, maxP);

      if (raw !== null && raw > 0) {
        const price = normalizePricePerUnit(raw, target.unit, target.refLen, target.refArea);
        results[target.id] = { [STORE_ID]: price };
        console.log(`  [manomano] ${target.id} = ${price} € ${target.isSearchPage ? '(search)' : '(direct)'}`);
      } else {
        console.warn(`  [manomano] ${target.id} — prix non trouvé`);
      }
    } catch (err) {
      console.warn(`  [manomano] ${target.id} — erreur : ${err.message.split('\n')[0]}`);
    } finally {
      await context.close();
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  if (browser) await browser.close();
  return results;
}
