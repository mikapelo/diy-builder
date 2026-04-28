# DIY Builder — Contexte projet pour Claude

## Vue d'ensemble

Simulateur de construction DIY modulaire — Next.js 14, React 18, Three.js.
Permet de calculer les matériaux et visualiser en 3D des projets de bricolage.
URL locale : `http://localhost:57723` (serveur Preview MCP actif)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 App Router |
| UI | React 18 + Tailwind CSS 3.4 |
| 3D | Three.js 0.160 + @react-three/fiber 8 + @react-three/drei 9 |
| PDF | jsPDF 4 |
| Rendu SSR | `'use client'` + `dynamic(() => ..., { ssr: false })` pour Three.js |

---

## Architecture générale

```
frontend/
├── app/
│   ├── page.jsx                    # Landing page (→ HomeClient.jsx)
│   ├── HomeClient.jsx              # Client component landing
│   ├── cabanon/page.jsx            # Simulateur cabanon
│   ├── calculateur/page.jsx        # Calculateur terrasse
│   ├── pergola/page.jsx            # Simulateur pergola
│   └── cloture/page.jsx            # Simulateur clôture
├── core/
│   ├── projectRegistry.js          # Registre des 4 modules
│   └── useProjectEngine.js         # Hook générique : engine(width, depth, options)
├── modules/
│   ├── cabanon/
│   │   ├── engine.js               # ⚠️ MOTEUR — calculs + geometry
│   │   ├── config.js               # Métadonnées (label, icon, pdfTitle)
│   │   └── index.js
│   ├── terrasse/
│   │   ├── config.js
│   │   └── index.js
│   ├── pergola/
│   │   ├── engine.js               # Moteur pergola — poteaux, longerons, chevrons
│   │   ├── config.js
│   │   └── index.js
│   └── cloture/
│       ├── engine.js               # Moteur clôture — poteaux, rails, lames
│       ├── config.js
│       └── index.js
├── lib/
│   ├── deckEngine.js               # Moteur terrasse (NE PAS MODIFIER)
│   ├── deckConstants.js            # Constantes terrasse (NE PAS MODIFIER)
│   ├── deckGeometry.js             # Géométrie terrasse (NE PAS MODIFIER)
│   ├── costCalculator.js           # Calcul coûts — source unique waste factor (×1.10)
│   ├── materialPrices.js           # Prix matériaux + STORES (source unique)
│   ├── cabanonConstants.js         # Constantes cabanon
│   ├── clotureConstants.js         # Constantes clôture
│   ├── pergolaConstants.js         # Constantes pergola
│   └── foundation/
│       └── foundationCalculator.js # Calcul fondations (NE PAS MODIFIER)
├── hooks/
│   ├── useScrollTunnel.js          # Scroll reveal + soft-snap tunnel
│   └── usePDFExport.js             # Hook export PDF multi-module
├── styles/
│   ├── globals.css                 # Hub d'imports (17 lignes)
│   ├── base.css                    # :root tokens, reset, animations, boutons
│   ├── simulator.css               # Layout simulateur, tunnel, composants
│   ├── landing.css                 # Hero V6, showcase, bento, stats
│   ├── theme-g-v2.css              # Phosphor + [data-theme="g-v2"] overrides
│   └── TOKENS.md                   # Référence design tokens
└── components/
    ├── simulator/
    │   ├── DeckSimulator.jsx       # Orchestrateur (196 lignes, décomposé)
    │   ├── ViewerRouter.jsx        # Route vers le bon viewer 3D
    │   ├── TunnelSections.jsx      # 5 blocs résultats verticaux
    │   ├── BudgetComparator.jsx    # Budget + comparaison enseignes
    │   ├── CabanonScene.jsx        # Scène Three.js cabanon
    │   ├── CabanonViewer.jsx       # Wrapper Canvas + modes
    │   ├── CabanonSketch.jsx       # Vue SVG façade (mode Plan)
    │   └── ExportPDF/              # Sous-dossier génération PDF
    ├── ui/
    │   ├── ModuleHeader.jsx        # En-tête compact module (titre + sous-titre)
    │   ├── StructuralDisclaimer.jsx # Note DTU discrète avec tooltip
    │   ├── ProjectSwitch.jsx       # Sélecteur de module
    │   └── BrandIcon.jsx           # Icônes scope g-v2
    └── layout/
        ├── Header.jsx              # Nav (view="home" | view="module")
        └── Footer.jsx
```

---

## Règle ABSOLUE — Ne jamais modifier

```
lib/deckEngine.js
lib/deckConstants.js
lib/deckGeometry.js
lib/foundation/foundationCalculator.js
```

Ces fichiers contiennent les calculs matériaux validés. Toute modification
doit être dans la couche geometry de `modules/cabanon/engine.js` uniquement.

