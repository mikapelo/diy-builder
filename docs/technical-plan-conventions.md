# Conventions de plans techniques — Synthèse pour DIY Builder

> Document de référence EXPORT — DIY Builder
> Date : 2026-03-30
> Objectif : synthétiser les conventions observées dans les plans techniques réels de construction bois, pour guider l'évolution des exports PDF.

---

## 1. Hiérarchie des vues

L'observation des plans professionnels révèle un séquençage de vues constant, adapté selon le type de projet.

### Séquençage standard d'un set de plans complet

| N° | Vue | Objectif | Échelle typique |
|---|---|---|---|
| 1 | **Synthèse 3D / isométrique** | Vue d'ensemble immédiate, contexte | Variable |
| 2 | **Plan de dessus** | Implantation, espacements, calepinage | 1:50 |
| 3 | **Élévation(s)** | Proportions extérieures, hauteurs, ouvertures | 1:50 |
| 4 | **Coupe transversale** | Empilement structurel, épaisseurs, assemblages | 1:50 → 1:20 |
| 5 | **Détails constructifs** | Connexions critiques, fixations, assemblages | 1:10 → 1:5 |
| 6 | **Nomenclature / BOM** | Quantités, spécifications, approvisionnement | — |

### Vues prioritaires par type de projet

| Module | Vues essentielles | Vues souhaitables | Vues optionnelles |
|---|---|---|---|
| **Terrasse** | Dessus (calepinage), Coupe transversale | Détail fixation lame, Détail plot/lambourde | Élévation (peu utile car structure plate) |
| **Cabanon** | Plan au sol, Façade avant, Coupe transversale | 3 autres élévations, Ossature mur, Plan charpente | Détails assemblage coin, linteau |
| **Pergola** | Dessus (implantation poteaux/chevrons), Élévation façade | Élévation latérale, Détail pied de poteau | Détail assemblage poutre/chevron |
| **Clôture** | Élévation linéaire (motif répétitif), Coupe poteau | Détail assemblage rail/lame | Détail de scellement béton |

---

## 2. Conventions de cotation

### Principes observés

- **Unité métrique** : millimètres dans les plans professionnels français, mètres dans les plans de principe ; notre simulateur utilise les mètres avec 2 décimales → afficher en **cm** ou **m** selon le contexte (dimensions globales en m, sections en mm)
- **Lignes de cote** : traits fins (0.25 mm) avec flèches ou ticks aux extrémités, texte centré au-dessus (horizontal) ou à gauche (vertical)
- **Notation "entraxe"** : symbolisée par ⊕ ou "e =" dans les plans français ; "OC" (on center) dans les plans anglo-saxons
- **Chaîne de cotes** : les cotes sont chaînées le long d'un axe (ex : espacement régulier des lambourdes) avec une cote totale englobante
- **Cotes de niveau** : hauteurs exprimées depuis le sol fini (SF) ou terrain naturel (TN), avec un triangle ▼ pour repérer le niveau de référence

### Application DIY Builder

| Convention | Usage actuel | Recommandation |
|---|---|---|
| Unité dimensions globales | Mètres (2 déc.) | Conserver |
| Unité sections bois | Absente | Ajouter en mm (ex : "45×145 mm") |
| Unité entraxes | Mètres | Afficher en cm pour lisibilité ("60 cm") |
| Chaîne de cotes | Partielle (terrasse TechnicalPlan SVG) | Généraliser à toutes les vues |
| Cote totale englobante | Présente sur TechnicalPlan | Ajouter sur les coupes |

---

## 3. Conventions de traits

Les normes ISO 128 et NF P02-001 définissent une hiérarchie de traits essentielle à la lisibilité.

### Hiérarchie standard

