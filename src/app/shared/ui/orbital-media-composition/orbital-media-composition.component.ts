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

    const root = this.root()?.nativeElement;
    if (!root || this.destroyRef.destroyed) return;

    try {
      const { gsap } = await import('gsap');
      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-card]'));
      const copies = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-copy]'));
      const images = Array.from(root.querySelectorAll<HTMLImageElement>('[data-orbit-image]'));
      if (cards.length !== this.items().length || copies.length !== cards.length) return;
      await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      if (this.destroyRef.destroyed) return;

      this.enhanced.set(true);
      const context = gsap.context(() => {
        const positions = [
          [{ x: -32, y: -24 }, { x: 28, y: -31 }, { x: 33, y: 20 }, { x: -27, y: 27 }, { x: 8, y: 36 }],
          [{ x: -34, y: 19 }, { x: -20, y: -31 }, { x: 29, y: -22 }, { x: 33, y: 22 }, { x: -6, y: 34 }],
          [{ x: 25, y: 29 }, { x: -34, y: 16 }, { x: -23, y: -29 }, { x: 30, y: -20 }, { x: 31, y: 26 }],
          [{ x: 30, y: -22 }, { x: 24, y: 29 }, { x: -33, y: 19 }, { x: -22, y: -28 }, { x: 29, y: -20 }],
          [{ x: -22, y: -29 }, { x: 30, y: -21 }, { x: 25, y: 29 }, { x: -33, y: 18 }, { x: -20, y: -28 }],
        ];
        const applyState = (active: number) => {
          this.activeIndex.set(active);
          cards.forEach((card, index) => {
            const point = positions[active % positions.length][index % 5];
            gsap.to(card, {
              xPercent: point.x,
              yPercent: point.y,
              scale: index === active ? 1 : 0.62 + ((index + active) % 3) * 0.08,
              rotation: index === active ? 0 : (index - active) * 1.5,
              opacity: index === active ? 1 : 0.68,
              zIndex: index === active ? 2 : 1,
              duration: 2,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          });
        };
        applyState(0);
        const timeline = gsap.timeline({ repeat: -1, paused: this.paused() });
        this.items().forEach((_, index) => {
          const next = (index + 1) % this.items().length;
          timeline.to({}, { duration: this.displayDuration() }).call(() => applyState(next));
        });
        this.setPlayback = (paused: boolean) => paused ? timeline.pause() : timeline.play();
      }, root);
      this.cleanup = () => context.revert();
    } catch {
      this.enhanced.set(false);
    }
  }
}
