'use client';

import { useState, useRef, useEffect, useId } from 'react';

/**
 * StructuralDisclaimer — note légale compacte
 *
 * Ligne unique discrète sous le titre module.
 * Le détail DTU s'affiche au clic sur ⓘ (toggle).
 * Fermeture : clic extérieur ou touche Escape.
 */
export default function StructuralDisclaimer({ projectType = 'cabanon' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const tooltipId = useId();

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
    pergola:  'NF DTU 31.1 P1-1 / NF EN 335',
    terrasse: 'DTU 51.4 P1-1',
    cloture:  'DTU 31.1 P1-1',
    bardage:  'NF DTU 41.2 P1-1 (août 2015)',
    dalle:    'NF DTU 13.3 P1-1 (décembre 2021)',
  }[projectType] || 'DTU 31.1 / 51.4';

  const tooltipContent = `Estimation basée sur ${dtuRef}. Ne remplace pas une étude structure (Eurocode 5).${foundationsNote ? ' ' + foundationsNote : ''}`;

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="sd-wrapper" role="note">
      <button
        type="button"
        className="sd-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={tooltipId}
        aria-label="Afficher la note technique DTU"
      >
        ⓘ
      </button>
      <span className="sd-label">
        Estimation indicative — ne remplace pas une étude professionnelle
      </span>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="sd-tooltip"
        >
          {tooltipContent}
        </span>
      )}

      <style jsx>{`
        .sd-wrapper {
          display: inline-flex;
          align-items: baseline;
          gap: 3px;
          position: relative;
          margin: 2px 0 0;
          font-size: 10.5px;
          font-family: var(--g-mono, 'IBM Plex Mono', monospace);
          color: var(--g-marine, #1E3A52);
          opacity: 0.55;
          line-height: 1.3;
          transition: opacity 0.2s ease;
        }
        .sd-wrapper:has(.sd-tooltip),
        .sd-wrapper:focus-within {
          opacity: 0.85;
        }
        .sd-trigger {
          all: unset;
          font-size: 11px;
          cursor: pointer;
          border-radius: 2px;
          padding: 0 1px;
          transition: opacity 0.15s ease, box-shadow 0.15s ease;
          line-height: 1;
        }
        .sd-trigger:hover {
          opacity: 1;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--g-marine, #1E3A52) 30%, transparent);
        }
        .sd-trigger:focus-visible {
          outline: 2px solid var(--g-gold, #C9971E);
          outline-offset: 2px;
        }
        .sd-label {
          font-size: 10.5px;
        }
        .sd-tooltip {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 50;
          max-width: 340px;
          padding: 8px 10px;
          font-size: 10px;
          line-height: 1.5;
          color: var(--g-marine, #1E3A52);
          background: color-mix(in srgb, var(--g-parchment, #FAF7F2) 97%, transparent);
          border: 1px solid color-mix(in srgb, var(--g-marine, #1E3A52) 18%, transparent);
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          white-space: normal;
          pointer-events: none;
        }
      `}</style>
    </span>
  );
}
