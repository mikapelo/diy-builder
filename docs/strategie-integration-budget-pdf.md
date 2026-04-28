# Strategie d'integration BOM detaillee + Budget par enseigne dans le PDF

Date : 2026-04-07
Statut : Specification technique pre-implementation

---

## 1. Etat des lieux

### 1.1 Couche pricing existante (reusable)

Deux couches coexistent :

| Couche | Fichier | Logique | Utilise par |
|---|---|---|---|
| Ancienne (taux/m2) | `lib/priceConstants.js` | `area * rate + slabTotal` | ExportPDF/index.jsx, DeckSimulator.jsx |
| Nouvelle (detaillee) | `lib/costCalculator.js` + `lib/materialPrices.js` | `calculateDetailedCost(structure, storeId, projectType)` | MaterialsList, BudgetOverview, PriceComparator |

La couche nouvelle expose 3 fonctions pures :

```
calculateDetailedCost(structure, storeId, projectType)
  -> [{ materialId, label, quantity, unit, unitPrice, subtotal, category }]

calculateTotalCost(detailedLines)
  -> number (somme subtotals)

groupByCategory(detailedLines)
  -> { [category]: [lines...] }
```

Supporte les 4 modules : cabanon, terrasse, pergola, cloture.
Fallback integre : si un materialId n'existe pas, `getUnitPrice()` retourne null, et subtotal = 0.

### 1.2 PDF actuels - Ce qu'ils contiennent deja

| Module | Pages | BOM actuelle | Prix actuel |
|---|---|---|---|
| Cabanon (5p) | 3D + dessus + facade + coupe + BOM | Quantites par groupe (structure, toiture, bardage, quincaillerie) sans prix | Aucun |
| Terrasse (4p) | Header+mat+prix + fondation + dessus + coupe | Liste quantites + tableau prix par enseigne | Oui mais rate/m2 (ancien systeme) |
| Pergola (3p) | BOM + dessus + elevation | Liste quantites, pas de prix | Aucun |
| Cloture (2p) | BOM + elevation | Liste quantites, pas de prix | Aucun |

### 1.3 Ecart UI / PDF

L'UI affiche deja dans MaterialsList :
- Prix unitaire par materiau
- Sous-total par ligne
- Total par enseigne
- Changement d'enseigne interactif

Le PDF n'en affiche rien (sauf terrasse avec l'ancien systeme).

---

## 2. Comment exploiter la couche existante

### 2.1 Point d'entree unique

Dans `ExportPDF/index.jsx`, avant d'appeler chaque `generateXxxPDF()` :

```js
import { calculateDetailedCost, calculateTotalCost, groupByCategory } from '@/lib/costCalculator.js';
import { STORES } from '@/lib/materialPrices.js';

// Calculer pour les 3 enseignes
const budgetByStore = STORES.map(store => {
  const lines = calculateDetailedCost(materials, store.id, projectType);
  const total = calculateTotalCost(lines);
  const categories = groupByCategory(lines);
  return { store, lines, total, categories };
});

// Trier par prix croissant
budgetByStore.sort((a, b) => a.total - b.total);
const bestPrice = budgetByStore[0]?.total ?? 0;
```

Puis passer `{ budgetByStore, bestPrice }` a chaque generateur PDF.

### 2.2 Remplacement du systeme terrasse

Le terrasse utilise encore `priceConstants.js` (rate/m2). Le nouveau systeme le remplace naturellement :

```js
// AVANT (dans index.jsx)
const prices = STORES.map(s => ({
  ...s,
  deckTotal: Math.round(area * s.rate),
  total:     Math.round(area * s.rate + (isSlab ? (slab?.totalPrice ?? 0) : 0)),
}));

// APRES
const budgetByStore = STORES_NEW.map(store => {
  const lines = calculateDetailedCost(materials, store.id, 'terrasse');
  const matTotal = calculateTotalCost(lines);
  return {
    store,
    lines,
    matTotal,
    total: matTotal + (isSlab ? (slab?.totalPrice ?? 0) : 0),
    categories: groupByCategory(lines),
  };
});
```

