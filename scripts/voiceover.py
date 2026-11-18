#!/usr/bin/env python3
"""
Voiceover Tool for Viral Reel Studio
Supports both Microsoft Edge TTS (free, neural) and ElevenLabs (hyper-realistic AI voices).
"""

import argparse
import asyncio
import os
import sys
import requests
import edge_tts

DEFAULT_EDGE_VOICE = "hi-IN-MadhurNeural"
DEFAULT_ELEVENLABS_VOICE = "pNInz6obpgDQGcFmaJgB"  # Adam

POPULAR_EDGE_VOICES = {
    "hi-male": "hi-IN-MadhurNeural",
    "hi-female": "hi-IN-SwaraNeural",
    "en-male": "en-US-ChristopherNeural",
    "en-female": "en-US-JennyNeural",
    "en-casual": "en-US-BrianMultilingualNeural",
    "en-energetic": "en-US-AndrewMultilingualNeural",
}

POPULAR_ELEVENLABS_VOICES = {
    "adam": "pNInz6obpgDQGcFmaJgB",
    "rachel": "21m00Tcm4TlvDq8ikWAM",
    "antoni": "ErXwobaYiN019PkySvjV",
    "josh": "TxGEqnHWrfWFTfGW9XjX",
    "bella": "EXAVITQu4vr4xnSDxMaL",
    "george": "JBFqnCBsd6RMkjVDRZzb",
}

def load_env_file():
    """Load environment variables from project .env file if present."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    candidates = [os.path.join(base_dir, ".env"), os.path.join(os.getcwd(), ".env")]
    for path in candidates:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k and k not in os.environ and v:
                            os.environ[k] = v
            break

def generate_elevenlabs_voiceover(text: str, voice_id: str, output_path: str, api_key: str = None, model_id: str = "eleven_multilingual_v2", humanize: bool = True):
    load_env_file()
    key = api_key or os.getenv("ELEVENLABS_API_KEY")
    if not key:
        print("❌ Error: ELEVENLABS_API_KEY environment variable is not set and no --api-key provided.")
        print("   Set it via: export ELEVENLABS_API_KEY='your_api_key' or in .env")
        sys.exit(1)

    voice_id = POPULAR_ELEVENLABS_VOICES.get(voice_id.lower(), voice_id)
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": key,
    }

    # Humanize settings: Lower stability for natural dynamic inflection + style exaggeration + speaker boost
    voice_settings = {
        "stability": 0.35 if humanize else 0.50,
        "similarity_boost": 0.80,
        "style": 0.35 if humanize else 0.0,
        "use_speaker_boost": True,
    }

    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": voice_settings
    }

    print(f"🎙️ Generating voiceover using ElevenLabs (Voice ID: {voice_id}, Humanize: {humanize})...")
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code != 200:
        print(f"❌ ElevenLabs API error ({response.status_code}): {response.text}")
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(response.content)

    print(f"✅ ElevenLabs voiceover saved to: {output_path}")

async def generate_edge_voiceover(text: str, voice: str, rate: str, pitch: str, output_path: str, subtitle_path: str = None):
    voice = POPULAR_EDGE_VOICES.get(voice, voice)
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    print(f"🎙️ Generating voiceover using Edge AI Voice: {voice}")
    print(f"⚡ Speed Rate: {rate} | Pitch: {pitch}")
    
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    
    if subtitle_path:
        os.makedirs(os.path.dirname(os.path.abspath(subtitle_path)), exist_ok=True)
        sub_maker = edge_tts.SubMaker()
        with open(output_path, "wb") as file:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    file.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    sub_maker.feed(chunk)
        
        with open(subtitle_path, "w", encoding="utf-8") as file:
            file.write(sub_maker.get_srt())
        print(f"📝 Subtitles exported to: {subtitle_path}")
    else:
        await communicate.save(output_path)
        
    print(f"✅ Voiceover saved to: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Generate AI Voiceover for Viral Reels (Edge AI or ElevenLabs)")
    parser.add_argument("--engine", "-e", choices=["edge", "elevenlabs"], default="edge", help="Voice engine: 'edge' (free neural) or 'elevenlabs' (hyper-realistic)")
    parser.add_argument("--text", "-t", type=str, help="Text to convert to speech")
    parser.add_argument("--file", "-f", type=str, help="Text file containing script")
    parser.add_argument("--voice", "-v", default=None, help="Voice name or alias")
    parser.add_argument("--rate", "-r", default="+5%", help="Speaking speed rate (Edge TTS only, default +5% for reels)")
    parser.add_argument("--pitch", "-p", default="+0Hz", help="Voice pitch (Edge TTS only)")
    parser.add_argument("--output", "-o", default="audio/voiceover.mp3", help="Output audio file path")
    parser.add_argument("--subtitles", "-s", default=None, help="Optional output SRT subtitle path (Edge TTS only)")
    parser.add_argument("--api-key", "-k", default=None, help="ElevenLabs API Key (or set ELEVENLABS_API_KEY env)")
    parser.add_argument("--model", "-m", default="eleven_multilingual_v2", help="ElevenLabs Model ID")
    parser.add_argument("--humanize", action="store_true", default=True, help="Use humanized, dynamic voice settings for ElevenLabs")
    parser.add_argument("--list-voices", action="store_true", help="List popular voice options")

    args = parser.parse_args()

    if args.list_voices:
        print("\n=== Recommended Edge AI Voices (Free) ===")
        for alias, voice in POPULAR_EDGE_VOICES.items():
            print(f"  • {alias.ljust(14)} -> {voice}")
        print("\n=== Recommended ElevenLabs Voices ===")
        for alias, vid in POPULAR_ELEVENLABS_VOICES.items():
            print(f"  • {alias.ljust(14)} -> {vid}")
        return

    text = args.text
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            text = f.read()

    if not text:
        parser.error("Please provide --text or --file")

    if args.engine == "elevenlabs":
        voice = args.voice or DEFAULT_ELEVENLABS_VOICE
        generate_elevenlabs_voiceover(
            text=text,
            voice_id=voice,
            output_path=args.output,
            api_key=args.api_key,
            model_id=args.model,
            humanize=args.humanize
        )
    else:
        voice = args.voice or DEFAULT_EDGE_VOICE
        asyncio.run(generate_edge_voiceover(
            text=text,
            voice=voice,
            rate=args.rate,
            pitch=args.pitch,
            output_path=args.output,
            subtitle_path=args.subtitles
        ))

if __name__ == "__main__":
    main()
