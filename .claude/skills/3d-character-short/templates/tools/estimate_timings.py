#!/usr/bin/env python3
"""Estimate word timings from a script BEFORE the voice-over exists, so the storyboard can be built and approved.

  python estimate_timings.py --text "This man once burned water. Yes, water." -o stories/<slug>/timings.json
  python estimate_timings.py --file stories/<slug>/voiceover.txt --wps 3.7 -o stories/<slug>/timings.json

Output has the same shape as kahani-stories/tools/timings.py (real voice, via faster-whisper), so Story code does not
change when you swap in the real timings. Pure Python, no network, no dependencies.

Model: ~3.7 words/s average (the reference shorts run 3.5-4.1), longer words take longer (syllable weighted),
short pauses after commas and sentence ends, zero pre-roll (speech starts at frame 0).
"""
import argparse, json, re, sys

def syllables(word: str) -> int:
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w:
        return max(1, round(len(word) / 2.4))  # non-Latin script: ~1 syllable per 2.4 letters
    groups = re.findall(r"[aeiouy]+", w)
    n = len(groups)
    if w.endswith("e") and n > 1 and not w.endswith(("le", "ee")):
        n -= 1
    return max(1, n)

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--text")
    ap.add_argument("--file")
    ap.add_argument("--wps", type=float, default=4.5, help="speaking rate between pauses (~3.7 words/s overall once pauses are added)")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--language", default="en")
    ap.add_argument("-o", "--out", required=True)
    a = ap.parse_args()
    text = a.text if a.text else open(a.file, encoding="utf-8").read()
    words = text.split()
    if not words:
        sys.exit("no words")
    weights = [0.55 + 0.45 * syllables(w) for w in words]
    mean_w = sum(weights) / len(weights)
    sec_per_unit = (1 / a.wps) / mean_w
    t = 0.0
    out = []
    for i, (w, wt) in enumerate(zip(words, weights)):
        dur = wt * sec_per_unit
        start, end = t, t + dur
        out.append({"i": i, "word": w, "start": round(start, 3), "end": round(end, 3),
                    "startFrame": round(start * a.fps), "endFrame": max(round(end * a.fps), round(start * a.fps) + 1)})
        t = end + (0.22 if re.search(r"[.!?]$", w) else 0.09 if re.search(r"[,;:]$", w) else 0.0)
    data = {"audio": "(estimated)", "language": a.language, "duration": round(t, 3), "fps": a.fps, "words": out}
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"{len(words)} words, {t:.1f}s ({round(t*a.fps)} frames) -> {a.out}")

if __name__ == "__main__":
    main()
