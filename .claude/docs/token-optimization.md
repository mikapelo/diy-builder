# Token Optimization — DIY Builder

Guide de gestion des coûts et de l'efficacité des sessions multi-agents.

---

## Sélection du modèle par tâche

| Tâche | Modèle recommandé | Raison |
|---|---|---|
| Refactor engine.js, géométrie Three.js | Opus | Raisonnement architectural profond |
| Ajout d'un nouveau module | Sonnet | Suffisant pour du code bien spécifié |
| Bug fix guidé, ajout test | Sonnet | Tâche ciblée |
| Génération de texte, docs, messages MCP | Haiku | Rapide et économique |
| Sessions E2E / coordination agents | Sonnet | Bon équilibre vitesse/qualité |

**Règle :** Opus uniquement quand le problème nécessite une compréhension globale
de l'architecture (ex: refonte de structuralStuds, nouveau moteur de calcul).

---

## Compaction du contexte

### Seuil recommandé : 50% (pas 95%)

Déclencher une compaction manuelle avant :
- Le démarrage d'une phase d'implémentation après une phase de recherche
- Un handoff entre agents (avant `send_message to all`)
- Un refactor qui touche plusieurs fichiers en même temps

### Comment compacter dans Claude Code

```
# Dans la session active
/compact
```

Ou via hotkey `Cmd+Shift+C` (Mac).

### Ce qu'il faut sauvegarder avant de compacter

1. Les décisions architecturales non évidentes
2. L'état du coordinator (get_state avant compaction)
3. Le dernier checkpoint (tests + build status)

---

## Plafond thinking tokens

Pour les tâches de raisonnement étendu (Opus avec extended thinking) :
- Plafonner à **10 000 tokens** de thinking pour les tâches courantes
- Autoriser plus uniquement pour les décisions irréversibles (ex: changement de structure geometry)

---

## Checkpoints comme points de récupération

Après chaque checkpoint `/checkpoint`, le log `.claude/checkpoints.log`
constitue un point de reprise rapide. Si une session crashe ou est compactée,
relire ce fichier suffit à reprendre sans re-analyser tout le code.

---

## Anti-patterns coûteux

| Anti-pattern | Impact | Alternative |
|---|---|---|
| Re-lire CLAUDE.md à chaque outil call | +500 tokens/appel | Lire une fois au démarrage |
| Passer tout le structure.geometry dans un message MCP | +2k tokens/msg | Passer seulement les deltas |
| Demander à Opus de générer un test Vitest trivial | 10× le coût | Sonnet suffit |
| Garder des conversations de 100+ tours sans compaction | Dégradation qualité | Compacter à 50% |
| Générer des logs verbeux dans les hooks | Ralentit le feedback | Hooks async + sortie courte |
