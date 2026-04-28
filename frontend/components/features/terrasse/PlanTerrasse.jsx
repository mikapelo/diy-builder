/**
 * frontend/components/PlanTerrasse.jsx
 * ─────────────────────────────────────────────────────────────
 * Génère un schéma SVG de la terrasse bois représentant :
 *  - le contour de la terrasse
 *  - les lambourdes (barres verticales)
 *  - les lames de terrasse (barres horizontales)
 *  - les cotes (dimensions)
 *
 * Le SVG est proportionnel aux vraies dimensions du projet.
 * ─────────────────────────────────────────────────────────────
 */

// ── Constantes de rendu SVG ────────────────────────────────────
const SVG_WIDTH         = 560;  // largeur du canvas SVG (px)
const SVG_HEIGHT        = 380;
const PADDING           = 50;   // espace pour les cotes
const LAME_COLOR        = '#C8946A'; // bois clair
const LAME_COLOR_ALT    = '#B07F58'; // bois légèrement plus foncé (alternance)
const LAMBOURDE_COLOR   = '#7A5230'; // bois plus foncé pour les lambourdes
const CONTOUR_COLOR     = '#5C3D1E';
const COTE_COLOR        = '#6B7280';
const FOND_COLOR        = '#FDF6EC';

/**
 * @param {{ largeur: number, longueur: number, plan: Object }} props
 *   - largeur  : m
 *   - longueur : m
 *   - plan.nb_lambourdes_affichage : nombre de lambourdes à afficher
 *   - plan.entraxe                 : espacement entre lambourdes (m)
 */
