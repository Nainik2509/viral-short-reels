// Set dressing built from rounded primitives (soft edges = the "toy" look). Everything is static or a pure
// function of the frame. Build sets around the origin; +z is toward the default camera, the back wall is at -z.
// Colour tip: pick 4-6 saturated-but-friendly colours per set, keep walls/floors muted, put the saturation on props.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { capG, coneG, cylG, glowMat, matteMat, planeG, propMat, rboxG, sphereG } from "./gfx";
import { hash, rng, shade, TAU, type V3 } from "./util";

type SV = number | V3;
interface P { p?: V3; r?: V3; s?: SV; children?: React.ReactNode }

/** Rounded box mesh. size = [w,h,d]. */
export const RB: React.FC<P & { size: V3; color: string; radius?: number; rough?: number; matte?: boolean; cast?: boolean }> = ({ size, color, radius = 0.03, rough = 0.5, matte, cast = true, p, r, s, children }) => (
  <mesh geometry={rboxG(size[0], size[1], size[2], radius)} material={matte ? matteMat(color) : propMat(color, rough)} position={p} rotation={r} scale={s as any} castShadow={cast} receiveShadow>{children}</mesh>
);
export const Ball: React.FC<P & { r0?: number; color: string; rough?: number; glow?: number }> = ({ r0 = 0.5, color, rough = 0.5, glow, p, r, s, children }) => (
  <mesh geometry={sphereG()} material={glow ? glowMat(color, glow) : propMat(color, rough)} position={p} rotation={r} scale={typeof s === "number" ? r0 * s : s ? (s as V3).map((x) => x * r0) as V3 : r0} castShadow receiveShadow>{children}</mesh>
);
export const Cyl: React.FC<P & { rTop?: number; rBot?: number; h?: number; color: string; rough?: number; matte?: boolean; seg?: number }> = ({ rTop = 0.5, rBot = 0.5, h = 1, color, rough = 0.5, matte, seg = 32, p, r, s, children }) => (
  <mesh geometry={cylG(rTop, rBot, h, seg)} material={matte ? matteMat(color) : propMat(color, rough)} position={p} rotation={r} scale={s as any} castShadow receiveShadow>{children}</mesh>
);

// ───────────────────────── interiors ─────────────────────────

export interface RoomProps { w?: number; d?: number; h?: number; wall?: string; floor?: string; trim?: string; wainscot?: string; ceiling?: boolean; floorBoards?: boolean }
/** Open-front room: floor, back wall (z=-d/2), left/right walls, baseboard, optional wainscot + ceiling. */
export const Room: React.FC<RoomProps> = ({ w = 8, d = 8, h = 3.2, wall = "#f1d3b0", floor = "#b98756", trim = "#fff4e4", wainscot, ceiling = false, floorBoards = true }) => {
  const boards = useMemo(() => Array.from({ length: Math.floor(d / 0.45) }, (_, i) => i), [d]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={planeG()} material={matteMat(floor)} scale={[w, d, 1]} />
      {floorBoards && boards.map((i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -d / 2 + 0.22 + i * 0.45]} geometry={planeG()} material={matteMat(i % 2 ? shade(floor, -0.05) : shade(floor, 0.04))} scale={[w, 0.43, 1]} receiveShadow />)}
      <RB size={[w, h, 0.12]} color={wall} p={[0, h / 2, -d / 2]} matte radius={0.01} />
      <RB size={[0.12, h, d]} color={shade(wall, -0.04)} p={[-w / 2, h / 2, 0]} matte radius={0.01} />
      <RB size={[0.12, h, d]} color={shade(wall, -0.04)} p={[w / 2, h / 2, 0]} matte radius={0.01} />
      <RB size={[w, 0.16, 0.05]} color={trim} p={[0, 0.08, -d / 2 + 0.08]} radius={0.02} />
      <RB size={[0.05, 0.16, d]} color={trim} p={[-w / 2 + 0.08, 0.08, 0]} radius={0.02} />
      <RB size={[0.05, 0.16, d]} color={trim} p={[w / 2 - 0.08, 0.08, 0]} radius={0.02} />
      {wainscot && <RB size={[w, 1.0, 0.07]} color={wainscot} p={[0, 0.65, -d / 2 + 0.09]} radius={0.02} matte />}
      {wainscot && <RB size={[w, 0.07, 0.1]} color={trim} p={[0, 1.18, -d / 2 + 0.09]} radius={0.02} />}
      {ceiling && <RB size={[w, 0.12, d]} color={shade(wall, 0.08)} p={[0, h, 0]} matte radius={0.01} />}
    </group>
  );
};

