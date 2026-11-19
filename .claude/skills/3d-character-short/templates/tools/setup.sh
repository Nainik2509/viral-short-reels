#!/usr/bin/env bash
# One-time setup of the 3d-character-short kit inside a Remotion project (default: Viral Reel Studio + kahani-stories).
#   setup.sh [--dry-run] [--skip-install] [--root <Viral Reel Studio folder>]
# It: (1) npm-installs the 3D packages next to Remotion, (2) copies templates/kit -> kahani-stories/src/three,
#     (3) turns on the ANGLE GL renderer in kahani-stories/remotion.config.ts (needed for WebGL in headless Chrome).
# Idempotent: re-running only refreshes the kit files (story folders are never touched).
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ROOT=""; DRY=0; SKIP_INSTALL=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY=1 ;;
    --skip-install) SKIP_INSTALL=1 ;;
    --root) ROOT="${2:?--root needs a folder}"; shift ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done
[[ -n "$ROOT" ]] || ROOT="$(cd "$SKILL/../../.." && pwd)"   # <root>/.claude/skills/3d-character-short
STUDIO="$ROOT/kahani-stories"
[[ -f "$ROOT/package.json" && -d "$STUDIO/src" ]] || { echo "Expected $ROOT/package.json and $STUDIO/src (use --root)." >&2; exit 1; }

# Runs a command, or only prints it with --dry-run. Arguments are passed as-is (paths with spaces are safe).
run() {
  if [[ $DRY -eq 1 ]]; then printf '[dry-run]'; printf ' %q' "$@"; printf '\n'; else "$@"; fi
}

# Versions verified together with React 19. @remotion/three must match the installed remotion exactly.
THREE_V="0.187.0"; FIBER_V="9.8.2"; POST_V="6.39.6"; VERIFIED_REMOTION="4.0.545"
REMOTION_V="$(node -p "require('$ROOT/node_modules/remotion/package.json').version" 2>/dev/null || echo "$VERIFIED_REMOTION")"
echo "Remotion in project: $REMOTION_V (kit verified with $VERIFIED_REMOTION)"

if [[ $SKIP_INSTALL -eq 0 ]]; then
  echo "1/3 installing packages in $ROOT"
  run npm install --prefix "$ROOT" --save "three@$THREE_V" "@react-three/fiber@$FIBER_V" "@remotion/three@$REMOTION_V" "postprocessing@$POST_V"
  run npm install --prefix "$ROOT" --save-dev "@types/three@$THREE_V"
else
  echo "1/3 install skipped"
fi

echo "2/3 copying kit -> $STUDIO/src/three"
run mkdir -p "$STUDIO/src/three"
for f in "$SKILL"/templates/kit/*.ts "$SKILL"/templates/kit/*.tsx; do run cp "$f" "$STUDIO/src/three/"; done

echo "3/3 GL renderer"
CFG="$STUDIO/remotion.config.ts"
GL_LINES=$'\n// WebGL (three.js) in headless Chrome needs ANGLE.\nConfig.setChromiumOpenGlRenderer("angle");'
if [[ ! -f "$CFG" ]]; then
  echo "   no $CFG; add Config.setChromiumOpenGlRenderer(\"angle\") to your Remotion config manually"
elif grep -q "setChromiumOpenGlRenderer" "$CFG"; then
  echo "   already set"
elif [[ $DRY -eq 1 ]]; then
  echo "[dry-run] append ANGLE setting to $CFG"
else
  printf '%s\n' "$GL_LINES" >> "$CFG"
fi

echo "Done. Next: cd kahani-stories && npm run typecheck, then: bash \"$SKILL/templates/tools/new_story.sh\" <slug>"
