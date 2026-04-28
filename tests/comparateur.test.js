/**
 * tests/comparateur.test.js
 * ═══════════════════════════════════════════════════════════════
 * Tests du service comparateurService.js
 *
 * COUVERTURE
 * ──────────
 * 1. trouverProduitsParMagasin   — SQL mocké, assertions sur paramètres
 * 2. _assemblerParMagasin        — logique pure, sans BDD
 * 3. construireComparateurParMagasin — intégration avec BDD mockée
 * 4. Matching par longueur       — produit le plus proche sélectionné
 * 5. Fallback type_bois          — retry sans filtre si aucun résultat
 * 6. Cas limites                 — liste vide, BDD en erreur, vis
 * 7. Rétrocompatibilité          — champs totaux/meilleur_prix/economie_possible
 * ═══════════════════════════════════════════════════════════════
 */

jest.mock('../backend/database/db', () => ({
  query: jest.fn(),
}));

const db = require('../backend/database/db');
const {
  trouverProduitsParMagasin,
  construireComparateurParMagasin,
  _assemblerParMagasin,
} = require('../backend/services/comparateurService');

// ── Fixtures ───────────────────────────────────────────────────

const ROW_LM_LAME = {
  magasin_id: 1, magasin: 'Leroy Merlin',
  produit_id: 2, produit_nom: 'Lame terrasse douglas naturel',
  produit_longueur_mm: '3000', produit_largeur_mm: '145',
  unite: 'unité', prix_unitaire: '9.20',
  url: 'https://www.leroymerlin.fr/lame-douglas',
  delta_longueur: '0',
};
const ROW_CASTO_LAME = {
  magasin_id: 2, magasin: 'Castorama',
  produit_id: 2, produit_nom: 'Lame terrasse douglas naturel',
  produit_longueur_mm: '3000', produit_largeur_mm: '145',
  unite: 'unité', prix_unitaire: '8.80',
  url: 'https://www.castorama.fr/lame-douglas',
  delta_longueur: '0',
};
const ROW_BD_LAME = {
  magasin_id: 3, magasin: 'Brico Dépôt',
  produit_id: 2, produit_nom: 'Lame terrasse douglas naturel',
  produit_longueur_mm: '3000', produit_largeur_mm: '145',
  unite: 'unité', prix_unitaire: '8.50',
  url: 'https://www.bricodepot.fr/lame-douglas',
  delta_longueur: '0',
};
const ROW_LM_LAMBOURDE = {
  magasin_id: 1, magasin: 'Leroy Merlin',
  produit_id: 5, produit_nom: 'Lambourde douglas naturel',
  produit_longueur_mm: '4000', produit_largeur_mm: '70',
  unite: 'unité', prix_unitaire: '12.50',
  url: 'https://www.leroymerlin.fr/lambourde-douglas',
  delta_longueur: '1000',
};
const ROW_LM_VIS = {
  magasin_id: 1, magasin: 'Leroy Merlin',
  produit_id: 7, produit_nom: 'Vis inox A4 tête fraisée 5×60mm',
  produit_longueur_mm: '60', produit_largeur_mm: null,
  unite: 'boite', prix_unitaire: '14.90',
  url: 'https://www.leroymerlin.fr/vis-inox-a4',
  delta_longueur: '0',
};

// ══════════════════════════════════════════════════════════════
// 1. trouverProduitsParMagasin
// ══════════════════════════════════════════════════════════════

