---
name: 3d-character-short
description: Make a 20-70 s vertical (1080x1920) story short with real 3D characters living in a 3D world - soft Pixar-style "vinyl toy" people, cosy lit sets, shallow depth of field, gliding cameras - rendered with three.js (react-three-fiber) inside Remotion, with a viral hook-first, punchy script, word-synced cuts, stamps, captions and sound. This is the entry point for any animated character-story short: it FIRST asks whether the user wants 3D characters in a 3D world (built here) or 2D cartoon characters in a 3D world (hands off to cartoon-3d-short). Use this whenever the user wants a 3D animated character story/short/reel, "like this 3D short" (e.g. the warm family 3D shorts on YouTube Shorts), a Pixar-style or 3D-cartoon story with a hook, a faceless 3D explainer/story channel, or says "3d character short" / "use the 3D skill" - even if they only say "animated 3D story" without naming three.js. Flat 2D ink-outline cards in a painted 3D town are the cartoon-3d-short style; fully 2D SVG stories use kahani-stories.
---

# 3D character story short (three.js + Remotion)

Real 3D people (head, face, hands, clothes, a rig) acting in a lit 3D set, filmed by a virtual camera, edited to a
fast hook-first script. Everything is code: no AI video generator, no downloaded models needed. Characters are
procedural "soft vinyl toy" figures, so any story, cast and world can be made from the kit in `templates/kit/`.

**What makes it look like the reference** (a warm Pixar-style 3D short: close-ups, bokeh sets, party props, soft
light): volume + soft materials, warm key / cool rim light, shallow depth of field on 2/3 of shots, constant
slow camera push, saturated props against muted walls, big readable faces. See `references/STYLE_BIBLE.md`.

