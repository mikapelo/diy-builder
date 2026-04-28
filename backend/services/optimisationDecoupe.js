/**
 * backend/services/optimisationDecoupe.js
 * ═══════════════════════════════════════════════════════════════
 *
 * Moteur d'optimisation des découpes de bois.
 *
 * PROBLÈME RÉSOLU
 * ───────────────
 * Le calcul naïf `nb_lames = ceil(surface / surface_lame)` ignore
 * complètement la réalité du chantier :
 *   - les lames ont des longueurs fixes (2,4 m / 3 m / 4 m)
 *   - on ne peut pas couper une lame et réutiliser le chute ailleurs
 *   - il faut donc acheter des pièces entières qui dépassent parfois
 *     la longueur exacte du projet → perte de bois inévitable.
 *
 * GÉOMÉTRIE D'UNE TERRASSE
 * ────────────────────────
 *   ┌──── longueur ────────────────────┐
 *   │  ← lame 1 (145 mm de large) →   │ ↕ largeur
 *   │  ← lame 2                    →   │
 *   │  …                               │
 *   └──────────────────────────────────┘
 *   Lambourdes ⊥ aux lames (dans le sens de la largeur)
 *
 *   → Chaque lame parcourt la LONGUEUR de la terrasse.
 *   → Chaque lambourde parcourt la LARGEUR de la terrasse.
 *
 * ALGORITHME
 * ──────────
 * Pour chaque "rang" (lame ou lambourde), on cherche la combinaison
 * de pièces commerciales (parmi les longueurs disponibles) qui :
 *   1. Couvre exactement ou dépasse la dimension cible
 *   2. Minimise la perte (longueur achetée − longueur utile)
 *   3. À perte égale, minimise le nombre de pièces (moins de joints)
 *
 * Complexité : O(n1 × n2 × n3) où ni ≤ ceil(cible/li) + 1
 * Sur des longueurs < 20 m et 3 longueurs disponibles → < 500 itérations.
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ── Constantes physiques ────────────────────────────────────────
const LARGEUR_LAME_M    = 0.145;  // 145 mm — largeur d'une lame standard
const ENTRAXE_LAMBOURDES = 0.40; // 400 mm — espacement entre lambourdes
const TOLERANCE          = 1e-9;  // tolérance flottants (évite 2.9999 ≠ 3)

// ── Longueurs commerciales par défaut ──────────────────────────
const LONGUEURS_DEFAUT = [2.4, 3.0, 4.0]; // mètres

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════

/**
 * Optimise les découpes pour une terrasse bois.
 *
 * @param {Object} params
 * @param {number}   params.largeur                — dimension 1 de la terrasse (m)
 * @param {number}   params.longueur               — dimension 2 de la terrasse (m)
 * @param {number[]} [params.longueurs_disponibles] — longueurs commerciales dispo (m)
 *
 * @returns {DecoupeResult}
 *   {
 *     lames: {
 *       nb_lignes:      number,          — rangées de lames nécessaires
 *       pieces:         PieceCoupee[],   — combinaison optimale par ligne × nb_lignes
 *       perte_par_ligne_m: number,       — mètres perdus par rangée
 *       perte_estimee:  number,          — ratio 0–1 (ex: 0.06 = 6 %)
 *       longueur_utile_m: number,        — longueur réellement posée
 *       longueur_achetee_m: number,      — longueur totale achetée
 *     },
 *     lambourdes: { … même structure … },
 *     perte_globale: number,             — ratio perte moyenne lames + lambourdes
 *     resume: string,                    — description lisible pour l'affichage
 *   }
 */
