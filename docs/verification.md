# Hero verification — 2026-10-02

## Contained fire and viewport fitting — 2026-10-03

Flame packets previously crossed their canvas boundary, cutting off the tip.
Packets now retain complete native bounds; narrow layouts select compact whole
cells. A corrected exhale anchor sits just in front of the open lip. A stepped
connection narrows the flame at the mouth, while the complete body draws above
the effect so it cannot overpaint the muzzle. Original source PNGs are unchanged.

Removed the Pause Pokémon control as requested. The hero now follows viewport
height as well as width, with integer character enlargement. The clearing follows
the desk floor, and habitat bounds remeasure after scene layout changes.

- Regression checks first failed for packet clipping, the muzzle anchor, short
  viewport sizing and the clearing position. All 13 files / 76 tests now pass;
  fresh typecheck and production build also pass.
- Packet drawing bounds verified at 44, 56 and 120 CSS px through animated and
  reduced-motion rendering. Existing attack, mirroring, resize, hidden/offscreen
  recovery and reduced-motion behavior tests remain green.
- Production layouts inspected at 320x568, 390x650, 390x844, 844x480, 1440x640
  and 1440x900. Document sizes match their viewports, full sprite bounds retain
  padding, and the desk and clearing stay aligned. No pause button remains.
- Production beneath `/revamped-portfolio/` inspected during Enter activation,
  flame attachment and recovery; the console reported no errors. Nested mobile
  iframe input was unavailable in browser automation; mobile attack containment
  is covered by raster bounds tests and responsive geometry inspection.
- Proof: ignored `.verification/fire-lip-fixed-viewport.jpg`.

## Charizard airborne frame correction — 2026-10-02

The ambient flight/hover loop included a standing/takeoff pose, changing leg and
belly posture once per cycle. Removed that pose and registered the four complete
airborne cells around the chest below the jaw. The head/mouth now stays aligned
through up/middle/flat/down/flat/middle wing motion. Stroke extremes last 120ms;
intermediate poses last 100ms. No sprite artwork or Pikachu behavior changed.

Attack wind-up and recovery now use airborne cells, with recovery ending on the
exact pose that resumes the ambient loop. The existing whole exhale drawing,
1.2-second attack, 600ms fire interval and per-frame mouth attachment remain.

- Three regressions observed failing for the ground cell, head drift and ground
  recovery; after correction all 11 files / 70 tests passed. Typecheck/build passed.
- Browser inspected the intermediate/flat/down poses and mirrored hover.
  Production fire and return to roaming checked; console reported no errors.
- Production under `/revamped-portfolio/` inspected at 320, 390, 768 and 1440px.
  Sprites remain 2x and document widths match viewports. Full layouts also show
  the 320x650 and 532x740 minimum-height compositions remain clear.
- Proof: ignored `.verification/charizard-flight-fixed.jpg`.

## Roaming Pokémon and smoother playback — 2026-10-02

Added local transparent Pikachu and Charizard sheets with exact foreground RGB
preservation, registered whole-frame clips and a development-only preview.
One shared clock drives roaming and Charizard's 1.2-second fire attack. Movement
eases into each trip; 80ms frame cadence and an eight-frame wing return cycle
reduce abrupt transitions while keeping crisp sprite pixels.

- Fresh 11 files / 67 tests, typecheck and production build passed.
- Production beneath `/revamped-portfolio/` inspected at 320, 390, 768 and
  1440px; minimum-height 320x650 and 532x740 layouts also checked. Exact 2x
  sprite enlargement and no horizontal document overflow confirmed.
- Enter and Space fire attacks checked with ambient movement paused, followed
  by Resume. Repeated activation during recovery is ignored. Production browser
  console contains no errors. Unit coverage includes hidden/offscreen recovery,
  touch focus, reduced motion, attack timing, mirroring and safe movement bounds.
- Independent review found no Critical or Important issues. Existing character,
  furniture, greeting and card-free composition remain unchanged.
- Proof: ignored `.verification/pokemon-responsive.jpg` and
  `.verification/pokemon-production-fire.jpg`.

## Requested downward desk nudge — 2026-10-02

