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
