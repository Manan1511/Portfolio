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

Scale rounds to a positive whole number. Source PNG frames are sampled into a 120×120 native canvas with no smoothing, then enlarged in whole multiples. Full-body character is about 100 native pixels tall. Each frame is a complete drawing with source bounds and registered target bounds; anchors are native coordinates. Clip-specific anchors override character defaults. Default anchors include head, mouth, hands and feet.

Typing, resting and talking use one shared seated sheet, with complete character artwork in every frame. Subtle connected hand/forearm poses and natural speech expressions are authored into the drawings. Both one-second animation cycles start and end with the exact same neutral image used by seated idle, so the hero's two-second activity changes happen at rest. Typing runs through twelve timed in-betweens; speech has short expression changes and longer closed-mouth pauses. Playback follows browser repaint timing using `requestAnimationFrame`. The renderer draws one complete frame, with no head replacement, mouth overlay or procedural body deformation.

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

Development preview: `/?sprite-preview=1`. Choose a pose, pause playback, or use **Inspect frames** and its slider to check each registered drawing. **Move wrapper** demonstrates movement independently of frame playback. This view and its controls are excluded from production builds.

Source: original generated artwork guided by the user's reference photos. The source photographs are not bundled or committed.

Artwork files and generation prompts: [ARTWORK.md](../assets/character/ARTWORK.md).
