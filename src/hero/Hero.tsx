import { useEffect, useRef, useState } from 'react';
import { DeskScene } from '../scene/DeskScene';
import { manan } from '../character/manan';
import { PixelLandscape } from './PixelLandscape';
import { PokemonHabitat } from '../pokemon/PokemonHabitat';

export function Hero() {
  const scene = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(() => Math.min(760, window.innerWidth - 32));
  useEffect(() => {
    if (!scene.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, []);
  const scale = width < 500 ? 2 : 3;
  return <main className="hero" aria-label="Manan's little pixel world">
    <h1 className="sr-only">hey, I’m Manan</h1>
    <PixelLandscape />
    <PokemonHabitat />
    <div className="hero-scene" ref={scene}>
      <svg className="pixel-shadow" viewBox="0 0 96 16" aria-hidden="true" shapeRendering="crispEdges"
        style={{ width: scale * 96, left: `calc(50% - ${scale * 24}px)`, top: 200 + manan.anchors.feet.y * scale - 4 }}>
        <path fill="#527447" opacity=".3" d="M14 2H76V4H87V6H95V11H84V13H70V15H17V13H7V10H0V6H7V4H14Z" />
      </svg>
      <DeskScene scale={scale} />
    </div>
  </main>;
}
