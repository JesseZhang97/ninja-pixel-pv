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

WAV="audio/ninja_audio_m14c.wav"
MP3="audio/ninja.mp3"
if [[ ! -f "$WAV" ]]; then
  if [[ -f "$MP3" ]]; then
    echo "No $WAV; generating it from $MP3 (v9 chain: +10.85 dB, 4×-oversampled alimiter limit=0.78)"
    mkdir -p audio
    ffmpeg -y -i "$MP3" \
      -af "volume=10.85dB,aresample=192000,alimiter=limit=0.78:attack=5:release=50:level=false,aresample=48000" \
      -ar 48000 -ac 2 "$WAV"
  else
    echo "No soundtrack found. This repo does not ship the song (copyright)." >&2
    echo "Place the official track at:  audio/ninja.mp3" >&2
    echo "Then re-run; the script will write audio/ninja_audio_m14c.wav" >&2
    echo "(48 kHz stereo PCM, v9 −14 LUFS chain: +10.85 dB then alimiter limit=0.78)." >&2
    echo "Or place a pre-mastered wav at audio/ninja_audio_m14c.wav and skip the mp3." >&2
    echo "See audio/README.md." >&2
    exit 1
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
ffmpeg -y -framerate 30 -i "$FRAMES/f%05d.png" -i "$WAV" \
  -c:v libx264 -preset slow -crf 16 -tune animation -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -shortest -movflags +faststart \
  "$OUT"

echo "Done: $OUT"
