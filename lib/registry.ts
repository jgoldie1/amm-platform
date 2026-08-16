export type OmniSystem = {
  key: string;
  name: string;
  division: string;
  summary: string;
  status: 'recovered' | 'designed' | 'generated' | 'source_verified' | 'wired' | 'tested' | 'deployed' | 'future';
};

export const systems: OmniSystem[] = [
  {key:'omni-core',name:'Omni Core',division:'Platform',summary:'Shared identity, data, realtime, commerce, media, accessibility, security and AI orchestration.',status:'wired'},
  {key:'tryamm',name:'TryAMM',division:'Platform',summary:'WATCH, LIVE, PLAY, SHOP, CREATE and WORLDS super-app.',status:'wired'},
  {key:'omni-box',name:'Omni Box',division:'Hardware',summary:'TV and home command center with cross-device handoff.',status:'designed'},
  {key:'omnicash',name:'OmniCash',division:'FinTech',summary:'Server-controlled payment and ledger orchestration layer.',status:'generated'},
  {key:'holoverse',name:'Holoverse',division:'Spatial',summary:'Holographic/spatial service layer for digital and physical experiences.',status:'designed'},
  {key:'gameverse',name:'GameVerse',division:'Games',summary:'Shared game launcher, progression, matchmaking and multiplayer services.',status:'wired'},
  {key:'living-worlds',name:'Living Worlds',division:'Worlds',summary:'Persistent evolving multiplayer worlds connected by portals.',status:'generated'},
  {key:'holo-drama',name:'HoloDrama / StoryVerse',division:'Media',summary:'Interactive vertical drama, spatial scenes and enter-the-story experiences.',status:'designed'},
  {key:'originals-network',name:'Originals Network',division:'Media',summary:'Reality, competitions, reunions, after-shows and premium originals.',status:'designed'},
  {key:'holo-music',name:'HoloMusic',division:'Music',summary:'Music releases, videos, radio, concerts and immersive performances.',status:'wired'},
  {key:'aniyah-studio',name:'Aniyah 64-Track Studio',division:'Legacy',summary:'64-track DAW, vocal coach, pitch tools, collaboration and spatial audio.',status:'generated'},
  {key:'aniyah-cross-border',name:'Aniyah Cross-Border',division:'Legacy',summary:'Cross-border commerce, payments, shipping and currency corridor.',status:'designed'},
  {key:'jacobie-vision',name:'Jacobie Vision Cybersecurity',division:'Legacy',summary:'Cybersecurity, monitoring, security education and ecosystem protection.',status:'designed'},
  {key:'isaiah-ai-tv',name:'Isaiah AI TV',division:'Legacy',summary:'AI-enhanced television and talent-discovery network.',status:'designed'},
  {key:'starverse',name:'StarVerse / Anyone Can Be a Star',division:'Creator',summary:'Auditions, creator worlds, performances and fan interaction.',status:'designed'},
  {key:'legacy-kids',name:'Heirs & Legacy Kids',division:'Legacy',summary:'IP registry, stewardship and succession-support layer.',status:'generated'},
  {key:'propertyverse',name:'PropertyVerse / Home Flipping',division:'Real Estate',summary:'Immersive property discovery, digital twins, renovation and flipping.',status:'designed'},
  {key:'spaceos',name:'SpaceOS',division:'Physical',summary:'Room scans, digital twins, AI object recognition and design-to-build manufacturing.',status:'generated'}
];

export const holoServices = [
  'HoloGPT','HoloSearch','HoloAdvertising','HoloMenu','HoloRide','HoloDelivery','HoloDrone',
  'HoloDrama','HoloMusic','HoloLIVE','HoloMarketplace','HoloGuardian','HoloLingo','HoloAccess','HoloRouter'
];
