import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { EntrySceneActiveContext } from '../loading/EntrySceneActiveContext';
import { Hero } from './Hero';

vi.mock('../pokemon/PokemonHabitat', () => ({
  PokemonHabitat: ({ active }: { active: boolean }) => <div data-testid="pokemon-habitat" data-active={String(active)} />,
}));

const original = { width: window.innerWidth, height: window.innerHeight };
let showModalDescriptor: PropertyDescriptor | undefined;
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: original.width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: original.height });
  if (showModalDescriptor) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModalDescriptor);
  else delete (HTMLDialogElement.prototype as unknown as { showModal?: () => void }).showModal;
  showModalDescriptor = undefined;
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
  expect(container.querySelector('.desk-clearing')).toHaveAttribute('transform', 'translate(-6 -18)');
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

it('shows Bag only after entry and pauses Pokémon until both menus close', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  showModalDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) { this.setAttribute('open', ''); },
  });
  const scene = (active: boolean) => <EntrySceneActiveContext.Provider value={active}><Hero /></EntrySceneActiveContext.Provider>;
  const { rerender } = render(scene(false));

  expect(screen.queryByRole('button', { name: 'bag' })).not.toBeInTheDocument();
  expect(screen.getByTestId('pokemon-habitat')).toHaveAttribute('data-active', 'false');

  rerender(scene(true));
  expect(screen.getByRole('button', { name: 'bag' })).toBeInTheDocument();
  expect(screen.getByTestId('pokemon-habitat')).toHaveAttribute('data-active', 'true');

  fireEvent.click(screen.getByRole('button', { name: 'bag' }));
  expect(screen.getByTestId('pokemon-habitat')).toHaveAttribute('data-active', 'false');
  fireEvent.click(screen.getByRole('button', { name: 'pokedex' }));
  expect(screen.getByTestId('pokedex-dialog')).toBeInTheDocument();
  expect(screen.getByTestId('pokemon-habitat')).toHaveAttribute('data-active', 'false');

  fireEvent.click(screen.getByRole('button', { name: 'close pokedex' }));
  await act(async () => { vi.advanceTimersByTime(360); });
  expect(screen.getByRole('button', { name: 'pokedex' })).toHaveFocus();
  expect(screen.getByTestId('pokemon-habitat')).toHaveAttribute('data-active', 'false');

  fireEvent.click(screen.getByRole('button', { name: 'bag' }));
  expect(screen.queryByRole('navigation', { name: 'bag' })).not.toBeInTheDocument();
  expect(screen.getByTestId('pokemon-habitat')).toHaveAttribute('data-active', 'true');
});
