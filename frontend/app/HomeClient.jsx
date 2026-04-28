'use client';

import { useState, useEffect } from 'react';

import Header        from '../components/layout/Header';
import Footer        from '../components/layout/Footer';
import HeroSection   from '../components/features/shared/HeroSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const revealRef = useScrollReveal();

  if (!mounted) return null;

  return (
    <div className="min-h-screen" data-theme="g-v2" data-page="landing">

      <Header view="home" />

      <div ref={revealRef} className="animate-fade-in">
        <HeroSection />
      </div>

      <Footer />
    </div>
  );
}
