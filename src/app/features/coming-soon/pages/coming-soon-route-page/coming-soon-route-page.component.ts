import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComingSoonPageComponent, ComingSoonVariant } from '../../../../shared/ui/coming-soon-page/coming-soon-page.component';
import { MediaAsset } from '../../../../shared/content/media-asset';
import { Locale } from '../../../../core/i18n/locale.model';
import { buildLocalizedPath, RouteId } from '../../../../core/i18n/route-registry';
import { TranslationKey } from '../../../../core/i18n/translation.types';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { SeoService } from '../../../../core/seo/seo.service';

type ComingSoonKind = 'projects' | 'materials';

interface ComingSoonRouteConfig {
  readonly section: string;
  readonly kind: ComingSoonKind;
  readonly image: MediaAsset;
  readonly variant: ComingSoonVariant;
  readonly routeId: RouteId;
}

const projectsImage: MediaAsset = {
  id: 'coming-soon-projects',
  src: '/media/coming-soon/projects-light.png',
  width: 1672,
  height: 941,
  sources: [{ src: '/media/coming-soon/projects-light.png', type: 'image/png', width: 1672 }],
  focalPoint: { x: 0.52, y: 0.5 },
  decorative: false,
  alt: { en: 'Sunlit Mediterranean interior opening to the sea', es: 'Interior mediterráneo iluminado y abierto al mar' },
};

const materialsImage: MediaAsset = {
  id: 'coming-soon-materials',
  src: '/media/coming-soon/materials-dark.png',
  width: 1672,
  height: 941,
  sources: [{ src: '/media/coming-soon/materials-dark.png', type: 'image/png', width: 1672 }],
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: { en: 'A graphic study of timber, storage and material', es: 'Un estudio gráfico de madera, almacenaje y materia' },
};

const routeConfigs: Readonly<Record<ComingSoonKind, ComingSoonRouteConfig>> = {
  projects: { section: '03', kind: 'projects', image: projectsImage, variant: 'light', routeId: RouteId.Projects },
  materials: { section: '04', kind: 'materials', image: materialsImage, variant: 'dark', routeId: RouteId.Materials },
};

@Component({
  selector: 'app-coming-soon-route-page',
  imports: [ComingSoonPageComponent],
  templateUrl: './coming-soon-route-page.component.html',
  styleUrl: './coming-soon-route-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonRoutePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(TranslationService);
  protected readonly locale = this.route.snapshot.data['locale'] as Locale;
  private readonly config = routeConfigs[this.route.snapshot.data['comingSoon'] as ComingSoonKind];

  protected readonly content = computed(() => {
    const root = `comingSoon.${this.config.kind}`;
    return {
      ...this.config,
      title: this.t(`${root}.title`),
      subtitle: this.t(`${root}.subtitle`),
      description: this.t(`${root}.description`),
      secondaryText: this.t(`${root}.secondaryText`),
      ctaLabel: this.t('comingSoon.exploreHome'),
      imageAlt: this.config.image.decorative ? '' : this.config.image.alt[this.locale],
      ctaRoute: buildLocalizedPath(RouteId.Home, this.locale),
    };
  });

  constructor() {
    inject(SeoService).apply({
      title: this.t(`seo.${this.config.kind}.title`),
      description: this.t(`seo.${this.config.kind}.description`),
      canonicalPath: buildLocalizedPath(this.config.routeId, this.locale),
      locale: this.locale,
      alternates: [
        { hreflang: 'en', path: buildLocalizedPath(this.config.routeId, 'en') },
        { hreflang: 'es', path: buildLocalizedPath(this.config.routeId, 'es') },
        { hreflang: 'x-default', path: buildLocalizedPath(this.config.routeId, 'en') },
      ],
      openGraph: {
        type: 'website',
        title: this.t(`seo.${this.config.kind}.title`),
        description: this.t(`seo.${this.config.kind}.description`),
        imagePath: this.config.image.src,
      },
      twitterCard: 'summary_large_image',
    });
  }

  private t(key: string): string {
    return this.i18n.translateFor(this.locale, key as TranslationKey);
  }
}
