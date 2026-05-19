/**
 * Figure — wrapper next/image + figcaption + ImageObject JSON-LD optionnel
 *
 * Usage typique dans une page éditoriale :
 *
 *   <Figure
 *     src="/images/guides/cabanon/structure.webp"
 *     alt="Vue 3D ossature cabanon avec montants 45×95 mm entraxe 60 cm"
 *     width={1200}
 *     height={675}
 *     caption="Structure 3D générée par le simulateur DIY Builder — module cabanon 3×2.5 m."
 *     source="Capture du simulateur DIY Builder, 2026-05-16"
 *   />
 *
 * Pour un SVG inline, NE PAS utiliser ce composant : continuer avec
 *   <figure className="content-figure">...<svg>...</svg>...<figcaption /></figure>
 * (les classes CSS sont déjà compatibles).
 *
 * Variantes :
 *   - default : largeur 100% de la colonne de prose (~66ch)
 *   - "fullbleed" : déborde la mesure, utile pour les captures larges
 *   - "narrow" : centrée, 480px max
 *
 * ImageObject JSON-LD : émis si `schemaCaption` fourni → éligible Google
 * Image Search rich result. Inclut creator, copyrightNotice, license et
 * acquireLicensePage (champs optionnels Google Image Search 2026, signal
 * E-E-A-T renforcé). Overridables via props pour images tierces.
 */
import Image from 'next/image';

const DEFAULT_CREATOR = {
  '@type': 'Organization',
  name: 'DIY Builder',
  url: 'https://www.diy-builder.fr',
};
const DEFAULT_LICENSE_PAGE = 'https://www.diy-builder.fr/mentions-legales';
const DEFAULT_ACQUIRE_PAGE = 'https://www.diy-builder.fr/contact';

export default function Figure({
  src,
  alt,
  width,
  height,
  caption,
  source,
  variant = 'default',
  priority = false,
  schemaCaption,
  creator,
  copyrightNotice,
  license,
  acquireLicensePage,
}) {
  if (!src || !alt) {
    throw new Error('<Figure> requires src + alt (a11y obligatoire)');
  }

  const className = [
    'content-figure',
    variant === 'fullbleed' && 'content-figure--fullbleed',
    variant === 'narrow' && 'content-figure--narrow',
  ].filter(Boolean).join(' ');

  const imageObjectJsonLd = schemaCaption ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `https://www.diy-builder.fr${src}`,
    description: schemaCaption,
    width,
    height,
    ...(source ? { creditText: source } : {}),
    creator: creator ?? DEFAULT_CREATOR,
    copyrightNotice: copyrightNotice ?? `© ${new Date().getFullYear()} DIY Builder`,
    license: license ?? DEFAULT_LICENSE_PAGE,
    acquireLicensePage: acquireLicensePage ?? DEFAULT_ACQUIRE_PAGE,
  } : null;

  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 720px"
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
      />
      {(caption || source) && (
        <figcaption className="content-figure-caption">
          {caption}
          {caption && source && ' '}
          {source && <span className="content-figure-source">— {source}</span>}
        </figcaption>
      )}
      {imageObjectJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectJsonLd) }}
        />
      )}
    </figure>
  );
}
