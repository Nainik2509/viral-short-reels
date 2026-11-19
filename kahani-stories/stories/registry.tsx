import type React from "react";
import {
  RIG_LINEUP_FRAMES,
  RigLineup,
} from "./_rig-test/RigLineup";
import {
  RIG_WALK_TEST_FRAMES,
  RigWalkTest,
} from "./_rig-test/RigWalkTest";
import {
  ONODA_TOTAL_FRAMES,
  Story as HirooOnodaStory,
} from "./hiroo-onoda/Story";
import {
  HirooOnodaThumbnail,
  HirooOnodaThumbnailLandscape,
} from "./hiroo-onoda/Thumbnail";

export interface StoryDef {
  /** Composition id used by `remotion render` / `remotion still`. */
  id: string;
  component: React.FC<any>;
  durationInFrames: number;
  width?: number;
  height?: number;
}

/**
 * Every composition in the studio. To add a story: copy stories/_template to
 * stories/<slug>/, then add one line here.
 */
export const STORIES: StoryDef[] = [
  { id: "RigWalkTest", component: RigWalkTest, durationInFrames: RIG_WALK_TEST_FRAMES },
  { id: "RigLineup", component: RigLineup, durationInFrames: RIG_LINEUP_FRAMES },
  {
    id: "HirooOnodaStory",
    component: HirooOnodaStory,
    durationInFrames: ONODA_TOTAL_FRAMES,
  },
  {
    id: "HirooOnodaThumbnail",
    component: HirooOnodaThumbnail,
    durationInFrames: 1,
    width: 1080,
    height: 1920,
  },
  {
    id: "HirooOnodaThumbnailLandscape",
    component: HirooOnodaThumbnailLandscape,
    durationInFrames: 1,
    width: 1280,
    height: 720,
  },
];
