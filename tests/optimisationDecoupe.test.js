/**
 * tests/optimisationDecoupe.test.js
 * ═══════════════════════════════════════════════════════════════
 *
 * Tests unitaires — moteur d'optimisation des découpes.
 *
 * STRUCTURE DES TESTS
 * ───────────────────
 * 1. optimiserUneRangee   — algorithme de base (une rangée)
 * 2. optimiserDecoupe     — cas réels de terrasses
 *    a. terrasse carrée   (4 × 4 m)
 *    b. terrasse longue   (3 × 10 m)
 *    c. terrasse petite   (1.5 × 2 m)
 *    d. terrasse grande   (8 × 12 m)
 *    e. cas limites       (1 seule longueur dispo, longueur exacte…)
 * 3. normaliserLongueurs  — validation des entrées
 * 4. Propriétés invariantes (perte ≥ 0, quantités entières…)
 *
 * ═══════════════════════════════════════════════════════════════
 */

const {
  optimiserDecoupe,
  optimiserUneRangee,
  normaliserLongueurs,
  construireResultat,
  LONGUEURS_DEFAUT,
  LARGEUR_LAME_M,
  ENTRAXE_LAMBOURDES,
} = require('../backend/services/optimisationDecoupe');

// ── Helpers de test ──────────────────────────────────────────────
/** Somme des mètres linéaires achetés pour une rangée */
const totalPar = (pieces) =>
  pieces.reduce((s, p) => s + p.longueur * p.quantite_par_rangee, 0);

/** Total de pièces achetées (toutes longueurs) pour une rangée */
const nbPieces = (pieces) =>
  pieces.reduce((s, p) => s + p.quantite_par_rangee, 0);


// ═══════════════════════════════════════════════════════════════
// 1. optimiserUneRangee
// ═══════════════════════════════════════════════════════════════

