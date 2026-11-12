#!/usr/bin/env bash
# Rebuild the v9 film: render 4775 frames, then mux H.264 + the mastered audio.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null; then
  echo "Need Node.js >= 22.12" >&2
  exit 1
fi
if ! command -v ffmpeg >/dev/null; then
  echo "Need ffmpeg on PATH" >&2
  exit 1
fi

CHROME="${CHROME_PATH:-}"
if [[ -z "$CHROME" ]]; then
  for c in /usr/bin/google-chrome /usr/bin/google-chrome-stable /usr/bin/chromium /usr/bin/chromium-browser; do
    if [[ -x "$c" ]]; then CHROME="$c"; break; fi
  done
fi
if [[ -z "${CHROME:-}" || ! -x "$CHROME" ]]; then
  echo "Need Google Chrome or Chromium. Install it or set CHROME_PATH." >&2
  exit 1
fi
export CHROME_PATH="$CHROME"

if [[ ! -d node_modules/puppeteer-core ]]; then
  if [[ -f package-lock.json ]]; then npm ci
  else npm install
  fi
fi

WORKERS="${WORKERS:-7}"  # v9 was rendered with 7 workers; other counts drift a few frames
OUT="${OUT:-out/ninja_pv.mp4}"
FRAMES="${FRAMES:-frames}"
mkdir -p "$FRAMES" "$(dirname "$OUT")"

echo "Rendering 4775 frames (0–4774) with $WORKERS workers, Chrome=$CHROME"
node render.js --page film9.html --range 0:4774 --workers "$WORKERS" --out "$FRAMES"

# Same encode as v9: CRF 16, tune animation, AAC 256k/48k, mastered -14 LUFS wav.
echo "Encoding $OUT"
ffmpeg -y -framerate 30 -i "$FRAMES/f%05d.png" -i audio/ninja_audio_m14c.wav \
  -c:v libx264 -preset slow -crf 16 -tune animation -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -shortest -movflags +faststart \
  "$OUT"

echo "Done: $OUT"
