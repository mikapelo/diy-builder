/**
 * /offline — Page de fallback hors-ligne (Service Worker)
 *
 * Affichée par le SW quand la navigation échoue sans réseau.
 * Pas de dépendance externe — fonctionne sans JS ni ressource réseau.
 *
 * NB : ce composant est rendu sous le RootLayout, donc on n'inclut PAS
 * <html>/<head>/<body> ici (sinon doublons DOM imbriqués).
 */

'use client';

const STYLES = `
  .offline-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #F9F6F0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .offline-page * { box-sizing: border-box; }
  .offline-card {
    background: #fff;
    border: 1px solid #e5e2d8;
    border-radius: 20px;
    padding: 48px 40px;
    max-width: 440px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 32px rgba(0,0,0,.06);
  }
  .offline-icon {
    font-size: 64px;
    margin-bottom: 24px;
    display: block;
  }
  .offline-title {
    font-size: 22px;
    font-weight: 800;
    color: #111214;
    margin: 0 0 12px;
  }
  .offline-text {
    font-size: 15px;
    color: #6b5f4f;
    line-height: 1.6;
    margin: 0 0 8px;
  }
  .offline-tip {
    margin-top: 28px;
    padding: 14px 16px;
    background: #F0EBE1;
    border-radius: 10px;
    font-size: 13px;
    color: #7a6f65;
    line-height: 1.55;
    text-align: left;
  }
  .offline-tip strong { color: #111214; }
  .offline-btn {
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
  .offline-btn:hover { background: #2a2a2e; }
`;

export default function OfflinePage() {
  return (
    <div className="offline-page">
      <style>{STYLES}</style>
      <div className="offline-card">
        <span className="offline-icon" aria-hidden="true">📶</span>
        <h1 className="offline-title">Vous êtes hors ligne</h1>
        <p className="offline-text">
          La connexion est interrompue. Les calculateurs déjà visités restent accessibles depuis le cache.
        </p>
        <p className="offline-text">
          Vos dimensions et résultats restent affichés normalement.
        </p>

        <div className="offline-tip">
          <strong>Conseil :</strong> les pages simulateur (terrasse, cabanon, pergola, clôture) sont mises en cache automatiquement lors de la première visite — elles fonctionnent sans réseau.
        </div>

        <button className="offline-btn" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    </div>
  );
}
