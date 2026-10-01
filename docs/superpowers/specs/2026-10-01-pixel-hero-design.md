# Pixel hero — approved design

Build only one casual hero, not a résumé. Daylight pixel sky and grass frame a three-quarter desk vignette. Greeting: “hey, I’m Manan”.

The original character is based on the supplied photos: curly black hair, clear glasses, charcoal tee, dark trousers. Deliver standing idle, seated idle, portrait, thumbs-up, typing and talking. The full-body character occupies approximately 100 logical pixels on a 120px layout grid. Following finer-detail feedback, the preview/desktop raster is 180×180, enlarged by exactly 2 to the existing 360px display. Display pixels stay at most 2px, with no smoothing. Character contains no laptop, furniture or crown. Frame timing and attachment metadata allow future clips without changing the renderer. Movement belongs to an outer wrapper.

Separate chair, desk and laptop compose the hero. Two seconds typing alternate with three seconds rest. Five upright, readable glass cards orbit around the head every 24 seconds, with front/back depth. Content is placeholder gaming, coffee and coding jokes. Hover/focus pauses; horizontal drag rotates; mobile tap toggles pause. Distinguish taps from drags at 8px, preserve vertical scrolling, expose keyboard rotation and visible pause/resume. Reduced motion disables automatic orbit and sprite animation.

React, Vite, TypeScript, npm; static frontend, no routing, audio or backend. Sprite inspection is development-only. Verify 320/390/768/1440px, behavior tests, typecheck, production build and repository-subpath assets. Commit each verified milestone locally. No remote, push or publish in this milestone. Source photos remain outside Git.

Approved in chat by user, then explicitly supplied as implementation request on 2026-10-01.

## User revisions during implementation
- Greeting must visibly speak: add open/closed mouth talking clip while greeting reveals, pause typing, then resume typing/rest. Greeting can be replayed.
- Initial 64px character was too pixelated in preview. Increase to approximately 96 native pixels tall, preserving crisp edges and integer enlargement. Use 120px frame canvas and updated anchors.
- Talking, typing and seated rest must maintain consistent body proportions and whole-frame registration, with small changes confined to the intended gesture/expression.
- Use approved Pixelify font throughout, including glass cards.
- Remove independent fingertip presses. Typing uses gentle connected hand/forearm movement around the elbows, with in-between frames.
- Speech uses natural drawn mouth expressions with pauses and no protruding tongue shapes.
- Rebuilt sprite still felt too pixelated: use finer sampling of its existing complete drawings, limiting display pixels to 2px while retaining display size, integer enlargement, animation timing and attachment registration.

## Approved complete sprite rebuild

User requested a complete rebuild of the pieced character and selected subtle, relaxed motion. Rebuild the six poses around one coherent continuous character design with natural neck, shoulders, sleeves, elbows and hands. Use complete raster frames for animation; remove the earlier head overlays, mouth patches and arm deformation. Typing and dialogue use one shared seated sheet, with identical neutral artwork at the beginning and end of each one-second cycle. The two-second talking/typing activity windows therefore finish at a common resting pose. Playback follows browser repaint timing. Register the crown, hands, greeting and floor against the new head/mouth/hand/foot anchors. Retain the existing hero, font and separate scene props.
