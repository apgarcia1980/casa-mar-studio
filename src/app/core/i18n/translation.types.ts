import englishDictionary from '../../../../public/i18n/en.json';

type StringKey<T> = Extract<keyof T, string>;
type LeafPaths<T> = {
  [Key in StringKey<T>]: T[Key] extends string
    ? Key
    : T[Key] extends Readonly<Record<string, unknown>>
      ? `${Key}.${LeafPaths<T[Key]>}`
      : never;
}[StringKey<T>];

export type TranslationDictionary = typeof englishDictionary;
export type TranslationKey = LeafPaths<TranslationDictionary>;
