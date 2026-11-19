import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import { contactShadowMat } from "./gfx";

export type Character2DPose =
  | "walk"
  | "stand"
  | "desk_tired"
  | "car_sit"
  | "chai_offer"
  | "chai_receive"
  | "smile_tribute";

export interface Character2DProps {
  name?: "kabir" | "aarav";
  pose?: Character2DPose;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  facing?: 1 | -1;
  eyeState?: "open" | "blink" | "closed" | "soft";
  mouthState?: "neutral" | "smile" | "talk" | "tired";
  opacity?: number;
  shadow?: boolean;
}

/**
 * 2D Character in 3D World (Procedural High-Definition SVG-based Canvas Card)
 * Generates an ultra-crisp 1024x1024 texture of the 2D illustrated character
 * with clean ink outlines, expressive cel-shading, and distinct emotional poses.
 */
export const Character2D: React.FC<Character2DProps> = ({
  name = "kabir",
  pose = "stand",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  facing = 1,
  eyeState = "open",
  mouthState = "neutral",
  opacity = 1.0,
  shadow = true,
}) => {
  const frame = useCurrentFrame();

  // Natural blinking cycle (blinks every ~3.5 seconds for 5 frames)
  const isBlinking = eyeState === "blink" || (eyeState === "open" && (frame % 105 >= 95 && frame % 105 <= 99));
  const effectiveEye = isBlinking ? "closed" : eyeState;

  // Gentle breathing motion
  const breathY = Math.sin(frame * 0.08) * 0.02;

  // Walking cycle animation
  const walkPhase = (frame * 0.15) % (Math.PI * 2);
  const legSwing = pose === "walk" ? Math.sin(walkPhase) * 22 : 0;
  const armSwing = pose === "walk" ? -Math.sin(walkPhase) * 20 : 0;

  // Create or update the canvas texture
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1024, 1024);
    ctx.save();
    ctx.scale(facing, 1);
    if (facing === -1) ctx.translate(-1024, 0);

    // Common styling
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827"; // Clean ink stroke

    if (name === "kabir") {
      // ----------------------------------------------------
      // KABIR (Protagonist: Young professional, spectacles)
      // ----------------------------------------------------
      const skinColor = "#F5D0A9";
      const hairColor = "#1F2937";
      const shirtColor = "#2563EB"; // Royal blue formal shirt
      const pantsColor = "#334155"; // Slate trousers
      const shoeColor = "#1E293B";

      if (pose === "car_sit") {
        // Seated inside car silhouette / cockpit pose
        // Torso leaning slightly forward
        ctx.fillStyle = shirtColor;
        ctx.beginPath();
        ctx.roundRect(360, 480, 300, 340, [40, 40, 20, 20]);
        ctx.fill();
        ctx.stroke();

        // Collar
        ctx.fillStyle = "#1D4ED8";
        ctx.beginPath();
        ctx.moveTo(460, 480);
        ctx.lineTo(512, 570);
        ctx.lineTo(564, 480);
        ctx.fill();
        ctx.stroke();

        // Arms holding steering wheel
        ctx.fillStyle = shirtColor;
        ctx.beginPath();
        ctx.moveTo(380, 520);
        ctx.quadraticCurveTo(320, 640, 410, 720);
        ctx.lineTo(450, 700);
        ctx.quadraticCurveTo(380, 620, 420, 530);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(640, 520);
        ctx.quadraticCurveTo(700, 640, 610, 720);
        ctx.lineTo(570, 700);
        ctx.quadraticCurveTo(640, 620, 600, 530);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hands (holding steering wheel rim)
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(430, 715, 34, 0, Math.PI * 2);
        ctx.arc(590, 715, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Steering wheel rim segment in front
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 26;
        ctx.beginPath();
        ctx.arc(512, 750, 210, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 14;

        // Head & Neck
        ctx.fillStyle = skinColor;
        ctx.fillRect(475, 430, 74, 70);
        ctx.strokeRect(475, 430, 74, 70);

        ctx.beginPath();
        ctx.arc(512, 330, 130, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hair
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(512, 310, 134, Math.PI * 0.85, Math.PI * 2.15);
        ctx.quadraticCurveTo(512, 210, 420, 260);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glasses
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 12;
        ctx.strokeRect(435, 315, 65, 48);
        ctx.strokeRect(525, 315, 65, 48);
        ctx.beginPath();
        ctx.moveTo(500, 338);
        ctx.lineTo(525, 338);
        ctx.stroke();
        ctx.lineWidth = 14;

        // Eyes (Tired / closed in peace)
        if (effectiveEye === "closed") {
          ctx.beginPath();
          ctx.moveTo(445, 342);
          ctx.quadraticCurveTo(467, 355, 490, 342);
          ctx.moveTo(535, 342);
          ctx.quadraticCurveTo(557, 355, 580, 342);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#111827";
          ctx.beginPath();
          ctx.arc(467, 338, 12, 0, Math.PI * 2);
          ctx.arc(557, 338, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mouth (Soft peaceful relief)
        ctx.beginPath();
        if (mouthState === "smile" || pose === "car_sit") {
          ctx.moveTo(485, 410);
          ctx.quadraticCurveTo(512, 426, 539, 410);
        } else {
          ctx.moveTo(490, 415);
          ctx.lineTo(534, 415);
        }
        ctx.stroke();
      } else {
        // Standard Standing / Walking / Office Poses
        // Legs
        ctx.fillStyle = pantsColor;

        // Left Leg
        ctx.save();
        ctx.translate(450, 680);
        ctx.rotate((legSwing * Math.PI) / 180);
        ctx.fillRect(-35, 0, 70, 250);
        ctx.strokeRect(-35, 0, 70, 250);
        // Shoe
        ctx.fillStyle = shoeColor;
        ctx.beginPath();
        ctx.roundRect(-38, 240, 105, 45, [15, 30, 10, 10]);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right Leg
        ctx.save();
        ctx.translate(574, 680);
        ctx.rotate((-legSwing * Math.PI) / 180);
        ctx.fillRect(-35, 0, 70, 250);
        ctx.strokeRect(-35, 0, 70, 250);
        // Shoe
        ctx.fillStyle = shoeColor;
        ctx.beginPath();
        ctx.roundRect(-38, 240, 105, 45, [15, 30, 10, 10]);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Torso
        ctx.fillStyle = shirtColor;
        ctx.beginPath();
        ctx.roundRect(400, 420, 224, 270, [30, 30, 15, 15]);
        ctx.fill();
        ctx.stroke();

        // Belt
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(400, 660, 224, 30);
        ctx.fillStyle = "#E2E8F0";
        ctx.fillRect(495, 662, 34, 26);

        // Tie / Collar
        ctx.fillStyle = "#1E40AF";
        ctx.beginPath();
        ctx.moveTo(480, 420);
        ctx.lineTo(512, 480);
        ctx.lineTo(544, 420);
        ctx.fill();
        ctx.stroke();

        // Messenger Bag strap across chest
        ctx.strokeStyle = "#78350F";
        ctx.lineWidth = 22;
        ctx.beginPath();
        ctx.moveTo(420, 430);
        ctx.lineTo(590, 640);
        ctx.stroke();
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 14;

        // Arms
        // Left Arm
        ctx.save();
        ctx.translate(400, 440);
        ctx.rotate((armSwing * Math.PI) / 180);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-25, 0, 50, 190);
        ctx.strokeRect(-25, 0, 50, 190);
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(0, 205, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right Arm (or holding chai / waving)
        ctx.save();
        ctx.translate(624, 440);
        const rightArmAngle = pose === "chai_receive" ? -45 : -armSwing;
        ctx.rotate((rightArmAngle * Math.PI) / 180);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-25, 0, 50, 190);
        ctx.strokeRect(-25, 0, 50, 190);
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(0, 205, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (pose === "chai_receive") {
          // Steaming Chai cup in hand
          ctx.fillStyle = "#F59E0B";
          ctx.beginPath();
          ctx.roundRect(-22, 175, 44, 55, [4, 4, 12, 12]);
          ctx.fill();
          ctx.stroke();
          // Steam
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-6, 165);
          ctx.quadraticCurveTo(-12, 145, -4, 130);
          ctx.moveTo(6, 165);
          ctx.quadraticCurveTo(12, 145, 4, 130);
          ctx.stroke();
          ctx.strokeStyle = "#111827";
          ctx.lineWidth = 14;
        }
        ctx.restore();

        // Head & Neck
        ctx.fillStyle = skinColor;
        ctx.fillRect(480, 360, 64, 70);
        ctx.strokeRect(480, 360, 64, 70);

        ctx.beginPath();
        ctx.arc(512, 260, 115, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hair
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(512, 240, 120, Math.PI * 0.82, Math.PI * 2.18);
        ctx.quadraticCurveTo(512, 140, 420, 190);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glasses
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 12;
        ctx.strokeRect(440, 245, 60, 44);
        ctx.strokeRect(524, 245, 60, 44);
        ctx.beginPath();
        ctx.moveTo(500, 267);
        ctx.lineTo(524, 267);
        ctx.stroke();
        ctx.lineWidth = 14;

        // Eyes
        if (effectiveEye === "closed") {
          ctx.beginPath();
          ctx.moveTo(450, 268);
          ctx.quadraticCurveTo(470, 280, 490, 268);
          ctx.moveTo(534, 268);
          ctx.quadraticCurveTo(554, 280, 574, 268);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#111827";
          ctx.beginPath();
          ctx.arc(470, 266, 11, 0, Math.PI * 2);
          ctx.arc(554, 266, 11, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mouth
        ctx.beginPath();
        if (mouthState === "smile" || pose === "smile_tribute" || pose === "chai_receive") {
          ctx.moveTo(485, 330);
          ctx.quadraticCurveTo(512, 355, 539, 330);
        } else if (mouthState === "tired") {
          ctx.moveTo(488, 342);
          ctx.quadraticCurveTo(512, 332, 536, 342);
        } else {
          ctx.moveTo(492, 335);
          ctx.lineTo(532, 335);
        }
        ctx.stroke();
      }
    } else {
      // ----------------------------------------------------
      // AARAV (Brother / Best Friend: Olive jacket, warm smile)
      // ----------------------------------------------------
      const skinColor = "#F5D0A9";
      const hairColor = "#374151";
      const jacketColor = "#15803D"; // Olive green jacket
      const innerColor = "#F3F4F6";  // White tee
      const pantsColor = "#1E293B";

      // Legs
      ctx.fillStyle = pantsColor;
      ctx.fillRect(430, 680, 68, 250);
      ctx.strokeRect(430, 680, 68, 250);
      ctx.fillRect(526, 680, 68, 250);
      ctx.strokeRect(526, 680, 68, 250);

      // Shoes
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.roundRect(420, 920, 95, 45, [15, 30, 10, 10]);
      ctx.roundRect(520, 920, 95, 45, [15, 30, 10, 10]);
      ctx.fill();
      ctx.stroke();

      // Torso & Jacket
      ctx.fillStyle = innerColor;
      ctx.fillRect(440, 420, 144, 270);
      ctx.strokeRect(440, 420, 144, 270);

      ctx.fillStyle = jacketColor;
      ctx.beginPath();
      ctx.roundRect(390, 420, 75, 270, [25, 10, 10, 20]);
      ctx.roundRect(559, 420, 75, 270, [10, 25, 20, 10]);
      ctx.fill();
      ctx.stroke();

      // Arms holding tea tray / 2 cups of chai
      ctx.fillStyle = jacketColor;
      ctx.beginPath();
      ctx.moveTo(400, 450);
      ctx.quadraticCurveTo(360, 560, 450, 590);
      ctx.lineTo(470, 560);
      ctx.quadraticCurveTo(400, 530, 430, 460);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(624, 450);
      ctx.quadraticCurveTo(664, 560, 574, 590);
      ctx.lineTo(554, 560);
      ctx.quadraticCurveTo(624, 530, 594, 460);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hands holding two paper chai cups
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(460, 580, 25, 0, Math.PI * 2);
      ctx.arc(564, 580, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Two Cups of Hot Chai
      ctx.fillStyle = "#D97706";
      ctx.beginPath();
      ctx.roundRect(445, 540, 36, 48, [4, 4, 10, 10]);
      ctx.roundRect(545, 540, 36, 48, [4, 4, 10, 10]);
      ctx.fill();
      ctx.stroke();

      // Steaming Chai
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(463, 530);
      ctx.quadraticCurveTo(455, 510, 465, 490);
      ctx.moveTo(563, 530);
      ctx.quadraticCurveTo(555, 510, 565, 490);
      ctx.stroke();
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 14;

      // Head & Neck
      ctx.fillStyle = skinColor;
      ctx.fillRect(480, 350, 64, 70);
      ctx.strokeRect(480, 350, 64, 70);

      ctx.beginPath();
      ctx.arc(512, 250, 115, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Modern Textured Hair
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.arc(512, 230, 120, Math.PI * 0.8, Math.PI * 2.2);
      ctx.quadraticCurveTo(540, 120, 410, 180);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Friendly Eyes
      if (effectiveEye === "closed") {
        ctx.beginPath();
        ctx.moveTo(450, 255);
        ctx.quadraticCurveTo(470, 270, 490, 255);
        ctx.moveTo(534, 255);
        ctx.quadraticCurveTo(554, 270, 574, 255);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.arc(470, 255, 12, 0, Math.PI * 2);
        ctx.arc(554, 255, 12, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(466, 251, 4, 0, Math.PI * 2);
        ctx.arc(550, 251, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Warm caring smile
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(475, 315);
      ctx.quadraticCurveTo(512, 355, 549, 315);
      ctx.stroke();
    }

    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [name, pose, facing, effectiveEye, mouthState, legSwing, armSwing]);

  const cardWidth = 1.6 * scale;
  const cardHeight = 1.6 * scale;

  return (
    <group position={position} rotation={rotation}>
      {/* 2D Cutout Plane inside 3D Three.js */}
      <mesh position={[0, cardHeight / 2 + breathY, 0]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        {texture && (
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            roughness={0.8}
            metalness={0.05}
            alphaTest={0.05}
          />
        )}
      </mesh>

      {/* 3D Contact Shadow beneath feet */}
      {shadow && (
        <mesh
          position={[0, 0.015, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.7 * scale, 0.35 * scale, 1]}
          geometry={new THREE.PlaneGeometry(1, 1)}
          material={contactShadowMat(0.55 * opacity)}
        />
      )}
    </group>
  );
};
