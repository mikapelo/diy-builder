# Audit cluster éditorial — Mots-clés + Rédaction

> Date : 2026-05-30
> Périmètre : 11 articles publiés (5 piliers + 6 satellites, ~7 064 lignes JSX)
> Méthode : 2 sous-agents Sonnet dispatchés en parallèle selon SESSIONS.md
> Skills mobilisés (cf. `.claude/skills-mapping.md`) :
> - **/mots-clés** : `aaron-seo-geo:keyword-research`, `serp-analysis`, `content-gap-analysis`, `claude-blog:blog-cannibalization` + 7 WebSearch SERP réelles
> - **/rédaction** : `editorial-seo-fr` (audit-de-page /70 + E-E-A-T /40 + anti-IA scoré + info-gain 10-10-80), `claude-blog:blog-analyze`, `blog-factcheck`, `blog-audit`, `aaron-seo-geo:audit`, `on-page-seo-auditor`, `content-quality-auditor`
> Mode : Tier 1 manual-data (pas de MCP SEMrush/Ahrefs)

---

## 1. Score global cluster

| Phase | Score | Health label | Trend |
|---|---|---|---|
| **/mots-clés** | 6,5 / 10 | Acceptable, gaps fixables | Maillage interne faible + 2 cannibalisations identifiées |
| **/rédaction** | 7,8 / 10 | Solide | E-E-A-T cohérent, zéro vocab IA niveau 1, observations terrain présentes |
| **Combiné** | **7,15 / 10** | Solide avec corrections ciblées | 3 quick wins éliminent l'essentiel du déficit |

Pas de niveau critique. Pas de blocage publi. Le cluster est dans une zone « solide qui peut devenir excellent avec 4-6 h de travail correctif ».

---

## 2. Tableau récap des 11 articles (deux phases croisées)

| # | Article | MC principal ciblé | Intent | Pos. est. | E-E-A-T | Anti-IA | Info gain | On-page | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | terrasse (pilier) | construire terrasse bois | info/how-to | 8-15 | 33/40 | Faible | Vert | 9/10 | Publiable, gap Confiance (disclo affiliation) |
| 2 | cabanon (pilier) | construire cabanon ossature bois | info/how-to | 6-12 | 35/40 | Faible | Vert | 9/10 | Publiable ✓ |
| 3 | pergola (pilier) | construire pergola bois | info/how-to | 5-10 | **30/40** | Faible | Orange | 8/10 | Sous seuil YMYL → 3 corrections |
| 4 | clôture (pilier) | construire clôture bois | info/how-to | 8-15 | 34/40 | Faible | Vert | 9/10 | Publiable ✓ |
| 5 | dalle (pilier) | couler dalle béton extérieure | info/how-to | 4-8 | 36/40 | Faible | Vert | 8/10 | Publiable ✓ |
| 6 | soi-meme-ou-pro | faire soi-même ou artisan | commercial inv. | 12-20 | 36/40 | Faible | Vert | 9/10 | Publiable ✓ (sourcing tarifs) |
| 7 | prix-terrasse-m²-2026 | prix terrasse bois m2 2026 | commercial inv. | 10-18 | 35/40 | Faible | Vert | 9/10 | Publiable ✓ |
| 8 | comparer-devis-travaux | comparer devis travaux artisan | commercial inv. | 15-25 | 33/40 | Faible | Vert | 9/10 | Sourcer « 60 % des litiges » |
| 9 | permis-cabanon-seuils-2026 | permis cabanon jardin 2026 | info/réglementaire | 12-20 | 35/40 | Faible | Vert | 9/10 | Publiable ✓ |
| 10 | terrasse-piscine-bois | terrasse bois piscine | info spécialisé | 8-15 | 34/40 | Faible | Vert | 9/10 | Publiable ✓ |
| 11 | pergola-panneaux-solaires | pergola panneaux solaires DIY | info+commercial | 6-12 | 35/40 | Faible (5 pts max) | Vert | 8/10 | Quelques URLs sources à ajouter |

Légende anti-IA : 0-5 Faible · 6-12 Moyen · 13-20 Élevé · 21+ Critique
Légende E-E-A-T : ≥32/40 publiable YMYL · <32 corriger gaps

