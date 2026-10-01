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
  const frame = selected.frames[reduced ? 0 : frameIndex] ?? selected.frames[0];

  useEffect(() => {
    if (!playing || reduced) return;
    let last = performance.now();
    const duration = selected.frames.reduce((sum, item) => sum + item.duration, 0);
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - last;
      last = now;
      setFrameIndex(frameAt(selected, elapsed.current));
      if (!selected.loop && elapsed.current >= duration && !completion.current) {
        completion.current = true;
        callback.current?.();
        window.clearInterval(timer);
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, [selected, playing, reduced]);

  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    let cancelled = false;
    const layers = frame.layers ?? [];
    Promise.all([loadPicture(frame.image ?? definition.image), ...layers.map(layer => loadPicture(layer.image ?? definition.image))]).then(([picture, ...layerPictures]) => {
      if (cancelled) return;
      context.clearRect(0, 0, definition.width, definition.height);
      context.imageSmoothingEnabled = false;
      const target = frame.target ?? { x: 0, y: 0, width: definition.width, height: definition.height };
      context.drawImage(picture, frame.x, frame.y, frame.width ?? definition.width, frame.height ?? definition.height,
        target.x, target.y, target.width, target.height);
      layers.forEach((layer, index) => {
        const dest = layer.target;
        if (layer.replace) context.clearRect(dest.x, dest.y, dest.width, dest.height);
        context.drawImage(layerPictures[index], layer.x, layer.y, layer.width, layer.height, dest.x, dest.y, dest.width, dest.height);
      });
    }).catch(() => { /* Canvas keeps last successful frame; its accessible label remains available. */ });
    return () => { cancelled = true; };
  }, [definition, frame]);

  return <canvas ref={canvas} width={definition.width} height={definition.height}
    className={`character-sprite ${className}`} role="img" aria-label={label}
    data-clip={clip} data-frame={reduced ? 0 : frameIndex}
    style={{ width: definition.width * pixelScale, height: definition.height * pixelScale, imageRendering: 'pixelated', ...style }} />;
}

export function SpriteMotion({ children, x = 0, y = 0, className = '' }: { children: ReactNode; x?: number; y?: number; className?: string }) {
  return <div className={`sprite-motion ${className}`} style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>{children}</div>;
}
