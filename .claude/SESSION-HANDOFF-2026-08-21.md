# Session handoff — 2026-08-21

`HEAD` = `259319f` · **1 commit non poussé** (voir § Git). Branche `main`.

---

## En une ligne

Le fact-check DTU des guides terrasse et dalle est soldé et en prod ; **le funnel artisan
a produit ses premiers leads** ; et la monétisation par vente de leads est passée du projet
au concret (LeadValue a répondu, Leadrs candidaté, prix de marché connus).

---

## 1. Livré et en production

| Commit | Objet |
|---|---|
| `560acd9` | docs : pipeline éditoriale fusionnée (récupéré du worktree) |
| `43e8424` | docs : handoff 2026-07-29 (récupéré du worktree) |
| `c418f64` | **fix guides terrasse** — retrait des tolérances et portées non vérifiables |
| `cfe7976` | **fix guide dalle** — références NF DTU 13.3 corrigées, conformité non revendiquée |

Vérifié à chaque fois : lint, build, 389/389 tests, rendu DOM, JSON-LD, console.

### Le conflit git du handoff précédent est soldé

Les 3 commits de contenu de `claude/fervent-ramanujan-b2ab1c` étaient **obsolètes** :
la session parallèle (`bd88ec5`) avait déjà fait mieux — toutes les références `§`
fabriquées avaient disparu, et le calcul des plots était exposé. Abandonnés (la branche
existe toujours, rien n'est perdu). Seuls le doc pipeline et le handoff ont été récupérés,
sans conflit.

---

## 2. ⚠️ Le handoff 2026-07-29 se trompait de norme — corrigé

Il affirmait qu'une dalle domestique relève de **P1-1-2** et que le guide citait à tort la
partie industrielle. **Faux, vérifié en direct.**

Le guide traite d'une dalle **extérieure**. C'est **P1-1-1** qui vise « les dallages
extérieurs … ayant un usage autre que voirie ». **P1-1-2 est réservé aux maisons
individuelles, à leurs garages attenants et à leurs sous-sols.** Citer P1-1-1 était donc
**le bon choix** — seule la numérotation dérivait.

| Le guide affirmait | Réalité dans P1-1-1 |
|---|---|
| `§ 7.1` — 95 % Proctor | ✅ **CORRECT** (« Contrôle du support »). 95 % OPN = **q4** ; couche de forme = **q3, 98,5 %** |
| `§ 7.3` — forme 10 cm | ❌ = « Exécution du dallage ». Couche de forme imposée = **0,20 m mini** |
| `§ 5.4` — enrobage 3 cm | ❌ = « Écran antipollution ». Le DTU **ne chiffre pas** l'enrobage → **NF EN 1992-1-1** |
| `§ 6` — 25/40 m² joints | ❌ = « Justification des ouvrages ». Vraie règle **§ 5.6.6** : **plus grand côté 5 m ± 10 %** (6 m sous abri), **béton non armé seulement** |

Deux trouvailles qui changeaient le conseil au lecteur :
- **« Les joints sciés ne sont pas nécessaires pour les dallages en béton armé »** (§ 5.6.6).
  Le guide en prescrivait tout en recommandant un treillis.
- **Le ST25 est en ø 7 mm**, pas ø 6. La norme donne « maille 150 mm, ø 7 mm » en exemple
  pour 120 mm d'épaisseur.

**Le fond n'était pas les numéros** : P1-1-1 est un cadre d'ouvrage professionnel (Tableau 1
d'épaisseurs, **5 cm²/m** d'armatures en béton armé = un ST50, étude géotechnique G11/G2)
qu'une dalle domestique ne tient pas. La page ne revendique plus la conformité DTU.

**Règle qui s'en dégage** : avant de corriger une référence, vérifier **quelle partie de la
norme s'applique**. Se tromper de partie fait condamner du contenu juste.

### Guides terrasse (`c418f64`)

`« planéité ±5 mm sous règle de 2 m (DTU 51.4) »` était affirmé **3 fois** : l'expression
« règle de 2 m » **n'apparaît pas une seule fois** dans le NF DTU 51.4 (elle existe dans
20 autres DTU). La valeur réelle, dans la norme compétente (13.3 P1-1-2) : **7 mm**.
Contradiction interne relevée (±5 puis ±3 dans le même paragraphe). Portées 68/42/53 cm
également retirées : introuvables, elles viendraient des Tableaux 4/5/6 dont le corps n'a
pas survécu à la conversion — et qui s'intitulent « **Exemples** ».

---

## 3. Eurocode 5 — recherche faite

**Absent de `.claude/docs/DTU/`** ; **20 DTU l'invoquent**. `NF EN 1995-1-1`, indice de
classement **P 21-711-1**, + amendements A1:2008 / A2:2014 + annexe nationale
`NF EN 1995-1-1/NA` (P 21-711-1/NA).

Mécanisme : `Rd = kmod × Rk / γM`. **γM = 1,3** bois massif (1,25 lamellé-collé, 1,2 LVL/CTP/OSB).

