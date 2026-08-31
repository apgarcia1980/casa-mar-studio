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
import { MediaAsset } from '../../content/media-asset';

export interface MaskRevealItem {
  readonly id: string;
  readonly image: MediaAsset;
  readonly imageAlt: string;
  readonly index?: string;
  readonly eyebrow?: string;
  readonly title?: string;
  readonly description?: string;
}

@Component({
  selector: 'app-timed-mask-reveal',
  templateUrl: './timed-mask-reveal.component.html',
  styleUrl: './timed-mask-reveal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimedMaskRevealComponent {
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private animationCleanup: () => void = () => undefined;
  private setPlayback: (paused: boolean) => void = () => undefined;

  readonly items = input.required<readonly MaskRevealItem[]>();
  readonly displayDuration = input(4.5);
  readonly transitionDuration = input(1.2);
  readonly autoplay = input(true);
  readonly paused = input(false);
  readonly maskIdPrefix = input('timed-mask-reveal');
  protected readonly enhanced = signal(false);
  protected readonly activeIndex = signal(0);
  protected readonly stripes = Array.from({ length: 8 });
  protected readonly revealMode = signal<'svg' | 'strips'>('svg');
  protected readonly stripImage = signal<string | null>(null);

  constructor() {
    afterNextRender(() => void this.initialize());
    this.destroyRef.onDestroy(() => this.animationCleanup());

    effect(() => {
      const shouldPause = this.paused() || !this.autoplay();
      this.setPlayback(shouldPause);
    });
  }

  protected maskId(index: number): string {
    return `${this.maskIdPrefix()}-${index}`;
  }

  protected objectPosition(item: MaskRevealItem): string {
    const focalPoint = item.image.focalPoint;
    return focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : 'center';
  }

  private async initialize(): Promise<void> {
    if (
      this.items().length < 2 ||
      this.platform.matchesMedia('(prefers-reduced-motion: reduce)') ||
      this.platform.saveDataEnabled()
    ) {
      return;
    }

    const root = this.root()?.nativeElement;
    if (!root || this.destroyRef.destroyed) return;

    try {
      const { gsap } = await import('gsap');
      if (this.destroyRef.destroyed) return;

      const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-mask-scene]'));
      const sceneImages = Array.from(root.querySelectorAll<HTMLImageElement>('[data-mask-image]'));
      const sceneStripes = scenes.map((_, index) =>
        Array.from(root.querySelectorAll<SVGRectElement>(`[data-mask-stripe="${index}"]`)),
      );
      if (scenes.length !== this.items().length || sceneStripes.some((stripes) => !stripes.length)) {
        return;
      }

      await Promise.all(sceneImages.map((image) => image.decode().catch(() => undefined)));
      if (this.destroyRef.destroyed) return;

      const isMobile = this.platform.matchesMedia('(width < 48rem)');
      const useStripReveal = isMobile && this.supportsWebKitTouchMask(root);
      if (useStripReveal) this.stripImage.set(this.items()[0].image.src);
      this.revealMode.set(useStripReveal ? 'strips' : 'svg');
      this.enhanced.set(true);
      const context = gsap.context(() => {
        const prepareScene = (currentIndex: number): void => {
          const nextIndex = (currentIndex + 1) % scenes.length;
          this.activeIndex.set(currentIndex);
          gsap.set(scenes, { zIndex: 0 });
          gsap.set(scenes[currentIndex], { zIndex: 2 });
          gsap.set(scenes[nextIndex], { zIndex: 1 });
          gsap.set(sceneStripes.flat(), { scaleX: 1, transformOrigin: 'left center' });
        };

        prepareScene(0);

        const timeline = gsap.timeline({ repeat: -1, paused: this.paused() || !this.autoplay() });
        if (useStripReveal) {
          const strips = Array.from(root.querySelectorAll<HTMLElement>('[data-mask-strip]'));
          if (strips.length !== this.stripes.length) return;

          gsap.set(strips, { autoAlpha: 0, xPercent: 0 });
          scenes.forEach((_, index) => {
            const nextIndex = (index + 1) % scenes.length;
            timeline
              .to({}, { duration: this.displayDuration() })
              .call(() => {
                gsap.set(scenes, { zIndex: 0 });
                gsap.set(scenes[nextIndex], { zIndex: 1 });
                gsap.set(strips, { autoAlpha: 1, xPercent: 0, willChange: 'transform' });
              })
              .to(strips, {
                xPercent: 110,
                duration: this.transitionDuration(),
                ease: 'power2.inOut',
                stagger: { each: 0.055, from: 'random' },
              })
              .call(() => {
                gsap.set(strips, { autoAlpha: 0, willChange: 'auto' });
                this.stripImage.set(this.items()[nextIndex].image.src);
                prepareScene(nextIndex);
              });
          });
        } else {
          scenes.forEach((_, index) => {
            const nextIndex = (index + 1) % scenes.length;
            timeline
              .to({}, { duration: this.displayDuration() })
              .to(sceneStripes[index], {
                scaleX: 0,
                duration: this.transitionDuration(),
                ease: 'power2.inOut',
                stagger: { each: 0.055, from: 'random' },
              })
              .call(() => prepareScene(nextIndex));
          });
        }

        const updatePlayback = (paused: boolean): void => {
          if (paused || (isMobile && root.ownerDocument.visibilityState === 'hidden')) timeline.pause();
          else timeline.play();
        };
        this.setPlayback = updatePlayback;

        const handleVisibilityChange = (): void => updatePlayback(this.paused() || !this.autoplay());
        if (isMobile) root.ownerDocument.addEventListener('visibilitychange', handleVisibilityChange);

        this.animationCleanup = () => {
          if (isMobile) root.ownerDocument.removeEventListener('visibilitychange', handleVisibilityChange);
          context.revert();
        };
      }, root);

    } catch {
      this.enhanced.set(false);
    }
  }

  private supportsWebKitTouchMask(root: HTMLElement): boolean {
    const view = root.ownerDocument.defaultView;
    return (
      view?.matchMedia('(pointer: coarse)').matches === true &&
      view.CSS?.supports('-webkit-touch-callout', 'none') === true
    );
  }
}
