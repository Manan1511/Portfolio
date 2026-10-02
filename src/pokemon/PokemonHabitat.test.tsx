import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { PokemonHabitat } from './PokemonHabitat';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
function setup(reduced = false) {
  vi.useFakeTimers();
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: reduced, media: '', onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  const rect = (x: number, y: number, width: number, height: number) => ({ x, y, left: x, top: y, width, height, right: x + width, bottom: y + height, toJSON() {} });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function(this: HTMLElement) {
    if (this.classList.contains('pokemon-layer') || this.classList.contains('hero')) return rect(0, 0, 390, 844);
    if (this.classList.contains('hello-bubble')) return rect(16, 320, 120, 65);
    if (this.classList.contains('pokemon-pause')) return rect(224, 792, 150, 36);
    return rect(100, 310, 240, 244);
  });
  return render(<main className="hero"><div className="desk-scene" /><button className="hello-bubble">hello</button><PokemonHabitat /></main>);
}

it('allows click/keyboard-compatible attack, ignores repeat activation and returns to roaming', () => {
  const { container } = setup();
  const charizard = screen.getByRole('button', { name: 'Charizard: breathe fire' });
  fireEvent.click(charizard);
  expect(charizard).toHaveAttribute('data-attacking', 'true');
  act(() => vi.advanceTimersByTime(400));
  expect(container.querySelector('.fire-breath')).not.toBeNull();
  fireEvent.click(charizard);
  act(() => vi.advanceTimersByTime(850));
  expect(charizard).toHaveAttribute('data-attacking', 'false');
  expect(container.querySelector('.fire-breath')).toBeNull();
});

it('pauses ambient positions but permits an explicit attack', () => {
  const { container } = setup();
  fireEvent.click(screen.getByRole('button', { name: 'Pause Pokémon' }));
  const position = container.querySelector('[data-pokemon="pikachu"]')!.getAttribute('style');
  act(() => vi.advanceTimersByTime(6000));
  expect(container.querySelector('[data-pokemon="pikachu"]')).toHaveAttribute('style', position!);
  fireEvent.click(screen.getByRole('button', { name: 'Charizard: breathe fire' }));
  act(() => vi.advanceTimersByTime(400));
  expect(container.querySelector('.fire-breath')).not.toBeNull();
  expect(screen.getByRole('button', { name: 'Resume Pokémon' })).toBeVisible();
});

it('does not let touch-created focus permanently stop roaming', () => {
  const { container } = setup();
  const charizard = screen.getByRole('button', { name: 'Charizard: breathe fire' });
  fireEvent.pointerDown(charizard, { pointerType: 'touch' });
  fireEvent.focus(charizard);
  fireEvent.click(charizard);
  act(() => vi.advanceTimersByTime(1250));
  const before = container.querySelector('[data-pokemon="charizard"]')!.getAttribute('style');
  act(() => vi.advanceTimersByTime(6000));
  expect(container.querySelector('[data-pokemon="charizard"]')!.getAttribute('style')).not.toBe(before);
});

it('pauses offscreen attacks and resumes with remaining time', () => {
  let notify: (entries: Array<{ isIntersecting: boolean }>) => void = () => {};
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof notify) { notify = callback; }
    observe() {} disconnect() {}
  });
  setup();
  const charizard = screen.getByRole('button', { name: 'Charizard: breathe fire' });
  fireEvent.click(charizard);
  act(() => vi.advanceTimersByTime(400));
  act(() => notify([{ isIntersecting: false }]));
  act(() => vi.advanceTimersByTime(6000));
  expect(charizard).toHaveAttribute('data-attacking', 'true');
  act(() => notify([{ isIntersecting: true }]));
  act(() => vi.advanceTimersByTime(850));
  expect(charizard).toHaveAttribute('data-attacking', 'false');
});

it('freezes hidden-page time and provides a short static reduced-motion attack', () => {
  const { container } = setup(true);
  const charizard = screen.getByRole('button', { name: 'Charizard: breathe fire' });
  fireEvent.click(charizard);
  expect(container.querySelector('.fire-breath')).toHaveAttribute('data-still', 'true');
  act(() => vi.advanceTimersByTime(320));
  expect(charizard).toHaveAttribute('data-attacking', 'false');
  fireEvent.click(charizard);
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  fireEvent(document, new Event('visibilitychange'));
  act(() => vi.advanceTimersByTime(3000));
  expect(charizard).toHaveAttribute('data-attacking', 'true');
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  fireEvent(document, new Event('visibilitychange'));
  act(() => vi.advanceTimersByTime(320));
  expect(charizard).toHaveAttribute('data-attacking', 'false');
});
