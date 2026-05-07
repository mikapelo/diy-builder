# Scraper artisans IDF — DIY Builder

Script Python standalone — ne touche pas au frontend Next.js.

## Ce que ça fait

1. **Passe 1** — Scrape Pages Jaunes sur les catégories métier × 8 départements IDF
2. **Passe 2** — Pour chaque artisan avec un site web, visite le site et extrait l'email
3. **Export** — `artisans_idf.csv` (append progressif, relançable sans doublons)

## Installation

```bash
cd scripts/artisan-scraper
pip install -r requirements.txt
```

## Usage

```bash
python scraper.py
```

Le script est relançable : il saute les artisans déjà dans le CSV.

## Paramètres (en tête de scraper.py)

| Variable | Défaut | Description |
|---|---|---|
| `CATEGORIES` | 6 métiers | Recherches PJ |
| `DEPARTEMENTS_IDF` | 8 depts | 75 77 78 91 92 93 94 95 |
| `MAX_PAGES_PER_SEARCH` | 3 | Pages PJ par recherche |
| `RESULTS_TARGET` | 150 | Arrêt automatique |
| `DELAY_PJ_MIN/MAX` | 2–4.5s | Délai entre requêtes PJ |

## Sortie CSV

Colonnes : `nom, telephone, adresse, departement, categorie, site_web, email, source_url`

## Email template

Voir `email_template.txt` — à personnaliser avec ton nom et numéro avant envoi.
Envoyer via Brevo (gratuit jusqu'à 300/jour) en important le CSV.

## Notes légales

Données professionnelles publiques. Outreach B2B autorisé sous RGPD Art. 6.1.f
(intérêt légitime) avec opt-out. Le template inclut la mention de désabonnement.