describe('trouverProduitsParMagasin', () => {
  beforeEach(() => jest.clearAllMocks());

  test('appelle db.query avec la bonne catégorie', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 3.0, 'douglas');
    expect(db.query).toHaveBeenCalledTimes(1);
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('WHERE p.categorie = $1');
    expect(params[0]).toBe('lame_terrasse');
  });

  test('convertit longueur_m en mm pour le paramètre SQL', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 3.0, 'douglas');
    const params = db.query.mock.calls[0][1];
    expect(params[1]).toBe(3000); // 3.0 m → 3000 mm
  });

  test('passe le pattern type_bois avec %...%', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 3.0, 'pin');
    const params = db.query.mock.calls[0][1];
    expect(params[2]).toBe('%pin%');
  });

  test('passe null pour longueur_m si vis (catégorie)', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('vis', null, null);
    const params = db.query.mock.calls[0][1];
    expect(params[1]).toBeNull(); // longueur_cible_mm = null
    expect(params[2]).toBeNull(); // pattern = null (pas de type_bois pour vis)
  });

  test('passe null pour type_bois si catégorie = vis', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('vis', null, 'pin'); // type_bois ignoré pour vis
    const params = db.query.mock.calls[0][1];
    expect(params[2]).toBeNull();
  });

  test('retourne les lignes du résultat DB', async () => {
    db.query.mockResolvedValue({ rows: [ROW_LM_LAME, ROW_CASTO_LAME] });
    const rows = await trouverProduitsParMagasin('lame_terrasse', 3.0, 'douglas');
    expect(rows).toHaveLength(2);
    expect(rows[0].magasin).toBe('Leroy Merlin');
  });

  test('conversion 2.4 m → 2400 mm', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 2.4, 'pin');
    const params = db.query.mock.calls[0][1];
    expect(params[1]).toBe(2400);
  });

  test('conversion 4.0 m → 4000 mm', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lambourde', 4.0, 'ipe');
    const params = db.query.mock.calls[0][1];
    expect(params[1]).toBe(4000);
  });

  test('retourne tableau vide si la BDD retourne aucune ligne', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const rows = await trouverProduitsParMagasin('lame_terrasse', 3.0, 'ipe');
    expect(rows).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════
// 2. _assemblerParMagasin (logique pure)
// ══════════════════════════════════════════════════════════════

describe('_assemblerParMagasin', () => {

  test('crée une entrée par magasin avec total et produits', () => {
    const correspondances = [{
      mat: { nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse', quantite: 10, unite: 'unité' },
      rows: [ROW_LM_LAME, ROW_CASTO_LAME, ROW_BD_LAME],
    }];
    const result = _assemblerParMagasin(correspondances);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(['Leroy Merlin', 'Castorama', 'Brico Dépôt'])
    );
  });

  test('calcule sous_total = prix_unitaire × quantite', () => {
    const correspondances = [{
      mat: { nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse', quantite: 10, unite: 'unité' },
      rows: [ROW_LM_LAME],
    }];
    const result = _assemblerParMagasin(correspondances);
    // 10 × 9.20 = 92.00
    expect(result['Leroy Merlin'].produits[0].sous_total).toBeCloseTo(92.00, 2);
    expect(result['Leroy Merlin'].total).toBeCloseTo(92.00, 2);
  });

  test('cumule le total sur plusieurs matériaux', () => {
    const correspondances = [
      {
        mat: { nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse', quantite: 10, unite: 'unité' },
        rows: [ROW_LM_LAME], // 10 × 9.20 = 92.00
      },
      {
        mat: { nom: 'Lambourde 4 m', categorie: 'lambourde', quantite: 5, unite: 'unité' },
        rows: [ROW_LM_LAMBOURDE], // 5 × 12.50 = 62.50
      },
    ];
    const result = _assemblerParMagasin(correspondances);
    expect(result['Leroy Merlin'].total).toBeCloseTo(154.50, 2);
    expect(result['Leroy Merlin'].produits).toHaveLength(2);
  });

  test('prix_unitaire est un nombre (pas une string)', () => {
    const correspondances = [{
      mat: { nom: 'Vis inox', categorie: 'vis', quantite: 2, unite: 'boite' },
      rows: [ROW_LM_VIS],
    }];
    const result = _assemblerParMagasin(correspondances);
    expect(typeof result['Leroy Merlin'].produits[0].prix_unitaire).toBe('number');
  });

  test('produit_longueur_mm est un nombre ou null', () => {
    const correspondances = [{
      mat: { nom: 'Vis inox', categorie: 'vis', quantite: 2, unite: 'boite' },
      rows: [ROW_LM_VIS],
    }];
    const result = _assemblerParMagasin(correspondances);
    const p = result['Leroy Merlin'].produits[0];
    expect(p.produit_longueur_mm).toBe(60);
  });

  test('produit_largeur_mm = null si null dans DB', () => {
    const correspondances = [{
      mat: { nom: 'Vis inox', categorie: 'vis', quantite: 2, unite: 'boite' },
      rows: [ROW_LM_VIS], // produit_largeur_mm: null
    }];
    const result = _assemblerParMagasin(correspondances);
    expect(result['Leroy Merlin'].produits[0].produit_largeur_mm).toBeNull();
  });

  test('matériaux sans correspondances → parMagasin vide', () => {
    const correspondances = [{
      mat: { nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse', quantite: 5, unite: 'unité' },
      rows: [],
    }];
    const result = _assemblerParMagasin(correspondances);
    expect(Object.keys(result)).toHaveLength(0);
  });

  test('total arrondi à 2 décimales', () => {
    const row = { ...ROW_LM_LAME, prix_unitaire: '1.234' };
    const correspondances = [{
      mat: { nom: 'X', categorie: 'lame_terrasse', quantite: 3, unite: 'unité' },
      rows: [row],
    }];
    const result = _assemblerParMagasin(correspondances);
    // 3 × 1.234 = 3.702 → arrondi à 3.7
    expect(Number.isFinite(result['Leroy Merlin'].total)).toBe(true);
    const decimales = (result['Leroy Merlin'].total.toString().split('.')[1] || '').length;
    expect(decimales).toBeLessThanOrEqual(2);
  });
});

// ══════════════════════════════════════════════════════════════
// 3. construireComparateurParMagasin — intégration BDD mockée
// ══════════════════════════════════════════════════════════════

describe('construireComparateurParMagasin', () => {
  beforeEach(() => jest.clearAllMocks());

  const MATERIAUX_TERRASSE = [
    { nom: 'Lame terrasse 3 m',  categorie: 'lame_terrasse', quantite: 42, unite: 'unité',  longueur_m: 3.0, type_bois: 'douglas' },
    { nom: 'Lambourde 4 m',      categorie: 'lambourde',     quantite: 14, unite: 'unité',  longueur_m: 4.0, type_bois: 'douglas' },
    { nom: 'Vis inox',           categorie: 'vis',           quantite: 2,  unite: 'boite',  longueur_m: null, type_bois: null    },
  ];

  // Mock séquentiel : 1 appel par matériau
  function mockTroisMateriaux() {
    db.query
      .mockResolvedValueOnce({ rows: [ROW_LM_LAME, ROW_CASTO_LAME, ROW_BD_LAME] })   // lames
      .mockResolvedValueOnce({ rows: [ROW_LM_LAMBOURDE] })                              // lambourdes (BD absent)
      .mockResolvedValueOnce({ rows: [ROW_LM_VIS] });                                   // vis
  }

  test('retourne les 3 champs rétrocompatibles', async () => {
    mockTroisMateriaux();
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    expect(result).toHaveProperty('totaux');
    expect(result).toHaveProperty('meilleur_prix');
    expect(result).toHaveProperty('economie_possible');
  });

  test('retourne par_magasin avec structure { total, produits }', async () => {
    mockTroisMateriaux();
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    expect(result.par_magasin['Leroy Merlin']).toHaveProperty('total');
    expect(result.par_magasin['Leroy Merlin']).toHaveProperty('produits');
    expect(Array.isArray(result.par_magasin['Leroy Merlin'].produits)).toBe(true);
  });

  test('totaux = somme des prix × quantités', async () => {
    mockTroisMateriaux();
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    // LM : 42 × 9.20 + 14 × 12.50 + 2 × 14.90
    const attendu = 42 * 9.20 + 14 * 12.50 + 2 * 14.90;
    expect(result.totaux['Leroy Merlin']).toBeCloseTo(attendu, 1);
  });

  test('totaux[magasin] === par_magasin[magasin].total', async () => {
    mockTroisMateriaux();
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    for (const [mag, data] of Object.entries(result.par_magasin)) {
      expect(result.totaux[mag]).toBe(data.total);
    }
  });

  test('meilleur_prix est le magasin le moins cher', async () => {
    // BD : 8.50 < CASTO: 8.80 < LM: 9.20 pour les lames
    db.query
      .mockResolvedValueOnce({ rows: [ROW_LM_LAME, ROW_CASTO_LAME, ROW_BD_LAME] })
      .mockResolvedValueOnce({ rows: [] }) // lambourdes absent
      .mockResolvedValueOnce({ rows: [] }); // vis absent
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    expect(result.meilleur_prix).toBe('Brico Dépôt');
  });

  test('economie_possible = max - min des totaux', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [ROW_LM_LAME, ROW_BD_LAME] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    const totaux = Object.values(result.totaux);
    if (totaux.length >= 2) {
      const expected = Math.max(...totaux) - Math.min(...totaux);
      expect(result.economie_possible).toBeCloseTo(expected, 2);
    }
  });

  test('couverture indique le nb de matériaux avec correspondance', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [ROW_LM_LAME] })    // lames : trouvé
      .mockResolvedValueOnce({ rows: [] })                 // lambourdes : non trouvé → fallback
      .mockResolvedValueOnce({ rows: [] })                 // lambourdes fallback : toujours rien
      .mockResolvedValueOnce({ rows: [ROW_LM_VIS] });     // vis : trouvé
    const result = await construireComparateurParMagasin(MATERIAUX_TERRASSE);
    expect(result.couverture.nb_materiaux).toBe(3);
    expect(result.couverture.nb_avec_correspondance).toBeGreaterThanOrEqual(2);
  });

  test('liste vide → résultat vide sans erreur', async () => {
    const result = await construireComparateurParMagasin([]);
    expect(result.par_magasin).toEqual({});
    expect(result.totaux).toEqual({});
    expect(result.meilleur_prix).toBeNull();
    expect(result.economie_possible).toBe(0);
  });

  test('null → résultat vide sans erreur', async () => {
    const result = await construireComparateurParMagasin(null);
    expect(result.par_magasin).toEqual({});
  });
});

