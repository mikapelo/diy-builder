/**
 * /offline — Page de fallback hors-ligne (Service Worker)
 *
 * Affichée par le SW quand la navigation échoue sans réseau.
 * Pas de dépendance externe — fonctionne sans JS ni ressource réseau.
 */

'use client';

// Note: metadata cannot be exported from Client Components.
// Set metadata via layout.js or route segment config if needed.

export default function OfflinePage() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #F9F6F0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .card {
            background: #fff;
            border: 1px solid #e5e2d8;
            border-radius: 20px;
            padding: 48px 40px;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 4px 32px rgba(0,0,0,.06);
          }
          .icon {
            font-size: 64px;
            margin-bottom: 24px;
            display: block;
          }
          h1 {
            font-size: 22px;
            font-weight: 800;
            color: #111214;
            margin-bottom: 12px;
          }
          p {
            font-size: 15px;
            color: #6b5f4f;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          .tip {
            margin-top: 28px;
            padding: 14px 16px;
            background: #F0EBE1;
            border-radius: 10px;
            font-size: 13px;
            color: #7a6f65;
            line-height: 1.55;
            text-align: left;
          }
          .tip strong { color: #111214; }
          .btn {
            display: inline-block;
            margin-top: 28px;
            padding: 12px 28px;
            background: #111214;
            color: #fff;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            border: none;
          }
          .btn:hover { background: #2a2a2e; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <span className="icon">📶</span>
          <h1>Vous êtes hors ligne</h1>
          <p>La connexion est interrompue. Les calculateurs déjà visités restent accessibles depuis le cache.</p>
          <p>Vos dimensions et résultats restent affichés normalement.</p>

          <div className="tip">
            <strong>Conseil :</strong> les pages simulateur (terrasse, cabanon, pergola, clôture) sont mises en cache automatiquement lors de la première visite — elles fonctionnent sans réseau.
          </div>

          <button className="btn" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
