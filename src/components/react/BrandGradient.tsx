// src/components/react/BrandGradient.tsx
"use client"

import { MeshGradient } from "@paper-design/shaders-react"

// Questo è un componente wrapper molto semplice.
// Il suo unico scopo è configurare il MeshGradient con i nostri colori e parametri.
export function BrandGradient() {
  return (
    <MeshGradient
        // I colori sono presi dalla nostra palette per coerenza di brand
        colors={[
            '#0C0C0C', // nero-assoluto
            '#202530', // blu-inchiostro
            '#333D40', // grigio-blu-notte
            '#4B4F51'  // grigio-antracite
        ]}
        // Velocità dell'animazione. Un valore basso è più elegante.
        speed={0.8}
        // Il componente MeshGradient richiede una classe per definire le sue dimensioni
        className="w-full h-full"
    />
  )
}