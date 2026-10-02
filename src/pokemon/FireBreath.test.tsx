import { act, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { FireBreath } from './FireBreath';

afterEach(() => vi.unstubAllGlobals());

it.each([44, 56, 120])('draws complete flame packets inside a %ipx effect without cutting their tips', async length => {
  vi.stubGlobal('Image', class {
    onload: (() => void) | null = null;
    set src(_value: string) { queueMicrotask(() => this.onload?.()); }
  });
  const draws: Array<{ left: number; right: number; top: number; bottom: number }> = [];
  let transform = { x: 0, y: 0, angle: 0 };
  const stack: typeof transform[] = [];
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ({
    clearRect() {}, imageSmoothingEnabled: false, globalAlpha: 1,
    beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, clip() {},
    save() { stack.push({ ...transform }); }, restore() { transform = stack.pop()!; },
    translate(x: number, y: number) { transform.x += x; transform.y += y; },
    rotate(angle: number) { transform.angle += angle; },
    drawImage(_image: unknown, _sx: number, _sy: number, _sw: number, _sh: number,
      x: number, y: number, width: number, height: number) {
      const corners = [[x, y], [x + width, y], [x, y + height], [x + width, y + height]]
        .map(([px, py]) => ({ x: transform.x + px * Math.cos(transform.angle) - py * Math.sin(transform.angle),
          y: transform.y + px * Math.sin(transform.angle) + py * Math.cos(transform.angle) }));
      draws.push({ left: Math.min(...corners.map(p => p.x)), right: Math.max(...corners.map(p => p.x)),
        top: Math.min(...corners.map(p => p.y)), bottom: Math.max(...corners.map(p => p.y)) });
    },
  } as unknown as CanvasRenderingContext2D));
  const { rerender } = render(<FireBreath mouth={{ x: 26, y: 46 }} length={length} elapsed={0} still={false} />);
  for (const elapsed of [0, 79, 160, 300, 599]) {
    rerender(<FireBreath mouth={{ x: 26, y: 46 }} length={length} elapsed={elapsed} still={false} />);
    await act(async () => { await Promise.resolve(); });
  }
  rerender(<FireBreath mouth={{ x: 26, y: 46 }} length={length} elapsed={160} still />);
  await act(async () => { await Promise.resolve(); });
  expect(draws.length).toBeGreaterThan(0);
  for (const draw of draws) {
    expect(draw.left).toBeGreaterThanOrEqual(-.00001);
    expect(draw.right).toBeLessThanOrEqual(length / 2 + .00001);
    expect(draw.top).toBeGreaterThanOrEqual(-.00001);
    expect(draw.bottom).toBeLessThanOrEqual(24.00001);
  }
});
