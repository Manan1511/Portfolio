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
      for (let index = 0; index < (still ? 1 : 4); index++) {
        const age = ((elapsed + index * 80) % 320) / 320;
        const frame = flameFrames[still ? 0 : Math.floor(elapsed / 80 + index) % flameFrames.length];
        context.save();
        context.globalAlpha = still ? 1 : 1 - age * .5;
        context.translate(still ? width : width - Math.round(age * width), 12);
        context.rotate(-Math.PI / 2);
        context.drawImage(image, frame.x, frame.y, frame.width, frame.height,
          -Math.floor(frame.width / 2), -frame.height, frame.width, frame.height);
        context.restore();
      }
    }).catch(error => { if (!cancelled) console.error('Unable to render fire', error); });
    return () => { cancelled = true; };
  }, [width, elapsed, still]);
  return <canvas ref={canvas} className="fire-breath" aria-hidden="true" data-still={still}
    width={width} height={24} style={{ width: width * 2, height: 48, left: mouth.x * 2 - width * 2, top: mouth.y * 2 - 24 }} />;
}
