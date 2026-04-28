# Mapping projets → PDF techniques — DIY Builder

> Document de référence EXPORT — DIY Builder
> Date : 2026-03-30
> Objectif : pour chaque module, mettre en correspondance les données moteur disponibles, les vues existantes, les vues manquantes, et la structure PDF cible.

---

## 1. MODULE TERRASSE

### 1.1 Données moteur disponibles (`deckEngine.js` + `deckGeometry.js`)

| Donnée | Champ | Utilisable pour |
|---|---|---|
| Nombre de lambourdes | `joistCount` | BOM, plan dessus |
| Segments de lambourdes | `joistSegs[]` (xPos, zCenter, segLen) | Plan dessus, coupe |
| Positions X des lambourdes | `joistXPositions[]` | Cotation entraxes |
| Jonctions de lambourdes | `joistJoints[]` (xPos, zAbs) | Plan dessus (repère jonction) |
| Segments de lames | `boardSegs[]` (xCenter, zCenter, segLen) | Plan dessus, calepinage |
| Rangées de lames | `boardRows` | Comptage, BOM |
| Positions de plots | `padPositions[]` (x, z) | Plan dessus, coupe |
| Rangées de plots | `plotRows` | Cotation interaxe plots |
| Entretoises | `entretoiseSegs[]` (xCenter, zPos, segLen) | Plan dessus |
| Positions de découpe | `cutXPositions[]` | Repérage calepinage |
| Nombre de rangées | `nbRangees` | BOM |
| Longueur travée | `traveeLen` | Cotation |
| Surface | calculée (width × depth) | En-tête |

### 1.2 Vues techniques existantes

| Vue | Fichier | Support | État |
|---|---|---|---|
| **Plan de dessus** | `TechnicalPlan.jsx` | SVG interactif | ✅ Complet (lames, lambourdes, plots, entretoises, jonctions, légende, cotations) |
| **Plan de dessus PDF** | `pdfDrawing.js` → `drawTechnicalPlan2D()` | jsPDF page 3 | ✅ Fonctionnel (lambourdes, lames, plots, cotations basiques) |
| **Coupe transversale PDF** | `pdfDrawing.js` → `drawCoupePage()` | jsPDF page 4 | ✅ Fonctionnel (profil plot/lambourde/lame) |
| **BOM + prix** | `terrassePDF.js` page 1 | jsPDF | ✅ Complet avec prix multi-enseignes |
| **Fondations** | `terrassePDF.js` page 2 | jsPDF | ✅ Notes techniques + option dalle |

### 1.3 Vues manquantes / à améliorer

| Vue | Priorité | Données disponibles ? | Commentaire |
|---|---|---|---|
| Détail fixation lame/lambourde | P3 | Partiel (types de fixation non modélisés) | Nécessiterait un schéma statique (pas de données moteur) |
| Détail plot/lambourde | P3 | Oui (padPositions + constantes) | Dessinable avec les constantes existantes |
| Légende sur page PDF | P2 | Oui | Transposer la légende du SVG au PDF |
| Cartouche enrichi | P1 | Oui | Ajouter échelle, titre de vue |
| Hiérarchie de traits | P1 | — | Ajuster `setLineWidth` dans `drawTechnicalPlan2D` et `drawCoupePage` |
| Notes DTU 51.4 | P2 | — | Bloc texte statique à ajouter |
| BOM avec sections bois | P2 | Partiellement (constantes BOARD_WIDTH, JOIST_W etc.) | Enrichir le tableau existant |

### 1.4 Structure PDF cible

```
Page 1 : En-tête + BOM + Prix (existant — OK)
Page 2 : Fondations + Notes (existant — OK)
Page 3 : Plan de dessus + légende + cotations enrichies + cartouche
Page 4 : Coupe transversale + cotations de hauteur + cartouche
```

**Priorité d'implémentation : ÉLEVÉE** — La terrasse a déjà 4 pages et les données les plus riches. C'est le module le plus avancé.

---

## 2. MODULE CABANON

