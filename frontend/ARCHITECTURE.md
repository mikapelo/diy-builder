# ARCHITECTURE — DIY Builder Frontend

> Analyse structurelle complète — 2026-03-20
> Next.js 14 App Router · React 18 · Three.js 0.160 · jsPDF 4 · Vitest 4

---

## 1. Arbre des fonctionnalités

```
─(CORE) Moteur Terrasse DTU 51.4
│   ─(UTILITY) deckConstants.js
│   │       Source unique : sections lames/lambourdes/plots, entraxes, Y-positions
│   │       → utilisé par deckGeometry, deckEngine, DeckScene, TechnicalPlan,
│   │         ExportPDF, pdfHelpers, pdfDrawing
│   │
│   ─(UTILITY) deckGeometry.js → dépend de deckConstants
│   │       Fonctions pures : computeJoistCount, computePlotRows, buildBoardSegments,
│   │       buildJoistData, findCutXPositions, buildDoubleJoistSegs,
│   │       buildEntretoises, buildPadPositions
│   │       → utilisé par deckEngine
│   │
│   ─(CORE) deckEngine.js → dépend de deckConstants, utilise deckGeometry
│           Export : generateDeck(w, d), DTU
│           → utilisé par projectRegistry, DeckScene, TechnicalPlan, pdfDrawing
│
─(CORE) Moteur Cabanon DTU 31.1
│   ─(CORE) cabanon/engine.js
│   │   Export : generateCabanon(w, d, opts), wallDef(wallId, w, d, h, slope)
│   │   → utilisé par projectRegistry, CabanonScene
│   │
│   │   ─(SUB) wallStudH(wallId, u, w, h, slope)
│   │   │       Hauteur montant sous toit mono-pente
│   │   │       → utilisé par buildStructuralStuds, buildBracing
│   │   │
│   │   ─(SUB) wallDef(wallId, w, d, h, slope) → { toGlobal, toWorld, studHeight }
│   │   │       Abstraction mur : coord locales (u,v) → monde 3D
│   │   │       → utilisé par buildBracing, buildStructuralStuds,
│   │   │         CabanonScene (WallsMesh, FramingsGroup)
│   │   │
│   │   ─(SUB) axisAngleToEulerXYZ(ax, ay, az, angle)
│   │   │       Quaternion → Euler XYZ sans Three.js
│   │   │       → utilisé par buildBracing
│   │   │
│   │   ─(SUB) buildStructuralStuds(w, d, h, slope, openings)
│   │   │       Coins L + réguliers + king + jack + cripple studs
│   │   │       → déclenché par generateCabanon
│   │   │
│   │   ─(SUB) buildFramings(w, d, h, openings)
│   │   │       Linteaux + seuils fenêtre
│   │   │       → déclenché par generateCabanon
│   │   │
│   │   ─(SUB) buildBracing(w, d, h, slope)
│   │   │       Contreventement diagonal, coords 3D précompilées (cx,cy,cz,rx,ry,rz)
│   │   │       → déclenché par generateCabanon
│   │   │
│   │   ─(SUB) buildBasteings(w, d, h, slope)
│   │   │       Bastaings transversaux toiture [{ x, z }]
│   │   │       → déclenché par generateCabanon
│   │   │
│   │   ─(SUB) wallToLisse(w, z) → geoLisses { basses, hautes, hautes2 }
│   │   │       Segments lisses avec len3d, ang3d, mx3d, mz3d précompilés
│   │   │       → déclenché par generateCabanon
│   │   │
│   │   ─(SUB) geoRoof { vertices, angle, len }
│   │           Toiture mono-pente, angle + longueur rampant précalculés
│   │           → déclenché par generateCabanon
│   │
│   ─(UTILITY) cabanon/config.js
│           Métadonnées : id, label, pdfTitle, icon
│           → utilisé par projectRegistry, ExportPDF
│
─(CORE) Moteur Fondations DTU 20.1
│   ─(UTILITY) foundation/foundationCalculator.js
│           Export : calcFoundation(w, d, thickCm), FOUNDATION_PRICES
│           Zéro dépendance interne
│           → utilisé par DeckSimulator (useMemo), MaterialsList, ExportPDF, pdfDrawing
│
─(CORE) Registre de modules
│   ─(CORE) projectRegistry.js → dépend de deckEngine, generateCabanon, configs
│   │       Export : PROJECTS, getProject(type)
│   │       Mappe projectType → { engine, config }
│   │       → utilisé par useProjectEngine
│   │
│   ─(HOOK) useProjectEngine(type, w, d, opts) → core/useProjectEngine.js
│   │       dépend de projectRegistry (getProject)
│   │       déclenche generateDeck | generateCabanon via useMemo
│   │       → utilisé par DeckSimulator
│   │
│   ─(HOOK) useDeckSimulatorState() → core/useDeckSimulatorState.js
│           persiste dans DeckSimulator (width, depth, height, viewMode, foundationType, slabThickness)
│           déclenche useProjectEngine via re-render React
│           → utilisé par DeckSimulator
│
─(CORE) Système PDF
│   ─(UTILITY) pdf/pdfHelpers.js → dépend de deckConstants
│   │       Export : fmtLen, fmtPrice, boardRowSegs, joistColSegs, hArrow, vArrow
│   │       → utilisé par pdfDrawing, ExportPDF
│   │
│   ─(UTILITY) pdf/pdfDrawing.js → dépend de pdfHelpers, deckEngine, deckConstants, foundationCalculator
│           Export : footer, pageTitle, sectionTitle, drawTable,
│                    drawTechnicalPlan2D, drawCoupePage, generateCabanonPDF
│           → utilisé par ExportPDF
│
─(FEATURE) Simulateur Terrasse → app/calculateur/page.jsx
│   │   utilise Header, Footer, DeckSimulator(projectType="terrasse")
│   │
│   ─(FEATURE) DeckSimulator.jsx (orchestrateur partagé terrasse/cabanon)
│       │   dépend de useProjectEngine, useDeckSimulatorState, calcFoundation
│       │   charge DeckViewer | CabanonViewer via next/dynamic (ssr: false)
│       │   wrap viewers dans ErrorBoundary
│       │
│       ─(FEATURE) DeckViewer.jsx → 4 modes (assembled|structure|exploded|plan)
│       │   │   utilise Canvas (@react-three/fiber), OrbitControls
│       │   │
│       │   ─(SUB) DeckScene.jsx → dépend de deckConstants (import direct), structure (props)
│       │   │   │   utilise useFrame (animation explode), useRef, useMemo
│       │   │   │
│       │   │   ─(SUB) BoardsGroup → InstancedMesh lames bois
│       │   │   ─(SUB) JoistsGroup → InstancedMesh lambourdes
│       │   │   ─(SUB) PadsGroup → plots béton
│       │   │   ─(SUB) BandesGroup → bandes bitume interposition
│       │   │   ─(SUB) JointsGroup → lignes de coupe visuelles
│       │   │   ─(SUB) EntretoisesGroup → entretoises de blocage
│       │   │   ─(SUB) DoubleJoistsGroup → doublage aux coupes
│       │   │   ─(HOOK) useFrame → déclenche animation lerp explode/collapse
│       │   │
│       │   ─(SUB) TechnicalPlan.jsx (SVG) → dépend de deckEngine (generateDeck), deckConstants
│       │           Plan coté vue de dessus, légende interactive (useState)
│       │
│       ─(FEATURE) CabanonViewer.jsx → 5 modes (assembled|structure|detailed|exploded|plan)
│       │   │   utilise Canvas, OrbitControls
│       │   │
│       │   ─(SUB) CabanonScene.jsx → dépend de cabanon/engine (wallDef), structure.geometry (props)
│       │   │   │   utilise useFrame, useRef, useMemo, useEffect
│       │   │   │
│       │   │   ─(SUB) StudsGroup → InstancedMesh structuralStuds
│       │   │   ─(SUB) FramingsGroup → linteaux + seuils (wallDef.toWorld)
│       │   │   ─(SUB) LissesGroup → utilise l.mx3d, l.ang3d, l.len3d précompilés
│       │   │   ─(SUB) ChevronsGroup → utilise roof.angle, roof.len précompilés
│       │   │   ─(SUB) VoligesGroup → utilise roof.angle, roof.len précompilés
│       │   │   ─(SUB) BracingGroup → utilise b.cx,cy,cz,rx,ry,rz,len3d précompilés
│       │   │   ─(SUB) WallsMesh → 4 murs avec découpes ouvertures
│       │   │   ─(SUB) RoofMesh → toit mono-pente (double face, offset normal)
│       │   │   ─(SUB) DoorMesh / WindowMesh → vitrages + cadres
│       │   │   ─(HOOK) useFrame → déclenche animation explode/collapse
│       │   │
│       │   ─(SUB) CabanonSketch.jsx (SVG façade) → dépend de geometry (props)
│       │           Vue plan : studs (backward compat), openings, dimensions, slope
│       │
│       ─(SUB) DeckControls.jsx → déclenche setWidth, setDepth, setHeight,
│       │   │                      setFoundationType, setSlabThickness (via props)
│       │   │
│       │   ─(SUB) InputStepper (local)
│       │           ─(HOOK) useState warn → déclenche badge amber UX (min/max)
│       │
│       ─(SUB) MaterialsList.jsx → dépend de structure (props), slab.FOUNDATION_PRICES (props)
│       │       Rendu conditionnel : branche terrasse | branche cabanon
│       │
│       ─(SUB) PriceComparator.jsx → dépend de materialPrices (STORES via props)
│       │       Compare 3 enseignes, surligne le moins cher
│       │
│       ─(SUB) ExportPDF.jsx → dépend de pdfDrawing, pdfHelpers, deckConstants,
│       │                       foundationCalculator, materialPrices, jsPDF
│       │       Branche terrasse : 4 pages (récap + plan 2D + coupe + prix)
│       │       Branche cabanon : 1 page (via generateCabanonPDF)
│       │
│       ─(SUB) ErrorBoundary.jsx → wrap DeckViewer | CabanonViewer
│               Capture erreurs WebGL, bouton "Réessayer"
│
─(FEATURE) Simulateur Cabanon → app/cabanon/page.jsx
│       utilise Header, Footer, DeckSimulator(projectType="cabanon")
│       Même orchestrateur DeckSimulator, branche cabanon activée
│
─(FEATURE) Page d'accueil → app/page.jsx → app/HomeClient.jsx
│   │   utilise Header, Footer, useRouter, useSearchParams
│   │   state : view, formParams, resultat, loading, error
│   │
│   ─(HOOK) useCalculTerrasse → hooks/useCalculTerrasse.js
│   │       déclenche calculerTerrasseAPI (services/api.js)
│   │       persiste dans HomeClient (resultat, loading, error)
│   │       → déclenché par FormulaireTerrasse.onSubmit
│   │
│   ─(SUB) HeroSection.jsx → utilise useRouter, PROJETS (utils/projects.js)
│   │   │   Vitrine des projets disponibles + démo comparateur
│   │   │
│   │   ─(SUB) ProjectCard.jsx → dépend de PROJETS catalogue
│   │   ─(SUB) StorePill (local) → affichage enseigne
│   │   ─(SUB) HowItWorks (local) → étapes "comment ça marche"
│   │   ─(SUB) ComparateurDemo (local) → animation prix
│   │
│   ─(SUB) FormulaireTerrasse.jsx → déclenche useCalculTerrasse.calculer()
│   │       Inputs : largeur, longueur, type_bois (TYPES_BOIS)
│   │
│   ─(SUB) PlanTerrasse.jsx (SVG) → dépend de resultat (props)
│   │       Vue simplifiée terrasse pour la landing
│   │
│   ─(SUB) MaterialCard.jsx → affiche un matériau (nom, catégorie, quantité, unité)
│   │
│   ─(SUB) PriceComparator.jsx (shared) → dépend de resultat.detail (props)
│
─(FEATURE) Prévisualisation isométrique → DeckPreview.jsx
│       Rendu CSS pur (pas de Three.js) — animation construction 3 couches
│       ─(SUB) Boards.jsx → lames en SVG isométrique
│       ─(SUB) Joists.jsx → lambourdes + plots en SVG isométrique
│
─(UTILITY) Utilitaires partagés
│   ─(UTILITY) utils/format.js
│   │       Export : formatPrix, getPrixMin, capitalize, getStatsResume
│   │       → utilisé par HomeClient
│   │
│   ─(UTILITY) utils/projects.js
│   │       Export : PROJETS (catalogue : terrasse, cabanon, pergola*, clôture*)
│   │       → utilisé par HeroSection, ProjectCard
│   │
│   ─(UTILITY) services/api.js
│   │       Export : calculerTerrasseAPI, API_URL
│   │       → utilisé par useCalculTerrasse (exclusif)
│   │
│   ─(UTILITY) lib/materialPrices.js
│           Export : STORES [{ name, logo, rate }]
│           → utilisé par PriceComparator, ExportPDF
│
─(UTILITY) Infrastructure
    ─(SUB) Header.jsx → layout haut (logo, nav, boutons action)
    │       → utilisé par toutes les pages (page.jsx, cabanon/page, calculateur/page)
    │
    ─(SUB) Footer.jsx → layout bas (branding, features)
    │       → utilisé par toutes les pages
    │
    ─(SUB) RootLayout → app/layout.jsx → HTML <head>, fonts, favicon
    │
    ─(UTILITY) __tests__/cabanon-engine.test.js → 33 tests (wallDef, generateCabanon, geometry)
    ─(UTILITY) __tests__/deck-engine.test.js → tests generateDeck + invariants DTU
```

