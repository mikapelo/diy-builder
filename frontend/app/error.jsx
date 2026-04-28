'use client';

import Link from 'next/link';

/*
 * Page d'erreur globale — Next.js App Router.
 * Client component obligatoire (error boundary React).
 * Brand V6 : noir chaud + or + parchemin, logo + CTA Réessayer / Accueil.
 */
export default function Error({ error, reset }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F3F2EE',
        fontFamily: 'Manrope, Inter, sans-serif',
      }}
    >
      {/* Brand bar */}
      <header
        style={{
          padding: '20px 32px',
          borderBottom: '1px solid rgba(17, 18, 20, 0.06)',
          background: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
          aria-label="Retour à l'accueil DIY Builder"
        >
          <img
            src="/logo-diy-builder.png"
            alt=""
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#111214',
              letterSpacing: '-0.01em',
            }}
          >
            DIY Builder
          </span>
        </Link>
      </header>

      {/* Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
        role="alert"
        aria-live="assertive"
      >
        <div style={{ maxWidth: 520, textAlign: 'center' }}>
          {/* Picto erreur */}
          <div
            style={{
              width: 72,
              height: 72,
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'rgba(201, 151, 30, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9971E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Filet or */}
          <div
            style={{
              width: 56,
              height: 3,
              background: '#C9971E',
              margin: '0 auto 24px',
              borderRadius: 2,
            }}
            aria-hidden="true"
          />

          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#111214',
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Une erreur est survenue
          </h1>
          <p
            style={{
              color: '#6b5f4f',
              margin: '0 0 20px',
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir à l&apos;accueil.
          </p>

          {/* Message technique discret — dev uniquement (ne pas exposer en prod) */}
          {process.env.NODE_ENV === 'development' && error?.message && (
            <div
              style={{
                display: 'inline-block',
                maxWidth: '100%',
                padding: '10px 14px',
                marginBottom: 32,
                background: 'rgba(17, 18, 20, 0.04)',
                border: '1px solid rgba(17, 18, 20, 0.08)',
                borderRadius: 6,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                color: '#6b5f4f',
                textAlign: 'left',
                wordBreak: 'break-word',
              }}
            >
              {error.message}
            </div>
          )}

          {!error?.message && <div style={{ marginBottom: 36 }} />}

          {/* CTA principal + secondaire */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={reset}
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#C9971E',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'Manrope, Inter, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.02em',
                boxShadow: '0 1px 3px rgba(201, 151, 30, 0.25)',
              }}
            >
              Réessayer
            </button>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#111214',
                border: '1px solid #d0c8bc',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.02em',
              }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Liens utiles */}
          <nav
            aria-label="Liens utiles"
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: '1px solid rgba(17, 18, 20, 0.08)',
              display: 'flex',
              gap: 20,
              justifyContent: 'center',
              flexWrap: 'wrap',
              fontSize: 13,
            }}
          >
            <Link
              href="/calculateur"
              style={{ color: '#6b5f4f', textDecoration: 'none' }}
            >
              Simulateurs
            </Link>
            <Link
              href="/guides"
              style={{ color: '#6b5f4f', textDecoration: 'none' }}
            >
              Guides
            </Link>
            <Link
              href="/faq"
              style={{ color: '#6b5f4f', textDecoration: 'none' }}
            >
              FAQ
            </Link>
          </nav>
        </div>
      </main>

      {/* Pied signature */}
      <footer
        style={{
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: 11,
          color: '#918b82',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        DIY Builder — Simulateur gratuit de construction bois
      </footer>
    </div>
  );
}
