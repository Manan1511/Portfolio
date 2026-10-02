import { memo, useEffect, useRef } from 'react';
import atlas from '../assets/scene-furniture.png';
import { scenePixelSize } from '../shared/pixelGrid';

type Rect = { x: number; y: number; width: number; height: number };
type FurniturePart = 'chair' | 'desk-rear' | 'desk-front';

// Source artwork stays intact. Targets use the character's 120px layout:
// CSS offsets separate the chair and desk; keyboard still spans hand contact
// around (83, 74). Seat ~ y=87, common floor y=114.
const artwork = {
  chair: { source: { x: 110, y: 127, width: 514, height: 714 }, target: { x: 28, y: 50, width: 46, height: 64 } },
  desk: { source: { x: 703, y: 140, width: 1044, height: 708 }, target: { x: 46, y: 57, width: 84, height: 57 } },
};
const width = 132;
const height = 120;
let picture: Promise<HTMLImageElement> | undefined;

function loadArtwork() {
  if (!picture) picture = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => { picture = undefined; reject(new Error('Could not load furniture artwork')); };
    image.src = atlas;
  });
  return picture;
}

function snapRect(rect: Rect, density: number) {
  const x = Math.round(rect.x * density);
  const y = Math.round(rect.y * density);
  return { x, y,
    width: Math.round((rect.x + rect.width) * density) - x,
    height: Math.round((rect.y + rect.height) * density) - y };
}

// Only furniture is depth-clipped. The character is rendered once, complete.
// Front apron/near legs cover the lap; the far left leg stays behind the chair.
// The diagonal side apron extends below the front rail and must stay forward.
// Rear tabletop/keyboard stay under the hands.
// Laptop's rear lid stands forward of fingertips without cutting the forearms.
const foreground = [
  [[40, 76], [132, 76], [132, 86], [40, 86]],
  [[46, 76], [64, 82], [64, 96], [46, 86]],
  [[60, 86], [132, 86], [132, 120], [60, 120]],
  [[92, 76], [94, 60], [111, 57], [108, 74]],
] as const;

const FurnitureSprite = memo(function FurnitureSprite({ part, scale }: { part: FurniturePart; scale: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pixelScale = Math.max(1, Math.round(scale));
  const enlargement = Math.min(pixelScale, scenePixelSize);
  const density = pixelScale / enlargement;
  const rasterWidth = width * density;
  const rasterHeight = height * density;
  const frame = part === 'chair' ? artwork.chair : artwork.desk;

  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    let cancelled = false;
    loadArtwork().then(image => {
      if (cancelled) return;
      context.clearRect(0, 0, rasterWidth, rasterHeight);
      context.imageSmoothingEnabled = false;
      context.save();
      if (part === 'desk-front') {
        context.beginPath();
        for (const polygon of foreground) {
          polygon.forEach(([x, y], index) => {
            const point = [Math.round(x * density), Math.round(y * density)] as const;
            if (index === 0) context.moveTo(...point);
            else context.lineTo(...point);
          });
          context.closePath();
        }
        context.clip();
      }
      const source = frame.source;
      const target = snapRect(frame.target, density);
      context.drawImage(image, source.x, source.y, source.width, source.height, target.x, target.y, target.width, target.height);
      context.restore();
    }).catch(error => { if (!cancelled) console.error('Unable to draw furniture', error); });
    return () => { cancelled = true; };
  }, [part, frame, density, rasterWidth, rasterHeight]);

  return <canvas ref={canvas} className={`scene-prop scene-${part}`} aria-hidden="true"
    width={rasterWidth} height={rasterHeight}
    style={{ width: width * pixelScale, height: height * pixelScale, imageRendering: 'pixelated' }} />;
});

export const DeskFurniture = memo(function DeskFurniture({ scale }: { scale: number }) {
  return <>
    <FurnitureSprite part="chair" scale={scale} />
    <FurnitureSprite part="desk-rear" scale={scale} />
    <FurnitureSprite part="desk-front" scale={scale} />
  </>;
});
