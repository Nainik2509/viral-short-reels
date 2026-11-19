// Pose + animation clips for the procedural character. Every clip is a pure function of time.
//
// Conventions (character faces +z, y is up; the character's LEFT side is +x, which is screen-right
// when the camera is in front of it):
//   armFwd  : radians the arm is raised forward   (+ forward, - backward)
//   armOut  : radians the arm is lifted sideways   (+ away from the body)
//   elbow   : forearm bend, 0 = straight, ~2.4 = hand at shoulder
//   legFwd  : thigh swing forward (+), knee: shin bend backward (0..2.4)
//   headNod : + looks down, - looks up;  headTurn: + turns to the character's left (+x)
//   spineLean: + leans forward;          rootY: body drop (crouch/sit) or lift (jump), in unit-adult metres
import { clamp, lerp, TAU } from "./util";

export const POSE_KEYS = [
  "rootX", "rootY", "rootZ", "rootYaw", "rootRoll",
  "spineLean", "spineSide", "spineTwist",
  "headNod", "headTurn", "headTilt",
  "armLFwd", "armLOut", "armRFwd", "armROut", "elbowL", "elbowR",
  "legLFwd", "legLOut", "legRFwd", "legROut", "kneeL", "kneeR",
] as const;
export type PoseKey = (typeof POSE_KEYS)[number];
export type Pose = Record<PoseKey, number>;

export const BASE_POSE: Pose = Object.fromEntries(POSE_KEYS.map((k) => [k, 0])) as Pose;

export const mkPose = (p: Partial<Pose> = {}): Pose => ({ ...BASE_POSE, ...p });

export const blendPose = (a: Pose, b: Pose, t: number): Pose => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const out = { ...a };
  for (const k of POSE_KEYS) out[k] = lerp(a[k], b[k], t);
  return out;
};

export interface ClipCtx {
  /** seconds since the clip started */
  t: number;
  /** walk/run cycle phase in CYCLES (use walkPhaseFor so feet do not slide) */
  gait: number;
  /** 0..1 how hard the character is talking right now (drives gestures) */
  energy: number;
  /** stable per-character seed so a crowd does not move in lock-step */
  seed: number;
}

export type ClipFn = (c: ClipCtx) => Partial<Pose>;

const s = Math.sin;
const c = Math.cos;
const pos = (x: number) => Math.max(0, x);

/** Resting breathing + weight shift, layered under every clip. */
export const idleLayer = (t: number, seed: number): Partial<Pose> => ({
  spineLean: 0.015 + s(t * 1.9 + seed) * 0.012,
  headNod: s(t * 0.9 + seed * 2) * 0.03,
  headTurn: s(t * 0.55 + seed * 3) * 0.05,
  rootX: s(t * 0.6 + seed) * 0.012,
  armLOut: 0.1 + s(t * 1.9 + seed) * 0.015,
  armROut: 0.1 + s(t * 1.9 + seed + 1) * 0.015,
  elbowL: 0.14,
  elbowR: 0.14,
  kneeL: 0.02,
  kneeR: 0.02,
});

