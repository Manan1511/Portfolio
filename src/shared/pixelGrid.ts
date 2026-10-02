// One native pixel occupies two CSS pixels throughout Manan's hero.
export const scenePixelSize = 2;

// Our pixel drawings use absolute M/L/H/V/Z paths. Snap shared coordinates,
// rather than individual lengths, so adjoining fills meet on the same cell.
export function pixelPath(path: string, scale: number, offsetX = 0, offsetY = 0) {
  let command = '';
  let coordinate = 0;
  return (path.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g) ?? []).map(token => {
    if (/^[A-Za-z]$/.test(token)) {
      if (!'MLHVZ'.includes(token)) throw new Error(`Unsupported pixel path command: ${token}`);
      command = token; coordinate = 0; return token;
    }
    const horizontal = command === 'H' || ((command === 'M' || command === 'L') && coordinate++ % 2 === 0);
    return String(Math.round(Number(token) * scale + (horizontal ? offsetX : offsetY)));
  }).join(' ');
}

export function landscapeGrid(width: number, height: number) {
  const columns = Math.max(1, Math.ceil(width / scenePixelSize));
  const rows = Math.max(1, Math.ceil(height / scenePixelSize));
  const scale = Math.max(columns / 480, rows / 320);
  return { columns, rows, scale, offsetX: (columns - 480 * scale) / 2, offsetY: (rows - 320 * scale) / 2 };
}
