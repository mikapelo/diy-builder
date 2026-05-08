'use client';
import { useState } from 'react';

export default function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: 14, fontWeight: 600, color: '#C9971E',
        background: 'transparent', border: '2px solid #C9971E',
        padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
      }}
    >
      {copied ? '✓ Lien copié' : 'Copier le lien'}
    </button>
  );
}