export const CLIPS = {
  idle: () => ({}),

  /** Standing and talking: hands gesture with the voice. */
  talk: ({ t, energy, seed }) => {
    const e = 0.25 + energy * 0.75;
    return {
      armRFwd: 0.45 + s(t * 3.1 + seed) * 0.35 * e + pos(s(t * 1.3)) * 0.4 * e,
      armROut: 0.22 + s(t * 2.3) * 0.12,
      elbowR: 1.15 + s(t * 3.7 + seed) * 0.45 * e,
      armLFwd: 0.2 + s(t * 2.7 + 1.3 + seed) * 0.28 * e,
      armLOut: 0.2,
      elbowL: 0.9 + s(t * 3.3 + seed) * 0.35 * e,
      headNod: s(t * 5.2 + seed) * 0.05 * e,
      headTurn: s(t * 1.1 + seed) * 0.09,
      spineLean: 0.03 + s(t * 2.2) * 0.02,
    };
  },

  walk: ({ gait, seed }) => {
    const p = gait * TAU;
    const sw = s(p);
    return {
      legLFwd: sw * 0.62, legRFwd: -sw * 0.62,
      kneeL: pos(s(p - 1.0)) * 1.05 + 0.04, kneeR: pos(s(p + Math.PI - 1.0)) * 1.05 + 0.04,
      armLFwd: -sw * 0.5, armRFwd: sw * 0.5,
      elbowL: 0.35 + pos(sw) * 0.3, elbowR: 0.35 + pos(-sw) * 0.3,
      armLOut: 0.08, armROut: 0.08,
      rootY: -Math.abs(c(p)) * 0.035 + 0.01,
      rootRoll: s(p) * 0.025,
      spineLean: 0.07, spineTwist: sw * 0.12,
      headNod: -0.02 + c(p * 2) * 0.012,
      headTurn: sw * -0.05 + s(seed) * 0.02,
    };
  },

  run: ({ gait }) => {
    const p = gait * TAU;
    const sw = s(p);
    return {
      legLFwd: sw * 1.0, legRFwd: -sw * 1.0,
      kneeL: pos(s(p - 1.2)) * 1.7 + 0.15, kneeR: pos(s(p + Math.PI - 1.2)) * 1.7 + 0.15,
      armLFwd: -sw * 0.95, armRFwd: sw * 0.95,
      elbowL: 1.35, elbowR: 1.35,
      armLOut: 0.12, armROut: 0.12,
      rootY: Math.abs(s(p)) * 0.07 - 0.02,
      spineLean: 0.28, spineTwist: sw * 0.2,
      headNod: -0.15,
    };
  },

  wave: ({ t }) => ({
    armROut: 2.15 + s(t * 2) * 0.05, armRFwd: 0.2,
    elbowR: 0.55 + s(t * 11) * 0.38,
    headTilt: -0.1, headTurn: 0.1,
    spineLean: 0, armLOut: 0.12,
  }),

  point: ({ t }) => ({
    armRFwd: 1.5, armROut: 0.25, elbowR: 0.08 + s(t * 6) * 0.03,
    spineLean: 0.06, headNod: -0.04, headTurn: -0.12,
    armLOut: 0.12, elbowL: 0.4, armLFwd: 0.2,
  }),

  cheer: ({ t }) => {
    const j = Math.abs(s(t * 6));
    return {
      armLFwd: 2.6, armRFwd: 2.6, armLOut: 0.5, armROut: 0.5, elbowL: 0.35, elbowR: 0.35,
      rootY: j * 0.16, kneeL: (1 - j) * 0.5, kneeR: (1 - j) * 0.5,
      legLFwd: -(1 - j) * 0.2, legRFwd: -(1 - j) * 0.2,
      headNod: -0.22, spineLean: -0.08,
    };
  },

  /** Startled: lean back, hands up, little hop. */
  shock: ({ t }) => {
    const k = Math.min(1, t / 0.12);
    return {
      spineLean: -0.22 * k, headNod: -0.18 * k,
      armLFwd: 0.5 * k, armRFwd: 0.5 * k, armLOut: 0.65 * k, armROut: 0.65 * k, elbowL: 1.0 * k, elbowR: 1.0 * k,
      rootY: Math.max(0, s(Math.min(t, 0.3) * 10.5)) * 0.12, rootZ: -0.04 * k,
      legLFwd: 0.1 * k, legRFwd: -0.08 * k, kneeL: 0.2 * k, kneeR: 0.35 * k,
    };
  },

  shrug: ({ t }) => {
    const k = Math.min(1, t / 0.18);
    return { armLOut: 0.55 * k + 0.1, armROut: 0.55 * k + 0.1, elbowL: 1.5 * k, elbowR: 1.5 * k, armLFwd: 0.35 * k, armRFwd: 0.35 * k, headTilt: 0.16 * k, rootY: 0.02 * k };
  },

  /** Hand on chin. */
  think: ({ t }) => ({
    armRFwd: 0.95, armROut: -0.05, elbowR: 2.25,
    armLFwd: 0.8, armLOut: -0.1, elbowL: 1.5,
    headTilt: 0.13, headNod: 0.05 + s(t * 0.8) * 0.03, headTurn: -0.12, spineLean: 0.05,
  }),

  laugh: ({ t }) => {
    const b = s(t * 17);
    return {
      spineLean: -0.2 + b * 0.04, headNod: -0.3 + b * 0.05, rootY: Math.abs(b) * 0.035,
      armLFwd: 0.9, armRFwd: 0.9, armLOut: -0.05, armROut: -0.05, elbowL: 1.9, elbowR: 1.9,
      kneeL: 0.12, kneeR: 0.12,
    };
  },

  clap: ({ t }) => {
    const o = 0.5 + 0.5 * s(t * 14);
    return { armLFwd: 1.1, armRFwd: 1.1, armLOut: -0.05 - o * 0.28, armROut: -0.05 - o * 0.28, elbowL: 1.65, elbowR: 1.65, headNod: -0.05, rootY: Math.abs(s(t * 7)) * 0.015 };
  },

  /** Seated; put the character on a chair at the right height (seat ~0.46 m for an adult). */
  sit: ({ t }) => ({
    rootY: -0.4, rootZ: -0.02,
    legLFwd: 1.5, legRFwd: 1.5, kneeL: 1.5, kneeR: 1.5, legLOut: 0.08, legROut: 0.08,
    armLFwd: 0.45, armRFwd: 0.45, armLOut: 0.12, armROut: 0.12, elbowL: 1.1, elbowR: 1.1,
    spineLean: 0.03 + s(t * 1.7) * 0.01,
  }),

  /** Both hands forward as if carrying a tray/cake/baby. Put the prop in holdL/holdR or between. */
  carry: ({ t }) => ({
    armLFwd: 0.95, armRFwd: 0.95, armLOut: -0.18, armROut: -0.18, elbowL: 1.5, elbowR: 1.5,
    spineLean: -0.03, headNod: 0.12, rootY: s(t * 2) * 0.004,
  }),

  armsCrossed: ({ t }) => ({
    armLFwd: 0.85, armRFwd: 0.85, armLOut: -0.4, armROut: -0.4, elbowL: 2.3, elbowR: 2.3,
    headTurn: s(t * 0.4) * 0.08, headTilt: 0.05, spineLean: -0.02,
  }),

  handsOnHips: () => ({
    armLOut: 0.62, armROut: 0.62, elbowL: 1.65, elbowR: 1.65, armLFwd: -0.15, armRFwd: -0.15, headNod: -0.04, spineLean: -0.02,
  }),

  sad: ({ t }) => ({
    spineLean: 0.16, headNod: 0.32 + s(t * 0.7) * 0.02, armLOut: 0.06, armROut: 0.06, armLFwd: 0.08, armRFwd: 0.08, elbowL: 0.2, elbowR: 0.2, rootY: -0.015,
  }),

  bow: ({ t }) => {
    const b = Math.sin(clamp(t / 1.2) * Math.PI);
    return { spineLean: b * 0.9, headNod: b * 0.2, armLFwd: b * 0.3, armRFwd: b * 0.3 };
  },

  /** Lean in and whisper / peek. */
  peek: ({ t }) => ({ spineLean: 0.28, headNod: 0.05, headTilt: 0.18, armLOut: 0.15, armROut: 0.15, rootZ: 0.04 + s(t * 2) * 0.004 }),

  /** Flat on the back / knocked over: use with rootRoll via your own override if you need more. */
  flop: ({ t }) => {
    const k = Math.min(1, t / 0.25);
    return { spineLean: -0.55 * k, headNod: -0.4 * k, armLOut: 1.2 * k, armROut: 1.2 * k, armLFwd: 0.4 * k, armRFwd: 0.4 * k, rootY: -0.1 * k, kneeL: 0.3 * k, kneeR: 0.1 * k };
  },
} satisfies Record<string, ClipFn>;

