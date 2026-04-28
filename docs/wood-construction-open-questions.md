# Questions ouvertes — Construction bois pour DIY Builder

> Zones incertaines, conflits entre sources, simplifications à valider, arbitrages produit nécessaires.
> Dernière mise à jour : 2026-03-29.

---

## 1. Règles pas encore confirmées par source primaire

### Q1.1 — Section montants cabanon 90×90 mm
- **Situation** : Le simulateur utilise `SECTION=0.09` (90×90 mm) pour les montants.
- **Problème** : Le NF DTU 31.2 prescrit des montants ≥36×120 mm pour les MOB habitables. 90×90 n'est pas une section DTU.
- **Hypothèse actuelle** : 90×90 est acceptable pour des abris non habités ≤20 m².
- **Risque** : Pas de référence normative explicite validant cette section pour un cabanon.
- **Action** : Rechercher si le DTU 31.1 (charpente) ou un guide FCBA couvre les abris de jardin en section réduite. Sinon, documenter comme `simulator_assumption`.
- **⚠️ NE PAS CODER comme norme.**

### Q1.2 — Contreventement cabanon simplifié à 2 panneaux
- **Situation** : Le moteur génère `contreventement=2`.
- **Problème** : Le DTU 31.2 exige un contreventement sur chaque face. Un cabanon 4 faces devrait avoir au minimum 4 éléments de contreventement (un par mur, ou 2 diagonales croisées par mur porteur).
- **Hypothèse actuelle** : Simplification géométrique pour le rendu 3D.
- **Action** : Vérifier la règle exacte pour les petits ouvrages. Le contreventement par OSB/panneau (voile travaillant) couvre-t-il toute la face ?

### Q1.3 — Pente minimale toiture mono-pente cabanon
- **Situation** : Le simulateur utilise `slope = width × 0.15` (≈15%).
- **Problème** : Le DTU 40.x (couvertures) prescrit des pentes minimales selon le type de couverture et la zone climatique. 15% (≈8.5°) peut être insuffisant pour certaines couvertures.
- **Hypothèse actuelle** : Simplification. Le cabanon utilise une couverture type bac acier ou membrane EPDM, compatibles avec faibles pentes.
- **Action** : Documenter les pentes minimales par type de couverture. Proposer une alerte si la pente est trop faible.

---

## 2. Conflits entre sources

### Q2.1 — Ventilation terrasse : 1/50e vs 1/100e
- **Source A** : NF DTU 51.4 révision 2018 → 1/50e de la surface.
- **Source B** : Ancienne version DTU 51.4 (2010) et certains guides → 1/100e.
- **Résolution** : La version 2018 fait foi. Le simulateur doit utiliser 1/50e.
- **Statut** : ✅ Résolu — règle TER-005 mise à jour.

### Q2.2 — Entraxe lambourdes 40 vs 50 cm
- **Source A** : DTU 51.4 → « 40 à 50 cm selon essence et épaisseur ».
- **Source B** : Simulateur actuel → `JOIST_SPACING=0.40` fixe.
- **Analyse** : 40 cm est conservateur et toujours conforme. 50 cm est acceptable pour lames ≥28 mm en bois dur.
- **Décision produit** : Garder 40 cm par défaut. Futur module « terrasse avancée » pourrait proposer 50 cm avec alerte.
- **Statut** : ✅ Résolu — conservatif retenu.

---

## 3. Hypothèses de simplification du simulateur

### Q3.1 — Pas de lame d'air modélisée en bardage
- **Réalité** : Le DTU 41.2 impose ≥20 mm de lame d'air ventilée entre pare-pluie et bardage.
- **Simulateur** : Le bardage est posé directement sur l'ossature (offset ~15 mm).
- **Impact** : Rendu 3D légèrement irréaliste (épaisseur mur sous-estimée de ~25 mm).
- **Décision** : Acceptable pour le rendu. À mentionner dans le PDF comme « simplifié ».
- **Priorité** : Basse — n'affecte pas le BOM ni la géométrie structurelle.

