import { DestroyRef, inject, Injectable, isDevMode, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import englishDictionary from '../../../../public/i18n/en.json';
import spanishDictionary from '../../../../public/i18n/es.json';
import { localeFromPath, Locale } from './locale.model';
import { TranslationDictionary, TranslationKey } from './translation.types';

const dictionaries: Readonly<Record<Locale, TranslationDictionary>> = {
  en: englishDictionary,
  es: spanishDictionary,
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activeLocale = signal<Locale>(localeFromPath(this.router.url));
  readonly locale = this.activeLocale.asReadonly();

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart | NavigationEnd =>
            event instanceof NavigationStart || event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) =>
        this.activeLocale.set(
          localeFromPath(event instanceof NavigationEnd ? event.urlAfterRedirects : event.url),
        ),
      );
  }

  t(key: TranslationKey): string {
    return this.translateFor(this.locale(), key);
  }

  translateFor(locale: Locale, key: TranslationKey): string {
    const translated = this.resolve(dictionaries[locale], key);
    if (translated !== undefined) return translated;

    if (isDevMode()) console.warn(`Missing translation: ${key} (${locale})`);
    return this.resolve(dictionaries.en, key) ?? '';
  }

  private resolve(dictionary: TranslationDictionary, key: TranslationKey): string | undefined {
    let value: unknown = dictionary;
    for (const segment of key.split('.')) {
      if (typeof value !== 'object' || value === null || !(segment in value)) return undefined;
      value = (value as Readonly<Record<string, unknown>>)[segment];
    }
    return typeof value === 'string' ? value : undefined;
  }
}
