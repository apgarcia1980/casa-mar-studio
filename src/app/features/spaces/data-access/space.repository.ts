import { Locale } from '../../../core/i18n/locale.model';
import { Space } from '../models/space.model';

export interface SpaceRepository {
  getAll(): Promise<readonly Space[]>;
  getBySlug(locale: Locale, slug: string): Promise<Space | null>;
  getByIds(ids: readonly string[]): Promise<readonly Space[]>;
}
