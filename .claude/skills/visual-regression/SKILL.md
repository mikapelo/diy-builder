---
name: visual-regression
description: Run visual regression checks on DIY Builder pages after CSS or component changes. Use this after any UI modification, CSS change, globals.css update, component restyle, or when the user says "verifie visuellement", "visual check", "regression test", "compare before/after", "rien n'a casse?". Takes screenshots of all key sections and compares layout, text, and structure against expectations.
---

# /visual-regression [pages]

Check for visual regressions after code changes.

## Arguments

- `pages` (optional): Comma-separated list of paths. Defaults to `/,/cabanon,/calculateur`.

## Procedure

### 1. Setup
- Start preview server via `preview_start("frontend")`
- Check `preview_console_logs(level: 'error')` for build errors first. If errors, report and stop.

### 2. Check each page

For each page, perform these checks:

#### a. Console errors
```
preview_console_logs(level: 'error')
```
Any error is a regression.

#### b. Snapshot structure
```
preview_snapshot()
```
Verify key elements are present:

**Landing page `/`:**
- [ ] Header with "DIY Builder" logo
- [ ] Hero title "Simulateur de construction bois"
- [ ] Hero CTA buttons (2)
- [ ] Store logos (3)
- [ ] Project cards (4)
- [ ] "Comment ca marche" section with 3 cards
- [ ] Dark expertise section
- [ ] Stats section (4 metrics)
- [ ] Comparateur with 3 store rows
- [ ] Footer with columns

**Cabanon `/cabanon`:**
- [ ] Header
- [ ] Page title "Calculateur cabanon bois"
- [ ] Stats bar (m², montants, perim, fenetre)
- [ ] 3D Canvas present
- [ ] View mode buttons (Assemblee, Detaillee, Plan)
- [ ] Dimension controls (largeur, profondeur, hauteur)
- [ ] Materials list
- [ ] Footer

**Terrasse `/calculateur`:**
- [ ] Header
- [ ] Form inputs (largeur, longueur, type bois)
- [ ] Results panel (if submitted)
- [ ] Footer

#### c. Visual screenshots at key scroll positions
For the landing page, take 5 screenshots (scroll 0, 700, 1400, 2200, 3500).
For simulator pages, take 2 screenshots (top + scrolled).

#### d. Responsive check
Resize to mobile (375x812), take one screenshot per page, check for:
- Horizontal overflow
- Overlapping elements
- Touch targets < 44px
- Text readability

### 3. Report

```markdown
## Visual Regression Report

### Build status
- Console errors: [none / list]

### Page checks
| Page | Elements OK | Console | Mobile | Status |
|------|------------|---------|--------|--------|
| /    | 12/12      | clean   | OK     | PASS   |

### Issues found
| Page | Issue | Severity | Screenshot |
|------|-------|----------|------------|

### Screenshots
[Attach any screenshots showing regressions]
```

## When to run automatically

This skill should be triggered after:
- Any edit to `styles/globals.css`
- Any edit to `tailwind.config.js`
- Any edit to components in `components/layout/` (Header, Footer)
- Any edit to `components/features/shared/HeroSection.jsx`
- Major component rewrites