| Type de trait | Épaisseur | Usage | Aspect |
|---|---|---|---|
| **Continu fort** | 0.50–0.70 mm | Contours visibles, arêtes principales | ━━━━━━━━ |
| **Continu moyen** | 0.35 mm | Éléments secondaires, structure interne visible | ──────── |
| **Continu fin** | 0.18–0.25 mm | Lignes de cote, lignes d'attache, hachures | ─ ─ ─ ─ |
| **Interrompu** | 0.35 mm | Arêtes cachées (derrière un autre élément) | — — — — |
| **Mixte fin** | 0.18 mm | Axes de symétrie, lignes de coupe | —·—·—·— |

### Application DIY Builder

Dans les PDF jsPDF actuels, le `setLineWidth` est utilisé mais sans hiérarchie cohérente entre les pages. Recommandation :

```
TRAIT_FORT     = 0.5   // contours de mur, arêtes principales
TRAIT_MOYEN    = 0.35  // structure secondaire (montants, chevrons)
TRAIT_FIN      = 0.2   // cotations, lignes d'attache
TRAIT_TRES_FIN = 0.1   // hachures, remplissages
```

---

## 4. Hachures et remplissages

### Conventions observées en construction bois

| Matériau | Convention de hachure | Usage |
|---|---|---|
| **Bois (coupe)** | Lignes diagonales parallèles à 45°, espacement 1.5-2 mm | Section transversale de pièces bois |
| **Béton** | Pointillés irréguliers ou granulats stylisés | Plots, dallage, scellement |
| **Sol / terrain** | Hachures croisées lâches ou points | Terrain naturel en coupe |
| **Isolant** | Zigzags | Non pertinent pour nos modules actuels |
| **Métal** | Lignes diagonales serrées croisées | Quincaillerie (platines, équerres) en détail |

### Application DIY Builder

Le système `buildSectionView.js` utilise déjà des couleurs de remplissage (fill) pour différencier les matériaux. Recommandation :
- Conserver les fills couleur pour la vue écran (SVG)
- Ajouter des hachures normées pour la version PDF (impression N&B compatible)
- Prioriser : hachure bois 45° pour les sections de montants/lisses/chevrons en coupe

---

## 5. Cartouche (titre / en-tête)

### Contenu standard (ISO 7200)

| Champ | Obligatoire | Contenu DIY Builder |
|---|---|---|
| Titre du plan | ✓ | "Projet [Module] Bois — [Largeur] × [Profondeur]" |
| Échelle | ✓ | Échelle de la vue principale |
| Date | ✓ | Date de génération |
| N° de page | ✓ | "Page X / Y" |
| Organisme | ✓ | "DIY Builder — Simulateur" |
| Indice de révision | ○ | Non pertinent (génération unique) |
| Auteur | ○ | Non pertinent |
| Méthode de projection | ○ | Optionnel (Europe = 1er dièdre) |

### Position et format

- **Position** : bas de page, bande horizontale (notre footer actuel est un bon début)
- **Taille recommandée** : hauteur 12-15 mm en bas de page A4
- **Information complémentaire** : mention "Document généré automatiquement — non contractuel"

### État actuel vs cible

Le `footer()` actuel dans `pdfDrawing.js` affiche uniquement : texte "Document technique généré automatiquement" + pagination. Il faudrait enrichir avec l'échelle et le titre du plan de la page.

---

## 6. Légendes

### Principes observés

- Placées en **haut à droite** ou **bas à droite** de la page, encadrées
- Contiennent : code couleur ou style de trait → nom de l'élément
- Maximum 6-8 éléments par légende (au-delà, simplifier ou segmenter)
- Taille de texte : 7-8 pt pour ne pas concurrencer le dessin

### État actuel

- `TechnicalPlan.jsx` (SVG terrasse) a une légende interactive complète (lames, lambourdes, plots, entretoises, jonctions)
- Les pages PDF n'ont pas de légende → à ajouter

---

## 7. Notes techniques

### Informations à afficher par type de projet

