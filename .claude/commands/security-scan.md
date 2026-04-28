# /security-scan

Scan de sécurité léger adapté au projet DIY Builder.
Détecte les secrets exposés, les dépendances vulnérables, et les risques MCP.

## Usage

```
/security-scan
```

## Commande directe

```bash
bash /Users/pelo/Downloads/diy-builder-scraper3/.claude/hooks/security-scan.sh
```

## Ce qui est scanné

1. **Secrets exposés** — clés API, tokens, mots de passe dans le code source
2. **Dépendances vulnérables** — `npm audit` sur le projet frontend
3. **Fichiers .env exposés** — vérification .gitignore
4. **Permissions MCP coordinator** — vérification que les outils exposés sont légitimes
5. **Chemins absolus hardcodés** — peuvent exposer la structure du système en prod

## Note

Pour un scan complet de niveau production, utiliser AgentShield (repo everything-claude-code) :
```bash
npx ecc-agentshield scan
```
