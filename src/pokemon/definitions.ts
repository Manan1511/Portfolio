import pikachuSheet from '../assets/pokemon/pikachu.png';
import charizardSheet from '../assets/pokemon/charizard.png';
import type { Point, SpriteDefinition, SpriteFrame } from '../character/animation';

export type PokemonId = 'pikachu' | 'charizard';
export interface PokemonDefinition {
  id: PokemonId; name: string; sprite: SpriteDefinition;
  habitat: 'ground' | 'sky'; speed: readonly [number, number]; rest: readonly [number, number];
  nativeFacing: -1;
}

// Native source pixels are never stretched. Pivots register entire frames.
function frame(rect: readonly [number, number, number, number], pivot: Point, anchor: Point,
  duration: number, mouth?: Point): SpriteFrame {
  const [x, y, width, height] = rect;
  return { x, y, width, height, duration,
    target: { x: anchor.x - (pivot.x - x), y: anchor.y - (pivot.y - y), width, height },
    anchors: mouth ? { mouth: { x: anchor.x + mouth.x - pivot.x, y: anchor.y + mouth.y - pivot.y } } : undefined };
}
const body = { x: 64, y: 56 };
// Only the four tucked-leg airborne poses belong in flight. Register at the
// chest below the jaw, rather than the sheet's shared row baseline: the latter
// made the head drop ten native pixels as the wings moved down.
const flight = [
  frame([126, 168, 123, 65], { x: 178, y: 205 }, body, 120, { x: 140, y: 195 }),
  frame([251, 168, 129, 63], { x: 304, y: 206 }, body, 100, { x: 266, y: 196 }),
  frame([381, 168, 129, 61], { x: 434, y: 216 }, body, 100, { x: 396, y: 206 }),
  frame([511, 167, 126, 64], { x: 563, y: 214 }, body, 120, { x: 525, y: 204 }),
];
const exhale = frame([563, 256, 116, 76], { x: 614, y: 292 }, body, 120, { x: 576, y: 282 });
// Keep the existing 240/600/360ms attack phases. Wind-up and recovery use
// airborne poses; recovery ends on the exact pose that resumes the wing loop.
const attack = [flight[0], exhale, { ...exhale, duration: 600 },
  { ...flight[1], duration: 180 }, { ...flight[0], duration: 180 }];
// Hold the two stroke extremes slightly longer; pass through the middle in
// both directions. No standing/takeoff frame, blending or altered sprite art.
const wingCycle = [0, 1, 2, 3, 2, 1].map(index => flight[index]);
const feet = { x: 24, y: 40 };
const walkRects = [[1, 42, 45, 36], [47, 44, 46, 30], [94, 41, 44, 36],
  [139, 41, 44, 36], [184, 45, 45, 32], [230, 45, 46, 32]] as const;

export const pokemon: Record<PokemonId, PokemonDefinition> = {
  pikachu: { id: 'pikachu', name: 'Pikachu', habitat: 'ground', nativeFacing: -1,
    speed: [24, 36], rest: [1500, 3000], sprite: {
      image: pikachuSheet, width: 48, height: 44, sourceWidth: 512, sourceHeight: 254,
      anchors: { feet }, clips: {
        idle: { loop: true, frames: [frame([1, 1, 37, 39], { x: 23, y: 40 }, feet, 1000)] },
        walk: { loop: true, frames: walkRects.map(rect => frame(rect,
          { x: rect[0] + 22, y: rect[1] + rect[3] }, feet, 80)) },
      },
    } },
  charizard: { id: 'charizard', name: 'Charizard', habitat: 'sky', nativeFacing: -1,
    speed: [28, 44], rest: [1000, 2000], sprite: {
      image: charizardSheet, width: 140, height: 96, sourceWidth: 1102, sourceHeight: 587,
      anchors: { body, mouth: { x: 24, y: 34 } }, clips: {
        flight: { loop: true, frames: wingCycle }, hover: { loop: true, frames: wingCycle },
        attack: { loop: false, frames: attack },
      },
    } },
};

export const flameFrames = [
  { x: 1021, y: 432, width: 15, height: 30 },
  { x: 1037, y: 431, width: 20, height: 31 },
  { x: 1061, y: 431, width: 21, height: 31 },
  { x: 1086, y: 430, width: 15, height: 32 },
];