| kmod bois massif | CS 1 | CS 2 | **CS 3** |
|---|---|---|---|
| Permanente | 0,6 | 0,6 | **0,5** |
| Long terme | 0,7 | 0,7 | **0,55** |
| Moyen terme | 0,8 | 0,8 | **0,65** |
| Court terme | 0,9 | 0,9 | **0,7** |
| Instantanée | 1,1 | 1,1 | **0,9** |

kdef : 0,6 / 0,8 / **2,0**.

**Ce qui compte pour nous** : terrasse, pergola, clôture et cabanon non clos sont **tous en
classe de service 3** — le cas le plus défavorable. Le DTU 51.4 l'impose d'ailleurs
explicitement pour les platelages. L'EC5 **ne contient aucun tableau de portées** : on peut
en citer la méthode et les coefficients, jamais une section.

---

## 4. Trafic — relevé du 21/08 (fenêtre 24/07 → 20/08)

| Indicateur 28 j | 27/07 | **21/08** |
|---|---|---|
| Clics Google | 270 | **288** |
| Impressions | 8 551 | **10 249** (+19,9 %) |
| CTR | 3,16 % | 2,81 % |
| Position moyenne | 8,2 | 11,7 |
| Bing | — | **57 clics**, 1 946 imp |
| Umami visiteurs | — | **924** · 3 140 vues · rebond **71,1 %** (−12,8 pts) |
| Simulations | 40 | **88** |
| Exports PDF | 27 | **35** |

**La position 11,7 n'est pas une sanction** : c'est un effet de mix. Les pages porteuses vont
bien — `/guides/pergola` 67 clics pos 7,7 · `/guides/cabanon` 64 clics pos **6,8** (45 % des
clics à elles deux). Sur les 3 derniers jours la position remonte (10,9 → 9,7 → **8,8**)
pendant que les impressions explosent (580 → 672 → 675).

### Deux pages écrasent les moyennes

| Page | Imp. | Clics | CTR | Pos |
|---|---|---|---|---|
| /guides/hauteur-cloture-loi-2026 | **2 557** | 17 | 0,7 % | **19,0** |
| /guides/terrasse-piscine-bois | 1 653 | 17 | **1,0 %** | 9,1 |

**41 % des impressions pour 12 % des clics.**

⚠️ **Signal négatif sur la passe capture SEO du 28/07** : `terrasse-piscine-bois` était à
**1 384 imp, CTR 2,2 %, pos 7,5** le 27/07. Elle est à **1 653 imp, CTR 1,0 %, pos 9,1**.
Plus d'impressions, mais **CTR divisé par deux et position en recul**. Les fenêtres se
chevauchent, ce n'est pas une preuve — mais à contrôler avant d'étendre la méthode.

### Nouveauté : trafic IA

`chatgpt.com` **15** · `claude.ai` 2 · `copilot.microsoft.com` 2 = **19 visites/28 j**.
Le GEO commence à produire. Aussi : 34 visites Facebook sans campagne, et diversification
réelle (DuckDuckGo 52, Qwant 23, Yahoo 18, Ecosia 17, Brave 13).

France : 263 clics / 288. Mobile 150, desktop 128.

---

## 5. 🎉 Le funnel artisan produit — et le trou qu'il révèle

**2 `lead-submitted`** sur 28 j (compteur Umami). **Un seul est identifié** : SCI,
terrasse **5,50 × 4,50 m = 24,75 m²**, Jura (39).

Chiffrage moteur (transformation `DeckSimulator` reproduite) : 48 lames, 16 lambourdes
(dont **2 doublées**), **126 plots** (5,09/m²), 39 entretoises.
**1 909 € (Brico Dépôt) à 2 250 € (Leroy Merlin)** en matériaux, chute 10 % incluse.
Poste plots : **995 €**, plus de la moitié. Avec pose : **~3 000 à 3 700 €**.

La chaîne réelle :
```
88 simulations → 9 clics « devis » → 9 ouvertures modale → 4 abandons → 2 leads
```
**Modale → lead : 22 %** (bon). Le goulot est **simulation → devis : 10 %**.

### 🔴 `/api/artisan-lead` n'enregistre RIEN

Elle envoie deux mails et retourne `ok`. Aucune persistance. Comparé à `/api/leads`
(téléchargement PDF) qui écrit dans **Redis** avec index `leads:index`, TTL RGPD 1 an et
dashboard admin.

**Le lead à faible valeur est tracé ; celui qui vaut de l'argent ne l'est pas.**
C'est pour ça qu'on ne sait pas identifier le 2ᵉ lead. Correctif : recopier le bloc Redis
de `/api/leads`. **Bloquant** pour prouver la production à une plateforme.

---

## 6. Vente de leads — la piste s'est ouverte

### LeadValue a répondu favorablement

Ils proposent un appel. Feuille de route complète : `.claude/outreach/appel-leadvalue-2026-08-21.md`.

⚠️ **Le piège est dans notre propre mail du 02/06** : on annonçait « projection T3 2026 :
10-30 leads/mois ». On est en plein T3 avec 2 leads. À prendre de front : le trafic a bien
triplé comme annoncé ; c'est la transformation qui n'a pas suivi, cause identifiée
(formulaire absent des guides, corrigé le 23/07, premier lead 12 jours après).

