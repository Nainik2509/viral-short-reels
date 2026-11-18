# 📱 Reusable Viral Reel & Short Style Guide
*Reverse-engineered from top-performing reference reels in Viral Reel Studio*

---

## 🎯 Executive Summary & Content Archetypes

Analysis of the reference library reveals **three dominant short-form video archetypes**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VIRAL SHORT ARCHETYPES                          │
├───────────────────────┬────────────────────────┬───────────────────────┤
│  1. Interactive Logic │  2. Cultural / Binary  │ 3. Narrative History  │
│     & Riddle Shorts   │     Comparison Shorts  │    & Explainer Shorts │
├───────────────────────┼────────────────────────┼───────────────────────┤
│ • Example: Canteen    │ • Example: 3 Things    │ • Example: Ancient    │
│   Bottle Puzzle       │   India Does Better    │   Jar / Japan Job     │
│ • Pacing: 22 cuts/min │ • Pacing: 6-9 cuts/min │ • Pacing: Smooth Pan  │
│ • Focus: Mental Hook  │ • Focus: Polarity Hook │ • Focus: Mystery Hook │
└───────────────────────┴────────────────────────┴───────────────────────┘
```

---

## 1. 🔤 Typography & Title Styling

Across all references, typography is engineered for **instant mobile legibility** against busy, moving backgrounds.

### A. Font Families & Classification
- **Primary Display Font (Headlines & Hooks):**
  - Ultra-bold, condensed sans-serif (e.g., `Montserrat ExtraBold / Black`, `Impact`, `Bebas Neue`, `Cabinet Grotesk ExtraBold`).
  - Letter Spacing: `-0.02em` to `-0.04em` (tight tracking increases punchiness).
- **Secondary / Narrative Font (Subtitles & Badges):**
  - Clean geometric sans-serif (e.g., `Poppins Bold`, `Inter SemiBold`, `Proxima Nova Bold`).

### B. Color Hierarchy & Hex Codes
| Element | Hex Code | Purpose |
|---|---|---|
| **Primary Text** | `#FFFFFF` | Core dialogue, universal contrast |
| **Accent / Highlight 1** | `#FFD700` / `#FFC107` (Golden Amber) | Key numbers, punch words, monetary values |
| **Alert / Hook Badge** | `#FF3B30` / `#FF4538` (Vibrant Coral Red) | Strict rules, warnings, category capsules |
| **Text Stroke Outline** | `#000000` (8px to 12px width) | Mandatory outline to isolate text from video background |
| **Card Background** | `#121212` with 90% opacity | Floating badge container |

### C. The "Two-Tone" Hook Rule
Reference videos never use single-color title banners. They split 4-6 word headlines into **two contrasting colors**:
```
Line 1: [ WHITE TEXT ]   -> Sets the context   (e.g., "CANTEEN OFFER NE")
Line 2: [ YELLOW TEXT ]  -> Delivers curiosity (e.g., "DIMAG GHUMAYA!")
```

---

## 2. 💬 Kinetic Caption System (Subtitles)

### A. The 1–3 Word Chunk Rule
Reference reels (*The Ancient Jar*, *Japan Job*, *India vs US*) never display full paragraph sentences.
- **Display Duration:** 0.3s to 0.7s per chunk.
- **Chunk Size:** Strictly **1 to 3 words** at a time (e.g., `"to get"`, `"a giant"`, `"that are normal"`).
- **Positioning:** Centered at **65% to 75% vertical height** (Lower Third Safe Zone). This keeps text completely clear of:
  - YouTube Shorts / Instagram like/comment buttons (right side).
  - Account username and audio title (bottom 15%).
  - Top header interface (top 10%).

### B. Production Subtitle Code Recipe (FFmpeg ASS / SRT)
To reproduce the reference subtitle style in FFmpeg:

```ini
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: ViralDefault,Montserrat,22,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3.5,0,2,20,20,135,1
```
*Key parameters:*
- `Outline=3.5`: Crisp, sharp black outline.
- `Alignment=2`: Bottom-center alignment.
- `MarginV=135`: 135px bottom offset for Instagram/YouTube mobile safe zone.

