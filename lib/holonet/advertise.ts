export interface HoloAdCampaign {
  id: string;
  advertiserId: string;
  active: boolean;
  budgetMinor: number;
  currency: string;
  bidMinor: number;
  locales: string[];
  placements: string[];
  destinationUrl: string;
}

export interface HoloAdRequest {
  placement: string;
  locale: string;
  contentSafetyPassed: boolean;
}

export function selectHoloAd(campaigns: HoloAdCampaign[], request: HoloAdRequest): HoloAdCampaign | undefined {
  if (!request.contentSafetyPassed) return undefined;
  return campaigns
    .filter((campaign) => campaign.active && campaign.budgetMinor > 0 && campaign.placements.includes(request.placement) && campaign.locales.includes(request.locale))
    .sort((a, b) => b.bidMinor - a.bidMinor)[0];
}
