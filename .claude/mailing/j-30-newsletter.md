# J+30 — Opt-in newsletter ou opt-out (décisionnel)

> Réécrit avec skill `marketing-skills:emails` (méthodologie séquence nurture
> + re-engagement) + `editorial-seo-fr` (anti-IA FR, langage direct).
> Date de réécriture : 2026-06-01.

---

## Sequence Overview

```
Email      : J+30 décisionnel (bascule opt-in newsletter OU opt-out propre)
Trigger    : J+30 après téléchargement PDF devis via /api/leads
Goal       : segmenter l'audience entre engagés et inactifs (= nettoyage liste)
Length     : 1 email final de la séquence J+0/3/10/30
Timing     : 20 jours après le J+10
Exit       : choix explicite (opt-in newsletter) OU désabonnement
RGPD       : ⚠️ pivot juridique — on passe de "intérêt légitime téléchargement"
             à "abonnement récurrent". Double opt-in propre recommandé.
One job    : un choix binaire clair, pas d'entre-deux
Voice      : court, honnête, pas de manipulation, voix tranchée
```

---

## A/B subject lines à tester

| Variante | Pattern | Longueur | Hypothèse |
|---|---|---|---|
| **A** — `On continue, ou on s'arrête là ?` | Question binaire | 32 chars | Direct, sans détour, voix tranchée |
| **B** — `Newsletter mensuelle : oui ou non ?` | Question pure choice | 35 chars | Annonce le sujet, force le choix |
| **C** — `Un dernier mail, et après c'est vous` | Direct + transfert | 37 chars | Renvoie la décision au lecteur |

**Recommandation : A** — voix la plus directe, taux d'ouverture historique > 40 % sur questions binaires. Préserve la marque (pas de manipulation).

---

## Preview text (90-140 chars)

```
Trente jours qu'on s'écrit. On aimerait votre accord pour continuer, ou un désabonnement franc.
```

99 chars — annonce le sujet, sans manipulation.

---

## Corps texte (plain text fallback)

```
Bonjour,

Trente jours depuis votre devis. On vous a écrit quatre fois : le devis
PDF, un point d'avancement, trois erreurs à éviter, et ce mail.

Maintenant on ne sait plus si vous voulez nous lire.

Plutôt que de continuer sans vous demander, on vous laisse trancher.

→ Vous voulez la newsletter mensuelle ?
  1 mail par mois maximum. Nouveaux guides, mise à jour des prix
  matériaux par enseigne, retours d'expérience chantier. Pas de pub,
  pas de partenaires non sollicités.

  Je m'abonne : https://www.diy-builder.fr/newsletter?confirm=...

→ Vous préférez ne plus recevoir d'emails ?
  Aucun problème. On vous retire de la liste immédiatement et on ne vous
  écrit plus. Vous gardez votre devis et le simulateur reste ouvert.

  Me désabonner : {{unsubscribe}}

Sans choix de votre part dans les 7 prochains jours, vous serez retiré(e)
automatiquement de notre liste. C'est plus propre comme ça.

Merci pour le temps que vous nous avez accordé.

Mikael, DIY Builder

---
Désabonnement direct : {{unsubscribe}}
```

182 mots — court, décisionnel, zone idéale 150-300 pour utilitaire.

---

## HTML

```html
<div style="font-family: Inter, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">

  <!-- Hook -->
  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Bonjour,
  </p>

  <!-- Context : récap honnête -->
  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Trente jours depuis votre devis. On vous a écrit quatre fois : le devis
    PDF, un point d'avancement, trois erreurs à éviter, et ce mail.
  </p>

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Maintenant on ne sait plus si vous voulez nous lire.
  </p>

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
    Plutôt que de continuer sans vous demander, on vous laisse trancher.
  </p>

  <!-- Choix 1 : opt-in newsletter -->
  <div style="background: #faf7f0; padding: 20px 22px; margin: 0 0 16px; border-radius: 8px; border: 1px solid #f0d98c;">
    <p style="color: #1a1c1b; font-size: 15px; font-weight: 600; margin: 0 0 10px;">
      Vous voulez la newsletter mensuelle ?
    </p>
    <p style="color: #66625a; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
      1 mail par mois maximum. Nouveaux guides, mise à jour des prix matériaux
      par enseigne, retours d'expérience chantier. Pas de pub, pas de
      partenaires non sollicités.
    </p>
    <a href="https://www.diy-builder.fr/newsletter?confirm=YOUR_CONTACT_ID" style="display: inline-block; background: #C9971E; color: #fff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
      Je m'abonne →
    </a>
  </div>

  <!-- Choix 2 : opt-out propre -->
  <div style="background: #f8f5ef; padding: 20px 22px; margin: 0 0 24px; border-radius: 8px;">
    <p style="color: #1a1c1b; font-size: 15px; font-weight: 600; margin: 0 0 10px;">
      Vous préférez ne plus recevoir d'emails ?
    </p>
    <p style="color: #66625a; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
      Aucun problème. On vous retire de la liste immédiatement et on ne vous
      écrit plus. Vous gardez votre devis et le simulateur reste ouvert.
    </p>
    <a href="{{unsubscribe}}" style="display: inline-block; background: transparent; color: #66625a; padding: 10px 22px; border: 1px solid #d1cdc6; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500;">
      Me désabonner →
    </a>
  </div>

  <!-- Default action transparente -->
  <p style="color: #66625a; font-size: 13px; line-height: 1.6; margin: 24px 0 8px; font-style: italic;">
    Sans choix de votre part dans les 7 prochains jours, vous serez retiré(e)
    automatiquement de notre liste. C'est plus propre comme ça.
  </p>

  <!-- Sign-off + remerciement -->
  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 24px 0 8px;">
    Merci pour le temps que vous nous avez accordé.
  </p>

  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 8px 0 8px;">
    Mikael, DIY Builder
  </p>

  <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 24px 0 16px;" />

  <p style="color: #9c9188; font-size: 11px; line-height: 1.5; margin: 0;">
    Désabonnement direct : <a href="{{unsubscribe}}" style="color: #9c9188;">ici</a>.
  </p>

</div>
```

