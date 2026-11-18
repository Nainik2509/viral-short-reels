# 🎬 Viral Reel Studio — User & Workflow Guide

A complete, beginner-friendly manual to produce high-retention viral reels using 4 integrated tools:
**Edge AI Voiceover**, **Whisper Subtitles**, **FFmpeg Processing**, and **Hyperframes Motion Graphics**.

> 💡 **Related Guides**:
> - [REEL_STYLE_GUIDE.md](file:///Users/nainik/Documents/Nainik/Nainik2509/Projects/Viral%20Reel%20Studio/REEL_STYLE_GUIDE.md) — Video typography, kinetic subtitle recipes, transitions, and pacing metrics.
> - [THUMBNAIL_STYLE_GUIDE.md](file:///Users/nainik/Documents/Nainik/Nainik2509/Projects/Viral%20Reel%20Studio/THUMBNAIL_STYLE_GUIDE.md) — High-CTR thumbnail archetypes, 2-tone headlines, and visual contrast rules.

---

## 📑 Table of Contents
1. [Workspace Structure](#1-workspace-structure)
2. [Quick-Start: Create a Reel in 4 Steps](#2-quick-start-create-a-reel-in-4-steps)
3. [Tool 1: Edge AI Voiceover](#3-tool-1-edge-ai-voiceover)
4. [Tool 2: Whisper Subtitles](#4-tool-2-whisper-subtitles)
5. [Tool 3: FFmpeg Video Cutting & Compositing](#5-tool-3-ffmpeg-video-cutting--compositing)
6. [Tool 4: Hyperframes Motion Graphics](#6-tool-4-hyperframes-motion-graphics)
7. [Master Pipeline CLI (`reel_studio.py`)](#7-master-pipeline-cli-reel_studiopy)
8. [NPM Command Shortcuts](#8-npm-command-shortcuts)
9. [Pro Tips for Viral Reels](#9-pro-tips-for-viral-reels)

---

## 1. Workspace Structure

| Folder | What to put here |
|---|---|
| `Raw footage/` | Your recorded clips, screen captures, camera B-roll. |
| `style reference/` | Reference reels, moodboards, color grading benchmarks. |
| `export/` | All finished videos, cut clips, and final rendered reels. |
| `audio/` | Generated AI voiceover MP3s and background music (BGM). |
| `subtitles/` | Generated SRT / VTT subtitle files. |
| `motion_graphics/` | Hyperframes projects (HTML/CSS/GSAP animated titles & hooks). |
| `scripts/` | Python scripts powering each tool. |

---

## 2. Quick-Start: Create a Reel in 4 Steps

Run these commands directly in your terminal:

```bash
# Step 1: Generate Voiceover (Hindi Male Voice, +8% speed for snappy reel pacing)
./.venv/bin/python scripts/voiceover.py \
  --text "क्या आप जानते हैं? सिर्फ 3 टूल्स से आप हर रोज ऑटोमेटेड रील्स बना सकते हैं।" \
  --voice hi-IN-MadhurNeural \
  --rate "+8%" \
  --output audio/voice.mp3

# Step 2: Auto-generate Subtitles using Whisper
./.venv/bin/python scripts/subtitles.py \
  --input audio/voice.mp3 \
  --output-dir subtitles \
  --model base

# Step 3: Trim Raw Footage to 10 seconds
./.venv/bin/python scripts/video_processor.py cut \
  --input "Raw footage/sample.mp4" \
  --start 00:00:01 \
  --duration 10 \
  --output export/trimmed_clip.mp4

# Step 4: Compose Final 9:16 Reel (Video + Voiceover + Subtitles Burn-in)
./.venv/bin/python scripts/video_processor.py compose \
  --video export/trimmed_clip.mp4 \
  --audio audio/voice.mp3 \
  --subtitles subtitles/voice.srt \
  --output export/final_viral_reel.mp4
```
Your final reel will be ready inside the `export/` folder!

---

## 3. Tool 1: Edge AI Voiceover

High-quality, natural neural voices from Microsoft Edge AI with zero API costs.

### 🎙️ Popular Voice Profiles
| Alias / Language | Voice Name | Style |
|---|---|---|
| **Hindi Male** | `hi-IN-MadhurNeural` | Clear, energetic, conversational |
| **Hindi Female** | `hi-IN-SwaraNeural` | Professional, friendly |
| **English Male** | `en-US-ChristopherNeural` | Deep, authoritative, storytelling |
| **English Female** | `en-US-JennyNeural` | Natural, upbeat, conversational |
| **Casual English** | `en-US-BrianMultilingualNeural` | Approachable, vlog-style |

### 🛠️ Common Commands

```bash
# Using direct text
./.venv/bin/python scripts/voiceover.py --text "Stop scrolling! Here is a secret trick." --voice en-US-ChristopherNeural -o audio/hook.mp3

# Using a text script file
./.venv/bin/python scripts/voiceover.py --file script.txt --voice hi-IN-MadhurNeural --rate "+10%" -o audio/full_script.mp3

# List all popular voices
./.venv/bin/python scripts/voiceover.py --list-voices
```

---

## 4. Tool 2: Whisper Subtitles

Automatically transcribes spoken audio into timestamped `.srt` or `.vtt` subtitles.

### 🛠️ Common Commands

```bash
# Transcribe voiceover audio (Auto-detect language)
./.venv/bin/python scripts/subtitles.py --input audio/voice.mp3 --output-dir subtitles --model base

# Transcribe raw video file directly
./.venv/bin/python scripts/subtitles.py --input "Raw footage/talking_head.mp4" --output-dir subtitles --model base

# Force Hindi or English language transcription
./.venv/bin/python scripts/subtitles.py --input audio/voice.mp3 --output-dir subtitles --language hi
```

> **Note:** The Whisper model is cached locally on your Mac, so transcriptions run 100% offline and fast.

---

## 5. Tool 3: FFmpeg Video Cutting & Compositing

High-speed video trimming, 9:16 vertical formatting, and automated reel composition.

### ✂️ Cut / Trim Video
```bash
./.venv/bin/python scripts/video_processor.py cut \
  --input "Raw footage/broll.mp4" \
  --start 00:00:05 \
  --duration 8 \
  --output export/clip_trimmed.mp4
```

### 📱 Convert Any Horizontal (16:9) Video to Vertical (9:16 Reel - 1080x1920)
```bash
./.venv/bin/python scripts/video_processor.py reel-format \
  --input "Raw footage/horizontal_video.mp4" \
  --output export/vertical_clip.mp4
```

### 🎬 Compose Full Reel (Video + Voice + Subtitles + BGM)
```bash
./.venv/bin/python scripts/video_processor.py compose \
  --video export/vertical_clip.mp4 \
  --audio audio/voice.mp3 \
  --subtitles subtitles/voice.srt \
  --bgm "audio/background_music.mp3" \
  --bgm-vol 0.15 \
  --output export/final_reel.mp4
```
*(BGM volume is automatically ducked down to 15% so the voiceover stays crisp and loud).*

---

## 6. Tool 4: Hyperframes Motion Graphics

Hyperframes converts standard web code (HTML, CSS, GSAP) into deterministic MP4 animations and transparent WebM overlays.

### 🎨 Workflow
1. **Scaffold a new motion graphics template:**
   ```bash
   ./node_modules/.bin/hyperframes init motion_graphics/my-hook --non-interactive --resolution portrait --example blank
   ```

2. **Edit the visual animation:**
   Open `motion_graphics/reel-intro/index.html` in Antigravity and customize the text, colors, fonts, or GSAP timeline.

3. **Live Preview in Browser:**
   ```bash
   cd motion_graphics/reel-intro && npx hyperframes preview
   ```

4. **Render to Video:**
   ```bash
   # Render as standalone MP4
   cd motion_graphics/reel-intro && npx hyperframes render -o ../../export/intro.mp4

   # Render as transparent WebM (for layering over footage)
   cd motion_graphics/reel-intro && npx hyperframes render --format webm -o ../../export/intro_overlay.webm
   ```

---

## 7. Master Pipeline CLI (`reel_studio.py`)

A single unified command for all tasks:

```bash
# Voiceover
./.venv/bin/python reel_studio.py voiceover --text "Your script here" --voice hi-IN-MadhurNeural -o audio/v1.mp3

# Subtitles
./.venv/bin/python reel_studio.py subtitles --input audio/v1.mp3 --output-dir subtitles

# Cut clip
./.venv/bin/python reel_studio.py cut --input "Raw footage/clip.mp4" --start 00:00:00 --duration 12 -o export/c1.mp4

# Format 9:16
./.venv/bin/python reel_studio.py format-reel --input "Raw footage/clip.mp4" -o export/c1_916.mp4

# Compose final reel
./.venv/bin/python reel_studio.py compose --video export/c1_916.mp4 --audio audio/v1.mp3 --subtitles subtitles/v1.srt -o export/complete_reel.mp4
```

---

## 8. NPM Command Shortcuts

You can also run commands using `npm run`:

| Shortcut | Action |
|---|---|
| `npm run voice -- --text "..."` | Generate AI Voiceover |
| `npm run subtitles -- --input ...` | Run Whisper transcription |
| `npm run cut -- --input ... --start ...` | Cut raw clip |
| `npm run format-reel -- --input ...` | Convert to 9:16 |
| `npm run compose -- --video ... --audio ...` | Render complete reel |
| `npm run motion -- ...` | Hyperframes CLI |

---

## 9. Pro Tips for Viral Reels

1. **The First 3 Seconds (The Hook):**
   - Start immediately with motion graphics or rapid visual cut.
   - Use `rate: +10%` on voiceover to keep energy high.
2. **Safe Zones for Captions:**
   - Avoid placing subtitles at the very bottom or top where Instagram/TikTok UI (like like buttons, caption box, username) covers them. The `video_processor.py` script automatically offsets subtitles by 120px from the bottom (`MarginV=120`) to remain perfectly visible.
3. **Audio Balancing:**
   - Always keep voiceover around -3dB to -6dB and background music ducked at -20dB to -25dB (10–15% volume).