/** Painted window on a wall (frame, glowing pane, mullions, sill, optional curtains). Face = +z. */
export const Window: React.FC<P & { w?: number; h?: number; glow?: string; frame?: string; curtains?: string; glowIntensity?: number }> = ({ w = 1.5, h = 1.7, glow = "#dff1ff", frame = "#fff6ea", curtains, glowIntensity = 1.6, p, r }) => (
  <group position={p} rotation={r}>
    <mesh position={[0, 0, 0.03]} geometry={planeG()} material={glowMat(glow, glowIntensity)} scale={[w, h, 1]} />
    <RB size={[w + 0.2, 0.1, 0.1]} color={frame} p={[0, h / 2 + 0.05, 0.05]} radius={0.03} />
    <RB size={[w + 0.2, 0.1, 0.1]} color={frame} p={[0, -h / 2 - 0.05, 0.05]} radius={0.03} />
    <RB size={[0.1, h, 0.1]} color={frame} p={[-w / 2 - 0.05, 0, 0.05]} radius={0.03} />
    <RB size={[0.1, h, 0.1]} color={frame} p={[w / 2 + 0.05, 0, 0.05]} radius={0.03} />
    <RB size={[0.05, h, 0.06]} color={frame} p={[0, 0, 0.06]} radius={0.02} />
    <RB size={[w, 0.05, 0.06]} color={frame} p={[0, 0, 0.06]} radius={0.02} />
    <RB size={[w + 0.4, 0.07, 0.3]} color={frame} p={[0, -h / 2 - 0.12, 0.15]} radius={0.03} />
    {curtains && [-1, 1].map((sd) => <RB key={sd} size={[0.5, h + 0.3, 0.12]} color={curtains} p={[(w / 2 + 0.28) * sd, 0.05, 0.12]} radius={0.05} matte />)}
  </group>
);

export const Table: React.FC<P & { w?: number; d?: number; h?: number; top?: string; leg?: string }> = ({ w = 1.6, d = 0.9, h = 0.78, top = "#c58a58", leg = "#8a5a36", p, r, children }) => (
  <group position={p} rotation={r}>
    <RB size={[w, 0.07, d]} color={top} p={[0, h, 0]} radius={0.03} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Cyl key={i} rTop={0.045} rBot={0.035} h={h} color={leg} p={[(a * (w - 0.15)) / 2, h / 2, (b * (d - 0.15)) / 2]} />)}
    <group position={[0, h + 0.035, 0]}>{children}</group>
  </group>
);

export const Chair: React.FC<P & { color?: string; seat?: number }> = ({ color = "#d86a4a", seat = 0.46, p, r }) => (
  <group position={p} rotation={r}>
    <RB size={[0.46, 0.07, 0.46]} color={color} p={[0, seat, 0]} radius={0.03} />
    <RB size={[0.46, 0.5, 0.06]} color={color} p={[0, seat + 0.3, -0.2]} radius={0.03} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Cyl key={i} rTop={0.03} rBot={0.025} h={seat} color={shade(color, -0.25)} p={[a * 0.19, seat / 2, b * 0.19]} />)}
  </group>
);

export const Sofa: React.FC<P & { color?: string; w?: number }> = ({ color = "#6d8fb5", w = 2.2, p, r }) => (
  <group position={p} rotation={r}>
    <RB size={[w, 0.4, 0.95]} color={color} p={[0, 0.3, 0]} radius={0.12} matte />
    <RB size={[w, 0.7, 0.28]} color={color} p={[0, 0.7, -0.38]} radius={0.12} matte />
    {[-1, 1].map((sd) => <RB key={sd} size={[0.28, 0.6, 0.95]} color={shade(color, -0.08)} p={[(w / 2 - 0.1) * sd, 0.45, 0]} radius={0.12} matte />)}
    <RB size={[w - 0.6, 0.18, 0.7]} color={shade(color, 0.1)} p={[0, 0.58, 0.07]} radius={0.08} matte />
  </group>
);

