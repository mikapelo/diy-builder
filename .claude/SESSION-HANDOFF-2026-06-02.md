# Session Handoff — 2 juin 2026

> Document de transition. Lire d'abord, puis `CLAUDE.md` + mémoire
> `~/.claude/projects/-Users-pelo-Downloads-diy-builder-scraper3/memory/MEMORY.md`
> + `.claude/SESSIONS.md` + `.claude/skills-mapping.md`.
> Session précédente : `.claude/SESSION-HANDOFF-2026-05-30.md` (référence
> pour Q1-Q5 + M1-M4 + pivot lead).

---

## ⏱️ Statut court

**11 commits livrés en 2 jours (01-02 juin), tous poussés sur `main`. Vercel auto-déployé.**

Working tree toujours bruyant (suppressions massives `scripts/reels/*` + untracked
_inbox/_finals vidéos + worktrees anciens) — pas touché, hors scope.

### Commits livrés cette session (2026-06-01 → 2026-06-02)

```
c758762  feat(guides): actions moyennes audit cluster (M1-M4) — anti-cannibalisation + sourcing YMYL
7d95798  feat(admin+analytics): clarification sémantique dashboard PDF + trackers funnel artisan
81b5382  feat(mailing): infra Resend Broadcasts + 4 templates séquence J+0/3/10/30
b66c936  fix(seo): /liste 308 permanent vers le simulateur — résout 9 URLs GSC en erreur de redirection
7d4236e  docs(mailing): réécriture templates J+3/J+10/J+30 avec skills marketing-skills:emails + editorial-seo-fr
85f56ec  fix(seo): snippets title+description sur 2 pages alertées par audit GSC 01/06
ce49484  docs(outreach): pack démarchage plateformes lead Tier 1 — 3 emails + fiche éditeur
b63f196  docs(setup): démarche complète brancher Claude à GSC + Bing Webmaster (autonome multi-session)
e02a063  docs(setup): Partie 8 — activer le skill claude-blog:blog-google + état réel DIY Builder
61b0c0d  feat(seo): câblage IndexNow Bing + tracking gsc-stats.js
28ba410  docs(setup): Partie 9 — IndexNow Bing setup + état opérationnel DIY Builder
```

---

## 🌐 Prod

- https://www.diy-builder.fr (HTTP 200, Vercel auto-deploy sur push main)
- Dev local : `cd frontend && npm run dev` (autoPort)
- Preview MCP : `preview_start("frontend")` — port 3000
- ⚠️ Cache `.next` fragile : pas de `npm run build` pendant `npm run dev`
- ⚠️ Preview MCP screenshot blanc sur pages longues → utiliser `preview_eval` DOM

---

## ✅ Ce qui a été fait

### 1. Actions moyennes audit cluster M1-M4 (commit c758762, 01/06 matin)

Suite audit cluster éditorial 2026-05-30 :
- **M1** — Allègement §2 « Structure » pergola-solaire (anti-cannibalisation pilier)
- **M2** — 3 corrections E-E-A-T pergola pilier (obs vent 90 km/h en proéminence,
  citation R421-9, mesure terrain flèche 18 mm = 35 % au-delà L/300)
- **M3** — 5 sources cliquables YMYL dans pergola-solaire (Légifrance art. 278-0 bis
  CGI, arrêté 8 sept 2025, Enedis, CRE, photovoltaique.info)
- **M4** — 2 sources cliquables Travaux.com + Prix-pose.com dans soi-même-ou-pro

Score cluster estimé post-Q+M : **~8,5/10** (vs 7,15 audit initial 30/05).

### 2. Rename dashboard /admin/leads + trackers Umami funnel artisan (commit 7d95798)

**Clarification sémantique** : "Téléchargements PDF" partout au lieu de "Leads"
(opt-in PDF freemium ≠ vrais leads pro vendables). Sujet email `[Lead]` → `[PDF]`.
Encart explicatif dans le dashboard distinguant les 2 flux.

**Trackers Umami** sur le funnel artisan (0 conversion en 30 jours diagnostiquée) :
- `artisan-modal-open` : modal ArtisanLeadModal ouvert
- `artisan-modal-abandon` : modal fermé sans submit succès (stage = idle/submitting/error)

Diagnostic attendu à J+7 (re-mesure ~09/06) pour savoir où le funnel bloque.

### 3. Infra Resend Broadcasts + audience (commit 81b5382)

