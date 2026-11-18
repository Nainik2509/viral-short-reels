import React from "react";
import { AbsoluteFill } from "remotion";
import { HEIGHT, SAFE_RECT, WIDTH } from "../lib/constants";

/**
 * Debug overlay: draws the safe rectangle and the caption line.
 * Add `<SafeZoneGuide />` while reviewing a storyboard; remove it for the final render.
 */
export const SafeZoneGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={WIDTH} height={HEIGHT}>
      <rect width={WIDTH} height={HEIGHT} fill="#FF0000" opacity={0.18} />
      <rect
        x={SAFE_RECT.x}
        y={SAFE_RECT.y}
        width={SAFE_RECT.width}
        height={SAFE_RECT.height}
        fill="#00FF88"
        opacity={0.22}
        stroke="#00FF88"
        strokeWidth={4}
      />
    </svg>
  </AbsoluteFill>
);
