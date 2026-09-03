import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { PlatformService } from '../../../core/platform/platform.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { MediaAsset } from '../../content/media-asset';

export interface PinnedRevealLink {
  readonly label: string;
  readonly href: string;
}

export interface PinnedRevealItem {
  readonly id: string;
  readonly index?: string;
  readonly title: string;
  readonly description?: string;
  readonly image: MediaAsset;
  readonly imageAlt: string;
  readonly link?: PinnedRevealLink;
}

@Component({
  selector: 'app-pinned-reveal',
  templateUrl: './pinned-reveal.component.html',
  styleUrl: './pinned-reveal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinnedRevealComponent {
  private readonly platform = inject(PlatformService);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private animationCleanup: () => void = () => undefined;
  private animationInitialized = false;

  readonly items = input.required<readonly PinnedRevealItem[]>();
  readonly headingLevel = input(3);
  readonly backgroundTokens = input<readonly string[]>([]);
  protected readonly enhanced = signal(false);

  constructor() {
    afterNextRender(() => void this.initializePinnedReveal());
    this.destroyRef.onDestroy(() => this.animationCleanup());

    effect(() => {
      this.themeService.theme();
      if (!this.animationInitialized) return;

      this.animationCleanup();
      this.animationCleanup = () => undefined;
      this.enhanced.set(false);
      requestAnimationFrame(() => void this.initializePinnedReveal());
    });
  }

  protected stackOrder(index: number): number {
    return this.items().length - index;
  }

  protected objectPosition(item: PinnedRevealItem): string {
    const focalPoint = item.image.focalPoint;
    return focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : 'center';
  }

  private async initializePinnedReveal(): Promise<void> {
    if (this.platform.matchesMedia('(prefers-reduced-motion: reduce)')) {
      return;
    }

    const root = this.root()?.nativeElement;
    if (!root || this.destroyRef.destroyed) return;

    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (this.destroyRef.destroyed) return;

      const layout = root.querySelector<HTMLElement>('[data-pinned-reveal-layout]');
      const mediaColumn = root.querySelector<HTMLElement>('[data-pinned-reveal-media]');
      const images = Array.from(root.querySelectorAll<HTMLImageElement>('[data-pinned-reveal-image]'));
      const backgroundImages = Array.from(
        root.querySelectorAll<HTMLImageElement>('[data-pinned-reveal-background-image]'),
      );
      const mobileLayout = root.querySelector<HTMLElement>('[data-pinned-reveal-mobile]');
      const mobileImages = Array.from(
        root.querySelectorAll<HTMLImageElement>('[data-pinned-reveal-mobile-image]'),
      );
      const mobileCopies = Array.from(
        root.querySelectorAll<HTMLElement>('[data-pinned-reveal-mobile-copy]'),
      );
      if (
        !layout ||
        !mediaColumn ||
        images.length < 2 ||
        backgroundImages.length !== images.length ||
        !mobileLayout ||
        mobileImages.length !== images.length ||
        mobileCopies.length !== images.length
      ) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      this.enhanced.set(true);
      const computedStyle = getComputedStyle(root);
      const backgrounds = this.backgroundTokens()
        .map((token) => computedStyle.getPropertyValue(token).trim())
        .filter(Boolean);

      const mediaQueries = gsap.matchMedia();
      const createDesktopReveal = (): (() => void) => {
        const context = gsap.context(() => {
          gsap.set(images, { clipPath: 'inset(0% 0% 0% 0%)', objectPosition: 'center 50%' });
          gsap.set(backgroundImages, { opacity: 0 });
          gsap.set(backgroundImages[0], { opacity: 1 });
          if (backgrounds.length) gsap.set(root, { backgroundColor: backgrounds[0] });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: layout,
              start: 'top top',
              end: 'bottom bottom',
              pin: mediaColumn,
              anticipatePin: 1,
              scrub: true,
            },
          });

          images.slice(0, -1).forEach((image, index) => {
            const transition = gsap.timeline();

            transition
              .to(
                image,
                {
                  clipPath: 'inset(0% 0% 100% 0%)',
                  objectPosition: 'center 60%',
                  duration: 1.5,
                  ease: 'none',
                },
                0,
              )
              .to(
                images[index + 1],
                {
                  objectPosition: 'center 40%',
                  duration: 1.5,
                  ease: 'none',
                },
                0,
              )
              .to(backgroundImages[index], { opacity: 0, duration: 1.5, ease: 'none' }, 0)
              .to(backgroundImages[index + 1], { opacity: 1, duration: 1.5, ease: 'none' }, 0);

            const nextBackground = backgrounds[Math.min(index + 1, backgrounds.length - 1)];
            if (nextBackground) {
              transition.to(root, {
                backgroundColor: nextBackground,
                duration: 1.5,
                ease: 'power1.inOut',
              }, 0);
            }

            timeline.add(transition);
          });
        }, root);

        return () => context.revert();
      };

      const createMobileReveal = (): (() => void) => {
        const context = gsap.context(() => {
          gsap.set(mobileImages, { clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.set(backgroundImages, { opacity: 0 });
          gsap.set(backgroundImages[0], { opacity: 1 });
          gsap.set(mobileCopies, { xPercent: 100 });
          gsap.set(mobileCopies[0], { xPercent: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: mobileLayout,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          });

          mobileImages.slice(0, -1).forEach((image, index) => {
            timeline
              .to(mobileCopies[index], { xPercent: -100, duration: 1.5, ease: 'none' })
              .to(mobileCopies[index + 1], { xPercent: 0, duration: 1.5, ease: 'none' }, '<')
              .to(image, { clipPath: 'inset(0% 0% 0% 100%)', duration: 1.5, ease: 'none' }, '<')
              .to(backgroundImages[index], { opacity: 0, duration: 1.5, ease: 'none' }, '<')
              .to(backgroundImages[index + 1], { opacity: 1, duration: 1.5, ease: 'none' }, '<');
          });
        }, root);

        return () => context.revert();
      };

      mediaQueries.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () =>
        createDesktopReveal(),
      );
      mediaQueries.add('(max-width: 63.999rem) and (prefers-reduced-motion: no-preference)', () =>
        createMobileReveal(),
      );

      this.animationCleanup = () => mediaQueries.revert();
      this.animationInitialized = true;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } catch {
      this.enhanced.set(false);
    }
  }
}
