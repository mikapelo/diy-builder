# Audit du CTA « Demander un devis gratuit »

> Réalisé le 2026-08-25. Données Umami self-host, fenêtre **28 jours** (28/07 → 25/08),
> relevées en direct + inspection du DOM en production.
> Contexte : le CTA devis est la seule source de leads vendables (cf. appel Leadrs 28/08).

---

## 0. Le chiffre du goulot est faux — à corriger avant vendredi

Le handoff, la fiche LeadValue et la fiche Leadrs annoncent tous :

> « 88 simulations → 9 clics devis = **10 %** »

**Ce ratio ne mesure pas ce qu'il prétend.** `trackSimulationStart` n'est appelé qu'à
**un seul endroit** — `components/simulator/CabanonViewer.jsx:51` — avec
`module: 'cabanon'` **en dur**. Les simulateurs terrasse, pergola et clôture n'émettent
jamais cet événement.

Preuve croisée sur 28 j :

| Page | `simulation-start` | `pdf-export` |
|---|---|---|
| /cabanon | **93** | 9 |
| /pergola | **0** | **18** |
| /calculateur | 1 | 1 |
| /cloture | 0 | 0 |

`/pergola` produit 18 exports PDF **sans une seule simulation comptée**. Le dénominateur
est donc quasi exclusivement du cabanon, alors que les 9 clics devis viennent des quatre
modules **et** des guides. On divise deux populations différentes.

Anomalie secondaire, **non élucidée** : 93 événements pour 78 vues de `/cabanon`.
Ne pas conclure trop vite à un sur-déclenchement : `trackSimulationStart` porte déjà un
verrou `sessionStorage` par module (`sim_started_<module>`) qui limite l'événement à une
fois par onglet. Plusieurs onglets, ou une attribution d'URL différente entre l'événement
et la vue, expliqueraient l'écart aussi bien. À creuser — ce n'est pas le sujet principal.

**À faire avant l'appel Leadrs** : ne plus citer les 10 %. Les ratios défendables sont
au § 2.

---

## 1. Deux autres défauts d'instrumentation

**`devis-click` et `artisan-modal-open` sont le même geste.** 9 et 9, page pour page,
sans un seul écart. Les deux `track*` partent dans le même gestionnaire de clic. L'étape
« 9 clics → 9 ouvertures (100 %) » du handoff n'est pas une étape de tunnel, c'est le
même événement compté deux fois. Le tunnel réel a **un palier de moins**.

**5 abandons sur 7 ne sont pas tracés.** 9 ouvertures, 2 leads, mais seulement
**2 `artisan-modal-abandon`**. `trackArtisanModalAbandon` ne part que via `handleClose`
(croix, Échap, clic sur le fond). Fermeture d'onglet ou navigation = silence total.
On ne sait pas ce qui s'est passé pour 5 personnes sur 9.

---

## 2. Ce que disent réellement les données (28 j)

**Volume global** : 2 966 pages vues · 898 visiteurs · rebond 72,1 % · durée moy. 1 min 41.

### Répartition du trafic — top 20 des pages (1 167 vues)

| Famille | Vues | Part |
|---|---|---|
| **Guides** | **704** | **60,3 %** |
| Simulateurs | 318 | 27,2 % |
| Accueil | 130 | 11,1 % |
| Index /guides | 15 | 1,3 % |

### Où les 9 clics devis sont réellement nés

| Page | Clics | Vues | Taux |
|---|---|---|---|
| /calculateur | 3 | 55 | 5,5 % |
| /cabanon | 2 | 78 | 2,6 % |
| /pergola | 1 | 151 | 0,7 % |
| /guides/cabanon | 1 | 188 | 0,5 % |
| /guides/pergola-panneaux-solaires-diy-2026 | 1 | 73 | 1,4 % |
| /guides/cloture-solaire-brise-vue-photovoltaique-2026 | 1 | 20 | 5,0 % |

**Par famille :**

| Famille | Vues | Clics devis | Taux |
|---|---|---|---|
| Simulateurs | 318 | **6** | **1,9 %** |
| Guides | 704 | **3** | **0,43 %** |
| Accueil | 130 | **0** | **0 %** |

