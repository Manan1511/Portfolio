import { useEffect, useRef, useState, type ReactNode } from 'react';
import { preloadHeroAssets, pokeballSpinner } from './siteAssets';

type EntryState = 'loading' | 'ready' | 'error' | 'entered';
const pixelGrid = { columns: 28, buttonRows: 12, textRows: 6 };

function PixelReveal({ rows, delay = 0, onComplete }: { rows: number; delay?: number; onComplete?: () => void }) {
  const count = pixelGrid.columns * rows;
  const [isComplete, setIsComplete] = useState(false);
  const hasFinished = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setIsComplete(true);
    onCompleteRef.current?.();
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      finish();
      return;
    }

    // The last staggered tile finishes at delay + count + 54ms. This fallback
    // clears the mask if a browser drops an animationend event.
    const timeout = window.setTimeout(finish, delay + count + 80);
    return () => window.clearTimeout(timeout);
  }, [count, delay]);

  return <span className={`site-entry-pixel-mask${rows === pixelGrid.textRows ? ' is-text-mask' : ''}${isComplete ? ' is-complete' : ''}`}
    aria-hidden="true">
    {Array.from({ length: count }, (_, index) => {
      const order = (index * 37) % count;
      return <span key={index} style={{ animationDelay: `${delay + order}ms` }} />;
    })}
  </span>;
}

export function EntryGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EntryState>('loading');
  const [attempt, setAttempt] = useState(0);
  const [actionRevealed, setActionRevealed] = useState(false);

  useEffect(() => {
    let active = true;
    setState('loading');

    preloadHeroAssets().then(() => {
      if (active) setState('ready');
    }).catch(() => {
      if (active) setState('error');
    });

    return () => { active = false; };
  }, [attempt]);

  if (state === 'entered') return children;

  const hasSettled = state === 'ready' || state === 'error';

  return <main className="site-entry" data-state={state} aria-busy={state === 'loading'}>
    <div className="site-entry-panel">
      <div className={`site-entry-ball-motion${hasSettled ? ' is-raised' : ''}`}>
        <img className={`site-entry-ball${state === 'loading' ? ' is-spinning' : ''}${hasSettled ? ' is-upright' : ''}${state === 'error' ? ' is-grayscale' : ''}`}
          src={pokeballSpinner} alt="" aria-hidden="true" />
      </div>
      <div className="site-entry-message-slot">
        {state === 'error' && <p className="site-entry-failure" role="alert">loading failed<PixelReveal rows={pixelGrid.textRows} delay={880} /></p>}
      </div>
      <div className="site-entry-action-slot">
        {state === 'ready' && <button className={`site-entry-button is-pixelating is-enter${actionRevealed ? ' is-revealed' : ''}`}
          type="button" disabled={!actionRevealed} onClick={() => setState('entered')}>
          <span className="site-entry-button-surface" aria-hidden="true" />
          <span className="site-entry-button-label">enter</span>
          <PixelReveal rows={pixelGrid.buttonRows} delay={880} onComplete={() => setActionRevealed(true)} />
        </button>}
        {state === 'error' && <button className={`site-entry-button is-pixelating is-retry${actionRevealed ? ' is-revealed' : ''}`}
          type="button" disabled={!actionRevealed} onClick={() => {
          setState('loading');
          setActionRevealed(false);
          setAttempt(value => value + 1);
        }}>
          <span className="site-entry-button-surface" aria-hidden="true" />
          <span className="site-entry-button-label">retry</span>
          <PixelReveal rows={pixelGrid.buttonRows} delay={1160} onComplete={() => setActionRevealed(true)} />
        </button>}
      </div>
    </div>
  </main>;
}
