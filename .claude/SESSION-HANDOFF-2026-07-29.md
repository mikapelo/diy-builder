# Session handoff — 2026-07-29

Worktree : `.claude/worktrees/fervent-ramanujan-b2ab1c` · branche `claude/fervent-ramanujan-b2ab1c`

---

## ⚠️ À LIRE EN PREMIER — conflit git non résolu

**4 commits ne sont PAS poussés** et **entrent en conflit** avec `origin/main`.

Une session parallèle (`task_f7108c02`, lancée pour corriger le nombre de plots) a livré
pendant cette session sur les **mêmes fichiers** :

| origin/main (session parallèle) | |
|---|---|
| `bd88ec5` | fix(guides terrasse): plots conformes NF DTU 51.4 et **re-chiffrage complet** |
| `096b758` | fix(costCalculator): entretoises facturées en blocs et lot de vis à 200 |

| ma branche (non poussé) | |
|---|---|
| `efe5f7d` | fix(guides/terrasse): fourchette de plots au lieu d'un chiffre unique |
| `dd45101` | fix(guides/prix-terrasse): deux références DTU fabriquées supprimées |
| `94434b4` | fix(guides/terrasse): conformité NF DTU 51.4 — 6 erreurs bloquantes |
| `4ebbfa3` | docs: pipeline éditoriale fusionnée |

**Fichiers en conflit** : `frontend/app/guides/terrasse/page.jsx` et
`frontend/app/guides/prix-terrasse-bois-m2-2026/page.jsx`.

**Ne pas fusionner à l'aveugle.** Les deux versions corrigent le même défaut de fond
(le nombre de plots) mais pas de la même façon. Ce que ma version apporte en propre et
qu'il faut préserver dans la fusion :

- **13 références d'article DTU vérifiées une par une** comme existant dans la source
- suppression de **3 références fabriquées** (`§6`, `§6.2` ×2 — le NF DTU 51.4 s'arrête à l'article 5)
- la **fourchette 35-66 plots** plutôt qu'un chiffre unique (voir § « Leçon » plus bas)
- longueur de vis (§ 5.5.6.2.1), pente 1,5 % (§ 5.5.3.3), plénum 100 mm (§ 5.2.3)
- deux **omissions normatives comblées** : badigeonnage après coupe (§ 5.4.1.1), clips hors domaine (§ 1)
- tolérances de planéité **supprimées** car non vérifiables (Tableau 16 illisible dans la source)

`4ebbfa3` (le doc pipeline) ne touche aucun fichier partagé → **poussable tel quel**.

---

## Livré et en production

| Commit | Objet | Statut |
|---|---|---|
| `e76187d` | libellés PDF terrasse alignés (60×70, unité 3,6 m) | ✅ prod |
| `1348263` | capture SEO : `title` + `h1` groupe A sur 4 guides | ✅ prod + IndexNow |

**Passe capture** (`1348263`) — `terrasse-piscine-bois` (title+H1 captent « lames » et
« quel bois »), `hauteur-cloture-loi-2026` (« maximale » / « maximum », variantes sœurs),
`cabanon` (H1 + « monopente »), `cloture-solaire` (H1 + « vertical »).
Baseline GSC à re-mesurer **vers le 11/08** — cf. mémoire `project_seo_capture_2026_07_28`.

---

## Audit des simulateurs — résultat

Balayage systématique des 4 moteurs sur **toute la plage des curseurs**
(monotonie, densité, plateaux, valeurs nulles). Méthode : fichiers de test jetables
dans `frontend/__tests__/tmp-audit-*.test.js`, **supprimés en fin de session**
(vitest avale `console.log` → écrire la sortie dans un fichier).

### Un seul vrai défaut

**Terrasse — les garde-fous de rendu 3D contaminent le BOM.**
`MAX_JOIST_COUNT = 25` et `MAX_PAD_ROWS = 15` (documentés « prévient surcharge WebGL »)
sont appliqués **dans les fonctions de comptage** de `deckGeometry.js`.

| Profondeur (largeur 5 m) | Plots | Densité |
|---|---|---|
| 8,4 m | 227 | 5,40/m² |
| 9 m | 227 | 5,04/m² ← plafond |
| 20 m | 279 | **2,79/m²** |

Au-delà de **~8,4 m de profondeur ou ~10 m de largeur**, la liste est silencieusement
sous-évaluée ; les curseurs autorisent 20 × 20 m. **Non corrigé** : `deckGeometry.js` est
marqué intouchable. Correctif propre = séparer le plafond d'affichage du comptage matériaux.

⚠️ Un test de monotonie ne le détecte pas : la valeur **stagne**, elle ne décroît pas.

### Vérifié et innocenté (ne pas re-signaler)

- **Terrasse, lambourdes non monotones** (4,0 m → 13 · 4,1 m → 11) : **correct**. Les doubles
  lambourdes ne portent que les abouts de lames. À 4,0 m la coupe est à **0,170 m** de la
  lambourde la plus proche (about dans le vide → +2) ; à 4,1 m elle tombe à **0,000 m** (rien à ajouter).