### 2.1 Données moteur disponibles (`modules/cabanon/engine.js`)

| Donnée | Champ | Utilisable pour |
|---|---|---|
| Dimensions | `geometry.dimensions` (width, depth, height, slope, plateHeight) | Toutes vues |
| Murs (4) | `geometry.walls[]` (start, end, height) | Plan dessus, élévations |
| Montants structurels | `geometry.structuralStuds[]` (x, y, height, zBase, role) | Élévation ossature, plan dessus |
| Framings (linteaux, seuils) | `geometry.framings[]` (cx, zBottom, w, hh) | Façade détaillée |
| Lisses (basses, hautes) | `geometry.lisses` {basses, hautes, hautes2} | Coupe, élévation |
| Chevrons | `geometry.chevrons[]` (y, x1, x2, z1, z2) | Plan toiture, coupe |
| Ouvertures | `geometry.openings` {door, window} (wall, x, y, width, height) | Façade, plan dessus |
| Toit | `geometry.roof.vertices` [[x,y,z]×4] | Plan toiture, coupe |
| Matériaux | `structure` (surface, studs, bardage, voliges, etc.) | BOM |

### 2.2 Vues techniques existantes

| Vue | Fichier | Support | État |
|---|---|---|---|
| **Façade avant** | `buildFacadeView.js` | Primitives → PDF (`renderPDF.js`) | ✅ Complète (murs, montants, ouvertures, pente, cotations) |
| **Plan de dessus** | `buildTopView.js` | Primitives → PDF | ✅ Complète (murs, montants, ouvertures, chevrons) |
| **Coupe transversale** | `buildSectionView.js` | Primitives → PDF | ✅ Complète (empilement sol→lisse→montants→sablières→chevrons→OSB→couverture, bardage) |
| **SVG façade interactive** | `CabanonSketch.jsx` | SVG React | ✅ Façade avec hotspots, cotations, mode plan |
| **Capture 3D** | `canvasCapture.js` | Canvas → PDF page 1 | ✅ Capture live du viewer |
| **BOM** | `pdfDrawing.js` → `generateCabanonPDF()` | jsPDF 1 page | ⚠️ Basique (1 page, pas de vue technique intégrée) |

### 2.3 Vues manquantes / à améliorer

| Vue | Priorité | Données disponibles ? | Commentaire |
|---|---|---|---|
| Élévations latérales et arrière | P2 | Oui (geometry.walls[1], [2], [3]) | buildFacadeView ne traite que wall 0 ; à généraliser |
| Plan de charpente dédié | P3 | Oui (chevrons, roof.vertices) | Actuellement inclus dans buildTopView ; à séparer |
| Ossature mur (vue éclatée technique) | P3 | Oui (structuralStuds par wall) | Filtrer structuralStuds par wall et dessiner |
| PDF multi-pages structuré | P1 | Oui (toutes vues existent en primitives) | Actuellement 1 page → passer à 4-5 pages |
| Cartouche + légende | P1 | Oui | À ajouter sur chaque page |
| BOM enrichie avec sections | P2 | Oui (constantes SECTION, engine output) | Sections bois, classes, organisation par système |

### 2.4 Structure PDF cible

```
Page 1 : Synthèse 3D (capture canvas existante) + cartouche
Page 2 : Plan de dessus + cotations + légende
Page 3 : Façade avant + cotations + repères ouvertures
Page 4 : Coupe transversale + empilement structurel coté
Page 5 : BOM structurée par système + notes techniques
```

**Priorité d'implémentation : ÉLEVÉE** — Le cabanon a le système de primitives le plus mature (façade + dessus + coupe). L'infrastructure existe, il faut structurer le PDF multi-pages.

---

## 3. MODULE PERGOLA

### 3.1 Données moteur disponibles (`modules/pergola/engine.js`)

