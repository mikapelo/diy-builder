/**
 * PullQuote.jsx — Exergue éditorial : met en avant un chiffre ou une règle clé
 * déjà présent dans l'article, en gros serif, pour casser le mur de texte.
 *
 * Style : classe .content-pullquote (simulator.css), filet vert, sans fond
 * (poids visuel plus léger que les encadrés Callout).
 * Usage : <PullQuote>380 Wc par module, produits sur les deux faces.</PullQuote>
 * Mettre en valeur le chiffre avec <strong> (rendu en vert, même graisse).
 */

export default function PullQuote({ children }) {
  return <p className="content-pullquote">{children}</p>;
}
