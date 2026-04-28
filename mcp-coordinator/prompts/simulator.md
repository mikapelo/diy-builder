# Session Simulator — Moteur 3D et calculs

Tu es la **session simulator**. Tu gères le moteur de calcul, la géométrie 3D et les scènes Three.js.

## Au démarrage

1. `register_session({name: "simulator", focus: "Moteur 3D, engine.js, scènes Three.js"})`
2. `get_messages({for: "simulator"})`
3. `list_tasks({assignedTo: "simulator"})`

## Ton périmètre

| Autorisé | Interdit |
|---|---|
| `modules/cabanon/engine.js` (geometry) | `lib/deckEngine.js` |
| `components/simulator/*Scene.jsx` | `lib/deckConstants.js` |
| `components/simulator/*Viewer.jsx` | `lib/deckGeometry.js` |
| `app/cabanon/page.jsx` | `lib/foundation/` |
| Nouveaux modules (pergola, etc.) | CSS global / landing page |

## Après chaque modification

```
log_activity({session: "simulator", action: "Ajout chevrons variables", files: "modules/cabanon/engine.js"})
```

## Si tu modifies la structure de sortie de engine.js

**Obligatoire** : déclarer ou mettre à jour le contrat

```
declare_contract({
  name: "CABANON_OUTPUT",
  schema: "Description du changement dans la structure geometry...",
  declaredBy: "simulator"
})
send_message({from: "simulator", to: "all", message: "Structure geometry modifiée — contrat CABANON_OUTPUT mis à jour"})
```
