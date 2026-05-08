/**
 * /liste — Page BOM partageable et indexable (Server Component SSR)
 *
 * URL : /liste?project=terrasse&w=4&d=3
 *   project : terrasse | cabanon | pergola | cloture
 *   w       : largeur / longueur (m)
 *   d       : profondeur / hauteur (m)
 *
 * Rendu côté serveur → 100 % indexable par Google.
 * Injecte un schema.org ItemList pour les rich results.
 * Chaque ligne du BOM pointe vers /api/go avec le terme de recherche exact.
 */

import Link       from 'next/link';
import JsonLd     from '@/components/ui/JsonLd';
import CopyButton from './CopyButton';

import { callEngine } from '@/lib/listeBOM';
import { calculateDetailedCost, calculateTotalCost } from '@/lib/costCalculator';
import { STORES }           from '@/lib/materialPrices';
import { HOW_TO_SCHEMAS, PROJECT_LABELS, PROJECT_DEFAULTS } from '@/lib/seoSchemas';

export const dynamic = 'force-dynamic'; // searchParams dynamiques → SSR à chaque requête

/* ── Metadata dynamique ──────────────────────────────────────────── */
export async function generateMetadata({ searchParams }) {
  const project = searchParams?.project ?? 'terrasse';
  const w = parseFloat(searchParams?.w) || PROJECT_DEFAULTS[project]?.w || 4;
  const d = parseFloat(searchParams?.d) || PROJECT_DEFAULTS[project]?.d || 3;
  const label = PROJECT_LABELS[project]?.label ?? 'Projet bois';
  return {
    title: `Liste de matériaux — ${label} ${w}×${d} m | DIY Builder`,
    description: `Liste complète des matériaux pour construire un(e) ${label} de ${w}×${d} m. Quantités calculées, prix comparés Leroy Merlin, Castorama, Brico Dépôt.`,
    alternates: { canonical: `https://diy-builder.fr/liste?project=${project}&w=${w}&d=${d}` },
    robots: { index: true, follow: true },
  };
}

/* ── Helpers ─────────────────────────────────────────────────────── */
const fmtEur = (n) => n == null ? '—' : Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const fmtQty = (n, unit) => {
  if (unit === 'm lin.' || unit === 'm²' || unit === 'm³') return `${Number(n).toFixed(1)} ${unit}`;
  return `${Math.ceil(n)} ${unit}`;
};

const STORE_NAMES = { leroymerlin: 'Leroy Merlin', castorama: 'Castorama', bricodepot: 'Brico Dépôt', manomano: 'ManoMano' };

