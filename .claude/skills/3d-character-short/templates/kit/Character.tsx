// Procedural 3D "soft vinyl toy" character, built from primitives and posed by pure functions of the frame.
// No GLB needed: head, face (eyes/lids/brows/mouth), hair styles, accessories, torso, arms, legs, shoes.
// Face the camera by yaw (0 = faces +z). Unit adult is ~1.8 m tall; scale kids ~0.6 with headScale ~1.3.
import React, { useMemo } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { blendPose, evalClip, type ClipName, type Pose } from "./pose";
import { blinkAmount, NEUTRAL_FACE, withSpeech, type Face } from "./face";
import { capG, capsuleG, clothMat, contactShadowMat, cylG, eyeWhiteMat, glintMat, glassMat, hairMat, irisMat, latheG, mouthInsideMat, planeG, propMat, pupilMat, rboxG, skinMat, sphereG, stubbleMat, teethMat, tongueMat, torusG } from "./gfx";
import { clamp, rng, shade, mixHex, type V3 } from "./util";

export type HairStyle = "short" | "swoop" | "curly" | "bald" | "long" | "bun" | "ponytail" | "afro" | "pigtails" | "bob" | "buzz";
export interface CharacterSpec {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  eye?: string;
  top: string;
  topStyle?: "tee" | "sweater" | "shirt";
  sleeves?: "long" | "short";
  bottom: string;
  bottomStyle?: "pants" | "shorts" | "skirt";
  shoes: string;
  /** overall size multiplier: 1 adult, ~0.62 child */
  height?: number;
  /** head size multiplier (cute = 1.05-1.15, kids 1.25-1.35) */
  headScale?: number;
  /** body width multiplier */
  build?: number;
  beard?: "none" | "stubble" | "full";
  moustache?: boolean;
  glasses?: string;
  hat?: { kind: "cap" | "beanie" | "turban" | "hardhat" | "chef"; color: string };
  apron?: string;
  scarf?: string;
  /** cheek blush colour */
  blush?: string;
}

export interface ClipState {
  clip: ClipName; prevClip?: ClipName; blend?: number; t?: number; prevT?: number;
}

export interface CharacterProps {
  spec: CharacterSpec;
  position?: V3;
  /** radians around y. 0 faces +z (toward a camera at +z). Positive turns toward +x. */
  yaw?: number;
  scale?: number;
  /** from `track()` in pose.ts */
  anim?: ClipState;
  /** walk/run phase in cycles; use walkPhaseFor(distance) */
  gait?: number;
  face?: Face;
  /** lip-sync result; mouth is replaced while speaking */
  speech?: { open: number; wide: number; energy?: number };
  /** world point to look at; head + eyes follow it */
  gaze?: V3;
  /** manual pose overrides added on top of the clip (e.g. {rootY: jumpHeight}) */
  poseAdd?: Partial<Pose>;
  seed?: number;
  /** anything rendered in the hands, e.g. a cake */
  holdL?: React.ReactNode;
  holdR?: React.ReactNode;
  /** keep held props world-upright whatever the arm does (pots, cups, candles). false = prop follows the hand. Default true. */
  holdUpright?: boolean;
  visible?: boolean;
  shadow?: boolean;
  children?: React.ReactNode;
}

// ───────────────────────── dimensions (unit adult, metres) ─────────────────────────
const SHIN = 0.4, THIGH = 0.4, SHOE_H = 0.07;
export const HIP_Y = SHOE_H + SHIN + THIGH - 0.02; // pelvis height
const TORSO_H = 0.52;
const UPPER_ARM = 0.3, FORE_ARM = 0.27;
const HEAD_R = 0.2;

/** World eye height for camera framing. */
export const eyeHeight = (spec: CharacterSpec, scale = 1) => (HIP_Y + TORSO_H + 0.06 + HEAD_R * (spec.headScale ?? 1) + 0.03) * (spec.height ?? 1) * scale;

