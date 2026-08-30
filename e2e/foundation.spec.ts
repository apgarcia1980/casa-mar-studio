import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const locale of ['en', 'es'] as const) {
  test(`/${locale} is SSR-rendered with localized SEO`, async ({ page, request }) => {
    const response = await request.get(`/${locale}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('class="cinematic-hero"');
    expect(html).toContain('<video');
    expect(html).toContain('hero-poster-demo');
    expect(html).toContain(
      locale === 'en'
        ? 'Interiors shaped by light, material and place.'
        : 'Interiores definidos por la luz, la materia y el lugar.',
    );
    expect(html).toContain('<meta name="description"');
    expect(html).toContain(`rel="canonical" href="http://localhost:4000/${locale}"`);
    expect(html).toContain('hreflang="en"');
    expect(html).toContain('hreflang="es"');
    expect(html).toContain('hreflang="x-default"');
    expect(html).toContain(locale === 'en' ? 'Skip to content' : 'Saltar al contenido');
    expect(html).not.toContain('accessibility.skipToContent');
    await page.goto(`/${locale}`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `http://localhost:4000/${locale}`,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}

test('unknown routes return a branded HTTP 404', async ({ request }) => {
  const response = await request.get('/route-that-does-not-exist');
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain('Page not found');
});

test('cinematic hero exposes semantic content, fallback media and controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en');
  await expect(page.locator('.cinematic-hero')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Interiors shaped by light, material and place.',
  );
  await expect(page.locator('.hero-poster img')).toBeVisible();
  await expect(page.locator('.site-header')).toHaveClass(/site-header--overlay/);

  const sound = page.getByRole('button', { name: 'Sound off' });
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await sound.click();
  await expect(page.getByRole('button', { name: 'Sound on' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Sound on' }).click();
  await expect(page.getByRole('button', { name: 'Sound off' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );

  const pause = page.getByRole('button', { name: 'Pause motion' });
  await pause.click();
  await expect(page.getByRole('button', { name: 'Play motion' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Play motion' }).click();
  await expect(page.getByRole('button', { name: 'Pause motion' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

for (const locale of ['en', 'es'] as const) {
  test(`Explore reaches Home Intro without reloading on /${locale}`, async ({ page }) => {
    if (locale === 'es') await page.emulateMedia({ reducedMotion: 'reduce' });

    let documentRequests = 0;
    page.on('request', (request) => {
      if (request.resourceType() === 'document') documentRequests += 1;
    });

    await page.goto(`/${locale}`);
    documentRequests = 0;
    await page.evaluate(() => {
      document.documentElement.dataset['anchorIdentity'] = 'retained';
    });

    await page.getByRole('link', { name: locale === 'en' ? 'Explore' : 'Explorar' }).click();

    await expect(page).toHaveURL(`/${locale}#home-intro`);
    const intro = page.locator('#home-intro');
    await expect(intro).toBeInViewport();
    await expect(intro.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-anchor-identity', 'retained');
    expect(documentRequests).toBe(0);

    await expect
      .poll(() =>
        intro.evaluate((element) => {
          const headerOffset = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--header-block-size'),
          );
          return Math.abs(element.getBoundingClientRect().top - headerOffset);
        }),
      )
      .toBeLessThanOrEqual(2);
  });
}

test('reduced motion starts static and prevents video autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  await expect(page.locator('.hero-video')).not.toHaveAttribute('autoplay', '');
  await expect(page.locator('.hero-video')).toHaveAttribute('preload', 'none');
  await expect(page.getByRole('button', { name: 'Play motion' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('Save-Data policy avoids automatic video transfer', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
  });
  await page.goto('/en');
  await expect(page.locator('.hero-video')).not.toHaveAttribute('autoplay', '');
  await expect(page.locator('.hero-video')).toHaveAttribute('preload', 'none');
});

test('home reflows without clipping controls at mobile widths', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/es');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sonido desactivado' })).toBeVisible();
    const layout = await page.evaluate(() => {
      const cue = document.querySelector('.scroll-cue')?.getBoundingClientRect();
      const statement = document.querySelector('.hero-statement')?.getBoundingClientRect();
      const controls = document.querySelector('.hero-controls')?.getBoundingClientRect();
      return {
        cueBottom: cue?.bottom ?? 0,
        statementTop: statement?.top ?? 0,
        statementBottom: statement?.bottom ?? 0,
        controlsTop: controls?.top ?? 0,
        controlsBottom: controls?.bottom ?? 0,
      };
    });
    expect(layout.cueBottom, `scroll cue overlaps statement at ${width}px`).toBeLessThanOrEqual(
      layout.statementTop,
    );
    expect(layout.statementBottom, `statement overlaps controls at ${width}px`).toBeLessThanOrEqual(
      layout.controlsTop,
    );
    expect(layout.controlsBottom, `controls leave viewport at ${width}px`).toBeLessThanOrEqual(812);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test('root and trailing slash policies use permanent redirects', async ({ request }) => {
  const root = await request.get('/', { maxRedirects: 0 });
  expect(root.status()).toBe(308);
  expect(root.headers()['location']).toBe('/en');
  const trailingSlash = await request.get('/es/', { maxRedirects: 0 });
  expect(trailingSlash.status()).toBe(308);
  expect(trailingSlash.headers()['location']).toBe('/es');
});

test('manual theme is applied during SSR from its cookie', async ({ request }) => {
  const response = await request.get('/en', { headers: { cookie: 'casa_mar_theme=dark' } });
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain('<html lang="en" data-theme="dark"');
});

test('skip link is the first keyboard focus target', async ({ page }) => {
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('desktop header exposes the brand and RouteId navigation', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Casa Mar Studio home' })).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' }).first();
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link')).toHaveCount(4);
});

test('language switching preserves the localized design-system context', async ({ page }) => {
  await page.goto('/en/design-system');
  const languages = page.getByRole('group', { name: 'Choose language' }).first();
  await languages.getByRole('link', { name: 'View this page in Spanish' }).click();
  await expect(page).toHaveURL('/es/sistema-diseno');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('theme selection is visible, reusable and persisted for SSR', async ({ page }) => {
  await page.goto('/en/design-system');
  await page.getByRole('button', { name: 'Dark' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'High contrast' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
});

test('mobile menu supports Escape and restores focus to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en');
  const trigger = page.getByRole('button', { name: 'Open navigation menu' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = page.getByRole('dialog', { name: 'Mobile navigation' });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

for (const route of ['/en/design-system', '/es/sistema-diseno']) {
  test(`${route} is SSR-rendered and excluded from indexing`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('name="robots" content="noindex,nofollow"');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain(route.startsWith('/en') ? 'Design System Preview' : 'sistema de diseño');
  });
}

test('design preview reflows without horizontal overflow at representative widths', async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/design-system');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test('design preview has no critical or serious axe violations on desktop and mobile', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/en/design-system');
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(({ impact }) => ['critical', 'serious'].includes(impact ?? '')),
    ).toEqual([]);
  }
});
