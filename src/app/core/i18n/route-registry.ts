import { Locale } from './locale.model';

export enum RouteId {
  Home = 'home',
  Projects = 'projects',
  ProjectDetail = 'project-detail',
  Spaces = 'spaces',
  SpaceDetail = 'space-detail',
  Materials = 'materials',
  MaterialDetail = 'material-detail',
  Services = 'services',
  ServiceDetail = 'service-detail',
  Studio = 'studio',
  Professionals = 'professionals',
  Contact = 'contact',
  Locations = 'locations',
  LocationDetail = 'location-detail',
  Journal = 'journal',
  ArticleDetail = 'article-detail',
  DesignSystem = 'design-system',
  AccessibilityStatement = 'accessibility-statement',
}
interface RouteDefinition {
  readonly segments: Readonly<Record<Locale, readonly string[]>>;
  readonly requiresEntitySlug?: boolean;
}
const routeRegistry: Readonly<Record<RouteId, RouteDefinition>> = {
  [RouteId.Home]: { segments: { en: [], es: [] } },
  [RouteId.Projects]: { segments: { en: ['projects'], es: ['proyectos'] } },
  [RouteId.ProjectDetail]: {
    segments: { en: ['projects'], es: ['proyectos'] },
    requiresEntitySlug: true,
  },
  [RouteId.Spaces]: { segments: { en: ['spaces'], es: ['espacios'] } },
  [RouteId.SpaceDetail]: {
    segments: { en: ['spaces'], es: ['espacios'] },
    requiresEntitySlug: true,
  },
  [RouteId.Materials]: { segments: { en: ['materials'], es: ['materiales'] } },
  [RouteId.MaterialDetail]: {
    segments: { en: ['materials'], es: ['materiales'] },
    requiresEntitySlug: true,
  },
  [RouteId.Services]: { segments: { en: ['services'], es: ['servicios'] } },
  [RouteId.ServiceDetail]: {
    segments: { en: ['services'], es: ['servicios'] },
    requiresEntitySlug: true,
  },
  [RouteId.Studio]: { segments: { en: ['studio'], es: ['estudio'] } },
  [RouteId.Professionals]: {
    segments: { en: ['professionals'], es: ['profesionales'] },
  },
  [RouteId.Contact]: { segments: { en: ['contact'], es: ['contacto'] } },
  [RouteId.Locations]: { segments: { en: ['locations'], es: ['ubicaciones'] } },
  [RouteId.LocationDetail]: {
    segments: { en: ['locations'], es: ['ubicaciones'] },
    requiresEntitySlug: true,
  },
  [RouteId.Journal]: { segments: { en: ['journal'], es: ['revista'] } },
  [RouteId.ArticleDetail]: {
    segments: { en: ['journal'], es: ['revista'] },
    requiresEntitySlug: true,
  },
  [RouteId.DesignSystem]: {
    segments: { en: ['design-system'], es: ['sistema-diseno'] },
  },
  [RouteId.AccessibilityStatement]: {
    segments: { en: ['accessibility'], es: ['accesibilidad'] },
  },
};

export function buildLocalizedPath(routeId: RouteId, locale: Locale, entitySlug?: string): string {
  const definition = routeRegistry[routeId];
  if (definition.requiresEntitySlug && !entitySlug)
    throw new Error(`Route ${routeId} requires a localized entity slug.`);
  return `/${[locale, ...definition.segments[locale], ...(entitySlug ? [entitySlug] : [])].join('/')}`;
}
