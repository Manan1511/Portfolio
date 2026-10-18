import mananPoses from '../assets/character/manan-poses.png';
import mananSeated from '../assets/character/manan-seated.png';
import bulbasaur from '../assets/pokemon/bulbasaur.png';
import charizard from '../assets/pokemon/charizard.png';
import pikachu from '../assets/pokemon/pikachu.png';
import pokeball from '../assets/pokemon/pokeball-spinner.png';
import squirtle from '../assets/pokemon/squirtle.png';
import furniture from '../assets/scene-furniture.png';
import { loadSpriteImage } from '../character/CharacterSprite';

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

export async function preloadHeroAssets(): Promise<void> {
  // Use the same decoded image objects the character and furniture canvases
  // draw from, so mounting the prepared scene does not trigger another load.
  await Promise.all(heroImages.map(loadSpriteImage));

  if (document.fonts) {
    await document.fonts.load('400 16px Pixelify');
    await document.fonts.ready;
  }
}
