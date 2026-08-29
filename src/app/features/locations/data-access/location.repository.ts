import { Locale } from '../../../core/i18n/locale.model';
import { Location } from '../models/location.model';

export interface LocationRepository {
  getAll(): Promise<readonly Location[]>;
  getBySlug(locale: Locale, slug: string): Promise<Location | null>;
  getByIds(ids: readonly string[]): Promise<readonly Location[]>;
}
