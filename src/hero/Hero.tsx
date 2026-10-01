import { useEffect, useRef, useState } from 'react';
import { OrbitCrown, type OrbitCard } from '../crown/OrbitCrown';
import { DeskScene } from '../scene/DeskScene';
import { manan } from '../character/manan';
import { PixelLandscape } from './PixelLandscape';

const thoughts: OrbitCard[] = [
  { id: 'valorant', label: 'VALORANT', text: 'rank: loading…' },
  { id: 'coffee', label: 'CAFFEINE', text: 'one more cup' },
  { id: 'git', label: 'GIT HABITS', text: 'push. pray. repeat.' },
  { id: 'late-night', label: 'AFTER HOURS', text: 'one last commit' },
  { id: 'side-quests', label: 'SIDE QUESTS', text: 'too many tabs' },
];

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
  const headAnchor = { x: width / 2, y: 200 + manan.anchors.head.y * scale };
  return <main className="hero" aria-label="Manan's little pixel world">
    <h1 className="sr-only">hey, I’m Manan</h1>
    <PixelLandscape />
    <div className="hero-scene" ref={scene}>
      <svg className="pixel-shadow" viewBox="0 0 96 16" aria-hidden="true" shapeRendering="crispEdges"
        style={{ width: scale * 96, left: `calc(50% - ${scale * 24}px)`, top: 200 + manan.anchors.feet.y * scale - 4 }}>
        <path fill="#527447" opacity=".3" d="M14 2H76V4H87V6H95V11H84V13H70V15H17V13H7V10H0V6H7V4H14Z" />
      </svg>
      <DeskScene scale={scale} />
      <OrbitCrown cards={thoughts} headAnchor={headAnchor} width={width} />
    </div>
  </main>;
}
