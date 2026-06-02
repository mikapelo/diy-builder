# Brancher Claude à GSC + Bing Webmaster Tools — démarche complète

> Document autonome reproductible dans n'importe quelle nouvelle session
> Claude Code. Aucun MCP nécessaire — tout passe par 2 scripts Node.js
> custom qui appellent les APIs directement avec fetch natif.
>
> Date de référence : juin 2026 (testé et fonctionnel sur DIY Builder).

---

## TL;DR

Pas de plugin MCP officiel pour GSC ou Bing au moment où ce doc est écrit.
La solution qui marche : **2 scripts Node.js standalone** dans `scripts/`
que Claude exécute via `Bash` tool. Lecture API native, zéro dépendance npm.

| Outil | Auth | Quota indexation | Fichier |
|---|---|---|---|
| Google Search Console | ADC user (`gcloud auth ...`) | 10 URLs/jour | `scripts/gsc-stats.js` |
| Bing Webmaster Tools | API key (32 chars) | 10 000 URLs/jour | `scripts/bing-stats.js` |

**Pièges critiques à connaître** :
1. GSC bloque les service accounts depuis 2023 → **OAuth user ADC obligatoire**
2. Bing exige l'**apex sans www** dans la propriété (`https://diy-builder.fr/`)
3. GCP exige un **quota project** activé sur Search Console API
4. Les fichiers de credentials ne sont **jamais commitées** (gitignore strict)

---

## Partie 1 — Setup Google Search Console (le plus complexe)

### Pré-requis

- Compte Google + propriété GSC vérifiée (DNS ou méta-balise)
- `gcloud` CLI installé (`brew install --cask google-cloud-sdk` sur macOS)
- Un projet GCP (gratuit) avec **Search Console API activée**

### 1.1 Créer le projet GCP et activer l'API

```bash
# Créer un projet (nom unique global, ex: "diy-builder-gsc")
gcloud projects create diy-builder-gsc

# Définir comme projet courant
gcloud config set project diy-builder-gsc

# Activer Search Console API (gratuit, quota par défaut largement suffisant)
gcloud services enable searchconsole.googleapis.com

# Vérifier
gcloud services list --enabled | grep searchconsole
```

### 1.2 Authentification ADC user (recommandé)

⚠️ **Ne pas utiliser un service account** : Google bloque l'ajout de SA
comme utilisateur dans Search Console depuis 2023.

```bash
# OAuth flow user, ouvre le navigateur
gcloud auth application-default login \
  --scopes='https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform'

# Définir le quota project (CRITIQUE — sans ça : 403)
gcloud auth application-default set-quota-project diy-builder-gsc
```

Vérification : un fichier doit exister à
`~/.config/gcloud/application_default_credentials.json` (contient le
refresh_token OAuth + le quota_project_id).

### 1.3 Test minimal sans script

```bash
# Récupère un access_token via le refresh_token ADC
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

# Test API : lister les propriétés Search Console
curl -s "https://searchconsole.googleapis.com/webmasters/v3/sites" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool
```

Si vous voyez vos propriétés listées → setup OK.
Si 403 « access denied » → quota project non défini (étape 1.2 dernière ligne).
Si 401 → `gcloud auth application-default login` à relancer.

### 1.4 Copier le script `gsc-stats.js`

Le script lit `~/.config/gcloud/application_default_credentials.json`
automatiquement. Pas d'env var à définir côté credentials (juste éventuellement
`GSC_SITE_URL` si la propriété diffère du défaut).

Structure du script (à reproduire) :

