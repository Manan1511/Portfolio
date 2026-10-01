import { useEffect, useState, type CSSProperties } from 'react';
import { CharacterSprite } from '../character/CharacterSprite';
import { manan } from '../character/manan';
import { useReducedMotion } from '../shared/useReducedMotion';
import { activityAt } from './activity';

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
      <svg className="scene-prop scene-desk" viewBox="0 0 80 80" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#6e4933" d="M37 52H78V56H37ZM49 56H53V75H49ZM73 56H77V75H73Z" />
        <path fill="#bf8c58" d="M36 50H74L79 54H39Z" />
        <path fill="#dab57b" d="M36 50H74V52H38Z" />
        <path fill="#8f6340" d="M39 54H79V56H39Z" />
        <path fill="#553c2f" d="M49 72H53V75H49ZM73 72H77V75H73Z" />
      </svg>
      <svg className="scene-prop scene-laptop" viewBox="0 0 80 80" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="#304447" d="M63 34H78V47H62ZM43 48H65L77 52V54H40V52Z" />
        <path fill="#4d6667" d="M65 35H77V45H65Z" />
        <path fill="#a4cfc0" d="M66 36H76V44H66Z" />
        <path fill="#dde7c9" d="M67 37H68V38H67ZM69 39H74V40H69ZM68 41H73V42H68Z" />
        <path fill="#718784" d="M43 48H64L76 52H40Z" />
        <path fill="#526966" d="M47 49H62V50H47ZM45 50H65V51H45Z" />
        <path fill="#c3d1bd" d="M54 51H60V52H54Z" />
        <path fill="#faf0d1" d="M77 42H80V46H77Z" />
        <path fill="#886850" d="M77 42H80V43H77Z" />
      </svg>
    </div>
    <button className={`hello-bubble ${activity === 'talking' ? 'is-speaking' : ''}`}
      style={{ top: 200 + manan.anchors.mouth.y * scale - 30 }}
      onClick={() => { setElapsed(0); setGreetingRun(run => run + 1); }} aria-label="Replay greeting: hey, I’m Manan">
      <span aria-hidden="true">{visibleText}<span className="greeting-cursor">{activity === 'talking' && !reduced ? '▌' : ''}</span></span>
    </button>
  </>;
}
