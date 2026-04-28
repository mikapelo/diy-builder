/**
 * tests/scraper.test.js
 * ═══════════════════════════════════════════════════════════════
 * Tests unitaires du système scraper.
 * HTTP entièrement mocké — aucun appel réseau réel.
 *
 * SUITES
 * ──────
 * 1. base.js           — normaliserPrix, extraireLongueur, categoriserProduit
 * 2. leroymerlin.js    — extraction HTML + gestion blocage
 * 3. castorama.js      — extraction JSON SSR + CSS
 * 4. bricodepot.js     — API JSON interne + fallback HTML
 * 5. catalogService.js — nettoyerProduit, pipeline complet (BDD mockée)
 * 6. scrapers/index.js — isolation erreurs, statistiques
 * ═══════════════════════════════════════════════════════════════
 */

// ── Mock axios avant tout require ──────────────────────────────
jest.mock('axios');
const axios = require('axios');

// ── Mock de la BDD ─────────────────────────────────────────────
jest.mock('../backend/database/db', () => ({
  query:     jest.fn(),
  getClient: jest.fn(),
}));
const db = require('../backend/database/db');

const {
  normaliserPrix,
  extraireLongueur,
  categoriserProduit,
  validerProduit,
  ScraperError,
  ScraperBlockedError,
} = require('../backend/scrapers/base');

const { nettoyerProduit } = require('../backend/services/catalogService');

// ── Helpers ────────────────────────────────────────────────────
function mockAxiosOK(html) {
  const instance = {
    get: jest.fn().mockResolvedValue({ status: 200, data: html }),
    interceptors: {
      request: { use: jest.fn() },
    },
    defaults: { headers: {} },
  };
  axios.create.mockReturnValue(instance);
  return instance;
}

function mockAxiosBloque(status = 403) {
  const instance = {
    get: jest.fn().mockResolvedValue({ status, data: '' }),
    interceptors: { request: { use: jest.fn() } },
    defaults: { headers: {} },
  };
  axios.create.mockReturnValue(instance);
  return instance;
}

function mockAxiosErreurReseau() {
  const instance = {
    get: jest.fn().mockRejectedValue({ code: 'ECONNABORTED', message: 'timeout' }),
    interceptors: { request: { use: jest.fn() } },
    defaults: { headers: {} },
  };
  axios.create.mockReturnValue(instance);
  return instance;
}

// ═══════════════════════════════════════════════════════════════
// 1. base.js
// ═══════════════════════════════════════════════════════════════

describe('base.js — normaliserPrix', () => {
  test('parse "12,90 €" → 12.9', () =>
    expect(normaliserPrix('12,90 €')).toBeCloseTo(12.9));

  test('parse "12.90" → 12.9', () =>
    expect(normaliserPrix('12.90')).toBeCloseTo(12.9));

  test('parse "€ 9,99" → 9.99', () =>
    expect(normaliserPrix('€ 9,99')).toBeCloseTo(9.99));

  test('parse "1 299,00 €" → 1299', () =>
    expect(normaliserPrix('1 299,00 €')).toBeCloseTo(1299));

  test('retourne null pour texte vide', () =>
    expect(normaliserPrix('')).toBeNull());

  test('retourne null pour "gratuit"', () =>
    expect(normaliserPrix('gratuit')).toBeNull());

  test('retourne null pour prix > 9999', () =>
    expect(normaliserPrix('99999')).toBeNull());

  test('retourne null pour prix = 0', () =>
    expect(normaliserPrix('0')).toBeNull());
});

