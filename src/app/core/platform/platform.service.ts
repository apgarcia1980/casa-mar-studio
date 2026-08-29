import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true });
  readonly isBrowser = isPlatformBrowser(this.platformId);

  getCookie(name: string): string | null {
    const source =
      this.request?.headers.get('cookie') ?? (this.isBrowser ? this.document.cookie : '');
    const prefix = `${encodeURIComponent(name)}=`;
    const entry = source
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));
    return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
  }

  setCookie(name: string, value: string, maxAgeSeconds: number): void {
    if (!this.isBrowser) return;
    this.document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
  }

  matchesMedia(query: string): boolean {
    return this.isBrowser && this.document.defaultView?.matchMedia(query).matches === true;
  }

  saveDataEnabled(): boolean {
    if (!this.isBrowser) return false;
    const navigator = this.document.defaultView?.navigator as
      (Navigator & { connection?: { readonly saveData?: boolean } }) | undefined;
    return navigator?.connection?.saveData === true;
  }
}
