# Session Handoff — 25 mai 2026

> Document de transition. Lire d'abord, puis `CLAUDE.md` + mémoire
> `~/.claude/projects/-Users-pelo-Downloads-diy-builder-scraper3/memory/MEMORY.md`.
> Session précédente : `.claude/SESSION-HANDOFF-2026-05-24.md`.

---

## ⏱️ Statut court

10 commits livrés sur 24-25 mai, tous poussés sur `main`. Vercel auto-déployé.
Working tree propre côté frontend.

**Commits livrés cette session :**

```
b9643a8 feat(seo): scripts/bing-stats.js — lecture API Bing Webmaster Tools
74f8520 docs(sources): enrichir /sources avec toutes les références juridiques
dd7f039 feat(content): article #5 piscine + patches SEO + fact-check juridique 4 articles
c9cdf26 fix(seo): patches meta titre + description simulateurs sous-performants
57d6d6f feat(content): article guide /guides/permis-cabanon-seuils-2026 (pipeline #4)
5d0293d feat(content): article guide /guides/comparer-devis-travaux (pipeline #3)
bb51ea5 refactor(seo): migration /dalle → /guides/dalle (cohérence cluster guides)
5033856 feat(cro): refonte hero accueil — 4 pills projet directes + suppression Stats
d9584a1 feat(content): article comparatif /guides/prix-terrasse-bois-m2-2026
eb632a3 fix(content): lot 2 fact-check guides — sections, budgets, estimatedCost
```

## 🌐 Prod

- https://www.diy-builder.fr (HTTP 200)
- Vercel auto-deploy sur push main
- Dev local : `cd frontend && npm run dev` (autoPort)
- Preview MCP : `preview_start("frontend")` (port 3000)

---

## ✅ Ce qui a été fait

### 1. Lot 2 fact-check guides existants (commit eb632a3)
Sections produit alignées sur ce que vend le simulateur :
- Cabanon : OSB 12 mm → 9 mm (DTU 31.2 mini), chevrons 45×145 → 60×80 mm,
  voliges 18 → 14-18 mm
