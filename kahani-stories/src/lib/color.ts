import { clamp } from "./math";

const toRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0"))
    .join("");

/** Blend two #hex colours. t=0 -> a, t=1 -> b. */
export const mix = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
};

/** Darken (amt > 0) or lighten (amt < 0) a #hex colour. */
export const shade = (hex: string, amt: number) =>
  amt >= 0 ? mix(hex, "#000000", amt) : mix(hex, "#ffffff", -amt);
