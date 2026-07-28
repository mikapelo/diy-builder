# Pipeline éditoriale — DIY Builder

> Version fusionnée, arrêtée le **2026-07-28**.
> Source A : `~/projets/chargeur VE/docs/METHODOLOGY.md` (playbook affiliation FR, 7 passes)
> Source B : skill `anthropic-skills:editorial-seo-fr` (audit /70, POP, 10-10-80, E-E-A-T /40)
>
> Aucune des deux n'était complète seule. Ce document est la référence unique
> pour toute création ou refonte d'article sur diy-builder.fr.

---

## Périmètre — ce qu'on reprend et ce qu'on écarte

Le playbook « chargeur VE » vise le **lancement** d'un site d'affiliation sur
produits **numériques**. Il dit lui-même en Phase 0 : *« Quand ne pas l'utiliser :
produits physiques (Amazon) »*.

| Phase du playbook | Statut ici | Pourquoi |
|---|---|---|
| Phase 0-2 (niche, persona site, choix des programmes) | ❌ écarté | DIY Builder est établi (23 guides) ; affiliation physique 3-4 % via Amazon/Awin déjà en place. Les seuils « commission ≥ 20 € / cookie ≥ 30 j » ne transposent pas. |
| **Phase 3 (qualification mots-clés)** | ✅ repris | |
| **Phase 5 (production, 7 passes)** | ✅ repris intégralement | |
| Phase 6-7 (déploiement, lead magnet) | 🟡 partiel | infra déjà en place ; séquence email existante |
| **Phase 8 (mesure, kill-criteria)** | ✅ repris | adapté aux seuils du site |

---

## Règle non négociable — fact-check

Toute page passe par une **passe de fact-check finale**, **automatiquement**, sans
qu'on ait à la demander.

Méthode : relire le **texte FINI**, claim par claim — chaque chiffre, spec, prix,
date, point légal, fait nommé — et vérifier chacun sur **≥ 2 sources indépendantes**.
Corriger ou nuancer ce qui ne tient pas, puis **montrer la vérification** sous la
forme `claim → sources → verdict ✓/⚠️`.

- ❌ **Pas de raccourci** « déjà vérifié pendant la recherche amont ». On vérifie le
  **texte publié lui-même**.
- Toute fourchette ou ordre de grandeur est **étiquetée comme telle** ; jamais une
  estimation présentée comme un fait dur.
- **Pourquoi** : une seule spec fausse sur une page YMYL fait s'effondrer l'E-E-A-T
  de **tout le domaine** (Helpful Content Update).

---

## Phase 3 — Qualification des mots-clés

> ⚠️ **GSC est un rétroviseur.** Il ne montre que les requêtes où le site classe
> *déjà*. Une vraie zone blanche y est à **zéro impression**, donc invisible.
> Pour trouver du neuf, les 4 outils prospectifs ci-dessous sont obligatoires.
> GSC sert à la **capture** (§ Passe 8), pas à la découverte.

Quatre vérifications par candidat, toutes gratuites :

1. **Google Suggest** — `WebFetch https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&q=MOTCLE`
   → les variantes longue traîne **réelles**, jamais inventées.
2. **SERP** — `WebSearch "mot-clé"` : top 10, force des domaines, présence d'AI Overview.
3. **Reddit / forums FR** — `WebSearch "site:reddit.com mot-clé"` + BricoZone, ForumConstruction.
4. **Google Trends** — tendance 12 mois, comparaison relative.

### Grille de notation

| Critère | Score | Détail |
|---|---|---|
| Demande relative | 1-5 | Trends + volume SERP |
| KD estimé | 1-5 | Wikipedia/gros médias/GSB en top 10 = 5 · Reddit/forums en top 10 = 1-2 |
| AI Overview | bool | présent = **-1** au verdict |
| Intent | trans/info/mixte | transactionnel = +1 |
| **Adéquation produit** | bool | *(ajout DIY Builder)* un simulateur 3D + BOM répond-il à la requête ? Atout fort et différenciant. |

**Verdict** : 🟢 GO si score ≥ 7 **et** KD ≤ 3 · 🟡 MAYBE si 5-6 ou KD 4 ·
🔴 NO si KD = 5, intent purement informationnel, SERP verrouillée par de gros
médias, **ou recoupement avec une page existante**.

---

## Phase 5 — Production : les 7 passes

Ordre figé. Pas de raccourci, pas de fusion.

### Passe 1 — Brief stratégique
Persona **unique** (budget, douleur, vocabulaire), intent, angle différenciant,
cluster d'appartenance, mot-clé principal + 3-5 variantes longue traîne, blocs
affiliés visés.
→ **Trancher ici le tutoiement / vouvoiement / neutre.** Jamais mélanger ensuite.

### Passe 2 — Outline structuré
H1/H2/H3, intent par section, 600-800 mots de plan, tableaux comparatifs
identifiés, FAQ 5-6 questions prévues, emplacements CTA marqués.
**Livrable séparé, validé avant d'écrire.**

### Passe 3 — Rédaction
Cible **2 500-3 500 mots**. Frontmatter complet, liens affiliés en `rel="sponsored"`,
disclosure conforme loi 2023-451.

**Règle 10-10-80** : 10 % bases · 10 % contexte concurrentiel · **80 % unique**.
Test du « Et alors ? » après chaque paragraphe : si l'info est sur dix autres pages,
couper ou réécrire. **Minimum 6 chiffres mesurés** par article, insights uniques
dans le **premier tiers**.

