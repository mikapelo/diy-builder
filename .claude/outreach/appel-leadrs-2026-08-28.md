# Appel Leadrs — vendredi 28 août 2026, matin

> Préparé le 2026-08-25. Fait suite au **formulaire vendeur envoyé le 21/08**.
> Document frère : `appel-leadvalue-2026-08-21.md` — **la tactique prix y est
> inverse, lire le § 4 ci-dessous avant de la réutiliser.**
> Objectif : **obtenir l'activation vendeur et connaître la part vendeur.**

---

## 1. Ce que cet appel est réellement

Le compte Leadrs est **acheteur uniquement** : « Nos offres », solde 0,00 €,
« Ajouter des crédits », et `/integrates` dit « Connectez votre CRM pour
**recevoir** vos leads ». Aucun espace vendeur dans l'interface.

Donc : **l'activation vendeur est manuelle, et cet appel en fait partie.**
Ce n'est pas une prise de contact commerciale, c'est l'instruction du dossier
déposé le 21/08. En sortir activé est l'objectif minimum.

---

## 2. La carte maîtresse : on connaît leurs prix de revente

Relevé **dans leur propre application acheteur**, le 21/08 :

| Catégorie | Prix de revente | Canal |
|---|---|---|
| **Rénovation de jardins & paysagisme** | **26,10 €** et **27,00 €** | **SEO** ← notre catégorie probable |
| Panneaux solaires | 24 – 32 € | — |
| Borne de recharge | 33 € | — |
| Fenêtres | 23 – 26 € | — |
| Volets | 21 – 24 € | — |
| Meilleure offre du panel | **33,75 €** | **SEO pur** |
| Mutuelle (pour comparaison) | 6,60 € | emailing |

Deux enseignements à porter dans la conversation :

1. **Le SEO n'est pas décoté chez eux — il est au sommet.** Leurs meilleures
   offres sont en SEO pur, l'emailing s'effondre à 6,60 €. Notre trafic est
   **100 % SEO organique**, sans achat de trafic, sans co-inscription, sans base
   achetée. C'est exactement le profil qu'ils valorisent le plus cher.
2. On sait à quoi ils revendent **avant** de négocier ce qu'ils achètent.

Dire d'où vient l'information, sans détour : *« J'ai un compte acheteur chez vous,
j'ai regardé vos offres avant de vous écrire. »* C'est factuel et ça montre le
sérieux du dossier.

---

## 3. Ce qui a changé depuis le dépôt du formulaire (21/08)

C'est le cœur de ce qu'il y a de neuf à raconter — **mis en production le 25/08**.

| Sujet | Au dépôt du dossier | Vendredi |
|---|---|---|
| Consentement de transmission | subordonné à « un accord » jamais recueilli → **aucun lead cessible** | **recueilli à la collecte**, en ligne |
| Liste des destinataires | inexistante | **publiée et datée**, `/politique-confidentialite#partenaires` |
| Preuve du consentement | aucune | **texte + version archivés avec chaque lead** |
| Enregistrement des demandes | **aucun** (deux mails, rien en base) | **archivage Redis**, écrit avant les mails, rétention 12 mois |
| Contrôle serveur | aucun | un lead sans accord prouvé est **refusé (400)** |

À formuler ainsi :

> « Quand je vous ai envoyé le formulaire vendeur la semaine dernière, ma
> formulation de consentement était trop restrictive : la transmission était
> soumise à un accord supplémentaire que je ne recueillais pas. Je l'ai refondue
> et c'est en ligne depuis lundi. Le consentement porte maintenant sur la
> transmission elle-même, au moment de la collecte, et j'archive le texte exact
> et sa version avec chaque demande. J'ai aussi publié une liste de partenaires
> destinataires — elle est vide aujourd'hui, et elle le dit. **Le jour où on
> travaille ensemble, Leadrs y est inscrit avant le premier envoi.** »

C'est le meilleur passage de l'appel : peu d'éditeurs peuvent montrer ça, et ça
répond d'avance à leur question de conformité.

⚠️ **Contrepartie à dire dans la même phrase** : les **2 leads d'août** ont été
recueillis sous l'ancienne formulation. Ils ne sont **pas cessibles** sans
redemander l'accord aux personnes. Le premier lead livrable sera **le prochain
qui arrive**. Ne pas laisser croire qu'il y a un stock.

---

## 4. ⚠️ Sur le prix — la tactique est l'INVERSE de celle de LeadValue

Pour LeadValue, la consigne était : *ne pas annoncer de prix en premier, on n'a
aucune référence de marché*. **Ici on en a une, et elle vient d'eux.**

Ne pas annoncer notre prix pour autant — mais **ancrer sur le leur** et demander
le partage :

> « J'ai vu que vous revendez le lead jardins & paysagisme autour de 26-27 €, et
> que vos meilleures offres sont sur du SEO. **Quelle part revient au vendeur sur
> une offre à 27 € ?** »

C'est **la** question de l'appel. Tout le reste en découle : à 50 % on est à
13 €/lead, à 70 % on est à 19 €. Ne pas repartir sans la réponse, même
approximative, même sous forme de fourchette.

Question de repli si esquive : *« Sur quelle fourchette se situent vos vendeurs
en rénovation, entre le plancher et le plafond ? »*

---

## 5. La question de catégorisation — à faire trancher par eux

**Aucune catégorie terrasse / pergola / clôture / abri de jardin** dans leur
catalogue. Rattachement probable : « Rénovation → jardins & paysagisme ».

Ne pas décider à leur place, poser la question :

