import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { frameAt, resolveClip, type SpriteDefinition } from './animation';
import { useReducedMotion } from '../shared/useReducedMotion';

const pictures = new Map<string, Promise<HTMLImageElement>>();
function loadPicture(url: string) {
  let pending = pictures.get(url);
  if (!pending) {
    pending = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => { pictures.delete(url); reject(new Error(`Could not load sprite: ${url}`)); };
      image.src = url;
    });
    pictures.set(url, pending);
  }
  return pending;
}

export interface CharacterSpriteProps {
  clip?: string; playing?: boolean; scale?: number; definition: SpriteDefinition;
  className?: string; style?: CSSProperties; onComplete?: () => void; label?: string;
}
export function CharacterSprite({ clip = 'standing-idle', playing = true, scale = 4, definition, className = '', style, onComplete, label = 'Pixel Manan' }: CharacterSpriteProps) {
  const selected = resolveClip(definition, clip);
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const completion = useRef(false);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const [frameIndex, setFrameIndex] = useState(0);
  const previousClip = useRef(selected);
  // Reset immediately on clip changes; callers never see the previous clip's frame index.
  if (previousClip.current !== selected) {
    previousClip.current = selected;
    elapsed.current = 0;
    completion.current = false;
    if (frameIndex !== 0) setFrameIndex(0);
  }
  const pixelScale = Math.max(1, Math.round(scale));
  const displayWidth = definition.width * pixelScale;
  const displayHeight = definition.height * pixelScale;
  let enlargement = Math.min(pixelScale, Math.max(1, Math.round(definition.maxPixelSize ?? pixelScale)));
  // The finer raster must still enlarge in integer multiples on both axes.
  while (displayWidth % enlargement || displayHeight % enlargement) enlargement--;
  const rasterWidth = displayWidth / enlargement;
  const rasterHeight = displayHeight / enlargement;
  const density = pixelScale / enlargement;
  const frame = selected.frames[reduced ? 0 : frameIndex] ?? selected.frames[0];

  useEffect(() => {
    if (!playing || reduced) return;
    let last = performance.now();
    const duration = selected.frames.reduce((sum, item) => sum + item.duration, 0);
    let timer = 0;
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      setFrameIndex(frameAt(selected, elapsed.current));
      if (!selected.loop && elapsed.current >= duration && !completion.current) {
        completion.current = true;
        callback.current?.();
        return;
      }
      timer = window.requestAnimationFrame(tick);
    };
    timer = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(timer);
  }, [selected, playing, reduced]);

  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    let cancelled = false;
    loadPicture(frame.image ?? definition.image).then(picture => {
      if (cancelled) return;
      context.clearRect(0, 0, rasterWidth, rasterHeight);
      context.imageSmoothingEnabled = false;
      const target = frame.target ?? { x: 0, y: 0, width: definition.width, height: definition.height };
      // Preserve native targets exactly; only the finer raster needs edge snapping.
      const left = density === 1 ? target.x : Math.round(target.x * density);
      const top = density === 1 ? target.y : Math.round(target.y * density);
      // Snap shared edges rather than widths so every pose keeps its foot baseline.
      const width = density === 1 ? target.width : Math.round((target.x + target.width) * density) - left;
      const height = density === 1 ? target.height : Math.round((target.y + target.height) * density) - top;
      context.drawImage(picture, frame.x, frame.y, frame.width ?? definition.width, frame.height ?? definition.height,
        left, top, width, height);
    }).catch(error => { if (!cancelled) console.error('Unable to draw sprite frame', error); });
    return () => { cancelled = true; };
  }, [definition, frame, density, rasterWidth, rasterHeight]);

  return <canvas ref={canvas} width={rasterWidth} height={rasterHeight}
    className={`character-sprite ${className}`} role="img" aria-label={label}
    data-clip={clip} data-frame={reduced ? 0 : frameIndex}
    style={{ width: displayWidth, height: displayHeight, imageRendering: 'pixelated', ...style }} />;
}

export function SpriteMotion({ children, x = 0, y = 0, className = '' }: { children: ReactNode; x?: number; y?: number; className?: string }) {
  return <div className={`sprite-motion ${className}`} style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>{children}</div>;
}
