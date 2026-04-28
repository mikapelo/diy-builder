# Mission EXPORT — Lot A + Lot B : Implémentation PDF technique

> Dispatch LEAD → EXPORT
> Date : 2026-03-30
> Statut : À exécuter
> Priorité : Haute

---

## CONTEXTE

Le chantier documentaire sur les plans techniques est terminé. 4 documents de référence existent :
- `docs/technical-plans-corpus.md` — sources de plans techniques réels
- `docs/technical-plan-conventions.md` — conventions graphiques observées
- `docs/project-pdf-mapping.md` — mapping données moteur ↔ vues ↔ PDF cible
- `docs/technical-plan-open-questions.md` — limites et questions ouvertes

Le cabanon est le module pilote : il a déjà 5 pages PDF avec le pipeline primitives complet (façade, dessus, coupe).

## RÈGLE ABSOLUE

NE PAS modifier la logique de calcul existante.
Fichiers protégés : `lib/deckEngine.js`, `lib/deckConstants.js`, `lib/deckGeometry.js`, `lib/foundation/foundationCalculator.js`
Fichiers moteur modules : `modules/*/engine.js` — NE PAS TOUCHER.

Modifier UNIQUEMENT : la couche représentation/export (PDF layout, primitives rendering, helpers PDF).

---

## LOT A — Quick wins PDF transverses

### A1. Cartouche enrichi (toutes pages, tous modules)

**Fichier** : `lib/pdf/pdfDrawing.js`

**Action** : Remplacer la fonction `footer()` actuelle par une nouvelle fonction `cartouche()` qui sera appelée sur CHAQUE page de CHAQUE module.

**Contenu du cartouche** (bande horizontale en bas de page, h=14mm) :

```
┌──────────────────────────────────────────────────────────────┐
│ DIY BUILDER        [Titre de la vue]        Page X / Y       │
│ [Projet] [dims]    Échelle ~1:XX            [Date]           │
│          Document de pré-dimensionnement — non contractuel   │
└──────────────────────────────────────────────────────────────┘
```

Spécifications :
- Position : y=276 à y=290 sur page A4 (210×297mm)
- Fond : gris très léger `#f4f5f7`
- Trait séparateur au-dessus : 0.3mm, couleur `#c8cdd5`
- "DIY BUILDER" : 7pt, bold, `#6a7080`
- Titre de vue : 8pt, bold, `#2a3040` (ex : "Vue de dessus", "Coupe transversale")
- Pagination : 7pt, normal, `#8a90a0`, aligné à droite
- Ligne 2 : 6.5pt, normal, `#9a9fb0`
- Mention "non contractuel" : 6pt, italic, `#aab0b8`

**Signature de la fonction** :
```js
export function cartouche(doc, {
  pageNum,          // numéro de page
  totalPages,       // total de pages
  viewTitle,        // "Vue de dessus", "Matériaux", etc.
  projectTitle,     // "Cabanon bois 3×4 m" etc.
  scale,            // "~1:50" ou null
  date,             // new Date() par défaut
}) { ... }
```

