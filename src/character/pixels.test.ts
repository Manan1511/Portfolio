import { expect, it } from 'vitest';
import { animatePixels } from './pixels';

it('bends whole connected arm around fixed elbow without changing body', () => {
  const original = new Uint8ClampedArray(10 * 10 * 4);
  for (let x = 2; x <= 8; x++) for (let y = 4; y <= 5; y++) original.set([170, 100, 60, 255], (y * 10 + x) * 4);
  original.set([30, 30, 30, 255], (2 * 10 + 2) * 4);
  const output = animatePixels(original, 10, 10, [{ type: 'arm', rect: { x: 2, y: 3, width: 7, height: 4 }, pivotX: 2, amount: 2 }]);
  expect(output[(4 * 10 + 2) * 4 + 3]).toBe(255);
  expect(Array.from(output.slice((6 * 10 + 8) * 4, (6 * 10 + 8) * 4 + 4))).toEqual([170, 100, 60, 255]);
  expect(output[(4 * 10 + 8) * 4 + 3]).toBe(0);
  expect(Array.from(output.slice((2 * 10 + 2) * 4, (2 * 10 + 2) * 4 + 4))).toEqual([30, 30, 30, 255]);
  for (let x = 2; x < 8; x++) {
    const connected = Array.from({ length: 10 }, (_, y) => y).some(y => output[(y * 10 + x) * 4 + 3] === 255 && output[(y * 10 + x + 1) * 4 + 3] === 255);
    expect(connected).toBe(true);
  }
  expect(original[(4 * 10 + 8) * 4 + 3]).toBe(255);
});
