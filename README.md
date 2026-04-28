# 🔨 DIY Builder — Calculateur de terrasse bois

**Prototype full-stack v3** · Next.js · Express · PostgreSQL · Docker

---

## 🎯 Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| Calculateur terrasse bois (surface, lames, lambourdes, vis) | ✅ |
| **Optimisation des découpes** (minimise les pertes de bois) | ✅ |
| Comparateur de prix Leroy Merlin / Castorama / Brico Dépôt | ✅ |
| Plan visuel SVG (contour + lambourdes + cotes) | ✅ |
| Partage par URL (`?largeur=4&longueur=5&type_bois=pin`) | ✅ |
| Tests Jest — 4 suites, 80+ cas | ✅ |
| Docker Compose — 1 commande pour tout lancer | ✅ |

---

## 📁 Structure du projet

```
diy-builder/
│
├── frontend/                           # Next.js 14 + React + Tailwind
│   ├── components/
│   │   ├── FormulaireTerrasse.jsx     # Saisie + validation + aperçu surface
│   │   ├── ListeMateriaux.jsx         # Matériaux + bloc optimisation découpe
│   │   ├── ComparateurPrix.jsx        # Tableau 3 magasins
│   │   └── PlanTerrasse.jsx           # Schéma SVG proportionnel
│   ├── hooks/
│   │   └── useCalculTerrasse.js       # Hook appel API avec état
│   ├── pages/
│   │   ├── _app.jsx
│   │   └── index.jsx                  # Page principale + partage URL
│   ├── styles/
│   │   └── globals.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.local.example
│
├── backend/                            # Node.js + Express
│   ├── calculations/
│   │   └── terrasse.js                # Moteur de calcul pur (quantités, vis)
│   ├── controllers/
│   │   └── terrasseController.js      # Orchestration requête → réponse
│   ├── database/
│   │   └── db.js                      # Pool de connexions PostgreSQL
│   ├── routes/
│   │   └── terrasse.js                # POST /api/calcul-terrasse
│   ├── services/
│   │   ├── optimisationDecoupe.js     # ⭐ Moteur d'optimisation des découpes
│   │   └── optimisationMateriaux.js   # Enrichissement BDD + prix + comparateur
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── schema.sql                     # Tables magasins · produits · prix + données
│
├── tests/
│   ├── terrasse.test.js               # 28 cas — moteur de calcul
│   ├── optimisation.test.js           # 20 cas — service optimisation + prix
│   ├── api.test.js                    # 18 cas — endpoints HTTP (supertest)
│   └── optimisationDecoupe.test.js    # ⭐ 60+ cas — algorithme de découpe
│
└── docker/
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    └── docker-compose.yml
```

---

## 🚀 Lancement — Docker (recommandé)

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) v24+ installé et **démarré**

### Une seule commande

```bash
# Depuis la racine du projet
docker-compose -f docker/docker-compose.yml up --build
```

Les 3 services démarrent dans l'ordre correct (healthchecks chaînés) :

| Service | URL |
|---|---|
| 🌐 Application | **http://localhost:3000** |
| ⚙️ API backend | http://localhost:4000 |
| 🐘 PostgreSQL | localhost:5432 |

> Le schéma SQL et les données d'exemple sont initialisés automatiquement au premier démarrage.

### Arrêt

```bash
# Arrêter les conteneurs
docker-compose -f docker/docker-compose.yml down

# Arrêter ET supprimer les données PostgreSQL
docker-compose -f docker/docker-compose.yml down -v
```

---

## 🛠 Lancement local (sans Docker)

### Prérequis
- **Node.js** v18+
- **PostgreSQL** v14+

### 1. Base de données

```bash
# Créer la base
psql -U postgres -c "CREATE DATABASE diy_builder;"

# Initialiser le schéma + données d'exemple
psql -U postgres -d diy_builder -f database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install

# Configurer les variables d'environnement
cp .env.example .env
# → Éditer .env avec vos identifiants PostgreSQL

# Lancer en mode développement (rechargement auto)
npm run dev
# → API disponible sur http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install

# Configurer l'URL de l'API
cp .env.local.example .env.local
# → Vérifier que NEXT_PUBLIC_API_URL=http://localhost:4000

npm run dev
# → Application disponible sur http://localhost:3000
```

---

## 🧪 Tests

```bash
cd backend
npm install
npm test                # Lance les 4 suites Jest
npm run test:watch      # Mode watch (développement)
```

| Suite | Cas | Périmètre |
|---|---|---|
| `terrasse.test.js` | 28 | Moteur de calcul pur, validation, valeurs limites |
| `optimisation.test.js` | 20 | Service comparateur, simulerPrix, recupererPrix (BDD mockée) |
| `api.test.js` | 18 | Endpoints HTTP avec supertest, fallback simulation |
| `optimisationDecoupe.test.js` | 60+ | Algorithme de découpe, invariants, cas réels |

---

## 🔌 API

### `POST /api/calcul-terrasse`

