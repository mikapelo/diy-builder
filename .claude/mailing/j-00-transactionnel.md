# J+0 — Email transactionnel (automatisé)

**Statut** : déjà en place via `frontend/app/api/leads/route.js` (sendEmail #1).
**Pas à recréer** : ce template est ici pour référence/cohérence avec la séquence.

---

## Subject

```
Votre devis {Projet} — DIY Builder
```

(Variable `{Projet}` = Terrasse / Cabanon / Pergola / Clôture, dérivée de `projectType`)

---

## Pièce jointe

PDF nommé `devis-{projectType}.pdf` (sanitized), encodé en base64 dans `pdfBase64`.

---

## HTML

```html
<div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #fafaf8; border-radius: 12px;">
  <h1 style="font-size: 22px; color: #1a1c1b; margin: 0 0 12px;">Votre devis {Projet} 📋</h1>
  <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Votre liste de matériaux pour un projet <strong>{Projet} {Dimensions}</strong> vient d'être téléchargée.
  </p>
  <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
    Retrouvez tous nos simulateurs sur
    <a href="https://www.diy-builder.fr" style="color: #C9971E; font-weight: 600;">diy-builder.fr</a>
  </p>
  <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 0 0 16px;" />
  <p style="color: #9c9188; font-size: 12px; margin: 0;">
    Vous avez téléchargé ce devis depuis diy-builder.fr.
    Pour vous désabonner, répondez à cet email avec "stop".
  </p>
</div>
```
