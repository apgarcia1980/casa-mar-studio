import { Locale } from '../i18n/locale.model';

export interface SeoAlternate {
  readonly hreflang: Locale | 'x-default';
  readonly path: string;
}
export interface SeoOpenGraph {
  readonly type?: 'website' | 'article';
  readonly title?: string;
  readonly description?: string;
  readonly imagePath?: string;
}
export interface SeoBreadcrumb {
  readonly name: string;
  readonly path: string;
}
export type JsonLdValue = null | boolean | number | string | readonly JsonLdValue[] | JsonLdObject;
export interface JsonLdObject {
  readonly [key: string]: JsonLdValue;
}
export interface SeoDescriptor {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: string;
  readonly locale: Locale;
  readonly robots?: string;
  readonly alternates?: readonly SeoAlternate[];
  readonly openGraph?: SeoOpenGraph;
  readonly twitterCard?: 'summary' | 'summary_large_image';
  readonly socialImagePath?: string;
  readonly breadcrumbs?: readonly SeoBreadcrumb[];
  readonly jsonLd?: readonly JsonLdObject[];
}
