import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CharacterSprite, SpriteMotion } from './CharacterSprite';
import type { SpriteDefinition } from './animation';

const definition: SpriteDefinition = {
  image: 'sprite.png', width: 80, height: 80, anchors: { head: { x: 40, y: 20 } },
  clips: {
    idle: { loop: true, frames: [{ x: 0, y: 0, duration: 100 }, { x: 80, y: 0, duration: 100 }] },
    hello: { loop: false, frames: [{ x: 0, y: 80, duration: 100 }, { x: 80, y: 80, duration: 100 }] },
  },
};
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('CharacterSprite', () => {
  it('renders a controlled frame without starting its own clock', () => {
    vi.useFakeTimers();
    const { rerender } = render(<CharacterSprite definition={definition} clip="idle" frameIndex={1} />);
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '1');
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '1');
    rerender(<CharacterSprite definition={definition} clip="hello" frameIndex={0} />);
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '0');
  });
  it('preserves fractional target coordinates for definitions using native sampling', async () => {
    vi.stubGlobal('Image', class {
      onload?: () => void;
      set src(_url: string) { queueMicrotask(() => this.onload?.()); }
    });
    const context = { clearRect: vi.fn(), drawImage: vi.fn(), imageSmoothingEnabled: true };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const fractional: SpriteDefinition = {
      ...definition, image: 'fractional-target.png',
      clips: { idle: { loop: true, frames: [{
        x: 0, y: 0, duration: 100,
        target: { x: 10.25, y: 7.5, width: 21.5, height: 30.25 },
      }] } },
    };
    await act(async () => { render(<CharacterSprite definition={fractional} clip="idle" scale={3} playing={false} />); });
    expect(screen.getByRole('img')).toHaveAttribute('width', '80');
    expect(screen.getByRole('img')).toHaveStyle({ width: '240px' });
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 80, 80, 10.25, 7.5, 21.5, 30.25);
  });
  it('advances short in-between frames on the next browser repaint', () => {
    vi.useFakeTimers();
    const quick: SpriteDefinition = {
      ...definition,
      clips: { idle: { loop: true, frames: [
        { x: 0, y: 0, duration: 83 },
        { x: 80, y: 0, duration: 83 },
        { x: 160, y: 0, duration: 83 },
      ] } },
    };
    render(<CharacterSprite definition={quick} clip="idle" />);
    act(() => vi.advanceTimersByTime(96));
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '1');
    act(() => vi.advanceTimersByTime(80));
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '2');
  });
  it('pauses on current frame, resumes and resets when clip changes', () => {
    vi.useFakeTimers();
    const { rerender } = render(<CharacterSprite definition={definition} clip="idle" scale={2} />);
    act(() => vi.advanceTimersByTime(120));
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '1');
    rerender(<CharacterSprite definition={definition} clip="idle" scale={2} playing={false} />);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '1');
    rerender(<CharacterSprite definition={definition} clip="hello" scale={2} />);
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '0');
  });
  it('reports one-shot completion once and retains final frame', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<CharacterSprite definition={definition} clip="hello" onComplete={done} />);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('img')).toHaveAttribute('data-frame', '1');
    expect(done).toHaveBeenCalledTimes(1);
  });
  it('moves wrapper without changing character coordinates or clip', () => {
    render(<SpriteMotion x={32} y={-16}><CharacterSprite definition={definition} clip="idle" scale={3} /></SpriteMotion>);
    expect(screen.getByRole('img').parentElement).toHaveStyle({ transform: 'translate3d(32px, -16px, 0)' });
    expect(screen.getByRole('img')).toHaveStyle({ width: '240px', height: '240px' });
  });
});
