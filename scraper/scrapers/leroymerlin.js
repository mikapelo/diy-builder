/**
 * leroymerlin.js — Scraper Leroy Merlin
 *
 * Méthode : playwright-extra + stealth plugin.
 * LM utilise Datadome qui bloque les browsers headless classiques.
 * Le plugin stealth patche navigator.webdriver, WebGL, TLS fingerprint, etc.
 *
 * Ce scraper gère son propre browser (pas le browser partagé du pipeline).
 * Appel : scrapeLeroyMerlin() — sans argument.
 *
 * Retourne : { materialId: { leroymerlin: price } }
 */

import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { parsePrice, normalizePricePerUnit } from '../normalizer.js';

chromium.use(StealthPlugin());

const STORE_ID = 'leroymerlin';

const delay = ms => new Promise(r => setTimeout(r, ms));
const randDelay = (min, max) => delay(min + Math.random() * (max - min));

const TARGETS = [
  {
    id: 'chevron_60x80',
    url: 'https://www.leroymerlin.fr/produits/materiaux/bois-de-charpente-bois-brut-et-dalle-de-construction/ossature-bois-et-bois-de-charpente/chevron-lambourde-et-bastaing/chevron-sapin-traite-60x80-mm-longueur-4-m-choix-2-classe-2-70027930.html',
    unit: 'm lin.',
    refLen: 4.0,
  },
  {
    id: 'entretoise_toiture',
    url: 'https://www.leroymerlin.fr/produits/materiaux/bois-de-charpente-bois-brut-et-dalle-de-construction/ossature-bois-et-bois-de-charpente/chevron-lambourde-et-bastaing/chevron-sapin-traite-60x80-mm-longueur-4-m-choix-2-classe-2-70027930.html',
    unit: 'm lin.',
    refLen: 4.0,
  },
  {
    id: 'poteau_pergola_100',
    url: 'https://www.leroymerlin.fr/produits/materiaux/bois-de-charpente-bois-brut-et-dalle-de-construction/ossature-bois-et-bois-de-charpente/poteau-et-poutre/poutre-sapin-epicea-traite-100x100-mm-longueur-3-m-choix-2-classe-2-67013814.html',
    unit: 'pcs',
    refLen: 3.0,
  },
  {
    id: 'lambourde_45x70',
    url: 'https://www.leroymerlin.fr/produits/lambourde-pin-45x70x2400mm-ou-2m40-traite-classe-4-vert-90800571.html',
    unit: 'pcs',
    refLen: 2.4,
  },
  {
    id: 'poutre_pergola_150',
    url: 'https://www.leroymerlin.fr/produits/materiaux/bois-de-charpente-bois-brut-et-dalle-de-construction/ossature-bois-et-bois-de-charpente/chevron-lambourde-et-bastaing/bastaing-solive-sapin-epicea-traite-50x150-mm-long-4-m-choix-2-classe-2-67006331.html',
    unit: 'm lin.',
    refLen: 4.0,
  },
  {
    id: 'plot_beton',
    url: 'https://www.leroymerlin.fr/produits/terrasse-jardin/terrasse-et-sol-exterieur/accessoires-de-pose-et-produits-entretien/plot-de-terrasse/plot-pour-dalle-et-lambourde-h-100-mm-70717241.html',
    unit: 'pcs',
    refLen: null,
  },
  {
    id: 'lame_terrasse',
    url: 'https://www.leroymerlin.fr/produits/terrasse-jardin/terrasse-et-sol-exterieur/lame-de-terrasse-bois-et-composite/lame-de-terrasse-bois/lame-terrasse-pin-p.html',
    unit: 'pcs',
    refLen: 3.6,
    isListPage: true,
    labelMatch: /pin.*3[.,]6|3[.,]6.*pin|lemhi.*360|pin.*145/i,
  },
  {
    id: 'lame_cloture',
    url: 'https://www.leroymerlin.fr/produits/terrasse-jardin/cloture-grillage-occultation/cloture/cloture-bois/lame-cloture-bois/',
    unit: 'm lin.',
    refLen: 1.2,
    isListPage: true,
    labelMatch: /pin.*120|120.*pin|lame.*cloture.*120/i,
  },
];

const LM_PRICE_SELECTORS = [
  '[data-testid="price-value"]',
  '[data-qa-id="price"]',
  '[class*="basicPrice"]',
  '[class*="BasicPrice"]',
  '[class*="price__amount"]',
  '[class*="price-amount"]',
  '[class*="ProductPrice"]',
  '[itemprop="price"]',
];