// ───────────────────────── small mesh helpers ─────────────────────────
type SV = number | V3;
interface MProps { g: THREE.BufferGeometry; m: THREE.Material; p?: V3; s?: SV; r?: V3; shadow?: boolean; children?: React.ReactNode }
const M: React.FC<MProps> = ({ g, m, p, s, r, shadow = true, children }) => (
  <mesh geometry={g} material={m} position={p} scale={s as any} rotation={r} castShadow={shadow} receiveShadow={shadow}>{children}</mesh>
);

/** Capsule limb segment whose TOP is at the group origin and runs down (-y) `len` metres. */
const Limb: React.FC<{ r: number; len: number; m: THREE.Material; rBot?: number }> = ({ r, len, m }) => (
  <M g={capsuleG(r, len - 2 * r)} m={m} p={[0, -len / 2, 0]} />
);

// ───────────────────────── head ─────────────────────────
const Head: React.FC<{ spec: CharacterSpec; face: Face; blink: number; seed: number; lookX: number; lookY: number }> = ({ spec, face, blink, seed, lookX, lookY }) => {
  const skin = skinMat(spec.skin);
  const hair = hairMat(spec.hair);
  const lipCol = mixHex(spec.skin, "#b8434f", 0.55);
  const lipM = useMemo(() => propMat(lipCol, 0.45), [lipCol]);
  const noseM = skinMat(mixHex(spec.skin, "#e08a78", 0.18));
  const blushM = skinMat(mixHex(spec.skin, spec.blush ?? "#ff8f8a", 0.12 + face.cheek * 0.2));
  const eyeCol = spec.eye ?? "#5a3a24";

  const open = clamp(face.eyeOpen * (1 - blink), 0, 1.3);
  const lidTop = 0.95 - clamp(open, 0, 1.15) * 1.9; // rotation.x of the upper lid cap: closed 0.95 .. open -0.95
  const lidBot = 1.1 - face.cheek * 0.65 - (face.eyeOpen > 1 ? 0.2 : 0);
  const lx = clamp(face.lookX + lookX, -1, 1), ly = clamp(face.lookY + lookY, -1, 1);

  const eye = (side: -1 | 1) => (
    <group key={side} position={[0.2 * side, 0.07, 0.395]}>
      <M g={sphereG()} m={eyeWhiteMat()} s={[0.128, 0.142, 0.092]} shadow={false} />
      <group position={[lx * 0.045, ly * 0.045, 0.04]}>
        <M g={sphereG()} m={irisMat(eyeCol)} p={[0, 0, 0.012]} s={[0.083, 0.088, 0.05]} shadow={false} />
        <M g={sphereG()} m={pupilMat()} p={[0, 0, 0.034]} s={[0.04, 0.043, 0.03]} shadow={false} />
        <M g={sphereG()} m={glintMat()} p={[0.022, 0.028, 0.058]} s={[0.014, 0.014, 0.008]} shadow={false} />
        <M g={sphereG()} m={glintMat()} p={[-0.02, -0.024, 0.054]} s={[0.007, 0.007, 0.005]} shadow={false} />
      </group>
      {/* eyelids: upper cap rotates down to close, lower cap rises when smiling */}
      <group rotation={[lidTop, 0, 0]} scale={[0.139, 0.153, 0.1]}>
        <M g={capG(Math.PI * 0.56)} m={skin} shadow={false} />
      </group>
      {/* lower lid = the same cap flipped upside down (rotation.x = PI) and rotated up by lidBot */}
      <group rotation={[Math.PI, 0, 0]}>
        <group rotation={[lidBot, 0, 0]} scale={[0.138, 0.152, 0.099]}>
          <M g={capG(Math.PI * 0.5)} m={skin} shadow={false} />
        </group>
      </group>
    </group>
  );

  const brow = (side: -1 | 1) => {
    const y = 0.265 + face.browY * 0.055 - (1 - clamp(open, 0, 1)) * 0.02;
    const rot = side * -1 * face.browAngle * 0.5; // + angry lowers the inner end
    return (
      <group key={side} position={[0.195 * side, y, 0.425]} rotation={[-0.38, 0, rot]}>
        <M g={capsuleG(0.019, 0.1)} m={hair} r={[0, 0, Math.PI / 2]} s={[1, 1, 1.15]} shadow={false} />
      </group>
    );
  };

  // mouth: ONE outline. A circular lip arc (U for smiles/open mouths, flipped for frowns) hangs from a chord line.
  // When the jaw opens, the arc stretches down and a dark half-ellipsoid fills the space between chord and arc.
  const mo = clamp(face.mouthOpen, 0, 1);
  const sm = face.smile;
  const wHalf = 0.085 * face.mouthWide * (0.9 + clamp(Math.abs(sm), 0, 1) * 0.1);
  const flip = sm < -0.05 && mo < 0.12;
  const k = clamp(Math.max(Math.abs(sm), mo * 0.9, 0.1));
  const alpha = Math.PI * (0.5 + 0.34 * k);
  const R = wHalf / Math.sin(alpha / 2);
  const sag = R * (1 - Math.cos(alpha / 2));
  const drop = mo * 0.085;
  const sy = sag > 1e-3 ? (sag + drop) / sag : 1;
  const mouthZ = 0.452 + (spec.beard && spec.beard !== "none" ? 0.02 : 0);
  const openDepth = sag + drop;

  const mouth = (
    <group position={[0, -0.185, mouthZ]}>
      {mo > 0.04 && (
        <group>
          <M g={capG(Math.PI / 2, Math.PI / 2)} m={mouthInsideMat()} p={[0, 0, -0.012]} s={[wHalf * 0.98, openDepth * 1.0, 0.05]} shadow={false} />
          {face.teeth > 0.05 && <M g={rboxG(wHalf * 1.55, 0.03, 0.02, 0.01)} m={teethMat()} p={[0, -0.012 - face.teeth * 0.005, 0.004]} s={[1, 0.5 + face.teeth * 0.6, 1]} shadow={false} />}
          {mo > 0.3 && <M g={sphereG()} m={tongueMat()} p={[0, -openDepth * 0.72, 0.0]} s={[wHalf * 0.55, Math.min(0.03, openDepth * 0.3), 0.03]} shadow={false} />}
          <M g={capsuleG(0.009, wHalf * 2 - 0.018)} m={lipM} r={[0, 0, Math.PI / 2]} p={[0, 0.0, 0.004]} shadow={false} />
        </group>
      )}
      <group scale={[1, flip ? -1 : sy, 1]} position={[0, 0, 0.004]}>
        <group position={[0, (flip ? -1 : 1) * R * Math.cos(alpha / 2), 0]} rotation={[0, 0, (flip ? Math.PI / 2 : -Math.PI / 2) - alpha / 2]}>
          <M g={torusG(R, 0.0125, alpha)} m={lipM} shadow={false} />
        </group>
      </group>
    </group>
  );

  // cheeks lift with smile
  const ck = face.cheek;

  return (
    <group>
      <M g={sphereG()} m={skin} s={[0.5, 0.515, 0.49]} />
      <M g={sphereG()} m={skin} p={[0, -0.2, 0.06]} s={[0.41, 0.31, 0.39]} />
      {[-1, 1].map((sd) => (
        <group key={sd}>
          <M g={sphereG()} m={blushM} p={[0.29 * sd, -0.12 + ck * 0.03, 0.335]} s={[0.125 + ck * 0.02, 0.115 + ck * 0.025, 0.1]} />
          <M g={sphereG()} m={skin} p={[0.495 * sd, -0.03, -0.02]} s={[0.05, 0.105, 0.085]} />
        </group>
      ))}
      <M g={sphereG()} m={noseM} p={[0, -0.075, 0.478]} s={[0.07, 0.062, 0.062]} />
      {eye(-1)}{eye(1)}
      {brow(-1)}{brow(1)}
      {mouth}
      {spec.moustache && (
        <group position={[0, -0.138, 0.468]}>
          {[-1, 1].map((sd) => <M key={sd} g={capsuleG(0.022, 0.07)} m={hair} p={[0.05 * sd, 0, 0]} r={[0, 0, Math.PI / 2 + sd * -0.3]} s={[1, 1, 0.8]} shadow={false} />)}
        </group>
      )}
      {spec.beard && spec.beard !== "none" && <Beard color={spec.beard === "stubble" ? mixHex(spec.skin, spec.hair, 0.28) : spec.hair} full={spec.beard === "full"} mouthOpen={mo} />}
      <Hair spec={spec} seed={seed} />
      {spec.glasses && <Glasses color={spec.glasses} />}
      {spec.hat && <Hat hat={spec.hat} />}
    </group>
  );
};

