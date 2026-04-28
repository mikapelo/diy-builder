# Corpus documentaire — Construction bois pour DIY Builder

> Maintenu par la session lead. Dernière mise à jour : 2026-03-29.
> Ce document recense les sources primaires utilisées ou à consulter pour alimenter les moteurs de calcul et le rendu du simulateur.

---

## A. Références normatives

### A1. Eurocodes

| # | Titre | Organisme | Type | Thème | Autorité | Accès | Année | Résumé | Intérêt simulateur |
|---|-------|-----------|------|-------|----------|-------|-------|--------|-------------------|
| A1.1 | NF EN 1995-1-1 (Eurocode 5) | CEN / AFNOR | Norme européenne | Calcul structures bois — règles générales | ★★★ Norme | Payant (AFNOR) | 2005 + A1:2008 + A2:2014 | Méthode de dimensionnement des éléments bois (flexion, compression, flambement, assemblages). Classe de service 1/2/3. | Dimensionnement poteaux pergola/carport, chevrons, pannes. Essentiel pour tout module structurel. |
| A1.2 | NF EN 1995-1-2 | CEN / AFNOR | Norme européenne | Calcul au feu structures bois | ★★★ Norme | Payant | 2005 | Justification résistance au feu. | Hors scope simulateur DIY. |
| A1.3 | NF EN 1991-1-3 (Eurocode 1) | CEN / AFNOR | Norme européenne | Charges de neige | ★★★ Norme | Payant | 2004 | Charges neige selon zone, altitude. | Carport, pergola couverte. |
| A1.4 | NF EN 1991-1-4 (Eurocode 1) | CEN / AFNOR | Norme européenne | Actions du vent | ★★★ Norme | Payant | 2005 | Pression vent selon zone, exposition, hauteur. | Carport, clôture, pergola. |

### A2. NF DTU (Documents Techniques Unifiés)

| # | Titre | Organisme | Type | Thème | Autorité | Accès | Année | Résumé | Intérêt simulateur |
|---|-------|-----------|------|-------|----------|-------|-------|--------|-------------------|
| A2.1 | NF DTU 31.1 | CSTB | DTU | Charpente en bois | ★★★ Norme | Payant (boutique CSTB) | Rév. en vigueur | Clauses de conception et mise en œuvre des charpentes taillées : fermes, solivages, pannes, chevrons. | Modules cabanon (toiture), carport, pergola couverte. Entraxes chevrons, sections, assemblages. |
| A2.2 | NF DTU 31.2 | CSTB | DTU | Ossature bois — maisons et bâtiments | ★★★ Norme | Payant | Avril 2019 | Murs ossature bois, montants, lisses, contreventement, pare-pluie, pare-vapeur. | Module cabanon : entraxe montants 60 cm, section 45×145 ou 45×120, contreventement. Règle fondamentale du simulateur actuel. |
| A2.3 | NF DTU 31.4 | CSTB | DTU | Façades à ossature bois | ★★★ Norme | Payant | En vigueur | Façades rapportées sur structure porteuse. | Hors scope immédiat (abris DIY ne sont pas des façades). |
| A2.4 | NF DTU 41.2 | CSTB | DTU | Revêtements extérieurs en bois (bardage) | ★★★ Norme | Payant | Août 2015, 2e tirage juil. 2024 | Pose bardage bois : lames horizontales/verticales, entraxe tasseaux, lame d'air ventilée, pare-pluie. Claire-voie en annexe A. | Module cabanon (bardage), futur module bardage autonome. Épaisseur lame d'air ≥20 mm, entraxe tasseaux ≤65 cm. |
| A2.5 | NF DTU 51.4 | CSTB | DTU | Platelages extérieurs en bois (terrasses) | ★★★ Norme | Payant | Nov. 2018 (rév. de déc. 2010) | Mise en œuvre terrasses bois sur plots/lambourdes. Entraxes, jeux, ventilation, fixations, classes d'emploi. | Module terrasse : entraxe lambourdes 40-50 cm, plots entraxe ≤70 cm, jeu lames 3-12 mm, ventilation 1/50e surface. Moteur terrasse actuel basé dessus. |

