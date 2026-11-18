import type { CharacterSpec, Outfit, Palette } from "./types";

const baseOutfit: Outfit = {
  top: "kurta",
  sleeves: "long",
  bottom: "pants",
  shawl: false,
  hair: "short",
  headwear: "none",
  beard: false,
  moustache: false,
  tilak: false,
  bindi: false,
  necklace: false,
};

const basePalette: Palette = {
  skin: "#C98B5E",
  hair: "#1E1510",
  top: "#E8A33D",
  topTrim: "#FFF4DC",
  bottom: "#F4EFE4",
  bottomTrim: "#C9A24A",
  shawl: "#D94F4F",
  shoes: "#5B3A24",
  gold: "#F0B010",
  eye: "#1B1210",
};

/** Merge overrides on top of the default look. */
export const makeSpec = (
  palette: Partial<Palette> = {},
  outfit: Partial<Outfit> = {},
  divine = false,
): CharacterSpec => ({
  palette: { ...basePalette, ...palette },
  outfit: { ...baseOutfit, ...outfit },
  divine,
});

/** Ready-made characters. Copy one and tweak colours/clothes for a new role. */
export const PRESETS = {
  /** A village boy in a saffron kurta. */
  boy: makeSpec(
    { skin: "#C48458", top: "#F28C28", topTrim: "#FFF4DC", bottom: "#F4EFE4", shoes: "#6B4428" },
    { hair: "short", bottom: "pants", sleeves: "short" },
  ),
  /** A village girl with a braid. */
  girl: makeSpec(
    { skin: "#BE7D52", hair: "#17100C", top: "#E2457A", topTrim: "#FFD36B", bottom: "#2E6FBA", bottomTrim: "#FFD36B", shoes: "#8A3B2A" },
    { top: "blouse", sleeves: "short", bottom: "skirt", hair: "braid", bindi: true, necklace: true },
  ),
  /** Dadi: grandmother with a white bun and a green shawl. */
  grandmother: makeSpec(
    { skin: "#B97F58", hair: "#ECECEC", top: "#8E3B6E", topTrim: "#F5D78A", bottom: "#5C2A55", bottomTrim: "#F5D78A", shawl: "#3F8F63", shoes: "#4A3326" },
    { top: "blouse", sleeves: "long", bottom: "skirt", hair: "bun", shawl: true, bindi: true },
  ),
  /** A king in a turban, kurta and dhoti. */
  king: makeSpec(
    { skin: "#C98B5E", hair: "#1A120D", top: "#7A1F3D", topTrim: "#F0B010", bottom: "#F7F0DC", bottomTrim: "#F0B010", shawl: "#2B4C9B", shoes: "#3B2A1C" },
    { top: "kurta", sleeves: "long", bottom: "dhoti", shawl: true, headwear: "turban", moustache: true, necklace: true, tilak: true },
  ),
  /** A deity: calm face, gold crown, halo. Always shown respectfully (see CLAUDE.md). */
  deity: makeSpec(
    { skin: "#7FA6D8", hair: "#14182E", top: "#F6D35A", topTrim: "#FFFFFF", bottom: "#F4C430", bottomTrim: "#FFFFFF", shawl: "#FFFFFF", shoes: "#E8C468", gold: "#F5B921" },
    { top: "bare", sleeves: "none", bottom: "dhoti", shawl: true, hair: "long", headwear: "crown", necklace: true, tilak: true },
    true,
  ),
} satisfies Record<string, CharacterSpec>;

export type PresetName = keyof typeof PRESETS;
