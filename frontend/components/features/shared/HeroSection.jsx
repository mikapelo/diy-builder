'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// V6 CSS styles are in globals.css (lines 2940+)

/* ═══════════════════════════════════════════════════════════
   PROJECTS DATA
═══════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    title: 'Terrasse 4.5 × 3.0 m',
    image: '/illustrations/hero/terrassehero.png',
    dimH: '4.5 m', dimV: '3.0 m',
    bom: ['Lames terrasse', 'Lambourdes', 'Plots béton', 'Vis inox'],
    qty: ['42', '18', '15', '380'],
    dotColors: ['#C9971E', '#7A6B4E', '#9E9E9E', '#B0BEC5'],
    price: '663€',
    loss: 'Pertes 3.2%',
    wood: 'Pin sylvestre', woodclass: 'Classe 4 — autoclave',
    woodColor: 'linear-gradient(145deg, #C4A265 0%, #B8944F 40%, #A3803E 100%)',
    stats: [
      { val: 13.5, display: '13.5', unit: 'm²', decimals: 1 },
      { val: 663, display: '663', unit: '€', green: true, decimals: 0 },
      { val: 3.2, display: '3.2', unit: '%', prefix: '< ', decimals: 1 },
    ],
    statLabels: ['Surface', 'Meilleur prix', 'Pertes'],
  },
  {
    title: 'Cabanon 3.0 × 2.5 m',
    image: '/illustrations/hero/cabanonhero.png',
    dimH: '3.0 m', dimV: '2.5 m',
    bom: ['Montants ossature', 'Lisses bois', 'Bardage', 'Vis structure'],
    qty: ['28', '12', '24 m²', '420'],
    dotColors: ['#C9971E', '#7A6B4E', '#9E9E9E', '#B0BEC5'],
    price: '1 240€',
    loss: 'Pertes 3.8%',
    wood: 'Épicéa', woodclass: 'Classe 2 — traité',
    woodColor: 'linear-gradient(145deg, #D4B896 0%, #C4A87A 40%, #B8985C 100%)',
    stats: [
      { val: 8.3, display: '8.3', unit: 'm²', decimals: 1 },
      { val: 1240, display: '1 240', unit: '€', green: true, decimals: 0 },
      { val: 3.8, display: '3.8', unit: '%', prefix: '< ', decimals: 1 },
    ],
    statLabels: ['Surface', 'Meilleur prix', 'Pertes'],
  },
  {
    title: 'Pergola 4.0 × 3.0 m',
    image: '/illustrations/hero/pergolahero.png',
    dimH: '4.0 m', dimV: '3.0 m',
    bom: ['Poteaux bois', 'Traverses', 'Chevrons', 'Boulonnerie'],
    qty: ['4', '6', '12', '48'],
    dotColors: ['#C9971E', '#7A6B4E', '#9E9E9E', '#B0BEC5'],
    price: '890€',
    loss: 'Pertes 2.5%',
    wood: 'Douglas', woodclass: 'Classe 3 — naturel',
    woodColor: 'linear-gradient(145deg, #A0785A 0%, #8F6B4F 40%, #7D5E44 100%)',
    stats: [
      { val: 12.0, display: '12.0', unit: 'm²', decimals: 1 },
      { val: 890, display: '890', unit: '€', green: true, decimals: 0 },
      { val: 2.5, display: '2.5', unit: '%', prefix: '< ', decimals: 1 },
    ],
    statLabels: ['Surface', 'Meilleur prix', 'Pertes'],
  },
  {
    title: 'Clôture 18 ml',
    image: '/illustrations/hero/cloturehero.png',
    dimH: '18 ml', dimV: '1.8 m',
    bom: ['Poteaux', 'Lames clôture', 'Lisses horiz.', 'Vis inox'],
    qty: ['10', '90', '20', '540'],
    dotColors: ['#C9971E', '#7A6B4E', '#9E9E9E', '#B0BEC5'],
    price: '520€',
    loss: 'Pertes 4.1%',
    wood: 'Pin autoclave', woodclass: 'Classe 4 — contact sol',
    woodColor: 'linear-gradient(145deg, #9B8B6E 0%, #8A7A5E 40%, #766A50 100%)',
    stats: [
      { val: 18, display: '18', unit: 'm lin.', decimals: 0 },
      { val: 520, display: '520', unit: '€', green: true, decimals: 0 },
      { val: 4.1, display: '4.1', unit: '%', prefix: '< ', decimals: 1 },
    ],
    statLabels: ['Surface', 'Meilleur prix', 'Pertes'],
  },
];

/* ═══════════════════════════════════════════════════════════
   SOCIAL PROOF — stagger carousel (logique vaib215/21st.dev)
═══════════════════════════════════════════════════════════ */

// Diagonale du coin coupé : sqrt(50² + 50²)
const SQRT_5000 = Math.sqrt(5000);

const TESTIMONIALS = [
  {
    quote: "J'avais mon devis matériaux précis avant même d'appeler. L'artisan a respecté le budget à 40 € près.",
    name: 'Sophie M.',
    city: 'Lyon',
    project: 'Terrasse 18 m²',
    initial: 'S',
    color: '#2D6A4F',
  },
  {
    quote: '2 minutes pour le calcul, artisan trouvé le lendemain. Chantier terminé en 3 jours, nickel.',
    name: 'Marc D.',
    city: 'Bordeaux',
    project: 'Cabanon 9 m²',
    initial: 'M',
    color: '#8B5E3C',
  },
  {
    quote: "Je voulais faire moi-même, puis j'ai vu les devis artisan. Prix quasi identique, sans le risque.",
    name: 'Lucie T.',
    city: 'Nantes',
    project: 'Pergola bois',
    initial: 'L',
    color: '#5A5E8B',
  },
  {
    quote: "Le simulateur m'a montré exactement combien de lames il fallait. Zéro gaspillage, zéro aller-retour en magasin.",
    name: 'Thomas B.',
    city: 'Toulouse',
    project: 'Clôture 24 m',
    initial: 'T',
    color: '#7B4B8B',
  },
  {
    quote: "J'ai partagé le lien du devis à l'artisan directement. Il a dit que c'était la première fois qu'un client arrivait aussi préparé.",
    name: 'Émilie R.',
    city: 'Strasbourg',
    project: 'Terrasse 22 m²',
    initial: 'É',
    color: '#3C6B8B',
  },
  {
    quote: "On a comparé trois artisans avec le même cahier des charges généré ici. Choix facile, devis transparent.",
    name: 'Karim A.',
    city: 'Montpellier',
    project: 'Pergola 12 m²',
    initial: 'K',
    color: '#6B4B2D',
  },
];