---

## 2. Table des relations

### A — Routage & Pages

| From | Relation | To |
|---|---|---|
| `app/page.jsx` | utilise | `HomeClient` |
| `app/page.jsx` | utilise | `Suspense` (React) |
| `app/calculateur/page.jsx` | utilise | `DeckSimulator` (projectType="terrasse") |
| `app/calculateur/page.jsx` | utilise | `Header`, `Footer` |
| `app/cabanon/page.jsx` | utilise | `DeckSimulator` (projectType="cabanon") |
| `app/cabanon/page.jsx` | utilise | `Header`, `Footer` |
| `app/layout.jsx` | wrap | toutes les pages (RootLayout) |

### B — Core : Registre & Hooks

| From | Relation | To |
|---|---|---|
| `projectRegistry` | importe | `generateDeck` (deckEngine) |
| `projectRegistry` | importe | `generateCabanon` (cabanon/engine) |
| `projectRegistry` | importe | `terrasseConfig`, `cabanonConfig` |
| `useProjectEngine` | dépend de | `projectRegistry.getProject()` |
| `useProjectEngine` | déclenche | `generateDeck` OU `generateCabanon` (via useMemo) |
| `useDeckSimulatorState` | persiste dans | `DeckSimulator` |
| `useDeckSimulatorState` | déclenche | `useProjectEngine` (via re-render) |

