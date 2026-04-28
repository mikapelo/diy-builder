# DIY Builder — Roster des sessions multi-agents

> Stratégie : 1 session **Lead** (Sonnet 4.6) orchestre, 9 rôles spécialisés exécutent avec le modèle le plus léger qui fasse le boulot correctement. Les tâches complexes-mais-ciblées tournent sur Opus, les tâches mécaniques tournent sur Haiku, le reste sur Sonnet.
>
> **Pourquoi Sonnet pour le Lead :** le Lead fait surtout du routage (matching demande → rôle → brief templaté), pas du raisonnement profond. Or c'est lui qui héberge tout le contexte de la conversation — mettre de l'Opus sur ce rôle, c'est payer le prix fort sur le plus gros volume de tokens. L'intelligence chère va dans les sous-agents, pas dans le dispatcher.

> **Deux modes d'exécution** au choix du Lead selon la tâche :
> - **Mode A — MCP coordinator** : sessions Claude persistantes qui s'échangent des messages. Utile quand plusieurs rôles collaborent dans la durée sur un même chantier.
> - **Mode B — Sous-agents (tool Agent)** : le Lead spawne des sous-agents à la demande via `Agent(subagent_type, prompt, model)`. Utile pour les tâches ponctuelles, atomiques, parallèles.
>
> Règle par défaut : **Mode B** (plus simple, moins d'infra), et on passe en **Mode A** uniquement si la tâche demande une collaboration longue durée entre rôles.

---

## 1. Session LEAD

| Nom | Modèle | Rôle |
|---|---|---|
| `lead-orchestrator` | **Sonnet 4.6** | Reçoit la demande utilisateur, décompose en sous-tâches, dispatche via `Agent(...)` ou `send_message`, agrège les livraisons, tranche les arbitrages simples. |

**Responsabilités :**
- Lire `SESSIONS.md` + `CLAUDE.md` au démarrage.
- Identifier la/les sessions concernées par la demande.
- Rédiger un brief court par session (périmètre + critère de "done").
- NE PAS coder elle-même (sauf micro-édits) — son job c'est le routage, pas la prod.
- Relire les livraisons, détecter les conflits évidents, demander les corrections.
- Pour les arbitrages difficiles (conflits entre invariants, ambiguïté d'architecture) : déléguer à un `Agent(architect, opus)` plutôt que trancher seul.

**Budget token :** ~10% du coût total (gros volume de contexte, modèle économe).

**Quand upgrader en Opus :** si tu observes des erreurs de routage répétées, des briefs ambigus, ou une incapacité à détecter des violations d'invariants dans les livraisons → passer en Opus 4.6 (4.7 overkill pour un rôle de dispatch).

---

## 2. Sessions spécialisées

### Tier 1 — Opus 4.7 (raisonnement lourd)

| Session | Modèle | Périmètre | Pourquoi Opus |
|---|---|---|---|
| `engine-core` | Opus 4.7 | `modules/*/engine.js`, `lib/*Constants.js` (sauf protégés) | Calculs DTU, invariants géométriques, contraintes négatives sur fichiers protégés. Une erreur = régression silencieuse. |
| `geometry-3d` | Opus 4.7 | `components/simulator/*Scene.jsx`, `*Viewer.jsx`, modes R3F | Z-fighting, refs R3F, InstancedMesh, flash noir — debug causal 3D. |
| `architect` | Opus 4.7 | ADR, ajout de module (6 étapes), refactor transverse, `CLAUDE.md` | Décisions qui engagent 10+ fichiers. |
| `review-qa` | Opus 4.7 | Relecture pré-merge, audit invariants, sécurité | Dernière ligne de défense avant commit. |

### Tier 2 — Sonnet 4.6 (implémentation standard)

| Session | Modèle | Périmètre | Pourquoi Sonnet |
|---|---|---|---|
| `ui-components` | Sonnet 4.6 | `components/ui/*`, `components/simulator/*` (hors Scene/Viewer), hooks non-3D | UI Tailwind + React — zone dense, peu piégeuse. |
| `tests` | Sonnet 4.6 | `__tests__/*`, `e2e/*.spec.js` | Générer vitest + playwright, bons cas limites — Sonnet suffit si le lead a listé les invariants. |
| `cost-pdf` | Sonnet 4.6 | `costCalculator.js`, `materialPrices.js`, `usePDFExport.js`, `ExportPDF/*` | jsPDF + mapping prix — logique métier standard, peu de pièges 3D. |

### Tier 3 — Haiku 4.5 (mécanique)

| Session | Modèle | Périmètre | Pourquoi Haiku |
|---|---|---|---|
| `styling` | Haiku 4.5 | `styles/*.css`, design tokens, classes Tailwind | Édition ciblée de CSS, renommage tokens, nettoyage. Pas de raisonnement. |
| `docs-scribe` | Haiku 4.5 | README, JSDoc, commentaires, changelog | Reformulation, mise en forme, pas de décision. |

---

## 3. Choisir entre Mode A et Mode B

### Mode B — Sous-agents via tool `Agent` (PAR DÉFAUT)

**Quand l'utiliser :**
- Tâche ponctuelle qui se résout en un seul aller-retour ("ajoute un test", "corrige ce bug CSS", "documente cette fonction").
- Tâches indépendantes qui peuvent tourner en parallèle (dispatch simultané).
- Besoin de cloisonner le contexte pour économiser les tokens du Lead.

**Comment :**
```js
Agent({
  description: "Courte phrase (3-5 mots)",
  subagent_type: "general-purpose",    // ou un subagent_type spécifique
  model: "opus" | "sonnet" | "haiku",  // choisi selon le tier de la session
  prompt: "<brief complet et autonome — voir format section 4>"
})
```

**Propriétés :**
- Le sous-agent n'a AUCUNE mémoire des conversations précédentes → le prompt doit tout contenir (périmètre, fichiers, invariants, critère de done).
- Le Lead reçoit un résultat synthétique en retour, puis continue.
- Plusieurs `Agent(...)` dans un même message tool-call = exécution en parallèle.
- Pas de `register_session`, pas de `send_message`, pas de poll. Zero infra.

**Exemple concret :**
> Utilisateur : « Corrige le flash noir au switch de mode »
> Lead : `Agent({ description: "Fix flash noir R3F", subagent_type: "general-purpose", model: "opus", prompt: "[BRIEF] Bug: ..." })`
> Résultat retourné au Lead → synthèse à l'utilisateur.

### Mode A — MCP coordinator (sessions persistantes)

**Quand l'utiliser :**
- Chantier qui dure plusieurs heures avec allers-retours entre rôles (ex: ajout d'un module escalier où `engine-core`, `geometry-3d` et `ui-components` doivent itérer ensemble sur 20+ messages).
- Besoin de state partagé entre sessions (`get_state`/`set_state`).
- Besoin de voir qui bosse sur quoi en parallèle via `list_tasks`.
- Tu as déjà ouvert manuellement les fenêtres Claude des rôles concernés.

**Comment :**
```
1. Utilisateur ouvre manuellement N fenêtres Claude, une par rôle actif.
2. Chaque fenêtre s'initialise : register_session + get_messages en boucle.
3. Lead dispatche via send_message(to: "<session>", ...).
4. Chaque rôle poll, exécute, renvoie via send_message.
5. Lead agrège et arbitre.
```

**Propriétés :**
- Persistance réelle entre messages, contexte partagé.
- Coordination visible (tâches trackées, priorités, broadcast).
- MAIS : coût infra (plusieurs fenêtres), coût tokens (poll, contexte long), risque de dérive.

### Décision rapide (le Lead tranche ainsi)

| La tâche... | Mode |
|---|---|
| se résout en 1-3 actions | **B** |
| touche 1 seul fichier ou 1 seul domaine | **B** |
| peut être parallélisée entre rôles indépendants | **B** |
| demande un va-et-vient itératif entre 2+ rôles | **A** |
| a besoin d'un état partagé vivant (progression, verrous, résultats intermédiaires) | **A** |
| dure plus d'une heure et implique plusieurs rôles | **A** |

---

## 4. Protocole de dispatch

### Au démarrage du Lead (les deux modes)
```
1. Lire .claude/SESSIONS.md (ce fichier) + CLAUDE.md
2. SI Mode A prévu : register_session(name: "lead-orchestrator", focus: "orchestration")
                    + get_messages(for: "lead-orchestrator")
                    + list_tasks()
3. SI Mode B : rien à faire, juste être prêt à spawner des Agent(...).
```

### Boucle de dispatch — Mode B (sous-agents)
```
1. Analyser la demande → lister les rôles à activer
2. Pour chaque rôle (en parallèle si possible) :

   Agent({
     description: "<3-5 mots>",
     model: "opus" | "sonnet" | "haiku",     // selon tier du rôle
     prompt: "<BRIEF complet — format section 5>"
   })

3. Collecter les résultats (le tool retourne la synthèse de chaque agent)
4. Si changement non-trivial → Agent supplémentaire avec role="review-qa" en opus
5. Synthétiser et répondre à l'utilisateur
```

### Boucle de dispatch — Mode A (MCP coordinator)
```
1. Analyser la demande → lister les sessions actives nécessaires
2. Pour chaque session : create_task + send_message avec brief

   send_message(
     from: "lead-orchestrator",
     to: "<session-cible>",
     priority: "normal|high",
     message: "[TASK-123] <brief format section 5>"
   )

3. Poll get_messages pour récupérer les livraisons
4. Agréger → arbitrer les conflits (tier 1 tranche)
5. Envoyer à review-qa pour vérif finale si changement non-trivial
6. send_message(to: "all", message: "[LEAD] livraison X mergée — status OK")
```

---

## 5. Format standard des briefs Lead → Rôle
```
[TASK-ID] <titre court>

PÉRIMÈTRE AUTORISÉ:
- <liste de fichiers à modifier>

INTERDIT:
- <fichiers protégés ou hors-périmètre>

INVARIANTS:
- <règles métier à respecter, ex: "studCount >= 4">
- <ex: "ne pas toucher au waste factor">

CRITÈRE DE DONE:
- <ex: "tests vitest passent + build OK + screenshot si visuel">

DÉLIVRABLE ATTENDU:
- Liste des fichiers modifiés
- Status build/test
- Screenshot si changement visuel
```

### Format standard des livraisons Session → Lead
```
[<SESSION_NAME>] <action> — <fichiers modifiés> — build: OK|FAIL — test: OK|FAIL
(screenshot: path si pertinent)
```

---

## 6. Règles anti-gaspillage

1. **Le Lead ne code pas** — au-delà de 5 lignes, il délègue. Sinon on paie du Opus pour du travail que Sonnet fait aussi bien.
2. **Une session = un périmètre** — si une tâche touche 3 domaines, dispatcher à 3 sessions en parallèle, pas en série.
3. **Haiku en premier recours** sur : rename, reformater, lint, docstring, CSS simple, traduire.
4. **Ne pas relire le code avec Opus** pour vérifier — c'est le job de `review-qa` en un seul pass.
5. **Les protected files bloquent les 3 tiers** — personne ne les touche, pas même Opus.
6. **Coupure automatique** — si une session dépasse 3 allers-retours sans progresser, le Lead reassigne à un tier supérieur.

---

## 7. Exemples de routage

| Demande utilisateur | Mode | Dispatch |
|---|---|---|
| "Corrige le flash noir quand on switche de mode" | B | 1× `Agent(geometry-3d, opus)` → 1× `Agent(review-qa, opus)` |
| "Le prix du bois a changé, mets à jour" | B | 1× `Agent(cost-pdf, sonnet)` |
| "Refactor le CSS globals.css" | B | 1× `Agent(styling, haiku)` → 1× `Agent(review-qa, opus)` |
| "Les studs flottent quand pente > 30°" | B | 2× `Agent` en parallèle : `engine-core` (opus) + `geometry-3d` (opus) → `review-qa` (opus) |
| "Ajoute des tests sur wallStudH aux limites" | B | 1× `Agent(tests, sonnet)` avec cas limites listés |
| "Renomme STUD_SPACING en STUDS_SPACING partout" | B | 1× `Agent(styling ou docs-scribe, haiku)` |
| "Écris un ADR sur le choix R3F vs vanilla Three" | B | 1× `Agent(architect, opus)` |
| "Passe en revue la PR #42" | B | 1× `Agent(review-qa, opus)` |
| "Ajoute un module escalier complet" | **A** | sessions `architect` + `engine-core` + `geometry-3d` + `ui-components` + `tests` ouvertes, itèrent sur 2-3h via MCP |
| "Migration globale du design system vers g-v2" | **A** | sessions `styling` + `ui-components` + `architect` + `review-qa` actives, state partagé des composants migrés |

---

## 8. Répartition budgétaire indicative

| Tier | Part estimée du trafic | Part estimée du coût |
|---|---|---|
| Lead (Sonnet) | 100% du contexte conversation | ~10% |
| Tier 1 Opus (engines, 3D, archi, review) | 20% des tâches | ~55% |
| Tier 2 Sonnet (UI, tests, cost-pdf) | 50% des tâches | ~25% |
| Tier 3 Haiku (CSS, docs) | 30% des tâches | ~10% |

Gain attendu vs "tout-Opus" : **~65% d'économie** à qualité équivalente, parce que (a) le Lead qui brasse tout le contexte tourne en Sonnet, (b) l'essentiel du volume implémentation tombe sur Sonnet/Haiku.

---

## 9. Escalade

Si une session Tier 2/3 tombe sur un cas qui la dépasse :
```
send_message(
  from: "<session>",
  to: "lead-orchestrator",
  priority: "high",
  message: "[ESCALATE] <description> — suggestion: reassign to <tier-1-session>"
)
```
Le Lead décide de reassigner ou de compléter le brief.

---

*Dernière mise à jour : 2026-04-17*
