import { useEffect, useRef, useState } from 'react';
import { landscapeGrid, pixelPath, scenePixelSize } from '../shared/pixelGrid';

const grass = Array.from({ length: 230 }, (_, index) => ({
  x: (index * 47 + 13) % 480,
  y: 204 + (index * 31) % 116,
})).filter(({ x, y }) => !(x > 169 && x < 319 && y > 217 && y < 280));
const trees = [{ x: 13, y: 161 }, { x: 55, y: 170 }, { x: 425, y: 161 }, { x: 462, y: 177 }, { x: 98, y: 203 }, { x: 365, y: 209 }];
const treeDrawing = [
  ['#866645', 'M17 35H23V54H21V55H16V54H17Z'],
  ['#b2925e', 'M18 38H20V53H18Z'],
  ['#466c49', 'M18 0H22V1H26V3H29V6H32V9H34V12H37V16H38V24H37V29H35V33H31V36H25V38H13V37H8V35H4V32H2V28H0V19H1V15H4V11H7V7H11V4H15V1H18Z'],
  ['#678e57', 'M18 2H23V3H26V5H28V8H31V11H33V15H35V19H36V25H34V30H30V34H25V36H14V35H9V33H5V29H3V23H2V19H4V15H7V11H10V8H14V5H18Z'],
  ['#7fa15e', 'M17 4H23V6H26V9H29V12H31V17H33V22H30V25H25V28H18V26H13V29H8V26H5V20H7V15H11V11H14V7H17Z'],
  ['#93b16c', 'M18 6H22V8H25V11H27V14H24V17H18V15H14V17H9V14H12V11H15V8H18Z'],
  ['#a6be79', 'M18 8H21V10H18ZM13 12H16V14H13ZM8 18H10V20H8Z'],
  ['#557c50', 'M6 25H10V29H15V31H22V30H28V27H33V30H30V33H24V35H16V34H10V32H6ZM30 15H33V19H31V21H28V18H30Z'],
  ['#88a764', 'M24 21H27V23H30V26H27V28H23V26H20V24H24ZM10 22H13V24H10Z'],
] as const;
const cloudDrawing = [
  ['#c9ddd9', 'M3 14H47V16H43V17H8V16H3Z'],
  ['#f8f7df', 'M0 11H2V9H5V7H9V5H13V3H17V1H21V0H27V1H30V3H35V5H39V8H44V10H48V12H50V15H0Z'],
  ['#fffbe9', 'M8 9H12V7H16V5H20V3H26V4H29V6H34V9H38V11H9V10H8Z'],
  ['#eef1d6', 'M2 13H48V15H2Z'],
] as const;
type Grid = ReturnType<typeof landscapeGrid>;

function hill(grid: Grid, baseline: number, amplitude: number, phase: number) {
  const y = (x: number) => {
    const worldX = (x - grid.offsetX) / grid.scale;
    const height = baseline + Math.sin((worldX + phase) / 41) * amplitude + Math.sin((worldX + phase) / 17) * amplitude * .18;
    return Math.round(height * grid.scale + grid.offsetY);
  };
  let path = `M0 ${y(0)}`;
  for (let x = 1; x <= grid.columns; x++) path += `H${x}V${y(x)}`;
  return `${path}V${grid.rows}H0Z`;
}

function oval(grid: Grid, x: number, y: number, width: number, height: number) {
  const cx = Math.round(x * grid.scale + grid.offsetX);
  const cy = Math.round(y * grid.scale + grid.offsetY);
  const rx = Math.max(1, Math.round(width * grid.scale));
  const ry = Math.max(1, Math.round(height * grid.scale));
  let path = '';
  for (let row = -ry; row <= ry; row++) {
    const span = Math.floor(rx * Math.sqrt(1 - (row / ry) ** 2));
    path += `M${cx - span} ${cy + row}h${span * 2 + 1}v1h-${span * 2 + 1}Z`;
  }
  return path;
}

export function PixelLandscape() {
  const backdrop = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: Math.max(window.innerHeight, window.innerWidth <= 531 ? 650 : 740),
  }));
  useEffect(() => {
    if (!backdrop.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    });
    observer.observe(backdrop.current);
    return () => observer.disconnect();
  }, []);
  const grid = landscapeGrid(size.width, size.height);
  const x = (value: number) => Math.round(value * grid.scale + grid.offsetX);
  const y = (value: number) => Math.round(value * grid.scale + grid.offsetY);
  const drawing = (path: string, left = 0, top = 0, scale = 1) => pixelPath(path, grid.scale * scale, grid.offsetX + left * grid.scale, grid.offsetY + top * grid.scale);

  return <div className="pixel-landscape" ref={backdrop} aria-hidden="true">
    <svg viewBox={`0 0 ${grid.columns} ${grid.rows}`} shapeRendering="crispEdges"
      style={{ width: grid.columns * scenePixelSize, height: grid.rows * scenePixelSize, display: 'block' }}>
      <path fill="#d2e7e3" d={`M0 0H${grid.columns}V${grid.rows}H0Z`} />
      {[{ x: 45, y: 52, scale: 1 }, { x: 358, y: 39, scale: 1 }, { x: 204, y: 23, scale: .8 }].map((cloud, i) => <g key={i}>
        {cloudDrawing.map(([fill, path]) => <path key={fill} fill={fill} d={drawing(path, cloud.x, cloud.y, cloud.scale)} />)}
      </g>)}
      <path fill="#bbd5bc" d={hill(grid, 165, 14, 35)} />
      <path fill="#a4c18d" d={hill(grid, 185, 9, 12)} />
      <path fill="#94b875" d={`M0 ${y(198)}H${grid.columns}V${grid.rows}H0Z`} />
      <path fill="#a0be7e" d={`M0 ${y(198)}H${grid.columns}V${y(213)}H0Z`} />
      <path fill="#bed090" d={oval(grid, 244, 251, 77, 32)} />
      <path fill="#c8d799" d={oval(grid, 244, 251, 72, 28)} />
      {grass.map((blade, i) => <path key={i} fill={i % 3 === 0 ? '#afc887' : '#81a965'} opacity={i % 2 ? .8 : .55}
        d={`M${x(blade.x)} ${y(blade.y)}h1v-2h1v3h2v-2h1v3h-5Z`} />)}
      {trees.map((tree, i) => <g key={i}>
        <path fill="#527447" opacity=".2" d={oval(grid, tree.x + 19, tree.y + 54, 13, 2)} />
        {treeDrawing.map(([fill, path], layer) => <path key={layer} fill={fill} d={drawing(path, tree.x, tree.y)} />)}
      </g>)}
      {[{ x: 150, y: 278 }, { x: 334, y: 252 }, { x: 90, y: 263 }].map((flower, i) => <g key={i}>
        <path fill="#e9e1ac" d={`M${x(flower.x)} ${y(flower.y)}h1v-1h2v1h1v2h-1v1h-2v-1h-1Z`} />
        <path fill="#cd8e70" d={`M${x(flower.x) + 1} ${y(flower.y)}h2v2h-2Z`} />
      </g>)}
    </svg>
  </div>;
}