### C — Core : Moteur Terrasse

| From | Relation | To |
|---|---|---|
| `deckGeometry` | dépend de | `deckConstants` (toutes les constantes) |
| `deckEngine` | dépend de | `deckConstants` (JOIST_ENTRAXE, PAD_ENTRAXE, ENTR_SPACING, BOARD_LEN, JOIST_LEN) |
| `deckEngine` | utilise | `deckGeometry` (8 fonctions) |
| `modules/terrasse/index` | ré-exporte | `deckEngine.generateDeck`, `deckEngine.DTU`, `deckConstants.*` |

### D — Core : Moteur Cabanon

| From | Relation | To |
|---|---|---|
| `generateCabanon` | déclenche | `buildStructuralStuds` |
| `generateCabanon` | déclenche | `buildFramings` |
| `generateCabanon` | déclenche | `buildBracing` |
| `generateCabanon` | déclenche | `buildBasteings` |
| `generateCabanon` | déclenche | `wallToLisse` (→ geoLisses) |
| `generateCabanon` | utilise | `wallDef`, `wallStudH` |
| `buildStructuralStuds` | utilise | `wallDef.toGlobal`, `wallStudH` |
| `buildBracing` | utilise | `wallDef.toWorld`, `wallStudH`, `axisAngleToEulerXYZ` |
| `modules/cabanon/index` | ré-exporte | `generateCabanon`, `cabanonConfig` |

