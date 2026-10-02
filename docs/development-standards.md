# Portfolio development standards

Apply these standards as the site grows, one approved component at a time.

- Use strict TypeScript and small React components with clear typed inputs. Keep reusable character rendering separate from scene composition and content data.
- Keep state local to the component that owns it. Cache shared artwork loading, avoid duplicate animation loops, and memoize static scene artwork so typing updates do not repaint furniture.
- Preserve semantic document structure, accessible names, keyboard navigation, visible focus and reduced-motion behavior. Decorative artwork stays outside the accessibility tree. Interactive behavior must work without relying on hover.
- Keep responsive layouts within the viewport. Verify narrow screens and touch scrolling. Maintain whole-pixel enlargement and consistent depth/attachment anchors for pixel art.
- Import local assets through Vite for hashed, relative production URLs. Keep reference photos outside Git, preserve original artwork, record generated-asset provenance and prompts, and avoid unnecessary dependencies or network requests.
- Write behavior tests for meaningful risks; use browser inspection for composition, animation contact and actual rendering. Run the full suite, typecheck and production build before a verified milestone. Check the production preview beneath a repository subpath.
- Commit verified milestones locally with scoped changes. Create remotes, push or deploy only when explicitly requested. Keep screenshots and temporary harnesses in ignored `.verification/`.

Current scope remains the hero and reusable character. Future components inherit these standards.
