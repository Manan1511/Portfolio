# Hero verification — 2026-10-01

- `npm test`: 8 files, 24 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed, relative asset paths in `dist/index.html`.
- Production hero inspected at 320, 390, 768 and 1440 CSS pixels wide. No horizontal document overflow or overflowing card content. Character enlargement uses whole-pixel multiples.
- Browser checked keyboard rotation, pause/resume, greeting replay, focused-card promotion and sprite poses. Unit behavior checks cover hover/focus, horizontal drag continuity, 8px tap/drag threshold, vertical swipe, delayed press, release outside the crown, and reduced motion.
- Static production copy served under `/revamped-portfolio/`: hero, sprite and self-hosted font loaded; browser reported no errors. Development pose preview is absent from production.
- Frozen speech frame inspected: raster lip expressions stay within authored lip bounds. Hair, glasses, jaw, neck and body share fixed artwork. Connected typing arm motion and hand-to-keyboard placement inspected.
- Independent code review completed. Outside-release orbit lock and covered keyboard-focused cards were fixed; the stale hand attachment anchor was corrected. No remaining Critical or Important finding.
- Local proof captures are in ignored `.verification/`: `hero-desktop.jpg`, `hero-mobile.jpg`, `sprite-fixed.jpg`. Reference photos remain outside the repository.

The milestone contains only the hero and reusable character. Walking clips, audio, additional sections, backend and publishing remain outside the approved scope.

## Glass clipping correction

User supplied an intermittent blur spill below a card during interaction. Moved the backdrop filter from the moving article to a separate, rounded inner surface with explicit clipping and paint containment. The outer article retains its shadow, depth and focus outline; the non-blur fallback follows the inner surface. Browser checks at 320, 390 and 1440px confirmed all five surfaces remain within card bounds, with no visible spill during drag/release, keyboard rotation and focus changes. Existing 24 behavior tests and production build pass. Capture: `.verification/glass-clipping-fixed.jpg`.
