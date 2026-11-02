# Bag and Pokédex Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small Pokémon-style Bag menu to the hero, with a single Pokédex item that opens the existing approved contact-device artwork as an accessible, animated contact dialog.

**Architecture:** `Hero` owns the `closed | bag | pokedex` view state and disables the Pokémon habitat while either overlay is open. `BagNavigation` renders the anchored popover and hosts `PokedexDialog`; focused helpers own sprite-sheet frame mapping, contact-entry data, and synthesized sound. The Pokédex PNG joins the entry preloader so its first display is already decoded.

**Tech Stack:** React 19, strict TypeScript, Vite asset imports, CSS, Web Audio API, Vitest and Testing Library already in the repository. Add no dependencies.

**Spec:** `docs/superpowers/specs/2026-11-02-bag-navigation-design.md`

## Global Constraints

- The flow is exactly `closed → bag → pokedex → bag → closed`.
- The Bag contains one lowercase `pokedex` entry; do not add Projects, About, routes, or placeholder destinations.
- Keep the existing hero, character artwork, Pokédex sprite artwork, and scene composition intact.
- Use sprite-sheet open frames `[0, 1, 2, 3]`, close frames `[3, 2, 1, 0]`, and pressed frames 4–8 as defined in `src/assets/pokedex/pokedex-spritesheet.json`.
- Pokédex entries appear in this order and lowercase: `resume`, `linkedin`, `email`, `phone`. Do not invent contact values or external URLs; selection stays local until Manan supplies them.
- Add the Pokédex sheet to `preloadHeroAssets`; Enter must not reveal an undecoded device image.
- Bag remains a non-modal popover; Pokédex uses a modal dialog. Preserve keyboard operation, visible focus, sensible focus return, and touch targets of at least 44 CSS pixels.
- Pause roaming Pokémon while either menu view is open. Resume their existing clock and position when the hero returns.
- Reduced motion skips the Bag pixel reveal and shows the Pokédex in its settled frame without opening/closing animation.
- Check 320, 390, 768, and 1440 CSS-pixel viewport widths. Keep the panel within safe areas and prevent horizontal overflow.
- Use only local Vite asset imports. Synthesize menu and device sounds with Web Audio after user input; unavailable audio must not block navigation.

## Review Focus

- **Web Audio unavailable or suspended:** opening, closing, selection, and navigation still work without an uncaught error. Pin fallback behavior in Task 1's audio helper test.
- **Fast repeated view changes:** no stale timers, stuck pressed frame, or dialog that stays open after its close animation. Pin timer cleanup and the state transition in the dialog tests.
- **Escape, outside click, and focus restoration:** Bag outside-click preserves focus on the clicked control; Escape/close returns focus to Bag; closing Pokédex restores focus to its Bag row. Pin each path in Bag navigation tests.
- **Reduced-motion preference:** Bag is already fully visible and the device is settled immediately, while controls remain usable. Pin both states in component tests.
- **Narrow viewport / safe areas:** the dialog and popover stay on-screen at 320px, controls retain 44px targets, and page content does not scroll horizontally. Pin geometry and control sizing in the responsive browser review.

---

## File Map

- Create `src/navigation/pokedexFrames.ts` for typed frame indices, frame coordinates, and the approved open/close sequences.
- Create `src/navigation/menuAudio.ts` for guarded, lazily initialized menu and Pokédex sound cues.
- Create `src/navigation/contactEntries.ts` for the four ordered, lowercase contact-entry labels and sample descriptions; keep destination fields absent until supplied.
- Create `src/navigation/PokedexDialog.tsx` for the modal device, sprite frames, portrait and live screen layers, keyboard/touch controls, and entry transitions.
- Create `src/navigation/BagNavigation.tsx` for the top-left control, compact item-list popover, state transitions, dismissal behavior, and focus handling.
- Modify `src/loading/siteAssets.ts` to decode the Pokédex image before Enter is available.
- Modify `src/hero/Hero.tsx` to own the navigation state and pause habitat motion while a menu is open.
- Modify `src/styles.css` for the Bag, popover, responsive device, screen overlays, controls, and reduced-motion rules.
- Add focused tests under `src/navigation/` and extend `src/hero/Hero.test.tsx` for integration behavior.

The repository currently contains the approved Pokédex artwork and frame metadata, but no Pokédex React UI. This plan therefore builds the minimal already-approved device interaction from that artwork; it does not redesign the sprite sheet.

---

### Task 1: Define Pokédex frames and preload the device artwork

**Files:**
- Create: `src/navigation/pokedexFrames.ts`
- Test: `src/navigation/pokedexFrames.test.ts`
- Create: `src/navigation/menuAudio.ts`
- Test: `src/navigation/menuAudio.test.ts`
- Modify: `src/loading/siteAssets.ts`

