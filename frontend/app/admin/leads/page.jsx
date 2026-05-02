'use client';

import { useState, useEffect, useCallback } from 'react';

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

function exportCSV(leads) {
  const header = 'Date,Email,Projet,Largeur (m),Profondeur (m)';
  const rows = leads.map((l) => [
    formatDate(l.createdAt),
    l.email,
    PROJECT_LABELS[l.projectType] ?? l.projectType ?? '—',
    l.dims?.width ?? '',
    l.dims?.depth ?? '',
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-diy-builder-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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
function LoginScreen({ onLogin, error }) {
  const [pw, setPw] = useState('');
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
        <p style={{ fontSize: 13, color: '#9c9188', margin: '0 0 24px' }}>Dashboard leads</p>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin(pw)}
          style={{
            width: '100%', padding: '10px 14px', border: '1px solid #d1cdc6',
            borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
            marginBottom: error ? 8 : 16,
          }}
          autoFocus
        />
        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 12px' }}>Mot de passe incorrect</p>
        )}
        <button
          onClick={() => onLogin(pw)}
          style={{
            width: '100%', padding: '10px 0', background: '#C9971E', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Connexion
        </button>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function LeadsDashboard() {
  const [auth, setAuth] = useState(null); // null = not tried, false = wrong, string = password
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchLeads = useCallback(async (password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': 'Basic ' + btoa(`:${password}`),
        },
      });
      if (res.status === 401) {
        setLoginError(true);
        setAuth(null);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
      setAuth(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (password) => {
    setLoginError(false);
    fetchLeads(password);
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

  if (!auth) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
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
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => fetchLeads(auth)}
            style={{
              padding: '8px 16px', background: '#f0ede6', color: '#1a1c1b',
              border: '1px solid #d1cdc6', borderRadius: 8, fontSize: 13,
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            ↻ Actualiser
          </button>
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            style={{
              padding: '8px 16px', background: '#C9971E', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
              opacity: filtered.length === 0 ? 0.5 : 1,
            }}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatCard label="Total leads" value={total} />
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
            Aucun lead trouvé
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
      </div>
    </div>
  );
}
