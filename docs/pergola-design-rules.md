# Règles de conception — Module Pergola

> Source principale : Guide COBEI (FCBA/CODIFAB, juin 2022), §3.1 Pergolas, pages 66-73.
> Croisé avec : BILP Pergola (outils EC5), Projet G (exemple réel BILP).
> Dernière mise à jour : 2026-03-29.

---

## 1. Cadre normatif

**Il n'existe pas de DTU ni de règles spécifiques aux pergolas bois.**
Les pergolas sont assimilables à des « petits ouvrages de charpente » non structuraux.
Elles ne relèvent pas du NF DTU 31.1 mais les logiques de conception drainante du Guide COBEI s'appliquent.

**Catégorie** : `best_practice` (pas de norme spécifique)
**⚠️ NE PAS CODER comme norme DTU.**

---

## 2. Anatomie d'une pergola (COBEI §3.1.2)

| # | Pièce | Rôle | Orientation |
|---|-------|------|-------------|
| 1 | **Poteau** | Porteur vertical — supporte toute la charge | Vertical |
| 2 | **Longeron** (poutre porteuse) | Horizontal — transmet charges chevrons → poteaux | Horizontal |
| 3 | **Chevron** | Horizontal — surmonte le longeron, porte lattes/couverture | Horizontal |
| 4 | **Lien** (jambe de force) | Diagonal — contreventement poteau/longeron | Incliné |
| — | **Latte** (optionnel) | Horizontal sur chevrons — ombrage, support plantes | Horizontal |

### Points singuliers (assemblages critiques)

| Code | Assemblage | Solution COBEI |
|---|---|---|
| A | Pied de poteau | Poteau moisé sur platine, boulonnage + rondelles EE |
| B | Poteau / longeron | Poteau moisé sur longeron, boulonnage espacé 5 mm min. |
| C | Longeron / chevron | Fixation par vis en sous-face du longeron (lamage + préperçage) |
| D1 | Poteau / lien (bas) | Boulonnage entre moises, rondelles EE, cales d'espacement |
| D2 | Poteau / lien (face) | Vissage avec rondelles EE 2.5 mm, espacement 5 mm |
| E | Longeron / lien (haut) | Tenon-mortaise traditionnel, effet masque ≥10 mm débord |
| F | Chevron / lien | Vissage avec rondelles EE 2.5 mm |

---

## 3. Classes d'emploi pergola (COBEI §3.1.3-4)

**Situation** : pleine exposition (Tableau 3 du FD P 20-651).

| Pièce | Massivité | Face critique | Conception partie courante | Classe d'emploi typique |
|---|---|---|---|---|
| Poteau | Moyenne à Forte | Bois de bout (haut/bas) | Drainante (faces latérales verticales) | 3.1 à 3.2 selon climat |
| Longeron | Moyenne | Face supérieure horizontale | **Piégeante si non inclinée** → classe 4 ! | 3.2 max si conception moyenne |
| Chevron | Moyenne | Face supérieure | Identique au longeron | 3.2 max si conception moyenne |
| Lien | Moyenne | Face supérieure (pente <75°) | Moyenne | 3.1 (sec) à 3.2 (modéré/humide) |

### Règles critiques durabilité

| Règle | Source | Catégorie | Impact simulateur |
|---|---|---|---|
| Face supérieure longeron : protéger par capotage EPDM ou bande étanche | COBEI §3.1.4 p.69 | `best_practice` | Rendu 3D : bande sombre sur longeron. BOM : bande EPDM. |
| Face supérieure chevrons : délardement monopente ≥15° | COBEI §3.1.4 p.69 | `best_practice` | Geometry : chanfrein chevrons. Rendu : visible en mode détaillé. |
| Bois de bout poteaux (haut) : protection obligatoire | COBEI §3.1.4 p.73 | `best_practice` | Rendu : capotage métal ou chanfrein. BOM : chapeau poteau. |
| Bois de bout longerons/chevrons : vertical → conception Moyenne | COBEI §3.1.4 p.73 | `best_practice` | Rendu : about visible. Info PDF. |
| Espacement 5 mm min entre pièces assemblées (non structurale) | COBEI §3.1.4 p.70 | `best_practice` | Geometry : jeu visible dans assemblages. |

---

## 4. Dimensionnement (sources croisées BILP + forums pro)

### 4.1 Sections commerciales courantes

| Pièce | Section typique | Min | Max courant | Notes |
|---|---|---|---|---|
| Poteau | 100×100 mm | 90×90 | 200×200 | 120×120 standard pour portées >3 m |
| Longeron | 150×50 mm | 63×175 | 200×300 | Doublé (moisé) pour grandes portées |
| Chevron | 150×50 mm | 63×75 | 150×80 | Section identique au longeron souvent |
| Lien | 100×50 mm | 50×100 | 100×100 | Même section que chevron possible |

### 4.2 Portées et entraxes