/* ─── SocialCarousel — logique exacte vaib215 ─── */
function SocialCarousel() {
  const [cardSize, setCardSize] = useState(340);
  const [list, setList] = useState(() =>
    TESTIMONIALS.map((t, i) => ({ ...t, tempId: i }))
  );

  useEffect(() => {
    function updateSize() {
      setCardSize(window.matchMedia('(min-width: 640px)').matches ? 340 : 270);
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMove = useCallback((steps) => {
    if (steps === 0) return;
    setList((prev) => {
      const arr = [...prev];
      if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          const item = arr.shift();
          if (!item) return prev;
          arr.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = 0; i < Math.abs(steps); i++) {
          const item = arr.pop();
          if (!item) return prev;
          arr.unshift({ ...item, tempId: Math.random() });
        }
      }
      return arr;
    });
  }, []);

  const n = list.length;

  return (
    <div className="v6-social-carousel-wrap">
      <div className="v6-social-carousel">
        {list.map((item, index) => {
          const position = n % 2
            ? index - (n + 1) / 2
            : index - n / 2;
          const isCenter = position === 0;
          return (
            <div
              key={item.tempId}
              className={`v6-social-card${isCenter ? ' v6-social-card--active' : ''}`}
              onClick={() => handleMove(position)}
              style={{
                width: cardSize,
                height: cardSize,
                clipPath: 'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
                transform: `
                  translate(-50%, -50%)
                  translateX(${(cardSize / 1.5) * position}px)
                  translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
                  rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
                `,
                boxShadow: isCenter ? '0px 8px 0px 4px rgba(0,0,0,0.5)' : 'none',
                zIndex: isCenter ? 10 : 0,
              }}
            >
              {/* Ligne diagonale du coin coupé (top-right) */}
              <span
                className="v6-social-card-cut"
                style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
              />
              {/* Avatar carré (comme une photo de profil) */}
              <div className="v6-social-avatar" style={{ background: item.color }}>
                {item.initial}
              </div>
              {/* Citation */}
              <blockquote className="v6-social-quote">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              {/* Auteur — positionné en bas absolu */}
              <p className="v6-social-by">
                — {item.name} · <span>{item.city}</span>
              </p>
              <p className="v6-social-project">{item.project}</p>
            </div>
          );
        })}
      </div>

      {/* Boutons de navigation — carrés comme la référence */}
      <div className="v6-social-nav">
        <button className="v6-social-nav-btn" onClick={() => handleMove(-1)} aria-label="Témoignage précédent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button className="v6-social-nav-btn" onClick={() => handleMove(1)} aria-label="Témoignage suivant">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   P1 — COUNT-UP HOOK — smooth number animation
═══════════════════════════════════════════════════════════ */
function useCountUp(targetVal, decimals = 0, duration = 700, trigger) {
  const [display, setDisplay] = useState(targetVal);
  const rafRef = useRef(null);
  const prevRef = useRef(targetVal);

  useEffect(() => {
    const from = prevRef.current;
    const to = targetVal;
    prevRef.current = to;
    if (from === to) return;

    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = ease(progress);
      const current = from + (to - from) * eased;
      setDisplay(Number(current.toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [targetVal, trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}

/* ═══════════════════════════════════════════════════════════
   COUNT-UP STAT — reusable component
═══════════════════════════════════════════════════════════ */
function CountUpStat({ stat, trigger }) {
  const value = useCountUp(stat.val, stat.decimals, 700, trigger);

  // Format with space thousands separator for large numbers
  const formatted = useMemo(() => {
    const str = stat.decimals > 0 ? value.toFixed(stat.decimals) : String(Math.round(value));
    // Add space thousands separator
    if (Math.abs(value) >= 1000) {
      const parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts.join('.');
    }
    return str;
  }, [value, stat.decimals]);

  return (
    <span className="v6-stat-val" style={stat.green ? { color: '#2B8A57' } : {}}>
      {stat.prefix || ''}{formatted}
      <span className="v6-stat-unit">{stat.unit}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER HOOK — character-by-character animation
═══════════════════════════════════════════════════════════ */
function useTypewriter(text, speed = 40, trigger, delay = 0) {
  const [displayed, setDisplayed] = useState(text);
  const timerRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (delayRef.current) clearTimeout(delayRef.current);
    let i = 0;
    setDisplayed('');

    // P6 — stagger delay per satellite
    delayRef.current = setTimeout(() => {
      timerRef.current = setInterval(() => {
        i++;
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
        } else {
          clearInterval(timerRef.current);
        }
      }, speed);
    }, delay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, [text, trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER SPAN — reusable component
═══════════════════════════════════════════════════════════ */
function TypewriterSpan({ text, speed = 40, trigger, delay = 0, style, className }) {
  const displayed = useTypewriter(text, speed, trigger, delay);
  return <span style={style} className={className}>{displayed}</span>;
}

/* ═══════════════════════════════════════════════════════════
   P3 — PARALLAX HOOK — ultra-light mouse tracking
═══════════════════════════════════════════════════════════ */
function useParallax(containerRef) {
  const pos = useRef({ x: 0, y: 0 });       // current interpolated
  const target = useRef({ x: 0, y: 0 });     // mouse target
  const raf = useRef(null);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Normalized -1 to 1
      target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.06);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.06);
      raf.current = requestAnimationFrame(tick);
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave, { passive: true });
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (el) {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      }
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return pos;
}

/* ═══════════════════════════════════════════════════════════
   PARALLAX LAYER — applies transform from shared position
═══════════════════════════════════════════════════════════ */
function ParallaxLayer({ parallax, factor = 1, children, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (ref.current && parallax.current) {
        const x = parallax.current.x * factor;
        const y = parallax.current.y * factor;
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parallax, factor]);

  return <div ref={ref} className={className} style={{ ...style, willChange: 'transform' }}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function HeroSection({ onCalculer }) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef(null);
  const heroRef = useRef(null);

  const current = PROJECTS[currentIdx];

  // P3 — parallax position
  const parallax = useParallax(heroRef);

  // ── Scroll-snap activation on html ──
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y proximity';
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollSnapType = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // ── Panel intersection observer (DOM-based) + P5 corner marks ──
  useEffect(() => {
    const sections = document.querySelectorAll('.v6-panel-section');
    if (!sections.length) return;

    // Use multiple thresholds so we get frequent updates
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.02) {
          entry.target.classList.add('panel-active', 'v6-in-view');
        } else {
          if (entry.target.id !== 'v6-hero') {
            entry.target.classList.remove('panel-active', 'v6-in-view');
          }
        }
      });
    }, {
      threshold: [0, 0.02, 0.05, 0.1, 0.2],
      // Extend detection zone 5% beyond viewport top/bottom
      rootMargin: '5% 0px 5% 0px'
    });

    sections.forEach((s) => observer.observe(s));

    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  // ── Stats testimonial reveal (one-shot, never removed) ──
  const testiGridRef = useRef(null);
  useEffect(() => {
    const el = testiGridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('v6-testi-revealed');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ═══ V10 INTERACTIVE ENHANCEMENTS ═══

  // [T1-3] Spotlight — warm gold radial follows cursor in hero
  const spotlightRef = useRef(null);
  useEffect(() => {
    const hero = heroRef.current;
    const sp = spotlightRef.current;
    if (!hero || !sp) return;
    function onMove(e) {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      sp.style.background =
        `radial-gradient(600px circle at ${x}% ${y}%, rgba(201,151,30,.045) 0%, rgba(201,151,30,.015) 35%, transparent 65%)`;
    }
    hero.addEventListener('mousemove', onMove, { passive: true });
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  // [T1-4] Card tilt — hero card tilts ±5° following cursor
  const cardTiltRef = useRef(null);
  useEffect(() => {
    const card = cardTiltRef.current;
    if (!card) return;
    function onMove(e) {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) scale(1.005)`;
    }
    function onLeave() { card.style.transform = ''; }
    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, []);

  // [T1-6] Tilt on bento + stat items
  useEffect(() => {
    const items = document.querySelectorAll('.v6-bento-card, .v6-stat-item');
    function onMove(e) {
      const r = this.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      this.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-2px)`;
    }
    function onLeave() { this.style.transform = 'perspective(600px)'; }
    items.forEach((el) => {
      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave);
    });
    return () => items.forEach((el) => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    });
  }, []);

  // [T2-7][T2-8] Stagger reveal for bento cards + stat items
  useEffect(() => {
    const items = document.querySelectorAll('.v6-bento-card, .v6-stat-item');
    items.forEach((el) => el.classList.add('v6-stagger-item'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(entry.target.parentElement.children).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('v6-revealed'), idx * 120);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => obs.observe(el));
    return () => items.forEach((el) => obs.unobserve(el));
  }, []);

  // [T2-10] Active nav section tracking
  useEffect(() => {
    const sectionIds = ['v6-hero', 'v6-bento', 'v6-stats'];
    const navLinks = document.querySelectorAll('.v6-header-nav-link');
    const linkMap = {};
    navLinks.forEach((link) => {
      const onClick = link.getAttribute('data-section') || link.textContent.trim();
      sectionIds.forEach((id) => {
        if (id === 'v6-hero' && onClick.includes('Projets')) linkMap[id] = link;
        if (id === 'v6-bento' && onClick.includes('marche')) linkMap[id] = link;
        if (id === 'v6-stats' && onClick.includes('Technique')) linkMap[id] = link;
      });
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          navLinks.forEach((l) => l.classList.remove('v6-nav-active'));
          if (linkMap[entry.target.id]) linkMap[entry.target.id].classList.add('v6-nav-active');
        }
      });
    }, { threshold: [0.3] });
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) obs.unobserve(el); });
  }, []);

  // [T2-11] Scroll progress bar
  const scrollProgressRef = useRef(null);
  useEffect(() => {
    function onScroll() {
      const bar = scrollProgressRef.current;
      if (!bar) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? `${(window.scrollY / h * 100)}%` : '0%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // [T3-16] Scroll-Y parallax on ghost text + halos
  const ghostRef = useRef(null);
  const lightConeRef = useRef(null);
  const coldHaloRef = useRef(null);
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (ghostRef.current) ghostRef.current.style.transform = `translateY(${y * 0.15}px)`;
      if (lightConeRef.current) lightConeRef.current.style.transform = `translateY(calc(-48% + ${y * 0.08}px))`;
      if (coldHaloRef.current) coldHaloRef.current.style.transform = `translateY(calc(-46% + ${y * 0.06}px))`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // [T3-13] Typewriter caret — show on project change, hide after 3s
  const [caretVisible, setCaretVisible] = useState(true);
  useEffect(() => {
    setCaretVisible(true);
    const t = setTimeout(() => setCaretVisible(false), 3000);
    return () => clearTimeout(t);
  }, [currentIdx]);

  // ── Project rotation timer ──
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isHovering) {
        setCurrentIdx((prev) => {
          const next = (prev + 1) % PROJECTS.length;
          setProgressKey((k) => k + 1);
          return next;
        });
      }
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isHovering]);

  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    if (!showProjectMenu) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProjectMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProjectMenu]);

  const PROJECT_LINKS = [
    { id: 'terrasse', label: 'Terrasse bois',  href: '/calculateur' },
    { id: 'cabanon',  label: 'Cabanon bois',   href: '/cabanon' },
    { id: 'pergola',  label: 'Pergola bois',   href: '/pergola' },
    { id: 'cloture',  label: 'Clôture bois',   href: '/cloture' },
  ];

  const handleCalculer = useCallback(() => {
    if (onCalculer) onCalculer();
    else setShowProjectMenu(prev => !prev);
  }, [onCalculer]);

  /* CTA de la section témoignages : scroll vers le hero, puis ouvre la roue */
  const handleSocialCTA = useCallback(() => {
    const heroEl = document.getElementById('v6-hero');
    if (heroEl) {
      const html = document.documentElement;
      html.style.scrollSnapType = 'none';
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        html.style.scrollSnapType = 'y mandatory';
        setShowProjectMenu(true);
      }, 500);
    } else {
      setShowProjectMenu(true);
    }
  }, []);

  return (
    <div style={{ background: '#0E0F10' }}>
      {/* [T2-11] Scroll progress bar */}
      <div className="v6-scroll-progress" ref={scrollProgressRef} />

      {/* Google Fonts — Instrument Serif (editorial accent) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        rel="stylesheet"
      />

      {/* ══════════════════════════════════════
           HERO
      ══════════════════════════════════════ */}
      <section className="v6-panel-section panel-active v6-in-view" id="v6-hero" ref={heroRef}>
        <div className="v6-hero-inner">
          {/* Background layers — with parallax */}
          {/* P3: BÂTIR deepest layer, moves opposite, very subtle */}
          {/* [T3-16] ghostRef for scroll-Y parallax */}
          <ParallaxLayer parallax={parallax} factor={-4} className="v6-giant-text">
            <span ref={ghostRef}>BÂTIR</span>
          </ParallaxLayer>

          {/* P4: Breathing halos — CSS animation added via class */}
          <ParallaxLayer parallax={parallax} factor={-3}>
            <div className="v6-hero-mass" />
          </ParallaxLayer>
          <ParallaxLayer parallax={parallax} factor={-2}>
            <div className="v6-light-cone v6-breathe-warm" ref={lightConeRef} />
          </ParallaxLayer>
          <ParallaxLayer parallax={parallax} factor={-1.5}>
            <div className="v6-cold-halo v6-breathe-cold" ref={coldHaloRef} />
          </ParallaxLayer>

          {/* [T1-3] Spotlight — warm gold follows cursor */}
          <div className="v6-hero-spotlight" ref={spotlightRef} />

          <div className="v6-hero-grid" />
          <div className="v6-guideline h" style={{ top: '36%' }} />
          <div className="v6-guideline h" style={{ top: '64%' }} />
          <div className="v6-guideline v" style={{ left: '50%' }} />

          <div className="v6-hero-content">
            {/* LEFT — Editorial text composition */}
            <div className="v6-hero-text">
              {/* Eyebrow — with index number for editorial feel */}
              <div className="v6-eyebrow">
                <span className="v6-eyebrow-idx">01</span>
                <span className="v6-eyebrow-sep" />
                Simulateur de projets
              </div>

              {/* H1 — weight triangle: L1 commanding, L2 serif climax, L3 resolution */}
              <h1 className="v6-hero-title">
                <span className="v6-title-line v6-title-l1">Calculez</span>
                <span className="v6-title-line v6-title-l2"><span className="accent">précisément</span></span>
                <span className="v6-title-line v6-title-l3">vos matériaux bois</span>
              </h1>

              {/* Artisan tagline — sous le H1 */}
              <div className="v6-hero-artisan-tag">
                <span className="v6-hero-artisan-dot" />
                Obtenez un devis artisan local
              </div>

              {/* Subtitle — two-tier editorial hierarchy */}
              <div className="v6-hero-sub-group">
                <p className="v6-hero-sub-lead">
                  Dimensions, découpes optimisées, prix comparés chez trois enseignes.
                </p>
                <p className="v6-hero-sub-note">
                  Résultat en 30 secondes — dossier PDF + mise en relation artisan inclus.
                </p>
              </div>

              {/* CTA — stacked composition with subtle separator */}
              <div className="v6-hero-actions">
                <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
                  <button className="v6-btn-primary" onClick={handleCalculer}>
                    Lancer un projet
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {showProjectMenu
                        ? <path d="M18 15l-6-6-6 6"/>
                        : <path d="M6 9l6 6 6-6"/>}
                    </svg>
                  </button>

                  {showProjectMenu && (
                    <>
                      <div className="v6-wheel-scrim" onClick={() => setShowProjectMenu(false)} />
                      <div className="v6-project-wheel open">
                        {PROJECT_LINKS.map((p, i) => (
                          <button
                            key={p.id}
                            className="v6-wheel-item"
                            onClick={() => { setShowProjectMenu(false); router.push(p.href); }}
                          >
                            <span className="v6-wheel-idx">0{i + 1}</span>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <span className="v6-actions-sep" />
                <button className="v6-btn-secondary"
                  onClick={() => {
                    const el = document.getElementById('v6-bento');
                    if (!el) return;
                    const html = document.documentElement;
                    const y = el.getBoundingClientRect().top + window.scrollY;
                    el.classList.add('panel-active', 'v6-in-view');
                    html.style.scrollSnapType = 'none';
                    window.scrollTo({ top: y, behavior: 'instant' });
                    setTimeout(() => { html.style.scrollSnapType = 'y proximity'; }, 100);
                  }}>
                  Comment ça marche
                </button>
              </div>

              {/* Proofs — editorial inline with numbers, no icons */}
              <div className="v6-proofs">
                {[
                  { val: '4', label: 'simulateurs' },
                  { val: '<5%', label: 'de pertes' },
                  { val: '48h', label: 'devis artisan' },
                ].map((p, i) => (
                  <div className="v6-proof" key={i}>
                    <span className="v6-proof-val">{p.val}</span>
                    <span className="v6-proof-label">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Showcase */}
            <div className="v6-showcase"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Dim labels — P6 stagger delay */}
              {/* [T3-13] Dim labels with typewriter caret */}
              <ParallaxLayer parallax={parallax} factor={5} className="v6-dim-label h-line" style={{ bottom: '4%', left: '10%', position: 'absolute' }}>
                <TypewriterSpan text={current.dimH} speed={80} trigger={currentIdx} delay={0} />
                <span className={`v6-tw-caret ${caretVisible ? '' : 'v6-caret-hidden'}`} />
              </ParallaxLayer>
              <ParallaxLayer parallax={parallax} factor={5} className="v6-dim-label v-line" style={{ right: '-4%', top: '20%', position: 'absolute' }}>
                <TypewriterSpan text={current.dimV} speed={80} trigger={currentIdx} delay={60} />
                <span className={`v6-tw-caret ${caretVisible ? '' : 'v6-caret-hidden'}`} />
              </ParallaxLayer>

              {/* Satellite BOM — P3 parallax + P6 stagger */}
              <ParallaxLayer parallax={parallax} factor={6} className="v6-float v6-float-bom" style={{ position: 'absolute' }}>
                <div className="v6-float-bom-header">Nomenclature</div>
                {current.bom.map((item, i) => (
                  <div className="v6-float-bom-row" key={i}>
                    <div className="v6-float-bom-dot" style={{ background: current.dotColors[i] }} />
                    <TypewriterSpan text={item} speed={55} trigger={currentIdx} delay={i * 80}
                      className="v6-float-bom-name" />
                    <TypewriterSpan text={current.qty[i]} speed={80} trigger={currentIdx} delay={i * 80 + 200}
                      className="v6-float-bom-qty" />
                  </div>
                ))}
              </ParallaxLayer>

              {/* Satellite Price */}
              <ParallaxLayer parallax={parallax} factor={7} className="v6-float v6-float-price" style={{ position: 'absolute' }}>
                <TypewriterSpan text={current.price} speed={90} trigger={currentIdx} delay={150}
                  className="v6-float-price-amount"
                  style={{ fontSize: 26, fontWeight: 900, color: 'var(--v6-green)', letterSpacing: '-.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--v6-text)' }}>Brico Dépôt</div>
                  <div style={{ fontSize: 10, color: 'var(--v6-text-3)', fontWeight: 500 }}>Meilleur prix</div>
                </div>
              </ParallaxLayer>

              {/* Satellite Optim */}
              <ParallaxLayer parallax={parallax} factor={5} className="v6-float v6-float-optim" style={{ position: 'absolute' }}>
                <div className="v6-float-optim-icon">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <TypewriterSpan text={current.loss} speed={60} trigger={currentIdx} delay={100}
                    className="v6-float-optim-text" />
                  <div className="v6-float-optim-sub">Découpes optimisées</div>
                </div>
              </ParallaxLayer>

              {/* Satellite Wood */}
              <ParallaxLayer parallax={parallax} factor={4} className="v6-float v6-float-wood" style={{ position: 'absolute' }}>
                <div className="v6-float-wood-swatch" style={{ background: current.woodColor }} />
                <div>
                  <TypewriterSpan text={current.wood} speed={65} trigger={currentIdx} delay={200}
                    className="v6-float-wood-name" />
                  <br />
                  <TypewriterSpan text={current.woodclass} speed={50} trigger={currentIdx} delay={300}
                    className="v6-float-wood-class" />
                </div>
              </ParallaxLayer>

              {/* Main card — P3 subtle parallax + [T1-4] tilt */}
              <ParallaxLayer parallax={parallax} factor={2} style={{ width: '100%', maxWidth: 580, zIndex: 2, position: 'relative' }}>
                <div className="v6-card" ref={cardTiltRef}>
                  <div className="v6-card-inner">
                    <div className="v6-card-header">
                      <div className="v6-card-header-left">
                        <div className="v6-card-dot" />
                        <span className="v6-card-title">{['Terrasse bois', 'Cabanon jardin', 'Pergola bois', 'Clôture bois'][currentIdx]}</span>
                      </div>
                      <span className="v6-card-badge">Optimisé</span>
                    </div>

                    {/* P2 — Crossfade + micro-blur on slides */}
                    <div className="v6-viewport">
                      <div className="v6-viewport-grid" />
                      <div className="v6-viewport-shadow" />
                      {PROJECTS.map((proj, idx) => (
                        <div key={idx} className={`v6-slide ${idx === currentIdx ? 'v6-slide-active' : 'v6-slide-blur'}`}>
                          <div className="v6-slide-visual v6-slide-visual--img">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="v6-slide-img"
                              draggable={false}
                              loading={idx === 0 ? 'eager' : 'lazy'}
                            />
                          </div>
                          {/* Label moved to card header */}
                        </div>
                      ))}
                    </div>

                    {/* Progress bars */}
                    <div className="v6-progress">
                      {PROJECTS.map((_, idx) => (
                        <div key={`${idx}-${progressKey}`} className={`v6-progress-bar ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx ? 'done' : ''}`}>
                          <div className="v6-progress-fill" />
                        </div>
                      ))}
                    </div>

                    {/* P1 — Stats with count-up animation */}
                    <div className="v6-card-stats">
                      {[0, 1, 2].map((statIdx) => (
                        <div className="v6-card-stat" key={statIdx}>
                          <div className="v6-stat-val-wrap v6-stat-countup">
                            <CountUpStat stat={current.stats[statIdx]} trigger={currentIdx} />
                          </div>
                          <div className="v6-stat-label">{PROJECTS[0].statLabels[statIdx]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </div>

        {/* P5 — Corner marks (gold reveal on active) */}
        <div className="v6-corner-marks">
          <span className="v6-corner v6-corner-tl" />
          <span className="v6-corner v6-corner-tr" />
          <span className="v6-corner v6-corner-bl" />
          <span className="v6-corner v6-corner-br" />
        </div>
      </section>

      {/* ══════════════════════════════════════
           BENTO
      ══════════════════════════════════════ */}
      <section className="v6-panel-section v6-bento" id="v6-bento">
        <div className="v6-corner-marks">
          <span className="v6-corner v6-corner-tl" />
          <span className="v6-corner v6-corner-tr" />
          <span className="v6-corner v6-corner-bl" />
          <span className="v6-corner v6-corner-br" />
        </div>
        <div className="v6-bento-inner">
          <div className="v6-bento-header">
            <div className="v6-bento-eyebrow">Mode d&apos;emploi</div>
            <h2 className="v6-bento-title">Trois étapes, <em>trente secondes</em></h2>
            <p className="v6-bento-sub">Du besoin au devis, sans prise de tête.</p>
          </div>
          <div className="v6-bento-grid v6-bento-grid--4col">
            {/* Card 01 */}
            <div className="v6-bento-card">
              <div className="v6-bento-num">01</div>
              <h3>Entrez vos dimensions</h3>
              <p>Largeur, longueur et type de bois. Rien de plus.</p>
              <div className="v6-bento-visual">
                <div style={{ width: '100%' }}>
                  <div className="v6-mini-slider-row">
                    <span className="v6-mini-slider-label">Largeur</span>
                    <div className="v6-mini-slider-track"><div className="v6-mini-slider-fill v6-fill--mustard" style={{ width: '75%' }} /></div>
                    <span className="v6-mini-slider-val">4.5 m</span>
                  </div>
                  <div className="v6-mini-slider-row">
                    <span className="v6-mini-slider-label">Profond.</span>
                    <div className="v6-mini-slider-track"><div className="v6-mini-slider-fill v6-fill--brique" style={{ width: '50%' }} /></div>
                    <span className="v6-mini-slider-val">3.0 m</span>
                  </div>
                  <div className="v6-mini-slider-row">
                    <span className="v6-mini-slider-label">Bois</span>
                    <div className="v6-mini-slider-track"><div className="v6-mini-slider-fill v6-fill--ivoire" style={{ width: '60%' }} /></div>
                    <span className="v6-mini-slider-val" style={{ fontSize: 10 }}>Pin CL4</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 02 */}
            <div className="v6-bento-card">
              <div className="v6-bento-num">02</div>
              <h3>Calcul automatique</h3>
              <p>L&apos;algorithme optimise les découpes et minimise les pertes.</p>
              <div className="v6-bento-visual">
                <div style={{ width: '100%' }}>
                  {[
                    { name: 'Lames terrasse', qty: '42', badge: true },
                    { name: 'Lambourdes', qty: '18' },
                    { name: 'Plots béton', qty: '15' },
                    { name: 'Vis inox', qty: '380' },
                    { name: 'Pertes', qty: '3.2%', accent: true },
                  ].map((r, i) => (
                    <div className="v6-mini-bom-row" key={i}>
                      <span className="v6-mini-bom-name">{r.name}</span>
                      <span className="v6-mini-bom-qty" style={r.accent ? { color: 'var(--g-mustard, #C9971E)' } : {}}>
                        {r.qty}{r.badge && <span className="v6-mini-bom-badge">optimisé</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Card 03 */}
            <div className="v6-bento-card">
              <div className="v6-bento-num">03</div>
              <h3>Comparez les prix</h3>
              <p>Prix comparés en temps réel chez 3 grandes enseignes.</p>
              <div className="v6-bento-visual">
                <div style={{ width: '100%' }}>
                  {[
                    { store: 'Brico Dépôt', w: '85%', cls: 'v6-fill--mustard', price: '663 €', best: true },
                    { store: 'Castorama', w: '90%', cls: 'v6-fill--brique', price: '691 €' },
                    { store: 'Leroy Merlin', w: '95%', cls: 'v6-fill--ivoire', price: '723 €' },
                  ].map((r, i) => (
                    <div className="v6-mini-compare-row" key={i}>
                      <span className="v6-mini-compare-store">{r.store}</span>
                      <div className="v6-mini-compare-bar">
                        <div className={`v6-mini-compare-fill ${r.cls}`} style={{ width: r.w }} />
                      </div>
                      <span className={`v6-mini-compare-price ${r.best ? 'v6-price--best' : ''}`}>
                        {r.price}
                      </span>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--g-mustard, #C9971E)' }}>↓ Économie : jusqu&apos;à 60 €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 04 — Artisan */}
            <div className="v6-bento-card v6-bento-card--artisan">
              <div className="v6-bento-num v6-bento-num--gold">04</div>
              <h3>Passez le relais</h3>
              <p>Votre cahier des charges est prêt. Un artisan local le prend en main.</p>
              <div className="v6-bento-visual">
                <div style={{ width: '100%' }}>
                  <div className="v6-mini-artisan-card">
                    <div className="v6-mini-artisan-avatar">JD</div>
                    <div className="v6-mini-artisan-info">
                      <div className="v6-mini-artisan-name">Jean D. · Charpentier</div>
                      <div className="v6-mini-artisan-loc">📍 Lyon — 4.9 ★</div>
                    </div>
                  </div>
                  <div className="v6-mini-artisan-status">
                    <span className="v6-mini-artisan-dot" />
                    Devis reçu en 24h
                  </div>
                  <div className="v6-mini-artisan-badge">
                    Cahier des charges inclus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
           ARTISAN BRIDGE
      ══════════════════════════════════════ */}
      <section className="v6-panel-section v6-artisan-bridge" id="v6-artisan">
        <div className="v6-corner-marks">
          <span className="v6-corner v6-corner-tl" />
          <span className="v6-corner v6-corner-tr" />
          <span className="v6-corner v6-corner-bl" />
          <span className="v6-corner v6-corner-br" />
        </div>
        <div className="v6-artisan-inner">
          <div className="v6-artisan-text">
            <div className="v6-eyebrow">
              <span className="v6-eyebrow-idx">03</span>
              <span className="v6-eyebrow-sep" />
              Mise en relation
            </div>
            <h2 className="v6-artisan-title">
              Calculé ici.{' '}
              <em>Réalisé par un pro.</em>
            </h2>
            <p className="v6-artisan-sub">
              Votre simulateur génère un cahier des charges complet — matériaux, coupes, budget. L&apos;artisan arrive préparé. Vous arrivez outillé.
            </p>
            <p className="v6-artisan-lead">
              La mise en relation se fait après simulation — <em>directement depuis votre projet calculé.</em>
            </p>
            <div className="v6-artisan-args">
              {[
                { icon: '✓', title: 'Artisans vérifiés', desc: 'Qualifiés RGE ou référencés Qualibat dans votre département' },
                { icon: '✓', title: 'Devis sous 48h', desc: 'Le cahier des charges est transmis automatiquement' },
                { icon: '✓', title: 'Zéro surprise', desc: 'Prix matériaux déjà calculés — l\'artisan chiffre uniquement la pose' },
              ].map((a, i) => (
                <div className="v6-artisan-arg" key={i}>
                  <span className="v6-artisan-check">{a.icon}</span>
                  <div>
                    <strong>{a.title}</strong>
                    <span>{a.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="v6-artisan-visual">
            <div className="v6-artisan-card-stack">
              {/* Carte artisan principale */}
              <div className="v6-artisan-profile-card">
                <div className="v6-artisan-profile-header">
                  <div className="v6-artisan-profile-avatar">M</div>
                  <div>
                    <div className="v6-artisan-profile-name">Marc Duval</div>
                    <div className="v6-artisan-profile-meta">Charpentier · Nantes</div>
                    <div className="v6-artisan-profile-stars">★★★★★ <span>4.9</span></div>
                  </div>
                </div>
                <div className="v6-artisan-profile-project">
                  <div className="v6-artisan-profile-label">Projet reçu</div>
                  <div className="v6-artisan-profile-project-name">Terrasse 13.5 m² — Pin CL4</div>
                  <div className="v6-artisan-profile-bom">42 lames · 18 lambourdes · 15 plots</div>
                </div>
                <div className="v6-artisan-profile-devis">
                  <span className="v6-artisan-profile-devis-label">Devis pose</span>
                  <span className="v6-artisan-profile-devis-amount">1 200 €</span>
                </div>
              </div>
              {/* Badge "cahier des charges transmis" */}
              <div className="v6-artisan-badge-float">
                <span className="v6-artisan-badge-dot" />
                Cahier des charges transmis
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
           STATS — testimonial masonry style
      ══════════════════════════════════════ */}
      <section className="v6-panel-section" id="v6-stats">
        <div className="v6-corner-marks">
          <span className="v6-corner v6-corner-tl" />
          <span className="v6-corner v6-corner-tr" />
          <span className="v6-corner v6-corner-bl" />
          <span className="v6-corner v6-corner-br" />
        </div>
        <div className="v6-stats-inner">
          <div className="v6-stats-glow" />
          <div className="v6-stats-sep" />

          {/* ── Testimonial-style masonry grid ── */}
          <div className="v6-testi-grid" ref={testiGridRef}>
            {/* Column 1 */}
            <div className="v6-testi-col">
              <div className="v6-testi-card v6-testi-card--pattern v6-testi-tall">
                <div className="v6-testi-grid-overlay" />
                <div className="v6-testi-body">
                  <div className="v6-testi-eyebrow">En chiffres</div>
                  <h2 className="v6-testi-headline">Un outil <em>précis</em> et rapide</h2>
                  <p className="v6-testi-context">Calculs basés sur les sections et entraxes standards du bois de construction</p>
                </div>
              </div>
              <div className="v6-testi-card v6-testi-card--accent v6-testi-short">
                <div className="v6-testi-body">
                  <div className="v6-testi-val">&lt;5%</div>
                  <div className="v6-testi-lbl">Perte matériaux</div>
                  <div className="v6-testi-sub">Optimisation automatique des découpes</div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="v6-testi-col">
              <div className="v6-testi-card v6-testi-card--dark">
                <div className="v6-testi-body">
                  <div className="v6-testi-val">4</div>
                  <div className="v6-testi-lbl">Simulateurs</div>
                  <div className="v6-testi-sub">Terrasse, cabanon, pergola, clôture</div>
                </div>
              </div>
              <div className="v6-testi-card v6-testi-card--dark">
                <div className="v6-testi-body">
                  <div className="v6-testi-val">4p.</div>
                  <div className="v6-testi-lbl">Export PDF</div>
                  <div className="v6-testi-sub">Plans, coupes et nomenclature</div>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="v6-testi-col">
              <div className="v6-testi-card v6-testi-card--accent2 v6-testi-short">
                <div className="v6-testi-body">
                  <div className="v6-testi-val">&lt;30s</div>
                  <div className="v6-testi-lbl">Résultat</div>
                  <div className="v6-testi-sub">Calcul complet + comparateur prix</div>
                </div>
              </div>
              <div className="v6-testi-card v6-testi-card--pattern v6-testi-tall">
                <div className="v6-testi-grid-overlay" />
                <div className="v6-testi-body">
                  <div className="v6-testi-badge">DTU</div>
                  <div className="v6-testi-val v6-testi-val--hero">100%</div>
                  <div className="v6-testi-lbl">Conforme DTU</div>
                  <div className="v6-testi-sub">Sections, entraxes et assemblages selon les normes françaises de construction bois</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom rule with corner squares (testimonial reference) */}
          <div className="v6-testi-rule">
            <div className="v6-testi-rule-inner" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
           SOCIAL PROOF — stagger carousel témoignages
      ══════════════════════════════════════ */}
      <section className="v6-social-section" id="v6-social">
        <div className="v6-social-inner">
          {/* Header */}
          <div className="v6-social-header">
            <div className="v6-eyebrow">
              <span className="v6-eyebrow-idx">04</span>
              <span className="v6-eyebrow-sep" />
              Témoignages
            </div>
            <h2 className="v6-social-title">
              Ils ont lancé{' '}
              <em>leur projet.</em>
            </h2>
            <p className="v6-social-sub">
              Des milliers d&apos;utilisateurs ont obtenu leur devis en 2 minutes — puis trouvé l&apos;artisan qu&apos;il leur fallait.
            </p>
          </div>

          {/* Stagger carousel */}
          <SocialCarousel />

          {/* CTA strip */}
          <div className="v6-social-cta-strip">
            <p className="v6-social-cta-label">Prêt à lancer votre projet ?</p>
            <button
              type="button"
              className="v6-btn v6-btn--cta"
              onClick={handleSocialCTA}
            >
              Calculer mes matériaux
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECT SVG ILLUSTRATIONS — matching maquette v6
═══════════════════════════════════════════════════════════ */
function ProjectSVG({ type }) {
  switch (type) {
    case 0: // Terrasse
      return (
        <svg viewBox="0 0 280 160" fill="none" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="140" cy="148" rx="110" ry="8" fill="rgba(0,0,0,0.06)" />
          <rect x="45" y="108" width="14" height="14" rx="2" fill="#9E9E9E" opacity=".6" />
          <rect x="105" y="108" width="14" height="14" rx="2" fill="#9E9E9E" opacity=".6" />
          <rect x="165" y="108" width="14" height="14" rx="2" fill="#9E9E9E" opacity=".6" />
          <rect x="225" y="108" width="14" height="14" rx="2" fill="#9E9E9E" opacity=".6" />
          <rect x="40" y="100" width="200" height="6" rx="1" fill="#7A6B4E" opacity=".7" />
          <rect x="40" y="88" width="200" height="6" rx="1" fill="#7A6B4E" opacity=".5" />
          <g opacity=".9">
            <rect x="36" y="72" width="196" height="7" rx="1" fill="#C4A265" />
            <rect x="36" y="81" width="196" height="7" rx="1" fill="#B8944F" />
            <rect x="36" y="90" width="196" height="7" rx="1" fill="#C4A265" />
            <rect x="36" y="99" width="196" height="7" rx="1" fill="#B8944F" opacity=".85" />
          </g>
          <line x1="36" y1="58" x2="232" y2="58" stroke="#4A7FBF" strokeWidth="1" strokeDasharray="4 2" opacity=".6" />
          <text x="134" y="54" fontFamily="Inter" fontSize="8" fill="#4A7FBF" textAnchor="middle" opacity=".7">4.5 m</text>
          <line x1="244" y1="72" x2="244" y2="106" stroke="#4A7FBF" strokeWidth="1" strokeDasharray="4 2" opacity=".6" />
          <text x="256" y="92" fontFamily="Inter" fontSize="7" fill="#4A7FBF" textAnchor="middle" opacity=".7">3.0 m</text>
        </svg>
      );
    case 1: // Cabanon
      return (
        <svg viewBox="0 0 280 160" fill="none" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="140" cy="148" rx="100" ry="7" fill="rgba(0,0,0,0.06)" />
          <rect x="70" y="60" width="140" height="86" rx="2" fill="#D4B896" opacity=".35" />
          <g opacity=".55">
            <rect x="72" y="62" width="136" height="8" rx=".5" fill="#C4A87A" />
            <rect x="72" y="72" width="136" height="8" rx=".5" fill="#B8985C" />
            <rect x="72" y="82" width="136" height="8" rx=".5" fill="#C4A87A" />
            <rect x="72" y="92" width="136" height="8" rx=".5" fill="#B8985C" />
            <rect x="72" y="102" width="136" height="8" rx=".5" fill="#C4A87A" />
            <rect x="72" y="112" width="136" height="8" rx=".5" fill="#B8985C" />
            <rect x="72" y="122" width="136" height="8" rx=".5" fill="#C4A87A" />
            <rect x="72" y="132" width="136" height="8" rx=".5" fill="#B8985C" />
          </g>
          <polygon points="64,56 220,46 220,52 64,62" fill="#7A6B4E" opacity=".7" />
          <line x1="64" y1="56" x2="220" y2="46" stroke="#6B5F4F" strokeWidth="1" opacity=".4" />
          <rect x="95" y="90" width="30" height="56" rx="1.5" fill="#6B5F4F" opacity=".5" />
          <circle cx="120" cy="118" r="2" fill="#4A7FBF" opacity=".5" />
          <rect x="155" y="78" width="28" height="22" rx="1.5" fill="rgba(135,206,235,0.25)" stroke="#6B5F4F" strokeWidth=".8" opacity=".6" />
          <line x1="169" y1="78" x2="169" y2="100" stroke="#6B5F4F" strokeWidth=".5" opacity=".4" />
          <line x1="85" y1="60" x2="85" y2="146" stroke="#7A6B4E" strokeWidth="1.5" opacity=".2" />
          <line x1="140" y1="60" x2="140" y2="146" stroke="#7A6B4E" strokeWidth="1.5" opacity=".2" />
          <line x1="195" y1="60" x2="195" y2="146" stroke="#7A6B4E" strokeWidth="1.5" opacity=".2" />
          <line x1="70" y1="38" x2="210" y2="38" stroke="#4A7FBF" strokeWidth="1" strokeDasharray="4 2" opacity=".6" />
          <text x="140" y="34" fontFamily="Inter" fontSize="8" fill="#4A7FBF" textAnchor="middle" opacity=".7">3.0 m</text>
        </svg>
      );
    case 2: // Pergola
      return (
        <svg viewBox="0 0 280 160" fill="none" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="140" cy="148" rx="105" ry="7" fill="rgba(0,0,0,0.06)" />
          <rect x="55" y="50" width="10" height="96" rx="1.5" fill="#A0785A" opacity=".7" />
          <rect x="215" y="50" width="10" height="96" rx="1.5" fill="#A0785A" opacity=".7" />
          <rect x="55" y="60" width="10" height="86" rx="1.5" fill="#8F6B4F" opacity=".4" />
          <rect x="215" y="60" width="10" height="86" rx="1.5" fill="#8F6B4F" opacity=".4" />
          <rect x="50" y="48" width="180" height="7" rx="1" fill="#A0785A" opacity=".65" />
          <rect x="50" y="42" width="180" height="7" rx="1" fill="#8F6B4F" opacity=".35" />
          <g opacity=".5">
            <rect x="48" y="36" width="184" height="4" rx=".8" fill="#7D5E44" />
            <rect x="48" y="44" width="184" height="4" rx=".8" fill="#7D5E44" opacity=".7" />
            <rect x="48" y="52" width="184" height="4" rx=".8" fill="#7D5E44" opacity=".5" />
          </g>
          <g opacity=".08">
            <rect x="70" y="130" width="160" height="3" rx="1" fill="#000" />
            <rect x="75" y="136" width="150" height="2" rx="1" fill="#000" />
            <rect x="80" y="141" width="140" height="2" rx="1" fill="#000" />
          </g>
          <circle cx="42" cy="140" r="6" fill="#2B8A57" opacity=".15" />
          <circle cx="238" cy="142" r="5" fill="#2B8A57" opacity=".12" />
          <line x1="55" y1="28" x2="225" y2="28" stroke="#4A7FBF" strokeWidth="1" strokeDasharray="4 2" opacity=".6" />
          <text x="140" y="24" fontFamily="Inter" fontSize="8" fill="#4A7FBF" textAnchor="middle" opacity=".7">4.0 m</text>
        </svg>
      );
    case 3: // Clôture
      return (
        <svg viewBox="0 0 280 160" fill="none" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="140" cy="148" rx="120" ry="7" fill="rgba(0,0,0,0.06)" />
          <rect x="25" y="52" width="8" height="94" rx="1.5" fill="#766A50" opacity=".75" />
          <rect x="75" y="52" width="8" height="94" rx="1.5" fill="#766A50" opacity=".75" />
          <rect x="125" y="52" width="8" height="94" rx="1.5" fill="#766A50" opacity=".75" />
          <rect x="175" y="52" width="8" height="94" rx="1.5" fill="#766A50" opacity=".75" />
          <rect x="225" y="52" width="8" height="94" rx="1.5" fill="#766A50" opacity=".75" />
          <rect x="22" y="62" width="214" height="5" rx=".8" fill="#9B8B6E" opacity=".5" />
          <rect x="22" y="98" width="214" height="5" rx=".8" fill="#9B8B6E" opacity=".5" />
          <rect x="22" y="134" width="214" height="5" rx=".8" fill="#9B8B6E" opacity=".5" />
          <g opacity=".6">
            {[34,42,50,58,66,84,92,100,108,116,134,142,150,158,166,184,192,200,208,216].map((x, i) => (
              <rect key={i} x={x} y="58" width="5" height="84" rx=".5" fill={i % 2 === 0 ? '#9B8B6E' : '#8A7A5E'} />
            ))}
          </g>
          <line x1="25" y1="42" x2="233" y2="42" stroke="#4A7FBF" strokeWidth="1" strokeDasharray="4 2" opacity=".6" />
          <text x="129" y="38" fontFamily="Inter" fontSize="8" fill="#4A7FBF" textAnchor="middle" opacity=".7">18 ml</text>
        </svg>
      );
    default:
      return null;
  }
}
