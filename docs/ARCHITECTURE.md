# Architecture

The application uses standalone Angular components, strict TypeScript, route-level lazy loading, server rendering and hydration. UI code is split into TypeScript, HTML and SCSS files.

`core` contains cross-cutting capabilities already used: public configuration, platform access, localized route identities, SEO, theming, HTTP and normalized errors. `layout` owns the persistent semantic shell and its Header/Footer. `features` owns routable content. `shared/ui` contains only reusable controls with real semantic value; layout-only primitives remain CSS.

Content contracts are feature-owned (`projects`, `spaces`, `materials`, `services`, `locations`). Provider-neutral primitives shared by them live in `shared/content`. Each feature defines a repository around its actual queries and an in-memory demo implementation; there is no universal generic repository. Repositories are not globally provided until an application consumer exists.

The browser boundary is `presentation → feature/application service → HTTP client → /api/v1`. No provider SDK or private credential belongs in Angular. CMS, durable lead storage, email and analytics are future server-side adapters.

Future CMS DTOs stop at `data-access`: an adapter maps them into domain content models. Future page-level application code resolves locale and related IDs, then creates view models for UI. Components consume neither provider DTOs nor cyclic graphs.

All current routes use `RenderMode.Server`, making response status and request-origin canonical URLs deterministic while hosting is undecided. Stable CMS pages may later use selective prerendering. Environment files contain public build configuration only; server secrets will be injected by the eventual hosting platform.

The Home feature is split by responsibility into a page, a coherent cinematic Hero component and small pure media/motion models. Browser animation dependencies are dynamically imported after render, scoped with GSAP context and destroyed with the Angular component. Media paths are provider-neutral configuration, so licensed assets can replace the demo without changing presentation logic.
