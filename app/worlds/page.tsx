import Link from 'next/link';

const worlds = [
  { title: 'My World', badge: 'PRIVATE / PERSONAL', body: 'Your persistent personal universe for media, creator assets, games, replays, stores, properties, settings and private memory.', href: '/my-world', surfaces: ['Web','Mobile','TV','AR','VR','MR'] },
  { title: 'We Are the World', badge: 'GLOBAL / SHARED', body: 'Shared global spaces for LIVE, music, movies, news, debate, faith, games, shopping, education, services and community events.', href: '/we-are-the-world', surfaces: ['Web','Mobile','TV','AR','VR','MR'] },
  { title: 'Kingdom', badge: 'COMMUNITY WORLD', body: 'A persistent immersive Kingdom world for community, faith, culture, creator events, music, games, commerce and holographic spaces.', href: '/worlds/kingdom', surfaces: ['AR','VR','MR','LIVE','Games'] },
  { title: 'New Yahisrale', badge: 'COMMUNITY WORLD', body: 'A shared immersive world for community, faith, learning, creator media, events, commerce and accessible multilingual experiences.', href: '/worlds/new-yahisrale', surfaces: ['AR','VR','MR','LIVE','Media'] },
  { title: 'Living Worlds + Games', badge: 'PLAY / BUILD', body: 'Sports, racing, fighting, crews, missions, creator IP, multiplayer worlds, phone/controller input, casting, haptics and spatial media.', href: '/games', surfaces: ['WebGPU','AR','VR','MR','Controller'] },
];

export default function WorldsPage() {
  return (
    <main className="page-shell">
      <section className="hero-panel holo-panel">
        <p className="eyebrow">TRYAMM WORLDS NEXUS</p>
        <h1>One identity. Many worlds.</h1>
        <p className="lede">Move from your private My World into shared We Are the World spaces, Kingdom, New Yahisrale and immersive AR/VR/MR games without losing your creator identity, accessibility settings, media, wallet history or audience relationships.</p>
        <div className="status-row">
          <span className="status-chip">HoloNet</span>
          <span className="status-chip">Quantum Security</span>
          <span className="status-chip">Quantum Lag Buster</span>
          <span className="status-chip">Accessible</span>
          <span className="status-chip">Multilingual</span>
        </div>
      </section>

      <section className="route-grid" aria-label="TRYAMM worlds">
        {worlds.map((world) => (
          <Link key={world.title} href={world.href} className="route-card holo-panel">
            <p className="eyebrow">{world.badge}</p>
            <h2>{world.title}</h2>
            <p>{world.body}</p>
            <div className="status-row">{world.surfaces.map((s) => <span key={s} className="status-chip">{s}</span>)}</div>
            <span className="route-cta">Enter →</span>
          </Link>
        ))}
      </section>

      <section className="holo-panel">
        <h2>Common world backbone</h2>
        <p>Holo Identity → Quantum Security → HoloNet → Quantum Lag Buster → persistent world/player state → LIVE/media/games → HoloForge assets → Marketplace/Money Engine → My World history.</p>
        <p className="muted">AR/VR/MR world shells can be visible now; each specific 3D experience becomes GREEN only after its engine build, multiplayer/state synchronization, controller/XR device tests and performance/accessibility tests pass.</p>
      </section>
    </main>
  );
}
