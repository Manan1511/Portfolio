import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createElement, useState, type ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./menuAudio', () => ({ playMenuCue: vi.fn() }));

type View = 'closed' | 'bag' | 'pokedex';
type BagProps = { view: View; onViewChange: (view: View) => void; active: boolean };
type BagModule = { BagNavigation: ComponentType<BagProps> };
const modules = import.meta.glob('./BagNavigation.tsx');
let showModalDescriptor: PropertyDescriptor | undefined;

function makeHarness(BagNavigation: ComponentType<BagProps>) {
  return function Harness({ active = true }: { active?: boolean }) {
    const [view, setView] = useState<View>('closed');
    return <>
      <button type="button" data-testid="outside-control">hero control</button>
      <output data-testid="navigation-view">{view}</output>
      <BagNavigation view={view} onViewChange={setView} active={active} />
    </>;
  };
}

async function renderBag(options: { active?: boolean } = {}) {
  const loader = modules['./BagNavigation.tsx'];
  expect(loader, 'BagNavigation.tsx must provide the bag menu').toBeDefined();
  if (!loader) throw new Error('BagNavigation.tsx is missing');
  const { BagNavigation } = await loader() as BagModule;
  const Harness = makeHarness(BagNavigation);
  return render(createElement(Harness, options));
}

beforeEach(() => {
  vi.useFakeTimers();
  showModalDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) { this.setAttribute('open', ''); },
  });
});

afterEach(() => {
  if (showModalDescriptor) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModalDescriptor);
  else delete (HTMLDialogElement.prototype as unknown as { showModal?: () => void }).showModal;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Bag navigation', () => {
  it('toggles a compact bag containing only the pokedex item', async () => {
    await renderBag();
    const trigger = screen.getByRole('button', { name: 'bag' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'bag' })).not.toBeInTheDocument();

    fireEvent.click(trigger);

    const navigation = screen.getByRole('navigation', { name: 'bag' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(navigation).getAllByRole('button', { name: 'pokedex' })).toHaveLength(1);
    expect(within(navigation).getAllByRole('button')).toHaveLength(2);
    expect(screen.getByTestId('navigation-view')).toHaveTextContent('bag');

    fireEvent.click(trigger);
    expect(screen.queryByRole('navigation', { name: 'bag' })).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes from its close control and Escape, returning focus to the bag button', async () => {
    await renderBag();
    const trigger = screen.getByRole('button', { name: 'bag' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'close bag' }));
    expect(screen.getByTestId('navigation-view')).toHaveTextContent('closed');
    expect(trigger).toHaveFocus();

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation', { name: 'bag' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('dismisses on outside pointer input without stealing the outside target focus', async () => {
    await renderBag();
    const trigger = screen.getByRole('button', { name: 'bag' });
    const outside = screen.getByTestId('outside-control');
    fireEvent.click(trigger);
    outside.focus();
    fireEvent.pointerDown(outside);

    expect(screen.queryByRole('navigation', { name: 'bag' })).not.toBeInTheDocument();
    expect(outside).toHaveFocus();
  });

  it('replaces the popover with the pokedex and restores focus to its row on close', async () => {
    const { playMenuCue } = await import('./menuAudio');
    await renderBag();
    fireEvent.click(screen.getByRole('button', { name: 'bag' }));
    const row = screen.getByRole('button', { name: 'pokedex' });
    fireEvent.click(row);

    expect(playMenuCue).toHaveBeenCalledWith('device-open');
    expect(screen.queryByRole('navigation', { name: 'bag' })).not.toBeInTheDocument();
    expect(screen.getByTestId('pokedex-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-view')).toHaveTextContent('pokedex');

    fireEvent.click(screen.getByRole('button', { name: 'close pokedex' }));
    await act(async () => { vi.advanceTimersByTime(360); });
    expect(screen.queryByTestId('pokedex-dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'bag' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'pokedex' })).toHaveFocus();
  });

  it('does not expose Bag before the scene is active', async () => {
    await renderBag({ active: false });
    expect(screen.queryByRole('button', { name: 'bag' })).not.toBeInTheDocument();
  });

  it('skips pixel reveal tiles when reduced motion is requested', async () => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: query.includes('prefers-reduced-motion'), media: query,
      onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => true })));
    await renderBag();
    fireEvent.click(screen.getByRole('button', { name: 'bag' }));

    expect(screen.getByRole('navigation', { name: 'bag' })).toBeInTheDocument();
    expect(screen.queryByTestId('bag-pixel-reveal')).not.toBeInTheDocument();
  });
});
