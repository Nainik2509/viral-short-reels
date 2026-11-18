/** Canvas for every Kahani Stories video: vertical 9:16, 30 fps. */
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

/**
 * Pixels the Shorts / Reels / TikTok app UI covers. Anything that must be read
 * (captions, numbers, faces of deities) stays inside these margins.
 * Right side is the like/comment/share column; bottom is title + progress bar.
 */
export const SAFE_ZONE = {
  left: 120,
  right: 120,
  top: 250,
  bottom: 420,
} as const;

export const SAFE_RECT = {
  x: SAFE_ZONE.left,
  y: SAFE_ZONE.top,
  width: WIDTH - SAFE_ZONE.left - SAFE_ZONE.right,
  height: HEIGHT - SAFE_ZONE.top - SAFE_ZONE.bottom,
} as const;

/** Caption centre line: ~73 % of frame height (see ../STYLE_PROFILE.md). */
export const CAPTION_Y = 1410;

/** Heavy sans for Latin plus a Devanagari fallback that ships with macOS. */
export const FONT_STACK =
  '"Montserrat", "Poppins", "Noto Sans Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "Arial Black", Helvetica, Arial, sans-serif';