```js
#!/usr/bin/env node
/**
 * Lit l'ADC user, génère access_token via OAuth refresh,
 * interroge l'API Search Console, formate en CLI.
 */
const fs = require('fs');
const path = require('path');

const ADC_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.join(process.env.HOME || '', '.config', 'gcloud', 'application_default_credentials.json');

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:diy-builder.fr';

async function getAccessToken() {
  const creds = JSON.parse(fs.readFileSync(ADC_PATH, 'utf8'));
  // OAuth 2.0 refresh_token flow
  const params = new URLSearchParams({
    client_id:     creds.client_id,
    client_secret: creds.client_secret,
    refresh_token: creds.refresh_token,
    grant_type:    'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const j = await res.json();
  if (j.error) throw new Error(`OAuth: ${j.error_description || j.error}`);
  return { token: j.access_token, quotaProject: creds.quota_project_id };
}

async function searchAnalytics(token, quotaProject, body) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      // Le header x-goog-user-project est OBLIGATOIRE quand on
      // utilise un quota_project_id côté ADC
      ...(quotaProject ? { 'x-goog-user-project': quotaProject } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Exemple : performance 7 derniers jours
const cmd = process.argv[2] || 'help';
(async () => {
  const { token, quotaProject } = await getAccessToken();
  if (cmd === 'performance') {
    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const r = await searchAnalytics(token, quotaProject, { startDate, endDate });
    const row = r.rows?.[0] ?? {};
    console.log(`Performance 7j (${startDate} → ${endDate})`);
    console.log(`  Clics       : ${row.clicks ?? 0}`);
    console.log(`  Impressions : ${row.impressions ?? 0}`);
    console.log(`  CTR         : ${((row.ctr ?? 0) * 100).toFixed(2)} %`);
    console.log(`  Position    : ${(row.position ?? 0).toFixed(1)}`);
  }
  // ... autres commandes : pages, queries, daily, inspect, sitemaps
})().catch(e => { console.error('Erreur:', e.message); process.exit(1); });
```

Le fichier complet existant fait ~400 lignes (couvre : sites, performance,
pages, queries, daily, inspect, sitemaps, countries, devices).

### 1.5 Commandes habituelles (à donner à Claude dans une session)

```bash
node scripts/gsc-stats.js                       # aide
node scripts/gsc-stats.js sites                 # liste les propriétés
node scripts/gsc-stats.js performance 7d        # totaux semaine
node scripts/gsc-stats.js performance 28d       # totaux mois
node scripts/gsc-stats.js pages 7d              # top 20 pages
node scripts/gsc-stats.js queries 28d           # top 20 requêtes
node scripts/gsc-stats.js daily 14d             # série journalière
node scripts/gsc-stats.js inspect /guides/cabanon   # état indexation URL
node scripts/gsc-stats.js sitemaps              # statut sitemaps
node scripts/gsc-stats.js countries 28d         # top pays
node scripts/gsc-stats.js devices 28d           # mobile vs desktop
```

---

## Partie 2 — Setup Bing Webmaster Tools (10× plus simple)

### Pré-requis

- Compte Microsoft + propriété Bing Webmaster Tools vérifiée
- ⚠️ La propriété doit être en **apex sans www** : `https://diy-builder.fr/`
  (pas `https://www.diy-builder.fr/` même si le site sert depuis www)

### 2.1 Générer une API key

1. https://www.bing.com/webmasters
2. ⚙ **Paramètres** → **Accès API** → **Générer une nouvelle clé**
3. Copier la clé (32 caractères alphanumériques)

### 2.2 Stocker dans `.env.local`

```bash
# frontend/.env.local (gitignored)
BING_API_KEY=votre_cle_32_chars
BING_SITE_URL=https://diy-builder.fr/
```

⚠️ `BING_SITE_URL` doit terminer par `/`.

### 2.3 Test minimal sans script

```bash
source frontend/.env.local
curl -s "https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?apikey=${BING_API_KEY}" \
  | python3 -m json.tool
```

Si vous voyez vos propriétés listées → setup OK.

### 2.4 Copier le script `bing-stats.js`

Structure minimale (le script complet fait ~400 lignes) :

