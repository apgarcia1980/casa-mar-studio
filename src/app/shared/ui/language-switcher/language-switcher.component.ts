import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  protected readonly i18n = inject(TranslationService);
  protected readonly locale = this.i18n.locale;
  protected readonly options = computed(() => {
    this.locale();
    return (['en', 'es'] as const).map((locale) => ({
      locale,
      path: this.navigation.pathFor(locale),
    }));
  });

  protected labelFor(locale: Locale): string {
    return this.i18n.t(locale === 'en' ? 'language.switchToEnglish' : 'language.switchToSpanish');
  }
}
