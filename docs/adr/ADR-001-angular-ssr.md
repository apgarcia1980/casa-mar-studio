# ADR-001: Angular 22 hybrid rendering and hydration

Status: accepted. Use Angular 22 standalone APIs with official SSR and hydration. Phase 1 server-renders all routes so request-derived SEO and HTTP 404 are reliable. Selective prerendering may follow once CMS and hosting are known. Browser APIs are isolated behind `PlatformService`.
