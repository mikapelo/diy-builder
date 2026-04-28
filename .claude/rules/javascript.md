# Rules — JavaScript (DIY Builder)

Ces règles s'appliquent à tous les fichiers JS du projet (engines, hooks, lib).

## Engines (modules/*/engine.js)

- **Fonctions pures uniquement** — `generate[Module](width, depth, options)` ne lit/écrit aucun état externe
- **Pas de waste factor dans les engines** — le `WOOD_WASTE_FACTOR = 1.10` vit dans `costCalculator.js` uniquement
- **Retourner des quantités brutes** — l'engine calcule; le costCalculator applique les marges
- **Constantes dans lib/[module]Constants.js** — jamais de magic numbers inline dans un engine
- **Séparer calculs matériaux et géométrie** — les objets `geometry.*` sont la couche 3D, les autres propriétés sont le BOM

## Qualité code

- **Pas de `console.log` en production** — utiliser des commentaires pour le debug, ou supprimer avant commit
- **Pas de code commenté** — si un bloc est commenté, le supprimer (git le conserve)
- **Nommer les fonctions intermédiaires** — éviter les lambdas imbriquées sur >2 niveaux
- **Garder les fonctions < 50 lignes** — au-delà, extraire des helpers nommés

## Sécurité calculs

- **Garder les coefficients dans des constantes nommées** — `ROOF_COEF = 1.10` pas `quantity * 1.10`
- **Documenter la source des formules DTU** — comment au-dessus de chaque calcul structurel
- **Invariants en tests** — toute règle métier critique (ex: `studCount >= 4`) doit avoir un test

## Imports

- **Imports absolus avec `@/`** — `import { x } from '@/lib/foo'` pas `../../lib/foo`
- **Pas d'import circular** — engines n'importent pas de composants, composants n'importent pas d'autres composants engines
- **Un export par responsabilité** — préférer les named exports aux default exports dans les engines

## Tests (Vitest)

- **Tester les valeurs aux limites** — width=0, depth=min, options manquantes
- **Tester les invariants géométriques** — ex: `studs.every(s => s.height > 0)`
- **Pas de mocks d'engines** — tester les engines directement, pas via des mocks
- **Nommer les tests explicitement** — `'calcule correctement le nombre de montants pour 3m×4m'`
