const STORES = {
  'Leroy Merlin': { color: '#2E7D32', bg: '#F0FBF0', border: '#B2DFBB', logo: 'leroymerlin' },
  'Castorama':    { color: '#0066CC', bg: '#EFF6FF', border: '#BFDBFE', logo: 'castorama'   },
  'Brico Dépôt':  { color: '#E85D00', bg: '#FFF5EE', border: '#FECBA1', logo: 'bricodepot'  },
};

export default function PriceComparator({ comparateur_prix }) {
  if (!comparateur_prix?.detail || !Object.keys(comparateur_prix.detail).length) return null;

  const { detail, economie_max, mode } = comparateur_prix;
  const sorted   = Object.entries(detail).sort((a, b) => a[1] - b[1]);
  const minPrice = sorted[0]?.[1] || 0;
  const maxBar   = sorted[sorted.length - 1]?.[1] || 1;

  return (
    <section>
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="section-label mb-2">Comparateur de prix</p>
          <h2 className="text-2xl font-bold" style={{ color: '#0F1923', letterSpacing: '-0.025em' }}>
            Où acheter moins cher ?
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          {economie_max > 0 && (
            <span className="badge-success text-sm px-3 py-1.5">
              💰 Jusqu'à <strong>{economie_max.toFixed(0)} €</strong> d'économie
            </span>
          )}
          {mode === 'simulation' && <span className="badge-amber">Prix simulés</span>}
        </div>
      </div>

      {/* Barres comparatives style Skyscanner */}
      <div className="space-y-3">
        {sorted.map(([magasin, total], idx) => {
          const cfg    = STORES[magasin] || { color: '#3D5468', bg: '#F7FAFB', border: '#E8EEF3', logo: null };
          const isBest = idx === 0;
          const pct    = Math.round((total / maxBar) * 100);
          const diff   = (total - minPrice).toFixed(0);

          return (
            <div
              key={magasin}
              className="price-comparator-row"
              style={{
                background: isBest ? cfg.bg : '#FAFBFC',
                border: `1.5px solid ${isBest ? cfg.border : '#E8EEF3'}`,
                borderRadius: 14,
                padding: '14px 18px',
                transition: 'transform .25s ease, box-shadow .25s ease',
                boxShadow: isBest ? '0 4px 20px rgba(0,0,0,.07)' : '0 1px 3px rgba(0,0,0,.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.10)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = isBest ? '0 4px 20px rgba(0,0,0,.07)' : '0 1px 3px rgba(0,0,0,.04)';
              }}
            >
              {/* Ligne infos */}
              <div className="flex items-center gap-3 mb-3">
                {/* Logo enseigne */}
                <img
                  src={`/brands/${cfg.logo}.svg`}
                  alt={magasin}
                  style={{ height: 28, width: 'auto', opacity: 1 }}
                />

                <div className="flex-1" />

                {/* Prix */}
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: 22, fontWeight: 700, color: isBest ? cfg.color : '#0F1923', letterSpacing: '-0.04em' }}>
                    {total.toFixed(0)}
                  </span>
                  <span style={{ fontSize: 13, color: '#7A90A4' }}>€</span>
                </div>

                {/* Badge meilleur prix / écart */}
                {isBest ? (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: cfg.color, color: 'white', whiteSpace: 'nowrap' }}>
                    Meilleur prix
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: '#B0BCC6', whiteSpace: 'nowrap', minWidth: 48, textAlign: 'right' }}>
                    +{diff} €
                  </span>
                )}
              </div>

              {/* Barre de prix */}
              <div className="price-bar">
                <div
                  className="price-fill"
                  style={{
                    width: `${pct}%`,
                    background: isBest
                      ? `linear-gradient(90deg, ${cfg.color} 0%, ${cfg.color}CC 100%)`
                      : '#D1DBE4',
                    transition: 'width .8s cubic-bezier(.16,1,.3,1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {mode === 'simulation' && (
        <div className="mt-5 p-4 rounded-xl" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#7A5800' }}>
            ⚠️ Prix simulés — connectez PostgreSQL pour obtenir les prix en temps réel.
          </p>
        </div>
      )}
    </section>
  );
}
