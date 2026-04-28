# Audit approfondi des exports PDF - DIY Builder

**Date : 10 avril 2026** | **Version : 1.0** | **Scope : 4 modules (terrasse, cabanon, pergola, cloture)**

---

## A - Audit de fidelite simulateur vers PDF

### A.1 - Module Cabanon (6 pages)

**Etat simule :** `generateCabanon(width, depth, {height})` retourne surface, perimetre, wallArea, roofArea, studCount, lissesBasses, lissesHautes, lissesHautes2, chevrons, chevronLength, bardage, voliges, contreventement, bastaings, bastaingLength, visBardage, visVoliges, equerres, sabotsChevrons, sabotsBastaings, tireFondsBracing, visStructure, membrane.

#### Materiau par materiau (UI vs PDF P5)

| Materiau | Engine | UI (MaterialsList) | PDF P5 (BOM) | Ecart |
|---|---|---|---|---|
| Montants 90x90 | studCount (pcs) | studCount (pcs) | studCount (pcs) | Aucun |
| Lisse basse | lissesBasses (ml) | lissesBasses (ml) | lissesBasses (ml) | Aucun |
| Sabliere haute | lissesHautes (ml) | lissesHautes (ml) | lissesHautes (ml) | Aucun |
| Double sabliere | lissesHautes2 (ml) | lissesHautes2 (ml) | lissesHautes2 (ml) | Aucun |
| Contreventement | contreventement (pcs=nb diagonales) | contreventement (pcs) | contreventement (pcs) | **MOYEN** : UI et PDF P5 affichent le nombre de diagonales (ex: 8), mais costCalculator convertit en m2 OSB (panneaux). Decalage semantique : l'utilisateur lit "8 pcs" dans le simulateur et "5.52 m2" dans le budget PDF P6. |
| Chevrons | chevrons (pcs) + chevronLength (m) | chevrons + chevronLength | chevrons + chevronLength | Aucun |
| Bastaings | bastaings (pcs) + bastaingLength (m) | bastaings + bastaingLength | bastaings + bastaingLength | Aucun |
| Voliges | voliges (m2) | voliges (m2) | voliges (m2) | Aucun |
| Membrane | membrane (m2) | membrane (m2) | membrane (m2) | Aucun |
| Bardage | bardage (m2) | bardage (m2) | bardage (m2) | Aucun |
| Vis bardage | visBardage (pcs brutes) | visBardage (pcs brutes) | visBardage (pcs brutes) | **MOYEN** : UI affiche le nombre brut de vis (ex: 655 pcs), mais costCalculator convertit en lots de 500. Le PDF P5 reprend le brut, le PDF P6 (budget) affiche des lots. Incoherence interne au PDF. |
| Vis voliges | visVoliges (pcs brutes) | visVoliges (pcs brutes) | visVoliges (pcs brutes) | Meme probleme que vis bardage. |
| Equerres | equerres (pcs) | equerres (pcs) | equerres (pcs) | Aucun |
| Sabots chevrons | sabotsChevrons (pcs) | **ABSENT** | **ABSENT** | **BLOQUANT** : l'engine calcule des sabots (1/chevron) mais ni l'UI ni le PDF ne les affichent. Materiau manquant dans les deux sorties. |
| Sabots bastaings | sabotsBastaings (pcs) | **ABSENT** | **ABSENT** | **BLOQUANT** : idem, 1 sabot par bastaing, jamais affiche. |
| Tire-fonds contrev. | tireFondsBracing (pcs) | **ABSENT** | **ABSENT** | **MOYEN** : 3 tire-fonds par diagonale, non affiche. Quincaillerie mineure mais presente dans l'engine. |
| Vis structure | visStructure (pcs) | **ABSENT** | **ABSENT** | **MOYEN** : 4 vis par montant, non affiche. Significatif en volume. |
| wasteFactor | 1.08 | **NON MENTIONNE** | **NON MENTIONNE** | **COSMETIQUE** : le facteur perte 8% est dans l'engine mais n'est ni documente ni applique dans l'affichage brut. costCalculator applique son propre WOOD_WASTE_FACTOR de 10% separement. Deux majorations coexistent sans coherence. |

