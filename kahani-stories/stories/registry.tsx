import type React from "react";
import {
  RIG_LINEUP_FRAMES,
  RigLineup,
} from "./_rig-test/RigLineup";
import {
  RIG_WALK_TEST_FRAMES,
  RigWalkTest,
} from "./_rig-test/RigWalkTest";

export interface StoryDef {
  /** Composition id used by `remotion render` / `remotion still`. */
  id: string;
  component: React.FC;
  durationInFrames: number;
}

/**
 * Every composition in the studio. To add a story: copy stories/_template to
 * stories/<slug>/, then add one line here.
 */
export const STORIES: StoryDef[] = [
  { id: "RigWalkTest", component: RigWalkTest, durationInFrames: RIG_WALK_TEST_FRAMES },
  { id: "RigLineup", component: RigLineup, durationInFrames: RIG_LINEUP_FRAMES },
];