---

## 3. 🎬 Motion Graphics & UI Badges (Hyperframes Components)

In *Canteen Offer*, motion graphics anchor the entire video through **reusable on-screen UI components**.

### Component 1: The Category Pill Header
```html
<!-- Red Pill Tag inside Dark Badge -->
<div style="background: #141414; border: 2px solid #FFD700; border-radius: 16px; padding: 10px 24px; text-align: center;">
  <span style="background: #E63946; color: #FFF; font-size: 14px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
    RULE #2 • STRICT POLICY
  </span>
  <h2 style="color: #FFF; font-size: 28px; font-weight: 900; margin-top: 6px; text-transform: uppercase;">
    UDHAAR ALLOWED NAHI
  </h2>
</div>
```

### Component 2: The Interactive Chalkboard / Prop Tracker
- **Visual:** Dark blackboard with chalk counters (e.g., `3 KHALI BOTTLES = 1 COLD DRINK`).
- **Function:** As the narrator speaks, the counter updates visually (`Bottle 1`, `Bottle 2`, `Bottle 3`).
- **Retention Impact:** Viewers pause and rewatch to track the logic or math.

---

## 4. ⚡ Transitions & Editing Rhythm

### A. Cut Frequency & Scene Pacing
| Video Archetype | Avg Shot Length (ASL) | Cuts Per Minute | Visual Momentum Strategy |
|---|---|---|---|
| **Riddle / Logic** | 2.3 seconds | ~22 cuts/min | Frequent graphic swaps, reaction shifts, counter updates |
| **Comparative / Cultural** | 4.5 seconds | ~12 cuts/min | Punch zoom on face -> Cut to contrast culture |
| **Narrative / Story** | 6.0 seconds | ~8 cuts/min | Continuous camera motion (slow pan + parallax zoom) |

### B. The 4 Essential Transitions
1. **The Punch Zoom (1.15x – 1.25x):**
   - Applied every 3–4 seconds on character faces during an emphatic statement (e.g., when the boss slams the button in *Japan Job*).
2. **The Whip Pan / Slide (0.15s):**
   - High-speed directional blur used when moving between contrasting points (e.g., India vs USA comparison).
3. **The Pop-In Badge (Overshoot Easing):**
   - Scale animation from `0.8 -> 1.05 -> 1.0` in 0.22 seconds using `power4.out` in GSAP.
4. **The Screen Glitch / Shake (2-3 frames):**
   - Subtle camera shake timed to alarm sounds, buzzer sounds, or dramatic drops.

---

## 5. 🎧 Audio Architecture & Voiceover Pacing

### A. Narration Tempo
- **Speed:** 150 – 175 words per minute (WPM).
- **Edge AI Setting:** `--rate "+8%"` to `"+12%"`.
- **Delivery Style:** Conversational yet punchy; zero dead air between sentences (sentences trimmed to within 0.15s of each other).

### B. Sound Design Layers (The 3-Track Mix)
```
Track 1: Primary Voiceover  [ 0dB to -3dB ]   -> Crisp, forward, bright EQ
Track 2: Sound Effects (SFX)[ -6dB to -10dB ] -> "Whoosh" on transitions, "Ding" on counters, "Buzzer" on rules
Track 3: Background Music   [ -22dB to -26dB] -> Ducked continuously under voice; rises during 0.5s pause moments
```

---

## 6. 📋 Reusable Production Checklist

Before exporting any reel from Viral Reel Studio:
- [ ] **First 2 Seconds:** Is there an immediate visual trigger (curiosity prop, extreme face, or question)?
- [ ] **Top Title:** Is the hook written in 2-tone contrasting text (White + Yellow)?
- [ ] **Captions:** Are subtitles formatted in 1–3 word chunks with minimum 3.5px black outline?
- [ ] **Safe Zone:** Is all critical text placed between `Y=20%` and `Y=80%`?
- [ ] **Visual Motion:** Does the screen state change (cut, zoom, or graphic update) at least once every 2.5–3 seconds?
- [ ] **BGM Ducking:** Is the background music ducked below `-22dB` so the voiceover remains perfectly audible?
