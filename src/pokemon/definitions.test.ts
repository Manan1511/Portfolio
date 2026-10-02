import { expect, it } from 'vitest';
import { pokemon, flameFrames } from './definitions';
import { frameAt } from '../character/animation';

it('maps Bulbasaur and Squirtle whole walking rows without recolours or editing parts', () => {
  const bulbasaur = Object.values(pokemon).find(species => species.id === 'bulbasaur');
  const squirtle = Object.values(pokemon).find(species => species.id === 'squirtle');
  expect(bulbasaur).toBeDefined();
  expect(squirtle).toBeDefined();
  expect(bulbasaur!.sprite.clips.walk.frames.map(frame => [frame.x, frame.y, frame.width, frame.height]))
    .toEqual([[1, 63, 36, 31], [38, 62, 34, 30], [74, 61, 34, 33], [109, 63, 34, 31], [144, 63, 34, 31]]);
  expect(squirtle!.sprite.clips.walk.frames.map(frame => [frame.x, frame.y, frame.width, frame.height]))
    .toEqual([[2, 95, 45, 36], [49, 94, 47, 35], [100, 96, 44, 34], [146, 95, 45, 35], [193, 94, 47, 36], [243, 96, 44, 35]]);
  for (const species of [bulbasaur!, squirtle!]) {
    expect(species.nativeFacing).toBe(-1);
    expect(species.sprite.clips.walk.loop).toBe(true);
    expect(species.sprite.clips.idle.frames).toHaveLength(1);
  }
});

it('keeps every complete frame in its native canvas without scaling or clipping', () => {
  for (const species of Object.values(pokemon)) for (const clip of Object.values(species.sprite.clips)) {
    expect(clip.frames.length).toBeGreaterThan(0);
    for (const frame of clip.frames) {
      expect(frame.duration).toBeGreaterThan(0);
      expect(frame.target?.width).toBe(frame.width);
      expect(frame.target?.height).toBe(frame.height);
      expect(frame.target!.x).toBeGreaterThanOrEqual(0);
      expect(frame.target!.y).toBeGreaterThanOrEqual(0);
      expect(frame.target!.x + frame.width!).toBeLessThanOrEqual(species.sprite.width);
      expect(frame.target!.y + frame.height!).toBeLessThanOrEqual(species.sprite.height);
      expect(frame.x + frame.width!).toBeLessThanOrEqual(species.sprite.sourceWidth!);
      expect(frame.y + frame.height!).toBeLessThanOrEqual(species.sprite.sourceHeight!);
    }
  }
});

it('provides a registered mouth throughout a 1200ms one-shot attack', () => {
  const attack = pokemon.charizard.sprite.clips.attack;
  expect(attack.loop).toBe(false);
  expect(attack.frames.reduce((sum, frame) => sum + frame.duration, 0)).toBe(1200);
  expect(attack.frames.every(frame => frame.anchors?.mouth)).toBe(true);
  expect(flameFrames).toHaveLength(4);
});

// These source cells were visually checked: wings up, intermediate, flat, down.
// The cell at x=1 is a standing/takeoff pose and must never enter an ambient loop.
const airbornePhase = new Map([[126, 0], [251, 1], [381, 2], [511, 3]]);
it('plays only airborne poses and returns through adjacent wing phases in flight and hover', () => {
  for (const name of ['flight', 'hover']) {
    const clip = pokemon.charizard.sprite.clips[name];
    let previous: number | undefined;
    const visited = new Set<number>();
    for (let elapsed = 0; elapsed < 2400; elapsed += 20) {
      const frame = clip.frames[frameAt(clip, elapsed)];
      const phase = airbornePhase.get(frame.x);
      expect(phase, `ground pose at ${elapsed}ms in ${name}`).toBeDefined();
      if (previous !== undefined) expect(Math.abs(phase! - previous)).toBeLessThanOrEqual(1);
      visited.add(phase!); previous = phase;
    }
    expect(visited.size).toBe(4);
  }
});

it('keeps the flight head registered within two native pixels through the wing cycle', () => {
  const mouths = pokemon.charizard.sprite.clips.flight.frames.map(frame => frame.anchors!.mouth);
  for (const axis of ['x', 'y'] as const) {
    const positions = mouths.map(mouth => mouth[axis]);
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(2);
  }
});

it('recovers from fire through airborne poses and meets the resumed wing loop without a pose jump', () => {
  const { attack, flight } = pokemon.charizard.sprite.clips;
  for (let elapsed = 840; elapsed < 1200; elapsed += 20) {
    expect(airbornePhase.has(attack.frames[frameAt(attack, elapsed)].x)).toBe(true);
  }
  const final = attack.frames[frameAt(attack, 1199)], resumed = flight.frames[frameAt(flight, 0)];
  expect([final.x, final.y, final.target, final.anchors]).toEqual([resumed.x, resumed.y, resumed.target, resumed.anchors]);
});

it('attaches the exhale to the front lip, below the protruding upper muzzle', () => {
  // Hand-checked sheet pixel (570,284): just ahead of the open lip at (571,284).
  // The old point (576,282) sat farther inside the face and covered the nose.
  const exhale = pokemon.charizard.sprite.clips.attack.frames[2];
  const mouth = exhale.anchors!.mouth;
  expect({ x: exhale.x + mouth.x - exhale.target!.x, y: exhale.y + mouth.y - exhale.target!.y })
    .toEqual({ x: 570, y: 284 });
});
