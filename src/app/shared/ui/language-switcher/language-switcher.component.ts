import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Locale } from '../../../core/i18n/locale.model';
import { LocaleNavigationService } from '../../../core/i18n/locale-navigation.service';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-language-switcher',
  imports: [RouterLink],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  private readonly navigation = inject(LocaleNavigationService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(TranslationService);
  protected readonly locale = this.i18n.locale;
  private readonly routeUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly options = computed(() => {
    this.locale();
    this.routeUrl();
    return (['en', 'es'] as const).map((locale) => ({
      locale,
      path: this.navigation.pathFor(locale),
    }));
  });

  protected labelFor(locale: Locale): string {
    return this.i18n.t(locale === 'en' ? 'language.switchToEnglish' : 'language.switchToSpanish');
  }
}
