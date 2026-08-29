import { describe, expect, it } from 'vitest';
import { mergeContentSeo } from './content-seo.mapper';
import { SeoDescriptor } from './seo.models';

const pageSeo: SeoDescriptor = {
  title: 'Generated title',
  description: 'Generated description',
  canonicalPath: '/en/projects/demo',
  locale: 'en',
};

describe('content SEO mapping', () => {
  it('combines localized entity overrides with generated page SEO', () => {
    const merged = mergeContentSeo(
      pageSeo,
      {
        title: { en: 'Content title', es: 'Título de contenido' },
        description: { en: 'Content description', es: 'Descripción de contenido' },
        noIndex: true,
      },
      'es',
    );
    expect(merged.title).toBe('Título de contenido');
    expect(merged.description).toBe('Descripción de contenido');
    expect(merged.robots).toBe('noindex,follow');
    expect(merged.canonicalPath).toBe(pageSeo.canonicalPath);
  });
});
