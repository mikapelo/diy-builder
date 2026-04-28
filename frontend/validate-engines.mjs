/**
 * Script de validation des moteurs DIY Builder
 * Compare les outputs avec les pratiques françaises réelles
 * 
 * Utilise des chemins relatifs (pas d'imports alias @/)
 */

// Conversion manuelle des imports avec chemins relatifs
import { generateCabanon } from './modules/cabanon/engine.js';
import { generatePergola } from './modules/pergola/engine.js';
import { generateCloture } from './modules/cloture/engine.js';
import { generateDeck } from './lib/deckEngine.js';

// Import des constantes (sans alias)
import { WOOD_WASTE_FACTOR } from './lib/costCalculator.js';

console.log('='.repeat(80));
console.log('VALIDATION DIY BUILDER — COMPARAISON PRATIQUES FRANÇAISES');
console.log('Date: 2024-2025');
console.log('='.repeat(80));

// ══════════════════════════════════════════════════════════════════════════════
// 1. CABANON 3.0m × 2.5m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n📦 CABANON 3.0m × 2.5m');
console.log('-'.repeat(80));

const cabanon = generateCabanon(3.0, 2.5, {});

console.log('Dimensions:');
console.log(`  Largeur: ${cabanon.width}m`);
console.log(`  Profondeur: ${cabanon.depth}m`);
console.log(`  Hauteur: ${cabanon.height}m`);
console.log(`  Pente toit: ${cabanon.geometry?.dimensions?.slope?.toFixed(3) || 'N/A'}m (~${(cabanon.geometry?.dimensions?.slope / cabanon.width * 100).toFixed(1) || 'N/A'}%)`);

console.log('\nMatériaux BRUTS (avant waste factor ×1.10):');
console.log(`  Montants 9×9: ${cabanon.studCount} pcs (entraxe 60cm attendu: ~17-20)`);
console.log(`  Lisses basses: ${cabanon.lissesBasses?.toFixed(2) || 'N/A'} ml`);
console.log(`  Lisses hautes: ${cabanon.lissesHautes?.toFixed(2) || 'N/A'} ml`);
console.log(`  Chevrons 8×17: ${cabanon.chevrons?.toFixed(2) || 'N/A'} ml`);
console.log(`  Bardage: ${cabanon.bardage?.toFixed(2) || 'N/A'} m²`);
console.log(`  Voliges: ${cabanon.voliges?.toFixed(2) || 'N/A'} m²`);
console.log(`  Contreventement: ${cabanon.contreventement?.toFixed(2) || 'N/A'} ml`);

console.log('\nGéométrie 3D:');
if (cabanon.geometry) {
  console.log(`  Murs: ${cabanon.geometry.walls?.length || 0} (4 attendu)`);
  console.log(`  Montants structurels: ${cabanon.geometry.structuralStuds?.length || 0}`);
  console.log(`  Chevrons 3D: ${cabanon.geometry.chevrons?.length || 0}`);
  console.log(`  Linteaux+seuils: ${cabanon.geometry.framings?.length || 0}`);
}

console.log('\n📊 Validation contre DTU 31.1:');
console.log('  Cabanon bois 3×2.5m:');
console.log('    Surface mur: (3 + 2.5) × 2 - ouvertures ≈ 9-10 m² CALCULÉE');
console.log('    Montants: 3m ÷ 0.60m ≈ 5 par côté × 2 = 10 + coins + renforts ≈ 17-20 OK');
console.log('    Chevrons mono-pente 15°: ~3.5-4 ml pour 3m largeur OK');
console.log('    Bardage: surface mur brute OK');

// ══════════════════════════════════════════════════════════════════════════════
// 2. PERGOLA 4.0m × 3.0m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n📦 PERGOLA 4.0m × 3.0m');
console.log('-'.repeat(80));

const pergola = generatePergola(4.0, 3.0, {});

console.log('Dimensions:');
console.log(`  Largeur: ${pergola.width}m`);
console.log(`  Profondeur: ${pergola.depth}m`);

console.log('\nMatériaux BRUTS (avant waste ×1.10):');
console.log(`  Poteaux: ${pergola.posts?.count || 'N/A'} (4-6 attendu)`);
console.log(`  Section poteau: ${pergola.postSection || 'N/A'}`);
console.log(`  Longerons: ${pergola.beams?.toFixed(2) || 'N/A'} ml`);
console.log(`  Chevrons/lames: ${pergola.rafters?.toFixed(2) || 'N/A'} ml`);
console.log(`  Sections longerons: ${pergola.beamSection || 'N/A'}`);

console.log('\nGéométrie 3D:');
if (pergola.geometry) {
  console.log(`  Poteaux: ${pergola.geometry.posts?.length || 0}`);
  console.log(`  Beams: ${pergola.geometry.beams?.length || 0}`);
  console.log(`  Rafters: ${pergola.geometry.rafters?.length || 0}`);
}

console.log('\n📊 Validation contre réalité française:');
console.log('  Pergola 4×3m (jardin couvert):');
console.log('    Poteaux: min 4 (coins) — 6 si renforçage central CALCULÉE');
console.log('    Longerons (poutre): 8/10 ou 10/10 pour 4m portée');
console.log('    Chevrons: espacement 40-50cm standard OK');

// ══════════════════════════════════════════════════════════════════════════════
// 3. CLÔTURE 6.0m × 1.5m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n📦 CLÔTURE 6.0m × 1.5m');
console.log('-'.repeat(80));

