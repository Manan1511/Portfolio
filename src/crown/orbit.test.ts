import { describe, expect, it } from 'vitest';
import { orbitPoint, gestureKind, draggedAngle } from './orbit';

describe('orbit geometry and gestures', () => {
  it('moves cards from behind to in front without changing upright orientation', () => {
    const front = orbitPoint(0, 5, Math.PI / 2, 200, 40);
    const back = orbitPoint(0, 5, -Math.PI / 2, 200, 40);
    expect(front.x).toBeCloseTo(0);
    expect(front.y).toBe(40);
    expect(front.zIndex).toBeGreaterThan(20);
    expect(back.zIndex).toBeLessThan(20);
    expect(back.scale).toBeLessThan(front.scale);
  });
  it('keeps orbit within given horizontal bounds', () => {
    for (let angle = 0; angle < 7; angle += .1) {
      expect(Math.abs(orbitPoint(2, 5, angle, 87, 38).x)).toBeLessThanOrEqual(87);
    }
  });
  it('uses 8px threshold and leaves vertical scrolling alone', () => {
    expect(gestureKind(7, 0)).toBe('tap');
    expect(gestureKind(8, 0)).toBe('drag');
    expect(gestureKind(4, 15)).toBe('scroll');
  });
  it('starts drag from current angle and preserves drag end', () => {
    expect(draggedAngle(1.2, 50, 100)).toBeCloseTo(1.7);
    expect(draggedAngle(1.7, 0, 100)).toBeCloseTo(1.7);
  });
});
