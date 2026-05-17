/**
 * garde-corps-scraper-coverage.test.js
 *
 * Test d'intégrité côté config scraper (PAS de réseau).
 *
 * Vérifie que chaque ID matériau garde-corps déclaré dans materialPrices.js
 * est référencé au moins une fois dans la chaîne du scraper :
 *   - soit comme target dans un des 4 scrapers (scraper/scrapers/*.js)
 *   - soit comme entrée dans scraper/prices-override.json
 *
 * Un target marqué `todo: true` compte comme "déclaré mais en attente d'URL"
 * — il est suivi mais ne sera pas scrappé tant que `url` est null.
 *
 * Objectif : empêcher qu'un nouvel ID materialPrices.js soit oublié dans
 * le pipeline de mise à jour des prix.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRAPER_DIR = join(__dirname, '../../scraper');

const GC_IDS = [
  'poteau_gc_70',
  'lisse_gc_60x40',
  'balustre_gc_40',
  'visserie_inox_a4_gc',
];

const SCRAPER_FILES = [
  'scrapers/leroymerlin.js',
  'scrapers/castorama.js',
  'scrapers/bricodepot.js',
  'scrapers/manomano.js',
];

/**
 * Extrait grossièrement les IDs déclarés dans un fichier scraper en
 * matchant `id: 'xxx'` ou `id: "xxx"`. Suffit pour un test de présence.
 */
function extractTargetIds(src) {
  const ids = new Set();
  const re = /\bid:\s*['"]([a-z0-9_]+)['"]/gi;
  let m;
  while ((m = re.exec(src)) !== null) ids.add(m[1]);
  return ids;
}

/** Détecte si une target est marquée TODO (URL à définir) — heuristique source. */
function isTodoTarget(src, id) {
  // Bloc {...id: 'xxx'...} contenant todo: true
  const re = new RegExp(
    `\\{[^}]*?id:\\s*['"]${id}['"][^}]*?todo:\\s*true[^}]*?\\}`,
    'is',
  );
  return re.test(src);
}

describe('scraper coverage — garde-corps IDs', () => {
  const overrideRaw = readFileSync(join(SCRAPER_DIR, 'prices-override.json'), 'utf8');
  const override = JSON.parse(overrideRaw);
  const overrideIds = new Set(Object.keys(override.prices ?? {}));

  const perScraper = SCRAPER_FILES.map(f => {
    const src = readFileSync(join(SCRAPER_DIR, f), 'utf8');
    return { file: f, src, ids: extractTargetIds(src) };
  });

  for (const id of GC_IDS) {
    it(`${id} est référencé dans au moins un scraper OU prices-override.json`, () => {
      const inOverride = overrideIds.has(id);
      const scrapersWithId = perScraper.filter(s => s.ids.has(id));
      const covered = inOverride || scrapersWithId.length > 0;

      expect(covered, [
        `${id} n'est pas couvert par le pipeline de mise à jour des prix.`,
        `Ajouter une entrée dans prices-override.json ou un target dans un des`,
        `4 scrapers (scraper/scrapers/*.js).`,
      ].join(' ')).toBe(true);
    });

    it(`${id} a une stratégie déclarée (target réel, target TODO, ou override)`, () => {
      const inOverride = overrideIds.has(id);
      const scrapersWithId = perScraper.filter(s => s.ids.has(id));
      const scrapersTodoOnly = scrapersWithId.every(s => isTodoTarget(s.src, id));

      // Au moins une couverture concrète : override OU au moins un scraper avec URL
      if (!inOverride && scrapersTodoOnly) {
        throw new Error(
          `${id} n'est déclaré qu'en TODO dans tous les scrapers et n'a pas ` +
          `d'override manuel. Ajouter au moins une URL réelle ou un override.`,
        );
      }
      expect(true).toBe(true);
    });
  }
});

describe('scraper coverage — 4 enseignes déclarent les 4 IDs garde-corps', () => {
  const perScraper = SCRAPER_FILES.map(f => ({
    file: f,
    ids: extractTargetIds(readFileSync(join(SCRAPER_DIR, f), 'utf8')),
  }));

  for (const { file, ids } of perScraper) {
    it(`${file} déclare les 4 IDs garde-corps (TODO ou réels)`, () => {
      for (const gid of GC_IDS) {
        expect(ids.has(gid), `${gid} manquant dans ${file}`).toBe(true);
      }
    });
  }
});