#### Ecarts specifiques cabanon

| # | Ecart | Severite | Description |
|---|---|---|---|
| C1 | Sabots chevrons absents | BLOQUANT | Engine produit `sabotsChevrons`, ni UI ni PDF ne l'affichent. Aussi absent de costCalculator (pas de materialId sabot). |
| C2 | Sabots bastaings absents | BLOQUANT | Idem pour `sabotsBastaings`. |
| C3 | Vis structure absentes | MOYEN | `visStructure` (4/montant) calcule mais non affiche. Volume significatif (~100+ vis). |
| C4 | Tire-fonds absents | MOYEN | `tireFondsBracing` (3/diagonale) calcule mais non affiche. |
| C5 | Contreventement pcs vs m2 | MOYEN | UI/PDF P5 = nombre de diagonales ; PDF P6 budget = m2 OSB. L'utilisateur lit deux chiffres differents pour le meme poste. |
| C6 | Vis en lots vs brut | MOYEN | PDF P5 affiche le brut (ex: 655 vis), PDF P6 budget affiche des lots (ex: 2 lots). Pas de correspondance evidente. |
| C7 | Double facteur perte | COSMETIQUE | Engine `wasteFactor=1.08` et costCalculator `WOOD_WASTE_FACTOR=1.10` coexistent. Les quantites BOM brutes ne matchent pas les quantites budgetaires. |
| C8 | Section chevrons PDF | COSMETIQUE | PDF P5 annonce "Chevrons 80x80 mm" mais l'engine ne definit pas la section chevron explicitement. costCalculator utilise materialId `chevron_60x80` (60x80). Incoherence de designation. |

---

### A.2 - Module Terrasse (4 pages)

**Etat simule :** `generateDeck(width, depth)` retourne joistCount, plotRows, totalPads, boardSegs, etc. Les quantites UI (boards, joists, pads, screws, entretoises, bande) sont calculees par DeckSimulator, pas par deckEngine.

#### Materiau par materiau

| Materiau | Source | UI | PDF P1 | Ecart |
|---|---|---|---|---|
| Lames 145x28 | DeckSimulator | boards (pcs) | boards (pcs) | Aucun |
| Lambourdes 45x70 | DeckSimulator | joists (pcs) | joists (pcs) | Aucun |
| Plots reglables | DeckSimulator | pads (plots) | pads (plots) | Aucun |
| Vis inox A2 | DeckSimulator | screws (vis) | screws (vis) | **COSMETIQUE** : UI affiche en "vis" brutes, costCalculator convertit en lots de 100. Le PDF P1 garde le brut. |
| Bande bitume | DeckSimulator | bande (ml) | bande (ml) | Aucun |
| Entretoises | DeckSimulator | entretoises (pcs) | entretoises (pcs) | Aucun |
| Dalle beton | foundationCalc | slab.* | slab.* | Aucun (section dediee P2) |

#### Ecarts specifiques terrasse

| # | Ecart | Severite | Description |
|---|---|---|---|
| T1 | Terrasse recalcule deckEngine | MOYEN | `terrassePDF.js` ligne 326 : `const deckData = generateDeck(width, depth)` est appele DANS le PDF pour les plans techniques. Cela signifie que le PDF recalcule la geometrie independamment du simulateur. Si l'UI et le PDF utilisent des chemins differents, les plans pourraient diverger des quantites affichees. |
| T2 | Plan decoupe conditionnel | COSMETIQUE | Les decoupes n'apparaissent que si width > BOARD_LEN ou depth > JOIST_LEN. Correct fonctionnellement, mais l'utilisateur petit format (< 3m) ne voit aucune info decoupe. |
| T3 | Budget P1 vs ancien systeme | COSMETIQUE | Le backward compat `prices`/`best` est encore genere dans index.jsx mais n'est plus utilise par terrassePDF (qui utilise budgetByStore). Code mort residuel. |

---

### A.3 - Module Pergola (4 pages)

**Etat simule :** `generatePergola(width, depth, {height})` retourne posts, beamsLong, beamsShort, rafters, braces, longueurs, vis, ancrages, geometry.

