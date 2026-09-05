import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonLinkComponent } from '../../../../shared/ui/button-link/button-link.component';
import { Locale } from '../../../../core/i18n/locale.model';
import { buildLocalizedPath, RouteId } from '../../../../core/i18n/route-registry';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { SeoService } from '../../../../core/seo/seo.service';

@Component({
  selector: 'app-studio-page',
  imports: [ButtonLinkComponent],
  templateUrl: './studio-page.component.html',
  styleUrl: './studio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
  protected readonly locale = inject(ActivatedRoute).snapshot.data['locale'] as Locale;
  protected readonly i18n = inject(TranslationService);
  protected readonly homePath = buildLocalizedPath(RouteId.Home, this.locale);
  protected readonly principles = [
    {
      title: this.i18n.translateFor(this.locale, 'studioPage.principles.light.title'),
      description: this.i18n.translateFor(this.locale, 'studioPage.principles.light.description'),
    },
    {
      title: this.i18n.translateFor(this.locale, 'studioPage.principles.materiality.title'),
      description: this.i18n.translateFor(this.locale, 'studioPage.principles.materiality.description'),
    },
    {
      title: this.i18n.translateFor(this.locale, 'studioPage.principles.proportion.title'),
      description: this.i18n.translateFor(this.locale, 'studioPage.principles.proportion.description'),
    },
    {
      title: this.i18n.translateFor(this.locale, 'studioPage.principles.calmLiving.title'),
      description: this.i18n.translateFor(this.locale, 'studioPage.principles.calmLiving.description'),
    },
  ] as const;

  constructor() {
    const title = this.i18n.translateFor(this.locale, 'seo.studio.title');
    const description = this.i18n.translateFor(this.locale, 'seo.studio.description');
    inject(SeoService).apply({
      title,
      description,
      canonicalPath: buildLocalizedPath(RouteId.Studio, this.locale),
      locale: this.locale,
      alternates: [
        { hreflang: 'en', path: buildLocalizedPath(RouteId.Studio, 'en') },
        { hreflang: 'es', path: buildLocalizedPath(RouteId.Studio, 'es') },
        { hreflang: 'x-default', path: buildLocalizedPath(RouteId.Studio, 'en') },
      ],
      openGraph: { type: 'website', title, description, imagePath: '/media/coming-soon/projects-light.png' },
      twitterCard: 'summary_large_image',
    });
  }
}
