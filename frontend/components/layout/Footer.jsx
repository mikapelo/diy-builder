'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1C1B', color: '#f1f1ef' }} className="mt-0">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">

        {/* Top row: Logo + Links */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12 pb-12 border-b border-white/5">

          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo-diy-builder.png"
                alt="DIY Builder"
                width={62}
                height={62}
                style={{ objectFit: 'contain' }}
              />
              <span className="text-lg font-semibold tracking-tight font-headline">DIY Builder</span>
            </div>
            <p className="text-white/70 max-w-xs text-sm leading-relaxed">
              Simulateur de construction bois gratuit. Calculez vos matériaux, visualisez en 3D, exportez vos plans.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16 flex-wrap">
            {/* Simulateurs */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-4 text-white">Simulateurs</h4>
              <ul className="space-y-2.5">
                <li><a className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/calculateur">Terrasse bois</a></li>
                <li><a className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/cabanon">Cabanon ossature</a></li>
                <li><a className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/pergola">Pergola</a></li>
                <li><a className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/cloture">Clôture bois</a></li>
              </ul>
            </div>

            {/* Fonctionnalités */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-4 text-white">Fonctionnalités</h4>
              <ul className="space-y-2.5">
                <li><span className="text-white/60 text-sm">Calcul matériaux</span></li>
                <li><span className="text-white/60 text-sm">Vue 3D interactive</span></li>
                <li><span className="text-white/60 text-sm">Export PDF technique</span></li>
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-4 text-white">Ressources</h4>
              <ul className="space-y-2.5">
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/guides">Guides bricolage</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/guides/terrasse">Guide terrasse</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/guides/cabanon">Guide cabanon</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/guides/pergola">Guide pergola</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/guides/cloture">Guide clôture</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/faq">FAQ</Link></li>
              </ul>
            </div>

            {/* Informations légales */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-4 text-white">Informations légales</h4>
              <ul className="space-y-2.5">
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/mentions-legales">Mentions légales</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/politique-confidentialite">Confidentialité</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/cgv">CGU</Link></li>
                <li><Link className="text-white/60 hover:text-white text-sm transition-colors duration-200" href="/cookies">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row: Legal + Status */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[11px] uppercase tracking-[.12em] text-white/60 font-semibold">
            DIY Builder — Simulateur gratuit de construction bois
          </div>
          <div className="flex items-center gap-2">
            <div aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[.12em] text-white/60 font-semibold">Opérationnel</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
