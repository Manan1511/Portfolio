import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../shared/useReducedMotion';
import { playMenuCue } from './menuAudio';
import { PokedexDialog } from './PokedexDialog';

export type NavigationView = 'closed' | 'bag' | 'pokedex';

type BagItem = { id: 'pokedex'; label: 'pokedex'; target: 'pokedex' };
const bagItems: readonly BagItem[] = [{ id: 'pokedex', label: 'pokedex', target: 'pokedex' }];
const bagPanelId = 'hero-bag-panel';
const revealTileCount = 40;
const revealTiles = Array.from({ length: revealTileCount }, (_, index) => ({
  index,
  order: (index * 17) % revealTileCount,
}));

export function BagNavigation({ view, onViewChange, active }: {
  view: NavigationView;
  onViewChange: (view: NavigationView) => void;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const itemButton = useRef<HTMLButtonElement>(null);
  const previousView = useRef(view);

  useLayoutEffect(() => {
    if (previousView.current === 'pokedex' && view === 'bag') itemButton.current?.focus();
    previousView.current = view;
  }, [view]);

  useEffect(() => {
    if (!active || view !== 'bag') return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && root.current?.contains(event.target)) return;
      playMenuCue('bag-close');
      onViewChange('closed');
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      playMenuCue('bag-close');
      onViewChange('closed');
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active, onViewChange, view]);

  if (!active) return null;
  if (view === 'pokedex') return <PokedexDialog onClose={() => onViewChange('bag')} />;

  const closeBag = () => {
    playMenuCue('bag-close');
    onViewChange('closed');
    trigger.current?.focus();
  };

  return <div ref={root} className="bag-navigation">
    <button ref={trigger} className="bag-trigger" type="button" aria-expanded={view === 'bag'}
      aria-controls={bagPanelId} onClick={() => {
        if (view === 'bag') closeBag();
        else {
          playMenuCue('bag-open');
          onViewChange('bag');
        }
      }}>
      <BagIcon />
      <span>bag</span>
    </button>

    {view === 'bag' && <nav className="bag-panel" id={bagPanelId} aria-label="bag">
      <div className="bag-panel-heading"><span>items</span>
        <button className="bag-close" type="button" aria-label="close bag" onClick={closeBag}>×</button>
      </div>
      <div className="bag-item-list">
        {bagItems.map(item => <button ref={itemButton} className="bag-item" type="button" key={item.id}
          onClick={() => {
            if (item.target !== 'pokedex') return;
            playMenuCue('device-open');
            onViewChange('pokedex');
          }}>
          <PokedexIcon />
          <span>{item.label}</span>
          <span className="bag-item-prompt" aria-hidden="true">open ›</span>
        </button>)}
      </div>
      {!reduced && <span className="bag-pixel-reveal" data-testid="bag-pixel-reveal" aria-hidden="true">
        {revealTiles.map(tile => <span key={tile.index} style={{ '--tile-order': tile.order } as CSSProperties} />)}
      </span>}
    </nav>}
  </div>;
}

function BagIcon() {
  return <svg className="bag-trigger-icon" viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M8 3h8v3h4v14H4V6h4z" fill="#d8434e" stroke="#111" strokeWidth="2" />
    <path d="M9 3v4m6-4v4M8 9h8v8H8z" fill="none" stroke="#f5dba0" strokeWidth="2" />
    <path d="M10 10h4v2h2v2h-2v2h-4v-2H8v-2h2z" fill="#72a9d6" stroke="#111" strokeWidth="1" />
  </svg>;
}

function PokedexIcon() {
  return <svg className="bag-item-icon" viewBox="0 0 16 20" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M2 1h12v18H2z" fill="#ed2544" stroke="#101719" strokeWidth="2" />
    <path d="M4 4h3v3H4z" fill="#2f91ce" stroke="#101719" strokeWidth="1" />
    <path d="M5 9h6v5H5z" fill="#b9d6b4" stroke="#101719" strokeWidth="1" />
  </svg>;
}