**Interfaces:**
- Produce `type PokedexFrameIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8`.
- Produce `pokedexOpenSequence: readonly PokedexFrameIndex[]` with `[0, 1, 2, 3]` and `pokedexCloseSequence` with `[3, 2, 1, 0]`.
- Produce `pokedexFramePosition(index: PokedexFrameIndex): { column: 0 | 1 | 2; row: 0 | 1 | 2 }`, mapping the row-major 3×3 sheet.
- Produce a local `pokedexSpriteSheet` URL import for both the frame renderer and preloader.
- Produce `playMenuCue(kind: 'bag-open' | 'bag-close' | 'device-open' | 'device-close' | 'select'): void`; initialize or resume one shared AudioContext only after a user action, and return safely when Web Audio is unavailable.

- [ ] **Step 1: Add frame-map tests** for all nine row-major frame coordinates and exact open/close order; add audio tests for missing and rejected AudioContext support.
- [ ] **Step 2: Run the focused tests** with `npm run test -- src/navigation/pokedexFrames.test.ts src/navigation/menuAudio.test.ts`; verify they fail before the helpers exist.
- [ ] **Step 3: Implement the typed frame helper and audio helper.** Use the sheet's 3 columns, 3 rows, and approved frame indices. Keep the oscillator/gain envelope short and distinct by cue; catch unsupported or rejected context operations.
- [ ] **Step 4: Add the PNG to `heroImages`** in `src/loading/siteAssets.ts`; retain `loadSpriteImage` so preloading waits for decode before the gate enters `ready`.
- [ ] **Step 5: Run the focused tests and typecheck** with `npm run test -- src/navigation/pokedexFrames.test.ts src/navigation/menuAudio.test.ts` and `npm run typecheck`.
- [ ] **Step 6: Commit** as `feat: preload pokedex navigation art`.

### Task 2: Build the animated Pokédex contact dialog

**Files:**
- Create: `src/navigation/contactEntries.ts`
- Create: `src/navigation/PokedexDialog.tsx`
- Test: `src/navigation/PokedexDialog.test.tsx`
- Test: `src/navigation/contactEntries.test.ts`
- Modify: `src/styles.css`

**Interfaces:**
- `ContactEntry` contains `id`, `label`, `eyebrow`, `title`, and `description`; it has no destination URL until real values are provided.
- Export `contactEntries` in the order `resume`, `linkedin`, `email`, `phone`. Preserve the existing sample resume copy `open trainer profile`; use short sample copy for the remaining entries without fabricating contact data.
- `PokedexDialog` accepts `{ onClose: () => void }` and owns its current entry, opening/closing frame, pressed-control frame, and selection feedback.
- Render the sheet from `pokedexSpriteSheet` with pixelated image rendering. Render Manan's portrait using `CharacterSprite` with `clip="portrait"` on the left screen and the active contact entry as live DOM on the right screen, over the transparent cutouts.

- [ ] **Step 1: Add entry-model tests** for exact four-entry order, lowercase labels, and absent real destinations.
- [ ] **Step 2: Add dialog behavior tests** for open/close frame order, previous/next wraparound, select feedback without external navigation, and Escape returning through `onClose`.
- [ ] **Step 3: Run focused tests** with `npm run test -- src/navigation/contactEntries.test.ts src/navigation/PokedexDialog.test.tsx`; confirm missing implementation fails.
- [ ] **Step 4: Implement the contact data and modal dialog.** Use a native `<dialog>` opened with `showModal()`, label it with a visible lowercase heading, focus the close control on open, and route Escape through the close sequence.
- [ ] **Step 5: Add sprite-backed controls.** Previous, next, select, and close use the approved pressed frames 4–7. `ArrowLeft`/`ArrowRight` advance entries and briefly show frame 8 for D-pad input; do not draw extra arrow marks on the D-pad. Animate the four progress bars horizontally with the entry change.
- [ ] **Step 6: Play distinct device open/close/select cues** through `playMenuCue` from Task 1; audio failure must not interrupt the frame or entry state.
- [ ] **Step 7: Style the device and live layers** so the 4:3 sheet stays crisp, text remains legible, overlays align with the screen cutouts, buttons have 44px hit areas, and mobile safe areas are respected.
- [ ] **Step 8: Run the focused tests and typecheck**; manually inspect the settled and animated frames at 320px and desktop width.
- [ ] **Step 9: Commit** as `feat: add animated pokedex contact dialog`.

### Task 3: Create the Bag popover

