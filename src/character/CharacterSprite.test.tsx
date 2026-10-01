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
afterEach(() => vi.useRealTimers());

describe('CharacterSprite', () => {
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
