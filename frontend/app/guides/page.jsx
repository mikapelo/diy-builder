import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Guides bricolage bois — Terrasse, Cabanon, Pergola, Clôture | DIY Builder',
  description: 'Guides complets pour construire votre terrasse bois, cabanon ossature bois, pergola ou clôture. Calculs DTU, choix des matériaux, étapes pas à pas.',
};

export default function GuidesPage() {
  return (
    <ContentLayout>
      <div className="content-container">
        <nav className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Guides</span>
        </nav>

        <h1 className="content-h1">Guides de construction bois</h1>

        <p className="content-lead">
          Quatre guides pratiques pour mener à bien vos projets de bricolage. Calculs DTU, choix des matériaux et étapes
          de construction expliqués clairement, du premier coup de crayon à la finition.
        </p>

        <div className="content-guides-grid">
          <div className="content-guide-card">
            <div className="content-guide-card-icon">🪵</div>
            <h2 className="content-guide-card-title">Terrasse bois</h2>
            <p className="content-guide-card-desc">
              Choix des essences, calcul des lambourdes et plots béton, pose des lames. Tout pour construire une terrasse solide et durable.
            </p>
            <a href="/guides/terrasse" className="btn-secondary">Lire le guide →</a>
          </div>

          <div className="content-guide-card">
            <div className="content-guide-card-icon">🏠</div>
            <h2 className="content-guide-card-title">Cabanon ossature bois</h2>
            <p className="content-guide-card-desc">
              Conception de l'ossature (montants 60 cm DTU), bardage, toiture mono-pente. Du tracé au faîtage.
            </p>
            <a href="/guides/cabanon" className="btn-secondary">Lire le guide →</a>
          </div>

          <div className="content-guide-card">
            <div className="content-guide-card-icon">🌿</div>
            <h2 className="content-guide-card-title">Pergola bois</h2>
            <p className="content-guide-card-desc">
              Ancrage des poteaux, calcul des longerons et chevrons, sections recommandées selon la portée.
            </p>
            <a href="/guides/pergola" className="btn-secondary">Lire le guide →</a>
          </div>

          <div className="content-guide-card">
            <div className="content-guide-card-icon">🔲</div>
            <h2 className="content-guide-card-title">Clôture bois</h2>
            <p className="content-guide-card-desc">
              Espacement des poteaux, choix des lames et rails, traitements de durabilité pour une clôture qui tient dans le temps.
            </p>
            <a href="/guides/cloture" className="btn-secondary">Lire le guide →</a>
          </div>
        </div>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Simulateurs gratuits</p>
          <p className="content-cta-box-title">Passez au calcul</p>
          <p className="content-cta-box-desc">
            Simulez vos matériaux et obtenez un devis précis en quelques secondes.
          </p>
          <a href="/" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
