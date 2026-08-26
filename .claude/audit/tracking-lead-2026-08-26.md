# Tracking complet + audit d'attribution du lead du 26/08/2026

Relevé le 2026-08-26. Sources : API Umami self-host (flux d'évènements brut,
5 626 hits sur 45 j), Google Search Console, Bing Webmaster, code source.

---

## 1. Réponse à la question posée

**Oui — le lead du 26/08 est passé par la nouvelle étape post-téléchargement.
C'est prouvé, pas déduit.** Mais la preuve porte sur le *chemin emprunté*, pas
sur le fait que ce lead n'existerait pas sans elle. Les deux ne se confondent pas.

### La preuve

La dimension `placement` sur `devis-click` n'existe que dans le code livré par
`5455331` (25/08, 22 h 26). Sur 45 jours, **exactement deux `devis-click`
portent une valeur de `placement`, et les deux valent `post-pdf`** — ce sont les
deux seuls clics devis enregistrés depuis le déploiement, et **les deux
appartiennent à la session qui a produit le lead**.

Autrement dit : dans cette session, aucun autre CTA devis n'a été touché. Le
bloc pivot du simulateur (`placement: 'simulateur'`) était affiché tout du long
et n'a jamais été cliqué. La seule porte d'entrée empruntée est la nouvelle.

### La session, minute par minute

Session `4a657a32` — mobile Android, Chrome, Biarritz. 4 min 19 s, 24 vues.

| Heure (UTC) | Évènement | Détail |
|---|---|---|
| 10:26:29 | vue `/` | **arrivée depuis `lm.facebook.com`** (`fbclid`) |
| 10:26:33 | vue `/pergola` | |
| 10:26:54 | `simulation-start` | |
| 10:26–10:28 | 16 changements de dimension | 5,5×3,0 → … → 5,0×2,5 |
| 10:28:18 | `pdf-export` #1 | |
| 10:28:26 | **`devis-click` `placement=post-pdf`** + `artisan-modal-open` | proposition acceptée |
| 10:28:34 | vue `/` | **sort de la modale sans la fermer — abandon non compté** |
| 10:29:12–17 | retour /pergola, réglages | h 2,3 → 2,2 |
| 10:30:03 | `pdf-export` #2 | |
| 10:30:09 | **`devis-click` `placement=post-pdf`** | proposition acceptée à nouveau |
| 10:30:11 | `artisan-modal-open` | |
| 10:30:48 | **`lead-submitted`** | pergola 5,0 × 2,5 m |

Délai déploiement → lead : **14 h**.

### Ce que la preuve ne dit pas

Le lead du 11/08, sur l'ancien code, suit la séquence
`pdf-export → devis-click` en 4 secondes, sans qu'aucune proposition ne soit
affichée. Le geste « je télécharge, puis je demande un devis » existait donc
**déjà spontanément**. La nouvelle étape a présenté l'offre au bon moment ;
elle n'a pas inventé l'intention.

Volume disponible : **2 affichages, 2 acceptations, 1 lead.** C'est un n de 2.
Aucun taux n'est calculable là-dessus. Il faut ~20 affichages pour dire quoi que
ce soit.

---

## 2. Les 3 leads — une source chacun

| Date | Page | Entrée | Référent | Appareil |
|---|---|---|---|---|
| 04/08 | /calculateur | /calculateur | **chatgpt.com** | laptop, Champagnole |
| 11/08 | /cabanon | / | **google.com** | laptop, Brie-Comte-Robert |
| 26/08 | /pergola | / | **lm.facebook.com** | mobile, Biarritz |

Trois leads, trois canaux différents. Aucun canal n'est encore « le » canal.

### Tunnel par source d'entrée — 28 j, en sessions

| Source | Sessions | PDF | devis-click | Lead | Sessions → lead |
|---|---|---|---|---|---|
| Moteurs de recherche | 655 | 13 | 6 | 1 | 0,15 % |
| Direct | 205 | 5 | 2 | 0 | — |
| **Meta (FB/IG)** | **23** | **6** | **1** | **1** | **4,3 %** |
| IA (ChatGPT) | 13 | 1 | 1 | 1 | 7,7 % |

