const CAT = {
  lame_terrasse: { accent: '#2E7D32', bg: '#F0FBF0', iconBg: '#DCF5DC', icon: '🪵', label: 'Lame terrasse' },
  lambourde:     { accent: '#1565C0', bg: '#EFF6FF', iconBg: '#DBEAFE', icon: '📏', label: 'Lambourde' },
  vis:           { accent: '#7C3AED', bg: '#F5F3FF', iconBg: '#EDE9FE', icon: '🔩', label: 'Visserie' },
};
const DEFAULT = { accent: '#3D5468', bg: '#F7FAFB', iconBg: '#EDF2F7', icon: '📦', label: 'Matériau' };

export default function MaterialCard({ nom, categorie, quantite, unite, detail }) {
  const s = CAT[categorie] || DEFAULT;

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-150"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8EEF3',
        boxShadow: '0 1px 3px rgba(0,0,0,.04)',
        borderLeft: `3px solid ${s.accent}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: s.iconBg }}>
        {s.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#0F1923' }}>{nom}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ background: s.bg, color: s.accent }}>{s.label}</span>
          {detail && <span className="text-xs truncate" style={{ color: '#7A90A4' }}>{detail}</span>}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-bold leading-none" style={{ color: s.accent }}>{quantite}</div>
        <div className="text-xs mt-0.5" style={{ color: '#7A90A4' }}>{unite}</div>
      </div>
    </div>
  );
}
