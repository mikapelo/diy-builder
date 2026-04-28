'use client';
/**
 * ErrorBoundary.jsx — Filet de sécurité React pour les rendus 3D / WebGL
 *
 * Usage :
 *   <ErrorBoundary>
 *     <CabanonViewer structure={...} />
 *   </ErrorBoundary>
 *
 * Props :
 *   children  — composant(s) à protéger
 *   fallback  — (optionnel) JSX de remplacement ; sinon UI générique
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Erreur capturée :', error, info.componentStack);
    }
    // En production, envoyer à un service de monitoring (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="deck-preview">
          <div className="deck-viewer-skeleton" style={{ borderColor: '#f87171' }}>
            <span className="deck-viewer-skeleton-label" style={{ color: '#dc2626' }}>
              ⚠️ Erreur de rendu 3D
            </span>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              {this.state.error?.message ?? 'Une erreur inattendue est survenue.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                marginTop: '0.75rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
