# Mapping des skills — projet DIY Builder

> État au 2026-05-29. Réconcilie les besoins du projet (cf. `CLAUDE.md` +
> `.claude/SESSIONS.md` + dernier handoff) avec ce qui est **réellement
> installé** dans l'environnement Claude Code, et note les substituts utilisés.
>
> Adapté du format `skills-mapping.md` du projet « chargeur VE ». DIY Builder
> a des phases différentes (simulateur 3D + calculs DTU + scraper + éditorial
> + funnel lead), donc le tableau n'est pas un copier-coller — c'est un
> mapping spécifique au stack et au pivot du 21/05.

## Tableau complet par phase

| Phase DIY Builder | Skill prévu / utile | Installé ici ? | Substitut / note |
|---|---|---|---|
| **Engine / calcul DTU** (modules/*/engine.js) | — (pas de skill métier) | — | Logique métier propriétaire, dispatchée aux sous-agents `engine-core` / `architect` (cf. SESSIONS.md tier 1). Pas de skill externe pertinent — les calculs DTU sont la valeur projet. |
| | `engineering:code-review` | ✅ | utilisé en relecture post-modif moteur |
| | `simplify` | ✅ | nettoyage après refactor |
| **Géométrie 3D / R3F** | — (skill 3D inexistant) | — | Sous-agent `geometry-3d` Opus. Pas de skill externe. |
| **UI / composants React** | `frontend-design` | ✅ | utilisé 28/05 (refonte stack éditorial `/guides`) |
| | `design:design-system` | ✅ | dispo (audit cohérence post-mai) |
| | `design:design-critique` | ✅ | dispo |
| | `design:accessibility-review` | ✅ | dispo (audit WCAG AA, jamais lancé sur DIY Builder à ce jour) |
| | `design:ux-copy` | ✅ | dispo (utile sur ProjectActions, CTA simulateurs) |
| **Éditorial FR (articles guides)** | `editorial-seo-fr` (anthropic-skills) | ✅ | **préféré** pour pipeline articles (fact-check + anti-IA + E-E-A-T) — cf. handoff 28/05 |
| | `affiliate-editorial-fr-playbook` | ✅ | méthodologie 9 phases, utilisée pour cluster guides |
| | `claude-blog:blog-write` / `blog-brief` / `blog-outline` | 🟡 | activable, redondant avec editorial-seo-fr en FR ; utile si bascule EN |
| | `claude-blog:blog-factcheck` | 🟡 | activable — utile pour audit pré-publi (fact-check est obligation projet) |
| | `aaron-seo-geo:seo-content-writer` | 🟡 | activable |
| | `marketing-skills:copywriting`, `copy-editing` | ✅ | dispo |
| **SEO technique** | `seo-audit` | ✅ | utilisable |
| | `aaron-seo-geo:tech` | ✅ | dispo (crawl, robots, sitemap, canonical, redirects) — couvre l'audit `/bardage` 308 et compagnie |
| | `aaron-seo-geo:audit` | ✅ | dispo (page-level SEO + CORE-EEAT) |
| | `claude-blog:blog-seo-check` | 🟡 | activable (pass/fail checklist on-page) |
| | `marketing-skills:seo-audit` | ✅ | dispo |
| **SEO monitoring & rank** | `aaron-seo-geo:watch`, `rank-tracker`, `alert-manager` | ✅ | dispo — peuvent remplacer `scripts/gsc-stats.js` + `scripts/bing-stats.js` à terme, ou les compléter |
| | `aaron-seo-geo:report`, `performance-reporter` | ✅ | dispo |
| | `claude-blog:blog-google` | 🟡 | activable (PageSpeed, CrUX, GSC, GA4) |
| | (à la main) | — | scripts custom `gsc-stats.js` / `bing-stats.js` / Umami curl (cf. mémoire `stack_monitoring_seo.md`) restent la voie active |
| **GEO / AI citation** | `aaron-seo-geo:visibility`, `geo-content-optimizer` | ✅ | dispo — pertinent vu que ChatGPT cite déjà DIY Builder (4 PV/7j cf. Umami) |
| | `claude-blog:blog-geo` | 🟡 | activable (AI Citation Readiness score 0-100) |
| | `marketing-skills:ai-seo` | ✅ | dispo |
| **CRO / conversion** | `cro` (marketing-skills) | ✅ | utilisable pour ProjectActions / tunnel résultats |
| | `marketing-skills:marketing-psychology`, `lead-magnets` | 🟡 | activable (utile pour le PDF lead magnet) |
| | `marketing-skills:signup`, `onboarding`, `popups` | 🟡 | activable |
| | `ab-testing` | ✅ | dispo (mais trafic 49 visiteurs/7j = pas encore actionnable) |
| **Lead funnel / RGPD** | `marketing-skills:churn-prevention` | — | hors scope (pas d'abonnement) |
| | `aaron-seo-geo:audit` côté légal | 🟡 | activable pour audit conformité publi |
| | (à la main) | — | ProjectActions.jsx + bloc RGPD codé manuellement (commit 804891c) |
| **Affiliation (Amazon / Sunology / Otovo)** | `affiliate-editorial-fr-playbook` | ✅ | méthodologie disclosure + classement |
| | (pas de skill spécifique) | — | Sub-tags Amazon + Sunology UpPromote + Otovo CPS = pilotage manuel |
| **Scraper prix (backend)** | `data:analyze`, `data:write-query` | ✅ | utile pour analyser `backend/data/scrape_*.json` |
| | `data:validate-data` | ✅ | pour QA des prix scrapés |
| | `engineering:code-review`, `simplify` | ✅ | utilisés pour les sélecteurs Playwright/ScrapingBee |
| | (à la main) | — | `backend/scripts/updateMaterialPrices.js` + `backend/scrapers/*.js` |
| **Schema / JSON-LD** | `claude-blog:blog-schema` | 🟡 | activable (BlogPosting, FAQPage, BreadcrumbList) |
| | `aaron-seo-geo:schema-markup-generator` | ✅ | dispo |
| | `marketing-skills:schema` | ✅ | dispo |
| | (à la main) | — | Les schémas JSON-LD (HowTo, Article, Breadcrumb, FAQPage, ItemList) sont codés inline dans les pages — `lib/seoSchemas.js` + chaque article |
| **Visuels (hero images, charts, OG)** | `frontend-design` | ✅ | utilisé pour cards (refonte /guides 28/05) |
| | `claude-blog:blog-image` | 🟡 | activable (Gemini via MCP) — pour l'instant l'utilisateur génère lui-même les hero (Midjourney/équivalent) |
| | `claude-blog:blog-chart` | 🟡 | activable (SVG inline charts) |
| | `anthropic-skills:canvas-design` | ✅ | dispo |
| **Sécurité** | `aikido:scan` | ✅ | dispo (SAST + secrets) |
| | `security-scan` | ✅ | dispo |
| | `security-review` | ✅ | dispo |
| **Tests** | `engineering:testing-strategy` | ✅ | dispo |
| | (à la main) | — | Vitest (362 tests) + Playwright e2e — pilotés via sous-agent `tests` Sonnet |
| **Déploiement** | `engineering:deploy-checklist` | ✅ | dispo |
| | MCP Vercel (`deploy_to_vercel`, `get_deployment`, `get_runtime_logs`) | ✅ | connecté — auto-deploy sur push main |
| | `verify`, `run` | ✅ | dispo (vérif post-déploiement) |
| **Mesure / analytics** | `marketing-skills:analytics` | ✅ | dispo |
| | `claude-blog:blog-audit` | 🟡 | activable (audit full-site avec scores 100 pts) |
| | `aaron-seo-geo:report` | ✅ | dispo |
| | (à la main) | — | GSC + Bing + Umami curl restent voie active |
| **Recherche stratégique** | `deep-research` | ✅ | utilisé (étude affiliation FR, audit consultants externes) |
| | `marketing-skills:customer-research`, `marketing-ideas` | 🟡 | activable |

Légende : ✅ installé et invocable · ❌ absent / non pertinent · 🟡 **activable** (installé mais pas encore invoqué sur DIY Builder).

## Skills réellement invoqués sur DIY Builder (à ce jour 29/05)

- `frontend-design` — refonte stack éditorial `/guides` (commit 70be9f2, 28/05) + cards V6
- `editorial-seo-fr` — référence anti-IA + E-E-A-T pour les 6 articles du pipeline (méthodologie)
- `affiliate-editorial-fr-playbook` — cadre méthodologique 9 phases (cluster guides)
- `deep-research` — étude affiliation FR (refus Awin/Affilae documenté), audit monétisation
- `engineering:code-review` (équivalent natif `/code-review`) — relectures pré-merge
- `simplify` — nettoyage post-refactor

À la main (pas de skill, soit parce qu'absent soit parce que la voie custom est meilleure) :
- Rédaction MDX des 6 articles publiés (suit `editorial-seo-fr` mais sans skill auto)
- Schémas JSON-LD inline dans chaque article (HowTo, FAQPage, Article, Breadcrumb)
- Calculs DTU (`modules/*/engine.js`) — pas de skill métier
- Géométrie 3D R3F — pas de skill métier
- Scripts GSC/Bing/Umami custom (`scripts/gsc-stats.js`, `scripts/bing-stats.js`)
- Scraper hebdo (`backend/scrapers/*.js` + GitHub Action)
- Sub-tags Amazon (`lib/projectTools.js`)
- Bloc RGPD ProjectActions (commit 804891c)
- Audit Coverage GSC (lecture manuelle des exports CSV)

## Plugins installés vs activables

| Plugin | Skills | Source | Statut DIY Builder |
|---|---|---|---|
| `anthropic-skills` | brand-guidelines, canvas-design, web-artifacts-builder, skill-creator, theme-factory, consolidate-memory, docx, pdf, pptx, xlsx, **editorial-seo-fr**, **affiliate-editorial-fr-playbook** | bundled | ✅ actif |
| `claude-blog` | 30 skills (blog-write, blog-rewrite, blog-audit, blog-factcheck, blog-cluster, blog-multilingual, blog-translate, blog-localize, blog-discourse, blog-image, blog-chart, blog-schema, blog-geo, blog-seo-check, blog-google, blog-notebooklm, etc.) | github AgriciDaniel | ✅ actif (29/05) — non encore invoqué |
| `marketing-skills` | 42 skills (ab-testing, ad-creative, ads, ai-seo, analytics, aso, churn-prevention, co-marketing, cold-email, community-marketing, competitor-profiling, competitors, content-strategy, copywriting, cro, customer-research, directory-submissions, emails, free-tools, image, launch, lead-magnets, marketing-ideas, marketing-psychology, onboarding, paywalls, popups, pricing, product-marketing, programmatic-seo, prospecting, referrals, revops, sales-enablement, schema, seo-audit, signup, site-architecture, sms, social, video) | tiers v2.2.0 | ✅ actif — `cro`, `copywriting`, `seo-audit`, `analytics` dispos |
| `aaron-seo-geo` | 20 skills (audit, authority, auto, brief, compete, discover, evolve, guard, map, max, publish, refresh, remember, report, series, skillify, tech, visibility, watch, write) + 17 sub-skills (competitor-analysis, content-gap-analysis, keyword-research, serp-analysis, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator, seo-content-writer, content-refresher, internal-linking-optimizer, on-page-seo-auditor, technical-seo-checker, alert-manager, backlink-analyzer, performance-reporter, rank-tracker, content-quality-auditor, domain-authority-auditor, entity-optimizer, memory-management) | github aaron-he-zhu | ✅ actif (29/05) — connecteurs MCP (Ahrefs, Semrush, Sistrix, Similarweb, Cloudflare, Vercel, Contentful, Sanity, HubSpot, Webflow) **inactifs sans clés API** |
| `design` (vu via skill listing) | accessibility-review, design-critique, design-handoff, design-system, research-synthesis, user-research, ux-copy | bundled | ✅ actif |
| `engineering` | architecture, code-review, debug, deploy-checklist, documentation, incident-response, standup, system-design, tech-debt, testing-strategy | bundled | ✅ actif |
| `data` | analyze, build-dashboard, create-viz, data-context-extractor, data-visualization, explore-data, sql-queries, statistical-analysis, validate-data, write-query | bundled | ✅ actif |
| `slack-by-salesforce` | channel-digest, draft-announcement, find-discussions, standup, summarize-channel, slack-messaging, slack-search | MCP connecté | 🟡 dispo (pas pertinent DIY Builder à ce jour — pas d'équipe Slack) |
| `adspirer-ads-agent` | campaign-performance, keyword-research, ad-campaign-best-practices | MCP connecté | 🟡 dispo (pas d'ads actifs DIY Builder) |
| `aikido` | scan, setup | MCP connecté | ✅ actif (SAST + secrets) |
| Skills natives Claude Code | verify, code-review, security-review, simplify, fewer-permission-prompts, loop, schedule, claude-api, run, init, review | bundled | ✅ actif |

## Connecteurs MCP optionnels (non activés, exigent des clés API)

Tous via le plugin `aaron-seo-geo` :
- `mcp__plugin_aaron-seo-geo_ahrefs__*` — Ahrefs (backlinks, rank tracking)
- `mcp__plugin_aaron-seo-geo_semrush__*` — Semrush (rank tracking, SERP)
- `mcp__plugin_aaron-seo-geo_sistrix__*` — Sistrix (visibilité)
- `mcp__plugin_aaron-seo-geo_similarweb__*` — SimilarWeb (audience, referrers)
- `mcp__plugin_aaron-seo-geo_se-ranking__*` — SE Ranking
- `mcp__plugin_aaron-seo-geo_cloudflare__*` — CDN/DNS
- `mcp__plugin_aaron-seo-geo_vercel__*` — déploiement (déjà couvert par MCP Vercel natif)
- `mcp__plugin_aaron-seo-geo_contentful__*`, `sanity__*`, `webflow__*`, `hubspot__*` — CMS (non utilisés ici, DIY Builder = Next.js + MDX inline)

## Reste non couvert / décisions

- **Hero images** : pas de bascule sur `claude-blog:blog-image` à ce stade — la voie « user génère via Midjourney + dépose dans `/Users/pelo/Downloads/PNG articles/` » fonctionne et garantit le style golden hour cohérent.
- **JSON-LD** : pas de bascule sur les skills de génération automatique — les schémas sont écrits à la main dans chaque article (HowTo, FAQPage, BreadcrumbList, Article) parce qu'ils sont **fact-check dépendants** (totalTime, estimatedCost, sources).
- **Sunology/Otovo** : pas de skill affiliation spécifique — pilotage manuel via `project_amazon_monetisation.md` + `project_affiliation_refus.md`.
- **Scraper** : `data:analyze` peut compléter mais ne remplace pas les sélecteurs Playwright/ScrapingBee custom (anti-bot, sélecteurs propriétaires).

---

*Document de référence — à mettre à jour quand un nouveau skill est invoqué pour la première fois sur DIY Builder, ou quand un plugin tiers est ajouté/retiré.*