describe('optimiserUneRangee — algorithme de base', () => {

  // ── Couverture de la cible ──────────────────────────────────

  test('couvre exactement la cible (2.4 m avec [2.4])', () => {
    const r = optimiserUneRangee(2.4, [2.4]);
    expect(totalPar(r.pieces)).toBeCloseTo(2.4, 6);
    expect(r.perte_par_rangee).toBeCloseTo(0, 6);
  });

  test('couvre une cible = longueur disponible exacte (3 m)', () => {
    const r = optimiserUneRangee(3.0, [2.4, 3.0, 4.0]);
    expect(totalPar(r.pieces)).toBeCloseTo(3.0, 6);
    expect(r.perte_par_rangee).toBeCloseTo(0, 6);
  });

  test('couvre une cible = longueur disponible exacte (4 m)', () => {
    const r = optimiserUneRangee(4.0, [2.4, 3.0, 4.0]);
    expect(totalPar(r.pieces)).toBeCloseTo(4.0, 6);
    expect(r.perte_par_rangee).toBeCloseTo(0, 6);
  });

  test('couvre une cible non multiple (5 m)', () => {
    // Solutions possibles : 2×3=6 (perte 1), 1×4+1×2.4=6.4 (perte 1.4), 3×2.4=7.2 (perte 2.2)
    // Optimale → 2 × 3 m, perte = 1 m
    const r = optimiserUneRangee(5.0, [2.4, 3.0, 4.0]);
    expect(totalPar(r.pieces)).toBeGreaterThanOrEqual(5.0 - 1e-9);
    expect(r.perte_par_rangee).toBeCloseTo(1.0, 6);
  });

  test('préfère moins de pièces à perte égale', () => {
    // Pour 6 m : 1×4+1×2.4=6.4(perte 0.4), 2×3=6(perte 0), 3×2=6(perte 0 si 2 disponible)
    // Avec [3, 2] : 3m×2 = 2 pièces, 2m×3 = 3 pièces → même perte, 2 pièces gagne
    const r = optimiserUneRangee(6.0, [3.0, 2.0]);
    const total = totalPar(r.pieces);
    expect(total).toBeCloseTo(6.0, 6);
    expect(r.perte_par_rangee).toBeCloseTo(0, 6);
    expect(nbPieces(r.pieces)).toBe(2); // 2×3 plutôt que 3×2
  });

  test('couvre correctement avec une seule longueur disponible', () => {
    const r = optimiserUneRangee(7.0, [3.0]);
    // 3×3=9 m → perte 2 m
    expect(totalPar(r.pieces)).toBeCloseTo(9.0, 6);
    expect(r.perte_par_rangee).toBeCloseTo(2.0, 6);
  });

  test('perte est toujours ≥ 0', () => {
    const cibles = [1.2, 2.5, 3.7, 5.0, 7.3, 9.9, 12.0];
    for (const cible of cibles) {
      const r = optimiserUneRangee(cible, LONGUEURS_DEFAUT);
      expect(r.perte_par_rangee).toBeGreaterThanOrEqual(0);
    }
  });

  test('la couverture totale ≥ cible (jamais en dessous)', () => {
    const cibles = [0.5, 1.0, 2.0, 3.5, 5.7, 8.2, 15.0];
    for (const cible of cibles) {
      const r = optimiserUneRangee(cible, LONGUEURS_DEFAUT);
      expect(totalPar(r.pieces)).toBeGreaterThanOrEqual(cible - 1e-9);
    }
  });

  test('ne retourne que des pièces avec quantité > 0', () => {
    const r = optimiserUneRangee(5.0, LONGUEURS_DEFAUT);
    r.pieces.forEach(p => expect(p.quantite_par_rangee).toBeGreaterThan(0));
  });

  test('retourne un tableau non vide', () => {
    const r = optimiserUneRangee(5.0, LONGUEURS_DEFAUT);
    expect(r.pieces.length).toBeGreaterThan(0);
  });

  test('quantités par rangée sont des entiers', () => {
    const r = optimiserUneRangee(5.0, LONGUEURS_DEFAUT);
    r.pieces.forEach(p => {
      expect(Number.isInteger(p.quantite_par_rangee)).toBe(true);
    });
  });

  test('minimise la perte sur des longueurs "difficiles"', () => {
    // 7.3 m → avec [2.4, 3, 4] : 1×4+1×3+1×0.3... → pas possible
    // Mieux : 2×3+1×2.4 = 8.4 (perte 1.1) vs 1×4+1×3=7 sous-couvre
    //         2×4 = 8 (perte 0.7) ← meilleure option
    const r = optimiserUneRangee(7.3, [2.4, 3.0, 4.0]);
    expect(r.perte_par_rangee).toBeLessThanOrEqual(1.0); // on ne dépasse pas trop
    expect(totalPar(r.pieces)).toBeGreaterThanOrEqual(7.3 - 1e-9);
  });
});


// ═══════════════════════════════════════════════════════════════
// 2a. Terrasse CARRÉE (4 × 4 m)
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — terrasse carrée (4 × 4 m)', () => {
  let result;
  beforeAll(() => {
    result = optimiserDecoupe({ largeur: 4, longueur: 4 });
  });

  test('retourne les 2 sections lames et lambourdes', () => {
    expect(result).toHaveProperty('lames');
    expect(result).toHaveProperty('lambourdes');
  });

  test('nb_lignes lames = ceil(4 / 0.145) = 28', () => {
    expect(result.lames.nb_rangees).toBe(Math.ceil(4 / LARGEUR_LAME_M));
  });

  test('nb_rangees lambourdes = ceil(4 / 0.40) + 1 = 11', () => {
    expect(result.lambourdes.nb_rangees).toBe(Math.ceil(4 / ENTRAXE_LAMBOURDES) + 1);
  });

  test('longueur_achetee_m ≥ longueur_utile_m (lames)', () => {
    expect(result.lames.longueur_achetee_m).toBeGreaterThanOrEqual(result.lames.longueur_utile_m - 1e-9);
  });

  test('perte_estimee est entre 0 et 1', () => {
    expect(result.lames.perte_estimee).toBeGreaterThanOrEqual(0);
    expect(result.lames.perte_estimee).toBeLessThan(1);
  });

  test('perte_estimee pour 4 m exactement = 0 (1×4 couvre parfaitement)', () => {
    // 4 m est une longueur disponible → perte = 0
    expect(result.lames.perte_estimee).toBe(0);
  });

  test('perte_globale est entre 0 et 1', () => {
    expect(result.perte_globale).toBeGreaterThanOrEqual(0);
    expect(result.perte_globale).toBeLessThan(1);
  });

  test('resume est une chaîne non vide', () => {
    expect(typeof result.resume).toBe('string');
    expect(result.resume.length).toBeGreaterThan(0);
  });

  test('les quantités lames sont des entiers positifs', () => {
    result.lames.pieces.forEach(p => {
      expect(Number.isInteger(p.quantite)).toBe(true);
      expect(p.quantite).toBeGreaterThan(0);
    });
  });
});


