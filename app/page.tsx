'use client';

import Link from 'next/link';
import { useState } from 'react';
import JudahSplash from '@/components/JudahSplash';

const systems = [
  ['Stubbs AI / HoloGPT', 'Your intelligent command layer for search, creation, translation, memory, planning and navigation.', '/stubbs-ai'],
  ['HoloForge', 'Generate creator media, ads, avatars, 3D assets, marketplace content, game/world assets and manufacturing-ready drafts.', '/holoforge'],
  ['Feed + LIVE + PK', 'Short-form discovery, live broadcasts, multi-guest rooms, PK competitions, chat, gifts and replay.', '/live'],
  ['Marketplace + Services', 'Products, creators, vendors and regulated-service discovery with provider verification and safe checkout.', '/marketplace'],
  ['Money Engine', 'Platform fees, creator earnings, provider payouts, gift revenue, refunds, holds and transaction history.', '/wallet'],
  ['Middleverse Call Center', 'AI-assisted customer service, scheduling, dispatch, multilingual calls and escalation to qualified professionals.', '/services'],
  ['PropertyVerse', 'Listings, rentals, property discovery, digital tours and real-estate workflows with compliance gates.', '/services'],
  ['MobilityOS', 'EV rides, vehicle sharing, drones, robots, aircraft, marine mobility and accessible dispatch planning.', '/services'],
  ['Games + Living Worlds', 'Sports, racing, fighting, multiplayer worlds, persistent missions and immersive entertainment.', '/games'],
  ['StarVerse', 'Auditions, talent discovery, performance, fan engagement and creator monetization.', '/creator'],
  ['HoloMusic', 'Recording, performance, distribution, 64-track workflows and spatial/holographic music experiences.', '/creator'],
  ['SpaceOS', 'Spacecraft, mission simulation, planetary travel, digital twins and safety-gated manufacturing workflows.', '/games'],
];

const trust = [
  ['Accessibility-first', 'Screen reader, keyboard, voice, switch, one-hand, captions, reduced-motion and cognitive-support paths are part of completion.'],
  ['Multilingual', 'Locale-aware experiences, translation workflows and safer handling of legal, medical, payment and compliance language.'],
  ['Private memory', 'Googolplex Memory + Founder Archive + Legacy Design Vault preserve context and provenance without making private history public.'],
  ['Compliance & safety', 'Credential checks, Guardian controls, deterministic payment/physical-action gates and audit evidence stay non-bypassable.'],
];

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <JudahSplash onComplete={() => setReady(true)} />}
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="topbar">
        <img src="/icons/favicon-96x96.png" alt="" width="48" height="48" />
        <div>
          <strong>TRYAMM</strong>
          <span>Stubbs AI • Creator Economy • Commerce • Games • Worlds</span>
        </div>
        <nav className="topnav" aria-label="Primary">
          <Link href="/feed">Feed</Link>
          <Link href="/live">LIVE</Link>
          <Link href="/games">Games</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/stubbs-ai">Stubbs AI</Link>
        </nav>
        <Link href="/auth" className="pill-link">Sign in</Link>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ONE APP • CREATE • CONNECT • PLAY • EARN • BUILD</p>
            <h1>Your worlds. One command nexus.</h1>
            <p>TRYAMM connects social video, LIVE/PK, games, AI creation, shopping, services, payments, mobility, music, property and SpaceOS through Stubbs AI—with accessibility, multilingual support, memory, compliance and proof built into the platform.</p>
            <div className="actions">
              <Link href="/feed" className="button-link">Enter TRYAMM</Link>
              <Link href="/stubbs-ai" className="button-link secondary">Talk to Stubbs AI</Link>
              <Link href="/holoforge" className="button-link secondary">Open HoloForge</Link>
              <Link href="/games" className="button-link secondary">Play Games</Link>
            </div>
            <div className="status-strip" aria-label="Platform status highlights">
              <span>Stubbs AI</span><span>Googolplex Memory</span><span>Quantum Lag Buster</span><span>Guardian</span>
            </div>
          </div>
          <div className="hero-visual">
            <img className="hero-mark" src="/icons/tryamm-judah-icon-1024.png" alt="TRYAMM Lion of Judah holographic emblem" />
            <div className="holo-orbit" aria-hidden="true" />
          </div>
        </section>

        <section className="journey-grid" aria-labelledby="journeys-heading">
          <div className="section-heading">
            <p className="eyebrow">START HERE</p>
            <h2 id="journeys-heading">Create, play, shop, book and get paid</h2>
            <p>Creators can perform, build and earn. Players can enter Living Worlds. Customers can discover, book, buy and return to a remembered history.</p>
          </div>
          <div className="journey-cards">
            <article><h3>Create & Go LIVE</h3><p>Feed, LIVE rooms, PK battles, chat, gifts, coins, creator profiles and HoloForge creation.</p><Link href="/live" className="button-link">Enter Creator Mode</Link></article>
            <article><h3>Play Games & Living Worlds</h3><p>Sports, racing, fighting, multiplayer crews, immersive worlds, controller support and HoloForge game assets.</p><Link href="/games" className="button-link">Enter Games</Link></article>
            <article><h3>Shop, Book & Pay</h3><p>Discover products and verified services, book or order, pass ComplianceOS when needed and pay through the Money Engine.</p><Link href="/marketplace" className="button-link">Explore Marketplace</Link></article>
          </div>
        </section>

        <section className="flow-section" aria-labelledby="creator-flow-heading">
          <div><p className="eyebrow">CREATOR ECONOMY</p><h2 id="creator-flow-heading">Go LIVE. Create. Sell. Get paid.</h2></div>
          <div className="flow-line" role="list">{['Splash','Home','Feed','LIVE','PK','Chat','Gifts/Coins','HoloForge','Creator Profile','Marketplace','Money Engine'].map((item,index)=><span role="listitem" key={item}>{index+1}. {item}</span>)}</div>
        </section>

        <section className="flow-section service-flow" aria-labelledby="service-flow-heading">
          <div><p className="eyebrow">CUSTOMER + SERVICES</p><h2 id="service-flow-heading">Ask Stubbs AI. Find it. Book it. Pay safely.</h2></div>
          <div className="flow-line" role="list">{['Sign in','Home','Stubbs AI','Choose Service','Discovery','Booking/Order','ComplianceOS','Payment','Ledger','Confirmation','Notifications','History'].map((item,index)=><span role="listitem" key={item}>{index+1}. {item}</span>)}</div>
        </section>

        <section className="world-grid" aria-labelledby="systems-heading">
          <div className="section-heading"><p className="eyebrow">THE TRYAMM ECOSYSTEM</p><h2 id="systems-heading">Everything connected through Stubbs AI</h2></div>
          <div className="cards">{systems.map(([title,description,href])=><article key={title}><h3>{title}</h3><p>{description}</p><Link className="card-link" href={href}>Open →</Link></article>)}</div>
        </section>

        <section className="trust-grid" aria-labelledby="trust-heading">
          <div className="section-heading"><p className="eyebrow">BUILT INTO THE PLATFORM</p><h2 id="trust-heading">Access, memory, safety and proof</h2></div>
          <div className="trust-cards">{trust.map(([title,description])=><article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>
      </main>

      <footer>© 2026 TRYAMM • Stubbs AI • Accessibility-first • Multilingual • Creator + Commerce + Games + Worlds</footer>
    </>
  );
}
