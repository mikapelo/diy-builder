/**
 * castorama.js — Scraper Castorama
 *
 * Méthode : fetch HTML + extraction JSON-LD.
 * Le prix n'est pas dans le DOM statique (rendu React côté client),
 * mais il est systématiquement présent dans le bloc JSON-LD
 * (script type="application/ld+json" → Product → offers.price).
 *
 * Confirmé accessible en avril 2025.
 * Retourne : { materialId: { castorama: price } }
 */

import * as cheerio from 'cheerio';
import { parsePrice, normalizePricePerUnit } from '../normalizer.js';

const STORE_ID = 'castorama';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9',
};

/**
 * Pages produit Castorama — EAN codés dans l'URL (_CAFR.prd).
 * Si un URL retourne 404, on marque skip et le prix statique reste.
 */
const PRODUCT_TARGETS = [
  // ── Ossature bois ─────────────────────────────────────────────────────────

  // Chevron 75×63mm L4m (section ≈ 60×80) — URL directe produit
  {
    id: 'chevron_60x80',
    url: 'https://www.castorama.fr/chevron-traite-75-x-63-mm-l-4-m-classe-2/3663602863243_CAFR.prd',
    unit: 'm lin.',
    refLen: 4.0,
  },
  // Bastaing 175×63mm L4m — URL directe produit
  {
    id: 'bastaing_63x150',
    url: 'https://www.castorama.fr/bastaing-traite-175-x-63-mm-l-4-m-jaune/3663602863212_CAFR.prd',
    unit: 'm lin.',
    refLen: 4.0,
  },
  // Lambourde pin 70×45mm L3m cl.4 — URL directe produit (3m = 1 pièce)
  {
    id: 'lambourde_45x70',
    url: 'https://www.castorama.fr/lambourde-en-pin-70-x-45-mm-l-300-cm-classe-4-green-outside/3760055271523_CAFR.prd',
    unit: 'pcs',
    refLen: 3.0,
  },
  // Solivette 150×50mm L3m (poutre pergola) — URL directe produit
  {
    id: 'poutre_pergola_150',
    url: 'https://www.castorama.fr/solivette-traitee-150-x-50-mm-l-3-m-classe-2/3663602863434_CAFR.prd',
    unit: 'm lin.',
    refLen: 3.0,
  },
  // Volige 105×14mm L3m — 1 pièce = 0,105m × 3m = 0,315 m²
  {
    id: 'volige_18mm',
    url: 'https://www.castorama.fr/volige-traitee-105-x-14-mm-l-3-m-classe-2/3663602863519_CAFR.prd',
    unit: 'm²',
    refArea: 0.315,  // 0.105m × 3.0m
  },

  // ── Terrasse ──────────────────────────────────────────────────────────────

  // Lame terrasse Lemhi 360cm×14,4cm×27mm — URL directe produit (3,6m)
  {
    id: 'lame_terrasse',
    url: 'https://www.castorama.fr/lame-de-terrasse-lemhi-l-360-cm/3760055271257_CAFR.prd',
    unit: 'pcs',
    refLen: 3.6,
    fallbackUrl: 'https://www.castorama.fr/jardin-et-terrasse/terrasse-et-sol-exterieur/lame-de-terrasse/cat_id_3317.cat',
    fallbackLabelMatch: /lemhi.*360|360.*lemhi|lemhi.*pin.*3[.,]6/i,
  },

  // ── Clôture ───────────────────────────────────────────────────────────────

  // Lame de clôture pin 120cm×9cm×21mm
  {
    id: 'lame_cloture',
    url: 'https://www.castorama.fr/lame-de-cloture-bois-lemhi-120-x-9-cm/3663602942771_CAFR.prd',
    unit: 'm lin.',
    refLen: 1.2,
  },
  // Poteau bois Blooma vert 9×9cm H240cm (clôture + montant cabanon)
  {
    id: 'poteau_cloture_90',
    url: 'https://www.castorama.fr/poteau-en-bois-blooma-vert-9-x-9-x-h-240-cm/3663602433255_CAFR.prd',
    unit: 'pcs',
    refLen: 2.4,
  },
  // Montant 90×90mm — même produit Blooma H240cm (cabanon / ossature)
  {
    id: 'montant_90x90',
    url: 'https://www.castorama.fr/poteau-en-bois-blooma-vert-9-x-9-x-h-240-cm/3663602433255_CAFR.prd',
    unit: 'pcs',
    refLen: 2.4,
  },

  // ── Pergola ───────────────────────────────────────────────────────────────

  // Poteau Zutam 9×9cm H240cm — ⚠️ 90×90mm (Casto ne vend pas de 100×100mm)
  // Prix indicatif seulement : section ≠ poteau_pergola_100 (100×100mm)
  {
    id: 'poteau_pergola_100',
    url: 'https://www.castorama.fr/poteau-bois-zutam-marron-9-x-9-x-h-240-cm/3663602943181_CAFR.prd',
    unit: 'pcs',
    refLen: 2.4,
  },

  // ── Quincaillerie ─────────────────────────────────────────────────────────

  // Vis inox A2 tête fraisée Torx T20 4×40mm — lot de 200 pièces
  {
    id: 'vis_inox_a2',
    url: 'https://www.castorama.fr/mkp/200-vis-bois-t-te-frais-e-torx-t20-4-x-40-mm-inox-a2-d-work/3664100242073_CAFR.prd',
    unit: 'lot',
    refLen: null,
  },
  // Équerre renforcée 70×70×55mm ep.2,5mm
  {
    id: 'equerre_fixation',
    url: 'https://www.castorama.fr/equerre-renforcee-70-x-70-x-55-x-2-5-mm-k0/4004338330354_CAFR.prd',
    unit: 'pcs',
    refLen: null,
  },
];

