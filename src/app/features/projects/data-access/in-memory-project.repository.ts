import { Locale } from '../../../core/i18n/locale.model';
import { Project } from '../models/project.model';
import { DEMO_PROJECTS } from './demo-projects';
import { ProjectRepository } from './project.repository';

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly projects: readonly Project[] = DEMO_PROJECTS) {}

  async getAll(): Promise<readonly Project[]> {
    return this.projects;
  }

  async getBySlug(locale: Locale, slug: string): Promise<Project | null> {
    return this.projects.find((project) => project.slug[locale] === slug) ?? null;
  }

  async getByIds(ids: readonly string[]): Promise<readonly Project[]> {
    const requested = new Set(ids);
    return this.projects.filter((project) => requested.has(project.id));
  }

  async getFeatured(): Promise<readonly Project[]> {
    return this.projects.filter((project) => project.featured);
  }
}
