import { describe, expect, it } from 'vitest';
import { resolveHeroMotionPolicy } from './hero-motion-policy';

describe('hero motion policy', () => {
  it('allows muted autoplay and decorative motion by default', () => {
    expect(resolveHeroMotionPolicy({ reducedMotion: false, saveData: false })).toEqual({
      autoplayVideo: true,
      animateDecorativeLayer: true,
      preload: 'metadata',
    });
  });

  it('disables automatic motion for reduced-motion users', () => {
    expect(resolveHeroMotionPolicy({ reducedMotion: true, saveData: false })).toEqual({
      autoplayVideo: false,
      animateDecorativeLayer: false,
      preload: 'none',
    });
  });

  it('avoids video transfer with Save-Data while retaining lightweight geometry', () => {
    expect(resolveHeroMotionPolicy({ reducedMotion: false, saveData: true })).toEqual({
      autoplayVideo: false,
      animateDecorativeLayer: true,
      preload: 'none',
    });
  });
});
