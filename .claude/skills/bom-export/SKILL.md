---
name: bom-export
description: Export the Bill of Materials (BOM) from a DIY Builder simulation as a formatted XLSX or PDF file. Use this when the user wants to export materials, generate a devis, create a shopping list, download the nomenclature, or says things like "exporte les materiaux", "genere le devis", "liste de courses", "BOM en excel", "nomenclature PDF".
---

# /bom-export [format]

Export the current simulation's Bill of Materials.

## Arguments

- `format` (optional): `xlsx` or `pdf`. Defaults to `xlsx`.

## Procedure

### 1. Extract BOM data

Start the preview server and navigate to the active simulator page. Extract the full result data via React fiber:

```javascript
(function() {
  function findStructure(dom) {
    const key = Object.keys(dom).find(k => k.startsWith('__reactFiber'));
    if (!key) return null;
    let fiber = dom[key];
    while (fiber) {
      if (fiber.memoizedProps?.structure)
        return fiber.memoizedProps.structure;
      if (fiber.memoizedProps?.resultat)
        return fiber.memoizedProps.resultat;
      fiber = fiber.return;
    }
  }
  return findStructure(document.querySelector('canvas') || document.querySelector('[data-simulator]'));
})()
```

### 2. Structure the BOM

Organize extracted data into categories:

**For terrasse:**
| Category | Items |
|---|---|
| Structure | Lambourdes (qty, dimensions), Plots/fondations |
| Surface | Lames (qty, longueur, largeur), Vis |
| Accessoires | Cales, Bande bitume, Vis inox |

**For cabanon:**
| Category | Items |
|---|---|
| Ossature | Montants, Lisses basses, Lisses hautes, Contreventement |
| Charpente | Chevrons, Voliges |
| Enveloppe | Bardage (m²), Couverture |
| Quincaillerie | Equerres, Vis, Tirefonds |

### 3. Generate output

**XLSX format:**
Use the `/xlsx` skill if available, otherwise generate via a Node.js script. Structure:
- Sheet 1: "Nomenclature" — all materials with qty, unit, dimensions
- Sheet 2: "Prix comparés" — if price data available, 3 columns (Leroy Merlin, Castorama, Brico Depot)
- Sheet 3: "Résumé" — surface, perimeter, total cost per store

**PDF format:**
Use the `/pdf` skill or jsPDF (already in the project dependencies). Structure:
- Header with project name + dimensions
- Materials table with quantities
- Price comparison if available
- Footer with date + "Généré par DIY Builder"

### 4. Save and inform

Save the file to the project root or user's Downloads:
- `bom_[module]_[width]x[depth]_[date].xlsx`
- `devis_[module]_[width]x[depth]_[date].pdf`

Tell the user where the file was saved.
