import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK } from "../lib/constants";

interface BrandHeaderProps {
  partNumber: number;
  totalParts?: number;
  seriesName?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  partNumber,
  totalParts = 10,
  seriesName = "कर्ण की दास्तान",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  // Gentle 3D float on the emblem
  const logoRot = Math.sin((frame * Math.PI) / 60) * 5;

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 50,
        right: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
        transform: `scale(${pop})`,
        pointerEvents: "none",
      }}
    >
      {/* Left: Main Channel Identity (Doodle Story Tales Concept 1 3D Emblem) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(18, 6, 36, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "2px solid rgba(255, 215, 0, 0.75)",
          borderRadius: 40,
          padding: "6px 20px 6px 8px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(255,215,0,0.25)",
        }}
      >
        {/* 3D Animated Logo Emblem (Magic Storybook & Star) */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 0 18px rgba(255,215,0,0.85)",
            transform: `rotate(${logoRot}deg) scale(1.05)`,
            border: "2px solid #FFD700",
            backgroundColor: "#0A0318",
          }}
        >
          <Img
            src={staticFile("brand/logo_3d_render.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Brand Text Stack */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: FONT_STACK,
              fontSize: 19,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
              lineHeight: 1.05,
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            DOODLE STORY TALES
          </span>
          <span
            style={{
              fontFamily: FONT_STACK,
              fontSize: 12,
              fontWeight: 800,
              color: "#FFD700",
              letterSpacing: "0.08em",
              lineHeight: 1.15,
            }}
          >
            @DoodleStoryTalesOfficial
          </span>
        </div>
      </div>

      {/* Right: Series & Part Number Indicator Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, rgba(230, 57, 70, 0.94) 0%, rgba(180, 20, 40, 0.96) 100%)",
          border: "2px solid #FFFFFF",
          borderRadius: 30,
          padding: "8px 20px",
          boxShadow:
            "0 8px 25px rgba(230,57,70,0.6), 0 0 15px rgba(255,255,255,0.4)",
        }}
      >
        {/* Pulsing Star Dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#FFD700",
            boxShadow: "0 0 10px #FFD700",
            transform: `scale(${1 + 0.25 * Math.sin((frame * Math.PI) / 15)})`,
          }}
        />

        {/* Part Number Lockup */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span
            style={{
              fontFamily: FONT_STACK,
              fontSize: 20,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textShadow: "0 2px 6px rgba(0,0,0,0.7)",
              lineHeight: 1,
            }}
          >
            PART {String(partNumber).padStart(2, "0")}/{String(totalParts).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: FONT_STACK,
              fontSize: 11,
              fontWeight: 800,
              color: "#FFD700",
              marginTop: 2,
              lineHeight: 1,
            }}
          >
            {seriesName}
          </span>
        </div>
      </div>
    </div>
  );
};
