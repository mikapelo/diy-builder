# Questions ouvertes — Plans techniques DIY Builder

> Document EXPORT — DIY Builder
> Date : 2026-03-30
> Objectif : lister les incertitudes, arbitrages nécessaires, données manquantes, et limites de simplification pour l'évolution des PDF techniques.

---

## 1. Données manquantes côté moteur

### 1.1 Pergola — Positions géométriques

**Question** : Le moteur pergola retourne le nombre de poteaux, longerons, traverses et chevrons, ainsi que leurs longueurs. Mais il ne retourne pas les **positions XZ précises** des poteaux ni l'**espacement exact** des chevrons en coordonnées.

**Impact** : Sans positions, le plan de dessus pergola ne peut être dessiné avec des cotations précises — seulement un schéma de principe.

**Options** :
- A) Dessiner un plan schématique avec positions calculées à partir de width/depth et du nombre de poteaux (4 coins = facile)
- B) Demander à ENGINE d'exposer `postPositions[]` et `rafterPositions[]` dans la sortie du moteur

**Recommandation** : Option A suffit pour 4 poteaux (coins). Si le moteur évolue vers des pergolas à travées multiples (6+ poteaux), option B deviendra nécessaire.

### 1.2 Clôture — Hauteurs de rails

**Question** : Le moteur clôture calcule le nombre de rails mais ne spécifie pas leur position verticale (hauteur sur le poteau).

**Impact** : La coupe de poteau ne peut pas montrer les positions exactes des rails.

**Options** :
- A) Utiliser des positions fixes conventionnelles (ex : 1/3 et 2/3 de la hauteur, ou constantes RAIL_INSET)
- B) Ajouter `railYPositions[]` dans la sortie moteur

**Recommandation** : Vérifier si `clotureConstants.js` contient déjà `RAIL_INSET` ou des positions. Si oui, utiliser. Sinon, conventions fixes acceptables pour un simulateur.

### 1.3 Terrasse — Type de fixation

**Question** : Le moteur terrasse ne distingue pas le type de fixation des lames (vis par le dessus, clips invisibles, vis par le dessous, collage).

**Impact** : Le détail de fixation lame/lambourde (vue P3) ne peut pas être spécifique au projet.

**Recommandation** : Phase 4. Pour l'instant, montrer un détail générique "vis par le dessus" qui est la méthode la plus courante.

### 1.4 Profondeur de scellement / fondation

**Question** : Les moteurs pergola et clôture ne modélisent pas la profondeur d'ancrage au sol des poteaux.

**Impact** : Les coupes de poteau ne peuvent montrer la partie enterrée avec précision.

**Options** :
- A) Utiliser une profondeur conventionnelle (50 cm pour clôture, 60-80 cm pour pergola)
- B) Ajouter un paramètre `frostDepth` ou `anchorDepth` à l'interface utilisateur

**Recommandation** : Option A pour la phase 3. La profondeur de gel varie par région — un paramètre utilisateur serait plus correct mais relève d'une évolution future.

---

## 2. Conventions à arbitrer

### 2.1 Échelle — Afficher ou calculer ?

**Question** : Les PDF actuels n'indiquent pas d'échelle. Faut-il calculer et afficher l'échelle réelle (1:50, 1:20, etc.) sur chaque page de plan ?

