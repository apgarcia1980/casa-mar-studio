import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../../../core/i18n/translation.service';
import { Theme, themes } from '../../../core/theme/theme.model';
import { ThemeService } from '../../../core/theme/theme.service';
import { TranslationKey } from '../../../core/i18n/translation.types';

const themeLabels: Readonly<Record<Theme, TranslationKey>> = {
  system: 'theme.options.system',
  light: 'theme.options.light',
  dark: 'theme.options.dark',
  'high-contrast': 'theme.options.highContrast',
};

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly themeService = inject(ThemeService);
  protected readonly themes = themes;

  protected label(theme: Theme): string {
    return this.i18n.t(themeLabels[theme]);
  }

  protected select(theme: Theme): void {
    this.themeService.select(theme);
  }
}
