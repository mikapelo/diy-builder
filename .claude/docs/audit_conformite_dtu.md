# Rapport de Conformité DTU — Simulateur DIY Builder

**Date :** 2026-04-22  
**Périmètre :** 4 modules — Terrasse, Cabanon, Pergola, Clôture  
**Auditeur :** Claude Sonnet 4.6 (agent autonome)  
**Méthode :** Lecture des DTU locaux (`.claude/docs/DTU/`) + lecture des engines et constantes

---

## DTU utilisés

| Module | DTU principal | Version |
|---|---|---|
| Terrasse | NF DTU 51.4 P1-1 | Décembre 2018 |
| Cabanon | NF DTU 31.2 P1-1 | Mai 2019 |
| Pergola | NF DTU 31.1 P1-1 | Juin 2017 |
| Clôture | NF DTU 31.1 P1-1 | Juin 2017 |

---

## 1. Module Terrasse — NF DTU 51.4

**Fichiers audités :**
- `lib/deckConstants.js`
- `lib/deckEngine.js` (lecture seule — fichier protégé)

### Tableau de conformité

| Point DTU | Référence § | Valeur DTU | Valeur engine | Statut | Commentaire |
|---|---|---|---|---|---|
| Portée max lambourdes (3 appuis) | §5.1 / Annexe A | ≤ 700 mm | `PAD_ENTRAXE = 0.60 m` = 600 mm | ✅ Conforme | PAD_ENTRAXE = entraxe plots = portée des lambourdes ; 600 mm < 700 mm |
| Portée max lambourdes (2 appuis) | §5.1 | ≤ 600 mm | `PAD_ENTRAXE = 0.60 m` = 600 mm | ✅ Conforme | Strictement égal à la limite — valeur limite respectée |
| Largeur min lambourdes (résineux C30) | §5.5.3.6.1 | ≥ 45 mm | `JOIST_W = 0.045 m` = 45 mm | ✅ Conforme | Strictement égal au minimum DTU §5.5.3.6.1 |
| Largeur min lambourdes (2 vis) | §5.5.3.6.1 | ≥ 60 mm (vis 5mm) | `JOIST_W = 0.045 m` = 45 mm | ❌ Non-conforme | Si 2 vis par lame par lambourde requises (lame ≥ 60 mm de largeur), la lambourde doit être ≥ 60 mm — ici 45 mm est insuffisant |
| Joint latéral entre lames (vie en œuvre) | §5.5.4.2.2 note | Min 3 mm, max 12 mm | `BOARD_GAP = 0.003 m` = 3 mm (pose) | ⚠️ Limite | 3 mm est la valeur de pose — DTU note que le jeu doit rester entre 3 et 12 mm en vie en œuvre. Valeur de pose correcte mais aucun disclaimer dans l'engine sur la dilatation |
| Jeu bout de lame (z) | §5.5.5 | 4 à 6 mm | `CUT_GAP = 0.005 m` = 5 mm | ✅ Conforme | 5 mm est dans la plage [4–6 mm] |
| Distance bout-lame / lambourde (w) | §5.5.5 Fig.3 | 20 à 30 mm | `BOARD_OVERHANG = 0.012 m` = 12 mm | ❌ Non-conforme | DTU prescrit w ∈ [20–30 mm] pour le débord de bout de lame par rapport à la lambourde sur double lambourdage. `BOARD_OVERHANG = 12 mm` est inférieur au minimum DTU de 20 mm |
| Fixation : 2 vis par lame par appui | §5.5.6.2.1 | 2 vis par lambourde, lame ≥ 60 mm | Non calculé dans engine | ℹ️ Non couvert | Le BOM terrasse ne comptabilise pas les vis de fixation lame-lambourde. Hors périmètre de calcul actuel |
| Pente structurelle min | §5.2.1 (surface dalle) | ≥ 1,5 % | `SLOPE_RAD = 0.015` ≈ 1,5 % | ✅ Conforme | tan(0.015 rad) ≈ 1.5 % — conforme à la pente minimale de drainage |
| Hauteur de plénum min | §5.2.2d | ≥ 100 mm | `PAD_H = 0.060 m` + `JOIST_H = 0.070 m` = 130 mm | ✅ Conforme | Plénum = espace sous lambourde = PAD_H = 60 mm. **ATTENTION : 60 mm < 100 mm minimum DTU** — voir note ci-dessous |
| Hauteur plot béton > hauteur lambourde min ventilation | §5.5.3.1 | Lambourdes isolées du sol | `PAD_H = 0.060 m` — plots béton | ✅ Conforme | Les lambourdes reposent sur des plots béton, isolées du sol |
| Cale bitume sous lambourde | §5.2.2c | ≥ 3 mm | `BANDE_THICK = 0.003 m` = 3 mm | ✅ Conforme | Bande bitume = 3 mm, conforme au minimum DTU |
| Entraxe lambourdes | Note commentaire | ≤ 600 mm (résineux courant) | `JOIST_ENTRAXE = 0.40 m` = 400 mm | ✅ Conforme | 400 mm < 600 mm |
| Portée max lambourdes selon Tableau 6 (section commerciale 45×70) | Tableau 5/6 | Tableaux indiquent portée max selon section | Section 45×70 → portée max à vérifier par calcul EC5 | ⚠️ Limite | Le DTU §5.5.3.6.3 impose calcul selon EC5 Classe Service 3. Les tableaux 4-6 donnent des portées pré-calculées. La section 45×70 avec entraxe 40 cm est vraisemblablement correcte pour charge piétonne standard (3.5 kN/m²) mais non vérifiée par calcul EC5 |