```js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Charger .env.local (chemin relatif au repo)
const envPath = path.join(__dirname, '..', 'frontend', '.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n').filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

if (!env.BING_API_KEY) {
  console.error('✗ BING_API_KEY manquante dans .env.local');
  process.exit(1);
}

const SITE_URL = env.BING_SITE_URL || 'https://diy-builder.fr/';
const API_KEY  = env.BING_API_KEY;
const BASE     = 'https://ssl.bing.com/webmaster/api.svc/json';

async function bingApi(method, params = {}) {
  const qs = new URLSearchParams({ apikey: API_KEY, siteUrl: SITE_URL, ...params });
  const res = await fetch(`${BASE}/${method}?${qs}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// Exemple : performance 7j
const cmd = process.argv[2] || 'help';
(async () => {
  if (cmd === 'performance') {
    const r = await bingApi('GetQueryStats');
    let clicks = 0, impressions = 0;
    // Bing renvoie des séries journalières — sommer sur 7 jours
    const last7 = (r.d || []).slice(-7);
    for (const day of last7) {
      clicks += day.Clicks || 0;
      impressions += day.Impressions || 0;
    }
    console.log(`Performance Bing 7j`);
    console.log(`  Clics       : ${clicks}`);
    console.log(`  Impressions : ${impressions}`);
    console.log(`  CTR         : ${impressions ? ((clicks/impressions)*100).toFixed(2) : 0} %`);
  }
  // ... autres commandes
})().catch(e => { console.error('Erreur:', e.message); process.exit(1); });
```

### 2.5 Commandes habituelles

```bash
node scripts/bing-stats.js                       # aide
node scripts/bing-stats.js sites                 # propriétés accessibles
node scripts/bing-stats.js performance 7d        # clics + impressions
node scripts/bing-stats.js queries 28d           # top requêtes
node scripts/bing-stats.js pages 28d             # top pages
node scripts/bing-stats.js crawl                 # stats crawl + erreurs
node scripts/bing-stats.js sitemaps              # statut sitemaps
node scripts/bing-stats.js inspect /guides/cabanon   # info indexation
node scripts/bing-stats.js submit /guides/xxx    # soumettre URL (quota 10 000/j)
```

---

## Partie 3 — Comment ça s'utilise dans une session Claude

Une fois les scripts en place et les credentials configurés, Claude peut
les invoquer via le tool `Bash` directement. Aucun MCP, aucune permission
spéciale autre que l'autorisation `Bash` standard.

Exemple d'usage type dans une nouvelle session :

```
User : audit GSC + Bing 7 derniers jours
Claude (Bash) : node scripts/gsc-stats.js performance 7d
Claude (Bash) : node scripts/gsc-stats.js pages 7d
Claude (Bash) : node scripts/gsc-stats.js queries 7d
Claude (Bash) : node scripts/bing-stats.js performance 7d
Claude : [synthèse data en plain language]
```

Le runtime hook recommandé pour DIY Builder demande de **rendre l'audit
health en plain language avec page / item / score / health label / next action** —
les scripts retournent les données brutes, Claude les met en forme.

---

## Partie 4 — Pièges connus (déjà rencontrés sur DIY Builder)

### GSC

| Piège | Symptôme | Fix |
|---|---|---|
| Service account essayé | 403 « insufficient permission » | Bascule en ADC user (étape 1.2) |
| Quota project absent | 403 « PERMISSION_DENIED » | `gcloud auth application-default set-quota-project ...` |
| `x-goog-user-project` manquant | 403 random | Ajouter le header dans tous les fetch |
| Propriété au mauvais format | 404 | `sc-domain:diy-builder.fr` (pas `https://...`) sauf propriété URL prefix |
| Refresh token expiré (~6 mois) | 401 invalid_grant | Relancer `gcloud auth application-default login` |

### Bing

| Piège | Symptôme | Fix |
|---|---|---|
| Propriété avec www | 404 / pas de data | Re-vérifier en apex sans www |
| `BING_SITE_URL` sans `/` final | 400 ou data vide | Ajouter `/` à la fin |
| Données pré-publi peu fiables | < 5 clics/jour | Bing met 3-7 jours à indexer, normal sur petit site |
| `submit` quota 10 000/j | Réponse silencieuse | Ne pas s'inquiéter, ça passe en async |

