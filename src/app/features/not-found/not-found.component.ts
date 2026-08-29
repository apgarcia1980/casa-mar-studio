import { ChangeDetectionStrategy, Component, inject, RESPONSE_INIT } from '@angular/core';
import { Router } from '@angular/router';
import { localeFromPath } from '../../core/i18n/locale.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private readonly router = inject(Router);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly locale = localeFromPath(this.router.url);
  protected readonly i18n = inject(TranslationService);
  constructor() {
    if (this.responseInit) this.responseInit.status = 404;
    inject(SeoService).apply({
      title: this.i18n.translateFor(this.locale, 'seo.notFound.title'),
      description: this.i18n.translateFor(this.locale, 'seo.notFound.description'),
      canonicalPath: this.router.url.split(/[?#]/)[0] || '/',
      locale: this.locale,
      robots: 'noindex,follow',
      openGraph: { type: 'website' },
      twitterCard: 'summary',
    });
  }
}
