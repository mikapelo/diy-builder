'use client';

/**
 * ArticleToc.jsx — Sommaire d'article auto-généré.
 *
 * Lit les `.content-h2` de la page (aucune réécriture des guides), leur pose un
 * id slugifié, et rend :
 *   - un encadré « Sommaire » inline injecté après l'intro (mobile/tablette),
 *   - un rail collant dans la marge droite (desktop ≥ 1240px),
 * avec surlignage de la section active au scroll (IntersectionObserver).
 *
 * Monté une fois dans ContentLayout. Garde-fous : uniquement les pages
 * /guides/ et à partir de 3 sections (sinon rien — FAQ, légales, pages courtes).
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" /><line x1="4" y1="6" x2="4" y2="6" />
      <line x1="4" y1="12" x2="4" y2="12" /><line x1="4" y1="18" x2="4" y2="18" />
    </svg>
  );
}

export default function ArticleToc() {
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (!window.location.pathname.startsWith('/guides/')) return undefined;

    const heads = Array.from(document.querySelectorAll('.content-container .content-h2'));
    if (heads.length < 3) return undefined;

    const secs = heads.map((h, i) => {
      let id = h.id;
      const text = h.textContent.trim();
      if (!id) {
        id = slugify(text) || `section-${i + 1}`;
        h.id = id;
      }
      return { id, text, num: String(i + 1).padStart(2, '0') };
    });
    setSections(secs);

    const anchor = document.querySelector('.content-lead')
      || document.querySelector('.content-meta');
    let node = null;
    if (anchor) {
      node = document.createElement('div');
      node.setAttribute('data-article-toc-mount', '');
      anchor.insertAdjacentElement('afterend', node);
      setMountNode(node);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-88px 0px -68% 0px', threshold: 0 },
    );
    heads.forEach((h) => observer.observe(h));

    return () => {
      observer.disconnect();
      if (node && node.parentNode) node.parentNode.removeChild(node);
    };
  }, []);

  if (sections.length < 3) return null;

  const renderList = (variantClass) => (
    <nav className={variantClass} aria-label="Sommaire de l'article">
      <p className="article-toc-head"><ListIcon />Sommaire</p>
      <ul className="article-toc-list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`article-toc-link${activeId === s.id ? ' is-active' : ''}`}
            >
              <span className="article-toc-num">{s.num}</span>
              <span className="article-toc-txt">{s.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {mountNode && createPortal(renderList('article-toc-inline'), mountNode)}
      {renderList('article-toc-rail')}
    </>
  );
}
