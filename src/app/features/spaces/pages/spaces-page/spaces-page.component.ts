import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Locale } from '../../../../core/i18n/locale.model';
import { buildLocalizedPath, RouteId } from '../../../../core/i18n/route-registry';
import { SeoService } from '../../../../core/seo/seo.service';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { localize } from '../../../../shared/content/localized-value';
import { ButtonLinkComponent } from '../../../../shared/ui/button-link/button-link.component';
import { DEMO_SPACES } from '../../data-access/demo-spaces';

@Component({
  selector: 'app-spaces-page',
  imports: [ButtonLinkComponent],
  templateUrl: './spaces-page.component.html',
  styleUrl: './spaces-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacesPageComponent {
  protected readonly locale = inject(ActivatedRoute).snapshot.data['locale'] as Locale;
  protected readonly i18n = inject(TranslationService);
  protected readonly homePath = buildLocalizedPath(RouteId.Home, this.locale);
  protected readonly cards = computed(() =>
    DEMO_SPACES.flatMap((space, index) => {
      if (!space.hero) return [];

      return [{
        id: space.id,
        index: String(index + 1).padStart(2, '0'),
        title: localize(space.name, this.locale),
        image: space.hero.src,
        imageAlt: space.hero.decorative ? '' : localize(space.hero.alt, this.locale),
        note: localize(space.description, this.locale),
      }];
    }),
  );

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
