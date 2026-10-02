# Roaming Pokémon implementation

Approved scope: one ground Pikachu, one flying Charizard, bounded roaming with
idle stops, click/tap/keyboard fire breath and reduced motion. The user later
removed the manual pause control; hidden/offscreen and reduced-motion pauses remain.
Original sheets receive exact colour background removal. Main hero, Manan,
furniture and greeting retain their existing composition.

Desktop expansion (2026-10-03): add one Bulbasaur and one Squirtle at hero
widths of **1024px and above**. Gengar is deferred by the user. Below that
breakpoint, retain the existing Pikachu/Charizard population and composition.
Bulbasaur walks through the left grass area; Squirtle through the right. Both
use complete source poses, 2× pixels, native left-facing artwork mirrored for
rightward travel, and idle pauses. No new click action or control is added.

Species metadata supplies eligibility, normalized spawn positions, horizontal
roaming ranges and an optional ground inset. New walkers can reach grass beside
the desk while measured obstacles exclude furniture, Manan and the greeting.
Resize reconciliation finds the closest safe placement, including obstacle
edges, instead of assuming the top-left corner is always clear. Existing actors
retain their animation/attack state when the responsive population changes.
All species share the existing clock, hidden/offscreen pauses and reduced motion.

Depth/idle refinement (2026-10-03): ground Pokémon and individual trees share
the hero's stacking context. Their foot/ground-contact Y coordinates determine
depth, so a walker can pass behind a tree or in front and Pokémon crossings
follow position rather than render order. Charizard has a separate sky depth.
Keep the landscape and Pokémon parent layers free of stacking contexts.
The right-edge tree moves from x=462 to x=454 for an off-center partial crop.

Ambient rest ranges: Pikachu 3.5–5.5s; Charizard 2.8–4.2s; Bulbasaur 5–8s;
Squirtle 4.2–6.5s. Idle playback, flight wings and the 1.2s manual attack retain
their existing frame timing.

Tree trunks are solid ground obstacles. Transparent base footprints follow the
actual transformed pixel artwork; the habitat measures them after layout and
after tree geometry changes. Ground walkers use a small foot collider with a
2px clearance. Both destination checks and the entire movement segment reject
trunk crossings. Spawn/resize reconciliation also checks these obstacles.
Canopies remain visual depth layers, and Charizard ignores ground collisions.

## Milestones

1. Transparent sheets, complete registered clips, controlled renderer playback
   and development-only pose preview. Verify pixels and frame bounds; commit.
2. One animation clock, measured safe roaming areas, attack/flame attachment,
   accessible controls and responsive integration. Test behavior and inspect
   production under a repository subpath; commit. No push or deployment.

## Execution record

- Base: `9b0b696`. Existing checkout retained for the user's live local preview.
- Background-cleanup test failed before implementation; controlled playback
  test failed with frame0 instead of requested frame1, then passed.
- Frame-bound test found a one-pixel clipped flight frame; corrected registration.
- Source RGB preservation checked for every pixel during preprocessing. Sprite
  assets contain complete poses, with mouth/body/foot anchors in metadata.
- User requested smoother frame changes: 80ms walk/wing cadence, an eight-frame
  wing return cycle, a held coherent exhale pose and eased movement starts/stops.
- Asset milestone verified: cleanup test passed; 49 Vitest tests, typecheck and
  production build passed. Development preview inspected complete flight,
  attack and Pikachu walk poses; a neighbouring-row speck was excluded from
  the flight crop. No character or furniture asset was changed.
- Integration verified: 67 tests across 11 files, typecheck and production build
  passed. Bounds, easing, attack timing, mirrored fire, resize, pause, touch
  focus, hidden/offscreen recovery and reduced motion have behavior coverage.
- Browser production checks under `/revamped-portfolio/` inspected 320, 390,
  768 and 1440px, plus minimum-height 320x650 and 532x740 layouts. Both species
  retain exact 2x enlargement; no horizontal document overflow occurred.
  Enter and Space trigger fire while ambient roaming is paused. Resume works;
  production console reported no errors. Proof captures are in `.verification/`.
- Fresh independent review found no Critical or Important defects. Decorative
  Pikachu was hidden from assistive technology after the review's minor note.
- Follow-up flight correction: the first mapped cell had extended legs and a
  hanging belly, breaking the airborne posture every loop. Removed it from both
  flight and hover. The four airborne cells now run up/middle/flat/down/flat/middle
  with 120ms stroke extremes and 100ms intermediate frames (640ms total).
- Replaced the shared sheet-row baseline with per-pose chest registration.
  Mouth/head position is stable across the cycle. Attack wind-up and recovery
  use airborne poses; recovery ends on the same pose that resumes the wing loop.
  Fire still uses the original whole exhale drawing and 240/600/360ms phases.
- Three regressions failed before the correction, then passed. Fresh 70 tests,
  typecheck and build passed. Browser inspected each wing phase, mirrored hover,
  fire attachment and resumed flight under the production repository subpath.
  Production layouts at 320/390/768/1440px retain 2x pixels without overflow.
  Pikachu, source artwork and movement/controller logic are unchanged.

- Fire and viewport follow-up: complete flame cells stay within their canvas;
  compact whole cells are selected when horizontal space is limited. The mouth
  anchor is now just in front of the open lip, with a narrow stepped connection
  and body-over-fire layering to keep flames off the muzzle. Detached source
  sparks are excluded from compact cell rectangles; original PNGs stay untouched.
- Removed the Pause Pokémon UI. The hero uses the actual viewport height and
  integer character enlargement. Its desk floor anchors the grass clearing;
  habitat bounds remeasure when the scene's position or scale changes.
- Fresh verification: 76 tests, typecheck and production build passed. Six
  portrait/landscape viewport layouts fit without document overflow. Enter
  activation, flame connection and recovery were inspected on the production
  page beneath `/revamped-portfolio/`; console errors were absent.

- Desktop expansion: original RGB pixels, alpha removal and sheet coordinates
  verified for every source pixel. Five Bulbasaur and six Squirtle walk crops
  inspected together with floor registration; recolours, shell actions and
  editing parts excluded. Asset milestone committed separately.
- Regression coverage includes desktop eligibility at the 1024px breakpoint,
  mobile population, resize continuity, separate side areas, independent walking,
  furniture avoidance, hidden-page pause and reduced motion.
- Final expansion verification: 86 tests across 13 files, typecheck, background
  cleanup test and production build pass. Production served beneath
  `/revamped-portfolio/`: 320, 390 and 768px retain two species; 1024 and 1440px
  show four. Exact 2× dimensions and no document overflow confirmed. Desktop
  and mobile compositions inspected; Enter still starts Charizard's attack.
  No production console warnings or errors. Proof: `.verification/desktop-pokemon-final.png`.

- Depth, idle and trunk refinement: 95 tests across 14 files, typecheck and
  production build pass. Regressions cover crossings by feet, tree occlusion,
  longer rests, swept trunk avoidance, mirrored foot registration, safe spawn
  and resize recovery, and remeasurement after SVG tree geometry changes.
  Browser inspected behind/in-front tree poses and the production scene under
  the repository subpath at 320/390/768/1024/1440px. No horizontal overflow or
  observed foot/trunk intersections. The right tree shows about 68% of its crown
  on desktop, instead of a midpoint cut. Portrait favicon resolves under the
  subpath and returns HTTP 200. Proof: `.verification/tree-depth-fixed.png` and
  `.verification/world-trunks-final.png`.
