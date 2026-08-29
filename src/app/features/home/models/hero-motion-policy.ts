export interface HeroMotionPreferences {
  readonly reducedMotion: boolean;
  readonly saveData: boolean;
}

export interface HeroMotionPolicy {
  readonly autoplayVideo: boolean;
  readonly animateDecorativeLayer: boolean;
  readonly preload: 'none' | 'metadata';
}

export function resolveHeroMotionPolicy(preferences: HeroMotionPreferences): HeroMotionPolicy {
  return {
    autoplayVideo: !preferences.reducedMotion && !preferences.saveData,
    animateDecorativeLayer: !preferences.reducedMotion,
    preload: preferences.reducedMotion || preferences.saveData ? 'none' : 'metadata',
  };
}