### Umami (bonus, pas dans les 2 scripts mais souvent utilisé en complément)

| Piège | Symptôme | Fix |
|---|---|---|
| Cloudflare 522 sporadique | API ne répond pas | Côté infra Umami, retry plus tard |
| Bug `umami.is/api/websites/{id}/stats` 401 | clés OK mais 401 | Vérifier `x-umami-api-key` header (pas `Authorization Bearer`) |

---

## Partie 5 — Sécurité et bonnes pratiques

### Gitignore strict

```
# .gitignore (à la racine)
.env.local
.env.production.local
.gsc-service-account.json
~/.config/gcloud/application_default_credentials.json    # déjà dans home, pas dans repo
```

### Rotation des credentials

| Credential | Fréquence | Comment |
|---|---|---|
| GSC refresh_token ADC | ~6 mois (expiration auto) | `gcloud auth application-default login` |
| Bing API key | À la compromission | Bing Webmaster → Paramètres → Régénérer |
| Quota project ADC | Une fois (stable) | `gcloud auth application-default set-quota-project ...` |

### Ne JAMAIS partager dans le code

- ❌ `BING_API_KEY` en dur dans un .js
- ❌ Le `client_secret` GSC dans un .js (il est public OK car déjà dans le binaire gcloud)
- ✅ Toujours via `process.env.X` ou parsing `.env.local`
- ✅ Le credentials ADC reste dans `~/.config/gcloud/` (jamais commité)

---

## Partie 6 — Reproduction sur un nouveau projet

Si tu veux brancher GSC + Bing sur un autre site (`monsite.fr`) dans une
nouvelle session Claude Code :

1. **Copier les 2 scripts** `gsc-stats.js` et `bing-stats.js` du projet
   DIY Builder vers `scripts/` du nouveau projet
2. **Modifier les valeurs par défaut** :
   - `SITE_URL` dans `gsc-stats.js` → `sc-domain:monsite.fr`
   - `BING_SITE_URL` dans `.env.local` → `https://monsite.fr/`
3. **Si même compte Google** : ADC déjà fait, rien à refaire (le credentials
   ADC user couvre toutes les propriétés Search Console du compte)
4. **Si nouveau compte Bing** : nouvelle API key à générer
5. **Quota project GCP** : peut être réutilisé (`diy-builder-gsc` couvre N sites)
6. **Tester** : `node scripts/gsc-stats.js sites` doit lister toutes les
   propriétés du compte, dont la nouvelle

---

## Partie 7 — Alternative future (si MCP sort)

Au moment de l'écriture (juin 2026), aucun MCP officiel pour Google Search
Console ou Bing Webmaster Tools. Le plugin `aaron-seo-geo` propose des
connecteurs Ahrefs/Semrush/Similarweb/Sistrix mais **pas GSC ni Bing**.

Si Google Cloud ou Microsoft sortent un MCP officiel ultérieurement :
- Vérifier que l'auth supporte ADC user (pas seulement service account)
- Vérifier le quota project pour GSC
- Vérifier les scopes nécessaires (`webmasters.readonly` au minimum)

D'ici là, les scripts custom restent la voie active sur DIY Builder.

---

## Partie 8 — Compléter avec le skill `claude-blog:blog-google`

Les scripts custom de la Partie 1 couvrent **GSC seul**. Pour aller plus loin
(PageSpeed Insights, Core Web Vitals avec historique 25 semaines, NLP entity
analysis pour E-E-A-T, GA4, Knowledge Graph, YouTube, Google Ads Keyword
Planner), le skill `claude-blog:blog-google` est l'outil natif Claude
recommandé. Installation déjà présente sur la machine au moment où ce doc
est écrit (`/Users/pelo/.claude/plugins/claude-blog/skills/blog-google`).

### Architecture du skill

