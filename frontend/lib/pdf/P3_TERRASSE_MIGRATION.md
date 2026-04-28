# P3 — Note de décision : migration terrasse vers primitives

> Document EXPORT-only. Aucun code exécutable.
> Base de décision pour la migration du pipeline PDF terrasse.

---

## 1. Audit des fonctions legacy

### 1.1 `drawTechnicalPlan2D` (pdfDrawing.js L255-523)

**Rôle** : vue de dessus de la terrasse — lames, lambourdes, entretoises, plots, coupes.

| Aspect | Détail |
|---|---|
| **Lignes** | ~270 lignes |
| **Appel engine** | `generateDeck(width, depth)` appelé **en interne** |
| **Projection** | Maison : `sx(wx)`, `sz(wz)` lambdas locales (centré sur 0,0) |
| **Couleurs** | 12 valeurs RGB hardcodées |
| **Clipping** | Clipping manuel `Math.max(bx, px0)` / `Math.min(bx+bw, px1)` sur chaque élément |
| **Légende** | Inline (rectangles + texte à `legY`), pas `drawLegendBox` |
| **Cotations** | `hArrow` / `vArrow` legacy (depuis pdfHelpers) + cotations entraxe maison |
| **Footer** | `footer(doc, pageNum, totalPages)` — ancien système (avant cartouche) |
| **Phases de dessin** | 9 phases : fond → lames → lambourdes → doubles lambourdes → tirets coupes → tirets joints → entretoises → plots → bordure |
| **Complexité spécifique** | Alternance lames (grain intérieur), doubles lambourdes aux coupes, tirets de joints lambourdes |

**Dépendances internes** :
- `generateDeck()` — appel direct dans le corps de la fonction
- `BOARD_WIDTH`, `JOIST_W`, `PAD_SIZE` depuis `deckConstants.js`
- `hArrow`, `vArrow`, `LW` depuis `pdfHelpers.js`
- `pageTitle`, `footer` depuis même fichier

### 1.2 `drawCoupePage` (pdfDrawing.js L528-693)

**Rôle** : coupe transversale schématique — empilement lame/lambourde/plot/sol.

| Aspect | Détail |
|---|---|
| **Lignes** | ~165 lignes |
| **Appel engine** | Aucun — reçoit `joistCount`, `foundationType`, `thicknessCm` en paramètres |
| **Projection** | Échelle fixe `SC=0.28` (1:4 environ), pas de fitScale |
| **Couleurs** | ~15 valeurs RGB hardcodées |
| **Légende** | Pas de légende — annotations latérales `elementLabel()` (helper local) |
| **Cotations** | `hArrow` / `vArrow` pour toutes les dimensions en mm |
| **Notes** | Encadré DTU inline (10 lignes hardcodées) — doublon partiel avec `drawNoteTechnique` |
| **Complexité spécifique** | Logique conditionnelle dalle/plots pour le sol, détails décoratifs (veines bois, points plot, vis) |

**Dépendances internes** :
- `hArrow`, `vArrow`, `LW` depuis pdfHelpers
- `pageTitle`, `footer` depuis même fichier
- Aucun import de `deckConstants` (dimensions hardcodées en mm)

### 1.3 Comment elles sont appelées (terrassePDF.js)

```
Page 3: drawTechnicalPlan2D(doc, width, depth, 3, TOTAL)
         → puis cartouche() ajouté séparément

Page 4: drawCoupePage(doc, width, depth, joists, foundationType, thicknessCm, 4, TOTAL)
         → puis drawNoteTechnique() + cartouche() ajoutés séparément
```

Le `footer()` est appelé **aussi** à l'intérieur de chaque fonction legacy, tandis que `cartouche()` est appelé depuis `terrassePDF.js`. C'est un doublon potentiel (footer se dessine uniquement sur pages 1 et last).

---

## 2. Comparaison des stratégies

### Option A — Refactor in-place dans `pdfDrawing.js`

| Pour | Contre |
|---|---|
| Pas de nouveau fichier | `pdfDrawing.js` reste un monolithe (~900+ lignes) |
| Diff minimal | Mélange builders primitives et code legacy dans le même fichier |
| Pas de risque d'import cassé | Impossible de tester le builder indépendamment |
| | Incohérent avec le pattern pergola/clôture (builders séparés) |
| | L'appel `generateDeck()` resterait dans `pdfDrawing.js` |

### Option B — Extraction vers builders séparés

| Pour | Contre |
|---|---|
| Cohérence totale avec P1/P2 (même pattern) | 2 nouveaux fichiers à créer |
| `pdfDrawing.js` allégé de ~435 lignes | Import de `generateDeck` déplacé dans le builder |
| Testable en isolation | Risque de régression si mapping imparfait |
| Palette `MAT.*` dès le départ | ~3h de travail vs ~1.5h pour option A |
| Suppression naturelle du `footer()` legacy | |

### Recommandation : **Option B**