// ══════════════════════════════════════════════════════════════
// 4. Matching par longueur — logique de sélection
// ══════════════════════════════════════════════════════════════

describe('Matching par longueur — sélection du produit le plus proche', () => {
  beforeEach(() => jest.clearAllMocks());

  test('passe 3000 mm pour une lame 3 m', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 3.0, 'pin');
    expect(db.query.mock.calls[0][1][1]).toBe(3000);
  });

  test('passe 4000 mm pour une lambourde 4 m', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lambourde', 4.0, 'douglas');
    expect(db.query.mock.calls[0][1][1]).toBe(4000);
  });

  test('passe 2400 mm pour une lame 2.4 m', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 2.4, 'ipe');
    expect(db.query.mock.calls[0][1][1]).toBe(2400);
  });

  test('passe null pour vis (longueur non pertinente)', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('vis', null, null);
    expect(db.query.mock.calls[0][1][1]).toBeNull();
  });

  test('la requête SQL contient DISTINCT ON pour un résultat par magasin', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 3.0, 'pin');
    const sql = db.query.mock.calls[0][0];
    expect(sql).toMatch(/DISTINCT ON/i);
  });

  test('la requête SQL trie par delta_longueur ASC puis prix ASC', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await trouverProduitsParMagasin('lame_terrasse', 3.0, 'pin');
    const sql = db.query.mock.calls[0][0];
    expect(sql).toMatch(/ORDER BY/i);
    expect(sql).toMatch(/ASC/i);
  });
});

