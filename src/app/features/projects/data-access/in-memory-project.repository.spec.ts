import { describe, expect, it } from 'vitest';
import { DEMO_LOCATIONS } from '../../locations/data-access/demo-locations';
import { DEMO_MATERIALS } from '../../materials/data-access/demo-materials';
import { DEMO_SERVICES } from '../../services/data-access/demo-services';
import { DEMO_SPACES } from '../../spaces/data-access/demo-spaces';
import { DEMO_PROJECT_ID, DEMO_PROJECTS } from './demo-projects';
import { InMemoryProjectRepository } from './in-memory-project.repository';

describe('InMemoryProjectRepository', () => {
  const repository = new InMemoryProjectRepository();

  it('resolves both localized slugs to one project', async () => {
    const english = await repository.getBySlug('en', 'ocean-residence-demo');
    const spanish = await repository.getBySlug('es', 'residencia-oceano-demo');
    expect(english?.id).toBe(DEMO_PROJECT_ID);
    expect(spanish?.id).toBe(DEMO_PROJECT_ID);
  });

  it('returns null for an unknown localized slug', async () => {
    await expect(repository.getBySlug('es', 'slug-ausente')).resolves.toBeNull();
  });

  it('queries featured projects and explicit IDs', async () => {
    await expect(repository.getFeatured()).resolves.toHaveLength(1);
    await expect(repository.getByIds([DEMO_PROJECT_ID])).resolves.toEqual(DEMO_PROJECTS);
  });

  it('keeps demo relationships symmetric without nested entity cycles', () => {
    const project = DEMO_PROJECTS[0];
    expect(DEMO_SPACES[0].projectIds).toContain(project.id);
    expect(DEMO_MATERIALS[0].projectIds).toContain(project.id);
    expect(DEMO_SERVICES[0].projectIds).toContain(project.id);
    expect(DEMO_LOCATIONS[0].projectIds).toContain(project.id);
    expect(project.spaceIds).toContain(DEMO_SPACES[0].id);
    expect(project.materialIds).toContain(DEMO_MATERIALS[0].id);
    expect(project.serviceIds).toContain(DEMO_SERVICES[0].id);
    expect(project.locationId).toBe(DEMO_LOCATIONS[0].id);
  });
});
