import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Gestion des cookies — DIY Builder',
  description: 'Politique de gestion des cookies du simulateur DIY Builder. Aucun cookie publicitaire ni analytique tiers.',
};

export default function Cookies() {
  return (
    <ContentLayout>
      <div className="content-container content-container--narrow">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Gestion des cookies</span>
        </nav>

        <h1 className="content-h1">Gestion des cookies</h1>
        <p className="content-lead">
          Dernière mise à jour : avril 2026. Cette page explique notre utilisation des cookies,
          conformément à la directive ePrivacy et aux recommandations de la CNIL.
        </p>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">{"Qu'est-ce qu'un cookie ?"}</h2>
          <p className="content-legal-p">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
            lors de la visite d&apos;un site web. Il permet au site de mémoriser des informations sur votre visite.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Notre politique : minimalisme</h2>
          <p className="content-legal-p">
            DIY Builder applique une politique de cookies strictement minimaliste.
            Nous ne déposons <strong>aucun cookie publicitaire</strong> ni <strong>aucun cookie analytique tiers</strong>
            {' '}(Google Analytics, Meta Pixel, etc.) sans votre consentement préalable explicite.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Liste des cookies utilisés</h2>
          <table className="content-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Durée</th>
                <th>Finalité</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><em>Aucun cookie tiers actuellement</em></td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
          <p className="content-legal-p">
            Le simulateur fonctionne entièrement sans cookies de suivi.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Cookies strictement nécessaires</h2>
          <p className="content-legal-p">
            Si le site utilise des cookies de session (ex : préférences de navigation, sécurité de formulaire),
            ceux-ci sont strictement nécessaires au fonctionnement du service et exemptés de consentement
            selon la directive ePrivacy. Ils ne collectent aucune donnée personnelle et ne permettent
            aucun suivi inter-sites.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Comment refuser ou supprimer les cookies</h2>
          <p className="content-legal-p">
            Vous pouvez à tout moment contrôler et supprimer les cookies via les paramètres de votre navigateur :
          </p>
          <ul>
            <li className="content-legal-p"><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
            <li className="content-legal-p"><strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
            <li className="content-legal-p"><strong>Safari :</strong> Préférences → Confidentialité → Gérer les données de sites</li>
            <li className="content-legal-p"><strong>Edge :</strong> Paramètres → Cookies et autorisations de sites</li>
          </ul>
          <p className="content-legal-p">
            Notez que la désactivation des cookies strictement nécessaires peut affecter le bon
            fonctionnement de certaines fonctionnalités du site.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Hébergeur et cookies tiers</h2>
          <p className="content-legal-p">
            Le site est hébergé par Vercel Inc. (États-Unis). Vercel peut déposer des cookies
            techniques liés à l&apos;infrastructure de déploiement. Ces cookies ne sont pas utilisés
            à des fins publicitaires. Consultez la{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              politique de confidentialité de Vercel
            </a>{' '}
            pour plus d&apos;informations.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Contact</h2>
          <p className="content-legal-p">
            Pour toute question relative à notre utilisation des cookies, contactez-nous à :{' '}
            <strong>[À COMPLÉTER — email]</strong>
          </p>
        </div>

        <hr className="content-divider" />
        <p className="content-body">
          Voir aussi : <a href="/mentions-legales">Mentions légales</a> · <a href="/politique-confidentialite">Politique de confidentialité</a> · <a href="/cgv">CGU</a>
        </p>
      </div>
    </ContentLayout>
  );
}
