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

  return <main className="site-entry" aria-busy={state === 'loading'}>
    <div className="site-entry-panel">
      <img className={`site-entry-ball${state === 'loading' ? ' is-spinning' : ''}`}
        src={pokeballSpinner} alt="" aria-hidden="true" />
      {state === 'loading' && <p className="site-entry-status" role="status" aria-live="polite">loading assets…</p>}
      {state === 'ready' && <>
        <p className="site-entry-status" role="status" aria-live="polite">the world is ready</p>
        <button className="site-entry-button" type="button" onClick={() => setState('entered')}>enter</button>
      </>}
      {state === 'error' && <>
        <p className="site-entry-status" role="alert">couldn’t load all assets</p>
        <button className="site-entry-button" type="button" onClick={() => {
          setState('loading');
          setAttempt(value => value + 1);
        }}>retry</button>
      </>}
    </div>
  </main>;
}
