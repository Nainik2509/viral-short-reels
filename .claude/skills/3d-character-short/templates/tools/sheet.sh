#!/usr/bin/env bash
# Contact sheet of stills, so a whole storyboard can be judged in one glance (and sent as ONE image to a reviewer).
#   sheet.sh out.png 4 frame-0012.png frame-0055.png ...      (4 = columns; each tile is 360 px wide)
set -euo pipefail
OUT="$1"; COLS="$2"; shift 2
FF="${FFMPEG:-/opt/homebrew/bin/ffmpeg}"; [[ -x "$FF" ]] || FF="$(command -v ffmpeg)"
N=$#; ROWS=$(( (N + COLS - 1) / COLS ))
ARGS=(); FILT=""; i=0
for f in "$@"; do ARGS+=(-i "$f"); FILT+="[$i:v]scale=360:-1[s$i];"; i=$((i+1)); done
IN=""; for ((k=0;k<N;k++)); do IN+="[s$k]"; done
"$FF" -y -loglevel error "${ARGS[@]}" -filter_complex "${FILT}${IN}xstack=inputs=$N:layout=$(python3 - "$N" "$COLS" <<'PY'
import sys
n,c=int(sys.argv[1]),int(sys.argv[2]); W,H=360,640
print("|".join(f"{(k%c)*W}_{(k//c)*H}" for k in range(n)))
PY
)" -frames:v 1 "$OUT"
echo "wrote $OUT ($N tiles, $COLS cols, $ROWS rows)"
