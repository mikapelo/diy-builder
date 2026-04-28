# Session Monétisation — DIY Builder

## Rôle de cette session
Définir et implémenter la stratégie de monétisation du projet DIY Builder.
Focus : modèles de revenus, intégration produit, roadmap business.

## Agents existants à coordonner avec
- **Engine** : logique calcul, moteurs DTU
- **Render** : viewer 3D, Three.js
- **Design** : landing page, UI/UX
- **Export** : PDF, export données

## Contexte produit

### Ce qu'est DIY Builder
Simulateur de construction bois en ligne :
- 4 modules : Terrasse, Cabanon, Pergola, Clôture
- Calcul précis matériaux (DTU 31.1, 51.4)
- Visualisation 3D interactive (Three.js)
- Comparaison prix 3 enseignes (Leroy Merlin, Castorama, Brico Dépôt)
- Export PDF devis professionnel (4-6 pages)
- Outil 100% gratuit actuellement, sans compte

### État technique
- Prod-ready : landing V10, simulateurs complets, PDF amélioré
- Pas d'auth/compte utilisateur
- Pas de backend (pure front Next.js statique)
- Prix matériaux en dur dans materialPrices.js

### Chiffres clés
- 4 modules simulateurs
- Prix cabanon 3×2.5m : ~1 284€ (Brico Dépôt meilleur prix)
- PDF : 4-6 pages techniques avec plans, BOM, comparatif enseignes
- Marché cible : DIYers français, artisans indépendants

## Axes à explorer

### 1. Freemium
- Calcul gratuit, export PDF payant (ex: 2€/export ou abonnement)
- Limite de projets sauvegardés (ex: 3 gratuits, illimité en premium)
- Mode "Pro" avec plus de modules (carport, abri voiture...)

### 2. B2B Artisans
- Compte artisan : logo sur PDF, enregistrement client, historique projets
- Abonnement mensuel (ex: 19€/mois)
- Widget intégrable sur site d'artisan

### 3. Affiliation GSB
- Liens trackés vers Leroy Merlin, Castorama, Brico Dépôt
- Commission sur achat (ex: 2-5% du panier)
- Programme partenaires des 3 enseignes à activer

### 4. Leads artisans
- "Trouver un artisan" : mise en relation utilisateur ↔ artisan local
- Commission par lead qualifié (ex: 5-15€)
- Partenariat avec plateformes (MesAides Artisan, Houzz, etc.)

### 5. SaaS Enseignes
- API calculateur intégré dans les sites LM/Casto/BD
- Licence annuelle B2B (ex: 5000-20 000€/an)

## Implémentation technique à planifier
- Auth/compte utilisateur (Clerk, Auth.js, Supabase)
- Stripe pour paiements
- Sauvegarde projets (Supabase ou Vercel KV)
- Tracking usage (Plausible ou PostHog)
- Paywall PDF

## Protocole coordination multi-agents
```
register_session("Monetisation", "stratégie revenus et implémentation paywall")
get_messages(for: "Monetisation")
```

Broadcaster les décisions produit à "all" pour que Engine/Design/Export adaptent.
