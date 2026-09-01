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
        const slots = [
          { x: 3, y: 0, scale: 1, rotation: -2.5, rotationX: 0, rotationY: 0, opacity: 1, zIndex: 5 },
          { x: -11, y: -76, scale: 0.74, rotation: 6, rotationX: 7, rotationY: -4, opacity: 0.72, zIndex: 4 },
          { x: 12, y: -156, scale: 0.54, rotation: -9, rotationX: 11, rotationY: 7, opacity: 0, zIndex: 2 },
          { x: 10, y: 74, scale: 0.76, rotation: -6, rotationX: -8, rotationY: 5, opacity: 0.7, zIndex: 4 },
          { x: -8, y: 154, scale: 0.55, rotation: 9, rotationX: -12, rotationY: -7, opacity: 0, zIndex: 2 },
        ];
        const stateFor = (cardIndex: number, active: number) => {
          const distance = (active - cardIndex + cards.length) % cards.length;
          if (distance === 0) return slots[0];
          if (distance === 1) return slots[1];
          if (distance === 2) return slots[2];
          if (distance === cards.length - 1) return slots[3];
          return slots[4];
        };
        const applyState = (active: number, duration: number) => {
          this.activeIndex.set(active);
          cards.forEach((card, index) => {
            const point = stateFor(index, active);
            gsap.to(card, {
              xPercent: -50 + point.x,
              yPercent: -50 + point.y,
              scale: point.scale,
              rotation: point.rotation,
              rotationX: point.rotationX,
              rotationY: point.rotationY,
              opacity: point.opacity,
              zIndex: point.zIndex,
              duration,
              ease: 'power3.inOut',
              overwrite: 'auto',
            });
          });
        };
        applyState(0, 0);
        const timeline = gsap.timeline({ repeat: -1, paused: this.paused() });
        this.items().forEach((_, index) => {
          const next = (this.items().length - index - 1 + this.items().length) % this.items().length;
          timeline.to({}, { duration: this.displayDuration() }).call(() => applyState(next, 1.9));
        });
        this.setPlayback = (paused: boolean) => paused ? timeline.pause() : timeline.play();
      }, root);
      this.cleanup = () => context.revert();
    } catch {
      this.enhanced.set(false);
    }
  }
}
