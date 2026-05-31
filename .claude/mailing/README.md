# Mailing freemium — Resend Broadcasts

Workflow newsletter pour les contacts opt-in PDF (téléchargements devis).
Pas un funnel pro vendable (cf. `/admin/leads` encart).

---

## Architecture

```
Utilisateur télécharge PDF
        ↓
EmailGateModal → POST /api/leads
        ↓
  1. Email transactionnel client (avec PDF en PJ)   ← J+0, automatique
  2. Notification admin (sujet [PDF])
  3. Stockage Redis (1 an TTL RGPD)
  4. Ajout audience Resend si RESEND_AUDIENCE_ID défini
        ↓
  Resend Audience "DIY Builder PDF downloaders"
        ↓
  Broadcasts manuels J+3 / J+10 / J+30 (envoyés depuis dashboard Resend)
```

---

## Setup initial (1 fois)

### 1. Créer l'audience Resend

1. https://resend.com/audiences → **Create audience**
2. Nom : `DIY Builder — PDF downloaders`
3. Description : `Contacts opt-in via téléchargement PDF devis (freemium)`
4. Copier l'audience ID (format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 2. Ajouter l'env var Vercel

1. Vercel dashboard → projet diy-builder → Settings → Environment Variables
2. **Add new** :
   - Key : `RESEND_AUDIENCE_ID`
   - Value : (l'ID copié à l'étape 1)
   - Environments : ✅ Production ✅ Preview
3. Save → redéploie auto (~30 sec)

### 3. (Optionnel) Re-importer les contacts historiques

Le branchement audience commence à fonctionner après le redeploy.
Les ~2 contacts historiques de Redis ne sont pas auto-importés.

Pour les ajouter manuellement à l'audience :
- Resend dashboard → audience → **Add contact** (ou import CSV)
- Source du CSV : export depuis `/admin/leads` (bouton Export CSV)

---

## Envoyer un broadcast (workflow manuel)

1. Resend dashboard → **Broadcasts** → **Create broadcast**
2. Audience : sélectionner `DIY Builder — PDF downloaders`
3. From : `DIY Builder <contact@diy-builder.fr>`
4. Subject : (cf. templates `j-XX-*.md`)
5. Body HTML : (cf. templates, copier-coller la version HTML)
6. **Send now** OU **Schedule** (envoi programmé)

### Filtrage par date d'inscription

Pour cibler les contacts inscrits il y a exactement X jours (drip campaign),
Resend ne propose pas de filtre `created_at` natif côté UI. Workarounds :

- **À faible volume** (< 50 contacts/mois) : envoi à toute l'audience est OK,
  les anciens contacts reçoivent un email "voici nos nouveaux guides"
  sans être perçu comme redondant.
- **À fort volume** (> 100 contacts/mois) : créer 3 audiences distinctes
  (`fresh-3d`, `fresh-10d`, `fresh-30d`) et déplacer manuellement via export/import,
  ou passer à un outil dédié (ConvertKit, Brevo) pour les drip natifs.

---

## Templates disponibles

| Fichier | Phase | Objectif |
|---|---|---|
| [j-00-transactionnel.md](j-00-transactionnel.md) | J+0 | Devis PDF en PJ — déjà automatisé via /api/leads |
| [j-03-followup.md](j-03-followup.md) | J+3 | "Avez-vous démarré ?" + guides connexes |
| [j-10-debloquage.md](j-10-debloquage.md) | J+10 | "3 erreurs classiques" + soft CTA Pro |
| [j-30-newsletter.md](j-30-newsletter.md) | J+30 | Opt-in newsletter récurrente |

---

## RGPD

- **Base légale** : intérêt légitime (téléchargement = manifestation d'intérêt explicite)
- **Opt-out** : lien désabonnement auto-injecté par Resend dans chaque broadcast
- **Rétention** : 1 an TTL côté Redis (audit L4), pas de limite côté audience Resend
- **Politique de confidentialité** : mentionner explicitement la newsletter
  + le partage avec Resend (sous-traitant Cloudflare/AWS)

---

## Seuils d'activation

| Volume audience | Action |
|---|---|
| 0-20 | Statut actuel — pas la peine de broadcaster, attendre |
| 20-50 | Premier broadcast manuel test (J+3 sur tout le monde) |
| 50-100 | Activer la séquence régulière (J+10 + J+30 ajoutés) |
| 100+ | Considérer passage outil dédié (Brevo, ConvertKit, Beehiiv) pour drip natif |

Au volume actuel (~2/mois), on est en phase d'attente. Le branchement audience
est en place ; les broadcasts viendront quand le SEO aura généré ~30 contacts.