### 2.3 Pas de duplication de logique

Regle : le PDF n'effectue AUCUN calcul de prix. Il recoit des tableaux pre-calcules et les met en forme. La seule logique autorisee dans les fichiers PDF est le formatage (`toFixed(2)`, `toLocaleString()`).

---

## 3. Structure des pages Budget/BOM

### 3.1 PDF Standard (gratuit - future)

Contenu budget dans le standard :
- Total par enseigne (3 cartes) avec badge "Meilleur prix"
- Pas de detail par ligne
- Pas de prix unitaires
- Pas de sous-totaux par categorie

Equivalent a ce que fait deja `BudgetOverview.jsx` (3 tiers eco/equilibre/premium).

### 3.2 Dossier Complet (premium - future)

Page budget complete avec 4 zones :

**Zone A - Comparatif enseignes (haut de page)**
3 cartes horizontales identiques au PDF terrasse actuel :
- Nom enseigne
- Total TTC
- Badge "Meilleur prix" sur le moins cher
- Ligne "Estimation basee sur X m2"

**Zone B - BOM detaillee par categorie (corps de page)**
Tableau groupe par categorie avec colonnes :
| Designation | Qte | Unite | P.U. (meilleur) | Sous-total |

Categories attendues par module :

| Module | Categories |
|---|---|
| Cabanon | Ossature, Toiture, Revetement, Quincaillerie, (Fondations) |
| Terrasse | Structure, Fixation, (Fondations) |
| Pergola | Structure, Quincaillerie |
| Cloture | Structure, Quincaillerie |

Le prix unitaire et sous-total affiches correspondent a l'enseigne la moins chere.

**Zone C - Sous-totaux par categorie**
Ligne de resume :
```
Ossature : 245.00 EUR | Toiture : 182.50 EUR | Quincaillerie : 67.80 EUR
```

**Zone D - Total + disclaimer**
```
TOTAL MATERIAUX : 495.30 EUR (Brico Depot)
+ Fondation dalle beton : 380.00 EUR (si applicable)
= TOTAL PROJET : 875.30 EUR
```

Disclaimer : "Estimation indicative. Prix constates mars 2025. Hors pose, livraison et outillage."

### 3.3 Layout physique recommande

Pour les modules qui ont deja une page BOM (cabanon P5, pergola P1, cloture P1) :

**Option retenue : enrichir la page BOM existante + ajouter 1 page budget**

- Page BOM existante : ajouter colonnes P.U. et Sous-total au tableau existant
- Nouvelle page Budget : comparatif enseignes + totaux + disclaimer

Pour la terrasse (qui a deja des prix) :
- Page 1 existante : remplacer les cartes rate/m2 par les cartes detaillees

Nombre de pages apres integration :

| Module | Avant | Apres |
|---|---|---|
| Cabanon | 5 | 6 (P5 BOM enrichie + P6 comparatif budget) |
| Terrasse | 4 | 4 (P1 enrichie, pas de page supplementaire) |
| Pergola | 3 | 4 (P1 BOM enrichie + P2 budget, plans decales) |
| Cloture | 2 | 3 (P1 BOM enrichie + P2 budget, plan decale) |

---

## 4. Fichiers touches

### 4.1 Modifications

| Fichier | Nature | Risque |
|---|---|---|
| `ExportPDF/index.jsx` | Import costCalculator, calcul budgetByStore, passage aux generateurs | Faible - point d'entree unique |
| `cabanonPDF.js` | P5 : ajouter colonnes prix au drawMatGroup. Nouvelle P6 budget. TOTAL 5->6 | Moyen - page existante modifiee |
| `terrassePDF.js` | P1 : remplacer cartes rate/m2 par cartes detaillees | Moyen - refonte zone prix existante |
| `pergolaPDF.js` | P1 : ajouter colonnes prix. Nouvelle P2 budget. Decaler plans P2->P3, P3->P4. TOTAL 3->4 | Moyen - reindexation pages |
| `cloturePDF.js` | P1 : ajouter colonnes prix. Nouvelle P2 budget. Decaler plan P2->P3. TOTAL 2->3 | Moyen - reindexation pages |

