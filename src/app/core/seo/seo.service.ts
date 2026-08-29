import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { angularLocaleByLocale } from '../i18n/locale.model';
import { JsonLdObject, SeoDescriptor } from './seo.models';
import { UrlService } from './url.service';

const MANAGED_LINK = 'data-casa-mar-seo';
const JSON_LD_CLASS = 'casa-mar-json-ld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly urls = inject(UrlService);

  apply(descriptor: SeoDescriptor): void {
    this.title.setTitle(descriptor.title);
    this.document.documentElement.lang = descriptor.locale;
    this.setName('description', descriptor.description);
    this.setName('robots', descriptor.robots ?? 'index,follow');
    this.setProperty('og:type', descriptor.openGraph?.type ?? 'website');
    this.setProperty('og:title', descriptor.openGraph?.title ?? descriptor.title);
    this.setProperty('og:description', descriptor.openGraph?.description ?? descriptor.description);
    this.setProperty('og:url', this.urls.absolute(descriptor.canonicalPath));
    this.setProperty('og:locale', angularLocaleByLocale[descriptor.locale].replace('-', '_'));
    this.setName('twitter:card', descriptor.twitterCard ?? 'summary_large_image');
    const socialImage = descriptor.openGraph?.imagePath ?? descriptor.socialImagePath;
    if (socialImage) this.setProperty('og:image', this.urls.absolute(socialImage));
    else this.meta.removeTag("property='og:image'");
    this.replaceLinks(descriptor);
    this.replaceJsonLd(descriptor.jsonLd ?? []);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name='${name}'`);
  }
  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private replaceLinks(descriptor: SeoDescriptor): void {
    this.document.head
      .querySelectorAll(`link[${MANAGED_LINK}]`)
      .forEach((element) => element.remove());
    this.appendLink('canonical', this.urls.absolute(descriptor.canonicalPath));
    descriptor.alternates?.forEach((alternate) =>
      this.appendLink('alternate', this.urls.absolute(alternate.path), alternate.hreflang),
    );
  }

  private appendLink(rel: string, href: string, hreflang?: string): void {
    const link = this.document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.setAttribute(MANAGED_LINK, '');
    if (hreflang) link.hreflang = hreflang;
    this.document.head.appendChild(link);
  }

  private replaceJsonLd(items: readonly JsonLdObject[]): void {
    this.document.head
      .querySelectorAll(`script.${JSON_LD_CLASS}`)
      .forEach((element) => element.remove());
    items.forEach((item) => {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.className = JSON_LD_CLASS;
      script.textContent = JSON.stringify(item).replaceAll('<', '\\u003c');
      this.document.head.appendChild(script);
    });
  }
}
