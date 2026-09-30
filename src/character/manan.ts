import atlas from '../assets/manan-atlas.png';
import type { SpriteDefinition, SpriteFrame } from './animation';

// Source bounds are authored against the atlas; target bounds register each pose
// on an 80px canvas with a ~64px character. Canvas sampling produces real pixels.
const frame = (x: number, y: number, width: number, height: number, tx: number, ty: number, tw: number, th: number, duration: number): SpriteFrame => ({
  x, y, width, height, duration, target: { x: tx, y: ty, width: tw, height: th },
});

const standing = frame(150, 35, 185, 432, 24, 12, 28, 64, 2800);
const seated = frame(563, 72, 245, 396, 23, 20, 36, 56, 2800);
const seatedBlink = frame(1003, 510, 248, 376, 23, 20, 36, 56, 160);
const typingA = frame(126, 510, 255, 376, 23, 20, 36, 56, 180);
const typingB = frame(560, 510, 251, 376, 23, 20, 36, 56, 180);

export const manan: SpriteDefinition = {
  image: atlas, width: 80, height: 80,
  anchors: { head: { x: 37, y: 27 }, feet: { x: 41, y: 76 }, hands: { x: 54, y: 47 } },
  clips: {
    'standing-idle': { loop: true, anchors: { head: { x: 37, y: 21 } }, frames: [standing, frame(1441, 480, 187, 406, 24, 12, 28, 64, 140)] },
    'seated-idle': { loop: true, frames: [seated, seatedBlink] },
    portrait: { loop: true, anchors: { head: { x: 40, y: 30 } }, frames: [frame(937, 72, 329, 388, 12, 8, 56, 66, 1000)] },
    'thumbs-up': { loop: false, anchors: { head: { x: 37, y: 21 } }, frames: [frame(1441, 34, 235, 434, 24, 12, 35, 64, 1000)] },
    typing: { loop: true, frames: [typingA, typingB] },
  },
};
