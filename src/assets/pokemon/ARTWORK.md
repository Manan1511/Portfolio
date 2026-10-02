# Supplied Pokémon sheets

User-supplied custom sprite sheets, preserved without recolouring or redrawing.
Only exact background RGB `(199, 225, 209)` becomes transparent. Every RGB pixel
and sheet coordinate is retained. Original files remain outside the repository.

- Pikachu: `Custom _ Edited - Pokemon Generation 1 Customs - Pikachu & Raichu - #0025 Pikachu.png`, 512×254. Original SHA256: `0a193ef7076fc5e5e9e38e9876480e3d6f267e8e810a3ec0a111acc4d7c0d460`.
- Charizard: `Custom _ Edited - Pokemon Generation 1 Customs - Charmander, Charmeleon, & Charizard - #0006 Charizard.png`, 1102×587. Original SHA256: `57fa619706bed4e8f9071c6db76d27dec212015f4d373ec66049904514b8996c`.

Rebuild from the source folder with Python and Pillow:

```sh
python scripts/test_prepare_pokemon.py
python scripts/prepare_pokemon.py "path/to/source/folder"
```

Frames are mapped manually in `src/pokemon/definitions.ts`. Pikachu uses the
upper idle pose and six poses on the next row. Charizard uses the four tucked-leg
airborne frames on the third row, passing through the intermediate wing phases
in both directions. The standing/takeoff cell at the start of that row is excluded.
A whole fire pose from the next row provides exhale; wind-up and recovery use
airborne frames. Chest registration keeps the head and mouth stable. Tail
flames at the sheet's right edge provide the separate breath effect. Recolours,
spare body parts and unrelated actions are excluded. Source artist information
was not included with these files; these are supplied assets, not generated art.

Compact flame rectangles follow each complete connected silhouette and exclude
detached spark cells above it. The breath effect chooses cells that fit available
space, without resizing their native pixels. A stepped mask narrows only the
connection at the mouth; the distant flame tips retain their complete shape.
