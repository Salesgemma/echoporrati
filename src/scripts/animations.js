import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Funzione UNIFICATA per animare tutte le animazioni del sito
function initializeAnimations() {

    // --- Animazioni Comuni (per la landing page principale) ---

    // 1. Animazione HEADER (Navbar)
    const mainHeader = document.querySelector('#main-header');
    if (mainHeader) {
        gsap.to(mainHeader, {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 1.5
        });
    }

    // 2. Animazione HERO
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle && heroSubtitle) {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.from(heroTitle, { y: 30, opacity: 0, duration: 1.2, ease: "power3.out" });
        tl.from(heroSubtitle, { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8");
    }

    // 3. Animazione MANIFESTO
    const manifestoSection = document.querySelector('.manifesto-section');
    if (manifestoSection) {
        const elements = manifestoSection.querySelectorAll('.manifesto-block');
        gsap.to(elements, {
            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.3,
            scrollTrigger: { trigger: manifestoSection, start: 'top 70%', toggleActions: 'play none none none' }
        });
    }

    // 4. Animazione JEWELRY SHOWCASE (4 Categorie)
    const showcaseSection = document.querySelector('.jewelry-showcase-container');
    if (showcaseSection) {
        const textContent = showcaseSection.querySelector('.text-center');
        const cards = showcaseSection.querySelectorAll('.jewelry-item');
        
        gsap.from(textContent, {
            opacity: 0, y: 40, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: showcaseSection, start: 'top 75%', toggleActions: 'play none none none' }
        });
        gsap.from(cards, {
            opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.2,
            scrollTrigger: { trigger: textContent, start: 'bottom 80%', toggleActions: 'play none none none' }
        });
    }

    // 5. Animazione SHADER
    const shaderSection = document.querySelector('.shader-section');
    if (shaderSection) {
        const textContent = shaderSection.querySelector('.shader-text-content');
        gsap.from(textContent, {
            opacity: 0, y: 50, duration: 1.5, ease: 'power3.out',
            scrollTrigger: { trigger: shaderSection, start: 'top 70%', toggleActions: 'play none none none' }
        });
    }

    // 6. Animazione COLLECTIONS (Carosello)
    const collectionsSection = document.querySelector('.collections-section');
    if (collectionsSection) {
        const textContent = collectionsSection.querySelector('.text-center');
        const slides = collectionsSection.querySelectorAll('.collection-slide');
        
        gsap.from(textContent, {
            opacity: 0, y: 40, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: collectionsSection, start: 'top 75%', toggleActions: 'play none none none' }
        });
        gsap.from(slides, {
            opacity: 0, x: 50, duration: 1, ease: 'power3.out', stagger: 0.2,
            scrollTrigger: { trigger: collectionsSection, start: 'top 65%', toggleActions: 'play none none none' }
        });
    }

    // 7. Animazione IMAGE GRID
    const gridContainer = document.querySelector('.image-grid-container');
    if (gridContainer) {
        const textContent = gridContainer.querySelector('.text-center');
        const gridItems = gridContainer.querySelectorAll('.grid-item');
        gsap.from(textContent, {
            opacity: 0, y: 40, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: textContent, start: 'top 85%', toggleActions: 'play none none none' }
        });
        gsap.from(gridItems, {
            opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: gridContainer, start: 'top 70%', toggleActions: 'play none none none' }
        });
    }

    // --- Animazioni Specifiche (per la pagina /commercial) ---

    // 8. Animazione STORY BLOCKS
    const storyBlocks = document.querySelectorAll('.story-block');
    if (storyBlocks.length > 0) {
        storyBlocks.forEach(block => {
            const elements = block.querySelectorAll('.anim-el');
            gsap.from(elements, { // Usiamo .from per partire dallo stato invisibile
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.2,
                scrollTrigger: {
                    trigger: block,
                    start: 'top 80%', // L'animazione parte quando il blocco è visibile
                    toggleActions: 'play none none none',
                }
            });
        });
    }

    // --- Animazioni Specifiche (per le pagine collezioni) ---

    // 9. Animazione COLLECTION PAGES
    const collectionPage = document.querySelector('.collection-page');
    if (collectionPage) {
        const title = collectionPage.querySelector('h1');
        const subtitle = collectionPage.querySelector('h2');
        const description = collectionPage.querySelector('p');
        const cards = collectionPage.querySelectorAll('.jewelry-item-card');
        
        // Animate title and description
        if (title) {
            gsap.from(title, {
                opacity: 0, y: 30, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: collectionPage, start: 'top 90%', toggleActions: 'play none none none' }
            });
        }
        
        if (subtitle) {
            gsap.from(subtitle, {
                opacity: 0, y: 20, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: collectionPage, start: 'top 90%', toggleActions: 'play none none none' }
            });
        }
        
        if (description) {
            gsap.from(description, {
                opacity: 0, y: 20, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: collectionPage, start: 'top 90%', toggleActions: 'play none none none' }
            });
        }
        
        // Animate cards with stagger
        if (cards.length > 0) {
            gsap.from(cards, {
                opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.2,
                scrollTrigger: { trigger: collectionPage, start: 'top 80%', toggleActions: 'play none none none' }
            });
        }
    }

    // 10. Animazione COLLECTIONS OVERVIEW
    const collectionsOverview = document.querySelector('.collections-overview');
    if (collectionsOverview) {
        const title = collectionsOverview.querySelector('h1');
        const description = collectionsOverview.querySelector('p');
        const cards = collectionsOverview.querySelectorAll('.collection-card');
        
        // Animate title and description
        if (title) {
            gsap.from(title, {
                opacity: 0, y: 30, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: collectionsOverview, start: 'top 90%', toggleActions: 'play none none none' }
            });
        }
        
        if (description) {
            gsap.from(description, {
                opacity: 0, y: 20, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: collectionsOverview, start: 'top 90%', toggleActions: 'play none none none' }
            });
        }
        
        // Animate cards with stagger
        if (cards.length > 0) {
            gsap.from(cards, {
                opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.2,
                scrollTrigger: { trigger: collectionsOverview, start: 'top 80%', toggleActions: 'play none none none' }
            });
        }
    }
}

// Esegui la funzione principale una sola volta, quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initializeAnimations);