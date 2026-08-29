export const supportedLocales = ['en', 'es'] as const;
export type Locale = (typeof supportedLocales)[number];
export type AngularLocale = 'en-US' | 'es-US';
export const angularLocaleByLocale: Readonly<Record<Locale, AngularLocale>> = {
  en: 'en-US',
  es: 'es-US',
};

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function localeFromPath(url: string): Locale {
  const segment = url.split(/[/?#]/).filter(Boolean)[0];
  return isLocale(segment) ? segment : 'en';
}
