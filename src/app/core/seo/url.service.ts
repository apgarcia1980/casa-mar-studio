import { DOCUMENT } from '@angular/common';
import { inject, Injectable, REQUEST } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });

  absolute(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const origin = this.request ? new URL(this.request.url).origin : this.document.location?.origin;
    if (!origin || origin === 'null')
      throw new Error('A request or browser origin is required to build an absolute SEO URL.');
    return new URL(normalizedPath, origin).toString();
  }
}
