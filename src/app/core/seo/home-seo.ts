import { Locale } from '../i18n/locale.model';
import { buildLocalizedPath, RouteId } from '../i18n/route-registry';
import { TranslationService } from '../i18n/translation.service';
import { SeoDescriptor } from './seo.models';

export function homeSeo(locale: Locale, i18n: TranslationService): SeoDescriptor {
  const canonicalPath = buildLocalizedPath(RouteId.Home, locale);
  const title = i18n.translateFor(locale, 'seo.home.title');
  const description = i18n.translateFor(locale, 'seo.home.description');
  return {
    title,
    description,
    canonicalPath,
    locale,
    alternates: [
      { hreflang: 'en', path: buildLocalizedPath(RouteId.Home, 'en') },
      { hreflang: 'es', path: buildLocalizedPath(RouteId.Home, 'es') },
      { hreflang: 'x-default', path: buildLocalizedPath(RouteId.Home, 'en') },
    ],
    openGraph: {
      type: 'website',
      title,
      description,
      imagePath: '/media/home/hero-poster-demo.webp',
    },
    twitterCard: 'summary_large_image',
  };
}
