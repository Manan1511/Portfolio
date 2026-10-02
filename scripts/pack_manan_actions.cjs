// Pack complete generated poses into the same native frame sizes used by Manan.
// Requires @napi-rs/canvas (available in the bundled workspace Node runtime).
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const [input, directory] = process.argv.slice(2);
  if (!input || !directory) throw new Error('Usage: node scripts/pack_manan_actions.cjs input.png output-directory');
  const image = await loadImage(input);
  if (image.width % 6 || image.height % 4) throw new Error('Source must have six columns and four rows of equal cells');
  const source = createCanvas(image.width, image.height);
  source.getContext('2d').drawImage(image, 0, 0);
  const pixels = source.getContext('2d').getImageData(0, 0, image.width, image.height).data;
  // Generated spacing is approximate. Find each entire connected silhouette
  // instead of splitting at an assumed grid line that might cut off shoes.
  const visited = new Uint8Array(image.width * image.height);
  const queue = new Int32Array(visited.length);
  const regions = [];
  for (let seed = 0; seed < visited.length; seed++) {
    if (visited[seed] || pixels[seed * 4 + 3] < 128) continue;
    let read = 0, write = 1, left = image.width, right = 0, top = image.height, bottom = 0;
    queue[0] = seed; visited[seed] = 1;
    while (read < write) {
      const position = queue[read++], x = position % image.width, y = Math.floor(position / image.width);
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, next = ny * image.width + nx;
        if (nx < 0 || ny < 0 || nx >= image.width || ny >= image.height || visited[next] || pixels[next * 4 + 3] < 128) continue;
        visited[next] = 1; queue[write++] = next;
      }
    }
    if (write >= 2000) regions.push({ left: Math.max(0, left - 2), right: Math.min(image.width - 1, right + 2),
      top: Math.max(0, top - 2), bottom: Math.min(image.height - 1, bottom + 2) });
  }
  if (regions.length !== 24) throw new Error(`Expected 24 complete silhouettes, found ${regions.length}: ${JSON.stringify(regions)}`);
  regions.sort((a, b) => (a.top + a.bottom) - (b.top + b.bottom));
  const frames = [];
  for (let row = 0; row < 4; row++) {
    const poses = regions.slice(row * 6, row * 6 + 6).sort((a, b) => a.left - b.left);
    for (let col = 0; col < 6; col++) {
      const { left, top, right, bottom } = poses[col];
      let hairLeft = image.width, hairRight = -1;
      for (let y = top; y < top + Math.round((bottom - top + 1) * .16); y++) for (let x = left; x <= right; x++) {
        const i = (y * image.width + x) * 4;
        if (pixels[i + 3] >= 128 && Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) < 90) {
          hairLeft = Math.min(hairLeft, x); hairRight = Math.max(hairRight, x);
        }
      }
      if (hairRight < hairLeft) throw new Error(`Missing hair registration at ${row},${col}`);
      frames.push({ row, col, left, right, top, bottom, hairX: (hairLeft + hairRight) / 2 });
    }
  }
  const heights = frames.map(frame => frame.bottom - frame.top + 1).sort((a, b) => a - b);
  const medianHeight = (heights[11] + heights[12]) / 2;
  await mkdir(directory, { recursive: true });
  for (const size of [180, 120]) {
    const sheet = createCanvas(size * 6, size * 4);
    const context = sheet.getContext('2d');
    context.imageSmoothingEnabled = false;
    // One uniform scale for every full pose: preserve proportions and motion.
    const factor = (size === 180 ? 151 : 101) / medianHeight;
    const floor = size * .95, hairX = Math.round(size * 57.5 / 120);
    const rectangles = [];
    for (const frame of frames) {
      const sx = frame.left, sy = frame.top;
      const width = Math.round((frame.right - frame.left + 1) * factor);
      const height = Math.round((frame.bottom - frame.top + 1) * factor);
      const x = hairX - Math.round((frame.hairX - frame.left) * factor), y = floor - height;
      if (x < 1 || y < 1 || x + width >= size || y + height >= size) throw new Error(`Pose does not fit ${size}px cell`);
      context.drawImage(image, sx, sy, frame.right - frame.left + 1, frame.bottom - frame.top + 1,
        frame.col * size + x, frame.row * size + y, width, height);
      rectangles.push({ row: frame.row, col: frame.col, x: frame.col * size, y: frame.row * size,
        width: size, height: size, content: { x, y, width, height } });
    }
    const filename = `manan-actions-${size}.png`;
    await writeFile(path.join(directory, filename), sheet.toBuffer('image/png'));
    const manifest = { image: filename, sheet: { width: sheet.width, height: sheet.height },
      cell: { width: size, height: size }, columns: 6, rows: 4, logicalFrame: { width: 120, height: 120 },
      registration: { hairCenterX: hairX, footBaselineY: floor },
      clips: {
        'walk-right': { loop: true, frames: [0, 1, 2, 3, 4, 5], durations: [100, 100, 100, 100, 100, 100] },
        wave: { loop: false, frames: [6, 7, 8, 9, 10, 9, 10, 11, 6], durations: [100, 90, 100, 100, 100, 100, 100, 90, 180] },
        'thumbs-up': { loop: false, frames: [12, 13, 14, 15, 16, 17], durations: [100, 100, 120, 400, 120, 180] },
        'point-right': { loop: false, frames: [18, 19, 20, 21, 22, 23], durations: [100, 100, 120, 400, 120, 180] },
      }, frames: rectangles };
    await writeFile(path.join(directory, `manan-actions-${size}.json`), JSON.stringify(manifest, null, 2) + '\n');
    console.log(`${filename}: ${sheet.width}x${sheet.height}; 24 complete ${size}x${size} frames`);
  }
  console.log(JSON.stringify({ source: { width: image.width, height: image.height },
    heightRange: [heights[0], heights[23]], completePoses: frames.length }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
