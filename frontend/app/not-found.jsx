import Link from 'next/link';

/*
 * Note : Next.js App Router ignore `export const metadata` sur not-found.jsx.
 * Le titre/description de la 404 est défini dans app/layout.jsx (metadata globale).
 * Pour personnaliser les métadonnées 404, utiliser generateMetadata() dans un
 * not-found.jsx parent ou paramétrer le layout de la route concernée.
 */

/*
 * Page 404 globale — Next.js App Router.
 * Brand V6 : noir chaud + or + parchemin, logo + CTA Accueil / Simulateurs.
 */
export default function NotFound() {
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
      >
        <div style={{ maxWidth: 520, textAlign: 'center' }}>
          {/* Code 404 en gros */}
          <div
            style={{
              fontSize: 112,
              fontWeight: 800,
              color: '#C9971E',
              lineHeight: 1,
              marginBottom: 8,
              letterSpacing: '-6px',
              fontFamily: 'Manrope, Inter, sans-serif',
            }}
            aria-hidden="true"
          >
            404
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
            Page introuvable
          </h1>
          <p
            style={{
              color: '#6b5f4f',
              margin: '0 0 36px',
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Cette page n&apos;existe pas ou a été déplacée.
            Revenez à l&apos;accueil ou explorez nos simulateurs.
          </p>

          {/* CTA principal + secondaire */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#C9971E',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.02em',
                boxShadow: '0 1px 3px rgba(201, 151, 30, 0.25)',
              }}
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/calculateur"
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
              Voir les simulateurs
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
