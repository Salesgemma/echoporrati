#!/usr/bin/env node
/**
 * Translates product titles and descriptions from EN into ES, DE, AR.
 * Brand names in quotes stay unchanged. Descriptive parts get translated.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = join(ROOT, 'src/data/products.json');
const p = JSON.parse(readFileSync(P, 'utf-8'));

// Word-level translations for product type descriptors
const titleWords = {
  es: {
    'Diamond Floral Bracelet': 'Pulsera Floral de Diamantes',
    'Pear-Cut Tennis Bracelet': 'Pulsera Tennis Talla Gota',
    'Grand Tennis Bracelet': 'Pulsera Tennis Grand',
    'Classic Tennis Bracelet': 'Pulsera Tennis Clásica',
    'Essential Tennis Bracelet': 'Pulsera Tennis Esencial',
    'Fancy Color Diamond Bracelet': 'Pulsera de Diamantes Fancy Color',
    'Emerald-Cut Tennis Bracelet': 'Pulsera Tennis Talla Esmeralda',
    'Emerald-Cut Diamond Bracelet': 'Pulsera de Diamantes Talla Esmeralda',
    'Pear-Cut Drop Earrings': 'Pendientes Colgantes Talla Gota',
    'Graduated Diamond Drop Earrings': 'Pendientes Graduados de Diamantes',
    'Emerald-Cut & Fancy Color Earrings': 'Pendientes Talla Esmeralda y Fancy Color',
    'Floral Fancy Diamond Earrings': 'Pendientes Florales de Diamantes Fancy',
    'Mixed-Cut Linear Earrings': 'Pendientes Lineales Talla Mixta',
    'Drop Earrings with Fancy Pear': 'Pendientes con Gota Fancy',
    'Drop Earrings with Fancy Color Pear': 'Pendientes con Gota Fancy Color',
    'Chandelier Earrings in 14k White Gold': 'Pendientes Chandelier en Oro Blanco 14k',
    'Fancy Blue Diamond Ring': 'Anillo de Diamante Fancy Azul',
    'Fancy Pink Diamond Ring': 'Anillo de Diamante Fancy Rosa',
    'Fancy Pink Diamond Trilogy Ring': 'Anillo Trilogía de Diamante Fancy Rosa',
    'Fancy Diamond Trilogy Ring': 'Anillo Trilogía de Diamante Fancy',
    'Fancy Green Diamond Trilogy Ring': 'Anillo Trilogía de Diamante Fancy Verde',
    'Fancy Pink Heart-Cut Halo Ring': 'Anillo Halo Corazón Fancy Rosa',
    'Fancy Diamond Ring': 'Anillo de Diamante Fancy',
    'Fancy Pink Drop Ring': 'Anillo con Gota Fancy Rosa',
    'Sunburst Halo Ring': 'Anillo Halo Resplandeciente',
    'Fancy Diamond Ring with Micro-Pavé': 'Anillo de Diamante Fancy con Micro-Pavé',
    'Fancy Blue Diamond Ring with Micro-Pavé': 'Anillo de Diamante Fancy Azul con Micro-Pavé',
    'Bypass Design Ring': 'Anillo Diseño Bypass',
    'Fancy Greenish-Yellow Diamond Pendant': 'Colgante de Diamante Fancy Amarillo-Verdoso',
    'Fancy Pink Pear-Cut Diamond Pendant': 'Colgante de Diamante Fancy Rosa Talla Gota',
    'Fancy Pink Double Halo Pendant': 'Colgante Doble Halo Fancy Rosa',
    'Fancy Blue Emerald-Cut Diamond Pendant': 'Colgante de Diamante Fancy Azul Talla Esmeralda',
  },
  de: {
    'Diamond Floral Bracelet': 'Florales Diamant-Armband',
    'Pear-Cut Tennis Bracelet': 'Tennis-Armband im Tropfenschliff',
    'Grand Tennis Bracelet': 'Grand Tennis-Armband',
    'Classic Tennis Bracelet': 'Klassisches Tennis-Armband',
    'Essential Tennis Bracelet': 'Essential Tennis-Armband',
    'Fancy Color Diamond Bracelet': 'Fancy-Color-Diamant-Armband',
    'Emerald-Cut Tennis Bracelet': 'Tennis-Armband im Smaragdschliff',
    'Emerald-Cut Diamond Bracelet': 'Diamant-Armband im Smaragdschliff',
    'Pear-Cut Drop Earrings': 'Tropfenohrringe im Tropfenschliff',
    'Graduated Diamond Drop Earrings': 'Graduierte Diamant-Tropfenohrringe',
    'Emerald-Cut & Fancy Color Earrings': 'Smaragdschliff- & Fancy-Color-Ohrringe',
    'Floral Fancy Diamond Earrings': 'Florale Fancy-Diamant-Ohrringe',
    'Mixed-Cut Linear Earrings': 'Lineare Ohrringe im Mischschliff',
    'Drop Earrings with Fancy Pear': 'Tropfenohrringe mit Fancy-Tropfen',
    'Drop Earrings with Fancy Color Pear': 'Tropfenohrringe mit Fancy-Color-Tropfen',
    'Chandelier Earrings in 14k White Gold': 'Kronleuchter-Ohrringe in 14k Weißgold',
    'Fancy Blue Diamond Ring': 'Fancy-Blau-Diamantring',
    'Fancy Pink Diamond Ring': 'Fancy-Rosa-Diamantring',
    'Fancy Pink Diamond Trilogy Ring': 'Fancy-Rosa-Diamant-Trilogiering',
    'Fancy Diamond Trilogy Ring': 'Fancy-Diamant-Trilogiering',
    'Fancy Green Diamond Trilogy Ring': 'Fancy-Grün-Diamant-Trilogiering',
    'Fancy Pink Heart-Cut Halo Ring': 'Fancy-Rosa-Herzschliff-Halo-Ring',
    'Fancy Diamond Ring': 'Fancy-Diamantring',
    'Fancy Pink Drop Ring': 'Fancy-Rosa-Tropfenring',
    'Sunburst Halo Ring': 'Sonnenstrahl-Halo-Ring',
    'Fancy Diamond Ring with Micro-Pavé': 'Fancy-Diamantring mit Micro-Pavé',
    'Fancy Blue Diamond Ring with Micro-Pavé': 'Fancy-Blau-Diamantring mit Micro-Pavé',
    'Bypass Design Ring': 'Bypass-Design-Ring',
    'Fancy Greenish-Yellow Diamond Pendant': 'Fancy-Gelbgrün-Diamant-Anhänger',
    'Fancy Pink Pear-Cut Diamond Pendant': 'Fancy-Rosa-Tropfenschliff-Diamant-Anhänger',
    'Fancy Pink Double Halo Pendant': 'Fancy-Rosa-Doppel-Halo-Anhänger',
    'Fancy Blue Emerald-Cut Diamond Pendant': 'Fancy-Blau-Smaragdschliff-Diamant-Anhänger',
  },
  ar: {
    'Diamond Floral Bracelet': 'سوار ألماس زهري',
    'Pear-Cut Tennis Bracelet': 'سوار تنس قطع الكمثرى',
    'Grand Tennis Bracelet': 'سوار تنس كبير',
    'Classic Tennis Bracelet': 'سوار تنس كلاسيكي',
    'Essential Tennis Bracelet': 'سوار تنس أساسي',
    'Fancy Color Diamond Bracelet': 'سوار ألماس ملون فاخر',
    'Emerald-Cut Tennis Bracelet': 'سوار تنس قطع الزمرد',
    'Emerald-Cut Diamond Bracelet': 'سوار ألماس قطع الزمرد',
    'Pear-Cut Drop Earrings': 'أقراط متدلية قطع الكمثرى',
    'Graduated Diamond Drop Earrings': 'أقراط ألماس متدرجة',
    'Emerald-Cut & Fancy Color Earrings': 'أقراط قطع الزمرد وملونة فاخرة',
    'Floral Fancy Diamond Earrings': 'أقراط ألماس زهرية فاخرة',
    'Mixed-Cut Linear Earrings': 'أقراط خطية قطع مختلط',
    'Drop Earrings with Fancy Pear': 'أقراط متدلية مع كمثرى فاخرة',
    'Drop Earrings with Fancy Color Pear': 'أقراط متدلية مع كمثرى ملونة فاخرة',
    'Chandelier Earrings in 14k White Gold': 'أقراط ثريا من ذهب أبيض 14 قيراط',
    'Fancy Blue Diamond Ring': 'خاتم ألماس أزرق فاخر',
    'Fancy Pink Diamond Ring': 'خاتم ألماس وردي فاخر',
    'Fancy Pink Diamond Trilogy Ring': 'خاتم ثلاثي ألماس وردي فاخر',
    'Fancy Diamond Trilogy Ring': 'خاتم ثلاثي ألماس فاخر',
    'Fancy Green Diamond Trilogy Ring': 'خاتم ثلاثي ألماس أخضر فاخر',
    'Fancy Pink Heart-Cut Halo Ring': 'خاتم هالة قلب وردي فاخر',
    'Fancy Diamond Ring': 'خاتم ألماس فاخر',
    'Fancy Pink Drop Ring': 'خاتم قطرة وردية فاخرة',
    'Sunburst Halo Ring': 'خاتم هالة شعاعية',
    'Fancy Diamond Ring with Micro-Pavé': 'خاتم ألماس فاخر مع ميكرو بافيه',
    'Fancy Blue Diamond Ring with Micro-Pavé': 'خاتم ألماس أزرق فاخر مع ميكرو بافيه',
    'Bypass Design Ring': 'خاتم تصميم بايباس',
    'Fancy Greenish-Yellow Diamond Pendant': 'قلادة ألماس أصفر مخضر فاخر',
    'Fancy Pink Pear-Cut Diamond Pendant': 'قلادة ألماس وردي قطع الكمثرى',
    'Fancy Pink Double Halo Pendant': 'قلادة هالة مزدوجة وردية فاخرة',
    'Fancy Blue Emerald-Cut Diamond Pendant': 'قلادة ألماس أزرق قطع الزمرد',
  }
};

// Also translate the bracelet type prefix
const prefixes = {
  es: { 'Bracciale': 'Pulsera' },
  de: { 'Bracciale': 'Armband' },
  ar: { 'Bracciale': 'سوار' },
};

function translateTitle(enTitle, lang) {
  // Try longest match first
  const map = titleWords[lang];
  let translated = enTitle;
  
  // Sort keys by length (longest first) to avoid partial matches
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (translated.includes(key)) {
      translated = translated.replace(key, map[key]);
      break; // Only replace the first (longest) match
    }
  }
  
  return translated;
}

// Apply translations
for (const lang of ['es', 'de', 'ar']) {
  let count = 0;
  for (const [id, product] of Object.entries(p[lang])) {
    const enProduct = p.en[id];
    if (!enProduct) continue;
    
    const newTitle = translateTitle(enProduct.title, lang);
    if (newTitle !== enProduct.title) {
      p[lang][id].title = newTitle;
      count++;
    }
  }
  console.log(`✓ ${lang.toUpperCase()}: ${count} titles translated`);
}

writeFileSync(P, JSON.stringify(p, null, 2) + '\n');
console.log('✓ products.json saved');
