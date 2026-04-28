---
name: geometry-check
description: Validate the 3D geometry output of a DIY Builder simulator (cabanon, terrasse, etc.). Use this whenever the user modifies engine.js, changes geometry calculations, updates structuralStuds/framings/chevrons, or says things like "verifie la geometrie", "check the 3D", "les montants sont corrects?", "validate studs". Extracts geometry from the running preview via React fiber and runs structural validation.
---

# /geometry-check [module]

Extract and validate geometry data from a running DIY Builder simulator.

## Arguments

- `module` (optional): `cabanon` or `terrasse`. Defaults to whichever page is currently loaded.

## Procedure

### 1. Setup
- Start preview server via `preview_start("frontend")`
- Navigate to the module page (`/cabanon` or `/calculateur`)
- Wait for the 3D canvas to render

### 2. Extract geometry via React fiber

Use `preview_eval` to inject this script:

```javascript
(function() {
  function findStructure(dom) {
    const key = Object.keys(dom).find(k => k.startsWith('__reactFiber'));
    if (!key) return null;
    let fiber = dom[key];
    while (fiber) {
      if (fiber.memoizedProps?.structure?.geometry?.structuralStuds)
        return fiber.memoizedProps.structure;
      fiber = fiber.return;
    }
  }
  const s = findStructure(document.querySelector('canvas'));
  if (!s) return { error: 'No structure found on canvas' };
  const g = s.geometry;
  return {
    dimensions: g.dimensions,
    studCount: g.structuralStuds?.length,
    studs: g.structuralStuds?.slice(0, 5),
    framingsCount: g.framings?.length,
    framings: g.framings,
    chevronsCount: g.chevrons?.length,
    chevrons: g.chevrons?.slice(0, 3),
    openings: g.openings,
    wallCount: g.walls?.length,
    lissesKeys: g.lisses ? Object.keys(g.lisses) : [],
    roofVertices: g.roof?.vertices?.length,
  };
})()
```

### 3. Validate against DTU constants

Reference constants from CLAUDE.md:

| Constant | Value | Check |
|---|---|---|
| STUD_SPACING | 0.60 m | Verify regular stud spacing ~60cm apart |
| SECTION | 0.09 m | Verify stud dimensions |
| CORNER_ZONE | 0.12 m | No regular studs within 12cm of corners |
| DEFAULT_HEIGHT | 2.30 m | Default wall height |
| LINTEL_H | 0.12 m | Lintel height |
| SILL_H | 0.09 m | Window sill = SECTION |

### 4. Structural validation checks

**structuralStuds:**
- [ ] 8 corner studs (2 per corner x 4 corners, L-shaped overlap)
- [ ] Regular studs at ~60cm entraxe, excluding corners and openings
- [ ] King studs at each side of door and window openings
- [ ] Jack studs (trimmer) inside king studs, height = opening height
- [ ] Cripple studs above lintels and below window sill (zBase=0)

**framings (3 total):**
- [ ] Index 0: Door lintel at `door.height - LINTEL_H`
- [ ] Index 1: Window lintel at `win.y + win.height`
- [ ] Index 2: Window sill at `win.y - SILL_H`

**chevrons:**
- [ ] All chevrons have `y <= depth` (no phantom chevron)
- [ ] z1 = plateHeight (= height + 2 * SECTION)
- [ ] z2 varies with slope

**walls:**
- [ ] 4 walls
- [ ] Wall 1 (right/high side): height = h + slope
- [ ] Wall 3 (left/low side): height = h
- [ ] Walls 0,2: height interpolated linearly

**roof:**
- [ ] 4 vertices
- [ ] slope = width * 0.15

### 5. Report

```markdown
## Geometry Check: [module] [width]x[depth]m

### Dimensions
width: X, depth: X, height: X, slope: X, plateHeight: X

### Validation
| Check | Expected | Actual | Status |
|-------|----------|--------|--------|

### Anomalies
[List any studs/chevrons/framings that fail validation]

### Raw data sample
[First 3 structuralStuds, all framings, first 3 chevrons]
```
