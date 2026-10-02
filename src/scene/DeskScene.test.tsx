import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DeskScene } from './DeskScene';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

it('animates speech while greeting appears, then starts typing and rests', () => {
  vi.useFakeTimers();
  render(<DeskScene scale={3} />);
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'talking');
  act(() => vi.advanceTimersByTime(240));
  expect(screen.getByRole('img', { name: /Manan/ })).not.toHaveAttribute('data-frame', '0');
  act(() => vi.advanceTimersByTime(1760));
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'typing');
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'seated-idle');
  fireEvent.click(screen.getByRole('button', { name: /Replay greeting/ }));
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'talking');
});

it('shows complete greeting with static seated sprite for reduced motion', () => {
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: true, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => true,
  }));
  render(<DeskScene scale={3} />);
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'seated-idle');
  expect(screen.getByText('hey, i’m manan')).toBeVisible();
});

it.each([2, 3])('matches furniture and character pixel size at scale %i', scale => {
  const { container } = render(<DeskScene scale={scale} />);
  expect(container.querySelector<HTMLElement>('.desk-scene')!.style.left).toBe(`calc(50% - ${88 * scale}px)`);
  const sprite = screen.getByRole('img', { name: /Manan/ }) as HTMLCanvasElement;
  const displayWidth = Number.parseFloat(sprite.style.width);
  const spritePixelSize = displayWidth / sprite.width;
  expect(container.querySelectorAll('canvas.scene-prop')).toHaveLength(3);
  for (const prop of container.querySelectorAll('.scene-prop')) {
    const canvas = prop as HTMLCanvasElement;
    expect(Number.parseFloat(canvas.style.width) / canvas.width).toBe(spritePixelSize);
    expect(Number.parseFloat(canvas.style.height) / canvas.height).toBe(spritePixelSize);
    expect(canvas.style.imageRendering).toBe('pixelated');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  }
});

it('registers raster furniture to the seated pose and clips only the forward prop surface', async () => {
  vi.stubGlobal('Image', class {
    onload: (() => void) | null = null;
    set src(_value: string) { queueMicrotask(() => this.onload?.()); }
  });
  const contexts = new Map<HTMLCanvasElement, CanvasRenderingContext2D>();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function(this: HTMLCanvasElement) {
    const context = { clearRect: vi.fn(), drawImage: vi.fn(), imageSmoothingEnabled: true,
      save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(), clip: vi.fn() };
    contexts.set(this, context as unknown as CanvasRenderingContext2D);
    return context as unknown as CanvasRenderingContext2D;
  });
  const { container } = render(<DeskScene scale={3} />);
  await act(async () => { await Promise.resolve(); });
  const chair = container.querySelector<HTMLCanvasElement>('.scene-chair')!;
  const rear = container.querySelector<HTMLCanvasElement>('.scene-desk-rear')!;
  const front = container.querySelector<HTMLCanvasElement>('.scene-desk-front')!;
  expect(chair).not.toBeNull();
  expect(rear).not.toBeNull();
  expect(front).not.toBeNull();
  expect(contexts.get(chair)?.drawImage).toHaveBeenCalledWith(expect.anything(), 110, 127, 514, 714, 42, 75, 69, 96);
  for (const canvas of [rear, front]) {
    // Source includes the lid's top outline at row142 and every leg down to847.
    expect(contexts.get(canvas)?.drawImage).toHaveBeenCalledWith(expect.anything(), 703, 140, 1044, 708, 69, 86, 126, 85);
    expect(contexts.get(canvas)?.imageSmoothingEnabled).toBe(false);
  }
  expect(contexts.get(rear)?.clip).not.toHaveBeenCalled();
  expect(contexts.get(front)?.clip).toHaveBeenCalledOnce();
});