const Beard: React.FC<{ color: string; full: boolean; mouthOpen: number }> = ({ color, full, mouthOpen }) => {
  const m = full ? hairMat(color) : stubbleMat(color);
  return (
    <group>
      {/* jaw shell around the lower face, with a hole left for the mouth by lowering it */}
      <group position={[0, -0.2, 0.06]} scale={[0.425, 0.325, 0.405]} rotation={[0.1, 0, 0]}>
        <M g={capG(Math.PI * (full ? 0.46 : 0.5), Math.PI * (full ? 0.52 : 0.46))} m={m} shadow={false} />
      </group>
      {full && <M g={sphereG()} m={m} p={[0, -0.38 - mouthOpen * 0.03, 0.22]} s={[0.19, 0.15, 0.16]} />}
    </group>
  );
};

const Glasses: React.FC<{ color: string }> = ({ color }) => {
  const m = propMat(color, 0.35);
  return (
    <group position={[0, 0.07, 0.455]}>
      {[-1, 1].map((sd) => (
        <group key={sd} position={[0.2 * sd, 0, 0]}>
          <M g={torusG(0.15, 0.011)} m={m} shadow={false} s={[1, 0.92, 1]} />
          <M g={sphereG()} m={glassMat("#dff0ff", 0.14)} s={[0.15, 0.14, 0.004]} shadow={false} />
          <M g={capsuleG(0.008, 0.46)} m={m} p={[0.15 * sd, 0, -0.23]} r={[Math.PI / 2, 0, 0]} shadow={false} />
        </group>
      ))}
      <M g={capsuleG(0.009, 0.09)} m={m} r={[0, 0, Math.PI / 2]} p={[0, 0.015, 0]} shadow={false} />
    </group>
  );
};

