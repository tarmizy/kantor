"use client";

import { memo, useMemo } from "react";
import * as THREE from "three";
import {
  CANVAS_W,
  SCALE,
} from "@/features/retro-office/core/constants";
import { toWorld } from "@/features/retro-office/core/geometry";
import { loadGraphicsQuality } from "@/features/retro-office/core/graphicsQuality";
import { CITY_PATH_ZONE } from "@/features/retro-office/core/district";

// Low-poly city dressing. Everything is simple boxes, cylinders, and shared
// materials so the scene stays cheap. Building count follows the saved
// graphics quality so the low preset stays light.

const hash = (index: number, seed: number) => {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const SKYLINE_Y = -90; // canvas units, just north of the local office
const WINDOW_COLOR = "#ffd98a";
const BUILDING_COLORS = ["#8d9aa6", "#a7b1ba", "#6f7d8a", "#b9c2c9"];

type BuildingSpec = {
  x: number;
  width: number;
  depth: number;
  height: number;
  color: string;
};

const buildSkylineSpecs = (count: number): BuildingSpec[] =>
  Array.from({ length: count }, (_, index) => {
    const span = CANVAS_W / count;
    return {
      x: span * index + span / 2 + (hash(index, 1) - 0.5) * span * 0.3,
      width: 60 + hash(index, 2) * 40,
      depth: 40 + hash(index, 3) * 30,
      height: 6 + hash(index, 4) * 10,
      color: BUILDING_COLORS[index % BUILDING_COLORS.length],
    };
  });

/** Tall, lit towers behind the local office, in the SCBD style. */
export const CitySkyline = memo(function CitySkyline() {
  const isLowQuality = useMemo(() => loadGraphicsQuality() === "low", []);
  const specs = useMemo(() => buildSkylineSpecs(isLowQuality ? 12 : 22), [isLowQuality]);
  const windowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: WINDOW_COLOR,
        emissive: WINDOW_COLOR,
        emissiveIntensity: 0.9,
        roughness: 0.4,
      }),
    [],
  );
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  return (
    <group>
      {specs.map((spec, index) => {
        const [wx, , wz] = toWorld(spec.x, SKYLINE_Y);
        const windowRows = Math.floor(spec.height / 1.4);
        return (
          <group key={`tower-${index}`} position={[wx, 0, wz]}>
            <mesh
              position={[0, spec.height / 2, 0]}
              scale={[spec.width * SCALE, spec.height, spec.depth * SCALE]}
              geometry={boxGeometry}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={spec.color} roughness={0.8} metalness={0.05} />
            </mesh>
            {Array.from({ length: windowRows }).map((_, row) =>
              Array.from({ length: 3 }).map((__, column) =>
                hash(index * 17 + row * 5 + column, 9) > 0.45 ? (
                  <mesh
                    key={`window-${index}-${row}-${column}`}
                    position={[
                      (column - 1) * spec.width * SCALE * 0.28,
                      0.7 + row * 1.4,
                      (spec.depth * SCALE) / 2 + 0.01,
                    ]}
                    scale={[spec.width * SCALE * 0.18, 0.5, 0.02]}
                    geometry={boxGeometry}
                    material={windowMaterial}
                  />
                ) : null,
              ),
            )}
          </group>
        );
      })}
    </group>
  );
});

const SCOOTER_COUNT = 12;

const SCOOTER_COLORS = ["#c62828", "#1565c0", "#2e7d32", "#f9a825", "#212121"];

/** Parked motorbikes along the city path, built from shared primitives. */
export const MotorbikeParking = memo(function MotorbikeParking() {
  const isLowQuality = useMemo(() => loadGraphicsQuality() === "low", []);
  const count = isLowQuality ? SCOOTER_COUNT / 2 : SCOOTER_COUNT;
  const wheelGeometry = useMemo(() => new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), []);
  const bodyGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.32), []);
  const seatGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.04, 0.16), []);
  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1c1c1c", roughness: 0.9 }), []);
  const seatMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.7 }), []);
  const bodyMaterials = useMemo(
    () => SCOOTER_COLORS.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 })),
    [],
  );

  return (
    <group>
      {Array.from({ length: count }).map((_, index) => {
        const x = CITY_PATH_ZONE.minX + 140 + index * ((CITY_PATH_ZONE.maxX - CITY_PATH_ZONE.minX - 280) / count);
        const z = CITY_PATH_ZONE.minY + 70 + (index % 2) * 40;
        const [wx, , wz] = toWorld(x, z);
        const tilt = (hash(index, 5) - 0.5) * 0.3;
        return (
          <group key={`scooter-${index}`} position={[wx, 0, wz]} rotation={[0, tilt, 0]}>
            <mesh position={[0, 0.1, 0]} geometry={bodyGeometry} material={bodyMaterials[index % bodyMaterials.length]} castShadow />
            <mesh position={[0, 0.2, -0.04]} geometry={seatGeometry} material={seatMaterial} castShadow />
            <mesh position={[0, 0.05, 0.12]} rotation={[Math.PI / 2, 0, 0]} geometry={wheelGeometry} material={wheelMaterial} castShadow />
            <mesh position={[0, 0.05, -0.12]} rotation={[Math.PI / 2, 0, 0]} geometry={wheelGeometry} material={wheelMaterial} castShadow />
          </group>
        );
      })}
    </group>
  );
});
