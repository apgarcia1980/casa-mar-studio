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
  private initializationId = 0;

  readonly items = input.required<readonly OrbitalMediaItem[]>();
  readonly paused = input(false);
  readonly displayDuration = input(5);
  readonly transitionDuration = input(2.4);
  protected readonly enhanced = signal(false);
  protected readonly activeIndex = signal(0);

  constructor() {
    afterNextRender(() => void this.initialize());
    this.destroyRef.onDestroy(() => {
      // Decoding images and loading GSAP are asynchronous. Invalidate that work
      // before reverting so a stale initializer can never animate a new Home view.
      this.initializationId += 1;
      this.cleanup();
      this.cleanup = () => undefined;
      this.setPlayback = () => undefined;
    });
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

    const initializationId = ++this.initializationId;
    const initialRoot = this.root()?.nativeElement;
    if (!initialRoot || this.destroyRef.destroyed) return;

    try {
      const { gsap } = await import('gsap');
      if (this.destroyRef.destroyed || initializationId !== this.initializationId) return;

      const images = Array.from(initialRoot.querySelectorAll<HTMLImageElement>('[data-orbit-image]'));
      await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      if (this.destroyRef.destroyed || initializationId !== this.initializationId) return;

      // Hydration can replace image nodes while decode() is pending. Resolve the
      // current host after preloading so GSAP never animates stale SSR nodes.
      const root = this.root()?.nativeElement;
      if (!root || initializationId !== this.initializationId) return;
      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-card]'));
      const copies = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-copy]'));
      if (cards.length !== this.items().length || copies.length !== cards.length) return;

      // Angular updates class bindings on its render pass, whereas GSAP writes
      // transforms synchronously. Set the enhanced class immediately so the CSS
      // fallback translate(-50%) is gone before GSAP applies its own xPercent.
      // Without this, both transforms are composed and cards jump to one side.
      this.enhanced.set(true);
      root.classList.add('orbital-media--enhanced');

      const context = gsap.context(() => {
        // A route can be left mid-transition. Clear every animated property before
        // defining the first orbit state, otherwise GSAP can momentarily reuse an
        // old x/y transform and show cards displaced to either side.
        gsap.killTweensOf(cards);
        gsap.set(cards, {
          clearProps: 'transform,opacity,zIndex,willChange',
        });
        const compact = this.platform.matchesMedia('(width < 48rem)');
        const slots = compact
          ? [
              { x: 0, y: 0, z: 36, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 1, zIndex: 5 },
              { x: 0, y: -66, z: -54, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 0.74, zIndex: 3 },
              { x: 0, y: -132, z: -92, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 0.5, zIndex: 2 },
              { x: 0, y: 66, z: 10, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 0.86, zIndex: 4 },
            ]
          : [
              { x: 0, y: 0, z: 72, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 1, zIndex: 5 },
              { x: 0, y: -88, z: -98, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 0.74, zIndex: 3 },
              { x: 0, y: -176, z: -168, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 0.5, zIndex: 2 },
              { x: 0, y: 88, z: 24, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 0.86, zIndex: 4 },
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
          gsap.killTweensOf(cards);
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
                  xPercent: -50,
                  yPercent: -50 + 132,
                  scale: 1,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                  z: -120,
                  opacity: 0,
                  duration: duration * 0.25,
                  ease: 'power2.in',
                  overwrite: 'auto',
                })
                .set(card, {
                  xPercent: -50,
                  yPercent: -50 - 196,
                  scale: 1,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
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
      if (this.destroyRef.destroyed || initializationId !== this.initializationId) {
        context.revert();
        return;
      }

      this.cleanup = () => {
        this.initializationId += 1;
        this.setPlayback = () => undefined;
        context.revert();
        root.classList.remove('orbital-media--enhanced');
        this.enhanced.set(false);
        this.activeIndex.set(0);
      };
    } catch {
      if (initializationId === this.initializationId) {
        initialRoot.classList.remove('orbital-media--enhanced');
        this.enhanced.set(false);
      }
    }
  }
}