describe('base.js — extraireLongueur', () => {
  test('"Lame 2.4m" → 2400', () =>
    expect(extraireLongueur('Lame terrasse pin 2.4m')).toBe(2400));

  test('"Lambourde 4000mm" → 4000', () =>
    expect(extraireLongueur('Lambourde 40x60x4000mm')).toBe(4000));

  test('"Vis 5x60mm" → 60', () =>
    expect(extraireLongueur('Vis inox A4 5x60mm')).toBe(60));

  test('"300cm" → 3000', () =>
    expect(extraireLongueur('Lame 300cm')).toBe(3000));

  test('"3m" → 3000', () =>
    expect(extraireLongueur('Planche terrasse douglas 3m')).toBe(3000));

  test('titre sans longueur → null', () =>
    expect(extraireLongueur('Vis inox A4 tête fraisée')).toBeNull());

  test('null → null', () =>
    expect(extraireLongueur(null)).toBeNull());
});

describe('base.js — categoriserProduit', () => {
  test.each([
    ['Lame terrasse pin traité',           'lame_terrasse'],
    ['Planche de terrasse douglas',        'lame_terrasse'],
    ['Lambourde pin traité classe 4',      'lambourde'],
    ['Lambourde douglas 40x60x4000mm',     'lambourde'],
    ['Vis inox A4 5x60mm terrasse',        'vis'],
    ['Vis autoperceuse inox terrasse',     'vis'],
    ['Marteau de charpentier',             null],
    ['Peinture extérieure grise',          null],
  ])('"%s" → %s', (titre, expected) => {
    expect(categoriserProduit(titre)).toBe(expected);
  });
});

describe('base.js — validerProduit', () => {
  const produitValide = {
    nom:       'Lame terrasse pin 2.4m',
    categorie: 'lame_terrasse',
    prix:      9.99,
    magasin:   'Leroy Merlin',
    url:       'https://www.leroymerlin.fr/lame',
  };

  test('produit valide → true', () =>
    expect(validerProduit(produitValide)).toBe(true));

  test('nom trop court → false', () =>
    expect(validerProduit({ ...produitValide, nom: 'AB' })).toBe(false));

  test('prix = 0 → false', () =>
    expect(validerProduit({ ...produitValide, prix: 0 })).toBe(false));

  test('catégorie null → false', () =>
    expect(validerProduit({ ...produitValide, categorie: null })).toBe(false));

  test('URL manquante → false', () =>
    expect(validerProduit({ ...produitValide, url: '' })).toBe(false));

  test('null → false', () =>
    expect(validerProduit(null)).toBe(false));
});

// ═══════════════════════════════════════════════════════════════
// 2. catalogService.js — nettoyerProduit
// ═══════════════════════════════════════════════════════════════

describe('catalogService — nettoyerProduit', () => {
  const base = {
    nom:       'Lame terrasse pin traité 2.4m',
    categorie: 'lame_terrasse',
    longueur:  2400,
    prix:      7.5,
    magasin:   'Leroy Merlin',
    url:       'https://www.leroymerlin.fr/lame-pin',
  };

  test('produit valide passe le nettoyage', () => {
    const r = nettoyerProduit(base);
    expect(r).not.toBeNull();
    expect(r.nom).toBe(base.nom);
    expect(r.prix).toBe(7.50);
  });

  test('prix = 0.3 (< min) → rejeté', () =>
    expect(nettoyerProduit({ ...base, prix: 0.3 })).toBeNull());

  test('prix = 600 (> max) → rejeté', () =>
    expect(nettoyerProduit({ ...base, prix: 600 })).toBeNull());

  test('catégorie invalide → rejeté', () =>
    expect(nettoyerProduit({ ...base, categorie: 'clou' })).toBeNull());

  test('magasin invalide → rejeté', () =>
    expect(nettoyerProduit({ ...base, magasin: 'Amazon' })).toBeNull());

  test('URL sans http → rejeté', () =>
    expect(nettoyerProduit({ ...base, url: 'leroymerlin.fr/lame' })).toBeNull());

  test('longueur absurde (15000) → null dans le résultat', () => {
    const r = nettoyerProduit({ ...base, longueur: 15000 });
    expect(r).not.toBeNull();
    expect(r.longueur).toBeNull();
  });

  test('espaces superflus dans le nom sont nettoyés', () => {
    const r = nettoyerProduit({ ...base, nom: '  Lame   pin   2.4m  ' });
    expect(r.nom).toBe('Lame pin 2.4m');
  });

  test('prix arrondi à 2 décimales', () => {
    const r = nettoyerProduit({ ...base, prix: 7.999 });
    expect(r.prix).toBe(8.00);
  });
});