```bash
curl -X POST http://localhost:4000/api/calcul-terrasse \
  -H "Content-Type: application/json" \
  -d '{"largeur": 4, "longueur": 5, "type_bois": "pin"}'
```

**Corps de la requête :**

| Champ | Type | Valeurs |
|---|---|---|
| `largeur` | number | 0.5 – 100 (mètres) |
| `longueur` | number | 0.5 – 100 (mètres) |
| `type_bois` | string | `pin` · `douglas` · `ipe` |

**Réponse 200 :**

```json
{
  "success": true,
  "projet": {
    "type": "terrasse_bois",
    "surface_m2": 20,
    "largeur": 4,
    "longueur": 5,
    "type_bois": "pin"
  },
  "materiaux": [
    { "nom": "Lame terrasse 3 m",  "categorie": "lame_terrasse", "quantite": 28, "unite": "unité", "detail": "1 par rangée × 28 rangées" },
    { "nom": "Lame terrasse 2.4 m","categorie": "lame_terrasse", "quantite": 28, "unite": "unité", "detail": "1 par rangée × 28 rangées" },
    { "nom": "Lambourde 4 m",      "categorie": "lambourde",     "quantite": 14, "unite": "unité" },
    { "nom": "Vis inox",           "categorie": "vis",           "quantite": 2,  "unite": "boite de 200" }
  ],
  "optimisation_decoupe": {
    "lames": {
      "pieces": [
        { "longueur": 3,   "quantite": 28, "quantite_par_rangee": 1 },
        { "longueur": 2.4, "quantite": 28, "quantite_par_rangee": 1 }
      ],
      "perte_estimee": 0.074,
      "nb_lignes": 28,
      "longueur_achetee": 151.2,
      "longueur_utile": 140.0
    },
    "lambourdes": {
      "pieces": [{ "longueur": 4, "quantite": 14, "quantite_par_rangee": 1 }],
      "perte_estimee": 0.0,
      "nb_rangees": 14
    },
    "perte_globale": 0.037,
    "resume": "Terrasse 4 × 5 m | Lames : 28 × 3m + 28 × 2.4m — perte 7.4% | Lambourdes : 14 × 4m — perte 0.0%"
  },
  "comparateur_prix": {
    "detail": {
      "Leroy Merlin": 598.50,
      "Castorama":    570.00,
      "Brico Dépôt":  540.00
    },
    "meilleur": "Brico Dépôt",
    "economie_max": 58.50,
    "mode": "base_de_donnees"
  },
  "plan": { "nb_lambourdes_affichage": 11, "entraxe": 0.4 }
}
```

**Réponse 400 :**
```json
{ "success": false, "erreurs": ["largeur : nombre positif requis (en mètres)."] }
```

### `GET /api/health`

```bash
curl http://localhost:4000/api/health
# → { "status": "ok", "service": "DIY Builder API v2" }
```

---

## 🔗 Partage par URL

Tout calcul est partageable via l'URL :

```
http://localhost:3000/?largeur=4&longueur=5&type_bois=pin
```

Le calcul se lance automatiquement au chargement. Le bouton **"🔗 Partager ce projet"** copie le lien dans le presse-papier.

---

## 🧮 Règles de calcul

### Moteur de base

| Paramètre | Valeur |
|---|---|
| Largeur lame | 14,5 cm |
| Longueur lame standard | 2,4 m |
| Entraxe lambourdes | 40 cm |
| Vis par fixation | 2 |
| Vis par boîte | 200 |
| Marge de sécurité | +10 % |

### ⭐ Algorithme d'optimisation des découpes

Le calcul naïf `nb_lames = ceil(surface / surface_lame)` ignore les longueurs commerciales disponibles. L'algorithme v3 résout ce problème :

**Pour chaque rangée**, il cherche la combinaison `(n₁ × 2,4m, n₂ × 3m, n₃ × 4m)` qui :
1. Couvre la dimension cible (longueur ou largeur du chantier)
2. **Minimise la perte** (longueur achetée − longueur utile)
3. À perte égale, minimise le nombre de pièces (moins de joints)

**Exemple validé — terrasse 4×5 m :**
```
Lames    : 28 × 3m + 28 × 2.4m  →  perte 7.4 %
Lambourdes : 14 × 4m             →  perte 0.0 %
Perte globale : 3.7 %
```

---

## 🗺 Roadmap

- [x] Calculateur terrasse bois
- [x] Optimisation découpes multi-longueurs
- [x] Comparateur 3 magasins
- [x] Plan SVG
- [x] Partage URL
- [x] Tests Jest (4 suites)
- [x] Docker Compose
- [ ] Calculateur cabanon
- [ ] Calculateur pergola
- [ ] Export PDF devis
- [ ] Authentification + sauvegarde

---

## 🤝 Contribuer

```bash
git checkout -b feature/calculateur-cabanon
git commit -m "feat(cabanon): add material calculator"
git push origin feature/calculateur-cabanon
# → Ouvrir une Pull Request
```

---

*DIY Builder v3 · Prototype · Les prix sont indicatifs.*