#### Materiau par materiau

| Materiau | Engine | UI | PDF P1 | Ecart |
|---|---|---|---|---|
| Poteaux 100x100 | posts (pcs) + postLength | posts + postLength | posts + postLength | Aucun |
| Longerons | beamsLong (pcs) + beamLongLength | beamsLong + dim | beamsLong + dim | Aucun |
| Traverses | beamsShort (pcs) + beamShortLength | beamsShort + dim | beamsShort + dim | Aucun |
| Chevrons 80x50 | rafters (pcs) + rafterLength | rafters + rafterLength | rafters + rafterLength | Aucun |
| Jambes de force | braces (pcs) + braceLength | braces + braceLength | braces + braceLength | Aucun |
| Vis chevrons | visChevrons (pcs) | visChevrons (pcs) | visChevrons (pcs) | Aucun |
| Vis poteaux | visPoteaux (pcs) | visPoteaux (pcs) | visPoteaux (pcs) | Aucun |
| Vis braces | visBraces (pcs) | visBraces (pcs) | **ABSENT du PDF P1** | **MOYEN** : l'UI affiche visBraces, le PDF P1 ne l'inclut pas dans la section Quincaillerie. Ils apparaissent dans le budget P2 via costCalculator. |
| Pieds de poteau | ancragePoteaux (pcs) | ancragePoteaux (pcs) | ancragePoteaux (pcs) | Aucun |
| Boulons traverses | boulonsTraverses (pcs) | **ABSENT** | **ABSENT** | **MOYEN** : l'engine calcule `boulonsTraverses` mais ni l'UI ni le PDF ne les affichent. Aussi absent de costCalculator. |

#### Ecarts specifiques pergola

| # | Ecart | Severite | Description |
|---|---|---|---|
| P1 | visBraces absent PDF P1 | MOYEN | PDF P1 BOM affiche 3 lignes quincaillerie (vis chevrons, vis poteaux, pieds) mais pas les vis jambes de force. L'UI les affiche. |
| P2 | boulonsTraverses absent partout | MOYEN | Engine les calcule, personne ne les affiche. Potentiellement une quincaillerie de liaison structurelle. |
| P3 | Section poutre dynamique | COSMETIQUE | L'engine adapte la section poutre selon la portee (computeBeamSection). L'UI et le PDF suivent correctement via geometry.dimensions.beamW/beamH. Coherent mais la designation materialPrices reste fixe "poutre_pergola_150" quel que soit le dimensionnement reel. |
| P4 | drawBudgetPage ignore pageTitle | COSMETIQUE | pergolaPDF appelle `pageTitle()` pour P2 mais ensuite `drawBudgetPage()` dessine son propre titre "Comparatif budget par enseigne" a y=48 fixe, potentiellement recouvrant le pageTitle. |

---

### A.4 - Module Cloture (3 pages)

**Etat simule :** `generateCloture(width, depth, {})` retourne posts, rails, boards, longueurs, visLames, visRails, ancrages, geometry.

#### Materiau par materiau

| Materiau | Engine | UI | PDF P1 | Ecart |
|---|---|---|---|---|
| Poteaux 90x90 | posts (pcs) + postLength | posts + postLength | posts + postLength | Aucun |
| Rails 70x25 | rails (pcs) + railLength | rails + railLength | rails + railLength | Aucun |
| Lames 120x15 | boards (pcs) + boardLength | boards + boardLength | boards + boardLength | Aucun |
| Vis lames | visLames (pcs) | visLames (pcs) | visLames (pcs) | Aucun |
| Vis rails | visRails (pcs) | visRails (pcs) | visRails (pcs) | Aucun |
| Ancrages poteaux | ancrages (pcs) | ancrages (pcs) | ancrages (pcs) | Aucun |

#### Ecarts specifiques cloture

