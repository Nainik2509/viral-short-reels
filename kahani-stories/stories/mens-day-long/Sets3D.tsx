import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import {
  Ball,
  Clock,
  Cloud,
  Confetti,
  Cyl,
  Fence,
  Ground,
  House,
  LampPost,
  LightShaft,
  RB,
  Road,
  Room,
  Shelf,
  Sun,
  Table,
  Tree,
  Window,
} from "../../src/three/World";
import { Character2D } from "../../src/three/Character2D";
import { glowMat, matteMat, planeG, propMat, rboxG } from "../../src/three/gfx";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SET: MORNING CITY STREET (Acts 1 & 2 Opening)
// ─────────────────────────────────────────────────────────────────────────────
export const MorningCitySet: React.FC<{ frame: number }> = ({ frame }) => {
  // Kabir walking along the sidewalk
  const walkZ = 8 - (frame / 30) * 0.9;

  return (
    <group>
      {/* Sky & Sun */}
      <Sun color="#ffea9f" size={7} p={[12, 16, -25]} />
      <Cloud p={[-6, 12, -15]} size={1.4} speed={0.12} />
      <Cloud p={[8, 14, -20]} size={1.8} speed={0.08} />

      {/* Ground & Roadway */}
      <Ground color="#84cc16" size={120} y={0} />
      <Road w={6} len={80} color="#334155" p={[0, 0, 0]} />

      {/* Sidewalk curb & paving */}
      <RB size={[2.2, 0.12, 80]} color="#cbd5e1" p={[4.1, 0.06, 0]} radius={0.02} matte />
      <RB size={[2.2, 0.12, 80]} color="#cbd5e1" p={[-4.1, 0.06, 0]} radius={0.02} matte />

      {/* Streetlamps */}
      {[-24, -8, 8, 24].map((z, i) => (
        <LampPost key={i} p={[3.8, 0, z]} glow="#fef08a" />
      ))}

      {/* Pastel Houses lining the right side of the avenue */}
      <House w={5} h={3.8} d={4.5} wall="#fed7aa" roof="#ea580c" door="#0284c7" p={[8.5, 0, -14]} r={[0, -Math.PI / 2, 0]} />
      <House w={5.5} h={4.2} d={5} wall="#bae6fd" roof="#0369a1" door="#ea580c" p={[8.8, 0, 0]} r={[0, -Math.PI / 2, 0]} />
      <House w={5} h={3.6} d={4.2} wall="#fbcfe8" roof="#be185d" door="#16a34a" p={[8.5, 0, 16]} r={[0, -Math.PI / 2, 0]} />

      {/* Picket Fences */}
      <Fence len={8} color="#f8fafc" p={[5.8, 0, -7]} r={[0, Math.PI / 2, 0]} />
      <Fence len={8} color="#f8fafc" p={[5.8, 0, 9]} r={[0, Math.PI / 2, 0]} />

      {/* Trees lining both sides */}
      {[-20, -10, 2, 12, 22].map((z, i) => (
        <React.Fragment key={i}>
          <Tree p={[5.4, 0, z]} size={1.1 + (i % 3) * 0.15} seed={i + 1} leaf="#22c55e" />
          <Tree p={[-5.5, 0, z - 4]} size={1.2 + (i % 2) * 0.2} seed={i + 20} leaf="#16a34a" />
        </React.Fragment>
      ))}

      {/* 2D Character: Kabir walking through the morning world */}
      <Character2D
        name="kabir"
        pose="walk"
        position={[3.8, 0.12, walkZ]}
        rotation={[0, Math.PI, 0]}
        scale={1.25}
        eyeState="open"
        mouthState="neutral"
      />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SET: CORPORATE PRESSURE ROOM & NOTIFICATION ALERTS (Act 2)
// ─────────────────────────────────────────────────────────────────────────────
export const OfficePressureSet: React.FC<{ frame: number }> = ({ frame }) => {
  // Floating holographic cards animation
  const slackProg = Math.min(1, Math.max(0, (frame - 740) / 25));
  const rentProg = Math.min(1, Math.max(0, (frame - 810) / 25));
  const papaProg = Math.min(1, Math.max(0, (frame - 975) / 25));
  const replyProg = Math.min(1, Math.max(0, (frame - 1105) / 25));

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Modern Office Room */}
      <Room
        w={9}
        d={8}
        h={4}
        wall="#0f172a"
        floor="#1e293b"
        trim="#334155"
        wainscot="#1e293b"
        floorBoards={true}
        ceiling={true}
      />

      {/* Large Office Window looking out into rainy blue city */}
      <Window
        w={3.2}
        h={2.4}
        p={[0, 2.2, -3.9]}
        glow="#1e3a8a"
        glowIntensity={1.2}
        curtains="#0f172a"
      />

      {/* Bookshelf with project archives */}
      <Shelf w={2.2} rows={3} p={[-3.8, 0, -1.8]} r={[0, Math.PI / 2, 0]} wood="#334155" seed={4} />

      {/* Wall Clock */}
      <Clock p={[0, 3.2, -3.85]} />

      {/* Executive Wooden Desk */}
      <Table w={2.8} d={1.4} h={0.82} top="#475569" leg="#1e293b" p={[0, 0, -0.6]}>
        {/* Modern Laptop with glowing screen */}
        <group position={[0, 0, 0.1]}>
          <RB size={[0.55, 0.02, 0.38]} color="#94a3b8" p={[0, 0.01, 0]} radius={0.01} />
          {/* Display screen tilted 105 degrees */}
          <group position={[0, 0.02, -0.19]} rotation={[-0.26, 0, 0]}>
            <RB size={[0.55, 0.38, 0.02]} color="#0f172a" p={[0, 0.19, 0]} radius={0.01} />
            <mesh position={[0, 0.19, 0.012]} geometry={planeG()} material={glowMat("#38bdf8", 3.5)} scale={[0.51, 0.34, 1]} />
          </group>
        </group>

        {/* Stack of financial files / folders */}
        <RB size={[0.35, 0.08, 0.45]} color="#f59e0b" p={[-0.85, 0.04, 0]} radius={0.01} />
        <RB size={[0.34, 0.06, 0.44]} color="#ef4444" p={[-0.85, 0.11, 0.02]} radius={0.01} />

        {/* Ceramic coffee mug */}
        <Cyl rTop={0.05} rBot={0.045} h={0.11} color="#e2e8f0" p={[0.8, 0.055, 0.1]} />

        {/* Desk Lamp providing localized lighting */}
        <group position={[1.0, 0, -0.3]}>
          <Cyl rTop={0.09} rBot={0.11} h={0.04} color="#0284c7" p={[0, 0.02, 0]} />
          <Cyl rTop={0.015} rBot={0.015} h={0.45} color="#cbd5e1" p={[-0.05, 0.24, 0.05]} r={[0.2, 0, -0.2]} />
          <Ball r0={0.07} color="#38bdf8" glow={4} p={[-0.12, 0.48, 0.12]} />
          <pointLight position={[-0.12, 0.48, 0.12]} color="#67e8f9" intensity={6} distance={3} decay={2} />
        </group>
      </Table>

      {/* 2D Kabir seated at desk, looking at work */}
      <Character2D
        name="kabir"
        pose="desk_tired"
        position={[0, 0.12, 0.2]}
        rotation={[0, 0, 0]}
        scale={1.22}
        eyeState={frame > 1105 ? "open" : "soft"}
        mouthState={frame > 1105 ? "smile" : "tired"}
      />

      {/* ──────────────────────────────────────────────────────── */}
      {/* FLOATING 3D HOLOGRAPHIC PRESSURE CARDS                   */}
      {/* ──────────────────────────────────────────────────────── */}
      {/* Card 1: Slack Deadline (Red urgency) */}
      {slackProg > 0 && (
        <group position={[-1.6, 1.8 * slackProg, -0.2]} scale={slackProg}>
          <RB size={[1.5, 0.42, 0.03]} color="#dc2626" radius={0.03} />
          <mesh position={[0, 0, 0.02]} geometry={planeG()} material={glowMat("#fca5a5", 1.8)} scale={[1.42, 0.36, 1]} />
        </group>
      )}

      {/* Card 2: Rent & Bills Due (Amber/Red) */}
      {rentProg > 0 && (
        <group position={[1.7, 1.9 * rentProg, -0.1]} scale={rentProg}>
          <RB size={[1.6, 0.45, 0.03]} color="#ea580c" radius={0.03} />
          <mesh position={[0, 0, 0.02]} geometry={planeG()} material={glowMat("#fed7aa", 1.8)} scale={[1.52, 0.38, 1]} />
        </group>
      )}

      {/* Card 3: WhatsApp Papa: "Beta, did you manage the payment?" */}
      {papaProg > 0 && (
        <group position={[-1.3, 1.2 * papaProg, 0.4]} scale={papaProg}>
          <RB size={[1.8, 0.5, 0.03]} color="#059669" radius={0.03} />
          <mesh position={[0, 0, 0.02]} geometry={planeG()} material={glowMat("#a7f3d0", 1.8)} scale={[1.72, 0.42, 1]} />
        </group>
      )}

      {/* Card 4: Kabir's Reply: "Don't worry Papa, sab sorted hai. 👍" */}
      {replyProg > 0 && (
        <group position={[1.3, 1.1 * replyProg, 0.6]} scale={replyProg}>
          <RB size={[1.9, 0.52, 0.03]} color="#2563eb" radius={0.03} />
          <mesh position={[0, 0, 0.02]} geometry={planeG()} material={glowMat("#bfdbfe", 2.2)} scale={[1.82, 0.44, 1]} />
        </group>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SET: THE 3D CAR & MIDNIGHT RAINY DRIVEWAY (Acts 3 & 4 Sanctuary)
// ─────────────────────────────────────────────────────────────────────────────
export const NightCarSanctuarySet: React.FC<{ frame: number; showAarav?: boolean }> = ({
  frame,
  showAarav = false,
}) => {
  // Gentle rain streaks in 3D
  const rainDrops = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      x: (Math.sin(i * 9.1) * 7),
      y: (Math.cos(i * 5.3) * 3 + 3),
      z: (Math.sin(i * 3.7) * 7),
      speed: 0.2 + (i % 5) * 0.08,
    }));
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Wet Asphalt Driveway with soft specular sheen */}
      <Ground color="#090d16" size={100} y={0} />
      <Road w={7} len={60} color="#0f172a" p={[0, 0, 0]} />

      {/* Street curb */}
      <RB size={[2, 0.1, 60]} color="#1e293b" p={[4.5, 0.05, 0]} radius={0.02} matte />
      <RB size={[2, 0.1, 60]} color="#1e293b" p={[-4.5, 0.05, 0]} radius={0.02} matte />

      {/* Solitary Amber Streetlamp directly illuminating the car */}
      <group position={[2.8, 0, 1.2]}>
        <LampPost glow="#f59e0b" />
        {/* Soft amber cone of street light */}
        <pointLight position={[0, 3.2, 0]} color="#fbbf24" intensity={18} distance={12} decay={1.8} castShadow />
      </group>

      {/* Dark suburban houses in deep blue midnight background */}
      <House w={6} h={4.2} d={5} wall="#0f172a" roof="#020617" door="#1e293b" p={[-8.5, 0, -8]} r={[0, Math.PI / 2, 0]} />
      <House w={6} h={4} d={5} wall="#0f172a" roof="#020617" door="#1e293b" p={[9.5, 0, -10]} r={[0, -Math.PI / 2, 0]} />

      {/* Wet rain trees */}
      <Tree p={[-4.8, 0, -5]} size={1.3} seed={10} leaf="#064e3b" />
      <Tree p={[5.2, 0, -8]} size={1.4} seed={11} leaf="#064e3b" />

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3D CAR MODEL (Procedural Rounded Sedan Chassis)         */}
      {/* ──────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]} rotation={[0, -0.15, 0]}>
        {/* Wheels & Tires */}
        {[
          [-0.95, 0.32, 1.4],
          [0.95, 0.32, 1.4],
          [-0.95, 0.32, -1.4],
          [0.95, 0.32, -1.4],
        ].map(([wx, wy, wz], i) => (
          <group key={i} position={[wx, wy, wz]}>
            <Cyl rTop={0.34} rBot={0.34} h={0.24} color="#0f172a" r={[0, 0, Math.PI / 2]} />
            <Cyl rTop={0.2} rBot={0.2} h={0.26} color="#64748b" r={[0, 0, Math.PI / 2]} />
          </group>
        ))}

        {/* Main Lower Body Chassis */}
        <RB size={[1.9, 0.65, 4.4]} color="#1e293b" p={[0, 0.55, 0]} radius={0.18} rough={0.25} />

        {/* Upper Cabin & Glass Canopy */}
        <group position={[0, 1.25, -0.2]}>
          {/* Cabin Roof */}
          <RB size={[1.6, 0.65, 2.3]} color="#0f172a" p={[0, 0.28, 0]} radius={0.16} rough={0.2} />

          {/* Windshield (Front Glass) */}
          <mesh
            position={[0, 0.12, 1.15]}
            rotation={[-0.48, 0, 0]}
            geometry={planeG()}
            scale={[1.5, 0.72, 1]}
          >
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Rear Glass */}
          <mesh
            position={[0, 0.14, -1.15]}
            rotation={[0.48, 0, 0]}
            geometry={planeG()}
            scale={[1.5, 0.68, 1]}
          >
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.1}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Side Windows */}
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.81, 0.18, 0]}
              rotation={[0, side * Math.PI / 2, 0]}
              geometry={planeG()}
              scale={[2.0, 0.5, 1]}
            >
              <meshStandardMaterial
                color="#0369a1"
                roughness={0.1}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* Glowing Headlights */}
        <group position={[0, 0.58, 2.18]}>
          {[-0.65, 0.65].map((hx, i) => (
            <React.Fragment key={i}>
              <RB size={[0.36, 0.16, 0.08]} color="#fef08a" p={[hx, 0, 0]} radius={0.04} />
              <Ball r0={0.08} color="#fef08a" glow={4} p={[hx, 0, 0.05]} />
            </React.Fragment>
          ))}
        </group>

        {/* Glowing Red Taillights */}
        <group position={[0, 0.62, -2.18]}>
          {[-0.65, 0.65].map((tx, i) => (
            <React.Fragment key={tx}>
              <RB size={[0.38, 0.14, 0.08]} color="#dc2626" p={[tx, 0, 0]} radius={0.04} />
              <Ball r0={0.07} color="#ef4444" glow={3} p={[tx, 0, -0.05]} />
            </React.Fragment>
          ))}
        </group>

        {/* Interior Dashboard Soft Glow & Steering Wheel */}
        <group position={[-0.38, 0.95, 0.2]}>
          {/* Dashboard console */}
          <RB size={[1.4, 0.28, 0.6]} color="#090d16" p={[0.38, 0, 0.2]} radius={0.04} />
          {/* Speedometer glowing soft cyan */}
          <Ball r0={0.09} color="#38bdf8" glow={2.5} p={[0, 0.1, 0.15]} />
          {/* Dashboard clock: 11:45 PM */}
          <Ball r0={0.05} color="#22c55e" glow={2} p={[0.28, 0.1, 0.15]} />
          {/* Interior warm dome light */}
          <pointLight position={[0.38, 0.6, -0.3]} color="#fed7aa" intensity={frame > 2200 ? 5 : 1.2} distance={2.5} />
        </group>

        {/* 2D Character: Kabir seated in car, hands on wheel */}
        <Character2D
          name="kabir"
          pose="car_sit"
          position={[-0.38, 0.72, 0.0]}
          rotation={[0, 0, 0]}
          scale={0.92}
          eyeState={frame > 2100 ? "closed" : "soft"}
          mouthState={frame > 2100 ? "smile" : "neutral"}
        />
      </group>

      {/* 2D Character: Aarav approaching car with Chai cups (Acts 4 & 5) */}
      {showAarav && (
        <Character2D
          name="aarav"
          pose="chai_offer"
          position={[1.5, 0.05, 0.4]}
          rotation={[0, -Math.PI * 0.45, 0]}
          scale={1.22}
          eyeState="open"
          mouthState="smile"
        />
      )}

      {/* Gentle 3D Rain Streaks */}
      {rainDrops.map((d, i) => {
        const fallY = ((d.y - (frame * d.speed * 0.2)) % 6) + 0.2;
        return (
          <mesh
            key={i}
            position={[d.x, fallY, d.z]}
            geometry={planeG()}
            scale={[0.015, 0.28, 1]}
          >
            <meshBasicMaterial
              color="#93c5fd"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. SET: DAWN CELEBRATION & INTERNATIONAL MEN'S DAY TRIBUTE (Act 5)
// ─────────────────────────────────────────────────────────────────────────────
export const DawnTributeSet: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Golden Sunrise in the horizon */}
      <Sun color="#fbbf24" size={9} p={[0, 8, -28]} />

      {/* Volumetric Warm God-Rays */}
      <LightShaft color="#fef08a" opacity={0.16} w={6} len={24} p={[0, 10, -12]} r={[0.6, 0, 0]} />

      {/* Fresh Green Dawn Meadow */}
      <Ground color="#65a30d" size={140} y={0} />

      {/* Soft rolling hills */}
      <Ball r0={14} color="#4d7c0f" p={[-25, -6, -24]} />
      <Ball r0={16} color="#3f6212" p={[28, -7, -26]} />
      <Ball r0={12} color="#65a30d" p={[0, -5, -30]} />

      {/* Blooming golden trees */}
      {[-16, -10, -5, 5, 10, 16].map((x, i) => (
        <Tree
          key={i}
          p={[x, 0, -12 + (i % 3) * 2]}
          size={1.3 + (i % 2) * 0.3}
          seed={i + 30}
          leaf={i % 2 === 0 ? "#84cc16" : "#eab308"}
        />
      ))}

      {/* Falling 3D Confetti celebrating Men's Day */}
      <Confetti
        count={180}
        area={[14, 8, 10]}
        center={[0, 4, 0]}
        from={3300}
        speed={0.9}
        colors={["#f59e0b", "#38bdf8", "#22c55e", "#fbbf24", "#ffffff", "#ec4899"]}
      />

      {/* Two 2D Characters standing side by side in the warm sunlight */}
      <group position={[0, 0, 0]}>
        {/* Kabir: Relieved, peaceful, standing tall, holding chai cup */}
        <Character2D
          name="kabir"
          pose="chai_receive"
          position={[-0.75, 0.05, 0]}
          rotation={[0, 0.15, 0]}
          scale={1.25}
          eyeState="open"
          mouthState="smile"
        />

        {/* Aarav: Smiling warmly beside him */}
        <Character2D
          name="aarav"
          pose="chai_offer"
          position={[0.75, 0.05, 0]}
          rotation={[0, -0.15, 0]}
          scale={1.25}
          eyeState="open"
          mouthState="smile"
        />
      </group>
    </group>
  );
};