| Module | Notes essentielles |
|---|---|
| **Terrasse** | DTU 51.4, jeu entre lames (5-8 mm), ventilation sous structure (≥50 mm), entraxe lambourdes, pente d'évacuation 1.5% |
| **Cabanon** | Entraxe montants (60 cm), section bois, hauteur sous plafond, pente toit, classe d'emploi bois |
| **Pergola** | Hauteur libre sous poutre, espacement chevrons, classe d'emploi, seuils réglementaires (5 m² / 20 m²) |
| **Clôture** | Profondeur scellement poteau, entraxe poteaux, jeu entre lames, hauteur hors sol |

### Convention de placement

- **Bloc notes** : encadré fin, placé sous le plan ou en bas de page, texte 7-8 pt
- **Références normatives** en italique (ex : "Conforme DTU 51.4 — décembre 2018")
- **Avertissements** : "Les quantités sont calculées avec une marge de sécurité de X%. Adapter aux conditions réelles du chantier."

---

## 8. Nomenclature / BOM

### Structure standard observée

| Colonne | Description | Exemple |
|---|---|---|
| **N°** | Numéro séquentiel lié aux repères du plan | 1, 2, 3… |
| **Désignation** | Nom de la pièce avec section | "Lambourde pin 45×145 mm" |
| **Quantité** | Nombre d'unités | 14 |
| **Longueur unitaire** | Dimension principale | 3.50 m |
| **Longueur totale** | Quantité × longueur | 49.00 ml |
| **Notes** | Classe d'emploi, traitement | "Cl. 4 autoclave" |

### Organisation par système constructif (recommandé)

1. **Fondation** : plots béton, dallage
2. **Structure porteuse** : poteaux, lambourdes, longerons
3. **Structure secondaire** : entretoises, traverses, chevrons
4. **Revêtement** : lames, bardage, voliges
5. **Quincaillerie** : vis, boulons, platines, équerres

### État actuel vs cible

| Module | BOM actuelle | Niveau cible |
|---|---|---|
| Terrasse | Complète (boards, joists, pads, screws, entretoises, bande) avec prix | Ajouter sections bois, n° de repère, organisation par système |
| Cabanon | Complète (murs, montants, lisses, chevrons, bardage, voliges) | Ajouter sections bois, repères liés au plan |
| Pergola | Basique (posts, beams, rafters, hardware) | Enrichir avec longueurs totales, classes d'emploi |
| Clôture | Basique (posts, rails, boards, screws) | Enrichir avec profondeur scellement, classes d'emploi |

---

## 9. Bonnes pratiques de lisibilité

### Observées dans les plans de qualité

1. **Hiérarchie visuelle** : le plan principal domine la page (60-70% de la surface), les cotes et légendes sont périphériques
2. **Espacement** : marge minimale de 15 mm entre le dessin et les bords de page
3. **Couleur** : les plans professionnels sont conçus pour être lisibles en N&B ; la couleur est un bonus, pas une nécessité
4. **Police** : sans-serif (Helvetica, Arial) ; taille minimum 7 pt sur le PDF final
5. **Contraste** : traits forts pour les contours, traits fins pour les cotes → rapport d'épaisseur ≥ 2:1
6. **Pas de surcharge** : maximum 3 niveaux de cotation imbriqués ; au-delà, créer une vue de détail séparée
7. **Repères** : les numéros de repère (①②③) sur le plan correspondent à la nomenclature

---

## 10. Résumé des conventions prioritaires à implémenter

| Priorité | Convention | Impact | Effort |
|---|---|---|---|
| **P1** | Hiérarchie de traits (fort/moyen/fin) dans les PDF | Lisibilité immédiate | Faible |
| **P1** | Cartouche enrichi (titre, échelle, date, page) | Aspect professionnel | Faible |
| **P2** | Légendes sur les pages de plans techniques PDF | Compréhension autonome du plan | Moyen |
| **P2** | BOM avec sections bois et organisation par système | Valeur d'usage pour l'utilisateur | Moyen |
| **P2** | Notes techniques normatives par module | Crédibilité technique | Faible |
| **P3** | Hachures bois en coupe (pour impression N&B) | Conformité aux standards | Moyen |
| **P3** | Repères numérotés plan ↔ BOM | Lien plan-nomenclature | Élevé |
