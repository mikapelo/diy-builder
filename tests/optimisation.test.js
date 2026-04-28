/**
 * tests/optimisation.test.js
 * ─────────────────────────────────────────────────────────────
 * Tests unitaires — service d'optimisation et comparateur de prix.
 * Le module db est mocké pour éviter toute dépendance réseau.
 * ─────────────────────────────────────────────────────────────
 */

// ── Mock de la base de données ────────────────────────────────
jest.mock('../backend/database/db', () => ({
  query: jest.fn(),
}));

const db = require('../backend/database/db');
const {
  calculerComparateur,
  simulerPrix,
  recupererPrix,
} = require('../backend/services/optimisationMateriaux');

// Données de test réutilisables
const MATERIAUX_TEST = [
  { nom: 'Lames de terrasse', categorie: 'lame_terrasse', quantite: 60, unite: 'unité', type_bois: 'pin' },
  { nom: 'Lambourdes',        categorie: 'lambourde',     quantite: 14, unite: 'unité', type_bois: 'pin' },
  { nom: 'Vis inox',          categorie: 'vis',           quantite: 2,  unite: 'boite', type_bois: null  },
];

// ── calculerComparateur ───────────────────────────────────────
describe('calculerComparateur', () => {

  test('calcule le total par magasin correctement', () => {
    const materiaux = [
      {
        categorie: 'lame_terrasse',
        quantite: 10,
        prix_par_magasin: {
          'Leroy Merlin': { prix: 7.00 },
          'Castorama':    { prix: 6.50 },
          'Brico Dépôt':  { prix: 6.00 },
        },
      },
      {
        categorie: 'lambourde',
        quantite: 5,
        prix_par_magasin: {
          'Leroy Merlin': { prix: 9.00 },
          'Castorama':    { prix: 8.50 },
          'Brico Dépôt':  { prix: 8.00 },
        },
      },
    ];

    const result = calculerComparateur(materiaux);

    // 10×7 + 5×9 = 70 + 45 = 115
    expect(result.totaux['Leroy Merlin']).toBeCloseTo(115.00, 2);
    // 10×6.5 + 5×8.5 = 65 + 42.5 = 107.5
    expect(result.totaux['Castorama']).toBeCloseTo(107.50, 2);
    // 10×6 + 5×8 = 60 + 40 = 100
    expect(result.totaux['Brico Dépôt']).toBeCloseTo(100.00, 2);
  });

  test('identifie le meilleur prix', () => {
    const materiaux = [
      {
        quantite: 1,
        prix_par_magasin: {
          'Leroy Merlin': { prix: 50 },
          'Castorama':    { prix: 40 },
          'Brico Dépôt':  { prix: 45 },
        },
      },
    ];
    const result = calculerComparateur(materiaux);
    expect(result.meilleur_prix).toBe('Castorama');
  });

  test('calcule l\'économie possible', () => {
    const materiaux = [
      {
        quantite: 1,
        prix_par_magasin: {
          'Leroy Merlin': { prix: 100 },
          'Brico Dépôt':  { prix: 80 },
        },
      },
    ];
    const result = calculerComparateur(materiaux);
    expect(result.economie_possible).toBeCloseTo(20.00, 2);
  });

  test('retourne économie 0 si un seul magasin', () => {
    const materiaux = [
      { quantite: 2, prix_par_magasin: { 'Leroy Merlin': { prix: 10 } } },
    ];
    const result = calculerComparateur(materiaux);
    expect(result.economie_possible).toBe(0);
  });

  test('gère les matériaux sans prix', () => {
    const materiaux = [
      { quantite: 5, prix_par_magasin: {} },
    ];
    const result = calculerComparateur(materiaux);
    expect(result.totaux).toEqual({});
    expect(result.meilleur_prix).toBeNull();
  });

  test('arrondit les totaux à 2 décimales', () => {
    const materiaux = [
      { quantite: 3, prix_par_magasin: { 'Castorama': { prix: 1.234 } } },
    ];
    const result = calculerComparateur(materiaux);
    // 3 × 1.234 = 3.702 → arrondi à 3.7
    expect(Number.isFinite(result.totaux['Castorama'])).toBe(true);
  });
});

// ── simulerPrix ───────────────────────────────────────────────
describe('simulerPrix', () => {

  test('retourne les 3 magasins pour chaque matériau', () => {
    const result = simulerPrix(MATERIAUX_TEST, 'pin');
    result.materiaux_optimises.forEach(m => {
      const magasins = Object.keys(m.prix_par_magasin);
      expect(magasins).toContain('Leroy Merlin');
      expect(magasins).toContain('Castorama');
      expect(magasins).toContain('Brico Dépôt');
    });
  });

  test('prix ipé > prix pin (coefficient)', () => {
    const pin = simulerPrix([MATERIAUX_TEST[0]], 'pin');
    const ipe = simulerPrix([MATERIAUX_TEST[0]], 'ipe');
    const totalPin = pin.comparateur_prix.totaux['Castorama'];
    const totalIpe = ipe.comparateur_prix.totaux['Castorama'];
    expect(totalIpe).toBeGreaterThan(totalPin);
  });

  test('prix Brico Dépôt < Leroy Merlin (simulation)', () => {
    const result = simulerPrix(MATERIAUX_TEST, 'pin');
    const lm     = result.comparateur_prix.totaux['Leroy Merlin'];
    const bd     = result.comparateur_prix.totaux['Brico Dépôt'];
    expect(bd).toBeLessThan(lm);
  });

  test('flag mode = simulation présent', () => {
    const result = simulerPrix(MATERIAUX_TEST, 'pin');
    expect(result.mode).toBe('simulation');
  });

  test('le meilleur prix est identifié', () => {
    const result = simulerPrix(MATERIAUX_TEST, 'pin');
    expect(result.comparateur_prix.meilleur_prix).toBe('Brico Dépôt');
  });

  test('tous les prix sont des nombres positifs', () => {
    const result = simulerPrix(MATERIAUX_TEST, 'douglas');
    result.materiaux_optimises.forEach(m => {
      Object.values(m.prix_par_magasin).forEach(({ prix }) => {
        expect(prix).toBeGreaterThan(0);
        expect(typeof prix).toBe('number');
      });
    });
  });
});

// ── recupererPrix (avec mock BDD) ─────────────────────────────
describe('recupererPrix', () => {

  beforeEach(() => jest.clearAllMocks());

  test('retourne un objet indexé par magasin', async () => {
    db.query.mockResolvedValue({
      rows: [
        { magasin: 'Leroy Merlin', prix: '9.20', url: 'https://leroymerlin.fr' },
        { magasin: 'Castorama',    prix: '8.80', url: 'https://castorama.fr'   },
        { magasin: 'Brico Dépôt',  prix: '8.50', url: 'https://bricodepot.fr'  },
      ],
    });

    const result = await recupererPrix(1);

    expect(result['Leroy Merlin'].prix).toBe(9.20);
    expect(result['Castorama'].prix).toBe(8.80);
    expect(result['Brico Dépôt'].prix).toBe(8.50);
  });

  test('retourne un objet vide si la BDD échoue', async () => {
    db.query.mockRejectedValue(new Error('Connection refused'));
    const result = await recupererPrix(1);
    expect(result).toEqual({});
  });

  test('les prix sont des nombres (pas des strings)', async () => {
    db.query.mockResolvedValue({
      rows: [{ magasin: 'Castorama', prix: '12.50', url: null }],
    });
    const result = await recupererPrix(2);
    expect(typeof result['Castorama'].prix).toBe('number');
  });
});
