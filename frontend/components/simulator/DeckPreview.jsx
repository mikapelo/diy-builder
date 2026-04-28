'use client';
import { useState } from 'react';

export default function DeckPreview({ width, depth, area, boards, joists, pads }) {
  const key = `${width}-${depth}`;
  const [exploded, setExploded] = useState(false);

  /*
   * Vue de dessus — 3 couches superposées :
   *
   *  ●  ●  ●  ●   plots      (z:0)  sol
   *  |  |  |  |   lambourdes (z:1)  structure
   *  ═══════════  lames      (z:2)  surface
   *
   * Mode assemblé  → seules les lames visibles
   * Mode éclaté    → les 3 couches séparées verticalement
   */

  /* ── Comptage réel pour le rendu ─────────────────────
   *  entraxe lambourdes ≈ 40 cm  → joistCount = floor(width / 0.40) + 1
   *  entraxe plots      ≈ 120 cm → plotRows   = floor(depth / 1.20) + 1
   *  largeur lame réelle = 145 mm → boardH% = 0.145 / depth * 100
   * ─────────────────────────────────────────────────── */
  const joistCount    = Math.floor(width / 0.4) + 1;
  const plotRowsCount = Math.floor(depth / 1.2) + 1;

  const displayJoists   = Math.min(joistCount,    20);
  const displayPlotRows = Math.min(plotRowsCount,  6);
  const displayBoards   = Math.min(Math.floor(depth / 0.145), 40);

  const boardH   = +(0.145 / depth * 100).toFixed(3); // % hauteur par lame
  const boardGap = +(0.003 / depth * 100).toFixed(4); // % joint entre lames

  return (
    <div className="deck-preview">

      {/* ── Photo ── */}
      <div className="deck-photo">
        <img src="/illustrations/terrasse.png" alt="Terrasse bois" />
        <div className="deck-dim-badge">{width}&thinsp;m × {depth}&thinsp;m</div>
      </div>

      {/* ── Statistiques ── */}
      <div className="deck-stats">
        <div className="deck-stat">
          <div className="deck-stat-value">{area}</div>
          <div className="deck-stat-label">m²</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{boards}</div>
          <div className="deck-stat-label">lames</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{joists}</div>
          <div className="deck-stat-label">lambourdes</div>
        </div>
      </div>

      {/* ── Construction animée ── */}
      <div className="deck-schematic" key={key}>

        <div className="deck-schema-header">
          <p className="deck-schema-label">Vue isométrique — construction</p>
          <button
            className="explode-btn"
            onClick={() => setExploded(v => !v)}
          >
            {exploded ? 'Vue assemblée' : 'Vue éclatée'}
          </button>
        </div>

        <div className="deck-ground-wrap">
          <div
            className="deck-ground"
            style={{ aspectRatio: `${width} / ${depth}` }}
          >
            <div className={`deck-view${exploded ? ' exploded' : ''}`}>

              {/* ── Couche lames (boards) ── visible par défaut, flotte en vue éclatée */}
              <div className="deck-layer boards">
                {Array.from({ length: displayBoards }, (_, i) => (
                  <div
                    key={i}
                    className={`board${i % 2 === 0 ? '' : ' board-alt'}`}
                    style={{
                      top:    `calc(${i} * (${boardH}% + ${boardGap}%))`,
                      height: `${boardH}%`,
                      animationDelay: `${700 + i * 20}ms`,
                    }}
                  />
                ))}
              </div>

              {/* ── Couche lambourdes (joists) ── cachée par défaut, niveau intermédiaire en vue éclatée */}
              <div className="deck-layer joists">
                {Array.from({ length: displayJoists }, (_, i) => (
                  <div
                    key={i}
                    className="joist"
                    style={{
                      left: `calc(${i} / ${Math.max(displayJoists - 1, 1)} * (100% - 6px))`,
                      animationDelay: `${300 + i * 30}ms`,
                    }}
                  />
                ))}
              </div>

              {/* ── Couche plots ── cachée par défaut, niveau sol en vue éclatée */}
              <div className="deck-layer plots">
                {Array.from({ length: displayPlotRows }, (_, row) => (
                  <div
                    key={row}
                    className="plot-row"
                    style={{
                      top: `calc(${row / Math.max(displayPlotRows - 1, 1)} * (100% - 12px))`,
                    }}
                  >
                    {Array.from({ length: displayJoists }, (_, col) => (
                      <div
                        key={col}
                        className="plot"
                        style={{ '--plot-delay': `${row * 50 + col * 18}ms` }}
                      />
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="deck-dim-x">{width}&thinsp;m</div>
          <div className="deck-dim-y">{depth}&thinsp;m</div>
        </div>

      </div>

    </div>
  );
}