// ═══════════════════════════════════════════════════════════════
// 3. leroymerlin.js — gestion blocage + extraction HTML
// ═══════════════════════════════════════════════════════════════

describe('leroymerlin — gestion blocage HTTP 403', () => {
  beforeEach(() => jest.clearAllMocks());

  test('HTTP 403 → retourne tableau vide sans exception', async () => {
    mockAxiosBloque(403);
    const { scrapeLeroyMerlin } = require('../backend/scrapers/leroymerlin');
    const result = await scrapeLeroyMerlin();
    expect(result.produits).toEqual([]);
    expect(result.stats.statut).toBe('blocked');
  });

  test('HTTP 429 (rate limit) → retourne tableau vide', async () => {
    mockAxiosBloque(429);
    const { scrapeLeroyMerlin } = require('../backend/scrapers/leroymerlin');
    const result = await scrapeLeroyMerlin();
    expect(result.produits).toEqual([]);
  });

  test('HTML CF challenge → bloqué détecté', async () => {
    const instance = {
      get: jest.fn().mockResolvedValue({
        status: 503,
        data: '<html><title>Just a moment...</title><p>cf-browser-verification</p></html>',
      }),
      interceptors: { request: { use: jest.fn() } },
      defaults: { headers: {} },
    };
    axios.create.mockReturnValue(instance);
    const { scrapeLeroyMerlin } = require('../backend/scrapers/leroymerlin');
    const result = await scrapeLeroyMerlin();
    expect(result.produits).toEqual([]);
    expect(result.stats.statut).toBe('blocked');
  });
});

describe('leroymerlin — extraction JSON-LD', () => {
  beforeEach(() => jest.clearAllMocks());

  test('extrait des produits depuis JSON-LD schema Product', async () => {
    const html = `
      <html><body>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "item": {
                "@type": "Product",
                "name": "Lame terrasse pin traité cl.4 2.4m",
                "url": "https://www.leroymerlin.fr/p/lame-pin-123",
                "offers": { "price": "7.50", "@type": "Offer" }
              }
            }
          ]
        }
        </script>
      </body></html>
    `;
    mockAxiosOK(html);
    const { scrapeLeroyMerlin } = require('../backend/scrapers/leroymerlin');
    const result = await scrapeLeroyMerlin();
    expect(result.produits.length).toBeGreaterThan(0);
    expect(result.produits[0].prix).toBeCloseTo(7.5);
    expect(result.produits[0].categorie).toBe('lame_terrasse');
    expect(result.produits[0].magasin).toBe('Leroy Merlin');
  });
});

// ═══════════════════════════════════════════════════════════════
// 4. castorama.js — extraction CSS
// ═══════════════════════════════════════════════════════════════

describe('castorama — extraction sélecteurs CSS', () => {
  beforeEach(() => jest.clearAllMocks());

  test('extrait des produits depuis les cartes HTML', async () => {
    const html = `
      <html><body>
        <div class="product-card">
          <h2 class="c-product-card__name">Lame terrasse douglas 3m</h2>
          <span class="price__amount">8,90 €</span>
          <a href="/produit/lame-douglas-123">Voir</a>
        </div>
        <div class="product-card">
          <h2 class="c-product-card__name">Lambourde pin 4m traité</h2>
          <span class="price__amount">9,50 €</span>
          <a href="/produit/lambourde-pin-456">Voir</a>
        </div>
      </body></html>
    `;
    mockAxiosOK(html);
    const { scrapeCastorama } = require('../backend/scrapers/castorama');
    const result = await scrapeCastorama();
    expect(result.produits.length).toBeGreaterThanOrEqual(2);
    const lame = result.produits.find(p => p.categorie === 'lame_terrasse');
    expect(lame).toBeDefined();
    expect(lame.prix).toBeCloseTo(8.9);
  });

  test('HTTP 403 → tableau vide sans exception', async () => {
    mockAxiosBloque(403);
    const { scrapeCastorama } = require('../backend/scrapers/castorama');
    const result = await scrapeCastorama();
    expect(result.produits).toEqual([]);
    expect(result.stats.statut).toBe('blocked');
  });
});

