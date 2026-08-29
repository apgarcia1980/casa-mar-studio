# SEO foundation

`SeoDescriptor` is the typed page contract for title, description, canonical, robots, locale, alternates, Open Graph, Twitter card, breadcrumbs and JSON-LD. `SeoService` is the only code that writes document metadata.

Absolute URLs use the incoming SSR request origin and browser origin after hydration; no production domain is invented. Managed canonical and alternate links are removed before replacement. JSON-LD uses script `textContent`, escapes less-than characters and uses no sanitizer bypass.

`/en` and `/es` provide neutral provisional Home metadata plus reciprocal `en`, `es` and `x-default` alternates. The original DEMO poster is the temporary Open Graph image; it must be replaced with approved brand media. Unknown routes use `noindex,follow` and set `RESPONSE_INIT.status` to 404. `npm run e2e` inspects raw SSR responses. Corporate schema is absent until verified business data exists.

Content entities carry optional provider-neutral `ContentSeo`. `mergeContentSeo` combines localized entity overrides with a route-generated `SeoDescriptor`; canonical, hreflang and page context remain page responsibilities. Demo fixtures are always `noIndex`.

Entity relationships are IDs. During SSR, application code will resolve them through feature repositories and render ordinary anchors for Project ↔ Material, Project ↔ Space and Project ↔ Location relationships. Important internal links will exist in initial HTML rather than being appended after hydration.
