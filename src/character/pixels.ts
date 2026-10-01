export interface PixelRect { x: number; y: number; width: number; height: number }
export type PixelPatch = { type: 'arm'; rect: PixelRect; pivotX: number; amount: number };

export function animatePixels(data: Uint8ClampedArray, width: number, height: number, patches: PixelPatch[]): Uint8ClampedArray {
  const output = data.slice();
  const offset = (x: number, y: number) => (y * width + x) * 4;
  const valid = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height;
  for (const patch of patches) {
    if (patch.type === 'arm') {
      const r = patch.rect;
      const skin = new Set<number>();
      const mask = new Set<number>();
      for (let y = r.y; y < r.y + r.height; y++) for (let x = r.x; x < r.x + r.width; x++) {
        if (!valid(x, y)) continue;
        const p = offset(x, y);
        if (data[p + 3] > 128 && data[p] > 100 && data[p] > data[p + 1] * 1.2 && data[p + 1] > data[p + 2] * 1.15) skin.add(y * width + x);
      }
      // Include the existing dark outline, never a detached fingertip crop.
      for (const p of skin) {
        const x = p % width, y = Math.floor(p / width);
        mask.add(p);
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= r.x && nx < r.x + r.width && ny >= r.y && ny < r.y + r.height && valid(nx, ny) && data[offset(nx, ny) + 3] > 128) mask.add(ny * width + nx);
        }
      }
      for (const p of mask) output.fill(0, p * 4, p * 4 + 4);
      for (const p of mask) {
        const x = p % width, y = Math.floor(p / width);
        const bend = Math.max(0, Math.min(1, (x - patch.pivotX) / Math.max(1, r.x + r.width - 1 - patch.pivotX)));
        const ny = y + Math.round(patch.amount * bend);
        if (valid(x, ny)) output.set(data.subarray(p * 4, p * 4 + 4), offset(x, ny));
      }
    }
  }
  return output;
}
