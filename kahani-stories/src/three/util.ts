// Small pure helpers shared by the whole 3D kit.
// RULE: everything in a Remotion video is a pure function of the frame number.
// Never use Math.random(), Date.now(), CSS transitions or timers: Remotion renders frames in parallel.

export type V3 = [number, number, number];

export const TAU = Math.PI * 2;
export const deg = (d: number) => (d * Math.PI) / 180;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** smootherstep 0..1 (zero velocity at both ends). */
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
/** 0 before `from`, 1 after `to`, smooth in between. */
export const ramp = (v: number, from: number, to: number) => smooth((v - from) / Math.max(1e-6, to - from));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeOutExpo = (t: number) => (clamp(t) >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
/** Overshooting pop: 0 -> ~1.1 -> 1. Great for stamps and scale-ins. */
export const easeOutBack = (t: number, k = 1.70158) => {
  const x = clamp(t) - 1;
  return 1 + (k + 1) * x * x * x + k * x * x;
};

/** Deterministic 0..1 hash of a number. */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

/** Seeded generator (mulberry32) for building stable lists of random-looking values. */
export const rng = (seed: number) => {
  let a = (Math.floor(seed) * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Shade a "#rrggbb" colour: amount -1 (black) .. +1 (white). */
export const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (c: number) => Math.round(clamp(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount, 0, 255));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

/** Mix two "#rrggbb" colours. */
export const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.replace("#", ""), 16), pb = parseInt(b.replace("#", ""), 16);
  const ch = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, t));
  return "#" + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
};