/* ── Page ────────────────────────────────────────────────────────── */
export default function ListePage({ searchParams }) {
  const project = searchParams?.project ?? 'terrasse';
  const defaults = PROJECT_DEFAULTS[project] ?? PROJECT_DEFAULTS.terrasse;
  const w = parseFloat(searchParams?.w) || defaults.w;
  const d = parseFloat(searchParams?.d) || defaults.d;

  const projectLabel = PROJECT_LABELS[project] ?? PROJECT_LABELS.terrasse;
  const howTo = HOW_TO_SCHEMAS[project];

  /* BOM complet par enseigne */
  let structure;
  try { structure = callEngine(project, w, d); }
  catch (err) { console.error('[/liste] callEngine error:', err); structure = null; }

  /* Lignes BOM (référence : LM pour labels + quantités) */
  const bomLines = structure ? calculateDetailedCost(structure, 'leroymerlin', project) : [];

  /* Totaux par enseigne */
  const storeTotals = STORES.map(store => {
    const lines = structure ? calculateDetailedCost(structure, store.id, project) : [];
    return { ...store, total: calculateTotalCost(lines) };
  }).sort((a, b) => a.total - b.total);

  /* ItemList schema.org */
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Matériaux — ${projectLabel.label} ${w}×${d} m`,
    description: `Liste de matériaux pour construire un(e) ${projectLabel.label} de ${w} m × ${d} m.`,
    url: `https://diy-builder.fr/liste?project=${project}&w=${w}&d=${d}`,
    numberOfItems: bomLines.length,
    itemListElement: bomLines.map((line, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${line.label} — ${fmtQty(line.quantity, line.unit)}`,
    })),
  };

  const simulatorUrl = project === 'terrasse' ? '/calculateur' : `/${project}`;

  return (
    <>
      {howTo && <JsonLd data={howTo} />}
      <JsonLd data={itemListSchema} />

      <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Manrope, Inter, sans-serif' }}>

        {/* ── Header ── */}
        <header style={{ background: '#1a1a2e', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href={simulatorUrl} style={{ color: '#C9971E', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            ← Retour au simulateur
          </Link>
          <span style={{ color: '#ffffff44', fontSize: 14 }}>|</span>
          <span style={{ fontSize: 14, color: '#ffffffbb' }}>DIY Builder</span>
        </header>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 64px' }}>

          {/* ── Titre ── */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' }}>
              {projectLabel.label} — {w} × {d} m
            </h1>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              {projectLabel.dim1}&nbsp;: {w} m · {projectLabel.dim2}&nbsp;: {d} m ·{' '}
              {bomLines.length} référence{bomLines.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* ── Récap prix par enseigne ── */}
          <section style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 24, boxShadow: '0 1px 4px #0001' }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 14px' }}>
              Estimation totale par enseigne
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {storeTotals.map((s, i) => (
                <div key={s.id} style={{
                  flex: '1 1 160px', border: i === 0 ? '2px solid #C9971E' : '1px solid #e5e5e5',
                  borderRadius: 10, padding: '12px 16px', position: 'relative', background: i === 0 ? '#fffbf0' : '#fff'
                }}>
                  {i === 0 && (
                    <span style={{ position: 'absolute', top: -10, left: 12, background: '#C9971E', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                      Meilleur prix
                    </span>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>{STORE_NAMES[s.id] ?? s.id}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>{fmtEur(s.total)}&nbsp;<span style={{ fontSize: 13, fontWeight: 400 }}>€</span></div>
                  <a
                    href={`/api/go?store=${s.id}&project=${project}`}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 600, color: '#C9971E', textDecoration: 'none' }}
                  >
                    Voir les produits →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* ── BOM détaillé ── */}
          <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                Liste de matériaux détaillée
              </h2>
            </div>

            {bomLines.length === 0 ? (
              <p style={{ padding: 24, color: '#999' }}>Aucun résultat. Vérifiez les dimensions dans l&apos;URL.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                {/* Caption sr-only WCAG SC 1.3.1 (audit a11y) */}
                <caption style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                  Liste de matériaux pour {projectLabel.label} {w}×{d} m avec quantités et prix par enseigne
                </caption>
                <thead>
                  <tr style={{ background: '#fafaf8' }}>
                    <th scope="col" style={{ padding: '10px 24px', textAlign: 'left', fontWeight: 600, color: '#555', fontSize: 12, borderBottom: '1px solid #f0f0f0' }}>Matériau</th>
                    <th scope="col" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#555', fontSize: 12, borderBottom: '1px solid #f0f0f0' }}>Qté</th>
                    <th scope="col" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#555', fontSize: 12, borderBottom: '1px solid #f0f0f0' }}>LM</th>
                    <th scope="col" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#555', fontSize: 12, borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>Casto</th>
                    <th scope="col" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#555', fontSize: 12, borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>B. Dépôt</th>
                    <th scope="col" style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: '#555', fontSize: 12, borderBottom: '1px solid #f0f0f0' }}>Acheter</th>
                  </tr>
                </thead>
                <tbody>
                  {bomLines.map((line, i) => {
                    /* Prix par enseigne pour cette ligne */
                    const prices = {};
                    STORES.forEach(store => {
                      const storeLines = structure
                        ? calculateDetailedCost(structure, store.id, project)
                        : [];
                      const match = storeLines.find(l => l.materialId === line.materialId && l.label === line.label);
                      prices[store.id] = match ? match.unitPrice * match.quantity : null;
                    });
                    const q = encodeURIComponent(line.label);

                    return (
                      <tr key={`${line.materialId}-${i}`} style={{ borderBottom: '1px solid #f7f7f5' }}>
                        <td style={{ padding: '12px 24px', color: '#1a1a2e', fontWeight: 500 }}>
                          {line.label}
                          {line.category && (
                            <span style={{ marginLeft: 8, fontSize: 11, color: '#aaa', fontWeight: 400 }}>{line.category}</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#555', whiteSpace: 'nowrap' }}>
                          {fmtQty(line.quantity, line.unit)}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#333', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {prices.leroymerlin != null ? `${fmtEur(prices.leroymerlin)} €` : '—'}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#333', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {prices.castorama != null ? `${fmtEur(prices.castorama)} €` : '—'}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'right', color: '#333', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {prices.bricodepot != null ? `${fmtEur(prices.bricodepot)} €` : '—'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {STORES.filter(s => s.id !== 'manomano').map(store => (
                              <a
                                key={store.id}
                                href={`/api/go?store=${store.id}&project=${project}&q=${q}`}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                title={`Chercher chez ${STORE_NAMES[store.id]}`}
                                aria-label={`Chercher ${line.label} chez ${STORE_NAMES[store.id]} (nouvel onglet)`}
                                style={{
                                  fontSize: 11, fontWeight: 700, padding: '3px 8px',
                                  borderRadius: 6, border: '1px solid #e0e0e0',
                                  color: '#555', textDecoration: 'none', background: '#fafaf8',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {store.id === 'leroymerlin' ? 'LM' : store.id === 'castorama' ? 'Casto' : 'BD'}
                              </a>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

          {/* ── Disclaimer + lien retour ── */}
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 20, lineHeight: 1.6 }}>
            Estimation indicative hors pose, livraison et options. Prix mis à jour le 07/05/2026.
            Les quantités intègrent les règles DTU. Vérifiez la disponibilité en magasin.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href={simulatorUrl}
              style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: '#C9971E', padding: '10px 20px', borderRadius: 8, textDecoration: 'none' }}
            >
              ← Modifier les dimensions
            </Link>
            <CopyButton />
          </div>
        </main>
      </div>
    </>
  );
}
