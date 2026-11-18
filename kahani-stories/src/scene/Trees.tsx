import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { shade } from "../lib/color";
import { mod, rng } from "../lib/math";
import { Layer } from "./Layer";
import { hillHeight, PERIOD, type HillLayer } from "./terrain";

export interface TreesProps {
  /** The hill layer the trees stand on. They scroll with it. */
  layer: HillLayer;
  scroll: number;
  count?: number;
  minScale?: number;
  maxScale?: number;
  seed?: number;
  kinds?: Array<"canopy" | "palm">;
  /** Leaf colour. Default: a dark tint of the hill colour so trees sit in the scene. */
  leaf?: string;
  trunk?: string;
}

const Canopy: React.FC<{ leaf: string; trunk: string }> = ({ leaf, trunk }) => (
  <g>
    <path d="M -10 0 L -6 -90 L 6 -90 L 10 0 Z" fill={trunk} />
    <path d="M 0 -80 L 34 -130 L 30 -120 Z" fill={trunk} />
    <circle cx={-46} cy={-130} r={52} fill={shade(leaf, 0.12)} />
    <circle cx={46} cy={-128} r={50} fill={shade(leaf, 0.12)} />
    <circle cx={0} cy={-170} r={62} fill={leaf} />
    <circle cx={-18} cy={-196} r={26} fill={shade(leaf, -0.12)} opacity={0.6} />
  </g>
);

const Palm: React.FC<{ leaf: string; trunk: string }> = ({ leaf, trunk }) => (
  <g>
    <path d="M -9 0 Q 6 -90 22 -180 L 32 -178 Q 14 -90 9 0 Z" fill={trunk} />
    <g transform="translate(27 -180)">
      {[-165, -125, -85, -45, -5, 28, 152].map((a) => (
        <path
          key={a}
          d="M 0 0 Q 50 -46 112 -8 Q 54 -26 0 8 Z"
          fill={a % 2 === 0 ? leaf : shade(leaf, 0.1)}
          transform={`rotate(${a})`}
        />
      ))}
      <circle cx={-6} cy={8} r={9} fill={shade(trunk, 0.2)} />
      <circle cx={8} cy={10} r={9} fill={shade(trunk, 0.2)} />
    </g>
  </g>
);

/**
 * Neem / banyan-style round trees and coconut palms standing on a hill layer.
 * They scroll with the layer's parallax speed and sway gently in the wind.
 */
export const Trees: React.FC<TreesProps> = ({
  layer,
  scroll,
  count = 6,
  minScale = 0.6,
  maxScale = 1,
  seed = 1,
  kinds = ["canopy", "canopy", "palm"],
  leaf,
  trunk,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const leafColor = leaf ?? shade(layer.color, 0.28);
  const trunkColor = trunk ?? shade(layer.color, 0.5);

  const next = rng(seed * 97 + 3);
  const trees = Array.from({ length: count }, (_, i) => ({
    wx: ((i + next() * 0.7) / count) * PERIOD,
    s: minScale + next() * (maxScale - minScale),
    kind: kinds[Math.floor(next() * kinds.length)],
    phase: next() * 6.28,
    flip: next() > 0.5 ? 1 : -1,
  }));

  const off = scroll * layer.parallax;
  return (
    <Layer>
      {trees.map((tr, i) => {
        // Place on the repeating strip, shifted so one period covers the screen +/- margin.
        const screenX = mod(tr.wx - off + 200, PERIOD) - 200;
        if (screenX < -220 || screenX > 1300) return null;
        const groundY = hillHeight(layer, screenX + off) + 6;
        const sway = Math.sin(t * 1.3 + tr.phase) * 1.8;
        return (
          <g
            key={i}
            transform={`translate(${screenX} ${groundY}) rotate(${sway}) scale(${tr.s * tr.flip} ${tr.s})`}
          >
            {tr.kind === "palm" ? (
              <Palm leaf={leafColor} trunk={trunkColor} />
            ) : (
              <Canopy leaf={leafColor} trunk={trunkColor} />
            )}
          </g>
        );
      })}
    </Layer>
  );
};
