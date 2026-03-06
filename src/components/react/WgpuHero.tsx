// src/components/react/WgpuHero.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Shader per l'effetto di dislocazione (WebGL)
const vertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calcola la distanza dal puntatore del mouse
    float dist = length(uv - uPointer);
    
    // Crea un'onda che parte dal puntatore
    pos.z += sin(dist * 20.0 - uTime * 3.0) * 0.03;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform vec2 uPointer;
  varying vec2 vUv;
  void main() {
    // Legge la mappa di profondità per la dislocazione
    vec4 depth = texture2D(uDepthMap, vUv);
    
    // Calcola l'offset basato sulla mappa di profondità e la posizione del mouse
    vec2 offset = vec2(depth.r - 0.5, depth.g - 0.5) * 0.1 * uPointer;
    
    // Applica l'offset alle coordinate della texture
    vec4 color = texture2D(uTexture, vUv + offset);
    
    gl_FragColor = color;
  }
`;

function ImagePlane() {
    const [texture, depthMap] = useTexture(['/images/anello.png', '/images/anello.png']);
    const meshRef = useRef<THREE.Mesh>(null!);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uTexture: { value: texture },
        uDepthMap: { value: depthMap },
    }), [texture, depthMap]);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        // Anima il puntatore per tornare lentamente al centro
        uniforms.uPointer.value.lerp(state.pointer, 0.05);
    });

    const scaleFactor = 0.40;
    const [w, h] = [6, 4]; // Using fixed values since useAspect is not imported

    return (
        <mesh 
            ref={meshRef} 
            scale={[w * scaleFactor, h * scaleFactor, 1]} 
            // Aggiungiamo questa prop per spostare l'oggetto indietro
            position={[0, 0, -2]} // [x, y, z]
        >
            <planeGeometry args={[6, 4, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export const WgpuHero = () => {
    const titleWords = 'The Architecture'.split(' ');
    const subtitle = 'of the Self.';
    
    const [visibleWords, setVisibleWords] = useState(0);
    const [subtitleVisible, setSubtitleVisible] = useState(false);
    const [delays, setDelays] = useState<number[]>([]);
    const [subtitleDelay, setSubtitleDelay] = useState(0);

    useEffect(() => {
        setDelays(titleWords.map(() => Math.random() * 0.07));
        setSubtitleDelay(Math.random() * 0.1);
    }, [titleWords.length]);

    useEffect(() => {
        if (visibleWords < titleWords.length) {
            const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => setSubtitleVisible(true), 800);
            return () => clearTimeout(timeout);
        }
    }, [visibleWords, titleWords.length]);
    
    // Aggiungi gli stili per le animazioni del testo e il pannello "vetro"
    useEffect(() => {
        const styleId = 'wgpu-hero-styles';
        
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
              /* Animazioni del testo (esistenti) */
              @keyframes fadeIn {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .fade-in {
                animation: fadeIn 0.8s ease-out forwards;
              }
              @keyframes fadeInSubtitle {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .fade-in-subtitle {
                animation: fadeInSubtitle 0.8s ease-out forwards;
              }

              /* ================================== */
              /* === STILI MANCANTI RIPRISTINATI === */
              /* ================================== */

              .text-panel {
                /* Stili di base per MOBILE (fascia orizzontale) */
                width: 100%;
                background-color: rgba(12, 12, 12, 0.25);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                padding: 2rem 1rem; 
                border-top: 1px solid rgba(217, 217, 217, 0.1);
                border-bottom: 1px solid rgba(217, 217, 217, 0.1);
              }

              /* Stili per DESKTOP */
              @media (min-width: 768px) {
                .text-panel {
                  width: auto;
                  max-width: 900px;
                  padding: 3rem 4rem;
                  border-radius: 1.5rem;
                  border: 1px solid rgba(217, 217, 217, 0.1);
                }
              }
            `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-nero-assoluto relative">
            <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
                <ImagePlane />
            </Canvas>

            {/* Contenitore principale per il testo e il pannello */}
            <div className="h-screen w-screen absolute top-0 left-0 z-10 pointer-events-none flex items-center justify-center px-4 sm:px-0">
                
                {/* Pannello "Vetro" che avvolge il testo */}
                <div className="text-panel">
                    
                    {/* TITOLO */}
                    <div className="font-bodoni text-4xl sm:text-5xl md:text-7xl font-bold uppercase text-white">
                        <div className="flex flex-wrap justify-center space-x-2 lg:space-x-6 overflow-hidden">
                            {titleWords.map((word, index) => (
                                <div
                                    key={index}
                                    className={index < visibleWords ? 'fade-in' : ''}
                                    style={{ animationDelay: `${index * 0.13 + (delays[index] || 0)}s`, opacity: index < visibleWords ? undefined : 0, transition: 'opacity 0.5s' }}
                                >
                                    {word}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SOTTOTITOLO */}
                    <div className="text-lg sm:text-xl md:text-2xl mt-4 overflow-hidden text-greige-chiaro font-sans normal-case italic">
                         <div
                            className={subtitleVisible ? 'fade-in-subtitle' : ''}
                            style={{ animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, opacity: subtitleVisible ? undefined : 0, transition: 'opacity 0.5s' }}
                        >
                            {subtitle}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WgpuHero;