```
~/.config/claude-seo/google-api.json         ← config partagée avec claude-seo
                          │
                          ▼ lu par
~/.claude/plugins/claude-blog/skills/blog-google/scripts/run.py
                          │
                          ▼ appelle
Google Cloud APIs (au choix selon le tier d'auth)
```

### 4 tiers d'auth progressifs

| Tier | Credentials | APIs débloquées | Setup |
|---|---|---|---|
| **0** | API Key Google Cloud | PageSpeed, CrUX, CrUX History, Knowledge Graph, YouTube | 5 min |
| **1** | + Service Account JSON | + Search Console + Indexing API | +5 min |
| **2** | + GA4 Property ID | + GA4 organic traffic | +2 min |
| **3** | + Google Ads Manager Account + Developer Token | + Keyword Planner | +1 j (validation Google) |

**Pour DIY Builder, Tier 0 suffit** : on a déjà GSC via les scripts Node
custom, donc pas besoin du Tier 1. Et on est sur Umami (pas GA4) donc Tier 2
inutile. Tier 3 = pas notre stack actuel.

### Setup Tier 0 (l'utile)

#### 8.1 Activer les APIs sur le projet GCP existant

```bash
# Vérifier que le compte gcloud est connecté
gcloud auth list
# Si rien : gcloud auth login (browser flow)

# Définir le projet
gcloud config set project diy-builder-gsc

# Activer les 5 APIs Tier 0
gcloud services enable \
  pagespeedonline.googleapis.com \
  chromeuxreport.googleapis.com \
  kgsearch.googleapis.com \
  youtube.googleapis.com \
  language.googleapis.com

# Activer aussi l'API Keys API (pour la création de clé via CLI)
gcloud services enable apikeys.googleapis.com
```

#### 8.2 Créer une API key restreinte (recommandé)

**Option A — Via gcloud CLI** :
```bash
# Création
gcloud services api-keys create \
  --display-name="claude-blog-google-tier0" \
  --api-target="service=pagespeedonline.googleapis.com" \
  --api-target="service=chromeuxreport.googleapis.com" \
  --api-target="service=kgsearch.googleapis.com" \
  --api-target="service=youtube.googleapis.com" \
  --api-target="service=language.googleapis.com"

# Lister pour récupérer le name complet
gcloud services api-keys list \
  --filter="displayName=claude-blog-google-tier0" \
  --format="value(name)"

# Extraire la keyString
gcloud services api-keys get-key-string <name-extracted-above>
```

**Option B — Via UI Google Cloud Console** (plus simple) :
1. https://console.cloud.google.com/apis/credentials
2. **Create Credentials** → **API key**
3. Cliquer sur la clé créée → **Restrict key**
4. Sous **API restrictions**, sélectionner les 5 APIs Tier 0
5. **Save**
6. Copier la `AIzaSy...` (38 caractères)

#### 8.3 Créer le fichier de config

```bash
mkdir -p ~/.config/claude-seo

cat > ~/.config/claude-seo/google-api.json <<EOF
{
  "api_key": "AIzaSy...VOTRE_CLE...",
  "default_property": "sc-domain:diy-builder.fr"
}
EOF

# Permissions strictes (lecture user only)
chmod 600 ~/.config/claude-seo/google-api.json
```

#### 8.4 Test fonctionnel

```bash
# Vérifier les credentials
python3 ~/.claude/plugins/claude-blog/skills/blog-google/scripts/run.py google_auth --check

# PageSpeed Insights sur la home
python3 ~/.claude/plugins/claude-blog/skills/blog-google/scripts/run.py pagespeed \
  --url "https://www.diy-builder.fr"

# CrUX avec historique 25 semaines
python3 ~/.claude/plugins/claude-blog/skills/blog-google/scripts/run.py crux-history \
  --url "https://www.diy-builder.fr"

# NLP entity analysis sur un guide (E-E-A-T signal)
python3 ~/.claude/plugins/claude-blog/skills/blog-google/scripts/run.py nlp \
  --text "$(cat /Users/pelo/Downloads/diy-builder-scraper3/frontend/app/guides/cabanon/page.jsx | head -200)"
```

