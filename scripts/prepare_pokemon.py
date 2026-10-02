"""Pixel-preserving cleanup. Requires Pillow; not part of the web runtime."""
import argparse
import hashlib
from pathlib import Path
from PIL import Image

BACKGROUND = (199, 225, 209)


def remove_background(image):
    result = image.convert('RGBA')
    pixels = bytearray(result.tobytes())
    background = bytes(BACKGROUND)
    for offset in range(0, len(pixels), 4):
        if pixels[offset:offset + 3] == background:
            pixels[offset + 3] = 0
    return Image.frombytes('RGBA', result.size, bytes(pixels))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source_directory', type=Path)
    parser.add_argument('--output', type=Path, default=Path('src/assets/pokemon'))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for name, pattern in [('pikachu', '*#0025 Pikachu.png'), ('charizard', '*#0006 Charizard.png')]:
        matches = list(args.source_directory.glob(pattern))
        if len(matches) != 1:
            raise ValueError(f'Expected exactly one {name} source sheet, found {len(matches)}')
        source = matches[0]
        original = Image.open(source).convert('RGBA')
        result = remove_background(original)
        # Check every pixel: colours and coordinates survive cleanup exactly.
        raw, clean = original.tobytes(), result.tobytes()
        for offset in range(0, len(raw), 4):
            before, after = raw[offset:offset + 4], clean[offset:offset + 4]
            assert before[:3] == after[:3]
            assert after[3] == (0 if before[:3] == bytes(BACKGROUND) else before[3])
        result.save(args.output / f'{name}.png', optimize=True)
        print(f'{name}: {original.width}x{original.height}, source SHA256 {hashlib.sha256(source.read_bytes()).hexdigest()}')


if __name__ == '__main__':
    main()
