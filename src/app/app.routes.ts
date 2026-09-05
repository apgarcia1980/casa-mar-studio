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
        path: 'en/projects',
        loadComponent: () =>
          import('./features/coming-soon/pages/coming-soon-route-page/coming-soon-route-page.component').then(
            (module) => module.ComingSoonRoutePageComponent,
          ),
        data: { locale: 'en', routeId: RouteId.Projects, comingSoon: 'projects' },
      },
      {
        path: 'es/proyectos',
        loadComponent: () =>
          import('./features/coming-soon/pages/coming-soon-route-page/coming-soon-route-page.component').then(
            (module) => module.ComingSoonRoutePageComponent,
          ),
        data: { locale: 'es', routeId: RouteId.Projects, comingSoon: 'projects' },
      },
      {
        path: 'en/spaces',
        loadComponent: () =>
          import('./features/spaces/pages/spaces-page/spaces-page.component').then(
            (module) => module.SpacesPageComponent,
          ),
        data: { locale: 'en', routeId: RouteId.Spaces },
      },
      {
        path: 'es/espacios',
        loadComponent: () =>
          import('./features/spaces/pages/spaces-page/spaces-page.component').then(
            (module) => module.SpacesPageComponent,
          ),
        data: { locale: 'es', routeId: RouteId.Spaces },
      },
      {
        path: 'en/materials',
        loadComponent: () =>
          import('./features/coming-soon/pages/coming-soon-route-page/coming-soon-route-page.component').then(
            (module) => module.ComingSoonRoutePageComponent,
          ),
        data: { locale: 'en', routeId: RouteId.Materials, comingSoon: 'materials' },
      },
      {
        path: 'es/materiales',
        loadComponent: () =>
          import('./features/coming-soon/pages/coming-soon-route-page/coming-soon-route-page.component').then(
            (module) => module.ComingSoonRoutePageComponent,
          ),
        data: { locale: 'es', routeId: RouteId.Materials, comingSoon: 'materials' },
      },
      {
        path: 'en/studio',
        loadComponent: () =>
          import('./features/studio/pages/studio-page/studio-page.component').then(
            (module) => module.StudioPageComponent,
          ),
        data: { locale: 'en', routeId: RouteId.Studio },
      },
      {
        path: 'es/estudio',
        loadComponent: () =>
          import('./features/studio/pages/studio-page/studio-page.component').then(
            (module) => module.StudioPageComponent,
          ),
        data: { locale: 'es', routeId: RouteId.Studio },
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
