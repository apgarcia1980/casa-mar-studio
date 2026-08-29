import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { PlatformService } from '../platform/platform.service';
import { isTheme, Theme } from './theme.model';

const THEME_COOKIE = 'casa_mar_theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PlatformService);
  private readonly selectedTheme = signal<Theme>('system');
  readonly theme = this.selectedTheme.asReadonly();

  initialize(): void {
    const storedTheme = this.platform.getCookie(THEME_COOKIE);
    this.apply(isTheme(storedTheme) ? storedTheme : 'system', false);
  }

  select(theme: Theme): void {
    this.apply(theme, true);
  }

  private apply(theme: Theme, persist: boolean): void {
    this.selectedTheme.set(theme);
    if (theme === 'system') this.document.documentElement.removeAttribute('data-theme');
    else this.document.documentElement.setAttribute('data-theme', theme);
    if (persist) this.platform.setCookie(THEME_COOKIE, theme, COOKIE_MAX_AGE);
  }
}
