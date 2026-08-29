import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { PlatformService } from '../../../../core/platform/platform.service';
import { heroMediaConfig } from '../../models/hero-media.config';
import { resolveHeroMotionPolicy } from '../../models/hero-motion-policy';

interface OptionalVideoFrameApi {
  requestVideoFrameCallback?: (callback: (now: number) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
}

@Component({
  selector: 'app-cinematic-hero',
  templateUrl: './cinematic-hero.component.html',
  styleUrl: './cinematic-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinematicHeroComponent {
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hero = viewChild<ElementRef<HTMLElement>>('hero');
  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private animationCleanup: () => void = () => undefined;
  private setDecorativePaused: (paused: boolean) => void = () => undefined;
  private setMarkerProgress: (progress: number) => void = () => undefined;
  private frameHandle: number | null = null;
  private usesVideoFrameCallback = false;

  protected readonly i18n = inject(TranslationService);
  protected readonly media = heroMediaConfig;
  protected readonly soundOn = signal(false);
  protected readonly motionPaused = signal(false);
  protected readonly videoReady = signal(false);
  protected readonly autoplayAllowed = signal(false);
  protected readonly preload = signal<'none' | 'metadata'>('none');

  constructor() {
    afterNextRender(() => void this.initializeBrowserExperience());
    this.destroyRef.onDestroy(() => {
      this.stopVideoSynchronization();
      this.animationCleanup();
    });
  }

  protected toggleSound(): void {
    const soundOn = !this.soundOn();
    this.soundOn.set(soundOn);
    const video = this.video()?.nativeElement;
    if (video) video.muted = !soundOn;
  }

  protected toggleMotion(): void {
    const paused = !this.motionPaused();
    this.motionPaused.set(paused);
    this.setDecorativePaused(paused);

    const video = this.video()?.nativeElement;
    if (!video) return;
    if (paused) {
      video.pause();
      this.stopVideoSynchronization();
      return;
    }
    if (this.media.videoSources.length > 0) {
      void video.play().catch(() => this.videoReady.set(false));
    }
  }

  protected onVideoMetadata(): void {
    const video = this.video()?.nativeElement;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    this.videoReady.set(true);
    this.setDecorativePaused(true);
    if (!this.motionPaused()) this.startVideoSynchronization();
  }

  protected onVideoPlaying(): void {
    if (this.videoReady() && !this.motionPaused()) this.startVideoSynchronization();
  }

  protected onVideoError(): void {
    this.videoReady.set(false);
    this.stopVideoSynchronization();
    this.setDecorativePaused(this.motionPaused());
  }

  private async initializeBrowserExperience(): Promise<void> {
    const reducedMotion = this.platform.matchesMedia('(prefers-reduced-motion: reduce)');
    const policy = resolveHeroMotionPolicy({
      reducedMotion,
      saveData: this.platform.saveDataEnabled(),
    });
    this.preload.set(policy.preload);
    this.autoplayAllowed.set(policy.autoplayVideo);
    this.motionPaused.set(!policy.animateDecorativeLayer);

    const video = this.video()?.nativeElement;
    if (video) video.muted = true;

    if (policy.animateDecorativeLayer) await this.initializeGsap();
    if (policy.autoplayVideo && this.media.videoSources.length > 0 && video) {
      void video.play().catch(() => this.videoReady.set(false));
    }
  }

  private async initializeGsap(): Promise<void> {
    const root = this.hero()?.nativeElement;
    if (!root || this.destroyRef.destroyed) return;

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    if (this.destroyRef.destroyed) return;
    gsap.registerPlugin(ScrollTrigger);

    const markerPath = root.querySelector<SVGPathElement>('[data-marker-path]');
    const marker = root.querySelector<SVGGraphicsElement>('[data-marker]');
    const pathLength = markerPath?.getTotalLength() ?? 0;
    const updateMarker = (progress: number): void => {
      if (!markerPath || !marker || pathLength <= 0) return;
      const point = markerPath.getPointAtLength(pathLength * progress);
      marker.setAttribute('transform', `translate(${point.x} ${point.y})`);
    };
    this.setMarkerProgress = updateMarker;

    const context = gsap.context(() => {
      const lines = root.querySelectorAll<SVGPathElement>('[data-geometry-line]');
      const entry = gsap.timeline({ defaults: { ease: 'power2.out' } });
      entry
        .from('[data-hero-wordmark]', {
          clipPath: 'inset(0 0 100% 0)',
          opacity: 0,
          duration: 1.2,
          delay: 0.2,
        })
        .fromTo(
          lines,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.8, stagger: 0.12 },
          0.5,
        )
        .from('[data-hero-copy], [data-hero-controls]', { opacity: 0, y: 12, duration: 0.8 }, 1);

      const markerState = { progress: 0 };
      const markerLoop = gsap.to(markerState, {
        progress: 1,
        duration: 18,
        ease: 'none',
        repeat: -1,
        onUpdate: () => updateMarker(markerState.progress),
      });
      this.setDecorativePaused = (paused) => {
        if (paused) markerLoop.pause();
        else markerLoop.play();
      };

      gsap.to('[data-hero-stage]', {
        scale: 0.955,
        borderRadius: '1rem',
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, root);

    this.animationCleanup = () => context.revert();
  }

  private startVideoSynchronization(): void {
    if (this.frameHandle !== null) return;
    const video = this.video()?.nativeElement;
    if (!video) return;

    const update = (): void => {
      if (this.motionPaused() || !Number.isFinite(video.duration) || video.duration <= 0) {
        this.frameHandle = null;
        return;
      }
      this.setMarkerProgress((video.currentTime % video.duration) / video.duration);
      this.scheduleVideoFrame(video, update);
    };
    this.scheduleVideoFrame(video, update);
  }

  private scheduleVideoFrame(video: HTMLVideoElement, callback: () => void): void {
    const frameApi = video as unknown as OptionalVideoFrameApi;
    if (frameApi.requestVideoFrameCallback) {
      this.usesVideoFrameCallback = true;
      this.frameHandle = frameApi.requestVideoFrameCallback(() => callback());
      return;
    }
    this.usesVideoFrameCallback = false;
    this.frameHandle = video.ownerDocument.defaultView?.requestAnimationFrame(callback) ?? null;
  }

  private stopVideoSynchronization(): void {
    if (this.frameHandle === null) return;
    const video = this.video()?.nativeElement;
    const frameApi = video as unknown as OptionalVideoFrameApi | undefined;
    if (this.usesVideoFrameCallback) frameApi?.cancelVideoFrameCallback?.(this.frameHandle);
    else video?.ownerDocument.defaultView?.cancelAnimationFrame(this.frameHandle);
    this.frameHandle = null;
  }
}