export default function PlanTerrasse({ largeur, longueur, plan }) {
  if (!largeur || !longueur) return null;

  // Zone de dessin (hors marges de cotes)
  const drawW = SVG_WIDTH  - PADDING * 2;
  const drawH = SVG_HEIGHT - PADDING * 2;

  // Ratio pour conserver les proportions
  const ratio    = Math.min(drawW / longueur, drawH / largeur);
  const planW    = longueur * ratio; // longueur → axe horizontal (X)
  const planH    = largeur  * ratio; // largeur  → axe vertical   (Y)

  // Origine du plan dans le SVG
  const ox = PADDING + (drawW - planW) / 2;
  const oy = PADDING + (drawH - planH) / 2;

  // ── Génération des lames ─────────────────────────────────
  const LARGEUR_LAME_M = 0.145; // 145 mm
  const nbLames        = Math.ceil(largeur / LARGEUR_LAME_M);
  const lameH          = planH / nbLames;

  const lames = Array.from({ length: nbLames }, (_, i) => ({
    x:      ox,
    y:      oy + i * lameH,
    width:  planW,
    height: Math.max(lameH - 1, 1), // 1px de joint
    alt:    i % 2 === 1,
  }));

  // ── Génération des lambourdes ─────────────────────────────
  const nbLambourdes = plan?.nb_lambourdes_affichage || Math.ceil(longueur / (plan?.entraxe || 0.4)) + 1;
  const lambStep     = planW / Math.max(nbLambourdes - 1, 1);
  const LAMBOURDE_W  = Math.max(6, lambStep * 0.12); // épaisseur visuelle

  const lambourdes = Array.from({ length: nbLambourdes }, (_, i) => ({
    x:      ox + i * lambStep - LAMBOURDE_W / 2,
    y:      oy,
    width:  LAMBOURDE_W,
    height: planH,
  }));
  // Ajuster la première et dernière lambourde sur le bord
  if (lambourdes[0])              lambourdes[0].x = ox;
  if (lambourdes[nbLambourdes-1]) lambourdes[nbLambourdes-1].x = ox + planW - LAMBOURDE_W;

  // ── Cotes ─────────────────────────────────────────────────
  const TICK = 6;
  const GAP  = 8;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 className="text-lg font-bold text-stone-800">📐 Plan de la terrasse</h2>
        <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
          {largeur} m × {longueur} m
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-[#FDF6EC]">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          width="100%"
          style={{ maxWidth: SVG_WIDTH, display: 'block', margin: '0 auto' }}
          aria-label={`Plan de terrasse ${largeur}m × ${longueur}m`}
          role="img"
        >
          {/* ── Fond ── */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill={FOND_COLOR} />

          {/* ── Lames ── */}
          {lames.map((l, i) => (
            <rect
              key={`lame-${i}`}
              x={l.x} y={l.y}
              width={l.width} height={l.height}
              fill={l.alt ? LAME_COLOR_ALT : LAME_COLOR}
            />
          ))}

          {/* ── Lambourdes (par-dessus les lames) ── */}
          {lambourdes.map((lb, i) => (
            <rect
              key={`lb-${i}`}
              x={lb.x} y={lb.y}
              width={lb.width} height={lb.height}
              fill={LAMBOURDE_COLOR}
              opacity={0.85}
            />
          ))}

          {/* ── Contour ── */}
          <rect
            x={ox} y={oy}
            width={planW} height={planH}
            fill="none"
            stroke={CONTOUR_COLOR}
            strokeWidth={2.5}
          />

          {/* ── Cote longueur (bas) ── */}
          <line
            x1={ox}        y1={oy + planH + GAP + TICK}
            x2={ox + planW} y2={oy + planH + GAP + TICK}
            stroke={COTE_COLOR} strokeWidth={1.5}
          />
          <line x1={ox}        y1={oy + planH + GAP} x2={ox}        y2={oy + planH + GAP + TICK * 2} stroke={COTE_COLOR} strokeWidth={1.5} />
          <line x1={ox + planW} y1={oy + planH + GAP} x2={ox + planW} y2={oy + planH + GAP + TICK * 2} stroke={COTE_COLOR} strokeWidth={1.5} />
          <text
            x={ox + planW / 2}
            y={oy + planH + GAP + TICK * 2 + 14}
            textAnchor="middle"
            fontSize={13}
            fontWeight="600"
            fill={COTE_COLOR}
            fontFamily="ui-monospace, monospace"
          >
            {longueur} m
          </text>

          {/* ── Cote largeur (gauche) ── */}
          <line
            x1={ox - GAP - TICK}
            y1={oy}
            x2={ox - GAP - TICK}
            y2={oy + planH}
            stroke={COTE_COLOR} strokeWidth={1.5}
          />
          <line x1={ox - GAP} y1={oy}        x2={ox - GAP - TICK * 2} y2={oy}        stroke={COTE_COLOR} strokeWidth={1.5} />
          <line x1={ox - GAP} y1={oy + planH} x2={ox - GAP - TICK * 2} y2={oy + planH} stroke={COTE_COLOR} strokeWidth={1.5} />
          <text
            x={ox - GAP - TICK * 2 - 6}
            y={oy + planH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
            fontWeight="600"
            fill={COTE_COLOR}
            fontFamily="ui-monospace, monospace"
            transform={`rotate(-90, ${ox - GAP - TICK * 2 - 6}, ${oy + planH / 2})`}
          >
            {largeur} m
          </text>

          {/* ── Légende ── */}
          <g transform={`translate(${ox}, ${oy + planH + 36})`}>
            <rect x={0} y={0} width={14} height={10} fill={LAME_COLOR} rx={2}/>
            <text x={18} y={9} fontSize={10} fill="#78716c" fontFamily="system-ui">Lames terrasse</text>
            <rect x={110} y={0} width={8} height={10} fill={LAMBOURDE_COLOR} rx={2}/>
            <text x={122} y={9} fontSize={10} fill="#78716c" fontFamily="system-ui">
              Lambourdes ({nbLambourdes})
            </text>
          </g>
        </svg>
      </div>

      <p className="text-xs text-stone-400 mt-2 text-center">
        Schéma indicatif — vue de dessus, lambourdes perpendiculaires aux lames
      </p>
    </div>
  );
}