> « Mes projets sont des terrasses bois, pergolas, clôtures et abris de jardin.
> Je ne vois pas ces catégories chez vous. Est-ce que ça rentre dans
> "Rénovation → jardins & paysagisme", ou faut-il créer autre chose ? »

Enjeu réel : c'est cette catégorie qui fixe le prix de revente, donc notre part.
Si nos leads finissent classés dans une catégorie moins bien valorisée, tout le
raisonnement du § 2 tombe.

---

## 6. Le volume — à prendre de front, comme pour LeadValue

**2 leads sur 28 jours.** Ne jamais promettre mieux.

Ce qui rend Leadrs adapté malgré ça, et qu'il faut leur rappeler : leur modèle
**ordre d'achat, sans engagement minimum**. C'est précisément pour ça qu'ils sont
en tête de notre audit de plateformes.

> « Je ne vais pas vous vendre du volume que je n'ai pas : j'en suis à deux
> demandes sur le dernier mois. Si vous aviez un plancher mensuel, je ne vous
> appellerais pas. C'est votre modèle sans engagement qui rend la chose possible
> des deux côtés. »

Ce qu'on peut montrer à la place du volume — **la courbe et la qualification** :

- Trafic Google **288 clics / 10 249 impressions** sur 28 j (+19,9 % d'impressions),
  Bing **57 clics**. Trafic **×3** en deux mois.
- **35 exports PDF** de nomenclature sur la période.
- Sur les pages simulateur : **1,9 %** des vues débouchent sur une demande de devis.
  Sur les guides : **0,43 %**. Le goulot est là — 60 % de l'audience produit 33 % des
  demandes — et c'est le chantier en cours (CTA remonté en page le 25/08).
- Modale → envoi : **2 leads sur 9 ouvertures**.

⚠️ **Ne plus citer le « 10 % simulation → devis »** des fiches précédentes : l'audit du
25/08 a montré que le compteur de simulations n'était branché que sur le cabanon. Le
ratio divisait deux populations différentes. Corrigé dans le code le même jour.
- Le lead type arrive **avec son projet déjà chiffré** : dimensions exactes,
  nomenclature matériaux, budget comparé sur 4 enseignes. Exemple réel : SCI,
  terrasse 5,50 × 4,50 m = **24,75 m²**, Jura (39), **1 909 à 2 250 €** de
  matériaux, **~3 000 à 3 700 €** pose comprise.

Dire « plus documenté que la moyenne », **jamais** « 3 à 5× plus qualifié » :
c'est une estimation, pas une mesure.

---

## 7. Questions à poser — par ordre d'importance

1. **Quelle part revient au vendeur** sur une offre à 26-27 € ? (cf. § 4)
2. **Quel est votre taux de rejet**, et sur quels motifs ? *(un bon prix avec 50 %
   de rejet vaut moins qu'un prix moyen avec 5 % — c'est la vraie variable)*
3. Nos projets relèvent de quelle catégorie ? (cf. § 5)
4. Comment se passe l'**activation vendeur** — quelles pièces, quel délai ?
5. **Exclusivité** : nos leads n'ont jamais été transmis à personne. Comment est-ce
   valorisé par rapport à un lead multi-diffusé ?
6. **Format d'intégration** et documentation. *(Réponse de notre côté : la route
   `/api/artisan-lead` existe, envoi en temps réel possible, webhook/API/fichier
   au choix — c'est du Next.js, l'ajout est rapide.)*
7. **Délai de paiement**, seuil de facturation, statut juridique exigé côté vendeur.
8. Quelle **formulation de consentement** attendez-vous, et qui est le destinataire
   au sens RGPD — Leadrs ou l'artisan final ? *(détermine ce qu'on inscrit dans la
   liste des partenaires)*
9. Y a-t-il une **phase de test** avant contractualisation ?

---

## 8. Ce qu'il ne faut pas faire

- Promettre un volume mensuel.
- Laisser croire qu'il y a un stock de leads livrables — il n'y en a **aucun** le
  jour de l'appel (cf. § 3).
- Annoncer notre prix en premier. Ancrer sur le leur, demander la part.
- Signer une exclusivité ou un engagement de volume sur ce premier appel.
- Accepter l'intégration technique avant de connaître **part vendeur + taux de rejet**.
- Miser sur eux seuls : à 2 leads/mois il faut 2 ou 3 débouchés en parallèle
  (LeadValue en cours, TimeOne « Place des Leads » en réserve pour l'invendu).

---

## 9. Objectif de sortie

Repartir avec, par écrit :

- [ ] la **part vendeur** ou au moins une fourchette,
- [ ] le **taux de rejet** moyen et ses motifs,
- [ ] la **catégorie** de rattachement de nos projets,
- [ ] les **pièces et le délai** de l'activation vendeur,
- [ ] la formulation de consentement attendue et le nom exact de l'entité
      destinataire, à inscrire dans `LEAD_PARTNERS`.

Et rien de signé.

---

## 10. À faire avant vendredi

- [ ] **Rappeler le lead SCI** — un rappel lui a été promis par le courriel de
      confirmation. En profiter pour lui **redemander l'accord de transmission**.
- [ ] Relire le § 3 : ne pas se contredire avec le dossier déposé le 21/08.
- [ ] Avoir sous les yeux : les prix du § 2, les chiffres du § 6, l'exemple SCI.
- [ ] Vérifier que `/admin/leads` onglet « Demandes de devis » s'ouvre bien
      (`ADMIN_PASSWORD`) — s'ils demandent un historique, c'est là qu'il est.
