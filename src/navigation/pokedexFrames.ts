import sheetUrl from '../assets/pokedex/pokedex-spritesheet.png';

export type PokedexFrameIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type PokedexScreen = 'portrait' | 'contact';
type PixelRect = { x: number; y: number; width: number; height: number };

export const pokedexFrameSize = { width: 512, height: 341 } as const;

export const pokedexSpriteSheet = sheetUrl;
export const pokedexOpenSequence: readonly PokedexFrameIndex[] = [0, 1, 2, 3];
export const pokedexCloseSequence: readonly PokedexFrameIndex[] = [3, 2, 1, 0];

const screenCutouts: Partial<Record<PokedexFrameIndex, Record<PokedexScreen, PixelRect>>> = {
  3: {
    portrait: { x: 89, y: 117, width: 140, height: 91 },
    contact: { x: 303, y: 118, width: 140, height: 90 },
  },
  4: {
    portrait: { x: 92, y: 117, width: 135, height: 91 },
    contact: { x: 298, y: 117, width: 141, height: 91 },
  },
  5: {
    portrait: { x: 89, y: 117, width: 139, height: 91 },
    contact: { x: 303, y: 117, width: 139, height: 91 },
  },
  6: {
    portrait: { x: 89, y: 116, width: 140, height: 92 },
    contact: { x: 303, y: 116, width: 140, height: 92 },
  },
  7: {
    portrait: { x: 92, y: 116, width: 135, height: 92 },
    contact: { x: 298, y: 116, width: 141, height: 92 },
  },
  8: {
    portrait: { x: 90, y: 116, width: 138, height: 92 },
    contact: { x: 303, y: 116, width: 138, height: 92 },
  },
};

export function pokedexScreenCutoutStyle(index: PokedexFrameIndex, side: PokedexScreen): Record<string, string> | undefined {
  const rect = screenCutouts[index]?.[side];
  if (!rect) return undefined;

  const percent = (value: number, extent: number) => `${(value / extent * 100).toFixed(4)}%`;
  return {
    left: percent(rect.x, pokedexFrameSize.width),
    top: percent(rect.y, pokedexFrameSize.height),
    width: percent(rect.width, pokedexFrameSize.width),
    height: percent(rect.height, pokedexFrameSize.height),
  };
}

export function pokedexFramePosition(index: PokedexFrameIndex): { column: 0 | 1 | 2; row: 0 | 1 | 2 } {
  return {
    column: (index % 3) as 0 | 1 | 2,
    row: Math.floor(index / 3) as 0 | 1 | 2,
  };
}