Branchement audience Resend dans `/api/leads/route.js` (non bloquant, skip si env
absent). Création de l'audience « DIY Builder — PDF downloaders » via API :
- **Audience ID** : `7b077120-9cf5-497d-9fea-bd9f0938156c`
- **Env var Vercel** : `RESEND_AUDIENCE_ID` (Production + Preview)
- **2 contacts historiques importés** : `benjaminbacar@gmail.com` + `anais.djourovitch@gmail.com`
  (anais retirée manuellement par l'utilisateur le 01/06 après vérification)

4 templates dans `.claude/mailing/` (réécrits skill emails + editorial-seo-fr) :
- J+0 transactionnel (référence, déjà automatisé)
- J+3 follow-up « Votre projet avance ? »
- J+10 débloquage « 3 erreurs qui font fléchir vos longerons »
- J+30 newsletter / opt-out « On continue, ou on s'arrête là ? »

Seuils d'activation : 0-20 contacts = attente, 20-50 = premier broadcast, 50-100 =
séquence régulière, 100+ = outil dédié (Brevo, ConvertKit, Beehiiv).

### 4. Fix GSC 9 URLs erreur redirection (commit b66c936)

GSC validation 17/05 → ÉCHEC 30/05 sur 9 URLs (5 `/liste?...` + 4 `/[module]` apex).
Diagnostic : `/liste` SSR avait simultanément `noindex` + `canonical self` + chaîne
redirection apex→www = signaux contradictoires.

Fix : route `/liste` réduite à un `permanentRedirect()` conditionnel vers le
simulateur correspondant. CopyButton.jsx supprimé (orphelin). lib/listeBOM.js
conservé (réutilisable).

Vérifié en live : 9/9 redirections retournent 308 propre. Reste à relancer la
validation GSC manuellement côté UI (action utilisateur).

### 5. Fix snippets GSC 2 pages sous-performantes (commit 85f56ec)

- `/guides/prix-terrasse-bois-m2-2026` : 165 imp, 0 clic, pos 6,4 (CTR attendu 4-6 %)
  → Title : « comparatif détaillé » → « 80 à 290 €/m² par essence » (chiffre concret)
- `/guides/comparer-devis-travaux` : 67 imp, 1 clic, CTR 1,5 %, pos 7,8
  → Title : « la méthode complète » → « 8 vérifications obligatoires (2026) »

Re-mesure GSC à J+7 (vers 08-09/06) pour valider l'effet.

### 6. Pack démarchage plateformes lead Tier 1 (commit ce49484)

Stratégie stratifiée Tier 1/2/3 documentée dans `.claude/outreach/`. Tier 1 prêt à
envoyer cette semaine du 02/06 (mode discovery, pas vente) :

| # | Cible | Email préparé | Spécificité |
|---|---|---|---|
| 1 | LeadValue | `email-leadvalue.md` | Programme éditeur explicite, accueille démarrage |
| 2 | Alexeo | `email-alexeo.md` | Spécialisé pergola = top driver Umami |
| 3 | Habitatpresto | `email-habitatpresto.md` | Email partenariat ouvert, leader |

+ Fiche éditeur 1-pager (`diy-builder-editeur-fiche.md`) à joindre en PDF.

### 7. Doc setup GSC + Bing + blog-google + IndexNow (commits b63f196, e02a063, 28ba410)

**Document de référence autonome** `.claude/setup/gsc-bing-setup.md` (700+ lignes) :
- Partie 1-2 : GSC + Bing Webmaster scripts Node
- Partie 7 : Alternative MCP future
- **Partie 8** : Skill `claude-blog:blog-google` (Tier 0 activé : YouTube OK,
  PSI bug skill, CrUX trafic insuffisant, NLP billing requis)
- **Partie 9** : IndexNow Bing (nouveau, voir #8)

### 8. Câblage IndexNow Bing (commit 61b0c0d)

Pour accélérer la re-crawl Bing post-fix `/liste` :
- Clé `8dd4d9d4ed4f018c0361801d741b4198` générée + servie publiquement
- Script `scripts/indexnow-submit.js` (Node natif, 3 modes : URLs / --sitemap / --test)
- **23 URLs sitemap soumises avec succès HTTP 200** le 02/06 14h10
- Re-crawl Bing/Yandex/Seznam/Naver imminent (heures à jours)

Note : `gsc-stats.js` aussi ajouté au tracker (était inexplicablement untracked
depuis le 25/05).

### 9. Activation skill claude-blog:blog-google Tier 0 (commit e02a063)

- 5 APIs activées sur projet GCP `diy-builder-gsc` : pagespeedonline, chromeuxreport,
  kgsearch, youtube, apikeys
- API key restreinte créée : `claude-blog-google-tier0`
- Config en place : `~/.config/claude-seo/google-api.json` (chmod 600)
- **Tests réels** :
  - ✅ YouTube search : 3 vidéos pergola retournées avec metadata complète
  - ❌ PageSpeed Insights : bug skill `KeyError audit_details:285`. Workaround = UI Google directe
  - ❌ CrUX : pas assez de trafic Chrome (~210 visiteurs/mois Umami vs seuil 5000/28j)
  - ⏭ NLP : billing GCP requis (carte bancaire), non activé

---

## 📊 Snapshot data finale (02/06 14h15)

### GSC 7j (26/05 → 01/06)

| Métrique | Valeur | vs J-1 (01/06) |
|---|---|---|
| Clics | 18 | -14 % (vs 21) |
| Impressions | 722 | +12 % (vs 645) |
| CTR moyen | 2,49 % | -0,77 pt |
| Position | 8,8 | stable (vs 8,9) |

**Constat** : expansion d'indexation Google (+12 % imp) sur des pages encore
mal classées → dilution CTR. Position stable. Pattern de croissance attendu.

### GSC top pages 7j

| Page | Clics | Imp | CTR | Pos |
|---|---|---|---|---|
| /guides/cabanon | 4 | 54 | 7,4 % | 6,9 |
| /pergola | 4 | 49 | 8,2 % | 10,7 |
| /guides/terrasse-piscine-bois | 3 | 71 | 4,2 % | 7,5 |
| /guides/pergola | 2 | 49 | 4,1 % | 9,2 |
| /guides/pergola-panneaux-solaires-diy-2026 | 2 | 36 | 5,6 % | 9,4 |
| /guides/comparer-devis-travaux | 1 | **94** | **1,1 %** | 8,4 |
| /guides/prix-terrasse-bois-m2-2026 | 0 | imp pas dans le top, fix snippet de 01/06 trop récent | — | — |

### GSC top queries 7j

Aucune query > 0 clic dans le top 20 affiché — toutes les impressions viennent de
queries long-tail diluées. À surveiller dans 7 jours.

### Bing 7j

| Métrique | Valeur | vs J-1 |
|---|---|---|
| Clics | 3 | = |
| Impressions | 46 | -27 % (vs 63) |
| CTR moyen | 6,52 % | +1,76 pt |

IndexNow soumis aujourd'hui (23 URLs) → effet attendu sous 24-72 h.

### Umami 7j

**❌ Cloudflare 522** — infra Umami en panne (côté api.umami.is, pas chez nous).
Plusieurs tentatives sur 2 jours. À retenter dans la prochaine session.

### Audience Resend

- Audience `DIY Builder — PDF downloaders` : 1 contact actif (benjaminbacar@gmail.com)
- Anais retirée par l'utilisateur le 01/06
- Branchement auto en place : tout nouveau téléchargement PDF s'ajoute

---

## 🎯 Chantiers ouverts pour la prochaine session

### Actions à faire côté utilisateur (manuelles)

| # | Action | Quand | Effort |
|---|---|---|---|
| U1 | Relancer validation GSC sur les 9 URLs fixées (UI Search Console) | Maintenant | 2 min |
| U2 | Exporter fiche éditeur en PDF (Pages/Word/Pandoc) + envoyer 3 emails Tier 1 | Cette semaine | 30 min |
| U3 | Reporter dans MEMORY.md après chaque retour plateforme lead | Au fil de l'eau | 5 min/retour |

### Mesures à faire (re-audits programmés)

| # | Quand | Cible |
|---|---|---|
| M1 | 04-05/06 (J+3 post fix snippets) | Re-mesure GSC sur `/guides/prix-terrasse-bois-m2-2026` (0 → 5-10 clics attendus) et `/guides/comparer-devis-travaux` (1 → 3-4 clics) |
| M2 | 08-09/06 (J+7 post trackers Umami) | Diagnostic funnel artisan : `artisan-modal-open` vs `lead-submitted` |
| M3 | 09-12/06 (J+7-10 post fix /liste) | Vérif côté Bing Webmaster que les 9 URLs ne sont plus en erreur de redirection (effet IndexNow + crawl naturel) |
| M4 | 09-12/06 | Vérif côté GSC que la nouvelle validation a passé |

### Production éditoriale (pipeline)

| # | Article | État brief | Effort rédac |
|---|---|---|---|
| Ed1 | **#7 carport solaire bois VE** | ✅ brief 434 lignes prêt (a697dc2 du 30/05) | 4-6 h |
| Ed2 | **Satellite clôture S1** « ancrage poteau béton » (gap G2 audit cluster) | ❌ pas de brief | 1 h brief + 4-6 h rédac |
| Ed3 | #8 hauteur clôture (reformulé angle jurisprudence) | ❌ brief à reformuler | 30 min + 4 h |
| Ed4 | #9 coût artisan cabanon | ❌ | 30 min + 4 h |
| Ed5 | #10 isolation cabanon atelier (saison automne-hiver) | ❌ | 30 min + 4 h |

### Affiliation — démarches en cours

- **Sunology** : compte créé UpPromote NON ACTIVÉ. Relance 30/05 prévue mais
  retardée 2 jours. À envoyer cette semaine : mail `marketing@sunology.eu`.
  Si activé → câbler `<AffiliateLink>` dans pergola-solaire (§ 4).
- **Otovo** : formulaire partenaire soumis. Retour attendu 10-20 juin.
  Préparer dashboard GSC + Umami pour visio de qualification.

### Tâches techniques résiduelles (faibles ROI immédiat)

| # | Action | Effort |
|---|---|---|
| T1 | Cleanup working tree (suppressions `scripts/reels/*` + untracked vidéos/handoffs) | 30 min |
| T2 | Audit visuel carte Pro V1+V2 (réassurance, concrétude) — reporté post-activation Otovo | 1-2 h |
| T3 | Bug PageSpeed skill blog-google (`KeyError audit_details:285`) → reporter upstream ou patcher localement | 30 min |
| T4 | Hook Vercel post-deploy auto-soumission IndexNow des pages modifiées dans le commit | 1 h |

---

## ⚠️ Pièges et notes (rappel + nouveaux)

### Anciens (toujours valides)
- FACT-CHECK obligatoire avant publi — chaque chiffre sur source officielle, JAMAIS inventé
- Pas d'anglicismes dans contenu FR (sauf "DIY Builder" exception nom)
- Anti-IA strict (pas de phrases-gabarit type « plongeons dans », chiffres précis, voix tranchée)
- Fichiers protégés : `lib/deckEngine.js`, `deckConstants.js`, `deckGeometry.js`, `foundation/foundationCalculator.js`
- Push direct main = workflow projet solo, Vercel auto-deploy
- Cache `.next` fragile, pas de `npm run build` pendant `npm run dev`
- ESLint strict (`&apos;` en JSX)
- Awin/Affilae refusés (pas re-proposer)
- Plateformes affiliation marchand (Sunology, Otovo) ≠ plateformes vente lead
  (LeadValue, Alexeo, Habitatpresto, Quotatis, etc.)

### Nouveaux (cette session)
- **Umami Cloud en panne intermittente Cloudflare 522** : retenter dans 24h, c'est côté infra
- **CrUX exige ~5000 visites Chrome/28j** : DIY Builder loin du seuil (~210 visiteurs/mois)
- **Bug PageSpeed skill** `KeyError audit_details` dans pagespeed_check.py:285 — workaround pagespeed.web.dev en UI
- **IndexNow ≠ Google** : ne pas s'attendre à un effet GSC, seulement Bing/Yandex/Seznam/Naver
- **Resend Audiences ne supporte pas les custom fields complets** : pour segmenter par projet, créer N audiences distinctes ou outil dédié
- **`gcloud auth login` ≠ `gcloud auth application-default login`** : le premier pour les commandes admin (services, projects), le deuxième pour le code applicatif
- **API key Google peut être restreinte par API set** via gcloud — toujours le faire pour limiter l'exposition en cas de fuite
- **Clé IndexNow publique par design** (servi à `<host>/<key>.txt`) — c'est un identifiant, pas un vrai secret

### Routage skills (SESSIONS.md + skills-mapping.md)
- `marketing-skills:emails` excellent pour copywriting cold email/nurture
- `marketing-skills:cold-email` + `prospecting` pour outreach B2B
- `editorial-seo-fr` toujours préféré pour rédaction FR (anti-IA + E-E-A-T)
- `claude-blog:blog-google` Tier 0 utile pour YouTube research et NLP (si billing activé)
- Scripts custom GSC/Bing/IndexNow restent la voie active routine

---

## 🗂️ Fichiers clés touchés cette session

### Code modifié
```
frontend/app/admin/leads/page.jsx                       (rename + encart explicatif)
frontend/app/api/leads/route.js                         (sujet [PDF] + addToAudience Resend)
frontend/app/guides/comparer-devis-travaux/page.jsx     (snippet fix M4 + Q3)
frontend/app/guides/pergola/page.jsx                    (M2 E-E-A-T)
frontend/app/guides/pergola-panneaux-solaires-diy-2026/page.jsx  (M1 + M3 URLs YMYL)
frontend/app/guides/prix-terrasse-bois-m2-2026/page.jsx (snippet fix)
frontend/app/guides/soi-meme-ou-pro/page.jsx            (M4 URLs Travaux.com)
frontend/app/liste/page.jsx                             (permanentRedirect 308)
frontend/app/liste/CopyButton.jsx                       (SUPPRIMÉ)
frontend/components/simulator/ArtisanLeadModal.jsx      (handleClose + trackers)
frontend/hooks/useAnalytics.js                          (+2 events #9 #10)
frontend/__tests__/components/ArtisanLeadModal.test.jsx (mock étendu)
frontend/public/8dd4d9d4ed4f018c0361801d741b4198.txt    (créé — vérification IndexNow)
scripts/gsc-stats.js                                    (ajouté au tracker, était untracked)
scripts/indexnow-submit.js                              (créé — Node natif)
```

### Documentation
```
.claude/SESSIONS.md                                     (inchangé)
.claude/skills-mapping.md                               (inchangé)
.claude/mailing/                                        (créé : README + 4 templates)
.claude/outreach/                                       (créé : README + 3 emails + fiche éditeur)
.claude/setup/gsc-bing-setup.md                         (créé puis enrichi avec Parties 8 + 9)
.claude/SESSION-HANDOFF-2026-06-02.md                   (ce document)
```

### Variables d'env ajoutées
```
frontend/.env.local :
  RESEND_AUDIENCE_ID=7b077120-9cf5-497d-9fea-bd9f0938156c    (← prod aussi côté Vercel)
  INDEXNOW_KEY=8dd4d9d4ed4f018c0361801d741b4198             (local seulement, exposé via .txt)
```

---

## 🚀 Reprendre dans la nouvelle session

Dire : « Lis `.claude/SESSION-HANDOFF-2026-06-02.md` ».

Puis selon le besoin :
- « **article carport solaire** » → lancer la rédaction (brief 434 l. prêt dans `.claude/briefs/`)
- « **satellite clôture** » → S1 (rédaction satellite ancrage poteau béton)
- « **re-audit GSC** » → mesure à J+7-10 (08-09/06) post snippets + post /liste
- « **re-audit Umami funnel** » → mesure à J+7 (09/06) des trackers artisan
- « **sunology activé** » → câbler `<AffiliateLink>` dans pergola-solaire
- « **otovo qualification** » → préparer dashboard pour visio
- « **plateformes lead** » → vérifier les retours Tier 1 (LeadValue/Alexeo/Habitatpresto)
- « **cleanup working tree** » → traiter scripts/reels orphelins
- « **bug PageSpeed skill** » → patcher pagespeed_check.py:285 localement
- « **Umami fixée** » → retester l'API + intégrer aux scripts

Session enregistrée coordinator sous le nom **`DIYB`** (focus : SEO monitoring,
pipeline éditorial, funnel lead, démarchage plateformes, orchestration multi-agents).

---

*Généré le 2 juin 2026 après push du commit 28ba410. 11 commits livrés en 2 jours,
tout en prod, Vercel auto-déployé. Modèle Lead : Opus 4.7 [1m] (audit/setup
transverses). Audience Resend active (1 contact). IndexNow câblé (23 URLs poussées).
Skill blog-google activé Tier 0 (YouTube OK, PSI bug, CrUX volume insuffisant).
Funnel pro toujours 0 lead/30j — trackers en place, re-mesure J+7.*
