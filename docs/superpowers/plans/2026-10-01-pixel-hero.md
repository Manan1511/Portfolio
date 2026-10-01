# Pixel hero implementation plan

Goal: ship approved hero and reusable five-pose character library.
Spec: ../specs/2026-10-01-pixel-hero-design.md
Execution: inline, component by component.

## Task 1: Foundation
- [x] Initialize main, React/Vite/TypeScript, tests and relative asset build.
- [x] Record approved design and plan; verify typecheck/build; commit.

## Task 2: Character
- [x] Generate transparent consistent pose atlas from reference photos.
- [x] Test frame durations, pause, one-shot completion, clip switching and custom clips before implementation.
- [x] Implement typed sprite definition, renderer and independent movement wrapper.
- [x] Create dev-only preview for all five poses and movement examples.
- [x] Verify art and behavior; commit.

## Task 3: Desk scene
- [x] Test typing/rest cycle and reduced motion.
- [x] Compose separate furniture and laptop around registered character anchors.
- [x] Verify alignment and animation; commit.

## Task 4: Crown and hero
- [x] Test orbit geometry, interaction threshold, continuous drag angle, paused states and keyboard/manual controls.
- [x] Compose landscape and hero; accessible crown and reduced motion.
- [x] Verify 320/390/768/1440 widths, keyboard/touch controls, production assets under repository subpath.
- [x] Complete final code review, typecheck/test/build, local commit.

## Review focus
Pause states combine correctly; blur fallback stays legible; source photos never enter Git; custom clips preserve anchors; touch drag never blocks vertical scroll.
