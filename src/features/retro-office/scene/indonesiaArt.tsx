"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { OFFICE_THEME } from "@/features/retro-office/core/theme";

// Procedural Indonesia-flavored office art. Everything is drawn at runtime
// (flat planes and 2D canvas textures), so there are no bundled images or
// external fonts.

const FLAG_WIDTH = 0.3;
// Indonesia's flag is 2:3 (width:height), so height is 1.5x the width.
const FLAG_HEIGHT = FLAG_WIDTH * 1.5;

export function IndonesiaFlagArt() {
  return (
    <>
      <mesh position={[0, FLAG_HEIGHT / 4, 0]}>
        <planeGeometry args={[FLAG_WIDTH, FLAG_HEIGHT / 2]} />
        <meshBasicMaterial color={OFFICE_THEME.accentRed} side={2} />
      </mesh>
      <mesh position={[0, -FLAG_HEIGHT / 4, 0]}>
        <planeGeometry args={[FLAG_WIDTH, FLAG_HEIGHT / 2]} />
        <meshBasicMaterial color={OFFICE_THEME.accentWhite} side={2} />
      </mesh>
    </>
  );
}

export type PosterKind = "gas" | "ship" | "kopi";

type PosterSpec = {
  lines: string[];
  background: string;
  foreground: string;
  accent: string;
};

const POSTER_SPECS: Record<PosterKind, PosterSpec> = {
  gas: {
    lines: ["Gas Terus!"],
    background: OFFICE_THEME.accentRed,
    foreground: OFFICE_THEME.textLight,
    accent: OFFICE_THEME.accentWhite,
  },
  ship: {
    lines: ["Ship it,", "Bos"],
    background: OFFICE_THEME.wallAccent,
    foreground: OFFICE_THEME.textDark,
    accent: OFFICE_THEME.accentRed,
  },
  kopi: {
    lines: ["Kopi Dulu,", "Deploy Kemudian"],
    background: OFFICE_THEME.woodWarm,
    foreground: OFFICE_THEME.textLight,
    accent: OFFICE_THEME.rattan,
  },
};

const POSTER_WIDTH = 1024;
const POSTER_HEIGHT = 720;
const POSTER_MAX_TEXT_WIDTH = POSTER_WIDTH * 0.84;
const POSTER_FONT_FAMILY = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

const posterTextureCache = new Map<PosterKind, THREE.CanvasTexture>();

const drawPoster = (ctx: CanvasRenderingContext2D, spec: PosterSpec) => {
  ctx.fillStyle = spec.background;
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  // Thin accent bar at the bottom edge ties the poster to the flag colors.
  ctx.fillStyle = spec.accent;
  ctx.fillRect(0, POSTER_HEIGHT - 28, POSTER_WIDTH, 28);

  ctx.fillStyle = spec.foreground;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Shrink the font until the longest line fits the poster width.
  let fontSize = 150;
  const measureLongest = () =>
    Math.max(...spec.lines.map((line) => ctx.measureText(line).width));
  do {
    ctx.font = `800 ${fontSize}px ${POSTER_FONT_FAMILY}`;
    fontSize -= 6;
  } while (measureLongest() > POSTER_MAX_TEXT_WIDTH && fontSize > 40);

  const lineHeight = fontSize * 1.15;
  const blockTop = POSTER_HEIGHT / 2 - ((spec.lines.length - 1) * lineHeight) / 2 - 14;
  spec.lines.forEach((line, index) => {
    ctx.fillText(line, POSTER_WIDTH / 2, blockTop + index * lineHeight);
  });
};

/** Canvas texture for one poster, cached so repeat callers share it. */
export const getPosterTexture = (kind: PosterKind): THREE.CanvasTexture | null => {
  const cached = posterTextureCache.get(kind);
  if (cached) return cached;
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  drawPoster(ctx, POSTER_SPECS[kind]);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  posterTextureCache.set(kind, texture);
  return texture;
};

/** Poster art sized to fill a FramedPicture's inner area. */
export function PosterArt({
  kind,
  width,
  height,
}: {
  kind: PosterKind;
  width: number;
  height: number;
}) {
  const texture = useMemo(() => getPosterTexture(kind), [kind]);
  if (!texture) return null;
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

const BRAND_LOGO_PATH = "/brand/codday-logo.png";

let brandLogoTexture: THREE.Texture | null = null;

/**
 * Brand logo texture from /public. It loads in the background, so the wall
 * shows the placeholder color until the image arrives. No Suspense needed.
 */
const getBrandLogoTexture = () => {
  if (!brandLogoTexture) {
    brandLogoTexture = new THREE.TextureLoader().load(BRAND_LOGO_PATH);
    brandLogoTexture.colorSpace = THREE.SRGBColorSpace;
    brandLogoTexture.anisotropy = 8;
  }
  return brandLogoTexture;
};

/** Square brand logo sized to fill a FramedPicture's inner area. */
export function BrandLogoArt({ size }: { size: number }) {
  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={getBrandLogoTexture()} toneMapped={false} />
    </mesh>
  );
}
