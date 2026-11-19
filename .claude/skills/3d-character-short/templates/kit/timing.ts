// Lock visuals to spoken words. Word timings come from `npm run timings` (real voice) or
// templates/tools/estimate_timings.py (storyboard stage, before the voice exists). Same JSON shape either way.
export interface WordTiming { i: number; word: string; start: number; end: number; startFrame: number; endFrame: number }
export interface TimingsFile { audio: string; language: string; duration: number; fps: number; words: WordTiming[] }

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");

/** Index of the nth occurrence of a word or phrase ("oven", "burned water"). Throws if missing so typos fail loudly. */
export const findWordIndex = (words: WordTiming[], query: string, nth = 0): number => {
  const q = query.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i + q.length <= words.length; i++) {
    if (q.every((w, k) => norm(words[i + k].word) === w)) { if (seen === nth) return i; seen++; }
  }
  throw new Error(`cue word not found in timings: "${query}" (occurrence ${nth})`);
};

/**
 * Frame to trigger a visual for a spoken word. `lead` = frames BEFORE the word starts (default 2):
 * a reaction that lands slightly before its word feels in sync; one that lands after feels late.
 */
export const cue = (words: WordTiming[], query: string, opts: { nth?: number; lead?: number; end?: boolean } = {}): number => {
  const w = words[findWordIndex(words, query, opts.nth ?? 0)];
  return Math.max(0, (opts.end ? w.endFrame : w.startFrame) - (opts.lead ?? 2));
};

/** Last frame of the voice-over (+ a short tail so the final word is not clipped). */
export const totalFrames = (words: WordTiming[], tail = 16) => (words.length ? words[words.length - 1].endFrame + tail : tail);
