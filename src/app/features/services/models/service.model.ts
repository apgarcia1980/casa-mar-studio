import { ContentSeo } from '../../../shared/content/content-seo';
import { LocalizedValue } from '../../../shared/content/localized-value';
import { MediaAsset } from '../../../shared/content/media-asset';

export interface Service {
  readonly id: string;
  readonly slug: LocalizedValue<string>;
  readonly name: LocalizedValue<string>;
  readonly description: LocalizedValue<string>;
  readonly hero?: MediaAsset;
  readonly projectIds: readonly string[];
  readonly seo?: ContentSeo;
}
