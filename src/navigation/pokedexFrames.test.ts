import { describe, expect, it } from 'vitest';

type FramesModule = {
  pokedexFramePosition(index: number): { column: number; row: number };
  pokedexOpenSequence: readonly number[];
  pokedexCloseSequence: readonly number[];
};

const modules = import.meta.glob('./pokedexFrames.ts');

async function loadFrames() {
  const loader = modules['./pokedexFrames.ts'];
  expect(loader, 'pokedexFrames.ts must provide the sprite sheet map').toBeDefined();
  return loader ? await loader() as FramesModule : undefined;
}

describe('Pokédex sprite sheet mapping', () => {
  it('maps all frames in row-major order across the 3 by 3 sheet', async () => {
    const frames = await loadFrames();
    expect(Array.from({ length: 9 }, (_, index) => frames?.pokedexFramePosition(index))).toEqual([
      { column: 0, row: 0 }, { column: 1, row: 0 }, { column: 2, row: 0 },
      { column: 0, row: 1 }, { column: 1, row: 1 }, { column: 2, row: 1 },
      { column: 0, row: 2 }, { column: 1, row: 2 }, { column: 2, row: 2 },
    ]);
  });

  it('uses the approved opening and reverse closing frame sequences', async () => {
    const frames = await loadFrames();
    expect(frames?.pokedexOpenSequence).toEqual([0, 1, 2, 3]);
    expect(frames?.pokedexCloseSequence).toEqual([3, 2, 1, 0]);
  });
});