export type ClipName = keyof typeof CLIPS;
export const CLIP_NAMES = Object.keys(CLIPS) as ClipName[];

/** Evaluate one clip into a full Pose (idle layer underneath so nothing is ever frozen). */
export const evalClip = (name: ClipName, ctx: ClipCtx): Pose => {
  const base = mkPose(idleLayer(ctx.t, ctx.seed));
  const over = (CLIPS[name] as ClipFn)(ctx);
  const out = { ...base };
  for (const k of Object.keys(over) as PoseKey[]) out[k] = over[k] as number;
  return out;
};

/** Cycles of walk/run for a distance travelled, so feet plant instead of skating. One cycle = two steps. */
export const walkPhaseFor = (distance: number, scale = 1, run = false) => distance / ((run ? 2.4 : 1.35) * scale);

/**
 * Timeline helper: `track([{at:0,clip:"idle"},{at:60,clip:"point"}], frame)` returns the current clip,
 * the previous clip, the crossfade amount and the time inside the clip. Use it for every character.
 */
export interface ClipKey { at: number; clip: ClipName; /** crossfade frames (default 8) */ blend?: number }
export const track = (keys: ClipKey[], frame: number, fps = 30) => {
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (frame >= keys[k].at) i = k;
  const cur = keys[i];
  const prev = keys[Math.max(0, i - 1)];
  const bl = cur.blend ?? 8;
  const blend = i === 0 ? 1 : clamp((frame - cur.at) / Math.max(1, bl));
  return { clip: cur.clip, prevClip: prev.clip, blend, t: (frame - cur.at) / fps, prevT: (frame - prev.at) / fps };
};
