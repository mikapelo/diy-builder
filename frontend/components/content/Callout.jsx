/**
 * Callout.jsx — Encadré éditorial sémantique (famille g-v2, 3 intentions).
 *
 *   type='info' → « Bon à savoir » (or)        — repère utile, contexte
 *   type='warn' → « Attention »  (terracotta)  — seuil réglementaire, risque
 *   type='pro'  → « Le geste pro » (vert)       — astuce de mise en œuvre
 *
 * Styles : classes .content-box / .content-box--{info|warn|pro} (simulator.css).
 * Usage : <Callout type="warn">…</Callout> — ou titre personnalisé via `title`.
 */

const PRESETS = {
  info: { cls: 'content-box--info', label: 'Bon à savoir', icon: 'info' },
  warn: { cls: 'content-box--warn', label: 'Attention', icon: 'warn' },
  pro: { cls: 'content-box--pro', label: 'Le geste pro', icon: 'pro' },
};

function CalloutIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
  };
  if (name === 'warn') {
    return (
      <svg {...common}>
        <path d="M12 4 L21.5 20 L2.5 20 Z" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="12" y1="17" x2="12" y2="17" />
      </svg>
    );
  }
  if (name === 'pro') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}

export default function Callout({ type = 'info', title, children }) {
  const preset = PRESETS[type] || PRESETS.info;
  return (
    <aside className={`content-box ${preset.cls}`}>
      <p className="content-box-title">
        <CalloutIcon name={preset.icon} />
        {title || preset.label}
      </p>
      <div className="content-box-body">{children}</div>
    </aside>
  );
}