**Pour** : Standard professionnel, crédibilité, permet à l'utilisateur de mesurer sur le papier imprimé.
**Contre** : L'échelle dépend du format d'impression (A4 à l'écran vs A4 imprimé vs A3). Afficher "1:50" alors que l'utilisateur zoome à l'écran est trompeur.

**Recommandation** : Afficher l'échelle de dessin théorique (basée sur A4) ET ajouter une **barre d'échelle graphique** (segment coté "1 m" en bas du plan). La barre d'échelle reste correcte même en zoom/impression redimensionnée.

### 2.2 Unités — cm vs mm vs m

**Question** : Les dimensions globales sont en mètres (3.50 m), les sections bois en mm (45×145 mm), les entraxes en cm (60 cm). Faut-il harmoniser ?

**Recommandation** : Garder la convention métier :
- Dimensions globales : **mètres** (2 décimales)
- Sections bois : **mm** (format L×l)
- Entraxes : **cm** (plus lisible que 0.60 m)
- Ajouter une note "Toutes dimensions en mètres sauf indication contraire" en cartouche

### 2.3 Couleur vs N&B

**Question** : Les plans techniques professionnels sont historiquement en noir et blanc. Les PDF actuels de DIY Builder utilisent la couleur. Faut-il passer en N&B ?

**Pour** : Plus professionnel, compatible impression économique.
**Contre** : Les utilisateurs DIY préfèrent la couleur (plus lisible, plus engageant). Le SVG TechnicalPlan utilise des couleurs.

**Recommandation** : Rester en couleur mais s'assurer que chaque vue est **lisible en N&B** (contraste suffisant, pas de distinction basée uniquement sur la teinte). Utiliser la couleur comme complément des épaisseurs de traits, pas comme substitut.

### 2.4 Nombre de pages maximum par module

**Question** : Le corpus montre des sets de plans allant de 2 à 9+ pages. Quel est le bon compromis pour un simulateur DIY ?

**Recommandation** :
- Terrasse : **4 pages** (actuel = bon)
- Cabanon : **5 pages** (3D + dessus + façade + coupe + BOM)
- Pergola : **3 pages** (synthèse + plan+élévations + BOM)
- Clôture : **2-3 pages** (synthèse+BOM + élévation+coupe)

Au-delà, le document devient trop long pour un usage DIY. Garder la possibilité d'ajouter des pages "détails" en option ultérieure.

---

## 3. Hypothèses de simplification à assumer

### 3.1 Ce que le simulateur simplifie volontairement

| Simplification | Justification | Risque |
|---|---|---|
| **Pas de calcul de charge** (neige, vent, exploitation) | Le simulateur est un outil de pré-dimensionnement, pas un bureau d'études | L'utilisateur pourrait croire que les quantités sont validées structurellement |
| **Entraxes fixes** (60 cm montants, 40 cm lambourdes) | Conventions DTU standards, pas de calcul de portée spécifique | Correct pour les cas courants, peut être insuffisant pour de grandes portées |
| **Pas de plan d'exécution** | Le plan est un guide de montage, pas un document de permis de construire | Mentionner clairement "document non contractuel" |
| **Fondations simplifiées** | Plots standards ou dalle, sans étude de sol | La profondeur de gel et le type de sol ne sont pas pris en compte |
| **Assemblages non détaillés** | Le type exact de quincaillerie n'est pas modélisé pièce par pièce | Les quantités de vis/boulons sont approximatives |

### 3.2 Mentions à ajouter dans les PDF

Pour chaque simplification, une mention correspondante devrait apparaître dans le PDF :

```
"Ce document est un guide de pré-dimensionnement généré par simulation.
Il ne remplace pas une étude technique par un professionnel qualifié.
Les quantités incluent une marge de sécurité mais doivent être vérifiées
avant commande. Pour les ouvrages de plus de 20 m² ou dépassant 1.80 m
de hauteur, une déclaration préalable ou un permis de construire
peut être nécessaire."
```

---

## 4. Ce qui ne doit PAS être codé sans validation

### 4.1 Changements qui touchent au moteur

| Demande potentielle | Pourquoi attendre |
|---|---|
| Ajouter des positions XZ dans le moteur pergola | Le moteur pergola est récent et fonctionne ; modifier sa sortie pour l'export impacte aussi la 3D |
| Ajouter des types de fixation au moteur terrasse | Changement d'interface utilisateur + moteur + export — trois sessions impactées |
| Modifier le format de sortie du moteur clôture | Risque de casser le rendu 3D existant |

**Règle** : toute modification du contrat de sortie d'un engine doit être validée par LEAD et implémentée par ENGINE, pas par EXPORT.

### 4.2 Conventions visuelles non encore arbitrées

| Convention | Pourquoi attendre |
|---|---|
| Hachures bois en coupe | Nécessite un choix de pattern (densité, angle) et un test d'impression |
| Repères numérotés plan ↔ BOM | Nécessite une refonte de la BOM et du plan simultanément |
| Format A3 optionnel | Nécessite des tests de mise en page sur les 4 modules |

---

## 5. Questions pour le LEAD

### 5.1 Priorités

1. Faut-il prioriser l'enrichissement des modules existants (terrasse, cabanon) ou la création de vues pour les modules vides (pergola, clôture) ?

2. Le cartouche enrichi et la hiérarchie de traits sont-ils suffisamment prioritaires pour être traités avant les nouvelles vues techniques ?

### 5.2 Périmètre

3. Les builders de primitives pour pergola et clôture doivent-ils utiliser le même système (`lib/plan/`) que le cabanon, ou un système plus simple (jsPDF direct comme la terrasse) ?

4. Faut-il aligner la terrasse sur le système de primitives du cabanon (refactor `drawTechnicalPlan2D` → primitives), ou laisser les deux approches coexister ?

### 5.3 Validation

5. Les conventions visuelles (traits, cartouche, légende) doivent-elles être validées sur un module pilote avant déploiement aux 4 modules ?

6. Quel module serait le meilleur pilote : terrasse (données riches, 4 pages) ou cabanon (primitives matures) ?

---

## 6. Résumé des décisions à prendre

| # | Question | Options | Recommandation EXPORT |
|---|---|---|---|
| 1 | Priorité enrichissement vs création | A) Enrichir existants d'abord, B) Créer vues manquantes d'abord | A — les quick wins sur terrasse/cabanon ont plus d'impact immédiat |
| 2 | Système de primitives unifié ? | A) Tout sur lib/plan/, B) Coexistence jsPDF direct + primitives | A à terme, B pour la phase 2 (ne pas bloquer) |
| 3 | Module pilote pour conventions | A) Terrasse, B) Cabanon | B — le cabanon a le pipeline primitives complet |
| 4 | Échelle sur les plans | A) Échelle numérique seule, B) Barre d'échelle, C) Les deux | C — maximum de lisibilité |
| 5 | Positions pergola | A) Calculées depuis dims, B) Ajout moteur | A pour phase 3, B si pergola multi-travées |
