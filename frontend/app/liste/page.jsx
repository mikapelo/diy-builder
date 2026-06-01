/**
 * /liste — Route héritée, redirige en 308 permanent vers le simulateur
 *
 * Historique : page BOM SSR partageable utilisée jusqu'au 30/05/2026.
 * Cause du retrait : 9 URLs flag "erreur de redirection" dans GSC
 * (validation 17/05 → échec 30/05) car la page combinait noindex +
 * canonical self + chaîne de redirection apex → www, signaux
 * contradictoires pour Google. La route n'avait plus de référence
 * interne dans le code (sitemap déjà retiré, 0 lien) et zéro trafic.
 *
 * Comportement actuel :
 *   /liste?project=terrasse&w=4&d=3 → 308 → /calculateur
 *   /liste?project=cabanon          → 308 → /cabanon
 *   /liste?project=pergola          → 308 → /pergola
 *   /liste?project=cloture          → 308 → /cloture
 *   /liste (sans project)           → 308 → /
 *
 * Les params w/d sont volontairement ignorés à la redirection : les
 * simulateurs lisent leurs valeurs par défaut depuis leur propre logique
 * (URL Sharing peut être ré-ajouté plus tard côté /[module] si besoin).
 *
 * Le code SSR BOM original est conservé dans lib/listeBOM.js et reste
 * réutilisable pour un futur endpoint dédié.
 */

import { permanentRedirect } from 'next/navigation';

const PROJECT_TO_ROUTE = {
  terrasse: '/calculateur',
  cabanon:  '/cabanon',
  pergola:  '/pergola',
  cloture:  '/cloture',
};

export default function ListePage({ searchParams }) {
  const project = searchParams?.project;
  const target = PROJECT_TO_ROUTE[project] ?? '/';
  permanentRedirect(target);
}
