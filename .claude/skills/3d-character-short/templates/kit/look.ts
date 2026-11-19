// Mood-coded light rigs. Colour carries the story: cool/dim = problem, tension, night; warm/golden = reward, payoff.
// A rig is plain data, so a beat can crossfade between two rigs with mixRig(a, b, t).
import { lerp, mixHex, type V3 } from "./util";

export interface LightRig {
  /** sky gradient: [top, horizon, bottom] */
  sky: [string, string, string];
  fog: string;
  fogNear: number;
  fogFar: number;
  key: { color: string; intensity: number; dir: V3 };   // dir = where the light comes FROM (offset from the focus point)
  fill: { color: string; intensity: number; dir: V3 };
  rim: { color: string; intensity: number; dir: V3 };
  hemi: { sky: string; ground: string; intensity: number };
  /** image-based light from a neutral studio room; gives soft reflections + wrap */
  env: number;
  exposure: number;
  bloom: number;
  /** extra saturation in the grade (-1..1) */
  sat: number;
}

export const RIGS = {
  /** Cosy interior: warm key from a window, peach fill, cool rim. The default "wholesome" look. */
  warmIndoor: {
    sky: ["#fbd9a8", "#ffe9c9", "#e9c9a0"], fog: "#f3dcc0", fogNear: 14, fogFar: 46,
    key: { color: "#ffd8a6", intensity: 2.0, dir: [-4, 6.5, 5] },
    fill: { color: "#ffc4a8", intensity: 0.45, dir: [5, 2.5, 4] },
    rim: { color: "#a9c8ff", intensity: 1.1, dir: [3, 4, -6] },
    hemi: { sky: "#fff0dc", ground: "#d89a78", intensity: 0.5 },
    env: 0.4, exposure: 1.0, bloom: 0.38, sat: 0.12,
  },
  coolIndoor: {
    sky: ["#9fb4d8", "#cdd9ee", "#9aa6c4"], fog: "#c3cfe4", fogNear: 14, fogFar: 46,
    key: { color: "#dce8ff", intensity: 1.7, dir: [-4, 6, 5] },
    fill: { color: "#b9a8e8", intensity: 0.7, dir: [5, 2, 4] },
    rim: { color: "#ffb88a", intensity: 1.3, dir: [3, 4, -6] },
    hemi: { sky: "#d8e4ff", ground: "#6e6a96", intensity: 0.7 },
    env: 0.38, exposure: 0.95, bloom: 0.25, sat: 0.05,
  },
  morning: {
    sky: ["#7fb9f0", "#d6ecff", "#c7e0b4"], fog: "#d6ecff", fogNear: 30, fogFar: 140,
    key: { color: "#fff0d0", intensity: 2.4, dir: [-6, 7, 6] },
    fill: { color: "#bcd8ff", intensity: 0.8, dir: [6, 3, 4] },
    rim: { color: "#fff4d8", intensity: 1.2, dir: [4, 5, -7] },
    hemi: { sky: "#cfe6ff", ground: "#9bc27a", intensity: 0.95 },
    env: 0.45, exposure: 1.0, bloom: 0.25, sat: 0.14,
  },
  noon: {
    sky: ["#3f86e0", "#a9d2ff", "#b9dca0"], fog: "#b7d9ff", fogNear: 40, fogFar: 160,
    key: { color: "#fffaf0", intensity: 2.6, dir: [-3, 10, 4] },
    fill: { color: "#a8ccff", intensity: 0.9, dir: [6, 3, 5] },
    rim: { color: "#ffffff", intensity: 0.9, dir: [3, 6, -6] },
    hemi: { sky: "#bfe0ff", ground: "#8fb76e", intensity: 1.0 },
    env: 0.45, exposure: 1.0, bloom: 0.2, sat: 0.16,
  },
  golden: {
    sky: ["#ff9f6e", "#ffd08a", "#e0a070"], fog: "#ffcf9c", fogNear: 24, fogFar: 110,
    key: { color: "#ffb36b", intensity: 2.8, dir: [-7, 3, -5] }, // low backlit sun
    fill: { color: "#a58cff", intensity: 1.0, dir: [6, 2.5, 5] },
    rim: { color: "#ffd9a0", intensity: 2.4, dir: [-5, 3, -6] },
    hemi: { sky: "#ffd2a8", ground: "#6b5aa0", intensity: 0.75 },
    env: 0.38, exposure: 1.0, bloom: 0.6, sat: 0.2,
  },
  night: {
    sky: ["#0e1840", "#27346e", "#1a2050"], fog: "#1c2658", fogNear: 12, fogFar: 60,
    key: { color: "#9db8ff", intensity: 1.7, dir: [-4, 7, 5] },
    fill: { color: "#7a6cff", intensity: 0.5, dir: [5, 2, 4] },
    rim: { color: "#ffb070", intensity: 1.6, dir: [4, 3, -6] },
    hemi: { sky: "#4a5cb8", ground: "#1c1840", intensity: 0.6 },
    env: 0.3, exposure: 1.05, bloom: 0.55, sat: 0.1,
  },
  /** Spooky / tense: low green-teal key, deep shadow, red rim. Use for the "uh oh" beat. */
  tense: {
    sky: ["#1b2830", "#35505c", "#223038"], fog: "#2c424c", fogNear: 10, fogFar: 40,
    key: { color: "#9fdcd2", intensity: 1.5, dir: [-3, 5, 5] },
    fill: { color: "#3a5a8a", intensity: 0.22, dir: [5, 2, 4] },
    rim: { color: "#ff6a50", intensity: 1.8, dir: [4, 3, -6] },
    hemi: { sky: "#6a8f9c", ground: "#1a242e", intensity: 0.32 },
    env: 0.16, exposure: 0.92, bloom: 0.3, sat: -0.04,
  },
} satisfies Record<string, LightRig>;