| Donnée | Champ | Utilisable pour |
|---|---|---|
| Poteaux | `posts` (nombre), `postLength` (longueur) | Élévation, BOM |
| Longerons | `beamsLong` (nombre), `beamLongLength` | Plan dessus, élévation latérale |
| Traverses | `beamsShort` (nombre), `beamShortLength` | Plan dessus, élévation façade |
| Chevrons | `rafters` (nombre), `rafterLength` | Plan dessus, élévation |
| Quincaillerie | `anchors`, `screws`, `plates` | BOM |
| Dimensions | `width`, `depth` | Toutes vues |
| Sections bois | Constantes dans `pergolaConstants.js` | BOM, cotation détails |

### 3.2 Vues techniques existantes

| Vue | Fichier | Support | État |
|---|---|---|---|
| **BOM basique** | `pergolaPDF.js` | jsPDF 1 page | ✅ Structure + quincaillerie + note durabilité |
| **Scène 3D** | `PergolaScene.jsx` | Three.js | ✅ Rendu 3D avec poteaux, poutres, chevrons |

### 3.3 Vues manquantes

| Vue | Priorité | Données disponibles ? | Commentaire |
|---|---|---|---|
| Plan de dessus (implantation poteaux + chevrons) | P1 | Oui (positions calculables depuis width/depth + constantes) | Pas de buildTopView pergola ; à créer |
| Élévation façade | P1 | Oui (postLength, beamShortLength, rafterLength) | Simple : 2 poteaux + traverse + chevrons ; à créer |
| Élévation latérale | P2 | Oui (postLength, beamLongLength) | 2 poteaux + longeron |
| Coupe/détail pied de poteau | P3 | Partiel (postLength, ancrage) | Schéma semi-statique avec données existantes |
| PDF multi-pages | P1 | — | Actuellement 1 page → passer à 3-4 pages |
| Notes réglementaires | P2 | — | Seuils 5m²/20m² (déclaration/permis) à ajouter |

### 3.4 Structure PDF cible

```
Page 1 : Synthèse (titre + dimensions + BOM enrichie + note réglementaire)
Page 2 : Plan de dessus (implantation poteaux, longerons, chevrons) + cotations
Page 3 : Élévation façade + élévation latérale (2 vues sur 1 page)
Page 4 : Détails assemblage (optionnel, phase 2)
```

**Priorité d'implémentation : MOYENNE** — Les données moteur sont suffisantes pour les vues de base, mais il n'y a aucun builder de primitives existant. Tout est à créer.

---

## 4. MODULE CLÔTURE

### 4.1 Données moteur disponibles (`modules/cloture/engine.js`)

| Donnée | Champ | Utilisable pour |
|---|---|---|
| Poteaux | `posts` (nombre), `postLength` | Élévation, BOM |
| Rails | `rails` (nombre), `railLength` | Élévation, coupe |
| Lames | `boards` (nombre), `boardLength` | Élévation, BOM |
| Quincaillerie | `screws`, `anchors` | BOM |
| Dimensions | `width` (longueur ml), `depth` (hauteur) | Toutes vues |
| Espacement réel | `actualSpacing` (entraxe poteaux ajusté) | Cotation |
| Sections bois | Constantes dans `clotureConstants.js` | BOM, cotation |

### 4.2 Vues techniques existantes

| Vue | Fichier | Support | État |
|---|---|---|---|
| **BOM basique** | `cloturePDF.js` | jsPDF 1 page | ✅ Structure + quincaillerie |
| **Scène 3D** | `ClotureScene.jsx` | Three.js | ✅ Rendu 3D linéaire |

### 4.3 Vues manquantes

| Vue | Priorité | Données disponibles ? | Commentaire |
|---|---|---|---|
| Élévation linéaire (motif répétitif) | P1 | Oui (posts, rails, boards, actualSpacing) | Vue signature clôture : profil complet sur toute la longueur (ou sur 2-3 travées + symbole de répétition) |
| Coupe de poteau | P1 | Oui (postLength, profondeur scellement) | Coupe verticale montrant ancrage + rails + lames |
| Détail assemblage rail/lame | P3 | Partiel (sections dans constantes) | Schéma semi-statique |
| PDF multi-pages | P1 | — | Actuellement 1 page → passer à 2-3 pages |
| Notes scellement | P2 | — | Profondeur recommandée, type de béton |

