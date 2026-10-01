import { useEffect, useState, type CSSProperties } from 'react';
import { CharacterSprite } from '../character/CharacterSprite';
import { manan } from '../character/manan';
import { useReducedMotion } from '../shared/useReducedMotion';
import { activityAt } from './activity';
import { DeskFurniture } from './DeskFurniture';

const greeting = 'hey, I’m Manan';

export function DeskScene({ scale }: { scale: number }) {
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [greetingRun, setGreetingRun] = useState(0);
  useEffect(() => {
    setElapsed(0);
    if (reduced) return;
    let previous = performance.now();
    let accumulated = 0;
    const interval = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) accumulated += now - previous;
      previous = now;
      setElapsed(accumulated);
    }, 40);
    return () => window.clearInterval(interval);
  }, [reduced, greetingRun]);
  const activity = reduced ? 'seated-idle' : activityAt(elapsed);
  const visibleText = reduced ? greeting : greeting.slice(0, Math.floor(elapsed / 75) + 1);

  return <>
    <div className="desk-scene" style={{ '--sprite-scale': scale, left: `calc(50% - ${manan.anchors.head.x * scale}px)`, width: scale * manan.width, height: scale * manan.height } as CSSProperties}>
      <svg className="scene-prop scene-chair" viewBox="0 0 80 80" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#283c38" d="M22 37H33V40H35V60H39V64H22V61H20V40H22Z" />
        <path fill="#477061" d="M23 39H32V60H23Z" />
        <path fill="#23362f" d="M23 60H44V65H23ZM30 64H34V74H30ZM24 73H40V75H24Z" />
        <path fill="#5d8570" d="M24 61H43V63H24Z" />
      </svg>
      <CharacterSprite definition={manan} clip={activity} scale={scale} key={greetingRun} label={`Manan ${activity === 'talking' ? 'saying hello' : activity === 'typing' ? 'typing on his laptop' : 'taking a little break'}`} />
      <DeskFurniture />
    </div>
    <button className={`hello-bubble ${activity === 'talking' ? 'is-speaking' : ''}`}
      style={{ top: 200 + manan.anchors.mouth.y * scale - 30 }}
      onClick={() => { setElapsed(0); setGreetingRun(run => run + 1); }} aria-label="Replay greeting: hey, I’m Manan">
      <span aria-hidden="true">{visibleText}<span className="greeting-cursor">{activity === 'talking' && !reduced ? '▌' : ''}</span></span>
    </button>
  </>;
}