const Hat: React.FC<{ hat: NonNullable<CharacterSpec["hat"]> }> = ({ hat }) => {
  const m = propMat(hat.color, 0.6);
  const dark = propMat(shade(hat.color, -0.2), 0.6);
  switch (hat.kind) {
    case "cap":
      return (
        <group>
          <group position={[0, 0.03, -0.01]} rotation={[-0.2, 0, 0]} scale={0.545}><M g={capG(Math.PI * 0.5)} m={m} /></group>
          <M g={sphereG()} m={dark} p={[0, 0.16, 0.5]} s={[0.36, 0.035, 0.28]} r={[0.22, 0, 0]} />
        </group>
      );
    case "beanie":
      return (
        <group>
          <group position={[0, 0.02, -0.01]} rotation={[-0.15, 0, 0]} scale={0.552}><M g={capG(Math.PI * 0.62)} m={m} /></group>
          <M g={torusG(0.47, 0.06)} m={dark} p={[0, 0.2, -0.01]} r={[Math.PI / 2 - 0.15, 0, 0]} s={[1, 1, 1.0]} />
          <M g={sphereG()} m={dark} p={[0, 0.58, -0.08]} s={0.1} />
        </group>
      );
    case "hardhat":
      return (
        <group>
          <group position={[0, 0.06, -0.01]} scale={0.55}><M g={capG(Math.PI * 0.5)} m={m} /></group>
          <M g={cylG(0.58, 0.58, 0.03, 40)} m={m} p={[0, 0.105, 0.05]} s={[1, 1, 1.12]} />
          <M g={rboxG(0.12, 0.45, 0.07, 0.03)} m={dark} p={[0, 0.34, 0.0]} r={[0, 0, 0]} s={[1, 0.3, 4]} />
        </group>
      );
    case "chef":
      return (
        <group>
          <M g={cylG(0.5, 0.53, 0.24, 36)} m={m} p={[0, 0.44, -0.01]} />
          <M g={sphereG()} m={m} p={[0, 0.66, -0.01]} s={[0.58, 0.32, 0.58]} />
        </group>
      );
    case "turban":
    default:
      return (
        <group>
          <M g={sphereG()} m={m} p={[0, 0.1, -0.02]} s={[0.58, 0.52, 0.58]} />
          {[0, 1, 2].map((i) => <M key={i} g={torusG(0.5, 0.06)} m={i % 2 ? dark : m} p={[0, 0.15 + i * 0.07, 0.0]} r={[Math.PI / 2 - 0.12 + i * 0.07, 0, i * 0.5 - 0.5]} s={[1.1 - i * 0.06, 1.0, 1.0]} />)}
          <M g={sphereG()} m={m} p={[0.0, 0.43, 0.04]} s={[0.3, 0.2, 0.32]} />
        </group>
      );
  }
};

