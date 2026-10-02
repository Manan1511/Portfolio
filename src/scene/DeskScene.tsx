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
      <CharacterSprite definition={manan} clip={activity} scale={scale} key={greetingRun} label={`Manan ${activity === 'talking' ? 'saying hello' : activity === 'typing' ? 'typing on his laptop' : 'taking a little break'}`} />
      <DeskFurniture scale={scale} />
    </div>
    <button className={`hello-bubble ${activity === 'talking' ? 'is-speaking' : ''}`}
      style={{ top: 200 + manan.anchors.mouth.y * scale - 30 }}
      onClick={() => { setElapsed(0); setGreetingRun(run => run + 1); }} aria-label="Replay greeting: hey, I’m Manan">
      <span aria-hidden="true">{visibleText}<span className="greeting-cursor">{activity === 'talking' && !reduced ? '▌' : ''}</span></span>
    </button>
  </>;
}
