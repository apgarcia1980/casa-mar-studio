import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { MediaAsset } from '../../../../shared/content/media-asset';
import {
  MaskRevealItem,
  TimedMaskRevealComponent,
} from '../../../../shared/ui/timed-mask-reveal/timed-mask-reveal.component';

const heroPoster: MediaAsset = {
  id: 'hero-poster-demo',
  src: '/media/home/hero-poster-demo.webp',
  width: 1672,
  height: 941,
  sources: [
    { src: '/media/home/hero-poster-demo.avif', type: 'image/avif' },
  ],
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Sunlit Casa Mar interior',
    es: 'Interior de Casa Mar iluminado por el sol',
  },
};

const kitchenScene: MediaAsset = {
  id: 'hero-kitchen-scene',
  src: '/media/home/hero-scene-kitchen-demo.png',
  width: 1672,
  height: 941,
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Contemporary kitchen with a marble island and natural light',
    es: 'Cocina contemporánea con isla de mármol y luz natural',
  },
};

const bathroomScene: MediaAsset = {
  id: 'hero-bathroom-scene',
  src: '/media/home/hero-scene-bath-demo.png',
  width: 1672,
  height: 941,
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Stone bathroom with a freestanding bath and shower',
    es: 'Baño de piedra con bañera exenta y ducha',
  },
};

const outdoorScene: MediaAsset = {
  id: 'hero-outdoor-scene',
  src: '/media/home/hero-scene-terrace-demo.png',
  width: 1672,
  height: 941,
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Outdoor lounge framed by tropical planting and mountain landscape',
    es: 'Salón exterior enmarcado por vegetación tropical y paisaje de montaña',
  },
};

@Component({
  selector: 'app-cinematic-hero',
  templateUrl: './cinematic-hero.component.html',
  styleUrl: './cinematic-hero.component.scss',
  imports: [TimedMaskRevealComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinematicHeroComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly motionPaused = signal(false);
  protected readonly heroScenes = computed<readonly MaskRevealItem[]>(() => [
    {
      id: heroPoster.id,
      image: heroPoster,
      imageAlt: this.i18n.t('home.hero.scenes.studio.imageAlt'),
      index: this.i18n.t('home.hero.scenes.studio.index'),
      eyebrow: this.i18n.t('home.hero.scenes.studio.eyebrow'),
      title: this.i18n.t('home.hero.scenes.studio.title'),
      description: this.i18n.t('home.hero.scenes.studio.description'),
    },
    {
      id: kitchenScene.id,
      image: kitchenScene,
      imageAlt: this.i18n.t('home.hero.scenes.kitchen.imageAlt'),
      index: this.i18n.t('home.hero.scenes.kitchen.index'),
      eyebrow: this.i18n.t('home.hero.scenes.kitchen.eyebrow'),
      title: this.i18n.t('home.hero.scenes.kitchen.title'),
      description: this.i18n.t('home.hero.scenes.kitchen.description'),
    },
    {
      id: bathroomScene.id,
      image: bathroomScene,
      imageAlt: this.i18n.t('home.hero.scenes.bathroom.imageAlt'),
      index: this.i18n.t('home.hero.scenes.bathroom.index'),
      eyebrow: this.i18n.t('home.hero.scenes.bathroom.eyebrow'),
      title: this.i18n.t('home.hero.scenes.bathroom.title'),
      description: this.i18n.t('home.hero.scenes.bathroom.description'),
    },
    {
      id: outdoorScene.id,
      image: outdoorScene,
      imageAlt: this.i18n.t('home.hero.scenes.outdoor.imageAlt'),
      index: this.i18n.t('home.hero.scenes.outdoor.index'),
      eyebrow: this.i18n.t('home.hero.scenes.outdoor.eyebrow'),
      title: this.i18n.t('home.hero.scenes.outdoor.title'),
      description: this.i18n.t('home.hero.scenes.outdoor.description'),
    },
  ]);

  protected toggleMotion(): void {
    this.motionPaused.update((paused) => !paused);
  }

  protected scrollToIntro(event: MouseEvent): void {
    event.preventDefault();
    const link = event.currentTarget as HTMLAnchorElement;
    const document = link.ownerDocument;
    const target = document.getElementById('home-intro');
    const view = document.defaultView;
    if (!target || !view) return;

    if (view.location.hash !== '#home-intro') {
      view.history.pushState(
        null,
        '',
        `${view.location.pathname}${view.location.search}#home-intro`,
      );
    }

    target.scrollIntoView({
      block: 'start',
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }
}
