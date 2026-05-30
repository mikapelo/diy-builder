# Session Handoff — 30 mai 2026

> Document de transition. Lire d'abord, puis `CLAUDE.md` + mémoire
> `~/.claude/projects/-Users-pelo-Downloads-diy-builder-scraper3/memory/MEMORY.md`
> + `.claude/SESSIONS.md` + `.claude/skills-mapping.md`.
> Session précédente : `.claude/SESSION-HANDOFF-2026-05-28.md`.

---

## ⏱️ Statut court

**13 commits livrés en une journée, tous poussés sur `main`. Vercel auto-déployé.**
Working tree très bruyant (suppressions massives `scripts/reels/*` + untracked _inbox/_finals vidéos + handoffs anciens en untracked) — pas touché, hors scope.

### Commits livrés cette session (2026-05-29 → 2026-05-30)

```
12c90b0  feat(guides): blocs outils Amazon dans 4 guides piliers (action A audit)
0147ee9  feat(guides/dalle): calculateur branché au scraper + comparatif enseignes
2983f27  fix(guides/dalle): clarifie l'affichage Castorama (offre incomplète)
4e55fea  feat(guides/dalle): bloc outils Amazon (4 ASIN photos vérifiées)
611a641  fix(seo): /bardage 308 permanent (GSC erreurs de redirection)
087cb2f  docs(sessions): refonte SESSIONS.md post-pivot lead + 4 rôles émergents
e44ead8  fix(ui): harmonisation discours public (P0 contre-analyse ChatGPT)
804891c  feat(simulator): consentement RGPD + remontée bloc pivot (P1)
a16cdac  docs(theme-g-v2): aligne légende compteur tunnel post-remontée pivot
79994ab  docs(skills-mapping): inventaire skills + plugins pour DIY Builder
a697dc2  docs(briefs): brief de rédaction article #7 carport solaire bois VE
d9557e1  docs(audits): audit cluster éditorial mots-clés + rédaction (11 articles)
5c59757  feat(guides): quick wins audit cluster (Q1-Q5) — disclosure + fact-check + maillage
```

---

## 🌐 Prod

- https://www.diy-builder.fr (HTTP 200, vérifié sur les pages modifiées)
- Vercel auto-deploy sur push main
- Dev local : `cd frontend && npm run dev` (autoPort)
- Preview MCP : `preview_start("frontend")` — port 3000
- ⚠️ Bug Preview MCP screenshot blanc sur pages longues (>50 000 px) → utiliser `preview_eval` DOM
- ⚠️ Cache `.next` fragile : pas de `npm run build` pendant `npm run dev`

---

## ✅ Ce qui a été fait cette session

### 1. Action A audit Amazon — blocs outils dans 4 guides piliers (commit 12c90b0)
Composant `frontend/components/content/GuideToolsBlock.jsx` (4 outils gamme polyvalente, sub-tag `[module]-guide`, lien charte affiliation). Inséré dans `/guides/{terrasse,cabanon,pergola,cloture}` avant l'aside content-related. CSS `.guide-tools*` dans `simulator.css`.

### 2. Calculateur dalle branché scraper + comparatif enseignes (commit 0147ee9)
Calculateur de la page `/guides/dalle` lit désormais `materialPrices.js` via `getUnitPrice()` sur les IDs scrapés (`beton_c20_25`, `treillis_st25c`, `gravier_0_31_5`) — donc rafraîchis chaque lundi par cron GitHub. Panneau treillis corrigé 1,8×1,8 → **3×2,4 m = 7,2 m²**. Coût unique → tableau comparatif LM/Casto/BD avec total par enseigne + chip "Moins cher". Date `PRICES_DATE` affichée.

**Fix latent** : `<style jsx>` → `<style jsx global>` dans la page (les styles ne scopaient pas le composant enfant `DalleCalculateur`).

