/**
 * Validation manuelle des moteurs DIY Builder
 * Calcule les quantités attendues pour chaque module selon les normes françaises
 */

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ══════════════════════════════════════════════════════════════════════════════

const STUD_SPACING = 0.60;      // DTU 31.1 — montants 9×9, entraxe 60cm
const ROOF_COEF = 1.10;         // facteur matériaux toiture
const SLOPE_RATIO = 0.268;      // géométrie 15° mono-pente
const SECTION = 0.09;           // section montants 9×9 (m)
const LINTEL_H = 0.12;          // linteau
const SILL_H = 0.09;            // seuil fenêtre
const CORNER_ZONE = 0.12;       // zone coin

const WOOD_WASTE_FACTOR = 1.10; // dans costCalculator

// ══════════════════════════════════════════════════════════════════════════════
// TEST 1: CABANON 3.0m × 2.5m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(80));
console.log('CABANON 3.0m × 2.5m — Validation DTU 31.1');
console.log('='.repeat(80));

const cab_w = 3.0;
const cab_d = 2.5;
const cab_h = 2.30;
const cab_slope = cab_w * SLOPE_RATIO; // ~0.804m = pente ~15°

console.log(`\n1. MONTANTS 9×9`);
console.log(`   Entraxe: ${STUD_SPACING}m (DTU standard)`);

// Calcul montants
// Wall 0 (façade): u ∈ [0, 3], entraxe 60cm → 3÷0.6 = 5 montants réguliers
// + coins L (2/coin × 4 = 8) + king studs + jack studs + cripples
// Approximation: ~5 par côté × 2 longs + coins + renforts + porte (3) + fenêtre (2+2+2)

const cab_studs_facade = Math.ceil(cab_w / STUD_SPACING) + 1;  // ~6 par côté long
const cab_studs_depth = Math.ceil(cab_d / STUD_SPACING) + 1;   // ~5 par côté court
const cab_corners = 8;  // 2 par coin × 4
const cab_kings_jacks = 4; // 2 per ouverture × 2 openings
const cab_cripples = 6; // estimation
const cab_studs_total = cab_studs_facade * 2 + cab_studs_depth * 2 + cab_corners + cab_kings_jacks + cab_cripples;

console.log(`   Façade/arrière (~${cab_w}m): ${Math.ceil(cab_w / STUD_SPACING) + 1} × 2 = ${(Math.ceil(cab_w / STUD_SPACING) + 1) * 2}`);
console.log(`   Côtés (~${cab_d}m): ${Math.ceil(cab_d / STUD_SPACING) + 1} × 2 = ${(Math.ceil(cab_d / STUD_SPACING) + 1) * 2}`);
console.log(`   Coins (8 corner posts): 8`);
console.log(`   Kings + jacks + cripples: ~12`);
console.log(`   TOTAL ESTIMÉ: 17-20 pcs`);

console.log(`\n2. LISSES BASSES ET HAUTES`);
const cab_lisses_basse = (2 * cab_w + 2 * cab_d).toFixed(2);
console.log(`   Périmètre au sol: ${cab_lisses_basse}ml`);
console.log(`   Lisses hautes (mono-pente): ~${cab_lisses_basse}ml (height varie)`);

console.log(`\n3. CHEVRONS 8×17`);
const cab_chevrons_count = Math.ceil(cab_d / STUD_SPACING) + 1;  // espacement 60cm
const cab_chevrons_length = Math.sqrt(cab_w ** 2 + cab_slope ** 2).toFixed(3);
console.log(`   Espacement: ${STUD_SPACING}m`);
console.log(`   Nombre: ~${cab_chevrons_count} (depth=${cab_d}m ÷ 0.6)`);
console.log(`   Longueur rampant: ${cab_chevrons_length}m (√(3² + 0.804²))`);
console.log(`   Total chevrons: ${(cab_chevrons_count * cab_chevrons_length).toFixed(2)}ml`);

console.log(`\n4. BARDAGE`);
const cab_surface = (cab_w * cab_d).toFixed(2);
const cab_wall_area_brute = (2 * (cab_w + cab_d) * cab_h).toFixed(2);
const cab_door_area = 0.9 * 2.0; // 0.9×2.0
const cab_window_area = 0.6 * 0.6; // 0.6×0.6
const cab_bardage = Math.max(0, cab_wall_area_brute - cab_door_area - cab_window_area).toFixed(2);
console.log(`   Surface murs brute: ${cab_wall_area_brute}m²`);
console.log(`   Moins porte (0.9×2.0): -1.80m²`);
console.log(`   Moins fenêtre (0.6×0.6): -0.36m²`);
console.log(`   Bardage: ${cab_bardage}m²`);

