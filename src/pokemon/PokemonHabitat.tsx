import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '../shared/useReducedMotion';
import { pokemon, populationForWidth, type PokemonId } from './definitions';
import { PokemonRoamer } from './PokemonRoamer';
import { advanceActor, beginAttack, createActor, reconcileActor, type Actor, type PokemonWorld, type Rect } from './roaming';

type Population = Partial<Record<PokemonId, Actor>>;

export function PokemonHabitat({ layoutKey }: { layoutKey?: string } = {}) {
  const layer = useRef<HTMLDivElement>(null);
  const [world, setWorld] = useState<PokemonWorld | null>(null);
  const ids = useMemo(() => world ? populationForWidth(world.width) : [], [world]);
  const [actors, setActors] = useState<Population | null>(null);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [onscreen, setOnscreen] = useState(true);
  const reduced = useReducedMotion();
  const holds = useRef({ hover: false, focus: false });
  const hold = useCallback((channel: 'hover' | 'focus', value: boolean) => { holds.current[channel] = value; }, []);

  useEffect(() => {
    const element = layer.current, hero = element?.closest<HTMLElement>('.hero');
    if (!element || !hero) return;
    const measure = () => {
      const root = element.getBoundingClientRect();
      if (!root.width || !root.height) return;
      const relative = (bounds: DOMRect): Rect => ({ left: bounds.left - root.left, top: bounds.top - root.top,
        right: bounds.right - root.left, bottom: bounds.bottom - root.top });
      const rect = (selector: string): Rect | null => {
        const bounds = hero.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
        return bounds ? relative(bounds) : null;
      };
      const desk = rect('.desk-scene'), hello = rect('.hello-bubble');
      if (!desk) return;
      const furniture = [rect('.scene-desk-front'), rect('.scene-chair'), rect('.desk-scene .character-sprite')]
        .filter((item): item is Rect => !!item);
      const obstacles = [...furniture, desk, hello].filter((item): item is Rect => !!item);
      const groundObstacles = Array.from(hero.querySelectorAll('.tree-footprint'), target => relative(target.getBoundingClientRect()))
        .filter(item => item.right > item.left && item.bottom > item.top && item.right > 0 && item.left < root.width
          && item.bottom > 0 && item.top < root.height);
      const next = { width: root.width, height: root.height,
        skyBottom: Math.min(desk.top + 24, hello?.top ?? desk.top + 24),
        floor: Math.max(desk.bottom + 6, ...furniture.map(item => item.bottom)), obstacles, groundObstacles };
      setWorld(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    for (const selector of ['.desk-scene', '.hello-bubble', '.pixel-landscape']) {
      const target = hero.querySelector(selector);
      if (target) observer.observe(target);
    }
    // A viewport resize can move paths without changing their bounding-box
    // size. Remeasure after the landscape's pixel geometry actually commits.
    const treeObserver = new MutationObserver(measure);
    for (const tree of hero.querySelectorAll('.tree-artwork')) {
      treeObserver.observe(tree, { attributes: true, subtree: true, attributeFilter: ['d', 'transform'] });
    }
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); treeObserver.disconnect(); window.removeEventListener('resize', measure); };
  }, [layoutKey]);

  useEffect(() => {
    if (!world) return;
    setActors(previous => Object.fromEntries(ids.map(id => {
      const existing = previous?.[id];
      return [id, existing ? reconcileActor(existing, pokemon[id], world) : createActor(pokemon[id], world)];
    })) as Population);
  }, [world, ids]);

  useEffect(() => {
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    if (typeof IntersectionObserver !== 'undefined' && layer.current) {
      const observer = new IntersectionObserver(entries => setOnscreen(entries[0].isIntersecting));
      observer.observe(layer.current);
      return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
    }
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  const hasAttack = actors?.charizard?.attackElapsed != null;
  useEffect(() => {
    if (!world || !visible || !onscreen || (reduced && !hasAttack)) return;
    let last = performance.now(), timer = 0;
    const tick = (now: number) => {
      const delta = Math.min(50, now - last); last = now;
      setActors(previous => previous && Object.fromEntries(ids.flatMap(id => {
        const actor = previous[id];
        return actor ? [[id, advanceActor(actor, pokemon[id], world, delta,
          { paused: false, reduced, held: id === 'charizard' && (holds.current.hover || holds.current.focus) })]] : [];
      })) as Population);
      timer = requestAnimationFrame(tick);
    };
    timer = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timer);
  }, [world, ids, visible, onscreen, reduced, hasAttack]);

  const attack = useCallback(() => {
    if (!world) return;
    setActors(previous => previous?.charizard
      ? { ...previous, charizard: beginAttack(previous.charizard, pokemon.charizard, world) } : previous);
  }, [world]);

  return <div className="pokemon-layer" ref={layer}>
    {world && actors && ids.map(id => actors[id] && <PokemonRoamer key={id} definition={pokemon[id]} actor={actors[id]} world={world}
      reduced={reduced} onAttack={attack} onHold={hold} />)}
  </div>;
}
