import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { RAD } from "../lib/math";
import { GEO } from "./geometry";
import { computeMotion } from "./motion";
import { Head } from "./parts/Head";
import { Arm, Leg } from "./parts/Limbs";
import {
  LowerGarment,
  Necklace,
  ShawlSash,
  ShawlTail,
  Torso,
} from "./parts/Garments";
import { PRESETS, type PresetName } from "./presets";
import type { CharacterSpec, Expression, Outfit, Palette } from "./types";

export interface CharacterProps {
  /** A preset name ("boy", "king", "deity"...) or a full spec from makeSpec(). */
  spec?: CharacterSpec | PresetName;
  /** Re-colour: any of these override the spec's palette. */
  palette?: Partial<Palette>;
  /** Re-dress: any of these override the spec's outfit. */
  outfit?: Partial<Outfit>;

  /** Where the feet touch the ground, in canvas px. */
  x: number;
  y: number;
  scale?: number;
  /** 1 = faces right, -1 = faces left. */
  facing?: 1 | -1;
  /** Extra rotation around the feet, degrees (e.g. to follow a slope). */
  tilt?: number;

  /** 0 = standing, 1 = walking. Animate it to start / stop smoothly. */
  walk?: number;
  /**
   * Walk phase in cycles. Use walkPhaseFor(distanceTravelled, scale) so the
   * feet stay planted. If omitted, the character steps at `walkHz`.
   */
  walkPhase?: number;
  /** Cycles per second when walkPhase is not given. */
  walkHz?: number;
  /** 0 = arm down, 1 = arm raised. */
  wave?: number;
  /** Deities use "bless" (still raised palm). Default: "bless" if divine, else "wave". */
  waveStyle?: "wave" | "bless";

  expression?: Expression;
  blink?: boolean;
  breathe?: boolean;
  /** Offsets blink / breathing so a crowd does not move in unison. */
  seed?: number;
}

const COERCED_FOR_DIVINE: Expression[] = ["calm", "smile"];

/**
 * The one reusable SVG character: head, body, arms, legs and cloth, drawn as
 * separate parts and driven by the current frame. Walk, wave, blink and
 * breathe are all deterministic functions of time (safe for parallel render).
 */
export const Character: React.FC<CharacterProps> = ({
  spec = "boy",
  palette,
  outfit,
  x,
  y,
  scale = 1,
  facing = 1,
  tilt = 0,
  walk = 0,
  walkPhase,
  walkHz = 0.85,
  wave = 0,
  waveStyle,
  expression = "calm",
  blink = true,
  breathe = true,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const base: CharacterSpec = typeof spec === "string" ? PRESETS[spec] : spec;
  const pal: Palette = { ...base.palette, ...palette };
  const out: Outfit = { ...base.outfit, ...outfit };
  const divine = !!base.divine;

  // Rule: deities are always shown calm or gently smiling, never comic or sad.
  const face: Expression =
    divine && !COERCED_FOR_DIVINE.includes(expression) ? "calm" : expression;

  const motion = computeMotion({
    time,
    walk,
    walkPhase: walkPhase ?? walkHz * time,
    wave,
    waveStyle: waveStyle ?? (divine ? "bless" : "wave"),
    blink,
    breathe,
    seed,
  });

  const shared = { palette: pal, outfit: out, motion };
  const hipY = -motion.hipHeight;

  // Torso, neck, head and arms share one transform: lean + breathing.
  const upper = `translate(0 ${-motion.breatheLift * 0.4}) rotate(${motion.lean * RAD}) translate(0 -2) scale(1 ${motion.breatheScale})`;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${tilt}) scale(${facing * scale} ${scale})`}
    >
      <g transform={`translate(0 ${hipY})`}>
        {/* far side, behind the body */}
        <g transform={upper}>
          <Arm
            palette={pal}
            outfit={out}
            swing={motion.farArm.swing}
            bend={motion.farArm.bend}
            far
          />
          <ShawlTail {...shared} />
        </g>
        <Leg
          palette={pal}
          outfit={out}
          swing={motion.farLeg.swing}
          bend={motion.farLeg.bend}
          foot={motion.farLeg.foot}
          far
          dx={-3}
        />
        <Leg
          palette={pal}
          outfit={out}
          swing={motion.nearLeg.swing}
          bend={motion.nearLeg.bend}
          foot={motion.nearLeg.foot}
          dx={3}
        />
        <LowerGarment {...shared} />

        {/* body */}
        <g transform={upper}>
          <Torso {...shared} />
          <ShawlSash {...shared} />
          <Necklace {...shared} />
          <g transform={`translate(${GEO.head.x} ${GEO.head.y})`}>
            <Head
              {...shared}
              expression={face}
              divine={divine}
              time={time}
            />
          </g>
          {/* near arm in front of everything */}
          <Arm
            palette={pal}
            outfit={out}
            swing={motion.nearArm.swing}
            bend={motion.nearArm.bend}
            palm={motion.wave > 0.5 && (waveStyle ?? (divine ? "bless" : "wave")) === "bless"}
          />
        </g>
      </g>
    </g>
  );
};
