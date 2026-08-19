export interface ProductSection {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
  status: "foundation" | "wired" | "integration-required";
  capabilities: string[];
  backend: string[];
}

export const productSections: Record<string, ProductSection> = {
  auth: {
    slug: "auth", title: "Sign in to TRYAMM", eyebrow: "IDENTITY", description: "Secure account access for customers, creators, providers and operators.", primaryAction: "Sign in", secondaryAction: "Create account", status: "integration-required",
    capabilities: ["Email/social sign in", "Customer/creator/provider roles", "Accessible authentication", "Multilingual recovery", "Secure session history"],
    backend: ["Supabase Auth", "RLS role policies", "Session audit"],
  },
  feed: {
    slug: "feed", title: "TRYAMM Feed", eyebrow: "DISCOVER", description: "Vertical creator, marketplace, game and world discovery powered by Stubbs AI.", primaryAction: "Start watching", secondaryAction: "Create post", status: "foundation",
    capabilities: ["Vertical video/feed", "Like/comment/share/follow", "Creator discovery", "Game/world moments", "Marketplace cards", "Captions and translation"],
    backend: ["Supabase content", "Realtime engagement", "Moderation", "Stubbs AI recommendations"],
  },
  live: {
    slug: "live", title: "LIVE + PK", eyebrow: "GO LIVE", description: "Host accessible live rooms, multi-guest panels and competitive PK battles with gifts and chat.", primaryAction: "Go LIVE", secondaryAction: "Join PK", status: "integration-required",
    capabilities: ["LIVE rooms", "PK battles", "Multi-guest panels", "Realtime chat", "Coins and gifts", "Replay", "Captions/translation", "Safety moderation"],
    backend: ["LiveKit", "Supabase realtime", "Money Engine", "Moderation"],
  },
  "stubbs-ai": {
    slug: "stubbs-ai", title: "Stubbs AI / HoloGPT", eyebrow: "COMMAND NEXUS", description: "Ask, build, search, plan and continue TRYAMM work with private memory and provenance-aware context.", primaryAction: "Talk to Stubbs AI", status: "wired",
    capabilities: ["Hierarchy AGI routing", "Googolplex Memory", "Founder context", "HoloForge routing", "Service discovery", "Accessibility and translation"],
    backend: ["/api/stubbs-ai", "HoloGPT founder context", "Guardian", "Quantum Speed/Lag Buster"],
  },
  holoforge: {
    slug: "holoforge", title: "HoloForge Studio", eyebrow: "CREATE", description: "Generate media, products, ads, game/world assets and manufacturing-ready design artifacts from one studio.", primaryAction: "Create asset", secondaryAction: "Open my assets", status: "wired",
    capabilities: ["Image/video/audio", "Holographic media", "Avatars", "Game assets", "Marketplace products", "CAD/STL/STEP/BOM planning", "Alt text/captions/locales"],
    backend: ["/api/holoforge", "Forge assets", "ManufacturingOS gate", "Generation providers required"],
  },
  marketplace: {
    slug: "marketplace", title: "Marketplace", eyebrow: "BUY • SELL • BOOK", description: "Products, creator goods, services, properties and custom HoloForge assets in one commerce layer.", primaryAction: "Browse marketplace", secondaryAction: "Sell something", status: "foundation",
    capabilities: ["Products", "Creator stores", "Service listings", "Custom assets", "Orders", "Reviews", "Global discovery"],
    backend: ["Supabase catalog", "Money Engine", "Stripe Connect", "ComplianceOS where required"],
  },
  services: {
    slug: "services", title: "Services", eyebrow: "FIND HELP", description: "Use Stubbs AI to discover, compare and book providers with regulated-service checks when required.", primaryAction: "Find a provider", secondaryAction: "Become a provider", status: "wired",
    capabilities: ["Provider discovery", "Credential status", "Jurisdiction matching", "Booking", "AI call-center handoff", "Accessible service intake"],
    backend: ["Provider Credential Vault", "ComplianceOS", "Middleverse Call Center", "Booking persistence"],
  },
  checkout: {
    slug: "checkout", title: "TRYAMM Checkout", eyebrow: "PAY SAFELY", description: "One checkout for products, services and creator commerce with fee separation, compliance and auditable ledgers.", primaryAction: "Review checkout", status: "integration-required",
    capabilities: ["Order summary", "Platform/provider fee separation", "Consent", "Refund handling", "Payout holds", "Accessible disclosures"],
    backend: ["Payment authorization gate", "Stripe Connect", "Money Engine ledger", "ComplianceOS"],
  },
  wallet: {
    slug: "wallet", title: "Wallet + History", eyebrow: "MONEY ENGINE", description: "See purchases, earnings, gifts, provider payouts, refunds and activity history in one place.", primaryAction: "Open history", secondaryAction: "View earnings", status: "foundation",
    capabilities: ["Purchases", "Creator earnings", "Gift history", "Provider payouts", "Refunds", "Ledger-backed history"],
    backend: ["Money Engine", "Ledger entries", "Stripe Connect", "Notifications"],
  },
  notifications: {
    slug: "notifications", title: "Notifications", eyebrow: "STAY CONNECTED", description: "Live, order, booking, payout, service and world alerts with accessible delivery preferences.", primaryAction: "View notifications", status: "foundation",
    capabilities: ["LIVE alerts", "Bookings", "Orders", "Payments", "Messages", "Game/world events", "Quiet/accessibility preferences"],
    backend: ["Supabase events", "Push/email/SMS providers", "User preferences"],
  },
  creator: {
    slug: "creator", title: "Creator Profile", eyebrow: "BUILD YOUR WORLD", description: "Your public creator identity, LIVE schedule, store, HoloForge assets, games, music and earnings entry point.", primaryAction: "Edit creator profile", secondaryAction: "Open studio", status: "foundation",
    capabilities: ["Profile", "Followers", "LIVE schedule", "Store", "HoloForge portfolio", "Games/worlds", "Music", "Earnings"],
    backend: ["Profiles", "Content", "Marketplace", "HoloForge", "Money Engine"],
  },
  settings: {
    slug: "settings", title: "Accessibility + Language", eyebrow: "YOUR EXPERIENCE", description: "Control language, captions, screen-reader support, reduced motion, one-hand/voice/switch interaction and notification preferences.", primaryAction: "Save preferences", status: "foundation",
    capabilities: ["Language/locale", "Captions/transcripts", "Screen-reader mode", "Reduced motion", "One-hand controls", "Voice/switch controls", "Text size/contrast"],
    backend: ["Profile preferences", "Accessibility contract", "Translation services"],
  },
  games: {
    slug: "games", title: "Games + Living Worlds", eyebrow: "PLAY • CREATE • COMPETE", description: "Enter TRYAMM sports, racing, fighting, living-world and immersive multiplayer experiences connected to creators and HoloForge.", primaryAction: "Enter games", secondaryAction: "Build a world", status: "foundation",
    capabilities: ["Living Worlds", "Sports games", "Car/horse racing", "Fighting experiences", "Multiplayer crews", "Phone/controller support", "VR/AR/MR", "HoloForge game assets", "Accessible controls", "Global translation"],
    backend: ["Realtime multiplayer", "Persistent player state", "HoloForge", "Stubbs AI", "Game engine integrations"],
  },
};

export const productNav = ["feed", "live", "games", "stubbs-ai", "holoforge", "marketplace", "services", "wallet", "notifications", "creator", "settings"];
