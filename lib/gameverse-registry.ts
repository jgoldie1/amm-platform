export type GameVerseSystem = {
  key: string;
  name: string;
  category: string;
  stage: 'recovered-prototype' | 'recovered-spec' | 'foundation';
  inspirationNote?: string;
  capabilities: string[];
};

export const gameVerseSystems: GameVerseSystem[] = [
  {
    key: 'realm-clash',
    name: 'Realm Clash: Street Crown',
    category: 'fighting',
    stage: 'recovered-prototype',
    inspirationNote: 'Original street/custom-fighter experience; do not copy Def Jam characters, music, branding, likenesses or story.',
    capabilities: ['custom fighters','men/women/mixed rosters','jab/kick/heavy/throw','guard/stamina/super meter','best-of-three rounds','Holo Finishers','signed match receipts','career crews and venues'],
  },
  {
    key: 'kingdom-stakes',
    name: 'Kingdom Stakes: Holo Derby',
    category: 'horse-racing',
    stage: 'recovered-spec',
    capabilities: ['thoroughbred-style original horses','breeding/genetics simulation','jockey creator','training/stamina/temperament','flat racing','steeplechase','dirt/turf/weather','photo finish','stable ownership','spectator and HoloTV mode','accessible one-hand controls'],
  },
  {
    key: 'creature-quest',
    name: 'Creature Quest',
    category: 'AR creature adventure',
    stage: 'recovered-prototype',
    inspirationNote: 'Original collectible creatures; no Pokemon names, designs, characters, sounds or branding.',
    capabilities: ['phone-camera AR','original creature catalog','weaken/capture loop','rarity system','training and battles','GPS/location-safe encounters','Living Worlds habitats','co-op raids'],
  },
  {
    key: 'mischief-lab',
    name: 'Mischief Lab',
    category: 'creature chaos/puzzle',
    stage: 'recovered-spec',
    inspirationNote: 'Original mischievous-creature game; no Gremlins characters, rules, names or visual designs.',
    capabilities: ['original mischievous species','environmental puzzles','invention crafting','day/night behavior changes','co-op containment','city events','AR household mode'],
  },
  {
    key: 'ghost-operations',
    name: 'Ghost Operations',
    category: 'supernatural investigation/action',
    stage: 'recovered-spec',
    inspirationNote: 'Original paranormal investigation IP; no Ghostbusters characters, logos, equipment names or story.',
    capabilities: ['spectral scanner','evidence collection','co-op investigations','containment tools','haunted locations','AR room scanning','spatial audio clues','Living Worlds events'],
  },
  {
    key: 'tactical-front',
    name: 'Tactical Front / Tactical Realms',
    category: 'team tactical action',
    stage: 'recovered-prototype',
    inspirationNote: 'Original tactical shooter; no Call of Duty maps, weapons, characters, audio, modes or branding.',
    capabilities: ['7 modes','original weapons','original maps','squad roles','objective play','AI opponents','controller/mobile input','authoritative match receipts','cross-world operations'],
  },
  {
    key: 'quantum-tag',
    name: 'Quantum Tag / Laser Grid',
    category: 'AR/VR/MR tag',
    stage: 'recovered-prototype',
    capabilities: ['camera AR','phone gyroscope','VR/MR arenas','team/tag modes','holographic targets','spatial audio','safe haptics','Bluetooth controller','Living Worlds portals','location-safe play zones'],
  },
  {
    key: 'streetverse-holo-deck',
    name: 'StreetVerse: Holo Deck',
    category: 'open world',
    stage: 'recovered-prototype',
    capabilities: ['driving','missions','wanted/reputation concepts','combat','Faith Deck','Holo Deck','touch/controller support','haptics','shared world-state foundation'],
  },
];

export const worldTwinLayers = [
  { key: 'living-city', name: 'Living City / My World', purpose: 'Original persistent open-world home layer.' },
  { key: 'twin-earth', name: 'Twin Earth', purpose: 'Licensed streamed geospatial visualization using approved providers; never an owned copy of Google Earth.' },
  { key: 'middleverse', name: 'Middleverse', purpose: 'Bridge layer between physical-place twins, Living Worlds and game realms.' },
  { key: 'metaverse', name: 'Metaverse', purpose: 'Shared social/spatial experiences across devices and XR.' },
  { key: 'multiverse', name: 'Multiverse', purpose: 'Multiple persistent world timelines/configurations with shared identity and state.' },
  { key: 'omniverse', name: 'Omniverse', purpose: 'Top-level routing layer connecting games, worlds, media, commerce and physical services.' },
];

export const sharedQuantumSystems = [
  'Quantum Beat deterministic audio/visual/haptic synchronization',
  'Quantum Speed Engine brand layer for performance scheduling and streaming optimizations',
  'Holo5DX spatial rendering and device presentation',
  'Omni Multiplayer shared rooms/presence/state',
  'Omni ID shared identity and avatar',
  'World-state persistence and portal handoff',
  'Stubbs AI / HoloGPT NPC and orchestration layer',
  'Accessibility profiles across all games',
];
