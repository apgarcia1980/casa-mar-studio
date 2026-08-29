import { Locale } from '../../../core/i18n/locale.model';
import { Material } from '../models/material.model';

export interface MaterialRepository {
  getAll(): Promise<readonly Material[]>;
  getBySlug(locale: Locale, slug: string): Promise<Material | null>;
  getByIds(ids: readonly string[]): Promise<readonly Material[]>;
}