### 4.4 Structure PDF cible

```
Page 1 : Synthèse (titre + dimensions + BOM enrichie + notes scellement)
Page 2 : Élévation linéaire (2-3 travées type) + coupe de poteau + cotations
Page 3 : Détail assemblage (optionnel, phase 2)
```

**Priorité d'implémentation : MOYENNE** — Données moteur suffisantes pour les vues de base. Pas de builder existant.

---

## 5. SYNTHÈSE COMPARATIVE

### État actuel par module

| Module | Pages PDF | Vues techniques | Système primitives | BOM | Maturité |
|---|---|---|---|---|---|
| **Terrasse** | 4 | Dessus + Coupe | Non (jsPDF direct) | ✅ Complète + prix | ★★★★☆ |
| **Cabanon** | 1 | Façade + Dessus + Coupe (via primitives) | ✅ Oui | ⚠️ Basique | ★★★☆☆ |
| **Pergola** | 1 | Aucune | Non | ⚠️ Basique | ★☆☆☆☆ |
| **Clôture** | 1 | Aucune | Non | ⚠️ Basique | ★☆☆☆☆ |

### Roadmap d'amélioration par phase

#### Phase 1 — Quick wins transversaux (faible effort, impact immédiat)

| Action | Modules | Effort |
|---|---|---|
| Cartouche enrichi (titre vue, échelle, date) sur toutes les pages | Tous | Faible |
| Hiérarchie de traits normée | Terrasse, Cabanon | Faible |
| Notes techniques par module (bloc statique) | Tous | Faible |
| BOM enrichie (sections bois en mm, organisation par système) | Tous | Moyen |

#### Phase 2 — Plans techniques cabanon multi-pages

| Action | Données | Effort |
|---|---|---|
| Restructurer PDF cabanon en 5 pages (3D, dessus, façade, coupe, BOM) | Primitives existantes | Moyen |
| Ajouter légendes sur pages cabanon | Primitives existantes | Faible |
| Ajouter élévations latérales + arrière | geometry.walls + structuralStuds | Moyen |

#### Phase 3 — Plans techniques pergola et clôture

| Action | Données | Effort |
|---|---|---|
| Créer buildPergolaTopView + buildPergolaElevation | Engine existant | Élevé |
| Créer buildClotureElevation + buildClotureSection | Engine existant | Élevé |
| Structurer PDF pergola (3-4 pages) | Builders à créer | Moyen |
| Structurer PDF clôture (2-3 pages) | Builders à créer | Moyen |

#### Phase 4 — Enrichissements avancés (futurs)

| Action | Dépendance | Effort |
|---|---|---|
| Repères numérotés plan ↔ BOM | Refonte BOM | Élevé |
| Hachures bois en coupe (N&B) | renderPDF.js | Moyen |
| Vues de détail assemblage (1:5, 1:10) | Données supplémentaires ENGINE | Élevé |
| Export A3 optionnel | jsPDF config | Faible |

---

## 6. DÉPENDANCES ENGINE IDENTIFIÉES (à ne PAS implémenter maintenant)

Ces besoins émergent de l'analyse mais ne doivent être traités que si/quand la roadmap les requiert :

| Besoin | Module | Justification | Urgence |
|---|---|---|---|
| Positions X/Z des poteaux pergola (pas juste le nombre) | Pergola | Pour dessiner le plan de dessus avec cotations précises | Phase 3 |
| Profondeur de scellement poteau | Clôture, Pergola | Pour la coupe de poteau | Phase 3 |
| Positions des rails sur le poteau (hauteurs Y) | Clôture | Pour la coupe de poteau | Phase 3 |
| Type de fixation lame (vis dessus, clips, etc.) | Terrasse | Pour le détail de fixation | Phase 4 |
| Épaisseurs bardage/OSB/couverture dans le moteur cabanon | Cabanon | Actuellement en constantes locales dans buildSectionView | Phase 4 |
