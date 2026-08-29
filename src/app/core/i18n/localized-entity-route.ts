import { LocalizedValue, PartialLocalizedValue } from '../../shared/content/localized-value';
import { Locale } from './locale.model';
import { buildLocalizedPath, RouteId } from './route-registry';

export interface LocalizedEntityRoute {
  readonly entityId: string;
  readonly routeId: RouteId;
  readonly slugs: PartialLocalizedValue<string>;
}

export function resolveEntityLocalePath(
  entity: LocalizedEntityRoute,
  targetLocale: Locale,
): string | null {
  const slug = entity.slugs[targetLocale];
  return slug ? buildLocalizedPath(entity.routeId, targetLocale, slug) : null;
}

export function entityRoute(
  entityId: string,
  routeId: RouteId,
  slugs: LocalizedValue<string>,
): LocalizedEntityRoute {
  return { entityId, routeId, slugs };
}
