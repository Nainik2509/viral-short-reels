import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HEIGHT, WIDTH } from "../lib/constants";
import { mod, rng, TAU } from "../lib/math";
import { Layer } from "./Layer";

interface PetalsProps {
  count?: number;
  /** Marigold, rose... one colour is picked per petal. */
  colors?: string[];
  /** Fall speed multiplier. */
  speed?: number;
  /** Constant sideways drift, px per second (wind). */
  wind?: number;
  size?: number;
  seed?: number;
  opacity?: number;
}

/** Flower petals tumbling down the whole frame: swaying, spinning and flipping. */
export const Petals: React.FC<PetalsProps> = ({
  count = 26,
  colors = ["#FFA61A", "#FFC43A", "#F2557A", "#FF7A1A"],
  speed = 1,
  wind = 24,
  size = 16,
  seed = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const next = rng(seed * 71 + 13);
  const spanY = HEIGHT + 240;
  const spanX = WIDTH + 240;

  const petals = Array.from({ length: count }, () => ({
    x0: next() * spanX,
    y0: next() * spanY,
    fall: 90 + next() * 120,
    swayAmp: 30 + next() * 60,
    swayFreq: 0.4 + next() * 0.7,
    phase: next() * TAU,
    spin: (next() - 0.5) * 220,
    flip: 0.8 + next() * 1.6,
    s: size * (0.7 + next() * 0.8),
    color: colors[Math.floor(next() * colors.length)],
    depth: 0.6 + next() * 0.4,
  }));

  return (
    <Layer opacity={opacity}>
      {petals.map((p, i) => {
        const y = mod(p.y0 + p.fall * speed * t, spanY) - 120;
        const x =
          mod(p.x0 + wind * t * p.depth, spanX) -
          120 +
          Math.sin(TAU * p.swayFreq * t + p.phase) * p.swayAmp;
        const rot = p.spin * t + p.phase * 20;
        const flipY = Math.cos(TAU * p.flip * t + p.phase);
        return (
          <g
            key={i}
            transform={`translate(${x} ${y}) rotate(${rot}) scale(${p.s} ${p.s * 1.9 * (0.25 + 0.75 * Math.abs(flipY))})`}
            opacity={0.85 * p.depth}
          >
            <path
              d="M 0 -1 C 0.85 -0.55 0.75 0.55 0 1 C -0.75 0.55 -0.85 -0.55 0 -1 Z"
              fill={p.color}
            />
            <path d="M 0 -0.8 L 0 0.8" stroke="#00000022" strokeWidth={0.05} />
          </g>
        );
      })}
    </Layer>
  );
};