export type RigName = keyof typeof RIGS;

export const mixRig = (a: LightRig, b: LightRig, t: number): LightRig => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const v = (x: V3, y: V3): V3 => [lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t)];
  const L = (x: LightRig["key"], y: LightRig["key"]) => ({ color: mixHex(x.color, y.color, t), intensity: lerp(x.intensity, y.intensity, t), dir: v(x.dir, y.dir) });
  return {
    sky: [mixHex(a.sky[0], b.sky[0], t), mixHex(a.sky[1], b.sky[1], t), mixHex(a.sky[2], b.sky[2], t)],
    fog: mixHex(a.fog, b.fog, t), fogNear: lerp(a.fogNear, b.fogNear, t), fogFar: lerp(a.fogFar, b.fogFar, t),
    key: L(a.key, b.key), fill: L(a.fill, b.fill), rim: L(a.rim, b.rim),
    hemi: { sky: mixHex(a.hemi.sky, b.hemi.sky, t), ground: mixHex(a.hemi.ground, b.hemi.ground, t), intensity: lerp(a.hemi.intensity, b.hemi.intensity, t) },
    env: lerp(a.env, b.env, t), exposure: lerp(a.exposure, b.exposure, t), bloom: lerp(a.bloom, b.bloom, t), sat: lerp(a.sat, b.sat, t),
  };
};

/** Light timeline: [{at:0, rig:"warmIndoor"}, {at:200, rig:"tense", blend:20}] -> LightRig for `frame`. */
export interface LightKey { at: number; rig: RigName; blend?: number }
export const lightTrack = (keys: LightKey[], frame: number): LightRig => {
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (frame >= keys[k].at) i = k;
  const cur = keys[i], prev = keys[Math.max(0, i - 1)];
  const t = i === 0 ? 1 : Math.min(1, (frame - cur.at) / Math.max(1, cur.blend ?? 18));
  return mixRig(RIGS[prev.rig], RIGS[cur.rig], t);
};
