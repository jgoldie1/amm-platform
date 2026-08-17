'use client';

import { useState } from 'react';
import JudahSplash from '@/components/JudahSplash';

const worlds = [
  ['LIVE & PK', 'Host, collaborate and compete in accessible live rooms.'],
  ['Marketplace', 'Discover creators, vendors, properties and services.'],
  ['Stubbs AI', 'Create, translate, navigate and build with HoloGPT.'],
  ['Living Worlds', 'Enter connected games, sports and immersive experiences.'],
  ['HoloMusic', 'Record, perform, distribute and experience spatial sound.'],
  ['Academy', 'Learn creative, business and technology skills without barriers.']
];

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <JudahSplash onComplete={() => setReady(true)} />}
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="topbar">
        <img src="/icons/favicon-96x96.png" alt="" width="48" height="48" />
        <div><strong>TRYAMM</strong><span>The Holographic Gateway</span></div>
        <button type="button" className="enter">Sign in</button>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ONE APP • MANY WORLDS • ACCESS FOR EVERYONE</p>
            <h1>Enter the TRYAMM Omniverse.</h1>
            <p>Creators, communities, commerce, live entertainment, AI and Living Worlds—connected through one accessibility-first platform.</p>
            <div className="actions"><button type="button">Enter TRYAMM</button><button type="button" className="secondary">Explore Worlds</button></div>
          </div>
          <img className="hero-mark" src="/icons/tryamm-judah-icon-1024.png" alt="TRYAMM Lion of Judah holographic emblem" />
        </section>
        <section className="world-grid" aria-labelledby="worlds-heading">
          <div className="section-heading"><p className="eyebrow">THE COMMAND NEXUS</p><h2 id="worlds-heading">Choose your world</h2></div>
          <div className="cards">{worlds.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p><button type="button" className="card-link">Open →</button></article>)}</div>
        </section>
      </main>
      <footer>© 2026 TRYAMM • Accessibility-first • Built for the global creator community</footer>
    </>
  );
}
