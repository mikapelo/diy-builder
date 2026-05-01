'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const HEADER_PROJECTS = [
  { id: 'terrasse', label: 'Terrasse bois',  href: '/calculateur' },
  { id: 'cabanon',  label: 'Cabanon bois',   href: '/cabanon'     },
  { id: 'pergola',  label: 'Pergola bois',   href: '/pergola'     },
  { id: 'cloture',  label: 'Clôture bois',   href: '/cloture'     },
];

export default function Header({ view, resultat, copied, onRetour, onCopierLien, onCalculer }) {
  const router = useRouter();
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* Fermer le menu au clic extérieur */
  useEffect(() => {
    if (!projectMenuOpen) return;
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProjectMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [projectMenuOpen]);

  /* Scroll vers une section — désactive scroll-snap, positionne, active le panneau,
     puis réactive snap. On force aussi panel-active car l'IntersectionObserver
     n'a pas le temps de tirer avant le re-snap */
  function scrollTo(sectionId) {
    function doScroll() {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const html = document.documentElement;
      const y = el.getBoundingClientRect().top + window.scrollY;
      // Pré-activer le panneau cible pour qu'il soit visible
      el.classList.add('panel-active', 'v6-in-view');
      // Désactiver snap, scroller, réactiver après délai
      html.style.scrollSnapType = 'none';
      window.scrollTo({ top: y, behavior: 'instant' });
      // Délai suffisant pour que le navigateur "accepte" la position avant le re-snap
      setTimeout(() => { html.style.scrollSnapType = 'y mandatory'; }, 100);
    }
    if (view !== 'home') {
      onRetour();
      setTimeout(doScroll, 150);
    } else {
      doScroll();
    }
  }

  return (
    <header className="sticky top-0 z-50 glass" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.02), 0 2px 8px rgba(0,0,0,.03)' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">

        {/* Logo — premium, lien accueil */}
        <button
          onClick={() => { if (view === 'home') window.scrollTo({ top: 0, behavior: 'smooth' }); else onRetour(); }}
          className="flex items-center gap-3 group transition-opacity duration-200 hover:opacity-80 flex-shrink-0"
        >
          <img
            src="/logo-diy-builder.png"
            alt="DIY Builder"
            className="v6-header-logo-img"
            style={{ objectFit: 'contain', height: '62px', width: '62px' }}
          />
          <div className="leading-none">
            <span className="v6-header-logo-text">DIY Builder</span>
          </div>
        </button>

        {/* Nav centre — home : sections scroll + guides/FAQ */}
        {view === 'home' && (
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {[
              { label: 'Projets',           sectionId: 'v6-hero' },
              { label: 'Comment ça marche', sectionId: 'v6-bento' },
              { label: 'Technique',         sectionId: 'v6-stats' },
            ].map(({ label, sectionId }) => (
              <button
                key={sectionId}
                onClick={() => scrollTo(sectionId)}
                className="v6-header-nav-link"
              >
                {label}
              </button>
            ))}
            <Link href="/guides" className="v6-header-nav-link">Guides</Link>
            <Link href="/faq" className="v6-header-nav-link">FAQ</Link>
          </nav>
        )}
        {/* Nav centre — pages contenu : guides + FAQ uniquement */}
        {view === 'content' && (
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link href="/guides" className="v6-header-nav-link">Guides</Link>
            <Link href="/faq" className="v6-header-nav-link">FAQ</Link>
          </nav>
        )}
        {/* Nav centre — pages module : guides/FAQ discrets */}
        {view === 'module' && (
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link href="/guides" className="v6-header-nav-link" style={{ fontSize: 13, opacity: 0.75 }}>Guides</Link>
            <Link href="/faq" className="v6-header-nav-link" style={{ fontSize: 13, opacity: 0.75 }}>FAQ</Link>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {view === 'calculator' && (
            <button onClick={onRetour} className="btn-secondary text-xs px-4 py-2">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Accueil
            </button>
          )}
          {resultat && (
            <button onClick={onCopierLien} className="btn-secondary text-xs px-4 py-2">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>link</span>
              {copied ? 'Copié !' : 'Partager'}
            </button>
          )}
          {view !== 'module' && (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProjectMenuOpen(v => !v)}
                className="v6-header-cta"
                aria-expanded={projectMenuOpen}
                aria-haspopup="true"
              >
                Commencer
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'transform var(--transition-fast)', transform: projectMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {projectMenuOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    minWidth: '210px',
                    background: '#16181A',
                    border: '1px solid rgba(201,151,30,.28)',
                    borderRadius: '14px',
                    boxShadow: '0 4px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset',
                    padding: '7px',
                    zIndex: 'var(--z-dropdown)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    animation: 'hdrMenuIn .15s ease both',
                  }}
                >
                  {/* Triangle pointer */}
                  <span style={{
                    position: 'absolute', top: '-6px', right: '18px',
                    width: 12, height: 6, overflow: 'hidden',
                    pointerEvents: 'none',
                  }}>
                    <span style={{
                      display: 'block', width: 10, height: 10,
                      background: '#16181A',
                      border: '1px solid rgba(201,151,30,.28)',
                      borderRadius: '2px',
                      transform: 'rotate(45deg)',
                      transformOrigin: 'center',
                      margin: '2px auto 0',
                    }} />
                  </span>
                  {HEADER_PROJECTS.map((p, i) => (
                    <button
                      key={p.id}
                      role="menuitem"
                      onClick={() => { setProjectMenuOpen(false); router.push(p.href); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,.88)',
                        textAlign: 'left',
                        transition: 'background .12s ease, color .12s ease',
                        width: '100%',
                        letterSpacing: '.01em',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,151,30,.12)'; e.currentTarget.style.color = '#E0B84A'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.88)'; }}
                    >
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#C9971E',
                        color: '#1C1B18',
                        fontSize: '10px',
                        fontWeight: '800',
                        flexShrink: 0,
                        letterSpacing: '.02em',
                      }}>0{i + 1}</span>
                      {p.label}
                    </button>
                  ))}
                  <style>{`@keyframes hdrMenuIn { from { opacity:0; transform:translateY(-6px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
                </div>
              )}
            </div>
          )}
          {view === 'module' && (
            <button onClick={onRetour} className="hidden sm:inline-flex btn-secondary text-xs px-4 py-2">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>home</span>
              Accueil
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
