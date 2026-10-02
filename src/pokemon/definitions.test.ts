import { expect, it } from 'vitest';
import { pokemon, flameFrames } from './definitions';

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
