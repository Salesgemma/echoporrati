import gsap from "gsap";
import Observer from "gsap/Observer";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(Observer, ScrollToPlugin);

// Eseguiamo lo script solo se siamo su uno schermo grande (desktop)
if (window.matchMedia("(min-width: 768px)").matches) {

    const sections = document.querySelectorAll(".story-block");
    const navLinks = document.querySelectorAll(".slide-nav a");
    let currentSection = 0;
    let animating = false;

    function goToSection(index) {
        if (index < 0 || index >= sections.length || animating) return;
        
        animating = true;
        currentSection = index;
        
        // Update active nav link
        navLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
        
        // Scroll to section
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: sections[index], autoKill: false },
            onComplete: () => {
                animating = false;
            }
        });
        
        // Animate section content
        animateContent(index);
    }
    
    function animateContent(index) {
        const section = sections[index];
        const elements = section.querySelectorAll('.anim-el');
        
        // Reset elements
        gsap.set(elements, { opacity: 0, y: 50 });
        
        // Animate elements
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // Navigation links
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            goToSection(index);
        });
    });

    // Keyboard navigation
    Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onUp: () => goToSection(currentSection - 1),
        onDown: () => goToSection(currentSection + 1),
        tolerance: 10,
        preventDefault: true
    });

    // Initialize first section
    if (sections.length > 0) {
        animateContent(0);
    }
}