Lowered both desk passes by two logical pixels (4px mobile / 6px desktop), keeping their shared registration and prior left nudge. Browser close-ups inspected the far desk foot relative to the chair base and hand contact on the keyboard at desktop and mobile sizes. Foreground coverage remains complete. Proof: ignored `.verification/desk-lowered.jpg`. Fresh 46 tests, typecheck and production build passed.

## Requested left desk nudge — 2026-10-02

Removed the desk's four-logical-pixel right offset, shifting both furniture passes left by 8px on mobile and 12px on desktop. Chair position and complete wood foreground coverage remain unchanged. Browser close-up inspected keyboard contact and the resulting overlap. Proof: ignored `.verification/desk-left-nudge.jpg`. Typecheck and production build passed.

## Complete desk leg occlusion — 2026-10-02

The preceding side-apron correction left the far left desk leg in the rear pass, so trousers could still paint over its wood. Restored the complete lower desk foreground coverage, retaining the new chair/desk spacing. Browser close-up confirms an uninterrupted wooden leg and apron in front of the trousers. Proof: ignored `.verification/desk-leg-occlusion.jpg`. Fresh 46 tests, typecheck and production build passed.

## Diagonal apron occlusion — 2026-10-02

The preceding depth mask ended the desk's side apron at the horizontal front rail, exposing trouser pixels through its lower diagonal area. Extended the foreground clip along that side panel while retaining the far leg behind the chair. Browser close-up confirms the wood panel now covers the trousers; artwork and furniture offsets are unchanged. Proof: ignored `.verification/desk-side-occlusion.jpg`. Fresh 46 tests, typecheck and production build passed.

## Chair and desk clearance — 2026-10-02

The desk's far left leg was drawn over the chair seat/base by the broad foreground mask. Separated the furniture horizontally (chair -10 logical px, desk +4 logical px), placed rear furniture behind the chair, and restricted the lower foreground mask to the near legs. The tabletop/apron retain their forward depth. Character artwork and animation are unchanged.

- Fresh 46 tests, typecheck and production build passed.
- Browser checks at 320, 390, 768 and 1440px confirmed matching viewport/document widths, scaled offsets and rear/seat/front depth order. Mobile composition and desktop keyboard contact inspected. Proof: ignored `.verification/desk-chair-spacing.jpg`.

## Cards temporarily removed — 2026-10-02

Removed the crown from the hero, including its drag hint and rotation controls. The reusable crown implementation and behavior tests remain available for later use. Character, greeting, furniture and landscape retain their existing layout and animation.

- Fresh suite: 8 files / 46 tests passed; typecheck and production build passed.
- Browser inspection confirmed the card-free hero and greeting replay control, with no browser errors. Proof: ignored `.verification/hero-without-crown.jpg`.

## Previous hero verification

- `npm test`: 8 files, 46 tests passed after the forward furniture and keyboard correction.
- `npm run typecheck`: passed.
- `npm run build`: passed, relative asset paths in `dist/index.html`.
- Production hero inspected at 320, 390, 768 and 1440 CSS pixels wide. No horizontal document overflow or overflowing card content. Character enlargement uses whole-pixel multiples.
- Browser checked keyboard rotation, pause/resume, greeting replay, focused-card promotion and sprite poses. Unit behavior checks cover hover/focus, horizontal drag continuity, 8px tap/drag threshold, vertical swipe, delayed press, release outside the crown, and reduced motion.
- Static production copy served under `/revamped-portfolio/`: hero, sprite and self-hosted font loaded; browser reported no errors. Development pose preview is absent from production.
- Complete typing and speech frames inspected individually. Connected anatomy, neutral loop endpoints, whole-frame registration, hand-to-keyboard placement and mouth-anchored greeting inspected.
- Independent code review completed. Outside-release orbit lock and covered keyboard-focused cards were fixed; the stale hand attachment anchor was corrected. No remaining Critical or Important finding.
- Local proof captures are in ignored `.verification/`: `hero-desktop.jpg`, `hero-mobile.jpg`, `sprite-fixed.jpg`. Reference photos remain outside the repository.

