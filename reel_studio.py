#!/usr/bin/env python3
"""
Viral Reel Studio - Unified CLI
Integrates Hyperframes, FFmpeg, Whisper, and Edge AI Voiceover into a seamless pipeline.
"""

import argparse
import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PYTHON_ENV = os.path.join(BASE_DIR, ".venv", "bin", "python")
if not os.path.exists(PYTHON_ENV):
    PYTHON_ENV = sys.executable

FFMPEG_BIN = "/opt/homebrew/bin/ffmpeg"
HYPERFRAMES_BIN = os.path.join(BASE_DIR, "node_modules", ".bin", "hyperframes")

def run_command(cmd, desc=""):
    if desc:
        print(f"\n🚀 {desc}")
    print(f"Executing: {' '.join(cmd)}")
    res = subprocess.run(cmd)
    if res.returncode != 0:
        print(f"❌ Command failed with return code {res.returncode}")
        sys.exit(res.returncode)

def main():
    parser = argparse.ArgumentParser(
        description="🎬 Viral Reel Studio: 4-Tool Automated Reel Engine (Hyperframes + FFmpeg + Whisper + Edge AI)",
        formatter_class=argparse.RawTextHelpFormatter
    )
    subparsers = parser.add_subparsers(dest="action", help="Action to execute")

    # 1. Voiceover (Edge AI or ElevenLabs)
    vo_p = subparsers.add_parser("voiceover", help="Generate AI voiceover using Edge AI or ElevenLabs")
    vo_p.add_argument("--engine", "-e", choices=["edge", "elevenlabs"], default="edge", help="Voice engine ('edge' or 'elevenlabs')")
    vo_p.add_argument("--text", "-t", required=True, help="Script text or voiceover dialogue")
    vo_p.add_argument("--voice", "-v", default=None, help="Voice name or alias (e.g. adam, rachel, hi-IN-MadhurNeural)")
    vo_p.add_argument("--rate", "-r", default="+5%", help="Speech rate / pacing (e.g. +5%%, +10%%)")
    vo_p.add_argument("--output", "-o", default="audio/voiceover.mp3", help="Output audio file path")
    vo_p.add_argument("--subtitles", "-s", default=None, help="Directly output SRT subtitles matching speech timings")
    vo_p.add_argument("--api-key", "-k", default=None, help="ElevenLabs API key (if using elevenlabs)")

    # 2. Subtitles (Whisper)
    sub_p = subparsers.add_parser("subtitles", help="Generate automatic subtitles using OpenAI Whisper")
    sub_p.add_argument("--input", "-i", required=True, help="Input audio or video file")
    sub_p.add_argument("--output-dir", "-o", default="subtitles", help="Output directory for subtitles")
    sub_p.add_argument("--model", "-m", default="base", help="Whisper model (tiny, base, small, medium)")
    sub_p.add_argument("--language", "-l", default=None, help="Language code (e.g. 'hi' for Hindi, 'en' for English)")

    # 3. Video Cutting & Processing (FFmpeg)
    cut_p = subparsers.add_parser("cut", help="Cut/Trim raw footage using FFmpeg")
    cut_p.add_argument("--input", "-i", required=True, help="Raw video file in 'Raw footage/'")
    cut_p.add_argument("--start", "-s", required=True, help="Start time (e.g. 00:00:02)")
    cut_p.add_argument("--duration", "-d", help="Duration in seconds or timecode (e.g. 8 or 00:00:08)")
    cut_p.add_argument("--output", "-o", default="export/clip_trimmed.mp4", help="Output trimmed video")

    format_p = subparsers.add_parser("format-reel", help="Format video into 9:16 vertical reel (1080x1920) using FFmpeg")
    format_p.add_argument("--input", "-i", required=True, help="Input video")
    format_p.add_argument("--output", "-o", default="export/vertical_9_16.mp4", help="Output 9:16 video")

    compose_p = subparsers.add_parser("compose", help="Assemble final reel: Video + Voiceover + Subtitles into 'export/'")
    compose_p.add_argument("--video", "-v", required=True, help="Video clip")
    compose_p.add_argument("--audio", "-a", required=True, help="Voiceover audio")
    compose_p.add_argument("--subtitles", "-s", help="SRT subtitle file to burn onto video")
    compose_p.add_argument("--bgm", help="Background music audio file")
    compose_p.add_argument("--output", "-o", default="export/viral_reel_final.mp4", help="Final exported video")

    # 4. Motion Graphics (Hyperframes)
    motion_p = subparsers.add_parser("motion-init", help="Scaffold a new motion graphics composition using Hyperframes")
    motion_p.add_argument("--name", "-n", default="motion-card", help="Composition project name")

    motion_render = subparsers.add_parser("motion-render", help="Render a Hyperframes motion graphics composition to MP4 or WebM")
    motion_render.add_argument("--project", "-p", required=True, help="Path to hyperframes composition directory")
    motion_render.add_argument("--output", "-o", default="export/motion_graphic.mp4", help="Output MP4 path")

    args = parser.parse_args()

    if args.action == "voiceover":
        cmd = [PYTHON_ENV, os.path.join(BASE_DIR, "scripts", "voiceover.py"), "--engine", args.engine, "--text", args.text, "--rate", args.rate, "--output", args.output]
        if args.voice:
            cmd.extend(["--voice", args.voice])
        if args.subtitles:
            cmd.extend(["--subtitles", args.subtitles])
        if args.api_key:
            cmd.extend(["--api-key", args.api_key])
        run_command(cmd, f"Voiceover Generation ({args.engine.title()})")

    elif args.action == "subtitles":
        cmd = [PYTHON_ENV, os.path.join(BASE_DIR, "scripts", "subtitles.py"), "--input", args.input, "--output-dir", args.output_dir, "--model", args.model]
        if args.language:
            cmd.extend(["--language", args.language])
        run_command(cmd, "Whisper Subtitle Generation")

    elif args.action == "cut":
        cmd = [PYTHON_ENV, os.path.join(BASE_DIR, "scripts", "video_processor.py"), "cut", "--input", args.input, "--start", args.start, "--output", args.output]
        if args.duration:
            cmd.extend(["--duration", args.duration])
        run_command(cmd, "FFmpeg Video Cutting")

    elif args.action == "format-reel":
        cmd = [PYTHON_ENV, os.path.join(BASE_DIR, "scripts", "video_processor.py"), "reel-format", "--input", args.input, "--output", args.output]
        run_command(cmd, "FFmpeg 9:16 Vertical Formatting")

    elif args.action == "compose":
        cmd = [PYTHON_ENV, os.path.join(BASE_DIR, "scripts", "video_processor.py"), "compose", "--video", args.video, "--audio", args.audio, "--output", args.output]
        if args.subtitles:
            cmd.extend(["--subtitles", args.subtitles])
        if args.bgm:
            cmd.extend(["--bgm", args.bgm])
        run_command(cmd, "FFmpeg Full Reel Composition")

    elif args.action == "motion-init":
        target = os.path.join(BASE_DIR, "motion_graphics", args.name)
        cmd = [HYPERFRAMES_BIN, "init", target, "--non-interactive", "--resolution", "portrait", "--example", "blank"]
        run_command(cmd, f"Hyperframes Motion Graphics Initialization: {args.name}")

    elif args.action == "motion-render":
        cmd = [HYPERFRAMES_BIN, "render", "-o", os.path.abspath(args.output)]
        print(f"\n🚀 Rendering Hyperframes project at {args.project}...")
        res = subprocess.run(cmd, cwd=os.path.abspath(args.project))
        if res.returncode != 0:
            sys.exit(res.returncode)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