**Impact** : Remplacer tous les appels `footer(doc, pageNum, total)` par `cartouche(doc, {...})` dans :
- `terrassePDF.js` (4 appels)
- `pdfDrawing.js` → `generateCabanonPDF` (5 appels via les fonctions internes)
- `pergolaPDF.js` (1 appel à ajouter — il n'a pas de footer actuellement)
- `cloturePDF.js` (1 appel à ajouter — il n'a pas de footer actuellement)

Conserver `footer()` comme fonction legacy si besoin, mais les nouvelles pages utilisent `cartouche()`.

### A2. Hiérarchie de traits standardisée

**Fichier** : `lib/pdf/pdfHelpers.js`

**Action** : Ajouter des constantes de traits normées :

```js
// Hiérarchie de traits (mm) — ISO 128 simplifié
export const LW = {
  FORT:     0.50,  // contours principaux, arêtes visibles
  MOYEN:    0.35,  // éléments structurels secondaires
  FIN:      0.20,  // lignes de cote, extension, légende
  TRES_FIN: 0.10,  // grille de fond, hachures
  CADRE:    0.30,  // cadre de cartouche, séparateurs
};
```

**Application dans `pdfDrawing.js`** :
- `drawTechnicalPlan2D()` : utiliser `LW.FORT` pour le contour extérieur terrasse, `LW.MOYEN` pour les lambourdes, `LW.FIN` pour les cotations
- `drawCoupePage()` : utiliser `LW.FORT` pour les contours de pièces, `LW.FIN` pour les cotes
- `drawGrid()` : utiliser `LW.TRES_FIN` (il utilise déjà 0.08, c'est correct)
- Pages cabanon : la hiérarchie passe par `renderPDF.js` — voir lot B

**Application dans `renderPDF.js`** :
- Importer `LW` depuis `pdfHelpers.js`
- Les primitives qui n'ont pas de `lineWidth` explicite utilisent `LW.MOYEN` par défaut
- Les primitives de type `dimension` utilisent `LW.FIN`
- Les primitives de couche `outline` ou `contours` utilisent `LW.FORT`

### A3. Notes techniques statiques par module

**Action** : Ajouter un bloc de notes techniques en bas de la dernière page de chaque module.

**Fichier** : Chaque fichier PDF de module.

| Module | Notes à ajouter |
|---|---|
| Terrasse (`terrassePDF.js`) | "Conforme DTU 51.4 (déc. 2018). Jeu entre lames : 5-8 mm. Ventilation sous structure ≥ 50 mm. Pente d'évacuation 1.5%." |
| Cabanon (`pdfDrawing.js` page 5) | "Entraxe montants 60 cm. Section ossature 9×9 cm. Mono-pente. Classe d'emploi bois : 3.2 minimum (murs), 4 (lisse basse)." |
| Pergola (`pergolaPDF.js`) | "Réf. guide COBEI (FCBA/CODIFAB). Classe d'emploi : 3.2 min. Seuils réglementaires : < 5 m² aucune démarche, 5-20 m² déclaration préalable, > 20 m² permis de construire." |
| Clôture (`cloturePDF.js`) | "Profondeur de scellement poteaux recommandée : 50 cm min. (hors gel). Jeu entre lames : 10-15 mm (ventilation bois)." |

Format : encadré gris clair (fond `#f6f7f9`, bord `#d8dce2`), texte 7pt, italic, `#6a7080`.

### A4. BOM enrichie — sections bois en mm

**Action** : Dans chaque PDF, enrichir les lignes de matériaux avec les sections en mm.

Exemples de transformations :

| Avant | Après |
|---|---|
| "Lambourdes × 14" | "Lambourdes 45×70 mm × 14" |
| "Montants 9×9 cm × 28" | "Montants 90×90 mm × 28" |
| "Poteaux (2.50 m) × 4" | "Poteaux 100×100 mm (2.50 m) × 4" |
| "Rails horizontaux (1.80 m) × 8" | "Rails 45×70 mm (1.80 m) × 8" |

**Sources des sections** : dans les `*Constants.js` de chaque module (NE PAS les modifier, juste les LIRE).

Pour la terrasse : `BOARD_WIDTH` (145mm), `JOIST_W` (45mm), `JOIST_H` (70mm), etc. depuis `deckConstants.js`.
Pour le cabanon : `SECTION` (90mm) depuis `cabanonConstants.js`.
Pour la pergola : `POST_SECTION`, `BEAM_W`, `BEAM_H`, `RAFTER_W`, `RAFTER_H` depuis `pergolaConstants.js`.
Pour la clôture : `POST_SECTION`, `RAIL_W`, `RAIL_H`, `BOARD_W`, `BOARD_H` depuis `clotureConstants.js`.

**Importer ces constantes** dans les fichiers PDF respectifs (import en lecture seule).

---

## LOT B — Cabanon pilote PDF technique

Le cabanon a déjà 5 pages dans `generateCabanonPDF()` (pdfDrawing.js, lignes 723-870) :
1. Synthèse 3D (capture canvas)
2. Vue de dessus (buildTopView)
3. Vue de façade (buildFacadeView)
4. Coupe transversale (buildSectionView)
5. Matériaux (BOM)

### B1. Appliquer le cartouche (A1) sur les 5 pages cabanon

Remplacer les 5 appels `footer(doc, N, TOTAL)` par `cartouche(doc, {...})` avec les bons `viewTitle` :
- Page 1 : viewTitle = "Vue de synthèse 3D"
- Page 2 : viewTitle = "Vue de dessus", scale = "~1:50"
- Page 3 : viewTitle = "Façade — Élévation avant", scale = "~1:50"
- Page 4 : viewTitle = "Coupe transversale", scale = "~1:20"
- Page 5 : viewTitle = "Nomenclature matériaux"

### B2. Ajouter des légendes sur les pages 2, 3, 4

**Fichier** : `pdfDrawing.js` — dans `drawCabanonPlanDessus`, `drawCabanonPlanDetaille`, `drawCabanonCoupe`

**Action** : Après le rendu des primitives, dessiner un encadré légende (7-8 items max) en bas à droite de la zone de dessin.

Format de la légende :
```
┌─ Légende ─────────┐
│ ■ Murs             │
│ ■ Montants         │
│ ■ Ouvertures       │
│ ■ Chevrons         │
│ ■ Cotations        │
└───────────────────┘
```

Spécifications :
- Position : coin inférieur droit de la zone boxée (ex : x=145, y selon la page)
- Fond : blanc avec opacité (ou `#fafbfd`)
- Bordure : `LW.FIN`, `#c0c5d0`
- Texte : 6.5pt, normal, `#40506a`
- Carrés de couleur : 3×3mm, couleurs issues des palettes des builders (`buildFacadeView` etc.)

Légendes par page :
- **Dessus** : Murs (fill mur), Montants (fill stud), Porte (fill door), Fenêtre (fill window), Chevrons (stroke chevron)
- **Façade** : Murs (fill mur), Montants (fill stud), Linteau/seuil (fill framing), Porte (fill door), Fenêtre (fill window), Toiture
- **Coupe** : Sol, Lisse basse, Montants, Sablière, Chevrons, OSB, Couverture, Bardage

Les couleurs sont déjà définies dans les builders (`buildTopView.js` → const C, `buildSectionView.js` → const C, `buildFacadeView.js`). Les importer ou les dupliquer comme constantes dans pdfDrawing.

### B3. Notes techniques sur la page matériaux (page 5)

**Action** : En bas de la page 5 matériaux, ajouter le bloc notes techniques cabanon (voir A3).

### B4. BOM enrichie cabanon (page 5)

**Action** : Dans `drawMatGroup()` (lignes 787-817 de pdfDrawing.js), enrichir les lignes avec les sections en mm :

```
Avant :  "Montants 9×9 cm"
Après :  "Montants 90×90 mm"

Avant :  "Chevrons 8×8 cm"
Après :  "Chevrons 80×80 mm"

Avant :  "Bastaings 63×150 mm"
OK tel quel (déjà en mm)
```

Aussi, ajouter les longueurs totales (ml) quand pertinent :
- "Lisse basse 90×90 mm" + détail "XX ml — Base des murs"
- "Chevrons 80×80 mm × N" + détail "Longueur unitaire X.XX m"

### B5. Hiérarchie de traits dans renderPDF.js (Lot B spécifique)

**Fichier** : `lib/plan/renderPDF.js`

**Action** : Appliquer la hiérarchie `LW` selon la couche de la primitive :

```js
import { LW } from '@/lib/pdf/pdfHelpers.js';

// Mapping couche → épaisseur par défaut
const LAYER_LW = {
  background:         LW.TRES_FIN,
  contours:           LW.FORT,
  roof:               LW.MOYEN,
  structurePrimary:   LW.MOYEN,
  structureSecondary: LW.FIN,
  openings:           LW.MOYEN,
  framings:           LW.MOYEN,
  outline:            LW.FORT,
  dimensions:         LW.FIN,
  labels:             LW.FIN,
  legend:             LW.FIN,
};
```

Si une primitive a un `lineWidth` explicite → le garder.
Si non → utiliser `LAYER_LW[primitive.layer]` comme défaut.

---

## FICHIERS À MODIFIER (résumé)

| Fichier | Lot | Modifications |
|---|---|---|
| `lib/pdf/pdfHelpers.js` | A2 | Ajouter constantes `LW` |
| `lib/pdf/pdfDrawing.js` | A1, A3, B1-B4 | Nouvelle `cartouche()`, légendes cabanon, notes, BOM enrichie |
| `lib/plan/renderPDF.js` | B5 | Hiérarchie de traits par couche |
| `ExportPDF/terrassePDF.js` | A1, A3, A4 | Cartouche, notes DTU, BOM avec sections mm |
| `ExportPDF/pergolaPDF.js` | A1, A3, A4 | Cartouche, notes COBEI, BOM avec sections mm |
| `ExportPDF/cloturePDF.js` | A1, A3, A4 | Cartouche, notes scellement, BOM avec sections mm |

## FICHIERS EN LECTURE SEULE (import constantes uniquement)

| Fichier | Usage |
|---|---|
| `lib/deckConstants.js` | BOARD_WIDTH, JOIST_W, JOIST_H pour BOM terrasse |
| `lib/cabanonConstants.js` | SECTION pour BOM cabanon |
| `lib/pergolaConstants.js` | POST_SECTION, BEAM_W/H, RAFTER_W/H pour BOM pergola |
| `lib/clotureConstants.js` | POST_SECTION, RAIL_W/H, BOARD_W/H pour BOM clôture |

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

```
1. A2 — Constantes LW dans pdfHelpers.js (2 min, aucune dépendance)
2. A1 — Fonction cartouche() dans pdfDrawing.js (15 min)
3. B1 — Brancher cartouche sur les 5 pages cabanon (5 min)
4. A1 — Brancher cartouche sur terrasse, pergola, clôture (10 min)
5. B5 — Hiérarchie traits dans renderPDF.js (10 min)
6. B2 — Légendes sur pages cabanon 2, 3, 4 (20 min)
7. A4+B4 — BOM enrichie tous modules (15 min)
8. A3+B3 — Notes techniques tous modules (10 min)
9. TEST — Générer les 4 PDF et vérifier visuellement
```

## CRITÈRES DE VALIDATION

1. **Cartouche** : visible sur CHAQUE page de CHAQUE module, avec titre de vue, pagination, mention "non contractuel"
2. **Traits** : contours visiblement plus épais que les cotations dans les vues cabanon (façade, dessus, coupe)
3. **Légendes** : présentes sur les 3 pages de plans cabanon (dessus, façade, coupe), lisibles, non chevauchantes
4. **BOM** : chaque ligne de matériau bois mentionne la section en mm
5. **Notes** : chaque module a un bloc notes techniques en bas de sa dernière page
6. **Aucune régression** : les 4 PDF se génèrent sans erreur, les pages existantes ne sont pas cassées

## HORS PÉRIMÈTRE

- Pas de hachures bois en coupe (Phase 4)
- Pas de repères numérotés plan ↔ BOM (Phase 4)
- Pas de barre d'échelle graphique (Phase 2 ultérieure)
- Pas de modification des engines
- Pas de nouvelles vues techniques pour pergola/clôture (Phase 3)
- Pas de format A3