**Files:**
- Create: `src/navigation/BagNavigation.tsx`
- Test: `src/navigation/BagNavigation.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Export `type NavigationView = 'closed' | 'bag' | 'pokedex'` from `src/navigation/BagNavigation.tsx` (or a small colocated `types.ts` if shared imports need to avoid a component dependency).
- `BagNavigation` accepts `{ view: NavigationView; onViewChange: (view: NavigationView) => void; active: boolean }`.
- Keep the items in a typed `bagItems` array; its only current value is `{ id: 'pokedex', label: 'pokedex', target: 'pokedex' }`. Render rows from this array instead of hard-coding the row into panel markup.
- When `view === 'pokedex'`, `BagNavigation` renders `PokedexDialog` in place of the Bag popover; after the dialog's closing sequence calls `onClose`, switch to `bag` and restore focus to the Pokédex row.
- Consume `playMenuCue` from Task 1 for Bag open/close. Task 2's device calls remain distinct cues from the same helper.

- [ ] **Step 1: Add Bag tests** for the closed/open toggle, the single Pokédex row, close button, Escape, outside click, and correct focus restoration.
- [ ] **Step 2: Run focused tests** with `npm run test -- src/navigation/BagNavigation.test.tsx`; confirm missing behavior fails.
- [ ] **Step 3: Implement the reusable Bag popover.** Draw the small backpack with an inline crisp-edge SVG and Poké Ball clasp; use the lowercase `bag` button label, `aria-expanded`, `aria-controls`, and a `nav` popover containing only the `pokedex` row and visible close control.
- [ ] **Step 4: Implement dismiss and focus behavior.** Toggle with the Bag button; close on its close control, Escape, or outside pointer event; do not close on clicks inside. Keep the Bag button as the popover's focus-return target and the item row as the Pokédex close-return target.
- [ ] **Step 5: Render `PokedexDialog` in place of the Bag popover** when the controlled view is `pokedex`; the dialog's completed closing sequence changes the view back to `bag`.
- [ ] **Step 6: Add the deterministic pixel-tile reveal** to the popover; disable it under reduced motion. The mask must not intercept pointer or keyboard input and must finish independently of hover.
- [ ] **Step 7: Call the separate Bag open/close cues** from `playMenuCue`; keep the device open/close/select cues assigned to the Pokédex component.
- [ ] **Step 8: Run focused tests and typecheck**; manually check keyboard-only operation and focus-visible styling.
- [ ] **Step 9: Commit** as `feat: add pokemon bag navigation`.

### Task 4: Integrate navigation state with the hero and verify responsive behavior

**Files:**
- Modify: `src/hero/Hero.tsx`
- Test: `src/hero/Hero.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- `Hero` owns `NavigationView`, initialized to `closed`, and passes it to `BagNavigation`.
- Set `PokemonHabitat` active only when the entry scene is active and `NavigationView` is `closed`.
- Render the Bag control only while `EntrySceneActiveContext` is active; the hidden preloaded scene must not expose the control before Enter.

- [ ] **Step 1: Extend Hero tests** to confirm the Bag is unavailable before Enter, appears after Enter, and habitat motion pauses in both `bag` and `pokedex` states then resumes on `closed`.
- [ ] **Step 2: Wire `BagNavigation` into `Hero`** and derive the existing `PokemonHabitat.active` value from the entry context and menu state; do not add another animation clock.
- [ ] **Step 3: Add integration checks** that Bag → Pokédex replaces the panel, close returns to Bag, and closing Bag returns to the hero with the same Pokémon positions.
- [ ] **Step 4: Run relevant tests, `npm run typecheck`, and `npm run build`.**
- [ ] **Step 5: Inspect the production preview** at 320, 390, 768, and 1440px. Check pixel reveal/reduced-motion, portrait and screen alignment, 44px hit targets, safe areas, no horizontal overflow, focus flow, and missing-audio fallback. Confirm the Pokédex image was already decoded before Enter.
- [ ] **Step 6: Commit** as `feat: integrate bag navigation into hero`.

## Self-Review

- **Spec coverage:** Bag placement, single item, pixel reveal, audio, dismissal, focus, modal/device flow, portrait, four contact entries, hero pause/resume, reduced motion, preloading, and four requested viewport widths each map to a task.
- **Step scan:** Each implementation step names one behavior, file boundary, or verification action; the public state and sound signatures are declared before use.
- **Type consistency:** `NavigationView`, `ContactEntry`, `PokedexFrameIndex`, and `playMenuCue` are defined once and reused by their consumers.
- **Review focus:** Audio fallback, repeated transitions, dismiss/focus paths, reduced motion, and narrow safe-area layout each have a corresponding verification step.
- **Proportion:** Four tasks separate artwork readiness, the Pokédex component, the Bag component, and hero integration without introducing routes or unrelated portfolio sections.

**Execution handoff:** The repository currently has no explicit execution method for this feature. Review this plan and choose native implementation in this session or subagent-driven implementation before product-code changes begin.
