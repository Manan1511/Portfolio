import { expect, it } from 'vitest';
import { manan } from './manan';

it('keeps identical body artwork and registration across talking, typing, rest', () => {
  const reference = manan.clips.typing.frames[0];
  for (const name of ['talking', 'typing', 'seated-idle']) {
    for (const frame of manan.clips[name].frames) {
      expect([frame.image, frame.x, frame.y, frame.width, frame.height, frame.target]).toEqual([
        reference.image, reference.x, reference.y, reference.width, reference.height, reference.target,
      ]);
    }
  }
});

it('speaks with registered artwork while keeping hair, glasses and body fixed', () => {
  const closed = manan.clips['seated-idle'].frames[0].layers![0];
  const talking = manan.clips.talking.frames;
  expect(talking.some(frame => frame.layers!.length > 1)).toBe(true);
  for (const frame of talking) {
    expect(frame.pixels).toBeUndefined();
    expect(frame.layers![0]).toEqual(closed);
    for (const expression of frame.layers!.slice(1)) {
      expect(expression.image).toBe(closed.image);
      expect(expression.target).toEqual(closed.target);
      // Authored lip bounds exclude the nose above and jaw edge to the right.
      const area = expression.clip!;
      expect(area.x).toBeGreaterThanOrEqual(56);
      expect(area.y).toBeGreaterThanOrEqual(64);
      expect(area.x + area.width).toBeLessThanOrEqual(64);
      expect(area.y + area.height).toBeLessThanOrEqual(67);
    }
  }
});
