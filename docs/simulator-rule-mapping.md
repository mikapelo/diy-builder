# Mapping Règles → Simulateur

> Ce fichier fait le pont entre la documentation technique et l'implémentation.
> Pour chaque module futur, il indique quelles règles alimentent quels composants du simulateur.
> Dernière mise à jour : 2026-03-29.

---

## Légende des colonnes d'impact

| Code | Signification |
|---|---|
| `GEO` | Logique de géométrie (engine.js) |
| `BOM` | Calcul matériaux / nomenclature |
| `PDF` | Export PDF (dimensions, notes, alertes) |
| `3D` | Rendu visuel Three.js (scène) |
| `UI` | Alertes / informations utilisateur (contrôles) |

---

## Module PERGOLA

| Règle ID | Résumé court | GEO | BOM | PDF | 3D | UI | Priorité V1 |
|---|---|---|---|---|---|---|---|
| PER-001 | Poteaux 100×100 min | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| PER-002 | Entraxe poteaux 2-4 m | ✅ | ✅ | ✅ | — | — | 🔴 |
| PER-003 | Chevrons entraxe 50-100 cm | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| PER-004 | Descente charge couv→chev→long→pot | ✅ | — | ✅ | — | — | 🟡 |
| PER-005 | Classe service 3 (ouverte) / 2 (couverte) | — | — | ✅ | — | ✅ | 🟡 |
| PER-NEW-01 | Longeron face sup. protégée (EPDM/capotage) | — | ✅ | ✅ | ✅ | — | 🟡 |
| PER-NEW-02 | Chevron chanfrein ≥15° monopente | ✅ | — | ✅ | ✅ | — | 🟡 |
| PER-NEW-03 | Tête poteau protégée (capotage) | — | ✅ | ✅ | ✅ | — | 🟡 |
| PER-NEW-04 | Pied poteau ≥150 mm du sol | ✅ | ✅ | ✅ | ✅ | ✅ | 🔴 |
| PER-NEW-05 | Liens contreventement (1 par angle min.) | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| PER-NEW-06 | Espacement 5 mm assemblages | ✅ | — | — | ✅ | — | ⚪ |
| PER-NEW-07 | Porte-à-faux chevron 15 cm | ✅ | — | ✅ | ✅ | — | 🔴 |

### Presets pergola V1 proposés

| Preset | Dimensions | Poteaux | Longerons | Chevrons | Liens |
|---|---|---|---|---|---|
| Petite | 3×2.5 m | 4 × 100×100 | 2 × 150×50 | ~5 × 150×50, entraxe 50 cm | 4 × 100×50 |
| Moyenne | 4×3 m | 4 × 100×100 | 2 × 150×75 | ~7 × 150×50, entraxe 50 cm | 4 × 100×50 |
| Grande | 6×4 m | 6 × 120×120 | 2 × 200×75 | ~11 × 150×50, entraxe 50 cm | 6 × 100×50 |

---

## Module CLÔTURE

| Règle ID | Résumé court | GEO | BOM | PDF | 3D | UI | Priorité V1 |
|---|---|---|---|---|---|---|---|
| CLO-001 | Entraxe poteaux 1.80-2.50 m | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| CLO-002 | Scellement 50 cm béton | ✅ | ✅ | ✅ | — | — | 🔴 |
| CLO-003 | Jeu bas sol 30-40 mm | ✅ | — | ✅ | ✅ | — | 🔴 |
| CLO-004 | Résistance vent DTU NV65 | — | — | ✅ | — | ✅ | 🟡 |
| CLO-NEW-01 | Face sup. lames H inclinée ≥15° | ✅ | — | ✅ | ✅ | — | 🟡 |
| CLO-NEW-02 | Tête poteau protégée (capotage) | — | ✅ | ✅ | ✅ | — | 🟡 |
| CLO-NEW-03 | Pied poteau ≥150 mm sol | ✅ | ✅ | ✅ | ✅ | ✅ | 🔴 |
| CLO-NEW-04 | Planche à pourrir (lame basse sacrificielle) | — | ✅ | ✅ | ✅ | — | ⚪ |
| CLO-NEW-05 | 2 traverses si H≤1.50m, 3 si H>1.50m | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| CLO-NEW-06 | Section poteau 90×90 si H>1.50 m | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| ADM-CLO-01 | Pas de permis requis, vérifier PLU | — | — | ✅ | — | ✅ | 🔴 |

### Presets clôture V1 proposés

| Preset | Hauteur | Poteaux | Entraxe | Type | Lames |
|---|---|---|---|---|---|
| Basse | 0.90 m | 70×70 | 1.80 m | Lames H | ~6 lames 150 mm |
| Standard | 1.50 m | 70×70 | 1.80 m | Lames H | ~10 lames 150 mm |
| Haute | 1.80 m | 90×90 | 1.80 m | Lames H | ~12 lames 150 mm |
| Occultante | 2.00 m | 90×90 | 1.80 m | Lames H | ~13 lames 150 mm |

---

## Module CARPORT

| Règle ID | Résumé court | GEO | BOM | PDF | 3D | UI | Priorité V1 |
|---|---|---|---|---|---|---|---|
| CAR-001 | Classe service 2 (abrité) | — | — | ✅ | — | ✅ | 🟡 |
| CAR-002 | Poteaux 120×120 min | ✅ | ✅ | ✅ | ✅ | — | 🔴 |
| CAR-003 | Couverture bac acier ~7 kg/m², tuiles ~45 kg/m² | — | ✅ | ✅ | ✅ | ✅ | 🔴 |
| CAR-004 | Contreventement indispensable | ✅ | ✅ | ✅ | ✅ | — | 🔴 |

---

## Module TERRASSE (existant — enrichissement)

| Règle ID | Résumé court | Déjà implémenté ? | Action |
|---|---|---|---|
| TER-001 | Entraxe lambourdes 40 cm | ✅ JOIST_SPACING=0.40 | Aucune |
| TER-002 | Entraxe plots 60 cm | ✅ | Aucune |
| TER-003 | Jeu lames 3-12 mm | ⚠️ BOARD_GAP=0.004 (4 mm) | OK, dans la plage |
| TER-004 | Surface plot ≥300 cm² | ✅ PAD_SIZE=0.20 → 400 cm² | Aucune |
| TER-005 | Ventilation 1/50e surface | ❌ Non modélisé | Ajouter alerte PDF |
| TER-006 | Débord lame ≥20 mm | ❌ Non vérifié | Vérifier engine |
| TER-009 | Lambourde ≥1.5× épaisseur lame | ✅ 45×70 > 1.5×28 | Aucune |
| TER-010 | 2 vis inox A2 par croisement | ✅ screws = rows × joists × 2 | Aucune |

---

## Module CABANON (existant — pas de modification moteur)

| Règle ID | Résumé court | Déjà implémenté ? | Action |
|---|---|---|---|
| CAB-001 | Entraxe montants 60 cm | ✅ STUD_SPACING=0.60 | Aucune |
| CAB-002 | Section 90×90 | ✅ SECTION=0.09 | Documenter comme `simulator_assumption` |
| CAB-003 | Contreventement | ✅ partiel (2) | Documenter la simplification |
| CAB-004 | Lisse basse sur coupure capillarité | ❌ Non modélisé | Ajouter note PDF |
| BAR-001 | Lame d'air ≥20 mm bardage | ❌ Simplifié | Acceptable, documenter |
| ADM-001→003 | Seuils administratifs | ✅ ajoutés par session simulator | Aucune |