**Le simulateur convertit 4,4× mieux par vue — mais reçoit 2,2× moins de trafic.**
C'est là qu'est le levier : 60 % de l'audience produit 33 % des clics.

### Les leads

2 `lead-submitted` : un sur `/cabanon`, un sur `/calculateur`. **Aucun lead depuis un
guide**, sur 704 vues.

⚠️ Tout ce qui suit raisonne sur **9 clics et 2 leads**. Aucune conclusion fine n'est
statistiquement solide ; seules les anomalies structurelles le sont.

---

## 3. Le vrai problème : sur les guides, le CTA est en bas de page

Relevé en production sur les deux premières pages du site.

### /guides/cabanon — 188 vues, 1 clic

Page de **74 342 px**. Quatre encadrés CTA :

| Position | Encadré | Action |
|---|---|---|
| 35 % | « Obtenez la liste exacte pour votre cabanon » | Lancer le simulateur |
| 72 % | « Permis cabanon 2026 » | Lire un autre guide |
| **94 %** | **« Vous préférez confier la réalisation ? »** | **Demander un devis** |
| 95 % | « Calculez votre cabanon en 30 secondes » | Lancer le simulateur |

### /guides/pergola — 159 vues, **0 clic**

Page de **70 455 px**. Même schéma : « Lancer le simulateur » à 29 %, devis à **94 %**.

**Le CTA devis passe en dernier, après ~69 000 px de défilement, et après que tous les
CTA concurrents ont eu leur chance.** Ces deux pages font 347 vues — **49 % du trafic
guides du top 20** — pour **1 clic**.

Les deux guides qui convertissent le mieux sont deux satellites solaires à faible
trafic (73 et 20 vues). Les piliers, eux, ne convertissent pas.

---

## 4. Trois CTA cassés ou absents

**`/guides/dalle` — CTA mort.** Le bouton « Demander un devis gratuit »
(`app/guides/dalle/page.jsx:569`) est un `<Link href="/">` : il renvoie à l'accueil,
n'ouvre pas la modale et n'émet aucun événement. 36 vues, 0 clic. Il ressemble à un CTA
lead, il est libellé comme tel, il ne mène nulle part.

**L'accueil n'a aucun CTA devis.** 130 vues, 0 clic. La section artisan dédiée vend
pourtant la proposition (« Vous préférez confier les travaux ? », trois arguments :
projet déjà chiffré / dossier PDF / sans engagement) — et son bouton dit **« Calculer
mon projet »** et **remonte au hero** (`HeroSection.jsx`, `scrollIntoView` sur
`#v6-hero`). La section qui pitche le lead renvoie dans le tunnel DIY.

**Couverture** : 22 guides sur 23 portent bien `CTALead`. Le seul manquant est
`/guides/dalle`, qui a sa propre version cassée. Le problème n'est donc **pas** la
couverture — c'est la position et la destination.

---

## 5. La modale promet un dossier qui n'existe pas

`CTALead` ouvre `ArtisanLeadModal` avec **`dims={null}`** (guides = pas de projet
calculé). Or la bannière de la modale est inconditionnelle. Vérifié en direct sur
`/guides/cabanon` :

> « Votre **dossier projet** (matériaux, budget) accompagne votre demande. »
> Sous-titre : « Transmettez votre **projet calculé** pour recevoir un devis. »

…alors qu'aucun projet n'a été calculé, que la puce dimensions est absente et qu'aucune
nomenclature n'accompagne l'envoi.

Deux conséquences :

1. **Envers l'utilisateur** — on affirme joindre un dossier qu'on ne joint pas.
   Incompatible avec la discipline de vérification du projet.
2. **Envers l'acheteur du lead** — un lead venu d'un guide est un contact nu : ni
   surface, ni budget. C'est exactement l'inverse de ce qu'on s'apprête à vendre à
   Leadrs comme différenciateur (« le prospect arrive avec son projet déjà chiffré »).

---

## 6. Le choix DIY vs Pro

