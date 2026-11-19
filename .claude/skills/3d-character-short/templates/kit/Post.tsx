// Post-processing chain driven directly by the `postprocessing` library.
//
// WHY NOT @react-three/postprocessing: its <EffectComposer> wrapper renders blank frames under Remotion's
// manual frame stepping (verified: even a lone <ToneMapping/> gives an empty canvas). Driving the composer
// ourselves from useFrame(priority 1) works, supports MSAA + half-float, and every parameter is a plain
// pure function of the frame.
//
// Chain: RenderPass -> DepthOfField -> Bloom -> HueSaturation -> ToneMapping(neutral) -> Vignette
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, HueSaturationEffect, RenderPass, ToneMappingEffect, ToneMappingMode, VignetteEffect } from "postprocessing";
import * as THREE from "three";

export interface PostProps {
  /** world distance (m) the lens is focused at */
  focusDist: number;
  /** bokeh strength; 0 disables depth of field for the frame */
  blur: number;
  bloom: number;
  sat: number;
  vignette: number;
}

export const Post: React.FC<PostProps> = ({ focusDist, blur, bloom, sat, vignette }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const chain = useMemo(() => {
    const composer = new EffectComposer(gl, { frameBufferType: THREE.HalfFloatType, multisampling: 4 });
    const renderPass = new RenderPass(scene, camera);
    const dof = new DepthOfFieldEffect(camera, { focusDistance: 3, focusRange: 2, bokehScale: 2, resolutionScale: 0.6 });
    const bloomFx = new BloomEffect({ intensity: 0.4, luminanceThreshold: 0.92, luminanceSmoothing: 0.2, mipmapBlur: true, radius: 0.7 });
    const hue = new HueSaturationEffect({ saturation: 0.1 });
    const tone = new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL });
    const vig = new VignetteEffect({ offset: 0.28, darkness: 0.5, eskil: false });
    const dofPass = new EffectPass(camera, dof);
    const finalPass = new EffectPass(camera, bloomFx, hue, tone, vig);
    composer.addPass(renderPass);
    composer.addPass(dofPass);
    composer.addPass(finalPass);
    return { composer, dof, dofPass, bloomFx, hue, vig };
  }, [gl, scene, camera]);

  useEffect(() => {
    chain.composer.setSize(size.width, size.height, false);
  }, [chain, size.width, size.height]);

  useEffect(() => () => chain.composer.dispose(), [chain]);

  // parameters for THIS frame (runs before Remotion advances R3F)
  useLayoutEffect(() => {
    chain.dofPass.enabled = blur > 0.01;
    chain.dof.cocMaterial.worldFocusDistance = Math.max(0.2, focusDist);
    chain.dof.cocMaterial.worldFocusRange = Math.max(0.5, focusDist * 0.4);
    chain.dof.bokehScale = blur;
    chain.bloomFx.intensity = bloom;
    chain.hue.saturation = sat;
    chain.vig.darkness = vignette;
  });

  useFrame((_, delta) => {
    chain.composer.render(delta);
  }, 1);

  return null;
};
