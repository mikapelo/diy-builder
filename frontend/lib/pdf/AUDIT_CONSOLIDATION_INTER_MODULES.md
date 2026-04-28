# Audit de consolidation inter-modules — Export PDF

Date : 2026-03-31
Auteur : session EXPORT
Scope : terrasse / pergola / cloture / cabanon — couche export uniquement


## 1. Etat des lieux par module

| Module    | Pages | Pipeline       | Palette MAT | drawGrid | drawLegendBox | cartouche | drawNoteTechnique | PLAN_BG |
|-----------|-------|----------------|-------------|----------|---------------|-----------|-------------------|---------|
| Terrasse  | 4     | primitives (A) | oui         | oui      | oui           | oui       | oui               | oui     |
| Pergola   | 3     | primitives (A) | oui         | oui      | oui           | oui       | oui               | oui     |
| Cloture   | 2     | primitives (A) | oui         | oui      | oui           | oui       | oui               | oui     |
| Cabanon   | 5     | primitives (A) | **NON**     | oui      | oui           | oui       | oui               | **NON** |

**Constat** : le cabanon est le seul module encore partiellement hors palette. Ses 3 pages
techniques (facade, dessus, coupe) utilisent le systeme de primitives via `buildFacadeView`,
`buildTopView`, `buildSectionView`, MAIS les legendes dans l'orchestrateur (`pdfDrawing.js`)
utilisent des couleurs hardcodees au lieu de references `MAT.*`.


## 2. Ecarts releves

### 2.1 Legendes cabanon — couleurs hardcodees

Les 3 legendes du cabanon dans `pdfDrawing.js` (L340-413) utilisent des tableaux RGB
en dur au lieu de `MAT.ossature.fill`, `MAT.bardage.stroke`, etc.

**Exemples** :
- Facade L342 : `color: [55, 82, 120], fill: [175, 198, 225]` → devrait etre `MAT.ossature`
- Coupe L406 : `color: [110, 82, 40], fill: [235, 215, 170]` → devrait etre `MAT.lisse`
- Dessus L377 : `color: [165, 128, 82]` pour chevrons → ne correspond a aucune entree MAT exacte

Les valeurs sont proches mais pas identiques dans tous les cas. Certaines
correspondent exactement a MAT (ossature, lisse, chevron) ; d'autres sont des approximations.

### 2.2 PLAN_BG cabanon

Le cabanon utilise `doc.setFillColor(250, 252, 255)` en dur (L331, L363, L395).
C'est la meme valeur que `PLAN_BG = [250, 252, 255]`, mais ecrite en dur au lieu
d'importer `PLAN_BG` depuis `palette.js`.

### 2.3 Wording des titres de page

| Module   | Page technique      | Titre                                          |
|----------|---------------------|-------------------------------------------------|
| Terrasse | Vue de dessus       | "Plan de structure - Vue de dessus"             |
| Terrasse | Coupe               | "Plan de coupe transversale"                    |
| Pergola  | Vue de dessus       | "Plan technique - Vue de dessus"                |
| Pergola  | Elevation           | "Plan technique - Elevation"                    |
| Cloture  | Elevation           | "Plan technique - Elevation"                    |
| Cabanon  | Vue de dessus       | "Plan technique - Vue de dessus"                |
| Cabanon  | Facade              | "Plan technique - Vue de facade"                |
| Cabanon  | Coupe               | "Coupe transversale - Empilement structurel"    |

**Ecarts** :
- Terrasse page 3 dit "Plan de structure" (voulu — plan constructif) vs "Plan technique" ailleurs. Coherent avec la mission.
- Cabanon coupe dit "Coupe transversale - Empilement structurel" vs terrasse "Plan de coupe transversale". Le cabanon est plus descriptif, la terrasse plus normee. Ecart mineur acceptable.

### 2.4 Cartouche `viewTitle`

| Module   | viewTitle page technique                    |
|----------|---------------------------------------------|
| Terrasse | "Vue de dessus" / "Coupe transversale"      |
| Pergola  | "Vue de dessus" / "Elevation"               |
| Cloture  | "Elevation"                                 |
| Cabanon  | "Vue de synthese 3D" / "Vue de dessus" / "Facade - Elevation avant" / "Coupe transversale" |

Coherent. Pas d'ecart significatif.

### 2.5 Notes techniques

