'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header        from '@/components/layout/Header';
import Footer        from '@/components/layout/Footer';
import ProjectSwitch from '@/components/ui/ProjectSwitch';
import ModuleHeader  from '@/components/ui/ModuleHeader';
import StructuralDisclaimer from '@/components/ui/StructuralDisclaimer';
import DeckSimulator from '@/components/simulator/DeckSimulator';
import JsonLd     from '@/components/ui/JsonLd';

export default function CloturePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopierLien = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="min-h-screen" data-theme="g-v2" style={{ background: 'var(--surface)' }}>
      <JsonLd data={JSON.parse('{"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Simulateur clôture bois gratuit", "description": "Calculez les matériaux pour votre clôture bois : poteaux, rails, lames. Visualisation 3D et comparatif des prix en magasin.", "url": "https://diy-builder.fr/cloture", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}, "keywords": "simulateur clôture bois, calculateur clôture, matériaux clôture bois", "inLanguage": "fr-FR", "author": {"@type": "Organization", "name": "DIY Builder", "url": "https://diy-builder.fr"}}')} />
      <Header
        view="module"
        resultat={true}
        copied={copied}
        onRetour={() => router.push('/')}
        onCopierLien={handleCopierLien}
        onCalculer={() => {}}
      />
      <div className="sim-page-zone">
        <ProjectSwitch />
        <ModuleHeader projectType="cloture">
          <StructuralDisclaimer projectType="cloture" />
        </ModuleHeader>
      </div>
      <main className="calculator-page">
        <DeckSimulator projectType="cloture" />
      </main>
      <Footer />
    </div>
  );
}
