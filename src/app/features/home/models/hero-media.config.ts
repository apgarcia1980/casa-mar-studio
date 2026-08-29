export interface HeroVideoSource {
  readonly src: string;
  readonly type: 'video/webm' | 'video/mp4';
  readonly media?: string;
}

export interface HeroMediaConfig {
  readonly poster: {
    readonly desktopAvif: string;
    readonly desktopWebp: string;
    readonly mobileAvif: string;
    readonly mobileWebp: string;
  };
  readonly videoSources: readonly HeroVideoSource[];
}

export const heroMediaConfig: HeroMediaConfig = {
  poster: {
    desktopAvif: '/media/home/hero-poster-demo.avif',
    desktopWebp: '/media/home/hero-poster-demo.webp',
    mobileAvif: '/media/home/hero-poster-demo-mobile.avif',
    mobileWebp: '/media/home/hero-poster-demo-mobile.webp',
  },
  // Intentionally empty until Casa Mar supplies licensed desktop/mobile WEBM and MP4 files.
  videoSources: [],
};
