import React from "react";
import { HEIGHT, WIDTH } from "../lib/constants";
import { shade } from "../lib/color";
import { Layer } from "./Layer";
import { HILLS_DUSK, hillHeight, type HillLayer } from "./terrain";
import { Trees, type TreesProps } from "./Trees";

const ridgeLine = (layer: HillLayer, scroll: number) => {
  const off = scroll * layer.parallax;
  const step = 24;
  let d = "";
  for (let x = 0; x <= WIDTH + step; x += step) {
    d += `${x === 0 ? "M" : " L"} ${x} ${hillHeight(layer, x + off).toFixed(1)}`;
  }
  return d;
};

/** One hill layer on its own. */
export const Hill: React.FC<{ layer: HillLayer; scroll: number }> = ({
  layer,
  scroll,
}) => {
  const line = ridgeLine(layer, scroll);
  return (
    <Layer>
      <path d={`${line} L ${WIDTH + 24} ${HEIGHT} L 0 ${HEIGHT} Z`} fill={layer.color} />
      <path
        d={line}
        fill="none"
        stroke={shade(layer.color, -0.2)}
        strokeWidth={4}
        opacity={0.7}
      />
    </Layer>
  );
};

interface HillsProps {
  /** World distance travelled so far (px). Drives the parallax of every layer. */
  scroll: number;
  layers?: HillLayer[];
  /** Trees standing on each layer (same order as `layers`). Leave an entry out for no trees. */
  trees?: Array<Omit<TreesProps, "layer" | "scroll"> | undefined>;
}

/**
 * Three layers of hills with their trees interleaved, far to near, each
 * scrolling at its own parallax speed.
 */
export const Hills: React.FC<HillsProps> = ({
  scroll,
  layers = HILLS_DUSK,
  trees = [
    { count: 9, minScale: 0.45, maxScale: 0.7, seed: 4 },
    { count: 7, minScale: 0.7, maxScale: 1.05, seed: 5 },
    { count: 4, minScale: 1.1, maxScale: 1.6, seed: 6 },
  ],
}) => (
  <>
    {layers.map((layer, i) => {
      const t = trees[i];
      return (
        <React.Fragment key={i}>
          <Hill layer={layer} scroll={scroll} />
          {t && <Trees layer={layer} scroll={scroll} {...t} />}
        </React.Fragment>
      );
    })}
  </>
);
