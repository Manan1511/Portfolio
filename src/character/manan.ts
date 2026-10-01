import atlas from '../assets/manan-atlas.png';
import talking from '../assets/manan-talking.png';
import type { SpriteDefinition, SpriteFrame } from './animation';

// Source bounds are authored against the atlas; target bounds register each pose
// on a 120px canvas with a ~96px character (user requested more facial detail).
// Canvas sampling produces real pixels; source artwork remains unchanged.
const frame = (x: number, y: number, width: number, height: number, tx: number, ty: number, tw: number, th: number, duration: number): SpriteFrame => ({
  x, y, width, height, duration, target: { x: Math.round(tx * 1.5), y: Math.round(ty * 1.5), width: Math.round(tw * 1.5), height: Math.round(th * 1.5) },
});

const standing = frame(150, 35, 185, 432, 24, 12, 28, 64, 2800);
// Every seated state uses THIS body. Alternate artwork supplies only tiny
// registered hand/mouth layers, never another torso/head/leg silhouette.
const typingA = frame(131, 514, 242, 364, 23, 20, 36, 56, 180);
const typingB: SpriteFrame = { ...typingA, layers: [{
  x: 653, y: 696, width: 145, height: 69,
  target: { x: 55, y: 72, width: 33, height: 16 }, replace: true,
}] };
const seated: SpriteFrame = { ...typingA, duration: 1000 };

export const manan: SpriteDefinition = {
  image: atlas, width: 120, height: 120,
  anchors: { head: { x: 56, y: 41 }, feet: { x: 62, y: 114 }, hands: { x: 81, y: 71 } },
  clips: {
    'standing-idle': { loop: true, anchors: { head: { x: 56, y: 32 } }, frames: [standing, frame(1441, 480, 187, 406, 24, 12, 28, 64, 140)] },
    'seated-idle': { loop: true, frames: [seated] },
    portrait: { loop: true, anchors: { head: { x: 60, y: 45 } }, frames: [frame(937, 72, 329, 388, 12, 8, 56, 66, 1000)] },
    'thumbs-up': { loop: false, anchors: { head: { x: 56, y: 32 } }, frames: [frame(1441, 34, 235, 434, 24, 12, 35, 64, 1000)] },
    typing: { loop: true, frames: [typingA, typingB] },
    talking: { loop: true, frames: [
      { ...typingA, duration: 160, layers: [{ image: talking,
        x: 610, y: 373, width: 46, height: 22,
        target: { x: 60, y: 64, width: 6, height: 3 }, replace: true,
      }] },
      { ...typingA, duration: 120 },
    ] },
  },
};
