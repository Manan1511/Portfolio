import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { PixelLandscape } from './PixelLandscape';

const originalViewport = { width: window.innerWidth, height: window.innerHeight };
let resize: ResizeObserverCallback | undefined;

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 844 });
  resize = undefined;
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: ResizeObserverCallback) { resize = callback; }
    observe() {}
    disconnect() {}
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalViewport.width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalViewport.height });
});

function resizeTo(width: number, height: number) {
  expect(resize).toBeTypeOf('function');
  act(() => resize!([{ contentRect: { width, height } } as ResizeObserverEntry], {} as ResizeObserver));
}

it('uses the same two-screen-pixel grid as the character on mobile', () => {
  const { container } = render(<PixelLandscape />);
  const artwork = container.querySelector('svg')!;
  expect(artwork).toHaveAttribute('viewBox', '0 0 195 422');
  expect(artwork.style.width).toBe('390px');
  expect(artwork.style.height).toBe('844px');
});

it('keeps scenery pixels at two pixels when the hero grows to desktop', () => {
  const { container } = render(<PixelLandscape />);
  resizeTo(1440, 900);
  const artwork = container.querySelector('svg')!;
  expect(artwork).toHaveAttribute('viewBox', '0 0 720 450');
  expect(artwork.style.width).toBe('1440px');
  expect(artwork.style.height).toBe('900px');
});

it('gives each tree its own depth layer and crops the rightmost crown off-center', () => {
  const { container } = render(<PixelLandscape clearingY={702} />);
  resizeTo(1920, 900);
  const trees = container.querySelectorAll<SVGElement>('.scene-tree');
  expect(trees).toHaveLength(6);
  const edge = trees[3];
  expect(edge).toHaveAttribute('data-tree-x', '454');
  expect(edge.getAttribute('data-ground-y')).not.toBeNull();
  expect(Number(edge.style.zIndex)).toBeGreaterThan(0);
  expect(Number(trees[5].style.zIndex)).toBeGreaterThan(Number(trees[2].style.zIndex));
  expect(container.querySelector('.landscape-terrain .tree-artwork')).toBeNull();
});

it('covers odd viewport dimensions without stretching pixels fractionally', () => {
  const { container } = render(<PixelLandscape />);
  resizeTo(375, 843);
  const artwork = container.querySelector('svg')!;
  expect(artwork).toHaveAttribute('viewBox', '0 0 188 422');
  expect(artwork.style.width).toBe('376px');
  expect(artwork.style.height).toBe('844px');
});

it('keeps the desk clearing at its supplied floor position when the viewport becomes shorter', () => {
  const { container } = render(<PixelLandscape clearingY={470} />);
  resizeTo(320, 568);
  expect(container.querySelector('.landscape-terrain')).toHaveAttribute('transform', 'translate(0 12)');
  expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 160 284');
});

it('centers the clearing on the desk floor without shifting the surrounding terrain', () => {
  const { container, rerender } = render(<PixelLandscape clearingY={470} clearingCenter={{ x: 224, y: 434 }} />);
  resizeTo(390, 844);
  const terrain = container.querySelector('.landscape-terrain')!;
  const shift = terrain.getAttribute('transform');
  const clearing = container.querySelector('.desk-clearing')!;
  // Read the center row's horizontal span from the actual pixel path.
  const row = [...clearing.querySelector('path')!.getAttribute('d')!.matchAll(/M(-?\d+) (-?\d+)h(\d+)/g)]
    .map(match => ({ x: Number(match[1]), y: Number(match[2]), width: Number(match[3]) }))
    .sort((a, b) => b.width - a.width)[0];
  const [dx, dy] = clearing.getAttribute('transform')!.match(/-?\d+/g)!.map(Number);
  const terrainY = Number(shift!.match(/-?\d+/g)![1]);
  expect((row.x + (row.width - 1) / 2 + dx) * 2).toBe(224);
  expect((row.y + dy + terrainY) * 2).toBe(434);
  rerender(<PixelLandscape clearingY={470} clearingCenter={{ x: 244, y: 414 }} />);
  expect(terrain).toHaveAttribute('transform', shift!);
  expect(clearing.getAttribute('transform')).not.toBe(`translate(${dx} ${dy})`);
});