**Le résultat le plus fort du relevé.** Meta pèse 2,5 % des sessions et produit
24 % des exports PDF et un tiers des leads. Taux d'export : **26 % contre 2 %
pour le trafic moteur** — un rapport de 13, sur 23 sessions (petit, mais pas
anecdotique comme l'est le n de 1 sur les leads).

Une remarque de fond : le note « tout le trafic est organique » qui justifiait
d'écarter les interstitiels dans le commit `5455331` n'est pas exacte. Le trafic
*de conversion* ne l'est pas.

---

## 3. Tunnel devis — 28 j

Compté en **sessions uniques**, pas en évènements (voir défaut D-1).

```
sessions touchant un simulateur : 217  →  devis-click : 6  (2,76 %)
sessions touchant un guide      : 742  →  devis-click : 4  (0,54 %)
sessions avec export PDF        :  25  →  devis-click : 10 (43 %)
devis-click                     :  10  →  lead        : 3  (23 %)
```

Exports PDF par page : `/pergola` 20 · `/cabanon` 9 · `/calculateur` 1.
`/cloture` : zéro.

L'écart simulateur (2,76 %) / guide (0,54 %) tient. L'ordre de grandeur du
25/08 (1,9 % vs 0,43 %) était bon ; les valeurs exactes bougent parce que le
dénominateur employé alors était en pages vues.

---

## 4. Trafic et SEO

| | 28 j | 7 j |
|---|---|---|
| GSC clics | 332 | 89 |
| GSC impressions | 11 920 | 3 038 |
| GSC CTR / position | 2,79 % · 11,3 | 2,93 % · 11,3 |
| Bing clics / imp | 61 · 2 085 | — |
| Umami visiteurs | 908 | 251 |
| Umami sessions | 1 059 | 293 |
| Rebond | 73,3 % | 78,8 % |

Progression réelle sur 28 j : 288 → 332 clics, 10 249 → 11 920 impressions
(base du handoff du 21/08). Position stable à 11,3.

Top pages Umami : `/guides/cabanon` 194 · `/guides/pergola` 159 · `/pergola` 148
· `/` 117 · `/cabanon` 74.

### Mesure du défilement (nouvelle, 25/08)

13 évènements en 14 h, sur 6 guides distincts, seuils 50 % (11) et 90 % (2).
L'instrument fonctionne. Trop tôt pour conclure sur l'exposition — mais le
rapport 11/2 est le premier chiffre réel sur la question, et il suggère que la
fin des guides est effectivement peu atteinte.

---

## 5. Défauts de mesure trouvés

### D-1 · Les « pages vues » simulateur ne sont pas des vues — 1 251 sur 1 677 sont des changements de dimension

Chaque déplacement de curseur réécrit l'URL (`?w=5.0&d=2.5&h=2.2`) et Umami
compte une vue. **75 % des vues simulateur sur 28 j sont des mouvements de
curseur.** La session du lead à elle seule pèse 24 « vues ».

Conséquence : tout ratio dont le dénominateur est « vues simulateur » est faux
d'un facteur ~4, et le rebond du site est mécaniquement sous-estimé. Les
comptages en sessions de ce document ne sont pas touchés.

### D-2 · Le lead enregistré ne porte aucune source — ✅ CORRIGÉ le 26/08

`/api/artisan-lead` archive nom, téléphone, code postal, projet, dimensions,
consentement — **pas le `placement`, pas le référent**. L'attribution faite ici
repose entièrement sur une corrélation de session Umami reconstruite à la main.
Elle n'est ni automatique, ni conservée, ni opposable à un acheteur de leads.

C'était le défaut le plus coûteux de la liste : au prochain lead, il aurait
fallu refaire ce travail à la main.

**Corrigé.** `lib/leadSource.js` porte les deux moitiés de la provenance : le
`placement` (quel bouton, whitelisté, mêmes valeurs qu'Umami) passé en prop
depuis chaque CTA, et l'entrée de session (domaine référent, page d'arrivée,
marquage de campagne) capturée au **premier** chargement et gardée en
sessionStorage — au moment où le formulaire part, `document.referrer` désigne
une page interne, ce qui est précisément ce qui a fait perdre la source le 26/08.
Le serveur re-valide et borne. Vie privée : domaine seul jamais l'URL, et des
identifiants de clic on ne garde que le **nom** du paramètre, pas sa valeur.
Colonne « Origine » au tableau de bord, deux colonnes ajoutées **après** le bloc
attendu par une plateforme dans l'export CSV, et une ligne de plus dans la
politique de confidentialité — la table des données collectées y est
énumérative, elle serait devenue fausse.

Vérifié en direct sur les trois surfaces : `simulateur`, `guide`, et `post-pdf`
par le parcours exact du lead du 26/08 (export → proposition → formulaire
pré-rempli), payload intercepté à chaque fois.

### D-3 · Sortir de la modale par une navigation interne n'est pas compté comme un abandon

Vu en direct à 10:28:34 : la personne quitte `/pergola` pour `/` avec la modale
ouverte. `pagehide` ne part pas sur une navigation client Next.js, `handleClose`
non plus — l'abandon est perdu. Sur 28 j : 13 ouvertures, 3 abandons, 3 leads →
**7 sorties invisibles (54 %)**.

### D-4 · La proposition post-PDF n'émet rien quand elle s'affiche ni quand on la refuse

Aucun évènement sur l'affichage, aucun sur « Non merci ». Le taux d'acceptation
de la nouvelle étape n'est donc **pas mesurable**. `pdf-export` sert de
substitut, mais il part *avant* le `try` de génération (`usePDFExport.js:97`) :
il compte les tentatives, pas les réussites, alors que la proposition n'apparaît
que sur `pdfStatus === 'done'`. Substitut correct comme borne haute, faux comme
compteur.

### D-5 · Le digest hebdomadaire transforme une panne en zéro et déclenche une fausse alerte — ✅ CORRIGÉ le 26/08

Le digest du 24/08 a écrit `"events": {}` dans `history.jsonl`, puis affiché
« 0 export PDF · 0 simulations » et l'alerte **« 🚨 Funnel artisan : 0
interaction sur 28 j — problème d'exposition/CRO, **pas de tracking** »**.

La réalité ce jour-là : ~9 `devis-click`, ~30 exports, 2 leads. `run()` avalait
stderr (`stdio: ['ignore','pipe','ignore']`), et le rendu écrivait `|| 0` sur une
clé absente. Un échec de collecte devenait un constat factuel, et l'alerte
accusait le CRO en disculpant explicitement le tracking — l'inverse exact du
vrai problème.

**Corrigé.** `parseEvents` distingue désormais `null` (collecte en échec) de `{}`
(collecte réussie, rien trouvé) : l'en-tête `=== Événements` sert de témoin, car
umami-stats ne l'imprime qu'après un appel d'API abouti. Les indicateurs
manquants s'affichent « — » ou « indisponible », jamais 0. L'alerte funnel ne
part plus que si la collecte a répondu — et la même précaution a été appliquée
aux quatre alertes marchands Awin, qui se seraient déclenchées en bloc sur une
panne Awin. stderr est capturé et une section « Collectes en échec » nomme le
script et la cause.

Vérifié deux fois : sur les vraies données (13 ouvertures, 3 leads, 30 exports,
aucune fausse alerte) et sur une panne simulée d'Umami **et** d'Awin — « ⚠️
indisponible », aucune alerte, cause exacte reportée.

---

## 6. À faire, par ordre de valeur

1. **D-2** — enregistrer `placement` + référent dans le lead Redis. Sans ça,
   aucune attribution n'est reproductible, et l'argument « nos leads viennent
   d'un parcours qualifié » n'est pas démontrable devant Leadrs ou LeadValue.
2. **D-5** — distinguer « 0 » de « indisponible » dans le digest ; ne pas
   alerter sur donnée manquante. Une seule ligne de garde.
3. **D-4** — deux évènements (`upsell-shown`, `upsell-declined`) pour rendre la
   nouvelle étape mesurable, et déplacer `trackPDFExport` après la réussite.
4. **D-3** — déclencher l'abandon au démontage de la modale, pas seulement sur
   `pagehide`.
5. **D-1** — cesser de réécrire l'URL à chaque cran de curseur, ou exclure les
   vues portant `?w=` du décompte.
6. **Meta** — 23 sessions, 26 % d'export, 1 lead. Comprendre ce qui a été publié
   les 29/07, 11/08 et 25-26/08 et si c'est reproductible. Le meilleur canal du
   site est celui qu'on ne pilote pas.

---

## 7. Non vérifié

Le contenu du lead en base. `/api/admin/leads` répond bien 401 (route déployée,
persistance active depuis le 25/08 15 h 27, donc le lead de 10 h 30 le 26/08
devrait y être), mais `ADMIN_PASSWORD` et `REDIS_URL` ne sont pas dans
`frontend/.env.local` — ils ne vivent que sur Vercel. Contrôle à faire sur
`https://www.diy-builder.fr/admin/leads`.
