import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Locale } from '../../core/i18n/locale.model';
import { buildLocalizedPath, RouteId } from '../../core/i18n/route-registry';
import { TranslationService } from '../../core/i18n/translation.service';
import { SeoService } from '../../core/seo/seo.service';
import { ButtonLinkComponent } from '../../shared/ui/button-link/button-link.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LanguageSwitcherComponent } from '../../shared/ui/language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../../shared/ui/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-design-system-preview',
  imports: [
    ButtonComponent,
    ButtonLinkComponent,
    LanguageSwitcherComponent,
    ThemeSwitcherComponent,
  ],
  templateUrl: './design-system-preview.component.html',
  styleUrl: './design-system-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSystemPreviewComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly locale = inject(ActivatedRoute).snapshot.data['locale'] as Locale;
  protected readonly homePath = buildLocalizedPath(RouteId.Home, this.locale);
  protected readonly gridColumns = Array.from({ length: 12 });

  constructor() {
    const canonicalPath = buildLocalizedPath(RouteId.DesignSystem, this.locale);
    inject(SeoService).apply({
      title: this.i18n.translateFor(this.locale, 'seo.designSystem.title'),
      description: this.i18n.translateFor(this.locale, 'seo.designSystem.description'),
      canonicalPath,
      locale: this.locale,
      robots: 'noindex,nofollow',
      alternates: [
        { hreflang: 'en', path: buildLocalizedPath(RouteId.DesignSystem, 'en') },
        { hreflang: 'es', path: buildLocalizedPath(RouteId.DesignSystem, 'es') },
        { hreflang: 'x-default', path: buildLocalizedPath(RouteId.DesignSystem, 'en') },
      ],
      openGraph: { type: 'website' },
      twitterCard: 'summary',
    });
  }
}
