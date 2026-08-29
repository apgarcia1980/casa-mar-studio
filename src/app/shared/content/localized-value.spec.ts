import { describe, expect, it } from 'vitest';
import { localize, localizeOptional } from './localized-value';

describe('localized values', () => {
  it('resolves values by URL locale', () => {
    const value = { en: 'English content', es: 'Contenido en español' } as const;
    expect(localize(value, 'en')).toBe('English content');
    expect(localize(value, 'es')).toBe('Contenido en español');
  });

  it('makes absence explicit for incomplete draft content', () => {
    expect(localizeOptional({ en: 'Draft' }, 'es')).toBeNull();
  });
});
