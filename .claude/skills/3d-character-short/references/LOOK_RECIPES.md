# Look recipes (numbers that were tested in this kit)

## 1. Portrait framing (the #1 source of bad shots)
A 9:16 frame is narrow. Visible size at distance D from the lens (vertical fov f, aspect 0.5625):
`height = 2 D tan(f/2)`, `width = 0.5625 x height`.

| fov | height | width | to frame a head+shoulders (0.9 m) | waist-up (1.3 m) | full adult (1.9 m + margin 2.3) | two adults side by side (1.6 m wide) |
|---|---|---|---|---|---|---|
| 28 | 0.50 D | 0.28 D | D = 1.8 | D = 2.6 | D = 4.6 | D = 5.7 |
| 32 | 0.57 D | 0.32 D | D = 1.6 | D = 2.3 | D = 4.0 | D = 5.0 |
| 36 | 0.65 D | 0.37 D | D = 1.4 | D = 2.0 | D = 3.5 | D = 4.4 |
| 42 | 0.77 D | 0.43 D | D = 1.2 | D = 1.7 | D = 3.0 | D = 3.7 |

Rules that follow:
- Two people in one shot must stand within ~+-0.7 m of the centre axis at ~3 m. Stage the scene as a **vertical column**: near/far, high/low, with the blur doing the separation.
- Put the **eyes on the upper third** line (y ~ 640 px of 1920). Aim `look` slightly ABOVE the head so the face sits low if hook text needs the top.
- For a character with `height` k and `headScale` h, eye height = `eyeHeight(spec, scale)` (adult ~1.7 m, child ~1.05 m).
- Set walls taller than the highest camera view (>= 4.5 m) or the sky shows above them when the camera rises.
- After every shot edit, **render the frame**: in this kit a face cropped by the frame edge happened in 4 of the first 9 shots.

## 2. Shot library (camera for a character at the origin facing +z, eye height ~1.65; adjust y to `eyeHeight`)
| Shot | pos | look | fov | blur | use |
|---|---|---|---|---|---|
| Hook close (head + chest, subject low in frame) | [0, 1.45, 2.9] | [0, 1.6, 0] | 32 | .5 | frame 0, the claim |
| Extreme close-up (eyes/face fill) | [0, 1.66, 1.5] | [0, 1.64, 0] | 28 | .7 | deadpan beat, reaction, the "echo" line |
| Medium (waist-up) | [0, 1.45, 2.4] | [0, 1.35, 0] | 34 | .5 | talking, explanation |
| Low angle (hero / confidence) | [0, 0.85, 2.9] | [0, 1.45, 0] | 32 | .5 | boast beats, + roll -4 |
| Establishing wide | [0, 1.6, 5.2] -> [0.2, 1.55, 4.6] | [0, 1.2, -0.6] | 40 | 0 | setting; sharp, shows the world |
| Over-the-shoulder (two subjects) | [1.1, 1.3, 2.1] | [0, 1.0, -1.1] | 34 | .8 | focus on far subject/prop |
| Insert (prop) | [0, 1.3, 1.6] | [0, 0.95, -0.9] | 30 | .9 | the object the joke is about |
| Reveal pull-back | [0, 1.05, 3.4] -> [0, 1.5, 4.3] | [0, 1.25, -0.2] | 42 | .4 | payoff two-shot |
| Whip to object | [0.2, 1.3, 0.6] -> [0.5, 1.4, -0.4] ease "expo" | far prop | 36 | .6 | "Wait, why is the oven smoking?" + shake .012 |
Dutch roll +-3-4 deg on tension/boast beats; every shot has `push` 0.06-0.16 or a `pos2` move; add a `Kick` on impacts/punch words.

