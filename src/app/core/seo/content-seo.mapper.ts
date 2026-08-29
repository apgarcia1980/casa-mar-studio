import { ContentSeo } from '../../shared/content/content-seo';
import { localize } from '../../shared/content/localized-value';
import { Locale } from '../i18n/locale.model';
import { SeoDescriptor } from './seo.models';

export function mergeContentSeo(
  pageSeo: SeoDescriptor,
  contentSeo: ContentSeo | undefined,
  locale: Locale,
): SeoDescriptor {
  if (!contentSeo) return pageSeo;
  const title = contentSeo.title ? localize(contentSeo.title, locale) : pageSeo.title;
  const description = contentSeo.description
    ? localize(contentSeo.description, locale)
    : pageSeo.description;
  return {
    ...pageSeo,
    title,
    description,
    robots: contentSeo.noIndex ? 'noindex,follow' : pageSeo.robots,
    socialImagePath: contentSeo.socialImage?.src ?? pageSeo.socialImagePath,
    openGraph: { ...pageSeo.openGraph, title, description },
  };
}
