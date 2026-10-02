import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../shared/useReducedMotion';
import { pokemon, type PokemonId } from './definitions';
import { PokemonRoamer } from './PokemonRoamer';
import { advanceActor, beginAttack, createActor, reconcileActor, type Actor, type PokemonWorld, type Rect } from './roaming';

type Population = Record<PokemonId, Actor>;
const ids: PokemonId[] = ['pikachu', 'charizard'];

export function PokemonHabitat() {
  const layer = useRef<HTMLDivElement>(null);
  const [world, setWorld] = useState<PokemonWorld | null>(null);
  const [actors, setActors] = useState<Population | null>(null);
  const [paused, setPaused] = useState(false);
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
      const rect = (selector: string): Rect | null => {
        const bounds = hero.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
        return bounds ? { left: bounds.left - root.left, top: bounds.top - root.top,
          right: bounds.right - root.left, bottom: bounds.bottom - root.top } : null;
      };
      const desk = rect('.desk-scene'), hello = rect('.hello-bubble'), control = rect('.pokemon-pause');
      if (!desk) return;
      const furniture = [rect('.scene-desk-front'), rect('.scene-chair'), rect('.desk-scene .character-sprite')]
        .filter((item): item is Rect => !!item);
      const obstacles = [...furniture, desk, hello, control].filter((item): item is Rect => !!item);
      const next = { width: root.width, height: root.height,
        skyBottom: Math.min(desk.top + 24, hello?.top ?? desk.top + 24),
        floor: Math.max(desk.bottom + 6, ...furniture.map(item => item.bottom)), obstacles };
      setWorld(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    for (const selector of ['.desk-scene', '.hello-bubble', '.pokemon-pause']) {
      const target = hero.querySelector(selector);
      if (target) observer.observe(target);
    }
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  useEffect(() => {
    if (!world) return;
    setActors(previous => Object.fromEntries(ids.map(id => [id, previous
      ? reconcileActor(previous[id], pokemon[id], world) : createActor(pokemon[id], world)])) as Population);
  }, [world]);

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

  const hasAttack = actors?.charizard.attackElapsed != null;
  useEffect(() => {
    if (!world || !visible || !onscreen || ((paused || reduced) && !hasAttack)) return;
    let last = performance.now(), timer = 0;
    const tick = (now: number) => {
      const delta = Math.min(50, now - last); last = now;
      setActors(previous => previous && Object.fromEntries(ids.map(id => [id, advanceActor(previous[id], pokemon[id], world, delta,
        { paused, reduced, held: id === 'charizard' && (holds.current.hover || holds.current.focus) })])) as Population);
      timer = requestAnimationFrame(tick);
    };
    timer = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timer);
  }, [world, visible, onscreen, paused, reduced, hasAttack]);

  const attack = useCallback(() => {
    if (!world) return;
    setActors(previous => previous && { ...previous, charizard: beginAttack(previous.charizard, pokemon.charizard, world) });
  }, [world]);

  return <div className="pokemon-layer" ref={layer}>
    {world && actors && ids.map(id => <PokemonRoamer key={id} definition={pokemon[id]} actor={actors[id]} world={world}
      reduced={reduced} onAttack={attack} onHold={hold} />)}
    <button className="pokemon-pause" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? 'Resume Pokémon' : 'Pause Pokémon'}
    </button>
  </div>;
}
