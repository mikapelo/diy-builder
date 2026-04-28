# /checkpoint

Lance la pipeline de vérification DIY Builder : tests Vitest + build Next.js.
Sauvegarde le résultat dans `.claude/checkpoints.log`.

## Usage

```
/checkpoint [label]
```

- `label` : identifiant optionnel (ex: `after-pergola-refactor`, `pre-merge`)

## Comportement

1. `cd frontend/`
2. `npm test -- --run` (Vitest, tous les tests unitaires)
3. `npm run build` (Next.js production build)
4. Log horodaté dans `.claude/checkpoints.log`
5. Affiche PASS / FAIL clair en sortie

## Quand l'utiliser

- Avant de passer la main à un autre agent (broadcast MCP)
- Après un refactor structurel (engine, geometry, hooks)
- Avant de créer une PR ou un commit de livraison

## Commande directe

```bash
bash /Users/pelo/Downloads/diy-builder-scraper3/.claude/hooks/checkpoint-verify.sh "$ARGUMENTS"
```
