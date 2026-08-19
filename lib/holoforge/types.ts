export type ForgeAssetType =
  | "image"
  | "video"
  | "audio"
  | "holographic_media"
  | "marketplace_listing"
  | "game_asset"
  | "world_asset"
  | "ad_creative"
  | "avatar"
  | "3d_model"
  | "cad"
  | "stl"
  | "step"
  | "bom";

export type ForgeDestination =
  | "creator_profile"
  | "live_room"
  | "feed"
  | "marketplace"
  | "starverse"
  | "holomusic"
  | "living_worlds"
  | "spaceos"
  | "manufacturingos"
  | "advertising";

export interface ForgeRequest {
  id: string;
  ownerId: string;
  assetType: ForgeAssetType;
  destinations: ForgeDestination[];
  prompt: string;
  sourceAssetIds?: string[];
  locale?: string;
  accessibility?: {
    captions?: boolean;
    altText?: boolean;
    transcript?: boolean;
    reducedMotionVariant?: boolean;
  };
  commercialUseIntended?: boolean;
  manufacturingUseIntended?: boolean;
}

export interface ForgeResult {
  requestId: string;
  status: "queued" | "generated" | "needs_review" | "blocked";
  assetIds: string[];
  reasons: string[];
  nextActions: string[];
}
