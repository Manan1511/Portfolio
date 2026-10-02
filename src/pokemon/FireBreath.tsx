import { useEffect, useRef } from 'react';
import { loadSpriteImage } from '../character/CharacterSprite';
import type { Point } from '../character/animation';
import { flameFrames, pokemon } from './definitions';

export function FireBreath({ mouth, length, elapsed, still }: { mouth: Point; length: number; elapsed: number; still: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const width = Math.max(1, Math.floor(length / 2));
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    let cancelled = false;
    loadSpriteImage(pokemon.charizard.sprite.image).then(image => {
      if (cancelled) return;
      context.clearRect(0, 0, width, 24);
      context.imageSmoothingEnabled = false;
      // Rotate complete native flame cells. On narrow screens use only cells
      // that fit; never let a moving packet cross a canvas edge and lose its tip.
      const frames = flameFrames.filter(frame => frame.height <= width);
      if (!frames.length) return;
      // A narrow pixel nozzle at the lip opens into the full flame silhouettes.
      // Leave the distant tips untouched; only the mouth connection is tapered.
      context.save();
      context.beginPath();
      const nozzle = [[width, 11], [width - 4, 11], [width - 4, 8], [width - 8, 8],
        [width - 8, 4], [width - 12, 4], [width - 12, 0], [0, 0], [0, 24],
        [width - 12, 24], [width - 12, 20], [width - 8, 20], [width - 8, 16],
        [width - 4, 16], [width - 4, 13], [width, 13]];
      nozzle.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
      context.closePath();
      context.clip();
      for (let index = 0; index < (still ? 1 : 4); index++) {
        const age = ((elapsed + index * 80) % 320) / 320;
        const frame = frames[still ? 0 : Math.floor(Math.max(0, elapsed) / 80 + index) % frames.length];
        context.save();
        context.globalAlpha = still || index === 0 ? 1 : 1 - age * .5;
        context.translate(still || index === 0 ? width : width - Math.round(age * (width - frame.height)), 12);
        context.rotate(-Math.PI / 2);
        context.drawImage(image, frame.x, frame.y, frame.width, frame.height,
          -Math.floor(frame.width / 2), -frame.height, frame.width, frame.height);
        context.restore();
      }
      context.restore();
    }).catch(error => { if (!cancelled) console.error('Unable to render fire', error); });
    return () => { cancelled = true; };
  }, [width, elapsed, still]);
  return <canvas ref={canvas} className="fire-breath" aria-hidden="true" data-still={still}
    width={width} height={24} style={{ width: width * 2, height: 48, left: mouth.x * 2 - width * 2, top: mouth.y * 2 - 24 }} />;
}
