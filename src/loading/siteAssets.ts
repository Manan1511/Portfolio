import mananPoses from '../assets/character/manan-poses.png';
import mananSeated from '../assets/character/manan-seated.png';
import bulbasaur from '../assets/pokemon/bulbasaur.png';
import charizard from '../assets/pokemon/charizard.png';
import pikachu from '../assets/pokemon/pikachu.png';
import pokeball from '../assets/pokemon/pokeball-spinner.png';
import squirtle from '../assets/pokemon/squirtle.png';
import furniture from '../assets/scene-furniture.png';

export const pokeballSpinner = pokeball;

const heroImages = [
  mananPoses,
  mananSeated,
  furniture,
  pikachu,
  charizard,
  bulbasaur,
  squirtle,
  pokeball,
];

function decodeImage(source: string): Promise<void> {
  const image = new Image();
  image.decoding = 'async';

  if (typeof image.decode === 'function') {
    image.src = source;
    return image.decode();
  }

  return new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Could not load hero image: ${source}`));
    image.src = source;
  });
}

export async function preloadHeroAssets(): Promise<void> {
  await Promise.all(heroImages.map(decodeImage));

  if (document.fonts) {
    await document.fonts.load('400 16px Pixelify');
    await document.fonts.ready;
  }
}
