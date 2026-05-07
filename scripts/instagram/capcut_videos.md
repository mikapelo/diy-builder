# CapCut Desktop — Plans de vidéos DIY Builder

Format cible : 1080×1920px (9:16 vertical) · 30fps · 15–30s
Workflow : Screen recording Mac/Windows → import CapCut Desktop → export MP4

---

## LAYOUT DU SIMULATEUR (ce que tu vois à l'écran)

```
┌─────────────────────────────┬──────────────────────────────┐
│                             │  [Assemblée] [Détaillée] [Plan]│
│      VUE 3D (gauche)        │  [3/4] [Face] [Dessus] [Côté] │
│   terrasse / cabanon /      │                               │
│   pergola / clôture         │   Largeur   [ − ] 4m [ + ]   │
│   (interactive, rotative)   │   Longueur  [ − ] 5m [ + ]   │
│                             │   Stats : 19.25m² · 47 LAMES  │
└─────────────────────────────┴──────────────────────────────┘
         ↓ scroll
┌──────────────────────────────────────────────────┐
│  TUNNEL RÉSULTATS                                │
│  → Liste matériaux                               │
│  → Comparatif 4 enseignes (barres de prix)       │
│  → Export PDF                                    │
└──────────────────────────────────────────────────┘
```

**La 3D est visible dès l'ouverture — pas besoin de cliquer sur un onglet.**
Les dimensions se règlent avec les boutons **[ − ]** et **[ + ]** (pas de sliders).
Les résultats et le comparatif sont en bas, accessibles en scrollant.

**Modes (boutons en haut du panneau droit) :**
- Terrasse / Pergola / Clôture : **Assemblée** · **Détaillée** · **Plan**
- Cabanon : **Assemblée** · **Structure** · **Détaillée** · **Plan**

---

## SETUP — Screen recording sur ordinateur

### Mac
`Cmd + Shift + 5` → "Enregistrer une portion de l'écran" → sélectionne la zone du navigateur
Stop : `Cmd + Shift + 5` à nouveau → Stop

### Windows
`Win + Alt + R` → démarre / stoppe directement
OU `Win + G` → Xbox Game Bar → bouton ⏺

### Avant d'enregistrer
- Navigateur **plein écran** (F11)
- Zoom navigateur : **100%**
- Ferme les notifications (mode Ne pas déranger)
- Souris : mouvements lents et intentionnels

---

## SETUP CapCut Desktop — Convertir 16:9 → 9:16

Ton écran est en 16:9 horizontal. Les Reels sont en 9:16 vertical.

**Dans CapCut :**
1. Nouveau projet → ratio **9:16**
2. Importe ton screen recording
3. Sélectionne le clip → **"Fond"** → **"Flou"** → intensité 15
4. Redimensionne + repositionne le clip pour cadrer sur la zone qui t'intéresse :
   - Pour montrer la 3D → cadre sur la **moitié gauche** de l'écran
   - Pour montrer les contrôles + résultats → cadre sur la **moitié droite / bas**
   - Pour montrer tout → garde le zoom à ~60% centré, fond flouté remplit le reste

---
---

## VIDÉO 1 — Démo terrasse "868€ d'écart"
**Série A · 22s · Reel Instagram + TikTok**

### Ce que tu enregistres (1 seul clip continu ~40s)
Ouvre **diy-builder.fr/calculateur** en plein écran. Puis :

1. **2s** — reste immobile sur la vue d'accueil (3D terrasse à gauche, contrôles à droite)
2. **5s** — dans le panneau droit, clique sur **+** à côté de Largeur pour passer à **4m**, puis **+** à côté de Longueur pour passer à **5m**. Laisse la 3D se mettre à jour après chaque clic.
3. **3s** — reste immobile sur la 3D mise à jour (stats en haut : surface + nb lames)
4. **3s** — clique-glisse sur la terrasse 3D pour la faire pivoter à 45°
5. **3s** — scroll vers le bas jusqu'au comparatif enseignes, reste immobile sur les barres de prix
6. **2s** — reste immobile sur le total "1 382€ ManoMano vs 2 250€ Leroy Merlin"

**Total : ~18s utiles dans le clip**

---

### Montage CapCut Desktop

**① Nouveau projet 9:16 · importer le clip · appliquer fond flouté**

**② Découper en 4 segments** (`Cmd+B` / `Ctrl+B` pour couper)

