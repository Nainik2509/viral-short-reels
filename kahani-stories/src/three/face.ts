// Face parameters + expression library + blink + lip-sync helpers.
import { clamp, hash, lerp } from "./util";

export interface Face {
  /** brow height: -1 (lowered) .. +1 (raised) */
  browY: number;
  /** brow tilt: + angry (inner ends down), - worried/sad (inner ends up) */
  browAngle: number;
  /** eye openness 0 (shut) .. 1 (normal) .. 1.25 (wide) */
  eyeOpen: number;
  /** -1 frown .. 0 flat .. 1 big smile */
  smile: number;
  /** jaw open 0..1 */
  mouthOpen: number;
  /** mouth width multiplier 0.6 (oo) .. 1 .. 1.4 (ee) */
  mouthWide: number;
  /** cheek puff / smile-squint 0..1 */
  cheek: number;
  /** show top teeth 0..1 */
  teeth: number;
  /** pupil offset, -1..1 (screen right = +x) */
  lookX: number;
  lookY: number;
}

export const NEUTRAL_FACE: Face = { browY: 0, browAngle: 0, eyeOpen: 1, smile: 0.25, mouthOpen: 0, mouthWide: 1, cheek: 0.1, teeth: 0, lookX: 0, lookY: 0 };

export const mkFace = (f: Partial<Face> = {}): Face => ({ ...NEUTRAL_FACE, ...f });

export const FACES = {
  neutral: mkFace(),
  happy: mkFace({ browY: 0.25, eyeOpen: 0.92, smile: 0.9, mouthOpen: 0.12, cheek: 0.75, teeth: 0.6 }),
  grin: mkFace({ browY: 0.35, eyeOpen: 0.85, smile: 1, mouthOpen: 0.3, mouthWide: 1.25, cheek: 1, teeth: 1 }),
  laugh: mkFace({ browY: 0.4, eyeOpen: 0.45, smile: 1, mouthOpen: 0.85, mouthWide: 1.2, cheek: 1, teeth: 1 }),
  shock: mkFace({ browY: 1, eyeOpen: 1.3, smile: -0.1, mouthOpen: 0.8, mouthWide: 0.75, cheek: 0, teeth: 0 }),
  scream: mkFace({ browY: 0.8, browAngle: -0.4, eyeOpen: 1.2, smile: -0.2, mouthOpen: 1, mouthWide: 1.1, teeth: 0.8 }),
  sad: mkFace({ browY: -0.1, browAngle: -0.8, eyeOpen: 0.75, smile: -0.7, mouthOpen: 0.02, cheek: 0 }),
  cry: mkFace({ browY: 0, browAngle: -1, eyeOpen: 0.5, smile: -0.8, mouthOpen: 0.5, mouthWide: 1.1, cheek: 0.4 }),
  angry: mkFace({ browY: -0.5, browAngle: 1, eyeOpen: 0.8, smile: -0.6, mouthOpen: 0.1, teeth: 0.4 }),
  smug: mkFace({ browY: 0.15, browAngle: 0.25, eyeOpen: 0.7, smile: 0.7, mouthOpen: 0, cheek: 0.5, lookX: 0.4 }),
  worried: mkFace({ browY: 0.35, browAngle: -0.75, eyeOpen: 1.1, smile: -0.35, mouthOpen: 0.08 }),
  think: mkFace({ browY: 0.1, browAngle: 0.35, eyeOpen: 0.85, smile: 0, mouthWide: 0.8, lookX: -0.4, lookY: 0.5 }),
  proud: mkFace({ browY: 0.3, eyeOpen: 0.6, smile: 0.85, cheek: 0.8, mouthOpen: 0.05 }),
  sleepy: mkFace({ browY: -0.2, eyeOpen: 0.25, smile: 0.1, mouthOpen: 0.06 }),
  love: mkFace({ browY: 0.3, browAngle: -0.25, eyeOpen: 1.05, smile: 0.95, mouthOpen: 0.08, cheek: 0.9 }),
} satisfies Record<string, Face>;

export type FaceName = keyof typeof FACES;

export const blendFace = (a: Face, b: Face, t: number): Face => {
  if (t >= 1) return b;
  if (t <= 0) return a;
  const o = { ...a };
  (Object.keys(a) as (keyof Face)[]).forEach((k) => (o[k] = lerp(a[k], b[k], t)));
  return o;
};

