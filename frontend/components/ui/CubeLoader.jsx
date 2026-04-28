'use client';

import React from 'react';

/**
 * CubeLoader — 3D rotating cube loader (G v2 palette)
 * Adapted from daiv09/cube-loader (21st.dev).
 * Colors: marine (#1E3A52), mustard (#C9971E), brique (#B44B2A), ivoire (#F1EBDD).
 * Shows for ~2s before simulator mounts.
 */
export default function CubeLoader({ label = 'Chargement', sub = 'Préparation du simulateur…' }) {
  return (
    <div className="cube-loader-wrap">
      <div className="cube-loader-scene">
        <div className="cube-loader-cube">
          {/* Core glow */}
          <div className="cube-loader-core" />
          {/* 6 faces */}
          <div className="cube-side cube-front"><div className="cube-face cube-face--marine" /></div>
          <div className="cube-side cube-back"><div className="cube-face cube-face--marine" /></div>
          <div className="cube-side cube-right"><div className="cube-face cube-face--mustard" /></div>
          <div className="cube-side cube-left"><div className="cube-face cube-face--mustard" /></div>
          <div className="cube-side cube-top"><div className="cube-face cube-face--brique" /></div>
          <div className="cube-side cube-bottom"><div className="cube-face cube-face--brique" /></div>
        </div>
        {/* Floor shadow */}
        <div className="cube-loader-shadow" />
      </div>
      <div className="cube-loader-text">
        <h3>{label}</h3>
        <p>{sub}</p>
      </div>

      <style jsx>{`
        .cube-loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 36px;
          padding: 40px 24px;
          width: 100%;
          height: 100%;
          min-height: 380px;
          background: var(--g-surface, #FAF5E8);
          border-radius: inherit;
          perspective: 1200px;
        }
        .cube-loader-scene {
          position: relative;
          width: 96px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }
        .cube-loader-cube {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: cube-spin 8s linear infinite;
        }
        .cube-loader-core {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 32px;
          height: 32px;
          background: var(--g-mustard, #C9971E);
          border-radius: 50%;
          filter: blur(10px);
          box-shadow: 0 0 40px rgba(201,151,30,0.7);
          animation: cube-pulse 2s ease-in-out infinite;
        }

        /* Side wrappers */
        .cube-side {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }
        .cube-front  { transform: rotateY(0deg); }
        .cube-back   { transform: rotateY(180deg); }
        .cube-right  { transform: rotateY(90deg); }
        .cube-left   { transform: rotateY(-90deg); }
        .cube-top    { transform: rotateX(90deg); }
        .cube-bottom { transform: rotateX(-90deg); }

        /* Face */
        .cube-face {
          width: 100%;
          height: 100%;
          position: absolute;
          animation: cube-breathe 3s ease-in-out infinite;
          backdrop-filter: blur(2px);
          border-width: 2px;
          border-style: solid;
        }
        .cube-face--marine {
          background: rgba(30,58,82,0.10);
          border-color: rgba(30,58,82,0.6);
          box-shadow: 0 0 15px rgba(30,58,82,0.35);
        }
        .cube-face--mustard {
          background: rgba(201,151,30,0.10);
          border-color: rgba(201,151,30,0.6);
          box-shadow: 0 0 15px rgba(201,151,30,0.35);
        }
        .cube-face--brique {
          background: rgba(180,75,42,0.10);
          border-color: rgba(180,75,42,0.6);
          box-shadow: 0 0 15px rgba(180,75,42,0.35);
        }

        /* Floor shadow */
        .cube-loader-shadow {
          position: absolute;
          bottom: -80px;
          width: 96px;
          height: 32px;
          background: rgba(30,58,82,0.15);
          filter: blur(16px);
          border-radius: 100%;
          animation: cube-shadow-breathe 3s ease-in-out infinite;
        }

        /* Text */
        .cube-loader-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
        }
        .cube-loader-text h3 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--g-marine, #1E3A52);
          margin: 0;
        }
        .cube-loader-text p {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: rgba(30,58,82,0.5);
          margin: 0;
        }

        /* Keyframes */
        @keyframes cube-spin {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes cube-breathe {
          0%, 100% { transform: translateZ(48px); opacity: 0.8; }
          50%      { transform: translateZ(72px); opacity: 0.35; border-color: rgba(201,151,30,0.7); }
        }
        @keyframes cube-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50%      { transform: scale(1.2); opacity: 1; }
        }
        @keyframes cube-shadow-breathe {
          0%, 100% { transform: scale(1);   opacity: 0.3; }
          50%      { transform: scale(1.4); opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}
