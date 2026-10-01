# Pixel hero — approved design

Build only one casual hero, not a résumé. Daylight pixel sky and grass frame a three-quarter desk vignette. Greeting: “hey, I’m Manan”.

The original character is based on the supplied photos: curly black hair, clear glasses, charcoal tee, dark trousers. Deliver standing idle, seated idle, portrait, thumbs-up and typing. Full-body character is approximately 64 logical pixels tall, enlarged without smoothing. Character contains no laptop, furniture or crown. Frame timing and attachment metadata allow future clips without changing the renderer. Movement belongs to an outer wrapper.

Separate chair, desk and laptop compose the hero. Two seconds typing alternate with three seconds rest. Five upright, readable glass cards orbit around the head every 24 seconds, with front/back depth. Content is placeholder gaming, coffee and coding jokes. Hover/focus pauses; horizontal drag rotates; mobile tap toggles pause. Distinguish taps from drags at 8px, preserve vertical scrolling, expose keyboard rotation and visible pause/resume. Reduced motion disables automatic orbit and sprite animation.

React, Vite, TypeScript, npm; static frontend, no routing, audio or backend. Sprite inspection is development-only. Verify 320/390/768/1440px, behavior tests, typecheck, production build and repository-subpath assets. Commit each verified milestone locally. No remote, push or publish in this milestone. Source photos remain outside Git.

Approved in chat by user, then explicitly supplied as implementation request on 2026-10-01.

## User revisions during implementation
- Greeting must visibly speak: add open/closed mouth talking clip while greeting reveals, pause typing, then resume typing/rest. Greeting can be replayed.
- Initial 64px character was too pixelated in preview. Increase to approximately 96 native pixels tall, preserving crisp edges and integer enlargement. Use 120px frame canvas and updated anchors.
- Talking, typing and seated rest must share exact same body pixels and registration; changes confined to mouth/hands.
- Use approved Pixelify font throughout, including glass cards.
