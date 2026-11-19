#!/usr/bin/env bash
# Start a new 3D story from the working template.   new_story.sh <slug> [--root <Viral Reel Studio folder>]
# Copies templates/story/* -> kahani-stories/stories/<slug>/, makes estimated timings from voiceover.txt,
# and prints the two registry lines to add to kahani-stories/stories/registry.tsx.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:?usage: new_story.sh <slug> [--root <dir>]}"; shift
ROOT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --root) ROOT="${2:?--root needs a folder}"; shift ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done
[[ -n "$ROOT" ]] || ROOT="$(cd "$SKILL/../../.." && pwd)"
STUDIO="$ROOT/kahani-stories"
DEST="$STUDIO/stories/$SLUG"
[[ -d "$STUDIO/src/three" ]] || { echo "Kit not installed: run setup.sh first." >&2; exit 1; }
[[ ! -e "$DEST" ]] || { echo "$DEST already exists; pick another slug." >&2; exit 1; }

mkdir -p "$DEST"
cp "$SKILL"/templates/story/*.tsx "$SKILL"/templates/story/*.ts "$SKILL"/templates/story/script.md "$SKILL"/templates/story/voiceover.txt "$DEST/"
# placeholder timings so the story renders before the real voice exists
python3 "$SKILL/templates/tools/estimate_timings.py" --file "$DEST/voiceover.txt" -o "$DEST/timings.json"

ID="$(python3 -c 'import re,sys; print("".join(p.capitalize() for p in re.split(r"[^a-zA-Z0-9]+", sys.argv[1]) if p) + "3D")' "$SLUG")"
cat <<MSG
Created $DEST

Add to kahani-stories/stories/registry.tsx:
  import { Story as ${ID}Story, TEMPLATE3D_FRAMES as ${ID}_FRAMES } from "./$SLUG/Story";
  { id: "$ID", component: ${ID}Story, durationInFrames: ${ID}_FRAMES },

Then: rewrite script.md + voiceover.txt (get approval) -> real voice + timings -> Kitchen.tsx / shots.ts / Story.tsx for YOUR story.
MSG
