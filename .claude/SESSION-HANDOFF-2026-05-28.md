# Session Handoff — 28 mai 2026

> Document de transition. Lire d'abord, puis `CLAUDE.md` + mémoire
> `~/.claude/projects/-Users-pelo-Downloads-diy-builder-scraper3/memory/MEMORY.md`.
> Session précédente : `.claude/SESSION-HANDOFF-2026-05-25.md`.
> Roster multi-agents : `.claude/SESSIONS.md`.

---

## ⏱️ Statut court

4 commits livrés sur 27-28 mai, tous poussés sur `main`. Vercel auto-déployé.
Working tree frontend propre (seuls des `fallback-*.js` Next non suivis, ignorables).

**Commits livrés cette session :**

```
8816730 feat(pergola-solaire): aligne fin d'article sur le pattern satellite
70be9f2 feat(guides): refonte section "Aller plus loin" en stack éditorial
1f4762e feat(images): hero photoréalistes pour 6 articles guides satellite
44ce073 feat(content): article pergola + panneaux solaires DIY 2026 + fact-check soi-meme-ou-pro
```

## 🌐 Prod

- https://www.diy-builder.fr (HTTP 200, vérifié sur les 6 articles + images)
- Vercel auto-deploy sur push main
- Dev local : `cd frontend && npm run dev` (autoPort — souvent 54841 si 3000 occupé)
- Preview MCP : `preview_start("frontend")`
- ⚠️ **Bug connu Preview MCP** : `preview_screenshot` rend du blanc sur les pages
  longues (scroll > ~50 000 px en dev). Vérifier via `preview_eval` (DOM +
  getComputedStyle) à la place, ou ouvrir l'URL directement dans Chrome.

---

## ✅ Ce qui a été fait cette session

### 1. Nouvel article #6 — Pergola + panneaux solaires (commit 44ce073)
`/guides/pergola-panneaux-solaires-diy-2026` (~3 200 mots, 8 H2, 6 tableaux,
JSON-LD Article + Breadcrumb + FAQPage, 3 CTALead vers `/pergola`).

**Fact-check minutieux fait AVANT publication** (8 erreurs corrigées sur sources
officielles CRE / EDF / Légifrance / Photovoltaique.info) :
- Tarif rachat surplus EDF OA : **0,04 €/kWh** au T2 2026 (PAS 0,13)
- Tarif Bleu EDF mai 2026 : **0,1940 €/kWh** (PAS 0,2516)
- Sunology PLAY 2 = **450 Wc à 599 €** (pas 500 Wc/649 €)
- TVA 5,5 % = art. **278-0 bis** CGI (pas 278-0 bis A) + conditions durcies
  arrêté 8 sept 2025 (Certisolis PPE2-V2 < 530 kgCO2eq/kWc, EMS obligatoire,
  pose pro certifiée 1er mars 2026) → quasi-inaccessible en pratique
- Consuel visa Bleu : **186,31 € HT** (pas 175 €)
- ROI recalculé : DIY 8,7-11,3 ans, Pro 12-14 ans (pas 6-7 ans)
- Encadré avertissement projet d'arrêté 2 avril 2026 (suppression prime +
  surplus à 0,011 €/kWh, non encore en vigueur)
- Beem On 500 (429 €), Sunethic F500 (690 €) = confirmés exacts

### 2. Fact-check article existant `/guides/soi-meme-ou-pro` (commit 44ce073)
6 corrections sur sources 2026 :
- Prix artisan terrasse pin 15 m² : **1 200-2 100 €** (80-140 €/m² pose)
- Location bétonnière 100 L : **27-55 €/jour**
- Location tarière thermique : **80-180 €/jour**
- Benne déchets 3-5 m³ : **200-450 €** + IDF 525 € pour 10 m³ DIB
- Cohérence outillage : **340-820 €** partout (était incohérent 350-900 en FAQ)

### 3. Hero images 6 articles satellite (commit 1f4762e)
Images hyperréalistes 1672×941 (ratio identique aux cards), ambiance jardin
golden hour cohérente. Générées par l'utilisateur depuis prompts fournis,
livrées dans `/Users/pelo/Downloads/PNG articles/`, copiées dans
`frontend/public/images/guides/<slug>/hero.png`.
Câblage `next/image` (priority + sizes + alt SEO + borderRadius 12) inséré
entre `content-meta` et `content-lead` dans chaque article.

### 4. Refonte page /guides — stack éditorial (commit 70be9f2)
Section "Aller plus loin" : 5 `<li>` à puces → 5 cards horizontales magazine.
- CSS dans `frontend/styles/simulator.css` (classes `.editorial-stack`,
  `.editorial-card`, `.editorial-image`, `.editorial-meta`, `.editorial-eyebrow`,
  `.editorial-title`, `.editorial-desc`, `.editorial-arrow` + responsive)
