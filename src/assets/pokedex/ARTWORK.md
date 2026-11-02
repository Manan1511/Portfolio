# Pokédex sprite sheet

`pokedex-approved-original.png` preserves the exact 1536×1024 transparent sprite sheet Manan approved. `pokedex-spritesheet.png` is the browser-ready 3×3 atlas derived from it: each original frame is cropped without resampling into a 512×341 cell, then translated by whole source pixels to keep the device centered and its bottom edge registered across animation and pressed states. No colors or sprite pixels are repainted.

Frame order and open/close sequences are recorded in `pokedex-spritesheet.json`. Frames 0–3 open the device, and the same poses play in reverse when closing. Frames 4–8 show the previous, next, select, close, and D-pad pressed states. Transparent screen interiors remain live page layers; `pokedexFrames.ts` records the frame-specific cutouts for the portrait and contact screens.

Render the atlas with `image-rendering: pixelated`. The device component uses the 512:341 frame aspect ratio so the source art keeps its shape.
