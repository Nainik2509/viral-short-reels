import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TAU } from "../lib/math";
import { Layer } from "./Layer";

interface MoonProps {
  x: number;
  y: number;
  r?: number;
  /** 1 = full moon, 0.5 = half, near 0 = thin crescent. */
  lit?: number;
  color?: string;
  opacity?: number;
}

/** A glowing moon with faint craters that bobs very slowly. */
export const Moon: React.FC<MoonProps> = ({
  x,
  y,
  r = 90,
  lit = 1,
  color = "#FFF6D6",
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const bob = Math.sin(TAU * 0.07 * t) * 6;
  const shift = (1 - lit) * r * 1.7;

  return (
    <Layer opacity={opacity}>
      <defs>
        <radialGradient id="kahani-moon-glow">
          <stop offset="30%" stopColor={color} stopOpacity={0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
        <mask id="kahani-moon-mask">
          <rect x={-r * 3} y={-r * 3} width={r * 6} height={r * 6} fill="black" />
          <circle r={r} fill="white" />
          {lit < 1 && <circle cx={shift} cy={-shift * 0.12} r={r * 0.98} fill="black" />}
        </mask>
      </defs>
      <g transform={`translate(${x} ${y + bob})`}>
        <circle r={r * 2.6} fill="url(#kahani-moon-glow)" />
        <g mask="url(#kahani-moon-mask)">
          <circle r={r} fill={color} />
          <circle cx={-r * 0.3} cy={-r * 0.25} r={r * 0.17} fill="#E6D9B0" opacity={0.55} />
          <circle cx={r * 0.25} cy={r * 0.2} r={r * 0.24} fill="#E6D9B0" opacity={0.45} />
          <circle cx={-r * 0.1} cy={r * 0.5} r={r * 0.1} fill="#E6D9B0" opacity={0.5} />
        </g>
      </g>
    </Layer>
  );
};
