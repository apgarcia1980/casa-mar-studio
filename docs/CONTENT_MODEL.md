# Content model

## Boundaries

Casa Mar Studio defines provider-neutral content for `Project`, `Space`, `Material`, `Service` and `Location`. Future `Article`, `TeamMember` and `Lead` are intentionally not implemented.

Domain models contain stable editorial meaning: identity, localized content, relationships, media and SEO facts. A future CMS adapter owns provider DTOs, field-name differences, rich-text conversion and provider errors. View models will be introduced only with real pages; the application layer will combine entities, locale and route context before UI rendering.

```text
UI → application mapping → feature repository → in-memory or CMS adapter → data source
```

## Localization and slugs

`LocalizedValue<T>` is a required `{ en, es }` value. Published entity names, copy, SEO fields and slugs use it instead of `titleEn`/`titleEs`. `PartialLocalizedValue<T>` exists for incomplete drafts and makes absence explicit through `localizeOptional`.

Both slugs identify the same entity ID. `resolveEntityLocalePath` receives the identity, detail `RouteId`, localized slugs and target locale. It returns the translated URL or `null` if the target slug is absent; it never replaces `/en` with `/es` in an existing string.

Static interface translations remain in `public/i18n/*.json`. Entity fixture/CMS values are editorial content and therefore live in content records, not translation dictionaries.

## Entities and relationships

- `Project`: localized editorial fields, media, optional credits/year/location, featured state and IDs for spaces, materials and services.
- `Space`: controlled initial kind, localized landing content, hero and related project/material IDs.
- `Material`: localized content, small category union, optional finish/color/applications/media and project/space IDs.
- `Service`: localized content, optional hero and project IDs.
- `Location`: localized content and slugs, optional region/hero, project/service IDs and future local SEO data. Fixtures assert no real location.

Relationships use IDs instead of embedding reciprocal entities. This prevents cyclic frontend graphs and lets application queries choose summaries or details. Demo tests verify reciprocal IDs.

## Media and accessibility

`MediaAsset` stores intrinsic width/height, a default source, optional typed format/width sources, focal point and credit. Its union enforces either `decorative: true` with no alt or `decorative: false` with localized alt. Filenames never generate alt text. A future adapter may derive responsive sources from CMS metadata without changing components.

## SEO

`ContentSeo` provides optional localized title/description, social image and no-index state. `mergeContentSeo` overlays these fields on page-level `SeoDescriptor`; routes still own canonical, hreflang, breadcrumbs and structured-data context.

## Repositories and errors

Each feature has a specific repository: `ProjectRepository`, `SpaceRepository`, `MaterialRepository`, `ServiceRepository` and `LocationRepository`. They expose useful queries only (`getAll`, localized `getBySlug`, `getByIds`, and project `getFeatured`). In-memory implementations use clearly marked demo fixtures and can later be replaced at the provider boundary.

Unknown slugs return `null`, allowing page application code to produce HTTP 404. Operational failures will normalize to `ContentRepositoryError` codes `DATA_UNAVAILABLE` or `NETWORK_ERROR`; provider exceptions must not reach UI.

## CMS evolution

A future CMS adds DTOs and adapters under each feature's `data-access`. It must preserve entity IDs, localized fields, reciprocal relations, preview state and media metadata. No component or domain model should import a CMS SDK.