The milestone contains only the hero and reusable character. Walking clips, audio, additional sections, backend and publishing remain outside the approved scope.

## Forward raster furniture and keyboard contact — 2026-10-02

User approved the sprite and requested furniture matching its shading, with a grounded diagonal side view and desk/laptop in the foreground. Replaced the flat SVG props with an original transparent raster atlas: warm wooden desk, connected rear-facing laptop, cream mug and upholstered chair. A subsequent user screenshot showed hands left of the small keyboard; a localized imagegen edit extended the laptop base and keys left beneath both hands.

- Character artwork, renderer, pose metadata and animation timing are unchanged. One complete character canvas renders between rear and forward furniture passes. Only furniture is clipped: the tabletop/apron cover the lap naturally, hands stay on the keyboard, and the rear lid sits forward of the fingertips. Chair retains its left nudge.
- Source rectangles retain the full laptop outline and legs. Furniture uses a 132×120 logical canvas to fit the broad desk, with the existing hand/floor registration and the same 2px display pixels as the character.
- Shared artwork loading is cached, decoding is asynchronous, cancelled effects cannot paint after unmount, and static props are memoized independently of the activity timer. Decorative canvases are hidden from assistive technology.
- Updated density checks and a source-registration/foreground-clip regression were observed failing against the previous SVG implementation, then passing. The full-outline crop regression also failed before its correction. Fresh full suite: 8 files / 46 tests passed; typecheck, production build and diff whitespace checks passed.
- Latest production output inspected beneath `/revamped-portfolio/` at 320, 390, 768 and 1440px. Every character/furniture canvas measured 2 CSS px per native pixel, exactly one character rendered, document widths matched viewport widths, card content fit, and Pixelify loaded. Foreground furniture measured z=3 above the character at z=2; rear furniture remained z=1.
- Direct production inspection confirmed greeting replay, typing frame2 with both hands above the extended keyboard, and coherent desk/leg/floor contact. No production browser errors. Proofs in ignored `.verification/`: `forward-keyboard-production.jpg`, `forward-furniture-production.jpg`, `forward-furniture-layouts-production.jpg`.
- Independent read-only review found no material issue with loading, cancellation, responsive sampling or furniture depth clipping. User's ongoing website-quality request is recorded in `docs/development-standards.md`. Original asset and complete built-in imagegen prompts are documented in `src/assets/SCENE_ARTWORK.md`.

## Matched environment pixel density — 2026-10-02

User reported the environment's coarse blocks did not match the finer sprite. The old landscape stretched a fixed 480×320 drawing with the viewport, and desktop furniture enlarged its source pixels by 3 while the character used 2. Added a shared 2 CSS px grid: the landscape measures the hero, recalculates integer drawing coordinates and renders at exactly 2×. Partial cells overscan and are clipped by the hero. Furniture snaps shared path coordinates to the same density without changing its layout or attachment anchors.

- Refined clouds and tree shading, added smaller grass and flower details, and replaced broad hill/clearing corners with single-cell stepped contours. Palette, character artwork, crown, greeting, animation and furniture placement retain their previous direction.
- Preserved the chair's preceding four-logical-pixel left nudge: 8px mobile and 12px desktop, committed separately as `5056c82`.
- New regression checks were observed failing against the fixed landscape and desktop furniture density. They cover responsive resizing, odd viewport dimensions and matching sprite/furniture pixels with integer path coordinates.
- Fresh `npm test`: 8 files / 45 tests passed. `npm run typecheck`, `npm run build` and `git diff --check` passed.
- Production served beneath `/revamped-portfolio/` and inspected at 320, 390, 375, 768 and 1440px. Background, character and all three furniture drawings measured exactly 2 CSS px per native pixel. The 375×843 viewport retained integer pixels with clipped overscan. No horizontal document overflow; Pixelify and all five cards loaded.
- Direct 1280px production check confirmed the same density and no browser errors. Proof: ignored `.verification/environment-matched-production.jpg`. Responsive harness: `.verification/environment-layouts.html`, excluded from production.
- Final independent read-only review found no material issue with ResizeObserver cleanup, integer path snapping, fixed 2× rendering, odd-dimension clipping or the preserved chair offset.

