import { describe, expect, it } from "vitest";
import { materializeDefaults } from "@/features/retro-office/core/furnitureDefaults";
import {
  ITEM_FOOTPRINT,
  ITEM_METADATA,
} from "@/features/retro-office/core/geometry";
import type { FurnitureItem } from "@/features/retro-office/core/types";

const NEW_TYPES = [
  "bean_bag",
  "lesehan_mat",
  "low_table",
  "rattan_chair",
  "water_jug",
  "monstera",
  "snake_plant",
  "coffee_jar",
];

// Clearance kept around blocking props so agents can squeeze past them.
const CLEARANCE = 12;
// Keep new props away from doors so agents can still enter and leave rooms.
const DOOR_CLEARANCE = 40;

const boundsOf = (item: FurnitureItem) => {
  const [baseW, baseH] = ITEM_FOOTPRINT[item.type] ?? [40, 40];
  const halfW = (item.w ?? baseW) / 2;
  const halfH = (item.h ?? baseH) / 2;
  return {
    minX: item.x - halfW,
    maxX: item.x + halfW,
    minY: item.y - halfH,
    maxY: item.y + halfH,
  };
};

const overlaps = (
  a: ReturnType<typeof boundsOf>,
  b: ReturnType<typeof boundsOf>,
  margin: number,
) =>
  a.minX < b.maxX + margin &&
  a.maxX > b.minX - margin &&
  a.minY < b.maxY + margin &&
  a.maxY > b.minY - margin;

describe("indonesia furniture registration", () => {
  it("registers every new type with a footprint and navigation metadata", () => {
    for (const type of NEW_TYPES) {
      expect(ITEM_FOOTPRINT[type], type).toBeDefined();
      expect(ITEM_METADATA[type], type).toBeDefined();
    }
  });
});

describe("indonesia furniture default placement", () => {
  const items = materializeDefaults("office");
  const newItems = items.filter((item) => NEW_TYPES.includes(item.type));
  const existingItems = items.filter((item) => !NEW_TYPES.includes(item.type));

  it("places every new type in the default office", () => {
    const placed = new Set(newItems.map((item) => item.type));
    for (const type of NEW_TYPES) {
      expect(placed.has(type), type).toBe(true);
    }
  });

  it("does not overlap existing blocking props", () => {
    const blockingExisting = existingItems.filter(
      (item) => ITEM_METADATA[item.type]?.blocksNavigation,
    );
    const blockingNew = newItems.filter(
      (item) => ITEM_METADATA[item.type]?.blocksNavigation,
    );
    const conflicts: string[] = [];
    for (const item of blockingNew) {
      for (const other of blockingExisting) {
        if (overlaps(boundsOf(item), boundsOf(other), CLEARANCE)) {
          conflicts.push(`${item.type}@${item.x},${item.y} vs ${other.type}@${other.x},${other.y}`);
        }
      }
    }
    expect(conflicts).toEqual([]);
  });

  it("keeps new props clear of doors", () => {
    const doors = items.filter((item) => item.type === "door");
    const conflicts: string[] = [];
    for (const item of newItems) {
      for (const door of doors) {
        if (overlaps(boundsOf(item), boundsOf(door), DOOR_CLEARANCE)) {
          conflicts.push(`${item.type}@${item.x},${item.y} near door@${door.x},${door.y}`);
        }
      }
    }
    expect(conflicts).toEqual([]);
  });
});
