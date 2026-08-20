export type HolographicGiftDefinition = {
  code: string;
  displayName: string;
  animationKey: string;
  tier: 'micro' | 'standard' | 'premium' | 'legendary';
  soundKey?: string;
  hapticPattern?: 'tap' | 'pulse' | 'burst' | 'celebration';
  reducedMotionFallback: 'icon' | 'poster-frame';
  cache: 'session' | 'persistent';
};

/**
 * Holographic Gift Library 2.0
 *
 * The application recycles animation assets through stable animation keys.
 * LIVE, PK, StarVerse, HoloMusic premieres, shopping, games and worlds should
 * all resolve the same gift code through this registry instead of duplicating
 * Lottie payloads in feature bundles.
 */
export const holographicGiftRegistry: Record<string, HolographicGiftDefinition> = {
  heart: {
    code: 'heart',
    displayName: 'Heart',
    animationKey: 'gift/heart-holo-v2',
    tier: 'micro',
    soundKey: 'gift/heart-soft',
    hapticPattern: 'tap',
    reducedMotionFallback: 'icon',
    cache: 'persistent',
  },
  star: {
    code: 'star',
    displayName: 'Star',
    animationKey: 'gift/star-holo-v2',
    tier: 'standard',
    soundKey: 'gift/star-rise',
    hapticPattern: 'pulse',
    reducedMotionFallback: 'poster-frame',
    cache: 'persistent',
  },
  'judah-crown': {
    code: 'judah-crown',
    displayName: 'Judah Crown',
    animationKey: 'gift/judah-crown-holo-v2',
    tier: 'premium',
    soundKey: 'gift/crown-celebration',
    hapticPattern: 'celebration',
    reducedMotionFallback: 'poster-frame',
    cache: 'persistent',
  },
};

export function getHolographicGift(code: string) {
  return holographicGiftRegistry[code] ?? null;
}

export function getGiftAnimationUrl(animationKey: string) {
  const base = process.env.NEXT_PUBLIC_GIFT_ASSET_BASE_URL?.replace(/\/$/, '') ?? '/assets/lottie';
  return `${base}/${animationKey}.json`;
}
