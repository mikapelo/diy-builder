'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import Header         from '../components/layout/Header';
import Footer         from '../components/layout/Footer';
import FormulaireTerrasse from '../components/features/terrasse/FormulaireTerrasse';
import PlanTerrasse   from '../components/features/terrasse/PlanTerrasse';
import MaterialCard   from '../components/features/terrasse/MaterialCard';
import HeroSection    from '../components/features/shared/HeroSection';
import PriceComparator from '../components/features/shared/PriceComparator';
import { useCalculTerrasse } from '../hooks/useCalculTerrasse';
import { getStatsResume }    from '../utils/format';
import { useScrollReveal }   from '../hooks/useScrollReveal';

export default function HomeClient() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const { calculer, resultat, loading, error, reset } = useCalculTerrasse();
  const [mounted,    setMounted]    = useState(false);
  const [view,       setView]       = useState('home');
  const [formParams, setFormParams] = useState(null);
  const [copied,     setCopied]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const largeur   = searchParams.get('largeur');
    const longueur  = searchParams.get('longueur');
    const type_bois = searchParams.get('type_bois');
    if (largeur && longueur && type_bois) {
      const params = { largeur: parseFloat(largeur), longueur: parseFloat(longueur), type_bois: type_bois.toLowerCase() };
      setFormParams(params);
      setView('calculator');
      calculer(params);
    }
  }, [searchParams]); // eslint-disable-line

  const handleSubmit = useCallback(async (params) => {
    setFormParams(params);
    router.push(`${pathname}?largeur=${params.largeur}&longueur=${params.longueur}&type_bois=${params.type_bois}`);
    calculer(params);
  }, [router, pathname, calculer]);

  function handleRetour() {
    reset(); setFormParams(null); setView('home'); router.push(pathname);
  }

  function copierLien() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  }

  const statsResume = getStatsResume(resultat);
  const revealRef = useScrollReveal();

  if (!mounted) return null;

  return (
    <div className="min-h-screen" data-theme="g-v2" data-page="landing">

      <Header view={view} resultat={resultat} copied={copied} onRetour={handleRetour} onCopierLien={copierLien} onCalculer={() => setView('calculator')} />

      {/* ══ VUE ACCUEIL ══════════════════════════════════ */}
      {view === 'home' && (
        <div ref={revealRef} className="animate-fade-in">

          <HeroSection />
        </div>
      )}

      {/* ══ VUE CALCULATEUR ══════════════════════════════ */}
      {view === 'calculator' && (
        <div className="animate-fade-in">

          {/* Bandeau */}
          <div className="border-b" style={{ background: 'rgba(255,255,255,.85)', borderColor: '#E8EEF3', backdropFilter: 'blur(8px)' }}>
            <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F0FBF0', border: '1px solid #B2DFBB' }}>🪵</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#2E7D32' }}>Calculateur</p>
                <h1 className="font-bold text-lg" style={{ color: '#0F1923', letterSpacing: '-0.02em' }}>Terrasse bois</h1>
              </div>
              {resultat && (
                <div className="ml-auto">
                  <button onClick={() => { reset(); setFormParams(null); router.push(pathname); }} className="btn-secondary text-xs">
                    ↩ Recalculer
                  </button>
                </div>
              )}
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Formulaire */}
              <aside className="lg:col-span-2">
                <div className="card p-7 sticky top-24">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm" style={{ background: '#F0FBF0', border: '1px solid #B2DFBB' }}>✏️</div>
                    <div>
                      <h2 className="font-bold text-sm" style={{ color: '#0F1923' }}>Votre projet</h2>
                      <p className="text-xs" style={{ color: '#7A90A4' }}>Tous les champs sont requis</p>
                    </div>
                  </div>
                  <FormulaireTerrasse onSubmit={handleSubmit} loading={loading} defaultValues={formParams} />
                </div>
              </aside>

              {/* Résultats */}
              <section className="lg:col-span-3 space-y-5">

                {error && (
                  <div className="animate-scale-in rounded-2xl p-5" style={{ background: '#FFF5F5', border: '1px solid #FED7D7' }}>
                    <p className="font-bold text-sm mb-1" style={{ color: '#C53030' }}>❌ Erreur</p>
                    <p className="text-sm" style={{ color: '#E53E3E' }}>{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="card p-12 text-center animate-fade-in">
                    <div className="w-14 h-14 mx-auto rounded-2xl border-4 border-green-100 border-t-green-500 animate-spin mb-5" />
                    <p className="font-bold" style={{ color: '#0F1923' }}>Calcul en cours…</p>
                    <p className="text-sm mt-1" style={{ color: '#7A90A4' }}>Optimisation des découpes</p>
                  </div>
                )}

                {!resultat && !loading && !error && (
                  <div className="card p-14 text-center" style={{ border: '1.5px dashed #D1DBE4', background: 'rgba(255,255,255,.6)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5" style={{ background: '#F0FBF0', border: '1px solid #B2DFBB' }}>📐</div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#0F1923' }}>Prêt à calculer</h3>
                    <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: '#7A90A4' }}>
                      Renseignez les dimensions pour obtenir la liste des matériaux et les prix comparés.
                    </p>
                    <p className="text-xs mt-5" style={{ color: '#B0BCC6' }}>💡 Partagez votre projet via l'URL</p>
                  </div>
                )}

                {resultat && !loading && (
                  <>
                    {/* 1. Résumé */}
                    <div className="animate-scale-in rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #F0FBF0 0%, #E3F7E3 100%)', border: '1px solid #B2DFBB' }}>
                      <div className="flex items-center gap-3 mb-5">
                        <span className="badge-success">✅ Projet calculé</span>
                        <span className="text-sm font-medium" style={{ color: '#3D5468' }}>
                          {resultat.projet.largeur} × {resultat.projet.longueur} m
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {statsResume.map(s => (
                          <div key={s.label} className="flex flex-col items-center p-4 rounded-xl text-center"
                            style={{ background: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.9)' }}>
                            <span className="text-xl mb-1">{s.icon}</span>
                            <span className="text-xl font-bold leading-none" style={{ color: '#2E7D32' }}>{s.val}</span>
                            <span className="text-xs mt-1.5" style={{ color: '#3D5468' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Matériaux */}
                    <div className="animate-fade-up card p-7">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="section-label mb-1">Matériaux</p>
                          <h2 className="text-xl font-bold" style={{ color: '#0F1923', letterSpacing: '-0.025em' }}>Ce qu'il faut acheter</h2>
                        </div>
                        {resultat.optimisation_decoupe && (
                          <div className="text-right">
                            <div className="text-2xl font-bold" style={{ color: '#2E7D32' }}>
                              {(resultat.optimisation_decoupe.perte_globale * 100).toFixed(1)} %
                            </div>
                            <div className="text-xs" style={{ color: '#7A90A4' }}>perte estimée</div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {resultat.materiaux.map((m, i) => (
                          <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                            <MaterialCard nom={m.nom} categorie={m.categorie} quantite={m.quantite} unite={m.unite} detail={m.detail} />
                          </div>
                        ))}
                      </div>

                      {resultat.optimisation_decoupe?.resume && (
                        <div className="mt-5 p-4 rounded-xl" style={{ background: '#F0FBF0', border: '1px solid #B2DFBB' }}>
                          <p className="text-xs font-bold mb-1" style={{ color: '#2E7D32' }}>✂️ Optimisation découpe</p>
                          <p className="text-xs leading-relaxed" style={{ color: '#3D5468' }}>{resultat.optimisation_decoupe.resume}</p>
                        </div>
                      )}

                      <details className="mt-5">
                        <summary className="text-xs cursor-pointer select-none hover:underline" style={{ color: '#7A90A4' }}>Paramètres de calcul ↓</summary>
                        <div className="mt-3 grid grid-cols-2 gap-1.5 pl-4" style={{ borderLeft: '2px solid #E8EEF3' }}>
                          {Object.entries(resultat.parametres_calcul || {}).map(([k, v]) => (
                            <div key={k} className="text-xs">
                              <span style={{ color: '#7A90A4' }}>{k.replace(/_/g, ' ')}</span>{' '}
                              <span className="font-semibold" style={{ color: '#3D5468' }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>

                    {/* 3. Plan SVG */}
                    <div className="animate-fade-up delay-100 card p-7">
                      <PlanTerrasse largeur={resultat.projet.largeur} longueur={resultat.projet.longueur} plan={resultat.plan} />
                    </div>

                    {/* 4. Comparateur */}
                    <div className="animate-fade-up delay-200 card p-7">
                      <PriceComparator comparateur_prix={resultat.comparateur_prix} />
                    </div>
                  </>
                )}
              </section>
            </div>
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
}
