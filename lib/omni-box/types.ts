export type OmniMediaKind = "reel" | "short_drama" | "episode" | "movie" | "series" | "trailer" | "interactive_story";
export type MonetizationModel = "free_ad_supported" | "subscription" | "episode_unlock" | "bundle" | "tip" | "sponsor" | "creator_store";

export interface OmniBoxProject {
  id: string;
  ownerId: string;
  title: string;
  kind: OmniMediaKind;
  locale: string;
  languages: string[];
  episodeCount?: number;
  immersiveModes: Array<"2d" | "cast" | "ar" | "vr" | "mr" | "holographic">;
  monetization: MonetizationModel[];
  accessibility: {
    captions: boolean;
    transcript: boolean;
    audioDescription?: boolean;
    signLanguageTrack?: boolean;
    reducedMotionVariant?: boolean;
  };
  status: "draft" | "generating" | "review" | "published" | "blocked";
}

export interface OmniBoxRevenueSplit {
  grossCents: number;
  creatorCents: number;
  tryammCents: number;
  partnerCents?: number;
  processorCents?: number;
  taxCents?: number;
}