---

## Décisions copywriting (justifiées)

| Élément | Choix | Raison |
|---|---|---|
| **One Job** | Forcer le choix binaire (opt-in OU opt-out) | Skill : nettoyage liste = critère succès |
| **Pas de manipulation** | Aucun « ne ratez pas », « offre limitée », FOMO | Voix de marque, anti-IA, RGPD propre |
| **Aveu honnête** | « On ne sait plus si vous voulez nous lire » | Vulnérabilité = trust signal |
| **Default soft-delete** | Retrait auto à J+7 sans choix | RGPD propre + nettoyage liste auto |
| **Promesse newsletter** | « 1 mail/mois MAX », « pas de pub » | Engagement chiffré pour rassurer |
| **Symétrie CTA** | Bouton plein vs bouton outline | Équilibre visuel = pas de manipulation choix |

---

## Anti-IA — vérifications

- ❌ « Nous ne voudrions pas vous perdre », « Notre relation nous tient à cœur »
- ❌ « Cliquez maintenant pour ne pas manquer »
- ❌ Émotionnel forcé, urgence artificielle
- ✅ « On ne sait plus si vous voulez nous lire » (constat factuel)
- ✅ « C'est plus propre comme ça » (avis tranché)
- ✅ « Merci pour le temps que vous nous avez accordé » (sincère, court)

---

## Workflow technique nécessaire (pour le double opt-in)

Le lien `https://www.diy-builder.fr/newsletter?confirm=YOUR_CONTACT_ID` n'existe
pas encore. À créer **uniquement si on active vraiment cette séquence** à fort
volume (> 50 contacts) :

1. **Page Next.js `/newsletter`** : lit le query param `confirm`, affiche un
   message de confirmation, déclenche l'API de migration
2. **API `/api/newsletter/confirm`** : appel Resend Contacts API pour déplacer
   le contact d'une audience `pdf-freemium-pending` vers `newsletter-confirmed`
3. **Suppression auto J+7** : cron Vercel qui purge les contacts sans confirm
   ni opt-out après 7 jours

**Alternative simple à faible volume** (< 30 audience) :
- Garder uniquement le bouton opt-out
- Considérer les non-réagissants comme opt-in implicite (base intérêt légitime)
- Mentionner clairement dans la politique de confidentialité

À ce stade (2 contacts en audience), inutile de coder la page `/newsletter` —
on retire le lien d'opt-in et on laisse seulement le désabonnement.

---

## KPIs cibles (audience > 50 contacts)

| Métrique | Objectif | Benchmark FR re-engagement |
|---|---|---|
| Taux d'ouverture | 35-45 % | 30-40 % (question binaire dans subject) |
| Taux d'opt-in newsletter | 8-15 % | 5-10 % (ceux qui sont vraiment engagés) |
| Taux d'opt-out actif | 5-10 % | 5-15 % (sain, nettoie la liste) |
| Inactifs (ni opt-in ni opt-out) | 75-87 % | Purge auto J+7 = liste propre |

**Bonus :** les opt-out actifs sont une bonne nouvelle, pas un échec. Une liste
de 100 inactifs réveille zéro vente. Une liste de 15 engagés réveille du vrai
business. C'est la philosophie du J+30 : moins mais mieux.

---

## Variables Resend

- `{{unsubscribe}}` : injecté auto par Resend
- `YOUR_CONTACT_ID` à remplacer côté Resend Broadcast par le contact ID
  dynamique (Resend supporte les variables `{{CONTACT.ID}}`)

---

## RGPD — base légale après J+30

| Phase | Base légale | Justification |
|---|---|---|
| J+0 transactionnel | Exécution contractuelle | PDF demandé = livraison |
| J+3 / J+10 follow-up | Intérêt légitime | Suite naturelle du téléchargement |
| **Après J+30 sans opt-in** | **Plus de base** | Doit être purgé |
| Après J+30 avec opt-in | Consentement explicite | Newsletter récurrente |

C'est cette rigueur qui rend la séquence RGPD-clean et améliore la délivrabilité
long terme (Gmail/Outlook downgradent les expéditeurs aux taux de plaintes/opt-outs élevés).