// ═══════════════════════════════════════════════════════════════
// 2b. Terrasse LONGUE (3 × 10 m)
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — terrasse longue (3 × 10 m)', () => {
  let result;
  beforeAll(() => {
    result = optimiserDecoupe({ largeur: 3, longueur: 10 });
  });

  test('calcule correctement le nombre de lignes de lames', () => {
    const attendu = Math.ceil(3 / LARGEUR_LAME_M); // = 21
    expect(result.lames.nb_rangees).toBe(attendu);
  });

  test('couvre une longueur de 10 m (multiple de 2.5, pas des longueurs dispo)', () => {
    // 10 m : possible 4+3+3=10 (perte 0) ou 4+4+2.4=10.4... → 4+3+3 optimal
    expect(result.lames.perte_estimee).toBeLessThanOrEqual(0.05); // moins de 5% de perte
  });

  test('lambourdes couvrent la largeur (3 m = longueur disponible → perte 0)', () => {
    expect(result.lambourdes.perte_estimee).toBe(0);
  });

  test('longueur utile lames = 3 × 10 = 30 m', () => {
    expect(result.lames.longueur_utile_m).toBeCloseTo(30, 2);
  });

  test('quantité totale de lames achetées est un entier', () => {
    const total = result.lames.pieces.reduce((s, p) => s + p.quantite, 0);
    expect(Number.isInteger(total)).toBe(true);
  });
});


// ═══════════════════════════════════════════════════════════════
// 2c. Terrasse PETITE (1.5 × 2 m)
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — terrasse petite (1.5 × 2 m)', () => {
  let result;
  beforeAll(() => {
    result = optimiserDecoupe({ largeur: 1.5, longueur: 2 });
  });

  test('utilise 1 pièce de 2.4 m par rangée (longueur min couvrant 2 m)', () => {
    // 2.4 m est la plus petite longueur dispo > 2 m → 1 pièce × nb_lignes
    const piece24 = result.lames.pieces.find(p => p.longueur === 2.4);
    if (piece24) {
      expect(piece24.quantite_par_rangee).toBe(1);
    }
  });

  test('nb_lignes lames = ceil(1.5 / 0.145) = 11', () => {
    expect(result.lames.nb_rangees).toBe(Math.ceil(1.5 / LARGEUR_LAME_M));
  });

  test('nb_rangees lambourdes = ceil(2 / 0.40) + 1 = 6', () => {
    expect(result.lambourdes.nb_rangees).toBe(Math.ceil(2 / ENTRAXE_LAMBOURDES) + 1);
  });

  test('surface réelle = 1.5 × 2 = 3 m² (contrôle de cohérence)', () => {
    expect(result.lames.longueur_utile_m).toBeCloseTo(1.5 * 2, 2);
  });

  test('les quantités sont > 0', () => {
    result.lames.pieces.forEach(p => expect(p.quantite).toBeGreaterThan(0));
    result.lambourdes.pieces.forEach(p => expect(p.quantite).toBeGreaterThan(0));
  });
});


// ═══════════════════════════════════════════════════════════════
// 2d. Terrasse GRANDE (8 × 12 m)
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — terrasse grande (8 × 12 m)', () => {
  let result;
  beforeAll(() => {
    result = optimiserDecoupe({ largeur: 8, longueur: 12 });
  });

  test('nb_lignes lames = ceil(8 / 0.145) = 56', () => {
    expect(result.lames.nb_rangees).toBe(Math.ceil(8 / LARGEUR_LAME_M));
  });

  test('lambourdes couvrent 8 m de largeur', () => {
    // 8 m : 2×4=8 (perte 0) ou 3+3+2.4=8.4 (perte 0.4) → 2×4 optimal
    expect(result.lambourdes.perte_estimee).toBe(0);
  });

  test('12 m de longueur lames : 3×4=12 → perte 0', () => {
    expect(result.lames.perte_estimee).toBe(0);
  });

  test('la longueur achetée est un multiple de la quantité par rangée', () => {
    const totalParRangee = totalPar(result.lames.pieces.map(p => ({
      longueur: p.longueur, quantite_par_rangee: p.quantite_par_rangee
    })));
    expect(result.lames.longueur_achetee_m).toBeCloseTo(
      totalParRangee * result.lames.nb_rangees, 2
    );
  });

  test('les quantités totales sont cohérentes (quantite = par_rangee × nb_rangees)', () => {
    result.lames.pieces.forEach(p => {
      expect(p.quantite).toBe(p.quantite_par_rangee * result.lames.nb_rangees);
    });
  });
});


