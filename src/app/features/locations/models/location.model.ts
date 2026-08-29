import { ContentSeo } from '../../../shared/content/content-seo';
import { LocalizedValue } from '../../../shared/content/localized-value';
import { MediaAsset } from '../../../shared/content/media-asset';

export interface Location {
  readonly id: string;
  readonly slug: LocalizedValue<string>;
  readonly name: LocalizedValue<string>;
  readonly region?: LocalizedValue<string>;
  readonly description?: LocalizedValue<string>;
  readonly hero?: MediaAsset;
  readonly projectIds: readonly string[];
  readonly serviceIds: readonly string[];
  readonly seo?: ContentSeo;
}
