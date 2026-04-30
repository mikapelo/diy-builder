import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Politique de confidentialité — DIY Builder',
  description: 'Politique de confidentialité et traitement des données personnelles de DIY Builder, conforme au RGPD.',
};

export default function PolitiqueConfidentialite() {
  return (
    <ContentLayout>
      <div className="content-container content-container--narrow">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Politique de confidentialité</span>
        </nav>

        <h1 className="content-h1">Politique de confidentialité</h1>
        <p className="content-lead">
          Dernière mise à jour : avril 2026. Conforme au Règlement (UE) 2016/679 (RGPD).
        </p>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Responsable du traitement</h2>
          <p className="content-legal-p"><strong>Entité :</strong> DIY Builder</p>
          <p className="content-legal-p"><strong>Adresse :</strong> Carbon Blanc, 33560, France</p>
          <p className="content-legal-p"><strong>Contact DPO / RGPD :</strong> sans.mikael33000@gmail.com</p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Données collectées</h2>
          <table className="content-table">
            <thead>
              <tr>
                <th>Donnée</th>
                <th>Finalité</th>
                <th>Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Adresse email</td>
                <td>Envoi du dossier projet, mise en relation avec un artisan</td>
                <td>Consentement explicite</td>
              </tr>
              <tr>
                <td>Données de navigation anonymes</td>
                <td>Amélioration du service (pages visitées, type de projet simulé)</td>
                <td>Intérêt légitime / consentement selon outil</td>
              </tr>
            </tbody>
          </table>
          <p className="content-legal-p">
            Aucune donnée nominative n&apos;est collectée lors de la simple utilisation du simulateur.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Durée de conservation</h2>
          <p className="content-legal-p">
            Les données à caractère personnel collectées via les formulaires sont conservées pour une durée
            maximale de <strong>12 mois</strong> à compter de la collecte, puis supprimées ou anonymisées.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Destinataires des données</h2>
          <p className="content-legal-p">
            Les données ne sont pas vendues ni cédées à des tiers à des fins commerciales.
          </p>
          <p className="content-legal-p">
            Dans le cadre de la mise en relation avec un artisan partenaire, votre email et vos informations
            de projet peuvent être transmis à l&apos;artisan concerné, uniquement avec votre consentement préalable.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Transferts hors UE</h2>
          <p className="content-legal-p">
            Le site est hébergé par Vercel Inc. (États-Unis). Ce transfert est encadré par les
            clauses contractuelles types (CCT) adoptées par la Commission européenne, conformément
            à l&apos;article 46 du RGPD.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Vos droits RGPD</h2>
          <p className="content-legal-p">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            {[
              'Droit d\'accès à vos données personnelles',
              'Droit de rectification des données inexactes',
              'Droit à l\'effacement (« droit à l\'oubli »)',
              'Droit à la limitation du traitement',
              'Droit à la portabilité de vos données',
              'Droit d\'opposition au traitement',
            ].map((right) => (
              <li key={right} className="content-legal-p">{right}</li>
            ))}
          </ul>
          <p className="content-legal-p">
            Pour exercer ces droits, contactez-nous à : <strong>sans.mikael33000@gmail.com</strong>
          </p>
          <p className="content-legal-p">
            En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la
            CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Cookies</h2>
          <p className="content-legal-p">
            Ce site n&apos;utilise pas de cookies publicitaires ni analytiques tiers.
            Consultez notre <a href="/cookies">politique cookies</a> pour plus de détails.
          </p>
        </div>

        <hr className="content-divider" />
        <p className="content-body">
          Voir aussi : <a href="/mentions-legales">Mentions légales</a> · <a href="/cgv">CGU</a> · <a href="/cookies">Cookies</a>
        </p>
      </div>
    </ContentLayout>
  );
}
