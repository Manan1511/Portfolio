import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { PokemonHabitat } from './PokemonHabitat';
import { groundFootprint } from './roaming';
import { pokemon } from './definitions';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
function setup(reduced = false, width = 390, withTree = false) {
  vi.useFakeTimers();
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: reduced, media: '', onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  const rect = (x: number, y: number, width: number, height: number) => ({ x, y, left: x, top: y, width, height, right: x + width, bottom: y + height, toJSON() {} });
  let trunkX = 1190, trunkY = 708;
  vi.spyOn(SVGElement.prototype, 'getBoundingClientRect').mockImplementation(function(this: SVGElement) {
    return this.classList.contains('tree-footprint') ? rect(trunkX, trunkY, 20, 10) : rect(0, 0, 0, 0);
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function(this: HTMLElement) {
    if (this.classList.contains('pokemon-layer') || this.classList.contains('hero')) return rect(0, 0, width, 844);
    if (this.classList.contains('hello-bubble')) return rect(16, 320, 120, 65);
    return rect(100, 310, 240, 244);
  });
  const view = render(<main className="hero"><div className="desk-scene" /><button className="hello-bubble">hello</button>
    {withTree && <svg><g className="tree-artwork"><path className="tree-footprint" d="M0 0H20V10H0Z" /></g></svg>}
    <PokemonHabitat /></main>);
  return { ...view,
    resize(nextWidth: number) { width = nextWidth; fireEvent(window, new Event('resize')); },
    moveTrunk(x: number, y: number) { trunkX = x; trunkY = y; view.container.querySelector('.tree-footprint')!.setAttribute('d', `M${x} ${y}h20v10h-20Z`); } };
}

it('measures trunk bases and reconciles walkers after tree geometry moves', async () => {
  const { container, moveTrunk } = setup(true, 1440, true);
  const feet = () => {
    const element = container.querySelector<HTMLElement>('[data-pokemon="squirtle"]')!;
    const [, x, y] = element.style.transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px/)!;
    return groundFootprint(pokemon.squirtle, { x: Number(x), y: Number(y) });
  };
  const overlaps = (x: number, y: number) => {
    const footprint = feet();
    return footprint.left < x + 20 && footprint.right > x && footprint.top < y + 10 && footprint.bottom > y;
  };
  expect(overlaps(1190, 708)).toBe(false);
  const before = feet(), x = (before.left + before.right) / 2 - 10, y = before.top;
  await act(async () => moveTrunk(x, y));
  expect(overlaps(x, y)).toBe(false);
});

it('adds only Bulbasaur and Squirtle on desktop and removes them below 1024px', () => {
  const { container, resize } = setup(true, 1440);
  expect(Array.from(container.querySelectorAll('[data-pokemon]'), element => element.getAttribute('data-pokemon')))
    .toEqual(['pikachu', 'charizard', 'bulbasaur', 'squirtle']);
  for (const id of ['bulbasaur', 'squirtle']) {
    expect(container.querySelector(`[data-pokemon="${id}"]`)).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector(`[data-pokemon="${id}"]`)!.tagName).toBe('DIV');
  }
  resize(1023);
  expect(container.querySelectorAll('[data-pokemon]')).toHaveLength(2);
  resize(390);
  expect(container.querySelectorAll('[data-pokemon]')).toHaveLength(2);
  resize(1024);
  expect(container.querySelectorAll('[data-pokemon]')).toHaveLength(4);
  expect(container.querySelector('[data-pokemon="gengar"]')).toBeNull();
});

it('animates new desktop walkers', () => {
  vi.spyOn(Math, 'random').mockReturnValue(.9);
  const { container } = setup(false, 1440);
  const before = ['bulbasaur', 'squirtle'].map(id => container.querySelector(`[data-pokemon="${id}"]`)!.getAttribute('style'));
  act(() => vi.advanceTimersByTime(12000));
  for (const [index, id] of ['bulbasaur', 'squirtle'].entries()) {
    expect(container.querySelector(`[data-pokemon="${id}"]`)!.getAttribute('style')).not.toBe(before[index]);
  }
});

it('keeps desktop additions stationary when reduced motion is requested', () => {
  const { container } = setup(true, 1440);
  const before = ['bulbasaur', 'squirtle'].map(id => container.querySelector(`[data-pokemon="${id}"]`)!.getAttribute('style'));
  act(() => vi.advanceTimersByTime(6000));
  for (const [index, id] of ['bulbasaur', 'squirtle'].entries()) {
    expect(container.querySelector(`[data-pokemon="${id}"]`)!.getAttribute('style')).toBe(before[index]);
  }
});

it('preserves existing actors across a desktop breakpoint change and pauses every species when hidden', () => {
  const { container, resize } = setup(false, 1023);
  const charizard = screen.getByRole('button', { name: 'Charizard: breathe fire' });
  const pikachu = container.querySelector('[data-pokemon="pikachu"]');
  fireEvent.click(charizard);
  resize(1024);
  expect(container.querySelector('[data-pokemon="pikachu"]')).toBe(pikachu);
  expect(charizard).toHaveAttribute('data-attacking', 'true');
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  fireEvent(document, new Event('visibilitychange'));
  const before = Array.from(container.querySelectorAll('[data-pokemon]'), el => el.getAttribute('style'));
  act(() => vi.advanceTimersByTime(6000));
  expect(Array.from(container.querySelectorAll('[data-pokemon]'), el => el.getAttribute('style'))).toEqual(before);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  fireEvent(document, new Event('visibilitychange'));
  act(() => vi.advanceTimersByTime(1250));
  expect(charizard).toHaveAttribute('data-attacking', 'false');
});

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

it('roams without a pause button and still permits an explicit attack', () => {
  vi.spyOn(Math, 'random').mockReturnValue(.9);
  const { container } = setup();
  expect(screen.queryByRole('button', { name: /Pause Pokémon|Resume Pokémon/ })).toBeNull();
  const position = container.querySelector('[data-pokemon="pikachu"]')!.getAttribute('style');
  act(() => vi.advanceTimersByTime(6000));
  expect(container.querySelector('[data-pokemon="pikachu"]')!.getAttribute('style')).not.toBe(position);
  fireEvent.click(screen.getByRole('button', { name: 'Charizard: breathe fire' }));
  act(() => vi.advanceTimersByTime(400));
  expect(container.querySelector('.fire-breath')).not.toBeNull();
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
