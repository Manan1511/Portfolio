import { act, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Hero } from './Hero';

const original = { width: window.innerWidth, height: window.innerHeight };
afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: original.width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: original.height });
});

it('fits the scene to viewport height and recalculates integer scale and desk placement on resize', () => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 640 });
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, media: '', onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
  let observers: Array<{ target: HTMLElement; callback: ResizeObserverCallback }> = [];
  vi.stubGlobal('ResizeObserver', class {
    constructor(private callback: ResizeObserverCallback) {}
    observe(target: HTMLElement) {
      observers.push({ target, callback: this.callback });
    }
    disconnect() { observers = observers.filter(observer => observer.callback !== this.callback); }
  });
  const { container } = render(<Hero />);
  expect(container.querySelector<HTMLElement>('.hero-scene')!.style.left).toBe('16px');
  expect(container.querySelector('.desk-clearing')).toHaveAttribute('transform', 'translate(2 -18)');
  const sprite = () => screen.getByRole('img', { name: /Manan/ });
  expect(sprite().style.width).toBe('240px');
  const resizeTo = (width: number, height: number) => act(() => {
    for (const { target, callback } of [...observers]) if (target.matches('.hero, .hero-scene')) callback(
      [{ contentRect: { width, height } } as ResizeObserverEntry], {} as ResizeObserver);
  });
  resizeTo(1440, 900);
  expect(sprite().style.width).toBe('360px');
  resizeTo(320, 568);
  expect(sprite().style.width).toBe('240px');
  expect(container.querySelector<HTMLElement>('.desk-scene')!.style.top).toBe('188px');
  resizeTo(844, 480);
  expect(sprite().style.width).toBe('120px');
});
