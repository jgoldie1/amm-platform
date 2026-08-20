export type GameIntegrationStatus =
  | "source-confirmed"
  | "adapter-needed"
  | "partially-wired"
  | "release-blocked"
  | "verified";

export interface GameSourceModule {
  id: string;
  title: string;
  sourceRepo: string;
  sourcePath: string;
  domain:
    | "living-worlds"
    | "open-world"
    | "space"
    | "holographic"
    | "multiplayer"
    | "music-game"
    | "creator-world"
    | "economy";
  status: GameIntegrationStatus;
  activePlatformTarget: string;
  notes: string;
}

/**
 * Source-of-truth map for the game/runtime code that lives outside amm-platform.
 * This prevents the release app from silently recreating competing game
 * engines. Integration must preserve canonical player/world state and bring
 * modules across behind typed adapters and tests.
 */
export const TRYAMM_GAME_SOURCES: readonly GameSourceModule[] = [
  {
    id: "living-earth-streaming",
    title: "Living Earth world streaming",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game/living-earth/WorldStreamingDirector.ts",
    domain: "living-worlds",
    status: "source-confirmed",
    activePlatformTarget: "lib/games/runtime/world-streaming-adapter.ts",
    notes: "Recover and adapt rather than creating a second renderer/world-streaming system.",
  },
  {
    id: "living-worlds-globe",
    title: "Living Worlds Earth globe",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game/living-worlds/LivingEarthGlobe.ts",
    domain: "living-worlds",
    status: "source-confirmed",
    activePlatformTarget: "lib/games/runtime/living-worlds-adapter.ts",
    notes: "Feeds My World / We Are the World style destination discovery once persistence is normalized.",
  },
  {
    id: "dynamic-missions",
    title: "Dynamic Mission Director",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game/openworld/DynamicMissionDirector.ts",
    domain: "open-world",
    status: "source-confirmed",
    activePlatformTarget: "lib/games/runtime/mission-adapter.ts",
    notes: "Includes story, business, race, creator, delivery, exploration and fictional combat mission types with deterministic AI-proposal validation.",
  },
  {
    id: "living-space",
    title: "Living Space Registry",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game/space/LivingSpaceRegistry.ts",
    domain: "space",
    status: "source-confirmed",
    activePlatformTarget: "lib/games/runtime/space-adapter.ts",
    notes: "Already defines Earth orbit, Moon, Mars, asteroid belt, outer-solar destinations and persistent SpacePlayerState.",
  },
  {
    id: "cone-lens-gameplay",
    title: "Quantum Cone Lens gameplay",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game/holo/ConeLensGameplayDirector.ts",
    domain: "holographic",
    status: "source-confirmed",
    activePlatformTarget: "lib/games/runtime/holographic-adapter.ts",
    notes: "Connect to the active Holographic Level renderer instead of duplicating presentation logic.",
  },
  {
    id: "cone-lens-runtime",
    title: "Quantum Cone Lens runtime",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game/holo/QuantumConeLensRuntime.ts",
    domain: "holographic",
    status: "source-confirmed",
    activePlatformTarget: "lib/games/runtime/holographic-adapter.ts",
    notes: "Requires benchmark/device capability checks before high holographic levels are called verified.",
  },
  {
    id: "starverse-multiplayer",
    title: "StarVerse multiplayer/spatial mesh",
    sourceRepo: "legacy omniverse source",
    sourcePath: "src/spatial/starverse-mesh.js",
    domain: "multiplayer",
    status: "adapter-needed",
    activePlatformTarget: "lib/games/runtime/realtime-world-adapter.ts",
    notes: "Vault evidence says the client mesh existed but server events/security were incomplete; rebuild onto the active authenticated realtime backbone rather than trust old P2P state.",
  },
  {
    id: "vocal-box-game",
    title: "Vocal Box / karaoke / music game",
    sourceRepo: "legacy omniverse source",
    sourcePath: "src/audio/vocal-studio-engine.js",
    domain: "music-game",
    status: "adapter-needed",
    activePlatformTarget: "lib/games/runtime/vocal-game-adapter.ts",
    notes: "Old engine was a 64-track starter; connect the newer Vocal Box/Karaoke product flow only after real audio playback/recording/permissions tests.",
  },
  {
    id: "creator-worlds",
    title: "StreetVerse / My World / We Are the World / Kingdom creator worlds",
    sourceRepo: "jgoldie1/Amm-project-",
    sourcePath: "amm-omniverse/src/game",
    domain: "creator-world",
    status: "adapter-needed",
    activePlatformTarget: "lib/games/runtime/world-registry.ts",
    notes: "Treat these as world definitions over the shared runtime, not separate engines. Recover exact world definitions from source/history during migration.",
  },
  {
    id: "get-paid-to-play",
    title: "Get Paid to Play economy bridge",
    sourceRepo: "TRYAMM active platform + legacy game source",
    sourcePath: "Money Engine / game reward adapter",
    domain: "economy",
    status: "release-blocked",
    activePlatformTarget: "lib/games/economy/reward-adapter.ts",
    notes: "No client-authoritative cash. Any real creator/prize/reward payout must be server-authoritative, eligibility-checked, ledgered and jurisdiction-aware. Ordinary game XP/points remain separate from real earnings.",
  },
];

export const CANONICAL_GAME_STATE_RULES = Object.freeze({
  onePlayerIdentity: true,
  oneCanonicalProgressionRecord: true,
  oneWorldCheckpointContract: true,
  clientCannotMintMoney: true,
  clientCannotGrantEntitlements: true,
  serverAuthoritativeMultiplayer: true,
  panicModeSupremacy: true,
  gameRewardsSeparateFromCreatorEarnings: true,
});

export function gameSourcesByStatus(status: GameIntegrationStatus): GameSourceModule[] {
  return TRYAMM_GAME_SOURCES.filter((item) => item.status === status);
}
