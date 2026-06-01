# DIY Builder — Fiche éditeur leads travaux particuliers

> 1-pager à joindre aux emails de démarchage plateformes lead.
> Exportable en PDF (Pages, Word, Pandoc) ou collé en bas du mail.
> Date : juin 2026.

---

## En 1 ligne

**Simulateur 3D + chiffrage matériaux pour autoconstruction terrasse / cabanon / pergola / clôture, avec funnel lead pro intégré.**

URL : [diy-builder.fr](https://www.diy-builder.fr)
Contact : Mikael Pelo — sans.mikael33000@gmail.com

---

## Notre différence vs autres éditeurs lead

Le lead transmis arrive avec un **niveau de qualification 3 à 5 fois supérieur**
à un formulaire standard plateforme.

Données capturées au moment du lead :

| Champ | Capture | Standard plateforme |
|---|---|---|
| Email + Téléphone + Code postal | ✅ | ✅ |
| **Type de projet précis** (4 modules) | ✅ | partiel |
| **Dimensions exactes** (largeur, profondeur, hauteur) | ✅ | ❌ |
| **Budget matériaux pré-calculé** (comparatif 4 enseignes scrapées hebdo) | ✅ | ❌ |
| Visualisation 3D du projet | ✅ | ❌ |
| Plan technique / nomenclature matériaux PDF | ✅ | ❌ |
| Consentement RGPD explicite | ✅ | ✅ |

**Conséquence acheteur** : le prospect arrive « éduqué » sur son projet, sait ce
qu'il veut, a un budget à l'esprit. Cycle de vente artisan plus court, taux
de signature plus élevé.

---

## Audience (juin 2026)

### Trafic SEO organique

| Métrique 7 jours (25-31/05) | Valeur | Tendance |
|---|---|---|
| Clics Google Search Console | 21 | **+31 %** sem/sem |
| Impressions | 645 | **+63 %** sem/sem |
| CTR moyen | 3,26 % | -0,8 pt (dilution attendue) |
| Position moyenne | 8,9 | top 10 |
| Clics Bing | 3 | +50 % |
| Visiteurs uniques Umami / mois | ~210 | +75 % vs mois précédent |

### Top pages drivers

| Page | Clics 7j | CTR | Pos |
|---|---|---|---|
| /guides/cabanon | 5 | 9,3 % | 7,6 |
| /pergola (simulateur) | 5 | 9,3 % | 10,6 |
| /guides/pergola | 3 | 6,3 % | 9,7 |
| /guides/terrasse-piscine-bois | 3 | 4,8 % | 8,0 |

### Audience géographique
France métropolitaine — cible particuliers, projets jardin/extérieur,
panier moyen estimé 1 000-5 000 € matériaux + main d'œuvre potentielle.

### Requêtes phares (sample)
`pergola bois diy`, `simulateur pergola leroy merlin`,
`article 278-0 bis a cgi photovoltaïque autoconsommation` (YMYL fiscal),
`calcul prise au vent clôture`, `dtu pergola`.

---

## Formats techniques disponibles

| Format | Statut |
|---|---|
| POST API JSON | ✅ endpoint `/api/artisan-lead` déjà câblé |
| Webhook custom | ✅ adaptable à votre format (Zapier-style ou direct) |
| CSV export | ✅ depuis dashboard admin (manuel) |
| API Resend Audiences | ✅ contact stocké automatiquement |

Stack technique : Next.js 14, Vercel hosting (auto-deploy main),
Redis (Upstash) pour persistence 1 an TTL.

---

## Champs lead capturés (formulaire artisan)

```json
{
  "email": "string",          // requis
  "phone": "string",          // requis, validation 8+ chars
  "zipCode": "string",        // requis, validation 4-5 chiffres
  "name": "string",           // optionnel
  "projectType": "terrasse|cabanon|pergola|cloture",
  "dims": { "width": 4.0, "depth": 3.0, "height": 2.5 },
  "bom": { /* nomenclature matériaux pré-calculée */ },
  "message": "string",        // optionnel, libre
  "consent": true,            // requis (consentement explicite RGPD)
  "createdAt": "2026-06-01T15:30:00.000Z"
}
```

---

## Volume actuel & projection

| Période | Volume estimé | Hypothèse |
|---|---|---|
| Juin 2026 (actuel) | 0-2 leads artisan/mois | Pivot lead démarré le 21/05 |
| T3 2026 (juil-sept) | 10-30 leads/mois | Si trajectoire SEO continue (+30 %/mois) |
| T4 2026 (oct-déc) | 30-100 leads/mois | Hypothèse moyenne, peut accélérer si publications éditoriales tiennent |
| 2027 | 100-300 leads/mois | Si l'autorité topique et la rentabilité contenu s'établissent |

**Honnête sur le présent** : nous sommes en phase de décollage. Cette fiche
n'est pas une promesse de volume immédiat — c'est une base pour préparer
une relation que nous voulons sérieuse dès Q3 2026.

---

## Conformité

- **RGPD** : consentement explicite à chaque soumission, opt-out 1 clic
  dans tous les emails transactionnels, droit de suppression via page
  contact ([politique de confidentialité](https://www.diy-builder.fr/politique-confidentialite))
- **Loi 2023-451 (influenceurs)** : disclosure affiliation présente sur
  toutes les pages avec CTAs commerciaux
- **TVA** : auto-entrepreneur (basculement TVA selon évolution CA)
- **Hébergement** : Vercel (US/EU edge), Upstash Redis (EU), Resend (EU)
- **DPO** : Mikael Pelo (responsable de traitement)

---

## En résumé pour vous

Si vous achetez des leads travaux particuliers et que vous valorisez la
**qualification précise** (dimensions, budget, type projet) plus que le
volume brut, DIY Builder vise à devenir un éditeur partenaire crédible
sur le créneau **terrasse / cabanon / pergola / clôture** en France.

Nous démarrons. Nous serions intéressés de connaître vos formats, prix
indicatifs et conditions de volume minimum.

Contact direct : sans.mikael33000@gmail.com — réponse sous 24 h en
semaine.
