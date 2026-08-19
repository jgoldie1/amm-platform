'use client';

import { useState } from 'react';
import JudahSplash from '@/components/JudahSplash';

const primaryJourneys = [
  {
    title: 'Create & Go LIVE',
    description: 'Feed, LIVE rooms, PK battles, chat, gifts, coins, creator profiles and HoloForge creation.',
    action: 'Enter Creator Mode',
  },
  {
    title: 'Shop, Book & Pay',
    description: 'Discover products and verified services, book or order, pass ComplianceOS when needed and pay through the Money Engine.',
    action: 'Explore Marketplace',
  },
];

const systems = [
  ['Stubbs AI / HoloGPT', 'Your intelligent command layer for search, creation, translation, memory, planning and navigation.'],
  ['HoloForge', 'Generate creator media, ads, avatars, 3D assets, marketplace content, game/world assets and manufacturing-ready drafts.'],
  ['Feed + LIVE + PK', 'Short-form discovery, live broadcasts, multi-guest rooms, PK competitions, chat, gifts and replay.'],
  ['Marketplace + Services', 'Products, creators, vendors and regulated-service discovery with provider verification and safe checkout.'],
  ['Money Engine', 'Platform fees, creator earnings, provider payouts, gift revenue, refunds, holds and transaction history.'],
  ['Middleverse Call Center', 'AI-assisted customer service, scheduling, dispatch, multilingual calls and escalation to qualified professionals.'],
  ['PropertyVerse', 'Listings, rentals, property discovery, digital tours and real-estate workflows with compliance gates.'],
  ['MobilityOS', 'EV rides, vehicle sharing, drones, robots, aircraft, marine mobility and accessible dispatch planning.'],
  ['Living Worlds', 'Connected games, sports, multiplayer worlds, persistent missions and immersive entertainment.'],
  ['StarVerse', 'Auditions, talent discovery, performance, fan engagement and creator monetization.'],
  ['HoloMusic', 'Recording, performance, distribution, 64-track workflows and spatial/holographic music experiences.'],
  ['SpaceOS', 'Spacecraft, mission simulation, planetary travel, digital twins and safety-gated manufacturing workflows.'],
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
          <span>Stubbs AI • Creator Economy • Commerce • Worlds</span>
        </div>
        <nav className="topnav" aria-label="Primary">
          <a href="#live">LIVE</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#systems">Worlds</a>
          <a href="#trust">Access</a>
        </nav>
        <button type="button" className="enter">Sign in</button>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ONE APP • CREATE • CONNECT • EARN • BUILD</p>
            <h1>Your worlds. One command nexus.</h1>
            <p>
              TRYAMM connects social video, LIVE/PK, AI creation, shopping, services, payments, mobility,
              games, music, property and SpaceOS through Stubbs AI—with accessibility, multilingual support,
              memory, compliance and proof built into the platform.
            </p>
            <div className="actions">
              <button type="button">Enter TRYAMM</button>
              <button type="button" className="secondary">Talk to Stubbs AI</button>
              <button type="button" className="secondary">Open HoloForge</button>
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
            <h2 id="journeys-heading">Two ways into TRYAMM</h2>
            <p>Creators can perform, create and earn. Customers can discover, book, buy and return to a remembered history.</p>
          </div>
          <div className="journey-cards">
            {primaryJourneys.map((journey) => (
              <article key={journey.title}>
                <h3>{journey.title}</h3>
                <p>{journey.description}</p>
                <button type="button">{journey.action}</button>
              </article>
            ))}
          </div>
        </section>

        <section id="live" className="flow-section" aria-labelledby="creator-flow-heading">
          <div>
            <p className="eyebrow">CREATOR ECONOMY</p>
            <h2 id="creator-flow-heading">Go LIVE. Create. Sell. Get paid.</h2>
          </div>
          <div className="flow-line" role="list" aria-label="Creator journey">
            {['Splash', 'Home', 'Feed', 'LIVE', 'PK', 'Chat', 'Gifts/Coins', 'HoloForge', 'Creator Profile', 'Marketplace', 'Money Engine'].map((item, index) => (
              <span role="listitem" key={item}>{index + 1}. {item}</span>
            ))}
          </div>
        </section>

        <section id="marketplace" className="flow-section service-flow" aria-labelledby="service-flow-heading">
          <div>
            <p className="eyebrow">CUSTOMER + SERVICES</p>
            <h2 id="service-flow-heading">Ask Stubbs AI. Find it. Book it. Pay safely.</h2>
          </div>
          <div className="flow-line" role="list" aria-label="Customer journey">
            {['Sign in', 'Home', 'Stubbs AI', 'Choose Service', 'Discovery', 'Booking/Order', 'ComplianceOS', 'Payment', 'Ledger', 'Confirmation', 'Notifications', 'History'].map((item, index) => (
              <span role="listitem" key={item}>{index + 1}. {item}</span>
            ))}
          </div>
        </section>

        <section id="systems" className="world-grid" aria-labelledby="systems-heading">
          <div className="section-heading">
            <p className="eyebrow">THE TRYAMM ECOSYSTEM</p>
            <h2 id="systems-heading">Everything connected through Stubbs AI</h2>
          </div>
          <div className="cards">
            {systems.map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
                <button type="button" className="card-link">Open →</button>
              </article>
            ))}
          </div>
        </section>

        <section id="trust" className="trust-grid" aria-labelledby="trust-heading">
          <div className="section-heading">
            <p className="eyebrow">BUILT INTO THE PLATFORM</p>
            <h2 id="trust-heading">Access, memory, safety and proof</h2>
          </div>
          <div className="trust-cards">
            {trust.map(([title, description]) => (
              <article key={title}><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        © 2026 TRYAMM • Stubbs AI • Accessibility-first • Multilingual • Creator + Commerce + Worlds
      </footer>
    </>
  );
}