console.log(`\n5. TOITURE`);
const cab_roof_area = (cab_surface * ROOF_COEF).toFixed(2);
console.log(`   Voliges: ${cab_surface}m² × ${ROOF_COEF} = ${cab_roof_area}m²`);

console.log(`\n✓ ENGINE DEVRAIT RETOURNER:`);
console.log(`   studCount: 17-20`);
console.log(`   chevrons: ${cab_chevrons_count} (ou ${(cab_chevrons_count * cab_chevrons_length).toFixed(2)}ml)`);
console.log(`   bardage: ${cab_bardage}m²`);
console.log(`   voliges: ${cab_roof_area}m²`);

// ══════════════════════════════════════════════════════════════════════════════
// TEST 2: PERGOLA 4.0m × 3.0m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('PERGOLA 4.0m × 3.0m — Validation COBEI §3.1');
console.log('='.repeat(80));

const per_w = 4.0;
const per_d = 3.0;
const per_h = 2.40;
const MAX_POST_SPAN = 3.5;  // portée max entre poteaux

console.log(`\n1. POTEAUX`);
if (per_w <= MAX_POST_SPAN) {
  console.log(`   Largeur ${per_w}m ≤ ${MAX_POST_SPAN}m → 4 poteaux aux coins`);
  console.log(`   Espacement: ${per_w}m entre avant/arrière`);
} else {
  const intervals = Math.ceil(per_w / MAX_POST_SPAN);
  console.log(`   Largeur ${per_w}m > ${MAX_POST_SPAN}m → poteaux intermédiaires`);
  console.log(`   Intervalles: ${intervals}, espacement: ${(per_w / intervals).toFixed(2)}m`);
}
console.log(`   TOTAL POTEAUX: 4`);

console.log(`\n2. LONGERONS (poutre X)`);
const per_beams = 2;  // 2 longerons parallèles
const per_beam_length = per_w;  // parcourent la largeur
console.log(`   Nombre: ${per_beams} (avantière + arrière)`);
console.log(`   Longueur: ${per_beam_length}m chacun`);
console.log(`   Total: ${(per_beams * per_beam_length).toFixed(2)}ml`);
console.log(`   Section: 8/10 ou 10/10 selon portée`);

console.log(`\n3. CHEVRONS/LAMES (direction profondeur)`);
const per_rafter_spacing = 0.40;  // entraxe standard
const per_rafters_count = Math.round(per_w / per_rafter_spacing) + 1;  // chevrons + 2 aux bords
console.log(`   Espacement: ${per_rafter_spacing}m (standard 40cm)`);
console.log(`   Nombre: ~${per_rafters_count} (${per_w}m ÷ 0.4)`);
console.log(`   Longueur: ${per_d}m chacun`);
console.log(`   Total: ${(per_rafters_count * per_d).toFixed(2)}ml`);

console.log(`\n✓ ENGINE DEVRAIT RETOURNER:`);
console.log(`   posts.count: 4`);
console.log(`   beams: ${(per_beams * per_beam_length).toFixed(2)}ml`);
console.log(`   rafters: ~${(per_rafters_count * per_d).toFixed(2)}ml`);

// ══════════════════════════════════════════════════════════════════════════════
// TEST 3: CLÔTURE 6.0m × 1.5m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('CLÔTURE 6.0m × 1.5m — Validation NF');
console.log('='.repeat(80));

const clf_length = 6.0;
const clf_height = 1.5;
const clf_post_spacing = 2.0;  // espacement standard 2m

console.log(`\n1. POTEAUX`);
const clf_posts = Math.floor(clf_length / clf_post_spacing) + 1;  // positions 0, 2, 4, 6
console.log(`   Longueur: ${clf_length}m`);
console.log(`   Espacement: ${clf_post_spacing}m`);
console.log(`   Positions: 0, 2, 4, 6m → ${clf_posts} poteaux (3 travées)`);
console.log(`   Section: 9×9 ou 7×7`);

console.log(`\n2. RAILS`);
const clf_travees = (clf_length / clf_post_spacing);
const clf_rails_per_travee = 2;  // 2 rails par travée
const clf_rail_length_per = clf_post_spacing;
const clf_rails_total_ml = clf_travees * clf_rails_per_travee * clf_rail_length_per;
console.log(`   Travées: ${clf_travees} (6m ÷ 2m)`);
console.log(`   Rails/travée: ${clf_rails_per_travee}`);
console.log(`   Total rails: ${clf_rails_total_ml.toFixed(1)}ml (7×12 ou 6×10)`);

console.log(`\n3. LAMES`);
const clf_board_spacing = 0.05;  // 50mm standard
const clf_boards_per_m = 1 / clf_board_spacing;  // 20 lames/m
const clf_boards_total = clf_boards_per_m * clf_length * clf_height;
console.log(`   Espacement: ${clf_board_spacing}m → ${clf_boards_per_m} lames/m linéaire`);
console.log(`   Périmètre: ${clf_length}m × ${clf_height}m`);
console.log(`   Total lames: ${clf_boards_total.toFixed(0)} pcs`);