### E — Core : Fondations

| From | Relation | To |
|---|---|---|
| `foundationCalculator` | dépend de | rien (autonome) |
| `DeckSimulator` | utilise | `calcFoundation` (via useMemo) |
| `MaterialsList` | dépend de | `FOUNDATION_PRICES` (via props slab) |
| `ExportPDF` | dépend de | `FOUNDATION_PRICES` |
| `pdfDrawing` | dépend de | `FOUNDATION_PRICES` |

### F — Orchestrateur Simulateur

| From | Relation | To |
|---|---|---|
| `DeckSimulator` | déclenche | `useDeckSimulatorState()` |
| `DeckSimulator` | déclenche | `useProjectEngine(type, w, d, opts)` |
| `DeckSimulator` | utilise | `calcFoundation` (useMemo, si fondationType="slab") |
| `DeckSimulator` | utilise | `DeckControls` (props : setters) |
| `DeckSimulator` | utilise | `MaterialsList` (props : structure, slab) |
| `DeckSimulator` | utilise | `PriceComparator` (props : surface) |
| `DeckSimulator` | utilise | `ExportPDF` (props : structure, slab, config) |
| `DeckSimulator` | charge (dynamic) | `DeckViewer` (si terrasse, ssr:false) |
| `DeckSimulator` | charge (dynamic) | `CabanonViewer` (si cabanon, ssr:false) |
| `DeckSimulator` | wrap dans | `ErrorBoundary` |

