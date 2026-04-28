'use client';

/**
 * StructuralDisclaimer — note légale compacte
 *
 * Ligne unique discrète sous le titre module.
 * Le détail fondation apparaît au survol / focus (tooltip natif).
 */
export default function StructuralDisclaimer({ projectType = 'cabanon' }) {
  const foundationsNote = {
    cabanon:
      "Fondations hors-gel (0,60–1,00 m), étude sol > 10 m².",
    pergola:
      "Platines sur plots béton ≥ 30×30×50 cm, hors-gel. Abouts chevrons exposés : coupe biaisée ≥ 15° ou bois naturellement durable (DTU 31.1 §5.10.4.1).",
    terrasse:
      "Plots béton ou vis de fondation, hors-gel. Lambourdes : section 45×70 min (DTU 51.4). Vis INOX A2 obligatoires.",
    cloture:
      "Scellements béton, profondeur ≥ 1/3 hauteur hors-sol. Poteaux bois traité UC4 (contact sol).",
    bardage:
      "Tasseaux 27mm min. Lames UC3b, fixations inox A4. Entraxe supports ≤ 60cm (DTU 41.2).",
    dalle:
      "Béton C25/30 minimum. Épaisseur 10cm piéton / 12cm véhicule. Joints tous les 25-40m² (DTU 13.3).",
  }[projectType] || '';

  const dtuRef = {
    cabanon:  'DTU 31.2 P1-1',
    pergola:  'DTU 31.1 P1-1 / COBEI',
    terrasse: 'DTU 51.4 P1-1',
    cloture:  'DTU 31.1 P1-1',
    bardage:  'NF DTU 41.2 P1-1 (août 2015)',
    dalle:    'NF DTU 13.3 P1-1 (décembre 2021)',
  }[projectType] || 'DTU 31.1 / 51.4';

  const tooltip = `Estimation basée sur ${dtuRef}. Ne remplace pas une étude structure (Eurocode 5). ${foundationsNote}`;

  return (
    <p
      role="note"
      title={tooltip}
      className="structural-disclaimer-inline"
    >
      <span className="structural-disclaimer-icon">ⓘ</span>
      Estimation indicative — ne remplace pas une étude professionnelle
      {foundationsNote && (
        <span className="structural-disclaimer-detail"> · {foundationsNote}</span>
      )}

      <style jsx>{`
        .structural-disclaimer-inline {
          margin: 2px 0 0;
          padding: 0;
          font-size: 10.5px;
          font-family: var(--g-mono, 'IBM Plex Mono', monospace);
          color: var(--g-marine, #1E3A52);
          opacity: 0.55;
          line-height: 1.3;
          cursor: help;
          transition: opacity 0.2s ease;
        }
        .structural-disclaimer-inline:hover,
        .structural-disclaimer-inline:focus-visible {
          opacity: 0.85;
        }
        .structural-disclaimer-icon {
          margin-right: 3px;
          font-size: 11px;
        }
        .structural-disclaimer-detail {
          display: none;
        }

        @media (min-width: 900px) {
          .structural-disclaimer-detail {
            display: inline;
          }
        }
      `}</style>
    </p>
  );
}