### A3. Fascicules et normes complémentaires

| # | Titre | Organisme | Type | Thème | Autorité | Accès | Année | Résumé | Intérêt simulateur |
|---|-------|-----------|------|-------|----------|-------|-------|--------|-------------------|
| A3.1 | FD P 20-651 | AFNOR | Fascicule de documentation | Durabilité des éléments et ouvrages en bois | ★★★ Référentiel | Payant | 2011 | Détermination classe d'emploi selon exposition, massivité, conception. Couvre classes 1-4, durabilité naturelle vs conférée. | Tous modules : choix essence, alerte classe d'emploi dans le PDF, rendu visuel (teinte bois selon essence/traitement). |
| A3.2 | NF EN 335 | CEN | Norme européenne | Définition des classes d'emploi | ★★★ Norme | Payant | 2013 | Définitions officielles des 5 classes d'emploi (1 à 5). | Référence pour les alertes durabilité du simulateur. |
| A3.3 | NF EN 350 | CEN | Norme européenne | Durabilité naturelle du bois massif | ★★ Norme | Payant | 2016 | Classement durabilité naturelle des essences (1=très durable à 5=non durable). | Choix essences pour BOM, alertes PDF. |
| A3.4 | NF EN 14592 | CEN | Norme produit | Fixations de type tige pour structures bois | ★★★ Norme | Payant | Rév. 2022 | Exigences vis, tirefonds, boulons, pointes pour structures portantes bois. Marquage CE. Protection corrosion par classe de service. | Calcul fixations BOM (vis inox terrasse, vis bardage, équerres, tirefonds charpente). |
| A3.5 | NF B 54-040 | AFNOR | Norme produit | Lames de platelage en bois | ★★ Norme | Payant | 2018 | Caractéristiques des lames de terrasse bois (dimensions, tolérances, profils, marquage). | Module terrasse : validation dimensions lames dans le moteur. |

---

## B. Guides techniques applicatifs

### B1. Guides FCBA / CODIFAB

