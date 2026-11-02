# Pokédex sprite sheet

`pokedex-spritesheet.svg` is a 3×3 sprite sheet with 256×192 frame cells. `pokedex-spritesheet.png` is the crisp 2× export, with 512×384 pixel frames. The screen interiors are intentionally transparent so the portrait and contact entry can render as live page content.

Frame order and the opening/closing sequence are in `pokedex-spritesheet.json`. Frames 0–3 open the device; the same poses run in reverse to close it. The remaining frames show the neutral device and pressed states for previous, next, select, close, and the D-pad.

The artwork uses crisp pixel blocks, a solid one-piece blue D-pad, and the blue circular lens. It contains no portrait, contact text, or background.