| # | Ecart | Severite | Description |
|---|---|---|---|
| CL1 | drawBudgetPage meme probleme P4 | COSMETIQUE | Meme chevauchement potentiel pageTitle/drawBudgetPage que pergola. |
| CL2 | Aucune fondation | INFO | Le module cloture n'a pas de dalle/plots. L'engine calcule `footEmbed` (profondeur scellement) mais ce n'est pas un materiau achete — c'est une contrainte de mise en oeuvre. Correct. |

---

## B - Audit des plans techniques vue par vue

### B.1 - Cabanon : Vue de dessus (P2)

**Source :** `buildTopView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence avec le projet | Bonne | Les murs, ouvertures, montants structurels, chevrons correspondent a la geometry de l'engine. |
| Logique constructive | Bonne | Montants aux coins en L, king studs aux ouvertures, chevrons transversaux. Convention architecturale respectee. |
| Hierarchie graphique | Correcte | Chevrons en fond (dashed), murs en double trait, studs en carres pleins, ouvertures en symboles. |
| Cotes | **MOYEN** | Largeur et profondeur cotees. Porte cotee en position + largeur. Fenetre cotee en largeur. MAIS : pas d'entraxe montants, pas de dimensions murs (epaisseur), pas de cotes entre porte et coin. |
| Annotations | Correctes | "FACADE", "ARRIERE", "GAUCHE", "DROITE" + "Porte"/"Fenetre" + surface. |
| Legende | Correcte | 5 materiaux avec couleurs : Murs, Montants, Porte, Fenetre, Chevrons. |
| Echelle | `~1:50` (cartouche) | Pas d'echelle graphique (barre d'echelle). |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B1-1 | Pas d'echelle graphique (barre) | MOYEN |
| B1-2 | Pas de cote d'entraxe montants (60 cm) | MOYEN |
| B1-3 | Pas de cote epaisseur mur | COSMETIQUE |
| B1-4 | Pas de nord / repere d'orientation conventionnel | COSMETIQUE |

### B.2 - Cabanon : Elevation avant (P3)

**Source :** `buildFacadeView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Bonne | Hauteurs basse/haute, pente, ouvertures, montants, sablieres, linteaux. |
| Logique constructive | Tres bonne | Classification des montants (king studs, corners, reguliers, cripples) avec couleurs differentes. Linteaux et seuils visibles. Double sabliere inclinee. |
| Hierarchie graphique | Bonne | Contour fort 0.8, remplissages differencies par type de montant, ouvertures en aplat leger. |
| Cotes | Bonne | Largeur totale, hauteur gauche, hauteur droite (+slope), dimensions porte (position, largeur, hauteur), dimensions fenetre (position, largeur, hauteur, allege). Info rampant au centre. |
| Annotations | Correctes | Labels d'ouverture, info pente. |
| Legende | 6 elements | Murs, Montants, Linteau/seuil, Porte, Fenetre, Toiture. |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B2-1 | Pas d'echelle graphique | MOYEN |
| B2-2 | Pas de representation du sol (trait de reference) | COSMETIQUE |
| B2-3 | Pas de cotation hauteur lisse basse / sabliere | COSMETIQUE |

### B.3 - Cabanon : Coupe transversale (P4)

