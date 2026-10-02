import { frameAt, type Point } from '../character/animation';
import type { PokemonDefinition } from './definitions';

export interface Rect { left: number; top: number; right: number; bottom: number }
export interface PokemonWorld {
  width: number; height: number; skyBottom: number; floor: number; obstacles: Rect[];
  groundObstacles?: Rect[];
}

// Ground-plane collision stays at the feet so a walker can pass behind a
// canopy without treating the entire visual tree as a solid rectangle.
export function groundFootprint(definition: PokemonDefinition, position: Point): Rect {
  const feet = definition.sprite.anchors.feet;
  const nativeX = feet.x * 2, mirroredX = (definition.sprite.width - feet.x) * 2;
  const y = position.y + feet.y * 2;
  const halfWidth = definition.sprite.width / 2;
  // Register a conservative union of both facings. An off-center foot anchor
  // must not slip into a trunk when the same sprite flips during departure.
  return { left: position.x + Math.min(nativeX, mirroredX) - halfWidth,
    right: position.x + Math.max(nativeX, mirroredX) + halfWidth, top: y - 4, bottom: y + 4 };
}
export interface Actor {
  position: Point; origin: Point; target: Point; facing: -1 | 1;
  mode: 'rest' | 'move'; modeElapsed: number; duration: number;
  animationElapsed: number; attackElapsed: number | null;
}
interface Flags { paused: boolean; reduced: boolean; held: boolean }
const randomBetween = (range: readonly [number, number], rng: () => number) => range[0] + rng() * (range[1] - range[0]);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export function habitatBounds(definition: PokemonDefinition, world: PokemonWorld) {
  const width = definition.sprite.width * 2, height = definition.sprite.height * 2;
  const horizontalPadding = Math.max(0, Math.min(16, (world.width - width) / 2));
  const minY = definition.habitat === 'sky' ? 16 : world.floor + 16 - (definition.groundInset ?? 0);
  const maxY = Math.max(16, Math.floor((definition.habitat === 'sky' ? world.skyBottom - 16 - height : world.height - 16 - height) / 2) * 2);
  const left = Math.ceil(horizontalPadding / 2) * 2;
  const right = Math.max(left, Math.floor((world.width - horizontalPadding - width) / 2) * 2);
  const range = definition.roamX ?? [0, 1];
  const minX = Math.ceil((left + range[0] * (right - left)) / 2) * 2;
  return { minX, maxX: Math.max(minX, Math.floor((left + range[1] * (right - left)) / 2) * 2),
    minY: Math.min(Math.ceil(minY / 2) * 2, maxY), maxY };
}

function forbidden(definition: PokemonDefinition, world: PokemonWorld): Rect[] {
  const obstacles = world.obstacles.map(rect => ({ left: rect.left - definition.sprite.width * 2 - 8,
    right: rect.right + 8, top: rect.top - definition.sprite.height * 2 - 8, bottom: rect.bottom + 8 }));
  if (definition.habitat !== 'ground') return obstacles;
  const feet = groundFootprint(definition, { x: 0, y: 0 });
  return [...obstacles, ...(world.groundObstacles ?? []).map(rect => ({
    left: rect.left - feet.right - 2, right: rect.right - feet.left + 2,
    top: rect.top - feet.bottom - 2, bottom: rect.bottom - feet.top + 2,
  }))];
}
function inside(point: Point, rect: Rect) {
  return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;
}
function intersects(start: Point, end: Point, rect: Rect) {
  let enter = 0, exit = 1;
  for (const [origin, delta, min, max] of [[start.x, end.x - start.x, rect.left, rect.right],
    [start.y, end.y - start.y, rect.top, rect.bottom]]) {
    if (Math.abs(delta) < .00001) { if (origin <= min || origin >= max) return false; continue; }
    const a = (min - origin) / delta, b = (max - origin) / delta;
    enter = Math.max(enter, Math.min(a, b)); exit = Math.min(exit, Math.max(a, b));
    if (enter > exit) return false;
  }
  return true;
}
function clampPoint(point: Point, definition: PokemonDefinition, world: PokemonWorld) {
  const bounds = habitatBounds(definition, world);
  return { x: clamp(point.x, bounds.minX, bounds.maxX), y: clamp(point.y, bounds.minY, bounds.maxY) };
}
function safePosition(point: Point, definition: PokemonDefinition, world: PokemonWorld): Point {
  const bounds = habitatBounds(definition, world), obstacles = forbidden(definition, world);
  const preferred = clampPoint(point, definition, world);
  const blocked = (candidate: Point) => obstacles.some(rect => inside(candidate, rect));
  if (!blocked(preferred)) return preferred;
  // A corner alone can intersect the desk on a smaller viewport. Also consider
  // obstacle edges and choose the nearest valid location when bounds change.
  const candidates = [
    { x: bounds.minX, y: bounds.minY }, { x: bounds.maxX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY }, { x: bounds.maxX, y: bounds.maxY },
    ...obstacles.flatMap(rect => [
      { x: rect.left - 2, y: preferred.y }, { x: rect.right + 2, y: preferred.y },
      { x: preferred.x, y: rect.top - 2 }, { x: preferred.x, y: rect.bottom + 2 },
    ]).map(candidate => clampPoint(candidate, definition, world)),
  ];
  return candidates.filter(candidate => !blocked(candidate))
    .sort((a, b) => Math.hypot(a.x - preferred.x, a.y - preferred.y)
      - Math.hypot(b.x - preferred.x, b.y - preferred.y))[0] ?? preferred;
}
function destination(origin: Point, definition: PokemonDefinition, world: PokemonWorld, rng: () => number): Point {
  const bounds = habitatBounds(definition, world), obstacles = forbidden(definition, world);
  const candidates = Array.from({ length: 24 }, () => ({ x: bounds.minX + rng() * (bounds.maxX - bounds.minX),
    y: bounds.minY + rng() * (bounds.maxY - bounds.minY) }));
  candidates.push({ x: bounds.minX, y: bounds.minY }, { x: bounds.maxX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY }, { x: bounds.maxX, y: bounds.maxY });
  return candidates.find(point => Math.hypot(point.x - origin.x, point.y - origin.y) >= 8
    && !obstacles.some(rect => inside(point, rect) || intersects(origin, point, rect))) ?? origin;
}

