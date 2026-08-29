# Casa Mar Studio

Angular 22 SSR foundation for the future Casa Mar Studio corporate and editorial website. The current Phase 4A Home contains a cinematic, accessible Hero with original DEMO poster media and a deliberately minimal introduction; the remaining Home sections are not yet implemented.

## Requirements and commands

Node 24.x and npm 11.x were used for validation.

```bash
npm ci
npm start
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e:install
npm run e2e
npm run format:check
```

`npm run build` creates browser and Node SSR bundles. `npm run serve:ssr:casa-mar-estudio` serves the production build on port 4000. Playwright starts that server and checks SSR HTML, localized metadata, HTTP status, keyboard navigation and axe.

Routes: `/` redirects with HTTP 308 to `/en`; `/en` and `/es` render the localized Home; `/en/design-system` and `/es/sistema-diseno` remain noindex development previews; unknown URLs render the branded HTTP 404.

Configuration compiled into Angular is public. Secrets belong only in the future server runtime and must never be added to `src/environments`.

See the focused documents in `docs/` for architecture, SEO, internationalization, theming, accessibility and API decisions.