**Source :** `buildSectionView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Tres bonne | Empilement complet : sol, lisse basse, montants, sablieres, chevrons, OSB, bac acier, bardage. |
| Logique constructive | Excellente | La coupe montre l'empilement reel des couches. Montants intermediaires en fantome (dashed). Hachures materiaux differenciees (sol, OSB, couverture). |
| Hierarchie graphique | Tres bonne | 7 callouts lateraux avec pointers, ordres de haut en bas. Traits forts pour contour, hachures pour remplissage. |
| Cotes | Bonne | Largeur, hauteur gauche, hauteur droite, delta slope. Info rampant + pourcentage + degres. |
| Annotations | 7 callouts | Couverture, Voliges/OSB, Chevrons, Double sabliere, Sabliere haute, Montants, Lisse basse. |
| Legende | 8 elements | Sol, Lisse basse, Montants, Sabliere, Chevrons, OSB, Couverture, Bardage. |

**C'est la meilleure vue technique du projet.** Proche d'un vrai detail constructif.

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B3-1 | Pas d'echelle graphique | MOYEN |
| B3-2 | Fondation non representee (ni plots, ni dalle) | MOYEN |
| B3-3 | Pas de cote section chevron (60x80 ou 80x80 ?) | COSMETIQUE |

### B.4 - Terrasse : Vue de dessus (P3)

**Source :** `buildTerrasseTopView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Bonne | Lambourdes, doubles lambourdes, entretoises, plots, lames ghost. |
| Logique constructive | Bonne | Joints decales, doubles lambourdes aux coupes, entretoises espacees DTU. |
| Hierarchie graphique | Bonne | Lames en fantome, lambourdes en brun, plots en gris, doubles lambourdes plus foncees. |
| Cotes | **INSUFFISANT** | Largeur et profondeur. Entraxe lambourdes et plots. MAIS : pas de cotes individuelles lambourde, pas de positions plots, pas de distance bord. |
| Annotations | Minimales | Entraxes seulement. |
| Legende | 5 elements | Plots, Lambourdes, Dbl. lambourdes, Entretoises, Lames (fond). |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B4-1 | Pas d'echelle graphique | MOYEN |
| B4-2 | Pas de cote de debord / porte-a-faux | MOYEN |
| B4-3 | Pas de cote entre plots | COSMETIQUE |
| B4-4 | Lames en fantome tres leger — pourrait etre invisible a l'impression | COSMETIQUE |

### B.5 - Terrasse : Coupe transversale (P4)

**Source :** `buildTerrasseSectionView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Bonne | Plot, lambourde, lames, vis, dalle/sol naturel conditionnel. |
| Logique constructive | Bonne | Empilement reel avec tige reglable, bande bitume implicite. Grain bois texture. |
| Cotes | Bonne | Sections en mm (145, 28, 45, 70, 200, 60). Labels materiaux complets a droite. |
| Annotations | 4 callouts | Lame, lambourde, plot, fondation (dalle/sol naturel). |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B5-1 | Echelle fixe SC=0.28 — peut deborder sur grandes terrasses | COSMETIQUE |
| B5-2 | Bande bitume non representee (mentionnee en BOM mais absente du dessin) | MOYEN |
| B5-3 | Pas de cote jeu entre lames (5-8mm DTU) | COSMETIQUE |

### B.6 - Pergola : Vue de dessus (P3)

**Source :** `buildPergolaTopView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Bonne | Poteaux, longerons, traverses, chevrons, jambes de force. |
| Logique constructive | Correcte | Poteaux en carre avec diagonale (convention section). Porte-a-faux chevrons. |
| Cotes | Correcte | Largeur, profondeur, debords, entraxe chevrons. |
| Legende | 3 elements | Poteaux, Longerons, Chevrons. |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B6-1 | Traverses absentes de la legende | MOYEN |
| B6-2 | Jambes de force absentes de la legende | MOYEN |
| B6-3 | Pas d'echelle graphique | MOYEN |
| B6-4 | Pas de cote entre poteaux (portee libre) | COSMETIQUE |

### B.7 - Pergola : Elevation (P4)

