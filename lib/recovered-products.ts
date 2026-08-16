export type RecoveredProduct = {
  key: string;
  name: string;
  stage: 'source-verified' | 'recovered-spec' | 'requires-provider';
  summary: string;
  capabilities: string[];
};

export const recoveredProducts: RecoveredProduct[] = [
  {
    key: 'isaiah-ai-tv',
    name: 'Isaiah AI TV',
    stage: 'recovered-spec',
    summary: 'AI-enhanced television, talent discovery, movies, live showcases and holographic advertising.',
    capabilities: [
      'Anyone Can Be a Star competition',
      'Messiah AI MD Life Coaching Live',
      'Higfield Dance 2.0 series',
      'StarVerse Showcase LIVE',
      '30–120 minute movie catalog',
      'holographic ad triggers',
      'product placement inventory',
      'live production control room',
    ],
  },
  {
    key: 'starverse',
    name: 'StarVerse / Anyone Can Be a Star',
    stage: 'recovered-spec',
    summary: 'Auditions, youth/parent enrollment, five-judge scoring, fan voting, showcases and creator progression.',
    capabilities: [
      'audition intake',
      'parent/guardian consent for youth',
      'five-judge scoring',
      'fan voting and rankings',
      'talent categories',
      'online showcase',
      'creator profiles',
      'live production integration',
    ],
  },
  {
    key: 'spaceos',
    name: 'SpaceOS',
    stage: 'recovered-spec',
    summary: 'Physical-space scanning, persistent digital twins, room editing and design-to-manufacturing workflow.',
    capabilities: [
      'room/camera scanning',
      'AI object recognition',
      '3D object dragging',
      'door/window/no-go zones',
      'private Supabase photo storage',
      'persistent digital twins',
      'safety-gated BUILD workflow',
      'STL/STEP export',
    ],
  },
  {
    key: 'propertyverse',
    name: 'PropertyVerse / Home Flipping',
    stage: 'recovered-spec',
    summary: 'Property discovery, immersive tours, renovation planning, flipping and SpaceOS digital-twin integration.',
    capabilities: [
      'property discovery',
      'buy/sell/rent workflows',
      'immersive property tours',
      'property digital twins',
      'renovation scopes and phases',
      'contractor/manufacturing workflow',
      'flip cost tracking',
      'post-renovation relisting',
    ],
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp Communications Channel',
    stage: 'requires-provider',
    summary: 'WhatsApp as one provider-backed channel inside Omni Communications, not a separate user identity or database.',
    capabilities: [
      'customer messaging',
      'business notifications',
      'campaign deep links',
      'support conversations',
      'delivery/ride status messaging',
      'shared Omni contact context',
    ],
  },
];

export function getRecoveredProduct(key: string) {
  return recoveredProducts.find((product) => product.key === key);
}
