import Link from 'next/link';

const lanes = [
  { title: 'LIVE + Reels', body: 'Go LIVE, cut clips into reels, publish highlights, route products into live shopping, and grow an audience.', href: '/live' },
  { title: 'StarVerse — Anyone Can Be a Star', body: 'Auditions, talent discovery, creator challenges, casting calls, performances, fan voting and creator profiles.', href: '/starverse' },
  { title: 'Isaiah AI TV', body: 'Creator channels, AI-assisted show planning, Free TV/Omni Box distribution, sports and youth-safe programming lanes.', href: '/isaiah-ai-tv' },
  { title: 'Aniyah 64-Track Studio', body: 'Record, arrange, mix and release multi-track music projects with HoloMusic, royalties, creator ownership and collaboration.', href: '/aniyah-studio' },
  { title: 'Omni Box Movie Studio', body: 'Build reels, trailers, episodes, short dramas and movies; package media projects for licensed distribution and monetization.', href: '/omni-box' },
  { title: 'HoloForge', body: 'Generate and manage visual, audio, video, holographic, game and product assets with provenance and moderation gates.', href: '/holoforge' },
  { title: 'Jacobie Vision', body: 'Cybersecurity lane for creator/business protection, security reviews, identity protection and safer TRYAMM operations.', href: '/jacobie-vision' },
  { title: 'PropertyVerse + Home Flipping', body: 'Discover property, holographic tours, verified listings, renovation/home-flipping workflows and service-provider discovery.', href: '/propertyverse' },
  { title: 'Games + Living Worlds', body: 'Turn creator IP, shows, music and characters into multiplayer worlds, game events and immersive fan experiences.', href: '/games' },
  { title: 'Marketplace + Live Shopping', body: 'Sell products, services, tickets, media unlocks and creator assets through marketplace, auctions and QVC/HSN-style live commerce.', href: '/live-shopping' },
];

export default function CreatorUniversePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel holo-panel">
        <p className="eyebrow">TRYAMM Creator Universe</p>
        <h1>Create. Perform. Film. Sell. Stream. Build a world.</h1>
        <p className="lede">One visible creator command center connecting LIVE, reels, StarVerse, Isaiah AI TV, Aniyah 64-Track Studio, Omni Box movies, HoloForge, games, marketplace commerce, Jacobie Vision and PropertyVerse.</p>
        <div className="status-row">
          <span className="status-chip">Creator identity</span>
          <span className="status-chip">Multilingual</span>
          <span className="status-chip">Accessible</span>
          <span className="status-chip">Rights-aware</span>
          <span className="status-chip">Money Engine</span>
        </div>
      </section>

      <section className="route-grid" aria-label="Creator products">
        {lanes.map((lane) => (
          <Link key={lane.title} href={lane.href} className="route-card holo-panel">
            <h2>{lane.title}</h2>
            <p>{lane.body}</p>
            <span className="route-cta">Open →</span>
          </Link>
        ))}
      </section>

      <section className="holo-panel">
        <h2>Movie / reel creation path</h2>
        <p>Idea → Stubbs AI planning → script/storyboard → HoloForge assets → record/upload LIVE or studio footage → Aniyah audio/music → edit reels/episodes/movie package → captions/translation/accessibility → rights check → Omni Box / Isaiah AI TV / Feed / Marketplace distribution → Money Engine reporting.</p>
        <p className="muted">The workflow is launch-visible now. Full AI movie generation, advanced editing/rendering and production streaming only become GREEN after their real generation/media providers, storage and end-to-end tests are configured.</p>
      </section>
    </main>
  );
}
