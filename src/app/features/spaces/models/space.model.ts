import { ContentSeo } from '../../../shared/content/content-seo';
import { LocalizedValue } from '../../../shared/content/localized-value';
import { MediaAsset } from '../../../shared/content/media-asset';

export type SpaceKind = 'kitchen' | 'closet' | 'bathroom' | 'living-space' | 'outdoor';

export interface Space {
  readonly id: string;
  readonly kind: SpaceKind;
  readonly slug: LocalizedValue<string>;
  readonly name: LocalizedValue<string>;
  readonly description: LocalizedValue<string>;
  readonly hero?: MediaAsset;
  readonly projectIds: readonly string[];
  readonly materialIds: readonly string[];
  readonly seo?: ContentSeo;
}