- Pergola : chevrons 45×120 → 80×50 mm (jusqu'à 3,5 m portée),
  100×50 mm au-delà
- Tableaux budget recalculés depuis materialPrices.js (terrasse
  540 € pour 12 m² pin, cabanon 1 400 € pour 4 m²)
- JSON-LD `estimatedCost` à jour : terrasse 500-1400, cabanon 1400-3400,
  dalle 300-1500

### 2. Pipeline éditorial — 4 nouveaux articles publiés (50 % du plan)

| # | Slug | Type | Commit | État |
|---|---|---|---|---|
| 1 | `/guides/soi-meme-ou-pro` | Pilier | fa49653 (avant) | ✅ |
| 2 | `/guides/prix-terrasse-bois-m2-2026` | Comparatif | d9584a1 | ✅ |
| 3 | `/guides/comparer-devis-travaux` | Guide | 5d0293d | ✅ |
| 4 | `/guides/permis-cabanon-seuils-2026` | Guide | 57d6d6f | ✅ |
| 5 | `/guides/terrasse-piscine-bois` | Guide | dd7f039 | ✅ |

Tous ~2 500-3 000 mots, 3 JSON-LD (Article + BreadcrumbList + FAQPage),
maillage interne riche (29-30 liens/article), 0 "DIY" standalone,
0 phrase-gabarit IA.

### 3. Refonte CRO accueil (commit 5033856)
- Hero : bouton "Lancer un projet ▼" + menu-roue → **4 pills directes**
  `[01 Terrasse] [02 Cabanon] [03 Pergola] [04 Clôture]`
  (desktop : 1 ligne ; mobile : grille 2×2)
- Section Stats supprimée (873 px de scroll gagnés)
- Header : nav "Technique" retiré (pointait vers la section disparue)
- Page passe de 6 à 5 sections

### 4. Migration `/dalle` → `/guides/dalle` (commit bb51ea5)
- `git mv` app/dalle/ → app/guides/dalle/ + canonical/OG mis à jour
- Redirect 308 permanent dans `next.config.js`
- Sitemap, Header, Footer, HomeSeoBand, /guides, /guides/soi-meme-ou-pro
  tous mis à jour vers la nouvelle URL

### 5. Patches meta titres simulateurs (commit c9cdf26)
Audit GSC en direct → 3 pages sous-performantes refondues :
- `/calculateur` : 41 imp / 1 clic / CTR 2.4 % → titre/desc avec
  "Calculateur" + "30 s" + prix concret
- `/cabanon`  : 8 imp / 0 clic / pos 8.5 → idem + prix 1 400 € / 4 m²
- `/cloture`  : 16 imp / 0 clic / pos 8.7 → idem + prix 26 €/ml

### 6. Fact-check juridique des 5 nouveaux articles (commit dd7f039)
Imprécisions repérées et corrigées :
- "RBUE depuis 2022" → règlement n°995/2010 en application depuis 3/3/2013
- "art. 200 quater du CGI" (CITE supprimé fin 2020) → "art. 278-0 bis A
  du CGI" pour TVA 5,5 % rénovation énergétique
- "L441-3 Code commerce" → "L111-1 Code conso" (cohérent B2C)
- Cerfa "13703*09" et "13406*12" → versions retirées (suffixes évoluent
  chaque année), mention "vérifier version sur service-public.fr"
- "L128-1 Code construction" → "loi Raffarin n°2003-9 du 3 janvier 2003"
  sans article (ordonnance 2020-71 a recodifié le CCH)

### 7. Page `/sources` enrichie (commit 74f8520)
De 5 à 7 sections H2. Ajout :
- Normes : EN 350, DIN 51130, RBUE 995/2010
- Cadre légal : R425-1, R431-2, Géoportail urbanisme, GNAU
- **Nouvelle section "Construction, devis et garanties travaux"** :
  L111-1 Code conso, Arrêté 2 mars 1990, Spinetta L241-1, articles 1792
  à 1792-6 Code civil, CGI 278-0 bis A et 279-0 bis, annuaire-entreprises
- **Nouvelle section "Sécurité des piscines privées"** :
  loi 2003-9, normes NF P90-306 à 309

### 8. Setup API Search Console + Bing Webmaster Tools
- **`scripts/gsc-stats.js`** (auth OAuth utilisateur via gcloud ADC)
  - Échec service account (Google bloque l'ajout dans GSC UI depuis 2023)
  - Bascule sur ADC user : `gcloud auth application-default login`
  - 6 URLs récentes indexées via GSC UI "Demander l'indexation"
- **`scripts/bing-stats.js`** (auth API key simple, commit b9643a8)
  - Sitemap apex soumis → 22 URLs découvertes instantanément (Success)
  - 6 URLs récentes soumises via SubmitUrl (quota 10 000/jour)
- **Croisement Umami × GSC × Bing** monté en parallèle

## 📊 État de monitoring (24-25 mai)

**GSC 28j (avant les nouvelles indexations) :**
- 18 clics · 262 impressions · CTR 6.87 % · position 8.6
- Croissance depuis le 18/05 (jour de soumission sitemap GSC)
- Pages top : /guides/cabanon (4 clics / 52 imp), / (3 clics / 13 imp)
- Requêtes top : "diy builder" pos 2.5, "simulateur terrasse leroy merlin"
  pos 8.5
- 25 visiteurs sur 41 viennent de Google (61 % SEO)

**Umami 28j :**
- 124 pageviews, 41 visiteurs uniques, 73 % rebond
- Navigation interne dominante : 66 PV sur `/` (vs 3 clics GSC)
- 3 bots détectés (`/cmd_sco`, `/about`, `/C:\...`) — marginal

**Bing 28j :**
- 1 clic, 25 impressions, 3 jours de data uniquement
- Premières requêtes captées : "lames cloture leroy merlin" et variantes
- ~3-5 % du marché FR mais audience plus commerciale

## 🎯 Chantiers ouverts pour la prochaine session

### 1. Re-audit GSC le 27/05 (J-3, RDV initialement prévu dans le handoff précédent)
Mesurer l'effet conjoint :
- Patches meta titres c9cdf26 sur /calculateur, /cabanon, /cloture
- Indexation effective des 6 nouvelles pages (toutes "Submitted and indexed"
  côté API GSC le 24/05)
- Trafic Bing après soumission sitemap et 6 URLs
Commandes :
```bash
node scripts/gsc-stats.js performance 7d
node scripts/gsc-stats.js pages 7d
node scripts/gsc-stats.js queries 7d
node scripts/gsc-stats.js daily 14d
node scripts/bing-stats.js performance 7d
node scripts/bing-stats.js pages
node scripts/bing-stats.js queries
```

### 2. Pipeline éditorial #6 à #10 (5 articles restants)
| # | Slug | Type | Pilier |
|---|---|---|---|
| 6 | `/guides/pergola-adossee-vs-autoportee` | Comparatif | pergola |
| 7 | `/guides/hauteur-cloture-loi-2026` | Guide | clôture |
| 8 | `/guides/dalle-sans-betonniere` | Guide | dalle |
| 9 | `/guides/cout-artisan-cabanon` | Comparatif | diy-vs-pro |
| 10 | `/guides/isoler-cabanon-atelier` | Guide | cabanon |

Cadence recommandée : 1 article/semaine (cf. `editorial_pipeline.md`).
À chaque article, **passer obligatoirement par le fact-check** avant
publication (méthode validée dans cette session : croiser références
juridiques contre Légifrance/service-public.fr, ne pas inventer de
numéros d'articles).

### 3. `/guides/terrasse` à muscler
GSC 28j : pos 15, 17 imp, 0 clic. C'est le pilier le moins performant.
Soit on enrichit (le rendre plus dense, ajouter sections, plus de
tableaux), soit on laisse le nouveau `/guides/prix-terrasse-bois-m2-2026`
prendre les positions au passage.

### 4. Article `/guides/dalle` (migré le 24/05)
À monitorer dans les 4-6 semaines : transfert d'autorité de l'ancienne
URL `/dalle` (qui avait 2 clics / 30 imp sur 28j) vers la nouvelle. Le
308 fait le boulot mais Google met du temps à transférer le signal.

### 5. (Optionnel) Stack monitoring
Possibles évolutions du tooling :
- Cron quotidien qui sort un mini-rapport GSC + Bing dans un fichier
- Croisement automatisé "URL avec impressions GSC mais 0 PV Umami" =
  détection bot ou tracking cassé

## ⚠️ Pièges et notes

### Fichiers sensibles à ne JAMAIS commiter
- `frontend/.env.local` (gitignored ligne 19 `.env.local`)
- `.gsc-service-account.json` (gitignored ligne 38 `*-service-account.json`)
- `~/.config/gcloud/application_default_credentials.json` (hors repo)

Contenu actuel `.env.local` (valeurs masquées) :
```
RESEND_API_KEY=re_A...
LEAD_NOTIFY_EMAIL=contact@diy-builder.fr
UMAMI_API_KEY=api_3I...
UMAMI_WEBSITE_ID=d4301fb0-...
UMAMI_BASE_URL=https://api.umami.is
BING_API_KEY=2829c9...
BING_SITE_URL=https://diy-builder.fr/   (apex, pas www !)
```

### Auth GSC
- Mode actuel : **ADC user via gcloud**, pas service account
- Tentative service account abandonnée : Google Search Console UI a
  bloqué l'ajout d'emails service_account depuis 2023 ("email
  introuvable")
- Si le token expire (~7 jours en mode dev) :
  ```bash
  gcloud auth application-default login --scopes='https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform'
  ```
- Quota project : projet Cloud `diy-builder-gsc` (header X-Goog-User-Project
  géré par le script)

### Auth Bing
- API key simple, format `2829c9...` (32 chars), 10 000 URLs/jour de quota
- Propriété connue : `https://diy-builder.fr/` **apex sans www**
- Auto-détection siteUrl via GetUserSites → corrige les mismatches sans
  intervention

### Pièges historiques (rappel)
- **Fichiers protégés** : `lib/deckEngine.js`, `deckConstants.js`,
  `deckGeometry.js`, `foundation/foundationCalculator.js` — NE JAMAIS
  modifier.
- **Push direct sur `main`** = workflow normal (projet solo).
- **Cache `.next` fragile** : pas de `npm run build` pendant
  `npm run dev`.
- **ESLint strict** : apostrophes/guillemets échappés en JSX (`&apos;`).
- **Lock git orphelin** récurrent : `rm .git/index.lock` si un commit
  bloque sans process git actif (vu 2 fois aujourd'hui).
- **cwd dérive** : après `cd frontend`, les commandes git échouent →
  utiliser `git -C <repo-root>` ou chemins absolus.
- **Anglicismes** : interdits dans le contenu visible FR. Marque
  "DIY Builder" exceptée.

## 🚀 Reprendre dans la nouvelle session

Dire : « Lis `.claude/SESSION-HANDOFF-2026-05-25.md` ».

Puis selon le besoin :
- « audit » → lance les 3 commandes GSC + Bing pour mesurer l'effet
  des derniers patches (à faire le 27/05 idéalement)
- « article 6 » → écrire `/guides/pergola-adossee-vs-autoportee` selon
  la méthodologie pipeline (~2 500-3 000 mots, fact-check obligatoire)
- « muscle terrasse » → refactor `/guides/terrasse` pour gagner des
  positions sur "construction terrasse" et variantes
- « stack monitoring » → mettre en place un cron quotidien d'audit

---

*Généré le 25 mai 2026 — fin de session après push du commit b9643a8
(bing-stats.js). Tout en prod, Vercel auto-déployé.*
