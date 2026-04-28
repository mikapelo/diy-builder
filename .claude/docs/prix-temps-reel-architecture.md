# Architecture — Système de prix temps réel

## Contexte et contraintes

**Problème actuel :** `materialPrices.js` contient des prix statiques mis à jour manuellement.
Les 6 sites cibles se comportent ainsi face au scraping :

| Enseigne | Accès direct | Stratégie viable |
|---|---|---|
| Castorama | ✅ pages produit accessibles | Scraping HTML ciblé |
| Leroy Merlin | ❌ 403 systématique | Index Google + API JSON cachée |
| Brico Dépôt | ⚠️ navigation OK, prix en JS | Headless browser |
| Point.P | ❌ 403 | Appel API REST (voir §3) |
| Gedimat / Chausson | ❌ 403 | Prix pros, non applicables |

---

## Architecture proposée : Scraper planifié + cache JSON

```
┌─────────────────────────────────────────────────────────────┐
│                    PIPELINE SCRAPING                        │
│                                                             │
│  Cron (1×/semaine)                                          │
│       │                                                     │
│       ▼                                                     │
│  scraper/index.js                                           │
│  ├── scrapers/castorama.js  → Playwright headless           │
│  ├── scrapers/leroymerlin.js → API JSON interne LM          │
│  └── scrapers/bricodepot.js  → Playwright headless          │
│       │                                                     │
│       ▼                                                     │
│  normalizer.js  → mappe vers les IDs materialPrices         │
│       │                                                     │
│       ▼                                                     │
│  public/prices-cache.json   ← lu par le frontend Next.js   │
└─────────────────────────────────────────────────────────────┘
```

---

## Implémentation côté frontend (Next.js)

### 1. API Route de cache — `app/api/prices/route.js`

```js
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const revalidate = 3600; // ISR : revalide toutes les heures

export function GET() {
  try {
    const raw = readFileSync(join(process.cwd(), 'public/prices-cache.json'), 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'cache_unavailable' }, { status: 503 });
  }
}
```

### 2. Hook React — `hooks/useLivePrices.js`

```js
import { useState, useEffect } from 'react';
import { MATERIAL_PRICES, STORES } from '@/lib/materialPrices';

/**
 * Charge le cache de prix temps réel.
 * Fallback transparent vers materialPrices.js si le cache est absent.
 *
 * @returns {{ prices: MATERIAL_PRICES-like[], date: string|null, live: boolean }}
 */
export function useLivePrices() {
  const [state, setState] = useState({ prices: MATERIAL_PRICES, date: null, live: false });

  useEffect(() => {
    fetch('/api/prices')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.prices?.length) return;
        setState({ prices: data.prices, date: data.date, live: true });
      })
      .catch(() => {});  // fallback silencieux vers les prix statiques
  }, []);

  return state;
}
```

### 3. Intégration dans `BudgetComparator.jsx`

```jsx
// Remplacer l'import statique par le hook :
import { useLivePrices } from '@/hooks/useLivePrices';

// Dans le composant :
const { prices, date, live } = useLivePrices();

// Badge optionnel :
{live && <span className="text-xs text-emerald-600">Prix mis à jour le {date}</span>}
```

---

## Scraper côté serveur — Node.js (hors Next.js)

### Structure `scraper/`

```
scraper/
├── package.json          # playwright, node-fetch, node-cron
├── index.js              # point d'entrée, orchestration
├── normalizer.js         # mapping produit → ID materialPrices
├── scrapers/
│   ├── castorama.js      # HTML fetch + cheerio (pas besoin de Playwright)
│   ├── leroymerlin.js    # API JSON interne (voir §3)
│   └── bricodepot.js     # Playwright headless (JS dynamique)
└── output/
    └── prices-cache.json # copié vers frontend/public/
```

### `scraper/scrapers/castorama.js` — exemple opérationnel

```js
import * as cheerio from 'cheerio';

const TARGETS = [
  {
    id: 'chevron_60x80',
    url: 'https://www.castorama.fr/chevron/cat_id_0003116.cat',
    selector: '[data-product-name*="63"]',  // 75×63 ≈ 60×80
    unit: 'm lin.',
    refLen: 3,
  },
  {
    id: 'lame_terrasse',
    url: 'https://www.castorama.fr/jardin-et-terrasse/terrasse-et-sol-exterieur/lame-de-terrasse/cat_id_3317.cat',
    selector: '[data-product-name*="Lemhi"][data-product-name*="360"]',
    unit: 'pcs',
    refLen: 3.6,
  },
  {
    id: 'lambourde_45x70',
    url: 'https://www.castorama.fr/lambourde-en-pin-70-x-45-mm-l-300-cm-classe-4-green-outside/3760055271523_CAFR.prd',
    selector: '[itemprop="price"]',
    unit: 'pcs',
    refLen: 3.0,
  },
  {
    id: 'poteau_pergola_100',
    url: 'https://www.castorama.fr/chevron/cat_id_0003116.cat',
    selector: '[data-product-name*="100 x 100"]',
    unit: 'pcs',
    refLen: 3.0,
  },
  {
    id: 'lame_cloture',
    url: 'https://www.castorama.fr/lame-de-cloture-bois-lemhi-120-x-9-cm/3663602942771_CAFR.prd',
    selector: '[itemprop="price"]',
    unit: 'm lin.',
    refLen: 1.2,
  },
];

export async function scrapeCastorama() {
  const results = {};
  for (const target of TARGETS) {
    const html = await fetch(target.url).then(r => r.text());
    const $ = cheerio.load(html);
    const rawPrice = $(target.selector).first().attr('content')
      ?? $(target.selector).first().text().replace(',', '.').replace(/[^\d.]/g, '');
    const price = parseFloat(rawPrice);
    if (!isNaN(price)) {
      // Normalise en €/ml si l'unité le demande
      const normalized = target.unit === 'm lin.' && target.refLen
        ? parseFloat((price / target.refLen).toFixed(2))
        : price;
      results[target.id] = { castorama: normalized };
    }
  }
  return results;
}
```

