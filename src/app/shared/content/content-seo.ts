import { LocalizedValue } from './localized-value';
import { MediaAsset } from './media-asset';

export interface ContentSeo {
  readonly title?: LocalizedValue<string>;
  readonly description?: LocalizedValue<string>;
  readonly socialImage?: MediaAsset;
  readonly noIndex?: boolean;
}
