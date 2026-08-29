import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface PublicConfig {
  readonly apiBasePath: string;
  readonly defaultLocale: 'en';
  readonly supportedLocales: readonly ['en', 'es'];
}

export const PUBLIC_CONFIG = new InjectionToken<PublicConfig>('PUBLIC_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiBasePath: environment.apiBasePath,
    defaultLocale: 'en',
    supportedLocales: ['en', 'es'],
  }),
});