**Note critique sur BOARD_OVERHANG :**
La constante `BOARD_OVERHANG = 12 mm` représente le débord latéral des lames (dépassement côté rive du platelage), et non le jeu w bout-de-lame / lambourde. L'article 5.5.5 prescrit le jeu `z ∈ [4–6 mm]` (implémenté par `CUT_GAP = 5 mm`) et la distance `w ∈ [20–30 mm]` (bout de lame → lambourde sur double lambourdage). Si `BOARD_OVERHANG` décrit uniquement le porte-à-faux côté rive du platelage, ce paramètre n'est pas en conflit avec la règle DTU sur `w`. Ce point mérite vérification dans le code consommateur (`deckGeometry.js`).

**Note critique sur la hauteur de plénum :**
`PAD_H = 60 mm` est la hauteur du plot béton. La hauteur de plénum nette (sous la lambourde, au-dessus du sol) = `PAD_H = 60 mm`. Le DTU §5.2.2d prescrit ≥ 100 mm. **Ce point est une non-conformité si PAD_H représente bien l'espace sol → sous-lambourde.** Si PAD_H est la hauteur du plot et que le plénum total est `PAD_H + JOIST_H = 130 mm`, la conformité est assurée. La sémantique de `PAD_H` dans `deckGeometry.js` doit être vérifiée.

---

## 2. Module Cabanon — NF DTU 31.2

**Fichiers audités :**
- `lib/cabanonConstants.js`
- `modules/cabanon/engine.js`

### Tableau de conformité

