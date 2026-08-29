import { Locale } from '../../../core/i18n/locale.model';
import { Location } from '../models/location.model';
import { DEMO_LOCATIONS } from './demo-locations';
import { LocationRepository } from './location.repository';

export class InMemoryLocationRepository implements LocationRepository {
  constructor(private readonly locations: readonly Location[] = DEMO_LOCATIONS) {}
  async getAll(): Promise<readonly Location[]> {
    return this.locations;
  }
  async getBySlug(locale: Locale, slug: string): Promise<Location | null> {
    return this.locations.find((location) => location.slug[locale] === slug) ?? null;
  }
  async getByIds(ids: readonly string[]): Promise<readonly Location[]> {
    const requested = new Set(ids);
    return this.locations.filter((location) => requested.has(location.id));
  }
}
