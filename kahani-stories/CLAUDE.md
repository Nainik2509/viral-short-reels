# Kahani Stories - animated story studio

Vertical animated stories (1080x1920, 30 fps) built with Remotion + TypeScript. Everything here is code-drawn SVG: one reusable character rig, reusable scene parts, and captions that follow the voice-over word by word.

This folder lives inside **Viral Reel Studio** and reuses its shared tools. Do not duplicate them:

| Need | Use (from the parent folder) |
|---|---|
| Remotion + React packages | parent `node_modules` (this folder only adds TypeScript dev tooling) |
| Python env | parent `.venv` (Python 3.12; `faster-whisper` was added for `tools/timings.py`) |
| Voice-over (Edge TTS / ElevenLabs) | `../scripts/voiceover.py` (`npm run voice -- ...`) |
| ffmpeg | `/opt/homebrew/bin/ffmpeg` |
| Pacing, caption and colour rules | `../STYLE_PROFILE.md`, `../REEL_STYLE_GUIDE.md` |
| Brand colours / logo / fonts | `../brand/` and the brand layer in `../STYLE_PROFILE.md` (placeholder values live in `src/lib/theme.ts`) |

All commands below run from this folder (`cd kahani-stories`).

## The rules (non-negotiable)

1. **Script first.** Nothing is drawn, recorded or rendered until `stories/<slug>/script.md` exists and the user has approved it.
2. **Storyboard before any full render.** After the script and voice-over are approved, fill in `storyboard.md`, render stills with `npm run storyboard`, and get approval. Only then run a full video render. (The 3-second rig test is the only exception.)
3. **Every deity is shown with a calm, respectful face.** Gentle smile or serene lowered eyes only: never angry, comic, scared, sad, surprised, mocking or distorted. Deities are never the butt of a joke, never in an undignified place or pose, never walking comedically or doing slapstick. Use `divine` characters (the `deity` preset or `makeSpec(..., true)`): the rig forces a calm/smile face, soft eyes, a halo and the blessing gesture. When unsure about a story detail or iconography, flag it to the user instead of guessing.
4. **Captions stay inside the safe zone.** Defined in `src/lib/constants.ts` (`SAFE_ZONE`, `SAFE_RECT`): 120 px left/right, 250 px top, 420 px bottom. Use the `Captions` component (centred at `CAPTION_Y` = 1410, 1-3 words at a time). Anything else the viewer must read (numbers, stamps, faces) also stays inside. Check with `npm run storyboard -- --guide ...`.

## Workflow for a new story

