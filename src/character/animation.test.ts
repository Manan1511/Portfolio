import { describe, expect, it } from 'vitest';
import { frameAt, resolveClip, type SpriteDefinition } from './animation';

const definition: SpriteDefinition = {
  image: 'test.png', width: 80, height: 80,
  clips: {
    idle: { loop: true, frames: [{ x: 0, y: 0, duration: 100 }, { x: 80, y: 0, duration: 200 }] },
    gesture: { loop: false, frames: [{ x: 0, y: 80, duration: 100 }, { x: 80, y: 80, duration: 100 }] },
  },
  anchors: { head: { x: 40, y: 20 }, feet: { x: 40, y: 78 } },
};

describe('sprite playback', () => {
  it('honors unequal frame durations and wraps only looping clips', () => {
    const clip = definition.clips.idle;
    expect(frameAt(clip, 99)).toBe(0);
    expect(frameAt(clip, 100)).toBe(1);
    expect(frameAt(clip, 299)).toBe(1);
    expect(frameAt(clip, 300)).toBe(0);
  });
  it('holds last frame of a completed gesture', () => {
    expect(frameAt(definition.clips.gesture, 900)).toBe(1);
  });
  it('accepts newly supplied clips without renderer changes', () => {
    const custom = { ...definition, clips: { ...definition.clips, walk: definition.clips.idle } };
    expect(resolveClip(custom, 'walk')).toBe(custom.clips.walk);
    expect(() => resolveClip(custom, 'missing')).toThrow('Unknown sprite clip');
  });
});
