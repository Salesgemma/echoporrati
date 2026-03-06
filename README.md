# PORRATI - Project "The Form of Thought"

## 1. Objective

To develop a high-performance, visually immersive, and scalable digital showcase for the PORRATI jewelry brand. The site will serve as a modern digital flagship, prioritizing aesthetic elegance, loading speed, and a premium user experience.

## 2. Technology Stack

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Animations:** GSAP (GreenSock Animation Platform)
- **Deployment Target:** Serverless/Static Hosting (e.g., Vercel, Netlify)

## 3. Core Principles

- **Performance First:** The site must be exceptionally fast. We will leverage Astro's static generation and islands architecture.
- **Aesthetic Coherence:** All visual elements must adhere to the "The Form of Thought" moodboard: dark, sophisticated, architectural, and intellectual.
- **Responsive & Accessible:** The experience must be seamless across all modern devices and accessible to all users.
- **Scalable Architecture:** The project structure must be modular and easy to maintain or expand with future collections and features.

## 4. File Structure
```
/porrati-website
|
├── /public/
| ├── /images/ (Static Asset: Experiential Imagery)
| ├── /images2/ (Static Asset: Product/Moodboard Imagery)
| ├── /videos/ (Static Asset: Product/Brand Videos)
| └── favicon.svg
|
├── /src/
| ├── /components/ (Reusable UI Components: Header.astro, etc.)
| ├── /layouts/ (Core Page Templates: Layout.astro)
| ├── /pages/ (Site Pages: index.astro, etc.)
| └── /styles/ (Global CSS: global.css)
|
├── .gitignore
├── astro.config.mjs
├── package.json
├── README.md
└── tailwind.config.cjs
```

## 5. Development Roadmap

- [x] **Phase 1: Foundation (Current)**
  - [x] Workspace Cleanup
  - [x] Directory Scaffolding
  - [x] Project Configuration (`package.json`, `astro.config.mjs`, `tailwind.config.cjs`)
  - [x] Global Styling & Layout (`global.css`, `Layout.astro`)
  - [x] Homepage v1 (`index.astro`)
- [ ] **Phase 2: Components & Interactivity**
  - [ ] Abstract Hero section into a Component
  - [ ] Create interactive Image Gallery Component
  - [ ] Implement GSAP for entry animations
- [ ] **Phase 3: Content Expansion**
  - [ ] Develop Collections Page
  - [ ] Develop Brand Manifesto Page

## 6. Brand Design System

### Core Values
- **Rigore (Rigor):** Architectural precision and structural clarity
- **Intelletto (Intellect):** Thoughtful design as intellectual expression
- **Design Permanente:** Enduring design that transcends trends

### Visual Identity
- **Campaign Framework:** L'Architettura del Sé (The Architecture of the Self)
- **Tagline:** PORRATI. La Forma del Pensiero (The Form of Thought)
- **Positioning:** Jewelry as micro-architectures and intellectual decisions

### Color Palette
- **Main Gray:** #555555 (Primary text)
- **Accent White:** #ffffff (Highlights)
- **Pure Black:** #000000 (Borders)
- **Light Gray:** #777777 (Secondary elements)
- **Dark Gray:** #333333 (Dark backgrounds)
- **Silver:** #c0c0c0 (Accents)

### Dark Theme Palette
- **Nero Assoluto:** #0C0C0C (Deepest darks)
- **Grigio-Blu Notte:** #333D40 (Main background)
- **Blu Inchiostro:** #202530 (Dark sections)
- **Grigio Antracite:** #4B4F51 (Borders)
- **Greige Medio:** #9A958A (Secondary text)
- **Greige Chiaro:** #C1BDB3 (Highlights)
- **Bianco Sporco:** #D9D9D9 (Primary text)

## 7. Technical Requirements

### Performance Targets
- Lighthouse Score: 95+ across all metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Accessibility Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile iOS and Android
- Progressive enhancement approach

## 8. Deployment Strategy

### Primary: Vercel
- Automatic deployments from Git
- Custom domain: porrati.vercel.app
- Team scope: SALES's projects

### Backup: Netlify
- Alternative deployment platform
- CDN optimization
- Form handling capabilities

## 9. Current Status

**Phase 1: Foundation** ✅ COMPLETE
- Project structure established
- Current moodboard implementation active
- Vercel deployment configured
- Brand design system documented

**Next Steps:**
- Initialize Astro project structure
- Migrate existing content to component architecture
- Implement GSAP animations
- Optimize for performance metrics