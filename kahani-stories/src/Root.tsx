import React from "react";
import { Composition } from "remotion";
import { STORIES } from "../stories/registry";
import { FPS, HEIGHT, WIDTH } from "./lib/constants";

export const Root: React.FC = () => (
  <>
    {STORIES.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.component}
        durationInFrames={s.durationInFrames}
        fps={FPS}
        width={s.width ?? WIDTH}
        height={s.height ?? HEIGHT}
      />
    ))}
  </>
);
