'use client';
import { useState, useRef } from 'react';

/* ── Presets cabanon — formats prédéfinis par catégorie ────────────── */
// Max dimensionnel = 5×4m (20 m²) — seuil permis de construire.
// Au-delà, la structure ossature 9×9cm + entretoises de toiture atteint ses limites
// réglementaires et structurelles pour un cabanon de jardin.
const CABANON_PRESETS = [
  { cat: 'Sans formalité (≤ 5 m²)', presets: [
    { label: '2 × 2',     w: 2.0, d: 2.0 },
    { label: '2.5 × 2',   w: 2.5, d: 2.0 },
    { label: '2 × 2.5',   w: 2.0, d: 2.5 },
  ]},
  { cat: 'Déclaration préalable (5–20 m²)', presets: [
    { label: '3 × 2',     w: 3.0, d: 2.0 },
    { label: '3 × 2.5',   w: 3.0, d: 2.5 },
    { label: '3 × 3',     w: 3.0, d: 3.0 },
    { label: '4 × 3',     w: 4.0, d: 3.0 },
    { label: '4 × 4',     w: 4.0, d: 4.0 },
    { label: '5 × 4',     w: 5.0, d: 4.0 },
  ]},
];

/* ── Seuil administratif — icônes Phosphor ──────────────────────── */
// Sources : Code de l'urbanisme R.421-2, R.421-9, R.421-14, R.421-17.
// Seuils identiques cabanon / pergola non adossée : ≤5m² sans formalité,
// 5–20m² DP, >20m² PC. Le texte du niveau rouge est atténué pour la pergola
// car la structure ouverte échappe parfois au PC selon le PLU.
function getSeuilInfo(area, projectType = 'cabanon') {
  if (area <= 5)  return { level: 'green',  icon: 'ph-fill ph-seal-check',  text: 'Souvent sans formalité' };
  if (area <= 20) return { level: 'amber',  icon: 'ph-duotone ph-file-text', text: 'Déclaration préalable probable' };
  if (projectType === 'pergola') {
    return { level: 'red', icon: 'ph-fill ph-warning', text: 'DP ou PC selon votre PLU' };
  }
  return { level: 'red', icon: 'ph-fill ph-warning', text: 'Permis de construire probable' };
}

/* Palette projet : SOFT GREIGE / BLACK / ELECTRIC GOLD + accent bleu technique */
const SEUIL_COLORS = {
  green: { bg: '#F1F7F2', border: '#C8E0CF', color: '#2B5D3A' },
  amber: { bg: '#FBF5E6', border: '#E8D29A', color: '#7A5A12' },
  red:   { bg: '#F8EDE8', border: '#E5C1B3', color: '#7A2E1A' },
};

/* ── Bornes sur mesure par module ─────────────────────────────────
   Cabanon : structure 9×9cm + toit mono-pente, limité réglementairement
             à 20m² (= seuil PC). Au-delà, hors périmètre outil.
   Pergola : grâce aux poteaux intermédiaires (MAX_POST_SPAN = 3.5m),
             le moteur gère des portées plus larges. On accepte jusqu'à
             10×6m, qui couvre la quasi-totalité des usages résidentiels.
             Min 2m pour garder une pergola vraisemblable.
─────────────────────────────────────────────────────────────────── */
const CABANON_BOUNDS = { wMin: 1.5, wMax: 5.0,  dMin: 1.5, dMax: 4.0 };
const PERGOLA_BOUNDS = { wMin: 2.0, wMax: 10.0, dMin: 2.0, dMax: 6.0 };
const BARDAGE_BOUNDS = { wMin: 1.0, wMax: 20.0, dMin: 1.0, dMax: 6.0 };
const DALLE_BOUNDS   = { wMin: 1.0, wMax: 20.0, dMin: 1.0, dMax: 20.0 };