### 3. Clarification affichage Castorama (commit 2983f27)
Casto ne référence ni `beton_c20_25` ni `gravier_0_31_5` (vrais "trous" commerciaux, validés par scrape : faux positifs dalles préfabriquées + 0 produit gravier). Badge "Offre incomplète" sur le header + "non vendu" italique avec tooltip + total "n.d." au lieu de "70 €*" trompeur.

### 4. Bloc outils Amazon dalle — 4 ASIN avec photos /P/ vérifiées (commit 4e55fea)
- Niveau Stabila Type 80 AS (B07H1RQQ9Y) — réutilisé catalogue
- Cordeau Tajima CR301JF (B00FXR1QKS) — réutilisé catalogue
- Truelle Bahco 2301B0000 Catalan 165 (B00TT4NU0K) — nouveau
- Taloche Vinmer 010013 35×27 (B00U63D0DU) — nouveau

Bétonnière + règle alu écartées : aucun ASIN avec photo `/P/` fiable (marques génériques indexées sur `/I/` uniquement). Évoquées en note hors-lien sous le bloc.

### 5. Fix SEO `/bardage` 308 permanent (commit 611a641)
GSC Coverage 2026-05-29 : 12 URLs flag « Erreur de redirections ». `/bardage` faisait `redirect('/')` côté Next.js (= 307 temporaire) + `robots Disallow /bardage` → pire des mondes (Google ne pouvait pas re-crawler pour voir le noindex). Passé en **308 permanent via `next.config.js`** + page supprimée + retiré du `Disallow`. Google va dé-indexer.

### 6. Refonte `SESSIONS.md` post-pivot lead (commit 087cb2f)
Document datait du 17/04. Ajouts :
- Section 0 « Contexte projet (mai 2026) » : pivot lead 21/05, modules actifs/retirés, affiliation, pipeline, monitoring, skills externalisés
- Versions modèles : Opus 4.7 → **4.8** (4.8 [1m] pour `architect`)
- **4 rôles émergents** (Tier 2 Sonnet) : `seo-monitoring`, `editorial-fr`, `affiliation-ops`
- **1 rôle Tier 3** : `scraper-ops` (Haiku)
- Règle anti-gaspillage #1 : exception 1M context (Lead Opus peut faire ≤30 lignes/3 fichiers en édit direct)
- Exemples de routage actualisés (audit GSC, article SEO fact-check, bloc Amazon, dalle, etc.)

### 7. Harmonisation discours public (commit e44ead8) — P0 contre-analyse externe ChatGPT
9 fichiers, 5 incohérences corrigées :
- Libellés clôture (DeckControls.jsx) : « Largeur et profondeur de la terrasse » → « Longueur et hauteur de la clôture » + LiveSummary m² → ml
- ModuleHeader.jsx 6× « temps réel » → « calcul instantané »
- HomeSeoBand.jsx : « 100 % financé par affiliation » → version honnête (Amazon seul actif)
- HeroSection.jsx : « 3 grandes enseignes » → « 4 enseignes »
- methodologie + a-propos : « mensuelle » → « hebdomadaire » (cron lundi 6h UTC)
- 3 guides : « prix en temps réel » → « rafraîchis chaque lundi »
- À propos : « Pas de réseau d'artisans » reformulé pour refléter le pivot lead avec consentement explicite

