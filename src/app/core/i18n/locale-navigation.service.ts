import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { LocalizedEntityRoute, resolveEntityLocalePath } from './localized-entity-route';
import { Locale } from './locale.model';
import { buildLocalizedPath, RouteId } from './route-registry';

@Injectable({ providedIn: 'root' })
export class LocaleNavigationService {
  private readonly router = inject(Router);

  pathFor(targetLocale: Locale): string | null {
    const snapshot = this.deepest(this.router.routerState.snapshot.root);
    const entity = snapshot.data['localizedEntityRoute'] as LocalizedEntityRoute | undefined;
    if (entity) return resolveEntityLocalePath(entity, targetLocale);

    const routeId = snapshot.data['routeId'] as RouteId | undefined;
    return buildLocalizedPath(routeId ?? RouteId.Home, targetLocale);
  }

  private deepest(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;
    while (current.firstChild) current = current.firstChild;
    return current;
  }
}
