export const TAU = Math.PI * 2;
export const RAD = 180 / Math.PI;

export const deg = (d: number) => (d * Math.PI) / 180;
export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mod = (n: number, m: number) => ((n % m) + m) % m;
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
/** 0 before `from`, 1 after `to`, smooth in between. */
export const ramp = (v: number, from: number, to: number) =>
  smooth((v - from) / (to - from));

/** Deterministic 0..1 hash of a number. Remotion renders frames in parallel, so never use Math.random(). */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

/** Seeded generator (mulberry32) for building lists of random-looking but stable values. */
export const rng = (seed: number) => {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
