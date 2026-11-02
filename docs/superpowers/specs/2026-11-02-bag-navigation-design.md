# Bag Navigation — Design

**Status:** Draft for approval

**Scope:** One reusable navigation component added to the existing hero.

## Intent

Add a Pokémon-style **Bag** as the portfolio’s navigation menu. For now it contains only the Pokédex, which remains the contact hub. The Bag can grow to hold future portfolio destinations such as Projects and About without adding those destinations now.

## Goals

- Add a persistent top-left control with a pixel-art bag icon and the lowercase label `bag`.
- Open a compact item-list panel directly below that control, over the visible hero.
- Show only one item: `pokedex`.
- Selecting Pokédex replaces the Bag panel with the Pokédex overlay. Closing the Pokédex returns to Bag; closing Bag returns to the hero.
- Reveal Bag with a short pixelated animation in place and play a subtle menu blip distinct from the Pokédex’s device sounds.
- Pause roaming Pokémon whenever Bag or Pokédex is open, then resume their motion when the visitor returns to the hero.
- Keep navigation content data-driven so future items can be added without routing or a redesign.

## Non-goals

- Add Projects, About, or placeholder menu entries now.
- Add routes, a backend, an audio dependency, or external audio files.
- Change the approved Pokédex sprite artwork or the existing hero composition.
- Invent a resume URL, LinkedIn URL, email address, or phone number. The approved contact labels remain placeholders until the user supplies real destinations.

## Current constraints

The site is React, Vite, and TypeScript. `App` renders `EntryGate` around `Hero`; the gate prepares the hero behind the loader and keeps that scene inert until the visitor enters. `Hero` already controls the `active` prop passed to `PokemonHabitat`, which can pause Pokémon during menu use. The Pokédex sprite sheet and frame metadata already exist at `src/assets/pokedex/`; screen cutouts are transparent so portrait and contact content can remain live DOM. Manan's approved portrait clip is already in `manan-poses.png` and can render through `CharacterSprite`. `preloadHeroAssets` already waits for the character sheet and decoded hero images, so the Pokédex sheet must join that preload before Enter is enabled to avoid a post-entry flash.

## Approaches

1. **Reusable Bag component inside Hero — selected.** Keep navigation state with the only current scene, reuse the entry gate’s activation boundary, and pass menu-open state to `PokemonHabitat`. A data-driven item list supports future destinations without adding routes.
2. **App-level navigation shell with routes.** This is better suited to several distinct pages, but the site currently has only one hero and one overlay destination. It adds route and shell state before those pages exist.

## Interaction and presentation

- Bag flow: `closed → bag → pokedex → bag → closed`.
- The Bag button toggles the panel. A visible close control, Escape, and outside click also dismiss Bag. Escape from Pokédex returns to Bag; its visible close control does the same.
- Bag is a non-modal navigation popover anchored below its trigger. Pokédex is a dialog overlay. Focus returns to the Bag item when Pokédex closes. Escape or the Bag close control returns focus to the Bag trigger; an outside click leaves focus on the clicked target.
- Use the existing Pokédex frame order and open/close sequences from `pokedex-spritesheet.json`. Render the portrait using `CharacterSprite`'s `portrait` clip, and render contact text above the transparent screen areas as live content.
- Keep the panel within mobile safe areas; item and close controls have touch targets of at least 44 CSS pixels. The Bag control exposes an accessible name and expanded state; keyboard operation does not depend on hover.
- Respect reduced motion by showing the settled panel/device state without pixel animation. Decorative art stays out of the accessibility tree.

## Builder calls

- Draw the Bag icon as a small inline pixel-style backpack with a Poké Ball clasp, so it stays crisp at whole-pixel sizes without another raster asset.
- Use a pale item-list panel with the site’s dark pixel outline and one Pokédex row with a small closed-device preview.
- Represent the Pokédex overlay as an accessible modal dialog; keep Bag itself as a non-modal navigation popover.
- Synthesize the short Bag blip locally with Web Audio after an explicit user action; skip it gracefully if audio is unavailable. Keep the already designed Pokédex open/close cues separate.
- Keep real contact destinations out of this milestone until supplied; retain the approved preview labels in the screen meanwhile.

## Acceptance criteria

- Bag is unavailable before Enter and appears after entry in the top-left safe area.
- The Pokédex sprite sheet is decoded before Enter becomes available, so opening the menu does not reveal assets still loading.
- Opening Bag reveals one Pokédex item; choosing it opens the approved device animation and closing it returns to Bag.
- Bag closes through the toggle, close control, Escape, and outside click; focus returns sensibly after closing.
- Pokémon pause for both overlays and resume afterward; reduced-motion settings suppress the pixel reveal.
- Bag open and close produce the subtle menu blip; missing browser audio support does not block navigation.
- Inspect at 320, 390, 768, and 1440px widths for overflow, readable controls, and the anchored panel’s fit.

**Next step:** approve or revise this design. Product code and the implementation plan follow approval.
