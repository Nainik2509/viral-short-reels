/** Shape of the JSON written by tools/timings.py. */
export interface WordTiming {
  /** Index of the word in the whole voice-over. */
  i: number;
  word: string;
  /** Seconds. */
  start: number;
  end: number;
  /** Same times as frames at the fps the file was made with (30). */
  startFrame: number;
  endFrame: number;
}

export interface TimingsFile {
  audio: string;
  language: string;
  duration: number;
  fps: number;
  words: WordTiming[];
}

export interface CaptionChunk {
  text: string;
  start: number;
  end: number;
  words: WordTiming[];
}

/**
 * Group words into short caption chunks (default 2 words, never more than 3),
 * breaking early at sentence ends and at pauses longer than `maxGap` seconds.
 */
export const chunkWords = (
  words: WordTiming[],
  maxWords = 2,
  maxGap = 0.4,
): CaptionChunk[] => {
  const limit = Math.min(3, Math.max(1, maxWords));
  const chunks: CaptionChunk[] = [];
  let cur: WordTiming[] = [];

  const flush = () => {
    if (cur.length === 0) return;
    chunks.push({
      text: cur.map((w) => w.word).join(" "),
      start: cur[0].start,
      end: cur[cur.length - 1].end,
      words: cur,
    });
    cur = [];
  };

  words.forEach((w, idx) => {
    const prev = cur[cur.length - 1];
    if (prev && w.start - prev.end > maxGap) flush();
    cur.push(w);
    const endsSentence = /[.!?।,;:]$/.test(w.word);
    const next = words[idx + 1];
    const gapAfter = next ? next.start - w.end : 0;
    if (cur.length >= limit || endsSentence || gapAfter > maxGap) flush();
  });
  flush();
  return chunks;
};