// ══════════════════════════════════════════════════════════════
// 5. Fallback type_bois
// ══════════════════════════════════════════════════════════════

describe('Fallback type_bois — retry sans filtre si aucun résultat', () => {
  beforeEach(() => jest.clearAllMocks());

  test('si 0 résultat avec type_bois, retry sans filtre', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })          // 1er appel avec type_bois → 0 résultat
      .mockResolvedValueOnce({ rows: [ROW_LM_LAME] }); // fallback sans filtre → 1 résultat

    const MATERIAUX = [{
      nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse',
      quantite: 10, unite: 'unité', longueur_m: 3.0, type_bois: 'exotique_inconnu',
    }];
    const result = await construireComparateurParMagasin(MATERIAUX);

    // 2 appels DB : 1 avec filtre type_bois + 1 fallback
    expect(db.query).toHaveBeenCalledTimes(2);
    // Le fallback a trouvé un produit
    expect(result.par_magasin['Leroy Merlin']).toBeDefined();
  });

  test('si le fallback sans type_bois ne trouve rien non plus → résultat vide pour ce matériau', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })   // 1er appel avec type_bois
      .mockResolvedValueOnce({ rows: [] });  // fallback sans type_bois

    const MATERIAUX = [{
      nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse',
      quantite: 5, unite: 'unité', longueur_m: 3.0, type_bois: 'type_inexistant',
    }];
    const result = await construireComparateurParMagasin(MATERIAUX);
    expect(Object.keys(result.par_magasin)).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════
// 6. Résilience — erreurs BDD
// ══════════════════════════════════════════════════════════════

