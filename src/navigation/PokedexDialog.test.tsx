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
  vi.useRealTimers();
});

describe('Pokédex contact device', () => {
  it('plays the opening frames in order and settles on the open device', async () => {
    const { dialog } = await renderPokedex();
    expect(dialog).toHaveAttribute('data-frame', '0');

    for (const frame of [1, 2, 3]) {
      await act(async () => { vi.advanceTimersByTime(90); });
      expect(dialog).toHaveAttribute('data-frame', String(frame));
    }
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
    await act(async () => { vi.advanceTimersByTime(90); });
    expect(dialog).toHaveAttribute('data-frame', '2');
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
});