function boundsFor(projectType, showHeight) {
  if (projectType === 'cloture')  return { wMin: 1, wMax: 30, dMin: 0.8, dMax: 2.2 };
  if (projectType === 'pergola')  return PERGOLA_BOUNDS;
  if (projectType === 'bardage')  return BARDAGE_BOUNDS;
  if (projectType === 'dalle')    return DALLE_BOUNDS;
  if (projectType === 'cabanon' || showHeight) return CABANON_BOUNDS;
  // terrasse (par défaut)
  return { wMin: 0.5, wMax: 20, dMin: 0.5, dMax: 20 };
}

function InputStepper({ label, value, setValue, min = 0.5, max = 20, step = 0.5 }) {
  const [warn, setWarn] = useState(null);
  const [pulse, setPulse] = useState(false);
  const valRef = useRef(null);

  function applyValue(next) {
    setValue(next);
    setWarn(next <= min ? 'min' : next >= max ? 'max' : null);
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
  }

  function nudge(delta) {
    const next = +(Math.min(max, Math.max(min, value + delta)).toFixed(1));
    applyValue(next);
  }

  function handleChange(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) {
      applyValue(Math.min(max, Math.max(min, v)));
    }
  }

  function handleRange(e) {
    applyValue(+(parseFloat(e.target.value).toFixed(1)));
  }

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="ctrl-input-group">
      <label className="ctrl-label">
        {label}
        {warn && (
          <span className="inline-block ml-1 text-xs font-semibold rounded px-1.5 py-0.5" style={{ color: '#7A5A12', background: '#FBF5E6', border: '1px solid #E8D29A' }}>
            {warn === 'min' ? `min ${min} m` : `max ${max} m`}
          </span>
        )}
      </label>
      <div className="ctrl-input-row">
        <button
          type="button"
          className="ctrl-btn"
          onClick={() => nudge(-step)}
          aria-label={`Diminuer ${label.toLowerCase()}`}
        >−</button>
        <span className={`ctrl-val-wrap${pulse ? ' ctrl-pulse' : ''}`} ref={valRef}>
          <input
            type="number"
            className="ctrl-val"
            value={value}
            min={min} max={max} step={step}
            onChange={handleChange}
            aria-label={`${label} en mètres`}
          />
          <span className="ctrl-unit">m</span>
        </span>
        <button
          type="button"
          className="ctrl-btn"
          onClick={() => nudge(+step)}
          aria-label={`Augmenter ${label.toLowerCase()}`}
        >+</button>
      </div>
      <div className="ctrl-range-wrap">
        <input
          type="range"
          className="ctrl-range"
          min={min} max={max} step={step}
          value={value}
          onChange={handleRange}
          aria-label={`${label} (curseur)`}
          aria-valuetext={`${value} mètres`}
        />
        <div className="ctrl-range-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   LiveSummary — Mini-résumé matériaux mis à jour en temps réel
   S'adapte au module : terrasse / cabanon / pergola / clôture