### 4.2 Fichiers NON touches

| Fichier | Raison |
|---|---|
| `lib/costCalculator.js` | Consomme tel quel |
| `lib/materialPrices.js` | Consomme tel quel |
| `lib/priceConstants.js` | Deprece a terme mais pas supprime (backward compat) |
| Tous les engines | Interdit par regle projet |
| Tous les plan builders | Pas de changement de rendu technique |
| `renderPDF.js` | Pas de nouveau type de primitive |
| `pdfDrawing.js` | Potentiellement un nouveau helper `drawBudgetCards()` mais optionnel |

### 4.3 Nouveau fichier recommande (optionnel)

`ExportPDF/pdfBudgetSection.js` - Helper partage pour dessiner :
- Les 3 cartes comparatif enseignes
- Le tableau BOM avec prix
- Le bloc totaux + disclaimer

Avantage : evite de dupliquer le layout budget dans 4 fichiers PDF differents.

---

## 5. Risques identifies

### 5.1 Surcharge documentaire

**Risque :** Les pages BOM enrichies avec prix deviennent trop denses, surtout cabanon (13 lignes materiaux + fondation).

**Mitigation :**
- Garder la colonne "Detail" actuelle mais la raccourcir (max 30 chars)
- Police 7.5pt pour le tableau, 9pt pour les totaux
- Si le tableau depasse 180mm de haut, splitter en 2 colonnes ou passer sur 2 pages
- Tester avec le cas le plus dense : cabanon 5x4 + dalle beton

### 5.2 Duplication de logique

**Risque :** Recalculer les prix dans le PDF au lieu d'utiliser la couche existante.

**Mitigation :**
- Regle stricte : le PDF recoit `budgetByStore` pre-calcule
- Aucun import de `materialPrices.js` dans les fichiers xxxPDF.js
- Le seul import autorise est `costCalculator` dans `index.jsx` (orchestrateur)

### 5.3 Divergence UI / PDF

**Risque :** L'UI affiche 495.30 EUR et le PDF affiche 492.80 EUR pour le meme projet.

**Causes potentielles :**
- L'UI utilise `materialPrices.js` + `costCalculator.js` (nouveau systeme)
- Le PDF terrasse utilise encore `priceConstants.js` (ancien systeme, rate/m2)
- Arrondis differents (UI: `toFixed(2)`, PDF: `Math.round()`)

**Mitigation :**
- Migrer le PDF vers le meme systeme que l'UI (calculateDetailedCost)
- Standardiser le formatage : `(x).toFixed(2)` partout, arrondi final au centime
- Test de non-regression : pour 3 tailles par module, verifier que le total PDF = total UI

### 5.4 Echec du calcul detaille

Voir section 6.

### 5.5 Pagination cassee

**Risque :** L'ajout de pages decale les numeros de cartouche.

**Mitigation :**
- Centraliser TOTAL en constante en haut de chaque fichier PDF
- Utiliser un compteur auto-incremente au lieu de numeros en dur
- Tester chaque module apres modification

---

## 6. Strategie de fallback

Si `calculateDetailedCost()` retourne un tableau vide ou echoue :

### 6.1 Detection

```js
const lines = calculateDetailedCost(materials, store.id, projectType);
const isValid = lines.length > 0 && lines.every(l => l.unitPrice != null);
```

### 6.2 Fallback niveau 1 : prix partiels

