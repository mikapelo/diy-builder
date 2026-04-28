'use client';

/**
 * ClotureSketch — Plan mode SVG technical drawing for fence (clôture)
 * Shows front elevation view: X axis = fence length, Y axis = height
 * Follows same conventions as CabanonSketch.jsx
 *
 * Break view: for fences > MAX_FULL_WIDTH, shows left end + // symbol + right end
 */

const MAX_FULL_WIDTH = 8;    // m — above this → break mode
const SHOW_EACH_END  = 2.5;  // m — portion shown on each side
const BREAK_SPACE    = 1.5;  // m — space reserved for // symbol

export default function ClotureSketch({ geometry }) {
  if (!geometry || !geometry.dimensions) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Geometry not available
      </div>
    );
  }

  const {
    width = 5.0,
    height = 1.8,
    postSection = 0.10,
    postSpacing = 1.2,
  } = geometry.dimensions;

  const posts = geometry.posts || [];
  const rails = geometry.rails || [];
  const boards = geometry.boards || [];

  // Color palette (matches cabanon)
  const colors = {
    bg: '#f7f9fb',
    primary: '#2d3a45',
    secondary: '#5a6d7e',
    postFill: '#C9971E',
    railFill: '#8B7355',
    boardFill: '#4A7FBF',
    dimensionLine: '#3a4a5a',
    dimensionText: '#1d2a35',
    labels: '#7a8d9e',
  };

  // Padding
  const PAD_L = 80;
  const PAD_R = 80;
  const PAD_T = 50;
  const PAD_B = 70;

  // Break mode logic
  const isBreakMode = width > MAX_FULL_WIDTH;
  const virtualWidth = isBreakMode ? SHOW_EACH_END * 2 + BREAK_SPACE : width;
  const rightOffset  = isBreakMode ? -(width - virtualWidth) : 0;

  const baseScale = 90; // px per meter — fixed in break mode
  const contentWidth = virtualWidth * baseScale;
  const scaledHeight = height * baseScale;
  const svgWidth  = contentWidth + PAD_L + PAD_R;
  const svgHeight = scaledHeight + PAD_T + PAD_B;

  // Origin for drawing (top-left of drawing area)
  const originX = PAD_L;
  const originY = PAD_T;

  // Helper: convert fence coords to SVG coords
  const toSvgX = (fenceX) => originX + fenceX * baseScale;
  const toSvgY = (fenceY) => originY + scaledHeight - fenceY * baseScale;

  // Ground line Y in SVG
  const groundY = toSvgY(0);

  // ── Break mode filtering ──

  // Posts
  const postsLeft  = isBreakMode ? posts.filter(p => p.x <= SHOW_EACH_END) : posts;
  const postsRight = isBreakMode
    ? posts.filter(p => p.x >= width - SHOW_EACH_END).map(p => ({ ...p, x: p.x + rightOffset }))
    : [];
  const displayPosts = [...postsLeft, ...postsRight];

  // Boards
  const boardsLeft  = isBreakMode ? boards.filter(b => b.x < SHOW_EACH_END) : boards;
  const boardsRight = isBreakMode
    ? boards.filter(b => b.x >= width - SHOW_EACH_END).map(b => ({ ...b, x: b.x + rightOffset }))
    : [];
  const displayBoards = [...boardsLeft, ...boardsRight];

  // Rails (clip and offset)
  const clipRailLeft  = r => ({ ...r, x2: Math.min(r.x2, SHOW_EACH_END) });
  const clipRailRight = r => ({ ...r, x1: Math.max(r.x1, width - SHOW_EACH_END) + rightOffset, x2: r.x2 + rightOffset });
  const displayRails = isBreakMode
    ? [
        ...rails.filter(r => r.x1 < SHOW_EACH_END).map(clipRailLeft),
        ...rails.filter(r => r.x2 > width - SHOW_EACH_END).map(clipRailRight),
      ]
    : rails;

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="bg-white border border-gray-300 rounded"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '100%', height: 'auto' }}
    >
      {/* Background */}
      <rect width={svgWidth} height={svgHeight} fill={colors.bg} />

      {/* Title */}
      <text
        x={svgWidth / 2}
        y={30}
        textAnchor="middle"
        fontSize="18"
        fontWeight="600"
        fill={colors.primary}
      >
        Clôture — Vue de face
      </text>

      {/* Ground line */}
      <line
        x1={originX}
        y1={groundY}
        x2={originX + contentWidth}
        y2={groundY}
        stroke={colors.primary}
        strokeWidth="2"
        strokeDasharray="4,4"
      />
      <text
        x={originX - 10}
        y={groundY + 15}
        fontSize="11"
        fill={colors.labels}
        textAnchor="end"
      >
        Sol
      </text>

      {/* ──── Posts (vertical rectangles) ──── */}
      {displayPosts.map((post, idx) => {
        const x1 = toSvgX(post.x - postSection / 2);
        const x2 = toSvgX(post.x + postSection / 2);
        const y1 = toSvgY(post.height);
        const y2 = groundY;

        return (
          <g key={`post-${idx}`}>
            <rect
              x={x1}
              y={y1}
              width={x2 - x1}
              height={y2 - y1}
              fill={colors.postFill}
              stroke={colors.primary}
              strokeWidth="1.5"
              opacity="0.8"
            />
          </g>
        );
      })}

      {/* ──── Rails (horizontal lines) ──── */}
      {displayRails.map((rail, idx) => {
        const x1 = toSvgX(rail.x1);
        const x2 = toSvgX(rail.x2);
        const y = toSvgY(rail.y);

        return (
          <line
            key={`rail-${idx}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke={colors.railFill}
            strokeWidth="3"
          />
        );
      })}

      {/* ──── Boards/Slats (thin vertical lines) ──── */}
      {displayBoards.map((board, idx) => {
        const x = toSvgX(board.x);
        const y1 = toSvgY(board.y + board.height);
        const y2 = toSvgY(board.y);

        return (
          <line
            key={`board-${idx}`}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke={colors.boardFill}
            strokeWidth="2"
            opacity="0.7"
          />
        );
      })}

      {/* ──── Break symbol // ──── */}
      {isBreakMode && (() => {
        const bx = originX + SHOW_EACH_END * baseScale + (BREAK_SPACE / 2) * baseScale;
        const yTop = originY;
        const yBot = originY + scaledHeight;
        const barGap = 5;
        const toothW = 6;
        return (
          <g key="break">
            {/* Barres obliques // */}
            <line x1={bx - barGap/2 - toothW} y1={yBot} x2={bx - barGap/2 + toothW} y2={yTop}
              stroke={colors.primary} strokeWidth="1.5" />
            <line x1={bx + barGap/2 - toothW} y1={yBot} x2={bx + barGap/2 + toothW} y2={yTop}
              stroke={colors.primary} strokeWidth="1.5" />
            {/* Encoches */}
            <line x1={bx - barGap/2 - toothW - 4} y1={yBot} x2={bx - barGap/2 + toothW + 4} y2={yBot}
              stroke={colors.primary} strokeWidth="0.8" />
            <line x1={bx + barGap/2 - toothW - 4} y1={yTop} x2={bx + barGap/2 + toothW + 4} y2={yTop}
              stroke={colors.primary} strokeWidth="0.8" />
            {/* Annotation longueur omise */}
            <text x={bx} y={yTop - 12} textAnchor="middle" fontSize="11" fontStyle="italic" fill={colors.labels}>
              {'\u2261'} {(width - 2 * SHOW_EACH_END).toFixed(2)} m
            </text>
          </g>
        );
      })()}

      {/* ──── Dimension: Total Length (below) ──── */}
      {width > 0 && (
        <g>
          {/* Dimension line */}
          <line
            x1={originX}
            y1={groundY + 50}
            x2={originX + contentWidth}
            y2={groundY + 50}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Left arrow */}
          <line
            x1={originX}
            y1={groundY + 45}
            x2={originX}
            y2={groundY + 55}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Right arrow */}
          <line
            x1={originX + contentWidth}
            y1={groundY + 45}
            x2={originX + contentWidth}
            y2={groundY + 55}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Text */}
          <text
            x={originX + contentWidth / 2}
            y={groundY + 68}
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill={colors.dimensionText}
          >
            {width.toFixed(2)} m{isBreakMode ? ' (total)' : ''}
          </text>
        </g>
      )}

      {/* ──── Dimension: Height (left side) ──── */}
      {height > 0 && (
        <g>
          {/* Dimension line */}
          <line
            x1={originX - 50}
            y1={toSvgY(height)}
            x2={originX - 50}
            y2={groundY}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Top arrow */}
          <line
            x1={originX - 55}
            y1={toSvgY(height)}
            x2={originX - 45}
            y2={toSvgY(height)}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Bottom arrow */}
          <line
            x1={originX - 55}
            y1={groundY}
            x2={originX - 45}
            y2={groundY}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Text (rotated) */}
          <text
            x={originX - 65}
            y={toSvgY(height / 2) + 4}
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill={colors.dimensionText}
            transform={`rotate(-90 ${originX - 65} ${toSvgY(height / 2)})`}
          >
            {height.toFixed(2)} m
          </text>
        </g>
      )}

      {/* ──── Dimension: Post Spacing (above first two posts) ──── */}
      {displayPosts.length >= 2 && (
        <g>
          {/* Dimension line */}
          <line
            x1={toSvgX(displayPosts[0].x)}
            y1={toSvgY(height) - 30}
            x2={toSvgX(displayPosts[1].x)}
            y2={toSvgY(height) - 30}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Left arrow */}
          <line
            x1={toSvgX(displayPosts[0].x)}
            y1={toSvgY(height) - 35}
            x2={toSvgX(displayPosts[0].x)}
            y2={toSvgY(height) - 25}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Right arrow */}
          <line
            x1={toSvgX(displayPosts[1].x)}
            y1={toSvgY(height) - 35}
            x2={toSvgX(displayPosts[1].x)}
            y2={toSvgY(height) - 25}
            stroke={colors.dimensionLine}
            strokeWidth="1"
          />
          {/* Text */}
          <text
            x={(toSvgX(displayPosts[0].x) + toSvgX(displayPosts[1].x)) / 2}
            y={toSvgY(height) - 12}
            textAnchor="middle"
            fontSize="11"
            fill={colors.dimensionText}
          >
            {postSpacing.toFixed(2)} m
          </text>
        </g>
      )}

      {/* ──── Labels ──── */}
      {displayPosts.length > 0 && (
        <text
          x={toSvgX(displayPosts[0].x)}
          y={groundY + 25}
          textAnchor="middle"
          fontSize="10"
          fill={colors.labels}
          fontStyle="italic"
        >
          poteau
        </text>
      )}

      {displayRails.some((r) => r.type === 'top') && (
        <text
          x={originX + contentWidth + 20}
          y={toSvgY(
            displayRails.find((r) => r.type === 'top')?.y || height * 0.8
          )}
          fontSize="10"
          fill={colors.labels}
          fontStyle="italic"
        >
          lisse haute
        </text>
      )}

      {displayRails.some((r) => r.type === 'bottom') && (
        <text
          x={originX + contentWidth + 20}
          y={toSvgY(
            displayRails.find((r) => r.type === 'bottom')?.y || height * 0.2
          )}
          fontSize="10"
          fill={colors.labels}
          fontStyle="italic"
        >
          lisse basse
        </text>
      )}

      {displayBoards.length > 0 && (
        <text
          x={toSvgX(displayBoards[0].x)}
          y={toSvgY(displayBoards[0].y + displayBoards[0].height / 2) - 20}
          textAnchor="middle"
          fontSize="10"
          fill={colors.labels}
          fontStyle="italic"
        >
          lame
        </text>
      )}

      {/* ──── Legend (bottom right) ──── */}
      <g>
        <text
          x={originX + contentWidth - 10}
          y={svgHeight - 45}
          textAnchor="end"
          fontSize="11"
          fontWeight="600"
          fill={colors.primary}
        >
          Légende
        </text>

        {/* Post legend */}
        <rect
          x={originX + contentWidth - 60}
          y={svgHeight - 40}
          width="8"
          height="12"
          fill={colors.postFill}
          stroke={colors.primary}
          strokeWidth="0.5"
        />
        <text
          x={originX + contentWidth - 50}
          y={svgHeight - 32}
          fontSize="9"
          fill={colors.primary}
        >
          Poteau
        </text>

        {/* Rail legend */}
        <line
          x1={originX + contentWidth - 60}
          y1={svgHeight - 20}
          x2={originX + contentWidth - 52}
          y2={svgHeight - 20}
          stroke={colors.railFill}
          strokeWidth="2"
        />
        <text
          x={originX + contentWidth - 50}
          y={svgHeight - 15}
          fontSize="9"
          fill={colors.primary}
        >
          Lisse
        </text>

        {/* Board legend */}
        <line
          x1={originX + contentWidth - 60}
          y1={svgHeight - 5}
          x2={originX + contentWidth - 60}
          y2={svgHeight + 5}
          stroke={colors.boardFill}
          strokeWidth="2"
        />
        <text
          x={originX + contentWidth - 50}
          y={svgHeight + 2}
          fontSize="9"
          fill={colors.primary}
        >
          Lame
        </text>
      </g>
    </svg>
  );
}
