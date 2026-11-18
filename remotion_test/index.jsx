import React from "react";
import { registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const Test = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#0f0c29,#302b63,#24243e)", justifyContent: "center", alignItems: "center", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div style={{ color: "white", fontSize: 110, fontWeight: 800, textAlign: "center", opacity, transform: `scale(${0.6 + 0.4 * s})` }}>
        Toolkit<br />Ready ✅
      </div>
    </AbsoluteFill>
  );
};

const Root = () => (
  <Composition id="TestClip" component={Test} durationInFrames={90} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
