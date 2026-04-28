# /multi-plan

Décompose une tâche complexe en sous-tâches pour les agents DIY Builder.
Adapté au coordinator MCP existant (`register_session`, `create_task`, `send_message`).

## Usage

```
/multi-plan "description de la tâche"
```

## Workflow

1. **Analyser** la tâche — identifier les modules touchés, les fichiers protégés, les dépendances
2. **Décomposer** en sous-tâches ordonnées avec périmètres clairs
3. **Créer les tasks** via le coordinator MCP (`create_task` pour chaque sous-tâche)
4. **Broadcaster** le plan (`send_message to: "all"`) pour que les agents soient alignés
5. **Assigner** chaque tâche à l'agent le plus adapté

## Template de décomposition

Pour chaque sous-tâche, spécifier :
- `focus` : domaine (engine | 3D | styles | tests | docs)
- `fichiers` : liste des fichiers à modifier (jamais les fichiers protégés)
- `dépendances` : quelles tâches doivent être terminées avant
- `critère de done` : tests qui doivent passer, screenshot attendu, etc.

## Exemple — Ajout module "piscine"

```
Tâche 1 [engine-agent] : Créer modules/piscine/engine.js
  → Fichiers : modules/piscine/engine.js, modules/piscine/config.js
  → Dépendances : aucune
  → Done : generatePiscine(4, 8) retourne surface=32, studCount>0

Tâche 2 [3d-agent] : Créer PiscineScene.jsx + PiscineViewer.jsx
  → Fichiers : components/simulator/PiscineScene.jsx, PiscineViewer.jsx
  → Dépendances : Tâche 1
  → Done : rendu 3D visible, modes assembled + structure fonctionnels

Tâche 3 [lead] : Intégrer dans projectRegistry + page.jsx
  → Fichiers : core/projectRegistry.js, app/piscine/page.jsx
  → Dépendances : Tâche 1 + 2
  → Done : /checkpoint PASS
```

## Commandes coordinator à utiliser

```js
// Créer les tâches
create_task({ title, description, assignedTo, priority })

// Broadcaster le plan
send_message({ from: "lead", to: "all", message: "[PLAN] ...", priority: "high" })

// Suivre l'avancée
list_tasks({ status: "in_progress" })
```

## Intégration avec /checkpoint

Après chaque sous-tâche complétée → `/checkpoint [label]` avant de passer à la suivante.
