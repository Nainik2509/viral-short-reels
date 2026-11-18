#!/usr/bin/env bash
# Render storyboard stills for a composition so a story can be reviewed
# BEFORE any full video render.
#
#   npm run storyboard -- <CompositionId> <frame> [<frame> ...]
#   npm run storyboard -- MyStory 0 45 120 210 300
#
# Add --guide as the first option to overlay the safe zone on every frame:
#   npm run storyboard -- --guide MyStory 0 45 120
#
# Output: out/storyboard/<CompositionId>/frame-<n>.png
set -euo pipefail
cd "$(dirname "$0")/.."

GUIDE=""
if [[ "${1:-}" == "--guide" ]]; then GUIDE="1"; shift; fi

if [[ $# -lt 2 ]]; then
  echo "Usage: npm run storyboard -- [--guide] <CompositionId> <frame> [<frame> ...]" >&2
  exit 1
fi

ID="$1"; shift
OUT="out/storyboard/$ID"
mkdir -p "$OUT"

PROPS="{}"
if [[ -n "$GUIDE" ]]; then PROPS='{"showSafeZone":true}'; fi

for FRAME in "$@"; do
  npx remotion still src/index.ts "$ID" "$OUT/frame-$(printf '%05d' "$FRAME").png" \
    --frame="$FRAME" --props="$PROPS" >/dev/null
  echo "  frame $FRAME -> $OUT/frame-$(printf '%05d' "$FRAME").png"
done
echo "Storyboard stills are in $OUT/. Review them, then render the full video."