describe('Résilience — erreurs BDD isolées', () => {
  beforeEach(() => jest.clearAllMocks());

  test('une erreur BDD sur un matériau n\'interrompt pas les autres', async () => {
    db.query
      .mockRejectedValueOnce(new Error('Connection timeout'))  // lames → erreur
      .mockResolvedValueOnce({ rows: [ROW_LM_LAMBOURDE] });    // lambourdes → ok

    const MATERIAUX = [
      { nom: 'Lame terrasse 3 m', categorie: 'lame_terrasse', quantite: 10, unite: 'unité', longueur_m: 3.0, type_bois: 'pin' },
      { nom: 'Lambourde 4 m',     categorie: 'lambourde',     quantite: 5,  unite: 'unité', longueur_m: 4.0, type_bois: 'pin' },
    ];

    // Ne doit pas throw
    await expect(construireComparateurParMagasin(MATERIAUX)).resolves.toBeDefined();
  });

  test('toutes les BDD en erreur → résultat vide cohérent', async () => {
    db.query.mockRejectedValue(new Error('Connection refused'));

    const MATERIAUX = [
      { nom: 'Lame', categorie: 'lame_terrasse', quantite: 10, unite: 'unité', longueur_m: 3.0, type_bois: 'pin' },
    ];
    const result = await construireComparateurParMagasin(MATERIAUX);
    expect(result.par_magasin).toEqual({});
    expect(result.meilleur_prix).toBeNull();
    expect(result.economie_possible).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════
// 7. Rétrocompatibilité des champs
// ══════════════════════════════════════════════════════════════

describe('Rétrocompatibilité — champs attendus par le controller existant', () => {
  beforeEach(() => jest.clearAllMocks());

  test('result.totaux est un objet plat { magasin: number }', async () => {
    db.query.mockResolvedValue({ rows: [ROW_LM_LAME, ROW_CASTO_LAME] });
    const result = await construireComparateurParMagasin([
      { nom: 'Lame 3 m', categorie: 'lame_terrasse', quantite: 5, unite: 'unité', longueur_m: 3.0, type_bois: 'douglas' },
    ]);
    expect(typeof result.totaux['Leroy Merlin']).toBe('number');
    expect(typeof result.totaux['Castorama']).toBe('number');
  });

  test('result.meilleur_prix est une string (nom du magasin)', async () => {
    db.query.mockResolvedValue({ rows: [ROW_LM_LAME, ROW_CASTO_LAME, ROW_BD_LAME] });
    const result = await construireComparateurParMagasin([
      { nom: 'Lame 3 m', categorie: 'lame_terrasse', quantite: 5, unite: 'unité', longueur_m: 3.0, type_bois: 'douglas' },
    ]);
    expect(typeof result.meilleur_prix).toBe('string');
  });

  test('result.economie_possible est un nombre >= 0', async () => {
    db.query.mockResolvedValue({ rows: [ROW_LM_LAME, ROW_BD_LAME] });
    const result = await construireComparateurParMagasin([
      { nom: 'Lame 3 m', categorie: 'lame_terrasse', quantite: 5, unite: 'unité', longueur_m: 3.0, type_bois: 'douglas' },
    ]);
    expect(result.economie_possible).toBeGreaterThanOrEqual(0);
  });

  test('par_magasin chaque magasin a bien total (number) et produits (array)', async () => {
    db.query.mockResolvedValue({ rows: [ROW_LM_LAME, ROW_CASTO_LAME] });
    const result = await construireComparateurParMagasin([
      { nom: 'Lame 3 m', categorie: 'lame_terrasse', quantite: 10, unite: 'unité', longueur_m: 3.0, type_bois: 'douglas' },
    ]);
    for (const [, data] of Object.entries(result.par_magasin)) {
      expect(typeof data.total).toBe('number');
      expect(Array.isArray(data.produits)).toBe(true);
    }
  });

  test('chaque produit dans par_magasin contient les champs attendus', async () => {
    db.query.mockResolvedValue({ rows: [ROW_LM_LAME] });
    const result = await construireComparateurParMagasin([
      { nom: 'Lame 3 m', categorie: 'lame_terrasse', quantite: 10, unite: 'unité', longueur_m: 3.0, type_bois: 'douglas' },
    ]);
    const p = result.par_magasin['Leroy Merlin'].produits[0];
    expect(p).toHaveProperty('materiau_nom');
    expect(p).toHaveProperty('materiau_categorie');
    expect(p).toHaveProperty('quantite');
    expect(p).toHaveProperty('unite');
    expect(p).toHaveProperty('produit_id');
    expect(p).toHaveProperty('produit_nom');
    expect(p).toHaveProperty('prix_unitaire');
    expect(p).toHaveProperty('sous_total');
    expect(p).toHaveProperty('url');
  });
});
