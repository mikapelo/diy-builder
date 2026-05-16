/**
 * app/api/og/route.js
 * ─────────────────────────────────────────────────────────────
 * Open Graph image generator — Edge Runtime, Next.js ImageResponse
 * Génère une image PNG 1200×630 à la demande via query params.
 *
 * Query params :
 *   ?title=...      Titre principal (DM Serif Display via system serif fallback)
 *   ?subtitle=...   Sous-titre court (Manrope via system sans-serif fallback)
 *   ?type=guide|simulateur|landing|garde-fou
 *   ?icon=terrasse|cabanon|pergola|cloture|dalle  (optionnel)
 *
 * Exemple :
 *   /api/og?title=Simulateur+cabanon&subtitle=DTU+31.2&type=simulateur&icon=cabanon
 * ─────────────────────────────────────────────────────────────
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Design tokens
const COLORS = {
  ink: '#111214',
  marine: '#1E3A52',
  mustard: '#C9971E',
  cream: '#FAF7F2',
  sand: '#F0EAE0',
  text: '#3D3226',
  muted: '#6B5F4F',
};

// Labels des types pour l'eyebrow
const TYPE_LABELS = {
  guide: 'GUIDE TECHNIQUE',
  simulateur: 'SIMULATEUR GRATUIT',
  landing: 'OUTIL GRATUIT',
  'garde-fou': 'MÉTHODOLOGIE',
};

// Icônes SVG inline simples par module (paths optimisés)
const ICONS = {
  terrasse: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="36" width="64" height="8" rx="2" fill={COLORS.mustard} opacity="0.9" />
      <rect x="8" y="50" width="64" height="8" rx="2" fill={COLORS.mustard} opacity="0.7" />
      <rect x="8" y="22" width="64" height="8" rx="2" fill={COLORS.mustard} opacity="0.5" />
      <rect x="18" y="58" width="6" height="14" rx="1" fill={COLORS.marine} opacity="0.8" />
      <rect x="56" y="58" width="6" height="14" rx="1" fill={COLORS.marine} opacity="0.8" />
    </svg>
  ),
  cabanon: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="12" y="38" width="56" height="32" rx="2" fill={COLORS.marine} opacity="0.85" />
      <polygon points="8,38 40,14 72,38" fill={COLORS.mustard} opacity="0.9" />
      <rect x="34" y="50" width="12" height="20" rx="1" fill={COLORS.cream} opacity="0.9" />
      <rect x="20" y="48" width="10" height="10" rx="1" fill={COLORS.cream} opacity="0.7" />
    </svg>
  ),
  pergola: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="10" y="22" width="60" height="6" rx="2" fill={COLORS.mustard} opacity="0.9" />
      <rect x="10" y="10" width="6" height="18" rx="1" fill={COLORS.marine} opacity="0.8" />
      <rect x="64" y="10" width="6" height="18" rx="1" fill={COLORS.marine} opacity="0.8" />
      <rect x="10" y="50" width="6" height="28" rx="1" fill={COLORS.marine} opacity="0.8" />
      <rect x="64" y="50" width="6" height="28" rx="1" fill={COLORS.marine} opacity="0.8" />
      {[20, 30, 40, 50, 60].map((x) => (
        <rect key={x} x={x} y="22" width="4" height="14" rx="1" fill={COLORS.mustard} opacity="0.6" />
      ))}
    </svg>
  ),
  cloture: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="28" width="64" height="5" rx="1" fill={COLORS.marine} opacity="0.8" />
      <rect x="8" y="46" width="64" height="5" rx="1" fill={COLORS.marine} opacity="0.8" />
      {[10, 22, 34, 46, 58].map((x) => (
        <rect key={x} x={x} y="20" width="8" height="40" rx="1" fill={COLORS.mustard} opacity="0.8" />
      ))}
    </svg>
  ),
  dalle: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="44" width="64" height="24" rx="2" fill={COLORS.marine} opacity="0.85" />
      <rect x="8" y="44" width="64" height="6" rx="2" fill={COLORS.mustard} opacity="0.7" />
      <line x1="28" y1="44" x2="28" y2="68" stroke={COLORS.cream} strokeWidth="2" opacity="0.4" />
      <line x1="52" y1="44" x2="52" y2="68" stroke={COLORS.cream} strokeWidth="2" opacity="0.4" />
      <line x1="8" y1="56" x2="72" y2="56" stroke={COLORS.cream} strokeWidth="2" opacity="0.4" />
      <rect x="20" y="20" width="40" height="24" rx="1" fill={COLORS.mustard} opacity="0.3" />
      <text x="40" y="37" textAnchor="middle" fill={COLORS.mustard} fontSize="14" fontWeight="bold">DTU</text>
    </svg>
  ),
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'DIY Builder';
  const subtitle = searchParams.get('subtitle') || 'Calculateur de projets bricolage bois';
  const type = searchParams.get('type') || 'landing';
  const icon = searchParams.get('icon') || null;

  const eyebrow = TYPE_LABELS[type] || 'DIY BUILDER';
  const iconEl = icon && ICONS[icon] ? ICONS[icon] : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: COLORS.cream,
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Bande décorative gauche fine */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '6px',
            height: '630px',
            backgroundColor: COLORS.mustard,
          }}
        />

        {/* Fond texture légère (coins) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '320px',
            height: '320px',
            borderRadius: '320px 0 0 0',
            backgroundColor: COLORS.sand,
            opacity: 0.6,
          }}
        />

        {/* Contenu principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 60px 48px 72px',
            flex: 1,
          }}
        >
          {/* Header : logo + eyebrow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: COLORS.mustard,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: COLORS.cream,
                    borderRadius: '2px',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: COLORS.ink,
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                DIY Builder
              </span>
            </div>

            {/* Eyebrow type */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: '700',
                color: COLORS.mustard,
                fontFamily: '"Courier New", Courier, monospace',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </div>
          </div>

          {/* Zone centrale : titre + sous-titre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
            <div
              style={{
                fontSize: title.length > 50 ? '52px' : '62px',
                fontWeight: '400',
                color: COLORS.marine,
                lineHeight: '1.15',
                fontFamily: 'Georgia, "Times New Roman", serif',
                maxWidth: iconEl ? '820px' : '980px',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: '400',
                color: COLORS.muted,
                lineHeight: '1.4',
                fontFamily: 'Arial, Helvetica, sans-serif',
                maxWidth: iconEl ? '780px' : '940px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: COLORS.mustard,
                fontFamily: '"Courier New", Courier, monospace',
                letterSpacing: '0.04em',
                fontWeight: '600',
              }}
            >
              diy-builder.fr
            </span>
            {/* Petite ligne décorative */}
            <div
              style={{
                width: '80px',
                height: '3px',
                backgroundColor: COLORS.mustard,
                opacity: 0.5,
                borderRadius: '2px',
              }}
            />
          </div>
        </div>

        {/* Colonne droite : icône */}
        {iconEl && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '260px',
              paddingRight: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '160px',
                height: '160px',
                backgroundColor: COLORS.sand,
                borderRadius: '24px',
                border: `3px solid ${COLORS.mustard}`,
                opacity: 0.9,
              }}
            >
              {iconEl}
            </div>
          </div>
        )}

        {/* Barre verticale droite mustard */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '8px',
            height: '630px',
            backgroundColor: COLORS.mustard,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
