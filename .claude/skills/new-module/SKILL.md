---
name: new-module
description: Scaffold a new DIY Builder construction module (pergola, cloture, abri, etc.). Use this skill whenever the user wants to add a new project type, create a new simulator, or says things like "ajoute un module", "nouveau projet", "scaffold pergola". This creates the full file structure (engine, config, page, viewer, scene) and registers the module.
---

# /new-module [name]

Scaffold a complete new construction module for DIY Builder.

## Arguments

- `name` (required): module identifier in lowercase (e.g., `pergola`, `cloture`, `abri`)

## What it creates

| File | Purpose |
|---|---|
| `frontend/modules/[name]/engine.js` | `generate[Name](width, depth, options)` — material calculations + geometry |
| `frontend/modules/[name]/config.js` | Module metadata: id, label, icon (Material Symbol), pdfTitle |
| `frontend/modules/[name]/index.js` | Re-export engine + config |
| `frontend/app/[name]/page.jsx` | Next.js App Router page with `'use client'` + dynamic import |
| `frontend/components/simulator/[Name]Viewer.jsx` | Canvas wrapper + view mode buttons |
| `frontend/components/simulator/[Name]Scene.jsx` | Three.js scene (react-three-fiber) |

## What it registers

- Adds entry in `frontend/core/projectRegistry.js`
- Adds project in `frontend/utils/projects.js` with `active: true`

## Procedure

1. **Read reference templates** — Before generating, read these files to match the exact patterns:
   - `frontend/modules/cabanon/engine.js` (for engine structure, geometry format)
   - `frontend/modules/cabanon/config.js` (for config shape)
   - `frontend/modules/cabanon/index.js` (for re-export pattern)
   - `frontend/app/cabanon/page.jsx` (for page pattern with dynamic import + ssr:false)
   - `frontend/components/simulator/CabanonViewer.jsx` (for viewer pattern)
   - `frontend/components/simulator/CabanonScene.jsx` (for scene pattern)
   - `frontend/core/projectRegistry.js` (to see registration format)
   - `frontend/utils/projects.js` (to see PROJETS array format)

2. **Generate engine.js** — The engine must:
   - Export `generate[Name](width, depth, options)`
   - Return `{ surface, perimeter, materials: [...], geometry: { dimensions, walls, ... } }`
   - Include realistic material calculations appropriate to the module type
   - Follow the same geometry structure as cabanon (dimensions, walls, studs, etc.) adapted to the new type

3. **Generate config.js** — Must export:
   ```js
   export const [name]Config = {
     id: '[name]',
     label: '[Name] bois',
     icon: '[material-symbol-name]',
     pdfTitle: 'Devis [Name]',
   };
   ```

4. **Generate index.js** — Re-export both engine and config.

5. **Generate page.jsx** — Follow the cabanon page pattern exactly:
   - `'use client'` directive
   - `dynamic(() => import(...), { ssr: false })` for the viewer
   - Wrap in layout with Header

6. **Generate Viewer and Scene** — Follow CabanonViewer/CabanonScene patterns:
   - Viewer: Canvas wrapper, OrbitControls, view mode buttons
   - Scene: Basic Three.js geometry rendering using the engine's geometry output

7. **Register** — Add to projectRegistry and projects.js

8. **Create illustration placeholder** — Remind user to add `/public/illustrations/[name].png`

## Important rules from CLAUDE.md

- NEVER modify files in `lib/` (deckEngine, deckConstants, deckGeometry, foundationCalculator)
- Use `'use client'` + `dynamic(import, { ssr: false })` for Three.js components
- Use `key` on Scene component, never on Canvas (avoids WebGL flash)
- Use `visible={bool}` instead of conditional rendering for Three.js groups