**What makes it perform** (the project's measured viral formula, `../../STYLE_PROFILE.md`): voice on frame 0, a
paradox-hook in sentence one, a "turn" within 5 s, something visibly changing every 2-3 s, a "You see," pivot
to the real mechanism, an ironic last line. See `references/SCRIPT_FORMULA.md`.

## Hard rules
1. **Script first.** Nothing is built until `script.md` is approved by the user. Real stories: every fact has a source line.
2. **Storyboard before any full render** (project rule). Stills + one contact sheet, approved, then render.
3. **Own characters, own story, own voice.** The reference shorts are for look and pacing only. Never copy their
   scripts, characters, shots, branding or channel name. Characters are generic people, never real individuals.
4. **Faces must read at phone size.** Anything the viewer must read (captions, stamps, hook text) stays inside the
   safe zone (`kit/config.ts`: 120 px sides, 250 top, 420 bottom). Deities/religious figures: follow `kahani-stories/CLAUDE.md` (calm, respectful, never a joke).
5. **Pure functions of the frame.** No `Math.random()`, `Date.now()`, timers, CSS transitions. Use `hash()/rng()`.
6. **Ask before** installing npm packages, editing `remotion.config.ts`, or deleting anything (Step 0).

## Step 0 - ask which style (always, before anything else)
Two different looks share this pipeline's script formula but not its engine, so ask first with `AskUserQuestion` (one question, header "Style"):

| Option | What it is | Engine |
|---|---|---|
| **3D characters in a 3D world** (recommended; the look of the reference short) | Real 3D people with volume, soft light, close-ups, blurred backgrounds | this skill's kit (steps below) |
| **2D characters in a 3D world** | Flat bean-head cartoon cards with ink outlines standing in a painted 3D town, ink-line world, gliding cameras | `cartoon-3d-short` |

Skip the question only when the user already named the style ("like this 3D short", "Pixar-style" -> 3D; "like the bridge video", "flat cartoon people in a 3D town" -> 2D); say which one you chose and why in one line.

- **3D + 3D** -> continue with Step 1 below.
- **2D + 3D** -> if `cartoon-3d-short` is in the skill list, invoke it with the topic and stop following this file (the script rules in `references/SCRIPT_FORMULA.md` still apply to its script). If it is NOT listed: it is not installed in this project; a copy exists in the sibling project at `../short-videos-clips/.claude/skills/cartoon-3d-short`. Tell the user, and **ask before copying** it into `.claude/skills/` (it carries large reference frames that are private study material and expects the `src/videos/<name>/` Remotion layout; `@remotion/three` is already installed here once Step 1 has been run). Do not rebuild a 2D mode from scratch unless the user asks.
- Either way the next thing the user sees is the script for approval, so ask the style first and the topic second.

## Step 1 - one-time setup, 3D characters only (ask the user first)
The 3D packages are not in the project by default. Run:
```bash
bash .claude/skills/3d-character-short/templates/tools/setup.sh        # add --dry-run to preview
```
It installs `three`, `@react-three/fiber`, `@remotion/three`, `postprocessing`, `@types/three` (versions verified with Remotion 4.0.545 / React 19), copies
the kit to `kahani-stories/src/three/`, adds `Config.setChromiumOpenGlRenderer("angle")` and makes the 3D template available.
Then `cd kahani-stories && npm run typecheck`.

## Pipeline (3D characters in a 3D world)
1. **Topic + facts.** One surprising true (or clearly fictional-comedy) story with a visible cause and effect. Genres: *wholesome* (family, kindness, gratitude: slow pushes, warm light, music-led) and *punchy* (paradox, comedy, "you won't believe", fast cuts, stamps, SFX hits).
2. **Script** (`stories/<slug>/script.md`, start from `templates/story/script.md`). Use the beat formula in `references/SCRIPT_FORMULA.md`: hook -> turn -> setting -> escalation (3-6 beats) -> "Wait...?" -> "You see," pivot -> ironic payoff. ~3.7 words/s, 55-70 s typical. **Stop for approval.**
3. **Cast + world.** Pick or write `CharacterSpec`s (skin, hair style, outfit, `height`, `headScale`, hat/glasses/apron...) and a set from `World.tsx` props. Cast limit ~4 on screen. See `references/KIT_API.md` and `references/LOOK_RECIPES.md` (set recipes, shot library).
4. **Voice + timings.** `npm run voice -- --text "..." -o voice/<slug>.mp3` then `npm run timings -- voice/<slug>.mp3` (writes `stories/<slug>/timings.json`). Before the voice exists, estimate: `python templates/tools/estimate_timings.py --file voiceover.txt -o stories/<slug>/timings.json` (same JSON shape).
5. **Story code.** `bash templates/tools/new_story.sh <slug>` copies `templates/story/` to `stories/<slug>/` (Story.tsx, shots.ts, Kitchen.tsx, script.md, voiceover.txt, timings.json). Rewrite the set, cast, `buildCues` (spoken words -> frames via `cue(words, "oven")`), `buildShots`, `buildLight`, tracks for each character's `clip` + `face`. Register the composition in `stories/registry.tsx`.
6. **Storyboard.** `npm run storyboard -- <Id> <frames...>` (cue frames + a mid-shot frame each) then `bash templates/tools/sheet.sh out/sheet.png 5 out/storyboard/<Id>/*.png`. **Review the sheet yourself against the checklist below, fix, re-render, then show the user.** Stop for approval.
7. **Sound.** Voice `<Audio>` on frame 0. Add a music bed (-18 to -20 dB under voice) and SFX at cue frames (whoosh on cuts, pop on stamps, impact on kicks) with `<Sequence>`; reuse `../../audio/` and `sfx/` assets. Target ~ -14 LUFS, true peak <= -1 dB, voice >= 12 dB over music.
8. **Render.** First a fast review cut: `npm run render -- <Id> out/<slug>-draft.mp4 --scale=0.5` (~6x faster: 13 s of video in ~9 s) to check motion, cuts and timing with the audio; then the final `npm run render -- <Id> out/<slug>.mp4` (1080x1920, 30 fps, ~6.6 fps on Apple silicon, so ~5 min for 60 s). See `references/GOTCHAS.md` for disk notes.
9. **QA** (below), then deliver the mp4 (`SendUserFile`), title/description/hashtags, and save learnings.

## Storyboard checklist (look at the sheet; fix before showing the user)
- [ ] **Frame 0 shows the hook claim** with a face or the absurd object big in frame; hook text in the top safe zone, not covering the face.
- [ ] Every shot has a clear subject; **faces are never cut off** or hidden behind a prop. Portrait is narrow: keep two people within ~±0.7 m of centre (see width table in LOOK_RECIPES).
- [ ] A new shot, camera move, stamp or light change every 2-3 s; no shot over ~4 s without a creeping push.
- [ ] Mood-coded light: warm = fine/payoff, cool-dark = problem. The change lands on the word that causes it.
- [ ] Depth of field on close-ups (blur .5-.9), wides sharp (blur 0). Focus point on the eyes / hero prop.
- [ ] Reactions land 2-3 frames BEFORE their word (`cue(..., {lead: 2})`).
- [ ] Captions 1-3 words, inside safe zone, accent colour on numbers/key word. Stamps one per beat at most.
- [ ] Palette: muted walls/floor, saturated props, skin tones varied and warm, no pure black or pure white areas.
- [ ] Last line is the shortest and ends the video on its last word (no outro, no logo).

## QA before delivery
- Extract frames at every cut +2 and mid-shot (`ffmpeg -i out.mp4 -vf "select=..."`), build a sheet, check: no black/white/frozen frames, no clipped faces, text readable at 1/3 size, no z-fighting/flicker.
- `ffmpeg -i out.mp4 -af loudnorm=print_format=summary -f null -` -> about -14 LUFS, true peak <= -1 dB.
- Duration within the script's target; audio ends with the last word + <= 0.5 s.
- Watch it at phone size once (Remotion Studio, 360 px wide window): can you tell what is happening with the sound off?

## Files in this skill
| Path | What |
|---|---|
| `templates/kit/` | The 3D engine: `Character.tsx` (rig, face, hair, accessories), `pose.ts` (20 clips), `face.ts` (15 expressions, blink, lip-sync), `World.tsx` (rooms + ~30 props), `look.ts` (7 light rigs), `camera.ts` (shots/kicks), `Stage.tsx` + `Post.tsx` (render + DOF/bloom/grade), `Overlays.tsx` (hook text, stamp, flash, punch), `timing.ts` (word cues) |
| `templates/story/` | Working demo story ("The Pie"): `Story.tsx`, `shots.ts`, `Kitchen.tsx`, `script.md` |
| `templates/tools/` | `setup.sh`, `new_story.sh`, `estimate_timings.py`, `sheet.sh` |
| `templates/kit-test/ClipLineup.tsx` | Labelled gallery of all 20 clips (register as a composition, render one still) |
| `references/STYLE_BIBLE.md` | Look + format of the reference style, with measurements and what to copy vs not |
| `references/SCRIPT_FORMULA.md` | Hook patterns, beat sheet, punchy writing rules, worked examples |
| `references/KIT_API.md` | Every component, prop, clip, face, light rig and helper |
| `references/LOOK_RECIPES.md` | Lighting/colour/DOF numbers, portrait framing table, shot library, set recipes |
| `references/GOTCHAS.md` | Verified pitfalls (blank post-processing, framing, disk, speed) and the GLB-asset route |

## When it does not look right
Do not tweak blindly: render the single frame, look at it, change one thing. Common fixes: face cut off -> move camera or characters toward the axis; flat/washed -> lower light intensities or `exposure`, raise `env` only a little; muddy faces -> add warm `fill`, lower `vignette`; sleepy eyes -> `eyeOpen` 1.0-1.1 not 0.7; stiff pose -> add a `poseAdd` lean/tilt or change clip at the beat; busy background -> raise shot `blur`.