1. `cp -r stories/_template stories/<slug>` and write `script.md` (hook claim at 0 s, turn line within ~5 s, 3-5 beats, payoff). **Stop for approval.**
2. Make the voice-over: `npm run voice -- --voice hi-male --text "..." -o voice/<slug>.mp3` (or the user's own recording). Keep it in `voice/`.
3. Word timings: `npm run timings -- voice/<slug>.mp3 --language hi` writes `stories/<slug>/timings.json` (every word with `start`, `end`, `startFrame`, `endFrame`). Use `--model medium` for better Hindi accuracy.
4. Fill in `storyboard.md` (one row per beat, with frames taken from the timings). Write `Story.tsx` to match, register it in `stories/registry.tsx` (one line), and render stills: `npm run storyboard -- --guide <Id> 0 60 150 ...`. **Stop for approval.**
5. Add music (`music/`) and sound effects (`sfx/`), then render: `npm run render -- <Id> out/<slug>.mp4`. Target mix ~ -14 LUFS, true peak <= -1 dB, voice at least 12 dB above music.
6. Preview any time with `npm run studio`.

## Layout

```
kahani-stories/
  stories/<slug>/     one folder per story: script.md, storyboard.md, timings.json, Story.tsx
  stories/_template/  copy this to start a story        stories/registry.tsx  list of compositions
  stories/_rig-test/  RigWalkTest (3 s) and RigLineup (all presets)
  voice/  music/  sfx/   audio inputs (git-ignored; reach them with staticFile("voice/x.mp3"))
  out/                   renders and storyboard stills (git-ignored)
  src/rig/               the character
  src/scene/             sky, moon, hills, trees, clouds, diya, sparks, petals
  src/captions/          Captions, SafeZoneGuide
  src/lib/               constants, theme, math (seeded random), color, timings types
  tools/timings.py       voice-over -> word timings (faster-whisper)
  tools/storyboard.sh    stills at chosen frames
```

## Character rig (`src/rig`)

One SVG character built from parts: head (hair, face, headwear, halo), body, arms, legs, and cloth (top, kurta/skirt hem, shawl). It faces +x with its feet at `(x, y)`.

```tsx
<Character spec="boy" x={400} y={groundY} scale={1.15}
  walk={1} walkPhase={walkPhaseFor(distanceWalked, 1.15)}   // 0 = stand, 1 = walk
  wave={0}                                                   // 0..1 raises the arm
  expression="smile" />                                     // calm | smile | sad | surprised
```

- **Walk** is driven by `walkPhase` (in cycles). Use `walkPhaseFor(distance, scale)` so feet do not slide on a scrolling ground; without it the character steps at `walkHz`. Ease `walk` 0 -> 1 to start and stop.
- **Wave**: raised arm with a swinging hand. Deities use `"bless"` (a still raised palm) automatically.
- **Blink** and **breathe** are on by default; give each character a different `seed` so a crowd does not move together.
- **Re-colour** with `palette={{ top: "#2E9C8F", skin: "#8D5A3C" }}`; **re-dress** with `outfit={{ bottom: "dhoti", headwear: "turban", beard: true }}`. Palette keys: skin, hair, top, topTrim, bottom, bottomTrim, shawl, shoes, gold, eye. Outfit keys: top (kurta/blouse/bare), sleeves, bottom (pants/dhoti/skirt), shawl, hair (short/long/bun/braid/bald), headwear (none/turban/crown), beard, moustache, tilak, bindi, necklace.
- **Presets** in `src/rig/presets.ts`: `boy`, `girl`, `grandmother`, `king`, `deity`. Build new roles with `makeSpec(palette, outfit, divine?)` and keep them in that file so they are reused across stories.
- Draw characters inside an `<svg width={1080} height={1920} viewBox="0 0 1080 1920">`.

## Scene parts (`src/scene`)

Each part is a full-frame SVG layer. Stack them back to front: **Sky -> Moon -> Clouds -> Hills (with trees) -> Diya / Sparks -> Character -> Petals -> Captions**.

- `Sky` (`mood`: dawn / day / dusk / night; `sun`; stars fade by mood; `toMood` + `progress` blends day -> night) and `Moon` (`lit` 0..1 for crescent to full).
- `Hills`: three layers (far, middle, near), each with its own parallax speed, trees interleaved. `scroll` is the distance the camera has travelled. The near layer is the ground: `hillHeight(layer, worldX)` and `hillSlope(...)` give the ground height and slope for standing a character on it.
- `Clouds` (each cloud has its own speed, size and bob), `Trees` (neem/banyan-style canopies and palms, swaying), `Diya` (`lit` 0..1 to light it), `Sparks` (embers rising from a point), `Petals` (marigold/rose petals tumbling through the frame).

## Coding rules

- **Everything is a pure function of the frame** (`useCurrentFrame`). No `Math.random()`, no CSS transitions, no `setTimeout`: Remotion renders frames in parallel. Use `rng(seed)` / `hash(n)` from `src/lib/math.ts` for stable randomness.
- Use `src/lib/constants.ts` (`WIDTH`, `HEIGHT`, `FPS`, safe zone) and `src/lib/theme.ts` (colours) instead of hard-coding numbers.
- Check types with `npm run typecheck`. Put new reusable parts in `src/`, story-specific scenes in `stories/<slug>/`.
- Fonts: the caption stack falls back to macOS Devanagari fonts; verify Hindi text in a still before a full render.
- Never commit audio/video (`.gitignore` already covers mp3, wav, mp4 and `out/`).
- Content limits: no real people, no copied characters, scenes or scripts from reference videos (see "What we do NOT copy" in `../STYLE_PROFILE.md`).

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Remotion Studio preview |
| `npm run storyboard -- [--guide] <Id> <frames...>` | stills in `out/storyboard/<Id>/` (`--guide` shows the safe zone) |
| `npm run timings -- voice/<slug>.mp3 [--language hi] [--model small]` | word timings JSON |
| `npm run voice -- --text "..." --voice hi-male -o voice/<slug>.mp3` | voice-over via the shared tool |
| `npm run render -- <Id> out/<slug>.mp4` | full render (only after the storyboard is approved) |
| `npm run test-render` | the 3-second rig walk test -> `out/rig-walk-test.mp4` |
| `npm run typecheck` | TypeScript check |
