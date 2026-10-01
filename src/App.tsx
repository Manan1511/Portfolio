import { lazy, Suspense } from 'react';
import { Hero } from './hero/Hero';
const SpritePreview = import.meta.env.DEV ? lazy(() => import('./character/SpritePreview')) : null;

export function App() {
  if (SpritePreview && new URLSearchParams(window.location.search).has('sprite-preview')) {
    return <Suspense fallback={<p>Loading pixels…</p>}><SpritePreview /></Suspense>;
  }
  return <Hero />;
}
