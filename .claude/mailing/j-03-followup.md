# J+3 — Follow-up projet (nurture)

> Réécrit avec skill `marketing-skills:emails` (méthodologie séquence nurture)
> + `editorial-seo-fr` (anti-IA FR, fact-check, ton tranché).
> Date de réécriture : 2026-06-01.

---

## Sequence Overview

```
Email      : J+3 follow-up
Trigger    : J+3 après téléchargement PDF devis via /api/leads
Goal       : ré-engagement doux + orientation vers guides connexes
Length     : 1 email (3/4 dans la séquence J+0/3/10/30)
Timing     : 72h après le J+0 transactionnel
Exit       : désabonnement OU absence d'ouverture 30 jours (à purger)
Audience   : particuliers FR, autoconstructeurs débutants/intermédiaires
One job    : ramener vers un guide concret + offrir la porte du dialogue
Voice      : conversationnel FR, tutoie le "vous" (vouvoiement classique),
             pas de phrases-gabarit, observation terrain quand possible
```

---

## A/B subject lines à tester

| Variante | Pattern | Longueur | Hypothèse |
|---|---|---|---|
| **A** — `Votre projet {Projet} avance ?` | Direct + personnalisé | 28 chars | Le plus simple, parle de leur projet |
| **B** — `Le bois est commandé ?` | Question concrète | 22 chars | Engage sur une action concrète |
| **C** — `Une question rapide sur votre devis` | Question utilitaire | 35 chars | Active la curiosité |

**Commencer par A** — tutoie le projet, taux d'ouverture historique sur questions courtes > 35 %.

`{Projet}` = label dynamique (Terrasse / Cabanon / Pergola / Clôture) tiré du contact metadata Resend. Si non disponible, fallback : `Votre projet bois avance ?`

---

## Preview text (90-140 chars)

```
Trois jours depuis votre devis. Vous avez bougé ou ça traîne encore ?
```

105 chars — prolonge le subject par une question plus directe, sans le répéter.

---

## Corps texte (plain text fallback)

```
Bonjour,

Vous avez téléchargé votre devis {Projet} il y a trois jours sur diy-builder.fr.

Question franche : ça avance, ou ça traîne ?

Si ça avance — bravo, c'est rare. La plupart des projets calent entre le
devis et le coup de pelle. Si vous bloquez sur un point précis (sections,
fondations, prix d'enseigne), répondez à ce mail. On lit tout.

Si ça traîne — pas grave, c'est normal. Trois guides qui débloquent
souvent :

→ Faire soi-même ou faire faire
   https://www.diy-builder.fr/guides/soi-meme-ou-pro

→ Comparer plusieurs devis sans se faire avoir
   https://www.diy-builder.fr/guides/comparer-devis-travaux

→ Prix au m² pour ne pas se faire dépasser
   https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026

Mikael, DIY Builder

---
Vous recevez ce mail parce que vous avez téléchargé un devis sur
diy-builder.fr. Désabonnement en 1 clic : {{unsubscribe}}
```

195 mots — zone éducative idéale (150-300).

---

## HTML

