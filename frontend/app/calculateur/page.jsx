'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header       from '@/components/layout/Header';
import Footer       from '@/components/layout/Footer';
import ProjectSwitch from '@/components/ui/ProjectSwitch';
import ModuleHeader  from '@/components/ui/ModuleHeader';
import StructuralDisclaimer from '@/components/ui/StructuralDisclaimer';
import DeckSimulator from '@/components/simulator/DeckSimulator';
import JsonLd     from '@/components/ui/JsonLd';

export default function CalculateurPage() {
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
      <JsonLd data={JSON.parse('{"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Calculateur terrasse bois gratuit", "description": "Calculez gratuitement les matériaux et le coût de votre terrasse bois. Visualisation 3D, liste de matériaux et comparatif des enseignes inclus.", "url": "https://diy-builder.fr/calculateur", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}, "keywords": "calculateur terrasse bois, devis terrasse bois, matériaux terrasse bois", "inLanguage": "fr-FR", "author": {"@type": "Organization", "name": "DIY Builder", "url": "https://diy-builder.fr"}}')} />
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
        <ModuleHeader projectType="terrasse">
          <StructuralDisclaimer projectType="terrasse" />
        </ModuleHeader>
      </div>
      <main className="calculator-page">
        <DeckSimulator />
      </main>
      <Footer />
    </div>
  );
}
