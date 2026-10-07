import { useEffect, useState, type ReactNode } from 'react';
import { preloadHeroAssets, pokeballSpinner } from './siteAssets';

type EntryState = 'loading' | 'ready' | 'error' | 'entered';
const pixelGrid = { columns: 28, buttonRows: 12, textRows: 6 };

function PixelReveal({ rows, delay = 0 }: { rows: number; delay?: number }) {
  const count = pixelGrid.columns * rows;

  return <span className={`site-entry-pixel-mask${rows === pixelGrid.textRows ? ' is-text-mask' : ''}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => {
      const order = (index * 37) % count;
      return <span key={index} style={{ animationDelay: `${delay + order}ms` }} />;
    })}
  </span>;
}

export function EntryGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EntryState>('loading');
  const [attempt, setAttempt] = useState(0);

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
        {state === 'ready' && <button className="site-entry-button is-pixelating" type="button" onClick={() => setState('entered')}>
          <span className="site-entry-button-surface" aria-hidden="true" />
          <span className="site-entry-button-label">enter</span>
          <PixelReveal rows={pixelGrid.buttonRows} delay={880} />
        </button>}
        {state === 'error' && <button className="site-entry-button is-pixelating is-retry" type="button" onClick={() => {
          setState('loading');
          setAttempt(value => value + 1);
        }}>
          <span className="site-entry-button-surface" aria-hidden="true" />
          <span className="site-entry-button-label">retry</span>
          <PixelReveal rows={pixelGrid.buttonRows} delay={1160} />
        </button>}
      </div>
    </div>
  </main>;
}
