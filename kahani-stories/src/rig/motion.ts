import { deg, hash, lerp, smooth, TAU } from "../lib/math";
import { GEO, LEG_SWING } from "./geometry";
import type { MotionState } from "./types";

export interface MotionInput {
  /** Seconds since the clip started (drives blink, breathing, wave). */
  time: number;
  /** 0 = standing, 1 = full walk. */
  walk: number;
  /** Walk phase in cycles (1 cycle = two steps). */
  walkPhase: number;
  /** 0 = arms down, 1 = arm raised. */
  wave: number;
  /** "wave" swings the forearm, "bless" holds the palm still (for deities). */
  waveStyle: "wave" | "bless";
  blink: boolean;
  breathe: boolean;
  seed: number;
}

const KNEE_BEND = deg(50);
const ARM_SWING = deg(24);
const ELBOW_BEND = deg(24);

const legAt = (phase: number, w: number) => {
  const swing = LEG_SWING * w * Math.sin(phase);
  const lift = Math.max(0, Math.cos(phase));
  const bend = KNEE_BEND * w * lift * lift + deg(2) * w;
  // Thigh rotates by -swing, shin by +bend (see Leg.tsx).
  const thighRot = -swing;
  const reach =
    GEO.thigh * Math.cos(thighRot) + GEO.shin * Math.cos(thighRot + bend);
  // Foot: heel-strike toe up, push-off toe down, roughly flat in between.
  const foot = 0.55 * swing - bend;
  return { swing, bend, foot, reach };
};

const blinkAmount = (time: number, seed: number) => {
  const period = 3.1 + hash(seed) * 1.7;
  const t = (time + hash(seed + 7) * period) % period;
  const d = 0.2;
  if (t > d) return 0;
  const x = t / d;
  return 1 - Math.abs(2 * x - 1);
};

export const computeMotion = (m: MotionInput): MotionState => {
  const w = smooth(m.walk);
  const phase = m.walkPhase * TAU;

  const nearLeg = legAt(phase, w);
  const farLeg = legAt(phase + Math.PI, w);

  // Opposite arm swings with the opposite leg.
  const armPhaseNear = phase + Math.PI;
  const armPhaseFar = phase;
  const idleSway = (1 - w) * deg(2) * Math.sin(TAU * 0.28 * m.time + m.seed);

  const armFrom = (p: number, extra: number) => {
    const swing = ARM_SWING * w * Math.sin(p) + extra;
    const bend = deg(10) + ELBOW_BEND * w * Math.max(0, Math.sin(p));
    return { swing, bend };
  };

  const nearArm = armFrom(armPhaseNear, idleSway);
  const farArm = armFrom(armPhaseFar, -idleSway);

  const waveW = smooth(m.wave);
  if (waveW > 0) {
    // "wave": arm reaches out and up, hand swings side to side (clear of the face).
    // "bless": upper arm forward, forearm up, palm held still at shoulder height.
    const wave = m.waveStyle === "wave";
    const raised = wave ? deg(118) : deg(88);
    nearArm.swing = lerp(nearArm.swing, raised, waveW);
    const oscillation = wave ? deg(26) * Math.sin(TAU * 2.2 * m.time) : 0;
    const base = wave ? deg(16) : deg(82);
    nearArm.bend = lerp(nearArm.bend, base + oscillation, waveW);
  }

  const breatheOsc = m.breathe ? Math.sin(TAU * 0.28 * m.time + m.seed) : 0;
  const hipHeight = Math.max(nearLeg.reach, farLeg.reach) + GEO.ankle;

  return {
    nearLeg,
    farLeg,
    nearArm,
    farArm,
    hipHeight,
    lean: deg(2.5) * w,
    headTilt: deg(1.2) * Math.sin(phase * 2 + 1) * w - deg(1.5) * waveW,
    blink: m.blink ? blinkAmount(m.time, m.seed) : 0,
    breatheScale: 1 + 0.012 * breatheOsc,
    breatheLift: 1.6 * breatheOsc,
    walk: w,
    wave: waveW,
    clothPhase: TAU * (0.9 + 1.4 * w) * m.time + m.seed,
  };
};