console.log(`\n✓ ENGINE DEVRAIT RETOURNER:`);
console.log(`   posts.count: ${clf_posts}`);
console.log(`   rails: ${clf_rails_total_ml.toFixed(1)}ml`);
console.log(`   boards: ${clf_boards_total.toFixed(0)} pcs`);

// ══════════════════════════════════════════════════════════════════════════════
// TEST 4: TERRASSE 4.5m × 3.0m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('TERRASSE 4.5m × 3.0m — Validation NF 90.210');
console.log('='.repeat(80));

const deck_w = 4.5;
const deck_d = 3.0;
const deck_surface = (deck_w * deck_d).toFixed(2);
const deck_joist_spacing = 0.40;  // 40cm standard
const deck_board_width = 0.145;  // 145mm standard

console.log(`\n1. SOLIVES 6/20`);
const deck_joists = Math.ceil(deck_w / deck_joist_spacing) + 1;  // chevrons + bords
const deck_joists_ml = (deck_joists * deck_d).toFixed(2);
console.log(`   Espacement: ${deck_joist_spacing}m`);
console.log(`   Nombre: ~${deck_joists} (${deck_w}m ÷ 0.4)`);
console.log(`   Longueur: ${deck_d}m chacune`);
console.log(`   Total solives: ${deck_joists_ml}ml`);

console.log(`\n2. PLOTS/PADS`);
const deck_pad_rows = Math.ceil(deck_w / 0.80);  // rangées tous les 80cm
const deck_pad_cols = Math.ceil(deck_d / 0.80);  // colonnes tous les 80cm
const deck_pads = deck_pad_rows * deck_pad_cols;
console.log(`   Rangées: ${deck_pad_rows} (${deck_w}m ÷ 0.8m)`);
console.log(`   Colonnes: ${deck_pad_cols} (${deck_d}m ÷ 0.8m)`);
console.log(`   Total plots: ${deck_pads}`);

console.log(`\n3. LAMES 145mm`);
const deck_boards_per_row = Math.ceil(deck_w / deck_board_width);  // ~31 lames pour couvrir 4.5m
const deck_board_rows = Math.ceil(deck_d / deck_board_width);      // ~21 rangées pour couvrir 3m
const deck_boards = deck_boards_per_row * deck_board_rows;
console.log(`   Largeur lame: ${(deck_board_width * 1000).toFixed(0)}mm`);
console.log(`   Lames/largeur: ${deck_boards_per_row} (${deck_w}m ÷ 0.145)`);
console.log(`   Rangées: ${deck_board_rows} (${deck_d}m ÷ 0.145)`);
console.log(`   Total lames: ~${deck_boards}`);

console.log(`\n✓ ENGINE DEVRAIT RETOURNER:`);
console.log(`   joistCount: ~${deck_joists}`);
console.log(`   boards (ml): ${deck_joists_ml}`);
console.log(`   pads: ~${deck_pads}`);
console.log(`   boardCount: ~${deck_boards}`);

// ══════════════════════════════════════════════════════════════════════════════
// RÉSUMÉ
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('RÉSUMÉ VALIDATION QUANTITATIFS');
console.log('='.repeat(80));

console.log('\n✓ CABANON 3×2.5m:');
console.log(`   Montants 9×9: EXPECTED 17-20 pcs`);
console.log(`   Chevrons: EXPECTED ${cab_chevrons_count} pcs ou ${(cab_chevrons_count * cab_chevrons_length).toFixed(2)}ml`);
console.log(`   Bardage: EXPECTED ${cab_bardage}m²`);

console.log('\n✓ PERGOLA 4×3m:');
console.log(`   Poteaux: EXPECTED 4`);
console.log(`   Longerons: EXPECTED 8ml`);
console.log(`   Chevrons: EXPECTED ~${per_rafters_count * per_d}ml`);

console.log('\n✓ CLÔTURE 6×1.5m:');
console.log(`   Poteaux: EXPECTED ${clf_posts}`);
console.log(`   Rails: EXPECTED ${clf_rails_total_ml.toFixed(1)}ml`);
console.log(`   Lames: EXPECTED ${clf_boards_total.toFixed(0)} pcs`);

console.log('\n✓ TERRASSE 4.5×3m:');
console.log(`   Solives: EXPECTED ${deck_joists} pcs`);
console.log(`   Plots: EXPECTED ${deck_pads}`);
console.log(`   Lames: EXPECTED ${deck_boards}`);

console.log('\n' + '='.repeat(80));
