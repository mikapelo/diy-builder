import { useState, useEffect } from 'react';

const TYPES_BOIS = [
  { value: 'pin',     label: 'Pin traité cl.4',  desc: 'Économique · ~18 €/ml',  emoji: '🟡' },
  { value: 'douglas', label: 'Douglas naturel',   desc: 'Mi-gamme · ~24 €/ml',    emoji: '🟠' },
  { value: 'ipe',     label: 'Ipé exotique',      desc: 'Premium · ~42 €/ml',     emoji: '🟤' },
];

export default function FormulaireTerrasse({ onSubmit, loading, defaultValues }) {
  const [form, setForm] = useState({
    largeur:   defaultValues?.largeur   || '',
    longueur:  defaultValues?.longueur  || '',
    type_bois: defaultValues?.type_bois || 'pin',
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (defaultValues) setForm({ largeur: defaultValues.largeur || '', longueur: defaultValues.longueur || '', type_bois: defaultValues.type_bois || 'pin' });
  }, [defaultValues?.largeur, defaultValues?.longueur, defaultValues?.type_bois]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setTouched(p => ({ ...p, [name]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ largeur: true, longueur: true });
    if (!isValid()) return;
    onSubmit({ largeur: parseFloat(form.largeur), longueur: parseFloat(form.longueur), type_bois: form.type_bois });
  }

  function isValid() {
    return form.largeur !== '' && Number(form.largeur) > 0
        && form.longueur !== '' && Number(form.longueur) > 0;
  }

  const surface = form.largeur && form.longueur
    ? (parseFloat(form.largeur) * parseFloat(form.longueur)).toFixed(1) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* Dimensions */}
      <div>
        <label className="section-label mb-4 block">Dimensions</label>
        <div className="grid grid-cols-2 gap-3">
          {['largeur', 'longueur'].map(field => {
            const isErr = touched[field] && !form[field];
            return (
              <div key={field}>
                <label className="block text-xs font-semibold mb-1.5 capitalize" style={{ color: '#3D5468' }}>
                  {field} <span style={{ color: '#7A90A4', fontWeight: 400 }}>(m)</span>
                </label>
                <input
                  type="number" name={field} min="0.5" max="100" step="0.1"
                  placeholder={field === 'largeur' ? '4.5' : '6.0'}
                  value={form[field]} onChange={handleChange}
                  className="input-field"
                  style={{ borderColor: isErr ? '#EF4444' : undefined, background: isErr ? '#FFF5F5' : undefined }}
                />
                {isErr && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>Champ requis</p>}
              </div>
            );
          })}
        </div>

        {surface && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl w-fit text-sm font-semibold" style={{ background: '#F0FBF0', border: '1px solid #B2DFBB', color: '#2E7D32' }}>
            <span>📐</span> {surface} m²
          </div>
        )}
      </div>

      {/* Type de bois */}
      <div>
        <label className="section-label mb-4 block">Type de bois</label>
        <div className="space-y-2">
          {TYPES_BOIS.map(t => {
            const isSelected = form.type_bois === t.value;
            return (
              <label key={t.value} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  border: `1.5px solid ${isSelected ? '#4CAF50' : '#E8EEF3'}`,
                  background: isSelected ? '#F0FBF0' : '#FAFBFC',
                  boxShadow: isSelected ? '0 0 0 3px rgba(76,175,80,.08)' : 'none',
                }}
              >
                <input type="radio" name="type_bois" value={t.value} checked={isSelected} onChange={handleChange} className="sr-only" />
                <span className="text-xl">{t.emoji}</span>
                <div className="flex-1">
                  <span className="block text-sm font-semibold" style={{ color: '#0F1923' }}>{t.label}</span>
                  <span className="block text-xs" style={{ color: '#7A90A4' }}>{t.desc}</span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#2E7D32' }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className={`w-full py-4 font-bold text-sm rounded-xl transition-all duration-200 ${loading ? 'cursor-not-allowed opacity-50' : 'active:scale-[.98]'}`}
        style={{
          background: loading ? '#E8EEF3' : '#FFD600',
          color: loading ? '#7A90A4' : '#0F1923',
          boxShadow: loading ? 'none' : '0 2px 8px rgba(255,214,0,.35)',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Calcul en cours…
          </span>
        ) : '🔨 Calculer mon projet'}
      </button>
    </form>
  );
}