### Audit des plateformes — `.claude/outreach/plateformes-lead-audit-2026-08-21.md`

Source (classement Les Wizards) = **annuaire payant aux enchères**, pas éditorial : le rang
dit qui a payé. 445 fiches, **13** en « vente de leads », **6** sérieuses après tri.

| Plateforme | € / lead | Modèle |
|---|---|---|
| **Leadrs** | 15 – 31 € exclusif | marketplace, **sans engagement minimum** |
| **helloArtisan** | **18 € min garanti** | SIRET obligatoire, paiement 60 j |
| TimeOne Place des Leads | n.c. | bourse, « prospects invendus ou hors cible » |
| 123Devis / DevisProx / ViteUnDevis / Travaux.com | 5,5 – 25 € | comparateurs |

### Leadrs — état réel du compte (vérifié dans l'app)

Formulaire vendeur **envoyé** le 21/08. Mais **le compte est acheteur uniquement** :
« Nos offres », solde 0,00 €, « Ajouter des crédits », et `/integrates` dit explicitement
« Connectez votre CRM pour **recevoir** vos leads ». **Aucun espace vendeur dans l'UI** →
l'activation est **manuelle**, après traitement du formulaire. Relancer sous 4-5 j ouvrés
(texte prêt dans le fil).

**Prix de marché découverts** (ce que Leadrs revend aux acheteurs) :
- **Rénovation de jardins & paysagisme : 26,10 € et 27,00 €**, canal **SEO** ← notre catégorie
- Panneaux solaires 24-32 € · borne de recharge 33 € · fenêtres 23-26 € · volets 21-24 €
- **Le SEO n'est pas décoté** : les meilleures offres sont en SEO pur (33,75 €). L'emailing
  s'effondre (6,60 € une mutuelle).
- ⚠️ **Aucune catégorie terrasse / pergola / clôture / abri**. Rattachement probable
  « Rénovation → jardins & paysagisme », à faire trancher par eux.

Question à poser : **quelle part revient au vendeur sur une offre à 27 €** ?

---

## 7. 🔴 Le blocage qui conditionne toute la monétisation lead

Case de consentement actuelle (`ArtisanLeadModal.jsx`) :

> « … Elles pourront, **avec mon accord**, être transmises à un partenaire spécialisé. »

La transmission est **subordonnée à un accord supplémentaire jamais recueilli**.
**Aucun lead n'est cessible en l'état** — ni à LeadValue, ni à Leadrs, ni à personne.

À refondre pour recueillir le consentement **au moment de la collecte**, en **nommant le
partenaire** (exigence RGPD). Bien présenté, c'est un signal de sérieux face à des éditeurs
souvent approximatifs sur ce point.

---

## 8. Git

`HEAD` = `259319f` — **1 commit en avance sur `origin/main`, pas de moi** :
`chore(prices): scraper run 2026-08-03` (auteur Pelo, 3 août, ne touche que la date dans
`materialPrices.js`). **Non poussé** — à arbitrer.

Non commités : `.claude/outreach/appel-leadvalue-2026-08-21.md`,
`.claude/outreach/plateformes-lead-audit-2026-08-21.md`, et les modifications préexistantes
de `email-alexeo.md` / `email-habitatpresto.md`.

**Ménage non fait** (diagnostic posé, rien touché) : 6 worktrees, dont **5 sans aucun commit
non fusionné** (supprimables) et **3 qui portent du travail non commité contenant encore les
chiffres DTU faux** (`nervous-shannon`, `recursing-volhard`, `clever-fermat`) — les fusionner
tels quels **réintroduirait l'erreur en prod**. Checkout principal : 78 suppressions non
commitées (réorganisation `scripts/reels/` vers `_finals/`), 62 non suivis, **590 Mo** de
vidéos dont certaines suivies par git.

---

## À faire, par ordre

1. **Persistance Redis sur `/api/artisan-lead`** — 2 leads passés, 1 identifiable. Bloquant
   pour prouver la production à une plateforme.
2. **Refondre le consentement RGPD** — bloquant pour vendre quoi que ce soit.
3. **Rappeler le lead SCI** — le mail de confirmation lui a promis un rappel.
4. **Caler l'appel LeadValue** (créneaux à donner, réponse prête dans le fil).
5. **Relancer Leadrs** sous 4-5 j si pas d'activation vendeur.
6. **`terrasse-piscine-bois`** — 1 653 imp en pos 9 à 1 % de CTR, et contrôler l'effet de la
   passe capture du 28/07.
7. **`hauteur-cloture-loi-2026`** — 2 557 imp bloquées en page 2 ; la passer en page 1 vaut
   plus qu'un nouvel article.
8. Goulot **simulation → devis** (10 %) — le vrai levier lead.
9. Arbitrer les plafonds `deckGeometry.js` (BOM terrasse sous-évalué > 8,4 m).
10. Finir l'audit DTU cabanon / pergola / clôture.
11. **IndexNow non soumis** — 3 URLs corrigées en attente.
12. Ménage worktrees (trier les 3 « sales » avant de supprimer les 5 vides).
