'use client';

/*
 * Boards — rendu 2D du plan de pose des lames (vue de dessus)
 *
 * Règles reproduites :
 *  • largeur lame réelle   = 145 mm
 *  • joint entre lames     =   4 mm
 *  • longueur standard     =   3 m
 *  • joints décalés        : rangées paires coupent à x=3m, 6m…
 *                            rangées impaires décalées de +1.5m
 */

const BOARD_W   = 0.145; // m
const BOARD_GAP = 0.004; // m
const STD_LEN   = 3.0;   // m

export default function Boards({ width, depth }) {
  const step  = BOARD_W + BOARD_GAP;
  const count = Math.min(Math.floor(depth / step) + 1, 60);

  return (
    <div className="plan-layer plan-boards">
      {Array.from({ length: count }, (_, row) => {
        const topPct = +(row * step / depth * 100).toFixed(4);
        const hPct   = +(BOARD_W   / depth * 100).toFixed(4);

        // Rangées impaires : décalage de la moitié d'une longueur standard
        const offset = row % 2 === 1 ? STD_LEN / 2 : 0;

        // Construction des segments de cette rangée
        const segs = [];
        let x = -offset;
        while (x < width) {
          const s = Math.max(x, 0);
          const e = Math.min(x + STD_LEN, width);
          if (s < width) {
            segs.push({
              l:   +(s / width * 100).toFixed(4),
              w:   +((e - s) / width * 100).toFixed(4),
              cut: e < width - 0.001, // vrai s'il y a un joint de coupe ici
            });
          }
          x += STD_LEN;
        }

        return (
          <div
            key={row}
            className="plan-board-row"
            style={{ top: `${topPct}%`, height: `${hPct}%` }}
          >
            {segs.map((seg, si) => (
              <div
                key={si}
                className={`plan-board-seg${seg.cut ? ' has-cut' : ''}`}
                style={{ left: `${seg.l}%`, width: `${seg.w}%` }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
