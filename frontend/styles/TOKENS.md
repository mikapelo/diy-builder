# Design Tokens — DIY Builder

Reference des variables CSS utilisées dans le projet.
Fichier source : `styles/base.css` (`:root`), `styles/landing.css` (`--v6-*`), `styles/theme-g-v2.css` (`--g-*`).

---

## 1. Core Tokens (`:root` — base.css)

### Couleurs primaires — Gold
Usage : CTAs uniquement, avec parcimonie.
Palette unifiée sur `#C9971E` (audit pre-launch 2026-04-21). Historique : `#D4AF37` / `#D4A634` → `#C9971E`.

| Token | Valeur | Usage |
|---|---|---|
| `--primary` | `#C9971E` | Boutons CTA, accents gold (= `--v6-primary` = `--g-mustard`) |
| `--primary-subtle` | `#C9A52C` | Hover léger |
| `--primary-dark` | `#A07A14` | Active/pressed |
| `--primary-text` | `#7A5C00` | Texte sur fond primary-container |
| `--primary-container` | `#FFF8E1` | Fond badge/chip primary |

### Couleurs secondaires — Forest Green
Usage : validation uniquement.

| Token | Valeur | Usage |
|---|---|---|
| `--secondary` | `#1B3022` | Vert profond validation |
| `--secondary-light` | `#476553` | Variante claire |

### Validation / Success

| Token | Valeur |
|---|---|
| `--green` | `#1A5C20` |
| `--green-mid` | `#2E7D32` |
| `--green-light` | `#4CAF50` |
| `--green-pale` | `#E8F5E9` |
| `--valid` | `#2E7D32` |
| `--valid-light` | `#E8F5E9` |

### Sky (technique, export, info)

| Token | Valeur |
|---|---|
| `--sky` | `#E3F2FD` |
| `--sky-on` | `#0D47A1` |

### Hiérarchie texte

| Token | Valeur | Rôle |
|---|---|---|
| `--text` | `#1a1c1b` | Titres, texte principal |
| `--text-2` | `#4e4637` | Sous-titres, labels importants |
| `--text-3` | `#6b5f4f` | Texte secondaire, hints |
| `--text-4` | `#8a7e6f` | Placeholders, captions |

### Surfaces

| Token | Valeur | Rôle |
|---|---|---|
| `--surface` | `#FAFAF8` | Fond de page |
| `--surface-low` | `#f4f3f1` | Cartes, zones secondaires |
| `--surface-high` | `#e9e8e6` | Séparateurs, zones tertiaires |
| `--white` | `#FFFFFF` | Cartes surélevées |

### Bordures

| Token | Valeur |
|---|---|
| `--border` | `#e9e8e6` |
| `--border-2` | `#d1c5b2` |

---

## 2. Landing V6 Tokens (`--v6-*` — landing.css)

Scope : page d'accueil (hero, showcase, bento, stats).

| Token | Valeur | Rôle |
|---|---|---|
| `--v6-primary` | `#C9971E` | Gold landing (légèrement plus chaud que core) |
| `--v6-primary-light` | `#E0B84A` | Hover, accents légers |
| `--v6-primary-dark` | `#A07A14` | Active states |
| `--v6-text` | `#111214` | Texte principal landing |
| `--v6-text-2` | `#3D3A35` | Sous-titres |
| `--v6-text-3` | `#66625A` | Nav, captions |
| `--v6-text-4` | `#918B82` | Muted |
| `--v6-surface` | `#F3F2EE` | Fond sections |
| `--v6-surface-deep` | `#E8E6E0` | Fond bento/stats |
| `--v6-border` | `#DDDBD6` | Séparateurs landing |
| `--v6-green` | `#2B8A57` | Badges positifs |
| `--v6-blue` | `#4A7FBF` | Info, technique |
| `--v6-blue-light` | `#7BA3D4` | Variante claire |

---

## 3. Atelier G-v2 Tokens (`--g-*` — theme-g-v2.css)

Scope : `[data-theme="g-v2"]` — modules simulateur (cabanon, terrasse, pergola, cloture) + landing.
Rôles : marine = ossature, moutarde = signature, brique = CTA.

| Token | Valeur | Rôle |
|---|---|---|
| `--g-ink` | `#111214` | Texte principal |
| `--g-marine` | `#1E3A52` | Couleur ossature, headers, fond dark |
| `--g-marine-2` | `#27506F` | Marine clair, hover |
| `--g-mustard` | `#C9971E` | Signature gold, accents (unifié 2026-04-21) |
| `--g-mustard-d` | `#A07A14` | Mustard dark, hover |
| `--g-brique` | `#B44B2A` | CTA, actions principales |
| `--g-brique-d` | `#94381C` | Brique hover/active |
| `--g-ivoire` | `#F1EBDD` | Fond de page modules |
| `--g-surface` | `#FAF5E8` | Surface cartes |
| `--g-sable` | `#EAE0C8` | Bordures, séparateurs |
| `--g-rule` | `rgba(30,58,82,0.18)` | Lignes subtiles |

