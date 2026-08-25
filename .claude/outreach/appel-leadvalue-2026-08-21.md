# Appel LeadValue — feuille de route

> Préparé le 2026-08-21, après leur réponse positive au mail du 02/06.
> Chiffres GSC/Bing/Umami relevés en direct le 21/08 (fenêtre 24/07 → 20/08).
> Objectif de l'appel : **obtenir leur grille et leurs conditions**, pas vendre du volume.
> Règle d'or : ne jamais s'engager sur un chiffre de leads mensuel.

---

## 1. Les chiffres à avoir sous les yeux

### Trafic (source : digest 2026-07-27)

| Métrique | Aujourd'hui | Dans le mail du 02/06 | Évolution |
|---|---|---|---|
| Clics Google 7 j | **63** | 21 | **×3** |
| Impressions 7 j | **2 766** | 645 | **×4,3** |
| Clics Google 28 j | **288** | — | — |
| Impressions 28 j | **10 249** | — | — |
| CTR 28 j | 2,81 % | 3,26 % | en baisse (effet de mix, cf. note) |
| Position moyenne | 11,7 | 8,9 | tirée par 1 page à pos 19 |
| Visiteurs Umami 28 j | **924** | ~210 / mois | **×4,4** |
| Bing 28 j | **57 clics**, 1 946 imp | 3 / 7 j | forte montée |

**C'est le point fort de l'appel** : tout ce qui a été annoncé en juin sur la
croissance du trafic s'est réalisé, et au-delà.

### Activité produit (28 j)

- **88 simulations** lancées (×2,2 en trois semaines)
- **35 exports PDF** de nomenclature
- 9 clics « devis », 9 ouvertures de la modale artisan, **2 leads envoyés**
- Taux modale → lead : **22 %**

### Leads

- **2 leads** sur les 28 derniers jours (compteur Umami `lead-submitted`).
  ⚠️ Un seul est identifié — la route n'enregistre rien, cf. § 9.
- Profil : **SCI** (donc pas un particulier), terrasse bois **5,50 × 4,50 m = 24,75 m²**, Jura (39).
- Budget matériaux calculé par notre moteur : **1 909 € à 2 250 €** selon l'enseigne.
  Avec pose artisan (40-60 €/m²) : **projet ~3 000 à 3 700 €**.

---

## 2. Le piège principal — la projection de juin

Le mail du 02/06 annonçait : « **Projection T3 2026 : 10-30 leads/mois** ».
Nous sommes en plein T3. Le compteur est à **1**.

Ils vont poser la question. Ne pas la fuir, la prendre de front en premier.

> « Je vous ai écrit en juin avec une projection de 10 à 30 leads par mois sur ce
> trimestre. Je préfère vous le dire avant que vous me le demandiez : j'en suis à 1.
> Le trafic, lui, a fait ce que j'annonçais — il a triplé. Ce qui n'a pas suivi,
> c'est la transformation, et je sais maintenant pourquoi : le formulaire n'était
> proposé que dans le simulateur, jamais dans les guides qui font l'essentiel de
> l'audience. C'est corrigé depuis le 23 juillet, et le premier lead est arrivé
> douze jours après. »

Ce que cette réponse fait : elle montre qu'on mesure, qu'on diagnostique et qu'on
corrige. Un éditeur qui annonce 30 et livre 1 sans explication est disqualifié ;
un éditeur qui explique l'écart est crédible.

**Ne pas** enchaîner sur une nouvelle projection chiffrée dans la foulée.

---

## 3. Le point bloquant à traiter honnêtement — le consentement

Formulation actuelle de la case à cocher (obligatoire, non précochée) :

> « J'accepte que mes coordonnées et les informations de mon projet soient
> recueillies par DIY Builder afin d'être recontacté(e) au sujet de sa réalisation.
> Elles pourront, **avec mon accord**, être transmises à un partenaire spécialisé. »

**Conséquence : en l'état, le lead déjà reçu ne peut pas leur être transmis
directement.** La transmission est subordonnée à un accord supplémentaire.

Deux façons de le présenter — la seconde est la bonne :

- ❌ « Oui, mes leads sont consentis, aucun souci. » → faux, et ça se retournera
  contre nous au premier contrôle ou à la première réclamation.
- ✅ « Mon formulaire prévoit la transmission à un partenaire, mais je l'ai rédigé
  de façon restrictive : elle est soumise à un accord explicite. Concrètement, pour
  le lead que j'ai en main, je dois redemander son accord à la personne. Pour la
  suite, je fais évoluer la formulation pour que le consentement à la transmission
  soit recueilli directement, à condition que le partenaire soit nommé — c'est ce
  que le RGPD demande. J'ai besoin de savoir comment vous, vous formulez ça avec
  vos autres éditeurs. »

Cette réponse transforme une faiblesse en signal de sérieux. Beaucoup d'éditeurs
de leads sont approximatifs là-dessus ; une plateforme sérieuse le remarque.

