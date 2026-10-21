"use client";

import { useMemo, type ComponentType } from "react";
import {
  getBatikTextures,
  withRepeat,
} from "@/features/retro-office/core/proceduralTextures";
import { OFFICE_THEME } from "@/features/retro-office/core/theme";
import { CoffeeJarModel } from "@/features/retro-office/objects/kitchen";

// Low-poly Indonesian-flavored lounge and pantry props. All geometry is built
// from Three.js primitives so there are no external model files.
// Each model receives its footprint in world units and fills it.

export type IndonesiaModelProps = {
  widthWorld: number;
  depthWorld: number;
};

function BeanBagModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const radius = Math.min(widthWorld, depthWorld) * 0.45;
  return (
    <mesh position={[0, radius * 0.7, 0]} scale={[radius, radius * 0.7, radius]} castShadow receiveShadow>
      <sphereGeometry args={[1, 18, 14]} />
      <meshStandardMaterial color="#d9822b" roughness={0.92} metalness={0} />
    </mesh>
  );
}

function LesehanMatModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const batik = useMemo(() => withRepeat(getBatikTextures(), 2, 2), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
      <planeGeometry args={[widthWorld, depthWorld]} />
      <meshStandardMaterial
        map={batik.map}
        roughnessMap={batik.roughnessMap}
        roughness={0.92}
        metalness={0}
      />
    </mesh>
  );
}

function LowTableModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const topWidth = widthWorld * 0.92;
  const topDepth = depthWorld * 0.92;
  const legSize = 0.04;
  const legX = topWidth / 2 - legSize;
  const legZ = topDepth / 2 - legSize;
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[topWidth, 0.04, topDepth]} />
        <meshStandardMaterial color={OFFICE_THEME.woodWarm} roughness={0.7} metalness={0.02} />
      </mesh>
      {[
        [-legX, -legZ],
        [legX, -legZ],
        [-legX, legZ],
        [legX, legZ],
      ].map(([x, z]) => (
        <mesh key={`leg-${x}-${z}`} position={[x, 0.14, z]} castShadow>
          <boxGeometry args={[legSize, 0.28, legSize]} />
          <meshStandardMaterial color={OFFICE_THEME.woodWarm} roughness={0.7} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

function RattanChairModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const seatWidth = widthWorld * 0.8;
  const seatDepth = depthWorld * 0.8;
  return (
    <group>
      {/* Woven seat. */}
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[seatWidth, 0.06, seatDepth]} />
        <meshStandardMaterial color={OFFICE_THEME.rattan} roughness={0.85} metalness={0} />
      </mesh>
      {/* Backrest with vertical slats. */}
      {[-0.35, 0, 0.35].map((offset) => (
        <mesh
          key={`slat-${offset}`}
          position={[seatWidth * offset, 0.56, -seatDepth / 2 + 0.03]}
          castShadow
        >
          <boxGeometry args={[0.03, 0.44, 0.03]} />
          <meshStandardMaterial color={OFFICE_THEME.rattan} roughness={0.85} metalness={0} />
        </mesh>
      ))}
      <mesh position={[0, 0.7, -seatDepth / 2 + 0.03]} castShadow>
        <boxGeometry args={[seatWidth, 0.05, 0.03]} />
        <meshStandardMaterial color={OFFICE_THEME.rattan} roughness={0.85} metalness={0} />
      </mesh>
      {/* Legs. */}
      {[
        [-seatWidth / 2 + 0.03, -seatDepth / 2 + 0.03],
        [seatWidth / 2 - 0.03, -seatDepth / 2 + 0.03],
        [-seatWidth / 2 + 0.03, seatDepth / 2 - 0.03],
        [seatWidth / 2 - 0.03, seatDepth / 2 - 0.03],
      ].map(([x, z]) => (
        <mesh key={`rattan-leg-${x}-${z}`} position={[x, 0.15, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color={OFFICE_THEME.woodWarm} roughness={0.8} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function WaterJugModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const radius = Math.min(widthWorld, depthWorld) * 0.36;
  return (
    <group>
      {/* Dispenser stand. */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[radius * 2.2, 0.4, radius * 2.2]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Galon bottle. */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, 0.42, 16]} />
        <meshPhysicalMaterial
          color="#7fb8e6"
          transparent
          opacity={0.55}
          roughness={0.08}
          metalness={0}
        />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[radius * 0.4, radius * 0.5, 0.06, 12]} />
        <meshStandardMaterial color="#f4f4f4" roughness={0.5} metalness={0} />
      </mesh>
    </group>
  );
}

function MonsteraModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const potRadius = Math.min(widthWorld, depthWorld) * 0.3;
  const leaves = [0, 1, 2, 3, 4, 5, 6];
  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[potRadius, potRadius * 0.8, 0.24, 14]} />
        <meshStandardMaterial color={OFFICE_THEME.woodWarm} roughness={0.9} metalness={0} />
      </mesh>
      {leaves.map((index) => {
        const angle = (index / leaves.length) * Math.PI * 2;
        const tilt = 0.5 + (index % 3) * 0.15;
        const height = 0.6 + (index % 4) * 0.12;
        return (
          <mesh
            key={`monstera-leaf-${index}`}
            position={[Math.cos(angle) * 0.1, height, Math.sin(angle) * 0.1]}
            rotation={[tilt, angle, 0]}
            scale={[0.2, 0.02, 0.16]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? OFFICE_THEME.plantGreen : "#4e7a2f"}
              roughness={0.7}
              metalness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function SnakePlantModel({ widthWorld, depthWorld }: IndonesiaModelProps) {
  const potRadius = Math.min(widthWorld, depthWorld) * 0.3;
  const blades = [
    { x: -0.05, z: -0.03, h: 0.7, color: "#4f7a3a" },
    { x: 0.03, z: 0.02, h: 0.85, color: "#5f8f38" },
    { x: 0.07, z: -0.05, h: 0.55, color: "#4f7a3a" },
    { x: -0.08, z: 0.04, h: 0.6, color: "#6da345" },
  ];
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[potRadius, potRadius * 0.85, 0.2, 14]} />
        <meshStandardMaterial color="#d8cdb8" roughness={0.85} metalness={0} />
      </mesh>
      {blades.map((blade) => (
        <mesh key={`snake-blade-${blade.x}-${blade.z}`} position={[blade.x, 0.2 + blade.h / 2, blade.z]} castShadow>
          <coneGeometry args={[0.035, blade.h, 4]} />
          <meshStandardMaterial color={blade.color} roughness={0.6} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/** Procedural models keyed by furniture type, rendered by FurnitureModel. */
export const INDONESIA_ITEM_MODELS: Record<string, ComponentType<IndonesiaModelProps>> = {
  bean_bag: BeanBagModel,
  lesehan_mat: LesehanMatModel,
  low_table: LowTableModel,
  rattan_chair: RattanChairModel,
  water_jug: WaterJugModel,
  monstera: MonsteraModel,
  snake_plant: SnakePlantModel,
  coffee_jar: CoffeeJarModel,
};
