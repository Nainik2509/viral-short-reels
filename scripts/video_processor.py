#!/usr/bin/env python3
"""
FFmpeg Video Cutting and Processing for Viral Reel Studio
Handles trimming, 9:16 vertical formatting, audio mixing, and subtitle burning.
"""

import argparse
import subprocess
import os
import sys

FFMPEG_BIN = "/opt/homebrew/bin/ffmpeg"
FFPROBE_BIN = "/opt/homebrew/bin/ffprobe"

def run_cmd(cmd):
    print("▶ Running:", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ FFmpeg error:\n{res.stderr}")
        sys.exit(res.returncode)
    return res.stdout

def cut_clip(input_video: str, start: str, duration: str, output_video: str):
    os.makedirs(os.path.dirname(os.path.abspath(output_video)), exist_ok=True)
    cmd = [
        FFMPEG_BIN, "-y",
        "-ss", start,
        "-i", input_video,
    ]
    if duration:
        cmd.extend(["-t", duration])
    cmd.extend([
        "-c:v", "libx264",
        "-c:a", "aac",
        output_video
    ])
    run_cmd(cmd)
    print(f"✅ Cut saved to: {output_video}")

def format_9_16(input_video: str, output_video: str):
    """
    Scales and crops video to 1080x1920 (9:16 vertical Reel / Shorts format)
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_video)), exist_ok=True)
    filter_complex = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    cmd = [
        FFMPEG_BIN, "-y",
        "-i", input_video,
        "-vf", filter_complex,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        "-c:a", "copy",
        output_video
    ]
    run_cmd(cmd)
    print(f"✅ 9:16 Reel formatted video saved to: {output_video}")

def compose_reel(video: str, audio: str, subtitles: str, output: str, bgm: str = None, bgm_volume: float = 0.15):
    """
    Composes full viral reel: Video + Voiceover + Optional BGM + Subtitles Burn-in
    """
    os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
    
    cmd = [FFMPEG_BIN, "-y"]
    cmd.extend(["-i", video])
    
    if audio:
        cmd.extend(["-i", audio])
        
    if bgm:
        cmd.extend(["-i", bgm])
        
    filters = []
    # Video styling / sizing
    video_filter = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    
    if subtitles:
        # Escape path for ffmpeg subtitles filter
        sub_escaped = subtitles.replace(":", "\\:").replace("'", "\\'")
        # Style subtitles nicely for reels
        sub_style = "force_style='Alignment=2,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2,Shadow=0,MarginV=120'"
        video_filter += f",subtitles='{sub_escaped}':{sub_style}"
        
    filters.append(f"[0:v]{video_filter}[v]")
    
    # Audio mixing
    if audio and bgm:
        filters.append(f"[2:a]volume={bgm_volume}[bgm];[1:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[a]")
        audio_map = "[a]"
    elif audio:
        audio_map = "1:a"
    else:
        audio_map = "0:a"
        
    cmd.extend(["-filter_complex", ";".join(filters)])
    cmd.extend(["-map", "[v]", "-map", audio_map])
    cmd.extend([
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output
    ])
    
    run_cmd(cmd)
    print(f"🎉 Final Reel composed and exported to: {output}")

def main():
    parser = argparse.ArgumentParser(description="FFmpeg Video Processing Toolkit for Viral Reel Studio")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Cut command
    cut_p = subparsers.add_parser("cut", help="Cut or trim a video clip")
    cut_p.add_argument("--input", "-i", required=True, help="Input video")
    cut_p.add_argument("--start", "-s", required=True, help="Start time (e.g. 00:00:05)")
    cut_p.add_argument("--duration", "-d", help="Duration (e.g. 10 or 00:00:10)")
    cut_p.add_argument("--output", "-o", default="export/clip_cut.mp4", help="Output path")

    # Format 9:16 command
    format_p = subparsers.add_parser("reel-format", help="Convert video to 9:16 (1080x1920)")
    format_p.add_argument("--input", "-i", required=True, help="Input video")
    format_p.add_argument("--output", "-o", default="export/vertical_9_16.mp4", help="Output path")

    # Compose command
    comp_p = subparsers.add_parser("compose", help="Compose final reel with video, audio and subtitles")
    comp_p.add_argument("--video", "-v", required=True, help="Input video file")
    comp_p.add_argument("--audio", "-a", help="Voiceover audio file")
    comp_p.add_argument("--subtitles", "-s", help="SRT subtitle file to burn into video")
    comp_p.add_argument("--bgm", help="Background music audio file")
    comp_p.add_argument("--bgm-vol", type=float, default=0.15, help="BGM volume level (default 0.15)")
    comp_p.add_argument("--output", "-o", default="export/final_reel.mp4", help="Final export destination")

    args = parser.parse_args()

    if args.command == "cut":
        cut_clip(args.input, args.start, args.duration, args.output)
    elif args.command == "reel-format":
        format_9_16(args.input, args.output)
    elif args.command == "compose":
        compose_reel(args.video, args.audio, args.subtitles, args.output, args.bgm, args.bgm_vol)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
