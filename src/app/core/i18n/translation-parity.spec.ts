import { describe, expect, it } from 'vitest';
import englishDictionary from '../../../../public/i18n/en.json';
import spanishDictionary from '../../../../public/i18n/es.json';

function leafKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return prefix ? [prefix] : [];
  return Object.entries(value).flatMap(([key, child]) =>
    leafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('translation dictionary parity', () => {
  it('keeps English and Spanish structural keys identical', () => {
    expect(leafKeys(spanishDictionary).sort()).toEqual(leafKeys(englishDictionary).sort());
  });

  it('contains non-empty strings at every translation leaf', () => {
    for (const dictionary of [englishDictionary, spanishDictionary]) {
      for (const key of leafKeys(dictionary)) {
        const value = key
          .split('.')
          .reduce<unknown>(
            (current, segment) =>
              typeof current === 'object' && current !== null
                ? (current as Readonly<Record<string, unknown>>)[segment]
                : undefined,
            dictionary,
          );
        expect(value, key).toBeTypeOf('string');
        expect((value as string).trim(), key).not.toBe('');
      }
    }
  });
});