- Image 4:3 gauche, eyebrow IBM Plex Mono doré, titre DM Serif, desc 2 lignes
  clampées, flèche →, hairline divider, hover (padding-left + dorures + scale)
- Tokens existants réutilisés (--v6-primary #C9971E, fonts déjà chargées)
- Distinction visuelle : piliers = cards verticales bold / satellites = stack horiz
- **Skill utilisé** : `frontend-design` (Anthropic)

### 5. Alignement fin d'article pergola-solaire (commit 8816730)
Section "Pour aller plus loin" en `<ul>` → `content-related` (aside Voir aussi) +
`content-byline` (signature). Les 6 satellites sont maintenant homogènes.

### 6. Soumission indexation
- **Bing** : 6 URLs soumises via `node scripts/bing-stats.js submit /guides/<slug>`
  (quota 10 000/jour, 9 994 restant). Toutes ✅ crawl prioritaire.
- **GSC** : 6 URLs soumises manuellement par l'utilisateur via Search Console UI
  (le script gsc-stats.js est en scope readonly, pas de submit programmatique).

### 7. Affiliation — démarches lancées
- **Sunology** : compte créé sur UpPromote (Mikael Sans), **PAS ENCORE ACTIVÉ**.
  Bandeau rouge "infos paiement" + "compte non activé". Mail à envoyer à
  `marketing@sunology.eu` (texte préparé en session). Commission 5 %, cookie 7 j.
- **Otovo** : formulaire partenaire commercial soumis (otovo.com/partners — le bon,
  PAS le formulaire installateurs). CPS **940 € net/installation signée**. Champ
  libre rédigé avec ton anti-IA (voir historique). Délai 2-4 sem, restructuration
  Otovo en cours (-46 % effectifs sept 2024) → peut être lent.
- Mémoire confirmée : Awin/Affilae refusés pour GSB FR. Amazon = seul actif.

---

## 📊 Audit Amazon Associates (28/05, EN COURS — à finir)

Données reçues (3 CSV Associates Central, période 26/05 uniquement) :
- **13 clics, 0 conversion, 0,00 €** — tous catégorie "others"
- Sur 13 clics, 0-1 conversion est mathématiquement normal (taux FR 1-3 %)

**Architecture interne (saine) :**
- Tag : `diybuilder01-21` dans `frontend/lib/projectTools.js`
- `buildAmazonUrl(query, asin, subtag)` : gère ASIN direct + query fallback + `ascsubtag`
- Sub-tags format `[module]-[zone]-[tier]` (ex `terrasse-kit`, `pergola-pdf-tool`)
- Liens placés UNIQUEMENT dans `ProjectTools.jsx` (simulateurs) + `pdfKitSection.js` (PDF)
- 45 outils en ASIN direct (39 %) / 70 en query search (61 %)

**🚨 Problème #1 identifié : les 11 guides n'ont AUCUN lien Amazon.**
Or côté Umami 7j, les guides reçoivent ~30 PV (vs 22 pour les simulateurs) =
plus gros trafic du site qui ne monétise rien.

**🚨 Problème #2 : catégorie "others" = mauvais rapport CSV.**
Aller chercher le **"Sub-Tag Report"** sur partenaires.amazon.fr (PAS le
Tracking ID Report) pour ventiler les 13 clics par module.

**Plan d'action proposé (priorisé) :**
- B (5 min) : récupérer le Sub-Tag Report pour comprendre la provenance des clics
- A (2-3 h) : composant `<AmazonToolCard asin>` + blocs "Outils recommandés" dans
  les 5 guides PILIERS (cabanon, pergola, terrasse, cloture, dalle), sub-tag
  `[module]-guide`. Les satellites attendent Sunology/Otovo pour leurs CTAs propres.
- C (2 h) : convertir les 70 outils query → ASIN direct (convertit 3-5× mieux)
- D : CTA "kit complet sur Amazon" en fin d'article
- E : Amazon reste commodité outils (~3 %), le revenu vient d'Otovo/Sunology

**Recommandation : ne pas sur-investir Amazon. Faire B puis A, le reste après
seuil 1 500 PV/mois. Le revenu cible = Otovo (gros ticket) sur les guides solaire.**

L'utilisateur n'a pas encore tranché A/B/C. Reprendre par : "où en est l'audit Amazon".

---

## 🎯 Chantiers ouverts pour la prochaine session

### 1. Finir l'audit Amazon → action A (blocs outils dans guides piliers)
Créer `<AmazonToolCard>` réutilisant `buildAmazonUrl()`, l'insérer dans les 5
guides piliers. Voir section audit ci-dessus.

### 2. Relance Sunology (J+3, soit ~30/05)
Si pas de retour, mail `marketing@sunology.eu`. Dès activation : récupérer le lien
affilié unique → l'intégrer dans l'article pergola-solaire (remplacer la note de
transparence § 4 par `<AffiliateLink>` conformes loi 2023-451) + section § 4
comparatif kits + mettre à jour `/charte-affiliation` (passer "1 programme actif"
à "2-3", ajouter section Sunology).

### 3. Suivi Otovo (~10-20 juin)
Préparer dashboard GSC + Umami pour la visio de qualification. Dès validation :
bloc CTA "Comparer 3 devis installateurs RGE" en bas de l'article pergola-solaire.
Plan B si refus : Effiliation (Effy) — créer compte sur effiliation.com.

### 4. Pipeline éditorial #7 à #10 (4 articles restants sur 10)
| # | Slug | Type | Pilier |
|---|---|---|---|
| 7 | `/guides/pergola-adossee-vs-autoportee` | Comparatif | pergola |
| 8 | `/guides/hauteur-cloture-loi-2026` | Guide | clôture |
| 9 | `/guides/cout-artisan-cabanon` | Comparatif | diy-vs-pro |
| 10 | `/guides/isoler-cabanon-atelier` | Guide | cabanon |

Idées supplémentaires recherchées le 27/05 (fort potentiel SEO + actualité) :
- `recuperateur-eau-pluie-installation-diy-2026` (saisonnier mai-juin, fort volume)
- `abri-jardin-sans-declaration-5m2-regles-2026` (durcissement PLU 2026)
- `carport-solaire-bois-recharger-voiture-electrique-2026` (niche peu travaillée)

**Méthode obligatoire à chaque article :**
1. Utiliser le playbook `~/.claude/playbooks/affiliate-editorial-fr.md`
   (pipeline 7 passes) OU le skill `editorial-seo-fr`
2. **Fact-check minutieux AVANT publication** — l'utilisateur l'exige
   explicitement ("aucun chiffre inventé"). Croiser CHAQUE chiffre contre
   sources officielles. Méthode validée cette session.
3. Hero image 1672×941 golden hour (prompts dans l'historique — style cards,
   pas le 3D des hero-assemble). L'utilisateur génère, dépose dans
   `/Users/pelo/Downloads/PNG articles/`, on copie + câble.
4. Fin d'article : `content-related` + `content-byline` (pattern satellite)
5. Ajouter au sitemap.js + lien dans /guides (stack éditorial) + lien dans le
   pilier concerné (aside Voir aussi)
6. Soumettre à Bing (`node scripts/bing-stats.js submit`) + GSC UI

### 5. Re-audit GSC + Umami à J+5-7 (mesure effet hero images)
Mesurer si les hero améliorent l'engagement : % rebond, temps moyen sur page,
% scroll. Commandes habituelles :
```bash
node scripts/gsc-stats.js performance 7d
node scripts/gsc-stats.js pages 7d
node scripts/bing-stats.js performance 7d
# Umami via curl direct (voir handoff 25/05 pour le pattern)
```

### 6. Citations IA — continuer le monitoring GEO
Au 27/05 : ChatGPT a cité 2 pages distinctes (`/guides/cabanon` 24/05,
`/guides/dalle` 25/05) via referrer `chatgpt.com` dans Umami. Toujours rien
sur Perplexity / Claude.ai / Gemini. C'est le 1er signal GEO réel.

---

## 📈 État monitoring (au 27/05)

**GSC 7j (20-26 mai) :** 16 clics · 303 imp · CTR 5,28 % · pos 8,6
- Décollage depuis le 18/05 (soumission sitemap)
- Top pages : /guides/pergola (4 clics), /pergola (4), /guides/cabanon (3)
- Patch meta /calculateur + /cloture du 24/05 → 1er clic chacun (effet positif)
- `/guides/prix-terrasse-bois-m2-2026` en pos 3,9 = futur top driver

**Umami 28j :** 332 PV · 129 visiteurs · 167 visites (+168 % vs handoff 124 PV)
- 7j : 126 PV / 49 visiteurs (+282 %)
- ~62 % audience FR, US+PL = bots probables

**Bing 7j :** 1 clic · 48 imp (×6 vs handoff). Démarrage, pas d'urgence.

---

## ⚠️ Pièges et notes (rappel + nouveaux)

### Exigences utilisateur fortes
- **FACT-CHECK obligatoire avant toute publication** — vérifier chaque chiffre
  sur source officielle, JAMAIS inventer. Exigence explicite répétée.
- **Pas d'anglicismes** dans le contenu FR visible (marque "DIY Builder" exceptée).
- **Anti-IA strict** dans les textes (champ libre, articles) : pas de phrases-
  gabarit ("plongeons dans", "écosystème", "robuste", "synergie"), pas de listes
  à 3 puces systématiques, chiffres précis, avis tranchés, limites honnêtes.

### Affiliation — logique validée
- Ne s'affilier qu'à des marchands avec **site .fr/.eu localisé, stock UE,
  SAV FR, normes CE/NF/DTU**. Sinon conversion nulle sur audience FR.
- Otovo = norvégien au siège mais Otovo France SAS (Paris), installateurs RGE
  locaux → OK pour FR. NE PAS utiliser otovo.com (anglais) mais otovo.fr.
- Écarter : ALLPOWERS/Awin (refus probable + stock Chine), Sunjoy US, marketplaces
  internationales.

### Technique
- **Fichiers protégés** : `lib/deckEngine.js`, `deckConstants.js`, `deckGeometry.js`,
  `foundation/foundationCalculator.js` — NE JAMAIS modifier.
- **Push direct main** = workflow normal (projet solo). Si le classifier bloque,
  demander confirmation user et relancer (jamais contourner). Vu cette session :
  le classifier a bloqué une fois, débloqué après "ok" explicite.
- **Cache .next fragile** : pas de `npm run build` pendant `npm run dev`.
- **ESLint strict** : apostrophes/guillemets échappés en JSX (`&apos;`).
  Toujours lint avant commit : `npx eslint <fichiers>`. ESLint ne parse pas le
  CSS (erreur normale sur simulator.css, l'ignorer).
- **Preview screenshot bug** sur pages longues (voir section Prod).
- **CSV Amazon** : le "Tracking ID Report" groupe tout en "others". Pour ventiler
  par module, prendre le "Sub-Tag Report" sur partenaires.amazon.fr.

### Scripts SEO (auth — voir handoff 25/05 pour détails)
- GSC : ADC user via gcloud, scope readonly + cloud-platform. Token expire ~7j en
  dev → `gcloud auth application-default login --scopes='...webmasters.readonly,...cloud-platform'`.
  Quota project `diy-builder-gsc`. Header X-Goog-User-Project géré par le script.
- Bing : API key 32 chars, propriété apex `https://diy-builder.fr/` (sans www).
- Fichiers sensibles gitignorés : `frontend/.env.local`, `*-service-account.json`,
  `~/.config/gcloud/application_default_credentials.json`.

---

## 🗂️ Fichiers clés touchés cette session

```
frontend/app/guides/pergola-panneaux-solaires-diy-2026/page.jsx  (créé)
frontend/app/guides/soi-meme-ou-pro/page.jsx                     (fact-check + hero)
frontend/app/guides/comparer-devis-travaux/page.jsx              (hero)
frontend/app/guides/permis-cabanon-seuils-2026/page.jsx          (hero)
frontend/app/guides/prix-terrasse-bois-m2-2026/page.jsx          (hero)
frontend/app/guides/terrasse-piscine-bois/page.jsx               (hero)
frontend/app/guides/page.jsx                          (refonte stack éditorial)
frontend/app/guides/pergola/page.jsx                  (lien aside vers nouvel article)
frontend/app/sitemap.js                               (+ entrée pergola-solaire)
frontend/styles/simulator.css                         (+ classes editorial-*)
frontend/public/images/guides/<6 slugs>/hero.png      (6 images)
```

## 🔑 Fichiers de référence à connaître pour Amazon
```
frontend/lib/projectTools.js          buildAmazonUrl() + tag + 115 outils/conso
frontend/lib/amazonRatings.js         snapshot notes Amazon par ASIN
frontend/components/simulator/ProjectTools.jsx   placement liens (simulateurs)
frontend/components/simulator/ExportPDF/pdfKitSection.js  liens dans PDF
```

---

## 🚀 Reprendre dans la nouvelle session

Dire : « Lis `.claude/SESSION-HANDOFF-2026-05-28.md` ».

Puis selon le besoin :
- « audit amazon » → finir l'audit, action A (blocs outils dans guides piliers)
- « article 7 » → écrire `/guides/pergola-adossee-vs-autoportee` (pipeline +
  fact-check obligatoire + hero)
- « sunology activé » → câbler le lien affilié dans pergola-solaire + charte
- « otovo » → préparer la qualification / brancher le bloc devis RGE
- « audit seo » → re-mesurer GSC + Bing + Umami (effet hero images)

Session enregistrée coordinator sous le nom **`DIYB`** (focus : SEO monitoring,
pipeline éditorial, CRO, fact-check, orchestration).

---

*Généré le 28 mai 2026 — fin de session après push du commit 8816730. Tout en
prod, Vercel auto-déployé. Modèle basculé sur Opus 4.8 [1m] pour la suite.*
