#!/usr/bin/env python3
"""
Word timings for Kahani Stories.

Turns a voice-over (mp3 / wav / m4a) into a JSON file that lists every spoken
word with its start and end time, using faster-whisper. The Remotion captions
and scene beats read this file, so cuts and captions stay locked to the voice.

Usage (from kahani-stories/):
    ../.venv/bin/python tools/timings.py voice/diwali-diya.mp3
    ../.venv/bin/python tools/timings.py voice/diwali-diya.mp3 --language hi --model small
    ../.venv/bin/python tools/timings.py voice/x.mp3 --out stories/x/timings.json

Default output: stories/<audio file name>/timings.json
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def load_audio(path: Path):
    """Decode any audio file to 16 kHz mono float32 with ffmpeg.

    faster-whisper can decode files itself through PyAV, but its call breaks on
    newer PyAV releases; handing it an array sidesteps that.
    """
    import numpy as np

    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", str(path),
           "-f", "f32le", "-ac", "1", "-ar", "16000", "-"]
    try:
        raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    except FileNotFoundError:
        sys.exit("ffmpeg not found. Install it (brew install ffmpeg).")
    except subprocess.CalledProcessError as e:
        sys.exit(f"ffmpeg could not read {path}: {e.stderr.decode(errors='ignore')}")
    return np.frombuffer(raw, dtype=np.float32)


def build_timings(audio: Path, model_name: str, language, beam_size: int, fps: int,
                  device: str, compute_type: str, vad: bool):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("faster-whisper is not installed. Run: ../.venv/bin/pip install -r requirements.txt")

    print(f"Loading faster-whisper '{model_name}' ({device}, {compute_type})...")
    model = WhisperModel(model_name, device=device, compute_type=compute_type)

    print(f"Transcribing {audio} (language: {language or 'auto-detect'})...")
    segments, info = model.transcribe(
        load_audio(audio),
        language=language,
        beam_size=beam_size,
        word_timestamps=True,
        vad_filter=vad,
    )

    words = []
    segs = []
    for seg in segments:  # generator: the actual work happens while we iterate
        segs.append({"start": round(seg.start, 3), "end": round(seg.end, 3), "text": seg.text.strip()})
        for w in seg.words or []:
            text = w.word.strip()
            if not text:
                continue
            start, end = round(w.start, 3), round(w.end, 3)
            words.append({
                "i": len(words),
                "word": text,
                "start": start,
                "end": end,
                "startFrame": round(start * fps),
                "endFrame": round(end * fps),
            })

    return {
        "audio": str(audio),
        "language": info.language,
        "language_probability": round(info.language_probability, 3),
        "duration": round(info.duration, 3),
        "model": model_name,
        "fps": fps,
        "text": " ".join(s["text"] for s in segs),
        "words": words,
        "segments": segs,
    }


def main():
    p = argparse.ArgumentParser(description="Voice-over -> word timings JSON (faster-whisper)")
    p.add_argument("audio", help="Voice-over file, e.g. voice/my-story.mp3")
    p.add_argument("--out", "-o", help="Output JSON (default: stories/<name>/timings.json)")
    p.add_argument("--model", "-m", default="small",
                   help="tiny | base | small | medium | large-v3 (default: small; use medium for Hindi accuracy)")
    p.add_argument("--language", "-l", default=None, help="Language code, e.g. hi, en. Default: auto-detect")
    p.add_argument("--fps", type=int, default=30, help="Frame rate for startFrame/endFrame (default 30)")
    p.add_argument("--beam-size", type=int, default=5)
    p.add_argument("--device", default="cpu", help="cpu (default; Apple Silicon has no CUDA) or cuda")
    p.add_argument("--compute-type", default="int8", help="int8 (default, fast on CPU), float16, float32")
    p.add_argument("--no-vad", action="store_true", help="Disable voice-activity filter")
    args = p.parse_args()

    audio = Path(args.audio)
    if not audio.exists():
        sys.exit(f"File not found: {audio}")

    out = Path(args.out) if args.out else Path("stories") / audio.stem / "timings.json"
    out.parent.mkdir(parents=True, exist_ok=True)

    data = build_timings(audio, args.model, args.language, args.beam_size, args.fps,
                         args.device, args.compute_type, not args.no_vad)

    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(data['words'])} words ({data['duration']}s, {data['language']}) -> {out}")


if __name__ == "__main__":
    main()
