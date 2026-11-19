// Cached geometries + "soft vinyl toy" materials. Sharing geometry/materials keeps Remotion's
// per-frame React updates cheap (a character is ~70 meshes, a set is several hundred).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { shade } from "./util";

const geoCache = new Map<string, THREE.BufferGeometry>();
const geo = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
  let g = geoCache.get(key);
  if (!g) { g = make(); geoCache.set(key, g); }
  return g as T;
};

export const sphereG = () => geo("sph", () => new THREE.SphereGeometry(1, 40, 28));
/** Partial sphere (a cap). thetaLength in radians from the top pole. */
export const capG = (thetaLength: number, thetaStart = 0) =>
  geo(`cap-${thetaStart.toFixed(2)}-${thetaLength.toFixed(2)}`, () => new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, thetaStart, thetaLength));
export const capsuleG = (r: number, len: number) =>
  geo(`caps-${r.toFixed(3)}-${len.toFixed(3)}`, () => new THREE.CapsuleGeometry(r, Math.max(0.001, len), 8, 24));
export const cylG = (rTop: number, rBot: number, h: number, seg = 32) =>
  geo(`cyl-${rTop.toFixed(3)}-${rBot.toFixed(3)}-${h.toFixed(3)}-${seg}`, () => new THREE.CylinderGeometry(rTop, rBot, h, seg));
export const torusG = (r: number, tube: number, arc = Math.PI * 2) =>
  geo(`tor-${r.toFixed(3)}-${tube.toFixed(3)}-${arc.toFixed(2)}`, () => new THREE.TorusGeometry(r, tube, 12, 40, arc));
export const rboxG = (w: number, h: number, d: number, radius = 0.03) =>
  geo(`rbox-${w.toFixed(3)}-${h.toFixed(3)}-${d.toFixed(3)}-${radius.toFixed(3)}`, () => new RoundedBoxGeometry(w, h, d, 4, Math.min(radius, w / 2.01, h / 2.01, d / 2.01)));
export const planeG = () => geo("plane", () => new THREE.PlaneGeometry(1, 1));
export const coneG = (r: number, h: number, seg = 32) => geo(`cone-${r.toFixed(3)}-${h.toFixed(3)}-${seg}`, () => new THREE.ConeGeometry(r, h, seg));
export const latheG = (key: string, pts: [number, number][], seg = 40) =>
  geo(`lathe-${key}`, () => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg));

// ───────────────────────── materials ─────────────────────────
const matCache = new Map<string, THREE.Material>();
const mat = <T extends THREE.Material>(key: string, make: () => T): T => {
  let m = matCache.get(key);
  if (!m) { m = make(); matCache.set(key, m); }
  return m as T;
};

/** Skin: warm emissive lift fakes sub-surface scattering so shadow sides stay soft and warm, never grey. */
export const skinMat = (c: string) =>
  mat(`skin${c}`, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.55, sheen: 0.22, sheenRoughness: 0.7, sheenColor: new THREE.Color(shade(c, 0.08)), emissive: new THREE.Color(c), emissiveIntensity: 0.1 }));
/** Cloth: matte with a fuzzy sheen rim. */
export const clothMat = (c: string) =>
  mat(`cloth${c}`, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.88, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(shade(c, 0.35)), emissive: new THREE.Color(c), emissiveIntensity: 0.05 }));
export const hairMat = (c: string) =>
  mat(`hair${c}`, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color(shade(c, 0.4)), emissive: new THREE.Color(c), emissiveIntensity: 0.05, side: THREE.DoubleSide }));
/** Hard-ish glossy plastic / painted wood for props. */
export const propMat = (c: string, rough = 0.5) =>
  mat(`prop${c}-${rough}`, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: rough, clearcoat: 0.25, clearcoatRoughness: 0.5, emissive: new THREE.Color(c), emissiveIntensity: 0.04 }));
export const matteMat = (c: string) => mat(`matte${c}`, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, emissive: new THREE.Color(c), emissiveIntensity: 0.03 }));
/** Always-bright colour (lamps, windows, sun). Values > 1 (use `intensity`) will bloom. */
export const glowMat = (c: string, intensity = 1.6) =>
  mat(`glow${c}-${intensity}`, () => new THREE.MeshStandardMaterial({ color: "#000000", emissive: new THREE.Color(c), emissiveIntensity: intensity, toneMapped: true }));
export const glassMat = (c = "#cfe8ff", opacity = 0.28) =>
  mat(`glass${c}-${opacity}`, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.05, transparent: true, opacity, clearcoat: 1, depthWrite: false }));
export const basicMat = (c: string) => mat(`basic${c}`, () => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }));

export const eyeWhiteMat = () => mat("eyewhite", () => new THREE.MeshPhysicalMaterial({ color: "#fbfbf8", roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.18 }));
export const irisMat = (c: string) => mat(`iris${c}`, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, emissive: new THREE.Color(c), emissiveIntensity: 0.32 }));
export const pupilMat = () => mat("pupil", () => new THREE.MeshStandardMaterial({ color: "#07060a", roughness: 0.2 }));
export const glintMat = () => basicMat("#ffffff");
export const mouthInsideMat = () => mat("mouth", () => new THREE.MeshStandardMaterial({ color: "#46101a", roughness: 0.8, emissive: new THREE.Color("#2a060c"), emissiveIntensity: 0.5 }));
export const tongueMat = () => mat("tongue", () => new THREE.MeshStandardMaterial({ color: "#e0707c", roughness: 0.6, emissive: new THREE.Color("#7a2a34"), emissiveIntensity: 0.3 }));
export const teethMat = () => mat("teeth", () => new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.3, emissive: new THREE.Color("#fff6e0"), emissiveIntensity: 0.25 }));

// ───────────────────────── soft contact shadow ─────────────────────────
let _shadowTex: THREE.CanvasTexture | null = null;
export const contactShadowTexture = () => {
  if (_shadowTex) return _shadowTex;
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(0.45, "rgba(0,0,0,0.28)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  _shadowTex = new THREE.CanvasTexture(cv);
  return _shadowTex;
};
export const contactShadowMat = () =>
  mat("contact-shadow", () => new THREE.MeshBasicMaterial({ map: contactShadowTexture(), transparent: true, depthWrite: false, toneMapped: false, color: "#1a0f2a" }));

/** Vertical alpha ramp (opaque at the bottom, fading to nothing at the top). Used to feather stubble edges. */
let _fadeTex: THREE.CanvasTexture | null = null;
export const fadeAlphaTexture = () => {
  if (_fadeTex) return _fadeTex;
  const cv = document.createElement("canvas");
  cv.width = 4; cv.height = 64;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 64); // canvas y=0 is uv v=1 (top)
  g.addColorStop(0, "#000"); g.addColorStop(0.35, "#777"); g.addColorStop(0.75, "#fff"); g.addColorStop(1, "#fff");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 64);
  _fadeTex = new THREE.CanvasTexture(cv);
  return _fadeTex;
};
export const stubbleMat = (c: string) =>
  mat(`stubble${c}`, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, transparent: true, alphaMap: fadeAlphaTexture(), opacity: 0.75, depthWrite: false }));
