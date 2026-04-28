# MCP Coordinator — Guide d'utilisation

## Lancement des sessions

Chaque session Claude Code doit être lancée avec la variable `COORDINATOR_SESSION` :

```bash
# Terminal 1 — Design
COORDINATOR_SESSION=design claude

# Terminal 2 — Simulateur
COORDINATOR_SESSION=simulator claude

# Terminal 3 — PDF/Export
COORDINATOR_SESSION=pdf claude
```

## Première chose à faire dans chaque session

Dire à Claude :
> "Enregistre-toi comme session [design/simulator/pdf] via le coordinator"

Claude appellera `register_session` automatiquement.

## Fonctionnement automatique

Après **chaque action**, un hook vérifie si des messages sont en attente.
Si oui, Claude les voit et peut réagir.

## Commandes manuelles utiles

- "Envoie un message à la session simulator : [message]"
- "Crée une tâche pour la session pdf : [tâche]"
- "Déclare le contrat BOM_FORMAT : [schema]"
- "Montre l'activité récente"
- "Liste les sessions actives"

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.js` | Serveur MCP (16 tools) |
| `check-messages.js` | Script hook — poll messages |
| `coordinator-db.json` | Base persistante (auto-créée) |
