const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

async function main() {
  const directory = process.argv[2] ?? 'src/assets/character/actions';
  for (const size of [180, 120]) {
    const metadata = JSON.parse(await readFile(path.join(directory, `manan-actions-${size}.json`), 'utf8'));
    const image = await loadImage(path.join(directory, metadata.image));
    assert.equal(image.width, size * 6);
    assert.equal(image.height, size * 4);
    assert.equal(metadata.frames.length, 24);
    const canvas = createCanvas(image.width, image.height);
    canvas.getContext('2d').drawImage(image, 0, 0);
    const rgba = canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
    const hashes = new Set();
    for (const frame of metadata.frames) {
      let occupied = 0, bottom = 0, signature = 0;
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const i = ((frame.y + y) * image.width + frame.x + x) * 4;
        const alpha = rgba[i + 3];
        if (x === 0 || x === size - 1 || y === 0 || y === size - 1) assert.equal(alpha, 0, 'Cell edge must be transparent');
        if (alpha >= 128) { occupied++; bottom = Math.max(bottom, y); }
        signature = ((signature * 31) ^ rgba[i] ^ (rgba[i + 1] << 8) ^ (rgba[i + 2] << 16) ^ alpha) >>> 0;
      }
      assert.ok(occupied > size * 6, 'Every cell must contain a complete pose');
      assert.ok(Math.abs(bottom + 1 - size * .95) <= 2, 'Feet must share the registered floor');
      assert.ok(!hashes.has(signature), 'Each exported cell must have its own authored pose');
      hashes.add(signature);
    }
    for (const clip of Object.values(metadata.clips)) {
      assert.equal(clip.frames.length, clip.durations.length);
      assert.ok(clip.frames.every(index => index >= 0 && index < 24));
      assert.ok(clip.durations.every(duration => duration > 0));
    }
    console.log(`Verified ${metadata.image}: ${image.width}x${image.height}, 24 occupied unique cells, transparent borders, stable feet and valid timing.`);
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
