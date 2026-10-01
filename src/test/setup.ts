import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

afterEach(cleanup);
beforeEach(() => Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => true,
  })),
}));
if (!window.PointerEvent) {
  window.PointerEvent = class extends MouseEvent {
    pointerId: number; pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init); this.pointerId = init.pointerId ?? 0; this.pointerType = init.pointerType ?? 'mouse';
    }
  } as typeof PointerEvent;
}
HTMLElement.prototype.setPointerCapture = () => {};
HTMLElement.prototype.releasePointerCapture = () => {};
// jsdom has no graphics backend; canvas rendering is checked in the real browser.
HTMLCanvasElement.prototype.getContext = () => null;
