#!/usr/bin/env node
/**
 * generate-languages.mjs
 * Generates ES, DE, AR page files and adds translated product data to products.json.
 * Run from project root: node scripts/generate-languages.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = join(ROOT, 'src/pages');

// ═══════════════════════════════════════════════════════════════
// TRANSLATED CONTENT
// ═══════════════════════════════════════════════════════════════

const T = {
  es: {
    // Homepage
    siteTitle: 'PORRATI | La Forma del Pensamiento',
    heroTitle: 'La Forma del Pensamiento',
    heroSubtitle: 'La Arquitectura del Ser.',
    manifesto: {
      title1: 'La Arquitectura <br/> del Ser.',
      p1_1: 'PORRATI no evoluciona. Vuelve a la esencia. Nacido en Valenza, la marca se dedica a principios inmutables: la pureza de la línea, la autoridad del volumen, la inteligencia de la síntesis.',
      p1_2: 'Los nuestros son objetos de síntesis. No adornan el cuerpo. Lo sellan.',
      title2: 'Diamantes <br/> por Diseño.',
      p2_1: 'Esta búsqueda de la forma pura exige un material igualmente consciente. Seleccionamos nuestros diamantes no de la tierra, sino del proyecto: creaciones de laboratorio nacidas de una elección ética y tecnológica.',
      p2_2: 'Un diamante PORRATI es química, física y ópticamente idéntico a un diamante natural, pero su origen es una declaración de respeto por el futuro de nuestro planeta.',
    },
    showcase: { title: 'Explorar por Categoría', subtitle: 'Cada creación es una afirmación de rigor e intelecto,<br>diseñada para sellar el estilo personal.', button: 'Explorar', cat1: 'Colgante', cat2: 'Anillo', cat3: 'Pulsera', cat4: 'Pendiente' },
    shader: { title: 'Rigor Digital', subtitle: 'Donde el código encuentra la artesanía.' },
    imageGrid: { title: 'Anatomía de una Idea', subtitle: 'Principios inmutables de rigor, intelecto y permanencia que desafían el tiempo.' },
    // Collections overview
    collectionsTitle: 'Colecciones',
    collectionsSubtitle: 'Expresiones curadas de lujo intelectual.',
    collectionNames: { pendants: 'Colgantes', rings: 'Anillos', bracelets: 'Pulseras', earrings: 'Pendientes' },
    collectionExplore: 'Explorar nuestra exclusiva colección de',
    // Products
    productsTitle: 'Productos',
    noProducts: 'No hay productos disponibles para esta colección en este momento.',
    requestInfo: 'Solicitar Información',
    // Showroom
    showroomTitle: 'Showroom Milán',
    showroomDesc: 'El Borgonuovo-10 Jewel Showroom es el espacio físico donde puedes descubrir y probar las creaciones PORRATI en Milán.',
    address: 'Dirección',
    phone: 'Teléfono',
    hours: 'Horario indicativo: Lunes – Sábado, 10:00 – 19:00. Se recomienda cita previa.',
    openMaps: 'Abrir en Google Maps',
    callShowroom: 'Llamar al showroom',
    experienceTitle: 'Experiencia Showroom',
    experienceP1: 'En el showroom puedes percibir volúmenes, proporciones y la luz de los diamantes lab-grown PORRATI a escala real.',
    experienceP2: 'El espacio está concebido como un atelier arquitectónico: cada pieza se presenta con atención a la composición y la luz.',
    experienceP3: 'Puedes solicitar consultas dedicadas para anillos de compromiso, piezas únicas y colecciones curadas.',
    // FAQ
    faqTitle: 'Preguntas Frecuentes',
    faqItems: [
      { q: '¿Qué son los diamantes lab-grown?', a: 'Los diamantes lab-grown son diamantes reales, creados en laboratorio con la misma composición química, física y óptica que los diamantes naturales. La única diferencia es su origen: tecnología en lugar de minería.' },
      { q: '¿Los diamantes lab-grown son reales?', a: 'Sí, absolutamente. Son diamantes reales certificados por los mismos institutos gemológicos (GIA, IGI) que certifican los diamantes naturales.' },
      { q: '¿Qué materiales utilizan?', a: 'Utilizamos oro blanco de 14 quilates y diamantes lab-grown de la más alta calidad, seleccionados por su fuego excepcional y pureza.' },
      { q: '¿Cómo puedo ver las joyas en persona?', a: 'Puedes visitar nuestro Borgonuovo-10 Jewel Showroom en Milán, Via Borgonuovo 10. Se recomienda cita previa.' },
      { q: '¿Realizan envíos internacionales?', a: 'Sí, realizamos envíos a toda Europa y al resto del mundo. Contacta con nosotros en sales@gemmaeuropa.com para más detalles.' },
    ],
    // Jewel Code
    codeTitle: 'Busca tu Joya',
    codeSubtitle: 'Introduce el código de tu joya PORRATI para verificar autenticidad y ver los detalles del producto.',
    // Archive
    archiveTitle: 'Borgonuovo-10 Archive',
    archiveSubtitle: 'Solicitud de acceso privado al archivo de la colección.',
  },

  de: {
    siteTitle: 'PORRATI | Die Form des Denkens',
    heroTitle: 'Die Form des Denkens',
    heroSubtitle: 'Die Architektur des Selbst.',
    manifesto: {
      title1: 'Die Architektur <br/> des Selbst.',
      p1_1: 'PORRATI entwickelt sich nicht weiter. Es kehrt zum Wesentlichen zurück. In Valenza geboren, widmet sich die Marke unveränderlichen Prinzipien: der Reinheit der Linie, der Autorität des Volumens, der Intelligenz der Synthese.',
      p1_2: 'Unsere Objekte sind Synthese. Sie schmücken den Körper nicht. Sie versiegeln ihn.',
      title2: 'Diamanten <br/> aus Design.',
      p2_1: 'Diese Suche nach reiner Form verlangt ein ebenso bewusstes Material. Wir wählen unsere Diamanten nicht aus der Erde, sondern aus dem Projekt: Laborkreationen, geboren aus einer ethischen und technologischen Entscheidung.',
      p2_2: 'Ein PORRATI-Diamant ist chemisch, physikalisch und optisch identisch mit einem natürlichen Diamanten, aber sein Ursprung ist ein Statement des Respekts für die Zukunft unseres Planeten.',
    },
    showcase: { title: 'Nach Kategorie entdecken', subtitle: 'Jede Kreation ist ein Statement von Strenge und Intellekt,<br>entworfen, um den persönlichen Stil zu versiegeln.', button: 'Entdecken', cat1: 'Anhänger', cat2: 'Ring', cat3: 'Armband', cat4: 'Ohrring' },
    shader: { title: 'Digitale Strenge', subtitle: 'Wo Code auf Handwerk trifft.' },
    imageGrid: { title: 'Anatomie einer Idee', subtitle: 'Unveränderliche Prinzipien von Strenge, Intellekt und Permanenz, die der Zeit trotzen.' },
    collectionsTitle: 'Kollektionen',
    collectionsSubtitle: 'Kuratierte Ausdrücke intellektuellen Luxus.',
    collectionNames: { pendants: 'Anhänger', rings: 'Ringe', bracelets: 'Armbänder', earrings: 'Ohrringe' },
    collectionExplore: 'Entdecken Sie unsere exklusive Kollektion von',
    productsTitle: 'Produkte',
    noProducts: 'Derzeit sind keine Produkte für diese Kollektion verfügbar.',
    requestInfo: 'Informationen anfordern',
    showroomTitle: 'Showroom Mailand',
    showroomDesc: 'Der Borgonuovo-10 Jewel Showroom ist der physische Raum, in dem Sie PORRATI-Kreationen in Mailand entdecken und anprobieren können.',
    address: 'Adresse',
    phone: 'Telefon',
    hours: 'Richtwerte: Montag – Samstag, 10:00 – 19:00. Terminvereinbarung empfohlen.',
    openMaps: 'In Google Maps öffnen',
    callShowroom: 'Showroom anrufen',
    experienceTitle: 'Showroom-Erlebnis',
    experienceP1: 'Im Showroom können Sie Volumen, Proportionen und das Licht der PORRATI Lab-Grown-Diamanten im realen Maßstab erleben.',
    experienceP2: 'Der Raum ist als architektonisches Atelier konzipiert: Jedes Stück wird mit Aufmerksamkeit für Komposition und Licht präsentiert.',
    experienceP3: 'Sie können individuelle Beratungen für Verlobungsringe, Einzelstücke und kuratierte Kollektionen anfordern.',
    faqTitle: 'Häufig gestellte Fragen',
    faqItems: [
      { q: 'Was sind Lab-Grown-Diamanten?', a: 'Lab-Grown-Diamanten sind echte Diamanten, die im Labor mit der gleichen chemischen, physikalischen und optischen Zusammensetzung wie natürliche Diamanten hergestellt werden.' },
      { q: 'Sind Lab-Grown-Diamanten echt?', a: 'Ja, absolut. Sie sind echte Diamanten, die von denselben gemmologischen Instituten (GIA, IGI) zertifiziert werden wie natürliche Diamanten.' },
      { q: 'Welche Materialien verwenden Sie?', a: 'Wir verwenden 14-Karat-Weißgold und Lab-Grown-Diamanten höchster Qualität, ausgewählt für ihr außergewöhnliches Feuer und ihre Reinheit.' },
      { q: 'Wie kann ich den Schmuck persönlich sehen?', a: 'Besuchen Sie unseren Borgonuovo-10 Jewel Showroom in Mailand, Via Borgonuovo 10. Terminvereinbarung empfohlen.' },
      { q: 'Liefern Sie international?', a: 'Ja, wir liefern europaweit und weltweit. Kontaktieren Sie uns unter sales@gemmaeuropa.com für Details.' },
    ],
    codeTitle: 'Finden Sie Ihr Schmuckstück',
    codeSubtitle: 'Geben Sie den Code Ihres PORRATI-Schmuckstücks ein, um die Echtheit zu überprüfen und Produktdetails anzuzeigen.',
    archiveTitle: 'Borgonuovo-10 Archiv',
    archiveSubtitle: 'Antrag auf privaten Zugang zum Kollektionsarchiv.',
  },

  ar: {
    siteTitle: 'PORRATI | شكل الفكر',
    heroTitle: 'شكل الفكر',
    heroSubtitle: 'هندسة الذات.',
    manifesto: {
      title1: 'هندسة <br/> الذات.',
      p1_1: 'PORRATI لا يتطور. يعود إلى الجوهر. ولد في فالينزا، تكرس العلامة نفسها لمبادئ ثابتة: نقاء الخط، سلطة الحجم، ذكاء التوليف.',
      p1_2: 'منتجاتنا أشياء توليفية. لا تزين الجسد. بل تختمه.',
      title2: 'ألماس <br/> بالتصميم.',
      p2_1: 'هذا البحث عن الشكل النقي يتطلب مادة واعية بنفس القدر. نختار ألماسنا ليس من الأرض، بل من المشروع: إبداعات مختبرية ولدت من خيار أخلاقي وتكنولوجي.',
      p2_2: 'ألماس PORRATI مطابق كيميائياً وفيزيائياً وبصرياً للألماس الطبيعي، لكن أصله بيان احترام لمستقبل كوكبنا.',
    },
    showcase: { title: 'استكشف حسب الفئة', subtitle: 'كل إبداع هو تأكيد على الدقة والفكر،<br>مصمم لختم الأسلوب الشخصي.', button: 'استكشف', cat1: 'قلادة', cat2: 'خاتم', cat3: 'سوار', cat4: 'قرط' },
    shader: { title: 'الدقة الرقمية', subtitle: 'حيث يلتقي الكود بالحرفية.' },
    imageGrid: { title: 'تشريح فكرة', subtitle: 'مبادئ ثابتة من الدقة والفكر والديمومة تتحدى الزمن.' },
    collectionsTitle: 'المجموعات',
    collectionsSubtitle: 'تعبيرات منسقة عن الرفاهية الفكرية.',
    collectionNames: { pendants: 'قلادات', rings: 'خواتم', bracelets: 'أساور', earrings: 'أقراط' },
    collectionExplore: 'استكشف مجموعتنا الحصرية من',
    productsTitle: 'المنتجات',
    noProducts: 'لا توجد منتجات متاحة لهذه المجموعة حالياً.',
    requestInfo: 'طلب معلومات',
    showroomTitle: 'صالة عرض ميلانو',
    showroomDesc: 'صالة عرض Borgonuovo-10 هي المساحة الفعلية حيث يمكنك اكتشاف وتجربة إبداعات PORRATI في ميلانو.',
    address: 'العنوان',
    phone: 'الهاتف',
    hours: 'ساعات العمل التقريبية: الإثنين – السبت، 10:00 – 19:00. يُنصح بحجز موعد مسبق.',
    openMaps: 'فتح في خرائط جوجل',
    callShowroom: 'اتصل بصالة العرض',
    experienceTitle: 'تجربة صالة العرض',
    experienceP1: 'في صالة العرض يمكنك إدراك الأحجام والنسب وضوء ألماس PORRATI المصنع في المختبر بالحجم الحقيقي.',
    experienceP2: 'المساحة مصممة كمحترف معماري: كل قطعة تُقدم مع اهتمام بالتكوين والإضاءة.',
    experienceP3: 'يمكنك طلب استشارات مخصصة لخواتم الخطوبة والقطع الفريدة والمجموعات المنسقة.',
    faqTitle: 'الأسئلة الشائعة',
    faqItems: [
      { q: 'ما هي الألماسات المصنعة في المختبر؟', a: 'الألماسات المصنعة في المختبر هي ألماسات حقيقية، تُصنع في المختبر بنفس التركيب الكيميائي والفيزيائي والبصري للألماسات الطبيعية.' },
      { q: 'هل الألماسات المصنعة حقيقية؟', a: 'نعم، بالتأكيد. إنها ألماسات حقيقية معتمدة من نفس المعاهد الجمولوجية (GIA, IGI) التي تعتمد الألماسات الطبيعية.' },
      { q: 'ما المواد التي تستخدمونها؟', a: 'نستخدم الذهب الأبيض عيار 14 قيراط وألماسات مصنعة في المختبر من أعلى جودة.' },
      { q: 'كيف يمكنني رؤية المجوهرات شخصياً؟', a: 'يمكنك زيارة صالة عرض Borgonuovo-10 في ميلانو، Via Borgonuovo 10. يُنصح بحجز موعد.' },
      { q: 'هل تقومون بالشحن الدولي؟', a: 'نعم، نشحن إلى جميع أنحاء أوروبا والعالم. اتصل بنا على sales@gemmaeuropa.com للتفاصيل.' },
    ],
    codeTitle: 'ابحث عن مجوهراتك',
    codeSubtitle: 'أدخل رمز مجوهرات PORRATI للتحقق من الأصالة وعرض تفاصيل المنتج.',
    archiveTitle: 'أرشيف Borgonuovo-10',
    archiveSubtitle: 'طلب وصول خاص لأرشيف المجموعة.',
  }
};

// ═══════════════════════════════════════════════════════════════
// PAGE GENERATORS
// ═══════════════════════════════════════════════════════════════

const langConfig = {
  es: { routes: { collections: 'colecciones', products: 'productos', showroom: 'showroom-milan', code: 'codigo-joya', faq: 'faq', archive: 'borgonuovo10-archive' }, slugs: { pendants: 'colgantes', rings: 'anillos', bracelets: 'pulseras', earrings: 'pendientes' }, paramName: 'coleccion', productParam: 'producto' },
  de: { routes: { collections: 'kollektionen', products: 'produkte', showroom: 'showroom-mailand', code: 'schmuck-code', faq: 'faq', archive: 'borgonuovo10-archive' }, slugs: { pendants: 'anhaenger', rings: 'ringe', bracelets: 'armbaender', earrings: 'ohrringe' }, paramName: 'kollektion', productParam: 'produkt' },
  ar: { routes: { collections: 'collections', products: 'products', showroom: 'showroom-milan', code: 'jewel-code', faq: 'faq', archive: 'borgonuovo10-archive' }, slugs: { pendants: 'pendants', rings: 'rings', bracelets: 'bracelets', earrings: 'earrings' }, paramName: 'collection', productParam: 'product' },
};

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf-8');
  console.log(`✓ ${path.replace(ROOT + '/', '')}`);
}

for (const [lang, t] of Object.entries(T)) {
  const cfg = langConfig[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const dirAttr = lang === 'ar' ? ' dir="rtl"' : '';

  // ── HOMEPAGE ──────────────────────────────────────────────
  writeFile(join(PAGES, lang, 'index.astro'), `---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import Manifesto from '../../components/Manifesto.astro';
import JewelryShowcase from '../../components/JewelryShowcase.astro';
import ShaderBackground from '../../components/ShaderBackground.astro';
import ImageGrid from '../../components/ImageGrid.astro';
---
<Layout title="${t.siteTitle}" lang="${lang}">
\t<Hero title="${t.heroTitle}" subtitle="${t.heroSubtitle}" />
\t<Manifesto 
\t\ttitle1="${t.manifesto.title1}"
\t\tp1_1="${t.manifesto.p1_1}"
\t\tp1_2="${t.manifesto.p1_2}"
\t\ttitle2="${t.manifesto.title2}"
\t\tp2_1="${t.manifesto.p2_1}"
\t\tp2_2="${t.manifesto.p2_2}"
\t/>
\t<JewelryShowcase 
\t\ttitle="${t.showcase.title}"
\t\tsubtitle="${t.showcase.subtitle}"
\t\tbuttonText="${t.showcase.button}"
\t\tcat1Name="${t.showcase.cat1}"
\t\tcat2Name="${t.showcase.cat2}"
\t\tcat3Name="${t.showcase.cat3}"
\t\tcat4Name="${t.showcase.cat4}"
\t/>
\t<ShaderBackground title="${t.shader.title}" subtitle="${t.shader.subtitle}" />
\t<ImageGrid title="${t.imageGrid.title}" subtitle="${t.imageGrid.subtitle}" />
</Layout>
<script>
\timport '../../scripts/animations.js';
</script>
`);

  // ── COLLECTIONS OVERVIEW ──────────────────────────────────
  writeFile(join(PAGES, lang, cfg.routes.collections, 'index.astro'), `---
import Layout from '../../../layouts/Layout.astro';
const collectionNames = { '${cfg.slugs.pendants}': '${t.collectionNames.pendants}', '${cfg.slugs.rings}': '${t.collectionNames.rings}', '${cfg.slugs.bracelets}': '${t.collectionNames.bracelets}', '${cfg.slugs.earrings}': '${t.collectionNames.earrings}' };
---
<Layout title="PORRATI | ${t.collectionsTitle}" lang="${lang}">
\t<main class="py-32 md:py-40 bg-nero-assoluto">
\t\t<div class="max-w-7xl mx-auto px-6 lg:px-8">
\t\t\t<div class="text-center mb-16">
\t\t\t\t<h1 class="font-bodoni text-5xl text-bianco-sporco">${t.collectionsTitle}</h1>
\t\t\t\t<p class="mt-4 text-lg text-greige-chiaro">${t.collectionsSubtitle}</p>
\t\t\t</div>
\t\t\t<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
\t\t\t\t{Object.entries(collectionNames).map(([slug, name]) => (
\t\t\t\t\t<a href={\`/${lang}/${cfg.routes.collections}/\${slug}\`} class="group block p-8 rounded-2xl border border-grigio-antracite/30 hover:border-greige-chiaro/50 transition-all duration-300">
\t\t\t\t\t\t<h2 class="font-bodoni text-3xl text-bianco-sporco group-hover:text-greige-chiaro transition-colors">{name}</h2>
\t\t\t\t\t</a>
\t\t\t\t))}
\t\t\t</div>
\t\t</div>
\t</main>
</Layout>
`);

  // ── COLLECTION DETAIL (dynamic route) ─────────────────────
  writeFile(join(PAGES, lang, cfg.routes.collections, `[${cfg.paramName}].astro`), `---
import Layout from '../../../layouts/Layout.astro';
import allProducts from '../../../data/products.json';
const collectionNames = { '${cfg.slugs.pendants}': '${t.collectionNames.pendants}', '${cfg.slugs.rings}': '${t.collectionNames.rings}', '${cfg.slugs.bracelets}': '${t.collectionNames.bracelets}', '${cfg.slugs.earrings}': '${t.collectionNames.earrings}' };
const categoryMap = { '${cfg.slugs.pendants}': 'pendants', '${cfg.slugs.rings}': 'rings', '${cfg.slugs.bracelets}': 'bracelets', '${cfg.slugs.earrings}': 'earrings' };
const productsData = allProducts['${lang}'] || allProducts.en;

export function getStaticPaths() {
\treturn [
\t\t{ params: { ${cfg.paramName}: '${cfg.slugs.pendants}' } },
\t\t{ params: { ${cfg.paramName}: '${cfg.slugs.rings}' } },
\t\t{ params: { ${cfg.paramName}: '${cfg.slugs.bracelets}' } },
\t\t{ params: { ${cfg.paramName}: '${cfg.slugs.earrings}' } }
\t];
}

const { ${cfg.paramName} } = Astro.params;
if (!collectionNames[${cfg.paramName}]) { return new Response(null, { status: 404 }); }
const products = Object.entries(productsData).filter(([id, data]) => data.category === categoryMap[${cfg.paramName}]).map(([id, data]) => ({ id, ...data }));
const collectionName = collectionNames[${cfg.paramName}];
---
<Layout title={\`PORRATI | \${collectionName}\`} lang="${lang}">
\t<main class="py-32 md:py-40 bg-nero-assoluto">
\t\t<div class="max-w-7xl mx-auto px-6 lg:px-8">
\t\t\t<div class="text-center mb-16">
\t\t\t\t<h1 class="font-bodoni text-5xl text-bianco-sporco">{collectionName}</h1>
\t\t\t\t<p class="mt-4 text-lg text-greige-chiaro">${t.collectionExplore} {collectionName.toLowerCase()}.</p>
\t\t\t</div>
\t\t\t{products.length > 0 ? (
\t\t\t\t<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
\t\t\t\t\t{products.map(product => (
\t\t\t\t\t\t<a href={\`/${lang}/${cfg.routes.products}/\${product.id}\`} class="group block">
\t\t\t\t\t\t\t<div class="aspect-square bg-grigio-blu-notte/30 rounded-lg overflow-hidden">
\t\t\t\t\t\t\t\t<video src={product.video.replace('/videos/', '/videos-optimized/')} poster={product.poster || undefined} class="video-card w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" autoplay loop muted playsinline preload="none"></video>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<h3 class="font-serif text-xl text-center mt-4 text-bianco-sporco">{product.title}</h3>
\t\t\t\t\t\t</a>
\t\t\t\t\t))}
\t\t\t\t</div>
\t\t\t) : (
\t\t\t\t<div class="text-center py-20"><p class="text-greige-chiaro text-xl">${t.noProducts}</p></div>
\t\t\t)}
\t\t</div>
\t</main>
</Layout>
<script>
\tdocument.addEventListener('astro:page-load', () => {
\t\tconst videos = document.querySelectorAll('.video-card');
\t\tconst playVideo = (video) => { if (video.paused) { video.play()?.catch(() => {}); } };
\t\tconst observer = new IntersectionObserver((entries) => {
\t\t\tentries.forEach(entry => { const v = entry.target; entry.isIntersecting ? playVideo(v) : v.pause(); });
\t\t}, { threshold: 0.1 });
\t\tvideos.forEach(v => { observer.observe(v); });
\t});
</script>
`);

  // ── PRODUCTS OVERVIEW ─────────────────────────────────────
  writeFile(join(PAGES, lang, cfg.routes.products, 'index.astro'), `---
import Layout from '../../../layouts/Layout.astro';
import allProducts from '../../../data/products.json';
const productsData = allProducts['${lang}'] || allProducts.en;
const products = Object.entries(productsData).map(([id, data]) => ({ id, ...data }));
---
<Layout title="PORRATI | ${t.productsTitle}" lang="${lang}">
\t<main class="py-32 md:py-40 bg-nero-assoluto">
\t\t<div class="max-w-7xl mx-auto px-6 lg:px-8">
\t\t\t<div class="text-center mb-16">
\t\t\t\t<h1 class="font-bodoni text-5xl text-bianco-sporco">${t.productsTitle}</h1>
\t\t\t</div>
\t\t\t<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
\t\t\t\t{products.map(product => (
\t\t\t\t\t<a href={\`/${lang}/${cfg.routes.products}/\${product.id}\`} class="group block">
\t\t\t\t\t\t<div class="aspect-square bg-grigio-blu-notte/30 rounded-lg overflow-hidden">
\t\t\t\t\t\t\t<video src={product.video.replace('/videos/', '/videos-optimized/')} poster={product.poster || undefined} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" autoplay loop muted playsinline preload="none"></video>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<h3 class="font-serif text-xl text-center mt-4 text-bianco-sporco">{product.title}</h3>
\t\t\t\t\t</a>
\t\t\t\t))}
\t\t\t</div>
\t\t</div>
\t</main>
</Layout>
`);

  // ── PRODUCT DETAIL ────────────────────────────────────────
  writeFile(join(PAGES, lang, cfg.routes.products, `[${cfg.productParam}].astro`), `---
import Layout from '../../../layouts/Layout.astro';
import allProducts from '../../../data/products.json';
const productsData = allProducts['${lang}'] || allProducts.en;

export function getStaticPaths() {
\tconst data = (await import('../../../data/products.json')).default;
\tconst products = data['${lang}'] || data.en;
\treturn Object.keys(products).map(id => ({ params: { ${cfg.productParam}: id } }));
}

const { ${cfg.productParam} } = Astro.params;
const data = productsData[${cfg.productParam}];
if (!data) { return new Response(null, { status: 404 }); }
---
<Layout title={\`PORRATI | \${data.title}\`} lang="${lang}">
\t<main class="py-32 md:py-40 bg-nero-assoluto">
\t\t<div class="max-w-7xl mx-auto px-6 lg:px-8">
\t\t\t<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
\t\t\t\t<div class="aspect-square bg-grigio-blu-notte/30 rounded-lg overflow-hidden">
\t\t\t\t\t<video src={data.video} poster={data.poster || undefined} class="w-full h-full object-cover" autoplay loop muted playsinline preload="metadata"></video>
\t\t\t\t</div>
\t\t\t\t<div>
\t\t\t\t\t<h1 class="font-bodoni text-4xl md:text-5xl text-bianco-sporco">{data.title}</h1>
\t\t\t\t\t<p class="mt-4 text-lg text-greige-chiaro leading-relaxed">{data.description}</p>
\t\t\t\t\t<ul class="mt-8 space-y-2 border-t border-grigio-antracite pt-6">
\t\t\t\t\t\t{data.details.map(detail => (
\t\t\t\t\t\t\t<li class="flex items-center text-greige-chiaro">
\t\t\t\t\t\t\t\t<svg class="w-4 h-4 mr-3 text-greige-chiaro/50" fill="currentColor" viewBox="0 0 20 20">...</svg>
\t\t\t\t\t\t\t\t<span>{detail}</span>
\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t))}
\t\t\t\t\t</ul>
\t\t\t\t\t<a href="mailto:sales@gemmaeuropa.com" class="inline-block mt-8 px-8 py-3 bg-bianco-sporco text-nero-assoluto font-medium rounded-full hover:bg-greige-chiaro transition-colors">
\t\t\t\t\t\t${t.requestInfo}
\t\t\t\t\t</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</main>
</Layout>
`);

  // ── SHOWROOM ──────────────────────────────────────────────
  writeFile(join(PAGES, lang, cfg.routes.showroom + '.astro'), `---
import Layout from '../../layouts/Layout.astro';
---
<Layout title="${t.showroomTitle} | PORRATI" lang="${lang}">
\t<main class="bg-nero-assoluto py-24 md:py-32">
\t\t<div class="max-w-5xl mx-auto px-6">
\t\t\t<h1 class="font-bodoni text-4xl md:text-5xl text-bianco-sporco mb-6">${t.showroomTitle}</h1>
\t\t\t<p class="text-greige-chiaro text-lg mb-10">${t.showroomDesc}</p>
\t\t\t<div class="grid md:grid-cols-2 gap-10 mb-16">
\t\t\t\t<section>
\t\t\t\t\t<h2 class="font-bodoni text-2xl text-bianco-sporco mb-4">${t.address}</h2>
\t\t\t\t\t<p class="text-greige-chiaro">Via Borgonuovo, 10<br />20121 Milano MI, Italia</p>
\t\t\t\t\t<div class="mt-4 space-y-2">
\t\t\t\t\t\t<p class="text-greige-chiaro">${t.phone}: <a href="tel:+390223185211" class="underline hover:text-bianco-sporco">+39 02 2318 5211</a></p>
\t\t\t\t\t\t<p class="text-greige-chiaro">${t.hours}</p>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="mt-6 flex flex-wrap gap-3">
\t\t\t\t\t\t<a href="https://www.google.com/maps/search/?api=1&query=Via+Borgonuovo,+10,+20121+Milano+MI,+Italy" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 rounded-full bg-bianco-sporco text-nero-assoluto text-sm font-medium">${t.openMaps}</a>
\t\t\t\t\t\t<a href="tel:+390223185211" class="inline-flex items-center px-4 py-2 rounded-full border border-bianco-sporco text-bianco-sporco text-sm font-medium">${t.callShowroom}</a>
\t\t\t\t\t</div>
\t\t\t\t</section>
\t\t\t\t<section>
\t\t\t\t\t<h2 class="font-bodoni text-2xl text-bianco-sporco mb-4">${t.experienceTitle}</h2>
\t\t\t\t\t<p class="text-greige-chiaro mb-3">${t.experienceP1}</p>
\t\t\t\t\t<p class="text-greige-chiaro mb-3">${t.experienceP2}</p>
\t\t\t\t\t<p class="text-greige-chiaro">${t.experienceP3}</p>
\t\t\t\t</section>
\t\t\t</div>
\t\t</div>
\t</main>
</Layout>
`);

  // ── FAQ ────────────────────────────────────────────────────
  const faqHtml = t.faqItems.map((item, i) => `\t\t\t\t<details class="border-b border-grigio-antracite py-4 group">
\t\t\t\t\t<summary class="cursor-pointer text-bianco-sporco font-medium text-lg flex justify-between items-center">
\t\t\t\t\t\t<span>${item.q}</span>
\t\t\t\t\t\t<svg class="w-5 h-5 text-greige-chiaro transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
\t\t\t\t\t</summary>
\t\t\t\t\t<p class="mt-3 text-greige-chiaro leading-relaxed">${item.a}</p>
\t\t\t\t</details>`).join('\n');

  writeFile(join(PAGES, lang, cfg.routes.faq + '.astro'), `---
import Layout from '../../layouts/Layout.astro';
---
<Layout title="${t.faqTitle} | PORRATI" lang="${lang}">
\t<main class="bg-nero-assoluto py-24 md:py-32">
\t\t<div class="max-w-3xl mx-auto px-6">
\t\t\t<h1 class="font-bodoni text-4xl md:text-5xl text-bianco-sporco mb-10">${t.faqTitle}</h1>
\t\t\t<div class="space-y-0">
${faqHtml}
\t\t\t</div>
\t\t</div>
\t</main>
</Layout>
`);

  // ── JEWEL CODE ────────────────────────────────────────────
  writeFile(join(PAGES, lang, cfg.routes.code + '.astro'), `---
import Layout from '../../layouts/Layout.astro';
import JewelCodeSearch from '../../components/react/JewelCodeSearch.tsx';
---
<Layout title="${t.codeTitle} | PORRATI" lang="${lang}">
\t<main class="bg-nero-assoluto py-24 md:py-32">
\t\t<div class="max-w-7xl mx-auto px-6">
\t\t\t<div class="text-center mb-12">
\t\t\t\t<h1 class="font-bodoni text-4xl md:text-5xl text-bianco-sporco mb-4">${t.codeTitle}</h1>
\t\t\t\t<p class="text-greige-chiaro text-lg max-w-2xl mx-auto">${t.codeSubtitle}</p>
\t\t\t</div>
\t\t\t<JewelCodeSearch client:load lang="${lang}" />
\t\t</div>
\t</main>
</Layout>
`);

  // ── ARCHIVE ───────────────────────────────────────────────
  writeFile(join(PAGES, lang, cfg.routes.archive + '.astro'), `---
import Layout from '../../layouts/Layout.astro';
import Borgonuovo10ArchiveForm from '../../components/react/Borgonuovo10ArchiveForm.tsx';
---
<Layout title="${t.archiveTitle} | PORRATI" lang="${lang}">
\t<main class="bg-nero-assoluto py-24 md:py-32">
\t\t<div class="max-w-3xl mx-auto px-6 text-center">
\t\t\t<h1 class="font-bodoni text-4xl md:text-5xl text-bianco-sporco mb-4">${t.archiveTitle}</h1>
\t\t\t<p class="text-greige-chiaro text-lg mb-10">${t.archiveSubtitle}</p>
\t\t\t<Borgonuovo10ArchiveForm client:load lang="${lang}" />
\t\t</div>
\t</main>
</Layout>
`);
}

// ═══════════════════════════════════════════════════════════════
// UPDATE PRODUCTS.JSON — copy EN data for ES/DE/AR
// ═══════════════════════════════════════════════════════════════
const productsPath = join(ROOT, 'src/data/products.json');
const products = JSON.parse(readFileSync(productsPath, 'utf-8'));

for (const lang of ['es', 'de', 'ar']) {
  if (!products[lang]) {
    // Copy from EN as base — product titles/descriptions stay in English
    // (can be translated later by the user or AI)
    products[lang] = JSON.parse(JSON.stringify(products.en));
    console.log(`✓ products.json: added "${lang}" section (copied from EN)`);
  }
}

writeFileSync(productsPath, JSON.stringify(products, null, 2) + '\n');

console.log('\n═══════════════════════════════════════════');
console.log('  All language pages generated!');
console.log('  ES: Spanish, DE: German, AR: Arabic');
console.log('═══════════════════════════════════════════');