// ═══════════════════════════════════════════════════════════════
// 5. bricodepot.js — API JSON + fallback HTML
// ═══════════════════════════════════════════════════════════════

describe('bricodepot — API JSON interne', () => {
  beforeEach(() => jest.clearAllMocks());

  test('extrait des produits depuis la réponse JSON', async () => {
    const jsonResponse = JSON.stringify({
      products: [
        { name: 'Lame terrasse pin 2.4m', price: { value: 5.99 }, url: '/produit/lame-pin' },
        { name: 'Lambourde pin traité 4m', price: { value: 7.90 }, url: '/produit/lambourde' },
      ],
    });
    const instance = {
      get: jest.fn().mockResolvedValue({ status: 200, data: jsonResponse }),
      interceptors: { request: { use: jest.fn() } },
      defaults: { headers: {} },
    };
    axios.create.mockReturnValue(instance);
    const { scrapeBricoDepot } = require('../backend/scrapers/bricodepot');
    const result = await scrapeBricoDepot();
    expect(result.produits.length).toBeGreaterThan(0);
    expect(result.produits[0].magasin).toBe('Brico Dépôt');
  });

  test('HTML fallback si API JSON échoue', async () => {
    const instance = {
      get: jest.fn()
        .mockResolvedValueOnce({ status: 404, data: '{}' }) // API JSON → 404
        .mockResolvedValue({                                  // HTML → OK
          status: 200,
          data: `
            <div class="product-card">
              <h2 class="product-title">Lame terrasse pin 3m</h2>
              <span class="price-value">6,49 €</span>
              <a href="/lame-pin">Voir</a>
            </div>`,
        }),
      interceptors: { request: { use: jest.fn() } },
      defaults: { headers: {} },
    };
    axios.create.mockReturnValue(instance);
    const { scrapeBricoDepot } = require('../backend/scrapers/bricodepot');
    const result = await scrapeBricoDepot();
    // Au moins le HTML fallback est tenté
    expect(result.stats.magasin).toBe('Brico Dépôt');
  });
});

// ═══════════════════════════════════════════════════════════════
// 6. scrapers/index.js — isolation des erreurs
// ═══════════════════════════════════════════════════════════════

describe('scrapers/index — isolation erreurs scrapers', () => {
  beforeEach(() => jest.clearAllMocks());

  test('un scraper qui crash ne propage pas l\'erreur', async () => {
    // Tous bloqués → 0 produits mais pas d'exception
    mockAxiosBloque(403);
    const { lancerTousLesScrapers } = require('../backend/scrapers/index');
    await expect(lancerTousLesScrapers()).resolves.toBeDefined();
  });

  test('retourne toujours stats.total (même à 0)', async () => {
    mockAxiosBloque(403);
    const { lancerTousLesScrapers } = require('../backend/scrapers/index');
    const { stats } = await lancerTousLesScrapers();
    expect(typeof stats.total).toBe('number');
    expect(stats.total).toBeGreaterThanOrEqual(0);
  });

  test('stats contient les 3 magasins', async () => {
    mockAxiosBloque(403);
    const { lancerTousLesScrapers } = require('../backend/scrapers/index');
    const { stats } = await lancerTousLesScrapers();
    expect(stats.par_magasin).toHaveProperty('Leroy Merlin');
    expect(stats.par_magasin).toHaveProperty('Castorama');
    expect(stats.par_magasin).toHaveProperty('Brico Dépôt');
  });
});
