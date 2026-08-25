import ContentLayout from '@/components/layout/ContentLayout';
import { LEAD_PARTNERS, CONSENT_VERSION } from '@/lib/leadConsent';

export const metadata = {
  title: 'Politique de confidentialité — DIY Builder',
  description: 'Politique de confidentialité et traitement des données personnelles de DIY Builder, conforme au RGPD.',
  alternates: { canonical: 'https://www.diy-builder.fr/politique-confidentialite' },
  robots: { index: false, follow: true },
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
          Dernière mise à jour : août 2026. Conforme au Règlement (UE) 2016/679 (RGPD).
        </p>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Responsable du traitement</h2>
          <p className="content-legal-p"><strong>Entité :</strong> DIY Builder</p>
          <p className="content-legal-p"><strong>Adresse :</strong> Carbon Blanc, 33560, France</p>
          <p className="content-legal-p"><strong>Contact DPO / RGPD :</strong> contact@diy-builder.fr</p>
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
                <td>Envoi du devis PDF demandé et de la confirmation de votre demande</td>
                <td>Consentement explicite</td>
              </tr>
              <tr>
                <td>Nom, téléphone, code postal</td>
                <td>
                  Demande de devis : transmission au professionnel partenaire chargé
                  de vous établir un devis et de vous recontacter
                </td>
                <td>Consentement explicite</td>
              </tr>
              <tr>
                <td>Caractéristiques du projet (type, dimensions, précisions libres)</td>
                <td>Qualification de la demande, chiffrage des matériaux</td>
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

        <div className="content-legal-section" id="partenaires">
          <h2 className="content-legal-h2">Destinataires des données</h2>
          <p className="content-legal-p">
            DIY Builder ne réalise pas les travaux. Lorsque vous remplissez le formulaire
            <strong> « Demander un devis gratuit »</strong>, votre demande n&apos;a de sens que
            transmise à un professionnel : c&apos;est l&apos;objet même du consentement que vous
            donnez en cochant la case, au moment de la collecte.
          </p>
          <p className="content-legal-p">
            <strong>Périmètre de cette transmission.</strong> Vos coordonnées — votre numéro de
            téléphone en particulier — ne sont ni publiées, ni diffusées, ni versées à un fichier
            de prospection. Elles sont communiquées au seul professionnel partenaire chargé
            d&apos;établir votre devis, pour cet usage et pour lui seul. Aucune autre demande de
            devis, aucun autre secteur, aucun démarchage sans rapport avec votre projet.
          </p>
          <p className="content-legal-p">
            Vous pouvez retirer votre consentement, demander la liste des destinataires effectifs
            de votre demande ou la suppression de vos données à tout moment, à
            <strong> contact@diy-builder.fr</strong>.
          </p>

        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Liste des partenaires destinataires</h2>
          <p className="content-legal-p">
            Cette liste est exhaustive et tenue à jour. Elle fait foi à la date indiquée.
          </p>
          {LEAD_PARTNERS.length === 0 ? (
            <p className="content-legal-p">
              <strong>À ce jour, aucun partenaire n&apos;est destinataire.</strong> Aucune demande
              de devis n&apos;a été transmise à un tiers. Toute mise en service d&apos;un partenaire
              sera publiée ici, avec sa raison sociale, avant toute transmission.
            </p>
          ) : (
            <ul>
              {LEAD_PARTNERS.map((p) => (
                <li key={p.name} className="content-legal-p">
                  <strong>{p.name}</strong> — {p.role} ({p.country})
                </li>
              ))}
            </ul>
          )}
          <p className="content-legal-p">
            Version du texte de consentement en vigueur : <strong>{CONSENT_VERSION}</strong>.
          </p>
        </div>

        <div className="content-legal-section">
          <h2 className="content-legal-h2">Sous-traitants techniques</h2>
          <p className="content-legal-p">
            Ces prestataires traitent les données pour notre compte, sur instruction, et n&apos;en
            disposent pas pour leur propre usage : <strong>Vercel Inc.</strong> (hébergement et
            base Redis de conservation des demandes) et <strong>Resend</strong> (envoi des emails).
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
            Pour exercer ces droits, contactez-nous à : <strong>contact@diy-builder.fr</strong>
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