| Segment | Contenu | Durée gardée |
|---|---|---|
| S1 | Vue d'accueil 3D + contrôles | 3s |
| S2 | Modification sliders + 3D qui s'adapte | 5s |
| S3 | Rotation 3D | 4s |
| S4 | Comparatif enseignes barres de prix | 5s — ralentir à **0.7×** |

**③ Cadrage par segment**
- S1 : zoom sur la **moitié gauche** (3D bien visible)
- S2 : zoom sur la **moitié droite** (contrôles + sliders)
- S3 : zoom sur la **3D** centrée
- S4 : zoom sur le **bas de l'écran** (barres de prix)

**④ Textes**

| Timing | Texte | Taille | Couleur | Animation |
|---|---|---|---|---|
| 0s–3s | `Simule ta terrasse en 3D 🪵` | 8 | Blanc | Apparition 0.3s |
| 5s–9s | `Change les dimensions → la 3D s'adapte` | 7 | Blanc 80% | Apparition |
| 12s–16s | `868€ d'écart selon l'enseigne 😳` | 11 | `#C9971E` | **Zoom** 0.4s |
| 18s–22s | `Gratuit → diy-builder.fr` | 7 | Blanc | Apparition |

**⑤ Transitions** : Flash 0.3s entre tous les segments

**⑥ Son** : `upbeat minimal` · volume 25% · fondu sur les 2 dernières secondes

**⑦ Export** : 1080p · 30fps · filigrane OFF

---
---

## VIDÉO 2 — "Tu savais que..." L'écart de prix
**Série B · 18s · Rien à enregistrer — 100% CapCut**

### Montage CapCut Desktop

**① Fond noir**
Nouveau projet 9:16 → "Média" → "Couleur unie" → `#111214` → 18s sur la timeline

**② Textes séquentiels** (un bloc par ligne de timeline)

| Timing | Texte | Taille | Couleur | Animation |
|---|---|---|---|---|
| 0s–2.5s | `Même terrasse.` | 9 | Blanc | Apparition 0.3s |
| 2.5s–5s | `Mêmes matériaux.` | 9 | Blanc | Apparition 0.3s |
| 5s–9s | `868€ d'écart` | 16 | `#C9971E` | **Zoom** 0.4s |
| 9s–12s | `selon où tu achètes tes lames.` | 7 | Blanc 70% | Apparition 0.3s |
| 12s–15s | `ManoMano 1 382€  ·  Leroy Merlin 2 250€` | 5.5 | Blanc 50% | Apparition 0.3s |
| 15s–18s | `👉 Compare → diy-builder.fr` | 7 | Blanc | Apparition 0.3s |

**③ Effet son à 5s** : "Effets sonores" → `Impact` ou `Boom` au moment où "868€" apparaît
**④ Fond sonore** : `dark minimal` · volume 20%
**⑤ Export** : 1080p · 30fps · filigrane OFF

---
---

## VIDÉO 3 — Démo cabanon ossature 3D
**Série A · 22s**

### Ce que tu enregistres (~35s)
Ouvre **diy-builder.fr/cabanon** en plein écran. Puis :

1. **2s** — vue d'accueil : 3D cabanon à gauche, contrôles à droite
2. **4s** — dans le panneau droit, clique sur le mode **"Structure"** → l'ossature bois apparaît seule (montants, chevrons, lisses)
3. **3s** — reste immobile sur l'ossature complète
4. **3s** — clique sur **"Détaillée"** → murs transparents + ossature visible en même temps
5. **5s** — clique-glisse sur le cabanon 3D pour le faire pivoter lentement
6. **3s** — scroll vers le bas pour montrer la liste matériaux (41 montants, 18 chevrons...)

**Total utile : ~20s**

---

### Montage CapCut Desktop

**① Découper en 4 segments**

| Segment | Contenu | Durée | Vitesse |
|---|---|---|---|
| S1 | Vue d'accueil cabanon 3D | 3s | 1× |
| S2 | Mode Structure (ossature seule) | 4s | **0.8×** (bien voir) |
| S3 | Mode Détaillé + rotation | 7s | 1× |
| S4 | Liste matériaux | 4s | **0.7×** |

**② Cadrage**
- S1/S2/S3 : zoom sur la **3D gauche**
- S4 : zoom sur la **colonne résultats**

**③ Textes**

