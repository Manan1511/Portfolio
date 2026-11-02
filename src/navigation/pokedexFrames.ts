import sheetUrl from '../assets/pokedex/pokedex-spritesheet.png';

export type PokedexFrameIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const pokedexSpriteSheet = sheetUrl;
export const pokedexOpenSequence: readonly PokedexFrameIndex[] = [0, 1, 2, 3];
export const pokedexCloseSequence: readonly PokedexFrameIndex[] = [3, 2, 1, 0];

export function pokedexFramePosition(index: PokedexFrameIndex): { column: 0 | 1 | 2; row: 0 | 1 | 2 } {
  return {
    column: (index % 3) as 0 | 1 | 2,
    row: Math.floor(index / 3) as 0 | 1 | 2,
  };
}
