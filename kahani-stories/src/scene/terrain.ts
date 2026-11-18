import { TAU } from "../lib/math";

/** Hills repeat every PERIOD px of world distance, so scrolling never runs out. */
export const PERIOD = 2160;

export interface HillLayer {
  color: string;
  /** Mean ridge height (canvas y, px). */
  baseY: number;
  /** Ridge height variation, px. */
  amp: number;
  /** How fast this layer scrolls relative to `scroll` (1 = the ground the character walks on). */
  parallax: number;
  seed: number;
}

/** far, middle, near. The near layer is the ground the character walks on. */
export const HILLS_DUSK: HillLayer[] = [
  { color: "#5B3F8C", baseY: 1060, amp: 95, parallax: 0.18, seed: 1 },
  { color: "#3F3475", baseY: 1190, amp: 85, parallax: 0.42, seed: 2 },
  { color: "#1F2F5C", baseY: 1340, amp: 55, parallax: 1, seed: 3 },
];

export const HILLS_DAY: HillLayer[] = [
  { color: "#8CC59A", baseY: 1060, amp: 95, parallax: 0.18, seed: 1 },
  { color: "#5FAE6E", baseY: 1190, amp: 85, parallax: 0.42, seed: 2 },
  { color: "#3E8E4F", baseY: 1340, amp: 55, parallax: 1, seed: 3 },
];

/** Ridge height (canvas y) of `layer` at world x. Periodic in PERIOD. */
export const hillHeight = (layer: HillLayer, worldX: number) => {
  const u = (worldX / PERIOD) * TAU;
  const s = layer.seed * 1.7;
  return (
    layer.baseY -
    layer.amp *
      (0.55 * Math.sin(u + s) +
        0.3 * Math.sin(2 * u + s * 2.3) +
        0.15 * Math.sin(3 * u + s * 3.1))
  );
};

/** Slope (dy/dx) of the ridge, for tilting a character standing on a hill. */
export const hillSlope = (layer: HillLayer, worldX: number) =>
  (hillHeight(layer, worldX + 6) - hillHeight(layer, worldX - 6)) / 12;