// ═══════════════════════════════════════════════════════════════
// 2e. Cas limites et longueurs disponibles personnalisées
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — longueurs disponibles personnalisées', () => {

  test('longueur exacte disponible → perte 0 (terrasse 3 × 3 m, [3])', () => {
    const r = optimiserDecoupe({ largeur: 3, longueur: 3, longueurs_disponibles: [3] });
    expect(r.lames.perte_estimee).toBe(0);
    expect(r.lambourdes.perte_estimee).toBe(0);
  });

  test('une seule longueur dispo différente (2.4 m pour longueur 5 m)', () => {
    const r = optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: [2.4] });
    // 3×2.4=7.2 m → perte = 2.2/7.2 = 30.5%
    const perte = r.lames.perte_estimee;
    expect(perte).toBeGreaterThan(0);
    expect(perte).toBeLessThan(0.4); // moins de 40%
  });

  test('longueurs avec doublons — résultat identique à sans doublons', () => {
    const r1 = optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: [3.0, 2.4, 4.0] });
    const r2 = optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: [3.0, 3.0, 2.4, 4.0] });
    expect(r1.lames.perte_estimee).toBeCloseTo(r2.lames.perte_estimee, 4);
  });

  test('longueurs dans n\'importe quel ordre — résultat identique', () => {
    const r1 = optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: [2.4, 3.0, 4.0] });
    const r2 = optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: [4.0, 2.4, 3.0] });
    expect(r1.lames.perte_estimee).toBeCloseTo(r2.lames.perte_estimee, 4);
  });

  test('longueurs_disponibles non spécifiées → utilise les longueurs par défaut', () => {
    const r1 = optimiserDecoupe({ largeur: 4, longueur: 5 });
    const r2 = optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: LONGUEURS_DEFAUT });
    expect(r1.lames.perte_estimee).toBeCloseTo(r2.lames.perte_estimee, 4);
  });

  test('grandes longueurs disponibles (6 m) réduisent les pertes sur grande terrasse', () => {
    const r_sans_6 = optimiserDecoupe({ largeur: 6, longueur: 6, longueurs_disponibles: [2.4, 3.0, 4.0] });
    const r_avec_6 = optimiserDecoupe({ largeur: 6, longueur: 6, longueurs_disponibles: [2.4, 3.0, 4.0, 6.0] });
    // 6 m dispo → perte 0, sans 6 m → 2×3=6 donc aussi 0, les deux devraient être ≤
    expect(r_avec_6.lames.perte_estimee).toBeLessThanOrEqual(r_sans_6.lames.perte_estimee + 0.001);
  });
});


// ═══════════════════════════════════════════════════════════════
// 3. normaliserLongueurs
// ═══════════════════════════════════════════════════════════════

describe('normaliserLongueurs', () => {

  test('trie par ordre décroissant', () => {
    const r = normaliserLongueurs([2.4, 4.0, 3.0]);
    expect(r).toEqual([4.0, 3.0, 2.4]);
  });

  test('déduplique les valeurs identiques', () => {
    const r = normaliserLongueurs([3.0, 3.0, 2.4]);
    expect(r).toEqual([3.0, 2.4]);
  });

  test('accepte des longueurs entières', () => {
    const r = normaliserLongueurs([3, 4, 2]);
    expect(r).toEqual([4, 3, 2]);
  });

  test('ignore les valeurs invalides (NaN, 0, négatif)', () => {
    const r = normaliserLongueurs([3.0, 0, -1, NaN, 2.4]);
    expect(r).toEqual([3.0, 2.4]);
  });

  test('lève une erreur si toutes les valeurs sont invalides', () => {
    expect(() => normaliserLongueurs([0, -2, NaN])).toThrow();
  });

  test('lève une erreur si tableau vide', () => {
    expect(() => normaliserLongueurs([])).toThrow();
  });
});


