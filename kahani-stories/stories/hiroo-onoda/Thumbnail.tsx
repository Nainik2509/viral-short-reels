import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT_STACK } from "../../src/lib/constants";

/**
 * High-CTR Thumbnail for Hiroo Onoda Viral Reel.
 * Reverse-engineered from THUMBNAIL_STYLE_GUIDE.md:
 * - Archetype 3: High-Stakes Imminent Threat / Historical Mystery Hook
 * - Upper Third Two-Tone Headline: White Setup + Golden Amber Punch
 * - Double-stroke black outline (16px) for mobile feed readability
 * - Character Micro-Expression: Intense, vigilant soldier eyes with rim light
 * - Interactive Story Props: Red "NEVER SURRENDER" directive badge + Genuine 1974 photo
 */

export const HirooOnodaThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", overflow: "hidden" }}>
      {/* Background: Intense 3D Animated Soldier in Jungle */}
      <Img
        src={staticFile("onoda/scene1_young_soldier.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          filter: "contrast(1.15) brightness(0.95)",
        }}
      />

      {/* Top & Bottom Cinematic Gradient Overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 620,
          background:
            "linear-gradient(180deg, rgba(3,5,12,0.96) 0%, rgba(3,5,12,0.7) 65%, rgba(3,5,12,0) 100%)",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1080,
          height: 600,
          background:
            "linear-gradient(0deg, rgba(3,5,12,0.96) 0%, rgba(3,5,12,0.7) 60%, rgba(3,5,12,0) 100%)",
          zIndex: 5,
        }}
      />

      {/* Upper-Third Two-Tone Headline Lockup */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          width: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
        }}
      >
        {/* Red Pill Badge */}
        <div
          style={{
            background: "#FF3B30",
            color: "#FFFFFF",
            fontFamily: FONT_STACK,
            fontSize: 28,
            fontWeight: 900,
            padding: "12px 36px",
            borderRadius: 50,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            boxShadow: "0 10px 35px rgba(255, 59, 48, 0.75)",
            marginBottom: 20,
            border: "2px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          🔥 TRUE STORY • NEVER SURRENDER
        </div>

        {/* Line 1 (White Setup) */}
        <div
          style={{
            fontSize: 82,
            fontWeight: 900,
            fontFamily: FONT_STACK,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            WebkitTextStroke: "16px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 12px 35px rgba(0,0,0,0.95)",
          }}
        >
          WW2 ENDED IN 1945
        </div>

        {/* Line 2 (Golden Amber Punch) */}
        <div
          style={{
            fontSize: 98,
            fontWeight: 900,
            fontFamily: FONT_STACK,
            color: "#FFD700",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            marginTop: 4,
            WebkitTextStroke: "16px #000000",
            paintOrder: "stroke fill",
            textShadow:
              "0 12px 35px rgba(0,0,0,0.95), 0 0 40px rgba(255,215,0,0.4)",
          }}
        >
          HE FOUGHT FOR 29 YEARS!
        </div>
      </div>

      {/* Real Historical Photo Card in Lower Third (Authentic Polaroid Proof) */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 100,
          width: 380,
          height: 480,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: "14px 14px 50px 14px",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(0,240,255,0.4)",
          border: "4px solid #00F0FF",
          transform: "rotate(-5deg)",
          zIndex: 15,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <Img
            src={staticFile("onoda/Onoda_suzuki_1974.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            color: "#111",
            fontFamily: FONT_STACK,
            fontSize: 20,
            fontWeight: 900,
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        >
          REAL PHOTO: 1974
        </div>
      </div>

      {/* High-Stakes Red Hazard Badge (Lower Right) */}
      <div
        style={{
          position: "absolute",
          bottom: 250,
          right: 90,
          width: 440,
          background: "linear-gradient(135deg, #1C1220 0%, #0D0814 100%)",
          border: "4px solid #FF3B30",
          borderRadius: 24,
          padding: "24px 24px",
          zIndex: 15,
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(255,59,48,0.4)",
          transform: "rotate(3deg)",
        }}
      >
        <div
          style={{
            color: "#FF3B30",
            fontFamily: FONT_STACK,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          ⚠️ SECRET DIRECTIVE
        </div>
        <div
          style={{
            color: "#FFD700",
            fontFamily: FONT_STACK,
            fontSize: 40,
            fontWeight: 900,
            lineHeight: 1.15,
            marginTop: 8,
          }}
        >
          "NEVER SURRENDER. HOLD UNTIL DEATH."
        </div>
        <div
          style={{
            color: "#A0C0FF",
            fontFamily: FONT_STACK,
            fontSize: 22,
            fontWeight: 800,
            marginTop: 10,
          }}
        >
          📍 Lubang Island Jungle
        </div>
      </div>

      {/* Bottom Subtitle / Curiosity Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(10, 20, 45, 0.95)",
            border: "2px solid #FFD700",
            borderRadius: 40,
            padding: "12px 36px",
            color: "#FFFFFF",
            fontFamily: FONT_STACK,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "0.04em",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          HOW DID ONE OLD ORDER FINALLY STOP HIM? ⬇️
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 16:9 Landscape YouTube Thumbnail (1280x720)
 */
export const HirooOnodaThumbnailLandscape: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", overflow: "hidden" }}>
      {/* Background Image: Scene 1 right-anchored */}
      <Img
        src={staticFile("onoda/scene1_young_soldier.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "65% 25%",
          filter: "contrast(1.15) brightness(0.9)",
        }}
      />

      {/* Left-side Dark Vignette for Typography Contrast */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 800,
          height: 720,
          background:
            "linear-gradient(90deg, rgba(3,5,12,0.97) 0%, rgba(3,5,12,0.85) 60%, rgba(3,5,12,0) 100%)",
          zIndex: 5,
        }}
      />

      {/* Left Content Area */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 70,
          width: 720,
          zIndex: 20,
        }}
      >
        {/* Red Pill Badge */}
        <div
          style={{
            display: "inline-block",
            background: "#FF3B30",
            color: "#FFFFFF",
            fontFamily: FONT_STACK,
            fontSize: 20,
            fontWeight: 900,
            padding: "8px 24px",
            borderRadius: 30,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            boxShadow: "0 8px 25px rgba(255, 59, 48, 0.7)",
            marginBottom: 16,
            border: "2px solid rgba(255,255,255,0.5)",
          }}
        >
          🔥 TRUE STORY • NEVER SURRENDER
        </div>

        {/* Two-Tone Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            fontFamily: FONT_STACK,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            WebkitTextStroke: "12px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 8px 25px rgba(0,0,0,0.9)",
          }}
        >
          WW2 ENDED IN 1945
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 900,
            fontFamily: FONT_STACK,
            color: "#FFD700",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            marginTop: 4,
            WebkitTextStroke: "12px #000000",
            paintOrder: "stroke fill",
            textShadow:
              "0 8px 25px rgba(0,0,0,0.9), 0 0 30px rgba(255,215,0,0.4)",
          }}
        >
          HE FOUGHT 29 YEARS!
        </div>

        {/* Lower Warning Card */}
        <div
          style={{
            marginTop: 35,
            display: "inline-block",
            background: "rgba(10, 20, 45, 0.95)",
            border: "3px solid #FFD700",
            borderRadius: 16,
            padding: "14px 24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              color: "#FF3B30",
              fontFamily: FONT_STACK,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: "0.06em",
            }}
          >
            ORDER #1: NEVER SURRENDER
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontFamily: FONT_STACK,
              fontSize: 26,
              fontWeight: 900,
              marginTop: 4,
            }}
          >
            Until His Commander Returned in 1974
          </div>
        </div>
      </div>

      {/* Real Historic Photo Overlay in Lower Right */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          right: 50,
          width: 250,
          height: 310,
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: "10px 10px 35px 10px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
          border: "3px solid #00F0FF",
          transform: "rotate(4deg)",
          zIndex: 15,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 8,
          }}
        >
          <Img
            src={staticFile("onoda/Onoda_suzuki_1974.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            color: "#111",
            fontFamily: FONT_STACK,
            fontSize: 14,
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          GENUINE PHOTO 1974
        </div>
      </div>
    </AbsoluteFill>
  );
};