export const Shelf: React.FC<P & { w?: number; rows?: number; seed?: number; wood?: string }> = ({ w = 1.6, rows = 3, seed = 1, wood = "#a8734a", p, r }) => {
  const books = useMemo(() => {
    const g = rng(seed);
    const pal = ["#d9534f", "#5b9bd5", "#f0ad4e", "#5cb85c", "#9b6bd6", "#f4e3c1", "#e87fa0"];
    const out: { x: number; row: number; h: number; c: string; wd: number }[] = [];
    for (let row = 0; row < rows; row++) { let x = -w / 2 + 0.1; while (x < w / 2 - 0.15) { const wd = 0.05 + g() * 0.05; out.push({ x: x + wd / 2, row, h: 0.26 + g() * 0.12, c: pal[Math.floor(g() * pal.length)], wd }); x += wd + 0.008; if (g() < 0.07) x += 0.2; } }
    return out;
  }, [w, rows, seed]);
  return (
    <group position={p} rotation={r}>
      <RB size={[w, rows * 0.45 + 0.1, 0.05]} color={shade(wood, -0.15)} p={[0, (rows * 0.45 + 0.1) / 2, -0.15]} radius={0.01} />
      <RB size={[0.05, rows * 0.45 + 0.1, 0.34]} color={wood} p={[-w / 2, (rows * 0.45 + 0.1) / 2, 0]} radius={0.015} />
      <RB size={[0.05, rows * 0.45 + 0.1, 0.34]} color={wood} p={[w / 2, (rows * 0.45 + 0.1) / 2, 0]} radius={0.015} />
      {Array.from({ length: rows + 1 }, (_, i) => <RB key={i} size={[w, 0.04, 0.34]} color={wood} p={[0, 0.02 + i * 0.45, 0]} radius={0.015} />)}
      {books.map((b, i) => <RB key={i} size={[b.wd, b.h, 0.22]} color={b.c} p={[b.x, 0.04 + b.row * 0.45 + b.h / 2, -0.02]} radius={0.01} cast={false} />)}
    </group>
  );
};

/** Pendant lamp with a real light. */
export const Lamp: React.FC<P & { color?: string; glow?: string; drop?: number; light?: number }> = ({ color = "#f2b84b", glow = "#ffe2a8", drop = 1.0, light = 6, p }) => (
  <group position={p}>
    <Cyl rTop={0.008} rBot={0.008} h={drop} color="#333" p={[0, drop / 2, 0]} />
    <mesh geometry={capG(Math.PI / 2)} material={propMat(color, 0.4)} scale={[0.26, 0.2, 0.26]} castShadow />
    <Ball r0={0.07} color={glow} glow={3} p={[0, -0.05, 0]} />
    <pointLight position={[0, -0.2, 0]} color={glow} intensity={light} distance={6} decay={2} />
  </group>
);

export const Plant: React.FC<P & { pot?: string; leaf?: string; size?: number; seed?: number }> = ({ pot = "#d98a5f", leaf = "#4fa65a", size = 1, seed = 3, p, r }) => {
  const leaves = useMemo(() => { const g = rng(seed); return Array.from({ length: 9 }, () => ({ a: g() * TAU, t: 0.25 + g() * 0.5, s: 0.7 + g() * 0.5 })); }, [seed]);
  return (
    <group position={p} rotation={r} scale={size}>
      <Cyl rTop={0.2} rBot={0.14} h={0.3} color={pot} p={[0, 0.15, 0]} />
      {leaves.map((l, i) => <Ball key={i} r0={0.17 * l.s} color={shade(leaf, (i % 3) * 0.08 - 0.08)} s={[0.7, 1.6, 0.35]} p={[Math.cos(l.a) * 0.16, 0.5 + l.t * 0.4, Math.sin(l.a) * 0.16]} r={[Math.sin(l.a) * 0.55, 0, -Math.cos(l.a) * 0.55]} />)}
    </group>
  );
};

export const Rug: React.FC<P & { color?: string; rim?: string; round?: boolean; w?: number; d?: number }> = ({ color = "#e0735c", rim = "#f6d9a6", round = true, w = 3, d = 2.2, p }) => (
  <group position={p}>
    {round ? <><Cyl rTop={w / 2} rBot={w / 2} h={0.025} color={rim} p={[0, 0.0125, 0]} matte /><Cyl rTop={w / 2 - 0.12} rBot={w / 2 - 0.12} h={0.03} color={color} p={[0, 0.0135, 0]} matte /></> : <><RB size={[w, 0.025, d]} color={rim} p={[0, 0.0125, 0]} radius={0.01} matte /><RB size={[w - 0.2, 0.03, d - 0.2]} color={color} p={[0, 0.0135, 0]} radius={0.01} matte /></>}
  </group>
);

