# /refactor-clean

Scanne le projet DIY Builder pour détecter le dead code, les imports inutilisés,
et les composants orphelins. Ne modifie rien — produit un rapport d'audit.

## Usage

```
/refactor-clean [scope]
```

- `scope` : `all` (défaut), `components`, `hooks`, `modules`, `styles`

## Ce que le scan détecte

1. **Imports inutilisés** — variables importées mais jamais utilisées dans le fichier
2. **Composants orphelins** — fichiers JSX non importés dans le projet
3. **Dead state** — `useState` dont la valeur n'est jamais lue
4. **CSS classes orphelines** — classes définies dans les fichiers CSS non utilisées en JSX
5. **Props non consommées** — props passées mais jamais destructurées ou utilisées
6. **console.log résiduels** — statements de debug oubliés

## Commande directe

```bash
bash /Users/pelo/Downloads/diy-builder-scraper3/.claude/hooks/refactor-scan.sh "$ARGUMENTS"
```

## Workflow recommandé

1. Lancer `/refactor-clean` → lire le rapport
2. Identifier les items à supprimer (confirmer manuellement qu'ils sont vraiment inutiles)
3. Supprimer les dead code identifiés
4. Lancer `/checkpoint` pour valider que rien n'est cassé
5. Committer avec label `chore: dead code cleanup`
