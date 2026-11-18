import React, { useId } from "react";
import { shade } from "../../lib/color";
import { RAD, TAU } from "../../lib/math";
import { GEO } from "../geometry";
import type { Expression, MotionState, Outfit, Palette } from "../types";

interface Props {
  palette: Palette;
  outfit: Outfit;
  motion: MotionState;
  expression: Expression;
  divine: boolean;
  time: number;
}

const Eyebrow: React.FC<{ expression: Expression; color: string }> = ({
  expression,
  color,
}) => {
  const d: Record<Expression, string> = {
    calm: "M 15 -22 Q 28 -29 41 -23",
    smile: "M 15 -24 Q 28 -33 41 -25",
    sad: "M 15 -19 Q 28 -27 41 -29",
    surprised: "M 15 -31 Q 28 -40 41 -32",
  };
  return (
    <path d={d[expression]} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
  );
};

const Mouth: React.FC<{ expression: Expression; color: string }> = ({
  expression,
  color,
}) => {
  switch (expression) {
    case "smile":
      return <path d="M 29 31 Q 42 48 56 29" fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />;
    case "sad":
      return <path d="M 31 41 Q 43 31 55 40" fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />;
    case "surprised":
      return <ellipse cx={43} cy={38} rx={6} ry={8} fill="#5A1F1F" />;
    default:
      return <path d="M 32 34 Q 43 40 54 33" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />;
  }
};

/** Everything above the neck. Origin is the head centre. */
export const Head: React.FC<Props> = ({
  palette,
  outfit,
  motion,
  expression,
  divine,
  time,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const r = GEO.head.r;
  const lidded = divine || expression === "calm";
  const lidCover = divine ? 11 : lidded ? 8 : 0;
  const eyeScaleY = 1 - motion.blink * 0.93;
  const lipColor = "#8A3B3B";
  const hairSway = Math.sin(motion.clothPhase * 0.8) * (2 + 6 * motion.walk);

  return (
    <g transform={`rotate(${motion.headTilt * RAD})`}>
      {divine && (
        <g>
          <defs>
            <radialGradient id={`halo${id}`}>
              <stop offset="55%" stopColor={palette.gold} stopOpacity={0.55} />
              <stop offset="100%" stopColor={palette.gold} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle
            r={150 + 4 * Math.sin(TAU * 0.4 * time)}
            fill={`url(#halo${id})`}
          />
          <circle r={104} fill="none" stroke={palette.gold} strokeWidth={5} opacity={0.9} />
        </g>
      )}

      {/* hair behind the head */}
      {outfit.hair === "long" && (
        <path
          d={`M -50 -20 Q -88 60 -66 150 L 6 ${140 + hairSway} Q 24 70 14 -20 Z`}
          fill={palette.hair}
        />
      )}
      {outfit.hair === "bun" && (
        <circle cx={-44} cy={-52} r={28} fill={palette.hair} />
      )}
      {outfit.hair === "braid" && (
        <g>
          <path
            d={`M -46 14 Q ${-72 + hairSway} 80 ${-62 + hairSway * 1.6} 162`}
            fill="none"
            stroke={palette.hair}
            strokeWidth={26}
            strokeLinecap="round"
          />
          <circle cx={-62 + hairSway * 1.6} cy={164} r={11} fill="#F0B010" />
        </g>
      )}

      {/* ear + head */}
      <circle cx={-6} cy={8} r={15} fill={shade(palette.skin, 0.1)} />
      <circle r={r} fill={palette.skin} />
      <circle cx={-6} cy={8} r={7} fill={shade(palette.skin, 0.2)} />

      {/* hair cap */}
      {outfit.hair !== "bald" && (
        <path
          d="M -63 18 A 64 64 0 0 1 50 -40 Q 28 -30 8 -33 Q -22 -40 -40 -12 Q -50 4 -63 18 Z"
          fill={palette.hair}
        />
      )}

      {/* face */}
      <circle cx={61} cy={9} r={8.5} fill={palette.skin} />
      <circle cx={31} cy={24} r={9} fill="#FF8A7A" opacity={0.28} />
      <g transform={`translate(28 -4) scale(1 ${eyeScaleY}) translate(-28 4)`}>
        <ellipse cx={28} cy={-4} rx={7.5} ry={10} fill={palette.eye} />
        <circle cx={30.5} cy={-7.5} r={2.6} fill="#fff" />
      </g>
      {lidCover > 0 && (
        <g>
          <rect x={19} y={-16} width={19} height={lidCover} rx={3} fill={palette.skin} />
          <path
            d={`M 19 ${-16 + lidCover} Q 28.5 ${-12 + lidCover} 38 ${-16 + lidCover}`}
            fill="none"
            stroke={shade(palette.skin, 0.45)}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      )}
      <Eyebrow expression={expression} color={outfit.hair === "bald" ? shade(palette.skin, 0.55) : palette.hair} />
      <Mouth expression={expression} color={lipColor} />

      {outfit.moustache && (
        <path
          d="M 33 24 Q 47 16 63 25 Q 50 31 33 28 Z"
          fill={palette.hair}
        />
      )}
      {outfit.beard && (
        <path
          d="M -2 40 Q 14 104 62 48 Q 44 70 28 62 Q 12 68 -2 40 Z"
          fill={palette.hair}
        />
      )}
      {outfit.tilak && (
        <g>
          <ellipse cx={43} cy={-37} rx={3.6} ry={10} fill="#E23B2E" />
        </g>
      )}
      {outfit.bindi && <circle cx={47} cy={-30} r={4.5} fill="#D6283A" />}

      {/* headwear */}
      {outfit.headwear === "turban" && (
        <g>
          <path
            d="M -68 -2 Q -76 -84 0 -92 Q 74 -88 66 -18 Q 34 -42 -8 -38 Q -42 -36 -68 -2 Z"
            fill={palette.top}
          />
          <path d="M -60 -28 Q -10 -64 60 -38" fill="none" stroke={palette.topTrim} strokeWidth={6} strokeLinecap="round" />
          <path d="M -66 -46 Q -10 -82 66 -58" fill="none" stroke={palette.bottomTrim} strokeWidth={5} strokeLinecap="round" />
          <circle cx={42} cy={-56} r={8} fill={palette.gold} />
          <circle cx={42} cy={-56} r={3.5} fill="#D94F4F" />
        </g>
      )}
      {outfit.headwear === "crown" && (
        <g>
          <path
            d="M -50 -36 L -52 -108 L -26 -82 L 2 -132 L 30 -82 L 54 -108 L 56 -36 Z"
            fill={palette.gold}
          />
          <rect x={-52} y={-48} width={110} height={16} rx={5} fill={shade(palette.gold, 0.15)} />
          <circle cx={2} cy={-40} r={6} fill="#D94F4F" />
          <circle cx={-26} cy={-40} r={4.5} fill="#2FA39A" />
          <circle cx={30} cy={-40} r={4.5} fill="#2FA39A" />
          <circle cx={2} cy={-132} r={5} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
};