---

## Module Cabanon — Constantes

```js
STUD_SPACING = 0.60   // entraxe montants (m) — DTU-like
ROOF_COEF    = 1.10   // majoration toiture mono-pente (matériaux + pertes)
DEFAULT_HEIGHT = 2.30 // hauteur standard (m)
SECTION      = 0.09   // section pièces bois 9×9 cm (m)
CORNER_ZONE  = 0.12   // zone de coin sans montant régulier (m)
LINTEL_H     = 0.12   // hauteur linteau (m)
SILL_H       = 0.09   // hauteur seuil/appui fenêtre (= SECTION)
```

**Important :** `ROOF_COEF` (quantitatif matériaux) ≠ `slope` (géométrie 3D).
- `slope = width * SLOPE_RATIO` (0.268) → dénivelé géométrique mono-pente (~15°)
- `plateHeight = height + 2 * SECTION` → base réelle des chevrons

---

## Module Cabanon — Structure geometry

`generateCabanon(width, depth, options)` retourne :

```js
{
  // ── Calculs matériaux (NE PAS TOUCHER) ──
  surface, perimeter, wallArea, roofArea, height,
  studCount, studs, lissesBasses, lissesHautes,
  chevrons, bardage, voliges, contreventement,

  // ── Couche géométrie 3D (modifiable) ──
  geometry: {
    dimensions: { width, depth, height, slope, plateHeight, roofBaseY },
    walls:           [{ start:[x,y], end:[x,y], height }],  // 4 murs
    studs:           [{ x, y, z, height }],                  // BACKWARD COMPAT uniquement
    structuralStuds: [{ x, y, height, zBase }],              // Ossature complète pour 3D
    framings:        [{ cx, zBottom, w, hh }],               // Linteaux + seuils
    lisses:          { basses, hautes, hautes2 },             // Listes de segments
    roof:            { vertices: [[x,y,z]×4] },
    chevrons:        [{ y, x1, x2, z1, z2 }],                // z1=plateHeight
    openings:        { door: {wall,x,y,width,height}, window: {wall,x,y,width,height} },
  }
}
```

### structuralStuds — contenu

1. **Coins en L** : 2 montants/coin × 4 coins = 8 (overlap intentionnel ~4.5cm)
2. **Studs réguliers** : entraxe 60cm, excluant coins et zones d'ouverture
3. **King studs** : montants pleine hauteur aux bords de chaque ouverture
4. **Jack studs** : montants trimmer (hauteur = ouverture), intérieur des kings
5. **Cripple studs** : au-dessus linteaux + sous fenêtre (zBase=0)

### framings — contenu

| Index | Élément | zBottom |
|---|---|---|
| 0 | Linteau porte | door.height - LINTEL_H |
| 1 | Linteau fenêtre | win.y + win.height |
| 2 | Seuil fenêtre | win.y - SILL_H |

---

## Module Cabanon — Ouvertures par défaut

```js
door:   { wall:0, x: width*0.15, y:0,   width:0.9, height:2.0 }
window: { wall:0, x: width*0.62, y:1.0, width:0.6, height:0.6 }
```

Wall 0 = façade avant (y=0 en coordonnées engine).

---

## CabanonScene — Architecture modes

```
sceneMode : 'assembled' | 'structure' | 'detailed' | 'exploded' | 'plan'
```

| Mode | Ossature | Murs | Toit | Voliges | Animation |
|---|---|---|---|---|---|
| assembled | ❌ | ✅ opaque | ✅ | ❌ | — |
| structure | ✅ | ❌ | ❌ | ❌ | — |
| detailed | ✅ | ✅ transparent | ✅ | ✅ | — |
| exploded | ✅ | ✅ transparent | ✅ | ✅ | toit +1m, murs +0.5m |
| plan | — | — | — | — | SVG CabanonSketch |

**Règles render :**
- `StudsGroup` lit `structuralStuds` via InstancedMesh — zéro filtrage
- `FramingsGroup` lit `framings` — boîtes horizontales façade
- `ChevronsGroup` utilise `c.z1` directement (= plateHeight à la source)
- `visible={bool}` préféré à `{condition && <group>}` pour garder les refs Three.js
- `key={sceneKey}` sur `<CabanonScene>`, jamais sur `<Canvas>` (évite le flash noir)

---

## Ajout d'un nouveau module

```
1. Créer modules/[nom]/engine.js    → function generate[Nom](width, depth, options)
2. Créer modules/[nom]/config.js    → export const [nom]Config = { id, label, … }
3. Créer modules/[nom]/index.js     → re-export
4. Ajouter dans core/projectRegistry.js
5. Créer app/[nom]/page.jsx
6. Créer components/simulator/[Nom]Viewer.jsx + [Nom]Scene.jsx
```

