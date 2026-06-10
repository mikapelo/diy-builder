# Umami self-host — runbook DIY Builder

> **Pourquoi.** Juin 2026 : Umami Cloud a déplacé sa REST API (clé `api_…`) derrière le
> plan payant ; l'API du dashboard de partage est closed-source et refuse l'auth hors
> navigateur (401 sur tous les headers testés le 10/06). → on bascule sur une instance
> **Umami v2 self-host** : gratuite, API documentée et stable (`/api/auth/login` → token).
>
> **Collecte actuelle non impactée.** Le script `cloud.umami.is/script.js` continue de
> tracker (website-id `d4301fb0-6101-438a-978e-79b12dae6b71`). On ne coupe RIEN tant que
> l'instance self-host n'est pas confirmée. L'historique Cloud reste sur Cloud (non migré).

---

## Répartition

| Étape | Qui | Durée |
|---|---|---|
| 1. Base Postgres (Neon) | **toi** (compte requis) | ~2 min |
| 2. Déploiement Umami (Vercel) | **toi** (compte requis) | ~3 min |
| 3. Premier login + créer le site | **toi** | ~1 min |
| 4. Swap du script de tracking | **moi** (code) | — |
| 5. Câblage `umami-stats.js` | **moi** (test) | — |

Tu fais **1→3**, tu me redonnes **(a) l'URL de l'instance** + **(b) le nouveau website-id**,
je fais **4→5** en autonome.

---

## 1. Base Postgres gratuite — Neon

1. https://neon.tech → *Sign up* (GitHub/Google)
2. *Create project* → région **EU (Frankfurt)** (RGPD + latence)
3. Copier la **connection string** (`postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)

> Alternative : Supabase (même principe). Neon = le plus simple pour Vercel.

## 2. Déployer Umami sur Vercel

1. Aller sur le dépôt officiel : https://github.com/umami-software/umami → bouton **Deploy to Vercel**
   (ou https://vercel.com/new → importer `umami-software/umami`)
2. Variables d'environnement à définir :
   ```
   DATABASE_URL   = <connection string Neon de l'étape 1>
   DATABASE_TYPE  = postgresql
   APP_SECRET     = <chaîne aléatoire — ex: openssl rand -hex 32>
   ```
3. **Deploy**. Vercel build + applique les migrations Prisma automatiquement (~2-3 min).
4. Noter l'URL finale, ex : `https://umami-diy-xxxx.vercel.app`

## 3. Premier login + créer le site

1. Ouvrir l'instance → login **`admin`** / **`umami`**
2. **Changer le mot de passe immédiatement** (Settings → Profile)
3. *Settings → Websites → Add website* : nom « DIY Builder », domaine `diy-builder.fr`
4. Récupérer **le nouveau website-id** (uuid affiché dans le code de suivi généré)

➡️ **Me redonner ici : l'URL de l'instance + le nouveau website-id.**

---

## 4. Swap du tracking (je fais)

Dans `frontend/app/layout.jsx`, le `<Script>` Umami passe de `cloud.umami.is/script.js`
au host self-host + nouveau website-id, via env vars (défaut = Cloud, donc zéro régression
si les vars ne sont pas posées) :

```jsx
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js';
// data-website-id = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
```

Vercel (projet DIY Builder, pas l'instance Umami) → env de prod :
```
NEXT_PUBLIC_UMAMI_SRC        = https://umami-diy-xxxx.vercel.app/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID = <nouveau website-id>
```

> Effet : les **nouvelles** visites partent vers le self-host. La collecte Cloud s'arrête
> (l'historique Cloud reste consultable via le dashboard Cloud tant que le compte existe).

## 5. Câblage lecture (je fais)

`frontend/.env.local` :
```
UMAMI_SELFHOST_URL=https://umami-diy-xxxx.vercel.app
UMAMI_SELFHOST_USER=admin
UMAMI_SELFHOST_PASSWORD=<le mdp changé à l'étape 3.2>
UMAMI_SELFHOST_WEBSITE_ID=<nouveau website-id>
```
Puis :
```
node scripts/umami-stats.js stats 7d
node scripts/umami-stats.js events 7d     # funnel artisan (artisan-modal-open/abandon)
```

Le script est déjà écrit (`scripts/umami-stats.js`) — il ne reste qu'à le tester contre
l'instance live.

---

## Notes

- **Plan gratuit Vercel** : suffisant pour le volume actuel (~210 visiteurs uniques/mois).
- **Cron Neon** : le free tier Neon met la base en veille après inactivité → premier appel
  du jour ~1 s plus lent (cold start). Sans impact sur le tracking.
- **Sécurité** : ne jamais committer `.env.local` (déjà gitignored). `APP_SECRET` et le mdp
  admin restent côté Vercel/Neon.
- **GEO/funnel** : une fois live, `events` redonne accès aux trackers `artisan-modal-open`
  et `artisan-modal-abandon` (diagnostic funnel artisan, à 0 conversion depuis 30 j).
