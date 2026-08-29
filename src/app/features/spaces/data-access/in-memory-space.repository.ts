import { Locale } from '../../../core/i18n/locale.model';
import { Space } from '../models/space.model';
import { DEMO_SPACES } from './demo-spaces';
import { SpaceRepository } from './space.repository';

export class InMemorySpaceRepository implements SpaceRepository {
  constructor(private readonly spaces: readonly Space[] = DEMO_SPACES) {}
  async getAll(): Promise<readonly Space[]> {
    return this.spaces;
  }
  async getBySlug(locale: Locale, slug: string): Promise<Space | null> {
    return this.spaces.find((space) => space.slug[locale] === slug) ?? null;
  }
  async getByIds(ids: readonly string[]): Promise<readonly Space[]> {
    const requested = new Set(ids);
    return this.spaces.filter((space) => requested.has(space.id));
  }
}