#### 8.5 Invocation par Claude

Dans une nouvelle session, Claude peut invoquer le skill via 2 voies :

**Voie 1 — Tool `Skill`** (recommandé, déclenche la procédure complète) :
```
User : audit Core Web Vitals des piliers
Claude → Skill tool: claude-blog:blog-google
         args: "crux-history --url https://www.diy-builder.fr/guides/pergola"
```

**Voie 2 — Tool `Bash`** (plus direct, sans la couche skill) :
```
node /chemin/run.py crux --url ...
```

### Comparaison stratégique scripts custom vs blog-google

| Critère | Scripts custom (Partie 1-2) | Skill `blog-google` (Partie 8) |
|---|---|---|
| **GSC performance/pages/queries** | ✅ Voie active | ⚠️ Doublon (Tier 1) |
| **Bing Webmaster** | ✅ Voie unique | ❌ Pas couvert |
| **PageSpeed Insights** | ❌ | ✅ |
| **CrUX 25 sem historique** | ❌ | ✅ |
| **NLP entity (E-E-A-T)** | ❌ | ✅ |
| **YouTube research** | ❌ | ✅ |
| **Knowledge Graph entity** | ❌ | ✅ |
| **GA4 organic** (futur) | ❌ | ✅ Tier 2 |
| **Keyword Planner** (futur) | ❌ | ✅ Tier 3 |
| **Maintenance** | Code dans le repo, maîtrisé | Plugin externe AgriciDaniel |
| **Stack** | Node natif | Python (`run.py`) |
| **Format sortie** | CLI custom | JSON + Markdown standardisé |

### Verdict hybride DIY Builder

**Garder les scripts custom** pour les audits routiniers GSC + Bing (rythme
hebdomadaire). C'est rapide, versionné, maîtrisé.

**Utiliser `blog-google` Tier 0** pour les audits ponctuels où nos scripts
ne couvrent pas :
- Audit PageSpeed avant une refonte de page
- Suivi mensuel CrUX (Core Web Vitals) pour repérer les régressions
- Audit NLP entity sur un nouvel article (signal E-E-A-T pour Google Quality Raters)
- Research YouTube pour embed dans un futur guide

Pas de migration. Pas de remplacement. **Ajout en complément**.

### Sécurité

| Credential | Stockage | Permissions |
|---|---|---|
| `~/.config/claude-seo/google-api.json` | Hors repo | 600 |
| API key restreinte aux 5 APIs Tier 0 | — | Limite l'exploitation si fuite |
| Gitignore | `.config/claude-seo/*` côté repo (par sécurité même si hors repo) | — |

### Pièges connus blog-google

| Piège | Symptôme | Fix |
|---|---|---|
| API non activée sur le projet GCP | 403 `SERVICE_DISABLED` | `gcloud services enable <api>.googleapis.com` |
| API key non restreinte au bon set d'APIs | 403 `API_KEY_HTTP_REFERRER_BLOCKED` ou `PERMISSION_DENIED` | Re-vérifier les API restrictions dans UI Console |
| Cloud NLP demande billing | `UREQ_PROJECT_BILLING_NOT_FOUND` à l'activation | Activer billing card sur le projet GCP OU exclure `language.googleapis.com` du set |
| Quota PageSpeed dépassé | 429 | 25 000 req/jour gratuit, normalement large |
| Quota CrUX dépassé | 429 | 100 req/100 secondes — espacer les appels |
| CrUX renvoie "no data" | Pas un bug, le site est trop petit | Seuil ~5000 visites Chrome / 28 jours requis par Google. Attendre que le trafic grimpe. |
| Python 3.x version trop ancienne | `SyntaxError` | Python 3.10+ recommandé |
| `pagespeed_check.py:285 KeyError audit_details` | Bug du skill (v1.9.1) | Utiliser https://pagespeed.web.dev manuellement OU attendre fix mainteneur |
| Argument `--url` rejeté | Le skill attend URL en arg positionnel, pas en flag | `script "https://..."` au lieu de `script --url "..."` |
| `youtube_search` invalide sans sous-commande | Le script attend `{search|video|channel}` en 1er argument | `youtube_search search "query"` |