### G — Rendu 3D Terrasse

| From | Relation | To |
|---|---|---|
| `DeckViewer` | utilise | `Canvas` (@react-three/fiber) |
| `DeckViewer` | utilise | `OrbitControls` (@react-three/drei) |
| `DeckViewer` | utilise | `DeckScene` (props : structure, sceneMode) |
| `DeckViewer` | utilise | `TechnicalPlan` (mode plan uniquement) |
| `DeckScene` | dépend de | `deckConstants` (import direct — Y_PAD, Y_JOIST, Y_BOARD, etc.) |
| `DeckScene` | dépend de | `deckEngine.generateDeck` (import direct) |
| `DeckScene` | déclenche | `useFrame` (animation explode) |
| `TechnicalPlan` | dépend de | `deckConstants` (BOARD_WIDTH, BOARD_LEN, JOIST_W, PAD_SIZE) |
| `TechnicalPlan` | dépend de | `deckEngine.generateDeck` (recalcul local) |

### H — Rendu 3D Cabanon

| From | Relation | To |
|---|---|---|
| `CabanonViewer` | utilise | `Canvas`, `OrbitControls` |
| `CabanonViewer` | utilise | `CabanonScene` (props : structure, sceneMode) |
| `CabanonViewer` | utilise | `CabanonSketch` (mode plan uniquement) |
| `CabanonScene` | dépend de | `cabanon/engine.wallDef` (import direct) |
| `CabanonScene` | dépend de | `structure.geometry` (props — données précompilées) |
| `CabanonScene.LissesGroup` | utilise | `l.mx3d, l.ang3d, l.len3d` (précompilés engine) |
| `CabanonScene.ChevronsGroup` | utilise | `roof.angle, roof.len` (précompilés engine) |
| `CabanonScene.VoligesGroup` | utilise | `roof.angle, roof.len` (précompilés engine) |
| `CabanonScene.BracingGroup` | utilise | `b.cx, b.cy, b.cz, b.rx, b.ry, b.rz, b.len3d` (précompilés engine) |
| `CabanonScene.FramingsGroup` | utilise | `wallDef.toWorld` (import engine) |
| `CabanonScene.WallsMesh` | utilise | `wallDef.toWorld` (import engine) |
| `CabanonScene` | déclenche | `useFrame` (animation explode) |
| `CabanonSketch` | dépend de | `geometry.studs` (backward compat), `geometry.openings`, `geometry.dimensions` |

### I — Système PDF

| From | Relation | To |
|---|---|---|
| `ExportPDF` | utilise | `jsPDF` (lib externe) |
| `ExportPDF` | utilise | `pdfDrawing` (footer, pageTitle, sectionTitle, drawTable, drawTechnicalPlan2D, drawCoupePage, generateCabanonPDF) |
| `ExportPDF` | utilise | `pdfHelpers` (boardRowSegs, joistColSegs, fmtLen, fmtPrice) |
| `ExportPDF` | dépend de | `deckConstants` (BOARD_LEN, JOIST_LEN) |
| `ExportPDF` | dépend de | `foundationCalculator` (FOUNDATION_PRICES) |
| `ExportPDF` | dépend de | `materialPrices` (STORES) |
| `pdfDrawing` | utilise | `pdfHelpers` (hArrow, vArrow, fmtLen, fmtPrice) |
| `pdfDrawing` | utilise | `deckEngine.generateDeck` |
| `pdfDrawing` | dépend de | `deckConstants` (BOARD_WIDTH, JOIST_W, PAD_SIZE) |
| `pdfDrawing` | dépend de | `foundationCalculator` (FOUNDATION_PRICES) |
| `pdfHelpers` | dépend de | `deckConstants` (BOARD_LEN, JOIST_LEN) |