### Typographies G-v2

| Token | Valeur | Usage |
|---|---|---|
| `--g-serif` | `'DM Serif Display', Georgia, serif` | Titres modules, headings premium |
| `--g-mono` | `'IBM Plex Mono', ui-monospace, monospace` | Valeurs techniques, BOM, dimensions |

---

## 4. Typographie (polices)

Chargées dans `layout.jsx` via Google Fonts :

| Police | Poids | Usage |
|---|---|---|
| **Manrope** | 400, 600, 700, 800 | Titres (h1-h4), header, navigation |
| **Inter** | 400–800 | Texte courant, body, labels |
| **DM Serif Display** | regular, italic | Titres G-v2 (serif premium) |
| **IBM Plex Mono** | 400–700 | Valeurs techniques, BOM |
| **Edo** | regular | Logo mark (local, `/fonts/edo.regular.ttf`) |
| **Material Symbols Outlined** | variable | Icônes UI (landing, navigation) |
| **Phosphor Icons** | duotone, bold, fill | Icônes modules (CDN, POC) |

---

## 5. Fichiers CSS — Architecture

```
styles/
├── globals.css          ← Hub d'imports (17 lignes)
├── base.css             ← :root tokens, reset, animations, boutons, UI (693 lignes)
├── simulator.css        ← Layout simulateur, tunnel, composants (2402 lignes)
├── landing.css          ← Hero V6, showcase, bento, stats (850 lignes)
├── theme-g-v2.css       ← Phosphor + [data-theme="g-v2"] overrides (2855 lignes)
└── TOKENS.md            ← Ce fichier
```

Ordre de cascade : `base → simulator → landing → theme-g-v2`.
Le thème G-v2 override les tokens de base quand `data-theme="g-v2"` est présent.

## Tokens ajoutés (2026-04-18)

### Border radius
| Token | Valeur | Usage |
|---|---|---|
| `--radius-sm` | 8px | Badges, inputs petits |
| `--radius-md` | 12px | Cards, modales |
| `--radius-lg` | 16px | Grandes cards, panels |
| `--radius-xl` | 20px | Hero cards |

### Shadows
| Token | Usage |
|---|---|
| `--shadow-sm` | Éléments inline, badges |
| `--shadow-md` | Cards standard |
| `--shadow-lg` | Modales, dropdowns |

### Typographie (scale)
`--text-xs` (10px) → `--text-sm` (12px) → `--text-base` (14px) → `--text-md` (16px) → `--text-lg` (18px) → `--text-xl` (20px) → `--text-2xl` (24px) → `--text-3xl` (32px)

### Espacement (scale × 4px)
`--space-1` (4px) → `--space-2` (8px) → `--space-3` (12px) → `--space-4` (16px) → `--space-5` (20px) → `--space-6` (24px) → `--space-8` (32px) → `--space-10` (40px) → `--space-12` (48px) → `--space-16` (64px)

### Seuils DeckControls
| Token | Valeur | Usage |
|---|---|---|
| `--seuil-green-bg` | #EEF5EC | Fond badge vert |
| `--seuil-green-text` | #2D6A2D | Texte badge vert |
| `--seuil-amber-bg` | #FFF8EC | Fond badge ambre |
| `--seuil-amber-text` | #7A5A12 | Texte badge ambre |
| `--seuil-red-bg` | #FDEEEC | Fond badge rouge |
| `--seuil-red-text` | #7A2E1A | Texte badge rouge |

### Z-index scale (ajouté 2026-04-21)
| Token | Valeur | Usage |
|---|---|---|
| `--z-base` | 0 | Backgrounds |
| `--z-content` | 1 | Contenu normal |
| `--z-raised` | 2 | Éléments surélevés |
| `--z-floating` | 3 | Cards flottantes |
| `--z-sticky` | 10 | Éléments sticky |
| `--z-dropdown` | 50 | Dropdowns, tooltips |
| `--z-modal-scrim` | 99 | Fond de modale |
| `--z-modal` | 100 | Modale |
| `--z-notification` | 500 | Notifications, toasts |
| `--z-fullscreen` | 1000 | Plein écran |

### Transitions standards (ajouté 2026-04-21)
| Token | Valeur | Usage |
|---|---|---|
| `--transition-fast` | 150ms ease | Hover boutons, tabs |
| `--transition-normal` | 200ms ease | Cards, panels |
| `--transition-slow` | 300ms ease | Modales, sections |
