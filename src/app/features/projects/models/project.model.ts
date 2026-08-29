import { ContentSeo } from '../../../shared/content/content-seo';
import { LocalizedValue } from '../../../shared/content/localized-value';
import { MediaAsset } from '../../../shared/content/media-asset';
import { RichTextDocument } from '../../../shared/content/rich-text';

export interface ProjectCredits {
  readonly architect?: string;
  readonly designer?: string;
  readonly photographer?: string;
}

export interface Project {
  readonly id: string;
  readonly slug: LocalizedValue<string>;
  readonly title: LocalizedValue<string>;
  readonly excerpt: LocalizedValue<string>;
  readonly content?: LocalizedValue<RichTextDocument>;
  readonly locationId?: string;
  readonly year?: number;
  readonly coverImage: MediaAsset;
  readonly gallery?: readonly MediaAsset[];
  readonly spaceIds: readonly string[];
  readonly materialIds: readonly string[];
  readonly serviceIds: readonly string[];
  readonly credits?: ProjectCredits;
  readonly featured: boolean;
  readonly publishedAt?: string;
  readonly updatedAt?: string;
  readonly seo?: ContentSeo;
}