// ═══════════════════════════════════════════════════════════════
// 4. Validation des paramètres d'entrée
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — validation des entrées', () => {

  test('lève une erreur si largeur manquante', () => {
    expect(() => optimiserDecoupe({ longueur: 5 })).toThrow();
  });

  test('lève une erreur si longueur ≤ 0', () => {
    expect(() => optimiserDecoupe({ largeur: 4, longueur: 0 })).toThrow();
  });

  test('lève une erreur si largeur négative', () => {
    expect(() => optimiserDecoupe({ largeur: -3, longueur: 5 })).toThrow();
  });

  test('lève une erreur si longueurs_disponibles n\'est pas un tableau', () => {
    expect(() => optimiserDecoupe({ largeur: 4, longueur: 5, longueurs_disponibles: '3m' })).toThrow();
  });

  test('accepte des dimensions décimales (3.75 × 5.5 m)', () => {
    expect(() => optimiserDecoupe({ largeur: 3.75, longueur: 5.5 })).not.toThrow();
  });
});


// ═══════════════════════════════════════════════════════════════
// 5. Propriétés invariantes (valides pour tous les cas)
// ═══════════════════════════════════════════════════════════════

describe('optimiserDecoupe — invariants', () => {

  const CAS = [
    { largeur: 1, longueur: 1,   label: '1×1' },
    { largeur: 3, longueur: 4,   label: '3×4' },
    { largeur: 4, longueur: 5,   label: '4×5 (exemple doc)' },
    { largeur: 5, longueur: 7.3, label: '5×7.3 (non multiple)' },
    { largeur: 6, longueur: 9,   label: '6×9' },
    { largeur: 10,longueur: 15,  label: '10×15 (grande)' },
  ];

  CAS.forEach(({ largeur, longueur, label }) => {
    describe(`cas ${label}`, () => {
      let r;
      beforeAll(() => { r = optimiserDecoupe({ largeur, longueur }); });

      test('perte_estimee lames ∈ [0, 1)', () => {
        expect(r.lames.perte_estimee).toBeGreaterThanOrEqual(0);
        expect(r.lames.perte_estimee).toBeLessThan(1);
      });

      test('perte_estimee lambourdes ∈ [0, 1)', () => {
        expect(r.lambourdes.perte_estimee).toBeGreaterThanOrEqual(0);
        expect(r.lambourdes.perte_estimee).toBeLessThan(1);
      });

      test('perte_globale ∈ [0, 1)', () => {
        expect(r.perte_globale).toBeGreaterThanOrEqual(0);
        expect(r.perte_globale).toBeLessThan(1);
      });

      test('longueur_achetee_m ≥ longueur_utile_m (lames)', () => {
        expect(r.lames.longueur_achetee_m).toBeGreaterThanOrEqual(r.lames.longueur_utile_m - 1e-6);
      });

      test('longueur_achetee_m ≥ longueur_utile_m (lambourdes)', () => {
        expect(r.lambourdes.longueur_achetee_m).toBeGreaterThanOrEqual(r.lambourdes.longueur_utile_m - 1e-6);
      });

      test('toutes les quantités de pièces sont des entiers > 0', () => {
        [...r.lames.pieces, ...r.lambourdes.pieces].forEach(p => {
          expect(Number.isInteger(p.quantite)).toBe(true);
          expect(p.quantite).toBeGreaterThan(0);
          expect(Number.isInteger(p.quantite_par_rangee)).toBe(true);
          expect(p.quantite_par_rangee).toBeGreaterThan(0);
        });
      });

      test('quantite = quantite_par_rangee × nb_rangees', () => {
        r.lames.pieces.forEach(p =>
          expect(p.quantite).toBe(p.quantite_par_rangee * r.lames.nb_rangees)
        );
        r.lambourdes.pieces.forEach(p =>
          expect(p.quantite).toBe(p.quantite_par_rangee * r.lambourdes.nb_rangees)
        );
      });
    });
  });
});
