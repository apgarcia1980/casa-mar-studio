import { ContentSeo } from '../../../shared/content/content-seo';
import { LocalizedValue } from '../../../shared/content/localized-value';
import { MediaAsset } from '../../../shared/content/media-asset';

export type MaterialCategory = 'stone' | 'quartz' | 'porcelain' | 'wood' | 'metal' | 'other';

export interface Material {
  readonly id: string;
  readonly slug: LocalizedValue<string>;
  readonly name: LocalizedValue<string>;
  readonly description: LocalizedValue<string>;
  readonly category: MaterialCategory;
  readonly images?: readonly MediaAsset[];
  readonly finish?: LocalizedValue<string>;
  readonly color?: LocalizedValue<string>;
  readonly applications?: LocalizedValue<readonly string[]>;
  readonly projectIds: readonly string[];
  readonly spaceIds: readonly string[];
  readonly seo?: ContentSeo;
}
