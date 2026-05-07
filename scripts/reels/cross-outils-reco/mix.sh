#!/usr/bin/env bash
# mix.sh — Combine le dernier MP4 rendu avec audio.mp3
# Usage: ./mix.sh
set -e

cd "$(dirname "$0")"

# Trouve le dernier render
LATEST=$(ls -t renders/*.mp4 2>/dev/null | grep -v "_final\.mp4$" | head -1)
if [ -z "$LATEST" ]; then
  echo "❌ Aucun render trouvé dans renders/. Lance 'npm run render' d'abord."
  exit 1
fi

if [ ! -f "audio.mp3" ]; then
  echo "❌ audio.mp3 introuvable."
  exit 1
fi

# Output = même nom mais avec _final
BASE=$(basename "$LATEST" .mp4)
OUT="renders/${BASE}_final.mp4"

echo "🎬 Mixing audio dans : $LATEST"
echo "🎵 Audio source     : audio.mp3"
echo "📦 Output           : $OUT"

ffmpeg -y -loglevel warning \
  -i "$LATEST" \
  -i "audio.mp3" \
  -c:v copy \
  -c:a aac -b:a 192k \
  -map 0:v:0 -map 1:a:0 \
  -shortest \
  "$OUT"

echo ""
echo "✅ Done. File: $OUT"
ls -la "$OUT"
