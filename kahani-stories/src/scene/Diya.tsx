import React, { useId } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, hash, TAU } from "../lib/math";
import { Layer } from "./Layer";

interface DiyaProps {
  /** Centre of the base of the lamp. */
  x: number;
  y: number;
  scale?: number;
  /** 0 = unlit, 1 = fully lit. Animate 0 -> 1 to light the lamp. */
  lit?: number;
  seed?: number;
  clay?: string;
}

/** A clay oil lamp with a flickering flame and a warm glow. */
export const Diya: React.FC<DiyaProps> = ({
  x,
  y,
  scale = 1,
  lit = 1,
  seed = 0,
  clay = "#C8642F",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  const flick =
    1 +
    0.1 * Math.sin(TAU * 3.1 * t + seed) +
    0.06 * Math.sin(TAU * 7.3 * t + seed * 2) +
    0.05 * (hash(Math.floor(t * 12) + seed) - 0.5);
  const sway = 5 * Math.sin(TAU * 1.7 * t + seed) + 3 * Math.sin(TAU * 4.1 * t);
  const L = clamp(lit);
  const glowR = 170 * L * (0.94 + 0.06 * flick);

  return (
    <Layer>
      <defs>
        <radialGradient id={`dg${id}`}>
          <stop offset="0%" stopColor="#FFD36B" stopOpacity={0.75} />
          <stop offset="45%" stopColor="#FF9A3A" stopOpacity={0.28} />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`df${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="55%" stopColor="#FFC13A" />
          <stop offset="100%" stopColor="#FFF2B0" />
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <circle cx={0} cy={-64} r={glowR} fill={`url(#dg${id})`} />
        {/* bowl */}
        <path d="M -48 -30 Q -44 6 0 6 Q 44 6 48 -30 Z" fill={clay} />
        <path d="M -48 -30 Q -44 6 0 6 Q 44 6 48 -30 Z" fill="#000" opacity={0.12} />
        <path d="M -48 -30 L -70 -42 Q -56 -34 -44 -32 Z" fill={clay} />
        <ellipse cx={0} cy={-30} rx={48} ry={9} fill="#7A3A16" />
        <ellipse cx={0} cy={-31} rx={40} ry={6} fill="#E8A13A" opacity={0.9} />
        <path d="M -30 -12 Q 0 -2 30 -12" fill="none" stroke="#F0B010" strokeWidth={3.5} strokeLinecap="round" />
        <rect x={-14} y={0} width={28} height={9} rx={3} fill={clay} />
        {/* wick */}
        <line x1={0} y1={-32} x2={0} y2={-44} stroke="#2A1A10" strokeWidth={4} strokeLinecap="round" />
        {/* flame */}
        {L > 0 && (
          <g
            transform={`translate(0 -42) rotate(${sway * L}) scale(${L} ${flick * L})`}
          >
            <path
              d="M 0 0 C 22 -18 20 -58 0 -92 C -20 -58 -22 -18 0 0 Z"
              fill={`url(#df${id})`}
            />
            <path
              d="M 0 -2 C 9 -12 8 -30 0 -46 C -8 -30 -9 -12 0 -2 Z"
              fill="#FFF8D6"
              opacity={0.9}
            />
          </g>
        )}
      </g>
    </Layer>
  );
};
