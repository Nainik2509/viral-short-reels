import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mod, rng, TAU } from "../lib/math";
import { Layer } from "./Layer";

interface SparksProps {
  /** Where the sparks start. */
  x: number;
  y: number;
  count?: number;
  /** Horizontal width of the emitter, px. */
  spread?: number;
  /** How high a spark climbs, px. */
  rise?: number;
  size?: number;
  colors?: string[];
  seed?: number;
  /** Fade everything in/out: 0..1. */
  intensity?: number;
}

/** Glowing embers / sparkles floating up from a point (lamp, fire, blessing). */
export const Sparks: React.FC<SparksProps> = ({
  x,
  y,
  count = 26,
  spread = 70,
  rise = 300,
  size = 4,
  colors = ["#FFD36B", "#FFAA3A", "#FFF2B0"],
  seed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const next = rng(seed * 53 + 9);

  const sparks = Array.from({ length: count }, () => ({
    ox: (next() - 0.5) * spread,
    life: 1.4 + next() * 1.8,
    offset: next(),
    drift: (next() - 0.5) * 90,
    wob: 8 + next() * 16,
    wobSpeed: 1.5 + next() * 2.5,
    r: size * (0.5 + next() * 0.9),
    color: colors[Math.floor(next() * colors.length)],
    climb: 0.65 + next() * 0.7,
  }));

  return (
    <Layer opacity={intensity}>
      {sparks.map((s, i) => {
        const p = mod(t / s.life + s.offset, 1);
        const px =
          x + s.ox + s.drift * p + Math.sin(TAU * s.wobSpeed * p) * s.wob * p;
        const py = y - rise * s.climb * p;
        const fade = Math.sin(Math.PI * p) ** 0.8;
        const twinkle = 0.7 + 0.3 * Math.sin(t * 14 + i * 2.1);
        const r = s.r * (1 - p * 0.55);
        return (
          <g key={i} opacity={fade * twinkle}>
            <circle cx={px} cy={py} r={r * 3} fill={s.color} opacity={0.3} />
            <circle cx={px} cy={py} r={r} fill={s.color} />
          </g>
        );
      })}
    </Layer>
  );
};
