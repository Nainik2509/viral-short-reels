// The set for the demo story: a cosy kitchen. Replace with YOUR world; keep the pattern:
// one <Room> (walls taller than the highest camera view, or the sky shows above them), 2-3 hero props the story needs, 6-10 background props for depth, warm practical lights.
import React from "react";
import { Balloon, BalloonCluster, Bunting, Chair, Clock, Cyl, Frame, LightShaft, Lamp, Oven, Plant, Pie, RB, Room, Rug, Shelf, Table, Window, Cake } from "../../src/three";
import { cylG, glassMat } from "../../src/three";

export const Kitchen: React.FC<{ ovenHot: number; ovenSmoke: number; wrapped: boolean; party: boolean; tension: number }> = ({ ovenHot, ovenSmoke, wrapped, party, tension }) => (
  <group>
    <Room w={9} d={8} h={4.6} wall="#f6d8b4" floor="#b98458" wainscot="#9fd0c4" trim="#fff6e6" />
    {/* back wall: counter, oven, window, shelf, clock */}
    <RB size={[3.6, 0.95, 0.75]} color="#c58a58" p={[-1.9, 0.475, -3.5]} radius={0.05} />
    <RB size={[3.7, 0.07, 0.8]} color="#f4ede2" p={[-1.9, 0.98, -3.5]} radius={0.03} rough={0.3} />
    <Oven p={[1.0, 0, -3.5]} hot={ovenHot} smoke={ovenSmoke} />
    <Window p={[-2.6, 2.0, -3.93]} w={1.5} h={1.5} curtains="#f07a8a" glowIntensity={1.6 - 1.1 * tension} />
    <LightShaft p={[-1.7, 1.5, -2.2]} r={[-0.2, 0.35, -0.5]} w={1.7} len={4.5} opacity={0.1 * (1 - tension)} />
    <Shelf p={[2.9, 1.5, -3.78]} w={1.5} rows={2} seed={4} />
    <Clock p={[0.4, 2.55, -3.9]} />
    <Frame p={[-0.9, 2.4, -3.92]} w={0.55} h={0.7} />
    <Lamp p={[0.2, 3.3, -0.8]} drop={1.3} light={5 * (1 - 0.85 * tension)} />
    <Plant p={[3.7, 0, -3.2]} size={1.3} />
    <Plant p={[-4.0, 0, -2.0]} size={1.0} seed={8} />
    {/* middle ground: table + pie + chair + rug */}
    <Rug p={[0.05, 0, -0.2]} w={3.8} color="#e9a086" rim="#f8e3bb" />
    <Table p={[0.1, 0, -1.3]} w={1.9} d={1.0}>
      {party ? <Cake p={[0.5, 0, 0.05]} candles={3} lit /> : null}
      <Pie p={[-0.3, 0, 0.05]} />
      {wrapped && <mesh position={[-0.3, 0.1, 0.05]} geometry={cylG(0.3, 0.3, 0.22, 36)} material={glassMat("#eaf6ff", 0.42)} />}
      <Cyl rTop={0.07} rBot={0.07} h={0.2} color="#f4ede2" p={[-0.7, 0.1, 0.25]} />
    </Table>
    <Chair p={[1.5, 0, -1.3]} r={[0, -1.2, 0]} color="#d86a4a" />
    {/* party dressing */}
    <Bunting from={[-4.3, 3.1, -3.85]} to={[4.3, 3.1, -3.85]} sag={0.5} />
    <Bunting from={[-4.35, 3.0, -3.4]} to={[-4.35, 3.0, 2.6]} sag={0.3} count={9} />
    <BalloonCluster p={[3.6, 1.9, -2.6]} />
    <Balloon p={[-3.6, 1.7, -2.4]} color="#5bc0de" seed={4} />
  </group>
);
