# Casa Mar design system

Status: **Phase 3 foundation**. The visual identity is provisional and deliberately contains no final Home, hero, photography direction or motion choreography.

## Principles

Casa Mar uses editorial scale, restrained composition, negative space and material colour rather than decorative effects. Olive is an accent, not the dominant field. Interfaces should feel architectural and quiet, never like a dashboard, shop or card catalogue.

## Temporary design fonts

**Newsreader Variable** is the provisional display serif. It is OFL-licensed, supports Latin and Latin Extended, and its source family exposes weight (200–800) plus optical-size (6–72) axes. The current web build deliberately ships the weight-only Latin subset. **Manrope Variable** is the provisional UI/body sans; it is OFL-licensed, supports the required Spanish and English characters, and exposes weights 200–800. Both are packaged locally through Fontsource, use WOFF2 and `font-display: swap`; no third-party font request occurs at runtime. Restricting the build to the two Latin files avoids emitting unused Cyrillic, Greek and Vietnamese assets.

Libre Baskerville, Cormorant Garamond and Inter were considered. Newsreader has the strongest editorial range while retaining screen legibility; Manrope is highly readable without bringing Inter's more product-oriented character. The families are referenced only by `--font-display` and `--font-body`, so licensed brand fonts can replace them without component rewrites.

## Tokens

`src/styles/tokens` separates colour, typography, spacing, layout, motion, borders, focus and z-index. Primitive colour scales (`--olive-600`) support semantic tokens (`--color-accent`); components primarily consume semantic tokens.

The provisional light palette is warm ivory `#f7f2e8`, warm white `#fffdf7`, charcoal `#1b1c19`, olive accent `#59623d`, stone `#79766d` and sand `#d2c6b4`. Dark mode is composed independently with deep charcoal surfaces, ivory text and a lighter olive. High contrast uses black, white, yellow and cyan. System mode follows colour-scheme and increased-contrast preferences; forced colours remain controlled by the operating system.

The fluid type scale contains `display-xl/lg/md`, `heading-1/2/3`, `body-lg/body/body-sm`, `label`, `caption` and `navigation`. Display sizes use conservative `clamp()` bounds; reading measure is `68ch`.

Spacing uses a 4–128px fixed scale plus fluid page gutters and editorial section gaps. Motion has only fast/normal/slow durations and standard/emphasized easing. All global transitions collapse under `prefers-reduced-motion`.

## Layout

CSS primitives provide full bleed, page (max 1600px), content (1152px) and narrow (704px) containers. The native CSS grid uses four columns by default, eight from 48rem and twelve from 64rem, with a fluid gutter. These are the only active layout breakpoints; 90rem is reserved as a documented wide reference.

`stack`, `cluster` and editorial-grid utilities remain CSS because they contain no behaviour or added semantics. Components are reserved for semantics or behaviour.

## Components

- `ButtonComponent` always renders a native button for actions.
- `ButtonLinkComponent` always renders a native anchor for navigation.
- `LanguageSwitcherComponent` derives target URLs from RouteId and preserves the current route or localized entity context.
- `ThemeSwitcherComponent` exposes system, light, dark and high-contrast choices as a labelled button group.
- Header uses the temporary text wordmark, RouteId navigation and a native modal dialog for mobile navigation.
- Footer renders only truthful brand/navigation/preferences information; contact, social, location and legal links wait for real content and routes.

Inline links remain underlined. Navigation links use placement and active state; editorial CTAs use a persistent rule. Touch targets are at least 44 CSS pixels.

## Accessibility and themes

The shell preserves its skip link and header/main/footer landmarks. Focus is visible in every theme. The mobile dialog blocks background interaction, closes with Escape and returns focus to its trigger. Theme state continues to use the SSR-readable cookie, avoiding a client-only flash or hydration mismatch. Hover enhancements are restricted to hover-capable pointers.

The development routes `/en/design-system` and `/es/sistema-diseno` show the system in context. They emit `noindex,nofollow`, are intentionally lightweight and are not part of production navigation.

## Home Hero extension

Phase 4A adds semantic Hero colour tokens for deterministic text, line, marker and warm-overlay contrast. The Home Header consumes these tokens in overlay context without duplicating the Header component. The full media, motion and replacement policy is documented in `HERO.md`.