async function fetchHtml(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/**
 * Extrait le prix depuis JSON-LD Product > offers > price.
 * C'est la méthode la plus robuste — Castorama l'inclut systématiquement.
 */
function extractFromJsonLd(html) {
  const $ = cheerio.load(html);
  let found = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    if (found) return;
    try {
      const data = JSON.parse($(el).html() || '{}');
      const objs = Array.isArray(data) ? data : [data];
      for (const obj of objs) {
        const target = obj['@type'] === 'Product' ? obj : (obj['@graph'] ?? []).find(g => g['@type'] === 'Product');
        if (!target) continue;
        const offers = Array.isArray(target.offers) ? target.offers[0] : target.offers;
        const price = parsePrice(offers?.price ?? offers?.lowPrice);
        if (price && price > 0) { found = price; return; }
      }
    } catch (_) {}
  });

  return found;
}

/**
 * Extraction de secours depuis le HTML brut (regex).
 * Cherche le premier pattern "X,XX €" ou "X.XX€" dans la page.
 */
function extractFromHtmlText(html) {
  const m = html.match(/"price"\s*:\s*"?([\d.,]+)"?/);
  if (m) {
    const val = parsePrice(m[1]);
    if (val && val > 0 && val < 5000) return val;
  }
  return null;
}

/**
 * Extrait un prix depuis une page liste de produits.
 * Cherche le container dont le texte matche `labelMatch`,
 * puis tente d'extraire le prix par JSON-LD ou regex interne.
 */
function extractFromListPage(html, labelMatch) {
  const $ = cheerio.load(html);
  let found = null;

  // Stratégie A : JSON-LD multi-produits (ItemList ou ProductList)
  $('script[type="application/ld+json"]').each((_, el) => {
    if (found) return;
    try {
      const data = JSON.parse($(el).html() || '{}');
      const items = data.itemListElement ?? data['@graph'] ?? (Array.isArray(data) ? data : []);
      for (const item of items) {
        const prod = item.item ?? item;
        if (!labelMatch.test(prod.name ?? '')) continue;
        const offers = Array.isArray(prod.offers) ? prod.offers[0] : prod.offers;
        const price = parsePrice(offers?.price);
        if (price && price > 0) { found = price; return; }
      }
    } catch (_) {}
  });

  if (found) return found;

  // Stratégie B : recherche dans les containers DOM
  $('[class*="product"], article').each((_, el) => {
    if (found) return;
    const text = $(el).text();
    if (!labelMatch.test(text)) return;
    // Cherche un pattern prix dans ce container
    const priceMatch = text.match(/(\d{1,3}[.,]\d{2})\s*€/);
    if (priceMatch) {
      const val = parsePrice(priceMatch[1]);
      if (val && val > 0) found = val;
    }
  });

  return found;
}

async function scrapeTarget(target) {
  let html;
  try {
    html = await fetchHtml(target.url);
  } catch (err) {
    console.warn(`  [castorama] ${target.id} — URL principale inaccessible (${err.message})`);
    return null; // laisse le caller tenter le fallbackUrl
  }

  if (target.isListPage && target.labelMatch) {
    return extractFromListPage(html, target.labelMatch);
  }

  return extractFromJsonLd(html) ?? extractFromHtmlText(html);
}

export async function scrapeCastorama() {
  const results = {};
  const delay = ms => new Promise(r => setTimeout(r, ms));

  for (const target of PRODUCT_TARGETS) {
    try {
      await delay(700);
      let raw = await scrapeTarget(target);

      // Fallback URL si 404 ou prix non trouvé
      if (raw === null && target.fallbackUrl) {
        await delay(500);
        const fallbackHtml = await fetchHtml(target.fallbackUrl).catch(() => null);
        if (fallbackHtml) {
          raw = extractFromListPage(fallbackHtml, target.fallbackLabelMatch ?? target.labelMatch ?? /./);
        }
      }

      if (raw !== null && raw > 0) {
        const price = normalizePricePerUnit(raw, target.unit, target.refLen, target.refArea);
        results[target.id] = { [STORE_ID]: price };
        console.log(`  [castorama] ${target.id} = ${price} €`);
      } else {
        console.warn(`  [castorama] ${target.id} — prix non trouvé (${target.url})`);
      }
    } catch (err) {
      console.warn(`  [castorama] ${target.id} — erreur : ${err.message}`);
    }
  }

  return results;
}
