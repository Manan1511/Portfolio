# Manan's pixel world

One casual portfolio hero, built with React, Vite and TypeScript. Original reusable character artwork, separate desk props and a speaking greeting. The rotating glass cards and their controls are temporarily removed from the hero.

## Local development

```sh
npm install
npm run dev
```

Hero: `http://127.0.0.1:5173/`. Character inspection: `http://127.0.0.1:5173/?sprite-preview=1` (development only).

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

## Reuse

See [character documentation](src/character/README.md) for poses, clip metadata, playback, attachment anchors and independent movement. The reusable `OrbitCrown` remains available in `src/crown/OrbitCrown.tsx`, but is not currently mounted. It accepts `{ id, label, text }` cards, a head anchor, available width, and an orbit duration in milliseconds.

Character, furniture and scenery share 2 CSS pixels per native pixel, defined in `src/shared/pixelGrid.ts`. The landscape recalculates its native grid when the hero resizes instead of stretching its pixels. Furniture retains the character's 120px layout coordinates while snapping its drawing to the same display density.

The desk uses original raster artwork with separate rear and forward depth passes; the character stays one complete sprite. Furniture generation and registration are documented in [scene artwork](src/assets/SCENE_ARTWORK.md). Follow the [development standards](docs/development-standards.md) for future components.

When mounted, the crown supports hover/focus pause, horizontal dragging, flick momentum, touch pause/resume, visible controls and keyboard rotation. Explicit pause and reduced-motion preferences disable momentum as well as automatic movement.

## Hosting later

Vite uses `base: './'`, so generated asset links resolve beneath a GitHub Pages repository path. The deployable output is `dist/`. Remote setup and publishing are intentionally left for explicit instruction. [Vite deployment guidance](https://vite.dev/guide/static-deploy.html#github-pages).

Source photos stay outside this repository. Character PNGs are original generated artwork guided by those references. Pixelify Sans is self-hosted under its [OFL license](src/assets/fonts/OFL.txt).
