import { Locale } from '../../core/i18n/locale.model';

export type LocalizedValue<Value> = Readonly<Record<Locale, Value>>;
export type PartialLocalizedValue<Value> = Readonly<Partial<Record<Locale, Value>>>;

export function localize<Value>(value: LocalizedValue<Value>, locale: Locale): Value {
  return value[locale];
}

export function localizeOptional<Value>(
  value: PartialLocalizedValue<Value>,
  locale: Locale,
): Value | null {
  return value[locale] ?? null;
}
