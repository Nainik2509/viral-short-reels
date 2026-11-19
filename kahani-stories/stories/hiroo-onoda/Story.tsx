import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions, SafeZoneGuide } from "../../src/captions";
import { FONT_STACK } from "../../src/lib/constants";
import type { WordTiming } from "../../src/lib/timings";
import timings from "./timings.json";

export const ONODA_TOTAL_FRAMES = 1275; // ~42.5 seconds @ 30fps

export const Story: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = timings.words as WordTiming[];

  // --------------------------------------------------------------------------
  // Camera & Scene Switching Timing (30 FPS)
  // Scene 1: 0 - 185   (0.0s - 6.1s)  WWII ended, soldier kept fighting 29 years
  // Scene 2: 185 - 435 (6.1s - 14.5s) Hiroo Onoda, 1944 Lubang Island, Never Surrender
  // Scene 3: 435 - 620 (14.5s - 20.7s) Japan lost, leaflets & family letters dropped
  // Scene 4: 620 - 755 (20.7s - 25.2s) Thought enemy tricks, soldiers died, completely alone
  // Scene 5: 755 - 985 (25.2s - 32.8s) 1974 young adventurer found him, commander condition
  // Scene 6: 985 - 1175 (32.8s - 39.2s) Flew old commander, reading imperial order
  // Scene 7: 1175 - 1275 (39.2s - 42.5s) One final order ended his war, sword surrender
  // --------------------------------------------------------------------------

  // Transition white-flash pulse for dramatic cut moments
  const flashOpacity = [185, 435, 620, 755, 985, 1175].reduce((acc, cutFrame) => {
    if (frame >= cutFrame && frame < cutFrame + 8) {
      return Math.max(acc, 1 - (frame - cutFrame) / 8);
    }
    return acc;
  }, 0);

  // Sound effect triggers helper
  const isSfxActive = (startF: number, durationF: number = 30) =>
    frame >= startF && frame < startF + durationF;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", overflow: "hidden" }}>
      {/* ==================================================================== */}
      {/* SCENE 1: THE HOOK CLAIM (Frames 0 - 185)                             */}
      {/* ==================================================================== */}
      {frame < 190 && (
        <AbsoluteFill
          style={{
            opacity: frame > 180 ? 1 - (frame - 180) / 10 : 1,
            transform: `scale(${interpolate(frame, [0, 185], [1.0, 1.12], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/scene1_young_soldier.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* Top Hook Pill Badge */}
          {frame >= 10 && (
            <div
              style={{
                position: "absolute",
                top: 130,
                left: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 20,
                transform: `scale(${spring({
                  frame: frame - 10,
                  fps,
                  config: { damping: 12, stiffness: 220 },
                })})`,
              }}
            >
              <div
                style={{
                  background: "#FF3B30",
                  color: "#FFFFFF",
                  fontFamily: FONT_STACK,
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "10px 32px",
                  borderRadius: 40,
                  border: "2px solid rgba(255,255,255,0.6)",
                  boxShadow: "0 8px 30px rgba(255,59,48,0.7)",
                }}
              >
                🔥 TRUE STORY • NEVER SURRENDER
              </div>
            </div>
          )}

          {/* Tactical Counter Overlay: 29 YEARS TICKER */}
          {frame >= 70 && (
            <div
              style={{
                position: "absolute",
                top: 240,
                left: 120,
                right: 120,
                background: "rgba(10, 20, 45, 0.9)",
                border: "3px solid #FFD700",
                borderRadius: 20,
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 20,
                boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(255,215,0,0.3)",
                transform: `scale(${spring({
                  frame: frame - 70,
                  fps,
                  config: { damping: 14, stiffness: 240 },
                })})`,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#A0B0D0",
                    fontFamily: FONT_STACK,
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                  }}
                >
                  STATUS
                </div>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontFamily: FONT_STACK,
                    fontSize: 34,
                    fontWeight: 900,
                  }}
                >
                  SOLITARY GUERRILLA
                </div>
              </div>
              <div
                style={{
                  background: "#FFD700",
                  color: "#05070E",
                  fontFamily: FONT_STACK,
                  fontSize: 42,
                  fontWeight: 900,
                  padding: "8px 24px",
                  borderRadius: 14,
                  letterSpacing: "-0.02em",
                }}
              >
                29 YEARS
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* SCENE 2: HIROO ONODA & THE 1944 MISSION ORDER (Frames 185 - 435)      */}
      {/* ==================================================================== */}
      {frame >= 180 && frame < 440 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 190
                ? (frame - 180) / 10
                : frame > 430
                ? 1 - (frame - 430) / 10
                : 1,
            transform: `scale(${interpolate(frame, [185, 435], [1.02, 1.14], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/scene1_young_soldier.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.65) saturate(1.2)",
            }}
          />

          {/* Real Archival Photo of Young Onoda (1944) */}
          <div
            style={{
              position: "absolute",
              top: 260,
              left: 140,
              width: 360,
              height: 460,
              borderRadius: 16,
              overflow: "hidden",
              border: "5px solid #FFFFFF",
              boxShadow: "0 15px 45px rgba(0,0,0,0.9)",
              transform: `rotate(-3deg) scale(${spring({
                frame: frame - 195,
                fps,
                config: { damping: 13, stiffness: 210 },
              })})`,
              zIndex: 15,
            }}
          >
            <Img
              src={staticFile("onoda/Hiroo_Onoda_young.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.85)",
                color: "#FFD700",
                fontFamily: FONT_STACK,
                fontSize: 18,
                fontWeight: 900,
                textAlign: "center",
                padding: "6px 0",
                letterSpacing: "0.06em",
              }}
            >
              2ND LT. HIROO ONODA (1944)
            </div>
          </div>

          {/* Map Graphic: Lubang Island, Philippines */}
          <div
            style={{
              position: "absolute",
              top: 290,
              right: 140,
              width: 380,
              height: 410,
              borderRadius: 16,
              background: "rgba(10, 25, 55, 0.95)",
              border: "3px solid #00F0FF",
              boxShadow: "0 15px 45px rgba(0,0,0,0.9)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(3deg) scale(${spring({
                frame: frame - 210,
                fps,
                config: { damping: 13, stiffness: 210 },
              })})`,
              zIndex: 15,
            }}
          >
            <Img
              src={staticFile("onoda/Lubang_Island_map.png")}
              style={{
                width: 280,
                height: 280,
                objectFit: "contain",
                filter: "drop-shadow(0 4px 10px rgba(0,240,255,0.4))",
              }}
            />
            <div
              style={{
                color: "#00F0FF",
                fontFamily: FONT_STACK,
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "0.05em",
                marginTop: 8,
              }}
            >
              📍 LUBANG ISLAND
            </div>
          </div>

          {/* Giant Military Order Briefing Card */}
          {frame >= 280 && (
            <div
              style={{
                position: "absolute",
                top: 770,
                left: 100,
                right: 100,
                background: "linear-gradient(135deg, #101B38 0%, #080D1D 100%)",
                border: "3px solid #FF3B30",
                borderRadius: 24,
                padding: "24px 30px",
                zIndex: 20,
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255,59,48,0.3)",
                transform: `scale(${spring({
                  frame: frame - 280,
                  fps,
                  config: { damping: 14, stiffness: 240 },
                })})`,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#FF3B30",
                  color: "#FFFFFF",
                  fontFamily: FONT_STACK,
                  fontSize: 20,
                  fontWeight: 900,
                  padding: "4px 16px",
                  borderRadius: 20,
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                IMPERIAL DIRECTIVE • 1944
              </div>
              <div
                style={{
                  color: "#FFD700",
                  fontFamily: FONT_STACK,
                  fontSize: 44,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                }}
              >
                ONE ORDER: NEVER SURRENDER
              </div>
              <div
                style={{
                  color: "#E0E8FF",
                  fontFamily: FONT_STACK,
                  fontSize: 24,
                  fontWeight: 600,
                  marginTop: 10,
                  lineHeight: 1.3,
                }}
              >
                "You are forbidden to die by your own hand. We will return for you."
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* SCENE 3: LEAFLETS & MESSAGES FROM FAMILY (Frames 435 - 620)          */}
      {/* ==================================================================== */}
      {frame >= 430 && frame < 625 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 440
                ? (frame - 430) / 10
                : frame > 615
                ? 1 - (frame - 615) / 10
                : 1,
            transform: `scale(${interpolate(frame, [435, 620], [1.0, 1.12], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/scene2_falling_leaflets.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,14,0.7) 0%, rgba(5,7,14,0) 40%, rgba(5,7,14,0.85) 100%)",
            }}
          />

          {/* Real Historical Surrender Leaflet Floating in Center */}
          <div
            style={{
              position: "absolute",
              top: 280,
              left: 160,
              right: 160,
              height: 520,
              background: "#FFF8EA",
              borderRadius: 16,
              overflow: "hidden",
              border: "6px solid #D4AF37",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(212,175,55,0.4)",
              transform: `rotate(${Math.sin(frame / 20) * 3}deg) translateY(${
                Math.sin(frame / 15) * 12
              }px) scale(${spring({
                frame: frame - 445,
                fps,
                config: { damping: 14, stiffness: 220 },
              })})`,
              zIndex: 15,
            }}
          >
            <Img
              src={staticFile("onoda/WWII_Surrender_Leaflet.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.1)",
              }}
            />
            {/* Red Stamp Overlay: "ALLIED LEAFLET" */}
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "15%",
                transform: "rotate(-18deg)",
                border: "6px solid #FF3B30",
                color: "#FF3B30",
                fontFamily: FONT_STACK,
                fontSize: 48,
                fontWeight: 900,
                padding: "8px 24px",
                borderRadius: 12,
                letterSpacing: "0.08em",
                backgroundColor: "rgba(255,255,255,0.85)",
                boxShadow: "0 10px 30px rgba(255,59,48,0.5)",
              }}
            >
              WAR ENDED!
            </div>
          </div>

          {/* Psychological Badge: SUSPICION */}
          {frame >= 510 && (
            <div
              style={{
                position: "absolute",
                top: 840,
                left: 120,
                right: 120,
                background: "rgba(20, 10, 10, 0.92)",
                border: "3px solid #FF3B30",
                borderRadius: 20,
                padding: "16px 24px",
                textAlign: "center",
                zIndex: 20,
                transform: `scale(${spring({
                  frame: frame - 510,
                  fps,
                  config: { damping: 14, stiffness: 240 },
                })})`,
              }}
            >
              <div
                style={{
                  color: "#FF3B30",
                  fontFamily: FONT_STACK,
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: "0.05em",
                }}
              >
                ⚠️ "ENEMY DECEPTION!"
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontFamily: FONT_STACK,
                  fontSize: 24,
                  fontWeight: 600,
                  marginTop: 6,
                }}
              >
                Family letters were dismissed as Allied propaganda.
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* SCENE 4: SOLDIERS DIE - COMPLETELY ALONE (Frames 620 - 755)           */}
      {/* ==================================================================== */}
      {frame >= 615 && frame < 760 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 625
                ? (frame - 615) / 10
                : frame > 750
                ? 1 - (frame - 750) / 10
                : 1,
            transform: `scale(${interpolate(frame, [620, 755], [1.02, 1.15], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/scene3_alone_campfire.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Dark Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 65%, rgba(0,0,0,0) 30%, rgba(2,4,10,0.92) 90%)",
            }}
          />

          {/* Comrade Kozuka Archival Photo with cross-out */}
          <div
            style={{
              position: "absolute",
              top: 240,
              left: 120,
              width: 320,
              height: 420,
              borderRadius: 16,
              overflow: "hidden",
              border: "4px solid rgba(255,255,255,0.7)",
              boxShadow: "0 15px 45px rgba(0,0,0,0.9)",
              transform: "rotate(-4deg)",
              filter: "grayscale(0.8) contrast(1.2)",
              zIndex: 15,
            }}
          >
            <Img
              src={staticFile("onoda/Kozuka_kinshichi.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(180, 0, 0, 0.4)",
              }}
            >
              <span
                style={{
                  color: "#FF3B30",
                  fontSize: 140,
                  fontWeight: 900,
                  fontFamily: FONT_STACK,
                }}
              >
                ✕
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.85)",
                color: "#FFF",
                fontFamily: FONT_STACK,
                fontSize: 18,
                fontWeight: 800,
                textAlign: "center",
                padding: "6px 0",
              }}
            >
              PVT. KOZUKA (KILLED 1972)
            </div>
          </div>

          {/* Squad Attrition Tracker */}
          <div
            style={{
              position: "absolute",
              top: 280,
              right: 110,
              width: 440,
              background: "rgba(15, 20, 35, 0.95)",
              border: "3px solid #FFD700",
              borderRadius: 20,
              padding: "24px 20px",
              zIndex: 15,
              boxShadow: "0 15px 45px rgba(0,0,0,0.9)",
              transform: `scale(${spring({
                frame: frame - 630,
                fps,
                config: { damping: 14, stiffness: 230 },
              })})`,
            }}
          >
            <div
              style={{
                color: "#A0B0D0",
                fontFamily: FONT_STACK,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              LUBANG SQUAD COUNT
            </div>
            <div
              style={{
                color: "#FFFFFF",
                fontFamily: FONT_STACK,
                fontSize: 38,
                fontWeight: 900,
                margin: "12px 0",
              }}
            >
              <span style={{ textDecoration: "line-through", color: "#888" }}>
                4 SOLDIERS
              </span>
            </div>
            <div
              style={{
                display: "inline-block",
                background: "#FF3B30",
                color: "#FFF",
                fontFamily: FONT_STACK,
                fontSize: 36,
                fontWeight: 900,
                padding: "8px 24px",
                borderRadius: 14,
                letterSpacing: "0.02em",
                boxShadow: "0 6px 20px rgba(255,59,48,0.5)",
              }}
            >
              1 SURVIVOR ALONE
            </div>
          </div>

          {/* Giant "COMPLETELY ALONE" Badge */}
          {frame >= 690 && (
            <div
              style={{
                position: "absolute",
                top: 740,
                left: 100,
                right: 100,
                textAlign: "center",
                zIndex: 20,
                transform: `scale(${spring({
                  frame: frame - 690,
                  fps,
                  config: { damping: 12, stiffness: 250 },
                })})`,
              }}
            >
              <div
                style={{
                  color: "#FFD700",
                  fontFamily: FONT_STACK,
                  fontSize: 72,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.03em",
                  textShadow:
                    "-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 30px rgba(0,0,0,0.9)",
                }}
              >
                COMPLETELY ALONE
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontFamily: FONT_STACK,
                  fontSize: 30,
                  fontWeight: 800,
                  marginTop: 6,
                  textShadow: "0 4px 10px #000",
                }}
              >
                1972 • 27 YEARS IN ISOLATION
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* SCENE 5: 1974 - THE YOUNG ADVENTURER NORIO SUZUKI (Frames 755 - 985)  */}
      {/* ==================================================================== */}
      {frame >= 750 && frame < 990 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 760
                ? (frame - 750) / 10
                : frame > 980
                ? 1 - (frame - 980) / 10
                : 1,
            transform: `scale(${interpolate(frame, [755, 985], [1.0, 1.12], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/scene4_adventurer_encounter.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,14,0.7) 0%, rgba(5,7,14,0) 35%, rgba(5,7,14,0.85) 100%)",
            }}
          />

          {/* REAL 1974 HISTORIC PHOTO: ONODA & SUZUKI */}
          <div
            style={{
              position: "absolute",
              top: 240,
              left: 140,
              right: 140,
              height: 500,
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "16px 16px 50px 16px",
              boxShadow:
                "0 25px 65px rgba(0,0,0,0.95), 0 0 35px rgba(0,240,255,0.3)",
              border: "4px solid #00F0FF",
              transform: `rotate(-2deg) scale(${spring({
                frame: frame - 765,
                fps,
                config: { damping: 13, stiffness: 220 },
              })})`,
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
                fontSize: 22,
                fontWeight: 900,
                textAlign: "center",
                letterSpacing: "0.05em",
              }}
            >
              📷 GENUINE PHOTO: ONODA & SUZUKI (FEB 1974)
            </div>
          </div>

          {/* The Condition Dialogue Card */}
          {frame >= 860 && (
            <div
              style={{
                position: "absolute",
                top: 800,
                left: 100,
                right: 100,
                background: "rgba(10, 20, 40, 0.96)",
                border: "3px solid #FFD700",
                borderRadius: 22,
                padding: "24px 28px",
                zIndex: 20,
                boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
                transform: `scale(${spring({
                  frame: frame - 860,
                  fps,
                  config: { damping: 14, stiffness: 240 },
                })})`,
              }}
            >
              <div
                style={{
                  color: "#FF3B30",
                  fontFamily: FONT_STACK,
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                }}
              >
                ONODA'S ULTIMATUM
              </div>
              <div
                style={{
                  color: "#FFD700",
                  fontFamily: FONT_STACK,
                  fontSize: 34,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginTop: 8,
                }}
              >
                "I WILL NOT SURRENDER UNLESS MY COMMANDER ORDERS ME TO."
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* SCENE 6: COMMANDER TANIGUCHI & THE FINAL ORDER (Frames 985 - 1175)    */}
      {/* ==================================================================== */}
      {frame >= 980 && frame < 1180 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 990
                ? (frame - 980) / 10
                : frame > 1170
                ? 1 - (frame - 1170) / 10
                : 1,
            transform: `scale(${interpolate(frame, [985, 1175], [1.0, 1.14], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/scene5_commander_salute.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Golden Sunset Glow Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 40%, rgba(255,215,0,0.1) 0%, rgba(5,7,14,0.85) 90%)",
            }}
          />

          {/* Real Photo of 1974 Formal Surrender */}
          <div
            style={{
              position: "absolute",
              top: 250,
              left: 140,
              right: 140,
              height: 480,
              borderRadius: 20,
              overflow: "hidden",
              border: "5px solid #FFD700",
              boxShadow:
                "0 25px 65px rgba(0,0,0,0.95), 0 0 40px rgba(255,215,0,0.4)",
              transform: `scale(${spring({
                frame: frame - 995,
                fps,
                config: { damping: 13, stiffness: 220 },
              })})`,
              zIndex: 15,
            }}
          >
            <Img
              src={staticFile("onoda/Hiro_Onoda_surrender_1974.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.85)",
                color: "#FFD700",
                fontFamily: FONT_STACK,
                fontSize: 20,
                fontWeight: 900,
                textAlign: "center",
                padding: "8px 0",
                letterSpacing: "0.06em",
              }}
            >
              MAJOR TANIGUCHI RELIEVES ONODA • MARCH 9, 1974
            </div>
          </div>

          {/* Final Military Decree Badge */}
          {frame >= 1080 && (
            <div
              style={{
                position: "absolute",
                top: 780,
                left: 100,
                right: 100,
                background: "linear-gradient(135deg, #1C2440 0%, #0B1124 100%)",
                border: "3px solid #00E676",
                borderRadius: 22,
                padding: "24px 30px",
                zIndex: 20,
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(0,230,118,0.4)",
                transform: `scale(${spring({
                  frame: frame - 1080,
                  fps,
                  config: { damping: 14, stiffness: 240 },
                })})`,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#00E676",
                  color: "#05070E",
                  fontFamily: FONT_STACK,
                  fontSize: 20,
                  fontWeight: 900,
                  padding: "4px 18px",
                  borderRadius: 20,
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                COMMAND CONFIRMED
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontFamily: FONT_STACK,
                  fontSize: 38,
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                "AFTER 29 YEARS, YOU ARE RELIEVED OF ALL MILITARY DUTIES."
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* SCENE 7: RESOLUTION & PAYOFF (Frames 1175 - 1275)                    */}
      {/* ==================================================================== */}
      {frame >= 1170 && (
        <AbsoluteFill
          style={{
            opacity: frame < 1180 ? (frame - 1170) / 10 : 1,
            transform: `scale(${interpolate(frame, [1175, 1275], [1.0, 1.1], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("onoda/President_Marcos_and_Hiroo_Onoda.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.15) brightness(0.85)",
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,7,14,0.85) 0%, rgba(5,7,14,0.3) 40%, rgba(5,7,14,0.95) 100%)",
            }}
          />

          {/* Final Climax Text Lockup */}
          <div
            style={{
              position: "absolute",
              top: 320,
              left: 80,
              right: 80,
              textAlign: "center",
              zIndex: 20,
              transform: `scale(${spring({
                frame: frame - 1180,
                fps,
                config: { damping: 12, stiffness: 220 },
              })})`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#FFD700",
                color: "#05070E",
                fontFamily: FONT_STACK,
                fontSize: 28,
                fontWeight: 900,
                padding: "8px 28px",
                borderRadius: 40,
                letterSpacing: "0.06em",
                marginBottom: 24,
                boxShadow: "0 8px 30px rgba(255,215,0,0.6)",
              }}
            >
              1944 — 1974 • 29 YEARS
            </div>

            <div
              style={{
                fontFamily: FONT_STACK,
                fontSize: 84,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                textShadow:
                  "-5px -5px 0 #000, 5px -5px 0 #000, -5px 5px 0 #000, 5px 5px 0 #000, 0 10px 40px rgba(0,0,0,0.9)",
              }}
            >
              ONE ORDER
            </div>
            <div
              style={{
                fontFamily: FONT_STACK,
                fontSize: 92,
                fontWeight: 900,
                color: "#FFD700",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                textShadow:
                  "-5px -5px 0 #000, 5px -5px 0 #000, -5px 5px 0 #000, 5px 5px 0 #000, 0 10px 40px rgba(0,0,0,0.9)",
              }}
            >
              ENDED HIS WAR
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* TRANSITION WHITE FLASH EFFECT                                         */}
      {/* ==================================================================== */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity * 0.75,
            pointerEvents: "none",
            zIndex: 90,
          }}
        />
      )}

      {/* ==================================================================== */}
      {/* KINETIC 2-TONE CAPTIONS (Synced to Whisper Timings)                  */}
      {/* ==================================================================== */}
      {words.length > 0 && (
        <Captions
          words={words}
          wordsPerChunk={2}
          highlight={[
            "1945",
            "29",
            "years",
            "hiro",
            "onoda",
            "1944",
            "island",
            "never",
            "surrender",
            "war",
            "leaflets",
            "tricks",
            "died",
            "alone",
            "1974",
            "adventurer",
            "commander",
            "ended",
          ]}
          accent="#FFD700"
          fontSize={88}
        />
      )}

      {/* ==================================================================== */}
      {/* AUDIO TRACKS: VOICEOVER + DUCKED BGM + SYNCHRONIZED SFX              */}
      {/* ==================================================================== */}
      {/* 1. Primary AI Voiceover */}
      <Audio src={staticFile("voice/onoda_voiceover.mp3")} volume={1.0} />

      {/* 2. Cinematic Orchestral BGM (Ducked at -20dB) */}
      <Audio
        src={staticFile("music/industrial_cinematic_bgm.mp3")}
        volume={0.12}
      />

      {/* 3. Transition & Impact SFX */}
      {isSfxActive(0) && (
        <Audio src={staticFile("sfx/whoosh-cinematic.mp3")} volume={0.8} />
      )}
      {isSfxActive(25) && (
        <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.85} />
      )}
      {isSfxActive(70) && (
        <Audio src={staticFile("sfx/riser.mp3")} volume={0.65} />
      )}
      {isSfxActive(185) && (
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.75} />
      )}
      {isSfxActive(280) && (
        <Audio src={staticFile("sfx/glitch-1.mp3")} volume={0.7} />
      )}
      {isSfxActive(340) && (
        <Audio src={staticFile("sfx/impact-bass-2.mp3")} volume={0.85} />
      )}
      {isSfxActive(435) && (
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      )}
      {isSfxActive(460) && (
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.6} />
      )}
      {isSfxActive(620) && (
        <Audio src={staticFile("sfx/glitch-2.mp3")} volume={0.75} />
      )}
      {isSfxActive(690) && (
        <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.9} />
      )}
      {isSfxActive(755) && (
        <Audio src={staticFile("sfx/whoosh-short.mp3")} volume={0.75} />
      )}
      {isSfxActive(860) && (
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.6} />
      )}
      {isSfxActive(985) && (
        <Audio src={staticFile("sfx/whoosh-cinematic.mp3")} volume={0.8} />
      )}
      {isSfxActive(1080) && (
        <Audio src={staticFile("sfx/impact-bass-2.mp3")} volume={0.85} />
      )}
      {isSfxActive(1175) && (
        <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.95} />
      )}

      {/* Safe Zone Visual Guide (when enabled for verification) */}
      {showSafeZone && <SafeZoneGuide />}
    </AbsoluteFill>
  );
};
