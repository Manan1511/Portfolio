# Hero verification — 2026-10-01

- `npm test`: 7 files, 24 tests passed after the complete character rebuild.
- `npm run typecheck`: passed.
- `npm run build`: passed, relative asset paths in `dist/index.html`.
- Production hero inspected at 320, 390, 768 and 1440 CSS pixels wide. No horizontal document overflow or overflowing card content. Character enlargement uses whole-pixel multiples.
- Browser checked keyboard rotation, pause/resume, greeting replay, focused-card promotion and sprite poses. Unit behavior checks cover hover/focus, horizontal drag continuity, 8px tap/drag threshold, vertical swipe, delayed press, release outside the crown, and reduced motion.
- Static production copy served under `/revamped-portfolio/`: hero, sprite and self-hosted font loaded; browser reported no errors. Development pose preview is absent from production.
- Complete typing and speech frames inspected individually. Connected anatomy, neutral loop endpoints, whole-frame registration, hand-to-keyboard placement and mouth-anchored greeting inspected.
- Independent code review completed. Outside-release orbit lock and covered keyboard-focused cards were fixed; the stale hand attachment anchor was corrected. No remaining Critical or Important finding.
- Local proof captures are in ignored `.verification/`: `hero-desktop.jpg`, `hero-mobile.jpg`, `sprite-fixed.jpg`. Reference photos remain outside the repository.

The milestone contains only the hero and reusable character. Walking clips, audio, additional sections, backend and publishing remain outside the approved scope.

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