- **Clôture, lames qui baissent** (2,0 → 2,1 m : 13 → 12) : un poteau supplémentaire consomme de la largeur.
- **Clôture, hauteur sans effet sur le nombre de lames** : c'est leur **longueur** qui suit (lames verticales).
- **Clôture, `railLength` en dents de scie** : espacement des poteaux.
- **Cabanon, `bastaings = 0`** : **volontaire**, remplacés par des entretoises de toiture (`geometry.bastaings` = « COMPAT (vide) »).
- **Cabanon, montants ±1** : zones d'ouverture qui se décalent.
- **Pergola : zéro anomalie** sur toute sa plage.

Monotonie des quantités principales : `terrasse` boards/pads/entretoises ✅ ·
`cabanon` bardage/voliges/lisses/chevrons ✅ · `pergola` posts/rafters/braces ✅ ·
`cloture` posts/rails/concreteBags ✅.

### Recommandation restante

Le risque de crédibilité n'est pas le calcul mais sa **lisibilité** : afficher
« dont N lambourdes doublées sous les abouts de lames » transforme une incohérence
apparente en preuve de sérieux. Et ajouter des **tests de garde** (monotonie + densité
plausible) — c'est ce qui a permis de trouver le défaut en quelques minutes.

---

## Audit DTU des guides

Bibliothèque complète disponible : `.claude/docs/DTU/` (**114 normes**), dont
`nf-dtu-51-4` (terrasse), `nf-dtu-31-2` (cabanon), `nf-dtu-31-1` (charpente),
`nf-dtu-13-1` / `13-3` (fondations, dallages).

### La règle qui a tout tranché

> **NF DTU 51.4 § 5.2.1** — « Les lambourdes doivent avoir une portée inférieure ou égale à
> **70 cm** sur trois appuis et à **60 cm** sur deux appuis. **NOTE 2** Au-delà, les éléments
> supports de lames sont des **solives qui ne sont pas couvertes par le présent document**. »
> (confirmé Annexe B § A.9). Vérifié mot pour mot.

Donc `PAD_ENTRAXE = 0.60` **est exactement la limite DTU**, pas une valeur prudente arbitraire.
Le moteur est bien fondé ; c'était le guide qui avait dérivé (« plots tous les 1,5 m » = 2,14× le plafond).

### Leçon — ma propre erreur, à ne pas répéter

J'ai d'abord écrit « environ 70 plots » comme si c'était LA réponse du DTU. **Faux.**
71 est ce que sort le moteur à sa configuration la plus serrée (entraxe 400 mm + portée 600 mm).
Le DTU admet 300-600 mm d'entraxe et jusqu'à 700 mm de portée → **35 à 66 plots** pour 12 m²,
soit 3 à 5,5/m² (cohérent avec le consensus marché 4-6/m² relevé en SERP).

**Ne jamais présenter une sortie de moteur comme une prescription normative.**
Le guide énonce désormais la règle + la fourchette + l'hypothèse du calculateur.

### Reste à auditer (agents tombés sur la limite de session)

- **cabanon** vs DTU 31.2 — `§9.2.2` existe bien (« Assemblage du voile travaillant »), contenu à croiser
- **pergola** vs DTU 31.1/31.3 — traiter la **surcharge neige** avec soin
- **clôture** — vérifier que `DTU 31.1 §5.10.4.2`, cité dans `clotureConstants.js`
  pour `FOOT_CLEARANCE_MIN`, existe réellement
- **dalle** — ⚠️ **anomalie systématique déjà établie**, non corrigée :

  Le DTU 13.3 a deux parties : **P1-1-1** = « hors maisons individuelles »,
  **P1-1-2** = « maisons individuelles ». Une dalle domestique relève de **P1-1-2**.
  Or le guide cite la numérotation de la partie **industrielle** :

  | Le guide cite | Réalité dans P1-1-2 |
  |---|---|
  | `§7.1` sol compacté 95 % Proctor | §7 = « Enquête sur le sol » — **« Proctor » absent de P1-1-2** |
  | `§7.3` forme gravier 10 cm | la « Forme » est le **§10** |
  | `§5.4` enrobage 3 cm | §5.4 = « **Joints de retrait** » (armatures = §5.3) |
  | `§6` surface entre joints | §6 = « **Reconnaissance géotechnique** » |

### Limite de la source à connaître

Les **corps de tableaux n'ont pas survécu** à la conversion markdown (Tableaux 4/5/6, 7, 8, 16
du DTU 51.4 : légendes seules). Cinq affirmations sont restées **non vérifiables** et ont été
supprimées plutôt que comblées par des valeurs plausibles. Il faut le **PDF AFNOR** pour les trancher.

---

## Pipeline éditoriale — référence unique créée