| Timing | Texte | Taille | Couleur | Animation |
|---|---|---|---|---|
| 0s–3s | `Tu veux construire un cabanon ? 🏠` | 8 | Blanc | Apparition |
| 3s–7s | `Voilà l'ossature complète` | 9 | Blanc | Apparition |
| 9s–13s | `41 montants · 18 chevrons · 47m² bardage` | 6.5 | Blanc 80% | Apparition |
| 15s–19s | `Simulateur 3D gratuit` | 12 | `#2A6E48` | Zoom |
| 19s–22s | `→ diy-builder.fr` | 7 | Blanc | Apparition |

**④ Transitions** : Flash 0.3s · Son : `build up`

---
---

## VIDÉO 4 — Avant / Après calcul
**Série C · 22s**

### Ce que tu enregistres
**2 clips distincts :**

**Clip A "Avant" (8s) :**
Filme ton bureau avec une calculatrice ou ouvre la calculatrice Windows/Mac à l'écran.
Tape des chiffres au hasard lentement — comme si tu calculais manuellement.

**Clip B "Après" (25s) :**
Screen recording diy-builder.fr/calculateur :
1. Vue 3D terrasse — 2s
2. Bouge le slider largeur/longueur — 3s
3. Scroll vers les résultats — 3s
4. Zoom sur le comparatif enseignes — 3s

---

### Montage CapCut Desktop

**① Timeline**
- 0s–6s : Clip A (calculatrice)
- 6s–22s : Clip B (simulateur) + fond flouté

**② Transition à 6s** → **"Glissement vers la gauche"** (0.5s) + effet sonore **"Whoosh"**

**③ Textes**

| Timing | Texte | Taille | Couleur | Animation |
|---|---|---|---|---|
| 0s–5s | `😬 Avant : calcul à la main` | 8 | Blanc | Apparition |
| 6.5s–8s | `✅ Après : 30 secondes` | 9 | Blanc | Zoom |
| 10s–14s | `Liste complète · Prix comparés · PDF gratuit` | 6.5 | Blanc 80% | Apparition |
| 18s–22s | `diy-builder.fr` | 11 | `#C9971E` | Zoom |

---
---

## VIDÉO 5 — Comparatif clôture "505€ d'écart"
**Série A · 18s**

### Ce que tu enregistres (~25s)
Ouvre **diy-builder.fr/cloture** en plein écran :

1. **2s** — vue 3D clôture + contrôles à droite
2. **4s** — dans le panneau droit, clique sur **+** à côté de Longueur plusieurs fois pour passer à **5.5m**, laisse la 3D se mettre à jour
3. **4s** — clique-glisse sur la clôture 3D pour la faire pivoter et voir les lames et poteaux
4. **4s** — scroll vers le comparatif enseignes, reste immobile sur les barres

---

### Montage CapCut Desktop

**① Découper**

| Segment | Contenu | Cadrage |
|---|---|---|
| S1 | Vue 3D clôture initiale | 3D gauche |
| S2 | Modification slider + update 3D | Contrôles droite |
| S3 | Rotation 3D clôture | 3D centrée |
| S4 | Comparatif prix | Bas de l'écran |

**② Textes**

| Timing | Texte | Taille | Couleur | Animation |
|---|---|---|---|---|
| 0s–3s | `Ta clôture bois, lame par lame 🔩` | 8 | Blanc | Apparition |
| 6s–9s | `Calcul automatique · poteaux UC4 · rails · lames` | 6 | Blanc 70% | Apparition |
| 10s–14s | `505€ d'écart selon l'enseigne` | 12 | `#B8541A` | Zoom |
| 14s–18s | `Calcule ta clôture → diy-builder.fr` | 7 | Blanc | Apparition |

---
---

## CHECKLIST AVANT DE POSTER

- [ ] Projet CapCut en **9:16**
- [ ] Fond flouté appliqué sur tous les clips (pas de bandes noires)
- [ ] Cadrage ajusté par segment (3D / contrôles / résultats)
- [ ] Durée entre **15s et 30s**
- [ ] Filigrane CapCut **désactivé**
- [ ] URL visible dans la **dernière scène**
- [ ] Son présent même à volume bas
- [ ] Export **1080p · 30fps · MP4**

---

## PARAMÈTRES EXPORT CAPCUT DESKTOP

"Exporter" (haut droite) →
- Résolution : **1080p**
- Fréquence : **30 fps**
- Format : **MP4 (H.264)**
- Filigrane : **décoché**
