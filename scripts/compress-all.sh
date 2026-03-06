#!/bin/bash
# Compress all product videos for web
# Run from project root: bash scripts/compress-all.sh
# Target: ~2-4MB per video (CRF 28, max 720p, no audio, faststart)

set -e

FFMPEG="/opt/homebrew/bin/ffmpeg"
INPUT_DIR="public/videos"
OUTPUT_DIR="public/videos-optimized"

# Create output dirs
mkdir -p "$OUTPUT_DIR/pendants" "$OUTPUT_DIR/rings" "$OUTPUT_DIR/bracelets" "$OUTPUT_DIR/earrings"

# Count total
TOTAL=$(find "$INPUT_DIR" -name '*.mp4' | wc -l | tr -d ' ')
COUNT=0

echo "Starting compression of $TOTAL videos..."
echo ""

for input in $(find "$INPUT_DIR" -name '*.mp4' | sort); do
  COUNT=$((COUNT + 1))
  # Derive output path: public/videos/X/Y.mp4 → public/videos-optimized/X/Y.mp4
  output="${input/$INPUT_DIR/$OUTPUT_DIR}"

  name=$(basename "$input")

  if [ -f "$output" ]; then
    echo "[$COUNT/$TOTAL] ⊘ exists: $name"
    continue
  fi

  echo "[$COUNT/$TOTAL] Compressing: $name ..."
  $FFMPEG -i "$input" \
    -c:v libx264 -crf 28 -preset slow \
    -vf "scale='min(720,iw)':-2" \
    -an -movflags +faststart \
    -y "$output" -loglevel error
done

echo ""
echo "✅ Done! Compression complete."
echo ""
echo "=== Size comparison ==="
du -sh "$INPUT_DIR" "$OUTPUT_DIR"
