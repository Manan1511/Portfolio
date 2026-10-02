import { render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { PixelLandscape } from '../hero/PixelLandscape';
import { PokemonRoamer } from './PokemonRoamer';
import { pokemon, type PokemonId } from './definitions';
import { createActor, type PokemonWorld } from './roaming';

const world: PokemonWorld = { width: 1440, height: 900, floor: 680, skyBottom: 320, obstacles: [] };
const noAction = () => {};
afterEach(() => vi.unstubAllGlobals());

function roamer(id: PokemonId, y: number) {
  const actor = { ...createActor(pokemon[id], world, () => 0), position: { x: 240, y } };
  return <PokemonRoamer definition={pokemon[id]} actor={actor} world={world} reduced={false}
    onAttack={noAction} onHold={noAction} />;
}

it('sorts overlapping Pokémon by their feet and updates depth as positions cross', () => {
  const { container, rerender } = render(<>{roamer('bulbasaur', 400)}{roamer('pikachu', 390)}</>);
  const depth = (id: string) => Number(container.querySelector<HTMLElement>(`[data-pokemon="${id}"]`)!.style.zIndex);
  // Pikachu starts higher but its feet are lower: height/top or render order
  // sorting would give the wrong result here.
  expect(depth('pikachu')).toBeGreaterThan(depth('bulbasaur'));
  rerender(<>{roamer('bulbasaur', 420)}{roamer('pikachu', 390)}</>);
  expect(depth('bulbasaur')).toBeGreaterThan(depth('pikachu'));
});

it('puts a walker behind a tree before its foot baseline, then in front below it', () => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  const { container, rerender } = render(<PixelLandscape clearingY={702} />);
  const tree = container.querySelectorAll<SVGElement>('.scene-tree')[5];
  const feetY = Number(tree.getAttribute('data-ground-y'));
  const treeDepth = Number(tree.style.zIndex);
  rerender(<><PixelLandscape clearingY={702} />{roamer('squirtle', feetY - 80 - 8)}</>);
  const depth = () => Number(container.querySelector<HTMLElement>('[data-pokemon="squirtle"]')!.style.zIndex);
  expect(depth()).toBeLessThan(treeDepth);
  rerender(<><PixelLandscape clearingY={702} />{roamer('squirtle', feetY - 80 + 8)}</>);
  expect(depth()).toBeGreaterThan(treeDepth);
  rerender(<><PixelLandscape clearingY={702} />{roamer('charizard', 16)}</>);
  expect(Number(container.querySelector<HTMLElement>('[data-pokemon="charizard"]')!.style.zIndex)).toBeGreaterThan(treeDepth);
});
