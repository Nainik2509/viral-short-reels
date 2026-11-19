// Canvas + safe-zone constants. These match kahani-stories/src/lib/constants.ts so captions/overlays line up.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

/** Pixels covered by the Shorts/Reels/TikTok UI. Anything the viewer must read stays inside. */
export const SAFE = { left: 120, right: 120, top: 250, bottom: 420 } as const;
/** Caption centre line (~73 % of the frame height). */
export const CAPTION_Y = 1410;

export const FONT = '"Montserrat", "Poppins", "Noto Sans Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "Arial Black", Helvetica, Arial, sans-serif';