export const Frame: React.FC<P & { w?: number; h?: number; color?: string; art?: string; art2?: string }> = ({ w = 0.6, h = 0.8, color = "#8a5a36", art = "#9fd0e8", art2 = "#f3b75a", p, r }) => (
  <group position={p} rotation={r}>
    <RB size={[w, h, 0.05]} color={color} radius={0.02} />
    <RB size={[w - 0.1, h - 0.1, 0.03]} color={art} p={[0, 0, 0.02]} radius={0.01} matte />
    <Ball r0={Math.min(w, h) * 0.18} color={art2} p={[0.05, 0.08, 0.04]} s={[1, 1, 0.1]} />
  </group>
);

/** Round wall clock. */
export const Clock: React.FC<P> = ({ p, r }) => {
  const f = useCurrentFrame();
  return (
    <group position={p} rotation={r}>
      <Cyl rTop={0.28} rBot={0.28} h={0.07} color="#6b4a30" r={[Math.PI / 2, 0, 0]} />
      <Cyl rTop={0.24} rBot={0.24} h={0.075} color="#fff8ec" r={[Math.PI / 2, 0, 0]} />
      <RB size={[0.02, 0.17, 0.02]} color="#222" p={[0, 0.07, 0.045]} r={[0, 0, -(f / 30) * 0.1]} radius={0.008} />
      <RB size={[0.02, 0.11, 0.02]} color="#222" p={[0, 0.045, 0.05]} r={[0, 0, -(f / 30) * 0.0083]} radius={0.008} />
    </group>
  );
};

export const Oven: React.FC<P & { hot?: number; smoke?: number }> = ({ hot = 0, smoke = 0, p, r }) => (
  <group position={p} rotation={r}>
    <RB size={[0.9, 0.95, 0.75]} color="#e9e4dc" p={[0, 0.475, 0]} radius={0.05} rough={0.35} />
    <RB size={[0.7, 0.45, 0.04]} color="#2c2a2e" p={[0, 0.45, 0.375]} radius={0.03} />
    <mesh position={[0, 0.45, 0.4]} geometry={planeG()} material={glowMat(hot > 0 ? "#ff7a2a" : "#7a6a5a", 0.3 + hot * 2.2)} scale={[0.6, 0.34, 1]} />
    {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <Cyl key={i} rTop={0.035} rBot={0.035} h={0.04} color="#bbb" p={[x, 0.86, 0.38]} r={[Math.PI / 2, 0, 0]} />)}
    {[0, 1, 2, 3].map((i) => <Cyl key={i} rTop={0.13} rBot={0.13} h={0.02} color="#2a2a2e" p={[(i % 2 ? 0.2 : -0.2), 0.955, i < 2 ? -0.12 : 0.15]} />)}
    {smoke > 0 && <Smoke p={[0, 1.0, 0.1]} amount={smoke} rise={1.5} />}
  </group>
);

