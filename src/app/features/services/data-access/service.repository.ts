import { Locale } from '../../../core/i18n/locale.model';
import { Service } from '../models/service.model';

export interface ServiceRepository {
  getAll(): Promise<readonly Service[]>;
  getBySlug(locale: Locale, slug: string): Promise<Service | null>;
  getByIds(ids: readonly string[]): Promise<readonly Service[]>;
}