Le bloc `ProjectActions` (« Votre projet est chiffré ») est **bien placé** : à **10 %**
du tunnel de résultats, avant « Matériaux estimés » (20 %) et « Budget & comparatif »
(29 %). Le paragraphe RGPD est **sous** le bouton, pas entre les arguments et le bouton :
il ne fait pas obstacle. Ce n'est donc pas un problème de placement côté simulateur.

Le problème est le **choix offert** :

| | Carte DIY | Carte Pro |
|---|---|---|
| Titre | « Je le fais moi-même » | « Confier la réalisation à un professionnel » |
| Sous-titre | « Le dossier arrive dans votre boîte mail » | « On recueille votre demande » |
| Hauteur mobile | **244 px** | **601 px** |
| Ordre mobile | **1ᵉ** | 2ᵉ |
| Demande | un email | nom, téléphone, code postal, contraintes |

Sur mobile (375 px, colonne unique) l'option gratuite arrive **en premier**, en carte
compacte à un bouton ; l'option lead arrive ensuite, **2,5× plus haute**, avec l'aperçu
des champs et le pavé RGPD. Le mobile est majoritaire (150 clics Google sur 288).

Résultat mesuré sur `/pergola` : **18 exports PDF pour 1 clic devis**. Sur
`/calculateur`, le rapport s'inverse (1 PDF, 3 devis) — sans explication à ce stade,
et sur des effectifs trop faibles pour conclure.

Sur la formulation : « **Confier la réalisation à un professionnel** » demande à un
visiteur venu sur un site de bricolage de renoncer à l'identité qui l'a amené. Et
« On recueille votre demande » est passif et vague là où la carte DIY est concrète
(« Le dossier arrive dans votre boîte mail »).

---

## 7. Recommandations, par ordre d'effet attendu

### P0 — Réparer la mesure (sans quoi rien n'est évaluable)

1. **Appeler `trackSimulationStart` dans les quatre modules**, avec le vrai `module`.
   Aujourd'hui seul le cabanon est instrumenté.
2. **Cesser de citer les 10 %** dans les fiches d'appel — remplacer par les taux du § 2.
3. **Garder les deux événements, corriger le récit.** Vérification faite dans le code,
   le doublon est *délibéré* : `artisan-modal-open` existe pour détecter un décrochage
   entre le clic sur le CTA et l'affichage de la modale. La réponse après 28 jours est
   « aucun décrochage ». L'instrument garde sa valeur de détecteur de régression — mais
   les deux ne forment pas une étape de tunnel, et « 9 clics → 9 ouvertures = 100 % »
   compte deux fois le même geste.
4. **Tracer l'abandon réel** (`visibilitychange` / `beforeunload`), sinon 5 sorties
   sur 7 resteront invisibles.

### P1 — Remonter le CTA devis sur les guides

C'est **le** levier : 704 vues où le CTA est à 94 % de la page.

5. Placer un `CTALead` **après la première section utile** (~25-30 % de la page), avant
   le premier « Lancer le simulateur ». Garder celui de fin.
6. **Ne pas mettre deux CTA concurrents côte à côte** : à 29 %, sur un guide, l'intention
   « je veux que quelqu'un le fasse » et « je veux le calculer » ne se disputent pas —
   proposer les deux, mais donner le rôle principal au devis sur les pages à intention
   prix/réglementation (`prix-*`, `hauteur-cloture-loi`, `taxe-abri-jardin`), et au
   simulateur sur les pages construction.

**Ordre de grandeur honnête** : si les guides atteignaient le taux du simulateur (1,9 %),
704 vues donneraient ~13 clics au lieu de 3, soit ~3 leads/mois au lieu de 0. À
13-19 € la part vendeur, cela fait **40 à 55 €/mois**. Ça ne change pas l'économie du
site — mais ça **triple le volume de leads**, qui est précisément le chiffre qui manque
face à Leadrs et LeadValue.

### P2 — Réparer les CTA cassés

7. `/guides/dalle` : remplacer le `<Link href="/">` par `CTALead` comme les 22 autres.
8. Accueil : donner à la section artisan un vrai bouton devis au lieu de « Calculer mon
   projet » qui remonte au hero. 130 vues, 0 clic aujourd'hui.

### P3 — Honnêteté et qualité du lead

