export function orbitPoint(index: number, count: number, angle: number, rx: number, ry: number) {
  const theta = angle + index * Math.PI * 2 / Math.max(count, 1);
  const depth = Math.sin(theta);
  // Positive angles move the front of the ring to the right, matching input.
  return { x: -Math.cos(theta) * rx, y: depth * ry, depth, scale: .9 + .1 * (depth + 1) / 2, zIndex: depth >= 0 ? 30 + Math.round(depth * 5) : 10 + Math.round((depth + 1) * 5) };
}
export function gestureKind(dx: number, dy: number): 'tap' | 'drag' | 'scroll' {
  if (Math.abs(dy) >= 8 && Math.abs(dy) > Math.abs(dx)) return 'scroll';
  return Math.abs(dx) >= 8 ? 'drag' : 'tap';
}
export function draggedAngle(start: number, dx: number, radius: number, direction = 1) { return start + direction * dx / Math.max(radius, 1); }
