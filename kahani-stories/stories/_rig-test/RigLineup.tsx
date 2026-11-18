import React from "react";
import { AbsoluteFill } from "remotion";
import { Character, type PresetName } from "../../src/rig";
import { HILLS_DAY, Sky, hillHeight } from "../../src/scene";

export const RIG_LINEUP_FRAMES = 90;

const ORDER: PresetName[] = ["boy", "girl", "grandmother", "king", "deity"];

/** Every preset standing side by side, with a few re-coloured / re-dressed variants below. */
export const RigLineup: React.FC = () => {
  const ground = HILLS_DAY[2];
  const y1 = hillHeight(ground, 0) - 330;
  return (
    <AbsoluteFill>
      <Sky mood="day" />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <rect y={y1 - 40} width={1080} height={1920} fill="#5FAE6E" />
        {ORDER.map((name, i) => (
          <Character
            key={name}
            spec={name}
            x={110 + i * 215}
            y={y1}
            scale={0.52}
            seed={i * 3}
            wave={name === "boy" || name === "girl" ? 1 : name === "deity" ? 1 : 0}
            expression={name === "boy" ? "smile" : "calm"}
          />
        ))}
        {/* Re-coloured and re-dressed with no new code: same rig, different props. */}
        <Character spec="boy" palette={{ top: "#2E9C8F", skin: "#8D5A3C" }} outfit={{ sleeves: "long", bottom: "dhoti", tilak: true }} x={200} y={y1 + 520} scale={0.52} seed={9} />
        <Character spec="king" palette={{ top: "#1F4E9B" }} outfit={{ headwear: "none", hair: "short", beard: true }} x={430} y={y1 + 520} scale={0.52} seed={4} walk={1} walkHz={0.8} />
        <Character spec="grandmother" palette={{ shawl: "#E2457A" }} x={660} y={y1 + 520} scale={0.52} seed={6} walk={1} walkHz={0.7} />
        <Character spec="girl" palette={{ top: "#7A4FC2", bottom: "#E2A02E" }} outfit={{ hair: "long" }} x={890} y={y1 + 520} scale={0.52} seed={2} expression="surprised" />
      </svg>
    </AbsoluteFill>
  );
};
