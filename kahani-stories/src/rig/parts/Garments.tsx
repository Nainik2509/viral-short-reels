import React from "react";
import { shade } from "../../lib/color";
import { lerp } from "../../lib/math";
import { GEO } from "../geometry";
import type { MotionState, Outfit, Palette } from "../types";

interface Props {
  palette: Palette;
  outfit: Outfit;
  motion: MotionState;
}

const TORSO_W = 88;
const TORSO_X = -TORSO_W / 2 + 4;

/** Neck, body and the top garment (kurta / blouse / bare). Origin is the hip. */
export const Torso: React.FC<Props> = ({ palette, outfit }) => {
  const top = GEO.torsoTop;
  const h = -top + 14;
  return (
    <g>
      {/* neck */}
      <line
        x1={GEO.shoulder.x + 2}
        y1={-160}
        x2={GEO.neck.x}
        y2={GEO.neck.y}
        stroke={shade(palette.skin, 0.12)}
        strokeWidth={26}
        strokeLinecap="round"
      />
      {/* body skin */}
      <rect x={TORSO_X} y={top} width={TORSO_W} height={h} rx={36} fill={palette.skin} />
      {outfit.top === "kurta" && (
        <>
          <rect x={TORSO_X} y={top} width={TORSO_W} height={h} rx={36} fill={palette.top} />
          <path
            d={`M ${GEO.shoulder.x - 14} ${top + 2} Q ${GEO.shoulder.x + 6} ${top + 34} ${GEO.shoulder.x + 24} ${top + 2}`}
            fill={palette.skin}
          />
          <line x1={GEO.shoulder.x + 6} y1={top + 28} x2={GEO.shoulder.x + 6} y2={-20} stroke={palette.topTrim} strokeWidth={4} />
          {[-110, -84, -58].map((y) => (
            <circle key={y} cx={GEO.shoulder.x + 6} cy={y} r={3.5} fill={palette.topTrim} />
          ))}
        </>
      )}
      {outfit.top === "blouse" && (
        <>
          <path
            d={`M ${TORSO_X} ${top + 36} Q ${TORSO_X} ${top} ${TORSO_X + 36} ${top} L ${TORSO_X + TORSO_W - 36} ${top} Q ${TORSO_X + TORSO_W} ${top} ${TORSO_X + TORSO_W} ${top + 36} L ${TORSO_X + TORSO_W} -52 L ${TORSO_X} -52 Z`}
            fill={palette.top}
          />
          <path
            d={`M ${GEO.shoulder.x - 18} ${top + 2} Q ${GEO.shoulder.x + 6} ${top + 40} ${GEO.shoulder.x + 28} ${top + 2}`}
            fill={palette.skin}
          />
          <line x1={TORSO_X} y1={-52} x2={TORSO_X + TORSO_W} y2={-52} stroke={palette.topTrim} strokeWidth={5} />
        </>
      )}
      {/* waistband */}
      {outfit.bottom !== "pants" && (
        <rect x={TORSO_X - 1} y={-10} width={TORSO_W + 2} height={16} rx={6} fill={palette.bottomTrim} />
      )}
    </g>
  );
};

/** Hanging lower garment: kurta hem, dhoti drape or skirt. Origin is the hip. */
export const LowerGarment: React.FC<Props> = ({ palette, outfit, motion }) => {
  const sway = 12 * motion.walk * Math.sin(motion.clothPhase * 0.7 + 0.8);
  const ankleY = motion.hipHeight - GEO.ankle;

  if (outfit.bottom === "skirt") {
    const hem = ankleY - 34;
    const w = 66 + 16 * motion.walk;
    return (
      <g>
        <path
          d={`M -46 -8 L 50 -8 Q ${w + sway + 6} ${hem * 0.55} ${w + sway} ${hem} Q ${sway} ${hem + 12} ${-w + sway * 0.6} ${hem} Q ${-w + 8 + sway * 0.4} ${hem * 0.5} -46 -8 Z`}
          fill={palette.bottom}
        />
        <path
          d={`M ${-w + sway * 0.6} ${hem} Q ${sway} ${hem + 12} ${w + sway} ${hem}`}
          fill="none"
          stroke={palette.bottomTrim}
          strokeWidth={9}
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (outfit.top === "kurta") {
    // Kurta hem to the knee, drawn over the legs.
    const hem = 112;
    const color = palette.top;
    return (
      <g>
        <path
          d={`M -46 -10 L 50 -10 Q ${56 + sway} ${hem * 0.5} ${52 + sway} ${hem} Q ${4 + sway} ${hem + 12} ${-50 + sway * 0.6} ${hem} Q ${-56 + sway * 0.4} ${hem * 0.5} -46 -10 Z`}
          fill={color}
        />
        <path
          d={`M ${-50 + sway * 0.6} ${hem} Q ${4 + sway} ${hem + 12} ${52 + sway} ${hem}`}
          fill="none"
          stroke={palette.topTrim}
          strokeWidth={7}
          strokeLinecap="round"
        />
      </g>
    );
  }

  return null;
};

/** Shawl / dupatta: trailing tail behind the body + sash across the chest. */
export const ShawlTail: React.FC<Props> = ({ palette, outfit, motion }) => {
  if (!outfit.shawl) return null;
  const N = 14;
  const dirx = lerp(0.12, 1, motion.walk);
  const diry = lerp(1, 0.28, motion.walk);
  const len = 160;
  const amp = lerp(3, 15, motion.walk);
  const upper: string[] = [];
  const lower: string[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const flutter = Math.sin(motion.clothPhase - u * 5.2) * amp * u;
    const x = -30 - dirx * len * u + flutter * 0.4;
    const y = -140 + diry * len * u + flutter;
    const half = 8 + u * 12;
    upper.push(`${x.toFixed(1)},${(y - half).toFixed(1)}`);
    lower.unshift(`${x.toFixed(1)},${(y + half).toFixed(1)}`);
  }
  return (
    <g>
      <polygon points={[...upper, ...lower].join(" ")} fill={shade(palette.shawl, 0.1)} />
      <polyline
        points={lower.reverse().join(" ")}
        fill="none"
        stroke={palette.gold}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );
};

export const ShawlSash: React.FC<Props> = ({ palette, outfit }) => {
  if (!outfit.shawl) return null;
  return (
    <g>
      <path
        d={`M ${TORSO_X + 6} -170 Q ${TORSO_X + 40} -120 ${TORSO_X + TORSO_W - 8} -44`}
        fill="none"
        stroke={palette.shawl}
        strokeWidth={22}
        strokeLinecap="round"
      />
      <path
        d={`M ${TORSO_X + 6} -170 Q ${TORSO_X + 40} -120 ${TORSO_X + TORSO_W - 8} -44`}
        fill="none"
        stroke={palette.gold}
        strokeWidth={3}
        strokeLinecap="round"
        transform="translate(-9 0)"
      />
    </g>
  );
};

export const Necklace: React.FC<Props> = ({ palette, outfit }) => {
  if (!outfit.necklace) return null;
  return (
    <g>
      <path
        d={`M ${GEO.shoulder.x - 20} -170 Q ${GEO.shoulder.x + 6} -118 ${GEO.shoulder.x + 30} -170`}
        fill="none"
        stroke={palette.gold}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <circle cx={GEO.shoulder.x + 6} cy={-128} r={8} fill={palette.gold} />
      <circle cx={GEO.shoulder.x + 6} cy={-128} r={3.5} fill="#D94F4F" />
    </g>
  );
};