Modules actifs : terrasse, cabanon, pergola, clôture (4/4 opérationnels).

---

## Tests

### Unit tests (Vitest)
```
npm test                    # depuis frontend/
```
| Fichier | Couverture |
|---|---|
| `__tests__/cabanon-engine.test.js` | wallStudH, generateCabanon, geometry, edge cases |
| `__tests__/pergola-engine.test.js` | computeRafters, structure, BOM, geometry |
| `__tests__/deck-engine.test.js` | joistCount, totalPads, boardSegs |
| `__tests__/cloture-engine.test.js` | quantitatifs, geometry posts/rails/boards, invariants |
| `__tests__/costCalculator.test.js` | guards, mapping 4 types, waste factor, fondations |
| `__tests__/components/...` | PriceComparator, ExportPDF, DeckControls, MaterialsList |
| `__tests__/hooks/...` | useProjectEngine, useDeckSimulatorState |

### E2E (Playwright)
```
npm run test:e2e            # depuis frontend/
```
| Fichier | Tests |
|---|---|
| `e2e/terrasse.spec.js` | T1 chargement, T2 largeur→surface, T3 onglets mode |
| `e2e/cabanon.spec.js` | C1 contrôles, C2 onglets+Plan, C3 export PDF |
| `e2e/pergola.spec.js` | P1 chargement, P2 contrôles, P3 matériaux, P4 PDF |
| `e2e/cloture.spec.js` | CL1 chargement, CL2 contrôles, CL3 matériaux, CL4 longueur, CL5 PDF |

### Waste factor
Source unique : `costCalculator.js` → `WOOD_WASTE_FACTOR = 1.10`.
Les engines retournent des quantités brutes. Ne JAMAIS ajouter de waste dans un engine.

---

## Styles CSS — Architecture post-split

```
styles/globals.css  →  @import './base.css'
                       @import './simulator.css'
                       @import './landing.css'
                       @import './theme-g-v2.css'
```
Voir `styles/TOKENS.md` pour la référence complète des design tokens.

---

## Outils disponibles en session

| Outil | Usage |
|---|---|
| `preview_start("frontend")` | Lance/réutilise le serveur Next.js |
| `preview_screenshot` | Screenshot instantané sans rechargement |
| `preview_eval` | Injecter JS, lire geometry React, auditer |
| Chrome MCP `tabId:460913300` | Interaction réelle (clic, zoom, OrbitControls) |
| PDF skill | Générer devis / lire specs techniques |
| XLSX skill | Exporter BOM en Excel |
| Simplify skill | Audit qualité du code après refactor |

### Accéder à geometry depuis le navigateur

```js
(function() {
  function findStructure(dom) {
    const key = Object.keys(dom).find(k => k.startsWith('__reactFiber'));
    if (!key) return null;
    let fiber = dom[key];
    while (fiber) {
      if (fiber.memoizedProps?.structure?.geometry?.structuralStuds)
        return fiber.memoizedProps.structure;
      fiber = fiber.return;
    }
  }
  return findStructure(document.querySelector('canvas'))?.geometry;
})()
```

---

## Documents techniques de référence

Déposer dans `.claude/docs/` pour lecture à la demande :

| Fichier | Contenu |
|---|---|
| `cabanon_synthese.pdf` | Specs DTU cabanon (sections, entraxes, règles) |
| *(à venir)* | Catalogue prix fournisseurs |
| *(à venir)* | DTU ossature bois complet |

---

## Historique des décisions clés

| Décision | Raison |
|---|---|
| `structuralStuds` séparé de `studs` | `studs` = backward compat BOM + SVG ; `structuralStuds` = 3D propre |
| `key` sur `<CabanonScene>` pas `<Canvas>` | Évite destruction contexte WebGL → flash noir |
| `visible={bool}` vs `{cond && <group>}` | Garde les refs useFrame vivants pour animation |
| Roof thickness via offset normal | Double-face coplanaire → Z-fighting ; offset perpendiculaire = propre |
| `slope` ≠ `ROOF_COEF` | slope = géométrie pure ; ROOF_COEF = facteur matériaux (pertes) |
| `zBase=0` cripples sous fenêtre | Posés sur lisse basse, pas sur le seuil |
| Chevrons filtrés `y <= depth` | Évite chevron fantôme généré par `Math.ceil + 1` |
| `wallStudH(wallId, u, width, h, slope)` | Hauteur variable par montant — toit flottant corrigé. Wall1=h+slope, Wall3=h, Walls0/2 interpolés linéairement selon x |
| `buildBasteings(w, d, h, slope)` | Chaque bastaing à sa hauteur réelle (x/width)*slope+plateThk — suit la pente |
| `geoWalls[1].height = h+slope` | Wall droite (côté haut) correctement documentée dans la structure de données |
