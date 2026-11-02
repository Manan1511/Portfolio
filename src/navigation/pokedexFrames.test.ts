import { describe, expect, it } from 'vitest';

type FramesModule = {
  pokedexFramePosition(index: number): { column: number; row: number };
  pokedexFrameSize: { width: number; height: number };
  pokedexScreenUnderlay: string;
  pokedexOpenSequence: readonly number[];
  pokedexCloseSequence: readonly number[];
  pokedexScreenCutoutStyle(index: number, side: 'portrait' | 'contact'): Record<string, string> | undefined;
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

  it('matches the approved 512 by 341 frame grid and screen cutouts', async () => {
    const frames = await loadFrames();
    expect(frames?.pokedexFrameSize).toEqual({ width: 512, height: 341 });
    expect(frames?.pokedexScreenUnderlay).toEqual(expect.any(String));
    expect(frames?.pokedexScreenCutoutStyle(0, 'portrait')).toBeUndefined();
    expect(frames?.pokedexScreenCutoutStyle(3, 'portrait')).toEqual({
      left: '17.3828%', top: '34.3109%', width: '27.3438%', height: '26.6862%',
    });
    expect(frames?.pokedexScreenCutoutStyle(3, 'contact')).toEqual({
      left: '59.1797%', top: '34.6041%', width: '27.3438%', height: '26.3930%',
    });
    expect(frames?.pokedexScreenCutoutStyle(6, 'portrait')).toEqual({
      left: '17.3828%', top: '34.0176%', width: '27.3438%', height: '26.9795%',
    });
  });
});
