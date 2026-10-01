import poses from '../assets/character/manan-poses.png';
import seatedSheet from '../assets/character/manan-seated.png';
import type { SpriteDefinition, SpriteFrame } from './animation';

// Each source rectangle contains a complete, coherently drawn character.
// Register whole frames by hair center and foot baseline; never replace or
// deform individual body parts. All target coordinates are native pixels.
const seated = (x: number, y: number, lowerRow = false): SpriteFrame => ({
  image: seatedSheet, x, y, width: 330, height: lowerRow ? 435 : 442, duration: 83,
  target: { x: 28, y: lowerRow ? 14 : 13, width: 75, height: lowerRow ? 100 : 101 },
});
const typeFrames = [
  seated(88, 6), seated(524, 6), seated(967, 6), seated(1411, 6),
];
const speakFrames = [
  seated(88, 452, true), seated(525, 452, true),
  seated(968, 452, true), seated(1412, 452, true),
];
const neutral = typeFrames[0];
const timed = (frame: SpriteFrame, duration = 83): SpriteFrame => ({ ...frame, duration });
const pose = (x: number, y: number, width: number, height: number, target: NonNullable<SpriteFrame['target']>, duration: number): SpriteFrame => ({
  image: poses, x, y, width, height, target, duration,
});
const standingTarget = { x: 38, y: 13, width: 39, height: 101 };

export const manan: SpriteDefinition = {
  image: poses, width: 120, height: 120,
  anchors: { head: { x: 56, y: 30 }, mouth: { x: 62, y: 40 }, feet: { x: 80, y: 114 }, hands: { x: 83, y: 74 } },
  clips: {
    'standing-idle': { loop: true, anchors: { head: { x: 61, y: 27 } }, frames: [
      pose(237, 8, 235, 614, standingTarget, 2860),
      pose(760, 8, 235, 614, standingTarget, 140),
    ] },
    'seated-idle': { loop: true, frames: [timed(neutral, 1000)] },
    portrait: { loop: true, anchors: { head: { x: 68, y: 40 } }, frames: [
      pose(638, 646, 490, 594, { x: 19, y: 9, width: 82, height: 100 }, 1000),
    ] },
    'thumbs-up': { loop: false, anchors: { head: { x: 61, y: 27 } }, frames: [
      pose(247, 632, 230, 617, standingTarget, 1000),
    ] },
    typing: { loop: true, frames: [
      timed(neutral), typeFrames[1], typeFrames[2], typeFrames[3],
      typeFrames[2], typeFrames[1], timed(neutral), typeFrames[1],
      typeFrames[2], typeFrames[1], timed(neutral), timed(neutral, 87),
    ] },
    talking: { loop: true, frames: [
      timed(neutral, 130), timed(speakFrames[1], 80), timed(speakFrames[2], 90),
      timed(speakFrames[3], 80), timed(speakFrames[1], 80), timed(neutral, 140),
      timed(speakFrames[3], 80), timed(speakFrames[2], 90),
      timed(speakFrames[1], 80), timed(neutral, 150),
    ] },
  },
};