async function extractPriceLM(page) {
  // Stratégie 1 : __NEXT_DATA__ (Next.js SSR state — toujours présent)
  try {
    const fromNextData = await page.evaluate(() => {
      const el = document.getElementById('__NEXT_DATA__');
      if (!el) return null;
      const raw = JSON.stringify(JSON.parse(el.textContent));
      const m = raw.match(/"price"\s*:\s*"?([\d.]+)"?/);
      if (!m) return null;
      const v = parseFloat(m[1]);
      return (!isNaN(v) && v > 0 && v < 5000) ? v : null;
    });
    if (fromNextData) return fromNextData;
  } catch (_) {}

  // Stratégie 2 : sélecteurs DOM LM
  try {
    const fromDom = await page.evaluate(sels => {
      for (const sel of sels) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const raw = el.getAttribute('content') || el.textContent || '';
        const cleaned = raw.replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, '');
        const v = parseFloat(cleaned);
        if (!isNaN(v) && v > 0 && v < 5000) return v;
      }
      return null;
    }, LM_PRICE_SELECTORS);
    if (fromDom) return fromDom;
  } catch (_) {}

  // Stratégie 3 : JSON-LD + regex dans le HTML brut
  const html = await page.content();
  const ldMatch = html.match(/"price"\s*:\s*"?([\d.,]+)"?/);
  if (ldMatch) {
    const val = parsePrice(ldMatch[1]);
    if (val && val > 0) return val;
  }
  const priceMatch = html.match(/(\d{1,4}[.,]\d{2})\s*€/);
  if (priceMatch) {
    const val = parsePrice(priceMatch[1]);
    if (val && val > 0 && val < 5000) return val;
  }

  return null;
}

export async function scrapeLeroyMerlin() {
  const results = {};
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=fr-FR'],
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    });
  } catch (err) {
    console.warn(`  [leroymerlin] Browser indisponible : ${err.message.split('\n')[0]}`);
    return {};
  }

  for (const target of TARGETS) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
      extraHTTPHeaders: {
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const page = await context.newPage();

    try {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 35000 });

      const pageUrl = page.url();
      const pageTitle = await page.title();
      if (
        pageUrl.includes('datadome') ||
        pageTitle.toLowerCase().includes('access denied') ||
        pageTitle.toLowerCase().includes('checking')
      ) {
        console.warn(`  [leroymerlin] Challenge détecté sur ${target.id} — skip`);
        continue;
      }

      await page.evaluate(() => {
        window.scrollBy(0, 300 + Math.random() * 400);
      });
      await randDelay(500, 1200);

      await page.waitForSelector(
        '[data-testid="price-value"], [class*="basicPrice"], [itemprop="price"], #__NEXT_DATA__',
        { timeout: 12000 }
      ).catch(() => {});

      let raw;

      if (target.isListPage && target.labelMatch) {
        raw = await page.evaluate(({ labelRe, sels }) => {
          const re = new RegExp(labelRe, 'i');
          for (const c of document.querySelectorAll('[class*="product"], [class*="card"], article, li')) {
            if (!re.test(c.textContent)) continue;
            for (const sel of sels) {
              const el = c.querySelector(sel);
              if (!el) continue;
              const txt = el.getAttribute('content') || el.textContent || '';
              const v = parseFloat(txt.replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
              if (!isNaN(v) && v > 0 && v < 5000) return v;
            }
            // Fallback max prix dans le container
            const allPrices = [];
            const re2 = /(\d{1,3}[.,]\d{2})\s*€/g;
            let m;
            while ((m = re2.exec(c.textContent)) !== null) {
              const v = parseFloat(m[1].replace(',', '.'));
              if (!isNaN(v) && v > 1 && v < 5000) allPrices.push(v);
            }
            if (allPrices.length > 0) return Math.max(...allPrices);
          }
          return null;
        }, { labelRe: target.labelMatch.source, sels: LM_PRICE_SELECTORS });
      } else {
        raw = await extractPriceLM(page);
      }

      if (raw !== null && raw > 0) {
        const price = normalizePricePerUnit(raw, target.unit, target.refLen);
        results[target.id] = { [STORE_ID]: price };
        console.log(`  [leroymerlin] ${target.id} = ${price} €`);
      } else {
        console.warn(`  [leroymerlin] ${target.id} — prix non trouvé`);
      }
    } catch (err) {
      console.warn(`  [leroymerlin] ${target.id} — erreur : ${err.message.split('\n')[0]}`);
    } finally {
      await context.close();
      await randDelay(2500, 5000);
    }
  }

  if (browser) await browser.close();
  return results;
}