const Hair: React.FC<{ spec: CharacterSpec; seed: number }> = ({ spec, seed }) => {
  const hm = hairMat(spec.hair);
  const dark = hairMat(shade(spec.hair, -0.18));
  const light = hairMat(shade(spec.hair, 0.12));
  const style = spec.hairStyle;
  const items = useMemo(() => {
    const r = rng(seed + 11);
    const pts: { p: V3; s: number }[] = [];
    if (style === "curly") {
      for (let i = 0; i < 46; i++) {
        const th = r() * Math.PI * 0.55;
        const ph = r() * Math.PI * 2;
        const x = Math.sin(th) * Math.sin(ph), y = Math.cos(th), z = Math.sin(th) * Math.cos(ph);
        if (z > 0.15 && y < 0.7) continue;
        pts.push({ p: [x * 0.5, y * 0.5 + 0.02, z * 0.48 - 0.03], s: 0.12 + r() * 0.07 });
      }
    }
    return pts;
  }, [style, seed]);

  if (style === "bald") return null;
  // A tilted spherical cap: tilted back so the hairline sits high on the forehead and low at the nape.
  const baseCap = (len = 0.48, tilt = 0.55, sc = 0.535, m: THREE.Material = hm) => (
    <group position={[0, 0.02, -0.02]} rotation={[-tilt, 0, 0]} scale={sc}><M g={capG(Math.PI * len)} m={m} /></group>
  );

  switch (style) {
    case "buzz":
      return baseCap(0.44, 0.6, 0.512, hm);
    case "short":
      return (
        <group>
          {baseCap()}
          <M g={sphereG()} m={light} p={[0.04, 0.45, 0.13]} s={[0.24, 0.1, 0.18]} r={[0.45, 0, -0.1]} />
        </group>
      );
    case "swoop":
      return (
        <group>
          {baseCap()}
          <M g={sphereG()} m={light} p={[0.1, 0.45, 0.16]} s={[0.25, 0.1, 0.2]} r={[0.5, 0, -0.35]} />
          <M g={sphereG()} m={hm} p={[-0.08, 0.46, 0.02]} s={[0.24, 0.11, 0.26]} r={[0.2, 0, 0.25]} />
          <M g={sphereG()} m={dark} p={[0.0, 0.16, -0.4]} s={[0.4, 0.3, 0.16]} />
        </group>
      );
    case "curly":
      return (
        <group>
          {baseCap(0.48, 0.55, 0.525, dark)}
          {items.map((it, i) => <M key={i} g={sphereG()} m={i % 3 === 0 ? light : i % 3 === 1 ? hm : dark} p={it.p} s={it.s} />)}
        </group>
      );
    case "afro":
      return (
        <group>
          {baseCap(0.5, 0.5)}
          <M g={sphereG()} m={hm} p={[0, 0.2, -0.08]} s={[0.64, 0.6, 0.6]} />
        </group>
      );
    case "bun":
      return (
        <group>
          {baseCap()}
          <M g={sphereG()} m={hm} p={[0, 0.55, -0.2]} s={0.2} />
          <M g={torusG(0.19, 0.03)} m={dark} p={[0, 0.48, -0.17]} r={[1.2, 0, 0]} />
        </group>
      );
    case "ponytail":
      return (
        <group>
          {baseCap(0.52, 0.55)}
          <M g={sphereG()} m={dark} p={[0, 0.22, -0.46]} s={[0.1, 0.1, 0.1]} />
          <M g={capsuleG(0.1, 0.5)} m={hm} p={[0, -0.12, -0.58]} r={[0.25, 0, 0]} s={[1, 1, 0.9]} />
        </group>
      );
    case "pigtails":
      return (
        <group>
          {baseCap(0.52, 0.55)}
          {[-1, 1].map((sd) => (
            <group key={sd}>
              <M g={sphereG()} m={dark} p={[0.5 * sd, 0.18, -0.08]} s={0.07} />
              <M g={capsuleG(0.1, 0.4)} m={hm} p={[0.58 * sd, -0.1, -0.08]} r={[0, 0, -0.15 * sd]} />
            </group>
          ))}
        </group>
      );
    case "bob":
      return (
        <group>
          {baseCap(0.54, 0.55)}
          <M g={sphereG()} m={hm} p={[0, -0.03, -0.12]} s={[0.56, 0.5, 0.5]} />
          <M g={sphereG()} m={light} p={[0, 0.42, 0.12]} s={[0.4, 0.16, 0.25]} r={[0.5, 0, 0]} />
        </group>
      );
    case "long":
    default:
      return (
        <group>
          {baseCap(0.52, 0.55)}
          <M g={sphereG()} m={hm} p={[0, -0.32, -0.2]} s={[0.54, 0.62, 0.3]} />
          {[-1, 1].map((sd) => <M key={sd} g={capsuleG(0.07, 0.34)} m={hm} p={[0.43 * sd, -0.12, 0.1]} r={[0, 0, 0.08 * sd]} />)}
          <M g={sphereG()} m={light} p={[0.04, 0.44, 0.12]} s={[0.4, 0.15, 0.25]} r={[0.5, 0, -0.2]} />
        </group>
      );
  }
};