9. **Conditionner la bannière « dossier projet » à `dims`.** Sans projet calculé, dire
   ce qui est réellement transmis. Deux options :
   - afficher un message adapté (« votre demande sera transmise avec vos contraintes »),
   - ou, mieux, **demander les dimensions dans la modale** quand elles manquent : deux
     champs suffisent pour requalifier le lead et restaurer la promesse.
10. Sur mobile, **inverser l'ordre des cartes** (Pro avant DIY) ou alléger la carte Pro
    — 601 px contre 244 px pour l'option qu'on veut voir choisie.

### Ce qu'il ne faut PAS faire

- **Pas d'A/B test.** À 9 clics sur 28 jours, aucun test n'atteindra la significativité
  avant des mois. Corriger ce qui est structurellement cassé, mesurer, puis tester plus
  tard.
- **Ne pas supprimer la carte DIY.** Les 28 exports PDF alimentent la newsletter et
  l'affiliation ; c'est aussi ce que les visiteurs viennent chercher. Le sujet est
  l'ordre et le poids, pas la suppression.
- **Ne pas retoucher la formulation du consentement** — refondue et mise en production
  le 25/08, elle est le socle de la cessibilité des leads.

---

## 8. Suite donnée — P0, P1 et P2 traités le 25/08

| Lot | Objet | Commit |
|---|---|---|
| **P0** | `simulation-start` dans les 4 modules · abandon réel sur `pagehide` · récit du doublon corrigé · « 10 % » retiré des 2 fiches d'appel | `78bf299` |
| **P1** | `CTALead` remonté à ~21 % sur 7 guides (cabanon, pergola, cloture, terrasse, terrasse-piscine-bois, prix-terrasse-bois-m2-2026, permis-cabanon-seuils-2026) | `2ed667b` |
| **P2** | CTA générique fonctionnel · `/guides/dalle` réparé · accueil · bannière conditionnelle | *ce commit* |

### Détail du P2

1. **`CTALead` ouvre désormais la modale même sans simulateur associé.** Trois pages
   n'affichaient qu'un lien : `/guides`, `/guides/soi-meme-ou-pro` et
   `/guides/comparer-devis-travaux` — soit, pour les deux dernières, les pages à plus
   forte intention « confier à un pro » du site, **sans aucun CTA devis**. Le type de
   projet est alors absent : la modale retombe sur « Projet bois », l'API neutralise le
   champ, et le suivi utilise `module: 'generique'`.
2. **`/guides/dalle`** : le `<Link href="/">` déguisé en CTA devis est remplacé par
   `CTALead`. La CSS `.dalle-cta-artisan` devenue orpheline est supprimée.
3. **Accueil** : la section artisan vendait la mise en relation puis renvoyait au
   simulateur en haut de page (« Calculer mon projet », `scrollIntoView`). Le devis
   devient l'action principale, le calcul reste offert en action secondaire
   (`.v6-artisan-alt`, contraste vérifié à **6,84:1**, AA sur texte normal).
4. **Bannière « dossier projet »** conditionnée à `dims`. Sans projet calculé, la modale
   ne prétend plus joindre un dossier et invite à décrire dimensions et contraintes —
   ce qui sert aussi la qualité du lead vendu.

Cohérence de mesure : `devis-click` et `artisan-modal-open` portent désormais le **même**
`module` sur tous les points d'entrée, condition pour que le couple garde sa valeur de
détecteur de décrochage.

**Vérifié en direct** sur les quatre correctifs (serveur local) : modale ouverte et
événements appariés sur `/guides/dalle`, `/guides/soi-meme-ou-pro`,
`/guides/comparer-devis-travaux` et l'accueil. Lint, build, **427/427 tests**.

### Ce qui reste ouvert

- Les pages guides font 70 000 à 100 000 px. Remonter le CTA à 21 % aide, mais
  l'exposition reste le facteur limitant — un dispositif persistant (barre ou rappel
  latéral) toucherait bien plus de monde. C'est un vrai changement de design : à
  maquetter et valider avant de coder.
- Écart 93 événements / 78 vues sur `/cabanon` : non élucidé (cf. § 0).
- Mesurer à J+28, soit vers le **22/09/2026**, avec les nouveaux compteurs.