| # | Titre | Organisme | Type | Thème | Autorité | Accès | Année | Résumé | Intérêt simulateur |
|---|-------|-----------|------|-------|----------|-------|-------|--------|-------------------|
| B1.1 | Guide COBEI — Conception des ouvrages bois exposés aux intempéries | FCBA / CODIFAB | Guide technique | Classes d'emploi, conception durable, exemples (pergola, garde-corps, platelage) | ★★★ Guide de référence | **Gratuit** — [PDF CODIFAB](https://www.codifab.fr/uploads/media/62d831d274a85/guide-cobei-web-juin-2022.pdf) | Juin 2022 | 90 pages. Chapitre 1 : classes d'emploi. Chapitres 2-4 : exemples d'ouvrages (structure, menuiserie, parement). Dépasse les DTU actuels. | **SOURCE PRIORITAIRE** — pergola, garde-corps, platelage, bardage. Exemples directement exploitables pour geometry + rendu. |
| B1.2 | Guide Initiation à la Charpente (version Eurocodes) | FCBA | Guide pédagogique | Dimensionnement éléments simples : solives, pannes, chevrons, poteaux | ★★ Guide | Payant (FCBA) | En vigueur | Abaques de dimensionnement EC5 pour éléments courants. | Carport, pergola : abaques pour sections chevrons/pannes sans calcul EC5 complet. |
| B1.3 | Guide Terrasse FNB-LCB-ATB-ARBUST-FCBA | FNB / FCBA / ATB / ARBUST | Guide de conception et réalisation | Terrasses bois complètes | ★★★ Guide | **Gratuit** — [PDF FranceBoisForet](https://franceboisforet.fr/wp-content/uploads/2020/06/Guide_Terrasse-FNB-LCB-ATB-ARBUST-FCBA_avec_liens_BD.pdf) | V4, mars 2020 | Conception courante et élaborée, entraxes, plots, ventilation, double lambourde, jeux. Conforme DTU 51.4. | **SOURCE PRIORITAIRE** — terrasse avancée. Valide et complète le moteur terrasse actuel. |
| B1.4 | Mémento technique Platelages extérieurs (NF DTU 51.4 + NF B 54-040) | ARBUST | Mémento synthétique | Terrasses bois — résumé normatif | ★★ Synthèse | **Gratuit** — [PDF FranceBois2024](https://www.francebois2024.com/wp-content/uploads/Memento-technique-Platelages-ext%C3%A9rieurs-en-bois-NF-DTU-ARBUST-BD.pdf) | En vigueur | Résumé condensé du DTU 51.4 et de la norme lames. | Référence rapide pour valider les paramètres moteur terrasse. |
| B1.5 | FCBA — Platelages bois : aide à la conception (Cahier technique) | FCBA | Cahier technique | Aide à la conception terrasses | ★★ Guide | **Gratuit** — [PDF FCBA](https://www.fcba.fr/wp-content/uploads/2023/04/WS130_cahier-tech-fcba-V2.pdf) | 2023 | Complément au guide terrasse, focus conception détaillée. | Terrasse avancée : détails constructifs supplémentaires. |
| B1.6 | Guide bardage en plaques sur ossature bois | FCBA / CODIFAB | Guide technique | Bardage plaques sur MOB | ★★ Guide | **Gratuit** — [PDF CODIFAB](https://www.codifab.fr/uploads/media/64f6e55b0405a/2022-fcba-b-11-47-guide-bardage-plaque-ob-codifab-v2.pdf) | 2022 | Bardage plaques (HPL, fibres-ciment) sur ossature bois. | Module bardage futur : principes de pose, ventilation, fixations. |
| B1.7 | Résumé plateforme EC5 (CODIFAB 2024) | CODIFAB / FCBA | Synthèse | Eurocode 5 — outils numériques | ★★ Support | **Gratuit** — [PDF CODIFAB](https://www.codifab.fr/uploads/media/65cf8fb00d2da/resume-codifab-plateforme-ec5-2023.pdf) | 2024 | Présentation des outils numériques EC5 développés. | Référence pour valider les futurs calculs structurels. |

### B2. Autres guides professionnels

| # | Titre | Organisme | Type | Thème | Autorité | Accès | Année | Résumé | Intérêt simulateur |
|---|-------|-----------|------|-------|----------|-------|-------|--------|-------------------|
| B2.1 | Règles professionnelles CC5-R0 — Clôtures | UNEP (Les Entreprises du Paysage) | Règles professionnelles | Clôtures bois et composite | ★★ Règles pro | **Gratuit** — [PDF UNEP](https://www.lesentreprisesdupaysage.fr/content/uploads/2020/02/cc5-r0_-regles-pro_numerique.pdf) | 2020 | Conception, pose, scellement poteaux, espacement, résistance vent. Couvre bois, composite, métal. | **SOURCE PRIORITAIRE** — module clôture. Hauteurs, scellement, entraxes poteaux. |
| B2.2 | Guide BILP Pergola (compatible EC5) | BILP / UICB | Outil en ligne + guide | Pergola bois : dimensionnement EC5 | ★★ Outil pratique | **Gratuit** — [pergola.bilp.fr](https://pergola.bilp.fr/) | En vigueur | Outils de calcul en ligne : charges toiture, chevrons, pannes, poteaux. Descente de charge. | **SOURCE PRIORITAIRE** — module pergola. Logique de descente de charge à implémenter. |
| B2.3 | Guide BILP Carport (compatible EC5) | BILP / UICB | Outil en ligne + guide | Carport bois : dimensionnement EC5 | ★★ Outil pratique | **Gratuit** — [carport.bilp.fr](https://carport.bilp.fr/) | En vigueur | Mêmes outils que pergola, adaptés carport. Classes de service 2 (extérieur abrité). | **SOURCE PRIORITAIRE** — module carport. |
| B2.4 | CTB B+ — Classes d'emploi des bois | FCBA (certification CTB B+) | Guide pédagogique | Classes d'emploi, préservation | ★★ Support | **Gratuit** — [PDF CTB B+](https://ctbbplus.fr/wp-content/uploads/2020/05/BIEN-COMPRENDRE-LES-CLASSES-DEMPLOI.pdf) | 2020 | Explication accessible des classes 1-4, durabilité naturelle vs conférée, choix essences. | Alertes utilisateur, aide au choix essence dans le PDF export. |
| B2.5 | ATIBT — Durabilité et classes d'emploi (bois tropicaux) | ATIBT | Guide technique | Durabilité bois tropicaux | ★★ Guide | **Gratuit** — [PDF ATIBT](https://www.atibt.org/files/upload/technical-publications/publications-bois-tropical/4-DURABILITE-ET-CLASSE-D-EMPLOIS.pdf) | En vigueur | Durabilité naturelle des bois tropicaux, classement par essence. | Terrasse bois exotique : validation choix essence (ipé, cumaru, etc.). |
| B2.6 | Assemblages POB — Vis et tire-fonds (FCBA/IRABOIS) | FCBA / IRABOIS | Fiche technique | Fixations bois — vis et tirefonds | ★★ Fiche | **Gratuit** — [PDF Catalogue Bois Construction](https://catalogue-bois-construction.fr/wp-content/uploads/2017/05/4105-vis-et-tire-fonds.pdf) | 2015 | Caractéristiques mécaniques des vis et tirefonds pour assemblages bois. | Calcul fixations BOM : nombre de vis, type, diamètre selon charge. |
| B2.7 | Résoluement Bois — Les clés d'une terrasse bois | UICB | Brochure vulgarisation | Terrasses bois — bonnes pratiques | ★ Support | **Gratuit** — [PDF UICB](https://www.uicb.pro/wp-content/uploads/2021/07/Resolument-bois-terrasse.pdf) | 2021 | Brochure grand public sur les bonnes pratiques terrasses bois. | Référence secondaire pour textes d'aide du simulateur. |

---

## C. Documents à rechercher (non encore trouvés ou payants)

| # | Document | Raison de l'intérêt | Statut |
|---|----------|-------------------|--------|
| C1 | NF DTU 51.4 — texte intégral | Valeurs exactes entraxes, sections minimales, tableaux de dimensionnement | Payant — boutique CSTB |
| C2 | NF DTU 31.2 — texte intégral | Entraxe montants, sections, contreventement, pare-pluie/pare-vapeur | Payant — boutique CSTB |
| C3 | NF DTU 41.2 — texte intégral | Bardage : entraxe tasseaux, lame d'air, fixations, profils de lames | Payant — boutique CSTB |
| C4 | Guide FCBA « Initiation Charpente » version EC5 | Abaques dimensionnement chevrons/pannes/poteaux | Payant — FCBA |
| C5 | Recommandations RAGE/PACTE ossature bois | Compléments DTU 31.2 pour les points singuliers | À rechercher — programme RAGE terminé |
| C6 | Guide conception balcons/terrasses en surélévation | Étanchéité, relevés, garde-corps | Non trouvé en accès libre |

---

## Arborescence documentaire recommandée

```
docs/
├── wood-construction-corpus.md          ← CE FICHIER — catalogue des sources
├── wood-construction-rules.json         ← règles structurées par thème
├── wood-construction-open-questions.md  ← zones incertaines et arbitrages
├── sources/                             ← PDFs téléchargés (gitignored)
│   ├── guide-cobei-web-juin-2022.pdf
│   ├── guide-terrasse-fnb-fcba-v4.pdf
│   ├── memento-platelages-arbust.pdf
│   ├── regles-pro-clotures-cc5-r0.pdf
│   └── ...
└── modules/                             ← règles spécifiques par module (futur)
    ├── pergola-rules.md
    ├── cloture-rules.md
    ├── carport-rules.md
    └── terrasse-advanced-rules.md
```