// ───────────────────────── arm / leg ─────────────────────────
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);
/** Rotation that cancels the arm chain (shoulder fwd/out, elbow) so a held prop stays world-upright. */
const uprightQuaternion = (fwd: number, out: number, elbow: number, side: -1 | 1) =>
  new THREE.Quaternion().setFromAxisAngle(AXIS_X, elbow)
    .multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_Z, -side * out))
    .multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_X, fwd));

const Arm: React.FC<{ spec: CharacterSpec; side: -1 | 1; fwd: number; out: number; elbow: number; build: number; hold?: React.ReactNode; upright?: boolean }> = ({ spec, side, fwd, out, elbow, build, hold, upright = true }) => {
  const sleeveLong = (spec.sleeves ?? "long") === "long";
  const top = clothMat(spec.top);
  const skin = skinMat(spec.skin);
  const cuff = clothMat(shade(spec.top, -0.1));
  return (
    <group position={[(0.215 * build + 0.025) * side, TORSO_H - 0.075, 0]} rotation={[-fwd, 0, side * out]}>
      <M g={sphereG()} m={top} s={0.062} />
      <Limb r={0.052} len={UPPER_ARM} m={top} />
      <group position={[0, -UPPER_ARM, 0]} rotation={[-elbow, 0, 0]}>
        <M g={sphereG()} m={sleeveLong ? top : skin} s={0.05} />
        <Limb r={0.045} len={FORE_ARM} m={sleeveLong ? top : skin} />
        {sleeveLong && <M g={torusG(0.047, 0.013)} m={cuff} p={[0, -FORE_ARM + 0.02, 0]} r={[Math.PI / 2, 0, 0]} />}
        <group position={[0, -FORE_ARM - 0.01, 0.005]}>
          <M g={sphereG()} m={skin} s={[0.056, 0.064, 0.05]} p={[0, -0.03, 0]} />
          <M g={sphereG()} m={skin} s={[0.022, 0.034, 0.024]} p={[0.034 * side, -0.02, 0.03]} r={[0.2, 0, 0.6 * side]} />
          {upright
            ? <group position={[0, -0.05, 0.035]} quaternion={uprightQuaternion(fwd, out, elbow, side)}>{hold}</group>
            : <group position={[0, -0.05, 0.035]} rotation={[0.3, 0, 0]}>{hold}</group>}
        </group>
      </group>
    </group>
  );
};

