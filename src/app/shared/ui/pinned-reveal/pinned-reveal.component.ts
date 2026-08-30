import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { PlatformService } from '../../../core/platform/platform.service';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private animationCleanup: () => void = () => undefined;

  readonly items = input.required<readonly PinnedRevealItem[]>();
  readonly headingLevel = input(3);
  protected readonly enhanced = signal(false);

  constructor() {
    afterNextRender(() => void this.initializePinnedReveal());
    this.destroyRef.onDestroy(() => this.animationCleanup());
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

      const media = gsap.matchMedia();
      media.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          gsap.set(images, { clipPath: 'inset(0% 0% 0% 0%)', objectPosition: 'center 50%' });

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
            timeline
              .to(image, {
                clipPath: 'inset(0% 0% 100% 0%)',
                objectPosition: 'center 60%',
                duration: 1.5,
                ease: 'none',
              })
              .to(
                images[index + 1],
                {
                  objectPosition: 'center 40%',
                  duration: 1.5,
                  ease: 'none',
                },
                '<',
              );
          });
        }, root);

        return () => context.revert();
      });

      this.animationCleanup = () => media.revert();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } catch {
      this.enhanced.set(false);
    }
  }
}
