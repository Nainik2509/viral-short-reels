// Pose gallery: every clip at once, labelled, as a flat wall (long lens, no perspective overlap).
// Register as a composition (1080x1920, 90 frames) and render a still:  npx remotion still src/index.ts ClipLineup out/clips.png --frame=20
// Use it to choose clips, or to check a clip you just added to CLIPS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CLIP_NAMES, Character, FACES, RB, RIGS, Stage, walkPhaseFor, type CharacterSpec, type Shot } from "../../src/three";

const SPEC: CharacterSpec = { skin: "#f0b48c", hair: "#5b3a22", hairStyle: "swoop", top: "#5b9bd5", topStyle: "tee", sleeves: "short", bottom: "#46567a", shoes: "#6b4a30", height: 0.62, headScale: 1.2 };
const COLS = 4, ROWS = Math.ceil(CLIP_NAMES.length / COLS), DX = 1.25, DY = 1.55;
const CAM_Z = 22, FOV = 27, LOOK_Y = -((ROWS - 1) * DY) / 2 + 0.55;
const SHOTS: Shot[] = [{ from: 0, pos: [0, LOOK_Y, CAM_Z], look: [0, LOOK_Y, 0], fov: FOV, push: 0, blur: 0 }];
const FACE_FOR: Record<string, keyof typeof FACES> = { shock: "shock", laugh: "laugh", sad: "sad", cheer: "grin", think: "think", sleepy: "sleepy" };

const H = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360); // visible world height at z=0
const toScreen = (x: number, y: number) => ({ left: 540 + (x / ((H * 1080) / 1920 / 2)) * 540, top: 960 - ((y - LOOK_Y) / (H / 2)) * 960 });

export const ClipLineup: React.FC = () => {
  const frame = useCurrentFrame();
  const spot = (i: number) => ({ x: (i % COLS - (COLS - 1) / 2) * DX, y: -Math.floor(i / COLS) * DY });
  return (
    <AbsoluteFill style={{ background: "#222" }}>
      <Stage shots={SHOTS} total={90} rig={RIGS.noon} post={false} shadowSize={12}>
        {CLIP_NAMES.map((clip, i) => {
          const { x, y } = spot(i);
          return (
            <group key={clip}>
              <Character spec={SPEC} position={[x, y, 0]} anim={{ clip, t: 0.55 + frame / 30 }} shadow={false}
                gait={clip === "walk" || clip === "run" ? walkPhaseFor((0.25 + frame / 90) * 1.35, 0.62) : 0}
                face={FACES[FACE_FOR[clip] ?? "happy"]} seed={i + 1} />
              {clip === "sit" && <RB size={[0.34, 0.16, 0.3]} color="#d86a4a" p={[x, y + 0.2, -0.02]} />}
            </group>
          );
        })}
      </Stage>
      {CLIP_NAMES.map((clip, i) => {
        const { x, y } = spot(i);
        const p = toScreen(x, y - 0.12);
        return <div key={clip} style={{ position: "absolute", left: p.left, top: p.top, transform: "translateX(-50%)", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 26, fontWeight: 700, textShadow: "0 2px 4px #000" }}>{clip}</div>;
      })}
    </AbsoluteFill>
  );
};
