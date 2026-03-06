// src/components/react/GlowingShadow.tsx
"use client"

import type React from 'react';

interface GlowingShadowProps {
  children: React.ReactNode;
}

// Questo è solo l'involucro HTML. Gli stili verranno dal genitore Astro.
export function GlowingShadow({ children }: GlowingShadowProps) {
  return (
    <div className="glow-container" role="button">
      <span className="glow"></span>
      <div className="glow-content">
        {children}
      </div>
    </div>
  );
}