Si certaines lignes ont `unitPrice: null` (materiau inconnu dans materialPrices) :
- Afficher la ligne avec "-" dans la colonne prix
- Marquer le total avec un asterisque : "Total partiel*"
- Ajouter une note : "* Certains materiaux n'ont pas de prix reference"

### 6.3 Fallback niveau 2 : pas de prix du tout

Si `lines.length === 0` ou exception :
- Afficher la BOM sans colonnes prix (comportement actuel)
- Remplacer la zone comparatif enseignes par un encart :
  "Estimation budgetaire non disponible pour cette configuration."
- Logger l'erreur en console pour debug

### 6.4 Fallback terrasse specifique

Pour la terrasse, conserver le calcul `priceConstants.js` (rate/m2) comme fallback :

```js
let budgetByStore;
try {
  budgetByStore = STORES_NEW.map(store => { /* ... detailed ... */ });
  if (budgetByStore[0].lines.length === 0) throw new Error('empty');
} catch {
  // Fallback ancien systeme
  budgetByStore = STORES_OLD.map(s => ({
    store: { id: s.logo, name: s.name },
    total: Math.round(area * s.rate + slabTotal),
    lines: [],
    categories: {},
    fallback: true,
  }));
}
```

---

## 7. Niveau de QA attendu

### 7.1 Tests automatises

| Test | Outil | Quoi |
|---|---|---|
| Coherence UI/PDF | Jest | Pour 3 configs (petit/moyen/grand) par module, verifier que `calculateTotalCost` retourne le meme total que l'UI |
| Fallback | Jest | Appeler `calculateDetailedCost` avec structure incomplete, verifier graceful degradation |
| Non-regression BOM | Jest | Verifier que les quantites dans le PDF matchent les quantites engine |

### 7.2 Tests visuels

| Test | Outil | Quoi |
|---|---|---|
| Rendu page budget | pdftoppm + Read | Generer un PDF cabanon 3x4 + dalle, verifier que P5 et P6 sont lisibles |
| Overflow | pdftoppm | Generer un cabanon 5x4 + dalle (cas dense), verifier que le tableau ne deborde pas |
| Comparatif enseignes | pdftoppm | Verifier que les 3 cartes sont alignees et que le badge "Meilleur prix" est sur le bon |

### 7.3 Tests manuels

- Ouvrir le simulateur, configurer un projet, exporter le PDF
- Verifier que le total affiche dans le PDF correspond au total affiche dans BudgetOverview
- Tester chaque module (cabanon, terrasse, pergola, cloture)
- Tester avec et sans dalle beton (cabanon, terrasse)

### 7.4 Criteres d'acceptation

1. Le PDF utilise `costCalculator.js` comme source unique de prix (pas de calcul en dur)
2. Les totaux PDF correspondent aux totaux UI a +/- 0.01 EUR
3. L'ajout de pages ne casse pas les numeros de cartouche
4. Le fallback fonctionne si `materialPrices.js` ne couvre pas un materiau
5. Aucun caractere Unicode hors WinAnsiEncoding dans les nouvelles sections
6. La page budget est visuellement coherente entre les 4 modules

---

## 8. Ordre d'implementation recommande

| Sprint | Scope | Fichiers | Risque |
|---|---|---|---|
| S1 | Helper partage `pdfBudgetSection.js` + calcul dans `index.jsx` | 2 fichiers nouveaux/modifies | Faible |
| S2 | Integration cabanon (P5 enrichie + P6 budget) | cabanonPDF.js | Moyen |
| S3 | Migration terrasse (P1 remplacement rate/m2) | terrassePDF.js | Moyen |
| S4 | Integration pergola (P1 enrichie + P2 budget) | pergolaPDF.js | Faible |
| S5 | Integration cloture (P1 enrichie + P2 budget) | cloturePDF.js | Faible |
| S6 | QA transversale + fallback testing | tests/ | Faible |

Priorite cabanon > terrasse > pergola > cloture (coherent avec le polish P5 precedent).
