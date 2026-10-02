import importlib.util
import unittest
from pathlib import Path
from PIL import Image


class BackgroundCleanupTests(unittest.TestCase):
    def test_only_exact_background_becomes_transparent(self):
        path = Path(__file__).with_name('prepare_pokemon.py')
        self.assertTrue(path.exists(), 'Pixel-preserving sheet preparation is missing')
        spec = importlib.util.spec_from_file_location('prepare_pokemon', path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        image = Image.new('RGBA', (3, 2), (199, 225, 209, 255))
        image.putpixel((1, 0), (198, 225, 209, 255))
        image.putpixel((2, 1), (240, 100, 12, 255))
        original = image.tobytes()
        clean = module.remove_background(image)
        self.assertEqual(clean.size, image.size)
        self.assertEqual(image.tobytes(), original)
        for x, y in [(x, y) for y in range(image.height) for x in range(image.width)]:
            source, result = image.getpixel((x, y)), clean.getpixel((x, y))
            self.assertEqual(source[:3], result[:3])
            self.assertEqual(result[3], 0 if source[:3] == (199, 225, 209) else source[3])


if __name__ == '__main__':
    unittest.main()