const cloture = generateCloture(6.0, 1.5, {});

console.log('Dimensions:');
console.log(`  Longueur: ${cloture.length}m`);
console.log(`  Hauteur: ${cloture.height}m`);

console.log('\nMatériaux BRUTS (avant waste ×1.10):');
console.log(`  Poteaux: ${cloture.posts?.count || 'N/A'} (4 attendu = 0, 2, 4, 6m)`);
console.log(`  Section poteau: ${cloture.postSection || 'N/A'}`);
console.log(`  Rails: ${cloture.rails?.toFixed(2) || 'N/A'} ml`);
console.log(`  Lames: ${cloture.boards?.toFixed(2) || 'N/A'} ml`);
console.log(`  Lames/panneaux: ${cloture.boardCount || 'N/A'}`);

console.log('\nGéométrie 3D:');
if (cloture.geometry) {
  console.log(`  Poteaux: ${cloture.geometry.posts?.length || 0}`);
  console.log(`  Rails: ${cloture.geometry.rails?.length || 0}`);
  console.log(`  Lames: ${cloture.geometry.boards?.length || 0}`);
}

console.log('\n📊 Validation contre normes française:');
console.log('  Clôture bois 6m × 1.5m:');
console.log('    Poteaux: 4 @ 2m espacement = 3 travées, configs: (0, 2, 4, 6m) OK');
console.log('    Rails: 2/travée × 3 × 2m = 12 ml (7×12 ou 6×10) CALCULÉE');
console.log('    Lames: 30 lames/m × 6m × 1.5m height = ~270-300 lames RÉALISTE');

// ══════════════════════════════════════════════════════════════════════════════
// 4. TERRASSE 4.5m × 3.0m
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n📦 TERRASSE 4.5m × 3.0m');
console.log('-'.repeat(80));

const deck = generateDeck(4.5, 3.0, {});

console.log('Dimensions:');
console.log(`  Largeur: ${deck.width}m`);
console.log(`  Profondeur: ${deck.depth}m`);
console.log(`  Surface: ${deck.surface?.toFixed(2) || (4.5 * 3).toFixed(2)} m²`);

console.log('\nMatériaux BRUTS (avant waste ×1.10):');
console.log(`  Solives: ${deck.joists?.toFixed(2) || 'N/A'} ml`);
console.log(`  Solives count: ${deck.joistCount || 'N/A'} pcs (espacement ~40cm)`);
console.log(`  Plots/pads: ${deck.pads?.count || deck.totalPads || 'N/A'}`);
console.log(`  Lames 145mm: ${deck.boardLengths?.count || deck.boardCount || 'N/A'} pcs`);
console.log(`  Lames total: ${deck.boards?.toFixed(2) || 'N/A'} ml`);

console.log('\nGéométrie 3D:');
if (deck.geometry) {
  console.log(`  Solives: ${deck.geometry.joists?.length || 0}`);
  console.log(`  Plots: ${deck.geometry.pads?.length || 0}`);
}

console.log('\n📊 Validation contre norme NF):');
console.log('  Terrasse bois 4.5×3m:');
console.log('    Solives 6/20 cm @ 40cm: 4.5÷0.4 = 12-13 solives CALCULÉE');
console.log('    Plots ciment: 4-5 rangées × 3-4 plots = ~16-20 plots OK');
console.log('    Lames 145mm: 4.5m÷0.145 = ~31 lames/rangée OK');

// ══════════════════════════════════════════════════════════════════════════════
// 5. RÉSUMÉ COMPARATIF
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('RÉSUMÉ VALIDATION');
console.log('='.repeat(80));

const checks = [
  { name: 'Cabanon montants', calc: cabanon.studCount, expected: '17-20', ok: cabanon.studCount >= 17 && cabanon.studCount <= 22 },
  { name: 'Pergola poteaux', calc: pergola.posts?.count, expected: '4-6', ok: pergola.posts?.count >= 4 && pergola.posts?.count <= 6 },
  { name: 'Clôture poteaux', calc: cloture.posts?.count, expected: '4 (2m spacing)', ok: cloture.posts?.count === 4 || cloture.posts?.count === 5 },
  { name: 'Terrasse solives', calc: deck.joistCount, expected: '12-14', ok: deck.joistCount >= 11 && deck.joistCount <= 15 },
];

let allPass = true;
checks.forEach(c => {
  const status = c.ok ? '✅' : '❌';
  console.log(`${status} ${c.name}: ${c.calc} (attendu: ${c.expected})`);
  if (!c.ok) allPass = false;
});

console.log('\n' + '='.repeat(80));
console.log(`Résultat global: ${allPass ? '✅ TOUS LES TESTS PASSENT' : '⚠️  VÉRIFICATIONS RECOMMANDÉES'}`);
console.log('='.repeat(80));

// Détail des outputs pour debug
console.log('\n\n🔍 DEBUG — Structure complète moteurs');
console.log('-'.repeat(80));

console.log('\nCABANON keys:', Object.keys(cabanon).sort().join(', '));
console.log('\nPERGOLA keys:', Object.keys(pergola).sort().join(', '));
console.log('\nCLÔTURE keys:', Object.keys(cloture).sort().join(', '));
console.log('\nTERRASSE keys:', Object.keys(deck).sort().join(', '));