### Q3.2 — Pas de pare-pluie ni pare-vapeur dans le BOM
- **Réalité** : Le DTU 31.2 impose un pare-pluie côté extérieur et un pare-vapeur côté intérieur pour les MOB.
- **Simulateur** : Non inclus dans le BOM cabanon.
- **Impact** : BOM incomplet pour un cabanon habitable.
- **Décision** : Ajouter au BOM cabanon quand `height > 2.0` ou `surface > 10` ? À arbitrer.
- **Priorité** : Moyenne — améliore la crédibilité du devis.

### Q3.3 — Fondation simplifiée (dalle béton ou sol direct uniquement)
- **Réalité** : Les fondations peuvent être plots béton, longrines, radier, micropieux, etc.
- **Simulateur** : Deux options uniquement (`ground` ou `slab`).
- **Impact** : Couvre les cas les plus courants DIY.
- **Décision** : Suffisant pour V1. Futur module « fondations avancées » possible.

### Q3.4 — Seuils administratifs simplifiés
- **Réalité** : Les seuils dépendent du PLU, de la zone (ABF, site classé, etc.), de la hauteur, et de la surface plancher + emprise au sol combinées.
- **Simulateur** : 3 paliers simples (≤5, 5-20, >20 m²) avec wording prudent.
- **Risque** : Un utilisateur pourrait croire que ≤5 m² = aucune formalité, ce qui est faux en zone ABF.
- **Décision** : Wording actuel correct (« souvent », « probable », « vérifiez votre PLU »). Ne pas durcir.

---

## 4. Points nécessitant arbitrage produit

### Q4.1 — Module pergola : couverte ou ouverte ?
- **Options** :
  - Pergola ouverte (lattes espacées, pas de couverture étanche) → classe service 3
  - Pergola couverte (polycarbonate, canisse, toile) → classe service 2, charge supplémentaire
- **Impact moteur** : La descente de charge change radicalement.
- **Arbitrage nécessaire** : Proposer les deux en option ? Ou un seul type par défaut ?

### Q4.2 — Module clôture : panneau plein ou claire-voie ?
- **Options** : Panneau plein (occultant), panneau ajouré, lames horizontales, piquets verticaux.
- **Impact moteur** : Géométrie, prise au vent, quantité bois très différentes.
- **Arbitrage nécessaire** : Commencer par panneau plein (le plus courant) puis ajouter les variantes ?

### Q4.3 — Module carport : mono ou bi-pente ?
- **Options** : Mono-pente (adossé ou autoporté), bi-pente (autoporté).
- **Impact moteur** : Géométrie toiture, nombre de poteaux, descente de charge.
- **Arbitrage nécessaire** : Le mono-pente autoporté est le plus simple à implémenter.

### Q4.4 — Choix d'essence par module
- **Situation** : Le simulateur ne distingue pas les essences. Les prix sont calculés par m² sans détail essence.
- **Impact** : BOM imprécis, pas de validation durabilité.
- **Arbitrage** : Faut-il proposer un sélecteur d'essence (pin, douglas, mélèze, chêne, ipé…) ? Ça impacte le prix, la durabilité, le rendu visuel (teinte).
- **Recommandation** : Oui, à moyen terme. Commencer par « résineux traité » vs « bois dur » vs « exotique ».

---

## 5. Sources à approfondir

| Priorité | Source | Raison |
|---|---|---|
| 🔴 | Guide COBEI — chapitres 2-4 (exemples pergola, garde-corps) | Règles géométrie directement exploitables |
| 🔴 | Guide Terrasse FNB-FCBA V4 — tableaux de dimensionnement | Valeurs exactes sections/entraxes par essence |
| 🟡 | NF DTU 31.2 texte intégral (payant) | Validation sections montants et contreventement |
| 🟡 | NF DTU 41.2 texte intégral (payant) | Détails bardage (profils, fixations, claire-voie) |
| 🟡 | Règles UNEP CC5-R0 — sections détaillées clôture | Tableaux scellement/hauteur/espacement par type |
| ⚪ | DTU 40.x (couvertures) | Pentes minimales par type de couverture |
| ⚪ | NF EN 1991-1-3 AN (neige France) | Zones de neige par département pour carport/pergola |
| ⚪ | NF EN 1991-1-4 AN (vent France) | Zones de vent par département pour clôture/carport |
