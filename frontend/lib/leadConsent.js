/**
 * leadConsent.js — Source unique du consentement RGPD des demandes de devis
 *
 * Le texte affiché à l'utilisateur, la liste des destinataires et le numéro de
 * version vivent ici. La modale l'affiche, l'API l'archive avec le lead, la
 * politique de confidentialité publie la liste. Une seule vérité, donc aucune
 * divergence possible entre ce qui est promis et ce qui est enregistré.
 *
 * ⚠️ Toute modification du texte impose d'incrémenter CONSENT_VERSION : c'est
 * elle qui permet, plus tard, de savoir sous quelle formulation chaque lead a
 * été recueilli (art. 7.1 RGPD — charge de la preuve du consentement).
 */

/** Version du texte de consentement en vigueur (date de mise en service). */
export const CONSENT_VERSION = '2026-08-25';

/**
 * Liste EXHAUSTIVE des destinataires des demandes de devis.
 * Doit être tenue à jour et rester accessible au moment de la collecte
 * (doctrine CNIL sur l'information des personnes en génération de leads).
 *
 * Chaque entrée : { name, role, country }
 * Liste vide = aucune donnée n'est transmise à ce jour.
 */
export const LEAD_PARTNERS = [];

/** Texte de la case à cocher — non précochée, obligatoire. */
export const CONSENT_TEXT =
  "J'accepte que mes coordonnées et les caractéristiques de mon projet soient " +
  "transmises à un professionnel partenaire (artisan ou plateforme de mise en " +
  "relation) afin qu'il établisse mon devis et me recontacte par téléphone ou " +
  "par email.";

/** Engagement de limitation d'usage, affiché sous le formulaire. */
export const CONSENT_GUARANTEE =
  "Votre numéro de téléphone n'est ni publié, ni diffusé, ni utilisé pour du " +
  "démarchage sans rapport avec votre demande : il est transmis au seul " +
  "professionnel chargé d'établir votre devis. Vous pouvez retirer votre accord " +
  "et demander la suppression de vos données à tout moment.";

/** Ancre publique de la liste des destinataires. */
export const PARTNERS_URL = '/politique-confidentialite#partenaires';
