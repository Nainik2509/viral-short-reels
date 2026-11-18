#!/usr/bin/env python3
"""
Whisper Subtitles Generator for Viral Reel Studio
Transcribes audio/video files to SRT/VTT subtitles using OpenAI Whisper.
"""

import argparse
import os
import sys
import whisper
from whisper.utils import get_writer

def generate_subtitles(input_path: str, output_dir: str, model_name: str = "base", language: str = None, output_format: str = "srt"):
    if not os.path.exists(input_path):
        print(f"❌ Error: File not found: {input_path}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)
    
    print(f"🤖 Loading Whisper model '{model_name}'...")
    model = whisper.load_model(model_name)
    
    print(f"🎧 Transcribing: {input_path} (Language: {language or 'auto-detect'})...")
    transcribe_options = {}
    if language:
        transcribe_options["language"] = language

    result = model.transcribe(input_path, **transcribe_options)
    
    writer = get_writer(output_format, output_dir)
    writer(result, input_path)
    
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    output_file = os.path.join(output_dir, f"{base_name}.{output_format}")
    
    print(f"✅ Subtitles generated successfully: {output_file}")
    print(f"📝 Detected Language: {result.get('language', 'Unknown')}")
    print(f"📄 Full Transcript Preview:\n{result.get('text', '').strip()[:200]}...")
    return output_file

def main():
    parser = argparse.ArgumentParser(description="Generate automatic subtitles using Whisper for Viral Reels")
    parser.add_argument("--input", "-i", required=True, help="Path to input audio or video file")
    parser.add_argument("--output-dir", "-o", default="subtitles", help="Directory to save subtitles")
    parser.add_argument("--model", "-m", default="base", choices=["tiny", "base", "small", "medium", "large"], help="Whisper model size (default: base)")
    parser.add_argument("--language", "-l", default=None, help="Spoken language code (e.g. 'hi' for Hindi, 'en' for English)")
    parser.add_argument("--format", "-f", default="srt", choices=["srt", "vtt", "txt", "tsv", "json", "all"], help="Subtitle format")

    args = parser.parse_args()
    generate_subtitles(
        input_path=args.input,
        output_dir=args.output_dir,
        model_name=args.model,
        language=args.language,
        output_format=args.format
    )

if __name__ == "__main__":
    main()
