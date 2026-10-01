import atlas from '../assets/manan-atlas.png';
import expressions from '../assets/manan-expressions.png';
import type { SpriteDefinition, SpriteFrame } from './animation';
import type { PixelPatch } from './pixels';

// Source bounds are authored against the atlas; target bounds register each pose
// on a 120px canvas with a ~96px character (user requested more facial detail).
// Canvas sampling produces real pixels; source artwork remains unchanged.
const frame = (x: number, y: number, width: number, height: number, tx: number, ty: number, tw: number, th: number, duration: number): SpriteFrame => ({
  x, y, width, height, duration, target: { x: Math.round(tx * 1.5), y: Math.round(ty * 1.5), width: Math.round(tw * 1.5), height: Math.round(th * 1.5) },
});

const standing = frame(150, 35, 185, 432, 24, 12, 28, 64, 2800);
// Every seated state shares one body and the same registered expression head.
const typingA = frame(131, 514, 242, 364, 23, 20, 36, 56, 180);
const armMotion = (amount: number): PixelPatch[] => [{ type: 'arm', rect: { x: 45, y: 76, width: 39, height: 15 }, pivotX: 54, amount }];
const expression = (x: number) => ({ image: expressions, x, y: 85, width: 567, height: 639,
  target: { x: 35, y: 30, width: 40, height: 48 }, replace: true });
const closed = expression(116);
// Sample the artist-drawn expression at identical scale/registration. Keep
// hair, glasses, jaw and neck perfectly still despite incidental atlas noise.
const speaking = { ...expression(735), clip: { x: 56, y: 64, width: 8, height: 3 } };
const seated: SpriteFrame = { ...typingA, layers: [closed], duration: 1000 };

export const manan: SpriteDefinition = {
  image: atlas, width: 120, height: 120,
  anchors: { head: { x: 56, y: 41 }, feet: { x: 62, y: 114 }, hands: { x: 79, y: 81 } },
  clips: {
    'standing-idle': { loop: true, anchors: { head: { x: 56, y: 32 } }, frames: [standing, frame(1441, 480, 187, 406, 24, 12, 28, 64, 140)] },
    'seated-idle': { loop: true, frames: [seated] },
    portrait: { loop: true, anchors: { head: { x: 60, y: 45 } }, frames: [frame(937, 72, 329, 388, 12, 8, 56, 66, 1000)] },
    'thumbs-up': { loop: false, anchors: { head: { x: 56, y: 32 } }, frames: [frame(1441, 34, 235, 434, 24, 12, 35, 64, 1000)] },
    typing: { loop: true, frames: [
      { ...seated, duration: 100 },
      { ...seated, duration: 100, pixels: armMotion(1) },
      { ...seated, duration: 100, pixels: armMotion(2) },
      { ...seated, duration: 100, pixels: armMotion(1) },
      { ...seated, duration: 120 },
      { ...seated, duration: 100, pixels: armMotion(-1) },
      { ...seated, duration: 100 },
    ] },
    talking: { loop: true, frames: [
      { ...seated, duration: 160 },
      { ...seated, duration: 220, layers: [closed, speaking] },
      { ...seated, duration: 180 },
      { ...seated, duration: 160, layers: [closed, speaking] },
      { ...seated, duration: 280 },
    ] },
  },
};
