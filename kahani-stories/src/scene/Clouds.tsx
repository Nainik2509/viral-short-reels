import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { WIDTH } from "../lib/constants";
import { mod, rng, TAU } from "../lib/math";
import { Layer } from "./Layer";

interface CloudsProps {
  count?: number;
  /** Vertical band the clouds float in (canvas y). */
  yMin?: number;
  yMax?: number;
  /** Base drift in px per second; each cloud gets its own speed around this. */
  speed?: number;
  color?: string;
  opacity?: number;
  seed?: number;
  /** Optional world scroll so clouds also follow a walking camera (slowly). */
  scroll?: number;
  parallax?: number;
}

const Puffs: React.FC<{ color: string }> = ({ color }) => (
  <g fill={color}>
    <ellipse cx={0} cy={0} rx={130} ry={34} />
    <circle cx={-52} cy={-22} r={42} />
    <circle cx={10} cy={-42} r={58} />
    <circle cx={70} cy={-20} r={40} />
  </g>
);

/**
 * Soft clouds that drift across the sky. Every cloud has its own speed, size,
 * height and slow bob, so they never move in lockstep (bigger = faster = closer).
 */
export const Clouds: React.FC<CloudsProps> = ({
  count = 6,
  yMin = 200,
  yMax = 780,
  speed = 22,
  color = "#FFFFFF",
  opacity = 0.85,
  seed = 1,
  scroll = 0,
  parallax = 0.08,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const next = rng(seed * 31 + 5);
  const span = WIDTH + 600;

  const clouds = Array.from({ length: count }, () => ({
    x0: next() * span,
    y: yMin + next() * (yMax - yMin),
    s: 0.5 + next() * 0.9,
    speedFactor: 0.5 + next() * 1.1,
    phase: next() * TAU,
  }));

  return (
    <Layer opacity={opacity}>
      {clouds.map((c, i) => {
        const x = mod(c.x0 + speed * c.speedFactor * c.s * t - scroll * parallax * c.s, span) - 300;
        const y = c.y + Math.sin(t * 0.4 + c.phase) * 8;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${c.s})`}>
            <Puffs color={color} />
          </g>
        );
      })}
    </Layer>
  );
};
