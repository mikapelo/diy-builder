'use client';

/**
 * BrandIcon.jsx — Médaillons SVG custom pour la DA « G v2 »
 *
 * Famille de 14 glyphes propriétaires, stroke marine 2px, style duotone.
 * Utilisé dans le scope `data-theme="g-v2"` (page cabanon en POC).
 *
 * Usage :
 *   <BrandIcon name="cabanon" size={30} />
 *   <BrandIcon name="bastaing" size={24} className="mat-brand-icon" />
 *
 * Convention : tous les SVG sont dessinés dans une viewBox 36×36,
 * trait marine #1E3A52, stroke-width 2, lineCap/lineJoin round.
 * La couleur est contrôlée par `currentColor` sur le parent
 * (médaillon moutarde → stroke marine ; médaillon brique → stroke moutarde).
 */

const COMMON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const PATHS = {
  // 01. cabanon — façade pignon + porte
  cabanon: (
    <>
      <path d="M5 30h26" />
      <path d="M7 30V15l11-8 11 8v15" />
      <path d="M14 30v-9h8v9" />
    </>
  ),
  // 02. terrasse — lames + lambourdes
  terrasse: (
    <>
      <path d="M5 14h26 M5 22h26" />
      <path d="M8 8v22 M16 8v22 M24 8v22 M31 8v22" />
    </>
  ),
  // 03. bastaing — poutre rabotée avec fil bois
  bastaing: (
    <>
      <rect x="4" y="14" width="28" height="8" rx="1" />
      <path d="M4 18h28" strokeDasharray="2 2" />
    </>
  ),
  // 04. bardage claire-voie — lames verticales + rails
  bardage: (
    <>
      <path d="M8 6v24 M14 6v24 M20 6v24 M26 6v24" />
      <path d="M5 12h26 M5 24h26" />
    </>
  ),
  // 05. fondation — dalle + plots
  fondation: (
    <>
      <path d="M5 20h26 M9 20v8h18v-8" />
      <path d="M5 20L18 8l13 12" />
      <circle cx="13" cy="25" r="1" fill="currentColor" stroke="none" />
      <circle cx="23" cy="25" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // 06. chevron — pente de toit
  chevron: (
    <>
      <path d="M4 24L18 8l14 16" />
      <path d="M4 28h28" />
    </>
  ),
  // 07. ouverture — porte/fenêtre
  ouverture: (
    <>
      <rect x="8" y="6" width="20" height="24" />
      <path d="M13 6v24" />
      <circle cx="23" cy="18" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // 08. entraxe — cote entre deux montants
  entraxe: (
    <>
      <path d="M9 8v20 M27 8v20 M9 18h18" />
      <path d="M7 18l2-2 M7 18l2 2 M29 18l-2-2 M29 18l-2 2" />
    </>
  ),
  // 09. pente — angle de toiture
  pente: (
    <>
      <path d="M5 28h26 M5 28L28 10" />
      <path d="M10 24a4 4 0 0 1 4-4" />
    </>
  ),
  // 10. ossature — cadre + montants réguliers
  ossature: (
    <>
      <rect x="5" y="6" width="26" height="24" />
      <path d="M12 6v24 M19 6v24 M26 6v24 M5 18h26" />
    </>
  ),
  // 11. couverture — tuiles/bac acier
  couverture: (
    <>
      <path d="M5 26L18 10l13 16" />
      <path d="M8 22h20 M10 18h16" />
    </>
  ),
  // 12. visserie — vis tête plate
  visserie: (
    <>
      <circle cx="18" cy="10" r="4" />
      <path d="M18 14v18 M14 10h8 M15 20h6 M15 26h6" />
    </>
  ),
  // 13. linteau — poutre au-dessus d'une ouverture
  linteau: (
    <>
      <rect x="5" y="8" width="26" height="5" />
      <path d="M9 13v18 M27 13v18" />
    </>
  ),
  // 14. lisse — deux rails horizontaux
  lisse: (
    <>
      <rect x="4" y="22" width="28" height="5" />
      <rect x="4" y="10" width="28" height="5" />
      <path d="M10 15v7 M18 15v7 M26 15v7" />
    </>
  ),
  // bonus : pergola — poteau + poutre
  pergola: (
    <>
      <path d="M5 8h26 M5 14h26" />
      <path d="M9 8v22 M27 8v22" />
      <path d="M13 14v6 M19 14v6 M23 14v6" />
    </>
  ),
  // bonus : cloture — poteaux + lames horizontales
  cloture: (
    <>
      <path d="M6 8v22 M30 8v22" />
      <path d="M3 14h30 M3 22h30" />
    </>
  ),
};

/**
 * Alias pour matcher les noms d'icônes legacy (Phosphor, Material Symbols, emojis)
 * utilisés dans MaterialsList et ProjectSummary, sans toucher au reste de la chaîne.
 */
const ALIAS = {
  // Phosphor classes complètes
  'ph-duotone ph-house-line': 'cabanon',
  'ph-duotone ph-park':       'terrasse',
  'ph-duotone ph-umbrella':   'pergola',
  'ph-duotone ph-tree-structure': 'cloture',
  'ph-duotone ph-ruler':      'entraxe',
  'ph-duotone ph-square-half':'ossature',
  'ph-duotone ph-arrows-vertical': 'pente',
  'ph-duotone ph-rows':       'bardage',
  'ph-duotone ph-hammer':     'chevron',
  'ph-duotone ph-stack-simple':'bardage',
  'ph-duotone ph-grid-four':  'ossature',
  // Material Symbols legacy
  foundation:     'fondation',
  grid_4x4:       'ossature',
  push_pin:       'visserie',
  layers:         'couverture',
  content_cut:    'visserie',
  straighten:     'lisse',
  construction:   'fondation',
  settings:       'visserie',
  link:           'entraxe',
  fence:          'ossature',
  carpenter:      'chevron',
  view_column:    'bastaing',
  roofing:        'couverture',
  cottage:        'cabanon',
  hardware:       'visserie',
  shelf_position: 'linteau',
  architecture:   'entraxe',
  inventory_2:    'bardage',
  build:          'visserie',
  // emojis legacy
  '🪨':           'fondation',
  '🪵':           'bastaing',
  '🪤':           'entraxe',
};

/**
 * Résout un nom vers une clé de PATHS.
 * Retourne 'cabanon' par défaut si aucun match.
 */
export function resolveBrandIconName(name) {
  if (!name) return 'cabanon';
  if (PATHS[name]) return name;
  if (ALIAS[name]) return ALIAS[name];
  return 'bardage';
}

export default function BrandIcon({
  name = 'cabanon',
  size = 28,
  className = '',
  strokeWidth = 2,
}) {
  const key = resolveBrandIconName(name);
  const path = PATHS[key] || PATHS.cabanon;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={`brand-icon brand-icon--${key} ${className}`.trim()}
      aria-hidden="true"
      {...COMMON}
      strokeWidth={strokeWidth}
    >
      {path}
    </svg>
  );
}
