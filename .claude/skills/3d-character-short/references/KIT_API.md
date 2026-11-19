# Kit API (`templates/kit/`, installed to `kahani-stories/src/three/`)

Import everything from `"../../src/three"` (stories) or `"./..."` (inside the kit). All components must be rendered **inside `<Stage>`**
(they are three.js objects). All values are pure functions of `useCurrentFrame()`.

Conventions: metres, y up, +z toward the default camera, back wall at -z. Characters face +z at `yaw = 0`; +yaw turns them toward +x
(screen right when the camera is in front). A character's LEFT side is +x.

## Stage
```tsx
<Stage shots={SHOTS} kicks={KICKS} total={frames} rig={lightRig} dof={1} bokehScale={1} vignette={0.45} post={true} shadowSize={8}>
  ...set + characters...
</Stage>
```
- `shots`: `Shot[]` (below). `total`: last shot lasts until here. `rig`: a `LightRig` for THIS frame.
- `post={false}` skips DOF/bloom/grade and uses renderer tone mapping: fast layout stills only.
- `dof` 0 turns depth of field off globally; `bokehScale` scales the blur radius.
- Build sets around the origin (x,z within ~+-8 m); the key light's shadow frustum is `shadowSize` m.

## Camera (`camera.ts`)
```ts
interface Shot {
  id?: string; from: number;                  // first frame; lasts until the next shot's `from`
  pos: V3; look: V3; fov?: number; roll?: number;          // start state (fov default 38, roll in degrees)
  pos2?: V3; look2?: V3; fov2?: number; roll2?: number;    // eased move to this state over the shot
  ease?: "smooth"|"out"|"linear"|"expo";
  push?: number;       // creeping dolly toward `look`, fraction of distance over the shot (default 0.07)
  focus?: V3;          // DOF focus point (default = look). Put it on the eyes / hero prop.
  blur?: number;       // 0 sharp .. 1 strong bokeh (default 0.5)
  shake?: number;      // handheld amplitude in metres (0.01 = subtle)
}
interface Kick { at: number; mag?: number }   // impact: 8-frame decaying shake + fov punch + roll
evalCamera(shots, kicks, frame, total): CamState   // {pos, look, fov, roll, focusDist, blur, shotIndex, age}
frontOf(p, yaw, dist, y, side?) : V3               // a point in front of a character
```
Hard cut at every `from`. Inside a shot use `pos2/look2` for a move or rely on `push` (a static hold reads as a freeze).

## Light (`look.ts`)
`RIGS.{warmIndoor, coolIndoor, morning, noon, golden, night, tense}`; `lightTrack([{at, rig, blend?}], frame)` crossfades rigs;
`mixRig(a, b, t)`. A `LightRig` = sky gradient, fog, key/fill/rim (colour, intensity, direction), hemisphere, IBL `env`, `exposure`, `bloom`, `sat`.
Practical lights in the set (`Lamp`, `LampPost`) are separate: scale them with a derived "tension" value so they follow the mood.

## Character
```tsx
<Character spec={SPEC} position={[x,0,z]} yaw={0.3} scale={1}
  anim={track([{at:0, clip:"talk"}, {at:90, clip:"shock"}], frame)}      // from pose.ts
  face={faceTrack([{at:0, face:"smug"}, {at:90, face:"shock", blend:3}], frame)}  // from face.ts
  gaze={cam.pos | [x,y,z]}          // head + eyes follow a world point
  speech={lipsync(words, frame)}    // optional: mouth moves with a character's own spoken line
  poseAdd={{ rootY: jump }}         // add offsets on top of the clip (any Pose key)
  gait={walkPhaseFor(distance)}     // walk/run phase in cycles (feet plant)
  holdL={<Pot/>} holdR={...} holdUpright={true}   // props in hands; upright by default
  seed={7} visible shadow />
```
`CharacterSpec`: `skin, hair, hairStyle` (short|swoop|curly|bald|long|bun|ponytail|afro|pigtails|bob|buzz), `eye`, `top, topStyle`
(tee|sweater|shirt), `sleeves` (long|short), `bottom, bottomStyle` (pants|shorts|skirt), `shoes`, `height` (1 adult, 0.93 elder, 0.62 child),
`headScale` (1.0-1.1 adult, 1.25-1.35 child; bigger = cuter), `build`, `beard` (none|stubble|full), `moustache`, `glasses` (colour), `hat`
({kind: cap|beanie|turban|hardhat|chef, color}), `apron`, `scarf`, `blush`. `eyeHeight(spec, scale)` gives eye level for camera framing.

