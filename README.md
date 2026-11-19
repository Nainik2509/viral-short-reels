# 🎬 Viral Reel Studio

An automated, AI-powered short-form video creation workspace optimized for **Instagram Reels, YouTube Shorts, and TikTok**.

> 📖 **Quick Links**:
> - [WORKFLOW_GUIDE.md](file:///Users/nainik/Documents/Nainik/Nainik2509/Projects/Viral%20Reel%20Studio/WORKFLOW_GUIDE.md) — Complete 4-tool pipeline guide & commands.
> - [REEL_STYLE_GUIDE.md](file:///Users/nainik/Documents/Nainik/Nainik2509/Projects/Viral%20Reel%20Studio/REEL_STYLE_GUIDE.md) — Reverse-engineered video editing, typography, transitions & pacing rules.
> - [STYLE_PROFILE.md](STYLE_PROFILE.md) — Measured style from 8 reference Shorts + your brand-layer slots.
> - [THUMBNAIL_STYLE_GUIDE.md](file:///Users/nainik/Documents/Nainik/Nainik2509/Projects/Viral%20Reel%20Studio/THUMBNAIL_STYLE_GUIDE.md) — High-CTR thumbnail formulas, visual hooks & color theory.

## 🛠️ The 4 Core Tools

| Tool | Purpose | Primary Command / Location |
|---|---|---|
| **Hyperframes** | Agent-native Motion Graphics, Kinetic Titles & HTML/CSS/GSAP Video Overlays | `npx hyperframes` / `motion_graphics/` |
| **FFmpeg** | Video trimming, 9:16 vertical cropping, audio mixing, and subtitle burn-in | `/opt/homebrew/bin/ffmpeg` / `scripts/video_processor.py` |
| **Whisper** | Automatic speech-to-text and synchronized subtitle (`.srt`/`.vtt`) generation | `./.venv/bin/whisper` / `scripts/subtitles.py` |
| **Edge AI & ElevenLabs** | Neural voiceovers (Free Edge-TTS or Hyper-Realistic ElevenLabs) | `scripts/voiceover.py` / `reel_studio.py voiceover` |

---

## 📁 Workspace Directory Structure

```text
Viral Reel Studio/
├── Raw footage/          <- Place your camera clips, screen recordings, B-roll here
├── style reference/      <- Place reference videos, aesthetic benchmarks, moodboards
├── export/               <- Organized sub-folders per finished Reel (e.g. GTA_6_Launch_Eve, The_Shopkeeper_Fake_500_Note)
│   └── <Reel_Name>/      <- Dedicated export directory per produced Reel:
│       ├── <reel>_viral_short.mp4  <- Final 9:16 rendered short (H.264 / AAC)
│       ├── thumbnail.png           <- High-CTR 1080x1920 thumbnail / cover
│       ├── voiceover.mp3           <- Master voiceover track
│       ├── subtitles.srt           <- Synced SRT subtitles
│       ├── preview_player.html     <- Interactive browser preview player
│       └── YOUTUBE_METADATA.md     <- Complete YouTube/Instagram metadata & SEO kit
├── motion_graphics/      <- Hyperframes motion graphics projects & animated titles
├── audio/                <- Working audio files & background music
├── subtitles/            <- Working subtitle files
├── scripts/              <- Individual tool wrappers (voiceover, subtitles, video processor)
└── reel_studio.py        <- Master pipeline CLI orchestrating all 4 tools
```

> ⚠️ **File Hygiene Policy:** Keep root `export/` clean. Every completed reel must live inside its own `export/<Reel_Name>/` folder containing only the final video, thumbnail, voiceover, subtitles, and `YOUTUBE_METADATA.md`. All temporary/scratch cuts and intermediate frames should be cleaned up after export.

---

## 🚀 How to Use Each Tool

### 1. Voiceover (Edge AI & ElevenLabs)
Generates natural voiceovers with adjustable pace and pitch:

```bash
# Edge AI (Free, neural)
./.venv/bin/python scripts/voiceover.py --text "वायरल रील स्टूडियो में आपका स्वागत है।" --voice hi-male -o audio/voice.mp3

# ElevenLabs (Hyper-realistic)
export ELEVENLABS_API_KEY="your_api_key"
./.venv/bin/python scripts/voiceover.py --engine elevenlabs --voice adam --text "Stop editing reels manually. Here is the automation trick." -o audio/voice.mp3

# List available voices across both engines
./.venv/bin/python scripts/voiceover.py --list-voices
```

---

### 2. Whisper (Automatic Subtitles)
Transcribe any video or audio file to generate timestamped `.srt` subtitles:

```bash
# Transcribe audio file to subtitles/
./.venv/bin/python scripts/subtitles.py --input audio/sample_voiceover.mp3 --output-dir subtitles --model base

# Transcribe with language constraint
./.venv/bin/python scripts/subtitles.py --input "Raw footage/clip.mp4" --output-dir subtitles --language hi
```

---

### 3. FFmpeg (Video Cutting & Processing)

```bash
# Cut / trim raw footage
./.venv/bin/python scripts/video_processor.py cut --input "Raw footage/sample.mp4" --start 00:00:03 --duration 10 --output "export/clip_cut.mp4"

# Format any horizontal (16:9) video into vertical (9:16 - 1080x1920) Reel format
./.venv/bin/python scripts/video_processor.py reel-format --input "Raw footage/sample.mp4" --output "export/vertical_clip.mp4"

# Compose full Reel: Video + Voiceover + Subtitles Burn-in + Ducked BGM
./.venv/bin/python scripts/video_processor.py compose \
  --video "export/vertical_clip.mp4" \
  --audio "audio/voice.mp3" \
  --subtitles "subtitles/voice.srt" \
  --output "export/final_viral_reel.mp4"
```

---

### 4. Hyperframes (Motion Graphics & Kinetic Overlays)
Create programmatic HTML/CSS/GSAP motion graphics:

```bash
# Scaffold a new 9:16 vertical motion graphic project
./node_modules/.bin/hyperframes init motion_graphics/title-card --non-interactive --resolution portrait --example blank

# Open local live preview studio
cd motion_graphics/reel-intro && npx hyperframes preview

# Render motion graphics composition to MP4
cd motion_graphics/reel-intro && npx hyperframes render -o ../../export/intro_motion.mp4

# Render transparent WebM overlay (for layering on top of raw footage)
cd motion_graphics/reel-intro && npx hyperframes render --format webm -o ../../export/overlay.webm
```

---

## ⚡ Master Pipeline CLI (`reel_studio.py`)

You can run the end-to-end workflow using `reel_studio.py`:

```bash
# Step 1: Generate AI Voiceover
./.venv/bin/python reel_studio.py voiceover --text "5 AI tools that will save you 10 hours a day." --voice hi-male --rate "+5%" --output audio/reel1_voice.mp3

# Step 2: Auto-generate Subtitles using Whisper
./.venv/bin/python reel_studio.py subtitles --input audio/reel1_voice.mp3 --output-dir subtitles

# Step 3: Cut Raw Footage
./.venv/bin/python reel_studio.py cut --input "Raw footage/camera_clip.mp4" --start 00:00:00 --duration 15 --output export/trimmed.mp4

# Step 4: Compose Final Reel with Subtitles burned in
./.venv/bin/python reel_studio.py compose --video export/trimmed.mp4 --audio audio/reel1_voice.mp3 --subtitles subtitles/reel1_voice.srt --output export/reel1_final.mp4
```
