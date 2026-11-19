# 🎯 Style Profile — learned from 8 reference Shorts

*Measured on 2026-11-19 from the 5 linked Shorts + 3 clips already in `style reference/`.
Raw numbers come from frame/audio analysis (cut detection, colour histograms, Whisper word timings, RMS loudness) plus visual review of contact sheets.
This profile is **inspiration, not a template to clone** — see [What we do NOT copy](#-what-we-do-not-copy).*

Supersedes the pacing/caption numbers in [REEL_STYLE_GUIDE.md](REEL_STYLE_GUIDE.md) where they differ (speech is faster and the mix louder than that guide assumed).

---

## 1. The references

| ID | Short | Length | Hard cuts/min | Speech (wpm)* | Notes |
|---|---|---|---|---|---|
| A | [Train bridge taller than the Eiffel Tower](https://www.youtube.com/shorts/UJpmkTFIYLI) | 49s | 7 | ~165 | Drone-style fly-through, year/number stamps |
| B | [Lunchboxes vs a tank regiment](https://www.youtube.com/shorts/SodUtqp_ASM) | 129s | **36** | ~199 | Fastest cutting; blueprint UI cards, "12 REAL MINES" stamp |
| C | [Why world leaders can't keep gifts](https://www.youtube.com/shorts/USkDMtz7JqU) | 34s | 16 | ~197 | Price tags + timeline UI (1850 → 2000) |
| D | [3 things India does better than America](https://www.youtube.com/shorts/cZExh7WRPLU) | 40s | ~0 (continuous camera) | ~187 | Numbered list, giant "1 / 3" signage |
| E | [No oxygen tank on your plane](https://www.youtube.com/shorts/vbjr1Hy5Mqw) | 37s | ~2 (continuous camera) | ~193 | Odometer counter, gauges, cutaway diagrams |
| F | Canteen riddle (`style reference/`) | 51s | 14 | ~178 | Interactive: timer, A/B/C/D options, comment CTA |
| G | Ancient jar (`style reference/`) | 65s | ~1 (continuous camera) | ~218 | Story arc, cinematic lighting shifts |
| H | Job nobody wants in Japan (`style reference/`) | 61s | ~0 (continuous camera) | ~223 | Blue→warm lighting for mood change |

\* Whisper-`base` estimates; treat as ±10%. "Hard cuts" undercounts: most clips change scene with **camera moves and dissolves**, not hard cuts, so every one of them shows a new scene or state roughly every 3–5 s (checked on 12-frame contact sheets).

---

## 2. Pacing

- **Zero pre-roll.** Speech starts at 0.00 s in all 8 clips. No logo sting, no "hey guys".
- **Sentence 1 is the claim**, and it is surprising in plain words:
  "A train crosses a river higher than the Eiffel Tower." · "In 1971, a few lunchboxes stopped an entire tank regiment."
- **Then a turn line within ~5 s**: "But there's a catch." · "Here's the crazy part." · "Sounds crazy, right?"
- **Speech runs ~165–220 wpm** (median ≈ 195) — faster than the 150–175 in the old guide. Pauses over 0.4 s are rare (0–15 per video, mostly 0–4). Dead air is cut.
- **Something visibly changes every ~2–4 s** (new scene, camera move, stamp, counter tick). In the fastest clip (B) a hard cut lands every ~1.6 s.
- **Structure**: hook claim → turn → 3–5 beats, each with one visual prop or number → payoff line → (optional) CTA/loop. Length sweet spot 35–65 s.
- **Interactive variant (F)**: riddle → countdown timer (8 s → 4 s) → "COMMENT: A, B, C ya D" → answer in part 2. Drives comments.

## 3. Captions

- **1–3 words at a time, usually 2**, one chunk per spoken beat (~0.3–0.6 s each), always synced to the voice.
- **Position:** horizontally centred, at **≈ 70–75 % of frame height** (measured ≈ y 1380–1440 of 1920). Clear of the right-hand button column and the bottom 15 % UI.
- **Look:** heavy bold sans (Montserrat/Poppins-class), **white fill, thick black outline, no box**. Soft pop-in and fade-out.
- **One accent colour** on numbers and the key word of a line (golden yellow): `359 metres`, `15 hours…`, `In 2025,`.
- **Exception — hook/rule banners (F):** rounded pill, dark fill, coloured 2 px border, ALL-CAPS short text.
- **Never full sentences** and never the whole transcript.

## 4. Colour

- **Saturated, high-contrast cartoon palette** (mean saturation 0.41–0.65). Backgrounds are rarely neutral.
- **Complementary pairs dominate:** royal/navy blue (`#103090`, `#101070`) against amber/gold (`#F0B010`) and warm sunset orange; or green/earth-brown (A).
- **Colour carries mood:** cold blue = tension/problem/night, warm gold/orange = reward/answer/payoff. H and G shift lighting from cool to warm at the turn.
- **Captions and stamps are the only high-contrast white/yellow** on screen, so they always win attention.
- Dark UI cards (`#0F1B3D`-ish navy, thin cyan/yellow borders) for tickers, options and timelines (B, F).

## 5. Motion

- **Camera never sits still:** slow push-ins, orbits, top-down drone passes, whip/slide between scenes. (Measured in-shot motion is high even in clips with ~0 hard cuts.)
- **Number/label stamps:** years (`2021`, `2025`), prices (`$24,500`), counts (`12 REAL MINES`) pop in with a small overshoot and sit on a signpost, banner or UI card.
- **Live trackers:** odometer counter (E), gauge dial (E), timeline strip 1850→2000 (C), countdown ring (F). The thing on screen updates while the narrator speaks.
- **Lighting changes** are used as transitions (day → night, cool → warm).
- **Sound-design hits** on stamps and scene changes (whoosh, pop, buzzer).

## 6. Audio

- **Loud, dense, voice-forward:** overall RMS −14 to −17 dBFS, peaks −0.8 to −2.6 dBFS, very small level swings (≈ 2–3.5 dB between 3-second windows). Music sits under the voice.
- **Target for our exports:** ≈ −14 LUFS integrated, true peak ≤ −1 dBTP, voice always ≥ 12 dB above music.

---

## 🧩 Brand layer — **to be filled in by you**

Nothing in the workspace defines these yet, so they are placeholders. Edit them and the next build will use them.

| Slot | Your value | Status |
|---|---|---|
| Channel / brand name | _TBD_ | ❓ |
| Logo file (PNG/SVG, transparent) | _TBD_ → `brand/logo.png` | ❓ |
| Brand colours (primary / accent / background) | _TBD_ (references use navy + gold + white) | ❓ |
| Caption font | _TBD_ (default proposal: Montserrat ExtraBold) | ❓ |
| **Your face** | Clips of you in `Raw footage/` (a 20–30 s talking-to-camera clip + a few reaction takes is enough) | ❓ none yet |
| **Your voice** | A clean voice sample or your own recorded VO. Today only stock ElevenLabs "Adam" / Edge voices exist. | ❓ none yet |
| Hook phrases / catchphrase / sign-off | _TBD_ | ❓ |

### How "inspired, not copied" is applied
1. **Keep the mechanics** (zero pre-roll, claim → turn → beats, 1–3 word captions at ~72 %, accent-colour numbers, constantly moving camera, stamp/tracker graphics, compressed loud mix).
2. **Swap the identity:** *your face* (cut-out or picture-in-picture over HyperFrames/Remotion graphics instead of the references' bean-headed cartoon people), *your voice*, *your colours/logo/font*.
3. **Own the look:** pick your own world (props, scenes and iconography) rather than the references' 3D-cartoon sets.

---

## 🚫 What we do NOT copy

- Their characters, character designs, scenes and scripts.
- Their channel name, logo and in-world branding (e.g. the logo on props/aircraft in the references).
- Any footage, audio, music or voice from the references. They stay in `References/` / `style reference/` for study only and are git-ignored.

## ✅ Build checklist (use before every export)

- [ ] Voice on the first frame; sentence 1 is a surprising claim.
- [ ] A turn line ("but…", "here's the catch…") within ~5 s.
- [ ] Captions: 1–3 words, white + thick black outline, centred ≈ 72 % height, accent colour on numbers/key word.
- [ ] A visible change (cut, camera move, stamp, tracker tick) at least every 3–4 s.
- [ ] One stamp/tracker graphic per beat.
- [ ] Mood-coded colour: cool for problem, warm for payoff.
- [ ] Mix ≈ −14 LUFS, peaks ≤ −1 dBTP, music under voice.
- [ ] Your face / voice / logo present (brand layer filled).
