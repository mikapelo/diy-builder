/**
 * backend/controllers/terrasseController.js — v3
 * ─────────────────────────────────────────────────────────────
 * Contrôleur REST — orchestre :
 *   1. Validation des entrées
 *   2. Calcul des quantités  (calculations/terrasse.js)
 *   3. Optimisation découpes (services/optimisationDecoupe.js)
 *   4. Prix réels / simulés  (services/optimisationMateriaux.js)
 *   5. Mise en forme de la réponse
 *
 * NOUVEAU en v3 :
 *   La réponse inclut `optimisation_decoupe` avec le détail des
 *   pièces à acheter et la perte estimée par catégorie.
 * ─────────────────────────────────────────────────────────────
 */

const { calculerTerrasse }                = require('../calculations/terrasse');
const { optimiserMateriaux, simulerPrix } = require('../services/optimisationMateriaux');

/**
 * POST /api/calcul-terrasse
 */
async function calculTerrasse(req, res) {
  try {
    const { largeur, longueur, type_bois } = req.body;

    // ── 1. Validation ─────────────────────────────────────────
    const erreurs = validerEntrees({ largeur, longueur, type_bois });
    if (erreurs.length) {
      return res.status(400).json({ success: false, erreurs });
    }

    const l  = parseFloat(largeur);
    const lo = parseFloat(longueur);
    const tb = type_bois.trim().toLowerCase();

    // ── 2. Calcul des quantités de base ───────────────────────
    const calcul = calculerTerrasse(l, lo, tb);

    // ── 3. Optimisation + prix (avec fallback simulation) ─────
    let optimisation;
    try {
      optimisation = await optimiserMateriaux(calcul);
    } catch (dbErr) {
      console.warn('⚠️  Fallback simulation :', dbErr.message);
      // On transmet largeur/longueur pour que simulerPrix puisse
      // quand même calculer l'optimisation de découpe
      optimisation = simulerPrix(calcul.materiaux, tb, l, lo);
    }

    // ── 4. Réponse enrichie ───────────────────────────────────
    return res.status(200).json({
      success: true,

      projet: {
        type:       'terrasse_bois',
        surface_m2: calcul.surface_terrasse,
        largeur:    calcul.largeur,
        longueur:   calcul.longueur,
        type_bois:  calcul.type_bois,
      },

      // Matériaux avec quantités optimisées par longueur commerciale
      materiaux: optimisation.materiaux_optimises,

      // ──────────────────────────────────────────────────────
      // NOUVEAU : détail des découpes et pertes estimées
      // ──────────────────────────────────────────────────────
      optimisation_decoupe: optimisation.optimisation_decoupe,

      comparateur_prix: {
        // ── Nouveau format enrichi (par magasin, avec détail produits) ──
        par_magasin:  optimisation.comparateur_prix.par_magasin,

        // ── Format existant (champs inchangés — frontend non modifié) ───
        detail:       optimisation.comparateur_prix.totaux,
        meilleur:     optimisation.comparateur_prix.meilleur_prix,
        economie_max: optimisation.comparateur_prix.economie_possible,
        mode:         optimisation.mode || 'base_de_donnees',

        // ── Diagnostic couverture ────────────────────────────────────────
        couverture:   optimisation.comparateur_prix.couverture,
      },

      parametres_calcul: calcul.parametres,
      plan:              calcul.plan,
    });

  } catch (err) {
    console.error('❌ Erreur /calcul-terrasse :', err.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      detail:  process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

function validerEntrees({ largeur, longueur, type_bois }) {
  const err = [];
  if (!largeur  || isNaN(Number(largeur))  || Number(largeur)  <= 0) err.push('largeur : nombre positif requis (en mètres).');
  if (Number(largeur) > 100)                                          err.push('largeur : maximum 100 m.');
  if (!longueur || isNaN(Number(longueur)) || Number(longueur) <= 0) err.push('longueur : nombre positif requis (en mètres).');
  if (Number(longueur) > 100)                                         err.push('longueur : maximum 100 m.');
  if (!type_bois || !['pin', 'douglas', 'ipe'].includes(type_bois.trim().toLowerCase()))
    err.push('type_bois : doit être "pin", "douglas" ou "ipe".');
  return err;
}

module.exports = { calculTerrasse };