| Module   | Contenu notes                                         | Position |
|----------|-------------------------------------------------------|----------|
| Terrasse | DTU 51.4, jeu lames, ventilation, pente               | Page 4   |
| Pergola  | NF DTU 31.1 §5.10, classe emploi 3.2, reglementation  | Page 1   |
| Cloture  | Profondeur scellement, jeu lames                      | Page 1   |
| Cabanon  | Entraxe montants 60 cm, classe emploi                 | Page 5   |

Coherent. Chaque module a ses notes specifiques adaptees. Pas d'ecart.

### 2.6 Cabanon : orchestrateur dans pdfDrawing.js

Le cabanon est le seul module dont l'orchestrateur (`generateCabanonPDF`) vit dans
`pdfDrawing.js` (L483-643) au lieu d'avoir son propre fichier dans
`components/simulator/ExportPDF/cabanonPDF.js`.

Ceci est un ecart architectural, pas graphique. Tous les autres modules ont :
- `terrassePDF.js`
- `pergolaPDF.js`
- `cloturePDF.js`

Le cabanon devrait avoir `cabanonPDF.js` pour respecter le meme pattern.

### 2.7 Cabanon : page BOM (page 5) inline

La page BOM du cabanon (L510-643) utilise un en-tete fonce custom inline identique
a celui de la terrasse (L46-90 de terrassePDF.js). Les deux sont coherents visuellement
mais tous deux sont en inline jsPDF, non factorise.

Les pergola/cloture utilisent un layout BOM different (titre simple + tableau via PAGE constants).
Ecart de style entre modules premium (terrasse/cabanon = en-tete fonce) et modules
legers (pergola/cloture = titre nu). **Acceptable** — les modules ont des niveaux de
complexite differents.


## 3. Synthese des ecarts

| #   | Ecart                              | Severite | Correctif                                     |
|-----|------------------------------------|----------|-----------------------------------------------|
| E1  | Legendes cabanon hardcodees        | Moyenne  | Remplacer par refs MAT.*                      |
| E2  | PLAN_BG cabanon hardcode           | Faible   | Importer PLAN_BG depuis palette.js            |
| E3  | Orchestrateur cabanon dans pdfDrawing | Moyenne | Extraire vers cabanonPDF.js                |
| E4  | Wording titres legere divergence   | Faible   | Acceptable, chaque module a sa logique        |
| E5  | Couleurs chevrons dessus approx    | Faible   | Aligner sur MAT.chevron.stroke exacte         |


## 4. Proposition de lot P4 — Cabanon export

### Objectif
Aligner le cabanon sur le meme standard architectural que terrasse/pergola/cloture :
- palette partagee
- orchestrateur isole
- imports propres

### Sous-lots

| Lot   | Action                                                                  | Fichier principal                | Risque |
|-------|-------------------------------------------------------------------------|----------------------------------|--------|
| P4-A  | Extraire `generateCabanonPDF` vers `cabanonPDF.js`                     | ExportPDF/cabanonPDF.js (new)    | Faible |
| P4-B  | Importer MAT + PLAN_BG dans le nouvel orchestrateur                    | ExportPDF/cabanonPDF.js          | Faible |
| P4-C  | Remplacer les 3 legendes hardcodees par des refs MAT.*                 | ExportPDF/cabanonPDF.js          | Faible |
| P4-D  | Nettoyer `pdfDrawing.js` (supprimer generateCabanonPDF + helpers prives) | lib/pdf/pdfDrawing.js          | Moyen  |
| P4-E  | Verifier que les imports dans DeckSimulator/ExportPDF pointent vers le nouveau fichier | components/simulator/*.jsx | Faible |

### Ordre d'execution

```
P4-A → P4-B+C (simultane) → P4-D → P4-E → validation syntaxe
```

### Estimation
~200 lignes deplacees, ~30 lignes modifiees. Pas de nouveau builder a creer.
Les builders cabanon existants (`buildFacadeView`, `buildTopView`, `buildSectionView`)
sont deja sur le systeme de primitives — seul l'orchestrateur et les legendes bougent.

### Ce qui NE CHANGE PAS
- Les 3 builders cabanon (buildFacadeView, buildTopView, buildSectionView)
- Les engines (generateCabanon, etc.)
- La page de synthese 3D (capture + annotations)
- Le nombre de pages (5)
- Le contenu BOM

### Fichiers proteges (rappel)
- `lib/deckEngine.js`
- `lib/deckConstants.js`
- `lib/deckGeometry.js`
- `lib/foundation/foundationCalculator.js`
- `modules/cabanon/engine.js`
