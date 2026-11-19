import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import {
  Character, Cyl, Flash, HookText, Punch, Smoke, Stage, Stamp, evalCamera, faceTrack, lightTrack, ramp, totalFrames, track,
  type CharacterSpec, type WordTiming,
} from "../../src/three";
import { Captions, SafeZoneGuide } from "../../src/captions";
import timings from "./timings.json";
import { Kitchen } from "./Kitchen";
import { DAD_POS, KID_POS, OVEN_SMOKE, buildCues, buildKicks, buildLight, buildShots } from "./shots";

/**
 * TEMPLATE 3D STORY ("The Pie")  -  copy this folder to stories/<slug>/ and replace the script, set, cast and shots.
 * Everything is a pure function of the frame. Timing comes ONLY from words in timings.json via buildCues().
 */
const words = timings.words as WordTiming[];
export const TEMPLATE3D_FRAMES = totalFrames(words);

// ── cast: `height` 1 = adult, ~0.62 = child; `headScale` > 1 = cuter/younger ──
const DAD: CharacterSpec = { skin: "#f0b48c", hair: "#5b3a22", hairStyle: "swoop", top: "#e9d9b8", topStyle: "sweater", sleeves: "long", bottom: "#46567a", shoes: "#6b4a30", beard: "stubble", apron: "#f2c94c", hat: { kind: "chef", color: "#ffffff" }, build: 1.05, headScale: 1.05 };
const KID: CharacterSpec = { skin: "#c68b64", hair: "#2a1a14", hairStyle: "pigtails", top: "#e8566a", topStyle: "tee", sleeves: "short", bottom: "#f2c14e", bottomStyle: "skirt", shoes: "#ffffff", height: 0.64, headScale: 1.3, eye: "#3a2410" };

const Pot: React.FC = () => (
  <group>
    <Cyl rTop={0.12} rBot={0.1} h={0.14} color="#b9bcc4" p={[0, 0.0, 0]} rough={0.25} />
    <Cyl rTop={0.12} rBot={0.12} h={0.01} color="#2a2a2e" p={[0, 0.07, 0]} />
    <Smoke p={[0, 0.1, 0]} amount={0.38} count={10} rise={0.5} color="#5f5b6b" opacity={0.7} />
  </group>
);

export const Story: React.FC<{ showSafeZone?: boolean; voice?: string }> = ({ showSafeZone = false, voice }) => {
  const frame = useCurrentFrame();
  const c = useMemo(() => buildCues(words), []);
  const shots = useMemo(() => buildShots(c), [c]);
  const kicks = useMemo(() => buildKicks(c), [c]);
  const lightKeys = useMemo(() => buildLight(c), [c]);
  const total = TEMPLATE3D_FRAMES;

  const rig = lightTrack(lightKeys, frame);
  // Derived mood value (0 calm .. 1 tense) so practical lights in the set follow the same beat as the light rig.
  const tension = ramp(frame, c.wait, c.wait + 6) - ramp(frame, c.lucky, c.lucky + 16);
  const cam = evalCamera(shots, kicks, frame, total); // used here only so characters can look into the lens

  // ── DAD ──
  const dadAnim = track([
    { at: 0, clip: "carry" }, { at: c.yes, clip: "carry" }, { at: c.today, clip: "talk" }, { at: c.step1, clip: "handsOnHips" },
    { at: c.step2, clip: "talk" }, { at: c.wait, clip: "shock" }, { at: c.youSee, clip: "shrug" }, { at: c.lucky, clip: "talk" }, { at: c.anyway, clip: "laugh" },
  ], frame);
  const dadFace = faceTrack([
    { at: 0, face: "smug" }, { at: c.today, face: "happy" }, { at: c.step1, face: "grin" }, { at: c.step2, face: "grin" },
    { at: c.wait, face: "shock", blend: 3 }, { at: c.youSee, face: "worried" }, { at: c.lucky, face: "happy" }, { at: c.anyway, face: "laugh" },
  ], frame);
  // ── KID ──
  const kidAnim = track([
    { at: 0, clip: "idle" }, { at: c.step2, clip: "think" }, { at: c.wait, clip: "shock" }, { at: c.youSee, clip: "idle" }, { at: c.lucky, clip: "cheer" }, { at: c.anyway, clip: "clap" },
  ], frame);
  const kidFace = faceTrack([
    { at: 0, face: "neutral" }, { at: c.step2, face: "worried" }, { at: c.wait, face: "shock", blend: 3 }, { at: c.youSee, face: "smug" }, { at: c.lucky, face: "love" }, { at: c.anyway, face: "laugh" },
  ], frame);

  // Characters look into the lens in the hook/close-up shots and in the payoff; otherwise at each other.
  const shotId = shots[cam.shotIndex].id;
  const lookAtCam = shotId === "hook" || shotId === "yes" || shotId === "wrap" || shotId === "payoff";

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1220" }}>
      <Punch hits={[{ at: c.yes, amt: 0.05 }, { at: c.wait, amt: 0.08 }, { at: c.anyway, amt: 0.05 }]}>
        <Stage shots={shots} kicks={kicks} total={total} rig={rig} vignette={0.45}>
          <Kitchen ovenHot={frame >= c.wait - 20 ? 1 : 0} ovenSmoke={frame >= c.wait ? 1.1 : 0} wrapped={frame >= c.youSee - 6 || frame < 1} party={frame >= c.today} tension={tension} />
          <Character spec={DAD} position={DAD_POS} yaw={0.3} anim={dadAnim} face={dadFace} seed={2} gaze={lookAtCam ? cam.pos : [KID_POS[0], 1.2, KID_POS[2]]} holdR={frame < c.today ? <Pot /> : undefined} />
          <Character spec={KID} position={KID_POS} yaw={-0.4} anim={kidAnim} face={kidFace} seed={7} gaze={shotId === "kidshock" || shotId === "oven" ? OVEN_SMOKE : cam.pos} />
        </Stage>
      </Punch>

      <HookText lines={["He burned", "[water.]"]} from={2} to={c.yes - 4} />
      <Stamp text="STEP 1" at={c.step1 + 4} dur={36} x={300} y={640} rot={-7} />
      <Stamp text="STEP 2" at={c.step2 + 4} dur={40} x={780} y={640} rot={6} bg="#ff8a5c" />
      <Stamp text="10/10" at={c.anyway} dur={80} y={620} rot={-5} bg="#7be08a" />
      <Flash at={[c.today, c.wait, c.lucky]} len={5} />

      <Captions words={words} highlight={["water", "sugar", "smoking", "plastic", "pie"]} />
      {voice && <Audio src={staticFile(voice)} />}
      {showSafeZone && <SafeZoneGuide />}
    </AbsoluteFill>
  );
};