**Source :** `buildPergolaFacadeView.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Bonne | Poteaux, longerons, traverses en vue de bout, chevrons sections, jambes de force. |
| Logique constructive | Correcte | Traverses en tirets (perpendiculaires au plan de coupe). |
| Cotes | Correcte | Largeur, hauteur poteau, hauteur totale, entraxe chevrons, hauteur poutre. |
| Legende | 4 elements | Poteaux, Longerons, Traverses, Chevrons. |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B7-1 | Jambes de force absentes de la legende | MOYEN |
| B7-2 | Pas d'echelle graphique | MOYEN |
| B7-3 | Pas de cote section poteau (100x100) sur le dessin | COSMETIQUE |

### B.8 - Cloture : Elevation (P3)

**Source :** `buildClotureElevation.js`

| Critere | Evaluation | Detail |
|---|---|---|
| Coherence | Bonne | Poteaux, rails, lames, scellement. |
| Logique constructive | Correcte | Scellement en tirets sous le sol. |
| Cotes | Minimales | Largeur, hauteur, entraxe poteaux, profondeur ancrage. |
| Legende | 3 elements | Poteaux, Rails, Lames. |

**Ecarts :**

| # | Ecart | Severite |
|---|---|---|
| B8-1 | Pas d'echelle graphique | MOYEN |
| B8-2 | Pas de cote jeu entre lames (10-15mm) | COSMETIQUE |
| B8-3 | Pas de cote section poteau / lame | COSMETIQUE |
| B8-4 | Une seule vue (elevation) — pas de vue de dessus pour montrer l'implantation en longueur | MOYEN |

---

## C - Analyse methodologique : plans techniques bois

### C.1 - Ce que montre un bon plan technique bois

Un plan technique ossature bois ou construction bois DIY doit respecter une hierarchie normalisee (inspiree NF EN ISO 128 / Eurocode 5 / DTU 31.2) :

**Hierarchie des traits :**

| Type | Epaisseur | Usage |
|---|---|---|
| Fort / contour | 0.5-0.7 mm | Aretes vues, contour de coupe |
| Moyen | 0.25-0.35 mm | Aretes visibles secondaires, hachures |
| Fin | 0.13-0.18 mm | Lignes de cote, reperes, lignes de rappel |
| Tres fin | 0.09 mm | Grille de fond, construction geometrique |
| Trait interrompu | 0.25 mm | Aretes cachees |
| Mixte (trait-point) | 0.13 mm | Axes de symetrie, plan de coupe |

**Evaluation DIY Builder :**
Le systeme renderPDF.js definit une echelle de linewidths (background: 0.06, dimensions: 0.25, structurePrimary: 0.5, contours/outline: 1.4). C'est globalement correct mais le contour a 1.4mm est un peu epais pour du A4 — 0.7mm suffirait. La hierarchie est presente mais pourrait etre affinee.

**Vues attendues pour chaque type de construction :**

| Vue | Cabanon | Terrasse | Pergola | Cloture |
|---|---|---|---|---|
| Vue de dessus | OUI (implantation) | OUI (structure) | OUI (couverture) | Utile (implantation) |
| Elevation facade | OUI (ouvertures) | Non necessaire | OUI (proportions) | OUI (remplissage) |
| Elevation laterale | SOUHAITABLE | Non necessaire | Non necessaire | Non necessaire |
| Coupe transversale | OUI (empilement) | OUI (detail) | SOUHAITABLE | Non necessaire |
| Detail assemblage | SOUHAITABLE | SOUHAITABLE | SOUHAITABLE | Non necessaire |
| Nomenclature | OUI | OUI | OUI | OUI |

**Evaluation DIY Builder :**
- Cabanon : 3 vues techniques (dessus, facade, coupe) = tres bon. Il manque une elevation laterale montrant la pente.
- Terrasse : 2 vues (dessus, coupe) = correct. Il manque un detail assemblage lame/lambourde/plot.
- Pergola : 2 vues (dessus, elevation) = correct. Une coupe serait utile pour montrer la fixation poteau-poutre.
- Cloture : 1 vue (elevation) = insuffisant. Il faudrait une vue de dessus pour les grandes longueurs.

### C.2 - Annotations et cotation

**Bonnes pratiques :**
- Les cotes doivent etre sur des lignes de rappel, jamais sur le dessin lui-meme
- Cotes principales a l'exterieur du dessin, cotes de detail a l'interieur
- Chaines de cotes cumulees pour les repetitions (entraxes)
- Unites explicites (mm pour sections, m pour dimensions generales)
- Symbole de coupe (trait mixte + fleches) sur la vue de dessus pour indiquer la position de la coupe
- Echelle graphique (barre) en plus de l'echelle ecrite

**Evaluation DIY Builder :**
- Les cotes utilisent des lignes de rappel avec ticks = correct.
- Le fond blanc derriere le texte des cotes assure la lisibilite = tres bien.
- MAIS : aucune vue ne comporte de barre d'echelle graphique. L'echelle ecrite "~1:50" dans le cartouche est approximative et inutile si le document est imprime a une taille differente.
- MAIS : aucun symbole de plan de coupe sur les vues de dessus.
- MAIS : les entraxes ne sont pas cotes en chaine (on voit "e=40cm" au lieu d'une chaine complete).

### C.3 - Densite et lisibilite

**Bonnes pratiques :**
- Un plan technique bois ne doit pas etre surcharge. Privilegier la lisibilite.
- Pour du DIY grand public, le plan doit etre plus pedagogique qu'un plan pro.
- Les hachures doivent etre coherentes par materiau (bois en lignes paralleles, beton en croix, sol en diagonales).

**Evaluation DIY Builder :**
- La densite est bien geree. Les fonds de plan (PLAN_BG) sont neutres.
- Les grilles de fond (5mm) sont discretes.
- Les hachures sont coherentes : beton en croix, sol en diagonales, bois en lignes (buildSectionView). Conforme aux conventions.
- La palette MAT est unifiee entre toutes les vues = tres bien.
- Le rendu est plus proche d'un document pedagogique premium que d'un plan technique normatif. C'est adapte au public cible (particuliers bricoleurs).

### C.4 - Rapport plan / elevation / coupe / nomenclature

**Convention professionnelle :**
L'ordre classique dans un dossier technique bois est :
1. Plan de masse / vue de dessus (implantation)
2. Elevations (facade + laterale)
3. Coupes (transversale + longitudinale si necessaire)
4. Details d'assemblage
5. Nomenclature / BOM
6. Estimation budgetaire

**Evaluation DIY Builder :**

| Module | Ordre actuel | Commentaire |
|---|---|---|
| Cabanon | Synthese 3D > Dessus > Facade > Coupe > BOM > Budget | **Quasi-conforme.** La vue 3D en P1 est un plus pedagogique. L'ordre Dessus > Facade > Coupe est correct. |
| Terrasse | BOM + Prix > Fondation > Dessus > Coupe | **Inverse.** Les plans sont en P3-P4 apres la BOM en P1-P2. Conventionnellement, les plans devraient preceder la nomenclature. |
| Pergola | BOM > Budget > Dessus > Elevation | **Partiellement inverse.** BOM avant plans. |
| Cloture | BOM > Budget > Elevation | **Partiellement inverse.** |

**Recommandation :** Pour terrasse, pergola et cloture, inverser l'ordre : plans techniques d'abord, puis BOM + budget. Le cabanon a deja le bon ordre.

---

## D - Synthese et livrables

### D.1 - Liste consolidee des ecarts

#### Bloquants (impact fonctionnel — materiau manquant)

| # | Module | Ecart | Action |
|---|---|---|---|
| C1 | Cabanon | Sabots chevrons absents (engine → UI → PDF) | Ajouter dans costCalculator + MaterialsList + PDF BOM |
| C2 | Cabanon | Sabots bastaings absents (engine → UI → PDF) | Ajouter dans costCalculator + MaterialsList + PDF BOM |

#### Moyens (incoherence visible pour l'utilisateur)

| # | Module | Ecart | Action |
|---|---|---|---|
| C3 | Cabanon | Vis structure absentes | Ajouter dans affichage (ou documenter comme "non comptees") |
| C4 | Cabanon | Tire-fonds absents | Idem |
| C5 | Cabanon | Contreventement pcs vs m2 | Harmoniser unite : soit "X panneaux (Y m2)" partout |
| C6 | Cabanon | Vis en lots vs brut | Afficher "X pcs (Y lots)" dans le PDF BOM pour coherence |
| C8 | Cabanon | Section chevrons 80x80 vs 60x80 | Corriger la designation PDF P5 en "Chevrons 60x80 mm" |
| P1 | Pergola | visBraces absent PDF P1 | Ajouter en 4e ligne Quincaillerie |
| P2 | Pergola | boulonsTraverses absent partout | Ajouter dans costCalculator + affichage, ou supprimer de l'engine |
| T1 | Terrasse | generateDeck() recalcule dans le PDF | Passer la geometry pre-calculee au lieu de recalculer |
| B1-1..B8-1 | TOUS | Pas d'echelle graphique (barre) | Ajouter une barre d'echelle en bas de chaque vue |
| B4-2 | Terrasse | Pas de cote porte-a-faux | Ajouter cote debord bord lambourde-bord lame |
| B5-2 | Terrasse | Bande bitume absente du dessin coupe | Ajouter un lere mince entre plot et lambourde |
| B6-1/2 | Pergola | Traverses et jambes de force absentes legende | Completer la legende |
| B7-1 | Pergola | Jambes de force absentes legende elevation | Idem |
| B8-4 | Cloture | Pas de vue de dessus | Ajouter une vue de dessus montrant l'implantation |
| B1-2 | Cabanon | Pas de cote entraxe montants | Ajouter dimension "e=60 cm" sur vue de dessus |

#### Cosmetiques (amelioration qualite sans impact fonctionnel)

| # | Module | Ecart | Action |
|---|---|---|---|
| C7 | Cabanon | Double facteur perte (engine 8% + costCalc 10%) | Documenter ou harmoniser |
| P3 | Pergola | Section poutre dynamique vs materialId fixe | Documenter comme limitation V1 |
| P4 | Pergola | drawBudgetPage chevauche pageTitle | Ajuster y0 ou supprimer le pageTitle en doublon |
| CL1 | Cloture | Meme chevauchement pageTitle/drawBudgetPage | Idem |
| T2 | Terrasse | Plan decoupe conditionnel | OK tel quel |
| T3 | Terrasse | backward compat prices/best code mort | Nettoyage futur |
| B1-3 | Cabanon | Pas de cote epaisseur mur | Optionnel |
| B1-4 | Cabanon | Pas de nord / orientation | Optionnel |
| B3-2 | Cabanon | Fondation non representee en coupe | Ajouter si option dalle active |
| B5-1 | Terrasse | Echelle fixe coupe terrasse | Parametrer ou documenter |

### D.2 - Ordre des vues — proposition d'harmonisation

| Module | Ordre actuel | Ordre propose |
|---|---|---|
| Cabanon (6p) | 3D > Dessus > Facade > Coupe > BOM > Budget | OK tel quel (deja bon) |
| Terrasse (4p) | BOM+Prix > Fondation > Dessus > Coupe | Dessus > Coupe > BOM+Prix+Fondation > (Budget optionnel P5) |
| Pergola (4p) | BOM > Budget > Dessus > Elevation | Dessus > Elevation > BOM > Budget |
| Cloture (3p) | BOM > Budget > Elevation | Elevation > (Dessus P2 a creer) > BOM+Budget |

### D.3 - Hierarchie des priorites

**Lot 1 — Corrections bloquantes (fidelite BOM)**
1. Ajouter sabots chevrons et sabots bastaings dans costCalculator + MaterialsList + cabanonPDF BOM
2. Corriger designation "Chevrons 80x80" → "Chevrons 60x80" dans cabanonPDF P5
3. Ajouter visBraces dans pergolaPDF P1 section Quincaillerie

**Lot 2 — Coherence visuelle et conventions**
4. Ajouter echelle graphique (barre) dans renderPDF.js (une seule implementation, beneficie a toutes les vues)
5. Harmoniser contreventement pcs/m2 et vis brut/lots dans cabanon BOM
6. Completer legendes pergola (traverses, jambes de force)
7. Creer vue de dessus cloture (buildClotureTopView.js)

**Lot 3 — Ameliorations techniques plans**
8. Ajouter cotes entraxe montants sur vue de dessus cabanon
9. Ajouter bande bitume dans coupe terrasse
10. Inverser l'ordre des pages terrasse/pergola/cloture (plans avant BOM)
11. Ajouter cote porte-a-faux terrasse vue de dessus

**Lot 4 — Nettoyage et documentation**
12. Documenter ou harmoniser les facteurs de perte (engine vs costCalculator)
13. Decider du sort de boulonsTraverses pergola (ajouter ou supprimer de l'engine)
14. Fixer le chevauchement pageTitle/drawBudgetPage sur pergola et cloture
15. Supprimer backward compat prices/best dans index.jsx

---

*Fin de l'audit. Aucun fichier modifie. Document a valider avant toute correction.*
