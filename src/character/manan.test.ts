import { act, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { CharacterSprite } from './CharacterSprite';
import { manan } from './manan';
import type { SpriteFrame } from './animation';

afterEach(() => vi.unstubAllGlobals());

it('renders each character pose as one complete drawing without replacement body parts', async () => {
  // jsdom has no image decoder or canvas backend. Keep the real renderer and
  // character definition; substitute only these browser graphics boundaries.
  vi.stubGlobal('Image', class {
    onload?: () => void;
    set src(_url: string) { queueMicrotask(() => this.onload?.()); }
  });
  const context = {
    clearRect: vi.fn(), drawImage: vi.fn(), imageSmoothingEnabled: true,
    save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(), rect: vi.fn(), clip: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  for (const clip of Object.keys(manan.clips)) {
    context.drawImage.mockClear();
    let view: ReturnType<typeof render>;
    await act(async () => { view = render(createElement(CharacterSprite, { definition: manan, clip, playing: false })); });
    expect(context.drawImage, `${clip} must draw one complete frame`).toHaveBeenCalledTimes(1);
    expect(context.imageSmoothingEnabled).toBe(false);
    view!.unmount();
  }
});

it('starts and ends seated animation cycles on the same registered neutral pose', () => {
  const drawing = ({ duration: _duration, ...art }: SpriteFrame) => art;
  const neutral = drawing(manan.clips['seated-idle'].frames[0]);
  for (const name of ['typing', 'talking']) {
    const frames = manan.clips[name].frames;
    expect(drawing(frames[0])).toEqual(neutral);
    expect(drawing(frames.at(-1)!)).toEqual(neutral);
    // A complete cycle returns to rest exactly twice in each 2-second activity.
    expect(frames.reduce((total, frame) => total + frame.duration, 0)).toBe(1000);
  }
});

it('keeps character size and foot registration while using finer whole-pixel sampling', async () => {
  vi.stubGlobal('Image', class {
    onload?: () => void;
    set src(_url: string) { queueMicrotask(() => this.onload?.()); }
  });
  const context = { clearRect: vi.fn(), drawImage: vi.fn(), imageSmoothingEnabled: true };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  let view: ReturnType<typeof render>;
  await act(async () => { view = render(createElement(CharacterSprite, { definition: manan, clip: 'seated-idle', scale: 3, playing: false })); });
  const canvas = screen.getByRole('img');
  expect(canvas).toHaveStyle({ width: '360px', height: '360px' });
  expect(canvas).toHaveAttribute('width', '180');
  expect(canvas).toHaveAttribute('height', '180');
  expect(context.drawImage).toHaveBeenLastCalledWith(expect.anything(), 88, 6, 330, 442, 42, 20, 113, 151);
  expect(context.imageSmoothingEnabled).toBe(false);

  // Switching to a speaking drawing keeps its foot baseline at 171 raster px.
  const speaking = { ...manan, clips: { speech: { loop: false, frames: [manan.clips.talking.frames[1]] } } };
  await act(async () => { view!.rerender(createElement(CharacterSprite, { definition: speaking, clip: 'speech', scale: 3, playing: false })); });
  expect(context.drawImage).toHaveBeenLastCalledWith(expect.anything(), 525, 452, 330, 435, 42, 21, 113, 150);

  // A responsive scale change must redraw the cleared canvas at its new density.
  await act(async () => { view!.rerender(createElement(CharacterSprite, { definition: manan, clip: 'seated-idle', scale: 2, playing: false })); });
  expect(canvas).toHaveStyle({ width: '240px', height: '240px' });
  expect(canvas).toHaveAttribute('width', '120');
  expect(context.drawImage).toHaveBeenLastCalledWith(expect.anything(), 88, 6, 330, 442, 28, 13, 75, 101);
});