/** Rising smoke: soft translucent puffs that grow and fade. Pure function of the frame. */
export const Smoke: React.FC<P & { amount?: number; count?: number; color?: string; rise?: number; opacity?: number }> = ({ p, amount = 1, count = 18, color = "#a9a7b4", rise = 1.8, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <group position={p}>
      {Array.from({ length: count }, (_, i) => {
        const ph = (t * 0.45 + i / count) % 1;
        const x = Math.sin(i * 12.3 + ph * 5) * 0.2 * (0.25 + ph) * amount;
        const z = Math.cos(i * 7.7 + ph * 3) * 0.12 * amount;
        const rad = (0.05 + ph * 0.2) * amount;
        const a = opacity * Math.sin(Math.PI * Math.min(1, ph * 1.1)) * (0.6 + 0.4 * (1 - ph));
        return (
          <mesh key={i} geometry={sphereG()} position={[x, ph * rise, z]} scale={rad} renderOrder={5}>
            <meshStandardMaterial color={shade(color, ph * 0.25 - 0.1)} roughness={1} transparent opacity={a} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Cake: React.FC<P & { base?: string; frosting?: string; candles?: number; lit?: boolean }> = ({ base = "#e8b78a", frosting = "#ffd3e0", candles = 3, lit = true, p, r }) => {
  const f = useCurrentFrame();
  return (
    <group position={p} rotation={r}>
      <Cyl rTop={0.3} rBot={0.3} h={0.16} color={base} p={[0, 0.08, 0]} />
      <Cyl rTop={0.31} rBot={0.31} h={0.04} color={frosting} p={[0, 0.17, 0]} rough={0.35} />
      <Cyl rTop={0.21} rBot={0.21} h={0.14} color={base} p={[0, 0.26, 0]} />
      <Cyl rTop={0.22} rBot={0.22} h={0.035} color={frosting} p={[0, 0.34, 0]} rough={0.35} />
      {Array.from({ length: candles }, (_, i) => {
        const a = (i / candles) * TAU;
        return (
          <group key={i} position={[Math.cos(a) * 0.1, 0.36, Math.sin(a) * 0.1]}>
            <Cyl rTop={0.012} rBot={0.012} h={0.12} color={["#5b9bd5", "#f0ad4e", "#d9534f"][i % 3]} p={[0, 0.06, 0]} />
            {lit && <Ball r0={0.02} color="#ffcf6a" glow={4} s={[1, 1.7 + Math.sin(f * 0.6 + i) * 0.2, 1]} p={[0, 0.14, 0]} />}
          </group>
        );
      })}
    </group>
  );
};

export const Pie: React.FC<P & { crust?: string; filling?: string }> = ({ crust = "#e2a458", filling = "#d9534f", p, r }) => (
  <group position={p} rotation={r}>
    <Cyl rTop={0.27} rBot={0.2} h={0.1} color={crust} p={[0, 0.05, 0]} rough={0.7} />
    <Cyl rTop={0.23} rBot={0.23} h={0.03} color={filling} p={[0, 0.1, 0]} rough={0.3} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Ball key={i} r0={0.05} color={shade(filling, i % 2 ? 0.1 : -0.1)} p={[Math.cos(i) * 0.12, 0.13, Math.sin(i) * 0.12]} />)}
  </group>
);

export const Gift: React.FC<P & { color?: string; ribbon?: string; size?: number }> = ({ color = "#5b9bd5", ribbon = "#ffd35c", size = 0.4, p, r }) => (
  <group position={p} rotation={r}>
    <RB size={[size, size, size]} color={color} p={[0, size / 2, 0]} radius={0.02} />
    <RB size={[size + 0.01, size + 0.01, 0.06]} color={ribbon} p={[0, size / 2, 0]} radius={0.01} />
    <RB size={[0.06, size + 0.01, size + 0.01]} color={ribbon} p={[0, size / 2, 0]} radius={0.01} />
    <Ball r0={0.07} color={ribbon} p={[-0.07, size + 0.03, 0]} s={[1, 0.7, 0.6]} />
    <Ball r0={0.07} color={ribbon} p={[0.07, size + 0.03, 0]} s={[1, 0.7, 0.6]} />
  </group>
);

// ───────────────────────── party / mood ─────────────────────────

export const Balloon: React.FC<P & { color?: string; bob?: number; seed?: number; size?: number }> = ({ color = "#f07a8a", bob = 1, seed = 0, size = 0.28, p, r }) => {
  const f = useCurrentFrame();
  const y = Math.sin(f * 0.05 + seed * 3) * 0.04 * bob;
  return (
    <group position={p} rotation={r}>
      <group position={[Math.sin(f * 0.03 + seed) * 0.03 * bob, y, 0]}>
        <mesh geometry={sphereG()} material={propMat(color, 0.22)} scale={[size, size * 1.18, size]} castShadow />
        <Ball r0={0.025} color={shade(color, -0.2)} p={[0, -size * 1.2, 0]} s={[1, 0.8, 1]} />
        <Cyl rTop={0.003} rBot={0.003} h={1.4} color="#e8e8e8" p={[0, -size * 1.2 - 0.7, 0]} />
      </group>
    </group>
  );
};
export const BalloonCluster: React.FC<P & { colors?: string[] }> = ({ colors = ["#f07a8a", "#ffd35c", "#5bc0de", "#9be58b"], p }) => (
  <group position={p}>{colors.map((c, i) => <Balloon key={i} color={c} seed={i} p={[(i - (colors.length - 1) / 2) * 0.32, (i % 2) * 0.2, (i % 3) * 0.08]} size={0.26 + (i % 2) * 0.03} />)}</group>
);

/** String of triangle flags sagging between two points. */
export const Bunting: React.FC<{ from: V3; to: V3; colors?: string[]; sag?: number; count?: number }> = ({ from, to, colors = ["#f07a8a", "#ffd35c", "#5bc0de", "#9be58b", "#b58cf0"], sag = 0.35, count = 12 }) => {
  const f = useCurrentFrame();
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        const x = from[0] + (to[0] - from[0]) * t, z = from[2] + (to[2] - from[2]) * t;
        const y = from[1] + (to[1] - from[1]) * t - Math.sin(t * Math.PI) * sag;
        return <mesh key={i} position={[x, y - 0.12, z]} rotation={[0, 0, Math.PI + Math.sin(f * 0.07 + i) * 0.05]} geometry={coneG(0.16, 0.3, 3)} material={propMat(colors[i % colors.length], 0.7)} scale={[1, 1, 0.12]} castShadow />;
      })}
    </group>
  );
};

