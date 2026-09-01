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

export interface OrbitalMediaItem {
  readonly id: string;
  readonly image: MediaAsset;
  readonly imageAlt: string;
  readonly index?: string;
  readonly eyebrow?: string;
  readonly title?: string;
  readonly description?: string;
}

@Component({
  selector: 'app-orbital-media-composition',
  templateUrl: './orbital-media-composition.component.html',
  styleUrl: './orbital-media-composition.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrbitalMediaCompositionComponent {
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private cleanup: () => void = () => undefined;
  private setPlayback: (paused: boolean) => void = () => undefined;

  readonly items = input.required<readonly OrbitalMediaItem[]>();
  readonly paused = input(false);
  readonly displayDuration = input(5);
  readonly transitionDuration = input(2.4);
  protected readonly enhanced = signal(false);
  protected readonly activeIndex = signal(0);

  constructor() {
    afterNextRender(() => void this.initialize());
    this.destroyRef.onDestroy(() => this.cleanup());
    effect(() => this.setPlayback(this.paused()));
  }

  protected objectPosition(item: OrbitalMediaItem): string {
    const focal = item.image.focalPoint;
    return focal ? `${focal.x * 100}% ${focal.y * 100}%` : 'center';
  }

  private async initialize(): Promise<void> {
    if (
      this.items().length < 2 ||
      this.platform.matchesMedia('(prefers-reduced-motion: reduce)') ||
      this.platform.saveDataEnabled()
    ) return;

    const initialRoot = this.root()?.nativeElement;
    if (!initialRoot || this.destroyRef.destroyed) return;

    try {
      const { gsap } = await import('gsap');
      const images = Array.from(initialRoot.querySelectorAll<HTMLImageElement>('[data-orbit-image]'));
      await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      if (this.destroyRef.destroyed) return;

      // Hydration can replace image nodes while decode() is pending. Resolve the
      // current host after preloading so GSAP never animates stale SSR nodes.
      const root = this.root()?.nativeElement;
      if (!root) return;
      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-card]'));
      const copies = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-copy]'));
      if (cards.length !== this.items().length || copies.length !== cards.length) return;

      this.enhanced.set(true);
      const context = gsap.context(() => {
        const compact = this.platform.matchesMedia('(width < 48rem)');
        const slots = compact
          ? [
              { x: 0, y: 0, z: 36, scale: 1, rotation: -2, rotationX: 0, rotationY: 2, opacity: 1, zIndex: 5 },
              { x: -6, y: -70, z: -54, scale: 0.88, rotation: 4, rotationX: 3, rotationY: -4, opacity: 0.9, zIndex: 3 },
              { x: 20, y: -140, z: -92, scale: 0.8, rotation: -5, rotationX: 4, rotationY: 5, opacity: 0.78, zIndex: 2 },
              { x: 4, y: 74, z: 10, scale: 0.9, rotation: -4, rotationX: -3, rotationY: 3, opacity: 0.94, zIndex: 4 },
            ]
          : [
              { x: 0, y: 0, z: 72, scale: 1, rotation: -2.5, rotationX: -2, rotationY: 4, opacity: 1, zIndex: 5 },
              { x: -8, y: -88, z: -98, scale: 0.9, rotation: 6, rotationX: 5, rotationY: -7, opacity: 0.92, zIndex: 3 },
              { x: 26, y: -176, z: -168, scale: 0.82, rotation: -8, rotationX: 8, rotationY: 7, opacity: 0.8, zIndex: 2 },
              { x: 6, y: 92, z: 24, scale: 0.92, rotation: -5.5, rotationX: -5, rotationY: 5, opacity: 0.96, zIndex: 4 },
            ];
        const stateFor = (cardIndex: number, active: number) => {
          const distance = (cardIndex - active + cards.length) % cards.length;
          if (distance === 0) return slots[0];
          if (distance === 1) return slots[1];
          if (distance === 2) return slots[2];
          if (distance === cards.length - 1) return slots[3];
          return slots[4];
        };
        let previousActive = 0;
        const applyState = (active: number, duration: number) => {
          this.activeIndex.set(active);
          cards.forEach((card, index) => {
            const point = stateFor(index, active);
            const previousDistance = (index - previousActive + cards.length) % cards.length;
            const nextDistance = (index - active + cards.length) % cards.length;
            const target = {
              xPercent: -50 + point.x,
              yPercent: -50 + point.y,
              scale: point.scale,
              rotation: point.rotation,
              rotationX: point.rotationX,
              rotationY: point.rotationY,
              z: point.z,
              opacity: point.opacity,
              zIndex: point.zIndex,
              duration,
              ease: 'power3.inOut',
              overwrite: 'auto' as const,
            };

            // The card leaving the lower slot must re-enter from above without
            // travelling through the centre stack. It exits once, is reset while
            // hidden outside the composition, then joins the upper slot.
            if (duration > 0 && previousDistance === cards.length - 1 && nextDistance === 2) {
              gsap.timeline()
                .to(card, {
                  xPercent: -50 + 48,
                  yPercent: -50 + 132,
                  scale: 0.68,
                  rotation: 9,
                  rotationX: -4,
                  rotationY: 8,
                  z: -120,
                  opacity: 0,
                  duration: duration * 0.25,
                  ease: 'power2.in',
                  overwrite: 'auto',
                })
                .set(card, {
                  xPercent: -50 + 48,
                  yPercent: -50 - 196,
                  scale: 0.68,
                  rotation: -9,
                  rotationX: 7,
                  rotationY: 8,
                  z: -150,
                })
                .to(card, { ...target, duration: duration * 0.75 });
              return;
            }

            gsap.to(card, {
              ...target,
            });
          });
          previousActive = active;
        };
        applyState(0, 0);
        const timeline = gsap.timeline({ repeat: -1, paused: this.paused() });
        this.items().forEach((_, index) => {
          const next = (index + 1) % this.items().length;
          timeline.to({}, { duration: this.displayDuration() }).call(() => applyState(next, this.transitionDuration()));
        });
        this.setPlayback = (paused: boolean) => paused ? timeline.pause() : timeline.play();
      }, root);
      this.cleanup = () => context.revert();
    } catch {
      this.enhanced.set(false);
    }
  }
}
