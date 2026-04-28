# Charte graphique des plans techniques PDF — DIY Builder

> Document de référence EXPORT. Ne contient aucun code exécutable.
> Les propositions ci-dessous sont des spécifications pour guider l'implémentation.

---

## 1. Audit du langage graphique actuel

### 1.1 Architecture existante

Le système se décompose en **3 couches** :

```
Engine (geometry)  →  Builder (primitives)  →  Renderer (jsPDF)
     ↓                      ↓                       ↓
 données métier        objets visuels         tracé sur page
 (ne pas toucher)      (modifiable)           (modifiable)
```

**Fichiers clés :**

| Fichier | Rôle | Statut |
|---|---|---|
| `lib/plan/primitives.js` | 7 types (line, rect, polygon, polyline, text, dimension, legendItem), 11 couches ordonnées | Stable, bien conçu |
| `lib/plan/projections.js` | 5 projections (facade, top, section, oblique, fit) | Stable |
| `lib/plan/renderPDF.js` | Renderer générique, dispatch par type + LAYER_LW | Stable |
| `lib/plan/buildFacadeView.js` | Cabanon façade → primitives | Mature |
| `lib/plan/buildTopView.js` | Cabanon dessus → primitives | Mature |
| `lib/plan/buildSectionView.js` | Cabanon coupe → primitives | Mature |
| `lib/pdf/pdfDrawing.js` | Terrasse plan/coupe (legacy, pas de primitives) + orchestration cabanon | Mixte |

### 1.2 Modules et couverture graphique

| Module | BOM | Vue dessus | Façade | Coupe | Synthèse 3D | Système |
|---|---|---|---|---|---|---|
| **Cabanon** | Page 5 (complète) | Page 2 (primitives) | Page 3 (primitives) | Page 4 (primitives) | Page 1 (capture) | **Primitives** |
| **Terrasse** | Page 1 (inline) | Page 3 (legacy) | — | Page 4 (legacy) | — | **Legacy (pdfDrawing)** |
| **Pergola** | Page 1 (inline) | — | — | — | — | Pas de plans |
| **Clôture** | Page 1 (inline) | — | — | — | — | Pas de plans |

### 1.3 Deux systèmes graphiques coexistent

**Système A — Primitives (cabanon)** :
- Pipeline : `geometry → buildXxxView(geometry, viewport) → layers → renderPDFLayers(doc, layers)`
- Couleurs définies dans chaque builder (palette locale `C = { ... }`)
- Traits régis par `LAYER_LW` dans renderPDF.js
- Projections paramétrées (fitScale, px/py)
- Légende via `drawLegendBox()` dans pdfDrawing.js

**Système B — Legacy (terrasse)** :
- Pipeline : `generateDeck(w,d) → coordonnées brutes → dessin jsPDF inline`
- Couleurs hardcodées dans les fonctions draw
- Traits partiellement migrés vers `LW.*`
- Projections maison (sx/sz lambdas locales)
- Pas de légende

### 1.4 Palettes actuelles (audit)

#### Cabanon — Façade (`buildFacadeView`)
| Élément | Fill RGB | Stroke RGB | Layer |
|---|---|---|---|
| Contour murs | — | 30,30,50 | contours |
| Lisse basse | 225,210,180 | 90,70,45 | structurePrimary |
| Sablière haute | 220,205,175 | 100,80,60 | structurePrimary |
| Double sablière | 215,200,170 | 120,95,70 | structurePrimary |
| Montant régulier | 195,210,225 | 80,100,130 | structureSecondary |
| Montant king | 180,200,230 | 40,80,160 | structurePrimary |
| Montant coin | 185,205,225 | 50,90,140 | structurePrimary |
| Cripple | 200,215,230 | 110,140,165 | structureSecondary |
| Framing (linteau) | 240,220,190 | 170,95,35 | framings |
| Porte | 245,240,232 | 120,100,80 | openings |
| Fenêtre | 230,240,252 | 120,100,80 | openings |

#### Cabanon — Dessus (`buildTopView`)
| Élément | Fill RGB | Stroke RGB |
|---|---|---|
| Intérieur | 248,250,252 | — |
| Mur | 225,218,202 | 25,25,42 |
| Montant | 155,178,208 | 50,75,112 |
| Porte | 252,248,242 | 155,88,28 |
| Fenêtre | 230,240,255 | 45,88,155 |
| Chevron | — | 165,128,82 |

#### Cabanon — Coupe (`buildSectionView`)
| Élément | Fill RGB | Stroke RGB |
|---|---|---|
| Sol | 222,215,200 | 160,148,128 |
| Lisse basse | 235,215,170 | 110,82,40 |
| Montant | 175,198,225 | 55,82,120 |
| Sablière 1 | 230,208,165 | 120,90,45 |
| Sablière 2 | 218,195,152 | 135,100,55 |
| Chevron | 228,195,135 | 155,110,50 |
| OSB | 242,235,218 | 145,125,85 |
| Couverture | 75,82,100 | 40,45,60 |
| Bardage | 225,200,162 | 155,120,72 |

