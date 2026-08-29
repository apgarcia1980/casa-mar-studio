# Accessibility foundation

Target: WCAG 2.2 AA. The shell uses native header, nav, main and footer landmarks. Its first interactive element is a skip link targeting a focusable main region. Controls have native labels, visible focus, a minimum 44px target, responsive text and no unnecessary ARIA.

Global styles preserve zoom and reflow down to 320 CSS pixels and support forced colors. Axe and keyboard smoke tests are regression checks, not substitutes for manual keyboard, screen reader, zoom, contrast and mobile testing for every feature and locale.

The mobile navigation uses the native modal dialog contract: background content is inert while open, Escape closes it, and focus is restored to the menu trigger. Theme options are labelled toggle buttons in a fieldset; language links expose their destination language without flags.

The Home Hero treats media, SVG geometry and marker as decorative. Its statement and single H1 remain HTML. Sound starts muted, continuous motion has a pause/play control, and reduced-motion users receive a static poster and geometry by default. Save-Data prevents automatic video loading. Forced-colours mode hides photographic layers and preserves content and controls using system colours.