### J — Page d'accueil

| From | Relation | To |
|---|---|---|
| `HomeClient` | déclenche | `useCalculTerrasse()` |
| `HomeClient` | utilise | `Header`, `Footer` |
| `HomeClient` | utilise | `FormulaireTerrasse`, `PlanTerrasse`, `MaterialCard` |
| `HomeClient` | utilise | `HeroSection`, `PriceComparator` (shared) |
| `HomeClient` | dépend de | `utils/format` (getStatsResume) |
| `HomeClient` | dépend de | `useRouter`, `useSearchParams`, `usePathname` (Next.js) |
| `useCalculTerrasse` | utilise | `services/api.calculerTerrasseAPI` |
| `useCalculTerrasse` | persiste dans | `HomeClient` (resultat, loading, error) |
| `FormulaireTerrasse` | déclenche | `useCalculTerrasse.calculer()` (via props onSubmit) |
| `HeroSection` | utilise | `utils/projects.PROJETS` |
| `HeroSection` | utilise | `ProjectCard` |
| `HeroSection` | déclenche | `useRouter.push` (navigation) |

### K — Contrôles & UI partagée

| From | Relation | To |
|---|---|---|
| `DeckControls` | déclenche | `setWidth`, `setDepth`, `setHeight` (via props) |
| `DeckControls` | déclenche | `setFoundationType`, `setSlabThickness` (via props) |
| `InputStepper` | déclenche | `setValue` (via props) |
| `InputStepper` | déclenche | `useState.warn` (état local min/max) |
| `MaterialsList` | dépend de | `structure` (props) |
| `MaterialsList` | dépend de | `slab` (props — FOUNDATION_PRICES inclus) |
| `PriceComparator` | dépend de | `materialPrices.STORES` (via props) |
| `ErrorBoundary` | wrap | `DeckViewer`, `CabanonViewer` |

---

## 3. Fichiers critiques par fonctionnalité

### Moteur Terrasse (DTU 51.4) — NE PAS MODIFIER

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| CRITIQUE | `lib/deckConstants.js` | Constantes DTU — source unique de vérité | deckGeometry, deckEngine, DeckScene, TechnicalPlan, ExportPDF, pdfHelpers, pdfDrawing |
| CRITIQUE | `lib/deckGeometry.js` | 8 fonctions géométrie pures | deckEngine |
| CRITIQUE | `lib/deckEngine.js` | Orchestrateur calcul terrasse | projectRegistry, DeckScene, TechnicalPlan, pdfDrawing |

### Moteur Cabanon (DTU 31.1)

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| CRITIQUE | `modules/cabanon/engine.js` | Calculs + géométrie complète (521 lignes) | projectRegistry, CabanonScene |
| BASSE | `modules/cabanon/config.js` | Métadonnées UI (label, icon) | projectRegistry, ExportPDF |

### Moteur Fondations (DTU 20.1) — NE PAS MODIFIER

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| CRITIQUE | `lib/foundation/foundationCalculator.js` | Calcul dalle béton + prix | DeckSimulator, MaterialsList, ExportPDF, pdfDrawing |

### Registre & State

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| HAUTE | `core/projectRegistry.js` | Mappe type → engine + config | useProjectEngine |
| HAUTE | `core/useProjectEngine.js` | Hook générique moteur | DeckSimulator |
| MOYENNE | `core/useDeckSimulatorState.js` | État centralisé simulateur | DeckSimulator |