function optimiserDecoupe({ largeur, longueur, longueurs_disponibles }) {
  // ── Validation ─────────────────────────────────────────────
  validerEntrees(largeur, longueur, longueurs_disponibles);

  const L  = parseFloat(largeur);
  const Lo = parseFloat(longueur);
  const longueurs = normaliserLongueurs(longueurs_disponibles || LONGUEURS_DEFAUT);

  // ── Lames ───────────────────────────────────────────────────
  // Chaque lame parcourt la LONGUEUR ; les lames couvrent la LARGEUR par rangées.
  const nb_lignes_lames = Math.ceil(L / LARGEUR_LAME_M);
  const optLames        = optimiserUneRangee(Lo, longueurs);
  const lames           = construireResultat(optLames, nb_lignes_lames, Lo);

  // ── Lambourdes ──────────────────────────────────────────────
  // Chaque lambourde parcourt la LARGEUR ; les lambourdes couvrent la LONGUEUR.
  const nb_rangees_lambourdes = Math.ceil(Lo / ENTRAXE_LAMBOURDES) + 1;
  const optLambourdes         = optimiserUneRangee(L, longueurs);
  const lambourdes            = construireResultat(optLambourdes, nb_rangees_lambourdes, L);

  // ── Perte globale ────────────────────────────────────────────
  const perte_globale = parseFloat(
    ((lames.perte_estimee + lambourdes.perte_estimee) / 2).toFixed(4)
  );

  // ── Résumé textuel ───────────────────────────────────────────
  const resume = genererResume(L, Lo, lames, lambourdes);

  return {
    lames,
    lambourdes,
    perte_globale,
    resume,
  };
}

// ═══════════════════════════════════════════════════════════════
// ALGORITHME D'OPTIMISATION D'UNE RANGÉE
// ═══════════════════════════════════════════════════════════════

/**
 * Trouve la combinaison de pièces commerciales qui couvre `cible`
 * avec un minimum de perte, en énumérant toutes les combinaisons
 * valides (n1 × n2 × … pour chaque longueur disponible).
 *
 * Stratégie :
 *   Pour chaque longueur disponible li, le nombre maximal de pièces
 *   à essayer est ceil(cible / li) + 1. On explore toutes les
 *   combinaisons par récursion avec élagage dès que la perte actuelle
 *   dépasse la meilleure connue.
 *
 * @param  {number}   cible     — longueur à couvrir (m)
 * @param  {number[]} longueurs — longueurs disponibles, triées décroissant
 * @returns {CombiResult}
 */
