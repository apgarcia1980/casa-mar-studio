# ADR-002: Localized routing by route identity

Status: accepted. URLs require `/en` or `/es` and localized segments. Links use `RouteId` and a typed registry. Future switching resolves route identity, entity identity and target-locale slug.

Static interface and SEO copy is maintained in parity-checked JSON dictionaries and resolved by typed `TranslationService`. The URL determines the active dictionary. Dictionaries are embedded in both SSR and browser bundles to avoid runtime fetches and hydration divergence. XLIFF, separate locale builds and third-party i18n libraries are not used.