const Leg: React.FC<{ spec: CharacterSpec; side: -1 | 1; fwd: number; out: number; knee: number; build: number }> = ({ spec, side, fwd, out, knee, build }) => {
  const skin = skinMat(spec.skin);
  const bstyle = spec.bottomStyle ?? "pants";
  const pants = clothMat(spec.bottom);
  const thighM = bstyle === "pants" ? pants : skin;
  const shinM = bstyle === "pants" ? pants : skin;
  const shoe = propMat(spec.shoes, 0.5);
  const sole = propMat(shade(spec.shoes, 0.6), 0.7);
  return (
    <group position={[0.1 * build * side, -0.03, 0]} rotation={[-fwd, 0, side * out]}>
      <M g={sphereG()} m={pants} s={0.095 * build} />
      <Limb r={0.089 * build} len={THIGH} m={thighM} />
      {bstyle === "shorts" && <M g={capsuleG(0.1 * build, 0.2)} m={pants} p={[0, -0.15, 0]} />}
      <group position={[0, -THIGH, 0]} rotation={[knee, 0, 0]}>
        <M g={sphereG()} m={shinM} s={0.07 * build} />
        <Limb r={0.069 * build} len={SHIN} m={shinM} />
        <group position={[0, -SHIN, 0.0]}>
          <M g={sphereG()} m={shoe} p={[0, 0.045, 0.065]} s={[0.083, 0.066, 0.145]} />
          <M g={sphereG()} m={sole} p={[0, 0.0, 0.068]} s={[0.082, 0.02, 0.14]} />
        </group>
      </group>
    </group>
  );
};

const Torso: React.FC<{ spec: CharacterSpec; build: number }> = ({ spec, build }) => {
  const top = clothMat(spec.top);
  const trim = clothMat(shade(spec.top, -0.12));
  const profile = useMemo<[number, number][]>(() => [[0.001, -0.075], [0.125, -0.065], [0.163, -0.01], [0.172, 0.06], [0.166, 0.2], [0.18, 0.33], [0.2, 0.43], [0.17, 0.49], [0.085, 0.53], [0.001, 0.54]], []);
  const sweater = (spec.topStyle ?? "tee") === "sweater";
  return (
    <group>
      <group scale={[1.12 * build, 1, 0.78 * build]}><M g={latheG("torso", profile)} m={top} /></group>
      {sweater && <group scale={[1.12 * build, 1, 0.78 * build]}><M g={torusG(0.158, 0.026)} m={trim} p={[0, 0.018, 0]} r={[Math.PI / 2, 0, 0]} /></group>}
      {sweater && <M g={torusG(0.082, 0.026)} m={trim} p={[0, TORSO_H + 0.0, 0]} r={[Math.PI / 2, 0, 0]} s={[1.0, 1, 1.0]} />}
      <M g={cylG(0.055, 0.062, 0.12, 20)} m={skinMat(spec.skin)} p={[0, TORSO_H + 0.03, 0]} />
      {spec.scarf && <M g={torusG(0.085, 0.04)} m={clothMat(spec.scarf)} p={[0, TORSO_H + 0.005, 0.0]} r={[Math.PI / 2 - 0.15, 0, 0]} />}
      {spec.apron && (
        <group position={[0, 0.27, 0.172 * build]}>
          <M g={rboxG(0.3 * build, 0.5, 0.025, 0.012)} m={clothMat(spec.apron)} />
          <M g={rboxG(0.12, 0.1, 0.02, 0.01)} m={clothMat(shade(spec.apron, -0.1))} p={[0, -0.08, 0.016]} />
          
        </group>
      )}
    </group>
  );
};

// ───────────────────────── the character ─────────────────────────
const wrapPi = (a: number) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

/**
 * Head + eye angles that make a character look at a world point.
 * The head takes ~65 % of the horizontal turn (max 1 rad); the eyes take the rest. Eye values are -1..1 pupil offsets.
 */
const aimAt = (eye: V3, target: V3, facingYaw: number) => {
  const dx = target[0] - eye[0], dy = target[1] - eye[1], dz = target[2] - eye[2];
  const want = wrapPi(Math.atan2(dx, dz) - facingYaw);
  const pitch = Math.atan2(dy, Math.hypot(dx, dz));
  const headTurn = clamp(want * 0.65, -1, 1);
  return {
    headTurn,
    headNod: clamp(-pitch * 0.6, -0.5, 0.5),
    eyeX: clamp((want - headTurn) / 0.55, -1, 1),
    eyeY: clamp(pitch / 0.5, -1, 1) * 0.6,
  };
};