/** Crossfaded expression track, same idea as `track` in pose.ts: [{at:0,face:"neutral"},{at:90,face:"shock"}]. */
export interface FaceKey { at: number; face: FaceName; blend?: number }
export const faceTrack = (keys: FaceKey[], frame: number): Face => {
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (frame >= keys[k].at) i = k;
  const cur = keys[i];
  const prev = keys[Math.max(0, i - 1)];
  const t = i === 0 ? 1 : clamp((frame - cur.at) / Math.max(1, cur.blend ?? 5));
  return blendFace(FACES[prev.face], FACES[cur.face], t);
};

/** Blink amount 0 (open) .. 1 (shut). A blink every ~2-4 s, 5 frames long, different per seed. */
export const blinkAmount = (frame: number, seed = 0) => {
  const period = 62 + Math.floor(hash(seed * 7.7) * 55);
  const n = Math.floor((frame + seed * 53) / period);
  const startOffset = Math.floor(hash(n * 3.1 + seed) * (period - 8));
  const local = ((frame + seed * 53) % period) - startOffset;
  if (local < 0 || local > 5) return 0;
  return local <= 2 ? local / 2 : 1 - (local - 2) / 3;
};

// ───────────────────────── lip-sync from word timings ─────────────────────────

export interface WordT { word: string; start: number; end: number }

/** One speaker line: which character says it, over which frames (look up frames in timings.json). */
export interface TalkWindow { who: string; from: number; to: number }

const VOWEL_SHAPES: Record<string, { open: number; wide: number }> = {
  a: { open: 1, wide: 1.05 }, e: { open: 0.55, wide: 1.3 }, i: { open: 0.35, wide: 1.4 },
  o: { open: 0.8, wide: 0.7 }, u: { open: 0.45, wide: 0.6 }, y: { open: 0.4, wide: 1.2 },
};

/**
 * Mouth shape for a character at `frame`. Words are timed (start/end seconds); each word is split into
 * syllables (vowel groups) and the jaw opens/closes once per syllable using that vowel's mouth shape.
 * Non-Latin words (Hindi etc.) fall back to ~1 syllable per 2.4 letters with an "a" shape.
 * Returns {open, wide} to ADD to the face (open 0..1).
 */
export const lipsync = (words: WordT[], frame: number, fps = 30, windows?: TalkWindow[], who?: string): { open: number; wide: number; energy: number } => {
  const t = frame / fps;
  if (windows && who) {
    const w = windows.find((x) => x.who === who && frame >= x.from && frame <= x.to);
    if (!w) return { open: 0, wide: 1, energy: 0 };
  }
  const w = words.find((x) => t >= x.start - 0.02 && t <= x.end + 0.04);
  if (!w) return { open: 0, wide: 1, energy: 0 };
  const word = w.word.toLowerCase().replace(/[^\p{L}]/gu, "");
  const vowels = word.match(/[aeiouy]+/g);
  const syl = vowels ? vowels.length : Math.max(1, Math.round(word.length / 2.4));
  const p = clamp((t - w.start) / Math.max(0.08, w.end - w.start));
  const idx = Math.min(syl - 1, Math.floor(p * syl));
  const sp = p * syl - idx; // 0..1 inside the syllable
  const shape = VOWEL_SHAPES[(vowels ? vowels[idx] : "a")[0]] ?? VOWEL_SHAPES.a;
  const env = Math.sin(Math.PI * clamp(sp * 0.9 + 0.05)); // opens then closes inside each syllable
  return { open: clamp(shape.open * (0.25 + 0.75 * env)), wide: shape.wide, energy: 0.5 + 0.5 * env };
};

/** Merge lip-sync into a face: the jaw follows the speech, the smile is toned down while talking, cheeks/brows/eyes are kept. */
export const withSpeech = (face: Face, sp: { open: number; wide: number }): Face =>
  sp.open <= 0.001
    ? face
    : { ...face, mouthOpen: Math.max(face.mouthOpen, sp.open), mouthWide: face.mouthWide * 0.5 + sp.wide * 0.5, smile: face.smile * 0.55, teeth: Math.max(face.teeth, sp.open * 0.6) };
