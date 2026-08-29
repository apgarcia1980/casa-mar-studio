import { Locale } from '../../../core/i18n/locale.model';
import { Material } from '../models/material.model';
import { DEMO_MATERIALS } from './demo-materials';
import { MaterialRepository } from './material.repository';

export class InMemoryMaterialRepository implements MaterialRepository {
  constructor(private readonly materials: readonly Material[] = DEMO_MATERIALS) {}
  async getAll(): Promise<readonly Material[]> {
    return this.materials;
  }
  async getBySlug(locale: Locale, slug: string): Promise<Material | null> {
    return this.materials.find((material) => material.slug[locale] === slug) ?? null;
  }
  async getByIds(ids: readonly string[]): Promise<readonly Material[]> {
    const requested = new Set(ids);
    return this.materials.filter((material) => requested.has(material.id));
  }
}