### État réel observé sur DIY Builder (2026-06-02)

| Test | État | Détails |
|---|---|---|
| Auth check Tier 0 | ✅ | API key restreinte aux 4 APIs (PSI, CrUX, KG, YouTube) |
| YouTube search | ✅ | 3 vidéos retournées avec metadata complète (vues, likes, durée) en JSON |
| PageSpeed Insights | ❌ | Bug skill `KeyError audit_details` dans `pagespeed_check.py:285`. Workaround : utiliser pagespeed.web.dev en UI directe |
| CrUX (current) | ❌ data | Site trop petit, ~210 visiteurs uniques/mois Umami vs seuil ~5000 Chrome/28j |
| CrUX history | ❌ data | Idem, attendre 6-12 mois |
| NLP entity (Cloud NLP) | ⏭ pas testé | API exclue du Tier 0 (billing requis). À ajouter quand billing card configurée si besoin |

**Verdict pratique** : à ce stade, le skill `blog-google` est utile pour
**YouTube research uniquement** côté DIY Builder. Les fonctionnalités SEO
plus avancées (PSI, CrUX, NLP) demandent soit un fix mainteneur (PSI),
soit du temps (CrUX), soit le billing GCP (NLP).

Pour les audits Core Web Vitals dans l'attente du seuil CrUX,
**Google PageSpeed Insights en UI directe** (https://pagespeed.web.dev)
reste la voie active. Saisir l'URL, copier-coller le score dans la session
Claude. Pas idéal mais fonctionnel.

### Configuration en place sur cette machine (2026-06-02)

- ✅ APIs activées : `pagespeedonline`, `chromeuxreport`, `kgsearch`, `youtube`, `apikeys`
- ⏭ API non activée : `language.googleapis.com` (NLP, billing requis)
- ✅ API key restreinte créée : `claude-blog-google-tier0`
  (`uid 5fe40d19-c351-4dcc-b7ac-f71f43c4ae09` dans le projet `diy-builder-gsc`)
- ✅ Config locale : `~/.config/claude-seo/google-api.json` (chmod 600)

La valeur de l'API key n'est **pas dans ce document** par sécurité.
Elle est dans `~/.config/claude-seo/google-api.json` uniquement.
Pour la rotation : Google Cloud Console → API & Services → Credentials →
trouver `claude-blog-google-tier0` → Régénérer.





```bash
# frontend/.env.local (gitignored)

# Bing
BING_API_KEY=votre_cle_32_chars
BING_SITE_URL=https://diy-builder.fr/

# Umami (bonus)
UMAMI_API_KEY=api_...
UMAMI_WEBSITE_ID=d4301fb0-6101-...
UMAMI_BASE_URL=https://api.umami.is

# Resend (existant)
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=7b077120-9cf5-497d-9fea-bd9f0938156c
LEAD_NOTIFY_EMAIL=contact@diy-builder.fr

# Admin dashboard
ADMIN_PASSWORD=...

# GSC : pas de variable .env.local nécessaire
# (le script lit ~/.config/gcloud/application_default_credentials.json)
```

---

## Annexe — Demander à Claude de tout vérifier d'un coup

Dans une nouvelle session, pour vérifier que tout marche :

```
User : test scripts monitoring
Claude (Bash) : node scripts/gsc-stats.js sites
Claude (Bash) : node scripts/bing-stats.js sites
Claude : ✅ GSC liste 1 propriété (sc-domain:diy-builder.fr)
         ✅ Bing liste 1 propriété (https://diy-builder.fr/)
         Setup OK.
```

Si erreur → relire la section pièges (Partie 4) correspondante.
