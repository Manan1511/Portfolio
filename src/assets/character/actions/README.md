# Manan action sprite sheets

Transparent PNG exports of 24 complete, original character drawings. New actions
are separate deliverables; the website still uses its approved existing sprite.
No furniture, detached body parts, floor shadows or reference photographs are
included in these exports.

| Export | Complete sheet | Each frame | Matches current renderer |
| --- | --- | --- | --- |
| `manan-actions-180.png` | 1080 × 720 | 180 × 180 | Desktop finer raster at scale 3, displayed at 360 × 360 |
| `manan-actions-120.png` | 720 × 480 | 120 × 120 | Logical/mobile raster at scale 2, displayed at 240 × 240 |

Six columns, four rows. All rows contain full bodies, ordered left to right:

1. Walking right, six gait poses.
2. Waving, six arm/hand poses.
3. Thumbs-up, six gesture poses.
4. Pointing right, six gesture poses.

Each companion JSON contains full-cell source rectangles, clip ordering, proposed
frame durations, transparent padding bounds and registration. These timings are
an initial preview sequence; production integration and further motion tuning
are a separate task. Left-facing movement can mirror complete frames.

## Sizing and registration

The current character uses a 120px logical frame with a maximum display pixel
size of 2 CSS px. At desktop scale 3, the renderer samples into a 180px raster;
at mobile scale 2, it samples into a 120px raster. Both new exports use these
exact square frame dimensions, without changing the live character.

Complete generated silhouettes are detected before packing; the generated image
has approximate spacing rather than exact cells. Native exports use one uniform
scale per sheet, nearest-neighbor sampling, a consistent hair center and foot
baseline at 95% of the cell height. No limbs are cut out or moved separately.
Source alpha is retained within each whole-pose crop. Canvas corners and all
cell borders are genuinely transparent, not a painted checkerboard.

## Verification and regeneration

`scripts/pack_manan_actions.cjs` and `scripts/verify_manan_actions.cjs` use
`@napi-rs/canvas`, available in the bundled workspace Node dependency runtime.
Set `NODE_PATH` to that runtime's `node_modules`, then run:

```sh
node scripts/pack_manan_actions.cjs path/to/generated-sheet.png src/assets/character/actions
node scripts/verify_manan_actions.cjs src/assets/character/actions
```

Both output sizes pass dimension, frame occupancy, unique-crop, transparent-edge,
foot-registration and metadata checks. Browser inspection on white and pale
green backgrounds confirmed complete shoes/hair, transparent surroundings and
the four preview sequences. Browser console reported no errors.

## Generation provenance and prompts

Created with the built-in image-generation tool, using existing original
`manan-poses.png` and `manan-master.png` as character references. The supplied
trainer sheet informed the user's requested format; its artwork is not copied.
Generated source SHA256:
`88b650d7dd96edf60fd2a1281d9b47a3c06f7a44ad9a9a58e6b537f0aa850ca8`.
The high-resolution generated source remains in the local generated-image folder;
the final native PNGs and metadata are committed here.

### Initial generation prompt

Create a production transparent PNG game sprite sheet for the exact Manan
character in the approved pose sheet; the seated master reinforces the same
likeness and style. Preserve his face, clear gray rounded glasses, thick curly
black hair, warm brown skin, slim charcoal tee, navy trousers, cream sneakers,
proportions, palette and fine pixel-cluster shading. Create six columns and four
rows, 24 complete, connected full-body frames, with equal square cells. Aim for
180px cells and a 1080×720 canvas. Character height about 152px, hair near y20,
shoe floor near y171 and standing torso centered at x87. Three-quarter view
facing right throughout, with stable size and registration.

Row 1: right-leg contact, passing, push-off, left-leg contact, passing, push-off.
Row 2: neutral, arm starts lifting, hand raised beside face, wrist outward,
wrist inward, hand begins lowering. Row 3: neutral, bent arm lifts across chest,
thumb raised, held thumbs-up, lowering, neutral. Row 4: neutral, forearm lifts,
extended point right, held point, lowering, neutral. Use subtle facial expressions
and plausible connected in-betweens. No detached pieces, tongue, fluctuating body
width, portrait cells, furniture, shadows, captions, borders or color swatches.
Keep all complete hands and shoes inside transparent padding.

### Layout repair prompt

Keep all 24 complete characters, faces, curls, glasses, clothes, palette, poses,
proportions and row order. Change only spacing and background. Repack into six
columns and four rows of equal square cells on a 3:2 canvas. Keep each complete
character, including its widest gesture, entirely inside its cell, with generous
empty transparent padding above hair and below shoes. Use the same size reduction
for every character and equal floor baselines. Never let one row's shoes touch
the next row's hair. Remove brown/dark background haze and soft halos; surroundings
must be genuine transparency. Preserve foreground artwork. No redrawn bodies,
clipped shoes, fragmented assembly, labels, grid lines or baked checkerboard.
