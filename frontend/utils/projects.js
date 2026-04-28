/**
 * utils/projects.js
 * ─────────────────────────────────────────────────────────────
 * Catalogue des projets disponibles dans DIY Builder.
 * Ajouter ici les nouvelles entrées (pergola, clôture…)
 * sans modifier aucun composant UI.
 *
 * Champs :
 *   id      — identifiant unique (correspond à /modules/[id] et /app/[id])
 *   title   — libellé affiché sur la carte
 *   tags    — mots-clés affichés sous le titre
 *   active  — true = simulateur disponible, false = "Bientôt"
 *   route   — route Next.js cible au clic (ignoré si active: false)
 * ─────────────────────────────────────────────────────────────
 */

export const PROJETS = [
  {
    id:     'terrasse',
    title:  'Terrasse bois',
    tags:   ['Pin', 'Douglas', 'Ipé'],
    active: true,
    route:  '/calculateur',
  },
  {
    id:     'cabanon',
    title:  'Cabanon jardin',
    tags:   ['Ossature', 'Bardage', 'Toiture'],
    active: true,
    route:  '/cabanon',
  },
  {
    id:     'pergola',
    title:  'Pergola bois',
    tags:   ['Poteaux', 'Poutres', 'Chevrons'],
    active: true,
    route:  '/pergola',
  },
  {
    id:     'cloture',
    title:  'Clôture bois',
    tags:   ['Piquets', 'Lames', 'Rails'],
    active: true,
    route:  '/cloture',
  },
];