### `scraper/scrapers/leroymerlin.js` — API JSON interne

Leroy Merlin expose une API JSON non documentée mais stable utilisée par leur SPA :

```js
// Format : https://www.leroymerlin.fr/api/v1/product/{SKU}/stores/{storeId}/price
// Exemple pour chevron 60×80 4m (SKU 67005295) :
// GET https://www.leroymerlin.fr/api/v1/product/67005295/price
// Réponse : { "price": { "selling": { "amount": 13.90 } } }

const LM_PRODUCTS = [
  { id: 'chevron_60x80',      sku: '67005295',  unit: 'm lin.', refLen: 4.0 }, // 4m
  { id: 'poteau_pergola_100', sku: '67013814',  unit: 'pcs',    refLen: 3.0 },
];

export async function scrapeLeroyMerlin() {
  const results = {};
  for (const p of LM_PRODUCTS) {
    const url = `https://www.leroymerlin.fr/api/v1/product/${p.sku}/price`;
    const data = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    }).then(r => r.json()).catch(() => null);

    const price = data?.price?.selling?.amount;
    if (price) {
      const normalized = p.unit === 'm lin.' ? parseFloat((price / p.refLen).toFixed(2)) : price;
      results[p.id] = { leroymerlin: normalized };
    }
  }
  return results;
}
```

> ⚠️ Cette API n'est pas officielle. Tester la robustesse avant de l'utiliser en production.
> Alternative : puppeteer/playwright avec extraction du JSON `window.__INITIAL_STATE__`.

---

## Planification — `scraper/index.js`

```js
import cron from 'node-cron';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { scrapeCastorama }    from './scrapers/castorama.js';
import { scrapeLeroyMerlin }  from './scrapers/leroymerlin.js';
import { MATERIAL_PRICES }    from '../frontend/lib/materialPrices.js';

async function run() {
  console.log('[scraper] Démarrage mise à jour prix...');

  const [casto, lm] = await Promise.allSettled([
    scrapeCastorama(),
    scrapeLeroyMerlin(),
  ]);

  // Merge des prix scrappés sur la base statique
  const merged = MATERIAL_PRICES.map(mat => {
    const casPrices = casto.status === 'fulfilled' ? casto.value[mat.id] : {};
    const lmPrices  = lm.status  === 'fulfilled' ? lm.value[mat.id]  : {};
    return {
      ...mat,
      prices: { ...mat.prices, ...casPrices, ...lmPrices },
      scraped: !!(casPrices || lmPrices),
    };
  });

  const output = {
    date: new Date().toISOString().split('T')[0],
    prices: merged,
  };

  const outPath = join(import.meta.dirname, '../frontend/public/prices-cache.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log('[scraper] ✅ Cache mis à jour →', outPath);
}

// Exécution immédiate + planification hebdomadaire (lundi 6h)
run();
cron.schedule('0 6 * * 1', run);
```

---

## Déploiement recommandé

| Scénario | Solution |
|---|---|
| Dev local | `node scraper/index.js` manuellement |
| VPS / serveur dédié | `pm2 start scraper/index.js --cron-restart "0 6 * * 1"` |
| Vercel (serverless) | Vercel Cron Job → `/api/update-prices` (Edge Function) |
| GitHub Actions | Workflow planifié `schedule: cron: '0 6 * * 1'` → commit du JSON |

### Option GitHub Actions (recommandée pour commencer)

```yaml
# .github/workflows/update-prices.yml
name: Update material prices

on:
  schedule:
    - cron: '0 6 * * 1'   # lundi 6h UTC
  workflow_dispatch:        # déclenchement manuel possible

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci --prefix scraper
      - run: node scraper/index.js
      - name: Commit updated cache
        run: |
          git config user.name "price-bot"
          git config user.email "bot@diy-builder.fr"
          git add frontend/public/prices-cache.json
          git diff --staged --quiet || git commit -m "chore: mise à jour automatique des prix matériaux"
          git push
```

---

## Robustesse et fallback

```
Requête frontend
        │
        ▼
   /api/prices ──── OK ──→ prices-cache.json (prix temps réel)
        │
        └── 503 / vide ──→ materialPrices.js (prix statiques)
                                    ↑
                        Toujours présents, jamais supprimés
```

- Le hook `useLivePrices` ne bloque **jamais** le rendu — les prix statiques s'affichent en attendant.
- Si le scraper échoue (site down, structure HTML changée), le cache précédent reste valide.
- Un champ `stale: true` peut être ajouté si le cache a plus de 30 jours.

---

## Prochaines étapes concrètes

1. `mkdir scraper && npm init` — installer `playwright`, `cheerio`, `node-cron`
2. Valider `castorama.js` sur les 5 produits scrappés (déjà fonctionnel)
3. Tester `leroymerlin.js` sur l'API JSON interne (SKU à confirmer)
4. Créer `app/api/prices/route.js` dans Next.js
5. Créer `hooks/useLivePrices.js`
6. Wirer dans `BudgetComparator.jsx`
7. Configurer GitHub Actions ou `pm2`
