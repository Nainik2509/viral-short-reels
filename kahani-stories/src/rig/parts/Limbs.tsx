import React from "react";
import { RAD } from "../../lib/math";
import { shade } from "../../lib/color";
import { GEO } from "../geometry";
import type { Outfit, Palette } from "../types";

const Capsule: React.FC<{ len: number; w: number; color: string }> = ({
  len,
  w,
  color,
}) => (
  <line
    x1={0}
    y1={0}
    x2={0}
    y2={len}
    stroke={color}
    strokeWidth={w}
    strokeLinecap="round"
  />
);

interface LegProps {
  palette: Palette;
  outfit: Outfit;
  swing: number;
  bend: number;
  foot: number;
  far?: boolean;
  /** Small x offset to fake depth between the two legs. */
  dx?: number;
}

/** Thigh -> shin -> shoe. Origin is the hip joint. */
export const Leg: React.FC<LegProps> = ({
  palette,
  outfit,
  swing,
  bend,
  foot,
  far,
  dx = 0,
}) => {
  const k = far ? 0.22 : 0;
  const skin = shade(palette.skin, k + 0.04);
  const cloth = shade(palette.bottom, k);
  const trim = shade(palette.bottomTrim, k);
  const shoe = shade(palette.shoes, k);
  const { thigh, shin } = GEO;

  return (
    <g transform={`translate(${dx} 0) rotate(${-swing * RAD})`}>
      <Capsule len={thigh} w={34} color={skin} />
      {outfit.bottom === "pants" && <Capsule len={thigh} w={44} color={cloth} />}
      {outfit.bottom === "dhoti" && <Capsule len={thigh} w={58} color={cloth} />}
      <g transform={`translate(0 ${thigh}) rotate(${bend * RAD})`}>
        <Capsule len={shin} w={28} color={skin} />
        {outfit.bottom === "pants" && (
          <>
            <line x1={0} y1={-4} x2={0} y2={shin - 10} stroke={cloth} strokeWidth={38} strokeLinecap="round" />
            <line x1={-19} y1={shin - 10} x2={19} y2={shin - 10} stroke={trim} strokeWidth={6} strokeLinecap="round" />
          </>
        )}
        {outfit.bottom === "dhoti" && (
          <>
            <line x1={0} y1={-6} x2={0} y2={shin * 0.68} stroke={cloth} strokeWidth={50} strokeLinecap="round" />
            <line x1={-25} y1={shin * 0.68} x2={25} y2={shin * 0.68} stroke={trim} strokeWidth={6} strokeLinecap="round" />
          </>
        )}
        <g transform={`translate(0 ${shin}) rotate(${foot * RAD})`}>
          <path
            d="M -13 -11 L 9 -11 Q 36 -8 42 7 L 42 14 L -15 14 Q -17 4 -13 -11 Z"
            fill={shoe}
          />
          <rect x={-15} y={10} width={57} height={5} rx={2.5} fill={shade(shoe, 0.35)} />
        </g>
      </g>
    </g>
  );
};

interface ArmProps {
  palette: Palette;
  outfit: Outfit;
  swing: number;
  bend: number;
  far?: boolean;
  /** Draw an open palm (blessing) instead of a loose hand. */
  palm?: boolean;
}

/** Upper arm -> forearm -> hand. Origin is the shoulder joint. */
export const Arm: React.FC<ArmProps> = ({
  palette,
  outfit,
  swing,
  bend,
  far,
  palm,
}) => {
  const k = far ? 0.22 : 0;
  const skin = shade(palette.skin, k);
  const sleeve = shade(palette.top, k);
  const trim = shade(palette.topTrim, k);
  const { upperArm, foreArm } = GEO;
  const longSleeve = outfit.sleeves === "long" && outfit.top !== "bare";
  const shortSleeve = outfit.sleeves === "short" && outfit.top !== "bare";

  return (
    <g
      transform={`translate(${GEO.shoulder.x} ${GEO.shoulder.y}) rotate(${-swing * RAD})`}
    >
      <Capsule len={upperArm} w={24} color={skin} />
      {(longSleeve || shortSleeve) && (
        <line
          x1={0}
          y1={-2}
          x2={0}
          y2={longSleeve ? upperArm : upperArm * 0.5}
          stroke={sleeve}
          strokeWidth={34}
          strokeLinecap="round"
        />
      )}
      <g transform={`translate(0 ${upperArm}) rotate(${-bend * RAD})`}>
        <Capsule len={foreArm} w={21} color={skin} />
        {longSleeve && (
          <>
            <line x1={0} y1={-2} x2={0} y2={foreArm - 14} stroke={sleeve} strokeWidth={29} strokeLinecap="round" />
            <line x1={-14} y1={foreArm - 14} x2={14} y2={foreArm - 14} stroke={trim} strokeWidth={5} strokeLinecap="round" />
          </>
        )}
        {palm ? (
          <ellipse cx={0} cy={foreArm + 12} rx={15} ry={20} fill={skin} />
        ) : (
          <circle cx={0} cy={foreArm + 8} r={14} fill={skin} />
        )}
      </g>
    </g>
  );
};
