/**
 * tests/api.test.js
 * ─────────────────────────────────────────────────────────────
 * Tests d'intégration — endpoint POST /api/calcul-terrasse.
 * La BDD est mockée : ces tests vérifient le comportement HTTP
 * sans nécessiter de PostgreSQL actif.
 * ─────────────────────────────────────────────────────────────
 */

// ── Mock de la BDD et du service d'optimisation ───────────────
jest.mock('../backend/database/db', () => ({ query: jest.fn() }));
jest.mock('../backend/services/optimisationMateriaux', () => ({
  optimiserMateriaux: jest.fn(),
  simulerPrix: jest.fn(),
}));

const request      = require('supertest');
const express      = require('express');
const routes       = require('../backend/routes/terrasse');
const { optimiserMateriaux, simulerPrix } = require('../backend/services/optimisationMateriaux');

// ── App de test (sans démarrer le vrai serveur) ───────────────
const app = express();
app.use(express.json());
app.use('/api', routes);

// Réponse d'optimisation simulée
const MOCK_OPTIMISATION = {
  materiaux_optimises: [
    { nom: 'Lames de terrasse', categorie: 'lame_terrasse', quantite: 60, unite: 'unité', prix_par_magasin: { 'Leroy Merlin': { prix: 7 }, 'Castorama': { prix: 6.5 }, 'Brico Dépôt': { prix: 6 } } },
    { nom: 'Lambourdes',        categorie: 'lambourde',     quantite: 14, unite: 'unité', prix_par_magasin: { 'Leroy Merlin': { prix: 9 }, 'Castorama': { prix: 8.5 }, 'Brico Dépôt': { prix: 8 } } },
    { nom: 'Vis inox',          categorie: 'vis',           quantite: 2,  unite: 'boite', prix_par_magasin: { 'Leroy Merlin': { prix: 14 }, 'Castorama': { prix: 13 }, 'Brico Dépôt': { prix: 12 } } },
  ],
  comparateur_prix: {
    totaux:            { 'Leroy Merlin': 620, 'Castorama': 590, 'Brico Dépôt': 560 },
    meilleur_prix:     'Brico Dépôt',
    economie_possible: 60,
  },
};

// ── Avant chaque test : reset les mocks ───────────────────────
beforeEach(() => {
  jest.clearAllMocks();
  optimiserMateriaux.mockResolvedValue(MOCK_OPTIMISATION);
});

// ── Tests : réponses valides ──────────────────────────────────
describe('POST /api/calcul-terrasse — cas valides', () => {

  test('retourne 200 avec un corps JSON valide', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('retourne les données du projet', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    const { projet } = res.body;
    expect(projet.surface_m2).toBe(20);
    expect(projet.largeur).toBe(4);
    expect(projet.longueur).toBe(5);
    expect(projet.type_bois).toBe('pin');
  });

  test('retourne un tableau de matériaux non vide', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    expect(Array.isArray(res.body.materiaux)).toBe(true);
    expect(res.body.materiaux.length).toBeGreaterThan(0);
  });

  test('retourne le comparateur de prix avec les 3 magasins', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    const { comparateur_prix } = res.body;
    expect(comparateur_prix.detail).toHaveProperty('Leroy Merlin');
    expect(comparateur_prix.detail).toHaveProperty('Castorama');
    expect(comparateur_prix.detail).toHaveProperty('Brico Dépôt');
  });

  test('retourne le meilleur prix', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    expect(res.body.comparateur_prix.meilleur).toBe('Brico Dépôt');
  });

  test('retourne les paramètres de calcul', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    expect(res.body.parametres_calcul).toBeDefined();
  });

  test('retourne les données du plan SVG', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    expect(res.body.plan).toBeDefined();
    expect(res.body.plan).toHaveProperty('nb_lambourdes_affichage');
  });

  test('accepte les 3 types de bois', async () => {
    for (const bois of ['pin', 'douglas', 'ipe']) {
      const res = await request(app)
        .post('/api/calcul-terrasse')
        .send({ largeur: 3, longueur: 4, type_bois: bois });
      expect(res.status).toBe(200);
    }
  });

  test('accepte les dimensions décimales', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 3.75, longueur: 5.5, type_bois: 'douglas' });
    expect(res.status).toBe(200);
    expect(res.body.projet.surface_m2).toBeCloseTo(20.625, 2);
  });
});

// ── Tests : validation ────────────────────────────────────────
describe('POST /api/calcul-terrasse — erreurs de validation', () => {

  test('retourne 400 si largeur manquante', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ longueur: 5, type_bois: 'pin' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.erreurs).toBeDefined();
  });

  test('retourne 400 si longueur = 0', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 0, type_bois: 'pin' });
    expect(res.status).toBe(400);
  });

  test('retourne 400 si type_bois invalide', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'bambou' });
    expect(res.status).toBe(400);
  });

  test('retourne 400 si largeur négative', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: -3, longueur: 5, type_bois: 'pin' });
    expect(res.status).toBe(400);
  });

  test('le body erreurs est un tableau', async () => {
    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({});
    expect(Array.isArray(res.body.erreurs)).toBe(true);
    expect(res.body.erreurs.length).toBeGreaterThan(0);
  });
});

// ── Tests : fallback simulation ────────────────────────────────
describe('POST /api/calcul-terrasse — fallback simulation', () => {

  test('utilise simulerPrix si optimiserMateriaux échoue', async () => {
    optimiserMateriaux.mockRejectedValue(new Error('DB down'));
    simulerPrix.mockReturnValue({
      ...MOCK_OPTIMISATION,
      mode: 'simulation',
    });

    const res = await request(app)
      .post('/api/calcul-terrasse')
      .send({ largeur: 4, longueur: 5, type_bois: 'pin' });

    expect(res.status).toBe(200);
    expect(res.body.comparateur_prix.mode).toBe('simulation');
  });
});

// ── Tests : GET /api/health ───────────────────────────────────
describe('GET /api/health', () => {

  test('retourne 200 avec status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
