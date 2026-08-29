import { describe, expect, it } from 'vitest';
import { buildLocalizedPath, RouteId } from './route-registry';

describe('localized route registry', () => {
  it('builds localized static routes', () => {
    expect(buildLocalizedPath(RouteId.Home, 'en')).toBe('/en');
    expect(buildLocalizedPath(RouteId.Projects, 'es')).toBe('/es/proyectos');
    expect(buildLocalizedPath(RouteId.Locations, 'en')).toBe('/en/locations');
    expect(buildLocalizedPath(RouteId.Journal, 'es')).toBe('/es/revista');
    expect(buildLocalizedPath(RouteId.DesignSystem, 'en')).toBe('/en/design-system');
    expect(buildLocalizedPath(RouteId.DesignSystem, 'es')).toBe('/es/sistema-diseno');
  });
  it('requires a localized slug for entity routes', () => {
    expect(() => buildLocalizedPath(RouteId.ProjectDetail, 'en')).toThrow();
    expect(buildLocalizedPath(RouteId.ProjectDetail, 'es', 'bay-harbor')).toBe(
      '/es/proyectos/bay-harbor',
    );
  });
});
