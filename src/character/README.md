# Reusing Manan

`CharacterSprite` draws only the character. All props are separate.

```tsx
import { CharacterSprite, SpriteMotion } from './CharacterSprite';
import { manan } from './manan';

<CharacterSprite definition={manan} clip="standing-idle" scale={4} />
<CharacterSprite definition={manan} clip="portrait" scale={3} playing={false} />
<SpriteMotion x={100} y={0}>
  <CharacterSprite definition={manan} clip="thumbs-up" onComplete={onDone} />
</SpriteMotion>
```

Scale rounds to a positive whole number. Source PNG atlas frames are sampled into a 120×120 native canvas with no smoothing, then enlarged in whole multiples. Full-body standing character is about 96 native pixels tall (increased after the user's preview feedback). Each frame has source bounds and registered target bounds; anchors are native coordinates. Clip-specific anchors override character defaults.

Typing, resting, and talking use the exact same body artwork, closed expression head, and target bounds. Typing gently bends a connected forearm around its elbow, with one-pixel in-between positions; no independent fingertip cutouts. Talking samples a drawn open-mouth expression, confined to the mouth region, with irregular pauses. Hair, glasses, jaw, neck and body stay fixed. Never substitute separately generated full-body frames for these states; that changes the silhouette during transitions. `layers` draw registered raster artwork; `replace` clears the destination and optional `clip` confines drawing to native bounds.

## New animations

Add registered PNG frames and a clip to a new definition; renderer stays unchanged:

```tsx
const nextManan = {
  ...manan,
  clips: { ...manan.clips, walk: { frames: walkingFrames, loop: true } },
};
<SpriteMotion x={position.x} y={position.y}>
  <CharacterSprite definition={nextManan} clip="walk" />
</SpriteMotion>
```

Each frame supplies positive `duration` in milliseconds, source `x/y/width/height`, optional alternate `image`, and target bounds on the native canvas. One-shot clips hold the final frame and call `onComplete` once. Changing clips resets playback; pausing preserves current frame. Reduced motion freezes animation. Position can be changed through wrapper props, CSS transitions, or a caller's animation system independently of frame playback. Translation alone is not a walk cycle.

Development preview: `/?sprite-preview=1`. This view and its controls are excluded from production builds.

Source: original generated artwork guided by the user's reference photos. The source photographs are not bundled or committed.
