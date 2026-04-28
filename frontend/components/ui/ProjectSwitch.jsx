'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandIcon from '@/components/ui/BrandIcon';

export default function ProjectSwitch() {
  const pathname = usePathname();

  const projects = [
    { id: 'terrasse', label: 'Terrasse',    href: '/calculateur' },
    { id: 'cabanon',  label: 'Cabanon',     href: '/cabanon' },
    { id: 'pergola',  label: 'Pergola',     href: '/pergola' },
    { id: 'cloture',  label: 'Clôture',     href: '/cloture' },
  ];

  const getActiveProject = () => {
    if (pathname.includes('/calculateur')) return 'terrasse';
    if (pathname.includes('/cabanon')) return 'cabanon';
    if (pathname.includes('/pergola')) return 'pergola';
    if (pathname.includes('/cloture')) return 'cloture';
    return 'terrasse';
  };

  const activeProject = getActiveProject();

  return (
    <div className="project-switch-container">
      <div className="project-switch">
        {projects.map((project) => {
          const isActive = activeProject === project.id;
          const baseClass = 'project-switch-tab';
          const activeClass = isActive ? 'active' : '';
          const disabledClass = project.disabled ? 'disabled' : '';

          const Tab = project.disabled ? 'button' : Link;
          const tabProps = project.disabled
            ? { disabled: true, className: `${baseClass} ${activeClass} ${disabledClass}` }
            : { href: project.href, className: `${baseClass} ${activeClass} ${disabledClass}` };

          const ariaLabel = `Simulateur ${project.label}${isActive ? ' (actif)' : ''}`;
          return (
            <Tab key={project.id} {...tabProps} aria-label={ariaLabel} aria-current={isActive ? 'page' : undefined}>
              <span className="project-switch-icon" aria-hidden="true">
                <BrandIcon name={project.id} size={16} />
              </span>
              <span className="project-switch-label">{project.label}</span>
              {project.badge && <span className="project-switch-badge">{project.badge}</span>}
            </Tab>
          );
        })}
      </div>

      <style jsx>{`
        /* ── Conteneur : fond chaud intégré au header zone ── */
        .project-switch-container {
          width: 100%;
          padding: 0;
          background: transparent;
        }

        .project-switch {
          display: flex;
          gap: 6px;
          padding: 16px 48px;
          max-width: 1200px;
          margin: 0 auto;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* ── Tabs ── */
        .project-switch-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border: 1.5px solid transparent;
          border-radius: 10px;
          background: rgba(255,255,255,0.55);
          color: #6b5f4f;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          position: relative;
          backdrop-filter: blur(4px);
        }

        .project-switch-tab:hover:not(.disabled) {
          background: rgba(255,255,255,0.85);
          border-color: #d1c5b2;
          color: #1a1c1b;
        }

        .project-switch-tab:focus-visible {
          outline: 2px solid #C9971E;
          outline-offset: 2px;
        }

        /* ── Tab active : fond bois foncé + texte blanc ── */
        .project-switch-tab.active {
          background: #1B3022;
          border-color: #1B3022;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(27,48,34,.20);
        }

        .project-switch-tab.disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .project-switch-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }

        .project-switch-tab.active .project-switch-icon {
          opacity: 1;
        }

        .project-switch-label {
          display: inline;
        }

        .project-switch-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          margin-left: 4px;
          background: rgba(0,0,0,.08);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #8a7e6f;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 1024px) {
          .project-switch {
            padding: 12px 24px;
          }
        }

        @media (max-width: 768px) {
          .project-switch {
            padding: 10px 16px;
          }
          .project-switch-tab {
            padding: 8px 12px;
            font-size: 12px;
          }
          .project-switch-label {
            display: none;
          }
          .project-switch-icon {
            width: 20px;
            height: 20px;
          }
          .project-switch-icon .material-symbols-outlined {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