/** Falling confetti, one instanced mesh. `from` = first frame it falls; it keeps cycling while on screen. */
export const Confetti: React.FC<{ count?: number; area?: V3; center?: V3; from?: number; speed?: number; colors?: string[]; size?: number }> = ({ count = 160, area = [6, 5, 5], center = [0, 2.6, 0], from = 0, speed = 1.1, colors = ["#f07a8a", "#ffd35c", "#5bc0de", "#9be58b", "#b58cf0", "#ffffff"], size = 0.07 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: hash(i) - 0.5, y: hash(i + 100), z: hash(i + 200) - 0.5, ph: hash(i + 300) * TAU, c: new THREE.Color(colors[i % colors.length]) })), [count, colors]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const t = Math.max(0, frame - from) / fps;
    seeds.forEach((s, i) => {
      const prog = ((t * speed * 0.35 + s.y) % 1);
      dummy.position.set(center[0] + s.x * area[0] + Math.sin(t * 2 + s.ph) * 0.15, center[1] + area[1] / 2 - prog * area[1], center[2] + s.z * area[2]);
      dummy.rotation.set(t * 3 + s.ph, t * 2 + s.ph * 2, t * 4);
      dummy.scale.setScalar(frame < from ? 0 : size);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, s.c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [frame, from, fps, seeds, dummy, area, center, speed, size]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 0.12, 0.6]} />
      <meshStandardMaterial roughness={0.6} emissive="#ffffff" emissiveIntensity={0.15} />
    </instancedMesh>
  );
};

/** Soft god-ray from a window: a tilted additive plane. */
export const LightShaft: React.FC<P & { color?: string; opacity?: number; w?: number; len?: number }> = ({ color = "#fff1c9", opacity = 0.12, w = 1.6, len = 5, p, r }) => (
  <mesh position={p} rotation={r} geometry={planeG()} scale={[w, len, 1]}>
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
  </mesh>
);

// ───────────────────────── outdoors ─────────────────────────