**Anti-IA — interdits :**
- « plongeons dans », « à l'ère du », « naviguer dans le paysage », « il convient de
  souligner », « synergie », « écosystème florissant », « robuste », « puissant »,
  « innovant »
- anglicismes parasites : leverager, scaler, onboarder, deliverable
  → utiliser, monter en charge, intégrer, livrable
- listes de **3 puces** systématiques → 2, ou 4, ou rien
- « premièrement / deuxièmement » → « d'abord / ensuite / le dernier »
- emoji dans le corps

**Anti-IA — imposés :** phrases courtes (8-12 mots) alternées avec une longue ·
voix active dominante · chiffres précis (pas « abordable » → « 22 €/mois ») ·
noms explicites (pas « certaines enseignes » → « Leroy Merlin et Brico Dépôt ») ·
avis tranchés · **2-3 limites honnêtes** (sans elles, ça sent l'IA).

### Passe 4 — Conversion / CRO
Au moins **1 CTA dans le tiers haut + 1 dans le tiers bas + 1 capture inline**.
Microcopy persuasive. **Zéro dark pattern** — pas de fausse urgence, pas de faux stock.
⚠️ Jamais de lien affilié en tête de guide de construction, ni après une règle YMYL.

### Passe 5 — SEO / GEO / Schémas
Meta title/description (~60/160), JSON-LD (Article + FAQPage + BreadcrumbList,
**écrits à la main** car dépendants du fact-check), TL;DR citable en début,
H2 auto-suffisants, canonical, OG.

**GEO** : réponse de 40-60 mots en ouverture de chaque section · FAQ balisée ·
affirmation + preuve **datée et nommée** · entités précises (normes, DTU, modèles) ·
sources de moins de 12 mois.

**Hiérarchie POP** — corriger dans l'ordre A → B → C → D :

| Groupe | Éléments | Poids |
|---|---|---|
| **A — critique** | `<title>`, **`<h1>`**, corps, URL | un fix A > dix fix C |
| **B — important** | H2-H4, ancres internes | après que A soit propre |
| **C — support** | gras, italique, `alt` | mineur |
| **D — minimal** | JSON-LD, OG, meta description | ne classe pas ; la meta joue le CTR |

> Contre-intuitif : la **position** du mot-clé dans le `<title>` est sans effet —
> seule sa **présence** compte.
> Exception YMYL : sans aucun signal E-E-A-T, traiter l'E-E-A-T **avant** le groupe D.

**Règles title / H1** *(issues de la passe capture du 28/07)* :
- title et H1 couvrent deux variantes **sœurs**, jamais la même formulation.
- **Ne pas toucher au `<title>` d'une page au-dessus de sa norme positionnelle** —
  n'enrichir que le H1.
- **L'URL n'est jamais modifiée** si la page classe déjà.

### Passe 6 — Audit qualité
**Anti-cannibalisation d'abord** : confronter aux pages existantes. Un
recoupement = on ne publie pas, on **enrichit l'existant**.

Puis score **/70** sur 7 dimensions (/10 chacune) : gain d'information ·
profondeur sémantique · E-E-A-T · lisibilité · SEO on-page (ordre POP) ·
engagement · conversion. Sur YMYL, ajouter l'E-E-A-T **/40**.

| Score /70 | Décision |
|---|---|
| 56-70 | publiable |
| 42-55 | corriger les gains rapides d'abord |
| < 42 | réécriture complète |

Enfin le **fact-check** (voir règle non négociable ci-dessus).

### Passe 7 — Visuels
Hero 1672×941 (Midjourney → `ffmpeg`, pas d'ImageMagick installé) ·
tableaux comparatifs en **composant React, jamais en image** · OG dynamique.

### Checklist de publication
- [ ] Frontmatter complet · [ ] TL;DR citable · [ ] ≥ 1 tableau comparatif
- [ ] FAQ 3-5 questions balisée · [ ] ≥ 1 lien interne · [ ] disclosure visible
- [ ] liens affiliés en `rel="sponsored"` · [ ] JSON-LD validé
- [ ] fact-check montré (claim → sources → verdict) · [ ] Lighthouse > 90

### Passe 8 — Soumission & mesure
`node scripts/indexnow-submit.js /guides/<slug>` (Bing, Yandex, Seznam, Naver —
**pas Google**, qui recrawle seul) · GSC Request Indexing · re-mesure à **J+14**.

⚠️ **Ne jamais lire un « 0 clic » sans le confronter à l'espérance positionnelle.**
26 impressions en position 9,8 → espérance ≈ 0,7 clic : obtenir 0 n'est pas un
signal, c'est du bruit de petit volume.

---

## Mapping des skills

| Passe | Skill |
|---|---|
| Phase 3 | `aaron-seo-geo:keyword-research`, `serp-analysis` · WebSearch/WebFetch à la main |
| Passe 1-2 | `claude-blog:blog-brief`, `blog-outline`, `blog-persona` |
| Passe 3 | **`anthropic-skills:editorial-seo-fr`** (référence) · `marketing-skills:copywriting` |
| Passe 4 | `marketing-skills:cro`, `marketing-psychology` |
| Passe 5 | `claude-blog:blog-seo-check`, `blog-geo`, `blog-schema` |
| Passe 6 | `claude-blog:blog-factcheck`, `blog-cannibalization`, `blog-audit` |
| Passe 7 | `frontend-design` · hero à la main (pas de MCP Gemini connecté) |

Cf. `.claude/skills-mapping.md` pour l'inventaire complet installé/activable.