export function createActor(definition: PokemonDefinition, world: PokemonWorld, rng = Math.random): Actor {
  const bounds = habitatBounds(definition, world);
  const spawn = definition.spawn ?? { x: definition.habitat === 'sky' ? .68 : .22, y: .45 };
  const position = safePosition({ x: bounds.minX + spawn.x * (bounds.maxX - bounds.minX),
    y: bounds.minY + spawn.y * (bounds.maxY - bounds.minY) }, definition, world);
  return { position, origin: position, target: position, facing: -1, mode: 'rest', modeElapsed: 0,
    duration: randomBetween(definition.rest, rng), animationElapsed: 0, attackElapsed: null };
}

export function reconcileActor(actor: Actor, definition: PokemonDefinition, world: PokemonWorld): Actor {
  const position = safePosition(actor.position, definition, world);
  return { ...actor, position, origin: position, target: position, mode: 'rest', modeElapsed: 0 };
}

export function beginAttack(actor: Actor, definition: PokemonDefinition, world: PokemonWorld): Actor {
  if (definition.id !== 'charizard' || actor.attackElapsed !== null) return actor;
  const mouth = definition.sprite.clips.attack.frames[2].anchors!.mouth;
  const leftSpace = actor.position.x + mouth.x * 2 - 16;
  const rightSpace = world.width - 16 - (actor.position.x + (definition.sprite.width - mouth.x) * 2);
  return { ...actor, attackElapsed: 0, facing: rightSpace > leftSpace ? 1 : -1 };
}

export function advanceActor(actor: Actor, definition: PokemonDefinition, world: PokemonWorld,
  delta: number, flags: Flags, rng = Math.random): Actor {
  if (actor.attackElapsed !== null) {
    const attackElapsed = actor.attackElapsed + delta;
    if (attackElapsed >= (flags.reduced ? 300 : 1200)) return { ...actor, attackElapsed: null, animationElapsed: 0 };
    return { ...actor, attackElapsed };
  }
  if (flags.paused || flags.reduced) return actor;
  const animationElapsed = actor.animationElapsed + delta;
  if (flags.held) return { ...actor, animationElapsed };
  const modeElapsed = actor.modeElapsed + delta;
  if (actor.mode === 'rest') {
    if (modeElapsed < actor.duration) return { ...actor, modeElapsed, animationElapsed };
    const target = destination(actor.position, definition, world, rng);
    const distance = Math.hypot(target.x - actor.position.x, target.y - actor.position.y);
    if (distance < 8) return { ...actor, modeElapsed: 0, duration: randomBetween(definition.rest, rng), animationElapsed };
    return { ...actor, mode: 'move', modeElapsed: 0, origin: actor.position, target,
      facing: target.x >= actor.position.x ? 1 : -1,
      duration: Math.max(500, distance / randomBetween(definition.speed, rng) * 1000),
      animationElapsed: definition.habitat === 'sky' ? animationElapsed : 0 };
  }
  const t = Math.min(1, modeElapsed / actor.duration), eased = t * t * (3 - 2 * t);
  const position = { x: actor.origin.x + (actor.target.x - actor.origin.x) * eased,
    y: actor.origin.y + (actor.target.y - actor.origin.y) * eased };
  if (t === 1) return { ...actor, position, mode: 'rest', modeElapsed: 0,
    duration: randomBetween(definition.rest, rng), animationElapsed: definition.habitat === 'sky' ? animationElapsed : 0 };
  return { ...actor, position, modeElapsed, animationElapsed, facing: actor.target.x >= actor.origin.x ? 1 : -1 };
}

export function actorClip(actor: Actor, definition: PokemonDefinition) {
  return actor.attackElapsed !== null ? 'attack' : definition.habitat === 'sky'
    ? actor.mode === 'move' ? 'flight' : 'hover' : actor.mode === 'move' ? 'walk' : 'idle';
}
export function actorFrame(actor: Actor, definition: PokemonDefinition, reduced: boolean) {
  if (reduced) return actor.attackElapsed !== null ? 2 : 0;
  return frameAt(definition.sprite.clips[actorClip(actor, definition)], actor.attackElapsed ?? actor.animationElapsed);
}
export function fireGeometry(actor: Actor, definition: PokemonDefinition, world: PokemonWorld, reduced: boolean) {
  const index = reduced ? 2 : frameAt(definition.sprite.clips.attack, actor.attackElapsed ?? 0);
  const mouth = definition.sprite.clips.attack.frames[index].anchors!.mouth;
  const mouthX = actor.position.x + (actor.facing === -1 ? mouth.x : definition.sprite.width - mouth.x) * 2;
  const available = actor.facing === -1 ? mouthX - 16 : world.width - 16 - mouthX;
  const length = Math.max(0, Math.floor(Math.min(120, available) / 2) * 2);
  return { mouth, length, worldLeft: actor.facing === -1 ? mouthX - length : mouthX,
    visible: actor.attackElapsed !== null && (reduced || (actor.attackElapsed >= 240 && actor.attackElapsed < 840)) && length >= 2 };
}