export const Character: React.FC<CharacterProps> = ({
  spec, position = [0, 0, 0], yaw = 0, scale = 1, anim, gait = 0, face, speech, gaze, poseAdd, seed = 1, holdL, holdR, holdUpright = true, visible = true, shadow = true, children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = (spec.height ?? 1) * scale;
  const hs = spec.headScale ?? 1;
  const build = spec.build ?? 1;

  const a = anim ?? { clip: "idle" as ClipName, t: frame / fps };
  const ctx = { gait, energy: speech?.energy ?? 0, seed };
  const cur = evalClip(a.clip, { ...ctx, t: a.t ?? frame / fps });
  let pose: Pose = cur;
  if (a.prevClip && (a.blend ?? 1) < 1) pose = blendPose(evalClip(a.prevClip, { ...ctx, t: a.prevT ?? a.t ?? frame / fps }), cur, a.blend ?? 1);
  if (poseAdd) { pose = { ...pose }; for (const key of Object.keys(poseAdd) as (keyof Pose)[]) pose[key] = pose[key] + (poseAdd[key] ?? 0); }

  // gaze: turn head+eyes toward a world point
  const aim = gaze ? aimAt([position[0], position[1] + eyeHeight(spec, scale), position[2]], gaze, yaw + pose.rootYaw) : null;
  const headTurn = pose.headTurn + (aim?.headTurn ?? 0);
  const headNod = pose.headNod + (aim?.headNod ?? 0);

  const f = speech ? withSpeech(face ?? NEUTRAL_FACE, speech) : face ?? NEUTRAL_FACE;
  const blink = blinkAmount(frame, seed);

  const hipY = HIP_Y + pose.rootY;
  const headY = TORSO_H + 0.055 + HEAD_R * hs;
  const bs = spec.bottomStyle ?? "pants";

  return (
    <group visible={visible} position={position} rotation={[0, yaw, 0]} scale={k}>
      {shadow && (
        <mesh geometry={planeG()} material={contactShadowMat()} position={[pose.rootX, 0.006, pose.rootZ + 0.03]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.85, 0.7, 1]} renderOrder={-1} />
      )}
      <group position={[pose.rootX, hipY, pose.rootZ]} rotation={[0, pose.rootYaw, pose.rootRoll]}>
        <M g={sphereG()} m={clothMat(spec.bottom)} s={[0.15 * build, 0.1, 0.115 * build]} p={[0, -0.07, 0]} />
        {bs === "skirt" && <M g={cylG(0.17 * build, 0.34 * build, 0.42, 40)} m={clothMat(spec.bottom)} p={[0, -0.2, 0]} s={[1.12, 1, 0.9]} />}
        <Leg spec={spec} side={-1} fwd={pose.legRFwd} out={pose.legROut} knee={pose.kneeR} build={build} />
        <Leg spec={spec} side={1} fwd={pose.legLFwd} out={pose.legLOut} knee={pose.kneeL} build={build} />
        <group rotation={[pose.spineLean, pose.spineTwist, pose.spineSide]}>
          <Torso spec={spec} build={build} />
          <Arm spec={spec} side={-1} fwd={pose.armRFwd} out={pose.armROut} elbow={pose.elbowR} build={build} hold={holdR} upright={holdUpright} />
          <Arm spec={spec} side={1} fwd={pose.armLFwd} out={pose.armLOut} elbow={pose.elbowL} build={build} hold={holdL} upright={holdUpright} />
          <group position={[0, headY, 0.0]} rotation={[headNod, headTurn, pose.headTilt]} scale={HEAD_R * 2 * hs}>
            <Head spec={spec} face={f} blink={blink} seed={seed} lookX={aim?.eyeX ?? 0} lookY={aim?.eyeY ?? 0} />
          </group>
        </group>
      </group>
      {children}
    </group>
  );
};

