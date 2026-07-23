# Session Handoff — 23 juillet 2026

> Lire d'abord, puis `CLAUDE.md` + mémoire `MEMORY.md`.
> Fait suite à `SESSION-HANDOFF-2026-07-22.md`.
> **HEAD = `239b30f`** — ⚠️ **3 commits NON POUSSÉS** (`bec2dc1`, `7c80924`, `239b30f`).
> Seul `7b98f56` (monitoring) est sur `origin/main`.

---

## A. CE QUI A ÉTÉ FAIT — 4 commits

### 1. `7b98f56` Monitoring & fix Awin site-aware — **POUSSÉ**
- **`scripts/awin-stats.js` corrigé** (3 bugs) : compte Awin **partagé 2 sites** → filtre par défaut sur diy-builder.fr (transactions via `publisherUrl`, clics restreints aux marchands `OURS`) ; `all` pour voir les 2 sites ; colonne **commission** (`confirmedComm`) au lieu du **panier** (`confirmedValue`) ; statut `approved` = validé (n'était jamais reconnu, tout tombait en « attente »).
- **`scripts/affiliate-check.js`** (neuf) : liveness des 37 liens produits → `OK` / `MORT` / `BLOQUÉ`. Fetch via **curl** (codes HTTP fiables). Sans secret → tourne local ET cloud.
- **`scripts/weekly-digest.js`** (neuf) : orchestre GSC/Bing/Umami/Awin + liveness, **deltas semaine/semaine** via `history.jsonl`, **opportunités par règles** (requêtes pos 8-20, pages fort volume/CTR faible, alerte funnel, marchands à 0 clic), e-mail Resend si clé.
- **launchd** `~/Library/LaunchAgents/com.diybuilder.weekly-digest.plist` → digest **chaque lundi 8h (Paris)**. Chargé et validé.
- Baseline `.claude/tracking/` (digest + affiliate-check + `history.jsonl`).

### 2. `bec2dc1` Buy box CRO (Amazon + Awin) — local
Carte affiliée devenue **`<a>` entièrement cliquable** (focus WCAG sur la carte) · **CTA pleine largeur** nommant le marchand · **prix + date de relevé** · carte **« Meilleur choix »** auto (mieux notée, teintée par variante) · ligne marchand sur Awin. CTA bénéfice de la session précédente **conservé**.

### 3. `7c80924` (a) Capture devis DIRECTE sur les guides — local
`CTALead` (≈20 appels / ~12 guides) **ouvre `ArtisanLeadModal` sur le guide** au lieu de renvoyer au simulateur. Type projet déduit du `projectHref` (`/cloture`→cloture, `/calculateur`→terrasse, `/pergola`, `/cabanon`). Bouton primaire « Demander un devis gratuit » + lien alt « calculer ». **Rétro-compatible** (CTA génériques `/` gardent le lien). → **branche enfin `devis-click` + `artisan-modal-open` sur le trafic guides.**

### 4. `239b30f` (b) Bloc matériel aligné-BOM — local
`BomAffiliateBlock` + `lib/bomAffiliate.js` : met en avant les **MATÉRIAUX du chantier** (intention DIY) au lieu du produit fini. Lignes Awin = produits curés **référencés** depuis `awinProducts.js` (source unique, 0 URL dupliquée) + **liens recherche Amazon** pour consommables. Posé sur guides **pergola** + **terrasse-composite**.

**Méthode respectée** : mockup widget Actuel/Proposé → validation → code → vérif live. 378 tests OK à chaque commit.

---

## B. DÉCOUVERTES MAJEURES (corrigent des croyances précédentes)

1. **La vente Carplug 726 € n'était PAS DIY Builder.** Compte Awin `2934749` partagé avec **bornemaison.fr** ; Awin estampille `siteName`/`publisherName` « DIY Builder » même pour l'autre site — seul **`publisherUrl`** dit la vérité (`clickRef: avis-pulsar-plus`). Et 726,25 € = **panier**, la commission = 32,68 €. Cf [[reference_awin_compte_partage]].
2. **Amazon a de VRAIES ventes** : YTD 2026 = **46 clics → 2 ventes → 2,33 €** (les 2 sur les 30 derniers jours ; 0 de jan à mai). **DIY Builder n'est donc pas à 0 €.**
3. **Amazon convertit (8,33 % / 30 j), Awin = 0 %.** Preuve mesurée du **match d'intention** (outils/consommables > produits finis) → justifie (b).
4. **Les 2 ventes Amazon sont INDIRECTES** (cookie 24 h : achat d'autre chose que le produit lié) → tout clic-vers-Amazon peut rapporter ; le **volume de clics** compte autant que le match produit.
5. **Attribution Amazon VERROUILLÉE par le volume** : les 4 rapports (Tracking-Id, Top-Sellers vide, Linked-Product, Category) sortent **tous « others »**. Le Sub-Tag Report ne ventilera rien tant que le volume ne monte pas. `amazon-report.js` **non construit** (inutile pour l'instant).
6. **Pourquoi 0 lead** : la modale lead vivait **uniquement dans le simulateur** (~7 % des pages vues), et `CTALead` sur les guides n'était qu'un **teaser renvoyant au simulateur**. Corrigé par (a).
7. **10 blocs affiliés sur 11 étaient `variant:'alternative'`** (produit fini) — offre à contre-courant d'une audience venue construire. Corrigé par (b).
8. **Aosom = 403 anti-bot** (curl ET WebFetch) → 74 % des clics Awin vont vers un marchand **inauditable**. Stock/prix à vérifier à la main.

---

## C. TRACKING — baseline 22/07 (dans `history.jsonl`)

| Source | Chiffre |
|---|---|
| GSC 7 j | 70 clics / 1731 imp / CTR 4,04 % / pos 8,2 |
| GSC 28 j | **254 clics** (record : 187→254) / 8808 imp / pos 8,3 |
| Umami 7 j | 335 visiteurs (+63 %) / 793 vues / rebond **86,4 %** ⚠️ / 1m05 |
| Bing 7 j | 9 clics / 327 imp |
| Awin (DIY Builder seul) 30 j | 19 clics / **0 vente** / 0 € |
| Amazon YTD | 46 clics / **2 ventes** / **2,33 €** |
| Funnel artisan 28 j | **0** devis-click, **0** modal-open, **0** lead (avant fix (a)) |

**Vérité monétisation, désormais chiffrée** : ~43 clics affiliés/mois → 2 ventes → 2,33 €. La conversion **existe** (Amazon 8,33 %) ; le goulot est le **trafic** (~900 visites/mois). Il faut 10-50× le volume pour un revenu régulier. **Le lead pro reste le levier de plus haute valeur.**

---

## D. EN ATTENTE DE TA DÉCISION

1. **Pousser les 3 commits** `bec2dc1`, `7c80924`, `239b30f` (= déploiement Vercel). Tout vérifié live, 378 tests OK.
2. **Routine cloud promos/prix** : création **refusée (HTTP 401)** — il faut connecter l'app GitHub de Claude (https://claude.ai/code/onboarding?magic=github-app-setup). Le corps de la routine est prêt (cron `0 8 * * 1`, Sonnet 5, WebFetch, livraison = issue GitHub). Alternative « stopgap » : routine sans source repo (le dépôt est **public**, lecture via URL brute) mais livraison seulement dans l'historique des routines.
3. **`RESEND_API_KEY`** à coller dans `frontend/.env.local` (tu l'as dans Vercel) → active l'e-mail du digest hebdo (sinon il écrit juste le fichier).

---

## E. BACKLOG

- **Étendre le bloc BOM** à cabanon/clôture (config triviale) + le placer **dans le simulateur** après la liste de matériaux (quantités réelles) + plus de guides.
- **P0 simulateurs — TOUJOURS PAS FAIT** (traîne depuis le 01/07) : T-1 terrasse **14 vs 16 lambourdes** (`DeckSimulator.jsx:191`), C-1 clôture **défaut 3,5 m hors bornes** (`useDeckSimulatorState.js:21`).
- **Vérifier l'inventaire Aosom à la main** (74 % des clics, inauditable).
- **Badge « Meilleur choix » Amazon** n'apparaît que si l'ASIN a une note dans `amazonRatings.js` (souvent vide) — à remplir si on le veut visible.
- `amazon-report.js` **le jour où** le volume débloque les sous-tags.
- Re-mesurer l'effet de la refonte design à J+7/14 (rebond monté à 86,4 %).
- GSC Request Indexing 3 URLs · GartenHaus `30075` pending Awin.
- **Le trafic est le levier** (désormais chiffré) : requêtes en approche pos 8-12 (cluster solaire), pages fort volume/CTR faible (`terrasse-piscine-bois` 1401 imp / CTR 2,1 %).

---

## Reprendre
Dire : « Lis `.claude/SESSION-HANDOFF-2026-07-23.md` ». Puis au choix :
« pousse les 3 commits » · « corrige le lot P0 simulateurs » · « étends le bloc BOM » · « pousse le trafic ».

*Généré le 23 juillet 2026. 4 commits (3 à pousser), HEAD `239b30f`. Modèle : Opus 4.8.*