**Clips** (`CLIPS`): idle, talk, walk, run, wave, point, cheer, shock, shrug, think, laugh, clap, sit, carry, armsCrossed, handsOnHips, sad, bow, peek, flop.
`track(keys, frame)` returns `{clip, prevClip, blend, t, prevT}` and crossfades 8 frames by default (`blend` per key). Add your own clip by adding
a function to `CLIPS` returning a partial `Pose` (keys: root X/Y/Z/Yaw/Roll, spine Lean/Side/Twist, head Nod/Turn/Tilt, arm L/R Fwd/Out, elbow L/R, leg L/R Fwd/Out, knee L/R).
An idle layer (breathing, sway) is always under the clip.

**Faces** (`FACES`): neutral, happy, grin, laugh, shock, scream, sad, cry, angry, smug, worried, think, proud, sleepy, love. Parameters (`Face`): browY, browAngle,
eyeOpen, smile, mouthOpen, mouthWide, cheek, teeth, lookX, lookY. Blinks are automatic (`blinkAmount`). `faceTrack(keys, frame)` crossfades (default 5 frames).
Keep `eyeOpen` >= 0.9 for a likeable face; use 0.6-0.7 only for smug/sleepy beats.

**Lip-sync** (only when a character speaks in their own voice; narrator-over-picture shorts do not need it): `lipsync(words, frame, fps, windows?, who?)` returns
`{open, wide, energy}`; pass it as `speech`. Use `TalkWindow[]` ({who, from, to}) to say which character owns which frames.

## World (`World.tsx`)
Primitives: `RB` (rounded box), `Ball`, `Cyl`. Interiors: `Room`, `Window`, `Table`, `Chair`, `Sofa`, `Shelf`, `Lamp`, `Plant`, `Rug`, `Frame`, `Clock`, `Oven`,
`Smoke`, `Cake`, `Pie`, `Gift`. Party: `Balloon`, `BalloonCluster`, `Bunting`, `Confetti`, `LightShaft`. Outdoors: `Ground`, `Road`, `Tree`, `House`, `Cloud`,
`LampPost`, `Fence`, `Sun`. Materials in `gfx.ts`: `skinMat, clothMat, hairMat, propMat, matteMat, glowMat, glassMat, stubbleMat` (+ cached geometry helpers).
New prop = a component built from `RB/Ball/Cyl` with `castShadow` (the helpers already set it). Soft rounded edges are what make it look like a toy world.

## Overlays (2D, drawn over the 3D, `Overlays.tsx`)
`HookText lines={["He burned","[water.]"]}` (brackets = accent colour), `Stamp text at dur x y rot bg`, `Flash at={[frames]}`, `Punch hits={[{at, amt}]}` (wraps `<Stage>`),
`CaptionScrim`. Captions use the project's `src/captions/Captions` with `timings.words`.

## Timing (`timing.ts`)
`cue(words, "oven", {nth?, lead?=2, end?})` -> frame; `findWordIndex`; `totalFrames(words, tail=16)`. A missing word throws, so typos fail loudly.
Word timings: `npm run timings -- voice/<slug>.mp3` (real) or `python templates/tools/estimate_timings.py` (estimate); same JSON.

## Post (`Post.tsx`)
Own composer: RenderPass -> DepthOfField -> Bloom -> HueSaturation -> ToneMapping(neutral) -> Vignette. (Do not swap in `@react-three/postprocessing`'s `<EffectComposer>`: it renders blank under Remotion. See GOTCHAS.)
