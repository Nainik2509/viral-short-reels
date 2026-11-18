import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Character, walkPhaseFor } from "../../src/rig";
import {
  Clouds,
  Diya,
  HILLS_DUSK,
  Hills,
  Moon,
  Petals,
  Sky,
  Sparks,
  hillHeight,
  hillSlope,
} from "../../src/scene";
import { ramp } from "../../src/lib/math";

/** 3-second smoke test: the rig walks across the hills, slows down and waves. */
export const RIG_WALK_TEST_FRAMES = 90;

const SCALE = 1.15;
const SPEED = 330; // world px per second while walking
const SCREEN_X = 400;
const NEAR = HILLS_DUSK[2];

const walkWeight = (f: number, fps: number) => 1 - ramp(f / fps, 2.0, 2.5);

export const RigWalkTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Distance walked so far: add up speed * walk weight for every frame before this one.
  let scroll = 0;
  for (let f = 0; f < frame; f++) scroll += (SPEED * walkWeight(f, fps)) / fps;

  const walk = walkWeight(frame, fps);
  const wave = ramp(t, 2.3, 2.7);
  const worldX = SCREEN_X + scroll;
  const groundY = hillHeight(NEAR, worldX);
  const tilt = (Math.atan(hillSlope(NEAR, worldX)) * 180) / Math.PI * 0.6;

  const diyaWorldX = 1500;
  const diyaX = diyaWorldX - scroll;
  const diyaY = hillHeight(NEAR, diyaWorldX) + 4;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sky mood="dusk" sun={{ x: 760, y: 1000, r: 110 }} />
      <Moon x={250} y={420} r={80} lit={0.85} opacity={0.9} />
      <Clouds count={6} seed={3} speed={26} color="#FFD9C2" opacity={0.7} />
      <Hills scroll={scroll} />
      {diyaX > -200 && diyaX < 1300 && (
        <>
          <Diya x={diyaX} y={diyaY} scale={0.9} lit={ramp(t, 0.3, 1.2)} />
          <Sparks x={diyaX} y={diyaY - 130} count={24} rise={280} size={6} seed={2} />
        </>
      )}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <Character
          spec="boy"
          x={SCREEN_X}
          y={groundY}
          scale={SCALE}
          tilt={tilt}
          walk={walk}
          walkPhase={walkPhaseFor(scroll, SCALE)}
          wave={wave}
          expression="smile"
        />
      </svg>
      <Petals count={22} seed={4} />
    </AbsoluteFill>
  );
};
