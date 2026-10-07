import { useEffect, useState, type ReactNode } from 'react';
import { preloadHeroAssets, pokeballSpinner } from './siteAssets';

type EntryState = 'loading' | 'ready' | 'error' | 'entered';

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
        <img className={`site-entry-ball${state === 'loading' ? ' is-spinning' : ''}${hasSettled ? ' is-parked' : ''}${state === 'error' ? ' is-grayscale' : ''}`}
          src={pokeballSpinner} alt="" aria-hidden="true" />
      </div>
      <div className="site-entry-message-slot">
        {state === 'error' && <p className="site-entry-failure" role="alert">loading failed</p>}
      </div>
      <div className="site-entry-action-slot">
        {state === 'ready' && <button className="site-entry-button is-pixelating" type="button" onClick={() => setState('entered')}>enter</button>}
        {state === 'error' && <button className="site-entry-button is-pixelating is-retry" type="button" onClick={() => {
          setState('loading');
          setAttempt(value => value + 1);
        }}>retry</button>}
      </div>
    </div>
  </main>;
}
