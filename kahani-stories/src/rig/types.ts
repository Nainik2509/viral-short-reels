export type Expression = "calm" | "smile" | "sad" | "surprised";

/** Every colour of a character. Change these to re-colour the same rig. */
export interface Palette {
  skin: string;
  hair: string;
  /** Kurta / blouse / robe body colour. */
  top: string;
  topTrim: string;
  /** Pants / dhoti / skirt. */
  bottom: string;
  bottomTrim: string;
  /** Shawl, dupatta, uttariya. */
  shawl: string;
  shoes: string;
  /** Jewellery, crown, halo. */
  gold: string;
  eye: string;
}

/** What a character wears. Change these to re-dress the same rig. */
export interface Outfit {
  top: "kurta" | "blouse" | "bare";
  sleeves: "long" | "short" | "none";
  bottom: "pants" | "dhoti" | "skirt";
  shawl: boolean;
  hair: "short" | "long" | "bun" | "braid" | "bald";
  headwear: "none" | "turban" | "crown";
  beard: boolean;
  moustache: boolean;
  tilak: boolean;
  bindi: boolean;
  necklace: boolean;
}

export interface CharacterSpec {
  palette: Palette;
  outfit: Outfit;
  /**
   * A deity or sacred figure. Forces a calm / gently smiling face, soft
   * lowered eyes, a halo, and the blessing gesture instead of a casual wave.
   */
  divine?: boolean;
}

/** Joint angles, all in radians. Positive "forward" = toward the way the character faces. */
export interface LimbAngles {
  /** Thigh / upper-arm swing, forward positive. */
  swing: number;
  /** Knee / elbow bend, always >= 0, folds the lower limb backward (leg) or forward (arm). */
  bend: number;
}

export interface MotionState {
  nearLeg: LimbAngles & { foot: number; reach: number };
  farLeg: LimbAngles & { foot: number; reach: number };
  nearArm: LimbAngles;
  farArm: LimbAngles;
  /** Height of the hip above the ground (px at scale 1). */
  hipHeight: number;
  /** Torso lean forward (radians). */
  lean: number;
  /** Head tilt (radians). */
  headTilt: number;
  /** 1 = eyes shut. */
  blink: number;
  /** Chest scale, around 1. */
  breatheScale: number;
  /** Shoulder lift in px from breathing. */
  breatheLift: number;
  /** Walk weight 0..1. */
  walk: number;
  /** Wave weight 0..1. */
  wave: number;
  /** Phase used to flutter cloth. */
  clothPhase: number;
}
