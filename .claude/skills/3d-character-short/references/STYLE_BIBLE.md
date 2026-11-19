# Style bible - 3D character shorts

Two sources feed this style: the **look** of the linked reference short (observed below) and the **performance
formula** the project already measured from 8 viral shorts (`../../STYLE_PROFILE.md`, `../../REEL_STYLE_GUIDE.md`).
The skill reproduces the look with a code-built 3D kit and puts that formula on top.

## 1. The look reference (what was actually observed)
Reference: YouTube Short `OXzO17_nRTg` ("Happy men's day | International men's day", channel handle @standwithtrend, labelled **AI** by YouTube,
i.e. an AI-generated montage, not a hand-built 3D film). Observed by opening it in a browser and sampling 4 frames
spread over roughly its first 12 s. **Audio, exact cut times and camera speed were NOT measured**, so pacing numbers below come from the
project's profile and our own tests, not from this clip.

What the frames show, and which kit feature reproduces it:

| Observed | Reproduce with |
|---|---|
| Pixar-like characters: big expressive eyes with glints, soft rounded faces, stubble, textured/curly hair, knit sweaters, aprons | `Character` (eyes + lids + brows, `hairStyle` swoop/curly/bun..., `topStyle:"sweater"`, `apron`, `beard:"stubble"`) |
| Chest-up / face close-ups, subject fills the portrait frame, eyes at upper third | Shot library "close-up" and "medium close-up" in `LOOK_RECIPES.md` |
| Shallow depth of field, creamy bokeh behind the subject, string lights as soft blobs | `blur` .5-.9 per shot (focus on the eyes); `Lamp`/`Bunting` as soft background, `Bloom` in `Post` |
| Warm cosy interiors: kitchen, living room; warm key + peachy ambient | `RIGS.warmIndoor`, `Room` + `Window` + `LightShaft`, muted walls |
| Party dressing: bunting flags, balloons, confetti, heart garlands, a pie on the counter | `Bunting`, `BalloonCluster`, `Confetti`, `Cake`, `Pie`, `Gift` |
| Pastel/saturated props against warm neutral backgrounds | palette rule in LOOK_RECIPES |
| Generations/relationships: dad + baby, grandpa + boy, dad cooking | `height`/`headScale` presets for adult / child / elder; `clip:"carry"` for holding a baby/prop |
| Gentle smiles, soft emotion, no hard-edged outlines | `FACES.happy/love/proud`; no ink pass (unlike `cartoon-3d-short`) |

Honest gap: this kit's characters are stylized toys built from primitives (like a vinyl figure), not photoreal-animated
Pixar skin. They read as warm 3D animation at phone size, and they are fully controllable, repeatable and consistent across shots,
which AI video is not. If a project needs film-grade characters, use rigged GLB models (see `GOTCHAS.md`, "GLB route").

## 2. What we do NOT copy
Their characters/designs, any frame, their title/hashtags/channel name, any script. The look is a genre (warm Pixar-style 3D);
the content is always our own. Characters are generic people (never a likeness of a real person). Keep the **AI** disclosure
rules of the platform in mind only if you add AI-generated material; this pipeline is procedural code and generates none.

## 3. Format (from the project's measured profile)
- 1080x1920, 30 fps, 35-70 s (sweet spot 45-60 s). **Voice on frame 0**, no logo, no intro, no outro, no CTA text.
- Voice ~3.5-4.1 words/s, almost no dead air (pauses > 0.4 s are rare).
- New picture information every 2-3 s: cut, camera move, stamp, light change or prop change. Fast comedic shorts cut every 1.5-2 s; wholesome ones can hold 3-4 s **if the camera keeps creeping**.
- Captions: 1-3 words at a time, white bold, thick black outline, centred ~73 % height (y 1410), accent colour on numbers and the key word. Inside the safe zone.
- Audio target -14 LUFS, true peak <= -1 dB, voice >= 12 dB over music, SFX on cuts/stamps.
- One accent colour for text (golden yellow `#ffd23f`) so overlays always win attention.

## 4. Two genres, one engine
| | Punchy (default) | Wholesome |
|---|---|---|
| Hook | paradox / absurd claim | warm promise ("He did this for his daughter every day for 20 years") |
| Cut rate | 1.5-2.5 s | 2.5-4 s |
| Light | warm -> cool (problem) -> warm (payoff) | warm throughout, golden at the end |
| Extras | stamps, flashes, kicks, zoom punches, SFX hits | slow pushes, confetti, soft music swell, no stamps |
| Ending | ironic payoff or loop line | emotional beat on the last word, hold the face 0.5 s |

## 5. Our own measured numbers (from the kit's test renders)
- Full-res render speed on an Apple-silicon Mac, DOF + bloom on: **~6.6 fps** (381 frames in 58 s). A 60 s short is ~5 min. Stills ~15-50 s each incl. bundling the first time.
- Portrait framing: horizontal field = 0.37 x distance at fov 36 (table in `LOOK_RECIPES.md`). Two people must sit within about +-0.7 m of centre at ~3 m.
- Light rig defaults and DOF values that look right are in `LOOK_RECIPES.md`.
