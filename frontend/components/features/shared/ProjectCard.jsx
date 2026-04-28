import Image from 'next/image';

const ICONS = {
  terrasse: 'deck',
  cabanon:  'cottage',
  pergola:  'fence',
  cloture:  'fence',
};

export default function ProjectCard({ id, title, tags = [], active, onSelect, style: customStyle, className: extraClass }) {
  const icon = ICONS[id] || 'construction';

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-[20px] transition-all duration-300 cursor-${active ? 'pointer' : 'not-allowed'} ${
        active
          ? 'bg-white shadow-[0_4px_20px_rgba(201,151,30,0.08)]'
          : 'bg-[var(--surface-low)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
      }${extraClass ? ' ' + extraClass : ''}`}
      style={{
        opacity: active ? 1 : 0.75,
        ...customStyle,
      }}
      onClick={active ? onSelect : undefined}
    >
      {/* Badge bientôt */}
      {!active && (
        <div className="absolute top-3 right-3 z-10">
          <span className="badge-soon text-[10px] px-2.5 py-1 font-semibold">Bientôt</span>
        </div>
      )}

      {/* Zone illustration */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-white/40 to-white/10 aspect-video">
        <Image
          src={`/illustrations/${id}.png`}
          alt={title}
          width={220}
          height={160}
          className="w-full h-full object-cover"
          priority={false}
        />
        {!active && (
          <div className="absolute inset-0 bg-white/30" />
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 px-5 py-4">

        <h3 className="text-sm font-semibold text-[var(--text)] leading-snug mb-3 font-headline" style={{ letterSpacing: '-0.02em' }}>
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span
              key={tag}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors duration-200 ${
                active
                  ? 'bg-[var(--surface-high)] text-[var(--text-3)]'
                  : 'bg-[var(--border)] text-[var(--text-4)]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {active ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-gold hover:shadow-[0_4px_12px_rgba(201,151,30,0.25)] text-white text-sm font-semibold rounded-full transition-all duration-200 hover:brightness-110"
              style={{ letterSpacing: '-0.01em' }}
            >
              Calculer
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          ) : (
            <div className="w-full px-4 py-2.5 text-center text-xs font-medium rounded-full bg-[var(--surface-high)] text-[var(--text-4)] cursor-not-allowed">
              Prochainement
            </div>
          )}
        </div>
      </div>

      {/* Hover effect */}
      {active && (
        <div className="absolute inset-0 pointer-events-none group-hover:bg-gradient-to-t group-hover:from-white/5 to-transparent transition-all duration-300" />
      )}
    </div>
  );
}
