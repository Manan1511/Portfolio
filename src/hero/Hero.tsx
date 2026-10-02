import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DeskScene } from '../scene/DeskScene';
import { manan } from '../character/manan';
import { PixelLandscape } from './PixelLandscape';
import { PokemonHabitat } from '../pokemon/PokemonHabitat';
import { deskFloorAnchor } from '../scene/DeskFurniture';

const sceneOffsetX = 16;

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    if (!hero.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    });
    observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);
  const width = Math.min(760, size.width - 32);
  const scale = size.height < 566 ? 1 : width < 500 || size.height < 740 ? 2 : 3;
  const sceneHeight = Math.min(size.height, width < 500 ? 540 : 660);
  const sceneTop = (size.height - sceneHeight) / 2;
  // Reserve full sprite bounds plus padding below the desk for Pikachu. Keep
  // integer enlargement instead of stretching the artwork to an arbitrary size.
  const worldDeskTop = Math.round(Math.max(16, Math.min(sceneTop + 200, size.height - 120 * scale - 126)) / 2) * 2;
  const deskTop = worldDeskTop - sceneTop;
  return <main className="hero" ref={hero} aria-label="Manan's little pixel world">
    <h1 className="sr-only">hey, i’m manan</h1>
    <PixelLandscape clearingY={worldDeskTop + manan.anchors.feet.y * scale + 20 * scale}
      clearingCenter={{ x: size.width / 2, y: worldDeskTop + deskFloorAnchor.y * scale }} />
    <PokemonHabitat layoutKey={`${size.width}:${size.height}:${scale}:${deskTop}`} />
    <div className={`hero-scene${scale < 3 ? ' is-compact' : ''}`} style={{ height: sceneHeight, left: sceneOffsetX,
      '--greeting-right': `${(manan.anchors.mouth.x - deskFloorAnchor.x) * scale + 40}px` } as CSSProperties}>
      <svg className="pixel-shadow" viewBox="0 0 96 16" aria-hidden="true" shapeRendering="crispEdges"
        style={{ width: scale * 96, left: `calc(50% - ${scale * (deskFloorAnchor.x - manan.anchors.feet.x + 48)}px)`, top: deskTop + manan.anchors.feet.y * scale - 4 }}>
        <path fill="#527447" opacity=".3" d="M14 2H76V4H87V6H95V11H84V13H70V15H17V13H7V10H0V6H7V4H14Z" />
      </svg>
      <DeskScene scale={scale} top={deskTop} />
    </div>
  </main>;
}