## Orbit momentum and coherent furniture

User reported reversed rotation, wanted speed from a swipe, and showed the table rail crossing the thighs. Earlier furniture alignment did not resolve that composition. The tabletop and laptop also used opposing perspective directions, while the chair was still stretched from its old 80px grid.

- Corrected horizontal orbit direction. Front cards follow the drag and arrow direction; grabbing a rear card fixes input direction to its starting side of the ring.
- Release retains the final angle, including a skipped final move or release outside the crown. Velocity comes from the last 100ms of input, is capped at 6 radians/second, and decays with 650ms exponential friction toward the signed 24-second orbit. A flick under the pointer eases to rest; a new press, focus/hover entry, explicit pause and reduced motion clear momentum.
- Regressions were observed failing for mirrored front movement, absent inertia, ignored up coordinates, held-press velocity sampling, and bubbled child capture loss. They pass after correction. Card-to-root implicit touch capture transfer no longer ends the drag; losing the root's own capture still cancels it.
- Pointer-managed card presses suppress compatibility mouse focus, while buttons retain native focus/activation. Vertical panning remains controlled by `touch-action: pan-y`, as specified by [W3C Pointer Events](https://www.w3.org/TR/pointerevents3/#declaring-direct-manipulation-behavior). Touch threshold, vertical gesture classification, tap pause, capture transfer and reduced motion are covered by behavior tests.
- Rebuilt chair, desk and laptop on the same 120px grid and matching perspective. The chair supports the hips around y=88; keyboard meets the hand anchor at (83,74); screen, hinge and keyboard remain connected. All furniture sits behind the complete character frame, so the tabletop rail cannot cross the thighs.
- Fresh `npm test`: 7 files / 40 tests passed. `npm run typecheck`, `npm run build` and `git diff --check` passed. Independent read-only review found the capture-transfer issue; it was fixed, and final review reported no material findings.
- Latest production output served with `vite preview --base /revamped-portfolio/`. Browser inspection at 320, 390, 768 and 1440px confirmed no horizontal document overflow, fitting card contents, Pixelify typography and exact 2× canvas enlargement (120→240px mobile; 180→360px desktop). Furniture and hand contact inspected at each width.
- Direct production-page browser checks confirmed flick continuation after release, suppressed pointer focus, pause holding the same angle, right arrow moving the front card right, left button restoring the previous angle, resume and greeting replay. Direct production browser error log was empty. Mobile touch behavior is covered by the synthetic pointer tests above; responsive screenshots use actual nested browser viewports.
- Current captures in ignored `.verification/`: `momentum-layouts-production.jpg`, `momentum-furniture-production.jpg`, `momentum-furniture-mobile.jpg`. No character artwork, source photos, external services or deployment changed.

## Glass clipping correction

User supplied an intermittent blur spill below a card during interaction. Moved the backdrop filter from the moving article to a separate, rounded inner surface with explicit clipping and paint containment. The outer article retains its shadow, depth and focus outline; the non-blur fallback follows the inner surface. Browser checks at 320, 390 and 1440px confirmed all five surfaces remain within card bounds, with no visible spill during drag/release, keyboard rotation and focus changes. Existing 24 behavior tests and production build pass. Capture: `.verification/glass-clipping-fixed.jpg`.

## Complete sprite rebuild

The user requested a coherent replacement character and chose subtle motion. Replaced the atlas/expression-head assembly with original complete-frame artwork and a shared seated animation sheet. Removed the old overlay and pixel-deformation code. Both seated animation cycles last 1,000ms and share the exact neutral image at their start/end. Browser repaint timing advances the sprite. The development preview now supports individual frame inspection.

- Regression tests were observed failing against the earlier two-draw seated renderer, 720ms typing loop and delayed short-frame update. They pass against the rebuilt renderer and metadata.
- Fresh `npm test`: 7 files / 24 tests passed. Fresh `npm run typecheck` and `npm run build` passed. `git diff --check` passed.
- All six poses inspected in the real browser. Native canvas is 120×120; full-body character is about 100px tall. Whole-number enlargement and alpha transparency retained. Inspection captures: `.verification/typing-frame-0.jpg`, `typing-frame-2.jpg`, `speech-frame-1.jpg`, `sprite-portrait-rebuilt.jpg`.
- Latest production output served under `/revamped-portfolio/` and inspected at 320, 390, 768 and 1440px. No horizontal document overflow; all five card contents fit their cards. Canvas enlargement measured 240px wide on mobile and 360px wide on desktop. Sprite, relative assets and local font loaded successfully.
- Updated head/hand/foot anchors align the crown, keyboard and floor. New mouth anchor positions the greeting beside the face. Captures: `.verification/hero-sprite-rebuilt-mobile.jpg` and `hero-sprite-rebuilt-desktop.jpg`.
- Independent read-only review reported no Critical, Important or Minor code issues. Latest greeting anchor then verified in production preview.
- Artwork and exact generation prompt set recorded in `src/assets/character/ARTWORK.md`. Only original generated artwork is included; source photos remain outside Git.

## Finer sprite detail

User found the rebuilt character too pixelated. The source seated drawings were being reduced to 75px wide before 3× enlargement. Added optional `maxPixelSize` metadata and capped Manan's display pixels at 2px: desktop/preview now samples a 180×180 raster and enlarges it by exactly 2 to the existing 360×360 display. Mobile already uses 2px pixels, so its 240×240 display remains unchanged. Layout coordinates, anchors, source artwork, complete-frame animation and timing stay unchanged.

- Regression observed failing on the old 120px canvas, then passing at the finer resolution. It checks unchanged display size, integer enlargement, shared foot-edge registration through a speaking pose, disabled smoothing and redraw after a responsive scale change.
- Fresh `npm test`: 7 files / 26 tests passed. `npm run typecheck`, `npm run build` and `git diff --check` passed.
- Browser inspected finer typing in-betweens, speech, portrait, standing and thumbs-up. Neutral artwork is shared with seated idle. Source anatomy remains continuous; finer sampling retains more hair, glasses, hands and shoe detail.
- Live mobile hero inspected at 419px; production hero inspected at 1280px. Canvas/display measurements were 120/240px on mobile and 180/360px in production. No horizontal document overflow or production console errors. Desk, greeting and crown retain their placement.
- Proof captures: `.verification/sprite-finer-detail.jpg`, `.verification/sprite-finer-detail-crop.jpg`, `.verification/hero-finer-detail.jpg`.
- Independent review found native fractional target coordinates were being rounded. Preserved exact target coordinates whenever sampling density is unchanged; a second regression was observed failing before this correction, then passing. Definitions without the detail option retain their original placement and proportions.

## Desk and laptop alignment

User supplied a hero screenshot and clarified the issue was desk/laptop alignment. The older furniture used an 80px source grid stretched into the 120px character grid; its disconnected laptop hinge, floating cup and rear-layer table apron no longer fitted the rebuilt pose. Replaced only the desk/laptop artwork with `DeskFurniture`, drawn directly on the shared 120px logical grid. Keyboard contact is at the hand anchor `(83, 74)`, screen/hinge/base overlap, cup rests on the tabletop, legs reach floor `y=114`, and the apron renders ahead of the lap at `y=83–86`, below the hands.

- Fresh `npm test`: 7 files / 26 tests passed. `npm run typecheck` and `npm run build` passed. Existing speech, typing, pose, movement and crown checks remain green.
- Real browser inspected the hero at 320, 390, 768 and 1440px using fixed-size nested viewports after the app's resizing control stalled. Browser reported the exact requested inner dimensions, correct 240/360px character displays, foreground apron depth above the sprite, and no horizontal document overflow.
- Visual checks confirmed keyboard contact, connected laptop, cup placement and table/leg depth through typing and seated rest. Independent read-only review found no material issues.
- Proof: `.verification/desk-layouts-verified.jpg` and `.verification/desk-alignment-fixed.jpg`. Temporary viewport harness remains in ignored `.verification/` and is excluded from production.
- Latest production build inspected at 1280px: correct foreground apron and 360px character display, connected laptop and no horizontal overflow. Capture: `.verification/desk-alignment-production.jpg`.
