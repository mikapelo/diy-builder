/**
 * tests/terrasse.test.js
 * ─────────────────────────────────────────────────────────────
 * Tests unitaires — moteur de calcul terrasse.
 * Ces tests sont purement fonctionnels (zéro réseau/BDD).
 * ─────────────────────────────────────────────────────────────
 */

const {
  calculerTerrasse,
  CONSTANTES,
} = require('../backend/calculations/terrasse');

const { ENTRAXE_LAMBOURDES, LARGEUR_LAME, LONGUEUR_LAME_STD, VIS_PAR_BOITE, MARGE_SECURITE } = CONSTANTES;

// ── Helpers ───────────────────────────────────────────────────
const avecMarge = (n) => Math.ceil(n * (1 + MARGE_SECURITE));

// ── Cas nominaux ──────────────────────────────────────────────
describe('calculerTerrasse — cas nominaux', () => {

  test('terrasse 4×5 m en pin', () => {
    const r = calculerTerrasse(4, 5, 'pin');

    expect(r.surface_terrasse).toBe(20);
    expect(r.type_bois).toBe('pin');
    expect(r.largeur).toBe(4);
    expect(r.longueur).toBe(5);
  });

  test('surface_terrasse = largeur × longueur', () => {
    const r = calculerTerrasse(3.5, 6, 'douglas');
    expect(r.surface_terrasse).toBeCloseTo(21, 1);
  });

  test('nb_lames basé sur surface réelle', () => {
    const r = calculerTerrasse(4, 5, 'pin');
    const surface_lame = LARGEUR_LAME * LONGUEUR_LAME_STD;
    const attendu      = avecMarge(Math.ceil(20 / surface_lame));
    expect(r.nb_lames).toBe(attendu);
  });

  test('nb_lambourdes = ceil(largeur / entraxe) + 1 + marge', () => {
    const r       = calculerTerrasse(4, 5, 'pin');
    const attendu = avecMarge(Math.ceil(4 / ENTRAXE_LAMBOURDES) + 1);
    expect(r.nb_lambourdes).toBe(attendu);
  });

  test('nb_boites_vis = ceil(nb_vis / VIS_PAR_BOITE) + marge', () => {
    const r            = calculerTerrasse(4, 5, 'pin');
    const surface_lame = LARGEUR_LAME * LONGUEUR_LAME_STD;
    const lames_base   = Math.ceil(20 / surface_lame);
    const lamb_base    = Math.ceil(4 / ENTRAXE_LAMBOURDES) + 1;
    const vis_base     = lamb_base * lames_base * 2;
    const boites_base  = Math.ceil(vis_base / VIS_PAR_BOITE);
    expect(r.nb_boites_vis).toBe(avecMarge(boites_base));
  });

  test('les quantités avec marge sont supérieures aux quantités brutes', () => {
    const r = calculerTerrasse(5, 8, 'ipe');
    expect(r.nb_lames).toBeGreaterThanOrEqual(r._base.nb_lames);
    expect(r.nb_lambourdes).toBeGreaterThanOrEqual(r._base.nb_lambourdes);
    expect(r.nb_boites_vis).toBeGreaterThanOrEqual(r._base.nb_boites_vis);
  });

  test('les 3 catégories de matériaux sont présentes', () => {
    const r          = calculerTerrasse(4, 5, 'pin');
    const categories = r.materiaux.map(m => m.categorie);
    expect(categories).toContain('lame_terrasse');
    expect(categories).toContain('lambourde');
    expect(categories).toContain('vis');
  });

  test('les paramètres de calcul sont exposés', () => {
    const r = calculerTerrasse(4, 5, 'pin');
    expect(r.parametres).toHaveProperty('entraxe_lambourdes');
    expect(r.parametres).toHaveProperty('marge_securite');
  });

  test('les données de plan SVG sont présentes', () => {
    const r = calculerTerrasse(4, 5, 'pin');
    expect(r.plan).toHaveProperty('nb_lambourdes_affichage');
    expect(r.plan).toHaveProperty('entraxe');
  });
});

// ── Types de bois ─────────────────────────────────────────────
describe('calculerTerrasse — types de bois', () => {
  ['pin', 'douglas', 'ipe'].forEach(bois => {
    test(`accepte le type "${bois}"`, () => {
      expect(() => calculerTerrasse(4, 5, bois)).not.toThrow();
    });
  });

  test('insensible à la casse', () => {
    expect(() => calculerTerrasse(4, 5, 'PIN')).not.toThrow();
    expect(() => calculerTerrasse(4, 5, 'Douglas')).not.toThrow();
  });

  test('insensible aux espaces', () => {
    expect(() => calculerTerrasse(4, 5, '  ipe  ')).not.toThrow();
  });
});

// ── Gestion des erreurs ───────────────────────────────────────
describe('calculerTerrasse — validation', () => {

  test('rejette largeur nulle', () => {
    expect(() => calculerTerrasse(0, 5, 'pin')).toThrow();
  });

  test('rejette largeur négative', () => {
    expect(() => calculerTerrasse(-2, 5, 'pin')).toThrow();
  });

  test('rejette largeur absente', () => {
    expect(() => calculerTerrasse(undefined, 5, 'pin')).toThrow();
  });

  test('rejette longueur nulle', () => {
    expect(() => calculerTerrasse(4, 0, 'pin')).toThrow();
  });

  test('rejette type_bois invalide', () => {
    expect(() => calculerTerrasse(4, 5, 'chene')).toThrow(/type_bois/);
  });

  test('rejette type_bois absent', () => {
    expect(() => calculerTerrasse(4, 5, '')).toThrow();
  });

  test('rejette largeur > 100 m', () => {
    expect(() => calculerTerrasse(101, 5, 'pin')).toThrow();
  });

  test('rejette longueur > 100 m', () => {
    expect(() => calculerTerrasse(4, 101, 'pin')).toThrow();
  });
});

// ── Valeurs limites ───────────────────────────────────────────
describe('calculerTerrasse — valeurs limites', () => {

  test('terrasse minimale (0.5 × 0.5 m)', () => {
    const r = calculerTerrasse(0.5, 0.5, 'pin');
    expect(r.nb_lames).toBeGreaterThanOrEqual(1);
    expect(r.nb_lambourdes).toBeGreaterThanOrEqual(1);
    expect(r.nb_boites_vis).toBeGreaterThanOrEqual(1);
  });

  test('terrasse maximale (100 × 100 m)', () => {
    const r = calculerTerrasse(100, 100, 'pin');
    expect(r.surface_terrasse).toBe(10000);
    expect(r.nb_lames).toBeGreaterThan(100);
  });

  test('surface retournée est positive', () => {
    const r = calculerTerrasse(3, 7, 'douglas');
    expect(r.surface_terrasse).toBeGreaterThan(0);
  });
});