Justification :
1. La cohérence architecturale est le but principal de P3
2. Le pattern builder est validé et stable (3 modules déjà)
3. L'extraction permet de supprimer l'appel `generateDeck()` de `pdfDrawing.js` — ce fichier ne devrait pas importer d'engine
4. Le coût supplémentaire est faible (le builder topView est le plus complexe, la coupe est simple)
5. Les deux fonctions legacy ont des projections incompatibles avec le système normalisé — un refactor in-place serait aussi intrusif qu'une extraction

---

## 3. Mapping `generateDeck()` → primitives

### 3.1 Données disponibles

| Champ engine | Type | Contenu |
|---|---|---|
| `boardSegs[]` | `{xCenter, zCenter, segLen}` | Segments de lames (position centre + longueur) |
| `joistSegs[]` | `{xPos, zStart, segLen}` | Segments de lambourdes (position X + départ Z + longueur) |
| `joistXPositions[]` | `number[]` | Positions X distinctes des lambourdes |
| `cutXPositions[]` | `number[]` | Positions X des coupes de lames |
| `doubleJoistSegs[]` | `{xPos, zStart, segLen}` | Doubles lambourdes aux coupes |
| `joistJoints[]` | `{xPos, zAbs}` | Points de jonction lambourdes |
| `joistJointZs` | `number[]` | Positions Z distinctes des jonctions lambourdes |
| `entretoiseSegs[]` | `{xCenter, zPos, segLen}` | Entretoises entre lambourdes |
| `padPositions[]` | `{x, z}` | Positions centres des plots |
| `joistCount` | `number` | Nombre total de lambourdes |
| `plotRows` | `number` | Nombre de rangées de plots en profondeur |

### 3.2 Mapping éléments → primitives + couches + palette

| Élément terrasse | Primitive | Layer | Palette MAT | Notes |
|---|---|---|---|---|
| Fond plan | `rect` | `background` | `PLAN_BG` (fond bleuté) | Remplace beige hardcodé |
| Lame | `rect` | `structureSecondary` | `MAT.bardage` | Chaque `boardSeg` → 1 rect |
| Lambourde | `rect` | `structurePrimary` | `MAT.chevron` | Lambourdes = solives fonctionnellement |
| Double lambourde | `rect` | `structurePrimary` | `MAT.chevron` (stroke renforcé) | Même famille, trait plus fort |
| Entretoise | `rect` | `structurePrimary` | `MAT.lisse` | Entretoises = éléments horizontaux |
| Plot | `circle` → `rect` | `structurePrimary` | `MAT.beton` | jsPDF circles → approx par rects ou polylines |
| Ligne de coupe | `line` | `framings` | `MAT.contour` (dash) | Tirets verticaux |
| Jonction lambourde | `line` | `framings` | `MAT.contour` (dash fin) | Tirets horizontaux |
| Bordure | `rect` | `outline` | `MAT.contour` | Contour fort |
| Cotation largeur | `dimension` | `dimensions` | `MAT.dim` | Via primitive `dimension` |
| Cotation profondeur | `dimension` | `dimensions` | `MAT.dim` | Via primitive `dimension` |
| Cotation entraxe | `dimension` | `dimensions` | stroke custom | Entraxe lambourdes + plots |

### 3.3 Cas particulier : les cercles (plots)

Le système de primitives n'a pas de type `circle`. Options :
- Ajouter un type `circle` à `primitives.js` + handler dans `renderPDF.js` (propre, ~15 lignes)
- Approximer par un `rect` carré (acceptable visuellement pour les plots)
- Utiliser un `polygon` régulier (8+ côtés) — lourd

**Recommandation** : ajouter `circle` comme 8ème type de primitive. C'est minimal (factory + renderer) et réutilisable pour la clôture future (trous de vis) ou tout module avec plots.

### 3.4 Mapping coupe → primitives

La coupe est un schéma fixe (pas de données dynamiques sauf fondationType). Elle peut être traitée comme un builder « statique » qui produit des primitives à positions fixes.

| Élément coupe | Primitive | Layer | Palette MAT |
|---|---|---|---|
| Lame (section) | `rect` | `structureSecondary` | `MAT.bardage` |
| Lambourde (section) | `rect` | `structurePrimary` | `MAT.chevron` |
| Plot | `rect` | `structurePrimary` | `MAT.beton` |
| Sol naturel | `rect` + hachures | `background` | `MAT.sol` |
| Dalle béton | `rect` + hachures | `background` | `MAT.beton` |
| Vis | `line` | `framings` | `MAT.contour` |
| Cotations mm | `dimension` | `dimensions` | `MAT.dim` |
| Labels latéraux | `text` | `labels` | texte standard |

---

## 4. Identification des risques

### 4.1 Risque : appel `generateDeck()` dans le builder

