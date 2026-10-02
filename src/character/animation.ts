export interface Point { x: number; y: number }
export interface SpriteFrame {
  x: number; y: number; duration: number; width?: number; height?: number; image?: string;
  target?: { x: number; y: number; width: number; height: number };
  anchors?: Record<string, Point>;
}
export interface SpriteClip { frames: SpriteFrame[]; loop: boolean; anchors?: Record<string, Point> }
export interface SpriteDefinition {
  image: string;
  width: number;
  height: number;
  sourceWidth?: number;
  sourceHeight?: number;
  // Optional cap on displayed pixel size. Layout and anchors still use width/height.
  maxPixelSize?: number;
  clips: Record<string, SpriteClip>;
  anchors: Record<string, Point>;
}

export function frameAt(clip: SpriteClip, elapsed: number): number {
  const total = clip.frames.reduce((sum, frame) => sum + frame.duration, 0);
  if (!total || clip.frames.length === 0) return 0;
  let remaining = Math.max(0, elapsed);
  if (clip.loop) remaining %= total;
  for (let i = 0; i < clip.frames.length; i++) {
    if (remaining < clip.frames[i].duration) return i;
    remaining -= clip.frames[i].duration;
  }
  return clip.frames.length - 1;
}

export function resolveClip(definition: SpriteDefinition, name: string): SpriteClip {
  const clip = definition.clips[name];
  if (!clip || !clip.frames.length || clip.frames.some(frame => !(frame.duration > 0))) {
    throw new Error(`Unknown sprite clip or invalid frames: ${name}`);
  }
  return clip;
}
