import { describe, expect, it } from 'vitest';
import { RouteId } from './route-registry';
import { entityRoute, resolveEntityLocalePath } from './localized-entity-route';

describe('localized entity route resolution', () => {
  const project = entityRoute('project-001', RouteId.ProjectDetail, {
    en: 'ocean-residence',
    es: 'residencia-oceano',
  });

  it('resolves English and Spanish slugs to the same entity identity', () => {
    expect(resolveEntityLocalePath(project, 'en')).toBe('/en/projects/ocean-residence');
    expect(resolveEntityLocalePath(project, 'es')).toBe('/es/proyectos/residencia-oceano');
    expect(project.entityId).toBe('project-001');
  });

  it('returns null when the target locale slug is absent', () => {
    expect(
      resolveEntityLocalePath(
        { entityId: 'draft-project', routeId: RouteId.ProjectDetail, slugs: { en: 'draft' } },
        'es',
      ),
    ).toBeNull();
  });
});
