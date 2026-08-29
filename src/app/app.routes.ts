import { Routes } from '@angular/router';
import { RouteId } from './core/i18n/route-registry';
import { SiteShellComponent } from './layout/site-shell/site-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: SiteShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'en' },
      {
        path: 'en',
        loadComponent: () =>
          import('./features/home/pages/home-page/home-page.component').then(
            (module) => module.HomePageComponent,
          ),
        data: { locale: 'en', routeId: RouteId.Home },
      },
      {
        path: 'es',
        loadComponent: () =>
          import('./features/home/pages/home-page/home-page.component').then(
            (module) => module.HomePageComponent,
          ),
        data: { locale: 'es', routeId: RouteId.Home },
      },
      {
        path: 'en/design-system',
        loadComponent: () =>
          import('./features/design-system-preview/design-system-preview.component').then(
            (module) => module.DesignSystemPreviewComponent,
          ),
        data: { locale: 'en', routeId: RouteId.DesignSystem },
      },
      {
        path: 'es/sistema-diseno',
        loadComponent: () =>
          import('./features/design-system-preview/design-system-preview.component').then(
            (module) => module.DesignSystemPreviewComponent,
          ),
        data: { locale: 'es', routeId: RouteId.DesignSystem },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            (module) => module.NotFoundComponent,
          ),
      },
    ],
  },
];
