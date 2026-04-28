'use client';
/**
 * dalle/page.jsx — Tutoriel illustré : Couler une dalle béton extérieure
 *
 * Page autonome (pas de DeckSimulator).
 * Contient :
 *   - 6 étapes illustrées (SVG inline)
 *   - Calculateur de matériaux (surface × épaisseur → béton, forme, treillis)
 *
 * Source : NF DTU 13.3 P1-1 (décembre 2021)
 */

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ── Constantes DTU 13.3 (inline pour éviter l'import engine) ──────────
const EPAISSEUR = { pietonne: 0.10, vehicule: 0.12, pl: 0.20 };
const SAC_VOLUME = 0.017;       // m³ par sac 35 kg
const TOUPIE_SEUIL = 3;         // m³ → bascule vers camion toupie
const FORME_EP = 0.10;          // épaisseur forme drainante (m)
const TREILLIS_MAJORATION = 1.15; // 15 % de recouvrement
const TREILLIS_PANNEAU = 3.24;  // m² par panneau ST25 standard (1.8×1.8m)
const PRIX_SAC = 7.5;           // € / sac 35 kg (Castorama ref)
const PRIX_TOUPIE = 130;        // € / m³ béton prêt-à-l'emploi livré
const PRIX_TREILLIS = 18;       // € / m² treillis ST25

// ── Étapes du tutoriel ─────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: 'Terrassement & délimitation',
    desc: 'Piquetez le périmètre, puis décaissez sur 20 cm minimum (10 cm forme + 10 cm dalle). Compactez le fond à la dame ou à la plaque vibrante. Vérifiez la planéité avec un niveau laser.',
    note: 'DTU 13.3 §7.1 — Sol support compacté à 95 % Proctor.',
    svg: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Ciel / surface */}
        <rect x="0" y="0" width="300" height="60" fill="#e8e4dc"/>
        {/* Sol naturel */}
        <rect x="0" y="60" width="300" height="100" fill="#c4b89a"/>
        {/* Excavation */}
        <rect x="40" y="60" width="220" height="80" fill="#ede9e1"/>
        {/* Hachures fond compacté */}
        {[0,1,2,3,4,5].map(i => (
          <line key={i} x1={45 + i*35} y1="140" x2={30 + i*35} y2="125" stroke="#b8a882" strokeWidth="1"/>
        ))}
        {/* Piquets */}
        <line x1="40" y1="40" x2="40" y2="65" stroke="#8b5e3c" strokeWidth="2.5"/>
        <line x1="260" y1="40" x2="260" y2="65" stroke="#8b5e3c" strokeWidth="2.5"/>
        <polygon points="36,40 44,40 40,33" fill="#8b5e3c"/>
        <polygon points="256,40 264,40 260,33" fill="#8b5e3c"/>
        {/* Ligne niveau */}
        <line x1="40" y1="60" x2="260" y2="60" stroke="#c9971e" strokeWidth="1.5" strokeDasharray="6 3"/>
        {/* Cote profondeur */}
        <line x1="270" y1="60" x2="270" y2="140" stroke="#666" strokeWidth="1"/>
        <line x1="265" y1="60" x2="275" y2="60" stroke="#666" strokeWidth="1"/>
        <line x1="265" y1="140" x2="275" y2="140" stroke="#666" strokeWidth="1"/>
        <text x="282" y="104" fontSize="10" fill="#444" fontFamily="Inter,sans-serif">20 cm</text>
        {/* Label */}
        <text x="150" y="108" fontSize="11" fill="#5a4f3f" fontFamily="Inter,sans-serif" textAnchor="middle">Sol compacté</text>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Forme drainante',
    desc: 'Répandez 10 cm de gravier concassé 0/31.5 ou de tout-venant propre sur toute la surface. Réglez à la règle et compactez. Cette couche répartit les charges et draine les eaux de remontée capillaire.',
    note: 'DTU 13.3 §7.3 — Épaisseur minimale 10 cm, granulats lavés.',
    svg: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Sol support */}
        <rect x="40" y="120" width="220" height="40" fill="#c4b89a"/>
        {/* Coffrage */}
        <rect x="35" y="60" width="8" height="65" fill="#b8956a"/>
        <rect x="257" y="60" width="8" height="65" fill="#b8956a"/>
        {/* Forme drainante */}
        <rect x="43" y="90" width="214" height="30" fill="#d4c4a0"/>
        {/* Cailloux dessinés */}
        {[
          [60,100],[80,95],[100,102],[120,97],[140,100],[160,95],[180,102],[200,97],[220,100],[240,95],
          [70,108],[90,105],[110,110],[130,105],[150,108],[170,105],[190,110],[210,105],[230,108],
        ].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="7" ry="4" fill="#c8b88a" stroke="#b0a07a" strokeWidth="0.5"/>
        ))}
        {/* Cote épaisseur forme */}
        <line x1="12" y1="90" x2="12" y2="120" stroke="#666" strokeWidth="1"/>
        <line x1="7" y1="90" x2="17" y2="90" stroke="#666" strokeWidth="1"/>
        <line x1="7" y1="120" x2="17" y2="120" stroke="#666" strokeWidth="1"/>
        <text x="0" y="109" fontSize="9" fill="#444" fontFamily="Inter,sans-serif">10 cm</text>
        {/* Label */}
        <text x="150" y="82" fontSize="10" fill="#7a6a50" fontFamily="Inter,sans-serif" textAnchor="middle">Gravier 0/31.5</text>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Coffrage périphérique',
    desc: 'Installez des planches de coffrage bois (épaisseur 25-27 mm) maintenues par des piquets enfoncés tous les 80 cm. Les planches définissent l\'épaisseur finale de la dalle. Vérifiez le niveau et l\'équerrage.',
    note: 'Huiler les coffrages pour faciliter le décoffrage après 28 jours.',
    svg: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Vue de dessus perspective légère */}
        {/* Fond forme drainante */}
        <rect x="50" y="50" width="200" height="100" fill="#ede9e1"/>
        {/* Planches coffrage — 4 côtés */}
        <rect x="44" y="50" width="8" height="100" fill="#b8956a"/>   {/* gauche */}
        <rect x="248" y="50" width="8" height="100" fill="#b8956a"/>  {/* droite */}
        <rect x="44" y="44" width="220" height="8" fill="#c8a575"/>   {/* haut */}
        <rect x="44" y="148" width="220" height="8" fill="#c8a575"/>  {/* bas */}
        {/* Piquets */}
        {[64, 110, 155, 200, 235].map(x => (
          <rect key={x} x={x-3} y="46" width="5" height="16" fill="#8b5e3c"/>
        ))}
        {[64, 110, 155, 200, 235].map(x => (
          <rect key={x} x={x-3} y="148" width="5" height="16" fill="#8b5e3c"/>
        ))}
        {/* Flèches équerre */}
        <line x1="60" y1="55" x2="90" y2="55" stroke="#c9971e" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <line x1="60" y1="55" x2="60" y2="85" stroke="#c9971e" strokeWidth="1.5"/>
        <text x="95" y="58" fontSize="9" fill="#c9971e" fontFamily="Inter,sans-serif">équerrage</text>
        {/* Label intérieur */}
        <text x="150" y="105" fontSize="11" fill="#8a7e6f" fontFamily="Inter,sans-serif" textAnchor="middle">Espace coffré</text>
        <text x="150" y="120" fontSize="9" fill="#a09080" fontFamily="Inter,sans-serif" textAnchor="middle">(vue de dessus)</text>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Treillis soudé ST25',
    desc: 'Posez les panneaux de treillis soudé ST25 (maille 150×150 mm, ø 5 mm) sur des cales plastique de 4 cm. Le recouvrement entre panneaux doit être d\'au moins 20 cm (2 mailles). Ne posez pas le treillis à même la forme.',
    note: 'DTU 13.3 §5.4 — Enrobage mini 3 cm. Treillis recommandé dès 10 m².',
    svg: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Coupe transversale */}
        {/* Coffrage */}
        <rect x="35" y="50" width="8" height="90" fill="#b8956a"/>
        <rect x="257" y="50" width="8" height="90" fill="#b8956a"/>
        {/* Forme drainante */}
        <rect x="43" y="110" width="214" height="30" fill="#d4c4a0"/>
        {/* Cales */}
        <rect x="80" y="100" width="6" height="10" fill="#e0c060" rx="1"/>
        <rect x="150" y="100" width="6" height="10" fill="#e0c060" rx="1"/>
        <rect x="220" y="100" width="6" height="10" fill="#e0c060" rx="1"/>
        {/* Treillis — lignes horizontales */}
        <line x1="43" y1="101" x2="257" y2="101" stroke="#78818c" strokeWidth="2"/>
        {/* Treillis — lignes verticales (barres transversales) */}
        {[50,65,80,95,110,125,140,155,170,185,200,215,230,245].map(x => (
          <line key={x} x1={x} y1="96" x2={x} y2="106" stroke="#78818c" strokeWidth="1.5"/>
        ))}
        {/* Cote enrobage */}
        <line x1="17" y1="101" x2="17" y2="140" stroke="#666" strokeWidth="1"/>
        <line x1="12" y1="101" x2="22" y2="101" stroke="#666" strokeWidth="1"/>
        <line x1="12" y1="140" x2="22" y2="140" stroke="#666" strokeWidth="1"/>
        <text x="0" y="124" fontSize="9" fill="#444" fontFamily="Inter,sans-serif">4 cm</text>
        <text x="0" y="134" fontSize="8" fill="#888" fontFamily="Inter,sans-serif">cale</text>
        {/* Label */}
        <text x="150" y="75" fontSize="11" fill="#5a4f3f" fontFamily="Inter,sans-serif" textAnchor="middle">Treillis ST25 — maille 150×150 mm</text>
        {/* Légende cale */}
        <rect x="200" y="42" width="8" height="8" fill="#e0c060" rx="1"/>
        <text x="212" y="50" fontSize="9" fill="#888" fontFamily="Inter,sans-serif">Cale 4 cm</text>
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Coulage & réglage',
    desc: 'Coulez le béton C25/30 minimum par zones. Tirez à la règle de maçon en va-et-vient pour aplanir. Vibrez légèrement au fur et à mesure (bêche ou vibreur). Terminez par un talochage fin pour serrer la surface.',
    note: 'Par temps chaud (>25°C), coulez tôt le matin et humidifiez la forme avant.',
    svg: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Coffrage */}
        <rect x="35" y="55" width="8" height="80" fill="#b8956a"/>
        <rect x="257" y="55" width="8" height="80" fill="#b8956a"/>
        {/* Forme drainante */}
        <rect x="43" y="115" width="214" height="25" fill="#d4c4a0"/>
        {/* Béton coulé — surface gauche lisse, droite granuleuse */}
        <rect x="43" y="75" width="214" height="40" fill="#c8c8c0"/>
        {/* Surface irrégulière côté droit (pas encore réglé) */}
        <path d="M180,75 Q190,70 200,73 Q210,68 220,71 Q230,66 240,70 Q250,67 257,72 L257,75 Z" fill="#b8b8b0"/>
        {/* Règle de maçon */}
        <rect x="60" y="70" width="160" height="8" fill="#a08060" rx="2"/>
        {/* Flèche déplacement règle */}
        <line x1="95" y1="62" x2="165" y2="62" stroke="#c9971e" strokeWidth="1.5"/>
        <polygon points="165,59 170,62 165,65" fill="#c9971e"/>
        <polygon points="95,59 90,62 95,65" fill="#c9971e"/>
        {/* Béton frais — texture */}
        {[60,80,100,120,140,160,180].map(x => (
          <circle key={x} cx={x} cy="88" r="2" fill="#b0b0a8" opacity="0.6"/>
        ))}
        {/* Label */}
        <text x="150" y="45" fontSize="11" fill="#5a4f3f" fontFamily="Inter,sans-serif" textAnchor="middle">Tirage à la règle</text>
        <text x="150" y="145" fontSize="9" fill="#8a7e6f" fontFamily="Inter,sans-serif" textAnchor="middle">Béton C25/30 — épaisseur constante</text>
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Cure & joints de fractionnement',
    desc: 'Protégez la dalle 48h minimum (bâche plastique ou produit de cure) contre le dessèchement trop rapide. Après 7 jours, sciez les joints de fractionnement à 1/3 de l\'épaisseur de la dalle pour maîtriser la fissuration.',
    note: 'DTU 13.3 §6 — Surface max entre joints : 25 m² (piéton) / 40 m² (véhicule).',
    svg: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Vue de dessus — dalle avec joints */}
        {/* Surface dalle */}
        <rect x="40" y="30" width="220" height="120" fill="#c8c8c0" rx="2"/>
        {/* Bordure coffrage */}
        <rect x="35" y="25" width="230" height="8" fill="#b8956a"/>
        <rect x="35" y="147" width="230" height="8" fill="#b8956a"/>
        <rect x="35" y="25" width="8" height="130" fill="#b8956a"/>
        <rect x="257" y="25" width="8" height="130" fill="#b8956a"/>
        {/* Joints longitudinaux */}
        <line x1="40" y1="90" x2="260" y2="90" stroke="#606060" strokeWidth="2"/>
        {/* Joints transversaux */}
        <line x1="150" y1="30" x2="150" y2="150" stroke="#606060" strokeWidth="2"/>
        {/* Annotations surfaces */}
        <text x="95" y="65" fontSize="10" fill="#6a6a6a" fontFamily="Inter,sans-serif" textAnchor="middle">panneau 1</text>
        <text x="205" y="65" fontSize="10" fill="#6a6a6a" fontFamily="Inter,sans-serif" textAnchor="middle">panneau 2</text>
        <text x="95" y="125" fontSize="10" fill="#6a6a6a" fontFamily="Inter,sans-serif" textAnchor="middle">panneau 3</text>
        <text x="205" y="125" fontSize="10" fill="#6a6a6a" fontFamily="Inter,sans-serif" textAnchor="middle">panneau 4</text>
        {/* Scie à disque illustrée */}
        <circle cx="150" cy="90" r="10" fill="none" stroke="#c9971e" strokeWidth="2"/>
        <circle cx="150" cy="90" r="3" fill="#c9971e"/>
        {/* Label */}
        <text x="150" y="18" fontSize="9" fill="#8a7e6f" fontFamily="Inter,sans-serif" textAnchor="middle">Vue de dessus — joints de fractionnement</text>
      </svg>
    ),
  },
];

