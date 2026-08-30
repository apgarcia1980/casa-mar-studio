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
    if (
      !this.platform.matchesMedia('(min-width: 64rem)') ||
      this.platform.matchesMedia('(prefers-reduced-motion: reduce)')
    ) {
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
      if (!layout || !mediaColumn || images.length < 2) return;

      gsap.registerPlugin(ScrollTrigger);
      this.enhanced.set(true);
      const computedStyle = getComputedStyle(root);
      const backgrounds = this.backgroundTokens()
        .map((token) => computedStyle.getPropertyValue(token).trim())
        .filter(Boolean);

      const media = gsap.matchMedia();
      media.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          gsap.set(images, { clipPath: 'inset(0% 0% 0% 0%)', objectPosition: 'center 50%' });
          if (backgrounds.length) gsap.set(root, { backgroundColor: backgrounds[0] });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: layout,
              start: 'top top',
              end: 'bottom bottom',
              pin: mediaColumn,
              scrub: true,
              anticipatePin: 1,
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
              );

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
      });

      this.animationCleanup = () => media.revert();
      this.animationInitialized = true;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } catch {
      this.enhanced.set(false);
    }
  }
}
