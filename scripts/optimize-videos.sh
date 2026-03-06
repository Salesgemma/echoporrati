#!/bin/bash

# Script di ottimizzazione video per PORRATI
# Crea una copia compressa di tutti i .mp4 in public/videos
# mantenendo la struttura delle cartelle sotto public/videos-optimized.

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INPUT_DIR="$PROJECT_ROOT/public/videos"
OUTPUT_DIR="$PROJECT_ROOT/public/videos-optimized"

echo "Ottimizzazione video da '$INPUT_DIR' a '$OUTPUT_DIR'"

# Trova tutti i file .mp4 e li processa mantenendo la struttura di cartelle
find "$INPUT_DIR" -type f -name "*.mp4" -print0 | while IFS= read -r -d '' FILE; do
  REL="${FILE#"$INPUT_DIR/"}"
  OUT="$OUTPUT_DIR/$REL"

  mkdir -p "$(dirname "$OUT")"

  echo "Processo: $REL"

  ffmpeg -nostdin -y -i "$FILE" \
    -vf "scale='min(1080,iw)':-2" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 160k \
    "$OUT"

  echo "Creato: $OUT"
  echo "-----------------------------"

done

echo "Completato. I nuovi video sono in '$OUTPUT_DIR'."