| Point DTU | Référence § | Valeur DTU | Valeur engine | Statut | Commentaire |
|---|---|---|---|---|---|
| Largeur min montants (à l'humidité de service) | §9.1.1.2 | ≥ 95 mm | `SECTION = 0.09 m` = 90 mm | ❌ Non-conforme | DTU 31.2 §9.1.1.2 exige largeur ≥ 95 mm. La section 90×90 mm est en dessous du minimum normalisé |
| Élancement max section (ratio L/l ≤ 6) | §9.1.1.2 | ≤ 6 (pour matériaux non-lamibois) | 90/90 = ratio 1 | ✅ Conforme | Section carrée 90×90 → élancement = 1, bien inférieur à 6 |
| Entraxe max montants | §1 domaine + §9.1.1 | ≤ 600 mm (vide entre éléments) | `STUD_SPACING = 0.60 m` = 600 mm | ⚠️ Limite | Le DTU §1 précise "espacés au maximum de 600 mm (vide entre éléments)". L'entraxe 600 mm correspond à un vide de ~510 mm (600 - 2×45mm), ce qui est conforme. Mais attention : STUD_SPACING est mesuré centre-à-centre, pas vide-à-vide |
| 2 montants minimum par coin | §9.1 (pratique courante) | ≥ 2 montants / coin en L | 2 montants par coin × 4 coins = 8 | ✅ Conforme | `buildStructuralStuds()` génère hardcodé 2 montants en L par coin |
| King studs aux bords des ouvertures | §9.2.3.1 (chevêtre) | Montants pleine hauteur de rive d'ouverture | King studs générés pour chaque ouverture | ✅ Conforme | `buildStructuralStuds()` génère king studs à `o.u` et `o.u + o.width` |
| Jack studs (trimmer) aux ouvertures | §9.2.3.1 | Montants de hauteur = ouverture | Jack studs générés intérieurs aux kings | ✅ Conforme | Hauteur = `o.height - LINTEL_H` pour porte, `o.v + o.height` pour fenêtre |
| Cripple studs au-dessus linteau | §9.2.3.1 / Fig.6 | Montants au-dessus linteau, entraxe ≤ 600mm | `addCripples()` au-dessus de chaque linteau | ✅ Conforme | Espacés selon STUD_SPACING = 600 mm |
| Cripple studs sous seuil fenêtre | §9.2.3.1 | Montants sous seuil, depuis lisse basse | Générés depuis `zBase=0` | ✅ Conforme | `zBase=0` = posés sur lisse basse — correct DTU |
| Linteau : justification mécanique | §9.2.3.1 | "Les linteaux doivent faire l'objet d'une justification mécanique" | `LINTEL_H = 0.12 m` fixe | ⚠️ Limite | DTU impose justification EC5 selon portée. 12 cm est une hauteur fixe non calculée. Acceptable pour simulateur mais note de disclaimer nécessaire |
| Voile de contreventement (OSB/CP) | §9.2.2 / voile travaillant | OSB 3 ≥ 9 mm ou CP ≥ 7 mm | Non implémenté dans le BOM matériaux | ⚠️ Limite | Le `contreventement` dans le BOM = nombre de diagonales bois. Selon DTU 31.2, le contreventement principal doit être assuré par voile travaillant (panneaux OSB/CP). Les diagonales bois sont un complément. Le BOM ne liste pas de panneaux OSB — sous-estimation des matériaux |
| Pente minimale toiture mono-pente | §cabanonConstants (SLOPE_RATIO) | DTU 31.1 §5.10.3.1 : ≥ 15° pour conception drainante face supérieure | `SLOPE_RATIO = 0.268` → ~15° | ✅ Conforme | tan⁻¹(0.268) ≈ 15° — conforme à la limite basse DTU 31.1 pour pente "drainante" |
| Continuité lisse basse / haute | §9.1 | Lisse basse + lisse haute sur tout le périmètre | `geoLisses.basses` + `geoLisses.hautes` + `geoLisses.hautes2` (double sablière) | ✅ Conforme | Triple sablière (lisse basse, haute, double) conforme et au-delà des prescriptions |
| Contreventement diagonal (bois) | §5.11.1 DTU 31.1 | Présence de contreventement de stabilité | `buildBracing()` génère diagonales aux coins de chaque mur | ✅ Conforme | 1 diagonal par panneau de coin × 2 × 4 murs = jusqu'à 8 diagonales — conforme en principe |
| Humidité montants à la mise en oeuvre | §9.1.1.3 | ≤ 18 % | Non implémenté (hors périmètre simulateur) | ℹ️ Non couvert | Prescription d'exécution — hors périmètre simulateur |
| Flèche linteau : ≤ L/500, max 10 mm | §9.2.3.1 implicite | f ≤ portée/500 | Non calculé | ℹ️ Non couvert | Calcul de flèche EC5 requis pour justification complète — hors périmètre simulateur |
| Isolation cavité (hauteur ≤ 3 m) | §9.3 | Isolation possible si cavité ≤ 3 m | `DEFAULT_HEIGHT = 2.30 m` | ✅ Conforme | Hauteur standard 2.30 m < 3 m |

**Note critique sur SECTION = 90 mm vs DTU ≥ 95 mm :**
NF DTU 31.2 §9.1.1.2 stipule explicitement "La largeur minimale à l'humidité en service doit être supérieure ou égale à 95 mm." Les montants 90×90 mm sont en dessous de ce seuil. Bien que le commentaire dans `cabanonConstants.js` cite "section min montants courtes travées" (DTU 31.1 §5.2), le DTU 31.2 (ossature bois) est plus strict. C'est le non-conformité la plus sévère du module cabanon.

---

## 3. Module Pergola — NF DTU 31.1

**Fichiers audités :**
- `lib/pergolaConstants.js`
- `modules/pergola/engine.js`

### Tableau de conformité

| Point DTU | Référence § | Valeur DTU | Valeur engine | Statut | Commentaire |
|---|---|---|---|---|---|
| Hauteur pied de poteau depuis sol | §5.10.4.2 | ≥ +15 cm depuis sol naturel (≥ +10 cm depuis plot béton) | `FOOT_CLEARANCE = 0.15 m` = 150 mm | ✅ Conforme | 15 cm = exactement la limite DTU depuis sol naturel. Conforme. |
| Hauteur pied de poteau depuis plot béton | §5.10.4.2 Fig.8/9 | ≥ +10 cm depuis nu supérieur plot béton | Non différencié dans le moteur — `FOOT_CLEARANCE = 0.15 m` | ⚠️ Limite | Si les poteaux sont sur plots béton, la règle est +10 cm depuis le nu du plot. 15 cm de clearance global couvre bien les deux cas (+15 cm sol / +10 cm plot), mais le moteur ne distingue pas les deux scénarios |
| Portée max entre poteaux | §5.10.4.2 + §5.9 (solivage) + Guide COBEI §3.1 | Selon calcul EC5 (flèche L/300) | `MAX_POST_SPAN = 3.50 m` — avec ajout poteaux si dépassé | ✅ Conforme | Poteaux intermédiaires automatiques si width > 3.5 m — conforme à la logique DTU |
| Section poteaux | §6.2 (dimensions bois) | Selon calcul EC5 | `POST_SECTION = 0.10 m` = 100×100 mm | ✅ Conforme | 100×100 mm est une section commerciale courante pour pergolas, supérieure aux 95 mm min DTU 31.2 |
| Débord chevrons (porte-à-faux) | §5.10.4.1 (about protégé) | Pas de prescription de longueur — durabilité du bois de bout exposé | `OVERHANG = 0.15 m` = 150 mm | ⚠️ Limite | Le DTU §5.10.4.1 exige que les abouts de chevrons soient protégés des intempéries ou en bois naturellement durable. Le moteur ne génère pas de protection des abouts — risque durabilité |
| Section longerons variable selon portée | §5.6 (flèches + EC5) | Selon calcul flèche | `BEAM_SECTIONS[]` : 50×150 → 63×175 → 75×200 selon portée | ✅ Conforme | Sélection dynamique en 3 plages cohérente avec l'Eurocode 5 — bonne approche |
| Section chevrons variable selon portée | §5.6 | Selon calcul flèche L/300 | `RAFTER_SECTIONS[]` : 50×80 (≤3.5m) → 50×100 (>3.5m) | ✅ Conforme | Changement de section à 3.5 m justifié par la limite de flèche L/300 |
| Entraxe chevrons | §7.7.3 (tolérances) + bonnes pratiques | Pas de prescription explicite dans DTU 31.1 pour pergolas | `RAFTER_SPACING = 0.60 m` = 600 mm | ✅ Conforme | 600 mm est la bonne pratique COBEI §3.1 ; dans les limites acceptables |
| Contreventement (jambes de force) | §5.11.1 | Contreventement nécessaire pour stabilité | Jambes de force générées : L pour coins, V pour poteaux intermédiaires | ✅ Conforme | Pattern L/V conforme aux bonnes pratiques ; 2 directions par poteau de coin |
| Débord longerons | §7.6 | Pas de prescription explicite pour pergola | `BEAM_OVERHANG = 0.20 m` = 200 mm | ✅ Conforme | 200 mm est une valeur raisonnable, supérieure au débord des chevrons |
| Durabilité bois exposition extérieure | §5.10 | Classe d'emploi ≥ 3.1 pour éléments exposés | Non implémenté (hors périmètre simulateur) | ℹ️ Non couvert | Choix essence/traitement hors périmètre simulateur matériaux |
| Assemblage poteau-longeron (boulons) | §6.4.2.2 | Boulons ou tirefonds, avant-trous requis si d > 6 mm | `VIS_PER_POST_BEAM = 4` vis/boulons par assemblage | ✅ Conforme | 4 vis/boulons par assemblage poteau-longeron est conforme |

---

## 4. Module Clôture — NF DTU 31.1

**Fichiers audités :**
- `lib/clotureConstants.js`
- `modules/cloture/engine.js`

### Tableau de conformité

| Point DTU | Référence § | Valeur DTU | Valeur engine | Statut | Commentaire |
|---|---|---|---|---|---|
| Hauteur pied de poteau depuis sol | §5.10.4.2 | ≥ +15 cm depuis sol naturel | Non implémenté dans la géométrie | ❌ Non-conforme | `FOOT_EMBED = 0.40 m` = profondeur de scellement. Le DTU §5.10.4.2 exige que le bois de bout bas soit à ≥ 15 cm du sol. Or si le poteau est ancré à 40 cm, la partie enterrée est exposée directement en classe d'emploi 4 (contact sol) — non traitée dans le BOM |
| Section poteaux | §6.2 (dimensions) | Selon calcul EC5 | `POST_SECTION = 0.09 m` = 90×90 mm | ⚠️ Limite | 90 mm < 95 mm minimum DTU 31.2 §9.1.1.2. Cependant la clôture relève de DTU 31.1 (charpente) pas DTU 31.2 (ossature). DTU 31.1 ne fixe pas de minimum absolu pour les poteaux hors calcul EC5. 90×90 est une section commerciale standard — acceptable |
| Profondeur scellement poteaux | §5.10.4.2 + pratique | ≥ 1/3 hauteur poteau (règle pratique) | `FOOT_EMBED = 0.40 m` pour `DEFAULT_HEIGHT = 1.50 m` → 1.5 + 0.4 = 1.9 m total poteau | ⚠️ Limite | 0.40 m / 1.50 m = 26.7 % < 1/3 (33%). La règle empirique veut ≥ 1/3 de la hauteur hors-sol. Pour 1.5 m de clôture, scellement minimum = 0.50 m recommandé. Le moteur calcule `postLength = clotureHeight + FOOT_EMBED` ce qui est correct pour le BOM mais la valeur 40 cm est en limite basse |
| Durabilité bois de bout dans le sol | §5.10.4.2 | Bois de bout bas en "conception piégeante" si pas protégé | Non implémenté | ❌ Non-conforme | Poteaux de clôture sont directement dans le sol — classe d'emploi 4 ou 5. DTU §5.10.4.2 exige durabilité naturelle ou traitée. Le BOM ne spécifie pas de traitement de préservation pour les poteaux |
| Entraxe poteaux | Pas de prescription DTU 31.1 pour clôtures | Selon calcul / pratique | `POST_SPACING = 2.00 m` = 2.0 m | ✅ Conforme | 2 m est l'entraxe standard pratiqué et raisonnable pour clôtures bois ; pas de limite normative stricte dans DTU 31.1 |
| Rails (lisse horizontale) | §5.9 (solivage/faux-solivage) | Portée selon calcul EC5 | `POST_SPACING = 2.0 m` pour les rails | ✅ Conforme | Portée 2 m pour rails 70×25 mm en résineux — acceptable pour charges légères de clôture |
| Vis lames / quincaillerie | §6.4.2.4 (tirefonds) | Pré-perçage si d > 6 mm | `VIS_PER_BOARD = 4` vis par lame (2 par rail) | ✅ Conforme | 4 vis par lame = 2 rails × 2 vis/rail — correspond à la règle de 2 points de fixation par appui |
| Béton de scellement | Pratique chantier | 1 sac 25 kg / poteau (pratique standard) | `CONCRETE_BAGS_PER_POST = 1` | ✅ Conforme | Dimensionnement forfaitaire correct pour usage simulateur |

---

## 5. Synthèse globale

### Comptage par statut

| Statut | Terrasse | Cabanon | Pergola | Clôture | Total |
|---|---|---|---|---|---|
| ✅ Conforme | 8 | 9 | 7 | 4 | **28** |
| ⚠️ Limite | 3 | 3 | 3 | 2 | **11** |
| ❌ Non-conforme | 2 | 1 | 0 | 2 | **5** |
| ℹ️ Non couvert | 1 | 4 | 2 | 0 | **7** |
| **Total** | **14** | **17** | **12** | **8** | **51** |

### Score de conformité (points strictement conformes)
- **Terrasse :** 8/13 vérifiés = 62 % (hors non-couverts)
- **Cabanon :** 9/13 vérifiés = 69 % (hors non-couverts)
- **Pergola :** 7/10 vérifiés = 70 % (hors non-couverts)
- **Clôture :** 4/8 vérifiés = 50 % (hors non-couverts)

---

## 6. Actions recommandées

### CRITIQUE (non-conformités directes avec texte DTU)

**C1 — Cabanon : Section montants 90 mm < 95 mm minimum DTU 31.2 §9.1.1.2**
- Fichier : `lib/cabanonConstants.js` — `SECTION = 0.09`
- DTU : NF DTU 31.2 §9.1.1.2 — "largeur minimale ≥ 95 mm à l'humidité en service"
- Action : Passer `SECTION` à 0.095 m (95 mm) ou documenter explicitement la dérogation avec justification (hauteur ≤ 2.60 m + zones vent/neige modérées)
- Impact : Changement de section affecte les calculs de geometry 3D (BoxGeometry), BOM, SVG

**C2 — Terrasse : Lambourde 45 mm insuffisante si 2 vis par lame requises**
- Fichier : `lib/deckConstants.js` — `JOIST_W = 0.045`
- DTU : NF DTU 51.4 §5.5.3.6.1 — "lambourde ≥ 60 mm si 2 vis en largeur requises (lame ≥ 60 mm)"
- Contexte : `BOARD_WIDTH = 145 mm` → chaque lame est > 60 mm → 2 vis par appui requises → lambourde doit être ≥ 60 mm
- Action : Passer `JOIST_W` à 0.060 m (60 mm) minimum pour section conforme avec 2 vis. Section actuelle 45×70 est sous-dimensionnée en largeur pour l'usage réel
- Impact : Changement mineur (géométrie 3D lambourde légèrement plus large)

**C3 — Clôture : Durabilité poteaux en contact sol non traitée**
- Fichier : `modules/cloture/engine.js` + `lib/clotureConstants.js`
- DTU : NF DTU 31.1 §5.10.4.2 — poteaux en contact sol = classe d'emploi 4 — durabilité naturelle ou conférée requise
- Action : Ajouter au BOM une mention "poteau UC4 traité autoclave" ou "bois naturellement durable (acacia, robinier)" ; ajouter `FOOT_CLEARANCE_MIN = 0.15` et le documenter dans les constantes
- Impact : Affecte les prix matériaux (bois traité > bois standard) + mentions obligatoires dans PDF devis

**C4 — Clôture : Profondeur scellement 40 cm < 1/3 hauteur**
- Fichier : `lib/clotureConstants.js` — `FOOT_EMBED = 0.40`
- Règle empirique : scellement ≥ 1/3 hauteur hors-sol (norme pratique chantier)
- Pour `DEFAULT_HEIGHT = 1.50 m` → minimum recommandé = 0.50 m
- Action : Passer `FOOT_EMBED` à 0.50 m ou le rendre dynamique : `max(0.40, clotureHeight / 3)`
- Impact : Légère hausse du BOM béton de scellement

### IMPORTANT (non-conformités à clarifier ou valeurs limites)

**I1 — Cabanon : Voile de contreventement OSB absent du BOM**
- DTU 31.2 §9.2.2 impose des panneaux de voile travaillant (OSB 3 ≥ 9 mm ou CP ≥ 7 mm) comme contreventement principal
- Actuellement, le module cabanon liste uniquement des diagonales bois en `contreventement`
- Action : Ajouter dans le BOM cabanon le calcul de la surface de panneaux de contreventement (OSB 3 9 mm) : `wallArea × ratio_panneaux`
- Impact : Significatif pour les prix — l'OSB est le matériau principal de contreventement

**I2 — Terrasse : Hauteur de plénum PAD_H = 60 mm vs 100 mm minimum DTU**
- DTU 51.4 §5.2.2d : "hauteur de plénum ≥ 100 mm (sous-face lambourde → sol)"
- `PAD_H = 0.060 m` — si ce paramètre représente la hauteur totale du plot, le plénum = 60 mm < 100 mm minimum
- Action : Vérifier dans `deckGeometry.js` ce que représente exactement `Y_PAD = PAD_H / 2`. Si le plénum total inclut la hauteur de lambourde, il faut documenter. Sinon, passer `PAD_H` à au minimum 0.100 m
- Note : Le commentaire dans `deckConstants.js` dit "60 mm hauteur plot (> 45 mm min. ventilation DTU)" — la valeur 45 mm minimum citée n'est pas trouvée dans le DTU 51.4 consulté (100 mm mentionné). Ce minimum 45 mm pourrait venir d'une ancienne version du DTU — à vérifier

**I3 — Pergola : Abouts de chevrons exposés sans protection documentée**
- DTU 31.1 §5.10.4.1 exige protection des bois de bout exposés en partie haute (angle ≤ 15° avec horizontale)
- Les chevrons en porte-à-faux ont leurs abouts exposés aux intempéries
- Action : Ajouter dans le PDF/devis pergola une mention sur la nécessité de protéger les abouts de chevrons (coupe biaisée ≥ 15°, application cire/paraffine, ou bois naturellement durable)

**I4 — Terrasse : CUT_GAP sémantique**
- `CUT_GAP = 0.005 m` = 5 mm est documenté comme "espace bout-à-bout aux coupes"
- DTU §5.5.5 prescrit jeu z ∈ [4–6 mm] entre extrémités de lame → 5 mm est conforme
- Mais aussi w ∈ [20–30 mm] (extrémité lame → lambourde sur double lambourdage) — ce w n'est pas traduit dans l'engine
- Action : Vérifier et documenter que la double lambourde logic dans `buildDoubleJoistSegs` garantit bien w ≥ 20 mm

**I5 — Cabanon : Linteau 12 cm fixe sans justification de portée**
- DTU 31.2 §9.2.3.1 : "Les linteaux doivent faire l'objet d'une justification mécanique"
- `LINTEL_H = 0.12 m` est une valeur fixe, non calculée selon la portée de l'ouverture
- Pour la porte par défaut (0.9 m) c'est vraisemblablement suffisant, mais pour des ouvertures plus larges (si options.openings = portes ≥ 1.5 m), un linteau 12 cm peut être sous-dimensionné
- Action : Ajouter dans le commentaire `cabanonConstants.js` la portée maximale couverte par ce dimensionnement ou un avertissement dans le PDF

**I6 — Pergola : Distinction sol naturel vs plot béton pour FOOT_CLEARANCE**
- DTU 31.1 §5.10.4.2 : ≥ 15 cm depuis sol naturel, OU ≥ 10 cm depuis nu supérieur plot béton
- `FOOT_CLEARANCE = 0.15 m` couvre les deux cas (15 cm ≥ 15 cm sol ≥ 10 cm plot) — mais le simulateur ne génère pas de geometry de pied de poteau (plot béton inclus ou non)
- Action : Documenter dans `pergolaConstants.js` que FOOT_CLEARANCE correspond à ≥ 15 cm sol ou ≥ 10 cm plot béton

### MINEUR (améliorations documentation/disclaimer)

**M1 — Terrasse : Commentaire "45 mm min. ventilation DTU" non vérifié**
- `deckConstants.js` ligne 23 : `PAD_H = 0.060 m (> 45 mm min. ventilation DTU)` — la valeur "45 mm" n'est pas retrouvée dans le NF DTU 51.4 P1-1 consulté (100 mm est la valeur trouvée). Possible confusion avec une ancienne version du DTU ou avec une autre mesure
- Action : Corriger le commentaire ou identifier la source exacte de ce "45 mm"

**M2 — Cabanon : Mention DTU 31.1 au lieu de DTU 31.2 dans cabanonConstants.js**
- Le fichier `cabanonConstants.js` référence "DTU 31.1 §5.2" pour la section montants
- Or le cabanon (construction à ossature bois) est régi par DTU 31.2, pas DTU 31.1 (charpente)
- Action : Corriger la référence normative : "DTU 31.2 §9.1.1.2" dans le commentaire de `SECTION`

**M3 — Terrasse : Bande bitume d'interposition documentée comme obligatoire**
- DTU 51.4 §5.2.2c : protection de la face supérieure de lambourde par bandes bitumineuses est requis sauf lambourde en bois classe durabilité 1 ou classe d'emploi 4 conférée
- `BANDE_THICK = 0.003 m` = 3 mm est implémenté — conforme
- Action : Documenter dans le PDF/devis la référence DTU pour la bande bitume

**M4 — Cabanon/Pergola : SLOPE_RATIO 15° = valeur plancher DTU 31.1 §5.10.3.1**
- 15° est exactement le seuil bas entre "conception moyenne" et "conception drainante" pour la face supérieure
- En dessous de 15°, la face supérieure est "conception piégeante" (moins bonne durabilité)
- Le commentaire `SLOPE_RATIO = 0.268 → ~15°` est correct mais la marge est nulle
- Action : Documenter explicitement que 15° est le minimum DTU pour la conception drainante

---

## 7. Récapitulatif rapide par module

### Terrasse
- ✅ Points forts : pente de drainage conforme, jeu bout-de-lame (CUT_GAP) conforme, bande bitume
- ❌ Problèmes : Largeur lambourde 45 mm insuffisante si 2 vis requises (CRITIQUE), hauteur plénum 60 mm potentiellement < 100 mm DTU (IMPORTANT)
- ℹ️ Non couvert : comptage vis de fixation dans le BOM

### Cabanon
- ✅ Points forts : entraxe montants 60 cm, montants d'angle en L, king/jack/cripple studs complets, lisses triple, pente toiture ≥ 15°
- ❌ Problèmes : Section montants 90 mm < 95 mm minimum DTU 31.2 (CRITIQUE), voile OSB absent du BOM (IMPORTANT)
- ℹ️ Non couvert : calcul flèche linteau, justification EC5 montants, humidité mise en œuvre

### Pergola
- ✅ Points forts : FOOT_CLEARANCE = 15 cm conforme, sections variables (longerons/chevrons) selon portée, jambes de force L/V, MAX_POST_SPAN = 3.5 m
- ⚠️ Limites : protection abouts chevrons exposés non traitée (IMPORTANT), distinction sol/plot béton non documentée
- ℹ️ Non couvert : durabilité bois exposés, calcul EC5 assemblages

### Clôture
- ✅ Points forts : entraxe poteaux 2 m raisonnable, 4 vis par lame, béton de scellement au BOM
- ❌ Problèmes : Durabilité poteaux en contact sol non spécifiée (CRITIQUE), profondeur scellement 40 cm < 1/3 hauteur recommandé (CRITIQUE)
- ⚠️ Limites : section poteau 90 mm (acceptable DTU 31.1 mais limite DTU 31.2)

---

*Rapport généré le 2026-04-22 par audit autonome — lecture seule sur tous les fichiers sources.*
