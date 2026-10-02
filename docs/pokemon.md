# Roaming Pokémon implementation

Approved scope: one ground Pikachu, one flying Charizard, bounded roaming with
idle stops, click/tap/keyboard fire breath, manual pause and reduced motion.
Original sheets receive exact colour background removal. Main hero, Manan,
furniture and greeting retain their existing composition.

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