```html
<div style="font-family: Inter, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">

  <!-- Hook -->
  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Bonjour,
  </p>

  <p style="color: #1a1c1b; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    Vous avez téléchargé votre devis {Projet} il y a trois jours sur
    <a href="https://www.diy-builder.fr" style="color: #C9971E; text-decoration: none; font-weight: 500;">diy-builder.fr</a>.
  </p>

  <!-- Question pivot (une seule, claire) -->
  <p style="color: #1a1c1b; font-size: 17px; line-height: 1.5; margin: 24px 0 20px; font-weight: 600;">
    Question franche : ça avance, ou ça traîne ?
  </p>

  <!-- Branche 1 : ça avance -->
  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 0 0 12px;">
    <strong style="color: #1a1c1b;">Si ça avance</strong> — bravo, c'est rare. La plupart des projets calent
    entre le devis et le coup de pelle. Si vous bloquez sur un point précis
    (sections, fondations, prix d'enseigne),
    <a href="mailto:contact@diy-builder.fr?subject=Question%20projet" style="color: #C9971E;">répondez à ce mail</a>.
    On lit tout.
  </p>

  <!-- Branche 2 : ça traîne -->
  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
    <strong style="color: #1a1c1b;">Si ça traîne</strong> — pas grave, c'est normal. Trois guides qui
    débloquent souvent :
  </p>

  <!-- 3 liens (secondary CTA, pas primary) -->
  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 0 24px;">
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6;">
        <a href="https://www.diy-builder.fr/guides/soi-meme-ou-pro" style="color: #1a1c1b; text-decoration: none; font-size: 14px; font-weight: 500;">
          → Faire soi-même ou faire faire
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6;">
        <a href="https://www.diy-builder.fr/guides/comparer-devis-travaux" style="color: #1a1c1b; text-decoration: none; font-size: 14px; font-weight: 500;">
          → Comparer plusieurs devis sans se faire avoir
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 0;">
        <a href="https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026" style="color: #1a1c1b; text-decoration: none; font-size: 14px; font-weight: 500;">
          → Prix au m² pour ne pas se faire dépasser
        </a>
      </td>
    </tr>
  </table>

  <!-- Sign-off : humain, première personne -->
  <p style="color: #66625a; font-size: 14px; line-height: 1.6; margin: 24px 0 8px;">
    Mikael, DIY Builder
  </p>

  <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 24px 0 16px;" />

  <p style="color: #9c9188; font-size: 11px; line-height: 1.5; margin: 0;">
    Vous recevez ce mail parce que vous avez téléchargé un devis sur diy-builder.fr.
    <a href="{{unsubscribe}}" style="color: #9c9188;">Désabonnement en 1 clic</a>.
  </p>

</div>
```

---

## Décisions copywriting (justifiées)

| Élément | Choix | Raison |
|---|---|---|
| **One Job** | Ramener vers un guide OU ouvrir le dialogue mail | Pas de CTA Pro à J+3, trop tôt |
| **Hook** | « Question franche : ça avance, ou ça traîne ? » | Voix tranchée, question fermée binaire |
| **Branchement** | Si avance / si traîne | Couvre 100 % des cas, le lecteur s'identifie |
| **Sign-off** | « Mikael » prénom seul + « DIY Builder » | Humain, première personne, pas « L'équipe » |
| **CTA primaire** | mailto réponse | Ouvrir le canal de dialogue est la conversion la + précieuse |
| **CTA secondaires** | 3 liens guides | Backup si pas envie de répondre |

---

## Anti-IA — phrases interdites évitées

- ❌ « Plongeons dans », « Découvrons ensemble », « Il convient de noter »
- ❌ « Cher utilisateur », « Bonjour à tous », « N'hésitez pas »
- ❌ « Notre équipe est à votre disposition »
- ✅ « Bonjour » sec, « Question franche », « On lit tout »

## Anglicismes évités

- ❌ Process, feature, feedback, deadline, setup, planning, briefer
- ✅ Démarche, fonctionnalité, retour, échéance, mise en place, calendrier, présenter

---

## KPIs cibles (audience > 50 contacts)

| Métrique | Objectif | Benchmark FR nurture |
|---|---|---|
| Taux d'ouverture | > 38 % | 30-40 % nurture FR opt-in |
| CTR total (mail + guides) | 12-18 % | 8-12 % standard |
| Réponses directes | 2-4 % | 1-3 % |
| Désabonnement | < 1,2 % | < 2 % acceptable |

---

## Variables Resend

- `{Projet}` : à injecter via attribut contact ou laisser fallback `projet bois`
  (Resend Audiences ne supporte pas les custom fields par défaut — workaround :
  segmenter en 4 audiences module-spécifiques OU broadcast unique avec « projet bois »)
- `{{unsubscribe}}` : géré par Resend, ne pas modifier
