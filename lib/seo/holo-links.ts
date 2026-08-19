export interface HoloCrawlLink {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: "create" | "watch" | "play" | "shop" | "services" | "ai";
  indexable: boolean;
}

export const holoCrawlLinks: HoloCrawlLink[] = [
  { slug:"feed", href:"/feed", title:"TRYAMM Feed", description:"Discover creators, games, Omni Box stories, products and LIVE moments.", category:"watch", indexable:true },
  { slug:"live", href:"/live", title:"TRYAMM LIVE + PK", description:"Accessible LIVE rooms, PK battles, creator chat, gifts and replay.", category:"watch", indexable:true },
  { slug:"games", href:"/games", title:"Games + Living Worlds", description:"Sports, racing, fighting and immersive multiplayer Living Worlds.", category:"play", indexable:true },
  { slug:"omni-box", href:"/omni-box", title:"Omni Box Stories", description:"Reels, short dramas, episodes, movies and interactive creator stories.", category:"watch", indexable:true },
  { slug:"stubbs-ai", href:"/stubbs-ai", title:"Stubbs AI / HoloGPT", description:"TRYAMM's AI command layer for search, creation, planning and navigation.", category:"ai", indexable:true },
  { slug:"holoforge", href:"/holoforge", title:"HoloForge Studio", description:"Create media, ads, game assets, product content and immersive experiences.", category:"create", indexable:true },
  { slug:"marketplace", href:"/marketplace", title:"TRYAMM Marketplace", description:"Discover creator products, services, media unlocks and custom HoloForge assets.", category:"shop", indexable:true },
  { slug:"services", href:"/services", title:"TRYAMM Services", description:"Find and book providers with Stubbs AI discovery and compliance checks when required.", category:"services", indexable:true },
  { slug:"creator", href:"/creator", title:"TRYAMM Creator Platform", description:"Build a creator profile, go LIVE, publish media, sell and grow an audience.", category:"create", indexable:true },
];

export const publicHoloCrawlLinks = holoCrawlLinks.filter((link) => link.indexable);
