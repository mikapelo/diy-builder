'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatSource } from '@/lib/leadSource';

/* Libellés des emplacements de CTA — mêmes valeurs que la dimension `placement`
   d'Umami, écrites pour être lues. Les leads d'avant le 26/08/2026 n'en ont pas. */
const PLACEMENT_LABELS = {
  'simulateur': 'Bloc simulateur',
  'guide':      'CTA en guide',
  'accueil':    'Section accueil',
  'post-pdf':   'Après dossier PDF',
  'inconnu':    'Inconnue',
};

const PROJECT_LABELS = {
  terrasse: 'Terrasse',
  cabanon: 'Cabanon',
  pergola: 'Pergola',
  cloture: 'Clôture',
};

const PROJECT_COLORS = {
  terrasse: '#3B82F6',
  cabanon:  '#8B5CF6',
  pergola:  '#10B981',
  cloture:  '#F59E0B',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function downloadCSV(header, rows, filename) {
  const body = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
  const blob = new Blob([[header, ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(leads) {
  downloadCSV(
    'Date,Email,Projet,Largeur (m),Profondeur (m)',
    leads.map((l) => [
      formatDate(l.createdAt),
      l.email,
      PROJECT_LABELS[l.projectType] ?? l.projectType ?? '—',
      l.dims?.width ?? '',
      l.dims?.depth ?? '',
    ]),
    'telechargements-pdf-diy-builder',
  );
}

/* Export des demandes de devis — colonnes alignées sur ce qu'attend une
   plateforme de leads (identité, contact, zone, projet, preuve de consentement).
   L'origine et le canal viennent APRÈS ce bloc : ce sont nos données
   d'attribution, elles ne doivent pas décaler les colonnes qu'attend l'acheteur. */
function exportArtisanCSV(leads) {
  downloadCSV(
    'Date,Nom,Telephone,Email,Code postal,Projet,Largeur (m),Profondeur (m),Surface (m2),Message,Consentement,Version consentement,Origine,Canal',
    leads.map((l) => [
      formatDate(l.createdAt),
      l.name ?? '',
      l.phone ?? '',
      l.email ?? '',
      l.zipCode ?? '',
      PROJECT_LABELS[l.projectType] ?? l.projectType ?? '—',
      l.dims?.width ?? '',
      l.dims?.depth ?? '',
      l.dims?.area ?? '',
      (l.message ?? '').replace(/\r?\n/g, ' '),
      l.consent?.given ? 'oui' : 'non',
      l.consent?.version ?? '',
      l.source?.placement ?? '',
      l.source ? formatSource(l.source) : '',
    ]),
    'demandes-devis-diy-builder',
  );
}

/* ── Stats cards ── */
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e2d8', borderRadius: 12,
      padding: '20px 24px', minWidth: 140,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1c1b', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#66625a', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#9c9188', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* ── Login screen ── */
function LoginScreen({ onLogin, error, serverError, loading }) {
  const [pw, setPw] = useState('');
  const hasError = error || serverError;
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#fafaf8', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: '#fff', border: '1px solid #e5e2d8', borderRadius: 16,
        padding: '40px 36px', width: 340, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1c1b', margin: '0 0 4px' }}>DIY Builder Admin</h1>
        <p style={{ fontSize: 13, color: '#9c9188', margin: '0 0 24px' }}>Téléchargements PDF</p>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && onLogin(pw)}
          style={{
            width: '100%', padding: '10px 14px',
            border: `1px solid ${hasError ? '#ef4444' : '#d1cdc6'}`,
            borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
            marginBottom: hasError ? 8 : 16,
          }}
          autoFocus
          disabled={loading}
        />
        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 12px' }}>Mot de passe incorrect</p>
        )}
        {serverError && (
          <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 12px' }}>{serverError}</p>
        )}
        <button
          onClick={() => !loading && onLogin(pw)}
          disabled={loading}
          style={{
            width: '100%', padding: '10px 0',
            background: loading ? '#d4a843' : '#C9971E', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Connexion…' : 'Connexion'}
        </button>
      </div>
    </div>
  );
}

/* ── Table des demandes de devis (leads pro, consentis et transmissibles) ── */
function ArtisanTable({ leads }) {
  if (leads.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#9c9188' }}>
        Aucune demande de devis
      </div>
    );
  }
  const cell = { padding: '12px 16px', verticalAlign: 'top' };
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e2d8', borderRadius: 12, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8f5ef', borderBottom: '1px solid #e5e2d8' }}>
            {['Date', 'Contact', 'Téléphone', 'CP', 'Projet', 'Dimensions', 'Origine', 'Précisions', 'Accord'].map((h) => (
              <th key={h} style={{
                padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                color: '#66625a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((l, i) => (
            <tr key={`${l.createdAt}-${l.phone}-${i}`}
                style={{ borderBottom: i < leads.length - 1 ? '1px solid #f0ede6' : 'none' }}>
              <td style={{ ...cell, color: '#9c9188', whiteSpace: 'nowrap' }}>{formatDate(l.createdAt)}</td>
              <td style={cell}>
                <div style={{ color: '#1a1c1b', fontWeight: 600 }}>{l.name || '—'}</div>
                {l.email && <div style={{ color: '#66625a', fontSize: 12 }}>{l.email}</div>}
              </td>
              <td style={{ ...cell, color: '#1a1c1b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                <a href={`tel:${String(l.phone ?? '').replace(/\s/g, '')}`} style={{ color: '#1a1c1b' }}>
                  {l.phone || '—'}
                </a>
              </td>
              <td style={{ ...cell, color: '#66625a' }}>{l.zipCode || '—'}</td>
              <td style={cell}>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                  fontSize: 11, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap',
                  background: PROJECT_COLORS[l.projectType] ?? '#9c9188',
                }}>
                  {PROJECT_LABELS[l.projectType] ?? l.projectType ?? '—'}
                </span>
              </td>
              <td style={{ ...cell, color: '#66625a', whiteSpace: 'nowrap' }}>
                {l.dims ? `${l.dims.width} × ${l.dims.depth} m` : '—'}
                {l.dims?.area ? <div style={{ fontSize: 11, color: '#9c9188' }}>{Number(l.dims.area).toFixed(2)} m²</div> : null}
              </td>
              <td style={{ ...cell, color: '#66625a' }}>
                {l.source ? (
                  <>
                    <div style={{ color: '#1a1c1b', whiteSpace: 'nowrap' }}>
                      {PLACEMENT_LABELS[l.source.placement] ?? l.source.placement}
                    </div>
                    <div style={{ fontSize: 11, color: '#9c9188' }}>{formatSource(l.source)}</div>
                  </>
                ) : '—'}
              </td>
              <td style={{ ...cell, color: '#66625a', maxWidth: 260, whiteSpace: 'pre-wrap' }}>
                {l.message || '—'}
              </td>
              <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                {l.consent?.given ? (
                  <span title={`Version ${l.consent.version ?? '?'}`} style={{ color: '#2B5D3A', fontWeight: 600 }}>
                    ✓ {l.consent.version ?? '—'}
                  </span>
                ) : (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>✗</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function LeadsDashboard() {
  const [auth, setAuth] = useState(null);
  const [view, setView] = useState('artisan');   // artisan | pdf
  const [leads, setLeads] = useState([]);
  const [artisanLeads, setArtisanLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);       // erreur dashboard (refresh)
  const [loginError, setLoginError] = useState(false);      // mauvais mdp
  const [loginServerError, setLoginServerError] = useState(null); // erreur serveur au login
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchLeads = useCallback(async (password, isLogin = false) => {
    setLoading(true);
    if (isLogin) { setLoginError(false); setLoginServerError(null); }
    else setError(null);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': 'Basic ' + btoa(`:${password}`),
        },
      });
      if (res.status === 401) {
        setLoginError(true);
        setAuth(null);
        return;
      }
      if (!res.ok) {
        let detail = '';
        try {
          const body = await res.json();
          if (body.missing) {
            const vars = Object.entries(body.missing)
              .map(([k, v]) => `${k}: ${v ? '✅' : '❌'}`)
              .join(' | ');
            detail = ` — Variables: ${vars}`;
          } else if (body.error) {
            detail = ` — ${body.error}`;
          }
        } catch {}
        const msg = `Erreur serveur (${res.status})${detail}`;
        if (isLogin) setLoginServerError(msg);
        else setError(msg);
        return;
      }
      const data = await res.json();
      setLeads(data.leads ?? []);
      setArtisanLeads(data.artisanLeads ?? []);
      setTotal(data.total ?? 0);
      setAuth(password);
    } catch (err) {
      const msg = `Impossible de joindre l'API : ${err.message}`;
      if (isLogin) setLoginServerError(msg);
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (password) => {
    fetchLeads(password, true);
  };

  // Stats
  const countByProject = leads.reduce((acc, l) => {
    acc[l.projectType] = (acc[l.projectType] ?? 0) + 1;
    return acc;
  }, {});

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = leads.filter((l) => new Date(l.createdAt) >= today).length;

  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  const weekCount = leads.filter((l) => new Date(l.createdAt) >= thisWeek).length;

  // Filtered leads
  const filtered = leads.filter((l) => {
    const matchProject = filter === 'all' || l.projectType === filter;
    const matchSearch = !search || l.email.toLowerCase().includes(search.toLowerCase());
    return matchProject && matchSearch;
  });

  const exportCount = view === 'artisan' ? artisanLeads.length : filtered.length;

  // Stats demandes de devis
  const artisanToday = artisanLeads.filter((l) => new Date(l.createdAt) >= today).length;
  const artisanWeek  = artisanLeads.filter((l) => new Date(l.createdAt) >= thisWeek).length;
  const artisanConsented = artisanLeads.filter((l) => l.consent?.given).length;

  if (!auth) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        error={loginError}
        serverError={loginServerError}
        loading={loading}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e5e2d8',
        padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🏗️</span>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1c1b' }}>DIY Builder</span>
            <span style={{ fontSize: 13, color: '#9c9188', marginLeft: 8 }}>/ Leads</span>
          </div>
          {/* Bascule entre les deux populations — elles n'ont ni la même valeur ni le même usage */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
            {[
              { id: 'artisan', label: `Demandes de devis (${artisanLeads.length})` },
              { id: 'pdf',     label: `Téléchargements PDF (${total})` },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  padding: '7px 14px',
                  background: view === v.id ? '#1a1c1b' : '#fff',
                  color: view === v.id ? '#fff' : '#66625a',
                  border: `1px solid ${view === v.id ? 'transparent' : '#d1cdc6'}`,
                  borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => fetchLeads(auth, false)}
            style={{
              padding: '8px 16px', background: '#f0ede6', color: '#1a1c1b',
              border: '1px solid #d1cdc6', borderRadius: 8, fontSize: 13,
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            ↻ Actualiser
          </button>
          <button
            onClick={() => (view === 'artisan' ? exportArtisanCSV(artisanLeads) : exportCSV(filtered))}
            disabled={exportCount === 0}
            style={{
              padding: '8px 16px', background: '#C9971E', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: exportCount === 0 ? 'not-allowed' : 'pointer',
              opacity: exportCount === 0 ? 0.5 : 1,
            }}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

      {view === 'artisan' ? (
        <>
          <div style={{
            background: '#EAF3EC', border: '1px solid #b9d6c2', borderRadius: 12,
            padding: '14px 18px', marginBottom: 24, fontSize: 13, color: '#2B5D3A',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>🔨</span>
            <div>
              <strong>Demandes de devis</strong> — formulaire complet (nom, téléphone, code postal,
              projet chiffré), consenties au moment de la collecte. Ce sont les leads transmissibles
              à un partenaire. Archivées 12&nbsp;mois, puis purgées automatiquement.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <StatCard label="Total demandes" value={artisanLeads.length} />
            <StatCard label="Aujourd'hui" value={artisanToday} />
            <StatCard label="7 derniers jours" value={artisanWeek} />
            <StatCard
              label="Accord recueilli"
              value={artisanConsented}
              sub={artisanLeads.length ? `${Math.round((artisanConsented / artisanLeads.length) * 100)}%` : undefined}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#9c9188' }}>Chargement…</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#ef4444' }}>{error}</div>
          ) : (
            <ArtisanTable leads={artisanLeads} />
          )}
        </>
      ) : (
      <>
        {/* Encart explicatif sémantique : ces données = opt-in freemium, PAS leads pro vendables */}
        <div style={{
          background: '#fef9e7', border: '1px solid #f0d98c', borderRadius: 12,
          padding: '14px 18px', marginBottom: 24, fontSize: 13, color: '#665012',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>ℹ️</span>
          <div>
            <strong>Contacts opt-in PDF (freemium)</strong> — emails captés en échange du téléchargement
            du devis PDF. Usage&nbsp;: nurturing newsletter, pas revente lead. Les demandes de devis
            complètes (nom/tél/CP) sont dans l&apos;onglet <strong>Demandes de devis</strong>.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatCard label="Total téléchargements" value={total} />
          <StatCard label="Aujourd'hui" value={todayCount} />
          <StatCard label="7 derniers jours" value={weekCount} />
          {Object.entries(countByProject).map(([type, count]) => (
            <StatCard
              key={type}
              label={PROJECT_LABELS[type] ?? type}
              value={count}
              sub={`${Math.round((count / total) * 100)}%`}
            />
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher un email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px', border: '1px solid #d1cdc6', borderRadius: 8,
              fontSize: 13, outline: 'none', width: 220,
            }}
          />
          {['all', 'terrasse', 'cabanon', 'pergola', 'cloture'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px',
                background: filter === f ? (f === 'all' ? '#1a1c1b' : PROJECT_COLORS[f]) : '#fff',
                color: filter === f ? '#fff' : '#66625a',
                border: `1px solid ${filter === f ? 'transparent' : '#d1cdc6'}`,
                borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'Tous' : PROJECT_LABELS[f]}
            </button>
          ))}
          <span style={{ fontSize: 12, color: '#9c9188', marginLeft: 'auto' }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9c9188' }}>Chargement…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#ef4444' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9c9188' }}>
            Aucun téléchargement
          </div>
        ) : (
          <div style={{
            background: '#fff', border: '1px solid #e5e2d8', borderRadius: 12, overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8f5ef', borderBottom: '1px solid #e5e2d8' }}>
                  {['Date', 'Email', 'Projet', 'Dimensions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                      color: '#66625a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr
                    key={lead.createdAt + lead.email + i}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #f0ede6' : 'none',
                    }}
                  >
                    <td style={{ padding: '12px 16px', color: '#9c9188', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.createdAt)}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#1a1c1b', fontWeight: 500 }}>
                      {lead.email}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                        fontSize: 11, fontWeight: 600, color: '#fff',
                        background: PROJECT_COLORS[lead.projectType] ?? '#9c9188',
                      }}>
                        {PROJECT_LABELS[lead.projectType] ?? lead.projectType ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#66625a' }}>
                      {lead.dims ? `${lead.dims.width} m × ${lead.dims.depth} m` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
      )}
      </div>
    </div>
  );
}
