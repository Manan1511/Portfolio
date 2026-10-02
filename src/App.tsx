import { lazy, Suspense } from 'react';
import { Hero } from './hero/Hero';
const SpritePreview = import.meta.env.DEV ? lazy(() => import('./character/SpritePreview')) : null;
const PokemonPreview = import.meta.env.DEV ? lazy(() => import('./pokemon/PokemonPreview')) : null;

export function App() {
  if (PokemonPreview && new URLSearchParams(window.location.search).has('pokemon-preview')) {
    return <Suspense fallback={<p>Loading Pokémon…</p>}><PokemonPreview /></Suspense>;
  }
  if (SpritePreview && new URLSearchParams(window.location.search).has('sprite-preview')) {
    return <Suspense fallback={<p>Loading pixels…</p>}><SpritePreview /></Suspense>;
  }
  return <Hero />;
}