### 8. Consentement RGPD + remontée bloc pivot (commit 804891c) — P1 contre-analyse
Via dispatch SESSIONS.md Mode B : `ui-components` Sonnet + relecture `review-qa` Opus (SAFE TO COMMIT).
- Bloc RGPD `.pa-pivot-rgpd` dans `ProjectActions.jsx` carte pro (transmission conditionnelle + droit suppression + liens politique-conf + contact)
- ProjectActions remonté de position 4/7 à position 2/7 dans TunnelSections (juste après ProjectSummary)
- JSDoc actualisé, useScrollTunnel inchangé (observation pure agnostique à l'ordre)

### 9. Alignement légende compteur tunnel (commit a16cdac)
Suite review-qa M1 : `theme-g-v2.css:469` commentaire mapping A=summary, B=actions, C=materials, D=budget, E=temps, F=outils, G=guide (post-remontée).

### 10. Création `.claude/skills-mapping.md` (commit 79994ab)
Adapté du fichier source `/Users/pelo/projets/chargeur VE/docs/skills-mapping.md` (84 lignes) au contexte DIY Builder (138 lignes). Tableau 17 phases × statut ✅/❌/🟡 + skills réellement invoqués + plugins installés + connecteurs MCP optionnels + décisions « à la main ».

### 11. Brief de rédaction article #7 — carport solaire bois VE (commit a697dc2)
**Précédé** par passe `/mots-clés` (skill `aaron-seo-geo:discover` + 7 WebSearch SERP) qui a classé 7 candidats. Top 1 retenu : carport solaire bois VE (synergie Otovo + recyclage matière #6 + gap SERP énorme).
Puis passe `/rédaction` (skill `anthropic-skills:editorial-seo-fr` + 4 références chargées : types-de-page, eeat-ymyl-checklist, anti-ia-checklist, info-gain). **Brief 434 lignes** dans `.claude/briefs/carport-solaire-bois-recharger-voiture-electrique-2026.md` :
12 sections (A→L) — métadonnées, architecture 8 H2, fact-check 14 chiffres avec sources, 6 tableaux, maillage 6 liens, ASIN, schema JSON-LD, hero prompt, CTA Lead specs, anti-cannibalisation vs #6, watch-out fact-check, calendrier publi 8-10 h.

### 12. Audit cluster éditorial mots-clés + rédaction (commit d9557e1)
**Audit double phase** sur les 11 articles publiés (5 piliers + 6 satellites, 7 064 lignes JSX) via dispatch parallèle 2 sub-agents Sonnet selon SESSIONS.md :
- `/mots-clés` : `aaron-seo-geo:keyword-research/serp-analysis/content-gap-analysis` + `claude-blog:blog-cannibalization` + 7 WebSearch SERP
- `/rédaction` : `editorial-seo-fr` (audit-de-page/70 + E-E-A-T/40 + anti-IA scoré + info-gain) + `claude-blog:blog-analyze/factcheck/audit` + `aaron-seo-geo:audit/on-page/content-quality`

Sortie dans `.claude/audits/2026-05-30-cluster-editorial-mots-cles-redaction.md` (207 lignes). Score combiné **7,15/10**.

### 13. Quick wins audit Q1-Q5 (commit 5c59757)
Dispatch Mode B parallèle : `docs-scribe` Haiku + `ui-components` Sonnet, 8 fichiers, +83/-34 lignes.
- Q1 : disclosure affiliation × 5 piliers + classe CSS `.content-affiliate-disclo`
- Q2 : correction « douglas classe 3-4 » → « classe 3 » (norme EN 350-2)
- Q3 : « 60 % des litiges » → « la majorité » (chiffre non sourçable)
- Q4 : réduction H2 réglementation pilier cabanon (-30 l) + CTA satellite permis-cabanon
- Q5 : blocs « Approfondir » dans piliers terrasse + pergola (maillage)

**Score cluster post-Q : ~8,3/10 estimé.**

---

## 📊 Audit GSC du 29/05 — bilan

**Coverage 29/05 :** 35 non-indexées, 19 dans l'index (vs 3 fin avril). Impressions GSC 0 → 63/j. Décollage confirmé.

Ventilation des 35 non-indexées (interprétation après lecture des drilldowns CSV) :
- 15 « détectée, non indexée » → file d'attente Google, normal
- 9 « erreur liée à des redirections » → **9 URLs apex sans www** (`https://diy-builder.fr/...`) qui redirigent en 308 vers `www.diy-builder.fr/...` + 5 sont des `/liste?...` avec noindex. **Validation Google en cours depuis le 17/05**. Pas d'action urgente.
- 5 « explorée, non indexée » → assets statiques (3 fonts woff2 + manifest.json + favicon.ico) — comportement attendu, ignore
- 3 « page avec redirection » → 3 variantes home (apex, HTTP, HTTP+apex). Cosmétique.
- 3 « exclue par noindex » → 4 pages légales noindexées intentionnellement le 18/05.
- 1 résolue : `/bardage` (commit 611a641 du 29/05 → fix en cours d'application par Google).

---

## 📈 État monitoring (au 29/05 fin de session précédente)

**GSC 7j (22-28/05) :** 16 clics · 395 imp · CTR 4,05 % · pos 8,5
**Bing 7j :** 2 clics · 58 imp (+21 % vs handoff 28/05)
**Umami 7j :** **183 PV (+120 %), 49 visiteurs (+75 %), temps/visite +48 %, bounce 76 % → 70 %**. Hero images impactent l'engagement.
**Top driver :** /pergola (6 clics, 62 imp, pos 9,2)
**GEO :** 4 PV via chatgpt.com (+2 depuis handoff 28/05) — signal continu

---

## 🎯 Chantiers ouverts pour la prochaine session

### Actions « moyennes » de l'audit cluster (non encore exécutées)

| # | Action | Effort | ROI |
|---|---|---|---|
| M1 | Réduire la partie structure bois générique dans `/guides/pergola-panneaux-solaires-diy-2026` (anti-cannibalisation pergola pilier) — renvoyer vers pilier | 1-2 h | Fort |
| M2 | 3 corrections E-E-A-T `/guides/pergola` (seul article < 32/40 à 30/40) : déplacer obs « vent 90 km/h » en proéminence + citer R421-17 + ajouter mesure terrain chiffrée | 1-2 h | Moyen (30 → 33+) |
| M3 | Ajouter URLs cliquables CRE + Légifrance + Enedis dans corps de `/guides/pergola-panneaux-solaires-diy-2026` | 30 min | Fort (YMYL fiscal) |
| M4 | Ajouter URLs Travaux.com + Prix-pose.com dans `/guides/soi-meme-ou-pro` | 15 min | Moyen |

### Actions stratégiques

| # | Action | Effort | ROI |
|---|---|---|---|
| S1 | Créer 1 satellite clôture (gap G2 « ancrage poteau clôture béton ») — clôture sous-représentée, 0 satellite | 4-6 h rédaction | Fort (équilibre cluster) |
| S2 | Reformuler le brief #8 hauteur-clôture pour angle « jurisprudence + servitude + PLU concret » | 30 min revue | Moyen |
| S3 | Surveiller pattern « topic-sentence systématique » sur nouveaux articles (audit 2 passes obligatoire) | par article | Moyen |

### Pipeline éditorial — ordre suggéré post-audit

1. **carport-solaire-bois-recharger-voiture-electrique-2026** (brief 434 l. prêt dans `.claude/briefs/`)
2. Satellite clôture (gap G2 ancrage poteau béton)
3. #8 hauteur-cloture-loi-2026 (reformulé : jurisprudence + servitude + PLU concret)
4. #7 pergola-adossee-vs-autoportee
5. #9 cout-artisan-cabanon
6. #10 isoler-cabanon-atelier (saison auto-hiver)

### Affiliation — démarches en cours

- **Sunology** : compte créé UpPromote NON ACTIVÉ. Relance prévue **30/05** : mail à `marketing@sunology.eu`. Si activé → câbler `<AffiliateLink>` dans pergola-solaire (§ 4) + mettre à jour `/charte-affiliation`.
- **Otovo** : formulaire partenaire soumis (CPS 940 €/install). Retour attendu **10-20 juin**. Préparer dashboard GSC + Umami pour visio de qualification. Si refus → Effiliation/Effy en plan B.

### Re-audit GSC + Umami à J+5-7 (vers 03-05/06)

Mesurer effet :
- Harmonisation discours (commit e44ead8)
- Remontée bloc pivot (commit 804891c)
- Quick wins Q1-Q5 (commit 5c59757)
- Validation Google des 9 « erreurs de redirection » (lancée 17/05)

Commandes habituelles :
```bash
node scripts/gsc-stats.js performance 7d
node scripts/gsc-stats.js pages 7d
node scripts/gsc-stats.js queries 7d
node scripts/bing-stats.js performance 7d
# Umami via curl direct (clés dans frontend/.env.local)
```

### Monitoring GEO

Au 29/05 : ChatGPT cite `/guides/cabanon` (24/05), `/guides/dalle` (25/05) — 4 PV/7j cumulés via referrer chatgpt.com. Rien sur Perplexity/Claude.ai/Gemini. Premier signal GEO réel à entretenir.

---

## ⚠️ Pièges et notes (rappel + nouveaux)

### Exigences utilisateur fortes (à respecter scrupuleusement)
- **FACT-CHECK obligatoire avant toute publication** — chaque chiffre vérifié sur source officielle, JAMAIS inventé
- **Pas d'anglicismes** dans contenu FR visible (DIY Builder exception)
- **Anti-IA strict** dans textes (pas de phrases-gabarit, chiffres précis, avis tranchés, limites honnêtes)

### Affiliation — logique validée
- Marchands avec site `.fr/.eu` localisé + stock UE + SAV FR + normes CE/NF
- Awin/Affilae refusés (pas re-proposer)
- Amazon = seul actif aujourd'hui, faible volume (~3 % du revenu cible)
- Lead Otovo (CPS 940 €) = priorité business

### Technique
- **Fichiers protégés** : `lib/deckEngine.js`, `deckConstants.js`, `deckGeometry.js`, `foundation/foundationCalculator.js` — NE JAMAIS modifier
- **Push direct main** = workflow normal projet solo, Vercel auto-deploy
- **Cache `.next` fragile** : pas de `npm run build` pendant `npm run dev`
- **ESLint strict** : `&apos;` en JSX, ESLint ne parse pas le CSS (erreur attendue sur simulator.css à ignorer)
- **Preview screenshot bug** sur pages longues → utiliser `preview_eval` DOM
- **CSV Amazon** : "Tracking ID Report" groupe tout en "others". Pour ventiler par module → "Sub-Tag Report" sur partenaires.amazon.fr
- **Working tree pollué** au 30/05 : suppressions massives `scripts/reels/*` + nombreux untracked (_inbox/_finals vidéos, worktrees, anciens handoffs). Pas dans le scope éditorial — ne pas committer en bloc, toujours `git add` ciblé.

### Anti-IA / cluster
- Pattern « topic-sentence systématique » détecté dans 7/11 articles. Score faible mais à surveiller à grande échelle. Passe 2 anti-IA obligatoire sur les nouveaux articles.
- Vocabulaire niveau 1 : zéro détecté sur corpus (« plongeons dans », « il convient de noter »…) — discipline éditoriale solide.

### Routage skills (SESSIONS.md + skills-mapping.md)
- Édit direct si Lead Opus 1M ET ≤30 lignes ET ≤3 fichiers déjà en contexte
- Sinon dispatch Mode B (Agent ponctuel) — voir `.claude/SESSIONS.md` §7 exemples
- review-qa Opus en fin de tout chantier non-trivial
- `editorial-seo-fr` préféré pour rédaction (charge 4 références : types-de-page, eeat-ymyl, anti-ia, info-gain)

---

## 🗂️ Fichiers clés touchés cette session

### Code modifié
```
frontend/components/content/GuideToolsBlock.jsx   (créé — bloc outils guides)
frontend/components/simulator/ProjectActions.jsx  (+ RGPD)
frontend/components/simulator/TunnelSections.jsx  (remontée bloc)
frontend/components/simulator/DeckControls.jsx    (libellés clôture)
frontend/components/ui/ModuleHeader.jsx           (— temps réel)
frontend/components/landing/HomeSeoBand.jsx       (financement affiliation)
frontend/components/features/shared/HeroSection.jsx  (3→4 enseignes)
frontend/app/guides/dalle/page.jsx                (calculateur + ASIN + clarification Casto)
frontend/app/guides/{terrasse,cabanon,pergola,cloture,dalle}/page.jsx  (blocs Amazon + disclosure)
frontend/app/guides/cabanon/page.jsx              (+ Q4 réduction H2 régl.)
frontend/app/guides/{terrasse,pergola}/page.jsx   (+ Q5 blocs Approfondir)
frontend/app/guides/comparer-devis-travaux/page.jsx  (Q3 reformulation)
frontend/app/guides/prix-terrasse-bois-m2-2026/page.jsx  (Q2 douglas classe 3)
frontend/app/methodologie/page.jsx                (hebdomadaire)
frontend/app/a-propos/page.jsx                    (hebdomadaire + mise en relation)
frontend/app/bardage/                             (SUPPRIMÉ)
frontend/app/robots.js                            (retrait /bardage du Disallow)
frontend/next.config.js                           (+ redirect /bardage 308 permanent)
frontend/styles/simulator.css                     (+ classes guide-tools, dalle-price-table, pa-pivot-rgpd, content-affiliate-disclo)
frontend/styles/theme-g-v2.css                    (commentaire compteur)
```

### Documentation
```
.claude/SESSIONS.md                                (refonte post-pivot)
.claude/skills-mapping.md                          (nouveau, 138 l.)
.claude/briefs/carport-solaire-bois-recharger-voiture-electrique-2026.md  (nouveau, 434 l.)
.claude/audits/2026-05-30-cluster-editorial-mots-cles-redaction.md  (nouveau, 207 l.)
.claude/SESSION-HANDOFF-2026-05-30.md              (ce document)
```

### Mémoire à mettre à jour (si pas déjà fait)
```
~/.claude/projects/-Users-pelo-Downloads-diy-builder-scraper3/memory/MEMORY.md
  → Remplacer la ligne « Handoff session 2026-05-28 » par référence vers 2026-05-30
~/.claude/projects/-Users-pelo-Downloads-diy-builder-scraper3/memory/project_amazon_monetisation.md
  → Note : action A bouclée pour 5 piliers (4 + dalle 30/05)
```

---

## 🚀 Reprendre dans la nouvelle session

Dire : « Lis `.claude/SESSION-HANDOFF-2026-05-30.md` ».

Puis selon le besoin :
- « actions moyennes audit » → enchaîner M1-M4 (~3-4 h) en dispatch Mode B
- « article carport solaire » → lancer la rédaction à partir du brief (skill `editorial-seo-fr` ou Agent `editorial-fr` Sonnet)
- « satellite clôture » → S1 (rédaction satellite ancrage poteau béton)
- « sunology activé » → câbler `<AffiliateLink>` dans pergola-solaire
- « otovo » → préparer la qualification (dashboard GSC + Umami)
- « audit gsc » → re-mesurer (effet harmonisation + quick wins)
- « article #8 hauteur clôture » → reformuler brief avec angle jurisprudence + servitude + PLU

Session enregistrée coordinator sous le nom **`DIYB`** (focus : SEO monitoring, pipeline éditorial, CRO, fact-check, orchestration multi-agents).

---

*Généré le 30 mai 2026 après push du commit 5c59757. 13 commits livrés en une journée, tout en prod, Vercel auto-déployé. Modèle Lead : Opus 4.7 [1m] (upgrade depuis Sonnet 4.6 pour les audits transverses cf. SESSIONS.md). Dispatch effectif Mode B sur 5 chantiers : ui-components × 2, docs-scribe × 1, review-qa × 1, seo-monitoring × 1, editorial-fr × 1.*
