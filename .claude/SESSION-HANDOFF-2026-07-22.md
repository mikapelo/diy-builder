# Session Handoff — 22 juillet 2026

> Lire d'abord, puis `CLAUDE.md` + mémoire `MEMORY.md`.
> Fait suite à `SESSION-HANDOFF-2026-07-01.md`.
> **HEAD = `origin/main` = `0906edc`** — tout est commité ET poussé (Vercel auto-deploy). 0 en attente.

---

## A. CE QUI A ÉTÉ FAIT — 9 commits, tous en prod

### Chantier 1 — CRO affiliation Awin (4 commits)
- `d0b062c` CTA orientés-bénéfice (« Voir les modèles/coloris… ») + **micro-badges** de confiance sur les blocs sans note.
- `3d13c14` composant **`AffiliateInline`** — lien partenaire inline milieu d'article (pergola, cabanon, clôture-solaire), `rel=sponsored` + « (lien partenaire) ».
- `8041efd` disclosure Awin **minimaliste** discrète (bas-droite).
- `e4a9dad` **focus-visible AA** sur CTA affiliés + comparateur (WCAG 2.4.7) ; **tracking `placement`** threadé (event `awin-click` fire `guide`/`sim` au lieu du défaut `block`) ; rating vocalisé.
- `dc93215` **design cards** : prix en héros (21px, suffixe discret) + survol (lift −3px, flèche, halo vert/or) — **validé en preview widget avant impl**.

### Chantier 2 — Refonte design des pages SEO (5 commits) — LES 4 DISPOSITIFS FAITS
- `2f23c37` **ossature typo** (CSS global, 0 réécriture) : H2 numérotés auto (compteur CSS), H3 réveillés (marqueur or, avant = corps en gras), lettrine d'intro. **+ sommaire auto** `ArticleToc`.
- `fee694d` **encadrés** `Callout` sur 5 guides (main-loop).
- `369221c` **encadrés** sur 16 guides (workflow multi-agent).
- `0906edc` **exergues** `PullQuote` sur 18 guides (workflow sélectif).

**Méthode design** : mockup widget fidèle Actuel/Proposé → validation user → code → vérif live (Browser pane). Cf [[feedback_preview_design_avant_impl]].
**Méthode éditoriale** : encadrés/exergues placés via **workflow propose→vérif adversariale→applique**, chacun REFORMULE un point déjà écrit (0 nouveau chiffre). La vérif indépendante a **rejeté 4 déformations YMYL** (« défauts cachés »→« vices cachés », « le seul critère », « taux communal » seul, une redondance) — garde-fou fact-check automatisé.

---

## B. INFRA RÉUTILISABLE CRÉÉE
- `components/content/Callout.jsx` — encadré `info`/`warn`/`pro` (or/terracotta/vert), icônes SVG inline.
- `components/content/ArticleToc.jsx` — sommaire auto (rail desktop ≥1240px + inline mobile + scrollspy), lit les `.content-h2`, monté 1× dans `ContentLayout`. Garde : `/guides/` + ≥3 sections.
- `components/content/PullQuote.jsx` — exergue serif filet vert, `<strong>` rendu vert.
- CSS : tout dans `styles/simulator.css` (`.content-h2/h3`, `.content-pullquote`, `.content-box--*`, `.article-toc-*`). Cf [[reference_article_design_system]].
- Dimension Umami **`placement`** sur `awin-click` (block/guide/sim/inline).

---

## C. ÉTAT TRACKING (22/07, GSC jusqu'au ~13/07)
- **GSC** 7 j : 51 clics / 1985 imp / pos 8,4 (rebond estival effacé). **28 j : 187 clics** (record, 105→128→160→187).
- **Umami** 7 j : 206 visiteurs (+15 %), durée **1m09** (↑), rebond 80 %.
- **GEO** 🟢 : 4 IA référentes (Gemini, ChatGPT, Perplexity, Copilot) + Brave/Qwant/Ecosia…
- **Awin** 30 j : **10 clics** (Aosom 7, Woodstore 2, **Carplug 1** nouveau), **0 €**.
- **Funnel artisan : 0 lead.**
- Scripts : `scripts/{gsc,bing,umami,awin}-stats.js`. Cf [[stack_monitoring_seo]].

---

## D. VÉRITÉ MONÉTISATION (discutée en fin de session)
**L'affiliation n'a rien à « attendre » — c'est un plafond de VOLUME, pas un réglage.** ~10-15 clics/mois × conv. 1-3 % ≈ 0,2 vente/mois → 0 € statistiquement normal. Il faudrait **300-1000 clics/mois** (20-60×) pour une vente régulière. Tracking OK, blocs déjà optimisés → le goulot est le **trafic** (~900 visites/mois). Décision stratégique EN ATTENTE (question posée à l'user, pas répondue) : **creuser le funnel artisan (UX-1)** vs **pousser le trafic**. Le lead pro > toutes les commissions affiliées (cf pivot 21/05, [[project_strategie_monetisation]]).

---

## E. BACKLOG / PROCHAINES ACTIONS
1. **GSC Request Indexing** (URLs www) : `pergola-panneaux-solaires-diy-2026` (Explorée-non-indexée → creuser si dupli/mince), `/sources`, `/charte-affiliation` (inconnues de Google). Reste : 22/23 guides indexés.
2. **Re-mesurer l'effet design** à J+7/14 (rebond/durée) — refonte en prod depuis le 22/07 seulement.
3. **Ventiler `awin-click` par `placement`** quand le volume monte (là 3/sem = trop peu).
4. **GartenHaus `30075`** (pending Awin) → débloquer le bloc cabanon (meilleur fit/panier).
5. **Semer plus d'encadrés/exergues** si voulu (tous les guides articles en ont ≥1 ; on peut densifier).
6. **P0 simulateurs JAMAIS FAIT** (backlog handoff 01/07) : T-1 terrasse 14 vs 16 lambourdes (`DeckSimulator.jsx:191`), C-1 clôture défaut 3,5 m hors bornes (`useDeckSimulatorState.js:21` → câbler `PROJECT_DEFAULTS`).

---

## Reprendre
Dire : « Lis `.claude/SESSION-HANDOFF-2026-07-22.md` ». Puis au choix : « creuse le funnel artisan » · « pousse le trafic (contenu) » · « corrige le lot P0 simulateurs » · « check tracking ».

*Généré le 22 juillet 2026. 9 commits, HEAD `0906edc`, tout poussé. Modèle : Opus 4.8.*
