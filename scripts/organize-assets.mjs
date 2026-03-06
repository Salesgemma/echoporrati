#!/usr/bin/env node
/**
 * organize-assets.mjs
 * 
 * Reads products.json and reorganizes video + photo files:
 *   1. Copies videos from public/{category}/ → public/videos/{category}/{product-id}.mp4
 *   2. Copies photos from public/{category}-photo/ → public/photos/{category}/{product-id}.jpg
 *   3. Updates products.json with new video paths + poster (photo) paths
 *   4. Generates an ffmpeg compression script for web-optimized videos
 *
 * Usage:  node scripts/organize-assets.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

// ── 1. Load products.json ──────────────────────────────────────────
const productsPath = join(ROOT, 'src/data/products.json');
const products = JSON.parse(readFileSync(productsPath, 'utf-8'));

// We'll build a new copy of products.json with updated paths
const updatedProducts = JSON.parse(JSON.stringify(products));

// ── 2. Build mapping from original video filename → product id ─────
// The mapping uses the "en" section (same video paths for both languages)
const enProducts = products.en;
const itProducts = products.it;

// Category source directories (where raw files currently live)
const categorySourceDirs = {
  bracelets: join(ROOT, 'public/bracelets'),
  rings: join(ROOT, 'public/rings'),
  pendants: join(ROOT, 'public/pendants'),
  earrings: join(ROOT, 'public/earrings'),
};

// Category photo source directories
const categoryPhotoDirs = {
  bracelets: join(ROOT, 'public/bracelets-photo'),
  earrings: join(ROOT, 'public/earrings-photo'),
  // Add more as you generate them:
  // rings: join(ROOT, 'public/rings-photo'),
  // pendants: join(ROOT, 'public/pendants-photo'),
};

// Output directories
const videosOutDir = join(ROOT, 'public/videos');
const photosOutDir = join(ROOT, 'public/photos');

// ffmpeg commands collector
const ffmpegCommands = [];

let copiedVideos = 0;
let copiedPhotos = 0;
let missingVideos = [];
let missingPhotos = [];

// ── 3. Process each product ────────────────────────────────────────
for (const [productId, data] of Object.entries(enProducts)) {
  const category = data.category; // e.g. "bracelets"
  const originalVideoPath = data.video; // e.g. "/videos/bracelets/35_CAD DIAMOND_22-08-2025_2A .mp4"
  
  // Extract the original filename from the video path
  const originalFilename = basename(originalVideoPath); // "35_CAD DIAMOND_22-08-2025_2A .mp4"
  
  // ── New clean paths ──
  const newVideoFilename = `${productId}.mp4`;
  const newVideoWebPath = `/videos/${category}/${newVideoFilename}`;
  const newOptimizedWebPath = `/videos-optimized/${category}/${newVideoFilename}`;
  
  const newPhotoFilename = `${productId}.jpg`;
  const newPhotoWebPath = `/photos/${category}/${newPhotoFilename}`;

  // ── Create output directories ──
  const videoOutCategoryDir = join(videosOutDir, category);
  const photoOutCategoryDir = join(photosOutDir, category);
  const optimizedOutDir = join(ROOT, 'public/videos-optimized', category);

  if (!DRY_RUN) {
    mkdirSync(videoOutCategoryDir, { recursive: true });
    mkdirSync(photoOutCategoryDir, { recursive: true });
    mkdirSync(optimizedOutDir, { recursive: true });
  }

  // ── Copy & rename video ──
  const sourceVideoDir = categorySourceDirs[category];
  if (sourceVideoDir) {
    const sourceVideoFile = join(sourceVideoDir, originalFilename);
    const destVideoFile = join(videoOutCategoryDir, newVideoFilename);

    if (existsSync(sourceVideoFile)) {
      if (DRY_RUN) {
        console.log(`[DRY] COPY video: ${originalFilename} → videos/${category}/${newVideoFilename}`);
      } else {
        if (!existsSync(destVideoFile)) {
          copyFileSync(sourceVideoFile, destVideoFile);
          console.log(`✓ Video: ${originalFilename} → videos/${category}/${newVideoFilename}`);
        } else {
          console.log(`⊘ Video exists: videos/${category}/${newVideoFilename}`);
        }
      }
      copiedVideos++;
    } else {
      missingVideos.push({ productId, expected: sourceVideoFile });
    }
  }

  // ── Copy & rename photo (if photo dir exists for this category) ──
  const sourcePhotoDir = categoryPhotoDirs[category];
  if (sourcePhotoDir && existsSync(sourcePhotoDir)) {
    // Photo filename convention: original video name with "_BEST.jpg" instead of ".mp4"
    const photoOriginalName = originalFilename.replace('.mp4', '_BEST.jpg');
    const sourcePhotoFile = join(sourcePhotoDir, photoOriginalName);
    const destPhotoFile = join(photoOutCategoryDir, newPhotoFilename);

    if (existsSync(sourcePhotoFile)) {
      if (DRY_RUN) {
        console.log(`[DRY] COPY photo: ${photoOriginalName} → photos/${category}/${newPhotoFilename}`);
      } else {
        if (!existsSync(destPhotoFile)) {
          copyFileSync(sourcePhotoFile, destPhotoFile);
          console.log(`✓ Photo: ${photoOriginalName} → photos/${category}/${newPhotoFilename}`);
        } else {
          console.log(`⊘ Photo exists: photos/${category}/${newPhotoFilename}`);
        }
      }
      copiedPhotos++;
    } else {
      missingPhotos.push({ productId, category, expected: photoOriginalName });
    }
  }

  // ── Update products.json paths ──
  // Update EN
  if (updatedProducts.en[productId]) {
    updatedProducts.en[productId].video = newVideoWebPath;
    if (sourcePhotoDir && existsSync(sourcePhotoDir)) {
      const photoOriginalName = originalFilename.replace('.mp4', '_BEST.jpg');
      const sourcePhotoFile = join(sourcePhotoDir, photoOriginalName);
      if (existsSync(sourcePhotoFile)) {
        updatedProducts.en[productId].poster = newPhotoWebPath;
      }
    }
  }
  // Update IT (same product IDs, same video/poster paths)
  if (updatedProducts.it[productId]) {
    updatedProducts.it[productId].video = newVideoWebPath;
    if (updatedProducts.en[productId]?.poster) {
      updatedProducts.it[productId].poster = newPhotoWebPath;
    }
  }

  // ── ffmpeg compression command ──
  const inputPath = `public/videos/${category}/${newVideoFilename}`;
  const outputPath = `public/videos-optimized/${category}/${newVideoFilename}`;
  ffmpegCommands.push(
    `ffmpeg -i "${inputPath}" -c:v libx264 -crf 28 -preset slow -vf "scale='min(720,iw)':-2" -an -movflags +faststart -y "${outputPath}"`
  );
}

// ── 4. Write updated products.json ─────────────────────────────────
if (!DRY_RUN) {
  writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2) + '\n', 'utf-8');
  console.log('\n✓ products.json updated with new video/poster paths');
}

// ── 5. Write ffmpeg compression script ─────────────────────────────
const ffmpegScript = `#!/bin/bash
# Auto-generated: compress all product videos for web
# Run from project root: bash scripts/compress-videos.sh
# Requires: ffmpeg installed (brew install ffmpeg)
#
# Target: ~2-4MB per video (CRF 28, max 720p, no audio, faststart)

set -e

${ffmpegCommands.join('\n\n')}

echo ""
echo "✅ All videos compressed! Check public/videos-optimized/"
echo "Original sizes vs optimized:"
du -sh public/videos/ public/videos-optimized/
`;

const ffmpegScriptPath = join(ROOT, 'scripts/compress-videos.sh');
if (!DRY_RUN) {
  writeFileSync(ffmpegScriptPath, ffmpegScript, 'utf-8');
  console.log('✓ scripts/compress-videos.sh generated');
}

// ── 6. Summary ─────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════');
console.log(`  Videos processed: ${copiedVideos}`);
console.log(`  Photos processed: ${copiedPhotos}`);
if (missingVideos.length > 0) {
  console.log(`\n  ⚠ Missing videos (${missingVideos.length}):`);
  missingVideos.forEach(m => console.log(`    - ${m.productId}: ${basename(m.expected)}`));
}
if (missingPhotos.length > 0) {
  console.log(`\n  ⚠ Missing photos (${missingPhotos.length}):`);
  missingPhotos.forEach(m => console.log(`    - ${m.productId} (${m.category}): ${m.expected}`));
}
console.log('\n  Next steps:');
console.log('  1. Run: bash scripts/compress-videos.sh');
console.log('     (compresses ~40MB → ~3MB per video)');
console.log('  2. Once photos exist for rings/pendants/earrings,');
console.log('     add their dirs to categoryPhotoDirs and re-run.');
console.log('═══════════════════════════════════════════');
