'use client';

/**
 * ModuleHeader — en-tête compact premium de page module
 *
 * Composition horizontale dense : titre fort + sous-titre sur une ligne,
 * pas de pictogramme, pas de carte. Maximum de force, minimum de hauteur.
 */

const MODULE_META = {
  terrasse: {
    title: 'Terrasse bois',
    sub: 'Dimensions · matériaux · budget — temps réel',
  },
  cabanon: {
    title: 'Cabanon bois',
    sub: 'Ossature · matériaux · fondations — temps réel',
  },
  pergola: {
    title: 'Pergola bois',
    sub: 'Poteaux · poutres · chevrons — temps réel',
  },
  cloture: {
    title: 'Clôture bois',
    sub: 'Poteaux · rails · lames — temps réel',
  },
  bardage: {
    title: 'Bardage extérieur bois',
    sub: 'Lames · tasseaux · fixations inox — temps réel',
  },
  dalle: {
    title: 'Dalle béton extérieure',
    sub: 'Béton C25/30 · joints · armature — temps réel',
  },
};

export default function ModuleHeader({ projectType = 'terrasse', children }) {
  const meta = MODULE_META[projectType] || MODULE_META.terrasse;

  return (
    <div className="module-header-compact">
      {/* Ligne titre */}
      <div className="module-header-row">
        <h1 className="module-header-title">{meta.title}</h1>
        <span className="module-header-sep">—</span>
        <p className="module-header-sub">{meta.sub}</p>
      </div>

      {/* Disclaimer inline (slot) */}
      {children}

      <style jsx>{`
        .module-header-compact {
          max-width: 1280px;
          margin: 0 auto;
          padding: 10px 48px 2px;
          position: relative;
          z-index: 1;
        }

        .module-header-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .module-header-title {
          font-family: var(--g-serif, 'DM Serif Display', Georgia, serif);
          font-size: clamp(1.55rem, 3vw, 2.1rem);
          font-weight: 400;
          color: var(--g-ink, #111214);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0;
          white-space: nowrap;
        }

        .module-header-sep {
          color: var(--g-mustard, #C9971E);
          font-size: 18px;
          font-weight: 300;
          opacity: 0.6;
          user-select: none;
        }

        .module-header-sub {
          font-family: var(--g-mono, 'IBM Plex Mono', monospace);
          font-size: 11.5px;
          color: var(--g-marine, #1E3A52);
          opacity: 0.55;
          line-height: 1.3;
          margin: 0;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        @media (max-width: 768px) {
          .module-header-compact {
            padding: 8px 16px 2px;
          }
          .module-header-row {
            flex-direction: column;
            gap: 2px;
          }
          .module-header-sep {
            display: none;
          }
          .module-header-sub {
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
