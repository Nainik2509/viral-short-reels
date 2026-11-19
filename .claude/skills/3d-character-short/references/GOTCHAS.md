# Gotchas (each one was hit while building and testing this kit unless marked "not tested")

## Rendering
- **`@react-three/postprocessing`'s `<EffectComposer>` renders a blank canvas under Remotion** (even a lone `<ToneMapping/>`; verified in stills and video, with `angle` and `swangle`).
  The raw `postprocessing` library driven from our own `useFrame(..., 1)` works. That is `Post.tsx`; do not replace it. Remotion's `ThreeCanvas` steps R3F manually once per frame, after layout effects:
  mutate the camera/composer in `useLayoutEffect` (as `Stage`/`Post` do), not in `useFrame`.
- **Headless Chrome needs ANGLE for WebGL**: `Config.setChromiumOpenGlRenderer("angle")` in `remotion.config.ts` (`setup.sh` adds it). On the tested macOS arm64 headless Chrome `angle` and `swangle` both create a context; `--gl=swiftshader` fails inside the page when creating the WebGL context, so stay on `angle`.
- **Hooks in loops**: don't call `useMemo` inside `.map()` in a prop (lint + hook-order bugs); module-level cached geometry (`gfx.ts`) avoids it.
- **Everything must be a pure function of the frame.** A `Math.random()` in a prop makes every parallel render worker disagree and the video flickers. Use `hash()`/`rng()`.
- **Transparent materials** (smoke, glass wrap, stubble): set `depthWrite={false}` and a `renderOrder`; do not rely on DOF to blur them (they write no depth).
- **Held props rotate with the forearm** (smoke went sideways). `Character` keeps them upright by default (`holdUpright`); set `false` for a prop that should follow the hand.
- **Walls**: if the camera rises or tilts above the wall top you see the sky dome (a grey band). Make walls >= 4.5 m or add a ceiling.
- **Lamps**: a `pointLight` practical keeps a "tense" scene warm; scale it with the mood value.
- **Eyelids/skin sheen**: strong `sheen` on skin turns lid edges into white crescents; the kit uses low sheen (.22). Keep `eyeOpen` >= 0.9.
- **tsconfig**: the project has `noUnusedLocals/Parameters` on. The kit and templates pass it; keep it that way (`npm run typecheck`).

## Framing
- Portrait is narrow (see `LOOK_RECIPES.md` table). In the first draft of the demo the kid was outside the frame in most shots because the cast was ~2.6 m apart. Keep cast within +-0.7 m of centre at ~3 m.
- Faces cut by the frame edge, or hidden behind a prop near the lens (a pot in the hook shot covered the face), are the most common defects: always render and look.
- Hook text lives in the top safe zone: put the head lower in frame (aim `look` above it) so they do not collide.

## Speed, disk, memory
- Full 1080x1920 render with DOF + bloom: ~6.6 fps on Apple silicon (381 frames = 58 s). 60 s short = ~5 min. `--scale=0.5` (540x960) is ~6x faster: the same 381 frames took 9 s. Use it to review motion, cuts and timing, and `post={false}` on `<Stage>` for instant layout stills. Do the final render at scale 1.
- First still after a code change bundles (~40-50 s); later stills reuse the cache (~10-15 s).
- Every Remotion bundle copies `public/` into the temp folder. Set `TMPDIR` to a drive with space and clean old `remotion-webpack-bundle-*` folders when finished (ask the user before deleting).
- One character ~70 meshes; a set a few hundred; 160 confetti are one instanced mesh. Keep on-screen cast <= 4.

## Audio / assets
- Remotion's `<Audio>` carries voice/music/SFX in the render; mux nothing extra unless you mix offline. Keep SFX as `<Sequence from={cueFrame}>` so they follow the cues.
- No audio files are bundled in this skill. Use the project's `npm run voice`, `../../audio/`, `kahani-stories/sfx|music` (git-ignored) or royalty-free sources; check licences before publishing.

## GLB route (not tested in this kit)
For models the primitives cannot do (cars, animals, film-grade rigged humans): CC0/CC-BY packs (e.g. Kenney, Quaternius, KayKit - verify each licence)
as `.glb` in `public/models/`. Load with `useLoader(GLTFLoader, staticFile("models/x.glb"))` inside `<Stage>` (`ThreeCanvas` already delays rendering while it loads),
`SkeletonUtils.clone` for multiple instances, and drive animation deterministically: `mixer.setTime(frame / fps)` in a layout effect (never let the mixer run on its own clock).
Re-light with the same rigs; GLB materials usually need `emissiveIntensity` ~0.05 and roughness raised to look soft. The kit's `Character` is still the better choice for hero characters because
faces, expressions, lip-sync and hand props are all controllable per frame.

## Don't
- Don't copy a reference short's characters/scenes/script, or imply a real person. Don't add captions that cover faces. Don't add "subscribe" text.
- Don't render the full video before the storyboard is approved (project rule).
- Don't edit `remotion.config.ts`, install packages or delete bundles without asking.
