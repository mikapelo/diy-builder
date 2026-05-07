# Reel Design System — DIY Builder

Modèle de référence validé par Pelo le 2026-05-06.
Ce document capture les choix gagnants après itération V1→V5 sur `video2-serie-b`.

---

## Format & contraintes

- **Résolution** : 1080 × 1920 (9:16)
- **Framerate** : 30 fps
- **Durée standard** : 15 s (TikTok-style punchy)
- **Stack** : HyperFrames v0.5.2 (HTML + GSAP)
- **Pas de musique embarquée dans le HTML** — track ajoutée en post si besoin

---

## Background — règle d'or

**Image claire au centre + vignette aux bords. JAMAIS d'assombrissement global.**

### Filtre image
```css
#bg-img {
  position: absolute; inset: -3%;
  width: 106%; height: 106%;
  object-fit: cover;
  object-position: center 35%;
  filter: brightness(0.92) saturate(1.0);  /* léger uniquement */
  will-change: transform;
}
```

### Overlay vignette (centre clair, bords sombres)
```css
#bg-overlay {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 95% 65% at 50% 40%,
      transparent 0%,
      transparent 28%,
      rgba(0,0,0,0.35) 60%,
      rgba(0,0,0,0.78) 90%,
      #0a0b0c 100%),
    linear-gradient(180deg,
      transparent 0%,
      transparent 72%,
      rgba(0,0,0,0.45) 88%,
      #0a0b0c 100%);
}
```

### Mouvement Ken Burns (à peine perceptible)
Respiration sinusoïdale 1.02 → 1.06 → 1.02 sur la durée totale.
```js
tl.set("#bg-img", { scale: 1.02, x: 0, y: 0 }, 0);
tl.to("#bg-img", { scale: 1.06, x: -8, y: -5, duration: D/2, ease: "sine.inOut" }, 0);
tl.to("#bg-img", { scale: 1.02, x: 0, y: 0, duration: D/2, ease: "sine.inOut" }, D/2);
```
Où `D` = durée totale.

---

## Lisibilité texte — text-shadow triple-layer

L'image n'est PAS assombrie. Le texte porte sa propre lisibilité via un halo sombre **strictement local**.

```css
text-shadow:
  0 1px 2px rgba(0,0,0,0.95),
  0 3px 8px rgba(0,0,0,0.85),
  0 6px 18px rgba(0,0,0,0.65);
```

Variantes selon poids du texte :
- **Hero (>80px)** : pas de shadow ou shadow modéré (le poids fait le job)
- **Sous-titres (38-56px)** : triple-layer plein
- **Captions/eyebrows (30-40px)** : triple-layer + couleur 0.82+ et weight 600+

### Caissons pour zones critiques
Quand le texte tombe sur une zone forcément claire (ex: badge sur header), densifier le caisson :
```css
.badge {
  background: rgba(10,10,12,0.62);
  border: 1.5px solid rgba(201,151,30,0.85);
  box-shadow: 0 4px 24px rgba(0,0,0,0.55);
  text-shadow: 0 1px 2px rgba(0,0,0,0.95);
}
```

---

## Palette

| Token | Valeur | Usage |
|---|---|---|
| `--gold` | `#C9971E` | Accent principal, chiffres choc |
| `--gold-light` | `#E8C56A` | Halo, badge |
| `--gold-dark` | `#A07A14` | Border, dégradé |
| `--green-mano` | `#2db360` | Barre/check ManoMano |
| `--orange-lm` | `#d94a18` | Barre/cross Leroy Merlin |
| `--bg-base` | `#0a0b0c` | Fond canvas |
| `--ink-100` | `#fff` | Texte principal |
| `--ink-90` | `rgba(255,255,255,0.92)` | Texte secondaire |
| `--ink-70` | `rgba(255,255,255,0.70)` | Eyebrow |

---

## Transitions de scènes — slide vertical doux

```js
function sceneIn(selector, t, duration = 0.45) {
  tl.fromTo(selector,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration, ease: "power3.out" }, t);
}
function sceneOut(selector, t, duration = 0.40) {
  tl.to(selector, { opacity: 0, y: -40, duration, ease: "power2.in" }, t);
}
```

**Règle stricte** : la scène N doit terminer son fade-out (~0.15s avant) le start de la scène N+1, pas d'overlap visible.

---

## Effets validés (à utiliser avec parcimonie)

| Effet | Quand | Code de référence |
|---|---|---|
| **Punch scale** sur chiffre choc | Hook S1 | `from(target, { scale: 2.0, opacity: 0, duration: 0.55, ease: "back.out(2.0)" })` |
| **Word-by-word clip reveal** | Setup texte | `<span class="w-wrap"><span class="w">Mot</span></span>` + `from(w, { y: "110%", ease: "power3.out" })` |
| **Counter animé** | Reveal de chiffre | Loop GSAP avec `onUpdate` qui formate `Math.round().toLocaleString('fr-FR')` |
| **Pulse subtil** | CTA final | `to(target, { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1 })` |

---

## Effets BANNIS

D'après feedback utilisateur explicite (V4) :
- ❌ Flash cuts blancs entre scènes
- ❌ Camera shake (trembling)
- ❌ Glitch RGB split (sauf demande explicite)
- ❌ Whip-pan, mask wipe diagonal
- ❌ Particules
- ❌ Light leaks pulsés
- ❌ Grain animé SVG
- ❌ Crops d'images natifs (génère du dimming hétérogène)

---

## Structure HTML squelette

Voir `index.html` dans ce dossier — squelette commenté à dupliquer pour chaque nouvelle vidéo.

---

## Comment dupliquer pour un nouveau Reel

```bash
NEW=video-X-nom-court
cp -r scripts/reels/_template/ scripts/reels/$NEW
cd scripts/reels/$NEW
# 1. Remplacer placeholders %COMPOSITION_ID%, %TITLE% dans index.html
# 2. Remplacer bg.png par ton screenshot
# 3. Adapter timeline GSAP au contenu
# 4. npm run render
```
