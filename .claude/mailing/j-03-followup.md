# J+3 — Follow-up projet

**Phase** : 3 jours après le téléchargement PDF.
**Objectif** : ré-engagement doux, vérifier où en est le projet, orienter vers guides connexes.
**À envoyer** : broadcast manuel Resend, audience entière (filtrage non requis à faible volume).

---

## Subject (A/B testable)

Version 1 (questionnement) :
```
Vous avez démarré votre projet ?
```

Version 2 (utilité) :
```
3 points souvent oubliés avant de commander le bois
```

Préférer V1 pour la première campagne (taux d'ouverture historiquement > 30 % sur questions courtes).

---

## Preview text

```
Une question rapide : où en êtes-vous depuis votre devis ?
```

---

## Corps texte (version plain text, fallback)

```
Bonjour,

Il y a 3 jours, vous avez téléchargé votre devis {Projet} sur diy-builder.fr.

Une question : avez-vous démarré ?

Si oui — bravo. Notre simulateur n'est qu'un point de départ, les vrais
imprévus arrivent au moment du chantier. N'hésitez pas à répondre à cet
email si vous bloquez sur un point précis (sections, fondations, prix).

Si non — vous n'êtes pas seul. La plupart des projets traînent
2 à 3 fois plus longtemps que prévu, surtout par manque d'info
concrète sur les fondations ou les démarches.

3 guides souvent utiles :

→ Soi-même ou faire faire (les vrais coûts cachés)
   https://www.diy-builder.fr/guides/soi-meme-ou-pro

→ Comparer plusieurs devis (méthode, pièges)
   https://www.diy-builder.fr/guides/comparer-devis-travaux

→ Prix au m² (chiffrage par enseigne, mai 2026)
   https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026

Bon chantier,
L'équipe DIY Builder

---
Vous recevez cet email parce que vous avez téléchargé un devis sur
diy-builder.fr. Pour vous désabonner, cliquez ici : {{unsubscribe}}
```

---

## HTML

```html
<div style="font-family: Inter, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Bonjour,
  </p>

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Il y a 3 jours, vous avez téléchargé votre devis sur
    <a href="https://www.diy-builder.fr" style="color: #C9971E; text-decoration: none;">diy-builder.fr</a>.
  </p>

  <p style="color: #1a1c1b; font-size: 17px; line-height: 1.5; margin: 24px 0 16px; font-weight: 600;">
    Une question : avez-vous démarré ?
  </p>

  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 0 0 12px;">
    <strong style="color: #1a1c1b;">Si oui</strong> — bravo. Notre simulateur n'est qu'un point de départ,
    les vrais imprévus arrivent au moment du chantier. N'hésitez pas à
    <a href="mailto:contact@diy-builder.fr" style="color: #C9971E;">répondre à cet email</a>
    si vous bloquez sur un point précis (sections, fondations, prix).
  </p>

  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
    <strong style="color: #1a1c1b;">Si non</strong> — vous n'êtes pas seul. La plupart des projets
    traînent 2 à 3 fois plus longtemps que prévu, surtout par manque
    d'info concrète sur les fondations ou les démarches.
  </p>

  <p style="color: #1a1c1b; font-size: 14px; font-weight: 600; margin: 24px 0 12px;">
    3 guides souvent utiles :
  </p>

  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 24px;">
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6;">
        <a href="https://www.diy-builder.fr/guides/soi-meme-ou-pro" style="color: #1a1c1b; text-decoration: none; font-size: 14px; font-weight: 500;">
          → Soi-même ou faire faire (les vrais coûts cachés)
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6;">
        <a href="https://www.diy-builder.fr/guides/comparer-devis-travaux" style="color: #1a1c1b; text-decoration: none; font-size: 14px; font-weight: 500;">
          → Comparer plusieurs devis (méthode, pièges)
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 0;">
        <a href="https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026" style="color: #1a1c1b; text-decoration: none; font-size: 14px; font-weight: 500;">
          → Prix au m² (chiffrage par enseigne, mai 2026)
        </a>
      </td>
    </tr>
  </table>

  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 24px 0 8px;">
    Bon chantier,<br/>
    L'équipe DIY Builder
  </p>

  <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 24px 0 16px;" />

  <p style="color: #9c9188; font-size: 11px; line-height: 1.5; margin: 0;">
    Vous recevez cet email parce que vous avez téléchargé un devis sur diy-builder.fr.
    Pour vous désabonner, <a href="{{unsubscribe}}" style="color: #9c9188;">cliquez ici</a>.
  </p>

</div>
```

---

## KPIs attendus (audience > 50)

- Taux d'ouverture : > 35 % (subject question courte)
- CTR : 8-15 % (vers les 3 guides)
- Désabonnement : < 1 % (acceptable, base intérêt légitime)
- Réponses directes : 1-3 % (intentions projet)

---

## Variables Resend à laisser tel quel

- `{{unsubscribe}}` : injecté automatiquement par Resend, ne pas remplacer
