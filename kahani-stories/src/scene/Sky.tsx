import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HEIGHT, WIDTH } from "../lib/constants";
import { mix } from "../lib/color";
import { hash, lerp, rng, TAU } from "../lib/math";
import { Layer } from "./Layer";

export type SkyMood = "dawn" | "day" | "dusk" | "night";

interface MoodDef {
  top: string;
  mid: string;
  bottom: string;
  /** 0..1 how many stars show. */
  stars: number;
}

export const SKY_MOODS: Record<SkyMood, MoodDef> = {
  dawn: { top: "#3A4A8C", mid: "#E8908A", bottom: "#FFD08A", stars: 0.25 },
  day: { top: "#3C8CE0", mid: "#7CC4F2", bottom: "#D8F0FF", stars: 0 },
  dusk: { top: "#241B5E", mid: "#B8457A", bottom: "#FF9A4A", stars: 0.55 },
  night: { top: "#070B24", mid: "#101A4A", bottom: "#243A7C", stars: 1 },
};

export interface SunProps {
  x: number;
  y: number;
  r?: number;
  color?: string;
}

interface SkyProps {
  mood?: SkyMood;
  /** Blend toward this mood by `progress` (0..1): use it for day -> night turns. */
  toMood?: SkyMood;
  progress?: number;
  /** Set to draw a sun with a soft glow. */
  sun?: SunProps;
  /** Override how many stars show (0..1). */
  stars?: number;
}

/** Sky gradient, twinkling stars and an optional sun. */
export const Sky: React.FC<SkyProps> = ({
  mood = "dusk",
  toMood,
  progress = 0,
  sun,
  stars,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const a = SKY_MOODS[mood];
  const b = SKY_MOODS[toMood ?? mood];
  const p = toMood ? progress : 0;
  const top = mix(a.top, b.top, p);
  const midC = mix(a.mid, b.mid, p);
  const bottom = mix(a.bottom, b.bottom, p);
  const starAmount = stars ?? lerp(a.stars, b.stars, p);

  const next = rng(11);
  const starList = Array.from({ length: 90 }, (_, i) => ({
    x: next() * WIDTH,
    y: next() * HEIGHT * 0.55,
    r: 1.2 + next() * 2.6,
    // Lower stars appear later so they fade in last at dusk.
    threshold: next(),
    speed: 0.6 + next() * 1.6,
    phase: hash(i) * TAU,
  }));

  return (
    <Layer>
      <defs>
        <linearGradient id="kahani-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="55%" stopColor={midC} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
        <radialGradient id="kahani-sun-glow">
          <stop offset="0%" stopColor="#FFF2B0" stopOpacity={0.9} />
          <stop offset="40%" stopColor="#FFC25A" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#FF9A4A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#kahani-sky)" />

      {starList.map((s, i) => {
        const visible = starAmount > s.threshold ? 1 : 0;
        const tw = 0.55 + 0.45 * Math.sin(t * s.speed * 2 + s.phase);
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#FFF8E0"
            opacity={visible * tw}
          />
        );
      })}

      {sun && (
        <g transform={`translate(${sun.x} ${sun.y})`}>
          <circle
            r={(sun.r ?? 90) * 3.2 * (1 + 0.02 * Math.sin(t * 1.4))}
            fill="url(#kahani-sun-glow)"
          />
          <g transform={`rotate(${t * 4})`} opacity={0.18}>
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d={`M -14 ${-(sun.r ?? 90) * 1.2} L 14 ${-(sun.r ?? 90) * 1.2} L 0 ${-(sun.r ?? 90) * 3} Z`}
                fill="#FFF2B0"
                transform={`rotate(${i * 30})`}
              />
            ))}
          </g>
          <circle r={sun.r ?? 90} fill={sun.color ?? "#FFE27A"} />
        </g>
      )}
    </Layer>
  );
};