// ── Calculateur ────────────────────────────────────────────────────────
function DalleCalculateur() {
  const [width, setWidth]   = useState(4);
  const [depth, setDepth]   = useState(3);
  const [usage, setUsage]   = useState('pietonne');
  const [withTreillis, setWithTreillis] = useState(true);

  const result = useMemo(() => {
    const surface    = +(width * depth).toFixed(2);
    const epaisseur  = EPAISSEUR[usage];
    const volumeBeton = +(surface * epaisseur).toFixed(3);
    const needsToupie = volumeBeton >= TOUPIE_SEUIL;
    const sacsBeton  = needsToupie ? 0 : Math.ceil(volumeBeton / SAC_VOLUME);
    const volumeForme = +(surface * FORME_EP).toFixed(3);
    const treillisM2 = withTreillis ? +(surface * TREILLIS_MAJORATION).toFixed(2) : 0;
    const treillisNb = withTreillis ? Math.ceil(treillisM2 / TREILLIS_PANNEAU) : 0;
    const coutBeton  = needsToupie
      ? +(volumeBeton * PRIX_TOUPIE).toFixed(0)
      : +(sacsBeton * PRIX_SAC).toFixed(0);
    const coutTreillis = +(treillisM2 * PRIX_TREILLIS).toFixed(0);
    const coutTotal  = coutBeton + coutTreillis;

    return { surface, epaisseur, volumeBeton, needsToupie, sacsBeton, volumeForme,
             treillisM2, treillisNb, coutBeton, coutTreillis, coutTotal };
  }, [width, depth, usage, withTreillis]);

  return (
    <div className="dalle-calc">
      <h2 className="dalle-calc-title">Calculateur de matériaux</h2>
      <p className="dalle-calc-sub">Surface · épaisseur DTU · béton · treillis</p>

      <div className="dalle-calc-grid">
        {/* Inputs */}
        <div className="dalle-calc-inputs">
          <div className="dalle-input-group">
            <label className="dalle-label">Largeur (m)</label>
            <input
              type="number"
              className="dalle-input"
              value={width}
              min="1" max="30" step="0.5"
              onChange={e => setWidth(+e.target.value)}
            />
          </div>
          <div className="dalle-input-group">
            <label className="dalle-label">Profondeur (m)</label>
            <input
              type="number"
              className="dalle-input"
              value={depth}
              min="1" max="30" step="0.5"
              onChange={e => setDepth(+e.target.value)}
            />
          </div>

          <div className="dalle-input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="dalle-label">Usage</label>
            <div className="dalle-radio-group">
              {[
                { v: 'pietonne', l: 'Piéton / jardin', ep: '10 cm' },
                { v: 'vehicule', l: 'Véhicule léger', ep: '12 cm' },
                { v: 'pl',       l: 'Poids lourd',    ep: '20 cm' },
              ].map(opt => (
                <label key={opt.v} className={`dalle-radio ${usage === opt.v ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="usage"
                    value={opt.v}
                    checked={usage === opt.v}
                    onChange={() => setUsage(opt.v)}
                    className="sr-only"
                  />
                  <span className="dalle-radio-label">{opt.l}</span>
                  <span className="dalle-radio-ep">{opt.ep}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="dalle-input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="dalle-toggle">
              <input
                type="checkbox"
                checked={withTreillis}
                onChange={e => setWithTreillis(e.target.checked)}
              />
              <span>Inclure le treillis soudé ST25</span>
              {result.surface >= 10 && <span className="dalle-badge-dtu">DTU recommandé</span>}
            </label>
          </div>
        </div>

        {/* Résultats */}
        <div className="dalle-calc-results">
          <div className="dalle-result-header">
            <span className="dalle-result-surface">{result.surface} m²</span>
            <span className="dalle-result-ep">dalle {(result.epaisseur * 100).toFixed(0)} cm</span>
          </div>

          <div className="dalle-result-rows">
            {/* Béton */}
            <div className="dalle-result-section">
              <div className="dalle-result-section-title">Béton C25/30</div>
              <div className="dalle-result-row">
                <span>Volume</span>
                <strong>{result.volumeBeton} m³</strong>
              </div>
              {result.needsToupie ? (
                <div className="dalle-result-row highlight-toupie">
                  <span>Livraison toupie</span>
                  <strong>≥ 3 m³ → camion</strong>
                </div>
              ) : (
                <div className="dalle-result-row">
                  <span>Sacs 35 kg</span>
                  <strong>{result.sacsBeton} sacs</strong>
                </div>
              )}
              <div className="dalle-result-row cost">
                <span>Coût béton estimé</span>
                <strong>{result.coutBeton} €</strong>
              </div>
            </div>

            {/* Forme */}
            <div className="dalle-result-section">
              <div className="dalle-result-section-title">Forme drainante</div>
              <div className="dalle-result-row">
                <span>Gravier 0/31.5 (10 cm)</span>
                <strong>{result.volumeForme} m³</strong>
              </div>
            </div>

            {/* Treillis */}
            {withTreillis && (
              <div className="dalle-result-section">
                <div className="dalle-result-section-title">Treillis ST25 (ø5 — 150×150)</div>
                <div className="dalle-result-row">
                  <span>Surface achat (+15 % recouv.)</span>
                  <strong>{result.treillisM2} m²</strong>
                </div>
                <div className="dalle-result-row">
                  <span>Panneaux 1.8×1.8 m</span>
                  <strong>{result.treillisNb} panneaux</strong>
                </div>
                <div className="dalle-result-row cost">
                  <span>Coût treillis estimé</span>
                  <strong>{result.coutTreillis} €</strong>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="dalle-result-total">
              <span>Total matériaux estimé</span>
              <strong>{result.coutTotal} €</strong>
            </div>
          </div>

          <p className="dalle-result-note">
            Hors main-d'œuvre, livraison et outillage. Prix indicatifs 2024.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────
export default function DalleTutorielPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" data-theme="g-v2" style={{ background: 'var(--surface)' }}>
      <Header
        view="module"
        resultat={false}
        onRetour={() => router.push('/')}
      />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* ── En-tête ── */}
        <div className="dalle-hero">
          <span className="dalle-hero-badge">Guide technique · NF DTU 13.3</span>
          <h1 className="dalle-hero-title">Couler une dalle béton extérieure</h1>
          <p className="dalle-hero-desc">
            Cour, parking, allée, abri voiture — 6 étapes illustrées pour réaliser
            une dalle conforme DTU : terrassement, forme drainante, coffrage,
            treillis soudé, coulage et joints de fractionnement.
          </p>
          <div className="dalle-hero-chips">
            <span className="dalle-chip">⏱ 2 jours de chantier</span>
            <span className="dalle-chip">🏗 Niveau intermédiaire</span>
            <span className="dalle-chip">📐 Épaisseur 10–20 cm</span>
          </div>
        </div>

        {/* ── Étapes ── */}
        <div className="dalle-steps">
          {STEPS.map((step) => (
            <div key={step.id} className="dalle-step">
              <div className="dalle-step-header">
                <span className="dalle-step-num">{step.id}</span>
                <h2 className="dalle-step-title">{step.title}</h2>
              </div>
              <div className="dalle-step-body">
                <div className="dalle-step-svg" role="img" aria-label={`Illustration étape ${step.id} : ${step.title}`}>
                  {step.svg}
                </div>
                <div className="dalle-step-text">
                  <p className="dalle-step-desc">{step.desc}</p>
                  <p className="dalle-step-note">📌 {step.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Calculateur ── */}
        <DalleCalculateur />

        {/* ── CTA artisan ── */}
        <div className="dalle-cta-artisan">
          <div className="dalle-cta-text">
            <strong>Projet trop important à faire seul ?</strong>
            <span>Obtenez un devis d'un artisan qualifié avec votre calcul de matériaux.</span>
          </div>
          <Link href="/" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Trouver un artisan
          </Link>
        </div>

      </main>

      <Footer />

      <style jsx>{`
        /* ── Hero ── */
        .dalle-hero { margin-bottom: 48px; }
        .dalle-hero-badge {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          background: #f0ebe0; color: #8a7a5a; font-size: 12px; font-weight: 600;
          letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 12px;
          font-family: 'Inter', sans-serif;
        }
        .dalle-hero-title {
          font-size: clamp(24px, 4vw, 36px); font-weight: 700;
          color: var(--text-primary, #1a1c1b); line-height: 1.2;
          margin: 0 0 12px; font-family: 'Fraunces', serif;
        }
        .dalle-hero-desc {
          font-size: 16px; color: #5a5248; line-height: 1.65;
          margin: 0 0 20px; max-width: 680px;
          font-family: 'Inter', sans-serif;
        }
        .dalle-hero-chips { display: flex; gap: 10px; flex-wrap: wrap; }
        .dalle-chip {
          padding: 6px 14px; background: rgba(255,255,255,0.7);
          border: 1.5px solid #d8d0c4; border-radius: 20px;
          font-size: 13px; color: #6a5f50; font-family: 'Inter', sans-serif;
        }

        /* ── Étapes ── */
        .dalle-steps { display: flex; flex-direction: column; gap: 40px; margin-bottom: 64px; }
        .dalle-step {
          background: #fff; border: 1.5px solid #e8e0d4;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .dalle-step-header {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 24px 0;
        }
        .dalle-step-num {
          width: 32px; height: 32px; border-radius: 50%;
          background: #1B3022; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; flex-shrink: 0;
          font-family: 'Inter', sans-serif;
        }
        .dalle-step-title {
          font-size: 18px; font-weight: 600; color: #1a1c1b;
          margin: 0; font-family: 'Inter', sans-serif;
        }
        .dalle-step-body {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
          padding: 16px 24px 24px;
        }
        @media (max-width: 640px) {
          .dalle-step-body { grid-template-columns: 1fr; }
        }
        .dalle-step-svg {
          background: #f8f5f0; border-radius: 10px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .dalle-step-svg svg { width: 100%; height: auto; display: block; }
        .dalle-step-desc {
          font-size: 14px; color: #4a4540; line-height: 1.7;
          margin: 0 0 12px; font-family: 'Inter', sans-serif;
        }
        .dalle-step-note {
          font-size: 12px; color: #8a7e6f; line-height: 1.5;
          margin: 0; padding: 10px 12px;
          background: #faf7f0; border-left: 3px solid #c9971e;
          border-radius: 0 6px 6px 0; font-family: 'Inter', sans-serif;
        }

        /* ── Calculateur ── */
        .dalle-calc {
          background: #fff; border: 1.5px solid #e8e0d4;
          border-radius: 16px; padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .dalle-calc-title {
          font-size: 22px; font-weight: 700; color: #1a1c1b;
          margin: 0 0 4px; font-family: 'Fraunces', serif;
        }
        .dalle-calc-sub {
          font-size: 13px; color: #8a7e6f; margin: 0 0 28px;
          font-family: 'Inter', sans-serif;
        }
        .dalle-calc-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
        }
        @media (max-width: 640px) {
          .dalle-calc-grid { grid-template-columns: 1fr; }
          .dalle-calc { padding: 20px; }
        }
        .dalle-calc-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-content: start; }
        .dalle-input-group { display: flex; flex-direction: column; gap: 6px; }
        .dalle-label {
          font-size: 12px; font-weight: 600; color: #6a5f50; text-transform: uppercase;
          letter-spacing: 0.5px; font-family: 'Inter', sans-serif;
        }
        .dalle-input {
          padding: 10px 14px; border: 1.5px solid #d8d0c4; border-radius: 8px;
          font-size: 15px; font-weight: 600; color: #1a1c1b;
          background: #faf7f2; font-family: 'Inter', sans-serif;
          transition: border-color 0.15s;
        }
        .dalle-input:focus { outline: none; border-color: #1B3022; }
        .dalle-radio-group { display: flex; flex-direction: column; gap: 8px; }
        .dalle-radio {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border: 1.5px solid #d8d0c4; border-radius: 8px;
          cursor: pointer; transition: all 0.15s; background: #faf7f2;
        }
        .dalle-radio.active { border-color: #1B3022; background: #f0f7f2; }
        .dalle-radio-label { font-size: 13px; color: #3a3530; font-family: 'Inter', sans-serif; font-weight: 500; }
        .dalle-radio-ep { font-size: 12px; color: #8a7e6f; font-family: 'Inter', sans-serif; }
        .dalle-radio.active .dalle-radio-label { color: #1B3022; font-weight: 600; }
        .dalle-toggle {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          font-size: 13px; color: #3a3530; font-family: 'Inter', sans-serif;
        }
        .dalle-toggle input { accent-color: #1B3022; width: 16px; height: 16px; }
        .dalle-badge-dtu {
          padding: 2px 8px; background: #e8f5e8; color: #2a6a3a;
          border-radius: 4px; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.3px;
          font-family: 'Inter', sans-serif; margin-left: 4px;
        }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

        /* Résultats */
        .dalle-calc-results { display: flex; flex-direction: column; gap: 0; }
        .dalle-result-header {
          display: flex; align-items: baseline; gap: 12px;
          margin-bottom: 16px; padding-bottom: 16px;
          border-bottom: 1.5px solid #e8e0d4;
        }
        .dalle-result-surface {
          font-size: 32px; font-weight: 800; color: #1B3022;
          font-family: 'Fraunces', serif;
        }
        .dalle-result-ep {
          font-size: 14px; color: #8a7e6f; font-family: 'Inter', sans-serif;
        }
        .dalle-result-rows { display: flex; flex-direction: column; gap: 12px; }
        .dalle-result-section {
          background: #faf7f2; border-radius: 10px; padding: 12px 14px;
          border: 1px solid #e8e0d4;
        }
        .dalle-result-section-title {
          font-size: 11px; font-weight: 700; color: #8a7e6f; text-transform: uppercase;
          letter-spacing: 0.5px; margin-bottom: 8px; font-family: 'Inter', sans-serif;
        }
        .dalle-result-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; color: #3a3530; font-family: 'Inter', sans-serif;
          padding: 3px 0;
        }
        .dalle-result-row strong { color: #1a1c1b; font-weight: 600; }
        .dalle-result-row.cost strong { color: #1B3022; }
        .dalle-result-row.highlight-toupie strong { color: #c84a1a; }
        .dalle-result-total {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 16px; background: #1B3022; border-radius: 10px;
          font-size: 15px; font-weight: 700; color: #fff;
          font-family: 'Inter', sans-serif; margin-top: 4px;
        }
        .dalle-result-total strong { font-size: 20px; font-family: 'Fraunces', serif; }
        .dalle-result-note {
          font-size: 11px; color: #a09880; margin-top: 10px;
          font-family: 'Inter', sans-serif;
        }

        /* ── CTA artisan ── */
        .dalle-cta-artisan {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; padding: 24px 28px;
          background: #f5f0e8; border: 1.5px solid #d8cfc0;
          border-radius: 14px;
        }
        @media (max-width: 600px) {
          .dalle-cta-artisan { flex-direction: column; align-items: flex-start; }
        }
        .dalle-cta-text { display: flex; flex-direction: column; gap: 4px; }
        .dalle-cta-text strong { font-size: 15px; color: #1a1c1b; font-family: 'Inter', sans-serif; }
        .dalle-cta-text span { font-size: 13px; color: #6a5f50; font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
