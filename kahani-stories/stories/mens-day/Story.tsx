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

export const MENS_DAY_TOTAL_FRAMES = 1967; // 65.5s @ 30fps

export const Story: React.FC<{ showSafeZone?: boolean }> = ({
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = timings.words as WordTiming[];

  // Flash opacity on major dramatic scene cuts
  const flashOpacity = [240, 570, 860, 1180, 1360, 1740].reduce(
    (acc, cutFrame) => {
      if (frame >= cutFrame && frame < cutFrame + 8) {
        return Math.max(acc, 1 - (frame - cutFrame) / 8);
      }
      return acc;
    },
    0,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#040711", overflow: "hidden" }}>
      {/* -------------------------------------------------------------------- */}
      {/* SCENE 1: HOOK — THE 10-MINUTE CAR SILENCE (Frames 0 - 240)           */}
      {/* -------------------------------------------------------------------- */}
      {frame < 245 && (
        <AbsoluteFill
          style={{
            opacity: frame > 235 ? 1 - (frame - 235) / 10 : 1,
            transform: `scale(${interpolate(frame, [0, 240], [1.0, 1.08], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("mens_day/scene1_car_interior_night.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 35%, rgba(4,7,17,0.85) 100%)",
            }}
          />

          {/* Top Stamp: THE 10-MINUTE BUFFER */}
          {frame >= 15 && (
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
                  frame: frame - 15,
                  fps,
                  config: { damping: 12, stiffness: 200 },
                })})`,
              }}
            >
              <div
                style={{
                  background: "#FFD700",
                  color: "#050811",
                  fontFamily: FONT_STACK,
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  padding: "10px 28px",
                  borderRadius: 12,
                  boxShadow: "0 8px 30px rgba(255, 215, 0, 0.45)",
                  textTransform: "uppercase",
                }}
              >
                THE 10-MINUTE BUFFER
              </div>
            </div>
          )}

          {/* Digital Dashboard Clock: 11:45 PM */}
          <div
            style={{
              position: "absolute",
              bottom: 460,
              left: 120,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(5, 10, 25, 0.75)",
              backdropFilter: "blur(12px)",
              padding: "10px 22px",
              borderRadius: 30,
              border: "1px solid rgba(255, 215, 0, 0.35)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              zIndex: 15,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#00E676",
                boxShadow: "0 0 10px #00E676",
              }}
            />
            <span
              style={{
                fontFamily: FONT_STACK,
                fontSize: 26,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.05em",
              }}
            >
              11:45 PM • DECOMPRESSION
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCENE 2: ESCALATION — THE WORKPLACE & DAILY PRESSURE (240 - 570)     */}
      {/* -------------------------------------------------------------------- */}
      {frame >= 235 && frame < 575 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 245
                ? (frame - 235) / 10
                : frame > 565
                  ? 1 - (frame - 565) / 10
                  : 1,
            transform: `scale(${interpolate(frame, [240, 570], [1.02, 1.1], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("mens_day/scene2_stressful_desk.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Dark Cinematic Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, rgba(4,7,17,0.1) 30%, rgba(4,7,17,0.9) 100%)",
            }}
          />

          {/* Top Banner: THE SILENT FILTER */}
          <div
            style={{
              position: "absolute",
              top: 130,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <div
              style={{
                background: "#FF3B30",
                color: "#FFFFFF",
                fontFamily: FONT_STACK,
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "0.06em",
                padding: "10px 30px",
                borderRadius: 12,
                boxShadow: "0 8px 30px rgba(255, 59, 48, 0.4)",
              }}
            >
              ⚠️ THE EMOTIONAL FILTER
            </div>
          </div>

          {/* Floating UI Notification 1: Boss Alert at 11 AM */}
          {frame >= 280 && (
            <div
              style={{
                position: "absolute",
                top: 240,
                left: 100,
                width: 880,
                background: "rgba(15, 23, 42, 0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 59, 48, 0.4)",
                borderRadius: 18,
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                transform: `translateX(${spring({
                  frame: frame - 280,
                  fps,
                  config: { damping: 14, stiffness: 180 },
                }) * 40 - 40}px)`,
                zIndex: 25,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#FF3B30",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  color: "#FFFFFF",
                  fontWeight: 900,
                }}
              >
                !
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: FONT_STACK,
                  }}
                >
                  11:00 AM • WORK SLACK
                </div>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: 26,
                    fontWeight: 800,
                    fontFamily: FONT_STACK,
                  }}
                >
                  "Need the updated financial forecast before 2 PM."
                </div>
              </div>
            </div>
          )}

          {/* Floating UI Notification 2: Rent / Bills at 3 PM */}
          {frame >= 370 && (
            <div
              style={{
                position: "absolute",
                top: 360,
                left: 100,
                width: 880,
                background: "rgba(15, 23, 42, 0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 215, 0, 0.4)",
                borderRadius: 18,
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                transform: `translateX(${spring({
                  frame: frame - 370,
                  fps,
                  config: { damping: 14, stiffness: 180 },
                }) * 40 - 40}px)`,
                zIndex: 25,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#FFD700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  color: "#050811",
                  fontWeight: 900,
                }}
              >
                ₹
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: FONT_STACK,
                  }}
                >
                  03:00 PM • BANK ALERT
                </div>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: 26,
                    fontWeight: 800,
                    fontFamily: FONT_STACK,
                  }}
                >
                  Pending Invoice: ₹38,500 due on 20th.
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCENE 3: SPLIT CONTRAST — "SAB SORTED HAI BRO" (Frames 570 - 860)    */}
      {/* -------------------------------------------------------------------- */}
      {frame >= 565 && frame < 865 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 575
                ? (frame - 565) / 10
                : frame > 855
                  ? 1 - (frame - 855) / 10
                  : 1,
          }}
        >
          <Img
            src={staticFile("mens_day/scene1_car_interior_night.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.2) brightness(0.85)",
            }}
          />

          {/* Dark Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,7,17,0.7) 0%, rgba(4,7,17,0.4) 50%, rgba(4,7,17,0.9) 100%)",
            }}
          />

          {/* Big WhatsApp / Message Dialogue Card */}
          <div
            style={{
              position: "absolute",
              top: 220,
              left: 90,
              width: 900,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              zIndex: 30,
            }}
          >
            {/* Incoming Bubble */}
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: 680,
                background: "rgba(30, 41, 59, 0.95)",
                padding: "20px 28px",
                borderRadius: "22px 22px 22px 4px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Friend / Partner
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 30,
                  fontWeight: 700,
                  fontFamily: FONT_STACK,
                }}
              >
                "Hey, you seemed quiet today. Everything okay?"
              </div>
            </div>

            {/* Outgoing Bubble — Pop in at Frame 640 */}
            {frame >= 640 && (
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: 680,
                  background: "#005C4B",
                  padding: "20px 28px",
                  borderRadius: "22px 22px 4px 22px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(37, 211, 102, 0.4)",
                  transform: `scale(${spring({
                    frame: frame - 640,
                    fps,
                    config: { damping: 12, stiffness: 220 },
                  })})`,
                }}
              >
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: 32,
                    fontWeight: 800,
                    fontFamily: FONT_STACK,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  "Sab sorted hai, bro! 👍"
                  <span style={{ color: "#53BDEB", fontSize: 24 }}>✓✓</span>
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCENE 4: STATISTIC & SILENT CRISIS (Frames 860 - 1180)               */}
      {/* -------------------------------------------------------------------- */}
      {frame >= 855 && frame < 1185 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 865
                ? (frame - 855) / 10
                : frame > 1175
                  ? 1 - (frame - 1175) / 10
                  : 1,
            transform: `scale(${interpolate(frame, [860, 1180], [1.0, 1.09], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("mens_day/scene2_stressful_desk.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(0.6) brightness(0.6) contrast(1.2)",
            }}
          />

          {/* Deep Navy/Blue Tension Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.95) 100%)",
            }}
          />

          {/* Giant 3.5X Stat Display */}
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 35,
              transform: `scale(${spring({
                frame: frame - 865,
                fps,
                config: { damping: 10, stiffness: 220 },
              })})`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_STACK,
                fontSize: 160,
                fontWeight: 900,
                color: "#FF3B30",
                lineHeight: 1,
                textShadow: "0 0 40px rgba(255, 59, 48, 0.6)",
                letterSpacing: "-0.04em",
              }}
            >
              3.5×
            </div>
            <div
              style={{
                background: "#FFD700",
                color: "#050811",
                fontFamily: FONT_STACK,
                fontSize: 34,
                fontWeight: 900,
                padding: "8px 26px",
                borderRadius: 10,
                letterSpacing: "0.06em",
                marginTop: -10,
                boxShadow: "0 8px 30px rgba(255, 215, 0, 0.4)",
              }}
            >
              LESS LIKELY TO ASK FOR HELP
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCENE 5: MYSTERY — WHY DOES HE FREEZE? (Frames 1180 - 1360)          */}
      {/* -------------------------------------------------------------------- */}
      {frame >= 1175 && frame < 1365 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 1185
                ? (frame - 1175) / 10
                : frame > 1355
                  ? 1 - (frame - 1355) / 10
                  : 1,
            transform: `scale(${interpolate(frame, [1180, 1360], [1.02, 1.08], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("mens_day/scene3_car_driveway_wide.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Rain / Night Glow Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, rgba(4,7,17,0) 30%, rgba(4,7,17,0.85) 100%)",
            }}
          />

          {/* Top Mystery Question Badge */}
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 30,
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(12px)",
                color: "#FFFFFF",
                border: "2px solid #FFD700",
                fontFamily: FONT_STACK,
                fontSize: 34,
                fontWeight: 900,
                padding: "10px 30px",
                borderRadius: 14,
                letterSpacing: "0.06em",
                boxShadow: "0 10px 35px rgba(0,0,0,0.7)",
              }}
            >
              WHY DOES HE FREEZE? 🤔
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCENE 6: THE PIVOT — "FOR 10 MINUTES, JUST HUMAN" (1360 - 1740)      */}
      {/* -------------------------------------------------------------------- */}
      {frame >= 1355 && frame < 1745 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 1365
                ? (frame - 1355) / 10
                : frame > 1735
                  ? 1 - (frame - 1735) / 10
                  : 1,
            transform: `scale(${interpolate(frame, [1360, 1740], [1.0, 1.08], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("mens_day/scene4_peaceful_relief.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Warm Golden Glow Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,215,0,0.12) 20%, rgba(4,7,17,0.8) 100%)",
            }}
          />

          {/* Pivot Text Banner */}
          <div
            style={{
              position: "absolute",
              top: 130,
              left: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 35,
              transform: `scale(${spring({
                frame: frame - 1365,
                fps,
                config: { damping: 12, stiffness: 200 },
              })})`,
            }}
          >
            <div
              style={{
                background: "#FFD700",
                color: "#050811",
                fontFamily: FONT_STACK,
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "0.08em",
                padding: "10px 28px",
                borderRadius: 12,
                boxShadow: "0 8px 30px rgba(255, 215, 0, 0.5)",
              }}
            >
              FOR 10 MINUTES: JUST HUMAN ❤️
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SCENE 7: PAYOFF — "BHAI, TU THEEK HAI NA?" (Frames 1740 - 1967)      */}
      {/* -------------------------------------------------------------------- */}
      {frame >= 1735 && (
        <AbsoluteFill
          style={{
            opacity: frame < 1745 ? (frame - 1735) / 10 : 1,
            transform: `scale(${interpolate(frame, [1740, 1967], [1.0, 1.05], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Img
            src={staticFile("mens_day/scene4_peaceful_relief.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Warm Amber Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,7,17,0.85) 0%, rgba(4,7,17,0.4) 50%, rgba(4,7,17,0.92) 100%)",
            }}
          />

          {/* Big Final Heartfelt Message Card */}
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 40,
              transform: `scale(${spring({
                frame: frame - 1750,
                fps,
                config: { damping: 10, stiffness: 200 },
              })})`,
            }}
          >
            <div
              style={{
                background: "rgba(255, 215, 0, 0.95)",
                color: "#050811",
                fontFamily: FONT_STACK,
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "0.08em",
                padding: "8px 26px",
                borderRadius: 10,
                boxShadow: "0 8px 30px rgba(255, 215, 0, 0.4)",
              }}
            >
              HAPPY MEN'S DAY
            </div>
            <div
              style={{
                color: "#FFFFFF",
                fontFamily: FONT_STACK,
                fontSize: 62,
                fontWeight: 900,
                marginTop: 20,
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                textAlign: "center",
                lineHeight: 1.15,
              }}
            >
              "Bhai, Tu Theek Hai Na?"
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* DRAMATIC TRANSITION FLASHES                                          */}
      {/* -------------------------------------------------------------------- */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity * 0.4,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SYNCHRONIZED CAPTIONS (Safe zone centered at y=1410)                */}
      {/* -------------------------------------------------------------------- */}
      <Captions
        words={words}
        wordsPerChunk={2}
        highlight={[
          "millions",
          "men",
          "quiet",
          "ten",
          "boss",
          "filter",
          "silent",
          "3.5",
          "pressure",
          "freeze",
          "human",
          "theek",
          "day",
        ]}
      />

      {/* -------------------------------------------------------------------- */}
      {/* AUDIO TRACKS: VOICE, BGM, AND SFX                                    */}
      {/* -------------------------------------------------------------------- */}
      <Audio src={staticFile("voice/mens_day.mp3")} volume={1.0} />

      <Audio
        src={staticFile("music/industrial_cinematic_bgm.mp3")}
        volume={0.09}
      />

      {/* SFX Hits */}
      {frame >= 0 && frame < 30 && (
        <Audio src={staticFile("sfx/chime.mp3")} volume={0.4} />
      )}
      {frame >= 135 && frame < 165 && (
        <Audio src={staticFile("sfx/whoosh-short.mp3")} volume={0.5} />
      )}
      {frame >= 240 && frame < 270 && (
        <Audio src={staticFile("sfx/notification.mp3")} volume={0.6} />
      )}
      {frame >= 370 && frame < 400 && (
        <Audio src={staticFile("sfx/ping.mp3")} volume={0.5} />
      )}
      {frame >= 640 && frame < 670 && (
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.6} />
      )}
      {frame >= 860 && frame < 910 && (
        <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.7} />
      )}
      {frame >= 1180 && frame < 1220 && (
        <Audio src={staticFile("sfx/whoosh-cinematic.mp3")} volume={0.6} />
      )}
      {frame >= 1360 && frame < 1400 && (
        <Audio src={staticFile("sfx/sparkle.mp3")} volume={0.5} />
      )}
      {frame >= 1740 && frame < 1800 && (
        <Audio src={staticFile("sfx/chime.mp3")} volume={0.6} />
      )}

      {/* Optional Safe Zone Guide */}
      {showSafeZone && <SafeZoneGuide />}
    </AbsoluteFill>
  );
};