---

## 3. Top forces du cluster

1. **dalle** (36/40) — calculateur interactif avec prix scrapés réels, 6 SVG illustratifs originaux, DTU 13.3 référencé par H2
2. **soi-meme-ou-pro** (36/40) — tableau décision multi-projets chiffré, ton conversationnel anti-IA, disclosure biais de calcul honnête
3. **cabanon** (35/40) — SVG ossature inline custom, observations terrain « cabanons branlants après 3 hivers », DTU 31.2 §9.2.2
4. **prix-terrasse-m²-2026** (35/40) — comparatif enseigne × essence ligne à ligne, écarts chiffrés (« 23 % d'écart Brico Dépôt vs Leroy Merlin »)
5. **permis-cabanon-seuils-2026** (35/40) — distinction zone U/hors U/PLU rare, références R421-2/R421-5/R431-2 précises

**Signal anti-IA très positif** : **zéro phrase-gabarit niveau 1** sur tout le corpus (« il convient de noter », « plongeons dans »…). Indique une édition rigoureuse.

---

## 4. Top risques identifiés (convergence des 2 audits)

### Risque #1 — Cannibalisation interne (Mots-clés)

| Paire | MC commun | Verdict |
|---|---|---|
| `/guides/cabanon` ↔ `/guides/permis-cabanon-seuils-2026` | « permis cabanon » | **Action requise** — réduire le H2 réglementation du pilier à 2-3 lignes + CTA vers satellite |
| `/guides/pergola` ↔ `/guides/pergola-panneaux-solaires-diy-2026` | « pergola bois » | **Action requise** — retirer/minifier la partie structure bois générique du satellite, renvoyer vers pilier |

3 autres paires sous surveillance (terrasse pilier ↔ prix-terrasse, terrasse-piscine ↔ prix-terrasse, soi-meme-ou-pro ↔ comparer-devis) sans action immédiate requise.

### Risque #2 — Disclosure affiliation manquante (Rédaction)

4 des 5 piliers ont un `<GuideToolsBlock>` Amazon en bas mais **aucune mention de disclosure avant ou après**. Signal négatif pour Quality Raters Google + non-conformité loi 2023-451 (signalement des liens commerciaux). Concerne : terrasse, cabanon, pergola, clôture, dalle.

### Risque #3 — Pergola pilier sous seuil E-E-A-T (Rédaction)

Seul article du corpus à 30/40 (sous le seuil 32 YMYL). Gaps :
- Expérience faible : 1 seule observation terrain enterrée dans le texte
- Autorité : ne cite pas l'article de code (R421-1 ou R421-17)
- Lien /methodologie présent en meta mais pas dans le corps

### Risque #4 — Chiffres orphelins ou erronés (Rédaction)

| Chiffre | Article | Action |
|---|---|---|
| « 60 % des litiges devis-facture » | comparer-devis-travaux | **Sourcer ou reformuler en « la majorité »** |
| Douglas « classe 3-4 » | terrasse + prix-terrasse-m²-2026 | **Corriger en « classe 3 »** (norme EN 350-2) |
| Prime 80 €/kWc + tarif 0,04 €/kWh OA + arrêté 8 sept 2025 TVA 5,5 % | pergola-solaire | **Ajouter URLs cliquables CRE + Légifrance dans le corps** |
| 80-140 €/m² pose terrasse artisan | soi-meme-ou-pro | **Ajouter URLs Travaux.com + Prix-pose.com** |
| Amende 45 000 € piscine | terrasse-piscine | Vérifier article exact CCH |

### Risque #5 — Maillage interne faible (Mots-clés, 4/10)

Les paires complémentaires existent en structure mais ne sont pas explicitement liées dans le contenu. Exemples :
- `/guides/soi-meme-ou-pro` ne pointe pas vers `/guides/comparer-devis-travaux` (séquence logique amont→aval)
- `/guides/terrasse` (pilier) ne pointe pas vers `/guides/prix-terrasse-bois-m2-2026` ni `/guides/terrasse-piscine-bois`
- `/guides/pergola` (pilier) ne pointe pas vers `/guides/pergola-panneaux-solaires-diy-2026`

### Risque #6 — Patterns structurels IA détectables

- **Pattern #3 (topic-sentence systématique)** dans 7/11 articles : chaque paragraphe ouvre sur sa phrase-thèse. Score faible aujourd'hui mais détectable à grande échelle.
- **Pattern #2 (règle de trois)** récurrent dans pergola-solaire et pergola pilier.
- **Couverture symétrique** dans terrasse, pergola, clôture (sections de longueur homogène).

---

## 5. Gaps thématiques (sujets non couverts à fort potentiel)

| # | Sujet gap | MC | Pilier | Priorité |
|---|---|---|---|---|
| G1 | Tarif pose terrasse bois artisan | « tarif pose terrasse bois artisan » | terrasse (satellite) | **Haute** — intent commercial, SERP non occupée par DIY |
| G2 | Ancrage poteau clôture béton | « ancrage poteau clôture béton » | clôture (satellite) | **Haute** — clôture n'a aucun satellite, gap structurel |
| G3 | Entraxe lambourdes terrasse | « entraxe lambourdes terrasse bois » | terrasse | Moyenne — long-tail GEO |
| G4 | Extension cabanon existant | « agrandir cabanon de jardin » | cabanon | Moyenne — intent transactionnel lead |
| G5 | Clôture occultante composite vs bois | « clôture occultante bois composite prix » | clôture (satellite) | Moyenne — SERP comparatif vide |
| G6 | Fondations cabanon (dalle/plots/longrines) | « fondations cabanon jardin » | cabanon | Basse-moyenne |
| G7 | Permis terrasse bois | « déclaration terrasse bois permis » | terrasse | Basse — Service-Public imbattable |

**Déséquilibre piliers/satellites :** terrasse a 3 satellites (prix + piscine + bientôt #9 cout-artisan), pergola a 1 satellite (solaire + bientôt #7 adossée), cabanon a 1 satellite (permis + bientôt #10 isoler), **clôture a 0 satellite**, dalle a 0 satellite (= pilier orphelin de fait).

---

## 6. Pipeline éditorial restant — verdict reordonnancement

État actuel du pipeline (cf. handoff 28/05) :
- #7 pergola-adossee-vs-autoportee
- #8 hauteur-cloture-loi-2026
- #9 cout-artisan-cabanon
- #10 isoler-cabanon-atelier

+ brief de cette session (29/05) : carport-solaire-bois-recharger-voiture-electrique-2026 (top 1 de la passe /mots-clés précédente)

| Article | Verdict audit |
|---|---|
| **carport-solaire-bois-ve-2026** | **Garder en top priorité** — synergie Otovo + recyclage matière #6, mais attention cannibalisation possible avec pergola-solaire |
| #7 pergola-adossee-vs-autoportee | Maintenir, MC distinct du pilier |
| #8 hauteur-cloture-loi-2026 | Maintenir mais reformuler — Service-Public bat le sujet sur info pure → angle « jurisprudence voisinage + servitude + PLU concret » |
| #9 cout-artisan-cabanon | Maintenir — gap G1-équivalent pour cabanon, distinct de soi-meme-ou-pro |
| #10 isoler-cabanon-atelier | Maintenir, MC distinct, pas de chevauchement |

**Ordre suggéré par l'audit** : carport-solaire → #8 (hauteur clôture, corrige risque cannibal pilier clôture si H2 reformulé) → #7 (pergola adossée) → #9 (coût artisan cabanon) → #10 (isolation cabanon).

**Alternative recommandée** : intercaler 1 satellite clôture avant #7-#10 (Gap G2 ancrage poteau clôture béton) pour équilibrer le cluster — clôture est sous-représenté (0 satellite publié à ce jour).

---

## 7. Plan d'action priorisé

### Quick wins (faisables en 2-4 h, max ROI)

| # | Action | Fichiers | Effort | ROI |
|---|---|---|---|---|
| Q1 | Ajouter disclosure affiliation avant `<GuideToolsBlock>` dans 5 piliers | terrasse, cabanon, pergola, clôture, dalle | 30 min | **Très fort** (confiance + conformité 2023-451) |
| Q2 | Corriger « douglas classe 3-4 » → « classe 3 » | terrasse, prix-terrasse-bois-m²-2026 | 10 min | Fort (expertise factuelle) |
| Q3 | Sourcer ou reformuler « 60 % des litiges » | comparer-devis-travaux | 15 min | Fort (confiance YMYL-adjacent) |
| Q4 | Réduire H2 réglementation du pilier cabanon, CTA vers satellite permis | cabanon | 30 min | Fort (anti-cannibalisation) |
| Q5 | Ajouter blocs « Pour aller plus loin » dans pilier terrasse + pergola pointant vers leurs satellites | terrasse, pergola | 45 min | Fort (maillage + dwell time) |

### Actions moyenne (effort 1-2 h chacun)

| # | Action | Fichiers | ROI |
|---|---|---|---|
| M1 | Réduire la partie structure bois générique dans pergola-solaire, renvoyer vers pilier pergola | pergola-panneaux-solaires-diy-2026 | Fort (anti-cannibalisation) |
| M2 | 3 corrections E-E-A-T pergola pilier : déplacer observation 90 km/h en proéminence, citer R421-17, ajouter mesure terrain chiffrée | pergola | Moyen (pousse 30→33+) |
| M3 | Ajouter URLs cliquables CRE + Légifrance + Enedis dans le corps de pergola-solaire | pergola-panneaux-solaires-diy-2026 | Fort (YMYL fiscal) |
| M4 | Ajouter URLs Travaux.com + Prix-pose.com dans soi-meme-ou-pro | soi-meme-ou-pro | Moyen (sourcing) |

### Actions stratégiques (cluster)

| # | Action | Effort | ROI |
|---|---|---|---|
| S1 | Créer 1 satellite clôture (gap G2 ancrage poteau béton) avant de poursuivre le pipeline pergola/cabanon | rédaction 4-6 h | Fort (équilibre cluster) |
| S2 | Reformuler le brief #8 hauteur-clôture pour angle « jurisprudence + servitude + PLU concret » (vs info pure) | revue brief 30 min | Moyen |
| S3 | Surveiller le pattern « topic-sentence systématique » sur les nouveaux articles (passe 2 anti-IA obligatoire) | par article | Moyen |

---

## 8. Convergence des 2 audits

**Points où les 2 phases sont d'accord** (forte confiance) :
- Pergola pilier est le maillon le plus faible (30/40 + 5-10 position est. + manque observation terrain)
- Pergola-solaire et pergola-pilier ont des risques de cannibalisation et patterns IA récurrents (règle de 3)
- Maillage interne est un déficit transverse (faible côté SEO, lien manquant côté éditorial)
- Le cluster terrasse est sur-représenté, clôture sous-représenté
- Aucun article n'est en zone critique (pas de refus de publi rétroactif)

**Points divergents** (à arbitrer si on continue) :
- Agent 1 propose un satellite « ancrage poteau clôture » prioritaire ; Agent 2 ne l'évoque pas
- Agent 2 met le focus sur disclosure affiliation ; Agent 1 ne l'évoque pas (hors périmètre mots-clés)
→ Pas de conflit, complémentarité.

---

## 9. Render audit health (cf. runtime note hook)

> Format plain language demandé par le hook runtime.

**Score : 7,15 / 10 — Solide avec corrections ciblées**

**Page la plus à risque** : `/guides/pergola` (pilier) — E-E-A-T 30/40, sous le seuil YMYL recommandé de 32.
**Prochaine action** : déplacer en proéminence l'anecdote « vent 90 km/h » + citer R421-17 + ajouter une mesure terrain chiffrée. 1-2 h d'édition.

**Top win immédiat** : ajouter le bloc disclosure affiliation avant `<GuideToolsBlock>` dans les 5 piliers. 30 min de travail, signal confiance fort pour Google Quality Raters + conformité loi 2023-451.

**Risque silencieux à surveiller** : pattern « topic-sentence systématique » dans 7/11 articles — score IA bas aujourd'hui mais détectable à grande échelle. Pas urgent.

---

*Audit produit le 2026-05-30 selon protocole SESSIONS.md (2 sub-agents Sonnet parallèles + synthèse Lead). Aucun fichier de code modifié. Sortie analytique uniquement.*
