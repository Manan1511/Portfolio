# Manan's pixel world

One casual portfolio hero, built with React, Vite and TypeScript. Original reusable character artwork, separate desk props, a speaking greeting, and five orbiting frosted-glass thoughts.

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

See [character documentation](src/character/README.md) for poses, clip metadata, playback, attachment anchors and independent movement. `OrbitCrown` accepts `{ id, label, text }` cards, a head anchor, available width, and an orbit duration in milliseconds. Edit hero placeholders in `src/hero/Hero.tsx`.

Character, furniture and scenery share 2 CSS pixels per native pixel, defined in `src/shared/pixelGrid.ts`. The landscape recalculates its native grid when the hero resizes instead of stretching its pixels. Furniture retains the character's 120px layout coordinates while snapping its drawing to the same display density.

Hover or keyboard focus holds automatic rotation still. Drag horizontally to rotate; a quick flick carries momentum, then eases back toward the 24-second orbit (or stops under the pointer). Front and rear cards follow the hand from their respective side of the ring. Tap on touch screens to pause/resume. Visible buttons and arrow keys also rotate. Explicit pause and reduced-motion preferences disable momentum as well as automatic movement.

## Hosting later

Vite uses `base: './'`, so generated asset links resolve beneath a GitHub Pages repository path. The deployable output is `dist/`. Remote setup and publishing are intentionally left for explicit instruction. [Vite deployment guidance](https://vite.dev/guide/static-deploy.html#github-pages).

Source photos stay outside this repository. Character PNGs are original generated artwork guided by those references. Pixelify Sans is self-hosted under its [OFL license](src/assets/fonts/OFL.txt).
