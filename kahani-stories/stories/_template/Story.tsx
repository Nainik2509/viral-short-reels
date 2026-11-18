import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, SafeZoneGuide } from "../../src/captions";
import { Character, walkPhaseFor } from "../../src/rig";
import { Clouds, Hills, HILLS_DUSK, Sky, hillHeight } from "../../src/scene";
import timings from "./timings.json";
import type { WordTiming } from "../../src/lib/timings";

/**
 * Template story. To start a new one:
 *   1. cp -r stories/_template stories/<slug>
 *   2. write script.md, record voice/<slug>.mp3, run `npm run timings -- voice/<slug>.mp3`
 *   3. fill in storyboard.md, then rewrite the scene below to match it
 *   4. register it in stories/registry.tsx
 */
export const TEMPLATE_FRAMES = 90;

export const Story: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scroll = (frame / fps) * 200;
  const ground = HILLS_DUSK[2];
  const words = timings.words as WordTiming[];

  return (
    <AbsoluteFill>
      <Sky mood="dusk" />
      <Clouds />
      <Hills scroll={scroll} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Character
          spec="boy"
          x={400}
          y={hillHeight(ground, 400 + scroll)}
          scale={1.15}
          walk={1}
          walkPhase={walkPhaseFor(scroll, 1.15)}
        />
      </svg>
      {/* Voice-over: import { Audio, staticFile } from "remotion" and add <Audio src={staticFile("voice/<slug>.mp3")} /> */}
      {words.length > 0 && <Captions words={words} />}
      {showSafeZone && <SafeZoneGuide />}
    </AbsoluteFill>
  );
};