### Simulateur (composants)

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| HAUTE | `components/simulator/DeckSimulator.jsx` | Orchestrateur UI (147 lignes) | calculateur/page, cabanon/page |
| HAUTE | `components/simulator/DeckScene.jsx` | Scène Three.js terrasse | DeckViewer |
| HAUTE | `components/simulator/CabanonScene.jsx` | Scène Three.js cabanon | CabanonViewer |
| HAUTE | `components/simulator/DeckViewer.jsx` | Canvas + modes terrasse | DeckSimulator (dynamic) |
| HAUTE | `components/simulator/CabanonViewer.jsx` | Canvas + modes cabanon | DeckSimulator (dynamic) |
| MOYENNE | `components/simulator/TechnicalPlan.jsx` | SVG plan coté terrasse | DeckViewer |
| MOYENNE | `components/simulator/CabanonSketch.jsx` | SVG façade cabanon | CabanonViewer |
| MOYENNE | `components/simulator/DeckControls.jsx` | Inputs dimensions + fondation | DeckSimulator |
| MOYENNE | `components/simulator/MaterialsList.jsx` | Liste matériaux bimodale | DeckSimulator |
| MOYENNE | `components/simulator/ExportPDF.jsx` | Génération PDF jsPDF | DeckSimulator |
| BASSE | `components/simulator/PriceComparator.jsx` | Comparaison 3 enseignes | DeckSimulator |

### Système PDF

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| HAUTE | `lib/pdf/pdfDrawing.js` | Dessin pages PDF (676 lignes) | ExportPDF |
| MOYENNE | `lib/pdf/pdfHelpers.js` | Helpers purs (formatage + flèches) | pdfDrawing, ExportPDF |

### Page d'accueil

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| HAUTE | `app/HomeClient.jsx` | Landing page complète (269 lignes) | app/page.jsx |
| MOYENNE | `hooks/useCalculTerrasse.js` | Hook API terrasse | HomeClient |
| MOYENNE | `services/api.js` | Couche fetch backend | useCalculTerrasse |
| BASSE | `components/features/terrasse/FormulaireTerrasse.jsx` | Formulaire saisie | HomeClient |
| BASSE | `components/features/shared/HeroSection.jsx` | Vitrine projets | HomeClient |

### Infrastructure

| Criticité | Fichier | Rôle | Dépendants |
|---|---|---|---|
| HAUTE | `app/layout.jsx` | RootLayout Next.js | toutes les pages |
| MOYENNE | `components/ErrorBoundary.jsx` | Filet sécurité WebGL | DeckSimulator |
| MOYENNE | `components/layout/Header.jsx` | Navigation sticky | toutes les pages |
| BASSE | `components/layout/Footer.jsx` | Pied de page | toutes les pages |
| BASSE | `utils/format.js` | Formatage prix/texte | HomeClient |
| BASSE | `utils/projects.js` | Catalogue projets | HeroSection |
| BASSE | `lib/materialPrices.js` | Tarifs enseignes | PriceComparator, ExportPDF |

### Tests

| Criticité | Fichier | Rôle | Couvre |
|---|---|---|---|
| MOYENNE | `__tests__/cabanon-engine.test.js` | 33 tests | wallDef, generateCabanon, geometry précompilée |
| MOYENNE | `__tests__/deck-engine.test.js` | Tests terrasse | generateDeck, invariants DTU |

---

## 4. Invariants architecturaux

| Invariant | Description |
|---|---|
| Engine / Render séparés | Zéro import Three.js dans `lib/` et `modules/*/engine.js` |
| Géométrie précompilée | Engine calcule tout (coords 3D, angles, longueurs) — Scene affiche uniquement |
| SSR avoidance | Three.js chargé via `dynamic(ssr: false)` — jamais de rendu serveur WebGL |
| Source unique | `deckConstants.js` (terrasse), `cabanon/engine.js` (cabanon), `foundationCalculator.js` (dalle) |
| Testabilité | `lib/` et `modules/*/engine.js` = modules Node purs, 0 dépendance React |
| Fichiers protégés | `lib/deckEngine.js`, `lib/deckConstants.js`, `lib/deckGeometry.js`, `lib/foundation/foundationCalculator.js` |
| Backward compat | `geometry.studs` conservé pour CabanonSketch SVG ; `structuralStuds` pour 3D |
| Module pattern | Nouveau module = `modules/[nom]/{engine,config,index}.js` + entrée dans `projectRegistry` |
