// <Stage> = the whole 3D render of a short: canvas + sky + fog + lights + IBL + camera + post (DOF, bloom, grade, vignette).
// Put the set and the characters inside it as children. Build the set around the origin (x/z within ~±8 m).
import React, { useLayoutEffect, useMemo } from "react";
import type {} from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evalCamera, type CamState, type Kick, type Shot } from "./camera";
import type { LightRig } from "./look";
import { Post } from "./Post";
import { deg } from "./util";

const SkyDome: React.FC<{ sky: LightRig["sky"] }> = ({ sky }) => {
  const uniforms = useMemo(() => ({ uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uBot: { value: new THREE.Color() } }), []);
  uniforms.uTop.value.set(sky[0]);
  uniforms.uHor.value.set(sky[1]);
  uniforms.uBot.value.set(sky[2]);
  return (
    <mesh scale={170} renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uBot; varying vec3 vP;
          void main(){ float h = normalize(vP).y; vec3 c = h > 0.0 ? mix(uHor, uTop, pow(h, 0.55)) : mix(uHor, uBot, pow(-h, 0.5)); gl_FragColor = vec4(c, 1.0); }`}
      />
    </mesh>
  );
};

const RoomEnv: React.FC<{ intensity: number }> = ({ intensity }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return tex;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = intensity;
  }, [scene, env, intensity]);
  return null;
};

const CameraDriver: React.FC<{ cam: CamState; aspect: number }> = ({ cam, aspect }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(...cam.pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);
    if (cam.roll) camera.rotateZ(deg(cam.roll));
    camera.fov = cam.fov;
    camera.aspect = aspect;
    camera.near = 0.08;
    camera.far = 400;
    camera.updateProjectionMatrix();
  });
  return null;
};

/** Shot `blur` (0..1) -> bokeh radius used by the DOF effect. Tuned by eye at 1080x1920. */
const BOKEH_PER_BLUR = 5;

export interface StageProps {
  shots: Shot[];
  kicks?: Kick[];
  /** total frames of the short (the last shot runs to here) */
  total: number;
  /** light rig for this frame, e.g. lightTrack(LIGHT_KEYS, frame) or RIGS.warmIndoor */
  rig: LightRig;
  /** 0 disables depth of field, 1 = shots' own blur, 2 = double */
  dof?: number;
  /** extra scale on the bokeh radius */
  bokehScale?: number;
  /** vignette darkness 0..1 */
  vignette?: number;
  /** turn the whole post chain off for fast layout stills */
  post?: boolean;
  /** grass/street sets that need a big shadow frustum can raise this (metres half-size) */
  shadowSize?: number;
  children?: React.ReactNode;
}

const Scene: React.FC<StageProps & { aspect: number }> = ({ shots, kicks = [], total, rig, dof = 1, bokehScale = 1, vignette = 0.5, post = true, shadowSize = 8, aspect, children }) => {
  const frame = useCurrentFrame();
  const cam = useMemo(() => evalCamera(shots, kicks, frame, total), [shots, kicks, frame, total]);
  const x = rig.exposure;
  const blur = cam.blur * dof;

  return (
    <>
      <SkyDome sky={rig.sky} />
      <fog attach="fog" args={[rig.fog, rig.fogNear, rig.fogFar]} />
      <RoomEnv intensity={rig.env} />
      <CameraDriver cam={cam} aspect={aspect} />

      <hemisphereLight args={[rig.hemi.sky, rig.hemi.ground, rig.hemi.intensity * x]} />
      <directionalLight
        position={rig.key.dir}
        color={rig.key.color}
        intensity={rig.key.intensity * x}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-shadowSize}
        shadow-camera-right={shadowSize}
        shadow-camera-top={shadowSize}
        shadow-camera-bottom={-shadowSize}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-radius={5}
      />
      <directionalLight position={rig.fill.dir} color={rig.fill.color} intensity={rig.fill.intensity * x} />
      <directionalLight position={rig.rim.dir} color={rig.rim.color} intensity={rig.rim.intensity * x} />

      {children}

      {post && <Post focusDist={cam.focusDist} blur={blur * BOKEH_PER_BLUR * bokehScale} bloom={rig.bloom} sat={rig.sat} vignette={vignette} />}
    </>
  );
};

export const Stage: React.FC<StageProps> = (props) => {
  const { width, height } = useVideoConfig();
  const fast = props.post === false; // layout stills: no composer, so let the renderer tone-map and anti-alias
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      camera={{ fov: 38, near: 0.08, far: 400, position: [0, 1.5, 5] }}
      gl={{ antialias: fast, toneMapping: fast ? THREE.NeutralToneMapping : THREE.NoToneMapping, preserveDrawingBuffer: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} aspect={width / height} />
    </ThreeCanvas>
  );
};

