'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header        from '@/components/layout/Header';
import Footer        from '@/components/layout/Footer';
import ProjectSwitch from '@/components/ui/ProjectSwitch';
import ModuleHeader  from '@/components/ui/ModuleHeader';
import StructuralDisclaimer from '@/components/ui/StructuralDisclaimer';
import DeckSimulator from '@/components/simulator/DeckSimulator';

export default function CabanonPage() {
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
        <ModuleHeader projectType="cabanon">
          <StructuralDisclaimer projectType="cabanon" />
        </ModuleHeader>
      </div>
      <main className="calculator-page">
        <DeckSimulator projectType="cabanon" />
      </main>
      <Footer />
    </div>
  );
}