─────────────────────────────────────────────────────────────────── */
function LiveSummary({ area, projectType, liveStats }) {
  const items = buildLiveItems(area, projectType, liveStats);
  return (
    <div className="ctrl-live-summary" aria-live="polite" aria-atomic="true">
      <div className="ctrl-live-surface">
        <span className="ctrl-live-surface-val">{area}</span>
        <span className="ctrl-live-surface-unit">m²</span>
      </div>
      {items.length > 0 && (
        <div className="ctrl-live-items">
          {items.map((item, i) => (
            <div key={i} className="ctrl-live-item">
              <span className="ctrl-live-item-val">{item.value}</span>
              <span className="ctrl-live-item-lbl">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildLiveItems(area, projectType, s) {
  if (!s) return [];
  /* Terrasse — materials = { boards, joists, pads, screws, bande, slab } */
  if (projectType === 'terrasse') return [
    { value: s.boards,  label: 'lames' },
    { value: s.joists,  label: 'lambourdes' },
    { value: s.pads,    label: 'plots' },
  ].filter(i => typeof i.value === 'number' && i.value > 0);
  /* Cabanon — structure retourne studCount, chevrons (nombre BOM), wallArea */
  if (projectType === 'cabanon') return [
    { value: s.studCount,                                        label: 'montants' },
    { value: typeof s.chevrons === 'number' ? s.chevrons : null, label: 'chevrons' },
    { value: s.wallArea ? Math.round(s.wallArea * 10) / 10 : null, label: 'm² murs' },
  ].filter(i => typeof i.value === 'number' && i.value > 0);
  /* Pergola — structure retourne postCount, rafterCount, braceCount */
  if (projectType === 'pergola') return [
    { value: s.postCount,   label: 'poteaux' },
    { value: s.rafterCount, label: 'chevrons' },
    { value: s.braceCount,  label: 'jambes' },
  ].filter(i => typeof i.value === 'number' && i.value > 0);
  /* Clôture — structure retourne postCount, railCount, boardCount */
  if (projectType === 'cloture') return [
    { value: s.postCount,  label: 'poteaux' },
    { value: s.railCount,  label: 'rails' },
    { value: s.boardCount, label: 'lames' },
  ].filter(i => typeof i.value === 'number' && i.value > 0);
  return [];
}

export default function DeckControls({
  width, depth, area,
  setWidth, setDepth,
  foundationType, setFoundationType,
  slabThickness, setSlabThickness,
  slab,
  /* contrôle hauteur — cabanon uniquement */
  showHeight = false,
  height = 2.3,
  setHeight,
  /* contrôle fenêtre — cabanon uniquement */
  showWindow = false,
  windowPreset = 'none',
  setWindowPreset,
  windowPresets = {},
  projectType = 'terrasse',
  /* résumé live matériaux — calculé dans DeckSimulator */
  liveStats = null,
  /* garde-corps — terrasse uniquement */
  gardeCorps,
  onGardeCorpsChange,
}) {
  // Les presets cabanon ne s'appliquent qu'au cabanon. Pour pergola/terrasse/cloture,
  // on force le mode "custom" (steppers + range) pour éviter d'afficher les dimensions
  // cabanon comme des choix valides.
  const hasPresets = projectType === 'cabanon';
  const [dimMode, setDimMode] = useState(hasPresets ? 'presets' : 'custom');

  // Preset actif = celui qui matche width/depth exactement
  const activePresetKey = `${width}x${depth}`;

  // Bornes dimensionnelles par module (cf. boundsFor en haut de fichier)
  const bounds = boundsFor(projectType, showHeight);

  function applyPreset(p) {
    setWidth(p.w);
    setDepth(p.d);
  }

  // Seuil administratif — affiché pour cabanon et pergola (tous deux soumis
  // aux seuils R.421-2 CU). Non pertinent pour terrasse (pas de construction
  // close/couverte) ni clôture (règles différentes : R.421-12).
  const showSeuil = projectType === 'cabanon' || projectType === 'pergola';
  const seuil = showSeuil ? getSeuilInfo(parseFloat(area) || 0, projectType) : null;
  const seuilStyle = seuil ? SEUIL_COLORS[seuil.level] : null;

  return (
    <div className="sim-section-card">
      <div className="sim-section-card-header">
        <div>
          <h2 className="sim-section-title-lg">Dimensions</h2>
          <p className="sim-section-subtitle">
            {showHeight ? 'Choisissez un format ou personnalisez' : 'Largeur et profondeur de la terrasse'}
          </p>
        </div>
      </div>

      {/* ── Toggle presets / sur mesure — cabanon uniquement ── */}
      {hasPresets && (
        <div className="ctrl-toggle-group">
          <button
            type="button"
            className="btn-ghost"
            aria-pressed={dimMode === 'presets'}
            onClick={() => setDimMode('presets')}
          >
            <i className="ph-bold ph-package" aria-hidden="true" /> Formats
          </button>
          <button
            type="button"
            className="btn-ghost"
            aria-pressed={dimMode === 'custom'}
            onClick={() => setDimMode('custom')}
          >
            <i className="ph-bold ph-pencil-simple" aria-hidden="true" /> Sur mesure
          </button>
        </div>
      )}

      {/* ── Presets par catégorie — cabanon uniquement ── */}
      {hasPresets && dimMode === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 8 }}>
          {CABANON_PRESETS.map(cat => (
            <div key={cat.cat}>
              <div className="ctrl-preset-cat">{cat.cat}</div>
              <div className="ctrl-preset-group">
                {cat.presets.map(p => {
                  const key = `${p.w}x${p.d}`;
                  const active = key === activePresetKey;
                  return (
                    <button key={key} onClick={() => applyPreset(p)}
                      className={`ctrl-preset-btn${active ? ' ctrl-preset-btn--active' : ''}`}
                    >
                      {p.label} m
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Steppers — sur mesure (tous modules sauf cabanon en mode presets) ── */}
      {(!hasPresets || dimMode === 'custom') && (
        <div className="ctrl-inputs">
          <InputStepper
            label={projectType === 'cloture' ? 'Longueur' : 'Largeur'}
            value={width}
            setValue={setWidth}
            min={bounds.wMin}
            max={bounds.wMax}
          />
          <InputStepper
            label={projectType === 'cloture' ? 'Hauteur' : 'Profondeur'}
            value={depth}
            setValue={setDepth}
            min={bounds.dMin}
            max={bounds.dMax}
          />
        </div>
      )}

      {/* ── Hauteur — cabanon / pergola, toujours visible ── */}
      {showHeight && (
        <div className="ctrl-inputs" style={{ marginTop: hasPresets && dimMode === 'presets' ? 0 : undefined }}>
          <InputStepper
            label="Hauteur"
            value={height}
            setValue={setHeight}
            min={2.0}
            max={3.0}
            step={0.1}
          />
        </div>
      )}

      <LiveSummary area={area} projectType={projectType} liveStats={liveStats} />

      {/* ── Indicateur seuil administratif — cabanon uniquement ── */}
      {seuil && (
        <div className="ctrl-seuil" style={{
          background: seuilStyle.bg,
          border: `1px solid ${seuilStyle.border}`,
          color: seuilStyle.color,
        }}>
          <div className="ctrl-seuil-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className={seuil.icon} aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }} />
            {seuil.text}
          </div>
          <p className="ctrl-seuil-sub">
            À vérifier selon votre commune, le PLU et les secteurs protégés.
          </p>
        </div>
      )}

      {/* ── Fenêtre optionnelle — cabanon uniquement ── */}
      {showWindow && (
        <div className="ctrl-input-group" style={{ marginTop: 16 }}>
          <span className="ctrl-label">Fenêtre</span>
          <div className="ctrl-radio-group" style={{ flexWrap: 'wrap' }}>
            {Object.entries(windowPresets).map(([key, preset]) => (
              <label
                key={key}
                className={`ctrl-radio${windowPreset === key ? ' ctrl-radio--active' : ''}`}
              >
                <input
                  type="radio"
                  name="windowPreset"
                  value={key}
                  checked={windowPreset === key}
                  onChange={() => setWindowPreset(key)}
                />
                {preset.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Garde-corps — terrasse seulement ── */}
      {projectType === 'terrasse' && (
        <div className="ctrl-input-group" style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <label className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={gardeCorps?.enabled ?? false}
              onChange={(e) => onGardeCorpsChange?.({ enabled: e.target.checked })}
              className="w-4 h-4 accent-[var(--primary)]"
            />
            <span className="ctrl-label" style={{ marginBottom: 0 }}>Ajouter un garde-corps</span>
          </label>
          {gardeCorps?.enabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
              <div>
                <div className="ctrl-slab-row">
                  <span className="ctrl-slab-label">Hauteur</span>
                  <span className="ctrl-slab-label">{(gardeCorps.height ?? 1.0).toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min={1.0} max={1.2} step={0.05}
                  value={gardeCorps.height ?? 1.0}
                  onChange={(e) => onGardeCorpsChange?.({ height: parseFloat(e.target.value) })}
                  className="ctrl-range w-full"
                />
              </div>
              <div>
                <p className="ctrl-label" style={{ marginBottom: 6 }}>Côtés avec garde-corps</p>
                <div className="grid grid-cols-2 gap-1">
                  {['avant', 'arrière', 'gauche', 'droite'].map(side => (
                    <label key={side} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(gardeCorps.sides ?? ['avant', 'gauche']).includes(side)}
                        onChange={(e) => {
                          const current = gardeCorps.sides ?? ['avant', 'gauche'];
                          const next = e.target.checked
                            ? [...current, side]
                            : current.filter(s => s !== side);
                          onGardeCorpsChange?.({ sides: next });
                        }}
                        className="w-3.5 h-3.5 accent-[var(--primary)]"
                      />
                      <span className="ctrl-slab-label capitalize" style={{ marginBottom: 0 }}>{side}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="ctrl-seuil-sub" style={{ color: 'var(--text-4)', marginTop: 2 }}>DTU 36.3 — entraxe poteaux max 1.20m, balustres ≤ 11cm</p>
            </div>
          )}
        </div>
      )}

      {/* ── Type de support ── */}
      <div className="ctrl-input-group" style={{ marginTop: 16 }}>
        <span className="ctrl-label">Type de support</span>
        <div className="ctrl-radio-group">
          <label className={`ctrl-radio${foundationType === 'ground' ? ' ctrl-radio--active' : ''}`}>
            <input
              type="radio"
              name="foundationType"
              value="ground"
              checked={foundationType === 'ground'}
              onChange={() => setFoundationType('ground')}
            />
            <i className="ctrl-radio-icon ph-duotone ph-plant" aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }} />
            Sol direct
          </label>
          <label className={`ctrl-radio${foundationType === 'slab' ? ' ctrl-radio--active' : ''}`}>
            <input
              type="radio"
              name="foundationType"
              value="slab"
              checked={foundationType === 'slab'}
              onChange={() => setFoundationType('slab')}
            />
            <i className="ctrl-radio-icon ph-duotone ph-mountains" aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }} />
            Chape béton
          </label>
        </div>
      </div>

      {/* ── Épaisseur dalle + résumé chape (visible uniquement si chape béton) ── */}
      {foundationType === 'slab' && (
        <>
          <div className="ctrl-input-group mt-4">
            <label className="ctrl-label">Épaisseur dalle béton (cm)</label>
            <div className="ctrl-input-row">
              <button className="ctrl-btn" aria-label="Diminuer épaisseur dalle" onClick={() => setSlabThickness(Math.max(8, slabThickness - 1))}>−</button>
              <input
                type="number"
                className="ctrl-val"
                value={slabThickness}
                min={8} max={25} step={1}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setSlabThickness(Math.min(25, Math.max(8, v)));
                }}
              />
              <span className="ctrl-unit">cm</span>
              <button className="ctrl-btn" aria-label="Augmenter épaisseur dalle" onClick={() => setSlabThickness(Math.min(25, slabThickness + 1))}>+</button>
            </div>
          </div>

          {/* ── Résumé dalle : volume béton + coût total fondation ── */}
          {slab?.betonVolume > 0 && (
            <div className="ctrl-slab-summary">
              <div className="ctrl-slab-row">
                <span className="ctrl-slab-label">Volume béton</span>
                <span className="ctrl-slab-value">{slab.betonVolume} m³</span>
              </div>
              <div className="ctrl-slab-row">
                <span className="ctrl-slab-label">Coût total fondation</span>
                <span className="ctrl-slab-value">{slab.totalPrice?.toFixed(2)} €</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