**Situation actuelle** : `drawTechnicalPlan2D` appelle `generateDeck(width, depth)` en interne.
**Risque** : le builder appellerait un engine protégé.
**Mitigation** : le builder ne calcule rien — il **consomme** le résultat de `generateDeck()`. L'appel sera déplacé dans `terrassePDF.js` (l'orchestrateur) qui passera le résultat au builder. Pattern identique au cabanon (geometry passée par l'orchestrateur).

### 4.2 Risque : incompatibilité de projection

**Situation actuelle** : `drawTechnicalPlan2D` utilise une projection centrée sur (0,0) avec `sx(wx) = px0 + (wx + width/2) * sc`. Les primitives utilisent une projection origine coin.
**Risque** : les coordonnées engine sont centrées sur zéro (`xCenter`, `zCenter`), les projections normalisées partent du coin (0,0).
**Mitigation** : le builder appliquera un décalage `+ width/2` et `+ depth/2` à toutes les coordonnées engine avant projection. Transformation simple, pas de risque fonctionnel.

### 4.3 Risque : clipping

**Situation actuelle** : chaque élément est clippé manuellement contre les bords du plan.
**Risque** : le système de primitives n'a pas de clipping.
**Mitigation** : les primitives seront créées uniquement pour les éléments visibles (pré-filtrage). Pour les éléments qui dépassent (plots aux bords), un `Math.max/min` sur les coordonnées suffit. Pas besoin de clipping générique.

### 4.4 Risque : pagination

**Situation actuelle** : pages 3-4 sont ajoutées dans `terrassePDF.js`. Les fonctions legacy gèrent `pageNum`/`totalPages` pour `footer()`.
**Risque** : le `footer()` legacy est appelé **à l'intérieur** de `drawTechnicalPlan2D` et `drawCoupePage`.
**Mitigation** : après migration, supprimer les appels `footer()` internes. Le cartouche est déjà ajouté par `terrassePDF.js` après chaque appel — pas de perte.

### 4.5 Risque : régression visuelle

**Risque** : les couleurs changent (palette normalisée vs hardcodées).
**Acceptation** : c'est voulu. La migration harmonise les teintes avec les autres modules. Le résultat sera visuellement différent mais plus cohérent. Pas de régression fonctionnelle.

### 4.6 Risque : doublon encadré notes DTU dans drawCoupePage

**Situation** : `drawCoupePage` contient un encadré DTU de 10 lignes hardcodé (L665-691). `terrassePDF.js` appelle aussi `drawNoteTechnique()` à L386 juste après la coupe.
**Mitigation** : le builder coupe ne reproduira pas l'encadré DTU. `drawNoteTechnique()` sera utilisé comme pour tous les autres modules.

---

## 5. Recommandation finale

### Stratégie retenue : Option B — Extraction builders

### Ordre de migration

| Étape | Action | Fichiers |
|---|---|---|
| **B0** | Ajouter primitive `circle` | `lib/plan/primitives.js`, `lib/plan/renderPDF.js` |
| **B1** | Créer `buildTerrasseTopView.js` | `lib/plan/buildTerrasseTopView.js` (NEW) |
| **B2** | Créer `buildTerrasseSectionView.js` | `lib/plan/buildTerrasseSectionView.js` (NEW) |
| **B3** | Modifier `terrassePDF.js` : remplacer les appels legacy par les builders | `components/simulator/ExportPDF/terrassePDF.js` |
| **B4** | Nettoyer `pdfDrawing.js` : supprimer `drawTechnicalPlan2D`, `drawCoupePage`, l'import `generateDeck` | `lib/pdf/pdfDrawing.js` |

### Quick wins avant migration complète

1. **B0 immédiat** : ajouter `circle` à primitives (5 min, utile pour tout)
2. **B1 d'abord** : la vue dessus est la plus complexe et la plus visible — la faire en premier valide le mapping
3. **B2 ensuite** : la coupe est quasi-statique, beaucoup plus simple
4. **B4 en dernier** : ne supprimer le code legacy qu'après validation complète

### Fichiers touchés (exhaustif)

| Fichier | Action |
|---|---|
| `lib/plan/primitives.js` | Ajouter `circle` factory |
| `lib/plan/renderPDF.js` | Ajouter `drawCircle` handler |
| `lib/plan/buildTerrasseTopView.js` | **NOUVEAU** — builder vue dessus |
| `lib/plan/buildTerrasseSectionView.js` | **NOUVEAU** — builder coupe |
| `components/simulator/ExportPDF/terrassePDF.js` | Remplacer appels legacy → builders |
| `lib/pdf/pdfDrawing.js` | Supprimer `drawTechnicalPlan2D`, `drawCoupePage`, import `generateDeck` |

### Fichiers NON touchés

- `lib/deckEngine.js` — protégé
- `lib/deckConstants.js` — protégé
- `lib/deckGeometry.js` — protégé
- `lib/foundation/foundationCalculator.js` — protégé
- `lib/plan/palette.js` — déjà complet
- `lib/plan/projections.js` — déjà complet
- Tous les PDF pergola/clôture/cabanon — aucun impact
