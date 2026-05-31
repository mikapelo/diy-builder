# J+30 — Opt-in newsletter récurrente

**Phase** : 30 jours après le téléchargement PDF.
**Objectif** : conversion vers une newsletter mensuelle légère, ou opt-out propre.
**À envoyer** : broadcast manuel Resend.
**RGPD critique** : c'est ici qu'on bascule de "intérêt légitime téléchargement" vers
"abonnement newsletter récurrent". Double opt-in explicite recommandé.

---

## Subject

```
Vous voulez continuer à recevoir nos guides ?
```

Alternative engageante :
```
Un dernier email — et après, à vous de choisir
```

Préférer V1 pour clarté RGPD.

---

## Preview text

```
On ne vous écrit pas pour rien : on aimerait juste votre accord pour la newsletter mensuelle
```

---

## HTML

```html
<div style="font-family: Inter, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Bonjour,
  </p>

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Vous avez téléchargé un devis sur DIY Builder il y a un mois. On vous a envoyé
    quelques emails d'utilité (votre devis, des conseils chantier).
    Désormais on ne sait plus si vous voulez en recevoir d'autres.
  </p>

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
    Plutôt que de continuer sans demander, on vous laisse choisir.
  </p>

  <!-- Box opt-in -->
  <div style="background: #faf7f0; padding: 20px 22px; margin: 0 0 24px; border-radius: 8px; border: 1px solid #f0d98c;">
    <p style="color: #1a1c1b; font-size: 15px; font-weight: 600; margin: 0 0 10px;">
      Vous voulez la newsletter mensuelle ?
    </p>
    <p style="color: #66625a; font-size: 13px; line-height: 1.6; margin: 0 0 14px;">
      1 email par mois maximum. Contenu : nouveaux guides DIY, mise à jour
      des prix matériaux par enseigne, retours d'expérience chantier.
      Pas de pub, pas de partenaires non sollicités.
    </p>
    <a href="https://www.diy-builder.fr/newsletter?confirm=YOUR_CONTACT_ID" style="display: inline-block; background: #C9971E; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
      Oui, je m'abonne →
    </a>
  </div>

  <!-- Box opt-out -->
  <div style="background: #f8f5ef; padding: 20px 22px; margin: 0 0 24px; border-radius: 8px;">
    <p style="color: #1a1c1b; font-size: 15px; font-weight: 600; margin: 0 0 10px;">
      Vous préférez ne plus recevoir d'emails ?
    </p>
    <p style="color: #66625a; font-size: 13px; line-height: 1.6; margin: 0 0 14px;">
      Aucun problème. On vous retire de notre liste immédiatement et on
      ne vous écrira plus. Vous gardez votre devis et vous pourrez revenir
      sur le simulateur quand vous voulez.
    </p>
    <a href="{{unsubscribe}}" style="display: inline-block; background: transparent; color: #66625a; padding: 10px 20px; border: 1px solid #d1cdc6; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500;">
      Me désabonner →
    </a>
  </div>

  <p style="color: #66625a; font-size: 13px; line-height: 1.6; margin: 24px 0 8px; font-style: italic;">
    Sans action de votre part dans les 7 prochains jours, vous serez automatiquement
    désabonné(e) de notre liste.
  </p>

  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 24px 0 8px;">
    Merci pour votre confiance,<br/>
    L'équipe DIY Builder
  </p>

  <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 24px 0 16px;" />

  <p style="color: #9c9188; font-size: 11px; line-height: 1.5; margin: 0;">
    Vous recevez cet email parce que vous avez téléchargé un devis sur diy-builder.fr
    il y a environ 30 jours. Désabonnement direct : <a href="{{unsubscribe}}" style="color: #9c9188;">ici</a>.
  </p>

</div>
```

---

## Workflow technique nécessaire pour le double opt-in

Le lien `https://www.diy-builder.fr/newsletter?confirm=YOUR_CONTACT_ID` n'existe pas
encore. À créer si on active vraiment cette séquence à fort volume :

1. **Page `/newsletter`** : page Next.js qui lit le query param `confirm`
2. **API `/api/newsletter/confirm`** : déplace le contact d'une audience
   "freemium-pending" vers "newsletter-confirmed" côté Resend
3. **Lien `{{unsubscribe}}`** : auto-géré par Resend, pas de code nécessaire

**Alternative simple à faible volume** (< 50 audience) : enlever le lien d'abonnement
et garder uniquement l'opt-out. Tous les contacts qui ne se désinscrivent pas restent
dans l'audience, c'est de l'opt-in implicite (acceptable en base "intérêt légitime"
si la politique de confidentialité le couvre).

---

## KPIs attendus

- Taux d'ouverture : 30-40 % (subject question directe)
- CTR opt-in newsletter : 5-15 % (ceux qui sont vraiment engagés)
- CTR opt-out : 5-10 %
- Inactifs (non ouvert, non cliqué) : à purger après 7 jours
