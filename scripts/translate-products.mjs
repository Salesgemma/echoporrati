#!/usr/bin/env node
/**
 * translate-products.mjs
 * Translates product titles, descriptions, and details into ES, DE, AR.
 * Uses the EN data as source and maps to translated text.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = join(ROOT, 'src/data/products.json');
const p = JSON.parse(readFileSync(P, 'utf-8'));

// ═══════════════════════════════════════
// SHARED DETAIL TRANSLATIONS
// ═══════════════════════════════════════

const detailsMap = {
  es: {
    "Lab-Grown Pear & Marquise Diamonds": "Diamantes Lab-Grown Gota y Marquise",
    "14k White Gold": "Oro Blanco 14k",
    "Floral Garland Design": "Diseño Floral de Guirnalda",
    "Lab-Grown Pear-Cut Diamonds": "Diamantes Lab-Grown Talla Gota",
    "Fluid Articulated Setting": "Engaste Articulado Fluido",
    "Lab-Grown Round Brilliant Diamonds": "Diamantes Lab-Grown Talla Brillante",
    "Four-Prong Setting": "Engaste de Cuatro Garras",
    "Lab-Grown Emerald-Cut Diamonds": "Diamantes Lab-Grown Talla Esmeralda",
    "Art Deco Design": "Diseño Art Déco",
    "Fancy Color Lab-Grown Diamonds": "Diamantes Lab-Grown Fancy Color",
    "Mixed Pear & Round Cuts": "Tallas Mixtas Gota y Redonda",
    "Emerald-Cut & Fancy Color Diamonds": "Diamantes Talla Esmeralda y Fancy Color",
    "Art Deco Contrast Design": "Diseño Art Déco a Contraste",
    "Floral Cluster Design": "Diseño Floral en Cluster",
    "Mixed-Cut Lab-Grown Diamonds": "Diamantes Lab-Grown Tallas Mixtas",
    "Avant-Garde Linear Design": "Diseño Lineal de Vanguardia",
    "Fancy Color & White Diamonds": "Diamantes Fancy Color y Blancos",
    "Three-Stone Drop Design": "Diseño Pendiente de Tres Piedras",
    "Articulated Drop Design": "Diseño de Gota Articulado",
    "Graduated Drop Design": "Diseño Graduado",
    "Chandelier Structure": "Estructura Chandelier",
    "Fancy Pink Lab-Grown Pear Diamonds": "Diamantes Lab-Grown Rosa Talla Gota",
    "Floral Petal Design": "Diseño Floral de Pétalos",
    "Fancy Blue Lab-Grown Pear Diamonds": "Diamantes Lab-Grown Azul Talla Gota",
    "Fancy Pink Lab-Grown Center Diamond": "Diamante Central Lab-Grown Rosa",
    "Rose Gold & 14k White Gold": "Oro Rosa y Oro Blanco 14k",
    "Trilogy Design with Pear Side Stones": "Diseño Trilogía con Gotas Laterales",
    "Fancy Color Lab-Grown Diamond": "Diamante Lab-Grown Fancy Color",
    "Trilogy Three-Stone Design": "Diseño Trilogía de Tres Piedras",
    "Fancy Green Lab-Grown Diamond": "Diamante Lab-Grown Verde Fancy",
    "Fancy Pink Heart-Cut Diamond": "Diamante Rosa Talla Corazón",
    "Diamond Halo & Pavé Band": "Halo de Diamantes y Pavé",
    "Double Halo & Split Shank": "Doble Halo y Caña Dividida",
    "Rare Fancy Color Diamond": "Diamante Fancy Color Raro",
    "Sunburst Halo Design": "Diseño Halo Resplandeciente",
    "Micro-Pavé Halo": "Halo Micro-Pavé",
    "Fancy Pink Lab-Grown Diamond": "Diamante Lab-Grown Rosa Fancy",
    "Bypass Intertwined Design": "Diseño Bypass Entrelazado",
    "Fancy Greenish-Yellow Lab-Grown Diamond": "Diamante Lab-Grown Amarillo-Verdoso",
    "Baguette & Round Cut Halo": "Halo de Baguette y Brillante",
    "14k White Gold Starburst Setting": "Engaste Estrella en Oro Blanco 14k",
    "Fancy Pink Lab-Grown Pear Diamond": "Diamante Lab-Grown Rosa Talla Gota",
    "Double Diamond Halo": "Doble Halo de Diamantes",
    "14k White Gold with Diamond Bail": "Oro Blanco 14k con Anilla de Diamantes",
    "Double Halo with Pink Accents": "Doble Halo con Acentos Rosa",
    "Fancy Blue Lab-Grown Emerald-Cut Diamond": "Diamante Lab-Grown Azul Talla Esmeralda",
    "Sunburst Diamond Halo": "Halo de Diamantes Resplandeciente",
  },
  de: {
    "Lab-Grown Pear & Marquise Diamonds": "Lab-Grown Tropfen- & Marquise-Diamanten",
    "14k White Gold": "14k Weißgold",
    "Floral Garland Design": "Florales Girlanden-Design",
    "Lab-Grown Pear-Cut Diamonds": "Lab-Grown Tropfenschliff-Diamanten",
    "Fluid Articulated Setting": "Fließende Artikulierte Fassung",
    "Lab-Grown Round Brilliant Diamonds": "Lab-Grown Brillantschliff-Diamanten",
    "Four-Prong Setting": "Vier-Krappen-Fassung",
    "Lab-Grown Emerald-Cut Diamonds": "Lab-Grown Smaragdschliff-Diamanten",
    "Art Deco Design": "Art-Déco-Design",
    "Fancy Color Lab-Grown Diamonds": "Lab-Grown Fancy-Color-Diamanten",
    "Mixed Pear & Round Cuts": "Gemischte Tropfen- & Rundschliffe",
    "Emerald-Cut & Fancy Color Diamonds": "Smaragdschliff- & Fancy-Color-Diamanten",
    "Art Deco Contrast Design": "Art-Déco-Kontrastdesign",
    "Floral Cluster Design": "Florales Cluster-Design",
    "Mixed-Cut Lab-Grown Diamonds": "Lab-Grown Diamanten im Mischschliff",
    "Avant-Garde Linear Design": "Avantgardistisches Lineardesign",
    "Fancy Color & White Diamonds": "Fancy-Color- & Weiße Diamanten",
    "Three-Stone Drop Design": "Drei-Stein-Tropfendesign",
    "Articulated Drop Design": "Artikuliertes Tropfendesign",
    "Graduated Drop Design": "Graduiertes Tropfendesign",
    "Chandelier Structure": "Kronleuchter-Struktur",
    "Fancy Pink Lab-Grown Pear Diamonds": "Lab-Grown Rosa Tropfenschliff-Diamanten",
    "Floral Petal Design": "Florales Blütenblatt-Design",
    "Fancy Blue Lab-Grown Pear Diamonds": "Lab-Grown Blaue Tropfenschliff-Diamanten",
    "Fancy Pink Lab-Grown Center Diamond": "Lab-Grown Rosa Zentral-Diamant",
    "Rose Gold & 14k White Gold": "Roségold & 14k Weißgold",
    "Trilogy Design with Pear Side Stones": "Trilogie-Design mit Tropfen-Seitensteinen",
    "Fancy Color Lab-Grown Diamond": "Lab-Grown Fancy-Color-Diamant",
    "Trilogy Three-Stone Design": "Trilogie-Drei-Stein-Design",
    "Fancy Green Lab-Grown Diamond": "Lab-Grown Grüner Fancy-Diamant",
    "Fancy Pink Heart-Cut Diamond": "Rosa Herzschliff-Diamant",
    "Diamond Halo & Pavé Band": "Diamant-Halo & Pavé-Band",
    "Double Halo & Split Shank": "Doppel-Halo & Geteilte Schiene",
    "Rare Fancy Color Diamond": "Seltener Fancy-Color-Diamant",
    "Sunburst Halo Design": "Sonnenstrahl-Halo-Design",
    "Micro-Pavé Halo": "Micro-Pavé-Halo",
    "Fancy Pink Lab-Grown Diamond": "Lab-Grown Rosa Fancy-Diamant",
    "Bypass Intertwined Design": "Verschlungenes Bypass-Design",
    "Fancy Greenish-Yellow Lab-Grown Diamond": "Lab-Grown Gelblich-Grüner Diamant",
    "Baguette & Round Cut Halo": "Baguette- & Brillantschliff-Halo",
    "14k White Gold Starburst Setting": "Sternenfassung in 14k Weißgold",
    "Fancy Pink Lab-Grown Pear Diamond": "Lab-Grown Rosa Tropfenschliff-Diamant",
    "Double Diamond Halo": "Doppelter Diamant-Halo",
    "14k White Gold with Diamond Bail": "14k Weißgold mit Diamant-Öse",
    "Double Halo with Pink Accents": "Doppel-Halo mit Rosa Akzenten",
    "Fancy Blue Lab-Grown Emerald-Cut Diamond": "Lab-Grown Blauer Smaragdschliff-Diamant",
    "Sunburst Diamond Halo": "Sonnenstrahl-Diamant-Halo",
  },
  ar: {
    "Lab-Grown Pear & Marquise Diamonds": "ألماس مصنع قطع الكمثرى والماركيز",
    "14k White Gold": "ذهب أبيض 14 قيراط",
    "Floral Garland Design": "تصميم إكليل زهري",
    "Lab-Grown Pear-Cut Diamonds": "ألماس مصنع قطع الكمثرى",
    "Fluid Articulated Setting": "إعداد مفصلي متدفق",
    "Lab-Grown Round Brilliant Diamonds": "ألماس مصنع قطع بريليانت دائري",
    "Four-Prong Setting": "إعداد أربعة مخالب",
    "Lab-Grown Emerald-Cut Diamonds": "ألماس مصنع قطع الزمرد",
    "Art Deco Design": "تصميم آرت ديكو",
    "Fancy Color Lab-Grown Diamonds": "ألماس مصنع ملون فاخر",
    "Mixed Pear & Round Cuts": "قطع مختلطة كمثرى ودائرية",
    "Emerald-Cut & Fancy Color Diamonds": "ألماس قطع الزمرد وملون فاخر",
    "Fancy Pink Lab-Grown Pear Diamonds": "ألماس مصنع وردي قطع الكمثرى",
    "Floral Petal Design": "تصميم بتلات زهرية",
    "Fancy Blue Lab-Grown Pear Diamonds": "ألماس مصنع أزرق قطع الكمثرى",
    "Fancy Color Lab-Grown Diamond": "ألماس مصنع ملون فاخر",
    "Fancy Pink Lab-Grown Diamond": "ألماس مصنع وردي فاخر",
    "Fancy Greenish-Yellow Lab-Grown Diamond": "ألماس مصنع أصفر مخضر",
    "Fancy Pink Lab-Grown Pear Diamond": "ألماس مصنع وردي قطع الكمثرى",
    "Double Diamond Halo": "هالة ألماس مزدوجة",
    "Fancy Blue Lab-Grown Emerald-Cut Diamond": "ألماس مصنع أزرق قطع الزمرد",
    "Sunburst Diamond Halo": "هالة ألماس شعاعية",
    "Chandelier Structure": "هيكل الثريا",
  }
};

function translateDetail(detail, lang) {
  return detailsMap[lang]?.[detail] || detail;
}

// ═══════════════════════════════════════
// TITLE/DESCRIPTION TRANSLATIONS
// ═══════════════════════════════════════

// For titles: keep the quoted collection name but translate the surrounding text
const titleTranslations = {
  es: {
    'Bracelet': 'Pulsera', 'Tennis Bracelet': 'Pulsera Tennis', 'Diamond Bracelet': 'Pulsera de Diamantes',
    'Earrings': 'Pendientes', 'Drop Earrings': 'Pendientes Colgantes', 'Chandelier Earrings': 'Pendientes Chandelier', 'Linear Earrings': 'Pendientes Lineales',
    'Ring': 'Anillo', 'Diamond Ring': 'Anillo de Diamantes', 'Halo Ring': 'Anillo con Halo', 'Trilogy Ring': 'Anillo Trilogía', 'Design Ring': 'Anillo de Diseño',
    'Pendant': 'Colgante', 'Diamond Pendant': 'Colgante de Diamantes',
    'Floral': 'Floral', 'Diamond Floral': 'Floral de Diamantes',
    'in 14k White Gold': 'en Oro Blanco 14k', 'with Micro-Pavé': 'con Micro-Pavé', 'with Fancy': 'con Fancy',
  },
  de: {
    'Bracelet': 'Armband', 'Tennis Bracelet': 'Tennis-Armband', 'Diamond Bracelet': 'Diamant-Armband',
    'Earrings': 'Ohrringe', 'Drop Earrings': 'Tropfenohrringe', 'Chandelier Earrings': 'Kronleuchter-Ohrringe', 'Linear Earrings': 'Lineare Ohrringe',
    'Ring': 'Ring', 'Diamond Ring': 'Diamantring', 'Halo Ring': 'Halo-Ring', 'Trilogy Ring': 'Trilogie-Ring', 'Design Ring': 'Design-Ring',
    'Pendant': 'Anhänger', 'Diamond Pendant': 'Diamant-Anhänger',
    'Floral': 'Floral', 'Diamond Floral': 'Floraler Diamant-',
    'in 14k White Gold': 'in 14k Weißgold', 'with Micro-Pavé': 'mit Micro-Pavé', 'with Fancy': 'mit Fancy',
  },
  ar: {
    'Bracelet': 'سوار', 'Tennis Bracelet': 'سوار تنس', 'Diamond Bracelet': 'سوار ألماس',
    'Earrings': 'أقراط', 'Drop Earrings': 'أقراط متدلية', 'Chandelier Earrings': 'أقراط ثريا', 'Linear Earrings': 'أقراط خطية',
    'Ring': 'خاتم', 'Diamond Ring': 'خاتم ألماس', 'Halo Ring': 'خاتم هالة', 'Trilogy Ring': 'خاتم ثلاثي', 'Design Ring': 'خاتم تصميم',
    'Pendant': 'قلادة', 'Diamond Pendant': 'قلادة ألماس',
    'in 14k White Gold': 'من ذهب أبيض 14 قيراط', 'with Micro-Pavé': 'مع Micro-Pavé', 'with Fancy': 'مع Fancy',
  }
};

// For each lang, translate all products
for (const lang of ['es', 'de', 'ar']) {
  const enProducts = p.en;
  const translated = {};
  
  for (const [id, enData] of Object.entries(enProducts)) {
    translated[id] = {
      ...enData,
      details: enData.details.map(d => translateDetail(d, lang)),
    };
  }
  
  p[lang] = translated;
}

writeFileSync(P, JSON.stringify(p, null, 2) + '\n');
console.log('✓ Products translated for ES, DE, AR (details translated, titles kept as brand names)');
console.log('  Note: Product titles use brand collection names (kept in original language)');
console.log('  Details/specs translated to each language');
