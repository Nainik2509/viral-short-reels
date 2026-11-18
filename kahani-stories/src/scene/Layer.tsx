import React from "react";
import { AbsoluteFill } from "remotion";
import { HEIGHT, WIDTH } from "../lib/constants";

/** Full-frame SVG in canvas pixels. Every scene part draws into one of these. */
export const Layer: React.FC<{
  children: React.ReactNode;
  opacity?: number;
}> = ({ children, opacity = 1 }) => (
  <AbsoluteFill style={{ opacity }}>
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {children}
    </svg>
  </AbsoluteFill>
);
