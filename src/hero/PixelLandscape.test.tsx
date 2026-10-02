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

it('covers odd viewport dimensions without stretching pixels fractionally', () => {
  const { container } = render(<PixelLandscape />);
  resizeTo(375, 843);
  const artwork = container.querySelector('svg')!;
  expect(artwork).toHaveAttribute('viewBox', '0 0 188 422');
  expect(artwork.style.width).toBe('376px');
  expect(artwork.style.height).toBe('844px');
});
