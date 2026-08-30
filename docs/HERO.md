# Cinematic Home Hero

Status: **Phase 4A**. The media and copy are provisional; the component architecture and accessibility policy are production-oriented.

## Structure

`HomePageComponent` owns the localized SEO descriptor and the minimum post-Hero introduction. `CinematicHeroComponent` owns the coherent visual composition: responsive poster/video layer, deterministic overlay, inline architectural SVG, marker, official wordmark, statement, scroll cue and media controls. These layers were intentionally not fragmented into microcomponents.

The Home is loaded at route level. GSAP is then dynamically imported inside `afterNextRender`, so neither GSAP core nor ScrollTrigger executes during SSR and both remain out of the initial application bundle. The GSAP context, ScrollTrigger, timeline and frame callback are reverted or cancelled through `DestroyRef`.

## Media policy

The current asset is an original generated **DEMO poster**, not client photography. AVIF is preferred and WebP is the fallback. Mobile uses a deliberate portrait crop rather than the desktop crop.

`heroMediaConfig` contains the only media paths. Its `videoSources` collection is intentionally empty: no fake files or unlicensed footage are referenced. The HTML5 video element is already configured for muted, looped, inline playback and responsive `<source>` entries. When approved media exists, add only existing source paths to the config.

Normal mode requests `preload="metadata"` and muted autoplay. `Save-Data` requests `preload="none"` and no autoplay. Reduced motion also starts with no preload/autoplay and a static geometry composition. Failure or missing duration leaves the poster visible and falls back to a slow independent marker timeline without errors.

The poster is not lazy-loaded, has intrinsic dimensions and `fetchpriority="high"`; it is the expected LCP candidate. The Hero has a stable `100svh` minimum before media metadata, protecting CLS.

## Motion and synchronization

The one-time sequence reveals the official raster wordmark, architectural paths and microcopy. A quiet marker traverses the same geometry over 18 seconds. ScrollTrigger reacts to native scrolling with a small `0.955` scale transition; it does not pin, hijack, normalize or change scrolling.

When a valid video duration becomes available, marker progress is calculated from `currentTime / duration`. `requestVideoFrameCallback` is preferred, with `requestAnimationFrame` as the lightweight fallback. Without video, the independent GSAP timeline remains the clock.

Sound starts muted. Sound and motion controls are native buttons with visible text, 44px targets, localized accessible names and `aria-pressed`. Pausing stops both video and decorative motion. Reduced-motion users start paused but may explicitly opt in.

## Asset replacement

- Desktop WEBM: place the approved file under `public/media/home/hero-desktop.webm` and add it to `videoSources`.
- Desktop MP4: `public/media/home/hero-desktop.mp4`.
- Mobile WEBM: `public/media/home/hero-mobile.webm`, with an appropriate `media` condition.
- Mobile MP4: `public/media/home/hero-mobile.mp4`.
- Poster: replace the four demo AVIF/WebP entries in `heroMediaConfig`; retain the aspect-specific desktop and mobile outputs.
- Branding currently uses the official raster files in `public/branding/`: the wordmark in Hero/Header and the mint icon in Footer. Favicons are isolated under `public/branding/favicon/`: the official dark-olive `Icon.png` published by the reference site is used for light browser chrome and the official mint icon for dark browser chrome.
- Request production SVG versions of the wordmark and icon, light/dark variants, an official favicon and any approved horizontal logo. Replace the PNG references without changing their isolated layout slots.

Do not replace assets without confirming ownership, web usage rights, audio rights and consent for any identifiable people or property.

## Temporary poster provenance

Built-in ImageGen created the source saved at `docs/assets-source/home/hero-poster-demo-source.png`. Final web derivatives are in `public/media/home/`. Prompt summary: an original photorealistic Mediterranean limestone interior with sea horizon, late-afternoon architectural light, restrained furniture, no people, text, logos, competitor material or watermark.
