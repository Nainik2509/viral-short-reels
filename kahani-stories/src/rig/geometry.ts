/**
 * Rig dimensions, in px at scale 1. The character faces +x, feet at y = 0,
 * y grows downward. Standing height is about 570 px (head included).
 */
export const GEO = {
  thigh: 120,
  shin: 120,
  ankle: 14, // ankle centre -> sole
  upperArm: 82,
  foreArm: 76,
  torsoTop: -176, // relative to hip
  shoulder: { x: 2, y: -146 },
  neck: { x: 6, y: -196 },
  head: { x: 8, y: -252, r: 64 },
} as const;

/** Maximum thigh swing used by the walk cycle (radians): ~27 degrees. */
export const LEG_SWING = (27 * Math.PI) / 180;

/**
 * Ground distance covered by one full walk cycle (two steps) at scale 1, so
 * feet do not slide: pass `distance / (CYCLE_LENGTH * scale)` as `walkPhase`.
 */
export const CYCLE_LENGTH =
  4 * (GEO.thigh + GEO.shin) * Math.sin(LEG_SWING) * 0.5;

/** Walk phase (in cycles) after travelling `distance` px with a character of `scale`. */
export const walkPhaseFor = (distance: number, scale = 1) =>
  distance / (CYCLE_LENGTH * scale);
