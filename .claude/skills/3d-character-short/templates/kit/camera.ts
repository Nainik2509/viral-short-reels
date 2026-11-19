// Shot-based camera, a pure function of the frame. Hard cuts at shot boundaries, eased moves inside a shot,
// a creeping push-in on every hold (a static hold reads as a freeze), impact kicks and dutch rolls.
import { clamp, lerp, lerp3, smooth, easeOutCubic, easeOutExpo, type V3 } from "./util";

export interface Shot {
  id?: string;
  /** first frame of the shot (it lasts until the next shot's `from`) */
  from: number;
  pos: V3;
  look: V3;
  fov?: number;
  /** dutch tilt in degrees */
  roll?: number;
  /** end state of an eased move inside the shot (any of these may be omitted) */
  pos2?: V3;
  look2?: V3;
  fov2?: number;
  roll2?: number;
  ease?: "smooth" | "out" | "linear" | "expo";
  /** creeping dolly toward the look point over the shot, as a fraction of the distance (default 0.07) */
  push?: number;
  /** point the lens focuses on for depth of field (default = look) */
  focus?: V3;
  /** depth-of-field strength for the shot: 0 = everything sharp, 1 = strong bokeh (default 0.5) */
  blur?: number;
  /** handheld wobble amplitude in metres (default 0) */
  shake?: number;
}

export interface Kick { at: number; mag?: number }

export interface CamState {
  pos: V3;
  look: V3;
  fov: number;
  roll: number;
  focusDist: number;
  blur: number;
  shotIndex: number;
  /** frames since this shot started */
  age: number;
}

const ease = (kind: Shot["ease"], t: number) => (kind === "linear" ? clamp(t) : kind === "out" ? easeOutCubic(t) : kind === "expo" ? easeOutExpo(t) : smooth(t));

export const evalCamera = (shots: Shot[], kicks: Kick[], frame: number, total: number): CamState => {
  let i = 0;
  for (let k = 0; k < shots.length; k++) if (frame >= shots[k].from) i = k;
  const s = shots[i];
  const end = shots[i + 1]?.from ?? total;
  const len = Math.max(1, end - s.from);
  const age = frame - s.from;
  const t = clamp(age / len);

  const moved = s.pos2 || s.look2 || s.fov2 !== undefined || s.roll2 !== undefined;
  const e = moved ? ease(s.ease, t) : 0;
  let pos = s.pos2 ? lerp3(s.pos, s.pos2, e) : s.pos;
  const look = s.look2 ? lerp3(s.look, s.look2, e) : s.look;
  let fov = lerp(s.fov ?? 38, s.fov2 ?? s.fov ?? 38, e);
  let roll = lerp(s.roll ?? 0, s.roll2 ?? s.roll ?? 0, e);

  // creeping push-in: dolly toward the look point; a tiny ease-out burst on the first frames reads as "camera arrived"
  const push = s.push ?? 0.07;
  const dir: V3 = [look[0] - pos[0], look[1] - pos[1], look[2] - pos[2]];
  const pt = push * (t * 0.85 + easeOutCubic(clamp(age / 10)) * 0.15);
  pos = [pos[0] + dir[0] * pt, pos[1] + dir[1] * pt, pos[2] + dir[2] * pt];

  // handheld wobble (smooth, deterministic)
  if (s.shake) {
    const f = frame * 0.11;
    pos = [pos[0] + Math.sin(f * 1.7 + 1) * s.shake, pos[1] + Math.sin(f * 2.3 + 2) * s.shake * 0.7, pos[2] + Math.sin(f * 1.3 + 3) * s.shake * 0.5];
    roll += Math.sin(f * 1.1) * s.shake * 6;
  }

  // impact kicks: sign flips every frame, decays over 7 frames, plus a quick fov punch
  for (const k of kicks) {
    const a = frame - k.at;
    if (a >= 0 && a < 8) {
      const d = (1 - a / 8) * (k.mag ?? 0.06);
      const sg = a % 2 === 0 ? 1 : -1;
      pos = [pos[0] + sg * d * 0.8, pos[1] + -sg * d * 0.6, pos[2]];
      fov -= d * 22 * (1 - a / 8);
      roll += sg * d * 18;
    }
  }

  const focus = s.focus ?? look;
  const focusDist = Math.hypot(focus[0] - pos[0], focus[1] - pos[1], focus[2] - pos[2]);
  return { pos, look, fov, roll, focusDist, blur: s.blur ?? 0.5, shotIndex: i, age };
};

/** A cut happens exactly on these frames; handy for flashes/whooshes. */
export const cutFrames = (shots: Shot[]) => shots.slice(1).map((s) => s.from);

/** Camera helper: a point `dist` metres in front of a character, at eye level, looking at its face. */
export const frontOf = (p: V3, yaw: number, dist: number, y: number, side = 0): V3 => [
  p[0] + Math.sin(yaw) * dist + Math.cos(yaw) * side,
  y,
  p[2] + Math.cos(yaw) * dist - Math.sin(yaw) * side,
];
