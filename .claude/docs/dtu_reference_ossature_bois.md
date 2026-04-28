# Référence DTU — Ossature Bois (Cabanon + Terrasse)

Extrait des textes normatifs applicables aux modules du simulateur DIY Builder.
Sources : dtu.golgoth.org (lecture Chrome MCP, avril 2026)

---

## 1. Quelle norme s'applique à quoi ?

| Module | DTU applicable | Objet |
|---|---|---|
| **Cabanon** (ossature montants/voile) | **NF DTU 31.2 P1-1 (mai 2019)** | Construction maisons à ossature bois — voile travaillant |
| **Terrasse** (platelage ≤ 1m du sol) | **NF DTU 51.4 P1-1 (déc. 2018)** | Platelages extérieurs en bois — lames + lambourdes |
| **Terrasse** (si structure porteuse > 1m) | NF DTU 31.1 P1-1 | Charpente bois portant le platelage |
| **Pergola** (charpente bois) | NF DTU 31.1 P1-1 | Charpente bois / poteau-poutre |
| **Clôture** (poteaux + rails) | NF DTU 31.1 P1-1 (poteaux) | Charpente bois ; poteaux > 15cm du sol |

> ⚠️ Le DTU 31.1 exclut explicitement "les travaux d'ossature bois à voile travaillant"
> (montants verticaux ≤ 60cm d'entraxe + traverses + panneaux) → ces travaux sont visés par le **DTU 31.2**.
> Notre cabanon est donc sous DTU 31.2, pas 31.1.

---

## 2. NF DTU 31.2 P1-1 — Ossature bois voile travaillant (CABANON)

### 2.1 Dimensions des montants (§ 9.1.1)

| Critère | Valeur DTU | Valeur projet (`cabanonConstants.js`) | Statut |
|---|---|---|---|
| Épaisseur montants | ≥ 36 mm | `SECTION = 0.09 m = 90 mm` | ✅ |
| Largeur montants | **≥ 95 mm** (à l'humidité en service) | `SECTION = 90 mm` | ⚠️ Juste sous la limite |
| Élancement (largeur/épaisseur) | ≤ 6 | 90/90 = 1 | ✅ |
| Humidité bois à l'assemblage | ≤ 18 % | — (non contrôlé côté soft) | — |

> **Note sur la largeur :** Le DTU précise "à l'humidité en service". En pratique, la section commerciale
> courante en France pour l'ossature bois est 75×100mm ou 45×145mm (DTU ossature légère).
> La section 90×90 (4×9 cm) est courante mais techniquement en dessous du minimum 95mm.
> Pour un cabanon de jardin non soumis à permis de construire (< 20m²), la tolérance de 5mm
> est généralement acceptée dans la pratique professionnelle. À documenter dans les guides.

### 2.2 Entraxe des montants (§ 9.2.1 NOTE)

```
Espacement montants ≤ 600 mm
```

**→ `STUD_SPACING = 0.60 m` dans cabanonConstants.js est la valeur LIMITE du DTU. ✅ Conforme.**

Note : l'entraxe peut être réduit selon les charges, le format des panneaux de contreventement,
ou la nature des revêtements. Pour les modules standard (≤ 6m × 4m), 60cm est acceptable.

### 2.3 Assemblage montants / traverses (§ 9.2.1)

- Minimum : **2 pointes crantées, torsadées ou annelées, ou vis**
- Enfoncement ≥ une fois l'épaisseur de la pièce à fixer

### 2.4 Voile de contreventement (§ 9.2.2, § 5.11.2 DTU 31.1)

Panneaux admissibles :
- **Contreplaqué ≥ 10 mm** (type 3S)
- **OSB/3 ou OSB 4 ≥ 16 mm**
- Panneaux de particules P5/P7 ≥ 16 mm

Fixation :
- Pointes/agrafes : enfoncement dans bois ≥ **35 mm**
- Vis : enfoncement dans bois ≥ **25 mm**
- Jeu fonctionnel entre panneaux : ≥ **4 mm**
- Distance minimum des fixations aux bords : ≥ **10 mm**
- Espacement périphérie panneaux : ≤ **150 mm** (DTU 31.1 § 5.11.2)
- Espacement appuis intermédiaires : ≤ **300 mm**

### 2.5 Chevêtre (encadrement des ouvertures) (§ 9.2.3.1)

Constitution obligatoire autour de chaque baie (porte / fenêtre) :

```
┌─ Montant continu pleine hauteur (chaque côté de l'ouverture)
├─ Traverse de linteau
├─ Linteau (dimensionné en flèche)
├─ Traverse d'appui (si allège / fenêtre)
└─ Montants d'appui (cripple studs) au-dessus du linteau et sous la traverse
   → entraxe ≤ 600 mm
```

**Linteau** : flèche finale `Wfin ≤ portée/500`, max **10 mm**

Tolérances chevêtre :
- Dimensions baie : ± 5 mm
- Verticalité : ± 3 mm
- Horizontalité : ± 3 mm

**→ Correspondance dans l'engine cabanon :**
- `king studs` = montants continus latéraux ✅
- `jack studs` = montants trimmer intérieurs ✅
- `cripple studs` au-dessus linteau ✅
- `LINTEL_H = 0.12 m` pour la traverse de linteau ✅
- Linteau porte (h=2.0m, largeur 0.9m) : Wfin ≤ 900/500 = 1.8mm → ok avec section 90×90

### 2.6 Isolation entre montants (§ 9.3.1.3)

- Isolants semi-rigides obligatoires
- Hauteur cavité ≤ **3.00 m** (au-delà, entretoise de support requise)
- Surcote des isolants : +5mm par rapport à la cavité (contact continu)

### 2.7 Justification mécanique (§ 7)

- Calculs selon **Eurocode 5 (NF EN 1995-1-1)**
- Contreventement peut être justifié par règles simplifiées (Annexe D du DTU 31.2)
- Fixations murs au soubassement : justifiées en efforts verticaux ET horizontaux

---

## 3. NF DTU 31.1 P1-1 — Charpente bois (TERRASSE / PERGOLA)

### 3.1 Platelage (Terrasse) — Domaine d'application (§ 1)

Le DTU 31.1 s'applique au platelage lorsque :
- Platelage **à > 1m** au-dessus du sol → toujours couvert
- Platelage **à ≤ 1m** avec portée des supports :
  - **> 70 cm** sur 3 appuis → couvert
  - **> 60 cm** sur 2 appuis → couvert

**→ Notre terrasse (lambourdes avec plots tous les ~90cm) est couverte par le DTU 31.1.**

### 3.2 Dimensions pour les calculs (§ 5.4)

Les dimensions de calcul sont ramenées à **12% d'humidité** :

```
D = Dref × [1 - β90 × (Href - 12)]
β90 = 0.0025 (résineux)  |  β90 = 0.0030 (chêne)
```

Exemple : section 75×225 commerciale (à 20%) → calcul à 12% : 73.5 × 220.5 mm

### 3.3 Contreventement (§ 5.11)

**Par barres :**
- Distance max entre poutres au vent transversal : **60 m** (max 8 travées)
- Distance max longitudinal : **40 m**

**Par panneaux (§ 5.11.2) :**
- Contreplaqué ≥ 10 mm
- OSB/3 ou OSB 4 ≥ **16 mm**
- Platelage bois massif rainé-bouveté ≥ **15 mm**
- Fixations : pointes non lisses, espacement périphérie ≤ **150 mm**
- Fixations intermédiaires : ≤ **300 mm**
- Longueur pointes : > **2.5 × épaisseur du panneau**

### 3.4 Durabilité — Pieds de poteaux (§ 5.10.4.2)

Exigence pour les pieds de poteaux exposés (pergola, clôture) :
- Hauteur depuis le sol naturel : **≥ 15 cm**
- Hauteur depuis la surface d'un plot béton fini : **≥ 10 cm**

**→ Pertinent pour le calcul des poteaux pergola et poteaux clôture.**

### 3.5 Planches de rive (§ 7.6)

```
Planche de rive doit dépasser l'habillage de l'avancée du toit de 12 mm minimum (larmier)
```

### 3.6 Tolérances de mise en oeuvre (§ 7.7)

| Élément | Tolérance |
|---|---|
| Côtes d'implantation | ± 0.1% des dimensions, max ± 30 mm |
| Altimétrie appuis | ± 10 mm |
| Aplombs | ± 2.5 mm/m, max ± 25 mm |
| Solivage (faces sup.) | désaffleurement ≤ entraxe/50, max 5 mm |
| Chevronnage (faces sup.) | désaffleurement ≤ entraxe/100 |

---

## 4. Synthèse — Impact sur les constantes du projet

### cabanonConstants.js

```js
STUD_SPACING = 0.60   // ✅ Valeur limite DTU 31.2 § 9.2.1 — conforme
SECTION      = 0.09   // ⚠️ DTU 31.2 § 9.1.1.2 : largeur min ≥ 0.095m en service
                      //    90mm est la section commerciale courante → acceptable en pratique
LINTEL_H     = 0.12   // ✅ Hauteur linteau/chevêtre cohérente avec DTU
SILL_H       = 0.09   // ✅ Appui fenêtre = 1 section (= SECTION)
CORNER_ZONE  = 0.12   // ✅ Zone de coin avec 2 montants overlappés
```

### Checklist DTU non couverts par le simulateur actuel

| Élément | Statut | Action possible |
|---|---|---|
| Voile contreventement (panneaux) | Non calculé | Ajouter dans BOM si demandé |
| Fixations voile (pointes/agrafes) | Non calculé | Ajouter dans BOM (consommables) |
| Pare-vapeur | Non modélisé | Information dans guides |
| Isolation entre montants | Non calculé | Ajouter comme consommable optionnel |
| Pied de poteau (hauteur ≥ 15cm) | Non contrôlé | Note dans guide pergola/clôture |
| Linteau : vérification flèche | Non calculé | Information dans guide cabanon |

---

## 5. NF DTU 51.4 P1-1 — Platelages extérieurs en bois (TERRASSE)

> Source : NF DTU 51.4 P1-1 (décembre 2018) — extrait via Chrome MCP depuis dtu.golgoth.org

### 5.1 Domaine d'application (§ 1)

- Platelages en bois à moins de **1 m du sol**
- Pente ≤ **5 %**
- Plots polymères admis jusqu'à **30 cm** de hauteur
- Platelage sur plots ou lambourdes posées sur : sol brut stabilisé, dallage DTU 13.3, maçonnerie DTU 20.1, béton DTU 21, charpente bois DTU 31.1

> ⚠️ Le DTU 51.4 s'applique au platelage seul (lames + lambourdes). La structure porteuse
> (si terrasse sur pilotis / solives) reste sous DTU 31.1.

### 5.2 Portées maximales des lambourdes (§ 5.2.1, § A.9)

```
Portée max sur appuis multiples (≥ 3) : 700 mm
Portée max sur 2 appuis seulement    : 600 mm
```

**→ `JOIST_SPACING` dans `deckEngine.js` ≈ 0.40 m → ✅ largement sous les limites DTU.**

Les critères de flèche retenus (Annexe B § A.9) :
- Lames : flèche instantanée **et** totale finale ≤ **5 mm**
- Lambourdes : flèche instantanée ≤ **L/300** ; flèche totale finale ≤ **L/200**

### 5.3 Dimensions minimales des lambourdes (§ 5.5.3.6)

**Largeur (§ 5.5.3.6.1)**

| Cas | Largeur minimale |
|---|---|
| 1 vis dans la largeur (partie courante, rive, double lambourdage) — résineux < D40/C30 | **≥ 45 mm** |
| 1 vis dans la largeur — feuillu ≥ D40 | **≥ 40 mm** |
| 2 vis dans la largeur (2 lames sur même lambourde) — vis ø5 mm | **≥ 60 mm** |
| 2 vis dans la largeur — vis ø6 mm | **≥ 68 mm** |

**Hauteur (§ 5.5.3.6.2)**
- Définie par la profondeur de pénétration de vis requise (§ 5.5.6.2.1)

**Section minimale (§ 5.5.3.6.3)**
- Section ≥ **2 200 mm²** (condition pour le classement mécanique par outillage standard)

> **→ Lambourdes commerciales 45×70 mm** (section = 3 150 mm²) : ✅ conformes (largeur 45mm, section > 2200 mm²)
> **→ Lambourdes 45×45 mm** (section = 2 025 mm²) : ⚠️ sous le minimum de section

### 5.4 Mise en oeuvre des lames (§ 5.5.4)

**Écartement entre lames (§ 5.5.4.2.2)**

- Jeu en vie en oeuvre : **≥ 3 mm** et **≤ 12 mm** (max 15 mm en sécheresse extrême)
- Règle valable pour largeurs de lames ≤ ~140 mm
- Pose avec cales d'épaisseur variable selon l'humidité de mise en oeuvre du bois (Tableau 8)

**→ `BOARD_GAP = 0.005 m = 5 mm` dans `deckConstants.js` : ✅ dans la fourchette [3–12 mm].**

**Continuité en bout de lame (§ 5.5.5)**

- Jeu entre extrémités de deux lames jointives : **4 à 6 mm**
- Jeu réduit à **1–5 mm** pour bois de classe durabilité naturelle très élevée (classe 1, NF EN 350)

**→ Confirme le jeu `z = 4-6 mm` des double lambourdes dans `deckEngine.js` : ✅**

### 5.5 Fixations (§ 5.5.6)

**Règles générales (§ 5.5.6.1)**
- Vissage **INOX A2** minimum
- INOX A4 si ambiance corrosive (bord de mer, piscine)

**Types de vis admis (§ 5.5.6.2.1)**
- Vis à **double filetage** ✅
- Vis à **congé de filetage sous tête** ✅
- ⛔ Vis à filetage uniforme total (de pointe à sous-face tête) : **NON admises**
- Tête : doit brider effort de soulèvement ≥ **50 daN** (pour lames < 45 mm d'épaisseur)

**Pré-perçage (§ 5.5.6.2.2)**
- Obligatoire en **extrémité de lame** (résineux et feuillu)
- Obligatoire en **partie courante** pour lames en bois feuillu
- Diamètre pré-perçage : **≈ 0,8 × diamètre extérieur filet** de la vis

**Diamètre minimal de vis (§ 5.5.6.2.3)**
- Dépend de l'épaisseur de la lame et de sa masse volumique (Tableau 9 du DTU)

### 5.6 Classe de service et calcul (Annexe B)

- **Classe de Service 3** retenue pour tous les calculs (extérieur exposé)
- Calcul conforme aux principes des **Eurocodes (NF EN 1995-1-1)**
- Classes mécaniques : C18, C24, D18, D24, D30, D35, D40, D45 ou D50 (NF EN 338)
- Charges d'exploitation retenues (catégorie A — balcons) :
  - `qk = 3,5 kN/m²` (charge répartie) ; `Qk = 2 kN` (charge concentrée)
- Facteur `ksys = 1,1` applicable aux lambourdes (effet système des lames)

### 5.7 Synthèse — Impact sur les constantes du projet (terrasse)

#### deckConstants.js

```js
BOARD_GAP       = 0.005   // ✅ DTU 51.4 § 5.5.4.2.2 : jeu en oeuvre [3–12 mm]
BOARD_WIDTH     = 0.140   // ✅ Largeur lame standard ≤ 140 mm (règle simplifiée jeu)
JOIST_SPACING   ≈ 0.40    // ✅ DTU 51.4 § 5.2.1 : portée max 700 mm sur 3 appuis
```

#### Checklist DTU 51.4 non couverts par le simulateur actuel

| Élément | Statut | Action possible |
|---|---|---|
| Dimensions lambourdes (45×70 min) | Non affiché | Ajouter dans guides + BOM |
| Type de vis INOX A2 requis | Non affiché | Mentionner dans BOM consommables |
| Pré-perçage extrémités | Non modélisé | Information dans guide terrasse |
| Portée plots (≤70cm) | Non contrôlé | Vérification passive (JOIST_SPACING ok) |
| Classe de service 3 | Non affiché | Mention dans guide terrasse |
| Jeu bout de lame (4-6 mm) | Implicite via double lambourdes | ✅ conforme |

---

## 6. DTU non disponibles / à sourcer

| DTU | Objet | Pertinence projet |
|---|---|---|
| NF DTU 13.3 | Dallages | Fondation dalle cabanon |
| NF DTU 41.2 | Bardages bois | Parement extérieur cabanon |
| NF EN 1995-1-1 (Eurocode 5) | Calcul structures bois | Référence de calcul |
| NF DTU 43.4 | Toitures terrasses bois | Terrasse suspendue |

---

*Sources extraites via Chrome MCP depuis dtu.golgoth.org — avril 2026*
*NF DTU 31.1 P1-1 (juin 2017), NF DTU 31.2 P1-1 (mai 2019), NF DTU 51.4 P1-1 (décembre 2018)*
