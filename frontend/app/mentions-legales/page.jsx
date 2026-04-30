import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Mentions légales — DIY Builder',
  description: 'Mentions légales du simulateur de construction DIY Builder : éditeur, hébergeur, propriété intellectuelle.',
};

export default function MentionsLegales() {
  return (
    <ContentLayout>
      <div className="content-container content-container--narrow">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Mentions légales</span>
        </nav>

        <h1 className="content-h1">Mentions légales</h1>
        <p className="content-lead">
          Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique.
        </p>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Éditeur du site</h2>
          <p className="content-legal-p"><strong>Raison sociale :</strong> DIY Builder</p>
          <p className="content-legal-p"><strong>Forme juridique :</strong> EIRL (Entreprise Individuelle à Responsabilité Limitée)</p>
          <p className="content-legal-p"><strong>Adresse :</strong> Carbon Blanc, 33560, France</p>
          <p className="content-legal-p"><strong>SIRET :</strong> 849 354 006 00025</p>
          <p className="content-legal-p"><strong>Email de contact :</strong> sans.mikael33000@gmail.com</p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Directeur de la publication</h2>
          <p className="content-legal-p">Mikael Sans — en qualité de fondateur</p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Partenariats et affiliation</h2>
          <p className="content-legal-p">
            Ce site participe au Programme Partenaires d&apos;Amazon EU, un programme d&apos;affiliation
            conçu pour permettre à des sites de percevoir une rémunération grâce à la création de liens
            vers Amazon.fr. En tant que Partenaire d&apos;Amazon, DIY Builder réalise un bénéfice sur les
            achats remplissant les conditions requises.
          </p>
          <p className="content-legal-p">
            Ce site peut également contenir des liens affiliés vers d&apos;autres enseignes partenaires
            (Leroy Merlin, Castorama, ManoMano). Ces liens sont signalés et n&apos;influencent pas
            l&apos;objectivité des comparaisons présentées.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Hébergement</h2>
          <p className="content-legal-p"><strong>Hébergeur :</strong> Vercel Inc.</p>
          <p className="content-legal-p"><strong>Adresse :</strong> 340 Pine Street, Suite 1200, San Francisco, CA 94104, États-Unis</p>
          <p className="content-legal-p"><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Propriété intellectuelle</h2>
          <p className="content-legal-p">
            L&apos;ensemble des contenus présents sur ce site (textes, simulateurs, visualisations 3D, code, graphismes)
            est la propriété exclusive de DIY Builder, sauf mention contraire.
          </p>
          <p className="content-legal-p">
            Toute reproduction, représentation, modification, publication ou transmission de tout ou partie des contenus,
            par quelque moyen que ce soit, est interdite sans autorisation préalable et écrite de DIY Builder.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Limitation de responsabilité</h2>
          <p className="content-legal-p">
            Les calculs fournis par le simulateur DIY Builder sont des estimations à titre indicatif uniquement.
            Ils ne constituent pas un devis contractuel ni un document technique certifié.
          </p>
          <p className="content-legal-p">
            DIY Builder décline toute responsabilité quant aux décisions de construction prises sur la base
            de ces simulations. Pour tout projet structurel, il est fortement recommandé de consulter
            un professionnel qualifié (architecte, bureau d&apos;études, artisan certifié).
          </p>
          <p className="content-legal-p">
            DIY Builder ne saurait être tenu responsable des dommages directs ou indirects résultant
            de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le service.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Liens hypertextes</h2>
          <p className="content-legal-p">
            Le site peut contenir des liens vers des sites tiers. DIY Builder n&apos;exerce aucun contrôle
            sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Droit applicable</h2>
          <p className="content-legal-p">
            Les présentes mentions légales sont soumises au droit français.
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </div>

        <hr className="content-divider" />
        <p className="content-body">
          Voir aussi : <a href="/politique-confidentialite">Politique de confidentialité</a> · <a href="/cgv">CGU</a> · <a href="/cookies">Cookies</a>
        </p>
      </div>
    </ContentLayout>
  );
}
