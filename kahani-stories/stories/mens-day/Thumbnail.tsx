import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT_STACK } from "../../src/lib/constants";

/**
 * High-CTR Thumbnail for Men's Day Viral Reel ("The 10-Minute Car Silence").
 * Built strictly from THUMBNAIL_STYLE_GUIDE.md:
 * - Upper Third Two-Tone Headline: Pure White Setup + Golden Amber Punch
 * - Double-stroke heavy black outline (16px) for mobile feed contrast
 * - Character Micro-Expression: Poignant, relatable exhaustion in rain-lit car cockpit
 * - Interactive Story Props: Glowing 11:45 PM dashboard clock + "Bhai, tu theek hai?" message
 */

export const MensDayThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040711", overflow: "hidden" }}>
      {/* Background Image: Rain-streaked night car interior */}
      <Img
        src={staticFile("mens_day/scene1_car_interior_night.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
          filter: "contrast(1.18) brightness(0.95)",
        }}
      />

      {/* Top & Bottom Cinematic Gradient Overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 640,
          background:
            "linear-gradient(180deg, rgba(4,7,17,0.95) 0%, rgba(4,7,17,0.7) 65%, rgba(4,7,17,0) 100%)",
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
            "linear-gradient(0deg, rgba(4,7,17,0.96) 0%, rgba(4,7,17,0.7) 60%, rgba(4,7,17,0) 100%)",
          zIndex: 5,
        }}
      />

      {/* Upper-Third Two-Tone Headline Lockup */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          width: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
        }}
      >
        {/* Red Pill Badge: Curiosity Trigger */}
        <div
          style={{
            background: "#FF3B30",
            color: "#FFFFFF",
            fontFamily: FONT_STACK,
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: "0.08em",
            padding: "8px 24px",
            borderRadius: 30,
            textTransform: "uppercase",
            boxShadow: "0 4px 20px rgba(255, 59, 48, 0.5)",
            marginBottom: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⚠️</span>
          <span>WHY 80% OF MEN DO THIS</span>
        </div>

        {/* Line 1: Pure White Setup */}
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: 102,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            textTransform: "uppercase",
            textShadow: `
              -6px -6px 0 #000,  6px -6px 0 #000,
              -6px  6px 0 #000,  6px  6px 0 #000,
              -6px  0   0 #000,  6px  0   0 #000,
               0   -6px 0 #000,  0    6px 0 #000,
               0   14px 30px rgba(0,0,0,0.9)
            `,
          }}
        >
          THE 10-MINUTE
        </div>

        {/* Line 2: Golden Amber Punch */}
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: 128,
            fontWeight: 900,
            color: "#FFD700",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            marginTop: 6,
            textTransform: "uppercase",
            textShadow: `
              -6px -6px 0 #000,  6px -6px 0 #000,
              -6px  6px 0 #000,  6px  6px 0 #000,
              -6px  0   0 #000,  6px  0   0 #000,
               0   -6px 0 #000,  0    6px 0 #000,
               0   14px 30px rgba(0,0,0,0.9)
            `,
          }}
        >
          SILENCE 🤫
        </div>
      </div>

      {/* Floating Story Prop: WhatsApp Alert */}
      <div
        style={{
          position: "absolute",
          top: 480,
          right: 60,
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(16px)",
          border: "2px solid #25D366",
          borderRadius: 20,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 15px 40px rgba(0,0,0,0.7)",
          zIndex: 25,
        }}
      >
        <span style={{ fontSize: 28 }}>💬</span>
        <div>
          <div
            style={{
              color: "#94A3B8",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: FONT_STACK,
            }}
          >
            UNREAD MESSAGE
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: 800,
              fontFamily: FONT_STACK,
            }}
          >
            "Bhai, tu theek hai na?"
          </div>
        </div>
      </div>

      {/* Interactive Curiosity Prop: Digital Car Clock */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(4, 7, 17, 0.92)",
          backdropFilter: "blur(14px)",
          padding: "14px 26px",
          borderRadius: 40,
          border: "2px solid #FFD700",
          boxShadow: "0 10px 35px rgba(255, 215, 0, 0.35)",
          zIndex: 25,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#00E676",
            boxShadow: "0 0 12px #00E676",
          }}
        />
        <span
          style={{
            fontFamily: FONT_STACK,
            fontSize: 32,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "0.04em",
          }}
        >
          11:45 PM • DECOMPRESSION
        </span>
      </div>

      {/* Men's Day Badge Bottom Right */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          right: 60,
          background: "#FFD700",
          color: "#050811",
          fontFamily: FONT_STACK,
          fontSize: 26,
          fontWeight: 900,
          padding: "14px 28px",
          borderRadius: 40,
          letterSpacing: "0.06em",
          boxShadow: "0 8px 30px rgba(255, 215, 0, 0.4)",
          zIndex: 25,
        }}
      >
        INTERNATIONAL MEN'S DAY
      </div>
    </AbsoluteFill>
  );
};

export const MensDayThumbnailLandscape: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040711", overflow: "hidden" }}>
      <Img
        src={staticFile("mens_day/scene1_car_interior_night.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          filter: "contrast(1.15) brightness(0.9)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(4,7,17,0.95) 0%, rgba(4,7,17,0.6) 50%, rgba(4,7,17,0.2) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "#FF3B30",
            color: "#FFFFFF",
            fontFamily: FONT_STACK,
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "0.08em",
            padding: "8px 22px",
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          ⚠️ WHY 80% OF MEN DO THIS
        </div>
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: 90,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: "0 6px 20px rgba(0,0,0,0.8)",
          }}
        >
          THE 10-MINUTE
        </div>
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: 110,
            fontWeight: 900,
            color: "#FFD700",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            textShadow: "0 6px 20px rgba(0,0,0,0.8)",
          }}
        >
          SILENCE 🤫
        </div>
      </div>
    </AbsoluteFill>
  );
};
