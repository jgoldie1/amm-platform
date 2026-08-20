export type VaultCollection =
  | "history"
  | "inventions"
  | "holoforge"
  | "omni_box"
  | "games"
  | "media"
  | "mobility"
  | "spaceos"
  | "documents";

export interface VaultItemSummary {
  id: string;
  collection: VaultCollection;
  title: string;
  description?: string;
  updatedAt?: string;
  status?: string;
  sourceType?: string;
  private: true;
}

export interface VaultViewConfig {
  ownerOnly: true;
  visibleInApp: true;
  searchable: true;
  filterable: true;
  exportRequiresExplicitOwnerAction: true;
  deleteRequiresExplicitOwnerAction: true;
  sharingDisabledByDefault: true;
}

export const founderVaultView: VaultViewConfig = {
  ownerOnly: true,
  visibleInApp: true,
  searchable: true,
  filterable: true,
  exportRequiresExplicitOwnerAction: true,
  deleteRequiresExplicitOwnerAction: true,
  sharingDisabledByDefault: true,
};

export const vaultCollections: Array<{ id: VaultCollection; label: string; description: string }> = [
  { id: "history", label: "My History", description: "Imported conversations, project notes, decisions and source records." },
  { id: "inventions", label: "My Inventions", description: "Legacy Design Recovery Vault records, versions, evidence and unresolved specs." },
  { id: "holoforge", label: "HoloForge Assets", description: "Generated images, video, audio, avatars, ads, 3D and manufacturing drafts." },
  { id: "omni_box", label: "Omni Box", description: "Reels, short dramas, episodes, movies, series and interactive stories." },
  { id: "games", label: "Games & Worlds", description: "Living Worlds, game assets, multiplayer projects and creator game content." },
  { id: "media", label: "Media", description: "LIVE replays, reels, music, creator media and published/unpublished content." },
  { id: "mobility", label: "Mobility", description: "EV, drone, aircraft, marine, robotics and mission-system records." },
  { id: "spaceos", label: "SpaceOS", description: "Spacecraft, mission, planetary, CAD/digital-twin and manufacturing records." },
  { id: "documents", label: "Documents", description: "White papers, plans, source files, test evidence and business documents." },
];