`.claude/docs/PIPELINE-EDITORIALE.md` (commit `4ebbfa3`) fusionne le playbook affiliation FR
(`~/projets/chargeur VE/docs/METHODOLOGY.md`) et le skill `editorial-seo-fr`.

Ce que le playbook apportait et qui manquait : passe Brief avec **persona** + tranchage
tutoiement/vouvoiement, passe **Outline** comme livrable séparé, passe **CRO** dédiée,
anti-cannibalisation comme gate nommé, checklist de publication, cible 2 500-3 500 mots,
liste noire lexicale FR, et surtout la **mécanique de fact-check** (texte FINI, claim par claim,
≥ 2 sources, vérification **montrée**, interdiction du raccourci « déjà vérifié en amont »).

Ce que le skill apportait en propre : hiérarchie **POP A→B→C→D**, score **/70** avec seuils
de merge, règle **10-10-80**, E-E-A-T /40.

**Périmètre écarté** : Phases 0-2 du playbook (niche, choix de programmes à commission ≥ 20 €) —
il vise le lancement d'un site sur produits **numériques** et dit lui-même ne pas s'appliquer
aux produits physiques.

---

## Recherche de sujets — Phase 3 faite, aucun article écrit

⚠️ **GSC est un rétroviseur** : il ne montre que les requêtes déjà classées, donc une vraie
zone blanche y est **invisible**. La découverte passe obligatoirement par
**Suggest / SERP / Trends / Reddit**. C'est ce qui m'a fait écarter `pergola-adossee` à tort.

Qualification menée sur 4 clusters (~30 candidats). Classement final :

| # | Sujet | KD | Fit produit |
|---|---|---|---|
| 1 | **Combien de plots / lambourdes au m²** (portée par section) | 2 | 5/5 |
| 2 | **pergola adossée** (muralière, étanchéité) — `/guides/pergola-adossee` = **404 vérifié** | 3 | 5/5 |
| 3 | **plancher abri sur plots** (entraxe lambourdes) | 2 | 5/5 |
| 4 | **clôture sur terrain en pente** (`pente` = 0 occurrence dans le pilier) | 2 | 5/5 |
| 5 | terrasse bois **sans dalle béton** | 2 | 4/5 |
| 6 | **condensation** abri métallique | **1** | Deuba actif |
| 7 | support **PV au sol** DIY | 2 | ⚠️ YMYL lourd |

**Refus argumenté — barrière de piscine 🔴** : le moteur clôture produit des **rails horizontaux**
= prises d'escalade, exactement ce que la NF P90-306 interdit (empêcher le franchissement par un
enfant de moins de 5 ans). Ne pas publier, quel que soit le trafic.

Autres rejets : `pergola aide 2026` (KD 5, groupe Effy — et **il n'existe pas d'aide nationale**
pour une pergola) · `épaisseur dalle abri` (cannibalise `/guides/dalle`) · `bureau de jardin` (KD 5).

**Réserves de méthode** : Google Trends inaccessible (notes de demande **relatives**, pas des
volumes) · AI Overviews non observables de façon fiable (WebSearch géolocalisé US) → à revalider
à la main sur google.fr · **Reddit FR est un désert** sur le bricolage : la demande vit sur
**ForumConstruire, BricoZone, bois.com, metabricoleur**.

---

## Découvertes annexes

- **~620 impressions/28 j de bruit de marque concurrente** (`comparer prix travauxninja.fr`
  403 imp pos 4,3 · 0 clic ; `expertdubricolage.fr devis` 191 imp) captées par
  `/guides/comparer-devis-travaux`. Ne convertira jamais et **tire le CTR moyen du site vers le bas**.
  Non traité.
- **`cloture solaire` sur Suggest = électrificateur agricole** (chevaux, chien, lacmé). L'article
  photovoltaïque capte probablement des impressions d'intention équestre → son CTR réel sur sa
  vraie audience est **meilleur** que mesuré. À vérifier dans GSC.
- **`scripts/gsc-stats.js` a `rowLimit` figé à 20.** Pour la longue traîne et le croisement
  page × requête, scripts jetables dans le scratchpad de session.
- **Le checkout principal est très sale** (≈100 fichiers `scripts/reels/` supprimés non commités,
  14 handoffs et `.claude/audit/` non ajoutés, `materialPrices.js` modifié). État pré-existant,
  rien ajouté par moi — mais ça se perd facilement.

---

## À faire, par ordre

1. **Résoudre le conflit git** (voir tout en haut) — bloquant pour les 4 commits.
2. **Pousser `4ebbfa3`** (doc pipeline, aucun conflit).
3. **Arbitrer le plafonnement `deckGeometry.js`** — seul vrai bug de calcul trouvé.
4. **Corriger les 4 références DTU 13.3 du guide dalle** (partie industrielle citée pour du domestique).
5. **Finir l'audit DTU** cabanon / pergola / clôture.
6. **Écrire l'article** — candidat n°1 ou n°2 du classement, pipeline complète en 7 passes.
7. **Re-mesurer GSC vers le 11/08** (baseline dans la mémoire projet).
