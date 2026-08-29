import { Locale } from '../../../core/i18n/locale.model';
import { Project } from '../models/project.model';

export interface ProjectRepository {
  getAll(): Promise<readonly Project[]>;
  getBySlug(locale: Locale, slug: string): Promise<Project | null>;
  getByIds(ids: readonly string[]): Promise<readonly Project[]>;
  getFeatured(): Promise<readonly Project[]>;
}
