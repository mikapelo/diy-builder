'use client';
import { useState, useEffect } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function loadMetaPixel(id) {
  if (typeof window === 'undefined' || window.fbq || !id) return;
  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', id);
  window.fbq('track', 'PageView');
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!PIXEL_ID) return;
    const consent = localStorage.getItem('dib_cookie_consent');
    if (!consent) {
      // Délai court pour ne pas gêner le chargement
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
    if (consent === 'accepted') loadMetaPixel(PIXEL_ID);
  }, []);

  function accept() {
    localStorage.setItem('dib_cookie_consent', 'accepted');
    setVisible(false);
    loadMetaPixel(PIXEL_ID);
  }

  function refuse() {
    localStorage.setItem('dib_cookie_consent', 'refused');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 32px))',
        background: '#1A1C1F',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <p style={{
        flex: 1,
        margin: 0,
        fontSize: '13px',
        lineHeight: '1.5',
        color: 'rgba(255,255,255,0.65)',
      }}>
        Nous utilisons des cookies Meta pour mesurer l'audience et améliorer nos publicités.{' '}
        <a
          href="/confidentialite"
          style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}
        >
          En savoir plus
        </a>
      </p>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={refuse}
          style={{
            padding: '7px 14px',
            borderRadius: '7px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Refuser
        </button>
        <button
          onClick={accept}
          style={{
            padding: '7px 14px',
            borderRadius: '7px',
            border: 'none',
            background: '#C9971E',
            color: '#111214',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
