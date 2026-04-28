# Règles de conception — Module Clôture

> Source principale : Guide COBEI (FCBA/CODIFAB, juin 2022), §3.3 Clôtures, pages 81-86.
> Croisé avec : Règles professionnelles UNEP CC5-R0 (2020), pratique courante.
> Dernière mise à jour : 2026-03-29.

---

## 1. Cadre normatif

**Il n'existe pas de DTU, de règles de l'art, ni de recommandations professionnelles spécifiques aux clôtures en bois** (confirmé par COBEI §3.3.1, p.81).

Les **Règles professionnelles UNEP CC5-R0** (2020) couvrent les clôtures au sens large (bois, composite, métal, grillage) mais ne sont pas des normes NF.

La résistance au vent est encadrée par le **DTU NV65** (Actions climatiques neige et vent).

**Catégorie** : `best_practice` (pas de norme spécifique clôture bois)
**⚠️ NE PAS CODER comme norme DTU.**

---

## 2. Typologie des clôtures (COBEI §3.3.2)

| Type | Description | Pièces |
|---|---|---|
| **Lames horizontales** | Lames fixées directement sur poteaux | Poteaux + lames |
| **Lames verticales** | Lames fixées sur traverses horizontales, elles-mêmes liées aux poteaux | Poteaux + traverses + lames |
| **Panneaux** | Panneaux préfabriqués insérés entre poteaux | Poteaux + panneaux |
| **Ganivelle** | Piquets liés par fil métallique | Piquets + fil |
| **Palissade** | Planches jointives ou espacées | Poteaux + planches |

---

## 3. Classes d'emploi clôture (COBEI §3.3.3-4)

**Situation** : pleine exposition (Tableau 3 du FD P 20-651).

| Pièce | Massivité | Conception partie courante | Classe d'emploi typique |
|---|---|---|---|
| Poteau | Moyenne à Forte | Drainante (faces verticales) | 3.1 (sec) à 3.2 (humide, forte massivité) |
| Traverse horizontale | Moyenne | **Piégeante si face sup. non inclinée** → classe 4 ! | 3.2 max si inclinée ≥15° |
| Lame horizontale | Faible | **Piégeante si face sup. non inclinée** → classe 4 ! | 3.2 max si inclinée ≥15° |
| Lame verticale | Faible | Drainante (faces verticales) | 3.1 |

### Règles critiques durabilité (COBEI)

| Règle | Source | Catégorie |
|---|---|---|
| Face supérieure traverses et lames horizontales : **inclinaison ≥15° obligatoire** pour éviter conception Piégeante → classe 4 | COBEI §3.3.4.2 p.82, §3.3.4.3 p.83 | `best_practice` |
| Tête de poteau : **protection obligatoire** (capotage métallique, chanfrein) | COBEI §3.3.4.4 p.85 | `best_practice` |
| Pied de poteau : **distance minimale au sol = 150 mm** | COBEI §3.3.4.4 p.85 | `best_practice` |
| Lames verticales : bois de bout protégé (haut) et distant du sol ≥150 mm (bas) | COBEI §3.3.4.4 p.85 | `best_practice` |
| Espacement 5 mm entre pièces assemblées (rondelles EE) | COBEI §3.3.4.3 | `best_practice` |
| Solution « planche à pourrir » : lame basse sacrificielle facilement remplaçable | COBEI §3.3.4.4 p.86 | `best_practice` |

---

## 4. Dimensionnement (UNEP CC5-R0 + pratique)

### 4.1 Poteaux

| Paramètre | Valeur | Source | Catégorie |
|---|---|---|---|
| Section poteau standard | 70×70 à 90×90 mm | UNEP CC5-R0, COBEI | `best_practice` |
| Section poteau > 1.80 m hauteur | 90×90 mm minimum | Pratique courante | `best_practice` |
| Hauteur utile standard | 1.20 à 2.00 m | UNEP CC5-R0 | `best_practice` |
| Enfoncement / scellement | 50 cm minimum | UNEP CC5-R0 | `best_practice` |
| Hauteur totale poteau | Hauteur utile + 50 cm | Calcul | — |

### 4.2 Entraxe poteaux

| Paramètre | Valeur | Source | Catégorie |
|---|---|---|---|
| Entraxe standard | 1.80 m | UNEP CC5-R0 | `best_practice` |
| Plage entraxe | 1.50 – 2.50 m | UNEP CC5-R0, pratique | `best_practice` |
| Calé sur largeur panneau | Oui (panneau standard 1.80 m) | Commerce | `simulator_assumption` |

### 4.3 Panneaux / Lames

| Paramètre | Valeur | Source | Catégorie |
|---|---|---|---|
| Largeur panneau standard | 1.80 m (longueur utile 1.76 m dans poteaux) | Commerce, UNEP | `best_practice` |
| Hauteur panneaux courants | 0.90, 1.20, 1.50, 1.80 m | Commerce | `simulator_assumption` |
| Épaisseur lames | 15 à 28 mm | Commerce | `simulator_assumption` |
| Jeu lame / poteau | 5 mm de chaque côté (bois), 10 mm (composite) | UNEP CC5-R0 | `best_practice` |
| Jeu bas clôture / sol | 30 à 40 mm (ou planche à pourrir, COBEI) | Pratique + COBEI | `best_practice` |

