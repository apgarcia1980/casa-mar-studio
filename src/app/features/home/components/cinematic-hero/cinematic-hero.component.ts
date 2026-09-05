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
  OrbitalMediaCompositionComponent,
  OrbitalMediaItem,
} from '../../../../shared/ui/orbital-media-composition/orbital-media-composition.component';

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

const blueScene: MediaAsset = {
  id: 'hero-orbit-blue',
  src: '/media/home/orbit/hero-blue.png',
  width: 1456,
  height: 1088,
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Contemporary kitchen with a marble island and natural light',
    es: 'Cocina contemporánea con isla de mármol y luz natural',
  },
};

const yellowScene: MediaAsset = {
  id: 'hero-orbit-yellow',
  src: '/media/home/orbit/hero-yellow.png',
  width: 1456,
  height: 1088,
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Stone bathroom with a freestanding bath and shower',
    es: 'Baño de piedra con bañera exenta y ducha',
  },
};

const orangeScene: MediaAsset = {
  id: 'hero-orbit-orange',
  src: '/media/home/orbit/hero-orange.png',
  width: 1456,
  height: 1088,
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: { en: 'Light-filled living space', es: 'Salón luminoso' },
};

@Component({
  selector: 'app-cinematic-hero',
  templateUrl: './cinematic-hero.component.html',
  styleUrl: './cinematic-hero.component.scss',
  imports: [OrbitalMediaCompositionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinematicHeroComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly motionPaused = signal(false);
  protected readonly heroScenes = computed<readonly OrbitalMediaItem[]>(() => [
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
      id: orangeScene.id,
      image: orangeScene,
      imageAlt: this.i18n.t('home.hero.orbit.orange.imageAlt'),
      index: this.i18n.t('home.hero.orbit.orange.index'),
      eyebrow: this.i18n.t('home.hero.orbit.orange.eyebrow'),
      title: this.i18n.t('home.hero.orbit.orange.title'),
      description: this.i18n.t('home.hero.orbit.orange.description'),
    },
    {
      id: blueScene.id,
      image: blueScene,
      imageAlt: this.i18n.t('home.hero.orbit.blue.imageAlt'),
      index: this.i18n.t('home.hero.orbit.blue.index'),
      eyebrow: this.i18n.t('home.hero.orbit.blue.eyebrow'),
      title: this.i18n.t('home.hero.orbit.blue.title'),
      description: this.i18n.t('home.hero.orbit.blue.description'),
    },
    {
      id: yellowScene.id,
      image: yellowScene,
      imageAlt: this.i18n.t('home.hero.orbit.yellow.imageAlt'),
      index: this.i18n.t('home.hero.orbit.yellow.index'),
      eyebrow: this.i18n.t('home.hero.orbit.yellow.eyebrow'),
      title: this.i18n.t('home.hero.orbit.yellow.title'),
      description: this.i18n.t('home.hero.orbit.yellow.description'),
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