#### Terrasse — Plan/Coupe (legacy `pdfDrawing.js`)
| Élément | Couleur principale | Remarque |
|---|---|---|
| Fond plan | 237,231,218 | Beige chaud |
| Lame | 218,198,162 | + alternance |
| Lambourde | 128,142,165 | Gris bleu |
| Plot | 55,70,100 | Bleu foncé |
| Entretoise | 210,120,60 | Orange |
| Coupe sol | 222,212,198 | Beige |
| Coupe béton | 195,195,200 | Gris |

---

## 2. Charte graphique commune proposée

### 2.1 Principes directeurs

1. **Matériau = couleur** : chaque famille de matériau a une teinte constante inter-modules
2. **Fonction = trait** : le trait (épaisseur + style) code la fonction graphique, pas le matériau
3. **Cohérence inter-vues** : un montant a la même teinte en façade, dessus, et coupe
4. **Lisibilité > réalisme** : pas de photomapping, contrastes forts, fills pastels

### 2.2 Palette matériaux normalisée (proposition)

| Famille | Fill RGB | Stroke RGB | Code hex (fill) | Usage |
|---|---|---|---|---|
| **Ossature** (montants, poteaux) | 175,198,225 | 55,82,120 | `#AFC6E1` | Cabanon montants, pergola poteaux, clôture poteaux |
| **Lisses / rails** | 235,215,170 | 110,82,40 | `#EBD7AA` | Lisses basses/hautes cabanon, rails clôture |
| **Sablières** | 228,208,165 | 120,90,45 | `#E4D0A5` | Sablières, longerons pergola |
| **Chevrons / solives** | 228,195,135 | 155,110,50 | `#E4C387` | Chevrons toiture, lambourdes terrasse |
| **Bardage / lames** | 225,200,162 | 155,120,72 | `#E1C8A2` | Bardage cabanon, lames terrasse, lames clôture |
| **Couverture** | 75,82,100 | 40,45,60 | `#4B5264` | Bac acier, membrane |
| **OSB / voliges** | 242,235,218 | 145,125,85 | `#F2EBDA` | Panneaux, voliges |
| **Sol / fondation** | 222,215,200 | 160,148,128 | `#DED7C8` | Terrain naturel, hachures |
| **Béton** | 195,195,200 | 140,140,150 | `#C3C3C8` | Dalle, plots |
| **Porte** | 245,240,232 | 155,88,28 | `#F5F0E8` | Toutes ouvertures porte |
| **Fenêtre** | 230,240,255 | 45,88,155 | `#E6F0FF` | Toutes ouvertures fenêtre |
| **Contour** | — | 30,30,50 | — | Contour général de la structure |
| **Cote** | — | 50,50,50 | — | Lignes de cotation |

### 2.3 Traits normalisés (déjà en place via `LW`)

| Rôle | Épaisseur (mm) | Constante | Style |
|---|---|---|---|
| Contour principal | 0.50 | `LW.FORT` | Continu |
| Élément structurel | 0.35 | `LW.MOYEN` | Continu |
| Cotation, légende | 0.20 | `LW.FIN` | Continu |
| Grille, hachures | 0.10 | `LW.TRES_FIN` | Continu |
| Cadre cartouche | 0.30 | `LW.CADRE` | Continu |
| Élément en arrière-plan | 0.20 | `LW.FIN` | Tiret [2,1.5] |
| Projection invisible | 0.15 | — | Tiret [1,0.8] |

### 2.4 Typographie

| Usage | Taille | Style | Couleur |
|---|---|---|---|
| Titre page | 15pt | bold | 18,32,62 |
| Sous-titre | 9pt | normal | 100,110,130 |
| Label orientation | 8pt | bold | 25,25,42 |
| Cotation principale | 7pt | normal | 50,50,50 |
| Cotation détail | 5-5.5pt | normal | 90,75,50 |
| Label élément | 5pt | normal | couleur élément |
| Légende | 6.5pt | normal | 64,80,106 |
| Note technique | 7pt | italic | 106,112,128 |

### 2.5 Fond de plan

Toutes les vues techniques utilisent :
- Un rectangle arrondi de fond `(250, 252, 255)` avec coin 2mm
- Une grille 5mm en trait `(228, 230, 238)` à 0.08mm
- Produit par `drawGrid()` (déjà factorisé)

---

## 3. Mapping simulateur → geometry → primitives PDF