## 3. Light and colour
- **Calm / warm** `RIGS.warmIndoor`: key warm 2.0 from front-left-high, peach fill .45, cool rim 1.1 from behind, hemisphere .5, IBL .4. This is the "cosy Pixar kitchen".
- **Problem / tense** `RIGS.tense`: dark teal key 1.5, red-orange rim, low env .16, exposure .92. Also dim practical lights (`Lamp light`, window glow) by a derived `tension` value, or the lamp alone keeps the room warm (found in testing).
- **Payoff**: back to warm over ~16 frames (`blend:16`); `golden` for emotional endings; `night` + warm lamp for bedtime/sad-sweet.
- Walls and floors muted/warm neutral; **saturation on props and clothes** (reds, yellows, teals), 4-6 colours per set. Never pure white or pure black areas: tone mapping is neutral and clips them.
- Skin tones: choose warm, slightly saturated values (`#f0b48c`, `#c68b64`, `#8d5a3c`, `#e9b896`); blush auto-tints. Hair darker than skin by >= 30 % luminance.
- Shadows are soft (shadow radius 5) and the characters also get a contact-shadow blob. Rim light from behind separates the head from the wall.

## 4. Depth of field and post
- `blur` per shot: close-ups .6-.9, mediums .4-.5, wides 0. `focus` on the eyes or hero prop (not the default `look` when the subject is off-centre).
- `Post` bokeh radius = blur x 5 x `bokehScale`; reduce `bokehScale` (0.6) if edges of the subject smear.
- Bloom threshold .92, intensity per rig (.2-.6): only emissives (candle flames, windows, lamp bulbs) should glow. `glowMat(color, 3-5)` for sources.
- Vignette .45 default; lower to .3 on bright wides.
- Never turn film grain on: it quadruples the file size and turns to mush on upload.

## 5. Character design tips
- Proportions that read as cute: `headScale` 1.05 adults, 1.25-1.35 children, 1.1 elders; `height` 1 / .93 / .62. Build .95-1.1.
- Give each character ONE strong silhouette feature (chef hat, beanie, pigtails, glasses, apron colour, beard) and one signature colour; keep cast <= 4 on screen.
- Faces: `happy` is the default friendly face; `smug` for boasts (eyeOpen .7), `worried` for doubt, `shock` for the mystery beat (+ `shock` clip + Kick), `love`/`proud` for payoff, `laugh` with the laugh clip.
- Reaction timing: expression and clip change 2-3 frames before the word (`cue(..., {lead: 2})`); crossfade 3 frames on shocks, 5-8 on mood changes.
- Make characters look at the lens in hook/reveal/payoff shots (`gaze={cam.pos}`) and at each other otherwise.
- Held props stay upright (`holdUpright`, default). Put big readable props in hands for gags (pot, pie, phone).

## 6. Set recipes (from `World.tsx`)
- **Kitchen / living room** (default): `Room` + `Window`(+`curtains`) + `LightShaft` + `Table`+`Chair` + counter (`RB`) + `Oven` + `Shelf` + `Plant` x2 + `Rug` + `Clock` + `Frame` + `Lamp`; party: `Bunting` x2 + `BalloonCluster` + `Cake`/`Gift` + `Confetti` on the payoff.
- **Street / outdoors**: `Ground` + `Road` + 3-5 `House` (vary wall/roof colour and w/h/d) + `Tree`s (vary `seed`) + `LampPost` + `Cloud` x3 + `RIGS.morning` or `noon`; keep houses 8-20 m behind the action and fog on.
- **Night**: `RIGS.night` + `LampPost` pools + lit windows (`glowMat`) + a warm `Lamp` near the characters so faces stay warm.
- **Office / classroom**: `Room` with `wainscot` off, `Table` rows, `Frame`s, `Clock`, `Shelf` with books.
- Depth: always put 2-3 props in the foreground/midground (blurred) and the busy detail 3+ m behind the subject.
- For anything the kit lacks, build it from `RB`/`Ball`/`Cyl` with rounded corners (radius .02-.08). If you need a model of something complex (car, animal), see the GLB route in `GOTCHAS.md`.
