import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: "Conditions générales d'utilisation — DIY Builder",
  description: "Conditions générales d'utilisation du simulateur de construction DIY Builder.",
};

export default function CGV() {
  return (
    <ContentLayout>
      <div className="content-container content-container--narrow">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">{"Conditions générales d'utilisation"}</span>
        </nav>

        <h1 className="content-h1">{"Conditions générales d'utilisation"}</h1>
        <p className="content-lead">
          Dernière mise à jour : avril 2026. Ces CGU régissent l'accès et l'utilisation du simulateur DIY Builder.
        </p>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 1 — Objet</h2>
          <p className="content-legal-p">
            Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités
            et conditions d'utilisation du simulateur de construction en ligne DIY Builder, accessible à l'adresse
            du site, ainsi que les droits et obligations des utilisateurs.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 2 — Accès au service</h2>
          <p className="content-legal-p">
            Le simulateur DIY Builder est accessible librement et gratuitement à tout utilisateur disposant
            d'un accès à Internet. Aucune inscription préalable n'est requise pour utiliser les fonctionnalités
            de simulation.
          </p>
          <p className="content-legal-p">
            DIY Builder se réserve le droit de modifier, suspendre ou interrompre l'accès au service à tout
            moment, sans préavis et sans engager sa responsabilité.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 3 — Nature des calculs</h2>
          <p className="content-legal-p">
            Les résultats fournis par le simulateur (quantités de matériaux, estimations budgétaires,
            visualisations 3D) sont fournis <strong>à titre purement indicatif</strong>.
          </p>
          <p className="content-legal-p">
            Ces calculs sont des estimations basées sur des hypothèses standardisées. Ils ne constituent pas :
          </p>
          <ul>
            <li className="content-legal-p">un devis contractuel engageant un fournisseur ou artisan</li>
            <li className="content-legal-p">un document technique certifié (DTU, bureau d'études)</li>
            <li className="content-legal-p">une garantie de conformité aux règles d'urbanisme locales</li>
          </ul>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 4 — Limitation de responsabilité</h2>
          <p className="content-legal-p">
            DIY Builder ne saurait être tenu responsable des décisions de construction, d'achat ou de travaux
            prises par l'utilisateur sur la base des simulations effectuées sur le site.
          </p>
          <p className="content-legal-p">
            L'utilisateur reconnaît que tout projet de construction ou d'aménagement doit faire l'objet
            d'une validation par un professionnel qualifié (architecte, maître d'œuvre, bureau d'études
            structure) avant tout engagement.
          </p>
          <p className="content-legal-p">
            DIY Builder décline toute responsabilité en cas de dommages directs, indirects, matériels ou
            immatériels résultant de l'utilisation du service.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 5 — Propriété intellectuelle</h2>
          <p className="content-legal-p">
            Le simulateur, ses algorithmes de calcul, son interface et ses contenus graphiques sont la
            propriété exclusive de DIY Builder et sont protégés par le droit de la propriété intellectuelle.
          </p>
          <p className="content-legal-p">
            L'utilisateur dispose d'un droit d'usage personnel et non commercial. Toute reproduction,
            extraction ou réutilisation des algorithmes ou contenus sans autorisation expresse est interdite.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 6 — Données personnelles</h2>
          <p className="content-legal-p">
            Le traitement des données personnelles collectées via le site est décrit dans notre{' '}
            <a href="/politique-confidentialite">politique de confidentialité</a>,
            conforme au RGPD.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 7 — Droit applicable et juridiction</h2>
          <p className="content-legal-p">
            Les présentes CGU sont soumises au droit français.
          </p>
          <p className="content-legal-p">
            En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut
            de résolution amiable, le tribunal compétent sera : <strong>[À COMPLÉTER — ex : Tribunal judiciaire de Paris]</strong>.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Article 8 — Modification des CGU</h2>
          <p className="content-legal-p">
            DIY Builder se réserve le droit de modifier les présentes CGU à tout moment.
            Les utilisateurs seront informés des modifications par la mise à jour de la date en haut de cette page.
            La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles CGU.
          </p>
        </div>

        <hr className="content-divider" />
        <p className="content-body">
          Voir aussi : <a href="/mentions-legales">Mentions légales</a> · <a href="/politique-confidentialite">Politique de confidentialité</a> · <a href="/cookies">Cookies</a>
        </p>
      </div>
    </ContentLayout>
  );
}