| Paramètre | Valeur typique | Plage | Source | Confiance |
|---|---|---|---|---|
| Entraxe poteaux | 3.0 m | 2.0 – 4.5 m | BILP, forums | `best_practice` |
| Portée longeron max (simple) | 4.0 m | 3.0 – 5.5 m | BILP calculs EC5 | `best_practice` |
| Portée longeron max (moisé) | 6.0 m | 5.0 – 7.0 m | Forums pro | `best_practice` |
| Entraxe chevrons | 50 – 60 cm | 40 – 100 cm | BILP, COBEI | `best_practice` |
| Portée chevron | 3.0 – 4.0 m | 2.0 – 5.0 m | BILP | `best_practice` |
| Hauteur poteau (sol→longeron) | 2.20 – 2.50 m | 2.0 – 3.0 m | Pratique courante | `simulator_assumption` |

### 4.3 Exemple réel validé (Projet G — BILP)

| Paramètre | Valeur |
|---|---|
| Dimensions | 6 × 4 × 2.5 m |
| Poteaux | 100×100 mm mélèze |
| Longerons | 150×50 mm mélèze |
| Chevrons | 150×50 mm |
| Liens | 100×50 mm |
| Fixation pied poteau | Tirefond D10 L100 sur platine béton |
| Fixation poteau/longeron | Encoche 50×150 mm + boulonnage |
| Fixation chevron/longeron | Vis bois D6 L90 |

---

## 5. Descente de charge (méthodologie BILP/EC5)

**Séquence obligatoire** : Couverture → Chevrons → Longerons → Poteaux → Fondation

1. **Charge toiture** = permanente (poids couverture) + climatique (neige selon zone/altitude + vent)
2. **Charge chevron** = charge toiture × surface d'influence du chevron + poids propre
3. **Charge longeron** = somme charges chevrons qu'il supporte + poids propre
4. **Charge poteau** = somme charges longerons × surface d'influence + poids propre

**Classe de service** :
- Pergola ouverte (sans couverture étanche) : **Classe 3** (extérieur non abrité)
- Pergola couverte (polycarbonate, bac acier) : **Classe 2** (extérieur sous abri)

---

## 6. Fondations

| Type | Usage | Profondeur | Notes |
|---|---|---|---|
| Platine métallique sur plot béton | Standard DIY | Plot 40×40×40 cm | Solution la plus courante |
| Pied de poteau en sabot | Sur dalle existante | Ancrage chimique/mécanique | Hauteur min 15 cm du sol (COBEI) |
| Goujon collé | Esthétique supérieure | Scellement chimique | Contrainte : distance sol min |

**Règle COBEI** : distance minimale bas du poteau au sol = **150 mm** (`best_practice`, source COBEI §3.3.4.4 p.85)

---

## 7. Règles pour le simulateur

### Geometry (can_drive_geometry = true)

| Règle | Valeur par défaut | Configurable |
|---|---|---|
| Nombre poteaux = f(longueur, entraxe) | entraxe 3.0 m | Oui |
| Section poteau | 100×100 | Presets 90/100/120/150 |
| Section longeron | 150×50 | Presets |
| Section chevron | 150×50 | Presets |
| Entraxe chevrons | 50 cm | 40-100 cm |
| Hauteur poteau | 2.30 m | 2.0-3.0 m |
| Liens (contreventement) | 1 par poteau d'angle | Toujours |
| Porte-à-faux chevron | 15 cm | 0-30 cm |

### BOM (can_drive_bom = true)

| Élément | Calcul |
|---|---|
| Poteaux | nombre × hauteur |
| Longerons | 2 × longueur (ou 4 si moisés) |
| Chevrons | nombre × largeur |
| Liens | 4 à 8 (angle + intermédiaires) |
| Vis D6×90 | 2 × (chevrons × longerons) |
| Boulons + rondelles EE | 2 × poteaux × longerons |
| Pieds de poteau (platine) | = nombre poteaux |
| Béton plots (optionnel) | nombre × 0.064 m³ (40×40×40 cm) |

### Rendu (can_drive_rendering = true)

- Chanfrein chevrons visible (15° monopente)
- Espacement 5 mm assemblages (mode détaillé)
- Liens diagonaux visibles
- Capotage poteau optionnel
- Bande EPDM sur longeron (mode détaillé)

---

## 8. Hypothèses simulateur (⚠️ non normatives)

| Hypothèse | Justification | Risque |
|---|---|---|
| Section 100×100 poteaux par défaut | Standard commerce, validé BILP Projet G | Insuffisant si portée >4.5 m ou forte charge neige |
| Pas de calcul EC5 intégré | Trop complexe pour DIY. Presets validés. | L'utilisateur peut surdimensionner ou sous-dimensionner |
| Mélèze par défaut | Durabilité naturelle classe 3, pas de traitement | Insuffisant en classe 4 (longerons non protégés) |
| 4 poteaux pour ≤4×3 m | Pratique courante | 6 poteaux nécessaires si >4×4 m |
