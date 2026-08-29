import { Locale } from '../../../core/i18n/locale.model';
import { Service } from '../models/service.model';
import { DEMO_SERVICES } from './demo-services';
import { ServiceRepository } from './service.repository';

export class InMemoryServiceRepository implements ServiceRepository {
  constructor(private readonly services: readonly Service[] = DEMO_SERVICES) {}
  async getAll(): Promise<readonly Service[]> {
    return this.services;
  }
  async getBySlug(locale: Locale, slug: string): Promise<Service | null> {
    return this.services.find((service) => service.slug[locale] === slug) ?? null;
  }
  async getByIds(ids: readonly string[]): Promise<readonly Service[]> {
    const requested = new Set(ids);
    return this.services.filter((service) => requested.has(service.id));
  }
}