### 3.1 Pipeline de données

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────────┐
│   Engine     │ ──→ │   geometry   │ ──→ │  buildXxxView  │ ──→ │ renderPDF    │
│ (protected)  │     │  (struct)    │     │  (primitives)  │     │ Layers(doc)  │
└─────────────┘     └──────────────┘     └────────────────┘     └──────────────┘
      ↓                    ↓                     ↓
  calculs métier     positions, sections    rect/line/polygon
  ne pas toucher     orientation, taille    fill/stroke/layer
```

### 3.2 Geometry disponible par module

| Module | geometry.dimensions | geometry.éléments | Vues possibles |
|---|---|---|---|
| **Cabanon** | width, depth, height, slope, plateHeight | structuralStuds[], framings[], lisses{}, chevrons[], openings[], walls[], roof{} | Dessus, Façade, Coupe, Iso ✓ |
| **Terrasse** | (via generateDeck) width, depth | joistSegs[], boardSegs[], padPositions[], entretoiseSegs[] | Dessus (legacy), Coupe (legacy) |
| **Pergola** | width, depth, height, overhang, sections | posts[], beamsLong[], beamsShort[], rafters[] | Dessus ○, Façade ○, Coupe ○ |
| **Clôture** | width, height, postSpacing, sections | posts[], rails[], boards[] | Façade ○, Coupe ○ |

✓ = implémenté  |  ○ = geometry suffisante, builder à créer

### 3.3 Mapping matériaux → couches primitives

| Élément constructif | Layer primitives | Remarque |
|---|---|---|
| Contour bâti | `contours` | Trait fort, dessus tout |
| Toiture (chevrons, couverture) | `roof` | Coupe : sections coupées |
| Poteaux, montants, studs | `structurePrimary` | Éléments porteurs |
| Lisses, rails, entretoises | `structurePrimary` | Éléments horizontaux porteurs |
| Montants secondaires, cripples | `structureSecondary` | Trait plus fin |
| Bardage, lames, voliges | `structureSecondary` | Habillage |
| Portes, fenêtres | `openings` | Symboles normalisés |
| Linteaux, seuils | `framings` | Pièces d'encadrement |
| Contour fort externe | `outline` | Enveloppe visible |
| Cotations | `dimensions` | Toujours LW.FIN |
| Textes, labels, callouts | `labels` | Annotations |
| Légende | `legend` | Encadré en overlay |

---

## 4. Priorisation par module

### Priorité 1 — Pergola (quick win, geometry riche)

**Justification** : le engine produit déjà `geometry.posts[]`, `beamsLong[]`, `beamsShort[]`, `rafters[]` avec positions 3D exactes. Créer 2 builders (dessus + façade) est direct.

**Vues à créer** :
1. `buildPergolaTopView(geometry, viewport)` — poteaux carrés + chevrons parallèles + longerons
2. `buildPergolaFacadeView(geometry, viewport)` — poteaux verticaux + longerons horizontaux + chevrons en vue de bout

**Volume estimé** : ~150 lignes/builder. Pattern identique aux builders cabanon.

### Priorité 2 — Clôture (simple, geometry linéaire)

**Justification** : structure 2D simple (pas de profondeur). 1 vue façade = la vue principale.

**Vues à créer** :
1. `buildClotureElevation(geometry, viewport)` — poteaux verticaux + 2 rails horizontaux + lames verticales espacées
2. `buildClotureSection(geometry, viewport)` — optionnel : coupe transversale montrant poteau + ancrage sol

**Volume estimé** : ~100 lignes pour l'élévation. Section ~60 lignes.

### Priorité 3 — Terrasse (migration legacy → primitives)

**Justification** : les vues existent déjà (drawTechnicalPlan2D, drawCoupePage) mais en code jsPDF inline (système B). Migration vers le système de primitives pour cohérence graphique.

**Ce qui change** : pas de nouvelles vues, mais réécriture des 2 fonctions existantes sous forme de builders `buildTerrasseTopView` et `buildTerrasseSectionView`.

**Volume estimé** : ~200 lignes/builder (plus complexe car lames + joints + plots).

**Risque** : la terrasse utilise `generateDeck()` qui est protégé. Le builder devra consommer ses résultats sans modifier le engine.

### Priorité 4 — Cabanon (déjà complet)

Aucun travail graphique restant. Les 3 builders existent et sont matures.
Seul point d'amélioration possible : unifier la palette locale de chaque builder vers des constantes partagées (cf. §5).

---

## 5. Helpers et factorisations à créer (périmètre EXPORT)

### 5.1 Palette partagée : `lib/plan/palette.js` (NOUVEAU)

Centraliser les couleurs matériaux dans un fichier unique, remplaçant les palettes locales `C = {...}` de chaque builder.

```js
// Proposition de structure
export const MAT = {
  ossature:   { fill: [175,198,225], stroke: [55,82,120] },
  lisse:      { fill: [235,215,170], stroke: [110,82,40] },
  sabliere:   { fill: [228,208,165], stroke: [120,90,45] },
  chevron:    { fill: [228,195,135], stroke: [155,110,50] },
  bardage:    { fill: [225,200,162], stroke: [155,120,72] },
  couverture: { fill: [75,82,100],   stroke: [40,45,60] },
  osb:        { fill: [242,235,218], stroke: [145,125,85] },
  sol:        { fill: [222,215,200], stroke: [160,148,128] },
  beton:      { fill: [195,195,200], stroke: [140,140,150] },
  porte:      { fill: [245,240,232], stroke: [155,88,28] },
  fenetre:    { fill: [230,240,255], stroke: [45,88,155] },
  contour:    { stroke: [30,30,50] },
  dim:        { stroke: [50,50,50] },
};
```

**Impact** : les 3 builders cabanon importeraient `MAT` au lieu de définir `C` localement. Les nouveaux builders pergola/clôture l'utilisent dès le départ.

### 5.2 Helpers de vue : `drawTechnicalPage()` (factorisation dans `pdfDrawing.js`)

Les 3 pages plan du cabanon (façade, dessus, coupe) partagent un pattern identique :

```
1. pageTitle(doc, titre, sous-titre)
2. fond arrondi + drawGrid()
3. builder(geometry, viewport) → layers
4. renderPDFLayers(doc, layers)
5. drawLegendBox(doc, pos, items)
```

Factoriser en :

```js
export function drawTechnicalPage(doc, {
  title, subtitle, geometry,
  builder,              // buildFacadeView | buildTopView | ...
  viewport,             // { ox, oy, drawW, drawH } ou auto
  legendItems,          // [{ label, color, fill? }]
  legendPos,            // 'bottom-right' | 'top-right' | { x, y }
}) { ... }
```

**Impact** : réduit les 3 fonctions cabanon (drawCabanonPlanDetaille, PlanDessus, Coupe) à 3 appels de 5-10 lignes. Les nouveaux modules l'utilisent directement.

### 5.3 Helpers manquants dans `primitives.js`

| Helper | Usage | Priorité |
|---|---|---|
| `hatch(layer, x, y, w, h, angle, spacing, opts)` | Hachures diagonales normalisées (sol, coupe béton) | P2 |
| `arc(layer, cx, cy, r, startAngle, endAngle, opts)` | Arc d'ouverture porte (actuellement approximé par segments) | P3 |
| `callout(layer, fromX, fromY, toX, toY, label, opts)` | Ligne de repère + texte (actuellement inline dans buildSectionView) | P2 |

### 5.4 Exports `drawGrid` et `drawLegendBox`

Ces deux fonctions sont actuellement **privées** dans `pdfDrawing.js` (pas exportées). Elles doivent être exportées pour que les futurs modules puissent les utiliser sans duplication :

```js
export function drawGrid(doc, x, y, w, h, step = 5) { ... }
export function drawLegendBox(doc, x, y, items) { ... }
```

---

## 6. Plan d'exécution recommandé

| Phase | Contenu | Fichiers à créer/modifier |
|---|---|---|
| **P0** | Créer `palette.js` + exporter `drawGrid`/`drawLegendBox` | `lib/plan/palette.js` (new), `lib/pdf/pdfDrawing.js` |
| **P1** | Builder pergola dessus + façade | `lib/plan/buildPergolaTopView.js`, `lib/plan/buildPergolaFacadeView.js` |
| **P1** | Intégrer dans `pergolaPDF.js` (passer de 1 à 3 pages) | `ExportPDF/pergolaPDF.js` |
| **P2** | Builder clôture élévation | `lib/plan/buildClotureElevation.js` |
| **P2** | Intégrer dans `cloturePDF.js` (passer de 1 à 2 pages) | `ExportPDF/cloturePDF.js` |
| **P3** | Factoriser `drawTechnicalPage()` | `lib/pdf/pdfDrawing.js` |
| **P3** | Migrer cabanon vers `drawTechnicalPage()` | `lib/pdf/pdfDrawing.js` |
| **P4** | Migrer terrasse vers primitives | `lib/plan/buildTerrasseTopView.js`, `lib/plan/buildTerrasseSectionView.js` |
| **P4** | Aligner cabanon builders sur `palette.js` | `buildFacadeView.js`, `buildTopView.js`, `buildSectionView.js` |

---

## 7. Ce qui est déjà bien standardisé (ne pas refaire)

- Composition verticale des pages (constantes `PAGE` dans `pdfHelpers.js`)
- Cartouche uniforme sur toutes les pages (`cartouche()`)
- Notes techniques avec garde défensive (`drawNoteTechnique()`)
- BOM enrichie avec sections en mm (tous modules)
- Hiérarchie de traits `LW` + mapping `LAYER_LW`
- Système de primitives (`primitives.js` + `renderPDF.js`)
- Projections (`projections.js`)
- 3 builders cabanon matures
