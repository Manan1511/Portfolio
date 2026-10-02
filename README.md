# Manan's pixel world

One casual portfolio hero, built with React, Vite and TypeScript. Original reusable character artwork, separate desk props, a speaking greeting and roaming Pikachu/Charizard. Click or tap Charizard for fire breath. The rotating glass cards and their controls are temporarily removed from the hero.

## Local development

```sh
npm install
npm run dev
```

Hero: `http://127.0.0.1:5173/`. Character inspection: `http://127.0.0.1:5173/?sprite-preview=1` (development only).
Pokémon frames and mouth-anchor inspection: `http://127.0.0.1:5173/?pokemon-preview=1` (development only).

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

## Reuse

See [character documentation](src/character/README.md) for poses, clip metadata, playback, attachment anchors and independent movement. The reusable `OrbitCrown` remains available in `src/crown/OrbitCrown.tsx`, but is not currently mounted. It accepts `{ id, label, text }` cards, a head anchor, available width, and an orbit duration in milliseconds.

`PokemonRoamer` uses species definitions and an independent movement controller.
One habitat clock drives body frames, travel and fire. Hover/keyboard focus holds
Charizard for interaction; pointer-created touch focus does not lock roaming.
Reduced motion provides stationary sprites and a short static attack. Hidden or
offscreen heroes preserve elapsed time. See [Pokémon implementation](docs/pokemon.md)
and [supplied-sheet provenance](src/assets/pokemon/ARTWORK.md).

Character, furniture and scenery share 2 CSS pixels per native pixel, defined in `src/shared/pixelGrid.ts`. The landscape recalculates its native grid when the hero resizes instead of stretching its pixels. Furniture retains the character's 120px layout coordinates while snapping its drawing to the same display density.

The hero fits the current viewport height and width. Manan uses whole-number enlargement at 1x, 2x or 3x depending on available space; Pokémon retain 2x enlargement. The table footprint is centered in the viewport and the clearing shares its floor anchor, while surrounding terrain keeps its existing position. Roaming bounds update after scene layout changes. The lowercase greeting uses white fill and black text/borders, sits to the right of Manan, and moves closer to his face on mobile.

The desk uses original raster artwork with separate rear and forward depth passes; the character stays one complete sprite. Furniture generation and registration are documented in [scene artwork](src/assets/SCENE_ARTWORK.md). Follow the [development standards](docs/development-standards.md) for future components.

When mounted, the crown supports hover/focus pause, horizontal dragging, flick momentum, touch pause/resume, visible controls and keyboard rotation. Explicit pause and reduced-motion preferences disable momentum as well as automatic movement.

## Hosting later

Vite uses `base: './'`, so generated asset links resolve beneath a GitHub Pages repository path. The deployable output is `dist/`. Remote setup and publishing are intentionally left for explicit instruction. [Vite deployment guidance](https://vite.dev/guide/static-deploy.html#github-pages).

Source photos stay outside this repository. Character PNGs are original generated artwork guided by those references. Pixelify Sans is self-hosted under its [OFL license](src/assets/fonts/OFL.txt).
