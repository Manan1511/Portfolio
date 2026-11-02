import { act, fireEvent, render, screen } from '@testing-library/react';
import { createElement, type ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type DialogProps = { onClose: () => void };
type DialogModule = { PokedexDialog: ComponentType<DialogProps> };
const modules = import.meta.glob('./PokedexDialog.tsx');
let showModalDescriptor: PropertyDescriptor | undefined;

async function renderPokedex() {
  const loader = modules['./PokedexDialog.tsx'];
  expect(loader, 'PokedexDialog.tsx must render the animated device').toBeDefined();
  if (!loader) throw new Error('PokedexDialog.tsx is missing');
  const { PokedexDialog } = await loader() as DialogModule;
  const onClose = vi.fn();
  const view = render(createElement(PokedexDialog, { onClose }));
  return { ...view, onClose, dialog: screen.getByTestId('pokedex-dialog') };
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
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Pokédex contact device', () => {
  it('plays the opening frames in order and settles on the open device', async () => {
    const { dialog } = await renderPokedex();
    expect(dialog).toHaveAttribute('data-frame', '0');
    const portraitScreen = dialog.querySelector('.pokedex-screen-portrait');
    const contactScreen = dialog.querySelector('.pokedex-screen-contact');
    expect(portraitScreen).toHaveAttribute('hidden');
    expect(contactScreen).toHaveAttribute('hidden');

    for (const frame of [1, 2, 3]) {
      await act(async () => { vi.advanceTimersByTime(90); });
      expect(dialog).toHaveAttribute('data-frame', String(frame));
      if (frame < 3) {
        expect(portraitScreen).toHaveAttribute('hidden');
        expect(contactScreen).toHaveAttribute('hidden');
      }
    }
    expect(portraitScreen).not.toHaveAttribute('hidden');
    expect(contactScreen).not.toHaveAttribute('hidden');
  });

  it('moves entries in both directions and wraps at either end', async () => {
    await renderPokedex();
    await act(async () => { vi.advanceTimersByTime(270); });
    const screenContent = screen.getByTestId('pokedex-contact-screen');

    fireEvent.click(screen.getByRole('button', { name: 'next entry' }));
    expect(screenContent).toHaveAttribute('data-entry-index', '1');
    fireEvent.click(screen.getByRole('button', { name: 'previous entry' }));
    expect(screenContent).toHaveAttribute('data-entry-index', '0');
    fireEvent.click(screen.getByRole('button', { name: 'previous entry' }));
    expect(screenContent).toHaveAttribute('data-entry-index', '3');
  });

  it('shows local selection feedback without inventing an external link', async () => {
    await renderPokedex();
    await act(async () => { vi.advanceTimersByTime(270); });

    fireEvent.click(screen.getByRole('button', { name: 'select entry' }));

    expect(screen.getByRole('status')).toHaveTextContent('entry selected');
    expect(screen.getByTestId('pokedex-dialog').querySelector('a[href]')).toBeNull();
  });

  it('plays the closing frames in reverse before returning to Bag', async () => {
    const { dialog, onClose } = await renderPokedex();
    await act(async () => { vi.advanceTimersByTime(270); });

    fireEvent.click(screen.getByRole('button', { name: 'close pokedex' }));
    expect(dialog).toHaveAttribute('data-frame', '7');
    expect(dialog.querySelector('.pokedex-screen-contact')).not.toHaveAttribute('hidden');
    await act(async () => { vi.advanceTimersByTime(90); });
    expect(dialog).toHaveAttribute('data-frame', '2');
    expect(dialog.querySelector('.pokedex-screen-contact')).toHaveAttribute('hidden');
    await act(async () => { vi.advanceTimersByTime(90); });
    expect(dialog).toHaveAttribute('data-frame', '1');
    await act(async () => { vi.advanceTimersByTime(90); });
    expect(dialog).toHaveAttribute('data-frame', '0');
    expect(onClose).not.toHaveBeenCalled();
    await act(async () => { vi.advanceTimersByTime(90); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('routes Escape through the same close animation', async () => {
    const { dialog, onClose } = await renderPokedex();
    await act(async () => { vi.advanceTimersByTime(270); });

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(dialog).toHaveAttribute('data-frame', '7');
    await act(async () => { vi.advanceTimersByTime(360); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses the settled device frame and closes immediately with reduced motion', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, media: '(prefers-reduced-motion: reduce)', onchange: null,
      addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
    const { dialog, onClose } = await renderPokedex();
    expect(dialog).toHaveAttribute('data-frame', '3');

    await act(async () => { vi.advanceTimersByTime(500); });
    expect(dialog).toHaveAttribute('data-frame', '3');
    fireEvent.click(screen.getByRole('button', { name: 'close pokedex' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('interrupts opening cleanly, ignores repeated close, and returns once', async () => {
    const { dialog, onClose } = await renderPokedex();
    const close = screen.getByRole('button', { name: 'close pokedex' });
    fireEvent.click(close);
    fireEvent.click(close);
    expect(dialog).toHaveAttribute('data-frame', '7');

    await act(async () => { vi.advanceTimersByTime(360); });
    expect(dialog).toHaveAttribute('data-frame', '0');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears a pending animation timer when the device unmounts', async () => {
    const originalSetTimeout = window.setTimeout;
    const scheduledTimers: Array<{ id: ReturnType<typeof window.setTimeout>; stack: string }> = [];
    const setTimer = vi.spyOn(window, 'setTimeout').mockImplementation((handler, timeout, ...args) => {
      const id = originalSetTimeout.call(window, handler, timeout, ...args);
      scheduledTimers.push({ id, stack: new Error().stack ?? '' });
      return id;
    });
    const clearTimer = vi.spyOn(window, 'clearTimeout');
    const { unmount, onClose } = await renderPokedex();
    const animationTimer = scheduledTimers.find(timer => timer.stack.includes('advance') && timer.stack.includes('PokedexDialog.tsx'));
    expect(animationTimer).toBeDefined();
    if (!animationTimer) throw new Error('PokedexDialog must schedule its opening animation');

    unmount();

    // jsdom also leaves a separate selection-restoration timer after the close
    // button receives focus; assert the device's own animation timer was cleared.
    expect(clearTimer.mock.calls.some(([id]) => id === animationTimer.id)).toBe(true);
    await act(async () => { vi.advanceTimersByTime(500); });
    expect(onClose).not.toHaveBeenCalled();
  });
});
