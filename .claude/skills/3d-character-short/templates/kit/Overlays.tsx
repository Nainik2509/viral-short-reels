// 2D punch layer drawn OVER the 3D render: hook text, stamps, flashes and zoom punches.
// All are pure functions of the frame. Keep readable things inside the safe zone (config.ts).
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTION_Y, FONT, HEIGHT, SAFE, WIDTH } from "./config";
import { clamp, easeOutBack } from "./util";

const outline = (px: number) => ({ WebkitTextStroke: `${px}px #000`, paintOrder: "stroke fill" as const, textShadow: "0 8px 0 rgba(0,0,0,0.35)" });

/**
 * The HOOK: the claim of sentence one, big, in the top safe area for the first ~2 s.
 * `lines` = 1-3 short lines; wrap the key word in [brackets] to colour it with `accent`.
 */
export const HookText: React.FC<{ lines: string[]; from?: number; to?: number; accent?: string; top?: number; size?: number }> = ({ lines, from = 0, to = 66, accent = "#ffd23f", top = SAFE.top + 10, size = 128 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame > to + 8) return null;
  const out = clamp((to + 8 - frame) / 8);
  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: "#fff", textTransform: "uppercase", ...outline(Math.round(size * 0.13)) }}>
        {lines.map((ln, i) => {
          const age = Math.max(0, frame - from - i * 5);
          const pop = spring({ frame: age, fps, config: { damping: 12, stiffness: 240 }, durationInFrames: 12 });
          const parts = ln.split(/(\[[^\]]+\])/g).filter(Boolean);
          return (
            <div key={i} style={{ transform: `scale(${0.5 + 0.5 * pop}) rotate(${(i % 2 ? 1 : -1) * 1.5}deg)`, opacity: clamp(age / 3) }}>
              {parts.map((p, j) => (p.startsWith("[") ? <span key={j} style={{ color: accent }}>{p.slice(1, -1)}</span> : <span key={j}>{p}</span>))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Sticker-style stamp ("10/10", "DAY 1", "$24,500") that pops in with overshoot and fades out. */
export const Stamp: React.FC<{ text: string; at: number; dur?: number; x?: number; y?: number; rot?: number; color?: string; bg?: string; size?: number }> = ({ text, at, dur = 60, x = WIDTH / 2, y = 560, rot = -6, color = "#101010", bg = "#ffd23f", size = 120 }) => {
  const frame = useCurrentFrame();
  const age = frame - at;
  if (age < 0 || age > dur) return null;
  const s = easeOutBack(clamp(age / 9), 2.2);
  const fade = clamp((dur - age) / 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: fade, fontFamily: FONT, fontWeight: 900, fontSize: size, color, background: bg, padding: `${size * 0.1}px ${size * 0.28}px`, borderRadius: size * 0.3, border: `${Math.round(size * 0.06)}px solid #101010`, boxShadow: "0 12px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap", pointerEvents: "none" }}>
      {text}
    </div>
  );
};

/** White (or coloured) screen flash on the given frames; use on the cut after the hook and on impacts. */
export const Flash: React.FC<{ at: number[]; len?: number; color?: string; peak?: number }> = ({ at, len = 5, color = "#fff", peak = 0.85 }) => {
  const frame = useCurrentFrame();
  const hit = at.find((a) => frame >= a && frame < a + len);
  if (hit === undefined) return null;
  const o = peak * (1 - (frame - hit) / len);
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

/** Zoom punch: briefly scales its children (the 3D layer) on each hit, decaying over ~8 frames. */
export const Punch: React.FC<{ hits: { at: number; amt?: number }[]; children: React.ReactNode }> = ({ hits, children }) => {
  const frame = useCurrentFrame();
  let s = 1;
  for (const h of hits) { const a = frame - h.at; if (a >= 0 && a < 9) s += (h.amt ?? 0.06) * Math.pow(1 - a / 9, 2); }
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>;
};

/** Optional dark gradient behind captions so white text stays readable on bright sets. */
export const CaptionScrim: React.FC<{ strength?: number }> = ({ strength = 0.35 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: CAPTION_Y - 330, height: HEIGHT - (CAPTION_Y - 330), background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,${strength}))`, pointerEvents: "none" }} />
);
