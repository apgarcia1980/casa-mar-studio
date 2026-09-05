import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Locale } from '../../../../core/i18n/locale.model';
import { buildLocalizedPath, RouteId } from '../../../../core/i18n/route-registry';
import { SeoService } from '../../../../core/seo/seo.service';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { localize } from '../../../../shared/content/localized-value';
import { DEMO_SPACES } from '../../data-access/demo-spaces';
import { DepthGalleryComponent, DepthGalleryItem } from '../../components/depth-gallery/depth-gallery.component';

@Component({
  selector: 'app-spaces-page',
  imports: [DepthGalleryComponent],
  templateUrl: './spaces-page.component.html',
  styleUrl: './spaces-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacesPageComponent {
  protected readonly locale = inject(ActivatedRoute).snapshot.data['locale'] as Locale;
  protected readonly i18n = inject(TranslationService);
  protected readonly items = computed<readonly DepthGalleryItem[]>(() => {
    const palettes: readonly (readonly [string, string, string])[] = [
      ['#f1e7d4', '#d7b87e', '#8aa095'],
      ['#ded2bd', '#bb8d55', '#76624c'],
      ['#e9ded0', '#cfad85', '#7e9279'],
      ['#e0d4c5', '#c09b72', '#7c9dac'],
      ['#d8d2bd', '#aeb88d', '#7b937c'],
    ];
    const existing = DEMO_SPACES.flatMap((space, index) => {
      if (!space.hero) return [];
      return [{
        id: space.id,
        index: String(index + 1).padStart(2, '0'),
        title: localize(space.name, this.locale),
        image: space.hero.src,
        imageAlt: space.hero.decorative ? '' : localize(space.hero.alt, this.locale),
        description: localize(space.description, this.locale),
        colors: palettes[index],
      }];
    });
    return [...existing, {
      id: 'bedroom',
      index: '06',
      title: this.i18n.translateFor(this.locale, 'spacesPage.gallery.bedroom.title'),
      description: this.i18n.translateFor(this.locale, 'spacesPage.gallery.bedroom.description'),
      image: '/media/spaces/bedroom-editorial.png',
      imageAlt: this.i18n.translateFor(this.locale, 'spacesPage.gallery.bedroom.imageAlt'),
      colors: ['#e9dfcd', '#c99b70', '#819494'],
    }, {
      id: 'dining',
      index: '07',
      title: this.i18n.translateFor(this.locale, 'spacesPage.gallery.dining.title'),
      description: this.i18n.translateFor(this.locale, 'spacesPage.gallery.dining.description'),
      image: '/media/spaces/dining-editorial.png',
      imageAlt: this.i18n.translateFor(this.locale, 'spacesPage.gallery.dining.imageAlt'),
      colors: ['#e7d8c2', '#bc8959', '#77845d'],
    }];
  });

  constructor() {
    const title = this.i18n.translateFor(this.locale, 'seo.spaces.title');
    const description = this.i18n.translateFor(this.locale, 'seo.spaces.description');
    inject(SeoService).apply({
      title,
      description,
      canonicalPath: buildLocalizedPath(RouteId.Spaces, this.locale),
      locale: this.locale,
      alternates: [
        { hreflang: 'en', path: buildLocalizedPath(RouteId.Spaces, 'en') },
        { hreflang: 'es', path: buildLocalizedPath(RouteId.Spaces, 'es') },
        { hreflang: 'x-default', path: buildLocalizedPath(RouteId.Spaces, 'en') },
      ],
      openGraph: { type: 'website', title, description, imagePath: '/media/spaces/living-editorial.png' },
      twitterCard: 'summary_large_image',
    });
  }
}