function optimiserUneRangee(cible, longueurs) {
  let meilleure = null;

  /**
   * Récursion : à chaque appel on choisit combien de pièces de
   * longueurs[index] on utilise, puis on passe à l'index suivant.
   *
   * @param {number}   index        — longueur courante dans `longueurs`
   * @param {number}   resteACouvrir — longueur encore à couvrir
   * @param {number[]} compteurs    — nb de pièces choisies pour chaque longueur
   */
  function explorer(index, resteACouvrir, compteurs) {
    // ── Cas terminal : toutes les longueurs ont été traitées ──
    if (index === longueurs.length) {
      // On accepte seulement si la cible est couverte (reste ≤ 0)
      if (resteACouvrir > TOLERANCE) return; // cible non atteinte

      const perte      = -resteACouvrir; // excédent acheté
      const nbPieces   = compteurs.reduce((s, c) => s + c, 0);

      // Critère 1 : minimiser la perte
      // Critère 2 : à perte égale, minimiser le nombre de pièces
      const estMeilleure =
        !meilleure ||
        perte < meilleure.perte - TOLERANCE ||
        (Math.abs(perte - meilleure.perte) < TOLERANCE && nbPieces < meilleure.nbPieces);

      if (estMeilleure) {
        meilleure = {
          compteurs: [...compteurs],
          perte:     parseFloat(perte.toFixed(6)),
          nbPieces,
        };
      }
      return;
    }

    const l    = longueurs[index];
    // Maximum de pièces à essayer pour cette longueur :
    // - au moins ce qu'il faut pour couvrir le reste seul
    // - +1 pour explorer les légères sur-couvertures
    const nMax = Math.ceil(resteACouvrir / l) + 1;

    for (let n = 0; n <= nMax; n++) {
      const couverture    = l * n;
      const nouveauReste  = resteACouvrir - couverture;

      // ── Élagage : si la perte est déjà pire que la meilleure, skip ──
      // La perte minimum atteignable depuis ici est `max(0, -nouveauReste)`
      // si on couvre avec les longueurs restantes sans excédent.
      // On ne peut pas élaguer sur perte directement ici car des longueurs
      // plus petites peuvent encore couvrir exactement.
      // On élague si couverture déjà trop grande ET perte déjà pire.
      if (meilleure && couverture > cible + meilleure.perte + TOLERANCE) break;

      compteurs.push(n);
      explorer(index + 1, nouveauReste, compteurs);
      compteurs.pop();
    }
  }

  explorer(0, cible, []);

  if (!meilleure) {
    // Ne devrait jamais arriver si longueurs est non vide
    throw new Error(`Impossible de couvrir ${cible} m avec les longueurs disponibles.`);
  }

  return {
    pieces: longueurs
      .map((l, i) => ({ longueur: l, quantite_par_rangee: meilleure.compteurs[i] }))
      .filter(p => p.quantite_par_rangee > 0),
    perte_par_rangee: meilleure.perte,
  };
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUCTION DU RÉSULTAT
// ═══════════════════════════════════════════════════════════════

/**
 * Multiplie le résultat par rangée par le nombre total de rangées,
 * calcule la perte en % et les longueurs utile/achetée.
 */
function construireResultat(optParRangee, nbRangees, longueurCible) {
  // Quantités totales = quantité par rangée × nombre de rangées
  const pieces = optParRangee.pieces.map(p => ({
    longueur: p.longueur,
    quantite: p.quantite_par_rangee * nbRangees,
    quantite_par_rangee: p.quantite_par_rangee,
  }));

  // Longueur totale achetée par rangée
  const longueur_achetee_par_rangee = optParRangee.pieces.reduce(
    (s, p) => s + p.longueur * p.quantite_par_rangee,
    0
  );

  const longueur_utile_total   = parseFloat((longueurCible  * nbRangees).toFixed(3));
  const longueur_achetee_total = parseFloat((longueur_achetee_par_rangee * nbRangees).toFixed(3));

  // perte_estimee = ratio 0–1
  const perte_estimee = longueur_achetee_par_rangee > 0
    ? parseFloat((optParRangee.perte_par_rangee / longueur_achetee_par_rangee).toFixed(4))
    : 0;

  return {
    nb_rangees:              nbRangees,
    pieces,
    perte_par_rangee_m:      parseFloat(optParRangee.perte_par_rangee.toFixed(4)),
    perte_estimee,            // 0.06 = 6 %
    longueur_utile_m:        longueur_utile_total,
    longueur_achetee_m:      longueur_achetee_total,
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Normalise et trie les longueurs disponibles (décroissant).
 * Déduplique et supprime les valeurs invalides.
 */
function normaliserLongueurs(longueurs) {
  const valides = longueurs
    .map(l => parseFloat(l))
    .filter(l => !isNaN(l) && l > 0);

  if (valides.length === 0)
    throw new Error('Au moins une longueur disponible doit être fournie.');

  // Déduplication et tri décroissant (les plus grandes en premier
  // pour l'élagage de l'algorithme)
  return [...new Set(valides)].sort((a, b) => b - a);
}

/**
 * Génère un résumé textuel lisible pour l'affichage frontend.
 */
function genererResume(largeur, longueur, lames, lambourdes) {
  const descLames = lames.pieces
    .map(p => `${p.quantite} lames de ${p.longueur} m`)
    .join(', ');

  const descLambourdes = lambourdes.pieces
    .map(p => `${p.quantite} lambourdes de ${p.longueur} m`)
    .join(', ');

  return [
    `Terrasse ${largeur} × ${longueur} m`,
    `Lames : ${descLames} — perte ${(lames.perte_estimee * 100).toFixed(1)} %`,
    `Lambourdes : ${descLambourdes} — perte ${(lambourdes.perte_estimee * 100).toFixed(1)} %`,
  ].join(' | ');
}

/** Validation des paramètres d'entrée. */
function validerEntrees(largeur, longueur, longueurs_disponibles) {
  if (!largeur  || isNaN(Number(largeur))  || Number(largeur)  <= 0)
    throw new Error('optimiserDecoupe : largeur doit être un nombre positif.');
  if (!longueur || isNaN(Number(longueur)) || Number(longueur) <= 0)
    throw new Error('optimiserDecoupe : longueur doit être un nombre positif.');
  if (longueurs_disponibles !== undefined && !Array.isArray(longueurs_disponibles))
    throw new Error('optimiserDecoupe : longueurs_disponibles doit être un tableau.');
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  optimiserDecoupe,
  // Fonctions internes exportées pour les tests unitaires
  optimiserUneRangee,
  normaliserLongueurs,
  construireResultat,
  LONGUEURS_DEFAUT,
  LARGEUR_LAME_M,
  ENTRAXE_LAMBOURDES,
};