**Question à leur poser** : nom exact de l'entité à mentionner dans le consentement,
et est-ce eux ou l'artisan final qui est le destinataire au sens RGPD.

---

## 4. Les questions qu'ils vont poser — réponses préparées

| Leur question | Réponse |
|---|---|
| **Combien de leads par mois ?** | 1 à ce jour, le premier. Je ne vais pas vous vendre un volume que je n'ai pas. Ce que je peux vous montrer, c'est la courbe de trafic et la qualité du lead. |
| **D'où vient votre trafic ?** | 100 % SEO organique, Google et Bing. Aucun achat de trafic, aucune co-inscription, aucune base achetée. 8 551 impressions sur 28 jours, position moyenne 8,2. |
| **Vos leads sont-ils exclusifs ?** | Oui, aucun n'a jamais été transmis à quiconque. Pas de multi-diffusion. |
| **Quelle est la qualification ?** | Le prospect a construit son projet en 3D avant de nous écrire : dimensions exactes, nomenclature matériaux, budget comparé sur 4 enseignes. Il arrive avec un ordre de grandeur en tête. Le premier lead : une SCI, 24,75 m², projet à ~3 500 € pose comprise. |
| **Taux de transformation visiteur → lead ?** | Faible et je l'assume : ~40 simulations pour 1 lead sur la période. Le point de friction est identifié et en cours de traitement. |
| **Quelle intégration ?** | Aujourd'hui le lead part par courriel. Je peux livrer en API, webhook ou fichier — c'est du Next.js, la route existe déjà, l'ajout d'un envoi vers votre point d'entrée est rapide. Dites-moi votre format. |
| **Délai de transmission ?** | Temps réel possible : la soumission déclenche déjà un envoi immédiat. |
| **Quels départements ?** | France métropolitaine, sans ciblage géographique — l'audience suit le SEO. Le premier lead vient du Jura. C'est un point à surveiller si vous avez des zones saturées ou au contraire en tension. |
| **Quel prix attendez-vous ?** | *(ne pas répondre en premier — voir § 5)* |

---

## 5. Les questions à POSER — c'est le vrai but de l'appel

Les trois du mail de juin sont restées sans réponse. Les reposer.

1. **Grille tarifaire éditeur** pour un lead travaux qualifié : quelle fourchette,
   et sur quels critères varie-t-elle (surface, budget, exclusivité, département) ?
2. **Volume minimum** pour ouvrir un test — y a-t-il un plancher, ou peut-on
   démarrer à quelques leads par mois ?
3. **Format d'intégration** préféré et documentation technique.
4. **Modèle de rémunération** : prix fixe par lead, ou variable selon acceptation
   par l'artisan ? Quel est votre taux de rejet moyen et sur quels motifs ?
5. **Délai de paiement** et seuil de facturation.
6. **Formulation du consentement** attendue de vos éditeurs (cf. § 3).
7. Y a-t-il une **période d'essai** ou un lot de leads test avant contractualisation ?

Le taux de rejet (point 4) est le plus important commercialement : un prix
au lead élevé avec 50 % de rejet vaut moins qu'un prix moyen avec 5 %.

---

## 6. Sur le prix — tactique

**Ne pas annoncer de prix en premier.** Nous n'avons aucune référence de marché
vérifiée, et le volume est trop faible pour négocier. Formulation :

> « Je préfère que vous me disiez comment vous valorisez ce type de lead. Le mien
> est plus documenté que la moyenne — dimensions, budget, plan — donc j'aimerais
> comprendre si votre grille tient compte de la richesse du lead ou seulement du
> secteur. »

Si insistance pour un chiffre : renvoyer la question sur leur fourchette basse et
haute, puis se positionner. Aucun engagement de prix sur cet appel.

---

## 7. Ce qu'il ne faut pas faire

- Promettre un volume mensuel. La seule projection défendable est « la courbe de
  trafic triple tous les deux mois ; la transformation est le chantier en cours ».
- Signer ou accepter une exclusivité longue sur ce premier appel.
- Affirmer que les leads sont librement transmissibles (cf. § 3).
- Parler de « qualification 3 à 5× supérieure » comme d'un fait mesuré — c'est une
  estimation, pas une mesure. Dire « plus documenté », montrer les champs.
- Accepter une intégration technique avant de connaître le prix et le taux de rejet.

---

## 8. Objectif de sortie

Sortir de l'appel avec, par écrit :
- leur grille de prix ou au moins une fourchette,
- le format d'intégration et la documentation,
- le volume minimum et l'existence ou non d'une phase de test,
- la formulation de consentement qu'ils attendent.

Et rien de signé.

---

## 9. À faire avant l'appel

- [ ] Poser la persistance des leads (`/api/artisan-lead` n'enregistre rien
      aujourd'hui — impossible de produire un historique s'ils le demandent)
- [ ] Décider quoi faire du lead SCI en cours : il attend un rappel, promis par
      le courriel de confirmation automatique
- [ ] Relire le mail du 02/06 pour ne pas se contredire