### 4.4 Traverses (lames verticales uniquement)

| Paramètre | Valeur | Source | Catégorie |
|---|---|---|---|
| Nombre de traverses | 2 (H ≤ 1.50 m) à 3 (H > 1.50 m) | Pratique courante | `best_practice` |
| Section traverse | 40×70 à 45×90 mm | Pratique | `best_practice` |
| Face supérieure inclinée ≥15° | Obligatoire pour durabilité (COBEI) | COBEI §3.3.4.3 | `best_practice` |

---

## 5. Fondations et scellement

### 5.1 Types d'ancrage (COBEI §3.3.4.3 + UNEP)

| Type | Description | Hauteur max | Source |
|---|---|---|---|
| **Scellement béton** | Plot béton 40×40 cm, profondeur 50 cm | 2.00 m | UNEP CC5-R0 |
| **Platine sur muret** | Platine boulonnée sur muret existant | 1.30 m depuis sol | UNEP CC5-R0 |
| **Pied de poteau sabot** | Platine métallique surélevée | Distance sol ≥15 cm (COBEI) | COBEI §3.3.4.4 |
| **Goujon collé** | Scellement chimique esthétique | Distance sol ≥15 cm | COBEI §3.3.4.4 |

### 5.2 Calcul béton scellement

```
Volume par plot = π × (0.20)² × 0.50 ≈ 0.063 m³  (trou Ø40 cm, profondeur 50 cm)
Béton dosé à 250 kg ciment/m³
```

---

## 6. Résistance au vent (DTU NV65 + UNEP)

| Paramètre | Valeur | Source | Catégorie |
|---|---|---|---|
| Vitesse vent max conception | 120 km/h (zones 1-2) | DTU NV65 via UNEP | `normative` |
| Zones 3-4 (côtier, montagne) | Réduire entraxe et/ou augmenter section | UNEP CC5-R0 | `best_practice` |
| Clôture pleine vs ajourée | Pleine = prise au vent maximale | Physique | — |
| Claire-voie = réduit la prise au vent | Espacement ≥ largeur lame → ~50% réduction | Pratique | `simulator_assumption` |

---

## 7. Règles pour le simulateur

### Geometry (can_drive_geometry = true)

| Règle | Valeur par défaut | Configurable |
|---|---|---|
| Entraxe poteaux | 1.80 m | 1.50 – 2.50 m |
| Section poteau | 70×70 mm | Presets 70/90 |
| Hauteur utile | 1.80 m | 0.90 / 1.20 / 1.50 / 1.80 / 2.00 m |
| Profondeur scellement | 0.50 m | Fixe |
| Nombre traverses | 2 si H ≤ 1.50 m, 3 sinon | Auto |
| Jeu bas / sol | 40 mm | 30-50 mm |
| Type : lames H / lames V / panneau | Lames horizontales | Choix utilisateur |

### BOM (can_drive_bom = true)

| Élément | Calcul |
|---|---|
| Poteaux | ceil(longueur / entraxe) + 1 |
| Longueur poteau | hauteur_utile + scellement |
| Lames horizontales | hauteur / (largeur_lame + jeu) × nombre_travées |
| Traverses (lames V) | nombre_traverses × nombre_travées |
| Vis fixation lames | 2 × nombre_lames × nombre_poteaux_par_travée |
| Chapeau poteau | = nombre_poteaux |
| Béton scellement | nombre_poteaux × 0.063 m³ |

### Rendu (can_drive_rendering = true)

- Chapeau métallique ou chanfrein sur poteaux (mode détaillé)
- Jeu bas sol visible (40 mm)
- Inclinaison face supérieure lames horizontales (15°, mode détaillé)
- Lame de finition basse optionnelle (« planche à pourrir »)
- Espacement assemblages visible (5 mm, mode détaillé)

---

## 8. Réglementation urbanisme

| Règle | Source | Catégorie |
|---|---|---|
| Pas de permis de construire requis pour une clôture | Code urbanisme | `normative` |
| Déclaration préalable en secteur sauvegardé | Code urbanisme | `normative` |
| Hauteur, matériaux, couleurs : vérifier le PLU local | Code urbanisme | `normative` |
| Article 647 Code civil : droit de clôturer sa propriété | Code civil | `normative` |
| Limites séparatives : alignement ou retrait selon PLU | PLU communal | `normative` |

**Alerte simulateur** : « Vérifiez le PLU de votre commune avant de construire votre clôture. »

---

## 9. Hypothèses simulateur (⚠️ non normatives)

| Hypothèse | Justification | Risque |
|---|---|---|
| Entraxe 1.80 m par défaut | Standard commerce, panels 1.80 m | Peut ne pas convenir en zone ventée |
| Poteau 70×70 par défaut | Suffisant pour H ≤ 1.50 m | 90×90 nécessaire pour H > 1.50 m |
| Scellement 50 cm | UNEP CC5-R0, standard DIY | Insuffisant en sol meuble ou argileux |
| Pin traité autoclave | Classe 4, le plus courant commerce | Durée de vie ~10-15 ans. Douglas/mélèze = alternative sans traitement |
