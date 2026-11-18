import React, { useMemo } from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTION_Y, FONT_STACK, SAFE_RECT, WIDTH } from "../lib/constants";
import { THEME } from "../lib/theme";
import { chunkWords, type WordTiming } from "../lib/timings";

interface CaptionsProps {
  words: WordTiming[];
  /** 1 to 3 words on screen at a time (default 2). */
  wordsPerChunk?: number;
  /** Words (lower case, punctuation ignored) to show in the accent colour. Numbers are always accented. */
  highlight?: string[];
  accent?: string;
  fontSize?: number;
}

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/**
 * Bold white captions with a thick black outline, 1-3 words at a time, locked
 * to the voice. They always sit inside the safe zone (see lib/constants.ts):
 * centred on CAPTION_Y, never wider than the safe rectangle.
 */
export const Captions: React.FC<CaptionsProps> = ({
  words,
  wordsPerChunk = 2,
  highlight = [],
  accent = THEME.gold,
  fontSize = 96,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const chunks = useMemo(
    () => chunkWords(words, wordsPerChunk),
    [words, wordsPerChunk],
  );
  const hl = useMemo(() => new Set(highlight.map(clean)), [highlight]);

  // Hold each chunk until the next one starts, but never longer than 0.35 s of silence.
  const idx = chunks.findIndex((c, i) => {
    const holdUntil = Math.min(
      chunks[i + 1]?.start ?? Infinity,
      c.end + 0.35,
    );
    return t >= c.start && t < holdUntil;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];

  const age = Math.max(0, (t - chunk.start) * fps);
  const pop = spring({ frame: age, fps, config: { damping: 14, stiffness: 260 }, durationInFrames: 10 });
  const scale = 0.82 + 0.18 * pop;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: SAFE_RECT.x,
          width: SAFE_RECT.width,
          top: CAPTION_Y,
          transform: `translateY(-50%) scale(${scale})`,
          textAlign: "center",
          fontFamily: FONT_STACK,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.1,
          color: THEME.white,
          WebkitTextStroke: `${Math.round(fontSize * 0.14)}px ${THEME.black}`,
          paintOrder: "stroke fill",
          textShadow: "0 6px 0 rgba(0,0,0,0.35)",
          maxWidth: WIDTH - 240,
        }}
      >
        {chunk.words.map((w, i) => {
          const key = clean(w.word);
          const accented = hl.has(key) || /\d/.test(key);
          return (
            <span key={w.i} style={{ color: accented ? accent : THEME.white }}>
              {i > 0 ? " " : ""}
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
