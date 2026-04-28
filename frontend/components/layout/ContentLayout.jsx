'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * ContentLayout — Wrapper pour les pages de contenu (guides, FAQ, légales).
 * Fournit le Header et Footer du site avec des props neutres.
 */
export default function ContentLayout({ children }) {
  const router = useRouter();

  return (
    <>
      <Header
        view="content"
        resultat={false}
        copied={false}
        onRetour={() => router.push('/')}
        onCopierLien={() => {}}
        onCalculer={() => router.push('/calculateur')}
      />
      <main className="content-page">
        {children}
      </main>
      <Footer />
    </>
  );
}
