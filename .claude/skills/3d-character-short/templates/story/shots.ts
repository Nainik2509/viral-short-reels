// Shot plan, light plan and impact cues for the demo story. Every time is a SPOKEN WORD via cue(), so when the
// voice timings change (estimate -> real voice) the whole film re-times itself. Visual leads its word by ~2 frames.
import { cue, type Kick, type LightKey, type Shot, type WordTiming } from "../../src/three";

export interface Cues {
  hook: number; yes: number; today: number; step1: number; step2: number; wait: number; oven: number; youSee: number; lucky: number; anyway: number;
}

export const buildCues = (w: WordTiming[]): Cues => ({
  hook: 0,
  yes: cue(w, "Yes"),
  today: cue(w, "Today"),
  step1: cue(w, "Step one"),
  step2: cue(w, "Step two"),
  wait: cue(w, "Wait"),
  oven: cue(w, "oven"),
  youSee: cue(w, "You see"),
  lucky: cue(w, "Luckily"),
  anyway: cue(w, "anyway", { lead: 0 }),
});

// Where things stand (metres). PORTRAIT RULE: a 9:16 frame is narrow (~1.0 m wide at 3 m, ~2.6 m at 6 m),
// so keep the two people within about +-0.7 m of the centre axis and let depth (near/far + blur) do the staging.
export const DAD_POS: [number, number, number] = [-0.55, 0, -0.35];
export const KID_POS: [number, number, number] = [0.62, 0, -0.05];
/** Where the kid looks when the smoke starts: high above the oven. */
export const OVEN_SMOKE: [number, number, number] = [0.95, 2.4, -3.4];

/** Camera: hard cuts at beats, one eased move or creeping push inside every shot. */
export const buildShots = (c: Cues): Shot[] => [
  // HOOK: tight on the smug dad, pot smoking low in frame. Head sits low so the hook text has the top.
  { id: "hook", from: c.hook, pos: [-0.05, 1.42, 2.9], look: [-0.5, 1.6, -0.35], fov: 32, push: 0.14, blur: 0.5, focus: [-0.55, 1.6, -0.3] },
  // "Yes, water." deadpan close-up, dutch tilt.
  { id: "yes", from: c.yes, pos: [-0.3, 1.66, 1.55], look: [-0.55, 1.64, -0.35], fov: 28, roll: 3, push: 0.1, blur: 0.7, focus: [-0.55, 1.64, -0.3] },
  // "Today..." wide establishing of the party kitchen; slow drift.
  { id: "wide", from: c.today, pos: [-0.3, 1.6, 5.2], look: [0.02, 1.2, -0.6], pos2: [0.2, 1.55, 4.6], fov: 40, push: 0.02, blur: 0.0 },
  // "Step one: confidence." low angle on the dad, hands on hips.
  { id: "step1", from: c.step1, pos: [-0.05, 0.85, 2.9], look: [-0.55, 1.45, -0.35], fov: 32, roll: -4, push: 0.09, blur: 0.5, focus: [-0.55, 1.5, -0.3] },
  // "Step two: way too much sugar." over the kid's shoulder at the table.
  { id: "step2", from: c.step2, pos: [1.15, 1.3, 2.1], look: [0.1, 1.0, -1.1], pos2: [0.95, 1.28, 1.7], fov: 34, push: 0.03, blur: 0.8, focus: [0.1, 0.95, -1.25] },
  // "Wait, why is the oven smoking?" kid's shock close-up...
  { id: "kidshock", from: c.wait, pos: [0.15, 1.12, 1.55], look: [0.5, 1.02, -0.05], fov: 30, roll: -3, push: 0.06, blur: 0.6, shake: 0.01, focus: [0.62, 1.1, -0.05] },
  // ...then the oven fills the frame (kid blurred in the foreground).
  { id: "oven", from: c.oven, pos: [0.15, 1.3, 0.6], look: [0.95, 1.35, -3.5], pos2: [0.5, 1.4, -0.4], look2: [0.95, 1.4, -3.5], fov: 36, push: 0.0, blur: 0.6, ease: "expo", shake: 0.012, focus: [0.95, 1.3, -3.4] },
  // "You see, he forgot..." push in on the plastic-wrapped pie.
  // Dad (left, sheepish) and the plastic-wrapped pie (right, behind) share the frame; focus rides on the pie.
  { id: "wrap", from: c.youSee, pos: [-0.2, 1.3, 3.1], look: [-0.4, 1.22, -0.8], fov: 36, push: 0.08, blur: 0.35, focus: [-0.3, 0.95, -1.25] },
  // "Luckily, she loved it anyway." warm two-shot, rising and pulling back.
  { id: "payoff", from: c.lucky, pos: [0.05, 1.05, 3.4], look: [0.03, 1.25, -0.2], pos2: [0.05, 1.5, 4.3], fov: 42, push: 0.03, blur: 0.4, focus: [0.03, 1.25, -0.2] },
];

export const buildKicks = (c: Cues): Kick[] => [
  { at: c.yes, mag: 0.05 },
  { at: c.wait, mag: 0.09 },
  { at: c.anyway, mag: 0.05 },
];

/** Colour carries the story: warm = fine, cool/tense = problem, warm again = payoff. */
export const buildLight = (c: Cues): LightKey[] => [
  { at: 0, rig: "warmIndoor" },
  { at: c.wait, rig: "tense", blend: 6 },
  { at: c.lucky, rig: "warmIndoor", blend: 16 },
];