export const Ground: React.FC<{ color?: string; size?: number; y?: number }> = ({ color = "#8fcf6a", size = 80, y = 0 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow geometry={planeG()} material={matteMat(color)} scale={[size, size, 1]} />
);
export const Road: React.FC<P & { w?: number; len?: number; color?: string }> = ({ w = 4, len = 60, color = "#5d5f6e", p }) => (
  <group position={p}>
    <RB size={[w, 0.04, len]} color={color} p={[0, 0.02, 0]} radius={0.01} matte />
    {Array.from({ length: Math.floor(len / 3) }, (_, i) => <RB key={i} size={[0.14, 0.045, 1.2]} color="#f6e8a8" p={[0, 0.025, -len / 2 + 1.5 + i * 3]} radius={0.01} matte cast={false} />)}
    <RB size={[1.6, 0.1, len]} color="#c9c3b8" p={[-w / 2 - 0.8, 0.05, 0]} radius={0.03} matte />
    <RB size={[1.6, 0.1, len]} color="#c9c3b8" p={[w / 2 + 0.8, 0.05, 0]} radius={0.03} matte />
  </group>
);
export const Tree: React.FC<P & { leaf?: string; trunk?: string; size?: number; seed?: number }> = ({ leaf = "#58b868", trunk = "#8a5a36", size = 1, seed = 1, p, r }) => {
  const j = (i: number) => (hash(seed * 13 + i) - 0.5) * 0.35; // per-seed jitter so a row of trees is not a copy-paste
  return (
    <group position={p} rotation={r} scale={size * (0.9 + hash(seed) * 0.25)}>
      <Cyl rTop={0.12} rBot={0.18} h={1.4} color={trunk} p={[0, 0.7, 0]} />
      <Ball r0={0.95} color={leaf} p={[j(1), 2.1, j(2)]} rough={0.8} />
      <Ball r0={0.7} color={shade(leaf, 0.08)} p={[0.55 + j(3), 1.8 + j(4) * 0.5, 0.2 + j(5)]} rough={0.8} />
      <Ball r0={0.65} color={shade(leaf, -0.08)} p={[-0.5 + j(6), 1.9 + j(7) * 0.5, -0.2 + j(8)]} rough={0.8} />
      <Ball r0={0.55} color={shade(leaf, 0.12)} p={[0.1 + j(9), 2.75 + j(10) * 0.4, 0.1 + j(11)]} rough={0.8} />
    </group>
  );
};
export const House: React.FC<P & { wall?: string; roof?: string; w?: number; h?: number; d?: number; door?: string }> = ({ wall = "#f4d9b0", roof = "#c8553d", w = 4, h = 3, d = 3.5, door = "#4a7bc8", p, r }) => (
  <group position={p} rotation={r}>
    <RB size={[w, h, d]} color={wall} p={[0, h / 2, 0]} radius={0.08} matte />
    <mesh position={[0, h + 0.7, 0]} rotation={[0, Math.PI / 4, 0]} geometry={coneG(Math.max(w, d) * 0.78, 1.5, 4)} material={propMat(roof, 0.7)} scale={[w / Math.max(w, d), 1, d / Math.max(w, d)]} castShadow />
    <RB size={[0.9, 1.7, 0.1]} color={door} p={[0, 0.85, d / 2 + 0.02]} radius={0.04} />
    {[-1.2, 1.2].map((x) => <group key={x} position={[x, h * 0.58, d / 2 + 0.02]}><RB size={[0.85, 0.85, 0.08]} color="#fff6ea" radius={0.03} /><mesh position={[0, 0, 0.05]} geometry={planeG()} material={glowMat("#ffe9b0", 0.9)} scale={[0.68, 0.68, 1]} /></group>)}
  </group>
);
export const Cloud: React.FC<P & { size?: number; speed?: number }> = ({ size = 1, speed = 0.15, p }) => {
  const f = useCurrentFrame();
  return (
    <group position={p ? [p[0] + f * speed * 0.03, p[1], p[2]] : undefined} scale={size}>
      {[[0, 0, 0, 1], [0.9, -0.1, 0.1, 0.75], [-0.9, -0.1, 0, 0.8], [0.4, 0.3, 0, 0.7], [-0.3, 0.35, 0, 0.65]].map(([x, y, z, s], i) => <Ball key={i} r0={s as number} color="#ffffff" rough={1} p={[x, y, z] as V3} />)}
    </group>
  );
};
export const LampPost: React.FC<P & { glow?: string }> = ({ glow = "#ffe2a8", p }) => (
  <group position={p}>
    <Cyl rTop={0.05} rBot={0.07} h={3.2} color="#3d3f4e" p={[0, 1.6, 0]} />
    <Ball r0={0.22} color={glow} glow={2.5} p={[0, 3.3, 0]} />
    <pointLight position={[0, 3.2, 0]} color={glow} intensity={10} distance={9} decay={2} />
  </group>
);
export const Fence: React.FC<P & { len?: number; color?: string }> = ({ len = 6, color = "#fff6ea", p, r }) => (
  <group position={p} rotation={r}>
    {Array.from({ length: Math.floor(len / 0.35) }, (_, i) => <RB key={i} size={[0.14, 0.9, 0.05]} color={color} p={[-len / 2 + i * 0.35, 0.45, 0]} radius={0.02} />)}
    <RB size={[len, 0.07, 0.05]} color={color} p={[0, 0.3, -0.04]} radius={0.015} />
    <RB size={[len, 0.07, 0.05]} color={color} p={[0, 0.65, -0.04]} radius={0.015} />
  </group>
);
export const Sun: React.FC<P & { color?: string; size?: number }> = ({ color = "#fff1b0", size = 6, p }) => (
  <Ball r0={size} color={color} glow={5} p={p} />
);

